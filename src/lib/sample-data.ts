// SAMPLE DATA for designing the money-loop screens before the engine exists (Phase 1).
// Every brand, person and number here is made up. The shapes match what the real
// queries will return, so Phase 2 swaps the source, not the screens. Delete this file
// once the last screen reads real data.

import type { ClipStatus } from "@/lib/clip-status";

export type CampaignType = "clipping" | "sound" | "logo" | "ugc";
export type Platform = "tiktok" | "instagram" | "youtube";
export type CampaignState = "active" | "submissions_paused" | "ended" | "budget_exhausted";

/** What one platform pays on a campaign. Brands set these per campaign, per platform. */
export type PlatformRate = {
  rateCents: number; // per 1,000 verified views
  minPayoutCents: number;
  maxPerClipCents: number;
};

export type Campaign = {
  id: string;
  brand: { name: string; verified: boolean; hue: number };
  title: string;
  brief: string;
  type: CampaignType;
  platforms: Platform[];
  state: CampaignState;
  rates: Partial<Record<Platform, PlatformRate>>;
  budgetCents: number;
  spentCents: number;
  creators: number;
  maxPerCreatorCents: number;
  launchedAt: Date;
  fastReview: boolean;
  banner: { from: string; to: string };
  rules: string[];
  referenceFiles: number;
  joined: boolean;
};

export type Clip = {
  id: string;
  campaignId: string;
  title: string;
  coverHue: number;
  postedAt: Date;
  submittedAt: Date;
  status: ClipStatus;
  views: number;
  earnedCents: number;
  keepLiveUntil: Date;
};

export type RoundState = "accruing" | "holding" | "settled" | "reversed" | "waiting";

export type EarningRound = {
  id: string;
  clipId: string;
  index: number;
  startsAt: Date;
  endsAt: Date;
  availableOn: Date;
  amountCents: number;
  state: RoundState;
  blockedReason?: string;
};

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-11-17T12:00:00Z");
const ago = (days: number, hours = 0) => new Date(now.getTime() - days * DAY - hours * 60 * 60 * 1000);
const ahead = (days: number) => new Date(now.getTime() + days * DAY);

export const SAMPLE_NOW = now;
export const SAMPLE_NGN_PER_USD = 1500;

export const sampleCampaigns: Campaign[] = [
  {
    id: "studio-nine-s4",
    brand: { name: "Studio Nine", verified: true, hue: 262 },
    title: "Clip the Founders Podcast, season 4",
    brief:
      "Cut the sharpest 30–60 second moments from season 4 of the Founders Podcast. Hook in the first second, captions on, and end on the guest's punchline.",
    type: "clipping",
    platforms: ["tiktok", "instagram"],
    state: "active",
    rates: {
      tiktok: { rateCents: 150, minPayoutCents: 200, maxPerClipCents: 10000 },
      instagram: { rateCents: 120, minPayoutCents: 200, maxPerClipCents: 10000 },
    },
    budgetCents: 400000,
    spentCents: 146900,
    creators: 36,
    maxPerCreatorCents: 50000,
    launchedAt: ago(3),
    fastReview: true,
    banner: { from: "#2b1d4f", to: "#6b4fd8" },
    rules: ["Captions on every clip", "Tag @studionine in the caption", "No other podcast's footage"],
    referenceFiles: 3,
    joined: true,
  },
  {
    id: "kicks-daily-drop",
    brand: { name: "Kicks Daily", verified: true, hue: 18 },
    title: "Lagos sneaker drop: unboxing reactions",
    brief:
      "Film your honest first reaction to the new Kicks Daily drop. Show the box, the shoe and your face. Keep it under 45 seconds.",
    type: "ugc",
    platforms: ["tiktok"],
    state: "active",
    rates: {
      tiktok: { rateCents: 200, minPayoutCents: 300, maxPerClipCents: 15000 },
    },
    budgetCents: 250000,
    spentCents: 62800,
    creators: 13,
    maxPerCreatorCents: 60000,
    launchedAt: ago(9),
    fastReview: false,
    banner: { from: "#3a1708", to: "#e2572b" },
    rules: ["Your face on camera", "Say the shoe's name", "Post from a personal account"],
    referenceFiles: 1,
    joined: false,
  },
  {
    id: "sound-on-single",
    brand: { name: "Sound On Records", verified: false, hue: 152 },
    title: "Use the new single 'Midnight Danfo'",
    brief:
      "Post any trend, dance or skit that uses 'Midnight Danfo' as the sound. The track must play for at least 10 seconds.",
    type: "sound",
    platforms: ["tiktok"],
    state: "active",
    rates: {
      tiktok: { rateCents: 100, minPayoutCents: 100, maxPerClipCents: 5000 },
    },
    budgetCents: 150000,
    spentCents: 14100,
    creators: 54,
    maxPerCreatorCents: 20000,
    launchedAt: ago(1),
    fastReview: true,
    banner: { from: "#06261c", to: "#1f9d6b" },
    rules: ["Use the official sound", "Sound plays 10+ seconds", "No explicit content"],
    referenceFiles: 2,
    joined: false,
  },
  {
    id: "pagewell-logo",
    brand: { name: "Pagewell", verified: true, hue: 210 },
    title: "Study-with-me videos with the Pagewell logo",
    brief:
      "Add the Pagewell watermark to your study, productivity or exam-prep videos. Keep it visible in a corner for the whole clip.",
    type: "logo",
    platforms: ["tiktok", "youtube"],
    state: "submissions_paused",
    rates: {
      tiktok: { rateCents: 80, minPayoutCents: 100, maxPerClipCents: 4000 },
      youtube: { rateCents: 40, minPayoutCents: 100, maxPerClipCents: 4000 },
    },
    budgetCents: 100000,
    spentCents: 81200,
    creators: 22,
    maxPerCreatorCents: 15000,
    launchedAt: ago(16),
    fastReview: false,
    banner: { from: "#0b2440", to: "#3a86d8" },
    rules: ["Watermark visible all clip", "Study or productivity topics only"],
    referenceFiles: 1,
    joined: true,
  },
  {
    id: "jollof-wars",
    brand: { name: "Mama Put Kitchen", verified: true, hue: 28 },
    title: "Jollof Wars: clip the best cook-off moments",
    brief:
      "Clip the funniest and most dramatic moments from the Jollof Wars cook-off stream. Big reactions, burnt pots and the final verdict all work.",
    type: "clipping",
    platforms: ["tiktok", "instagram", "youtube"],
    state: "active",
    rates: {
      tiktok: { rateCents: 120, minPayoutCents: 150, maxPerClipCents: 8000 },
      instagram: { rateCents: 100, minPayoutCents: 150, maxPerClipCents: 8000 },
      youtube: { rateCents: 60, minPayoutCents: 150, maxPerClipCents: 8000 },
    },
    budgetCents: 300000,
    spentCents: 251000,
    creators: 88,
    maxPerCreatorCents: 40000,
    launchedAt: ago(12),
    fastReview: true,
    banner: { from: "#3b0d0d", to: "#d8452b" },
    rules: ["Clips from the official stream only", "Captions on", "Credit @mamaputkitchen"],
    referenceFiles: 2,
    joined: false,
  },
  {
    id: "lumen-banking",
    brand: { name: "Lumen", verified: true, hue: 190 },
    title: "Explain one money tip in 30 seconds",
    brief:
      "Teach one simple money habit (saving, budgeting, avoiding fees) in under 30 seconds, and mention you use Lumen for it. Keep it honest and specific.",
    type: "ugc",
    platforms: ["tiktok", "instagram"],
    state: "active",
    rates: {
      tiktok: { rateCents: 250, minPayoutCents: 500, maxPerClipCents: 20000 },
      instagram: { rateCents: 200, minPayoutCents: 500, maxPerClipCents: 20000 },
    },
    budgetCents: 500000,
    spentCents: 41000,
    creators: 9,
    maxPerCreatorCents: 80000,
    launchedAt: ago(0, 20),
    fastReview: false,
    banner: { from: "#062a33", to: "#14a3b8" },
    rules: ["One tip per video", "Say you use Lumen", "No financial promises"],
    referenceFiles: 4,
    joined: false,
  },
  {
    id: "afrobeat-hook",
    brand: { name: "Lagoon Sound", verified: false, hue: 300 },
    title: "Dance to the 'Lagoon' hook",
    brief: "Post a dance, transition or lip-sync to the 'Lagoon' hook. Any style, as long as the hook plays.",
    type: "sound",
    platforms: ["tiktok"],
    state: "active",
    rates: {
      tiktok: { rateCents: 90, minPayoutCents: 100, maxPerClipCents: 3000 },
    },
    budgetCents: 120000,
    spentCents: 104000,
    creators: 140,
    maxPerCreatorCents: 12000,
    launchedAt: ago(6),
    fastReview: true,
    banner: { from: "#2a0a2e", to: "#c13dbf" },
    rules: ["Use the official sound", "Hook plays at least once"],
    referenceFiles: 1,
    joined: false,
  },
  {
    id: "fitpal-logo",
    brand: { name: "FitPal", verified: true, hue: 95 },
    title: "Workout videos with the FitPal badge",
    brief: "Add the FitPal badge to your workout, gym or home-training videos. Badge visible the whole clip.",
    type: "logo",
    platforms: ["tiktok", "instagram"],
    state: "active",
    rates: {
      tiktok: { rateCents: 70, minPayoutCents: 100, maxPerClipCents: 4000 },
      instagram: { rateCents: 60, minPayoutCents: 100, maxPerClipCents: 4000 },
    },
    budgetCents: 200000,
    spentCents: 30000,
    creators: 31,
    maxPerCreatorCents: 16000,
    launchedAt: ago(2),
    fastReview: false,
    banner: { from: "#14260a", to: "#6cb42c" },
    rules: ["Badge visible the whole clip", "Fitness topics only"],
    referenceFiles: 1,
    joined: false,
  },
];

export const sampleClips: Clip[] = [
  {
    id: "clip-1",
    campaignId: "studio-nine-s4",
    title: "\"Nobody tells you the first hire is the hardest\" #founders",
    coverHue: 262,
    postedAt: ago(6, 2),
    submittedAt: ago(6, 2),
    status: "earning",
    views: 48210,
    earnedCents: 7231,
    keepLiveUntil: ahead(27),
  },
  {
    id: "clip-2",
    campaignId: "studio-nine-s4",
    title: "The pricing mistake that almost killed us",
    coverHue: 280,
    postedAt: ago(2, 5),
    submittedAt: ago(2, 5),
    status: "in_review",
    views: 9120,
    earnedCents: 0,
    keepLiveUntil: ahead(31),
  },
  {
    id: "clip-3",
    campaignId: "pagewell-logo",
    title: "5-hour study with me (finals week)",
    coverHue: 210,
    postedAt: ago(12),
    submittedAt: ago(12),
    status: "clip_not_found",
    views: 15400,
    earnedCents: 1232,
    keepLiveUntil: ahead(21),
  },
  {
    id: "clip-4",
    campaignId: "pagewell-logo",
    title: "How I plan my week in 10 minutes",
    coverHue: 200,
    postedAt: ago(15),
    submittedAt: ago(15),
    status: "rejected",
    views: 2210,
    earnedCents: 0,
    keepLiveUntil: ahead(18),
  },
];

export const sampleRounds: EarningRound[] = [
  { id: "r1", clipId: "clip-1", index: 1, startsAt: ago(5), endsAt: ahead(2), availableOn: ahead(5), amountCents: 7231, state: "accruing" },
  { id: "r2", clipId: "clip-3", index: 1, startsAt: ago(11), endsAt: ago(4), availableOn: ago(1), amountCents: 1100, state: "settled" },
  { id: "r3", clipId: "clip-3", index: 2, startsAt: ago(4), endsAt: ahead(3), availableOn: ahead(6), amountCents: 132, state: "waiting", blockedReason: "Waiting for clip check" },
];

export const sampleCreatorSummary = {
  lifetimeCents: sampleRounds.reduce((s, r) => s + r.amountCents, 0),
  availableCents: 1100,
  pendingCents: 7363,
  inTransitCents: 0,
  nextUnlock: { amountCents: 7231, on: ahead(5) },
  views: sampleClips.reduce((s, c) => s + c.views, 0),
  campaignsJoined: sampleCampaigns.filter((c) => c.joined).length,
  clips: sampleClips.length,
};

export const getSampleCampaign = (id: string) => sampleCampaigns.find((c) => c.id === id);

/** Results a campaign page shows as proof that it really pays. */
export type CampaignProof = {
  totalViews: number;
  viewsByDay: { day: string; views: number }[]; // running total
  topClips: { id: string; platform: Platform; views: number; earnedCents: number; hue: number }[];
  topClippers: { handle: string; earnedCents: number }[];
  brand: { approvalPercent: number; reviewHours: number; paidCents: number };
};

const CLIPPER_HANDLES = ["clipsbytobi", "ada.edits", "kingsley.cuts", "viralvee", "mideclips", "zaracuts"];

// Made-up but stable numbers derived from the campaign, so a page looks the same on every visit.
export function getSampleProof(c: Campaign): CampaignProof {
  const seed = [...c.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const rates = c.platforms.map((p) => c.rates[p]!.rateCents);
  const averageRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const totalViews = Math.round((c.spentCents / averageRate) * 1000);

  const DAYS = 14;
  const viewsByDay = Array.from({ length: DAYS }, (_, i) => {
    const t = (i + 1) / DAYS;
    const wobble = 1 + Math.sin(i + seed) * 0.03 * (1 - t);
    return { day: new Date(now.getTime() - (DAYS - 1 - i) * DAY).toISOString(), views: Math.round(totalViews * t ** 1.6 * wobble) };
  });

  const topClips = Array.from({ length: 6 }, (_, i) => {
    const platform = c.platforms[(seed + i) % c.platforms.length];
    const rate = c.rates[platform]!;
    const earnedCents = Math.round(rate.maxPerClipCents * (0.92 - i * 0.13) * (1 - (seed % 7) / 40));
    return {
      id: `${c.id}-clip-${i}`,
      platform,
      views: Math.round((earnedCents / rate.rateCents) * 1000),
      earnedCents,
      hue: (c.brand.hue + i * 34) % 360,
    };
  });

  const topClippers = [0.16, 0.11, 0.07].map((share, i) => ({
    handle: CLIPPER_HANDLES[(seed + i) % CLIPPER_HANDLES.length],
    earnedCents: Math.min(Math.round(c.spentCents * share), c.maxPerCreatorCents),
  }));

  return {
    totalViews,
    viewsByDay,
    topClips,
    topClippers,
    brand: { approvalPercent: 82 + (seed % 15), reviewHours: 6 + (seed % 30), paidCents: c.spentCents * (2 + (seed % 5)) },
  };
}
