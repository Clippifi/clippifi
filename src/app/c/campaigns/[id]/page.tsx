import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CampaignDetail } from "@/components/app/campaign-detail";
import { getSampleCampaign, getSampleProof, SAMPLE_NOW } from "@/lib/sample-data";
import { requireSession } from "@/server/session";
import { getTikTokAccount } from "@/server/tiktok";

export async function generateMetadata({ params }: PageProps<"/c/campaigns/[id]">): Promise<Metadata> {
  const { id } = await params;
  const campaign = getSampleCampaign(id);
  return { title: campaign ? `${campaign.title} — Clippifi` : "Campaign — Clippifi" };
}

export default async function CampaignPage({ params }: PageProps<"/c/campaigns/[id]">) {
  const { id } = await params;
  const campaign = getSampleCampaign(id);
  if (!campaign) notFound();

  const { user } = await requireSession();
  const tiktok = await getTikTokAccount(user.id);

  return <CampaignDetail campaign={campaign} proof={getSampleProof(campaign)} tiktokConnected={Boolean(tiktok)} now={SAMPLE_NOW} />;
}
