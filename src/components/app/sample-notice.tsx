import { Info } from "@/components/icons";

// Marks screens that show SAMPLE data while the money loop is being designed (Phase 1).
// Remove with src/lib/sample-data.ts once screens read real data.
export function SampleNotice() {
  return (
    <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-info-muted px-3 py-1 text-fine font-medium text-info">
      <Info className="size-3.5" />
      Sample data, not real money
    </p>
  );
}
