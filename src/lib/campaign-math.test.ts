import { describe, expect, it } from "vitest";
import {
  bestRateCents,
  budgetLeftCents,
  budgetLeftShare,
  budgetMessage,
  budgetUsedPercent,
  campaignRates,
  creatorRateFor,
  easiestFirstPayoutViews,
  estimateClipEarnings,
  isAlmostFull,
  isBeginnerFriendly,
  isCampaignBeginnerFriendly,
  ratesDiffer,
  takeHomeCents,
  takeHomeEarnings,
  viewsToCap,
} from "./campaign-math";

// $1.50 per 1,000 views, $2 minimum payout (reached at 1,334 views), $100 max per clip.
const terms = { rateCents: 150, minPayoutCents: 200, maxPerClipCents: 10000 };

describe("estimateClipEarnings", () => {
  it("pays nothing below the minimum", () => {
    expect(estimateClipEarnings(1333, terms)).toBe(0);
  });

  it("counts from zero once the minimum is reached", () => {
    expect(estimateClipEarnings(1334, terms)).toBe(200); // $2.00, not just the views above 1,334
    expect(estimateClipEarnings(10000, terms)).toBe(1500); // 10K views ≈ $15.00
  });

  it("stops at the per-clip cap", () => {
    expect(estimateClipEarnings(1_000_000, terms)).toBe(10000);
    expect(viewsToCap(terms)).toBe(66667);
  });

  it("rounds down to whole cents", () => {
    expect(estimateClipEarnings(2001, { ...terms, minPayoutCents: 0 })).toBe(300); // 300.15 → 300
  });
});

describe("budget", () => {
  const c = { budgetCents: 400000, spentCents: 320000 };
  it("works out what's left", () => {
    expect(budgetLeftCents(c)).toBe(80000);
    expect(budgetLeftShare(c)).toBeCloseTo(0.2);
    expect(budgetLeftCents({ budgetCents: 100, spentCents: 150 })).toBe(0);
  });

  it("flags campaigns with under 25% left", () => {
    expect(isAlmostFull(c)).toBe(true);
    expect(isAlmostFull({ budgetCents: 400000, spentCents: 100000 })).toBe(false);
  });

  it("calls campaigns that pay before 2,000 views beginner friendly", () => {
    expect(isBeginnerFriendly(terms)).toBe(true);
    expect(isBeginnerFriendly({ ...terms, minPayoutCents: 500 })).toBe(false); // 3,334 views
  });
});

describe("per-platform rates", () => {
  const c = {
    platforms: ["tiktok", "instagram", "youtube"] as ("tiktok" | "instagram" | "youtube")[],
    rates: {
      tiktok: { rateCents: 100, minPayoutCents: 500, maxPerClipCents: 10000 }, // first payout at 5,000 views
      instagram: { rateCents: 150, minPayoutCents: 300, maxPerClipCents: 10000 }, // 2,000 views
      youtube: { rateCents: 50, minPayoutCents: 500, maxPerClipCents: 10000 }, // 10,000 views
    },
  };

  it("keeps each platform's own terms, in the campaign's order", () => {
    expect(campaignRates(c).map(({ platform }) => platform)).toEqual(["tiktok", "instagram", "youtube"]);
    expect(campaignRates({ ...c, rates: { tiktok: c.rates.tiktok } })).toHaveLength(1);
  });

  it("shows creators what they take home: the brand's terms minus the 10% creator fee", () => {
    expect(takeHomeCents(150)).toBe(135);
    expect(takeHomeCents(155)).toBe(139); // 139.5 rounds down
    expect(creatorRateFor(c, "instagram")).toEqual({ rateCents: 135, minPayoutCents: 270, maxPerClipCents: 9000 });
    expect(creatorRateFor(c, "youtube")).toEqual({ rateCents: 45, minPayoutCents: 450, maxPerClipCents: 9000 });
    expect(creatorRateFor({ ...c, platforms: ["tiktok"] }, "youtube")).toBeUndefined();
  });

  it("finds the best rate and whether platforms differ", () => {
    expect(bestRateCents(c)).toBe(135); // Instagram's $1.50, take-home
    expect(ratesDiffer(c)).toBe(true);
    expect(ratesDiffer({ platforms: ["tiktok"], rates: { tiktok: c.rates.tiktok } })).toBe(false);
  });

  it("uses the easiest platform for the first payout and beginner label", () => {
    expect(easiestFirstPayoutViews(c)).toBe(2000);
    expect(isCampaignBeginnerFriendly(c)).toBe(true);
    expect(isCampaignBeginnerFriendly({ platforms: ["youtube"], rates: { youtube: c.rates.youtube } })).toBe(false);
  });
});

describe("budgetUsedPercent", () => {
  it("rounds down so 100% only means the pool is empty", () => {
    expect(budgetUsedPercent({ budgetCents: 400000, spentCents: 146900 })).toBe(36);
    expect(budgetUsedPercent({ budgetCents: 10000, spentCents: 9999 })).toBe(99);
    expect(budgetUsedPercent({ budgetCents: 10000, spentCents: 12000 })).toBe(100);
    expect(budgetUsedPercent({ budgetCents: 0, spentCents: 0 })).toBe(0);
  });
});

describe("budgetMessage", () => {
  const left = (share: number) => budgetMessage({ budgetCents: 10000, spentCents: 10000 - share * 10000 });

  it("never says there's plenty of room when the pool is nearly gone", () => {
    expect(left(0.7)).toBe("Plenty of room to join.");
    expect(left(0.4)).toBe("Good room left.");
    expect(left(0.2)).toBe("Filling up fast, post soon.");
    expect(left(0.05)).toBe("Almost gone, post today.");
    expect(left(0)).toBe("The budget is used up.");
  });
});

describe("takeHomeEarnings", () => {
  // The creator fee comes off what the clip earned in total, never off a rounded per-1,000 rate:
  // rounding the rate first would short creators (a $1.55 rate rounds to $1.39 per 1,000).
  const gross = { rateCents: 155, minPayoutCents: 200, maxPerClipCents: 100_000 };

  it("takes 10% off the total the clip earned", () => {
    expect(takeHomeEarnings(100_000, gross)).toBe(13_950); // $155.00 gross -> $139.50, not $139.00
    expect(takeHomeEarnings(1_000, gross)).toBe(0); // under the minimum: nothing
  });

  it("caps at the brand's max per clip before the fee", () => {
    expect(takeHomeEarnings(10_000_000, { ...gross, maxPerClipCents: 10_000 })).toBe(9_000); // $100 cap -> $90
  });
});
