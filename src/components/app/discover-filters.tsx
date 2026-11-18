"use client";

import { RadioGroup, RadioGroupItem } from "@/components/animate-ui/components/radix/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/animate-ui/components/radix/toggle-group";
import { ResponsiveDialog } from "@/components/app/responsive-dialog";
import { Close } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { CampaignType, Platform } from "@/lib/sample-data";

export type TypeFilter = "all" | CampaignType;
export type PlatformFilter = "any" | Platform;
export type SortOrder = "recommended" | "rate" | "money" | "newest";
export type DiscoverFilters = { type: TypeFilter; platform: PlatformFilter; sort: SortOrder };

export const DEFAULT_FILTERS: DiscoverFilters = { type: "all", platform: "any", sort: "recommended" };

export const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "clipping", label: "Clipping" },
  { value: "ugc", label: "UGC" },
  { value: "sound", label: "Sound" },
  { value: "logo", label: "Logo" },
];
const PLATFORM_OPTIONS: { value: PlatformFilter; label: string }[] = [
  { value: "any", label: "Any" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
];
const SORT_OPTIONS: { value: SortOrder; label: string; hint: string }[] = [
  { value: "recommended", label: "Recommended", hint: "Featured picks and rows" },
  { value: "rate", label: "Highest rate", hint: "Most paid per 1,000 views" },
  { value: "money", label: "Most money left", hint: "Biggest budget still to earn" },
  { value: "newest", label: "Newest", hint: "Launched most recently" },
];

const label = (options: { value: string; label: string }[], value: string) => options.find((o) => o.value === value)?.label ?? value;

/** Filters that differ from the defaults, as removable chips. */
export function activeFilterChips(filters: DiscoverFilters) {
  const chips: { key: keyof DiscoverFilters; label: string }[] = [];
  if (filters.type !== "all") chips.push({ key: "type", label: label(TYPE_OPTIONS, filters.type) });
  if (filters.platform !== "any") chips.push({ key: "platform", label: label(PLATFORM_OPTIONS, filters.platform) });
  if (filters.sort !== "recommended") chips.push({ key: "sort", label: label(SORT_OPTIONS, filters.sort) });
  return chips;
}

// The active filters under the search box, each one a tap away from being removed.
export function ActiveFilterChips({ filters, onChange }: { filters: DiscoverFilters; onChange: (next: DiscoverFilters) => void }) {
  const chips = activeFilterChips(filters);
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onChange({ ...filters, [chip.key]: DEFAULT_FILTERS[chip.key] })}
          aria-label={`Remove filter: ${chip.label}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground pr-2.5 pl-3.5 text-[13px] font-medium text-background outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {chip.label}
          <Close className="size-3.5" />
        </button>
      ))}
      <Button variant="link" size="sm" onClick={() => onChange(DEFAULT_FILTERS)} className="px-1 text-muted-foreground">
        Clear all
      </Button>
    </div>
  );
}

export function FiltersSheet({
  open,
  onOpenChange,
  filters,
  onChange,
  typeCounts,
  resultCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: DiscoverFilters;
  onChange: (next: DiscoverFilters) => void;
  typeCounts: Record<TypeFilter, number>;
  resultCount: number;
}) {
  const set = <K extends keyof DiscoverFilters>(key: K, value: DiscoverFilters[K] | "") => value && onChange({ ...filters, [key]: value });
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      footer={
        <>
          <Button variant="secondary" onClick={() => onChange(DEFAULT_FILTERS)}>
            Clear all
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Show {resultCount} campaign{resultCount === 1 ? "" : "s"}
          </Button>
        </>
      }
    >
      <FilterSection title="Type">
        <ToggleGroup type="single" value={filters.type} onValueChange={(v) => set("type", v as TypeFilter)} aria-label="Campaign type">
          {TYPE_OPTIONS.map((o) => (
            <ToggleGroupItem key={o.value} value={o.value}>
              {o.label}
              <span data-count>{typeCounts[o.value]}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSection>
      <FilterSection title="Platform">
        <ToggleGroup type="single" value={filters.platform} onValueChange={(v) => set("platform", v as PlatformFilter)} aria-label="Platform">
          {PLATFORM_OPTIONS.map((o) => (
            <ToggleGroupItem key={o.value} value={o.value}>
              {o.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FilterSection>
      <FilterSection title="Sort by">
        <RadioGroup
          value={filters.sort}
          onValueChange={(v) => set("sort", v as SortOrder)}
          aria-label="Sort by"
          className="grid-cols-1 gap-0 divide-y divide-hairline overflow-hidden rounded-inner border border-hairline"
        >
          {SORT_OPTIONS.map((o) => (
            <label
              key={o.value}
              className="flex min-w-0 cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors has-data-[state=checked]:bg-muted/70"
            >
              <RadioGroupItem value={o.value} />
              <span className="min-w-0">
                <span className="block text-[15px] font-medium">{o.label}</span>
                <span className="block text-[13px] text-muted-foreground">{o.hint}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
      </FilterSection>
    </ResponsiveDialog>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2.5">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      {children}
    </section>
  );
}
