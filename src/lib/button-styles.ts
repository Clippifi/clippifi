// Marketing-page buttons (see DESIGN.md → Buttons). Apple-style: soft, filled, no
// borders or hard shadows; a slight press-down on click. Callers add size and radius
// (the landing page uses rounded-full). App screens use the shadcn <Button> instead.

// Brand call to action: yellow fill, charcoal text. One per view.
export const btnPrimary =
  "bg-brand-400 font-semibold text-[#252525] transition-[background-color,transform] duration-150 ease-[var(--ease-apple)] hover:bg-brand-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

// Secondary action: quiet grey fill, charcoal text (white-on-dark in dark mode).
export const btnSecondary =
  "bg-black/[0.06] font-semibold text-[#252525] transition-[background-color,transform] duration-150 ease-[var(--ease-apple)] hover:bg-black/[0.1] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";
