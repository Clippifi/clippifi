"use client";

import { useMemo, useState } from "react";
import { CampaignCard, CampaignRow } from "@/components/app/campaign-card";
import { EmptyState } from "@/components/app/empty-state";
import {
  ActiveFilterChips,
  activeFilterChips,
  DEFAULT_FILTERS,
  FiltersSheet,
  TYPE_OPTIONS,
  type DiscoverFilters,
  type TypeFilter,
} from "@/components/app/discover-filters";
import { FeaturedCarousel } from "@/components/app/featured-carousel";
import { ScrollRail } from "@/components/app/scroll-rail";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { Close, Compass, Filter, Search } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bestRateCents, budgetLeftCents, creatorRateFor, isAlmostFull, isCampaignBeginnerFriendly } from "@/lib/campaign-math";
import type { Campaign } from "@/lib/sample-data";

const WEEK = 7 * 24 * 60 * 60 * 1000;
const FEATURED_COUNT = 5;

export function DiscoverView({ campaigns, now }: { campaigns: Campaign[]; now: Date }) {
  const [filters, setFilters] = useState<DiscoverFilters>(DEFAULT_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");

  const open = useMemo(() => campaigns.filter((c) => c.state === "active"), [campaigns]);
  const q = query.trim().toLowerCase();
  const browsing = activeFilterChips(filters).length === 0 && !q;
  const results = useMemo(() => {
    const { type, platform, sort } = filters;
    const rateOf = (c: Campaign) => (platform === "any" ? bestRateCents(c) : (creatorRateFor(c, platform)?.rateCents ?? 0));
    const matching = open.filter(
      (c) =>
        (type === "all" || c.type === type) &&
        (platform === "any" || c.platforms.includes(platform)) &&
        (!q || `${c.title} ${c.brand.name} ${c.brief}`.toLowerCase().includes(q)),
    );
    if (sort === "rate") return [...matching].sort((a, b) => rateOf(b) - rateOf(a));
    if (sort === "money") return [...matching].sort((a, b) => budgetLeftCents(b) - budgetLeftCents(a));
    if (sort === "newest") return [...matching].sort((a, b) => b.launchedAt.getTime() - a.launchedAt.getTime());
    return matching;
  }, [open, filters, q]);
  const typeCounts = Object.fromEntries(
    TYPE_OPTIONS.map((o) => [o.value, o.value === "all" ? open.length : open.filter((c) => c.type === o.value).length]),
  ) as Record<TypeFilter, number>;
  const activeCount = activeFilterChips(filters).length;

  // Curated shelves: one sideways-scrolling row each, so Discover stays short at any size.
  // A campaign can sit on more than one shelf (it fits both). Featured: the campaigns you
  // haven't joined with the most money left, up to five.
  const featured = open
    .filter((c) => !c.joined)
    .sort((a, b) => budgetLeftCents(b) - budgetLeftCents(a))
    .slice(0, FEATURED_COUNT);
  const shelf = (pick: (c: Campaign) => boolean) => open.filter(pick);
  const beginner = shelf((c) => isCampaignBeginnerFriendly(c) && c.fastReview);
  const almostFull = shelf((c) => isAlmostFull(c));
  const fresh = shelf((c) => now.getTime() - c.launchedAt.getTime() < WEEK);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        {/* Phones: search and one Filters button. Wider screens: the type tabs fit too. */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative min-w-0 flex-1 md:max-w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search campaigns"
              aria-label="Search campaigns"
              className="h-11 rounded-full bg-card pr-10 pl-10 text-[15px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] md:text-[15px] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2"
              >
                <Close className="size-4" />
              </Button>
            )}
          </div>
          <div className="ml-auto hidden xl:block">
            <Tabs value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v as TypeFilter })}>
              <TabsList aria-label="Campaign type">
                {TYPE_OPTIONS.map((o) => (
                  <TabsTrigger key={o.value} value={o.value}>
                    {o.label}
                    <span data-count>{typeCounts[o.value]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <Button variant="outline" onClick={() => setSheetOpen(true)} className="h-11 shrink-0 px-4" aria-label={`Filters${activeCount ? `, ${activeCount} on` : ""}`}>
            <Filter />
            Filters
            {activeCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background tabular-nums">
                {activeCount}
              </span>
            )}
          </Button>
        </div>
        <ActiveFilterChips filters={filters} onChange={setFilters} />
      </div>

      <FiltersSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onChange={setFilters}
        typeCounts={typeCounts}
        resultCount={browsing ? open.length : results.length}
      />

      {browsing ? (
        <>
          {featured.length > 0 && <FeaturedCarousel campaigns={featured} />}
          <Rail title="Beginner friendly" subtitle="Paid before 2,000 views, reviewed fast" campaigns={beginner} now={now} />
          <Rail title="Almost full" subtitle="Less than a quarter of the budget left. Post soon." campaigns={almostFull} now={now} />
          <Rail title="New this week" subtitle="Launched in the last 7 days" campaigns={fresh} now={now} />
          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] leading-7 font-bold tracking-[-0.02em]">All campaigns</h2>
            <CampaignList campaigns={open} now={now} />
          </section>
        </>
      ) : results.length === 0 ? (
        <div className="rounded-card bg-card">
          <EmptyState
            icon={<Compass />}
            title={q ? "No campaigns match your search" : "No campaigns match these filters"}
            description={q ? "Try a brand name or a different word." : "New campaigns open every week. Try fewer filters for now."}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setFilters(DEFAULT_FILTERS);
                }}
              >
                Show all campaigns
              </Button>
            }
          />
        </div>
      ) : (
        <section className="flex flex-col gap-3">
          <p className="text-[14px] text-muted-foreground">
            {results.length} campaign{results.length === 1 ? "" : "s"}
          </p>
          <CampaignList campaigns={results} now={now} />
        </section>
      )}
      {/* A very light haze pinned to the bottom of the screen: cards rise out of it as
          you scroll, so the list never ends in a hard cut. Stays inside the content column
          (never over the sidebar) and lets every click through. */}
      <div
        aria-hidden="true"
        className="pointer-events-none sticky bottom-0 z-10 -mt-8 h-16 bg-gradient-to-t from-background/70 to-transparent md:h-24"
      />
    </div>
  );
}

// Phones: compact list cards. Larger screens: the card grid.
function CampaignList({ campaigns, now }: { campaigns: Campaign[]; now: Date }) {
  return (
    <>
      <div className="flex flex-col gap-3 sm:hidden">
        {campaigns.map((c) => (
          <CampaignRow key={c.id} campaign={c} now={now} />
        ))}
      </div>
      {/* Cards are 360px wide. When one more column would fit at 340px, they shrink to make
          room (never below 340px), so a laptop gets three even columns instead of a gap.
          Breakpoints = n × 340px + (n − 1) × 12px gaps. */}
      <div className="@container hidden sm:block">
        <div className="grid grid-cols-[repeat(1,minmax(0,360px))] gap-3 @[692px]:grid-cols-[repeat(2,minmax(0,360px))] @[1044px]:grid-cols-[repeat(3,minmax(0,360px))] @[1396px]:grid-cols-[repeat(4,minmax(0,360px))] @[1748px]:grid-cols-[repeat(5,minmax(0,360px))]">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} now={now} />
          ))}
        </div>
      </div>
    </>
  );
}

function Rail({ title, subtitle, campaigns, now }: { title: string; subtitle?: string; campaigns: Campaign[]; now: Date }) {
  if (campaigns.length === 0) return null;
  return (
    <ScrollRail title={title} subtitle={subtitle}>
      {campaigns.map((c) => (
        <CampaignCard key={c.id} campaign={c} now={now} />
      ))}
    </ScrollRail>
  );
}
