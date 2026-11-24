import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/app/page-header";
import { PayoutAccountForm } from "@/components/app/payout-account-form";
import { SampleNotice } from "@/components/app/sample-notice";
import { ChevronRight } from "@/components/icons";
import { NIGERIAN_BANKS, SAMPLE_NOW, samplePayoutAccount } from "@/lib/sample-data";
import { requireSession } from "@/server/session";

export const metadata: Metadata = { title: "Payout account — Clippifi" };

export default async function PayoutAccountPage() {
  const { user } = await requireSession();
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link href="/c/earnings" className="flex w-fit items-center gap-1 text-small font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ChevronRight className="size-4 rotate-180" />
          Earnings
        </Link>
        <PageHeader title="Payout account" description="Where your withdrawals go. Only you can change it." />
        <SampleNotice />
      </div>
      <PayoutAccountForm banks={NIGERIAN_BANKS} email={user.email} currentPayoutName={samplePayoutAccount?.accountName ?? null} now={SAMPLE_NOW} />
    </div>
  );
}
