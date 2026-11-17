import { AlertCircle, CheckCircle, Info, Timer, Warning, ErrorCircle } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { CLIP_STATUS, type ClipStatus } from "@/lib/clip-status";

// A clip's status as a chip: icon plus word, coloured by meaning (never colour alone).
const toneToVariant = { info: "info", success: "success", warning: "warning", danger: "destructive", neutral: "secondary" } as const;

const statusIcon: Record<ClipStatus, React.ComponentType<{ className?: string }>> = {
  in_review: Timer,
  earning: CheckCircle,
  clip_not_found: AlertCircle,
  reconnect_tiktok: Warning,
  under_review: Info,
  rejected: ErrorCircle,
  removed_early: ErrorCircle,
  finished: CheckCircle,
};

export function ClipStatusChip({ status }: { status: ClipStatus }) {
  const { label, tone } = CLIP_STATUS[status];
  const Icon = statusIcon[status];
  return (
    <Badge variant={toneToVariant[tone]}>
      <Icon />
      {label}
    </Badge>
  );
}
