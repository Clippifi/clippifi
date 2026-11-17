import { cn } from "@/lib/utils";

// The hero card of Home and Earnings: a label, the big money figure, an optional naira
// estimate, its action on the right, and supporting stats below.
export function MoneyHero({
  label,
  amount,
  estimate,
  action,
  children,
  className,
}: {
  label: string;
  amount: string;
  estimate?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-5 rounded-3xl bg-card p-5 sm:p-6", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-4 [&>*:last-child:not(:first-child)]:shrink-0">
        <div className="min-w-0">
          <p className="text-[14px] font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-[34px] leading-[40px] font-semibold tracking-[-0.03em] tabular-nums sm:text-[40px] sm:leading-[44px]">{amount}</p>
          {estimate && <p className="mt-1 text-[13px] text-muted-foreground tabular-nums">{estimate}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
