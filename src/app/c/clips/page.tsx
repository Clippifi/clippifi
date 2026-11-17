import type { Metadata } from "next";
import { EmptyState } from "@/components/app/empty-state";
import { PageHeader } from "@/components/app/page-header";
import { Clapperboard } from "@/components/icons";

export const metadata: Metadata = { title: "My clips — Clippifi" };

// Placeholder until this screen is designed in D3.
export default function Page() {
  return (
    <>
      <PageHeader title="My clips" description="Every clip you've submitted, its views and what it earned." />
      <div className="rounded-3xl bg-card">
        <EmptyState icon={<Clapperboard />} title="Being designed" description="This screen arrives in the next design batch (D3)." />
      </div>
    </>
  );
}
