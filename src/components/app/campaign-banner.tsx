import { cn } from "@/lib/utils";

// Campaign artwork. Until brands upload real banners, this draws a plain one from the
// campaign's colours: a gradient and soft discs, no text (the title sits below it). 16:9.
export function CampaignBanner({
  banner,
  className,
  children,
}: {
  banner: { from: string; to: string };
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
      {children}
    </div>
  );
}
