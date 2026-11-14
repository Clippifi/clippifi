import RequireAuth from "@/components/dashboard/RequireAuth";
import CreatorCampaignDetailContent from "./CreatorCampaignDetailContent";

export default function CreatorCampaignDetailPage() {
  return (
    <RequireAuth area="creator">
      <CreatorCampaignDetailContent />
    </RequireAuth>
  );
}
