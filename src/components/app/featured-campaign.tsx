import Link from "next/link";
import { BrandMark } from "@/components/app/campaign-card";
import { ArrowRight, SealCheck } from "@/components/icons";
import { formatRate, formatUSDCompact } from "@/lib/format";
import { bestRateCents, ratesDiffer } from "@/lib/campaign-math";
import type { Campaign } from "@/lib/sample-data";

const TYPE_LABEL = { clipping: "Clipping", ugc: "UGC", sound: "Sound", logo: "Logo" } as const;

// One featured campaign at the top of Discover: a single, clear call to action instead
// of an auto-rotating carousel (carousels hide content and are hard to use on phones).
export function FeaturedCampaign({ campaign }: { campaign: Campaign }) {
  return (
    <Link
      href={`/c/campaigns/${campaign.id}`}
      className="group relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl p-5 text-white outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:min-h-[320px] sm:p-8 lg:min-h-[380px] lg:p-10"
      style={{ backgroundImage: `linear-gradient(135deg, ${campaign.banner.from} 0%, ${campaign.banner.to} 100%)` }}
    >
      <span className="absolute -right-16 -top-20 size-72 rounded-full bg-white/10 transition-transform duration-500 ease-out group-hover:scale-105" />
      <span className="absolute -bottom-24 right-24 size-56 rounded-full bg-black/10" />
      <div className="relative flex max-w-xl flex-col gap-3">
        <span className="flex items-center gap-2 text-[13px] font-medium text-white/85">
          <BrandMark hue={campaign.brand.hue} className="ring-2 ring-white/30" />
          {campaign.brand.name}
          {campaign.brand.verified && <SealCheck className="size-4" aria-label="Verified brand" />}
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase">Featured</span>
        </span>
        <h2 className="text-[24px] leading-[30px] font-bold tracking-[-0.02em] text-balance sm:text-[30px] sm:leading-9 lg:text-[36px] lg:leading-[42px]">
          {campaign.title}
        </h2>
        <p className="text-[15px] text-white/80 tabular-nums">
          {TYPE_LABEL[campaign.type]} · <span className="font-semibold text-brand">{ratesDiffer(campaign) ? "Up to " : ""}{formatRate(bestRateCents(campaign))}</span> ·{" "}
          {formatUSDCompact(campaign.spentCents)} / {formatUSDCompact(campaign.budgetCents)}
        </p>
        <span className="mt-1 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-white px-5 text-[15px] font-medium text-[#252525] transition-transform duration-150 group-active:scale-[0.97]">
          View campaign
          <ArrowRight />
        </span>
      </div>
    </Link>
  );
}
