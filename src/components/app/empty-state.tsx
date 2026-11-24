import { cn } from "@/lib/utils";

// What a list shows before it has anything: a solid brand circle with a filled icon,
// a bold title, one muted line saying what to do next, and at most one action
// (DESIGN.md → Empty states).
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <span className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground [&_svg]:size-7">
        {icon}
      </span>
      <h3 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">{title}</h3>
      <p className="mt-1 max-w-sm text-small leading-5 text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
