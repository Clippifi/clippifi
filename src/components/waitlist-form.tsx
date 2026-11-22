"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { CheckCircle, Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ROLES = [
  { value: "creator", label: "I'm a creator" },
  { value: "brand", label: "I'm a brand" },
] as const;

// "Join the waitlist": creator or brand, email, and (unless compact) an optional name.
// Used in the landing hero (compact), the landing banner and the private beta page.
export function WaitlistForm({ defaultEmail = "", compact = false }: { defaultEmail?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, { status: "idle" });

  if (state.status === "joined") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
        <CheckCircle className="size-5 shrink-0 text-green-600" />
        You&apos;re on the list. We&apos;ll email you when your invite is ready.
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-2.5">
      {/* Native radios styled as pills: keyboard and screen-reader friendly with no extra library. */}
      <fieldset className="flex gap-2">
        <legend className="sr-only">I want to join as</legend>
        {ROLES.map((role, i) => (
          <label key={role.value} className="cursor-pointer">
            <input type="radio" name="role" value={role.value} defaultChecked={i === 0} className="peer sr-only" />
            <span className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-sm font-medium text-slate-600 transition-colors peer-checked:border-slate-900 peer-checked:bg-slate-900 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 dark:border-white/15 dark:text-slate-300 dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-checked:text-slate-900">
              {role.label}
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        {!compact && (
          <Input name="name" autoComplete="name" placeholder="Your name (optional)" aria-label="Your name" maxLength={80} className="h-11 sm:max-w-48" />
        )}
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email"
          required
          defaultValue={defaultEmail}
          className="h-11 w-full sm:flex-1"
        />
        <Button type="submit" variant="brand" disabled={pending} className="h-11 shrink-0 px-6">
          {pending && <Spinner className="animate-spin" />}
          Join the waitlist
        </Button>
      </div>
      {/* Hidden from people; bots fill it in. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}
    </form>
  );
}
