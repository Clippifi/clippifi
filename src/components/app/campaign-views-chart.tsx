"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatCompact } from "@/lib/format";

const config = { views: { label: "Views", color: "var(--color-brand-500)" } } satisfies ChartConfig;

const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

// Running total of verified views. Loaded on demand so the chart library never slows the page.
export default function CampaignViewsChart({ data }: { data: { day: string; views: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-48 w-full">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="campaign-views-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-views)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-views)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--hairline)" strokeDasharray="3 4" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} minTickGap={48} tickFormatter={dayLabel} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_, payload) => dayLabel(String(payload?.[0]?.payload?.day ?? ""))}
              formatter={(value) => <span className="font-semibold tabular-nums">{formatCompact(Number(value))} views</span>}
            />
          }
        />
        <Area isAnimationActive={false} dataKey="views" type="monotone" stroke="var(--color-views)" strokeWidth={2.5} fill="url(#campaign-views-fill)" />
      </AreaChart>
    </ChartContainer>
  );
}
