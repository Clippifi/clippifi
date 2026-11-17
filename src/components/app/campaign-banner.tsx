import { cn } from "@/lib/utils";

// Campaign artwork. Until brands upload real banners, this draws one from the campaign's
// colours and headline: a gradient, soft discs and big type. 16:9 like real banners.
export function CampaignBanner({
  banner,
  className,
  children,
}: {
  banner: { headline: string; tagline: string; from: string; to: string };
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn("relative aspect-video overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${banner.from} 0%, ${banner.to} 100%)` }}
    >
      <span className="absolute -right-10 -top-12 size-48 rounded-full bg-white/10" />
      <span className="absolute -bottom-16 right-16 size-40 rounded-full bg-black/10" />
      <div className="absolute inset-x-5 bottom-4 text-white">
        <p className="text-[26px] leading-none font-black tracking-[-0.03em] uppercase drop-shadow-sm sm:text-[30px]">
          {banner.headline}
        </p>
        <p className="mt-1.5 text-[12px] font-medium tracking-wide text-white/75 uppercase">{banner.tagline}</p>
      </div>
      {children}
    </div>
  );
}
