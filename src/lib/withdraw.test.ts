import { describe, expect, it } from "vitest";
import { nairaEstimate, parseAmountCents, withdrawBlock } from "./withdraw";

const now = new Date("2026-11-17T12:00:00Z");
const ready = { withdrawalsFrom: new Date("2026-11-01T00:00:00Z") };
const base = { amountCents: 5000, availableCents: 10500, withdrawalsToday: 0, identityVerified: true, account: ready, now };

describe("nairaEstimate", () => {
  it("takes 1.5% off the rate and the transfer fee out", () => {
    // $50 × ₦1,500 × 0.985 = ₦73,875, minus ₦50 fee
    expect(nairaEstimate(5000, 1500, 50)).toBe(73825);
  });
  it("never goes below zero", () => {
    expect(nairaEstimate(1, 1500, 50)).toBe(0);
  });
});

describe("parseAmountCents", () => {
  it("reads what people type", () => {
    expect(parseAmountCents("50")).toBe(5000);
    expect(parseAmountCents("$1,250.5")).toBe(125050);
    expect(parseAmountCents("0.07")).toBe(7);
  });
  it("rejects what isn't an amount", () => {
    expect(parseAmountCents("")).toBeNull();
    expect(parseAmountCents("12.345")).toBeNull();
    expect(parseAmountCents("-5")).toBeNull();
    expect(parseAmountCents("ten")).toBeNull();
  });
});

describe("withdrawBlock", () => {
  it("lets a normal withdrawal through", () => {
    expect(withdrawBlock(base)).toBeNull();
  });
  it("needs a payout account that has finished its 48-hour wait", () => {
    expect(withdrawBlock({ ...base, account: null })).toEqual({ reason: "no_account" });
    const until = new Date("2026-11-18T09:00:00Z");
    expect(withdrawBlock({ ...base, account: { withdrawalsFrom: until } })).toEqual({ reason: "account_waiting", until });
  });
  it("needs the identity check before any payout", () => {
    expect(withdrawBlock({ ...base, identityVerified: false })).toEqual({ reason: "needs_verification" });
    // A missing account is fixed first: it's the first thing the creator is asked for.
    expect(withdrawBlock({ ...base, identityVerified: false, account: null })).toEqual({ reason: "no_account" });
  });
  it("allows one payout a day", () => {
    expect(withdrawBlock({ ...base, withdrawalsToday: 1 })).toEqual({ reason: "already_today" });
  });
  it("applies the $5 minimum, the balance and the $350 daily limit", () => {
    expect(withdrawBlock({ ...base, amountCents: 499 })).toEqual({ reason: "below_minimum" });
    expect(withdrawBlock({ ...base, amountCents: 500 })).toBeNull();
    expect(withdrawBlock({ ...base, amountCents: 10501 })).toEqual({ reason: "over_balance" });
    expect(withdrawBlock({ ...base, availableCents: 500000, amountCents: 35000 })).toBeNull();
    expect(withdrawBlock({ ...base, availableCents: 500000, amountCents: 35001 })).toEqual({ reason: "over_daily_limit" });
  });
});
