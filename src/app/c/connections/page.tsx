import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Heart, Video } from "@/components/icons";
import { EmptyState } from "@/components/app/empty-state";
import { IconTile } from "@/components/app/icon-tile";
import { Notice } from "@/components/app/notice";
import { PageHeader } from "@/components/app/page-header";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/app/platform-icons";
import { ConnectTikTokButton, DisconnectTikTokButton } from "@/components/app/tiktok-connect-buttons";
import { UserAvatar } from "@/components/app/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { linkErrorMessage } from "@/lib/link-account";
import { requireSession } from "@/server/session";
import { getTikTokAccount, getTikTokOverview, type TikTokVideo } from "@/server/tiktok";

export const metadata: Metadata = { title: "Connections — Clippifi" };

export default async function ConnectionsPage({ searchParams }: PageProps<"/c/connections">) {
  const { user } = await requireSession();
  const { error } = await searchParams;
  const errorMessage = typeof error === "string" ? linkErrorMessage(error) : null;

  const tiktok = await getTikTokAccount(user.id);
  const overview = tiktok ? await getTikTokOverview(user.id, tiktok.id) : null;
  const connected = Boolean(tiktok && overview && !overview.needsReconnect);

  return (
    <>
      <PageHeader
        title="Connections"
        description="Link the accounts you post from. We only read your profile and videos; we never post for you."
      />

      {errorMessage && <Notice tone="danger">{errorMessage}</Notice>}

      <div className="grid gap-4 lg:grid-cols-3">
        <PlatformCard
          name="TikTok"
          tile={<IconTile className="bg-[#161616] text-white"><TikTokIcon /></IconTile>}
          status={
            connected ? <Badge variant="success">Connected</Badge>
            : tiktok ? <Badge variant="warning">Needs reconnecting</Badge>
            : <Badge>Not connected</Badge>
          }
        >
          {!tiktok && (
            <>
              <p className="text-small leading-5 text-muted-foreground">
                Connect the account you post from so we can confirm your clips and count their views. We only ask for
                your basic profile and video list.
              </p>
              <ConnectTikTokButton className="w-full" />
            </>
          )}
          {tiktok && overview?.needsReconnect && (
            <>
              <p className="text-small leading-5 text-muted-foreground">
                Your TikTok connection expired. Reconnect so we can keep counting your views.
              </p>
              <div className="flex gap-2">
                <ConnectTikTokButton label="Reconnect" className="flex-1" />
                <DisconnectTikTokButton accountId={tiktok.id} />
              </div>
            </>
          )}
          {tiktok && overview && !overview.needsReconnect && (
            <>
              <div className="flex items-center gap-3 rounded-inner bg-muted p-3">
                <UserAvatar
                  user={{ name: overview.profile.displayName, image: overview.profile.avatarUrl, email: tiktok.id }}
                  className="size-10"
                />
                <div className="min-w-0">
                  <p className="truncate text-body font-semibold">{overview.profile.displayName}</p>
                  <p className="text-caption text-muted-foreground">
                    Connected {tiktok.linkedAt.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <DisconnectTikTokButton accountId={tiktok.id} />
            </>
          )}
        </PlatformCard>

        <PlatformCard
          name="Instagram"
          tile={<IconTile className="bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white"><InstagramIcon /></IconTile>}
          status={<Badge>Coming soon</Badge>}
        >
          <p className="text-small leading-5 text-muted-foreground">Instagram Reels campaigns are next on our list.</p>
          <Button variant="secondary" disabled className="w-full">
            Connect Instagram
          </Button>
        </PlatformCard>

        <PlatformCard
          name="YouTube"
          tile={<IconTile className="bg-[#ff0033] text-white"><YouTubeIcon /></IconTile>}
          status={<Badge>Coming soon</Badge>}
        >
          <p className="text-small leading-5 text-muted-foreground">YouTube Shorts campaigns will follow Instagram.</p>
          <Button variant="secondary" disabled className="w-full">
            Connect YouTube
          </Button>
        </PlatformCard>
      </div>

      {tiktok && overview && !overview.needsReconnect && <RecentVideos videos={overview.videos} />}
    </>
  );
}

// One platform: filled tile, name and status chip, then its content and action.
// A raised surface on the page; no outline (DESIGN.md → Surfaces, not borders).
function PlatformCard({
  name,
  tile,
  status,
  children,
}: {
  name: string;
  tile: React.ReactNode;
  status: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-card bg-card p-5">
      <div className="flex items-center gap-3">
        {tile}
        <div className="min-w-0 flex-1">
          <h2 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">{name}</h2>
        </div>
        {status}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-4">{children}</div>
    </section>
  );
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function timeAgo(date: Date) {
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 60) return `${Math.max(minutes, 0)}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function RecentVideos({ videos }: { videos: TikTokVideo[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold tracking-[-0.02em]">Your recent TikTok videos</h2>
        <p className="text-small leading-5 text-muted-foreground">
          You&apos;ll pick from these when you submit a clip to a campaign.
        </p>
      </div>
      {videos.length === 0 ? (
        <div className="rounded-card bg-card">
          <EmptyState
            icon={<Video />}
            title="No public videos yet"
            description="Post on TikTok and your videos will show up here."
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((video) => (
            // Image-first card: the cover fills it; a gradient keeps the text readable.
            <a
              key={video.id}
              href={video.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[9/16] overflow-hidden rounded-inner bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {video.coverImageUrl && (
                <Image
                  src={video.coverImageUrl}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, 50vw"
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  unoptimized
                />
              )}
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/0" />
              <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2 py-0.5 text-fine font-medium text-white backdrop-blur-sm">
                {timeAgo(video.createdAt)}
              </span>
              <span className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-3 text-white">
                <span className="line-clamp-2 text-caption leading-[18px] font-medium">{video.title}</span>
                <span className="flex items-center gap-3 text-fine text-white/80 tabular-nums">
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {compact.format(video.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" />
                    {compact.format(video.likeCount)}
                  </span>
                </span>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
