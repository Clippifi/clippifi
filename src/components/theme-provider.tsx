"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

// Inside the app (/c, and the old /dashboard and /admin) the theme follows the system,
// with a switch in settings. The public site (landing, legal, sign-in) is always light.
const APP_ROUTES = /^\/(c|dashboard|admin)(\/|$)/;

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="clippifi-theme"
      disableTransitionOnChange
      forcedTheme={APP_ROUTES.test(pathname) ? undefined : "light"}
      {...props}
    />
  );
}
