import type { SVGProps } from "react";

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.14-3.66h-3.1v13.44a2.6 2.6 0 1 1-1.83-2.48V9.9a5.9 5.9 0 1 0 5 5.82V9.5a7.5 7.5 0 0 0 4 1.17V7.57a4.3 4.3 0 0 1-1-1.75z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

const PLATFORM_ICON = { tiktok: TikTokIcon, instagram: InstagramIcon, youtube: YouTubeIcon } as const;
const PLATFORM_NAME = { tiktok: "TikTok", instagram: "Instagram", youtube: "YouTube" } as const;

// The platforms a campaign accepts, as small soft circles.
export function PlatformIcons({
  platforms,
  className,
}: {
  platforms: (keyof typeof PLATFORM_ICON)[];
  className?: string;
}) {
  return (
    <span className={["flex items-center gap-1", className].filter(Boolean).join(" ")}>
      {platforms.map((p) => {
        const Icon = PLATFORM_ICON[p];
        return (
          <span key={p} title={PLATFORM_NAME[p]} className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-foreground">
            <Icon className="size-3.5" />
            <span className="sr-only">{PLATFORM_NAME[p]}</span>
          </span>
        );
      })}
    </span>
  );
}
