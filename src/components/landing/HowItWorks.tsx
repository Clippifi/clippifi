import { Banknote, Clapperboard, Eye, type IconComponent, Link as LinkIcon, Megaphone, ShieldCheck, Upload, Wallet } from "@/components/icons";

type Step = { icon: IconComponent; title: string; text: string };

const creatorSteps: Step[] = [
  {
    icon: Clapperboard,
    title: "Pick a campaign",
    text: "Choose a brand and see what it pays.",
  },
  {
    icon: Upload,
    title: "Post and submit",
    text: "Post your clip, then submit the link within 30 minutes.",
  },
  {
    icon: Eye,
    title: "We count the views",
    text: "Your clip earns on its views for 30 days.",
  },
  {
    icon: Wallet,
    title: "Withdraw to your bank",
    text: "Cash out from $10, straight to your bank.",
  },
];

const brandSteps: Step[] = [
  {
    icon: Megaphone,
    title: "Write a brief",
    text: "Set your rate and a budget from $100.",
  },
  {
    icon: ShieldCheck,
    title: "Approve the clips",
    text: "We check every clip. You approve the ones you like.",
  },
  {
    icon: LinkIcon,
    title: "Track the results",
    text: "See views, spend and your top clips in one report.",
  },
  {
    icon: Banknote,
    title: "Pay for views only",
    text: "Unspent budget comes back to you.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-20 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-balance text-slate-900 sm:text-4xl dark:text-white">How Clippifi works</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Brands pay for views, not promises. Creators get paid for the views their clips actually get.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8">
          <Track id="creators" label="For creators" steps={creatorSteps} />
          <Track id="brands" label="For brands" steps={brandSteps} />
        </div>
      </div>
    </section>
  );
}

function Track({ id, label, steps }: { id: string; label: string; steps: Step[] }) {
  return (
    <div id={id} className="scroll-mt-24 rounded-card border border-slate-100 bg-slate-50 p-6 sm:p-8 dark:border-white/10 dark:bg-[#111]">
      <h3 className="inline-flex rounded-full bg-brand-400 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
        {label}
      </h3>
      <ol className="mt-6 flex flex-col gap-6">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="flex gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-inner bg-white text-slate-900 shadow-sm dark:bg-white/10 dark:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white">
                <span className="mr-1.5 text-slate-400 tabular-nums">{i + 1}.</span>
                {title}
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
