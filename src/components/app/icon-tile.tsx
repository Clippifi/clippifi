import { cn } from "@/lib/utils";

// A filled icon on a soft rounded square (DESIGN.md → Icon tiles). Use it to lead a
// card, a list row or a stat. Tones: brand (yellow), ink (charcoal), and the meaning
// colours; platform tiles pass their own className (e.g. the TikTok black).
const tones = {
  brand: "bg-brand text-brand-foreground",
  ink: "bg-primary text-primary-foreground",
  muted: "bg-muted text-foreground",
  success: "bg-success-muted text-success",
  warning: "bg-warning-muted text-warning",
  info: "bg-info-muted text-info",
  danger: "bg-destructive-muted text-destructive",
} as const;

const sizes = {
  sm: "size-9 rounded-thumb [&_svg]:size-[18px]",
  md: "size-11 rounded-inner [&_svg]:size-[22px]",
  lg: "size-14 rounded-inner [&_svg]:size-7",
} as const;

export function IconTile({
  tone = "muted",
  size = "md",
  className,
  children,
}: {
  tone?: keyof typeof tones;
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center", sizes[size], tones[tone], className)}>
      {children}
    </span>
  );
}
