// Withdrawal rules shown to creators before they confirm (plan → Withdrawal state machine).
// Amounts are integer cents (USD) and whole naira.

// FOUNDATION.md §9 (D2): set in USD near ₦5,000 and ₦500,000; one payout a day.
export const MIN_WITHDRAWAL_CENTS = 500; // $5
export const DAILY_LIMIT_CENTS = 35_000; // $350 per day
export const PAYOUTS_PER_DAY = 1;
export const RATE_SPREAD = 0.015; // our quote is 1.5% under the reference rate

/** Estimated naira for a USD amount: amount × (rate − 1.5%) − transfer fee. Never below zero. */
export function nairaEstimate(amountCents: number, ngnPerUsd: number, feeNaira: number): number {
  const gross = Math.floor((amountCents / 100) * ngnPerUsd * (1 - RATE_SPREAD));
  return Math.max(0, gross - feeNaira);
}

/** "12.50" or "$12.50" typed by a person → cents, or null when it isn't an amount. */
export function parseAmountCents(text: string): number | null {
  const clean = text.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{0,2})?$/.test(clean)) return null;
  const [dollars, cents = ""] = clean.split(".");
  return Number(dollars) * 100 + Number(cents.padEnd(2, "0"));
}

export type WithdrawBlock =
  | { reason: "no_account" }
  | { reason: "needs_verification" }
  | { reason: "account_waiting"; until: Date }
  | { reason: "already_today" }
  | { reason: "below_minimum" }
  | { reason: "over_balance" }
  | { reason: "over_daily_limit" };

/**
 * The one thing stopping this withdrawal, or null when it can go ahead. Checked in the order
 * a creator would fix them: where to send it, who they are, when, then how much.
 */
export function withdrawBlock(input: {
  amountCents: number;
  availableCents: number;
  /** Payouts already requested today (UTC), whatever their status. */
  withdrawalsToday: number;
  /** Identity check (KYC, run by the payment provider) passed: required before the first payout. */
  identityVerified: boolean;
  account: { withdrawalsFrom: Date } | null;
  now: Date;
}): WithdrawBlock | null {
  const { amountCents, availableCents, withdrawalsToday, identityVerified, account, now } = input;
  if (!account) return { reason: "no_account" };
  if (!identityVerified) return { reason: "needs_verification" };
  if (account.withdrawalsFrom.getTime() > now.getTime()) return { reason: "account_waiting", until: account.withdrawalsFrom };
  if (withdrawalsToday >= PAYOUTS_PER_DAY) return { reason: "already_today" };
  if (amountCents < MIN_WITHDRAWAL_CENTS) return { reason: "below_minimum" };
  if (amountCents > availableCents) return { reason: "over_balance" };
  if (amountCents > DAILY_LIMIT_CENTS) return { reason: "over_daily_limit" };
  return null;
}
