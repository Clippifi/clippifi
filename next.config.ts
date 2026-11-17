import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs/config";

// Security headers on every response. The CSP allows only our own scripts and styles
// (Next.js needs inline ones), images from anywhere over HTTPS (TikTok covers and
// avatars), and no embedding of our pages by other sites.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Sentry receives browser errors and replays (a worker runs replay compression).
  `connect-src 'self' https://*.sentry.io${isDev ? " ws:" : ""}`,
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Embedded Postgres for local dev ships its own WASM; load it from node_modules as-is.
  serverExternalPackages: ["@electric-sql/pglite"],
  async redirects() {
    // Sign-up and sign-in are one page now.
    return [{ source: "/signup", destination: "/login", permanent: true }];
  },
};

// Uploads source maps so production stack traces in Sentry are readable. Needs
// SENTRY_AUTH_TOKEN at build time; without it the build still works, unreadable traces aside.
export default withSentryConfig(nextConfig, {
  org: "clippifi",
  project: "clippifi-web",
  silent: !process.env.CI,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
});
