import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = { title: "Private beta — Clippifi" };

// Where anyone without an invite lands: a signed-in person who isn't approved, an email
// code request for an address that isn't approved, or a blocked Google sign-in.
export default async function PrivateBetaPage({ searchParams }: PageProps<"/private-beta">) {
  const { email } = await searchParams;
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-6 md:p-10">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Logo className="h-7 w-7" />
        Clippifi
      </Link>
      <section className="flex w-full max-w-lg flex-col items-center gap-5 rounded-3xl bg-card p-6 text-center sm:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">We&apos;re in private beta</h1>
          <p className="text-[15px] text-muted-foreground">
            Clippifi is open to invited creators and brands for now. Join the waitlist and we&apos;ll email you as soon as
            there&apos;s a spot.
          </p>
        </div>
        <WaitlistForm defaultEmail={typeof email === "string" ? email : ""} />
        <p className="text-[13px] text-muted-foreground">
          Already invited?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
