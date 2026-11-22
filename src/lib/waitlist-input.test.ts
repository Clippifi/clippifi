import { describe, expect, it } from "vitest";
import { parseWaitlistForm } from "./waitlist-input";

const form = (fields: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(fields)) f.set(k, v);
  return f;
};

describe("parseWaitlistForm", () => {
  it("keeps the email lowercase, the name trimmed and the role", () => {
    expect(parseWaitlistForm(form({ email: " Ada@Example.com ", name: "  Ada ", role: "brand" }))).toEqual({
      ok: true,
      bot: false,
      email: "ada@example.com",
      name: "Ada",
      role: "brand",
    });
  });

  it("treats a missing role as a creator and an empty name as none", () => {
    expect(parseWaitlistForm(form({ email: "ada@example.com", name: "" }))).toMatchObject({ ok: true, role: "creator", name: null });
  });

  it("rejects a bad email and an unknown role", () => {
    expect(parseWaitlistForm(form({ email: "not-an-email" }))).toEqual({ ok: false, message: "Enter a valid email address." });
    expect(parseWaitlistForm(form({ email: "ada@example.com", role: "admin" }))).toEqual({ ok: false, message: "Choose creator or brand." });
  });

  it("flags bots that fill in the hidden field", () => {
    expect(parseWaitlistForm(form({ email: "x@example.com", company: "Acme" }))).toMatchObject({ ok: true, bot: true });
  });
});
