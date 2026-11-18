import "server-only";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isApprovedEmail, PRIVATE_BETA_PATH } from "@/server/access";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { session as sessionTable } from "@/server/db/schema";

/**
 * The signed-in, approved session, or a redirect. Use in server components and actions.
 * Approval is checked on every request, so removing someone from the allowlist cuts
 * them off at once: their sessions are deleted and they land on the private beta page.
 */
export async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (!(await isApprovedEmail(session.user.email))) {
    await db.delete(sessionTable).where(eq(sessionTable.userId, session.user.id));
    redirect(PRIVATE_BETA_PATH);
  }
  return session;
}
