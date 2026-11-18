import Link from "next/link";
import { Eye, Play } from "@/components/icons";
import { btnPrimary, btnSecondary } from "@/lib/button-styles";

const HERO_TONES: Record<string, string> = {
  "clip-podcast-studio": "bg-[radial-gradient(circle_at_30%_25%,#fff5b8_0%,#f7d43a_40%,#2e2305_100%)]",
  "clip-streetball": "bg-[radial-gradient(circle_at_70%_30%,#9ad7ff_0%,#3b82f6_45%,#0f1b3d_100%)]",
  "clip-mountain-lake": "bg-[radial-gradient(circle_at_40%_20%,#c7f9cc_0%,#2fa36b_45%,#0e2a1f_100%)]",
  default: "bg-gradient-to-br from-brand-400 to-slate-900",
};

const platforms = [
  { name: "TikTok", status: "Live" },
  { name: "Instagram", status: "Soon" },
  { name: "YouTube", status: "Soon" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
      <div
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle,rgba(0,0,0,0.08)_1.5px,transparent_1.5px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)] dark:[background-image:radial-gradient(circle,rgba(255,255,255,0.12)_1.5px,transparent_1.5px)]"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="max-w-xl">
          <h1 className="animate-fade-in-up text-4xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Real views.
            <br />
            <Highlight>Real pay.</Highlight>
          </h1>
          <p
            className="animate-fade-in-up mt-5 text-base text-slate-500 dark:text-slate-400 sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Brands fund a campaign and set a rate per 1,000 views. Creators post a clip, submit
            the link, and get paid for every view we verify. No pitching, no follower minimum.
          </p>

          <div
            className="animate-fade-in-up mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Link href="/login" className={`group rounded-full px-6 py-3 text-center text-sm ${btnPrimary}`}>
              Start earning{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/login" className={`rounded-full px-6 py-3 text-center text-sm ${btnSecondary}`}>
              Launch a campaign
            </Link>
          </div>

          <div
            className="animate-fade-in-up mt-12"
            style={{ animationDelay: "360ms" }}
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Campaigns run on</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
              {platforms.map(({ name, status }) => (
                <span key={name} className="flex items-center gap-2 text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  {name}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      status === "Live"
                        ? "bg-brand-400 text-slate-900"
                        : "bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400"
                    }`}
                  >
                    {status}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="animate-fade-in-up relative mx-auto h-[420px] w-full max-w-md sm:h-[480px]"
          style={{ animationDelay: "180ms" }}
        >
          <ClipCard
            className="left-1/2 top-0 w-[68%] -translate-x-[62%]"
            floatDelay="0s"
            duration="$1.50 / 1K views"
            title="Podcast highlights"
            author="@studio.clips"
            likes="48.2K views"
            imageSeed="clip-podcast-studio"
          />
          <ClipCard
            className="right-0 top-6 w-[38%]"
            floatDelay="-1.4s"
            duration="$2.00 / 1K"
            title="Sneaker drop"
            author="@kicks.daily"
            imageSeed="clip-streetball"
            compact
          />
          <ClipCard
            className="right-2 top-[62%] w-[46%]"
            floatDelay="-3s"
            duration="$1.00 / 1K"
            title="New single"
            author="@sound.on"
            imageSeed="clip-mountain-lake"
            compact
          />

          <span
            className="animate-float absolute left-[6%] top-[46%] flex h-10 w-10 items-center justify-center rounded-inner bg-black shadow-lg"
            style={{ animationDelay: "-2s" }}
          >
            <TikTokGlyph />
          </span>
          <span
            className="animate-float absolute -right-2 top-[38%] flex h-10 w-10 items-center justify-center rounded-inner bg-red-600 shadow-lg"
            style={{ animationDelay: "-0.5s" }}
          >
            <YoutubeGlyph />
          </span>
          <span
            className="animate-float absolute left-[10%] bottom-[6%] flex h-10 w-10 items-center justify-center rounded-inner bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 shadow-lg"
            style={{ animationDelay: "-3.5s" }}
          >
            <InstagramGlyph />
          </span>
        </div>
      </div>
    </section>
  );
}

function ClipCard({
  className,
  duration,
  title,
  author,
  likes,
  imageSeed,
  compact,
  floatDelay,
}: {
  className: string;
  duration: string;
  title: string;
  author: string;
  likes?: string;
  imageSeed: string;
  compact?: boolean;
  floatDelay: string;
}) {
  return (
    <div
      className={`animate-float absolute overflow-hidden rounded-card border border-slate-200 shadow-2xl shadow-slate-300/50 dark:border-white/10 dark:shadow-black/50 ${className}`}
      style={{ aspectRatio: "9 / 16", animationDelay: floatDelay }}
    >
      {/* Drawn with CSS so the hero never waits on a photo download. */}
      <div className={`absolute inset-0 ${HERO_TONES[imageSeed] ?? HERO_TONES.default}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
      <div className="relative flex h-full flex-col justify-between p-3">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
            {duration}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Play className="h-4 w-4 fill-white text-white" />
          </span>
        </div>

        <div>
          {!compact && (
            <p className="text-sm font-semibold leading-tight text-white">{title}</p>
          )}
          <div className="mt-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-slate-300">
              <span className="h-3.5 w-3.5 rounded-full bg-white/20" />
              {author}
              <span className="text-sky-400">✓</span>
            </span>
            {likes && (
              <span className="flex items-center gap-1 text-[11px] text-slate-300">
                <Eye className="h-3 w-3" /> {likes}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block rounded-inner bg-brand-400 px-2.5 pb-1 text-[#252525]">
      {children}
    </span>
  );
}

function TikTokGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-3.66h-3.1v13.44a2.6 2.6 0 1 1-1.83-2.48V9.9a5.9 5.9 0 1 0 5 5.82V9.5a7.5 7.5 0 0 0 4 1.17V7.57a4.3 4.3 0 0 1-1-1.75z" />
    </svg>
  );
}
function YoutubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
      <path d="M10 15l5.19-3L10 9v6zm11-3c0 2.5-.3 4-.3 4a2.9 2.9 0 0 1-2 2s-2.7.3-6.7.3-6.7-.3-6.7-.3a2.9 2.9 0 0 1-2-2s-.3-1.5-.3-4 .3-4 .3-4a2.9 2.9 0 0 1 2-2S8 5.7 12 5.7s6.7.3 6.7.3a2.9 2.9 0 0 1 2 2s.3 1.5.3 4z" />
    </svg>
  );
}
function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
      <path d="M12 2.2c2.7 0 3 0 4 .1 1 0 1.7.2 2 .4a4 4 0 0 1 1.5 1 4 4 0 0 1 1 1.4c.2.4.4 1 .4 2.1.1 1 .1 1.3.1 4s0 3-.1 4c0 1-.2 1.7-.4 2a4 4 0 0 1-1 1.5 4 4 0 0 1-1.5 1c-.3.2-1 .4-2 .4-1.1.1-1.4.1-4 .1s-3 0-4-.1c-1 0-1.7-.2-2-.4a4 4 0 0 1-1.5-1 4 4 0 0 1-1-1.5c-.2-.3-.4-1-.4-2-.1-1-.1-1.3-.1-4s0-3 .1-4c0-1 .2-1.7.4-2a4 4 0 0 1 1-1.5 4 4 0 0 1 1.5-1c.3-.1 1-.3 2-.4 1-.1 1.3-.1 4-.1zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.2-8.4a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
    </svg>
  );
}
