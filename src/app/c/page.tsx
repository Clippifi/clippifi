import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { TikTokIcon } from "@/components/app/platform-icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireSession } from "@/server/session";
import { getTikTokAccount } from "@/server/tiktok";

export const metadata: Metadata = { title: "Home — Clippifi" };

export default async function HomePage() {
  const { user } = await requireSession();
  const tiktok = await getTikTokAccount(user.id);
  const firstName = user.name?.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome, ${firstName}` : "Welcome to Clippifi"}
        description="Post clips for brands and get paid for every verified view."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {!tiktok && (
          <Card>
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-foreground text-background">
                <TikTokIcon className="size-5" />
              </div>
              <CardTitle>Connect your TikTok</CardTitle>
              <CardDescription>
                Link the TikTok account you post from. We use it to confirm the clips are yours and to count their
                views.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href="/c/connections">
                  Connect TikTok
                  <ArrowRight />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        )}
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-brand/15 text-brand-600">
              <Megaphone className="size-5" />
            </div>
            <CardTitle>Campaigns are coming</CardTitle>
            <CardDescription>
              Brands are setting up their first campaigns. You&apos;ll be able to browse them here and submit your
              clips.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </>
  );
}
