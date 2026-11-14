import Image from "next/image";

// The Clippifi symbol (paperclip "p"). Brand files live in public/brand; the source
// kit is clippifi-brand-kit/. Use tone="ink" on brand-colored backgrounds, where the
// gradient symbol would disappear (it switches back to the gradient in dark mode).
export default function Logo({ className = "h-8 w-8", tone = "brand" }: { className?: string; tone?: "brand" | "ink" }) {
  return (
    <span className={`relative block shrink-0 ${className}`}>
      {tone === "ink" ? (
        <>
          <Image src="/brand/clippifi-symbol-black.svg" alt="" fill sizes="48px" className="object-contain dark:hidden" />
          <Image src="/brand/clippifi-symbol-gradient.svg" alt="" fill sizes="48px" className="hidden object-contain dark:block" />
        </>
      ) : (
        <Image src="/brand/clippifi-symbol-gradient.svg" alt="" fill sizes="48px" className="object-contain" />
      )}
    </span>
  );
}
