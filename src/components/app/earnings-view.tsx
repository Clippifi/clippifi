"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/animate-ui/components/radix/tabs";
import { IconTile } from "@/components/app/icon-tile";
import { MoneyHero } from "@/components/app/money-hero";
import { Notice } from "@/components/app/notice";
import { StatTile, StatTiles } from "@/components/app/stat-tile";
import { WithdrawSheet } from "@/components/app/withdraw-sheet";
import { Bank, CheckCircle, ChevronRight, ErrorCircle, Play, Timer, User, Wallet } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatDay, formatNGN, formatUSD } from "@/lib/format";
import type { Clip, EarningRound, PayoutAccount, Withdrawal } from "@/lib/sample-data";
import { getSampleCampaign } from "@/lib/sample-data";
import { cn } from "@/lib/utils";

export type EarningsTab = "unlocking" | "withdrawals";

const day = (d: Date) => formatDay(d, "UTC");
// "8 Nov": short dates for round ranges.
const short = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function EarningsView({
  summary,
  clips,
  rounds,
  withdrawals,
  account,
  withdrawalsToday,
  identityVerified,
  ngnPerUsd,
  feeNaira,
  now,
  initialTab = "unlocking",
}: {
  summary: { lifetimeCents: number; availableCents: number; pendingCents: number; inTransitCents: number; nextUnlock: { amountCents: number; on: Date } };
  clips: Clip[];
  rounds: EarningRound[];
  withdrawals: Withdrawal[];
  account: PayoutAccount | null;
  withdrawalsToday: number;
  identityVerified: boolean;
  ngnPerUsd: number;
  feeNaira: number;
  now: Date;
  initialTab?: EarningsTab;
}) {
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [tab, setTab] = useState<EarningsTab>(initialTab);
  const waiting = rounds.filter((r) => r.state === "waiting");
  const withdrawnCents = withdrawals.filter((w) => w.status === "paid").reduce((s, w) => s + w.amountCents, 0);

  // Clips with money still to come first, soonest unlock first.
  const byClip = clips
    .map((clip) => ({ clip, rounds: rounds.filter((r) => r.clipId === clip.id).sort((a, b) => a.index - b.index) }))
    .filter((c) => c.rounds.length > 0)
    .sort((a, b) => {
      const next = (x: typeof a) => Math.min(...x.rounds.filter((r) => r.state !== "settled").map((r) => r.availableOn.getTime()), Infinity);
      return next(a) - next(b);
    });

  return (
    <div className="flex flex-col gap-6">
      <MoneyHero
        label="Available to withdraw"
        amount={formatUSD(summary.availableCents)}
        action={
          <Button variant="brand" size="lg" onClick={() => setWithdrawOpen(true)} className="w-full sm:w-auto">
            <Wallet />
            Withdraw
          </Button>
        }
      >
        <StatTiles>
          <StatTile
            icon={<Timer />}
            tone="info"
            value={formatUSD(summary.pendingCents)}
            label={`Pending · next ${day(summary.nextUnlock.on)}`}
          />
          <StatTile icon={<Bank />} tone="muted" value={formatUSD(summary.inTransitCents)} label="On its way to your bank" />
          <StatTile icon={<CheckCircle />} tone="success" value={formatUSD(withdrawnCents)} label="Withdrawn so far" />
          <StatTile icon={<Wallet />} tone="brand" value={formatUSD(summary.lifetimeCents)} label="Earned in total" />
        </StatTiles>
      </MoneyHero>

      {waiting.length > 0 && (
        <Notice tone="warning" title={`${formatUSD(waiting.reduce((s, r) => s + r.amountCents, 0))} is waiting on a clip`}>
          Fix the clips in My clips and it unlocks on schedule.{" "}
          <Link href="/c/clips" className="tap-target font-semibold text-foreground underline underline-offset-4">
            Open My clips
          </Link>
        </Notice>
      )}

      {/* Two tabs instead of one long strip: what's coming, and money already sent out. */}
      <div className="flex flex-col gap-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as EarningsTab)}>
          <TabsList aria-label="Earnings" className="w-full sm:w-fit">
            <TabsTrigger value="unlocking">
              Unlocking
              <span data-count>{byClip.filter((c) => c.rounds.some((r) => r.state !== "settled")).length}</span>
            </TabsTrigger>
            <TabsTrigger value="withdrawals">
              Withdrawals
              <span data-count>{withdrawals.length}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "unlocking" ? (
          <section aria-label="When your money unlocks" className="flex flex-col gap-3">
            <p className="text-small text-muted-foreground">Each clip pays in 7-day rounds. A round unlocks 3 days after it ends.</p>
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {byClip.map(({ clip, rounds: clipRounds }) => (
                <li key={clip.id} className="min-w-0">
                  <ClipRounds clip={clip} rounds={clipRounds} now={now} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-start">
            {/* Phones: the account comes first, so where the money goes is never buried. */}
            <div className="lg:order-2">
              <PayoutAccountCard account={account} identityVerified={identityVerified} now={now} />
            </div>
            <div className="lg:order-1">
              <Withdrawals withdrawals={withdrawals} />
            </div>
          </div>
        )}
      </div>

      <WithdrawSheet
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        availableCents={summary.availableCents}
        withdrawalsToday={withdrawalsToday}
        identityVerified={identityVerified}
        account={account}
        ngnPerUsd={ngnPerUsd}
        feeNaira={feeNaira}
        now={now}
      />
    </div>
  );
}

function RoundState({ round, now }: { round: EarningRound; now: Date }) {
  if (round.state === "settled") {
    return (
      <Badge variant="success">
        <CheckCircle /> Available
      </Badge>
    );
  }
  if (round.state === "waiting") {
    return (
      <Badge variant="warning">
        <Timer /> {round.blockedReason ?? "Waiting"}
      </Badge>
    );
  }
  if (round.state === "reversed") {
    return (
      <Badge variant="destructive">
        <ErrorCircle /> Reversed
      </Badge>
    );
  }
  const counting = round.state === "accruing" && round.endsAt.getTime() > now.getTime();
  return (
    <Badge variant={counting ? "info" : "secondary"}>
      <Timer /> {counting ? "Counting" : "Unlocking"} · {day(round.availableOn)}
    </Badge>
  );
}

function ClipRounds({ clip, rounds, now }: { clip: Clip; rounds: EarningRound[]; now: Date }) {
  const campaign = getSampleCampaign(clip.campaignId);
  return (
    <div className="flex h-full flex-col gap-3 rounded-card bg-card p-4">
      <div className="flex items-center gap-3">
        <span
          className="flex aspect-[3/4] w-11 shrink-0 items-center justify-center rounded-thumb text-white"
          style={{ backgroundImage: `linear-gradient(160deg, hsl(${clip.coverHue} 55% 45%), hsl(${clip.coverHue + 40} 60% 20%))` }}
        >
          <Play className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-body font-semibold">{clip.title}</p>
          <p className="truncate text-caption text-muted-foreground">{campaign?.brand.name}</p>
        </div>
      </div>
      <ol className="divide-y divide-hairline rounded-inner border border-hairline">
        {rounds.map((round) => (
          <li
            key={round.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1.5 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_auto_auto]"
          >
            <span className="min-w-0 text-caption text-muted-foreground tabular-nums">
              <span className="font-medium text-foreground">Round {round.index}</span> · {short(round.startsAt)} – {short(round.endsAt)}
            </span>
            <span
              className={cn(
                "col-start-2 row-start-1 text-right text-body font-bold tabular-nums sm:col-start-3 sm:w-20",
                round.state === "reversed" && "text-muted-foreground line-through",
              )}
            >
              {formatUSD(round.amountCents)}
            </span>
            {/* Phones: the state sits on its own line under the dates. */}
            <span className="col-span-2 sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <RoundState round={round} now={now} />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const WITHDRAWAL_STATUS = {
  requested: { label: "Requested", variant: "secondary" },
  sent: { label: "On its way", variant: "info" },
  paid: { label: "Paid", variant: "success" },
  failed: { label: "Failed", variant: "destructive" },
} as const;

function Withdrawals({ withdrawals }: { withdrawals: Withdrawal[] }) {
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-card bg-card p-5">
      <h2 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">Withdrawals</h2>
      {withdrawals.length === 0 ? (
        <p className="text-small text-muted-foreground">Your withdrawals will show up here.</p>
      ) : (
        <ul className="divide-y divide-hairline rounded-inner border border-hairline">
          {withdrawals.map((w) => {
            const status = WITHDRAWAL_STATUS[w.status];
            return (
              <li key={w.id} className="flex flex-col gap-2 px-3.5 py-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-body font-semibold tabular-nums">{formatNGN(w.naira)}</p>
                    <p className="text-caption text-muted-foreground tabular-nums">
                      {formatUSD(w.amountCents)} · {formatDate(w.requestedAt, "UTC")}
                    </p>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                {w.status === "failed" && (
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-caption leading-[18px] text-muted-foreground">{w.failureReason}</p>
                    {/* SAMPLE: retries arrive with the engine (E5). */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => toast("Sample screen", { description: "Retries arrive with the engine." })}
                      className="shrink-0"
                    >
                      Try again
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PayoutAccountCard({ account, identityVerified, now }: { account: PayoutAccount | null; identityVerified: boolean; now: Date }) {
  const waiting = account && account.withdrawalsFrom.getTime() > now.getTime();
  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-card bg-card p-5">
      <h2 className="text-subhead leading-6 font-semibold tracking-[-0.01em]">Payout account</h2>
      {account ? (
        <Link
          href="/c/earnings/payout-account"
          className="group flex items-center gap-3 rounded-inner border border-hairline p-3 transition-colors hover:bg-muted/50"
        >
          <IconTile tone="muted" size="sm">
            <Bank />
          </IconTile>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body font-semibold">
              {account.bank} •••• {account.last4}
            </span>
            <span className="block truncate text-caption text-muted-foreground">{account.accountName}</span>
          </span>
          {waiting ? <Badge variant="info">From {day(account.withdrawalsFrom)}</Badge> : <Badge variant="success">Ready</Badge>}
          <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
        </Link>
      ) : (
        <div className="flex flex-col items-start gap-3">
          <p className="text-small text-muted-foreground">Add the bank account your money should go to.</p>
          <Button asChild>
            <Link href="/c/earnings/payout-account">Add payout account</Link>
          </Button>
        </div>
      )}
      <div className="flex items-center gap-3 rounded-inner border border-hairline p-3">
        <IconTile tone="muted" size="sm">
          <User />
        </IconTile>
        <span className="min-w-0 flex-1">
          <span className="block text-body font-semibold">Identity</span>
          <span className="block text-caption text-muted-foreground">
            {identityVerified ? "Checked by our payment partner" : "Needed once, before your first payout"}
          </span>
        </span>
        {/* SAMPLE: the identity check opens with real payouts (E5); the payment partner runs it. */}
        {identityVerified ? <Badge variant="success">Verified</Badge> : <Badge variant="warning">To do</Badge>}
      </div>
      <p className="text-caption leading-[18px] text-muted-foreground">
        Nigerian bank accounts for now, in the same name as your verified identity. More countries are coming.
      </p>
    </section>
  );
}
