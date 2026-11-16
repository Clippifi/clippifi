import { SUPPORT_EMAIL } from "@/lib/site";
import Link from "next/link";
import Logo from "@/components/Logo";

const columns = [
  {
    title: "Creators",
    links: [
      { label: "How creators earn", href: "/#creators" },
      { label: "Start earning", href: "/login" },
      { label: "Payouts", href: "/refund-policy" },
    ],
  },
  {
    title: "Brands",
    links: [
      { label: "How campaigns work", href: "/#brands" },
      { label: "Campaign types", href: "/#campaigns" },
      { label: "Launch a campaign", href: "/login" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Questions", href: "/#faq" },
      { label: "Contact", href: `mailto:${SUPPORT_EMAIL}` },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Refund & Payout Policy", href: "/refund-policy" },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-slate-50 pt-16 text-slate-500 dark:bg-[#0a0a0a] dark:text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold text-slate-900 dark:text-white">Clippifi</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-500 dark:text-slate-500">
              Brands pay creators for real, verified views.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors duration-200 hover:text-slate-900 dark:hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-500 transition-colors duration-200 hover:text-slate-900 dark:hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center border-t border-slate-200 py-6 dark:border-white/10">
          <p className="text-xs text-slate-500">© 2026 Clippifi. Not affiliated with TikTok, Instagram or YouTube.</p>
        </div>
      </div>
    </footer>
  );
}
