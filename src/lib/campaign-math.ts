// Plain-money answers about a campaign, shared by Discover, the campaign page and (later)
// the engine's previews. Amounts are integer cents.

import { viewsToMinimum } from "@/lib/format";
import type { Platform, PlatformRate } from "@/lib/sample-data";

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

/** Share of the budget paid out, 0–100. Rounds down, so 100% only ever means nothing is left. */
export function budgetUsedPercent(c: Budget): number {
  return c.budgetCents > 0 ? Math.min(100, Math.floor((c.spentCents / c.budgetCents) * 100)) : 0;
}

/** Less than a quarter of the budget left: worth posting soon. */
export function isAlmostFull(c: Budget): boolean {
  return budgetLeftShare(c) < 0.25;
}

/** Easy to start: first payout before 2,000 views. */
export function isBeginnerFriendly(terms: Terms): boolean {
  return viewsToMinimum(terms.minPayoutCents, terms.rateCents) <= 2000;
}

type Rated = { platforms: Platform[]; rates: Partial<Record<Platform, PlatformRate>> };

/**
 * Clippifi's fee on the creator side: 10% of what the brand pays per view (FOUNDATION.md §4;
 * the brand pays its own 10% on top). In basis points.
 */
export const CREATOR_FEE_BPS = 1000;

/** What a creator keeps of an amount the brand pays, rounded down to whole cents. */
export function takeHomeCents(cents: number): number {
  return Math.floor((cents * (10_000 - CREATOR_FEE_BPS)) / 10_000);
}

/**
 * What a creator takes home from one clip with `views` verified views: the clip's earnings at the
 * brand's terms, then 10% off that total. Never multiply a rounded take-home rate instead; that
 * shorts creators (a $1.55 rate rounds to $1.39 per 1,000). The engine must use this rule too.
 */
export function takeHomeEarnings(views: number, grossTerms: Terms): number {
  return takeHomeCents(estimateClipEarnings(views, grossTerms));
}

/** A platform's terms as the creator sees them: every amount is take-home. */
export function creatorTerms(rate: PlatformRate): PlatformRate {
  return {
    rateCents: takeHomeCents(rate.rateCents),
    minPayoutCents: takeHomeCents(rate.minPayoutCents),
    maxPerClipCents: takeHomeCents(rate.maxPerClipCents),
  };
}

/**
 * The platforms a campaign pays on, in the campaign's order, with the creator's take-home
 * terms. Every creator screen reads rates through here, never `campaign.rates` directly.
 */
export function campaignRates(c: Rated): { platform: Platform; rate: PlatformRate }[] {
  return c.platforms.flatMap((platform) => {
    const rate = c.rates[platform];
    return rate ? [{ platform, rate: creatorTerms(rate) }] : [];
  });
}

/** One platform's take-home terms, or undefined when the campaign doesn't pay there. */
export function creatorRateFor(c: Rated, platform: Platform): PlatformRate | undefined {
  return campaignRates(c).find((r) => r.platform === platform)?.rate;
}

/** The highest rate on any platform. */
export function bestRateCents(c: Rated): number {
  return Math.max(0, ...campaignRates(c).map(({ rate }) => rate.rateCents));
}

/** True when platforms pay different rates, so a single number needs "up to". */
export function ratesDiffer(c: Rated): boolean {
  return new Set(campaignRates(c).map(({ rate }) => rate.rateCents)).size > 1;
}

/** Fewest views needed for a first payout, on the easiest platform. */
export function easiestFirstPayoutViews(c: Rated): number {
  const views = campaignRates(c).map(({ rate }) => viewsToMinimum(rate.minPayoutCents, rate.rateCents));
  return views.length > 0 ? Math.min(...views) : 0;
}

/** Beginner friendly on at least one platform. */
export function isCampaignBeginnerFriendly(c: Rated): boolean {
  return campaignRates(c).some(({ rate }) => isBeginnerFriendly(rate));
}

/** An honest line about how much of the pool is left. */
export function budgetMessage(c: Budget): string {
  const left = budgetLeftShare(c);
  if (left <= 0) return "The budget is used up.";
  if (left < 0.1) return "Almost gone, post today.";
  if (left < 0.25) return "Filling up fast, post soon.";
  if (left < 0.6) return "Good room left.";
  return "Plenty of room to join.";
}
