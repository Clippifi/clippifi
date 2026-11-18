import Link from "next/link";
import { BrandMark } from "@/components/app/campaign-card";
import { SealCheck } from "@/components/icons";
import { formatRate, formatUSDCompact } from "@/lib/format";
import { bestRateCents, ratesDiffer } from "@/lib/campaign-math";
import type { Campaign } from "@/lib/sample-data";

const TYPE_LABEL = { clipping: "Clipping", ugc: "UGC", sound: "Sound", logo: "Logo" } as const;

// One featured campaign: a slide in the featured carousel at the top of Discover.
export function FeaturedCampaign({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className="group relative flex h-full min-h-[380px] flex-col justify-end overflow-hidden rounded-card p-5 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:min-h-[420px] sm:p-8 md:min-h-[460px] md:p-10 lg:min-h-[500px] lg:p-12"
      style={{ backgroundImage: `linear-gradient(135deg, ${campaign.banner.from} 0%, ${campaign.banner.to} 100%)` }}
    >
      <span className="absolute -right-16 -top-20 size-72 rounded-full bg-white/10 transition-transform duration-500 ease-out group-hover:scale-105" />
      <span className="absolute -bottom-24 right-24 size-56 rounded-full bg-black/10" />
      <div className="relative flex max-w-xl flex-col gap-2.5 sm:gap-3">
        <span className="flex items-center gap-2 text-[12px] font-medium text-white/85 sm:text-[13px]">
          <BrandMark hue={campaign.brand.hue} className="ring-2 ring-white/30" />
          {campaign.brand.name}
          {campaign.brand.verified && <SealCheck className="size-4" aria-label="Verified brand" />}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">Featured</span>
        </span>
        <h2 className="text-[20px] leading-[26px] font-bold tracking-[-0.02em] text-balance sm:text-[30px] sm:leading-9 md:text-[34px] md:leading-10 lg:text-[36px] lg:leading-[42px]">
          {campaign.title}
        </h2>
        <p className="text-[13px] leading-[19px] text-white/80 tabular-nums sm:text-[15px] sm:leading-[22px]">
          {TYPE_LABEL[campaign.type]} · <span className="font-semibold text-brand">{ratesDiffer(campaign) ? "Up to " : ""}{formatRate(bestRateCents(campaign))}</span> ·{" "}
          {formatUSDCompact(campaign.spentCents)} / {formatUSDCompact(campaign.budgetCents)}
        </p>
        <span className="mt-1 inline-flex h-9 w-fit items-center rounded-full bg-white px-4 text-[14px] font-medium sm:h-10 sm:px-5 sm:text-[15px] text-[#252525] transition-transform duration-150 group-active:scale-[0.97]">
          View campaign
        </span>
      </div>
    </Link>
  );
}
