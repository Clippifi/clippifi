import type { Metadata } from "next";
import { DiscoverView } from "@/components/app/discover-view";
import { PageHeader } from "@/components/app/page-header";
import { SampleNotice } from "@/components/app/sample-notice";
import { SAMPLE_NOW, sampleCampaigns } from "@/lib/sample-data";

export const metadata: Metadata = { title: "Discover — Clippifi" };

export default function DiscoverPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader title="Discover" description="Campaigns you can join. Every one pays for real, verified views." />
        <SampleNotice />
      </div>
      <DiscoverView campaigns={sampleCampaigns} now={SAMPLE_NOW} />
    </>
  );
}
