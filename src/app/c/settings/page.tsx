import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { SignOutButton, ThemeChooser } from "@/components/app/settings-controls";
import { UserAvatar } from "@/components/app/user-avatar";
import Link from "next/link";
import { IconTile } from "@/components/app/icon-tile";
import { TikTokIcon } from "@/components/app/platform-icons";
import { ChevronRight } from "@/components/icons";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Settings — Clippifi" };

export default async function SettingsPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader title="Settings" description="Your account and how Clippifi looks on this device." />
      <div className="grid max-w-2xl gap-4">
        <SettingsSection title="Account" description="You sign in with this email, using a code or Google.">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-inner bg-muted p-3">
            <div className="flex min-w-0 items-center gap-3">
              <UserAvatar user={user} className="size-11" />
              <div className="min-w-0">
                <p className="truncate text-body font-semibold">{user.name || "No name yet"}</p>
                <p className="truncate text-caption text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <SignOutButton />
          </div>
        </SettingsSection>
        <SettingsSection title="Connections" description="The accounts you post from. We only read your profile and videos.">
          <Link
            href="/c/connections"
            className="group flex items-center gap-3 rounded-inner bg-muted p-3 transition-colors hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]"
          >
            <IconTile size="sm" className="bg-[#161616] text-white">
              <TikTokIcon />
            </IconTile>
            <span className="flex-1 text-body font-medium">TikTok, Instagram and YouTube</span>
            <ChevronRight className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </Link>
        </SettingsSection>
        <SettingsSection title="Appearance" description="Follow your device, or pick light or dark.">
          <ThemeChooser />
        </SettingsSection>
      </div>
    </>
  );
}

function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-card bg-card p-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="text-small leading-5 text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
