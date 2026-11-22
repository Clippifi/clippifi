"use client";

import { useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { Notice } from "@/components/app/notice";
import { ResponsiveDialog } from "@/components/app/responsive-dialog";
import { CheckCircle } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDay, formatNGN, formatUSD } from "@/lib/format";
import type { PayoutAccount } from "@/lib/sample-data";
import { DAILY_LIMIT_CENTS, MIN_WITHDRAWAL_CENTS, nairaEstimate, parseAmountCents, withdrawBlock, type WithdrawBlock } from "@/lib/withdraw";

function blockMessage(block: WithdrawBlock): { title: string; body?: string } {
  switch (block.reason) {
    case "no_account":
      return { title: "Add a payout account first", body: "Tell us where to send your money." };
    case "needs_verification":
      return {
        title: "Verify your identity first",
        body: "A one-time check by our payment partner before your first payout. Your bank account must be in the same name.",
      };
    case "account_waiting":
      return { title: `Withdrawals to this account start ${formatDay(block.until, "UTC")}`, body: "New accounts wait 48 hours, to keep your money safe." };
    case "below_minimum":
      return { title: `The minimum is ${formatUSD(MIN_WITHDRAWAL_CENTS)}` };
    case "over_balance":
      return { title: "That's more than you have available" };
    case "already_today":
      return { title: "You've already withdrawn today", body: "One payout a day. You can withdraw again tomorrow." };
    case "over_daily_limit":
      return { title: `The most you can withdraw in a day is ${formatUSD(DAILY_LIMIT_CENTS)}` };
  }
}

// Withdraw: a USD amount in, an honest naira estimate out, one clear reason when it can't go.
export function WithdrawSheet({
  open,
  onOpenChange,
  availableCents,
  withdrawalsToday,
  identityVerified,
  account,
  ngnPerUsd,
  feeNaira,
  now,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableCents: number;
  withdrawalsToday: number;
  identityVerified: boolean;
  account: PayoutAccount | null;
  ngnPerUsd: number;
  feeNaira: number;
  now: Date;
}) {
  const [text, setText] = useState(() => (availableCents / 100).toFixed(2));
  const [sent, setSent] = useState<number | null>(null);
  const amountCents = parseAmountCents(text);
  const block = amountCents === null ? null : withdrawBlock({ amountCents, availableCents, withdrawalsToday, identityVerified, account, now });
  const naira = amountCents === null ? 0 : nairaEstimate(amountCents, ngnPerUsd, feeNaira);
  const canSend = amountCents !== null && amountCents > 0 && block === null;

  const close = (next: boolean) => {
    onOpenChange(next);
    if (!next) setSent(null);
  };

  if (sent !== null) {
    return (
      <ResponsiveDialog open={open} onOpenChange={close} title="Withdrawal requested">
        <EmptyState
          icon={<CheckCircle />}
          title={`${formatUSD(sent)} is on its way`}
          description="Bank transfers usually arrive within minutes. We'll email you when it lands."
          className="py-4"
          action={<Button onClick={() => close(false)}>Done</Button>}
        />
      </ResponsiveDialog>
    );
  }

  const message = block ? blockMessage(block) : null;
  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={close}
      title="Withdraw"
      description={`${formatUSD(availableCents)} available`}
      footer={
        <>
          <Button variant="secondary" onClick={() => close(false)}>
            Cancel
          </Button>
          {block?.reason === "no_account" ? (
            <Button asChild>
              <Link href="/c/earnings/payout-account">Add payout account</Link>
            </Button>
          ) : (
            // SAMPLE: requests are local until the engine sends real transfers (E5).
            <Button variant="brand" disabled={!canSend} onClick={() => amountCents && setSent(amountCents)}>
              Withdraw {amountCents && canSend ? formatUSD(amountCents) : ""}
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="withdraw-amount" className="text-[14px] font-semibold">
          Amount in USD
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[20px] font-semibold text-muted-foreground">$</span>
          <Input
            id="withdraw-amount"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-invalid={amountCents === null || Boolean(message) || undefined}
            className="h-14 rounded-inner border-hairline bg-transparent pr-20 pl-9 text-[22px] font-semibold tabular-nums md:text-[22px] dark:bg-transparent"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setText((availableCents / 100).toFixed(2))}
            className="absolute top-1/2 right-2.5 -translate-y-1/2"
          >
            Max
          </Button>
        </div>
        {amountCents === null && <p className="text-[13px] text-destructive">Enter an amount like 25 or 25.50.</p>}
      </div>

      {message && block?.reason !== "no_account" && (
        <Notice tone={block?.reason === "account_waiting" || block?.reason === "already_today" ? "info" : "warning"} title={message.title}>
          {message.body}
        </Notice>
      )}
      {block?.reason === "no_account" && <Notice tone="info" title={message?.title}>{message?.body}</Notice>}

      <dl className="divide-y divide-hairline rounded-inner border border-hairline text-[14px]">
        <div className="flex items-baseline justify-between gap-3 px-3.5 py-3">
          <dt className="text-muted-foreground">You&apos;ll receive about</dt>
          <dd className="text-[17px] font-bold tabular-nums">{formatNGN(naira)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
          <dt className="text-muted-foreground">Transfer fee</dt>
          <dd className="tabular-nums">{formatNGN(feeNaira)}, included</dd>
        </div>
        {account && (
          <div className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
            <dt className="text-muted-foreground">To</dt>
            <dd className="truncate">
              {account.bank} •••• {account.last4}
            </dd>
          </div>
        )}
      </dl>
      <p className="-mt-1 text-[12px] leading-4 text-muted-foreground">
        An estimate at today&apos;s rate. The final amount may differ by up to 1%.
      </p>
    </ResponsiveDialog>
  );
}
