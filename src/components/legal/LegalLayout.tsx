import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Every legal page, in the order of the tab bar. One place to add a new document.
export const LEGAL_PAGES = [
  { key: "creator", href: "/terms", label: "Creator Terms" },
  { key: "brand", href: "/terms/brands", label: "Brand Terms" },
  { key: "privacy", href: "/privacy", label: "Privacy Policy" },
  { key: "refunds", href: "/refund-policy", label: "Refunds & Payouts" },
] as const;

export type LegalPageKey = (typeof LEGAL_PAGES)[number]["key"];

export default function LegalLayout({
  title,
  updated,
  current,
  children,
}: {
  title: string;
  updated: string;
  current: LegalPageKey;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {updated}</p>

          {/* The other legal documents, one tap away (they are read together). */}
          <nav aria-label="Legal documents" className="mt-6 flex flex-wrap gap-2">
            {LEGAL_PAGES.map((page) => (
              <Link
                key={page.key}
                href={page.href}
                aria-current={page.key === current ? "page" : undefined}
                className={
                  page.key === current
                    ? "rounded-full bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white dark:bg-white dark:text-slate-900"
                    : "rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/15"
                }
              >
                {page.label}
              </Link>
            ))}
          </nav>

          <div className="legal-content mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
