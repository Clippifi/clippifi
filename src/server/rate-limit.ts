import "server-only";
import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/server/db";
import { rateLimit } from "@/server/db/schema";

// A fixed-window counter in the database, so the limit holds across every server
// instance. Returns whether this request is allowed and, if not, when to retry.
export async function hit(key: string, max: number, windowSeconds: number) {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const [row] = await db
    .insert(rateLimit)
    .values({ id: randomUUID(), key, count: 1, lastRequest: now })
    .onConflictDoUpdate({
      target: rateLimit.key,
      set: {
        count: sql`case when ${rateLimit.lastRequest} < ${windowStart} then 1 else ${rateLimit.count} + 1 end`,
        lastRequest: sql`case when ${rateLimit.lastRequest} < ${windowStart} then ${now} else ${rateLimit.lastRequest} end`,
      },
    })
    .returning({ count: rateLimit.count, lastRequest: rateLimit.lastRequest });
  const allowed = row.count <= max;
  const retryAfterSeconds = allowed ? 0 : Math.ceil((row.lastRequest + windowSeconds * 1000 - now) / 1000);
  return { allowed, retryAfterSeconds };
}
