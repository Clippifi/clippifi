"use client";

import dynamic from "next/dynamic";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/app/platform-icons";
import { UserAvatar } from "@/components/app/user-avatar";
import { Eye, Lock, Medal } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCompact, formatUSD, formatUSDCompact } from "@/lib/format";
import type { Campaign, CampaignProof as Proof } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const CampaignViewsChart = dynamic(() => import("@/components/app/campaign-views-chart"), {
  ssr: false,
  loading: () => <Skeleton className="h-48 w-full rounded-inner" />,
});

const PLATFORM_ICON = { tiktok: TikTokIcon, instagram: InstagramIcon, youtube: YouTubeIcon } as const;
// Shown when a creator hasn't set a name on their account.
const DEFAULT_CREATOR_NAME = "Clippifi creator";
const MEDAL_COLOUR = ["text-[#d9a400]", "text-[#9aa3ad]", "text-[#b8743c]"];

export function CampaignSection({
  title,
  aside,
  children,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-card bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] leading-6 font-semibold tracking-[-0.01em]">{title}</h2>
        {aside && <p className="shrink-0 text-[13px] text-muted-foreground tabular-nums">{aside}</p>}
      </div>
      {children}
    </section>
  );
}

// Real clips and what they earned, shown before joining: proof the campaign pays.
export function TopClips({ clips }: { clips: Proof["topClips"] }) {
  return (
    <CampaignSection title="Top clips" aside="Sample clips">
      <ul className="no-scrollbar relative -mx-5 flex snap-x gap-2.5 overflow-x-auto scroll-px-5 px-5">
        {clips.map((clip) => {
          const Icon = PLATFORM_ICON[clip.platform];
          return (
            <li
              key={clip.id}
              className="relative flex aspect-[9/16] w-[132px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-inner p-2.5 text-white"
              style={{ backgroundImage: `linear-gradient(160deg, hsl(${clip.hue} 55% 42%), hsl(${clip.hue + 40} 60% 18%))` }}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
                <Icon className="size-3.5" />
              </span>
              <span className="flex flex-col gap-0.5 tabular-nums">
                <span className="flex items-center gap-1 text-[12px] font-medium text-white/85">
                  <Eye className="size-3.5" />
                  {formatCompact(clip.views)}
                </span>
                <span className="text-[17px] leading-5 font-bold">{formatUSD(clip.earnedCents)}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </CampaignSection>
  );
}

// The top three earners. The money is public; who earned it unlocks after joining.
export function TopClippers({ campaign, clippers, joined }: { campaign: Campaign; clippers: Proof["topClippers"]; joined: boolean }) {
  const average = campaign.creators > 0 ? Math.round(campaign.spentCents / campaign.creators) : 0;
  return (
    <CampaignSection title="Top clippers" aside={`${formatUSD(average)} average`}>
      <ol className="grid grid-cols-3 divide-x divide-hairline rounded-inner border border-hairline">
        {clippers.map((clipper, i) => (
          <li key={clipper.id} className="flex min-w-0 flex-col items-center gap-1.5 px-2 py-4 text-center">
            <span className="relative">
              <UserAvatar user={{ name: clipper.name ?? clipper.id }} className="size-12" />
              <span className="absolute -right-1.5 -bottom-1 flex size-6 items-center justify-center rounded-full bg-card shadow-[0_1px_3px_rgb(0_0_0/0.18)]">
                <Medal className={cn("size-4", MEDAL_COLOUR[i])} aria-label={`Rank ${i + 1}`} />
              </span>
            </span>
            {joined ? (
              <span className="mt-1 w-full truncate text-[13px] font-medium">{clipper.name ?? DEFAULT_CREATOR_NAME}</span>
            ) : (
              <span className="mt-1 flex items-center gap-1 text-[12px] text-muted-foreground">
                <Lock className="size-3" />
                Join to see
              </span>
            )}
            <span className="text-[16px] leading-5 font-bold text-success tabular-nums">{formatUSDCompact(clipper.earnedCents)}</span>
          </li>
        ))}
      </ol>
    </CampaignSection>
  );
}

export function CampaignViews({ proof }: { proof: Proof }) {
  return (
    <CampaignSection
      title={
        <>
          <span className="text-[26px] leading-8 font-bold tracking-[-0.025em] tabular-nums">{formatCompact(proof.totalViews)}</span>{" "}
          <span className="font-medium text-muted-foreground">views</span>
        </>
      }
      aside="Last 14 days"
    >
      <CampaignViewsChart data={proof.viewsByDay} />
    </CampaignSection>
  );
}

// "Will I actually get paid?" answered with the brand's track record.
export function BrandTrust({ campaign, brand }: { campaign: Campaign; brand: Proof["brand"] }) {
  const stats = [
    { value: `${brand.approvalPercent}%`, label: "Clips approved" },
    { value: `${brand.reviewHours}h`, label: "Average review" },
    { value: formatUSDCompact(brand.paidCents), label: "Paid to creators" },
  ];
  return (
    <CampaignSection title={`${campaign.brand.name}'s track record`}>
      <dl className="grid grid-cols-3 divide-x divide-hairline rounded-inner border border-hairline">
        {stats.map((stat) => (
          <div key={stat.label} className="flex min-w-0 flex-col gap-0.5 px-3 py-3.5">
            <dd className="text-[20px] leading-6 font-bold tracking-[-0.02em] tabular-nums">{stat.value}</dd>
            <dt className="text-[12px] leading-4 text-muted-foreground">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </CampaignSection>
  );
}
