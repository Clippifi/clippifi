import Link from "next/link";
import { BudgetMeter } from "@/components/app/budget-meter";
import { CampaignBanner } from "@/components/app/campaign-banner";
import { PlatformIcons } from "@/components/app/platform-icons";
import { CheckCircle, Lightning, User } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAge, formatCompact, formatRate, viewsToMinimum } from "@/lib/format";
import type { Campaign } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

// A campaign as creators see it on Discover and in their list (DESIGN.md → Campaign card).
// Image first: the banner leads, overlay chips sit on it, then brand, title and money.
export function CampaignCard({ campaign, now, className }: { campaign: Campaign; now?: Date; className?: string }) {
  const paidFrom = viewsToMinimum(campaign.minPayoutCents, campaign.rateCents);
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl bg-card outline-none transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50",
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
        {campaign.fastReview && !campaign.joined && (
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[12px] font-semibold text-brand-foreground">
            <Lightning className="size-3.5" /> Fast review
          </span>
        )}
      </CampaignBanner>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <span
            className="size-5 shrink-0 rounded-md"
            style={{ backgroundImage: `linear-gradient(135deg, hsl(${campaign.brand.hue} 70% 62%), hsl(${campaign.brand.hue + 40} 70% 45%))` }}
          />
          <span className="truncate text-[13px] font-medium">{campaign.brand.name}</span>
          {campaign.brand.verified && <CheckCircle className="size-3.5 shrink-0 text-info" aria-label="Verified brand" />}
          <span className="text-[13px] text-muted-foreground">· {formatAge(campaign.launchedAt, now)}</span>
          <PlatformIcons platforms={campaign.platforms} className="ml-auto" />
        </div>
        <h3 className="line-clamp-2 text-[16px] leading-[22px] font-semibold tracking-[-0.01em]">{campaign.title}</h3>
        <div className="mt-auto flex items-center justify-between gap-2">
          <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} className="flex-1" />
        </div>
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
