"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from "@/components/animate-ui/components/radix/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { RateChip } from "@/components/app/campaign-card";
import { EmptyState } from "@/components/app/empty-state";
import { Notice } from "@/components/app/notice";
import { ConnectTikTokButton } from "@/components/app/tiktok-connect-buttons";
import { CheckCircle, Compass, ErrorCircle, Play, Timer, Upload } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { clipChecksPass, pastedLinkChecks, pickedVideoChecks, type ClipCheck } from "@/lib/clip-checks";
import { checkClipLinks } from "@/lib/clip-links";
import { formatAge, minutesLeftToSubmit } from "@/lib/format";
import type { Campaign, RecentVideo } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

const rowClass =
  "flex min-w-0 cursor-pointer items-center gap-3 px-3 py-3 transition-colors has-data-[state=checked]:bg-muted/70 has-disabled:cursor-not-allowed";

export function SubmitClip({
  campaigns,
  initialCampaignId,
  videos,
  tiktokConnected,
  now,
}: {
  campaigns: Campaign[];
  initialCampaignId?: string;
  videos: RecentVideo[];
  tiktokConnected: boolean;
  now: Date;
}) {
  const [campaignId, setCampaignId] = useState(
    campaigns.some((c) => c.id === initialCampaignId) ? initialCampaignId! : (campaigns[0]?.id ?? ""),
  );
  const [source, setSource] = useState<"recent" | "paste">("recent");
  const [videoId, setVideoId] = useState("");
  const [pasted, setPasted] = useState("");
  const [submitted, setSubmitted] = useState(0);

  const campaign = campaigns.find((c) => c.id === campaignId);
  const links = useMemo(() => checkClipLinks(pasted, campaign?.platforms ?? []), [pasted, campaign]);
  const goodLinks = links.filter((l) => l.ok).length;
  const picked = videos.find((v) => v.id === videoId);
  const checks =
    source === "recent"
      ? pickedVideoChecks({
          picked: picked ? { minutesLeft: minutesLeftToSubmit(picked.postedAt, now), alreadySubmitted: picked.alreadySubmitted } : null,
          tiktokConnected,
          campaignAcceptsTikTok: campaign?.platforms.includes("tiktok") ?? false,
        })
      : pastedLinkChecks(links);
  const count = !clipChecksPass(checks) ? 0 : source === "recent" ? 1 : goodLinks;

  if (campaigns.length === 0) {
    return (
      <div className="rounded-card bg-card">
        <EmptyState
          icon={<Compass />}
          title="Join a campaign first"
          description="Pick a campaign you like, join it, then come back with your clip."
          action={
            <Button variant="brand" asChild>
              <Link href="/c/campaigns">Find a campaign</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (submitted > 0) {
    return (
      <div className="rounded-card bg-card">
        <EmptyState
          icon={<CheckCircle />}
          title={submitted === 1 ? "Clip submitted" : `${submitted} clips submitted`}
          description="Views start counting now. The brand approves within 48 hours, and if it doesn't answer, your clip is approved automatically."
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link href="/c/clips">View my clips</Link>
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setSubmitted(0);
                  setVideoId("");
                  setPasted("");
                }}
              >
                Submit another
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Notice tone="info" title="You have 30 minutes">
        Submit each clip within 30 minutes of posting it. After that it can&apos;t earn.
      </Notice>

      <Step number={1} title="Campaign">
        <RadioGroup
          value={campaignId}
          onValueChange={setCampaignId}
          aria-label="Campaign"
          className="grid-cols-1 gap-0 divide-y divide-hairline overflow-hidden rounded-inner border border-hairline"
        >
          {campaigns.map((c) => (
            <label key={c.id} className={rowClass}>
              <RadioGroupItem value={c.id} />
              <span
                className="size-11 shrink-0 rounded-thumb"
                style={{ backgroundImage: `linear-gradient(135deg, ${c.banner.from}, ${c.banner.to})` }}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-semibold">{c.title}</span>
                <span className="block truncate text-[13px] text-muted-foreground">{c.brand.name}</span>
              </span>
              <RateChip campaign={c} className="hidden sm:inline-flex" />
            </label>
          ))}
        </RadioGroup>
      </Step>

      <Step number={2} title="Your clip">
        <Tabs value={source} onValueChange={(v) => setSource(v as typeof source)}>
          <TabsList aria-label="How to add your clip" className="w-full">
            <TabsTrigger value="recent">Recent videos</TabsTrigger>
            <TabsTrigger value="paste">Paste links</TabsTrigger>
          </TabsList>
        </Tabs>

        {source === "recent" ? (
          <div className="flex flex-col gap-3">
            {!tiktokConnected && (
              <div className="flex flex-col gap-3 rounded-inner border border-dashed border-hairline p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[14px] leading-5 text-muted-foreground">Connect TikTok to see your own videos here. These are samples.</p>
                <ConnectTikTokButton className="shrink-0" />
              </div>
            )}
            <RadioGroup
              value={videoId}
              onValueChange={setVideoId}
              aria-label="Recent videos"
              className="grid-cols-1 gap-0 divide-y divide-hairline overflow-hidden rounded-inner border border-hairline"
            >
              {videos.map((video) => (
                <VideoRow key={video.id} video={video} now={now} />
              ))}
            </RadioGroup>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste one or more clip links, one per line"
              aria-label="Clip links"
              rows={4}
              className="min-h-28 rounded-inner border-hairline bg-transparent px-3.5 py-3 text-[15px] md:text-[15px] dark:bg-transparent"
            />
            {links.length > 0 && (
              <ul className="divide-y divide-hairline rounded-inner border border-hairline">
                {links.map((link, i) => (
                  <li key={`${link.url}-${i}`} className="flex items-start gap-2.5 px-3 py-2.5">
                    {link.ok ? (
                      <CheckCircle className="mt-px size-[18px] shrink-0 text-success" />
                    ) : (
                      <ErrorCircle className="mt-px size-[18px] shrink-0 text-destructive" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{link.url}</span>
                      <span className="block text-[13px] leading-[18px] text-muted-foreground">{link.ok ? "Ready to submit" : link.reason}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <ClipChecks checks={checks} />
      </Step>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-[18px] text-muted-foreground">Keep every clip public for about 33 days to get paid in full.</p>
        <Button variant="brand" size="lg" disabled={count === 0} onClick={() => setSubmitted(count)} className="w-full shrink-0 sm:w-auto">
          <Upload />
          {count > 1 ? `Submit ${count} clips` : "Submit clip"}
        </Button>
      </div>
    </div>
  );
}

// Ticks off live as the creator picks a clip, so there are no surprises after submitting.
function ClipChecks({ checks }: { checks: ClipCheck[] }) {
  return (
    <div className="flex flex-col gap-2 border-t border-hairline pt-4">
      <h3 className="text-[14px] font-semibold">Every clip is checked for</h3>
      <ul aria-live="polite" className="flex flex-col gap-2">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2.5 text-[14px] leading-5">
            <CheckIcon state={check.state} />
            <span className={cn("min-w-0 flex-1", check.state === "idle" && "text-muted-foreground")}>
              {check.label}
              {check.detail && (
                <span className={cn("block text-[13px] leading-[18px]", check.state === "fail" ? "text-destructive" : "text-muted-foreground")}>
                  {check.detail}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckIcon({ state }: { state: ClipCheck["state"] }) {
  if (state === "pass") return <CheckCircle className="size-5 shrink-0 text-success" aria-label="Passed" />;
  if (state === "fail") return <ErrorCircle className="size-5 shrink-0 text-destructive" aria-label="Failed" />;
  if (state === "later") return <Timer className="size-5 shrink-0 text-muted-foreground" aria-label="Checked when you submit" />;
  return <span aria-label="Not checked yet" className="m-0.5 size-4 shrink-0 rounded-full border-[1.5px] border-hairline" />;
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-card bg-card p-4 sm:p-5">
      <h2 className="flex items-center gap-2.5 text-[17px] leading-6 font-semibold tracking-[-0.01em]">
        <span className="flex size-7 items-center justify-center rounded-full border border-hairline text-[13px] tabular-nums">{number}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function VideoRow({ video, now }: { video: RecentVideo; now: Date }) {
  const minutesLeft = minutesLeftToSubmit(video.postedAt, now);
  const disabled = video.alreadySubmitted || minutesLeft === 0;
  return (
    <label className={rowClass}>
      <RadioGroupItem value={video.id} disabled={disabled} />
      <span
        className={cn("flex aspect-[3/4] w-11 shrink-0 items-center justify-center rounded-thumb text-white", disabled && "opacity-50")}
        style={{ backgroundImage: `linear-gradient(160deg, hsl(${video.coverHue} 55% 45%), hsl(${video.coverHue + 40} 60% 20%))` }}
      >
        <Play className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[15px] font-semibold", disabled && "text-muted-foreground")}>{video.title}</span>
        <span className="block truncate text-[13px] text-muted-foreground">
          {video.alreadySubmitted ? (
            "Already submitted"
          ) : minutesLeft === 0 ? (
            "Posted over 30 minutes ago"
          ) : (
            <>
              {/* Phones: the time left moves here so the title keeps its room. */}
              <span className={cn("font-semibold sm:hidden", minutesLeft <= 10 ? "text-warning" : "text-success")}>{minutesLeft} min left · </span>
              Posted {formatAge(video.postedAt, now)} ago
            </>
          )}
        </span>
      </span>
      {!disabled && (
        <Badge variant={minutesLeft <= 10 ? "warning" : "success"} className="hidden shrink-0 tabular-nums sm:inline-flex">
          <Timer />
          {minutesLeft} min left
        </Badge>
      )}
    </label>
  );
}
