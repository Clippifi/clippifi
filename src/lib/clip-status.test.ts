import { describe, expect, it } from "vitest";
import { reviewHoursLeft } from "./clip-status";

describe("reviewHoursLeft", () => {
  const submitted = new Date("2026-11-20T10:00:00Z");
  const at = (iso: string) => new Date(iso);

  it("counts down the brand's 48 hours, rounding up", () => {
    expect(reviewHoursLeft(submitted, submitted)).toBe(48);
    expect(reviewHoursLeft(submitted, at("2026-11-21T05:00:00Z"))).toBe(29);
    expect(reviewHoursLeft(submitted, at("2026-11-22T09:30:00Z"))).toBe(1);
  });

  it("is 0 once the window has passed", () => {
    expect(reviewHoursLeft(submitted, at("2026-11-22T10:00:00Z"))).toBe(0);
    expect(reviewHoursLeft(submitted, at("2026-11-25T10:00:00Z"))).toBe(0);
  });
});
