import Link from "next/link";
import { Eye } from "@/components/icons";
import { WaitlistForm } from "@/components/waitlist-form";
import { btnPrimary, btnSecondary } from "@/lib/button-styles";

// During the private beta this repeats the waitlist form (the hero holds the #waitlist anchor).
export default function CtaBanner({ privateBeta = false }: { privateBeta?: boolean }) {
  if (privateBeta) return <WaitlistBanner />;
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
      <div className="group mx-auto flex max-w-7xl flex-col items-center gap-6 rounded-card bg-slate-50 p-8 text-center transition-shadow duration-300 hover:shadow-lg sm:p-10 lg:flex-row lg:justify-between lg:text-left dark:bg-[#111]">
        <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-inner bg-brand-400 text-slate-900 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Eye className="h-6 w-6" />
          </span>
          <div>
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
              Your next clip could pay for itself.
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Sign up free with Google or your email. Brands can launch a campaign from $100.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/login" className={`rounded-full px-6 py-3 text-center text-sm ${btnPrimary}`}>
            Start earning
          </Link>
          <Link href="/login" className={`rounded-full px-6 py-3 text-center text-sm ${btnSecondary}`}>
            Launch a campaign
          </Link>
        </div>
      </div>
    </section>
  );
}

function WaitlistBanner() {
  return (
    <section className="bg-white px-4 pb-20 sm:px-6 lg:px-8 dark:bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-card bg-slate-50 p-8 text-center sm:p-10 dark:bg-[#111]">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-inner bg-brand-400 text-slate-900">
          <Eye className="h-6 w-6" />
        </span>
        <div>
          <h3 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">We&apos;re in private beta.</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Clippifi is open to invited creators and brands for now. Join the waitlist and we&apos;ll email you when there&apos;s a spot.
          </p>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
