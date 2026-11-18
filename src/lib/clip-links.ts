// Reads pasted clip links: each link gets its own answer, so one bad link never blocks the rest.

import { REJECTION_MESSAGE } from "@/lib/clip-status";
import type { Platform } from "@/lib/sample-data";

export type ClipLinkResult = { url: string; ok: true; platform: Platform } | { url: string; ok: false; reason: string };

const NOT_A_CLIP = "This doesn't look like a link to a clip.";

/** Which platform a clip link belongs to, or null. Hosts must match exactly. */
export function clipLinkPlatform(link: string): Platform | null {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase().replace(/^www\.|^m\./, "");
  const path = url.pathname;

  if (host === "vm.tiktok.com" || host === "vt.tiktok.com") return path.length > 1 ? "tiktok" : null;
  if (host === "tiktok.com") return /^\/@[^/]+\/video\/\d+/.test(path) || /^\/t\/[^/]+/.test(path) ? "tiktok" : null;
  if (host === "instagram.com") return /^\/(reel|reels|p)\/[^/]+/.test(path) ? "instagram" : null;
  if (host === "youtu.be") return path.length > 1 ? "youtube" : null;
  if (host === "youtube.com") return /^\/shorts\/[^/]+/.test(path) || (path === "/watch" && url.searchParams.has("v")) ? "youtube" : null;
  return null;
}

/** Checks everything pasted (one or many links, separated by spaces or new lines). */
export function checkClipLinks(text: string, accepted: Platform[]): ClipLinkResult[] {
  const seen = new Set<string>();
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((url) => {
      if (seen.has(url)) return { url, ok: false, reason: REJECTION_MESSAGE.duplicate_post };
      seen.add(url);
      const platform = clipLinkPlatform(url);
      if (!platform) return { url, ok: false, reason: NOT_A_CLIP };
      if (!accepted.includes(platform)) return { url, ok: false, reason: REJECTION_MESSAGE.unsupported_platform };
      return { url, ok: true, platform };
    });
}
