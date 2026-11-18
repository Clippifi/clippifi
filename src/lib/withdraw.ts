// Withdrawal rules shown to creators before they confirm (plan → Withdrawal state machine).
// Amounts are integer cents (USD) and whole naira.

export const MIN_WITHDRAWAL_CENTS = 1000; // $10
export const DAILY_LIMIT_CENTS = 100_000; // $1,000 per day
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
  | { reason: "account_waiting"; until: Date }
  | { reason: "below_minimum" }
  | { reason: "over_balance" }
  | { reason: "over_daily_limit"; leftTodayCents: number };

/** The one thing stopping this withdrawal, or null when it can go ahead. */
export function withdrawBlock(input: {
  amountCents: number;
  availableCents: number;
  withdrawnTodayCents: number;
  account: { withdrawalsFrom: Date } | null;
  now: Date;
}): WithdrawBlock | null {
  const { amountCents, availableCents, withdrawnTodayCents, account, now } = input;
  if (!account) return { reason: "no_account" };
  if (account.withdrawalsFrom.getTime() > now.getTime()) return { reason: "account_waiting", until: account.withdrawalsFrom };
  if (amountCents < MIN_WITHDRAWAL_CENTS) return { reason: "below_minimum" };
  if (amountCents > availableCents) return { reason: "over_balance" };
  const leftTodayCents = Math.max(0, DAILY_LIMIT_CENTS - withdrawnTodayCents);
  if (amountCents > leftTodayCents) return { reason: "over_daily_limit", leftTodayCents };
  return null;
}
