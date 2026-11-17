import BoringAvatar from "boring-avatars";
import { cn } from "@/lib/utils";

// A person's picture, or (when they have none) a soft gradient generated from their
// name or email: always the same for the same person, no initials (DESIGN.md → Avatars).
// The palette sits around brand yellow so gradients feel like Clippifi.
const PALETTE = ["#FFE873", "#FFB38A", "#8ED1C6", "#93B7F2", "#C9A8F0"];

type Person = { name?: string | null; email?: string | null; image?: string | null };

export function UserAvatar({ user, className }: { user: Person; className?: string }) {
  const seed = user.email || user.name || "clippifi";
  return (
    <span className={cn("relative inline-flex size-8 shrink-0 overflow-hidden rounded-full [&>svg]:size-full!", className)}>
      {user.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatars come from many hosts (Google, TikTok)
        <img src={user.image} alt="" className="size-full object-cover" referrerPolicy="no-referrer" />
      ) : (
        <BoringAvatar name={seed} variant="marble" colors={PALETTE} square className="size-full" aria-hidden="true" />
      )}
    </span>
  );
}
