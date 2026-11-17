import type { Metadata } from "next";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Compass } from "@/components/icons";

export const metadata: Metadata = { title: "Discover — Clippifi" };

// Placeholder until this screen is designed in D2.
export default function Page() {
  return (
    <>
      <PageHeader title="Discover" description="Campaigns you can join, paid for every 1,000 verified views." />
      <div className="rounded-3xl bg-card">
        <EmptyState icon={<Compass />} title="Being designed" description="This screen arrives in the next design batch (D2)." />
      </div>
    </>
  );
}
