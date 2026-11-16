import { BadgeDollarSign, CalendarClock, Landmark, Percent, Timer } from "lucide-react";

// How Clippifi works, in numbers. Every figure here matches the Terms of Service;
// change them together. (No usage stats until we have real ones.)
const facts = [
  { icon: BadgeDollarSign, value: "Per 1,000 views", label: "Paid on verified views only" },
  { icon: Timer, value: "30 minutes", label: "To submit after you post" },
  { icon: CalendarClock, value: "7 + 3 days", label: "Earning round, then a short hold" },
  { icon: Landmark, value: "$10", label: "Minimum withdrawal to your bank" },
  { icon: Percent, value: "10%", label: "Brand fee, only on delivered views" },
];

export default function StatsBar() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 rounded-2xl bg-white px-6 py-8 shadow-xl min-[480px]:grid-cols-2 sm:gap-4 sm:px-10 lg:grid-cols-5 dark:bg-[#111] dark:shadow-none">
          {facts.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-400 text-slate-900">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 sm:text-lg dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 sm:text-sm dark:text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
