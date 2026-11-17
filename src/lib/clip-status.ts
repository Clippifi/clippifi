// What a clip's state is called, explained and coloured, everywhere: the creator and the
// brand see the same label (plan → Status labels). One table, so wording never drifts.

export const CLIP_STATUSES = [
  "in_review",
  "earning",
  "clip_not_found",
  "reconnect_tiktok",
  "under_review",
  "rejected",
  "removed_early",
  "finished",
] as const;

export type ClipStatus = (typeof CLIP_STATUSES)[number];

export type ClipStatusTone = "info" | "success" | "warning" | "danger" | "neutral";

export const CLIP_STATUS: Record<
  ClipStatus,
  { label: string; explanation: string; tone: ClipStatusTone; action?: string; actionRequired?: boolean }
> = {
  in_review: {
    label: "In review",
    explanation: "Views are counting. You're paid for them once the brand approves.",
    tone: "info",
  },
  earning: {
    label: "Earning",
    explanation: "Paid per 1,000 views.",
    tone: "success",
  },
  clip_not_found: {
    label: "Clip not found",
    explanation: "Make the clip public again or its unpaid earnings go back to the campaign.",
    tone: "danger",
    action: "Check my clip",
    actionRequired: true,
  },
  reconnect_tiktok: {
    label: "Reconnect TikTok",
    explanation: "Payouts wait until you reconnect your TikTok account.",
    tone: "warning",
    action: "Reconnect",
    actionRequired: true,
  },
  under_review: {
    label: "Under review",
    explanation: "We're checking this clip. Nothing is lost yet.",
    tone: "warning",
  },
  rejected: {
    label: "Rejected",
    explanation: "The brand didn't accept this clip.",
    tone: "danger",
  },
  removed_early: {
    label: "Removed early",
    explanation: "Removed before payout. Unpaid earnings went back to the campaign.",
    tone: "neutral",
  },
  finished: {
    label: "Finished",
    explanation: "Tracking ended. Remaining payouts unlock on schedule.",
    tone: "neutral",
  },
};

// Why a submission was refused, in plain words (plan → Rejection codes).
export const REJECTION_MESSAGE = {
  post_age: "Posted more than 30 minutes before you submitted. Post a new clip and submit within 30 minutes.",
  duplicate_post: "This clip was already submitted.",
  unlinked_account: "Link the TikTok account that posted this clip.",
  oauth_required: "Link the TikTok account that posted this clip.",
  handle_reuse: "This TikTok account is linked to another Clippifi user.",
  not_a_member: "Join the campaign first.",
  campaign_not_active: "This campaign isn't taking clips right now.",
  unsupported_platform: "This campaign takes TikTok clips only.",
  review_expired: "The brand didn't review this clip in time.",
  removed_early: "The clip was removed before payout.",
} as const;

export type RejectionCode = keyof typeof REJECTION_MESSAGE;
