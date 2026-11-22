import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { LoginForm } from "@/components/login-form";
import { PRIVATE_BETA } from "@/server/access";

export const metadata: Metadata = {
  title: "Sign in — Clippifi",
};

// Static so it opens instantly; LoginForm sends signed-in visitors to the app.
export default function LoginPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-semibold">
          <Logo className="h-7 w-7" />
          Clippifi
        </Link>
        {/* Google shows only once its keys are configured. */}
        <LoginForm googleEnabled={Boolean(process.env.GOOGLE_CLIENT_ID?.trim())} privateBeta={PRIVATE_BETA} />
      </div>
    </main>
  );
}
