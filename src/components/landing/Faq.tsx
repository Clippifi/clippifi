import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/site";

// Answers must match the Terms of Service and the Refund & Payout Policy.
const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Do I need a lot of followers?",
    a: "No. You're paid for the views each clip gets, so a new account can earn as much as a big one if the clip does well.",
  },
  {
    q: "How are views verified?",
    a: "You link your account with the platform's official login. We confirm each submitted clip was posted from that account, then read its view count from the platform every few hours. Bought or botted views are flagged and not paid.",
  },
  {
    q: "When do I get paid?",
    a: "A clip earns in 7-day rounds from when it's approved. Each round is held for 3 days, then the money is available to withdraw. Views count for 30 days from submission.",
  },
  {
    q: "Can I delete the clip after I'm paid?",
    a: "Keep it public until its last round settles, about 33 days after you submit. If it's deleted or made private before then, the earnings that haven't settled yet are cancelled.",
  },
  {
    q: "How do I withdraw, and where?",
    a: "From $10, up to $1,000 a day, to a bank account in your local currency. Nigeria is supported first and more countries are coming. You see the exchange rate and transfer fee before you confirm.",
  },
  {
    q: "What does a campaign cost a brand?",
    a: "You set the budget (from $100) and the rate you pay for views. Our fee is 10%, charged only on the views you receive. When the campaign ends, unspent budget and its fee come back to you.",
  },
  {
    q: "Which platforms are supported?",
    a: "TikTok is live. Instagram and YouTube are coming next.",
  },
];

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 bg-white py-20 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-balance text-slate-900 sm:text-4xl dark:text-white">Questions</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            The full rules are in our <Link href="/terms" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">Terms</Link> and{" "}
            <Link href="/refund-policy" className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white">Refund &amp; Payout Policy</Link>.
          </p>
        </div>

        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/10 dark:border-white/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md font-medium text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500 dark:text-white [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Something else? Email <span className="font-medium text-slate-900 select-all dark:text-white">{SUPPORT_EMAIL}</span>
        </p>
      </div>
    </section>
  );
}
