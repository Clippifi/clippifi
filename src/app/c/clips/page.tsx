import type { Metadata } from "next";
import Link from "next/link";
import { ClipsView } from "@/components/app/clips-view";
import { PageHeader } from "@/components/app/page-header";
import { SampleNotice } from "@/components/app/sample-notice";
import { Upload } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SAMPLE_NOW, sampleClips } from "@/lib/sample-data";

export const metadata: Metadata = { title: "My clips — Clippifi" };

export default function ClipsPage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-4">
          <PageHeader title="My clips" description="Every clip you've submitted, its views and what it earned." />
          <Button variant="brand" asChild className="hidden shrink-0 sm:inline-flex">
            <Link href="/c/submit">
              <Upload />
              Submit a clip
            </Link>
          </Button>
        </div>
        <SampleNotice />
      </div>
      <Button variant="brand" asChild className="w-full sm:hidden">
        <Link href="/c/submit">
          <Upload />
          Submit a clip
        </Link>
      </Button>
      <ClipsView clips={sampleClips} now={SAMPLE_NOW} />
    </>
  );
}
