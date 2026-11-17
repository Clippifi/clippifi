import * as Sentry from "@sentry/nextjs";

// Error tracking in the browser. Off until NEXT_PUBLIC_SENTRY_DSN is set.
// Session Replay records only sessions that hit an error, with every piece of text
// and media masked, so no personal data or money figures leave the browser.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
    enableLogs: true,
    sendDefaultPii: false,
    integrations: [Sentry.replayIntegration({ maskAllText: true, maskAllInputs: true, blockAllMedia: true })],
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
