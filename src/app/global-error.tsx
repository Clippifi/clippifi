"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

// Last-resort error screen for errors the rest of the app didn't catch. Reports the
// error to Sentry and offers a reload. It replaces the root layout, so it brings its
// own <html> and <body> and uses plain styles.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, system-ui, sans-serif", background: "#f5f5f7", color: "#252525" }}>
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ maxWidth: 380, textAlign: "center" }}>
            <h1 style={{ fontSize: 24, lineHeight: "30px", margin: "0 0 8px" }}>Something went wrong</h1>
            <p style={{ fontSize: 15, lineHeight: "22px", color: "#6e6e73", margin: "0 0 20px" }}>
              We&apos;ve been notified and are looking into it. Reload the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ height: 40, padding: "0 18px", border: 0, borderRadius: 12, background: "#252525", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
