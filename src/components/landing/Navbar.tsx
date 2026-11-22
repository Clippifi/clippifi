"use client";

import { useState } from "react";
import Link from "next/link";
import { Close, Menu } from "@/components/icons";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import { btnPrimary } from "@/lib/button-styles";

type NavLink = { label: string; href: string };

const sectionLinks: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "For creators", href: "/#creators" },
  { label: "For brands", href: "/#brands" },
  { label: "Questions", href: "/#faq" },
];

const navLink =
  "relative text-sm text-slate-600 hover:text-brand-600 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform after:duration-200 hover:after:scale-x-100 dark:text-slate-300 dark:hover:text-brand-400 dark:after:bg-brand-400";

// privateBeta: "Sign up" becomes "Join the waitlist"; "Log in" stays for invited people.
export default function Navbar({ privateBeta = false }: { privateBeta?: boolean }) {
  const [open, setOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const dashboardHref = "/c";
  const initials = (user?.name || user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-[#0a0a0a]/95 dark:supports-[backdrop-filter]:bg-[#0a0a0a]/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <Logo className="h-8 w-8 transition-transform duration-200 group-hover:rotate-6" />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Clippifi</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {sectionLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {user ? (
            <Link
              href={dashboardHref}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm ${btnPrimary}`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold">
                {initials}
              </span>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                Log in
              </Link>
              <Link
                href={privateBeta ? "/#waitlist" : "/login"}
                className={`rounded-full px-4 py-2 text-sm ${btnPrimary}`}
              >
                {privateBeta ? "Join the waitlist" : "Sign up"}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            className="text-slate-900 dark:text-white"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-6 w-6">
              <Menu
                className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${open ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
              />
              <Close
                className={`absolute inset-0 h-6 w-6 transition-all duration-200 ${open ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`grid overflow-hidden bg-white transition-[grid-template-rows] duration-300 ease-out dark:bg-[#0a0a0a] lg:hidden ${
          open ? "grid-rows-[1fr] border-t border-slate-200 dark:border-white/10" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-6 pt-2">
            <nav className="flex flex-col gap-1">
              {sectionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4 dark:border-white/10">
              {user ? (
                <Link
                  href={dashboardHref}
                  className={`flex-1 rounded-full px-4 py-2 text-center text-sm ${btnPrimary}`}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm text-slate-900 dark:border-white/15 dark:text-white">
                    Log in
                  </Link>
                  <Link
                    href={privateBeta ? "/#waitlist" : "/login"}
                    onClick={() => setOpen(false)}
                    className={`flex-1 rounded-full px-4 py-2 text-center text-sm ${btnPrimary}`}
                  >
                    {privateBeta ? "Join the waitlist" : "Sign up"}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
