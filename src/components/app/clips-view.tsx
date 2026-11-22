"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { BrandMark } from "@/components/app/campaign-card";
import { ClipStatusChip } from "@/components/app/clip-status-chip";
import { EmptyState } from "@/components/app/empty-state";
import { Notice } from "@/components/app/notice";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/app/platform-icons";
import { ResponsiveDialog } from "@/components/app/responsive-dialog";
import { Clapperboard, Eye, Play } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CLIP_STATUS, reviewHoursLeft, type ClipStatus } from "@/lib/clip-status";
import { formatAge, formatCompact, formatDay, formatUSD } from "@/lib/format";
import { getSampleCampaign, type Clip } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const PLATFORM_ICON = { tiktok: TikTokIcon, instagram: InstagramIcon, youtube: YouTubeIcon } as const;

const FILTERS = [
  { value: "all", label: "All", statuses: null },
  { value: "action", label: "Needs you", statuses: ["clip_not_found", "reconnect_tiktok"] },
  { value: "earning", label: "Earning", statuses: ["earning"] },
  { value: "review", label: "In review", statuses: ["in_review", "under_review"] },
  { value: "ended", label: "Ended", statuses: ["finished", "rejected", "removed_early"] },
] as const satisfies readonly { value: string; label: string; statuses: readonly ClipStatus[] | null }[];

type Filter = (typeof FILTERS)[number]["value"];

const inFilter = (clip: Clip, filter: Filter) => {
  const { statuses } = FILTERS.find((f) => f.value === filter)!;
  return statuses === null || (statuses as readonly ClipStatus[]).includes(clip.status);
};

export function ClipsView({ clips, now }: { clips: Clip[]; now: Date }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const needYou = clips.filter((c) => inFilter(c, "action")).length;
  const shown = clips.filter((c) => inFilter(c, filter));
  const open = clips.find((c) => c.id === openId);

  return (
    <div className="flex flex-col gap-5">
      {needYou > 0 && filter !== "action" && (
        <Notice tone="warning" title={`${needYou} clip${needYou === 1 ? " needs" : "s need"} you`}>
          Fix {needYou === 1 ? "it" : "them"} to keep earning.{" "}
          <button type="button" onClick={() => setFilter("action")} className="font-semibold text-foreground underline underline-offset-4">
            Show me
          </button>
        </Notice>
      )}

      <div className="no-scrollbar relative -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList aria-label="Filter clips">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.value} value={f.value}>
                {f.label}
                <span data-count>{clips.filter((c) => inFilter(c, f.value)).length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {shown.length === 0 ? (
        <div className="rounded-card bg-card">
          <EmptyState icon={<Clapperboard />} title="Nothing here right now" description="Clips with this status will show up here." />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,380px),1fr))]">
          {shown.map((clip) => (
            <li key={clip.id} className="min-w-0">
              <ClipCard clip={clip} now={now} onOpen={() => setOpenId(clip.id)} />
            </li>
          ))}
        </ul>
      )}

      {open && <ClipSheet clip={open} now={now} onClose={() => setOpenId(null)} />}
    </div>
  );
}

function ClipCover({ clip, className }: { clip: Clip; className?: string }) {
  const Icon = PLATFORM_ICON[clip.platform];
  return (
    <span
      className={cn("relative flex shrink-0 items-center justify-center overflow-hidden rounded-inner text-white", className)}
      style={{ backgroundImage: `linear-gradient(160deg, hsl(${clip.coverHue} 55% 45%), hsl(${clip.coverHue + 40} 60% 20%))` }}
    >
      <Play className="size-6 opacity-90" />
      <span className="absolute top-1.5 left-1.5 flex size-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
        <Icon className="size-3.5" />
      </span>
    </span>
  );
}

function ClipCard({ clip, now, onOpen }: { clip: Clip; now: Date; onOpen: () => void }) {
  const campaign = getSampleCampaign(clip.campaignId);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full w-full gap-3 rounded-card bg-card p-3 text-left outline-none transition-transform duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]"
    >
      <ClipCover clip={clip} className="aspect-[3/4] w-[88px] self-start" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5 py-0.5">
        <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          {campaign && <BrandMark hue={campaign.brand.hue} className="size-[18px]" />}
          <span className="truncate font-medium text-foreground">{campaign?.brand.name}</span>
          <span className="shrink-0 whitespace-nowrap">· {formatAge(clip.postedAt, now)}</span>
        </span>
        <span className="line-clamp-2 text-[15px] leading-[21px] font-semibold tracking-[-0.01em]">{clip.title}</span>
        {clip.status === "in_review" && (
          <span className="text-[13px] text-muted-foreground">
            {reviewHoursLeft(clip.submittedAt, now) > 0
              ? `Brand decides within ${reviewHoursLeft(clip.submittedAt, now)}h`
              : "Being approved automatically"}
          </span>
        )}
        <span className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-1">
          <ClipStatusChip status={clip.status} />
          <span className="ml-auto flex shrink-0 items-center gap-2 tabular-nums">
            <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
              <Eye className="size-3.5" />
              {formatCompact(clip.views)}
            </span>
            <span
              title={clip.status === "in_review" ? "Earned so far, waiting for the brand's approval" : undefined}
              className={cn(
                "text-[15px] font-bold",
                clip.status === "in_review" ? "text-info" : clip.earnedCents > 0 ? "text-success" : "text-muted-foreground",
              )}
            >
              {formatUSD(clip.earnedCents)}
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}

function ClipSheet({ clip, now, onClose }: { clip: Clip; now: Date; onClose: () => void }) {
  const { explanation, action } = CLIP_STATUS[clip.status];
  const campaign = getSampleCampaign(clip.campaignId);
  const waiting = clip.status === "in_review";
  const hoursLeft = reviewHoursLeft(clip.submittedAt, now);
  const stats = [
    { label: "Views", value: formatCompact(clip.views) },
    { label: waiting ? "Waiting for approval" : "Earned", value: formatUSD(clip.earnedCents) },
    ...(waiting ? [{ label: "Brand decides within", value: hoursLeft > 0 ? `${hoursLeft} hours` : "Now (automatic)" }] : []),
    { label: "Keep public until", value: formatDay(clip.keepLiveUntil, "UTC") },
  ];
  return (
    <ResponsiveDialog
      open
      onOpenChange={(next) => !next && onClose()}
      title={clip.title}
      description={explanation}
      footer={
        <>
          <Button variant="secondary" asChild>
            <Link href={`/c/campaigns/${clip.campaignId}`}>View campaign</Link>
          </Button>
          {clip.status === "reconnect_tiktok" ? (
            <Button variant="brand" asChild>
              <Link href="/c/connections">
                <TikTokIcon />
                {action}
              </Link>
            </Button>
          ) : action ? (
            // SAMPLE: the real check arrives with the engine (E4).
            <Button onClick={() => toast("Sample screen", { description: "Clip checks arrive with the engine." })}>{action}</Button>
          ) : null}
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <ClipStatusChip status={clip.status} />
        {campaign && <span className="truncate text-[13px] text-muted-foreground">{campaign.title}</span>}
      </div>
      <dl className="grid grid-cols-3 divide-x divide-hairline rounded-inner border border-hairline">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col gap-0.5 px-3 py-3">
            <dd className="truncate text-[15px] leading-[22px] font-bold tabular-nums">{stat.value}</dd>
            <dt className="text-[12px] leading-4 text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </ResponsiveDialog>
  );
}
