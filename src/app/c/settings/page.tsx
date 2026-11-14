import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { SignOutButton, ThemeChooser } from "@/components/app/settings-controls";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Settings — Clippifi" };

export default async function SettingsPage() {
  const { user } = await requireSession();

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid max-w-2xl gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>You sign in with this email, using a code or Google.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{user.name || "No name yet"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <SignOutButton />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Follow your device, or pick light or dark.</CardDescription>
          </CardHeader>
          <CardContent>
            <ThemeChooser />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
