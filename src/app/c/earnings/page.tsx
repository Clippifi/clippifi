import type { Metadata } from "next";
import { EarningsView } from "@/components/app/earnings-view";
import { PageHeader } from "@/components/app/page-header";
import { SampleNotice } from "@/components/app/sample-notice";
import {
  SAMPLE_NGN_PER_USD,
  SAMPLE_NOW,
  SAMPLE_TRANSFER_FEE_NGN,
  SAMPLE_IDENTITY_VERIFIED,
  SAMPLE_WITHDRAWALS_TODAY,
  sampleClips,
  sampleCreatorSummary,
  samplePayoutAccount,
  sampleRounds,
  sampleWithdrawals,
} from "@/lib/sample-data";

export const metadata: Metadata = { title: "Earnings — Clippifi" };

export default async function EarningsPage({ searchParams }: PageProps<"/c/earnings">) {
  // ?tab=withdrawals opens straight onto withdrawals (for links from emails and notifications).
  const { tab } = await searchParams;
  return (
    <>
      <div className="flex flex-col gap-2">
        <PageHeader title="Earnings" description="What you've earned, when it unlocks, and withdrawals to your bank." />
        <SampleNotice />
      </div>
      <EarningsView
        summary={sampleCreatorSummary}
        clips={sampleClips}
        rounds={sampleRounds}
        withdrawals={sampleWithdrawals}
        account={samplePayoutAccount}
        withdrawalsToday={SAMPLE_WITHDRAWALS_TODAY}
        identityVerified={SAMPLE_IDENTITY_VERIFIED}
        ngnPerUsd={SAMPLE_NGN_PER_USD}
        feeNaira={SAMPLE_TRANSFER_FEE_NGN}
        now={SAMPLE_NOW}
        initialTab={tab === "withdrawals" ? "withdrawals" : "unlocking"}
      />
    </>
  );
}
