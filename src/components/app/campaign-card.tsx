import Link from "next/link";
import { BudgetMeter } from "@/components/app/budget-meter";
import { CampaignBanner } from "@/components/app/campaign-banner";
import { PlatformIcons } from "@/components/app/platform-icons";
import { CheckCircle, Lightning, SealCheck, Timer, User } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { bestRateCents, easiestFirstPayoutViews, isAlmostFull, ratesDiffer } from "@/lib/campaign-math";
import { formatAge, formatCompact, formatUSD } from "@/lib/format";
import type { Campaign } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

// Brand mark until brands upload logos: a small gradient square from the brand's hue.
export function BrandMark({ hue, className }: { hue: number; className?: string }) {
  return (
    <span
      className={cn("size-5 shrink-0 rounded-md", className)}
      style={{ backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 40} 70% 45%))` }}
    />
  );
}

// The pay rate: a green chip with a little more presence than the chips around it.
// When platforms pay differently it shows the best one, marked "up to".
export function RateChip({ campaign, className }: { campaign: Campaign; className?: string }) {
  return (
    <Badge variant="success" className={cn("h-7 px-2.5 text-[14px] font-bold tabular-nums", className)}>
      <span>
        {ratesDiffer(campaign) && <span className="text-[11px] font-medium opacity-70">up to </span>}
        {formatUSD(bestRateCents(campaign))}
        <span className="font-medium opacity-60">/1K</span>
      </span>
    </Badge>
  );
}

// Brand, verified seal and how long the campaign has been live.
function BrandLine({ campaign, now }: { campaign: Campaign; now?: Date }) {
  return (
    <>
      <BrandMark hue={campaign.brand.hue} className="size-[18px]" />
      <span className="truncate font-medium text-foreground">{campaign.brand.name}</span>
      {campaign.brand.verified && <SealCheck className="size-4 shrink-0 text-info" aria-label="Verified brand" />}
      <span className="shrink-0 whitespace-nowrap">· {formatAge(campaign.launchedAt, now)}</span>
    </>
  );
}

// How many creators have joined.
function CreatorCount({ count, className }: { count: number; className?: string }) {
  return (
    <Badge className={cn("h-7 gap-0.5 bg-transparent px-1 text-[13px] text-muted-foreground tabular-nums", className)} aria-label={`${count} creators`}>
      <User />
      {count}
    </Badge>
  );
}

// Creators and the rate, side by side: the same on every campaign card.
function CreatorsAndRate({ campaign, creatorsClassName }: { campaign: Campaign; creatorsClassName?: string }) {
  return (
    <span className="flex min-w-0 items-center gap-1">
      <CreatorCount count={campaign.creators} className={creatorsClassName} />
      <RateChip campaign={campaign} />
    </span>
  );
}

// A campaign as creators see it on Discover and in their lists (DESIGN.md → Campaign card).
export function CampaignCard({ campaign, now, className }: { campaign: Campaign; now?: Date; className?: string }) {
  const paidFrom = easiestFirstPayoutViews(campaign);
  const almostFull = isAlmostFull(campaign);
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className={cn(
        "group @container relative flex flex-col overflow-hidden rounded-3xl bg-card outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <CampaignBanner banner={campaign.banner}>
        <Badge className="absolute top-3 left-3 bg-black/55 text-white backdrop-blur-sm">
          {campaign.joined ? (
            <>
              <CheckCircle /> Joined
            </>
          ) : (
            `Paid from ${formatCompact(paidFrom)} views`
          )}
        </Badge>
        {almostFull ? (
          <Badge className="absolute top-3 right-3 bg-white font-semibold text-[#a35b00]">
            <Timer /> Almost full
          </Badge>
        ) : (
          campaign.fastReview &&
          !campaign.joined && (
            <Badge variant="brand" className="absolute top-3 right-3 font-semibold">
              <Lightning /> Fast review
            </Badge>
          )
        )}
      </CampaignBanner>
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
          <BrandLine campaign={campaign} now={now} />
          <PlatformIcons platforms={campaign.platforms} className="ml-auto shrink-0" />
        </div>
        <h3 title={campaign.title} className="truncate text-[15px] leading-[22px] font-semibold tracking-[-0.01em]">
          {campaign.title}
        </h3>
        <BudgetMeter
          spentCents={campaign.spentCents}
          budgetCents={campaign.budgetCents}
          aside={<CreatorsAndRate campaign={campaign} creatorsClassName="hidden @[280px]:inline-flex" />}
        />
      </div>
    </Link>
  );
}

const TYPE_LABEL = { clipping: "Clipping", ugc: "UGC", sound: "Sound", logo: "Logo" } as const;

// The list version for phones: everything the main card shows, in less height.
export function CampaignRow({ campaign, now, className }: { campaign: Campaign; now?: Date; className?: string }) {
  const almostFull = isAlmostFull(campaign);
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className={cn(
        "flex flex-col gap-3 rounded-3xl bg-card p-4 outline-none transition-transform duration-150 ease-out focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.99]",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className="relative flex size-24 shrink-0 items-end justify-center overflow-hidden rounded-2xl"
          style={{ backgroundImage: `linear-gradient(135deg, ${campaign.banner.from}, ${campaign.banner.to})` }}
        >
          <span className="w-full bg-linear-to-t from-black/70 to-transparent pt-4 pb-1.5 text-center text-[12px] font-semibold text-white">
            {TYPE_LABEL[campaign.type]}
          </span>
        </span>
        <div className="flex min-h-24 min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <BrandLine campaign={campaign} now={now} />
          </div>
          <h3 className="line-clamp-2 text-[15px] leading-[21px] font-semibold tracking-[-0.01em]">{campaign.title}</h3>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-1">
            <PlatformIcons platforms={campaign.platforms} />
            {campaign.joined ? (
              <Badge variant="brand">
                <CheckCircle /> Joined
              </Badge>
            ) : almostFull ? (
              <Badge variant="warning">
                <Timer /> Almost full
              </Badge>
            ) : (
              campaign.fastReview && (
                <Badge variant="brand">
                  <Lightning /> Fast review
                </Badge>
              )
            )}
          </div>
        </div>
      </div>
      <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} aside={<CreatorsAndRate campaign={campaign} />} />
    </Link>
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-[22px] w-4/5" />
        <Skeleton className="h-7 w-full rounded-full" />
        <Skeleton className="h-2.5 w-full rounded-full" />
      </div>
    </div>
  );
}
