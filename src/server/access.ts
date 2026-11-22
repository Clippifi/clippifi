import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { betaAllowlist } from "@/server/db/schema";
import { isAllowedEmail, normalizeEmail, privateBetaOn, reviewerCode } from "@/lib/access-rules";

// The private beta switch. To launch publicly, set PRIVATE_BETA=false; nothing else changes.
// Missing or any other value keeps the site invite-only.
export const PRIVATE_BETA = privateBetaOn(process.env.PRIVATE_BETA);
export const PRIVATE_BETA_PATH = "/private-beta";

// The TikTok review team's account: approved automatically, signs in with a fixed code.
export const REVIEWER_EMAIL = process.env.REVIEWER_EMAIL?.trim().toLowerCase() || undefined;
export const REVIEWER_CODE = reviewerCode(process.env.REVIEWER_CODE);

/** Whether this email may sign up, sign in and use the app. */
export async function isApprovedEmail(email: string): Promise<boolean> {
  return isAllowedEmail({
    email,
    privateBeta: PRIVATE_BETA,
    reviewerEmail: REVIEWER_EMAIL,
    production: process.env.NODE_ENV === "production",
    onAllowlist: async () => {
      const [row] = await db
        .select({ email: betaAllowlist.email })
        .from(betaAllowlist)
        .where(eq(betaAllowlist.email, normalizeEmail(email)))
        .limit(1);
      return Boolean(row);
    },
  });
}
