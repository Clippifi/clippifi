"use client";

import Link from "next/link";
import { creatorNav, isActive } from "@/components/app/nav";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

// Phone navigation (DESIGN.md → Mobile nav): a floating pill detached from the screen
// edge, blurred background, the active item's icon in a grey circle that slides.

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="flex items-center gap-1 rounded-full bg-card/80 p-1.5 shadow-[0_8px_30px_rgb(0_0_0/0.12),0_1px_3px_rgb(0_0_0/0.08)] backdrop-blur-xl">
        {creatorNav.map(({ title, href, icon: Icon }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={title}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-full transition-colors duration-150",
                  active ? "text-foreground" : "text-muted-foreground active:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-tab-active"
                    className="absolute inset-0 rounded-full bg-muted"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <Icon className="relative size-[22px]" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
