import { describe, expect, it } from "vitest";
import { isAllowedEmail, normalizeEmail, privateBetaOn, reviewerCode } from "./access-rules";

const base = { privateBeta: true, reviewerEmail: "tiktok-review@clippifi.com", production: true, onAllowlist: async () => false };

describe("privateBetaOn", () => {
  it("stays on unless switched off on purpose", () => {
    expect(privateBetaOn(undefined)).toBe(true);
    expect(privateBetaOn("")).toBe(true);
    expect(privateBetaOn("true")).toBe(true);
    expect(privateBetaOn("no")).toBe(true);
    expect(privateBetaOn(" FALSE ")).toBe(false);
  });
});

describe("isAllowedEmail", () => {
  it("lets everyone in once the beta is off", async () => {
    expect(await isAllowedEmail({ ...base, privateBeta: false, email: "anyone@example.com" })).toBe(true);
  });

  it("checks the allowlist, ignoring case and spaces", async () => {
    let asked = "";
    const allowed = await isAllowedEmail({
      ...base,
      email: "  Ada@Example.com ",
      onAllowlist: async () => {
        asked = "yes";
        return true;
      },
    });
    expect(allowed).toBe(true);
    expect(asked).toBe("yes");
    expect(await isAllowedEmail({ ...base, email: "stranger@example.com" })).toBe(false);
    expect(normalizeEmail("  Ada@Example.com ")).toBe("ada@example.com");
  });

  it("always lets the reviewer in", async () => {
    expect(await isAllowedEmail({ ...base, email: "TikTok-Review@clippifi.com" })).toBe(true);
  });

  it("allows local test accounts only outside production", async () => {
    expect(await isAllowedEmail({ ...base, email: "me@clippifi.test" })).toBe(false);
    expect(await isAllowedEmail({ ...base, production: false, email: "me@clippifi.test" })).toBe(true);
  });
});

describe("reviewerCode", () => {
  it("accepts only a full 6-digit code", () => {
    expect(reviewerCode(" 482913 ")).toBe("482913");
    expect(reviewerCode("12345")).toBeUndefined();
    expect(reviewerCode("abcdef")).toBeUndefined();
    expect(reviewerCode(undefined)).toBeUndefined();
  });
});
