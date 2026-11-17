import "server-only";

// Local test accounts: in development only, mail to any @clippifi.test address is printed
// to the terminal instead of sent, so you can sign in as test creators and brands without
// real inboxes. Production never takes this path (NODE_ENV is "production" there).
const isLocalTestAddress = (to: string) =>
  process.env.NODE_ENV === "development" && to.trim().toLowerCase().endsWith("@clippifi.test");

// Sends transactional email through Resend's HTTP API. Without RESEND_API_KEY
// (local dev) the email is printed to the terminal instead.
export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey || isLocalTestAddress(to)) {
    console.info(`\n[email] to ${to}: ${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Clippifi <onboarding@resend.dev>",
      to,
      subject,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed (${res.status}): ${await res.text()}`);
}
