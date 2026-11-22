import { z } from "zod";

// What the waitlist form sends, checked before anything is stored.

export const WAITLIST_ROLES = ["creator", "brand"] as const;
export type WaitlistRole = (typeof WAITLIST_ROLES)[number];

const schema = z.object({
  email: z.email().max(254),
  name: z.string().trim().max(80).optional(),
  role: z.enum(WAITLIST_ROLES),
  // A field people never see; bots fill it in.
  company: z.string().max(0).optional(),
});

export type WaitlistInput =
  | { ok: true; bot: boolean; email: string; name: string | null; role: WaitlistRole }
  | { ok: false; message: string };

export function parseWaitlistForm(form: FormData): WaitlistInput {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const company = text("company");
  if (company) return { ok: true, bot: true, email: "", name: null, role: "creator" };
  const parsed = schema.safeParse({
    email: text("email").toLowerCase(),
    name: text("name") || undefined,
    role: text("role") || "creator",
  });
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path[0];
    return { ok: false, message: field === "role" ? "Choose creator or brand." : "Enter a valid email address." };
  }
  return { ok: true, bot: false, email: parsed.data.email, name: parsed.data.name || null, role: parsed.data.role };
}
