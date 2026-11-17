// SAMPLE DATA for designing the money-loop screens before the engine exists (Phase 1).
// Every brand, person and number here is made up. The shapes match what the real
// queries will return, so Phase 2 swaps the source, not the screens. Delete this file
// once the last screen reads real data.

import type { ClipStatus } from "@/lib/clip-status";

export type CampaignType = "clipping" | "sound" | "logo" | "ugc";
export type Platform = "tiktok" | "instagram" | "youtube";
export type CampaignState = "active" | "submissions_paused" | "ended" | "budget_exhausted";

export type Campaign = {
  id: string;
  brand: { name: string; verified: boolean; hue: number };
  title: string;
  brief: string;
  type: CampaignType;
  platforms: Platform[];
  state: CampaignState;
  rateCents: number; // per 1,000 verified views
  budgetCents: number;
  spentCents: number;
  creators: number;
  minPayoutCents: number;
  maxPerClipCents: number;
  maxPerCreatorCents: number;
  launchedAt: Date;
  fastReview: boolean;
  banner: { headline: string; tagline: string; from: string; to: string };
  rules: string[];
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
    rateCents: 150,
    budgetCents: 400000,
    spentCents: 146900,
    creators: 36,
    minPayoutCents: 200,
    maxPerClipCents: 10000,
    maxPerCreatorCents: 50000,
    launchedAt: ago(3),
    fastReview: true,
    banner: { headline: "FOUNDERS", tagline: "Podcast clips · Season 4", from: "#2b1d4f", to: "#6b4fd8" },
    rules: ["Captions on every clip", "Tag @studionine in the caption", "No other podcast's footage"],
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
    rateCents: 200,
    budgetCents: 250000,
    spentCents: 62800,
    creators: 13,
    minPayoutCents: 300,
    maxPerClipCents: 15000,
    maxPerCreatorCents: 60000,
    launchedAt: ago(9),
    fastReview: false,
    banner: { headline: "DROP 07", tagline: "Unboxing reactions", from: "#3a1708", to: "#e2572b" },
    rules: ["Your face on camera", "Say the shoe's name", "Post from a personal account"],
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
    rateCents: 100,
    budgetCents: 150000,
    spentCents: 14100,
    creators: 54,
    minPayoutCents: 100,
    maxPerClipCents: 5000,
    maxPerCreatorCents: 20000,
    launchedAt: ago(1),
    fastReview: true,
    banner: { headline: "MIDNIGHT DANFO", tagline: "Sound campaign", from: "#06261c", to: "#1f9d6b" },
    rules: ["Use the official sound", "Sound plays 10+ seconds", "No explicit content"],
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
    rateCents: 80,
    budgetCents: 100000,
    spentCents: 81200,
    creators: 22,
    minPayoutCents: 100,
    maxPerClipCents: 4000,
    maxPerCreatorCents: 15000,
    launchedAt: ago(16),
    fastReview: false,
    banner: { headline: "pagewell", tagline: "Logo campaign", from: "#0b2440", to: "#3a86d8" },
    rules: ["Watermark visible all clip", "Study or productivity topics only"],
    joined: true,
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
