"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BrandMark } from "@/components/app/campaign-card";
import { CampaignBanner } from "@/components/app/campaign-banner";
import { CampaignEarnPanel } from "@/components/app/campaign-earn-panel";
import { BrandTrust, CampaignSection, CampaignViews, TopClippers, TopClips } from "@/components/app/campaign-proof";
import { IconTile } from "@/components/app/icon-tile";
import { Notice } from "@/components/app/notice";
import { InstagramIcon, PlatformIcons, TikTokIcon, YouTubeIcon } from "@/components/app/platform-icons";
import { ResponsiveDialog } from "@/components/app/responsive-dialog";
import { SampleNotice } from "@/components/app/sample-notice";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, File, Link as LinkIcon, Lock, SealCheck, Timer, Upload, User } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bestRateCents, budgetLeftCents, campaignRates, ratesDiffer } from "@/lib/campaign-math";
import { formatAge, formatCount, formatDay, formatRate, formatUSD, formatUSDCompact, viewsToMinimum } from "@/lib/format";
import type { Campaign, CampaignProof } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const TYPE_LABEL = { clipping: "Clipping", ugc: "UGC", sound: "Sound", logo: "Logo" } as const;
const PLATFORM = {
  tiktok: { name: "TikTok", Icon: TikTokIcon },
  instagram: { name: "Instagram", Icon: InstagramIcon },
  youtube: { name: "YouTube", Icon: YouTubeIcon },
} as const;
const DAY = 24 * 60 * 60 * 1000;

// What a non-active campaign tells creators instead of letting them join.
const STATE_NOTICE = {
  submissions_paused: { title: "Submissions are paused", body: "The brand is catching up on reviews. You can still read the brief; joining reopens soon." },
  budget_exhausted: { title: "Budget used up", body: "This campaign has paid out its whole budget and isn't taking new clips." },
  ended: { title: "This campaign has ended", body: "Clips already approved keep earning until their 30 days are up." },
} as const;

export function CampaignDetail({
  campaign,
  proof,
  tiktokConnected,
  now,
}: {
  campaign: Campaign;
  proof: CampaignProof;
  tiktokConnected: boolean;
  now: Date;
}) {
  // SAMPLE: joining is local state until the engine exists (E3).
  const [joined, setJoined] = useState(campaign.joined);
  const [joinOpen, setJoinOpen] = useState(false);
  const accepting = campaign.state === "active";
  const notice = campaign.state !== "active" ? STATE_NOTICE[campaign.state] : null;

  // Phones: the floating action bar appears only once the hero's button has scrolled away.
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const join = () => {
    setJoined(true);
    setJoinOpen(false);
    toast.success(`You joined ${campaign.brand.name}'s campaign`, { description: "Post a clip, then submit it within 30 minutes." });
  };
  const action = (className?: string) => (
    <PrimaryAction campaignId={campaign.id} joined={joined} accepting={accepting} onJoin={() => setJoinOpen(true)} className={className} />
  );

  return (
    <>
      {/* Two columns only when the content area really has room, whatever the screen size. */}
      <div data-page-width="wide" className="@container -mx-4 -mt-4 sm:mx-0 sm:mt-0">
        <div className="grid gap-5 @[56rem]:grid-cols-[minmax(0,1fr)_340px] @[56rem]:items-start">
          <CampaignHero ref={heroRef} campaign={campaign} action={action("h-11 w-full px-6 sm:w-auto")} />

          <aside className="flex min-w-0 flex-col gap-5 px-4 sm:px-0 @[56rem]:sticky @[56rem]:top-8 @[56rem]:col-start-2 @[56rem]:row-span-2 @[56rem]:row-start-1">
            <CampaignEarnPanel campaign={campaign} action={action("hidden w-full @[56rem]:inline-flex")} />
          </aside>

          <div className="flex min-w-0 flex-col gap-5 px-4 sm:px-0 @[56rem]:col-start-1">
            <StatusRow campaign={campaign} accepting={accepting} joined={joined} now={now} />
            {notice && <Notice tone="warning" title={notice.title}>{notice.body}</Notice>}
            <RatesTable campaign={campaign} />
            <HowYouEarn now={now} />
            <TopClips clips={proof.topClips} />
            <TopClippers campaign={campaign} clippers={proof.topClippers} joined={joined} />
            <CampaignViews proof={proof} />
            <BrandTrust campaign={campaign} brand={proof.brand} />
            <RulesAndFiles campaign={campaign} joined={joined} action={action()} />
          </div>
        </div>
      </div>

      {/* Lives outside the @container: containment would pin it to the page instead of the screen. */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-[calc(76px+max(12px,env(safe-area-inset-bottom)))] z-30 px-4 transition-[opacity,translate] duration-200 md:hidden",
          heroVisible ? "pointer-events-none translate-y-2 opacity-0" : "opacity-100",
        )}
      >
        <div className="flex items-center gap-3 rounded-full bg-card/90 py-1.5 pr-1.5 pl-5 shadow-[0_8px_30px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.08)] backdrop-blur-xl">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-success tabular-nums">
              {ratesDiffer(campaign) ? "Up to " : ""}
              {formatRate(bestRateCents(campaign), "short")}
            </p>
            <p className="truncate text-[12px] text-muted-foreground tabular-nums">{formatUSDCompact(budgetLeftCents(campaign))} left</p>
          </div>
          {action("h-11")}
        </div>
      </div>
      <div aria-hidden className="h-14 md:hidden" />

      <JoinSheet open={joinOpen} onOpenChange={setJoinOpen} campaign={campaign} tiktokConnected={tiktokConnected} onJoin={join} />
    </>
  );
}

// The artwork runs edge to edge on phones and melts into a band of its own colour,
// which carries the brand, title, brief and the main action.
function CampaignHero({
  ref,
  campaign,
  action,
}: {
  ref: React.Ref<HTMLElement>;
  campaign: Campaign;
  action: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <section
      ref={ref}
      className="relative min-w-0 overflow-hidden text-white sm:rounded-card"
      style={{ backgroundColor: campaign.banner.from }}
    >
      <CampaignBanner banner={campaign.banner} className="aspect-[16/10] sm:aspect-[21/9]">
        <span
          aria-hidden
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(to bottom, transparent 35%, ${campaign.banner.from} 100%)` }}
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <Button asChild size="sm" className="bg-black/45 text-white backdrop-blur-md hover:bg-black/60">
            <Link href="/c/campaigns">
              <ArrowLeft />
              Discover
            </Link>
          </Button>
          <Button size="icon-sm" onClick={copyLink} aria-label="Copy campaign link" className="bg-black/45 text-white backdrop-blur-md hover:bg-black/60">
            <LinkIcon />
          </Button>
        </div>
      </CampaignBanner>

      <div className="relative -mt-14 flex flex-col gap-3 px-5 pb-5">
        <p className="flex w-fit max-w-full items-center gap-1.5 rounded-full bg-black/35 py-1 pr-2.5 pl-1.5 text-[13px] font-medium backdrop-blur-md">
          <BrandMark hue={campaign.brand.hue} className="rounded-full" />
          <span className="truncate">{campaign.brand.name}</span>
          {campaign.brand.verified && <SealCheck className="size-4 shrink-0" aria-label="Verified brand" />}
        </p>
        <h1 className="text-[26px] leading-8 font-bold tracking-[-0.025em] text-balance sm:text-[30px] sm:leading-9">{campaign.title}</h1>
        <div>
          <p className={cn("text-[15px] leading-[22px] text-white/80", !expanded && "line-clamp-2")}>{campaign.brief}</p>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-0.5 rounded text-[14px] font-medium text-white underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-white/50"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        </div>
        <div className="mt-1">{action}</div>
      </div>
    </section>
  );
}

function StatusRow({ campaign, accepting, joined, now }: { campaign: Campaign; accepting: boolean; joined: boolean; now: Date }) {
  const chip = "h-7 border border-hairline bg-transparent px-2.5 text-[13px] text-foreground";
  return (
    <div className="flex flex-col gap-2.5">
      <div className="no-scrollbar relative -mx-4 flex items-center gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        {accepting ? (
          <Badge className={cn(chip, "text-success")}>
            <CheckCircle /> Accepting clips
          </Badge>
        ) : (
          <Badge className={cn(chip, "text-warning")}>
            <Timer /> Not accepting clips
          </Badge>
        )}
        {joined && (
          <Badge variant="brand" className="h-7 px-2.5 text-[13px]">
            <CheckCircle /> Joined
          </Badge>
        )}
        <Badge className={chip}>{TYPE_LABEL[campaign.type]}</Badge>
        <Badge className={chip}>
          <Calendar /> {formatAge(campaign.launchedAt, now)} ago
        </Badge>
        <Badge className={chip}>
          <User /> {campaign.creators} creators
        </Badge>
        <PlatformIcons platforms={campaign.platforms} className="shrink-0" />
      </div>
      <SampleNotice />
    </div>
  );
}

// One outlined table for every platform: each brand sets its own terms per platform.
function RatesTable({ campaign }: { campaign: Campaign }) {
  const rates = campaignRates(campaign);
  const best = bestRateCents(campaign);
  const cell = "min-w-0 px-3 py-3 tabular-nums";
  return (
    <CampaignSection title="What each platform pays">
      <div className="@container">
        <div className="overflow-hidden rounded-inner border border-hairline">
          <div className="grid grid-cols-3 border-b border-hairline text-[12px] text-muted-foreground @md:grid-cols-[1.25fr_1fr_1fr_1fr]">
            <span className="hidden px-3 py-2 @md:block">Platform</span>
            <span className="px-3 py-2">Per 1K views</span>
            <span className="px-3 py-2">First payout</span>
            <span className="px-3 py-2">Max per clip</span>
          </div>
          <ul className="divide-y divide-hairline">
            {rates.map(({ platform, rate }) => {
              const { name, Icon } = PLATFORM[platform];
              return (
                <li key={platform} className="grid grid-cols-3 items-center @md:grid-cols-[1.25fr_1fr_1fr_1fr]">
                  <span className="col-span-3 flex items-center gap-2 px-3 pt-3 text-[14px] font-semibold @md:col-span-1 @md:py-3">
                    <Icon className="size-4 shrink-0" />
                    {name}
                  </span>
                  <span className={cn(cell, "pt-1.5 text-[16px] font-bold @md:pt-3", rate.rateCents === best ? "text-success" : "text-foreground")}>
                    {formatUSD(rate.rateCents)}
                  </span>
                  <span className={cn(cell, "pt-1.5 text-[13px] font-medium whitespace-nowrap @md:pt-3 @md:text-[14px]")}>
                    {formatCount(viewsToMinimum(rate.minPayoutCents, rate.rateCents))} views
                  </span>
                  <span className={cn(cell, "pt-1.5 text-[13px] font-medium @md:pt-3 @md:text-[14px]")}>{formatUSD(rate.maxPerClipCents)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="text-[13px] leading-[18px] text-muted-foreground">
        Views come from each platform&apos;s own count. You can earn up to{" "}
        <span className="font-semibold text-foreground tabular-nums">{formatUSD(campaign.maxPerCreatorCents)}</span> in this campaign.
      </p>
    </CampaignSection>
  );
}

// A connected timeline with real dates, counted from today.
function HowYouEarn({ now }: { now: Date }) {
  const date = (days: number) => formatDay(new Date(now.getTime() + days * DAY), "UTC");
  const steps = [
    { when: "Today", title: "Post, then submit", text: "Submit within 30 minutes of posting." },
    { when: `Until ${date(30)}`, title: "Views are counted", text: "Verified views count for 30 days." },
    { when: `From ${date(10)}`, title: "Get paid weekly", text: "Each 7-day round unlocks 3 days later." },
  ];
  return (
    <CampaignSection title="How you earn">
      <div className="@container">
        <ol className="flex flex-col @lg:flex-row">
          {steps.map((step, i) => (
            <li key={step.title} className="relative flex flex-1 gap-3 pb-5 last:pb-0 @lg:flex-col @lg:pr-4 @lg:pb-0">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-8 bottom-0 left-[15px] w-px bg-hairline @lg:top-[15px] @lg:right-0 @lg:bottom-auto @lg:left-8 @lg:h-px @lg:w-auto"
                />
              )}
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-hairline text-[14px] font-semibold tabular-nums">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-muted-foreground tabular-nums">{step.when}</p>
                <p className="text-[15px] leading-[22px] font-semibold">{step.title}</p>
                <p className="text-[13px] leading-[18px] text-muted-foreground">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className="border-t border-hairline pt-3 text-[13px] leading-[18px] text-muted-foreground">
        <span className="font-semibold text-foreground">Keep your clip public until {date(33)}.</span> Deleting or hiding it earlier cancels its unpaid earnings.
      </p>
    </CampaignSection>
  );
}

function RulesAndFiles({ campaign, joined, action }: { campaign: Campaign; joined: boolean; action: React.ReactNode }) {
  const files = campaign.referenceFiles;
  const rules = campaign.rules.length;
  if (!joined) {
    return (
      <section className="flex flex-col gap-3 rounded-card border border-dashed border-hairline p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2.5 text-[15px] font-semibold">
          <Lock className="size-[18px] shrink-0 text-muted-foreground" />
          Join to unlock {rules} rule{rules === 1 ? "" : "s"} and {files} file{files === 1 ? "" : "s"}
        </p>
        {action}
      </section>
    );
  }
  return (
    <CampaignSection title="Rules and files">
      <ul className="divide-y divide-hairline rounded-inner border border-hairline">
        {campaign.rules.map((rule) => (
          <li key={rule} className="flex items-start gap-2.5 px-3 py-2.5 text-[15px]">
            <CheckCircle className="mt-0.5 size-[18px] shrink-0 text-success" />
            {rule}
          </li>
        ))}
        {Array.from({ length: files }, (_, i) => (
          <li key={i} className="flex items-center gap-2.5 px-3 py-2.5 text-[15px]">
            <File className="size-[18px] shrink-0 text-muted-foreground" />
            Reference file {i + 1}
            <span className="ml-auto text-[13px] text-muted-foreground">Sample</span>
          </li>
        ))}
      </ul>
    </CampaignSection>
  );
}

// The core action: Join (yellow, a brand action) or, once joined, Submit a clip.
function PrimaryAction({
  campaignId,
  joined,
  accepting,
  onJoin,
  className,
}: {
  campaignId: string;
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
        <Link href={`/c/submit?campaign=${campaignId}`}>
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
      <div className="flex items-center gap-3 rounded-inner bg-muted p-3">
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
