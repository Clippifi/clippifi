// Who may use Clippifi during the private beta. A pure decision, so it can be tested;
// src/server/access.ts feeds it the real settings and the allowlist lookup.

export const BETA_MESSAGE = "Clippifi is in private beta. Join the waitlist and we'll invite you.";

/** PRIVATE_BETA is on unless it is exactly "false": a missing setting keeps the site locked. */
export function privateBetaOn(value: string | undefined): boolean {
  return value?.trim().toLowerCase() !== "false";
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** The reviewer's fixed sign-in code, only when it is a full 6-digit code. */
export function reviewerCode(value: string | undefined): string | undefined {
  const code = value?.trim();
  return code && /^\d{6}$/.test(code) ? code : undefined;
}

export function isAllowedEmail(input: {
  email: string;
  privateBeta: boolean;
  reviewerEmail?: string;
  production: boolean;
  onAllowlist: () => Promise<boolean>;
}): Promise<boolean> | boolean {
  if (!input.privateBeta) return true;
  const email = normalizeEmail(input.email);
  if (input.reviewerEmail && email === normalizeEmail(input.reviewerEmail)) return true;
  // Local test accounts (*@clippifi.test) work on developer machines, never in production.
  if (!input.production && email.endsWith("@clippifi.test")) return true;
  return input.onAllowlist();
}
