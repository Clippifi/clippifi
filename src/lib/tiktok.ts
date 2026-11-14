// TikTok helpers. Video data comes only from TikTok's official Display API for the
// creator's own linked account (Login Kit OAuth: src/app/api/tiktok/{authorize,callback,
// refresh,videos}). See fetchMyTikTokVideos below.

const TIKTOK_URL_PATTERN = /tiktok\.com\/(?:@[\w.-]+\/video|v)\/(\d+)/;

export function extractTikTokVideoId(url: string): string | null {
  const match = url.match(TIKTOK_URL_PATTERN);
  return match ? match[1] : null;
}

/** Any recognizable TikTok link (full video URL or short share link), used to decide when to show TikTok-specific hints in the submit form. */
export function isTikTokLink(url: string): boolean {
  return /(?:^|\.|\/\/)tiktok\.com\//.test(url);
}

export type MyTikTokVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  shareUrl: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: number;
};

/**
 * Lists the connected creator's own TikTok videos via the official Display API
 * (src/app/api/tiktok/videos), used by TikTokVideoPicker. Needs the creator's OAuth
 * access token (see getValidSocialAccessToken in src/lib/socials.ts) and only returns
 * that account's own videos.
 */
export async function fetchMyTikTokVideos(
  accessToken: string,
  cursor?: number,
): Promise<{ videos: MyTikTokVideo[]; cursor: number; hasMore: boolean } | null> {
  try {
    const res = await fetch("/api/tiktok/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, ...(cursor ? { cursor } : {}) }),
    });
    if (!res.ok) return null;
    return (await res.json()) as { videos: MyTikTokVideo[]; cursor: number; hasMore: boolean };
  } catch {
    return null;
  }
}
