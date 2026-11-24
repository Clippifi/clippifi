import { describe, expect, it } from "vitest";
import {
  formatAge,
  formatCompact,
  formatNGN,
  formatRate,
  formatRelative,
  formatUSD,
  formatUSDCompact,
  minutesLeftToSubmit,
  viewsToMinimum,
  earningsTier,
  hourIn,
} from "./format";

describe("money", () => {
  it("shows USD with two decimals from cents", () => {
    expect(formatUSD(123456)).toBe("$1,234.56");
    expect(formatUSD(0)).toBe("$0.00");
    expect(formatUSD(5)).toBe("$0.05");
  });

  it("compacts large budgets for cards", () => {
    expect(formatUSDCompact(150000)).toBe("$1.5K");
    expect(formatUSDCompact(400000)).toBe("$4K");
    expect(formatUSDCompact(95000)).toBe("$950");
    expect(formatUSDCompact(12345)).toBe("$123.45");
  });

  it("formats whole naira for withdrawal estimates", () => {
    expect(formatNGN(155087)).toBe("₦155,087");
  });

  it("formats rates per 1,000 views", () => {
    expect(formatRate(150)).toBe("$1.50 / 1K views");
    expect(formatRate(150, "short")).toBe("$1.50/1K");
  });
});

describe("counts and time", () => {
  it("compacts counts", () => {
    expect(formatCompact(12431)).toBe("12.4K");
    expect(formatCompact(950)).toBe("950");
  });

  it("shows recent times relatively", () => {
    const now = new Date("2026-11-17T12:00:00Z");
    expect(formatRelative(new Date("2026-11-17T11:57:00Z"), now)).toBe("3m ago");
    expect(formatRelative(new Date("2026-11-17T07:00:00Z"), now)).toBe("5h ago");
    expect(formatRelative(new Date("2026-11-15T12:00:00Z"), now)).toBe("2d ago");
  });

  it("shows short ages on cards", () => {
    const now = new Date("2026-11-17T12:00:00Z");
    expect(formatAge(new Date("2026-11-17T11:15:00Z"), now)).toBe("45m");
    expect(formatAge(new Date("2026-11-16T12:00:00Z"), now)).toBe("1d");
    expect(formatAge(new Date("2026-11-08T12:00:00Z"), now)).toBe("1w");
    expect(formatAge(new Date("2026-08-17T12:00:00Z"), now)).toBe("3mo");
  });

  it("counts down the 30-minute submit window", () => {
    const now = new Date("2026-11-17T12:00:00Z");
    expect(minutesLeftToSubmit(new Date("2026-11-17T11:48:00Z"), now)).toBe(18);
    expect(minutesLeftToSubmit(new Date("2026-11-17T11:20:00Z"), now)).toBe(0);
  });

  it("works out views to the first payout", () => {
    expect(viewsToMinimum(200, 100)).toBe(2000); // $2 minimum at $1/1K
    expect(viewsToMinimum(200, 70)).toBe(2858); // rounds up
  });
});

describe("earningsTier", () => {
  it("shows a band, never the exact amount", () => {
    expect(earningsTier(0)).toBe("Under $10");
    expect(earningsTier(999)).toBe("Under $10");
    expect(earningsTier(1000)).toBe("$10+");
    expect(earningsTier(41250)).toBe("$100+");
    expect(earningsTier(100000)).toBe("$1K+");
    expect(earningsTier(1_000_000)).toBe("$10K+");
  });
});

describe("hourIn", () => {
  it("reads the hour in the given time zone, not the server's", () => {
    const noonUtc = new Date("2026-11-24T11:30:00Z");
    expect(hourIn("UTC", noonUtc)).toBe(11);
    expect(hourIn("Africa/Lagos", noonUtc)).toBe(12); // Lagos is UTC+1
    expect(hourIn("Africa/Lagos", new Date("2026-11-24T23:30:00Z"))).toBe(0);
  });
});
