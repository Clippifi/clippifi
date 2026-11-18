"use client";

import { useActionState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
import { CheckCircle, Spinner } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// "Join the waitlist": email and an optional name. Used on the landing page and on
// the private beta page.
export function WaitlistForm({ defaultEmail = "" }: { defaultEmail?: string }) {
  const [state, action, pending] = useActionState<WaitlistState, FormData>(joinWaitlist, { status: "idle" });

  if (state.status === "joined") {
    return (
      <p role="status" className="flex items-center justify-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
        <CheckCircle className="size-5 text-green-600" />
        You&apos;re on the list. We&apos;ll email you when your invite is ready.
      </p>
    );
  }

  return (
    <form action={action} className="flex w-full flex-col gap-2.5">
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Input name="name" autoComplete="name" placeholder="Your name (optional)" aria-label="Your name" maxLength={80} className="h-11 sm:max-w-48" />
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-label="Email"
          required
          defaultValue={defaultEmail}
          className="h-11 flex-1"
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
