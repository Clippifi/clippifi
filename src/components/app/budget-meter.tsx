import { formatUSDCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

// How much of a campaign's budget is used: "$1.5K / $4K" and a yellow bar on a soft track.
export function BudgetMeter({
  spentCents,
  budgetCents,
  showLabel = true,
  className,
}: {
  spentCents: number;
  budgetCents: number;
  showLabel?: boolean;
  className?: string;
}) {
  const pct = budgetCents > 0 ? Math.min(100, Math.round((spentCents / budgetCents) * 100)) : 0;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {showLabel && (
        <p className="text-[14px] tabular-nums">
          <span className="font-semibold">{formatUSDCompact(spentCents)}</span>
          <span className="text-muted-foreground"> / {formatUSDCompact(budgetCents)}</span>
        </p>
      )}
      <div
        role="meter"
        aria-label="Budget used"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}
