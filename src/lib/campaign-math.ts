// Plain-money answers about a campaign, shared by Discover, the campaign page and (later)
// the engine's previews. Amounts are integer cents.

import { viewsToMinimum } from "@/lib/format";

type Terms = { rateCents: number; minPayoutCents: number; maxPerClipCents: number };
type Budget = { budgetCents: number; spentCents: number };

/**
 * What one clip with `views` verified views would earn: nothing until it reaches the
 * campaign's minimum, then the full rate counted from zero, capped at the per-clip max.
 */
export function estimateClipEarnings(views: number, terms: Terms): number {
  if (views < viewsToMinimum(terms.minPayoutCents, terms.rateCents)) return 0;
  const raw = Math.floor((views * terms.rateCents) / 1000);
  return Math.min(raw, terms.maxPerClipCents);
}

/** Views at which a clip hits the per-clip cap (more views earn nothing extra). */
export function viewsToCap(terms: Terms): number {
  if (terms.rateCents <= 0) return 0;
  return Math.ceil((terms.maxPerClipCents * 1000) / terms.rateCents);
}

export function budgetLeftCents(c: Budget): number {
  return Math.max(0, c.budgetCents - c.spentCents);
}

/** Share of the budget still available, 0–1. */
export function budgetLeftShare(c: Budget): number {
  return c.budgetCents > 0 ? budgetLeftCents(c) / c.budgetCents : 0;
}

/** Less than a quarter of the budget left: worth posting soon. */
export function isAlmostFull(c: Budget): boolean {
  return budgetLeftShare(c) < 0.25;
}

/** Easy to start: first payout before 2,000 views. */
export function isBeginnerFriendly(terms: Terms): boolean {
  return viewsToMinimum(terms.minPayoutCents, terms.rateCents) <= 2000;
}
