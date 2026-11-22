import { Progress } from "@/components/animate-ui/components/radix/progress";
import { budgetUsedPercent } from "@/lib/campaign-math";
import { formatUSDCompact } from "@/lib/format";
import { cn } from "@/lib/utils";

// How much of a campaign's pool has been paid out: "$1.5K / $4K" above the bar.
// `aside` sits on the same line as the amounts, at the right (the card's rate and creators).
export function BudgetMeter({
  spentCents,
  budgetCents,
  aside,
  className,
}: {
  spentCents: number;
  budgetCents: number;
  aside?: React.ReactNode;
  className?: string;
}) {
  const pct = budgetUsedPercent({ spentCents, budgetCents });
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="shrink-0 text-[14px] whitespace-nowrap tabular-nums">
          <span className="font-semibold">{formatUSDCompact(spentCents)}</span>
          <span className="text-muted-foreground"> / {formatUSDCompact(budgetCents)}</span>
        </p>
        {aside}
      </div>
      <Progress value={pct > 0 ? Math.max(pct, 3) : 0} aria-label="Budget paid out" />
    </div>
  );
}
