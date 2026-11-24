"use client";

import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useReducedMotion } from "motion/react";
import { FeaturedCampaign } from "@/components/app/featured-campaign";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import type { Campaign } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const DELAY = 6000;

// Featured campaigns at the top of Discover. It moves on by itself every 6 seconds and pauses
// while you hover, swipe or focus it; when you let go it starts the current slide's 6 seconds
// (and its progress fill) again from the beginning. It never moves for people who turn motion
// off, and the next campaign always peeks in so nothing feels hidden.
//
// stopOnInteraction must stay false: with it on, the autoplay plugin never listens for the
// mouse leaving, so one hover stopped the carousel for good.
export function FeaturedCarousel({ campaigns }: { campaigns: Campaign[] }) {
  const reduceMotion = useReducedMotion();
  const [autoplay] = useState(() => Autoplay({ delay: DELAY, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true }));
  const [api, setApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(0); // restarts the dot's fill whenever the timer restarts

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelected(api.selectedScrollSnap());
      setRound((r) => r + 1);
    };
    const onPlay = () => {
      setPlaying(true);
      setRound((r) => r + 1);
    };
    const onStop = () => setPlaying(false);
    // Sync once Embla is ready (next frame), then follow its events.
    const frame = requestAnimationFrame(() => {
      onSelect();
      setPlaying(Boolean(api.plugins().autoplay?.isPlaying()));
    });
    api.on("select", onSelect);
    api.on("autoplay:play", onPlay);
    api.on("autoplay:stop", onStop);
    return () => {
      cancelAnimationFrame(frame);
      api.off("select", onSelect);
      api.off("autoplay:play", onPlay);
      api.off("autoplay:stop", onStop);
    };
  }, [api]);

  // Dots and arrows sit outside the slides, so moving with them doesn't pause autoplay. Restart its
  // timer so the next slide waits a full 6 seconds, in step with the fill that restarts on select.
  const go = (move: (api: NonNullable<CarouselApi>) => void) => {
    if (!api) return;
    move(api);
    api.plugins().autoplay?.reset();
  };

  if (campaigns.length === 1) return <FeaturedCampaign campaign={campaigns[0]} />;

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true, align: "start" }}
      plugins={reduceMotion ? [] : [autoplay]}
      aria-label="Featured campaigns"
      className="flex flex-col gap-3"
    >
      <CarouselContent className="-ml-3 sm:-ml-4">
        {campaigns.map((campaign, i) => (
          <CarouselItem
            key={campaign.id}
            aria-label={`${i + 1} of ${campaigns.length}`}
            className={cn(
              "basis-[96%] pl-3 transition-opacity duration-300 sm:basis-[88%] sm:pl-4",
              i === selected ? "opacity-100" : "opacity-55",
            )}
          >
            <FeaturedCampaign campaign={campaign} />
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5">
          {campaigns.map((campaign, i) => (
            <button
              key={campaign.id}
              type="button"
              onClick={() => go((a) => a.scrollTo(i))}
              aria-label={`Show featured campaign ${i + 1}: ${campaign.title}`}
              aria-current={i === selected}
              className={cn(
                "relative h-2 overflow-hidden rounded-full bg-foreground/15 transition-[width,background-color] duration-300 outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                i === selected ? "w-8" : "w-2 hover:bg-foreground/30",
              )}
            >
              {i === selected && (
                <span
                  key={`${i}-${round}`}
                  aria-hidden
                  className="absolute inset-0 origin-left rounded-full bg-foreground"
                  // Freezes where it is while paused (hover, swipe, focus); a new play starts a
                  // new round, so the fill restarts from empty when you let go.
                  style={
                    reduceMotion
                      ? undefined
                      : { animation: `featured-progress ${DELAY}ms linear forwards`, animationPlayState: playing ? "running" : "paused" }
                  }
                />
              )}
            </button>
          ))}
        </div>
        <div className="hidden gap-1 sm:flex">
          <Button variant="outline" size="icon-sm" aria-label="Previous featured campaign" onClick={() => go((a) => a.scrollPrev())}>
            <ArrowLeft />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label="Next featured campaign" onClick={() => go((a) => a.scrollNext())}>
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Carousel>
  );
}
