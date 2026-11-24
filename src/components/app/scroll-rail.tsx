"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// A titled, sideways-scrolling row of cards for full-width pages (DESIGN.md → Rails).
// Every screen size scrolls; cards run off the right edge to show there's more.
// Phones swipe; larger screens also get ← → buttons that page by one screen of cards.
export function ScrollRail({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const page = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });
  const scrollable = !(edges.start && edges.end);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-[18px] sm:text-[20px] leading-7 font-bold tracking-[-0.02em]">{title}</h2>
          {subtitle && <p className="text-small text-muted-foreground">{subtitle}</p>}
        </div>
        {scrollable && (
          <div className="hidden shrink-0 gap-1 sm:flex">
            <Button variant="outline" size="icon-sm" aria-label="Scroll back" disabled={edges.start} onClick={() => page(-1)}>
              <ArrowLeft />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label="Scroll forward" disabled={edges.end} onClick={() => page(1)}>
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
      <div
        ref={ref}
        onScroll={update}
        className={cn(
          // Bleed to the screen edges so cards slide under them, not under the page padding.
          "no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1 md:-mx-8 md:scroll-px-8 md:px-8",
          "[&>*]:w-[80%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[360px]",
        )}
      >
        {children}
      </div>
    </section>
  );
}
