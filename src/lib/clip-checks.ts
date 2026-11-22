// The checks a clip must pass, shown live while the creator picks it. Some can only be
// confirmed by the server on submit, so those say "later" instead of claiming a pass.

import type { ClipLinkResult } from "@/lib/clip-links";

export type ClipCheckState = "idle" | "pass" | "fail" | "later";
export type ClipCheck = { id: "account" | "fresh" | "unique" | "platform"; label: string; state: ClipCheckState; detail?: string };

const LABEL = {
  account: "Posted from your linked account",
  fresh: "Posted within the last 30 minutes",
  unique: "Not already submitted",
  platform: "On a platform this campaign accepts",
} as const;

const LATER = "Checked when you submit";

const check = (id: ClipCheck["id"], state: ClipCheckState, detail?: string): ClipCheck => ({ id, label: LABEL[id], state, detail });

/** Checks for a video picked from the creator's connected account. */
export function pickedVideoChecks(input: {
  picked: { minutesLeft: number; alreadySubmitted?: boolean } | null;
  tiktokConnected: boolean;
  campaignAcceptsTikTok: boolean;
}): ClipCheck[] {
  const { picked, tiktokConnected, campaignAcceptsTikTok } = input;
  const account = tiktokConnected ? (picked ? "pass" : "idle") : "fail";
  const platform = campaignAcceptsTikTok ? (picked ? "pass" : "idle") : "fail";
  return [
    check("account", account, tiktokConnected ? undefined : "Connect TikTok first"),
    check("platform", platform, campaignAcceptsTikTok ? undefined : "This campaign doesn't take TikTok clips"),
    picked
      ? check("fresh", picked.minutesLeft > 0 ? "pass" : "fail", picked.minutesLeft > 0 ? `${picked.minutesLeft} min left` : "Too late for this clip")
      : check("fresh", "idle"),
    picked ? check("unique", picked.alreadySubmitted ? "fail" : "pass") : check("unique", "idle"),
  ];
}

/** Checks for pasted links: only the platform can be known before the server looks them up. */
export function pastedLinkChecks(links: ClipLinkResult[]): ClipCheck[] {
  const anyGood = links.some((l) => l.ok);
  const waiting: ClipCheckState = anyGood ? "later" : "idle";
  const detail = anyGood ? LATER : undefined;
  return [
    check("account", waiting, detail),
    check("platform", links.length === 0 ? "idle" : anyGood ? "pass" : "fail"),
    check("fresh", waiting, detail),
    check("unique", waiting, detail),
  ];
}

/** A clip can be submitted only when nothing has failed. */
export const clipChecksPass = (checks: ClipCheck[]) => checks.every((c) => c.state === "pass" || c.state === "later");
