"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LINK_MESSAGE } from "@/lib/link-account";

// TikTok sends the popup back here after the user approves or cancels. We tell the
// Clippifi tab that opened it (directly, and over a BroadcastChannel in case the
// browser cut the link to the opener), then close the popup.
export default function ConnectDonePage() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    const message = { type: LINK_MESSAGE, error };

    const opener = window.opener as Window | null;
    if (opener && !opener.closed) opener.postMessage(message, window.location.origin);
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(LINK_MESSAGE);
      channel.postMessage(message);
      channel.close();
    }

    window.close();
    // Some browsers refuse to close a window the page didn't open itself.
    const timer = setTimeout(() => setStuck(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center text-sm text-muted-foreground">
      {stuck ? (
        <>
          <p>All done. You can close this window.</p>
          <Button asChild variant="outline">
            <Link href="/c/connections">Go to Connections</Link>
          </Button>
        </>
      ) : (
        <p className="flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Finishing up…
        </p>
      )}
    </main>
  );
}
