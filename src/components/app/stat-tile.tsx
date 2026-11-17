import { IconTile } from "@/components/app/icon-tile";
import { cn } from "@/lib/utils";

// One number, its label and a tinted filled icon. Four in a row on desktop, 2×2 on phones.
export function StatTile({
  icon,
  tone,
  value,
  label,
  className,
}: {
  icon: React.ReactNode;
  tone: "brand" | "success" | "info" | "muted";
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl bg-muted/70 p-3", className)}>
      <IconTile tone={tone === "muted" ? "muted" : tone} size="sm" className={tone === "muted" ? "bg-card" : undefined}>
        {icon}
      </IconTile>
      <div className="min-w-0">
        <p className="truncate text-[17px] leading-6 font-semibold tracking-[-0.01em] tabular-nums">{value}</p>
        <p className="truncate text-[13px] leading-[18px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function StatTiles({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{children}</div>;
}
