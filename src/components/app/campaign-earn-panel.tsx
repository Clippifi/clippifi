"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { BudgetMeter } from "@/components/app/budget-meter";
import { Slider } from "@/components/ui/slider";
import { budgetLeftCents, budgetMessage, campaignRates, creatorRateFor, takeHomeEarnings, viewsToCap } from "@/lib/campaign-math";
import { formatCompact, formatCount, formatUSD, formatUSDCompact, viewsToMinimum } from "@/lib/format";
import type { Campaign, Platform } from "@/lib/sample-data";

const PLATFORM_NAME = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube" } as const;

// The payout calculator (per platform), the budget and the main action.
export function CampaignEarnPanel({ campaign, action }: { campaign: Campaign; action: React.ReactNode }) {
  const rates = campaignRates(campaign);
  const [platform, setPlatform] = useState<Platform>(rates[0].platform);
  // Shown to the creator: take-home terms. Calculated from: the brand's own terms, with the fee
  // taken off the total (takeHomeEarnings), so the estimate is exact to the cent.
  const rate = creatorRateFor(campaign, platform) ?? rates[0].rate;
  const grossRate = campaign.rates[platform] ?? campaign.rates[rates[0].platform]!;

  const cap = viewsToCap(grossRate);
  const maxViews = Math.max(10_000, Math.ceil((cap * 1.2) / 1000) * 1000);
  const [wanted, setWanted] = useState(50_000);
  const views = Math.min(wanted, maxViews);
  const earned = takeHomeEarnings(views, grossRate);

  return (
    <section className="flex flex-col gap-5 rounded-card bg-card p-5">
      <div>
        <p className="text-small font-medium text-muted-foreground">You earn on {PLATFORM_NAME[platform]}</p>
        <p className="text-[26px] leading-8 sm:text-[30px] sm:leading-9 font-bold tracking-[-0.025em] tabular-nums">
          {formatUSD(rate.rateCents)}
          <span className="text-[16px] font-medium text-muted-foreground"> per 1,000 views</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-inner bg-muted/70 p-4">
        {rates.length > 1 && (
          <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
            <TabsList aria-label="Platform" className="h-9 w-full bg-card/70 dark:bg-background/40">
              {rates.map(({ platform: p }) => (
                <TabsTrigger key={p} value={p} className="flex-1 px-2 text-caption">
                  {PLATFORM_NAME[p]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        {/* Nothing around the slider may change height while it's dragged: on phones the browser
            re-anchors the scroll, the slider moves under the finger and the value jitters. So this
            row never wraps and the hint below always takes two lines. */}
        <div className="flex items-baseline justify-between gap-2 whitespace-nowrap">
          <span className="min-w-0 truncate text-small text-muted-foreground">
            If one clip gets <span className="font-semibold text-foreground tabular-nums">{formatCompact(views)}</span> views
          </span>
          <span className="shrink-0 text-[20px] font-bold text-success tabular-nums">{formatUSD(earned)}</span>
        </div>
        <Slider value={[views]} min={0} max={maxViews} step={500} onValueChange={([v]) => setWanted(v)} aria-label="Views on one clip" />
        <p className="line-clamp-2 min-h-8 text-fine leading-4 text-muted-foreground">
          {earned === 0
            ? `Earnings start at ${formatCount(viewsToMinimum(rate.minPayoutCents, rate.rateCents))} views.`
            : views >= cap
              ? `The most one clip can earn here: ${formatUSD(rate.maxPerClipCents)}.`
              : "Estimate for one clip. More clips, more earnings."}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} />
        <p className="text-caption text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{formatUSDCompact(budgetLeftCents(campaign))}</span> left.{" "}
          {budgetMessage(campaign)}
        </p>
      </div>

      {action}
    </section>
  );
}
