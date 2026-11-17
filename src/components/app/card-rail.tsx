import { cn } from "@/lib/utils";

// A row of cards (DESIGN.md → Rails). Phones: one swipeable row that peeks the next
// card, so a list never stacks into a screen-long column. Wider screens: a grid.
export function CardRail({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1",
        "sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3",
        "[&>*]:w-[80%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}
