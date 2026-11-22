import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { SampleNotice } from "@/components/app/sample-notice";
import { SubmitClip } from "@/components/app/submit-clip";
import { SAMPLE_NOW, sampleCampaigns, sampleRecentVideos } from "@/lib/sample-data";
import { requireSession } from "@/server/session";
import { getTikTokAccount } from "@/server/tiktok";

export const metadata: Metadata = { title: "Submit a clip — Clippifi" };

export default async function SubmitPage({ searchParams }: PageProps<"/c/submit">) {
  const { campaign } = await searchParams;
  const wanted = typeof campaign === "string" ? campaign : undefined;
  const { user } = await requireSession();
  const tiktok = await getTikTokAccount(user.id);

  // SAMPLE: joining isn't saved yet, so a campaign opened from its own page counts as joined.
  const campaigns = sampleCampaigns.filter((c) => c.state === "active" && (c.joined || c.id === wanted));

  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader title="Submit a clip" description="Pick the campaign, then the clip you just posted." />
        <SampleNotice />
      </div>
      <SubmitClip
        campaigns={campaigns}
        initialCampaignId={wanted}
        videos={sampleRecentVideos}
        tiktokConnected={Boolean(tiktok)}
        now={SAMPLE_NOW}
      />
    </>
  );
}
