// How Clippifi shows money, counts and time (DESIGN.md → Money, numbers and time).
// Money is stored and passed around as integer cents (USD) or kobo (NGN): never floats.

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const ngn = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });
const compactNumber = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const plainNumber = new Intl.NumberFormat("en-US");

/** `$1,234.56` — always two decimals. */
export function formatUSD(cents: number): string {
  return usd.format(cents / 100);
}

/** `$1.5K`, `$4K`, `$950` — compact money for cards and meters. */
export function formatUSDCompact(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) < 1000) return Number.isInteger(dollars) ? usdWhole.format(dollars) : usd.format(dollars);
  return `$${compactNumber.format(dollars)}`;
}

/** `₦158,250` — whole naira. */
export function formatNGN(naira: number): string {
  return ngn.format(naira);
}

/** `$1.50 / 1K views` (long) or `$1.50/1K` (short, for cards). `rateCents` is per 1,000 views. */
export function formatRate(rateCents: number, style: "long" | "short" = "long"): string {
  const amount = usd.format(rateCents / 100);
  return style === "long" ? `${amount} / 1K views` : `${amount}/1K`;
}

/** `12.4K`, `1.2M`, `950` — compact counts; pair with `formatCount` for the exact value. */
export function formatCompact(n: number): string {
  return compactNumber.format(n);
}

/** `12,431` — exact counts (tooltips, tables). */
export function formatCount(n: number): string {
  return plainNumber.format(n);
}

/** `3m ago`, `5h ago`, `2d ago`; older than 7 days falls back to a date. */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const minutes = Math.round((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days <= 7) return `${days}d ago`;
  return formatDate(date);
}

/** `now`, `45m`, `5h`, `3d`, `2w`, `4mo` — short ages for cards ("Kicks Daily · 1w"). */
export function formatAge(date: Date, now: Date = new Date()): string {
  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  if (days < 30) return `${Math.floor(days / 7)}w`;
  return `${Math.floor(days / 30)}mo`;
}

/** `Nov 11, 2026` in the viewer's time zone. */
export function formatDate(date: Date, timeZone?: string): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone });
}

/** `Tue 18 Nov` — the "available on" style for upcoming dates. */
export function formatDay(date: Date, timeZone?: string): string {
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short", timeZone });
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone });
  return `${weekday} ${day}`;
}

/** Minutes left in the 30-minute submit window, or 0 when it has passed. */
export function minutesLeftToSubmit(postedAt: Date, now: Date = new Date(), windowMinutes = 30): number {
  const left = windowMinutes - (now.getTime() - postedAt.getTime()) / 60000;
  return left > 0 ? Math.ceil(left) : 0;
}

/** Views needed before a clip's first payout: ceil(minPayout × 1000 / rate). */
export function viewsToMinimum(minPayoutCents: number, rateCents: number): number {
  if (rateCents <= 0) return 0;
  return Math.ceil((minPayoutCents * 1000) / rateCents);
}

/**
 * A band for what someone earned, for anything other people can see (leaderboards, top
 * clips): never the exact amount (FOUNDATION.md §11, D6). Bands: under $10, $10+, $100+,
 * $1K+, $10K+.
 */
export function earningsTier(cents: number): string {
  if (cents >= 1_000_000) return "$10K+";
  if (cents >= 100_000) return "$1K+";
  if (cents >= 10_000) return "$100+";
  if (cents >= 1_000) return "$10+";
  return "Under $10";
}

/** The hour (0–23) in a time zone. The server runs on UTC, so local greetings need this. */
export function hourIn(timeZone: string, date: Date = new Date()): number {
  return Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone }).format(date));
}
