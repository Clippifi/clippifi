import RequireAuth from "@/components/dashboard/RequireAuth";
import BrandCampaignDetailContent from "./BrandCampaignDetailContent";

export default function BrandCampaignDetailPage() {
  return (
    <RequireAuth area="brand">
      <BrandCampaignDetailContent />
    </RequireAuth>
  );
}
