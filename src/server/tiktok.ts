import "server-only";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { account } from "@/server/db/schema";

// Reads from TikTok's official Display API with the creator's own token
// (scopes user.info.basic and video.list). Better Auth decrypts the stored token
// and refreshes it when it has expired.

export type TikTokProfile = { openId: string; displayName: string; avatarUrl: string | null };
export type TikTokVideo = {
  id: string;
  title: string;
  coverImageUrl: string | null;
  shareUrl: string;
  createdAt: Date;
  durationSeconds: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
};

export async function getTikTokAccount(userId: string) {
  const [row] = await db
    .select({ id: account.id, openId: account.accountId, linkedAt: account.createdAt })
    .from(account)
    .where(and(eq(account.userId, userId), eq(account.providerId, "tiktok")))
    .limit(1);
  return row ?? null;
}

async function getAccessToken(userId: string, accountId: string) {
  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: { accountId, userId },
      headers: await headers(),
    });
    return accessToken ?? null;
  } catch {
    return null; // refresh failed: the creator needs to reconnect
  }
}

async function tiktokFetch<T>(token: string, path: string, init?: RequestInit): Promise<T | null> {
  const res = await fetch(`https://open.tiktokapis.com/v2${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

const VIDEO_FIELDS =
  "id,title,video_description,cover_image_url,share_url,create_time,duration,view_count,like_count,comment_count,share_count";

type RawVideo = {
  id: string;
  title?: string;
  video_description?: string;
  cover_image_url?: string;
  share_url?: string;
  create_time?: number;
  duration?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
};

/** The linked profile and recent videos, or `needsReconnect` when the token no longer works. */
export async function getTikTokOverview(userId: string, accountId: string) {
  const token = await getAccessToken(userId, accountId);
  if (!token) return { needsReconnect: true as const };

  const [profileRes, videosRes] = await Promise.all([
    tiktokFetch<{ data?: { user?: { open_id: string; display_name?: string; avatar_url?: string } } }>(
      token,
      "/user/info/?fields=open_id,display_name,avatar_url",
    ),
    tiktokFetch<{ data?: { videos?: RawVideo[] } }>(token, `/video/list/?fields=${VIDEO_FIELDS}`, {
      method: "POST",
      body: JSON.stringify({ max_count: 20 }),
    }),
  ]);
  const user = profileRes?.data?.user;
  if (!user) return { needsReconnect: true as const };

  const profile: TikTokProfile = {
    openId: user.open_id,
    displayName: user.display_name ?? "TikTok account",
    avatarUrl: user.avatar_url ?? null,
  };
  const videos: TikTokVideo[] = (videosRes?.data?.videos ?? []).map((v) => ({
    id: v.id,
    title: v.title || v.video_description || "Untitled video",
    coverImageUrl: v.cover_image_url ?? null,
    shareUrl: v.share_url ?? "",
    createdAt: new Date((v.create_time ?? 0) * 1000),
    durationSeconds: v.duration ?? 0,
    viewCount: v.view_count ?? 0,
    likeCount: v.like_count ?? 0,
    commentCount: v.comment_count ?? 0,
    shareCount: v.share_count ?? 0,
  }));
  return { needsReconnect: false as const, profile, videos };
}
