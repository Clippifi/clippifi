import { describe, expect, it } from "vitest";
import {
  budgetLeftCents,
  budgetLeftShare,
  estimateClipEarnings,
  isAlmostFull,
  isBeginnerFriendly,
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
