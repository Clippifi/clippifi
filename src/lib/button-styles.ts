// Shared "sticker" button treatment: solid fill, hard border, hard offset shadow that
// lifts on hover/press — deliberately not a soft gradient-pill button (the single most
// repeated element that made the app read as a generic AI-template build). Colors come
// from the `brand` scale in src/app/globals.css.
export const btnPrimary =
  "border-2 border-black bg-brand-400 font-semibold text-black shadow-[3px_3px_0_0_#000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] active:translate-y-0 active:shadow-[1px_1px_0_0_#000] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-[3px_3px_0_0_#000] dark:border-brand-200 dark:shadow-[3px_3px_0_0_#ffd0cb] dark:hover:shadow-[5px_5px_0_0_#ffd0cb] dark:active:shadow-[1px_1px_0_0_#ffd0cb] dark:disabled:hover:shadow-[3px_3px_0_0_#ffd0cb]";

// Quieter counterpart for secondary actions (Back/Cancel/outline links) — same hard-edge
// language at lower emphasis: an ink-fill hover instead of a shadow, so primary actions
// still visually lead.
export const btnSecondary =
  "border-2 border-slate-900 font-semibold text-slate-900 transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-900 hover:text-white active:translate-y-0 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black";
