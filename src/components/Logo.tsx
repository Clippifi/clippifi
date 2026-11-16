import Image from "next/image";

// The Clippifi symbol (paperclip "p"). Brand files live in public/brand; the source
// kit is clippifi-brand-kit/. Brand yellow is too light to read on white, so the
// symbol is charcoal in light mode and yellow in dark mode. tone="ink" keeps it
// charcoal in both, for yellow backgrounds.
export default function Logo({ className = "h-8 w-8", tone = "brand" }: { className?: string; tone?: "brand" | "ink" }) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      <Image
        src="/brand/clippifi-symbol-black.svg"
        alt=""
        fill
        sizes="48px"
        className={`object-contain ${tone === "brand" ? "dark:hidden" : ""}`}
      />
      {tone === "brand" && (
        <Image src="/brand/clippifi-symbol-gradient.svg" alt="" fill sizes="48px" className="hidden object-contain dark:block" />
      )}
    </span>
  );
}
