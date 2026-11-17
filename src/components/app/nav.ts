import { Clapperboard, Compass, Home, Settings, Wallet } from "@/components/icons";

// The creator app's sections, shared by the desktop sidebar and the phone tab bar.
export const creatorNav = [
  { title: "Home", href: "/c", icon: Home },
  { title: "Discover", href: "/c/campaigns", icon: Compass },
  { title: "My clips", href: "/c/clips", icon: Clapperboard },
  { title: "Earnings", href: "/c/earnings", icon: Wallet },
  { title: "Settings", href: "/c/settings", icon: Settings },
];

export function isActive(href: string, pathname: string) {
  if (href === "/c") return pathname === "/c";
  // Connections lives under Settings.
  if (href === "/c/settings") return pathname.startsWith("/c/settings") || pathname.startsWith("/c/connections");
  return pathname.startsWith(href);
}
