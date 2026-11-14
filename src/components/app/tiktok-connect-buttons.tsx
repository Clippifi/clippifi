"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TikTokIcon } from "@/components/app/platform-icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LINK_MESSAGE, LINK_RETURN_PATH, linkErrorMessage } from "@/lib/link-account";

const POPUP_NAME = "clippifi-connect";

function openCenteredPopup() {
  const width = 500;
  const height = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
  return window.open("", POPUP_NAME, `popup,width=${width},height=${height},left=${left},top=${top}`);
}

// Opens TikTok in a popup. When the user approves or cancels, the popup lands on
// /connect/done, which sends the result back and closes. If the browser blocks the
// popup, TikTok opens in this tab and returns straight to Connections.
export function ConnectTikTokButton({ label = "Connect TikTok" }: { label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function connect() {
    setBusy(true);
    // Open the window during the click so the browser doesn't block it.
    const popup = openCenteredPopup();
    const usePopup = Boolean(popup && !popup.closed);
    const returnTo = usePopup ? LINK_RETURN_PATH : "/c/connections";

    const { data, error } = await authClient.linkSocial({
      provider: "tiktok",
      callbackURL: returnTo,
      errorCallbackURL: returnTo,
      disableRedirect: true,
    });
    if (error || !data?.url) {
      popup?.close();
      toast.error(error?.message ?? "TikTok isn't available right now. Try again later.");
      setBusy(false);
      return;
    }

    // Always show TikTok's permission screen, even if this account approved Clippifi before.
    const authorizeUrl = new URL(data.url);
    authorizeUrl.searchParams.set("disable_auto_auth", "1");

    if (!popup || !usePopup) {
      window.location.href = authorizeUrl.toString();
      return;
    }
    popup.location.href = authorizeUrl.toString();
    popup.focus();

    // The result arrives by postMessage, or by BroadcastChannel if the browser cut
    // the popup's link to this window.
    const channel = "BroadcastChannel" in window ? new BroadcastChannel(LINK_MESSAGE) : null;
    let finished = false;
    const cleanUp = () => {
      window.removeEventListener("message", onWindowMessage);
      channel?.close();
      clearInterval(watch);
      clearTimeout(giveUp);
    };
    const handle = (data: unknown) => {
      const result = data as { type?: string; error?: string | null } | null;
      if (finished || result?.type !== LINK_MESSAGE) return;
      finished = true;
      cleanUp();
      setBusy(false);
      if (result.error) toast.error(linkErrorMessage(String(result.error)));
      else toast.success("TikTok connected.");
      router.refresh();
    };
    function onWindowMessage(event: MessageEvent) {
      if (event.origin === window.location.origin) handle(event.data);
    }
    window.addEventListener("message", onWindowMessage);
    if (channel) channel.onmessage = (event) => handle(event.data);

    // If the popup looks closed, re-enable the button but keep listening for a while:
    // a cut link can make an open popup look closed.
    const watch = setInterval(() => {
      if (popup.closed) setBusy(false);
    }, 500);
    const giveUp = setTimeout(cleanUp, 10 * 60 * 1000);
  }

  return (
    <Button onClick={connect} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : <TikTokIcon />}
      {label}
    </Button>
  );
}

export function DisconnectTikTokButton({ accountId }: { accountId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function disconnect() {
    setBusy(true);
    const { error } = await authClient.unlinkAccount({ accountId });
    setBusy(false);
    if (error) {
      toast.error(error.message ?? "Couldn't disconnect TikTok. Try again.");
      return;
    }
    toast.success("TikTok disconnected. We deleted its access tokens.");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={disconnect} disabled={busy}>
      {busy && <Loader2 className="animate-spin" />}
      Disconnect
    </Button>
  );
}
