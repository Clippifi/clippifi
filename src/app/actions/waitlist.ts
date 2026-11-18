"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/server/db";
import { waitlist } from "@/server/db/schema";
import { hit } from "@/server/rate-limit";

export type WaitlistState = { status: "idle" | "joined" | "error"; message?: string };

const schema = z.object({
  email: z.email().max(254),
  name: z.string().trim().max(80).optional(),
  // A field people never see; bots fill it in.
  company: z.string().max(0).optional(),
});

async function clientIp() {
  const h = await headers();
  return (h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
}

// Adds someone to the waitlist. Always answers the same way whether or not they were
// already on it, so the form can't be used to find out who has signed up.
export async function joinWaitlist(_prev: WaitlistState, form: FormData): Promise<WaitlistState> {
  const parsed = schema.safeParse({
    email: String(form.get("email") ?? "").trim().toLowerCase(),
    name: String(form.get("name") ?? "") || undefined,
    company: String(form.get("company") ?? "") || undefined,
  });
  if (!parsed.success) return { status: "error", message: "Enter a valid email address." };
  if (parsed.data.company) return { status: "joined" }; // a bot: pretend it worked

  const { allowed } = await hit(`waitlist-ip:${await clientIp()}`, 10, 60 * 60);
  if (!allowed) return { status: "error", message: "Too many tries. Please try again in an hour." };

  await db
    .insert(waitlist)
    .values({ id: randomUUID(), email: parsed.data.email, name: parsed.data.name || null })
    .onConflictDoNothing({ target: waitlist.email });
  return { status: "joined" };
}
