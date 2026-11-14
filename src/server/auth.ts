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
  hooks: {
    // TikTok can be linked from inside the app but never used to sign in.
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/social" && ctx.body?.provider === "tiktok") {
        throw new APIError("FORBIDDEN", { message: "Sign in with Google or an email code, then connect TikTok." });
      }
    }),
  },
  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: 600,
      allowedAttempts: 5,
      async sendVerificationOTP({ email, otp }) {
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
