import type { ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
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

          <div className="legal-content mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
