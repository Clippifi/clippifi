import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Megaphone } from "@/components/icons";
import { IconTile } from "@/components/app/icon-tile";
import { PageHeader } from "@/components/app/page-header";
import { TikTokIcon } from "@/components/app/platform-icons";
import { Button } from "@/components/ui/button";
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
          <HomeCard
            tile={<IconTile className="bg-[#161616] text-white"><TikTokIcon /></IconTile>}
            title="Connect your TikTok"
            description="Link the account you post from. We use it to confirm your clips are yours and to count their views."
            action={
              <Button variant="brand" asChild>
                <Link href="/c/connections">
                  Connect TikTok
                  <ArrowRight />
                </Link>
              </Button>
            }
          />
        )}
        <HomeCard
          tile={<IconTile tone="brand"><Megaphone /></IconTile>}
          title="Campaigns are coming"
          description="Brands are setting up their first campaigns. You'll browse them here and submit your clips."
        />
      </div>
    </>
  );
}

function HomeCard({
  tile,
  title,
  description,
  action,
}: {
  tile: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-card p-5">
      {tile}
      <div className="flex flex-col gap-1">
        <h2 className="text-[17px] leading-6 font-semibold tracking-[-0.01em]">{title}</h2>
        <p className="text-[14px] leading-5 text-muted-foreground">{description}</p>
      </div>
      {action && <div className="mt-auto pt-1">{action}</div>}
    </section>
  );
}
