"use client";

import Link from "next/link";
import { creatorNav, isActive } from "@/components/app/nav";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Menu } from "@/components/icons";
import { useSidebar } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

// Phone navigation (DESIGN.md → Mobile nav): a floating glass pill detached from the screen
// edge (translucent fill, strong blur and saturation, a thin light edge and a top highlight),
// the active item's icon in a soft circle that slides. The last button opens the sidebar as a
// drawer, for people who prefer the full list with names.

export function MobileTabBar() {
  const pathname = usePathname();
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="relative flex items-center gap-1 rounded-full bg-card/75 p-1.5 shadow-[0_8px_32px_rgb(0_0_0/0.14),0_1px_3px_rgb(0_0_0/0.08),inset_0_1px_0_rgb(255_255_255/0.55)] ring-1 ring-white/50 backdrop-blur-2xl backdrop-saturate-150 dark:bg-card/65 dark:shadow-[0_8px_32px_rgb(0_0_0/0.45),inset_0_1px_0_rgb(255_255_255/0.08)] dark:ring-white/10">
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
                    className="absolute inset-0 rounded-full bg-foreground/10 dark:bg-white/12"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <Icon className="relative size-[22px]" />
              </Link>
            </li>
          );
        })}
        <li aria-hidden className="mx-0.5 h-6 w-px bg-foreground/12" />
        <li>
          <button
            type="button"
            onClick={() => setOpenMobile(true)}
            aria-label="Open menu"
            aria-expanded={openMobile}
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-150 active:text-foreground"
          >
            <Menu className="size-[22px]" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
