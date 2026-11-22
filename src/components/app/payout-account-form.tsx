"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { Notice } from "@/components/app/notice";
import { CheckCircle, Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDay } from "@/lib/format";

const fieldClass = "h-11 w-full rounded-inner border-hairline bg-transparent px-3.5 text-[15px] md:text-[15px] dark:bg-transparent";
const selectClass = `${fieldClass} data-[size=default]:h-11`;

// Add or change the bank account withdrawals go to (FOUNDATION.md §9). The bank's own name
// for the account is looked up and must match the creator's verified identity (KYC), a fresh
// email code confirms the change, and the new account starts receiving withdrawals 48 hours later.
export function PayoutAccountForm({
  banks,
  email,
  currentPayoutName,
  now,
}: {
  banks: string[];
  email: string;
  currentPayoutName: string | null;
  now: Date;
}) {
  const [bank, setBank] = useState("");
  const [number, setNumber] = useState("");
  const [lookup, setLookup] = useState<{ key: string; name: string } | null>(null);
  const [step, setStep] = useState<"details" | "code" | "done">("details");
  const [code, setCode] = useState("");

  const key = `${bank}:${number}`;
  const complete = bank !== "" && /^\d{10}$/.test(number);
  const resolved = complete && lookup?.key === key ? lookup.name : null;
  const checking = complete && !resolved;

  // SAMPLE: a stand-in for the bank's name lookup (Flutterwave resolve) until the engine exists (E5).
  useEffect(() => {
    if (!complete) return;
    const timer = setTimeout(() => setLookup({ key, name: currentPayoutName ?? "ADA OKAFOR" }), 700);
    return () => clearTimeout(timer);
  }, [complete, key, currentPayoutName]);

  const unlockOn = formatDay(new Date(now.getTime() + 48 * 60 * 60 * 1000), "UTC");

  if (step === "done") {
    return (
      <div className="rounded-card bg-card">
        <EmptyState
          icon={<CheckCircle />}
          title="Payout account saved"
          description={`Withdrawals to ${bank} start ${unlockOn}, 48 hours from now. We've emailed you about the change.`}
          action={
            <Button asChild>
              <Link href="/c/earnings">Back to earnings</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (step === "code") {
    return (
      <section className="flex flex-col items-center gap-4 rounded-card bg-card p-6 text-center">
        <div>
          <h2 className="text-[17px] leading-6 font-semibold">Check your email</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span> to confirm this change.
          </p>
        </div>
        <InputOTP autoFocus maxLength={6} value={code} onChange={setCode} aria-label="Email code">
          <InputOTPGroup>
            {Array.from({ length: 6 }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        <div className="flex w-full flex-col-reverse gap-2 sm:w-auto sm:flex-row">
          <Button variant="secondary" onClick={() => setStep("details")}>
            Back
          </Button>
          {/* SAMPLE: any 6 digits work until the engine checks real codes. */}
          <Button disabled={code.length !== 6} onClick={() => setStep("done")}>
            Confirm and save
          </Button>
        </div>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4 rounded-card bg-card p-5">
        <Field label="Country">
          <Select value="NG" disabled>
            <SelectTrigger className={selectClass} aria-label="Country">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NG">Nigeria</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[13px] text-muted-foreground">More countries are coming. Your earnings stay safe in USD until yours is on.</p>
        </Field>

        <Field label="Bank">
          <Select value={bank} onValueChange={setBank}>
            <SelectTrigger className={selectClass} aria-label="Bank">
              <SelectValue placeholder="Choose your bank" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {banks.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Account number" htmlFor="account-number">
          <Input
            id="account-number"
            inputMode="numeric"
            autoComplete="off"
            maxLength={10}
            placeholder="10 digits"
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            className={`${fieldClass} tracking-wide tabular-nums`}
          />
        </Field>

        {checking && (
          <p className="flex items-center gap-2 text-[14px] text-muted-foreground" role="status">
            <Spinner className="size-4 animate-spin" />
            Checking the account with {bank}…
          </p>
        )}
        {resolved && (
          <div className="flex items-center gap-3 rounded-inner border border-hairline px-3.5 py-3" role="status">
            <CheckCircle className="size-5 shrink-0 text-success" />
            <div className="min-w-0">
              <p className="text-[12px] text-muted-foreground">Name on this account</p>
              <p className="truncate text-[15px] font-semibold">{resolved}</p>
            </div>
          </div>
        )}
      </section>

      {resolved && (
        <Notice tone="info" title="Must match your verified identity">
          The name on this account has to match the identity you verify with our payment partner, so your money can only go
          to you. It stays private.
        </Notice>
      )}
      <Notice tone="info" title="New accounts wait 48 hours">
        For your safety, withdrawals to a new account start 48 hours after you add it. Removing and adding it again restarts the wait.
      </Notice>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" asChild>
          <Link href="/c/earnings">Cancel</Link>
        </Button>
        <Button disabled={!resolved} onClick={() => setStep("code")}>
          Continue
        </Button>
      </div>
    </div>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[14px] font-semibold">
        {label}
      </label>
      {children}
    </div>
  );
}
