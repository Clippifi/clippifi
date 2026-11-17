import * as Sentry from "@sentry/nextjs";

// Loads the Sentry config for whichever runtime is starting (see sentry.*.config.ts).
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") await import("./sentry.server.config");
  if (process.env.NEXT_RUNTIME === "edge") await import("./sentry.edge.config");
}

// Reports errors thrown while rendering pages and handling requests on the server.
export const onRequestError = Sentry.captureRequestError;
