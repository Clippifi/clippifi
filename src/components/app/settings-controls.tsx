"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Sun } from "@/components/icons";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const themes = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

// True only after hydration, so the selected theme (stored in the browser) never
// mismatches the server-rendered markup.
const subscribeNoop = () => () => {};
function useMounted() {
  return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

export function ThemeChooser() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  // Segmented pill with a sliding highlight (Animate UI tabs).
  return (
    <Tabs value={mounted ? (theme ?? "system") : "system"} onValueChange={setTheme}>
      <TabsList aria-label="Appearance">
        {themes.map(({ value, label, icon: Icon }) => (
          <TabsTrigger key={value} value={value}>
            <Icon className="size-4" />
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
      }}
    >
      <LogOut />
      Sign out
    </Button>
  );
}
