import Link from "next/link";
import { BudgetMeter } from "@/components/app/budget-meter";
import { CampaignBanner } from "@/components/app/campaign-banner";
import { PlatformIcons } from "@/components/app/platform-icons";
import { CheckCircle, ChevronRight, Lightning, Timer, User } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { estimateClipEarnings, isAlmostFull } from "@/lib/campaign-math";
import { formatAge, formatCompact, formatRate, formatUSD, viewsToMinimum } from "@/lib/format";
import type { Campaign } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const EXAMPLE_VIEWS = 10_000;

// Brand mark until brands upload logos: a small gradient square from the brand's hue.
export function BrandMark({ hue, className }: { hue: number; className?: string }) {
  return (
    <span
      className={cn("size-5 shrink-0 rounded-md", className)}
      style={{ backgroundImage: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 40} 70% 45%))` }}
    />
  );
}

// "10K views ≈ $15.00": the rate in money a creator can picture.
export function exampleEarnings(c: Campaign) {
  return `${formatCompact(EXAMPLE_VIEWS)} views ≈ ${formatUSD(estimateClipEarnings(EXAMPLE_VIEWS, c))}`;
}

// A campaign as creators see it on Discover and in their lists (DESIGN.md → Campaign card).
// Image first: the banner leads, overlay chips sit on it, then brand, title and money.
export function CampaignCard({ campaign, now, className }: { campaign: Campaign; now?: Date; className?: string }) {
  const paidFrom = viewsToMinimum(campaign.minPayoutCents, campaign.rateCents);
  const almostFull = isAlmostFull(campaign);
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl bg-card outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <CampaignBanner banner={campaign.banner}>
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
          {campaign.joined ? (
            <span className="flex items-center gap-1">
              <CheckCircle className="size-3.5" /> Joined
            </span>
          ) : (
            `Paid from ${formatCompact(paidFrom)} views`
          )}
        </span>
        {almostFull ? (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[12px] font-semibold text-[#a35b00]">
            <Timer className="size-3.5" /> Almost full
          </span>
        ) : (
          campaign.fastReview &&
          !campaign.joined && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[12px] font-semibold text-brand-foreground">
              <Lightning className="size-3.5" /> Fast review
            </span>
          )
        )}
      </CampaignBanner>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <BrandMark hue={campaign.brand.hue} />
          <span className="truncate text-[13px] font-medium">{campaign.brand.name}</span>
          {campaign.brand.verified && <CheckCircle className="size-3.5 shrink-0 text-info" aria-label="Verified brand" />}
          <span className="shrink-0 text-[13px] whitespace-nowrap text-muted-foreground">· {formatAge(campaign.launchedAt, now)}</span>
          <PlatformIcons platforms={campaign.platforms} className="ml-auto shrink-0" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 text-[16px] leading-[22px] font-semibold tracking-[-0.01em]">{campaign.title}</h3>
          <p className="text-[13px] text-muted-foreground tabular-nums">{exampleEarnings(campaign)}</p>
        </div>
        <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} className="mt-auto" />
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-6 items-center gap-1 rounded-full bg-muted px-2.5 text-[12px] font-medium tabular-nums">
            <User className="size-3.5" />
            {campaign.creators}
          </span>
          <span className="inline-flex h-6 items-center rounded-full bg-success-muted px-2.5 text-[12px] font-semibold text-success tabular-nums">
            {formatRate(campaign.rateCents, "short")}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Compact one-line version for lists on phones (search results): no screen-long stacks.
export function CampaignRow({ campaign, className }: { campaign: Campaign; className?: string }) {
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className={cn("group flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-muted/60", className)}
    >
      <span
        className="size-14 shrink-0 rounded-2xl"
        style={{ backgroundImage: `linear-gradient(135deg, ${campaign.banner.from}, ${campaign.banner.to})` }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold">{campaign.title}</p>
        <p className="truncate text-[13px] text-muted-foreground tabular-nums">
          {campaign.brand.name} · {formatRate(campaign.rateCents, "short")} · {exampleEarnings(campaign)}
        </p>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
    </Link>
  );
}

export function CampaignCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-card">
      <Skeleton className="aspect-video rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-1.5 w-full" />
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>
    </div>
  );
}
