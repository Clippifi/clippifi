import type { Metadata } from "next";
import Image from "next/image";
import { AlertCircle, Eye, Heart } from "@/components/icons";
import { PageHeader } from "@/components/app/page-header";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/app/platform-icons";
import { ConnectTikTokButton, DisconnectTikTokButton } from "@/components/app/tiktok-connect-buttons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <>
      <PageHeader
        title="Connections"
        description="Link the accounts you post from. We only read your profile and videos; we never post for you."
      />

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <PlatformMark className="bg-foreground text-background">
                <TikTokIcon className="size-5" />
              </PlatformMark>
              <div>
                <CardTitle>TikTok</CardTitle>
                <CardDescription>{tiktok ? "Connected" : "Not connected"}</CardDescription>
              </div>
            </div>
            {tiktok && overview && !overview.needsReconnect && (
              <CardAction>
                <Badge variant="secondary">Active</Badge>
              </CardAction>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {!tiktok && (
              <>
                <p className="text-sm text-muted-foreground">
                  Connecting lets us confirm the clips you submit are yours and count their views. We ask TikTok
                  only for your basic profile and your video list.
                </p>
                <ConnectTikTokButton />
              </>
            )}
            {tiktok && overview?.needsReconnect && (
              <>
                <p className="text-sm text-muted-foreground">
                  Your TikTok connection expired. Reconnect so we can keep counting your views.
                </p>
                <div className="flex gap-2">
                  <ConnectTikTokButton label="Reconnect TikTok" />
                  <DisconnectTikTokButton accountId={tiktok.id} />
                </div>
              </>
            )}
            {tiktok && overview && !overview.needsReconnect && (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {overview.profile.avatarUrl && <AvatarImage src={overview.profile.avatarUrl} alt="" />}
                    <AvatarFallback>{overview.profile.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{overview.profile.displayName}</p>
                    <p className="text-xs text-muted-foreground">
                      Connected {tiktok.linkedAt.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <DisconnectTikTokButton accountId={tiktok.id} />
              </>
            )}
          </CardContent>
        </Card>

        <ComingSoonCard name="Instagram" icon={<InstagramIcon className="size-5" />} className="bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-white" />
        <ComingSoonCard name="YouTube" icon={<YouTubeIcon className="size-5" />} className="bg-red-600 text-white" />
      </div>

      {tiktok && overview && !overview.needsReconnect && <RecentVideos videos={overview.videos} />}
    </>
  );
}

function PlatformMark({ className, children }: { className: string; children: React.ReactNode }) {
  return <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${className}`}>{children}</div>;
}

function ComingSoonCard({ name, icon, className }: { name: string; icon: React.ReactNode; className: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <PlatformMark className={className}>{icon}</PlatformMark>
          <div>
            <CardTitle>{name}</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" disabled>
          Connect {name}
        </Button>
      </CardContent>
    </Card>
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
      <div>
        <h2 className="text-lg font-semibold">Your recent TikTok videos</h2>
        <p className="text-sm text-muted-foreground">
          Read from your account with TikTok&apos;s official API. You&apos;ll pick from these when you submit a clip to
          a campaign.
        </p>
      </div>
      {videos.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No public videos yet. Post on TikTok and they&apos;ll show up here.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {videos.map((video) => (
            <a
              key={video.id}
              href={video.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[9/16] bg-muted">
                {video.coverImageUrl && (
                  <Image src={video.coverImageUrl} alt="" fill sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover" unoptimized />
                )}
                <span className="absolute left-2 top-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {timeAgo(video.createdAt)}
                </span>
              </div>
              <div className="flex flex-col gap-2 p-3">
                <p className="line-clamp-2 text-sm font-medium">{video.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="size-3.5" />
                    {compact.format(video.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="size-3.5" />
                    {compact.format(video.likeCount)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
