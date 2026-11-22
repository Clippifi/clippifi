"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { db } from "@/server/db";
import { waitlist } from "@/server/db/schema";
import { hit } from "@/server/rate-limit";
import { parseWaitlistForm } from "@/lib/waitlist-input";

export type WaitlistState = { status: "idle" | "joined" | "error"; message?: string };

async function clientIp() {
  const h = await headers();
  return (h.get("x-vercel-forwarded-for") ?? h.get("x-real-ip") ?? h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
}

// Adds someone to the waitlist. Always answers the same way whether or not they were
// already on it, so the form can't be used to find out who has signed up.
export async function joinWaitlist(_prev: WaitlistState, form: FormData): Promise<WaitlistState> {
  const input = parseWaitlistForm(form);
  if (!input.ok) return { status: "error", message: input.message };
  if (input.bot) return { status: "joined" }; // a bot: pretend it worked

  const { allowed } = await hit(`waitlist-ip:${await clientIp()}`, 10, 60 * 60);
  if (!allowed) return { status: "error", message: "Too many tries. Please try again in an hour." };

  await db
    .insert(waitlist)
    .values({ id: randomUUID(), email: input.email, name: input.name, role: input.role })
    .onConflictDoNothing({ target: waitlist.email });
  return { status: "joined" };
}
