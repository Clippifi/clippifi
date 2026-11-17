"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BudgetMeter } from "@/components/app/budget-meter";
import { BrandMark } from "@/components/app/campaign-card";
import { CampaignBanner } from "@/components/app/campaign-banner";
import { IconTile } from "@/components/app/icon-tile";
import { Notice } from "@/components/app/notice";
import { PlatformIcons, TikTokIcon } from "@/components/app/platform-icons";
import { ResponsiveDialog } from "@/components/app/responsive-dialog";
import { SampleNotice } from "@/components/app/sample-notice";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronRight,
  Eye,
  File,
  Lock,
  Timer,
  Upload,
  Wallet,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { budgetLeftCents, budgetLeftShare, estimateClipEarnings, viewsToCap } from "@/lib/campaign-math";
import { formatAge, formatCount, formatCompact, formatRate, formatUSD, formatUSDCompact, viewsToMinimum } from "@/lib/format";
import type { Campaign } from "@/lib/sample-data";

const TYPE_LABEL = { clipping: "Clipping", ugc: "UGC", sound: "Sound", logo: "Logo" } as const;

// What a non-active campaign tells creators instead of letting them join.
const STATE_NOTICE = {
  submissions_paused: { title: "Submissions are paused", body: "The brand is catching up on reviews. You can still read the brief; joining reopens soon." },
  budget_exhausted: { title: "Budget used up", body: "This campaign has paid out its whole budget and isn't taking new clips." },
  ended: { title: "This campaign has ended", body: "Clips already approved keep earning until their 30 days are up." },
} as const;

export function CampaignDetail({
  campaign,
  tiktokConnected,
  now,
}: {
  campaign: Campaign;
  tiktokConnected: boolean;
  now: Date;
}) {
  // SAMPLE: joining is local state until the engine exists (E3).
  const [joined, setJoined] = useState(campaign.joined);
  const [joinOpen, setJoinOpen] = useState(false);
  const accepting = campaign.state === "active";
  const notice = campaign.state !== "active" ? STATE_NOTICE[campaign.state] : null;

  const openJoin = () => setJoinOpen(true);
  const join = () => {
    setJoined(true);
    setJoinOpen(false);
    toast.success(`You joined ${campaign.brand.name}'s campaign`, { description: "Post a clip, then submit it within 30 minutes." });
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <Link
          href="/c/campaigns"
          className="flex w-fit items-center gap-1 text-[14px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronRight className="size-4 rotate-180" />
          Discover
        </Link>
        <SampleNotice />
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* Main column */}
        <div className="flex min-w-0 flex-col gap-6">
          <section className="overflow-hidden rounded-3xl bg-card">
            <CampaignBanner banner={campaign.banner} className="sm:aspect-[21/9]" />
            <div className="flex flex-col gap-3 p-5">
              <div className="flex flex-wrap items-center gap-2 text-[13px]">
                <BrandMark hue={campaign.brand.hue} />
                <span className="font-medium">{campaign.brand.name}</span>
                {campaign.brand.verified && <CheckCircle className="size-3.5 text-info" aria-label="Verified brand" />}
                <span className="text-muted-foreground">· {TYPE_LABEL[campaign.type]} campaign</span>
              </div>
              <h1 className="text-[26px] leading-8 font-bold tracking-[-0.025em] text-balance sm:text-[30px] sm:leading-9">
                {campaign.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {accepting ? (
                  <Badge variant="success">
                    <CheckCircle /> Accepting clips
                  </Badge>
                ) : (
                  <Badge variant="warning">
                    <Timer /> Not accepting clips
                  </Badge>
                )}
                {joined && (
                  <Badge variant="brand">
                    <CheckCircle /> Joined
                  </Badge>
                )}
                <Badge>
                  <Calendar /> Launched {formatAge(campaign.launchedAt, now)} ago
                </Badge>
                <PlatformIcons platforms={campaign.platforms} />
              </div>
            </div>
          </section>

          {notice && <Notice tone="warning" title={notice.title}>{notice.body}</Notice>}

          {/* Phones: the earn panel sits here, under the title. */}
          <div className="lg:hidden">
            <EarnPanel campaign={campaign} joined={joined} accepting={accepting} onJoin={openJoin} />
          </div>

          <Section title="The brief">
            <p className="text-[15px] leading-[23px] text-foreground/85">{campaign.brief}</p>
          </Section>

          <Section title="How you earn">
            <ol className="grid gap-2 sm:grid-cols-3">
              {[
                { icon: <Upload />, title: "Post, then submit", text: "Submit your clip within 30 minutes of posting it." },
                { icon: <Eye />, title: "Views are counted", text: "We count verified views for 30 days, from zero." },
                { icon: <Wallet />, title: "Get paid weekly", text: "Each 7-day round unlocks 3 days after it ends." },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-3 rounded-2xl bg-muted/70 p-3 sm:flex-col">
                  <IconTile tone="brand" size="sm">
                    {step.icon}
                  </IconTile>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold">
                      <span className="mr-1 text-muted-foreground tabular-nums">{i + 1}.</span>
                      {step.title}
                    </p>
                    <p className="text-[13px] leading-[18px] text-muted-foreground">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Limits, in plain words">
            <ul className="grid gap-2 sm:grid-cols-3">
              <Limit
                value={`${formatCount(viewsToMinimum(campaign.minPayoutCents, campaign.rateCents))} views`}
                label="You start earning here"
                hint={`Then every view counts, from zero (${formatUSD(campaign.minPayoutCents)} minimum).`}
              />
              <Limit
                value={formatUSD(campaign.maxPerClipCents)}
                label="Most one clip can earn"
                hint={`Reached at ${formatCompact(viewsToCap(campaign))} views.`}
              />
              <Limit
                value={formatUSD(campaign.maxPerCreatorCents)}
                label="Most you can earn here"
                hint="Across all your clips in this campaign."
              />
            </ul>
          </Section>

          <Notice tone="info" title="Keep your clip public for about 33 days">
            Views count for 30 days and the last payout unlocks 3 days later. Deleting or hiding the clip before then
            cancels its unpaid earnings.
          </Notice>

          <Section title="Rules and files">
            {joined ? (
              <div className="flex flex-col gap-2">
                <ul className="flex flex-col gap-2">
                  {campaign.rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2.5 rounded-2xl bg-muted/70 px-3 py-2.5 text-[15px]">
                      <CheckCircle className="mt-0.5 size-[18px] shrink-0 text-success" />
                      {rule}
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col gap-2">
                  {Array.from({ length: campaign.referenceFiles }, (_, i) => (
                    <li key={i} className="flex items-center gap-2.5 rounded-2xl bg-muted/70 px-3 py-2.5 text-[15px]">
                      <File className="size-[18px] shrink-0 text-muted-foreground" />
                      Reference file {i + 1}
                      <span className="ml-auto text-[13px] text-muted-foreground">Sample</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted/70 px-4 py-8 text-center">
                <IconTile tone="muted" className="bg-card">
                  <Lock />
                </IconTile>
                <p className="text-[15px] font-semibold">
                  Join to see {campaign.rules.length} rules and {campaign.referenceFiles} reference file
                  {campaign.referenceFiles === 1 ? "" : "s"}
                </p>
                <p className="max-w-sm text-[13px] text-muted-foreground">
                  Brands share their exact requirements and assets with creators who join.
                </p>
              </div>
            )}
          </Section>
        </div>

        {/* Desktop: the earn panel stays beside the content as you scroll. */}
        <aside className="hidden lg:sticky lg:top-8 lg:block">
          <EarnPanel campaign={campaign} joined={joined} accepting={accepting} onJoin={openJoin} />
        </aside>
      </div>

      {/* Phones: rate and the main action stay visible above the tab bar. */}
      <div className="fixed inset-x-0 bottom-[calc(76px+max(12px,env(safe-area-inset-bottom)))] z-30 px-4 lg:hidden">
        <div className="flex items-center gap-3 rounded-full bg-card/90 py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.08)] backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-success tabular-nums">{formatRate(campaign.rateCents)}</p>
            <p className="truncate text-[12px] text-muted-foreground tabular-nums">
              {formatUSDCompact(budgetLeftCents(campaign))} left
            </p>
          </div>
          <PrimaryAction joined={joined} accepting={accepting} onJoin={openJoin} className="h-11" />
        </div>
      </div>
      <div aria-hidden className="h-16 lg:hidden" />

      <JoinSheet
        open={joinOpen}
        onOpenChange={setJoinOpen}
        campaign={campaign}
        tiktokConnected={tiktokConnected}
        onJoin={join}
      />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-3xl bg-card p-5">
      <h2 className="text-[17px] leading-6 font-semibold tracking-[-0.01em]">{title}</h2>
      {children}
    </section>
  );
}

function Limit({ value, label, hint }: { value: string; label: string; hint: string }) {
  return (
    <li className="flex flex-col gap-0.5 rounded-2xl bg-muted/70 p-3">
      <span className="text-[17px] leading-6 font-semibold tabular-nums">{value}</span>
      <span className="text-[14px] font-medium">{label}</span>
      <span className="text-[13px] leading-[18px] text-muted-foreground">{hint}</span>
    </li>
  );
}

// The core action: Join (yellow, a brand action) or, once joined, Submit a clip.
function PrimaryAction({
  joined,
  accepting,
  onJoin,
  className,
}: {
  joined: boolean;
  accepting: boolean;
  onJoin: () => void;
  className?: string;
}) {
  if (!accepting) {
    return (
      <Button variant="secondary" disabled className={className}>
        Not accepting clips
      </Button>
    );
  }
  if (joined) {
    return (
      <Button variant="brand" asChild className={className}>
        <Link href="/c/submit">
          <Upload />
          Submit a clip
        </Link>
      </Button>
    );
  }
  return (
    <Button variant="brand" onClick={onJoin} className={className}>
      Join campaign
    </Button>
  );
}

// Rate, an earnings calculator, budget left and the main action.
function EarnPanel({
  campaign,
  joined,
  accepting,
  onJoin,
}: {
  campaign: Campaign;
  joined: boolean;
  accepting: boolean;
  onJoin: () => void;
}) {
  const cap = viewsToCap(campaign);
  const maxViews = Math.max(10_000, Math.ceil((cap * 1.2) / 1000) * 1000);
  const [views, setViews] = useState(Math.min(50_000, maxViews));
  const earned = estimateClipEarnings(views, campaign);
  const capped = views >= cap;
  const belowMin = earned === 0;
  const share = budgetLeftShare(campaign);

  return (
    <section className="flex flex-col gap-5 rounded-3xl bg-card p-5">
      <div>
        <p className="text-[14px] font-medium text-muted-foreground">You earn</p>
        <p className="text-[30px] leading-9 font-bold tracking-[-0.025em] tabular-nums">
          {formatUSD(campaign.rateCents)}
          <span className="text-[16px] font-medium text-muted-foreground"> per 1,000 views</span>
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl bg-muted/70 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[14px] text-muted-foreground">
            If one clip gets <span className="font-semibold text-foreground tabular-nums">{formatCompact(views)}</span> views
          </span>
          <span className="text-[20px] font-bold text-success tabular-nums">{formatUSD(earned)}</span>
        </div>
        <Slider
          value={[views]}
          min={0}
          max={maxViews}
          step={500}
          onValueChange={([v]) => setViews(v)}
          aria-label="Views on one clip"
        />
        <p className="text-[12px] leading-4 text-muted-foreground">
          {belowMin
            ? `Earnings start at ${formatCount(viewsToMinimum(campaign.minPayoutCents, campaign.rateCents))} views.`
            : capped
              ? `That's the most one clip can earn here (${formatUSD(campaign.maxPerClipCents)}).`
              : "Estimate for one clip. Post more clips to earn more."}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <BudgetMeter spentCents={campaign.spentCents} budgetCents={campaign.budgetCents} />
        <p className="text-[13px] text-muted-foreground">
          {formatUSDCompact(budgetLeftCents(campaign))} still to be earned ·{" "}
          {share < 0.25 ? "filling up fast, post soon." : "plenty of room to join."} {campaign.creators} creators so far.
        </p>
      </div>

      <PrimaryAction joined={joined} accepting={accepting} onJoin={onJoin} className="hidden w-full lg:inline-flex" />
    </section>
  );
}

// Joining: shows the rules before you commit and checks TikTok in the same step.
function JoinSheet({
  open,
  onOpenChange,
  campaign,
  tiktokConnected,
  onJoin,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign;
  tiktokConnected: boolean;
  onJoin: () => void;
}) {
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Join ${campaign.brand.name}'s campaign`}
      description="Joining is free. You can leave any time; clips you've submitted keep their earnings."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Not now
          </Button>
          {tiktokConnected ? (
            <Button variant="brand" onClick={onJoin}>
              Join campaign
              <ArrowRight />
            </Button>
          ) : (
            <Button variant="brand" asChild>
              <Link href="/c/connections">
                <TikTokIcon />
                Connect TikTok first
              </Link>
            </Button>
          )}
        </>
      }
    >
      <ul className="flex flex-col gap-2">
        {[
          `Post on ${campaign.platforms.length > 1 ? "a platform this campaign accepts" : "TikTok"}, then submit within 30 minutes.`,
          "Follow the brand's rules (you'll see all of them after joining).",
          "Keep each clip public for about 33 days.",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-[15px] leading-[22px]">
            <CheckCircle className="mt-0.5 size-[18px] shrink-0 text-success" />
            {t}
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3 rounded-2xl bg-muted p-3">
        <IconTile size="sm" className="bg-[#161616] text-white">
          <TikTokIcon />
        </IconTile>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold">TikTok</p>
          <p className="text-[13px] text-muted-foreground">
            {tiktokConnected ? "Connected. Your clips will be checked against this account." : "Connect the account you'll post from to join."}
          </p>
        </div>
        {tiktokConnected ? <Badge variant="success">Connected</Badge> : <Badge variant="warning">Needed</Badge>}
      </div>
    </ResponsiveDialog>
  );
}
