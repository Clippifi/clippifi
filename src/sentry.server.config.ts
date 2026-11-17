import * as Sentry from "@sentry/nextjs";

// Error tracking on the Node.js server. Off until NEXT_PUBLIC_SENTRY_DSN is set.
// No personal data: no IPs, cookies or request bodies (sendDefaultPii: false).
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    enableLogs: true,
    sendDefaultPii: false,
  });
}
