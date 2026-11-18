"use client";

import { useMemo, useState } from "react";
import { CampaignCard, CampaignRow } from "@/components/app/campaign-card";
import { EmptyState } from "@/components/app/empty-state";
import { FeaturedCampaign } from "@/components/app/featured-campaign";
import { ScrollRail } from "@/components/app/scroll-rail";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { Close, Compass, Search } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { budgetLeftCents, isAlmostFull, isCampaignBeginnerFriendly } from "@/lib/campaign-math";
import type { Campaign, CampaignType } from "@/lib/sample-data";

const FILTERS: { value: "all" | CampaignType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clipping", label: "Clipping" },
  { value: "ugc", label: "UGC" },
  { value: "sound", label: "Sound" },
  { value: "logo", label: "Logo" },
];

const WEEK = 7 * 24 * 60 * 60 * 1000;

export function DiscoverView({ campaigns, now }: { campaigns: Campaign[]; now: Date }) {
  const [filter, setFilter] = useState<"all" | CampaignType>("all");
  const [query, setQuery] = useState("");

  const open = useMemo(() => campaigns.filter((c) => c.state === "active"), [campaigns]);
  const q = query.trim().toLowerCase();
  const browsing = filter === "all" && !q;
  const results = useMemo(
    () =>
      open.filter(
        (c) =>
          (filter === "all" || c.type === filter) &&
          (!q || `${c.title} ${c.brand.name} ${c.brief}`.toLowerCase().includes(q)),
      ),
    [open, filter, q],
  );

  // Curated shelves: one sideways-scrolling row each, so Discover stays short at any size.
  // A campaign can sit on more than one shelf (it fits both); the featured one isn't repeated.
  const featured = [...open].filter((c) => !c.joined).sort((a, b) => budgetLeftCents(b) - budgetLeftCents(a))[0];
  const shelf = (pick: (c: Campaign) => boolean) => open.filter((c) => c.id !== featured?.id && pick(c));
  const beginner = shelf((c) => isCampaignBeginnerFriendly(c) && c.fastReview);
  const almostFull = shelf((c) => isAlmostFull(c));
  const fresh = shelf((c) => now.getTime() - c.launchedAt.getTime() < WEEK);

  return (
    <div data-page-width="full" className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campaigns or brands"
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
        <div className="no-scrollbar -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <TabsList aria-label="Campaign type">
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label}
                  <span data-count>{f.value === "all" ? open.length : open.filter((c) => c.type === f.value).length}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {browsing ? (
        <>
          {featured && <FeaturedCampaign campaign={featured} />}
          <Rail title="Beginner friendly" subtitle="Paid before 2,000 views, reviewed fast" campaigns={beginner} now={now} />
          <Rail title="Almost full" subtitle="Less than a quarter of the budget left. Post soon." campaigns={almostFull} now={now} />
          <Rail title="New this week" subtitle="Launched in the last 7 days" campaigns={fresh} now={now} />
          <section className="flex flex-col gap-3">
            <h2 className="text-[20px] leading-7 font-bold tracking-[-0.02em]">All campaigns</h2>
            <CampaignList campaigns={open} now={now} />
          </section>
        </>
      ) : results.length === 0 ? (
        <div className="rounded-3xl bg-card">
          <EmptyState
            icon={<Compass />}
            title={q ? "No campaigns match your search" : "No campaigns of this type right now"}
            description={q ? "Try a brand name or a different word." : "New campaigns open every week. Check all campaigns for now."}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
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
      <div className="hidden gap-4 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} now={now} />
        ))}
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
