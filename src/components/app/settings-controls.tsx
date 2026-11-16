"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Sun } from "@/components/icons";
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

  return (
    <div className="inline-flex gap-1 rounded-lg border p-1">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          size="sm"
          variant={mounted && theme === value ? "secondary" : "ghost"}
          onClick={() => setTheme(value)}
          aria-pressed={mounted && theme === value}
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <Button
      variant="outline"
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
