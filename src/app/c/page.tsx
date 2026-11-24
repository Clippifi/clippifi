import type { Metadata } from "next";
import Link from "next/link";
import { bestRateCents, ratesDiffer } from "@/lib/campaign-math";
import { CampaignCard } from "@/components/app/campaign-card";
import { CardRail } from "@/components/app/card-rail";
import { IconTile } from "@/components/app/icon-tile";
import { MoneyHero } from "@/components/app/money-hero";
import { PlatformIcons, TikTokIcon } from "@/components/app/platform-icons";
import { SampleNotice } from "@/components/app/sample-notice";
import { StatTile, StatTiles } from "@/components/app/stat-tile";
import { ArrowRight, ChevronRight, Clapperboard, Eye, Megaphone, Wallet } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { formatCompact, formatRate, formatUSD, hourIn } from "@/lib/format";

// Our launch market is Nigeria; switch to each user's own time zone when we go global.
const LAUNCH_TIME_ZONE = "Africa/Lagos";
import {
  SAMPLE_NOW,
  sampleCampaigns,
  sampleClips,
  sampleCreatorSummary as summary,
} from "@/lib/sample-data";
import { requireSession } from "@/server/session";
import { getTikTokAccount } from "@/server/tiktok";

export const metadata: Metadata = { title: "Home — Clippifi" };

function greeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function HomePage() {
  const { user } = await requireSession();
  const tiktok = await getTikTokAccount(user.id);
  const firstName = user.name?.split(" ")[0];
  const joined = sampleCampaigns.filter((c) => c.joined).slice(0, 3);
  const forYou = sampleCampaigns.filter((c) => !c.joined && c.state === "active");

  return (
    <>
      <div className="flex flex-col gap-2 pt-2">
        <h1 className="text-[24px] leading-[30px] sm:text-[28px] sm:leading-[34px] font-bold tracking-[-0.025em]">
          {greeting(hourIn(LAUNCH_TIME_ZONE))}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-body text-muted-foreground">Pick up where you left off.</p>
        <SampleNotice />
      </div>

      {!tiktok && (
        <section className="flex flex-col gap-4 rounded-card bg-card p-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
          <IconTile className="bg-[#161616] text-white">
            <TikTokIcon />
          </IconTile>
          <div className="min-w-0 flex-1">
            <h2 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">Connect your TikTok to start earning</h2>
            <p className="text-small leading-5 text-muted-foreground">We use it to confirm your clips are yours and count their views.</p>
          </div>
          </div>
          <Button variant="brand" asChild className="w-full sm:w-auto">
            <Link href="/c/connections">
              Connect TikTok
              <ArrowRight />
            </Link>
          </Button>
        </section>
      )}

      <MoneyHero
        label="Lifetime earned"
        amount={formatUSD(summary.lifetimeCents)}
        action={
          <Button variant="brand" asChild>
            <Link href="/c/earnings">
              <Wallet />
              Withdraw {formatUSD(summary.availableCents)}
            </Link>
          </Button>
        }
      >
        <StatTiles>
          <StatTile tone="muted" icon={<Wallet />} value={formatUSD(summary.availableCents)} label="Available" />
          <StatTile tone="info" icon={<Eye />} value={formatCompact(summary.views)} label="Views" />
          <StatTile tone="brand" icon={<Megaphone />} value={String(summary.campaignsJoined)} label="Campaigns" />
          <StatTile tone="success" icon={<Clapperboard />} value={String(summary.clips)} label="Clips" />
        </StatTiles>
      </MoneyHero>

      <section className="flex flex-col gap-3">
        <SectionTitle title="Your campaigns" href="/c/campaigns" linkLabel="See all" />
        <div className="flex flex-col gap-2 rounded-card bg-card p-2">
          {joined.map((c) => {
            const clips = sampleClips.filter((clip) => clip.campaignId === c.id);
            const earned = clips.reduce((s, clip) => s + clip.earnedCents, 0);
            return (
              <Link
                key={c.id}
                href={`/c/campaigns/${c.id}`}
                className="group flex items-center gap-3 rounded-inner p-2 transition-colors hover:bg-muted/60"
              >
                <span
                  className="size-14 shrink-0 rounded-inner"
                  style={{ backgroundImage: `linear-gradient(135deg, ${c.banner.from}, ${c.banner.to})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-semibold">{c.title}</p>
                  <p className="truncate text-caption text-muted-foreground tabular-nums">
                    {c.brand.name} · {ratesDiffer(c) ? "up to " : ""}{formatRate(bestRateCents(c), "short")} · {clips.length} clip{clips.length === 1 ? "" : "s"} · earned{" "}
                    {formatUSD(earned)}
                  </p>
                </div>
                <PlatformIcons platforms={c.platforms} className="hidden sm:flex" />
                <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle title="Campaigns for you" href="/c/campaigns" linkLabel="Discover" />
        <CardRail>
          {forYou.map((c) => (
            <CampaignCard key={c.id} campaign={c} now={SAMPLE_NOW} />
          ))}
        </CardRail>
      </section>
    </>
  );
}

function SectionTitle({ title, href, linkLabel }: { title: string; href: string; linkLabel: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold tracking-[-0.02em]">{title}</h2>
      <Link href={href} className="tap-target flex items-center gap-0.5 text-small font-medium text-muted-foreground transition-colors hover:text-foreground">
        {linkLabel}
        <ChevronRight className="size-4" />
      </Link>
    </div>
  );
}
