import "server-only";
import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import type { TiktokProfile } from "better-auth/social-providers";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema";
import { sendEmail } from "@/server/email";
import { eq } from "drizzle-orm";
import { BETA_MESSAGE, normalizeEmail } from "@/lib/access-rules";
import { isApprovedEmail, REVIEWER_CODE, REVIEWER_EMAIL } from "@/server/access";
import { hit } from "@/server/rate-limit";

// Read a setting with stray spaces from copy-pasting removed.
const env = (name: string) => process.env[name]?.trim() || undefined;

export const auth = betterAuth({
  // The site's address comes from BETTER_AUTH_URL; these other addresses may also sign in.
  trustedOrigins: ["https://clippifi.com", "https://www.clippifi.com", "https://clippifi.vercel.app"],
  database: drizzleAdapter(db, { provider: "pg", schema }),
  // Sign in: Google, or a 6-digit code sent by email. No passwords.
  // Each provider is enabled only once its keys are set.
  socialProviders: {
    ...(env("GOOGLE_CLIENT_ID") && {
      google: {
        clientId: env("GOOGLE_CLIENT_ID")!,
        clientSecret: env("GOOGLE_CLIENT_SECRET") ?? "",
      },
    }),
    // TikTok is only for linking an account from inside the app, never for signing in.
    // Scopes are exactly the ones the TikTok app is approved for.
    ...(env("TIKTOK_CLIENT_KEY") && {
      tiktok: {
        clientKey: env("TIKTOK_CLIENT_KEY")!,
        clientSecret: env("TIKTOK_CLIENT_SECRET") ?? "",
        disableSignUp: true,
        disableDefaultScope: true,
        scope: ["user.info.basic", "video.list"],
        async getUserInfo(token) {
          const res = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url", {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          });
          if (!res.ok) return null;
          const profile = (await res.json()) as TiktokProfile;
          const tiktokUser = profile.data?.user;
          if (!tiktokUser) return null;
          return {
            user: {
              // TikTok shares no email; this placeholder never replaces the user's real one.
              email: `${tiktokUser.open_id}@tiktok.clippifi.invalid`,
              name: tiktokUser.display_name ?? "",
              image: tiktokUser.avatar_url,
              emailVerified: false,
            },
            data: profile,
          };
        },
      },
    }),
  },
  account: {
    // Social tokens (TikTok access/refresh tokens) are encrypted at rest.
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      // Linking only happens for a signed-in user who clicked Connect. TikTok shares no
      // email, so it must be trusted or Better Auth refuses to link it.
      trustedProviders: ["google", "tiktok"],
      // TikTok has no email, so linking it to a signed-in user must allow a different one.
      allowDifferentEmails: true,
      // Email codes always work, so unlinking Google or TikTok can never lock anyone out.
      allowUnlinkingAll: true,
    },
  },
  // Limits are counted in the database so they hold across every server instance.
  // The tight limit is per email address (5 codes an hour, in the hook below): it stops
  // inbox spam and email costs. Per-IP limits stay loose because mobile networks put
  // many people behind one shared IP; they only stop a single machine flooding us.
  rateLimit: {
    enabled: true,
    storage: "database",
    window: 60,
    max: 300,
    customRules: {
      "/email-otp/send-verification-otp": { window: 60, max: 30 },
      "/sign-in/email-otp": { window: 60, max: 60 },
      "/sign-in/social": { window: 60, max: 60 },
    },
  },
  advanced: {
    // Vercel puts the visitor's real IP in these headers (clients can't forge them there).
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for", "x-real-ip", "x-forwarded-for"] },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // TikTok can be linked from inside the app but never used to sign in.
      if (ctx.path === "/sign-in/social" && ctx.body?.provider === "tiktok") {
        throw new APIError("FORBIDDEN", { message: "Sign in with Google or an email code, then connect TikTok." });
      }
      // At most 5 sign-in codes per email address per hour, whoever asks for them.
      if (ctx.path === "/email-otp/send-verification-otp" && typeof ctx.body?.email === "string") {
        const email = ctx.body.email.trim().toLowerCase();
        // Private beta: codes go only to approved emails, so nobody else can start an account.
        if (!(await isApprovedEmail(email))) {
          throw new APIError("FORBIDDEN", { message: BETA_MESSAGE, code: "PRIVATE_BETA" });
        }
        const { allowed, retryAfterSeconds } = await hit(`otp-email:${email}`, 5, 60 * 60);
        if (!allowed) {
          const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
          throw new APIError("TOO_MANY_REQUESTS", {
            message: `Too many codes sent to this email. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
          });
        }
      }
    }),
  },
  // Private beta, enforced where accounts and sessions are created, whatever the route
  // (email code, Google, or anything added later). Existing sessions are re-checked on
  // every request in requireSession().
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          if (!(await isApprovedEmail(newUser.email))) {
            throw new APIError("FORBIDDEN", { message: BETA_MESSAGE, code: "PRIVATE_BETA" });
          }
        },
      },
    },
    session: {
      create: {
        before: async (newSession) => {
          const [owner] = await db
            .select({ email: schema.user.email })
            .from(schema.user)
            .where(eq(schema.user.id, newSession.userId))
            .limit(1);
          if (!owner || !(await isApprovedEmail(owner.email))) {
            throw new APIError("FORBIDDEN", { message: BETA_MESSAGE, code: "PRIVATE_BETA" });
          }
        },
      },
    },
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      allowedAttempts: 5,
      // The TikTok review team can't read our emails, so their one account uses a fixed
      // code kept in REVIEWER_CODE. Everyone else gets a fresh random code (undefined → default).
      generateOTP: ({ email }) =>
        REVIEWER_EMAIL && REVIEWER_CODE && normalizeEmail(email) === REVIEWER_EMAIL ? REVIEWER_CODE : undefined,
      async sendVerificationOTP({ email, otp }) {
        if (REVIEWER_EMAIL && normalizeEmail(email) === REVIEWER_EMAIL) return; // nobody to email
        await sendEmail({
          to: email,
          subject: `${otp} is your Clippifi code`,
          text: `Your Clippifi sign-in code is ${otp}.\n\nIt expires in 10 minutes. If you didn't ask for it, you can ignore this email.`,
        });
      },
    }),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
