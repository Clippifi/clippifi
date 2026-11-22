"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { BudgetMeter } from "@/components/app/budget-meter";
import { Slider } from "@/components/ui/slider";
import { budgetLeftCents, budgetMessage, campaignRates, creatorRateFor, estimateClipEarnings, viewsToCap } from "@/lib/campaign-math";
import { formatCompact, formatCount, formatUSD, formatUSDCompact, viewsToMinimum } from "@/lib/format";
import type { Campaign, Platform } from "@/lib/sample-data";

const PLATFORM_NAME = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube" } as const;

// The payout calculator (per platform), the budget and the main action.
export function CampaignEarnPanel({ campaign, action }: { campaign: Campaign; action: React.ReactNode }) {
  const rates = campaignRates(campaign);
  const [platform, setPlatform] = useState<Platform>(rates[0].platform);
  const rate = creatorRateFor(campaign, platform) ?? rates[0].rate;

  const cap = viewsToCap(rate);
  const maxViews = Math.max(10_000, Math.ceil((cap * 1.2) / 1000) * 1000);
  const [wanted, setWanted] = useState(50_000);
  const views = Math.min(wanted, maxViews);
  const earned = estimateClipEarnings(views, rate);

  return (
    <section className="flex flex-col gap-5 rounded-card bg-card p-5">
      <div>
        <p className="text-[14px] font-medium text-muted-foreground">You earn on {PLATFORM_NAME[platform]}</p>
        <p className="text-[30px] leading-9 font-bold tracking-[-0.025em] tabular-nums">
          {formatUSD(rate.rateCents)}
          <span className="text-[16px] font-medium text-muted-foreground"> per 1,000 views</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-inner bg-muted/70 p-4">
        {rates.length > 1 && (
          <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
            <TabsList aria-label="Platform" className="h-9 w-full bg-card/70 dark:bg-background/40">
              {rates.map(({ platform: p }) => (
                <TabsTrigger key={p} value={p} className="flex-1 px-2 text-[13px]">
                  {PLATFORM_NAME[p]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] text-muted-foreground">
            If one clip gets <span className="font-semibold text-foreground tabular-nums">{formatCompact(views)}</span> views
          </span>
          <span className="text-[20px] font-bold text-success tabular-nums">{formatUSD(earned)}</span>
        </div>
        <Slider value={[views]} min={0} max={maxViews} step={500} onValueChange={([v]) => setWanted(v)} aria-label="Views on one clip" />
        <p className="text-[12px] leading-4 text-muted-foreground">
          {earned === 0
            ? `Earnings start at ${formatCount(viewsToMinimum(rate.minPayoutCents, rate.rateCents))} views.`
            : views >= cap
              ? `That's the most one clip can earn here (${formatUSD(rate.maxPerClipCents)}).`
              : "Estimate for one clip. Post more clips to earn more."}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} />
        <p className="text-[13px] text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">{formatUSDCompact(budgetLeftCents(campaign))}</span> left.{" "}
          {budgetMessage(campaign)}
        </p>
      </div>

      {action}
    </section>
  );
}
