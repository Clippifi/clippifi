import type { Metadata } from "next";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Wallet } from "@/components/icons";

export const metadata: Metadata = { title: "Earnings — Clippifi" };

// Placeholder until this screen is designed in D3.
export default function Page() {
  return (
    <>
      <PageHeader title="Earnings" description="What you've earned, when it unlocks, and withdrawals to your bank." />
      <div className="rounded-3xl bg-card">
        <EmptyState icon={<Wallet />} title="Being designed" description="This screen arrives in the next design batch (D3)." />
      </div>
    </>
  );
}
