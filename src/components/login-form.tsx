"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";

const AFTER_SIGN_IN = "/c";

// One form for sign-in and sign-up: Google, or a 6-digit code sent to the email.
// A new email address gets an account automatically.
export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"google" | "send" | "verify" | null>(null);
  const { data: session } = authClient.useSession();

  // Already signed in: go straight to the app.
  useEffect(() => {
    if (session) router.replace(AFTER_SIGN_IN);
  }, [session, router]);

  async function continueWithGoogle() {
    setBusy("google");
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: AFTER_SIGN_IN });
    if (error) {
      toast.error(error.message ?? "Google sign-in isn't available right now.");
      setBusy(null);
    }
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!email.trim()) return;
    setBusy("send");
    const { error } = await authClient.emailOtp.sendVerificationOtp({ email: email.trim(), type: "sign-in" });
    setBusy(null);
    if (error) {
      toast.error(error.message ?? "We couldn't send a code. Try again.");
      return;
    }
    setCode("");
    setStep("code");
  }

  async function verifyCode(value: string) {
    setBusy("verify");
    const { error } = await authClient.signIn.emailOtp({ email: email.trim(), otp: value });
    if (error) {
      toast.error(error.message ?? "That code didn't work. Check it and try again.");
      setCode("");
      setBusy(null);
      return;
    }
    router.push(AFTER_SIGN_IN);
    router.refresh();
  }

  if (step === "code") {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field className="items-center">
              <FieldLabel htmlFor="code" className="sr-only">
                Code
              </FieldLabel>
              <InputOTP
                id="code"
                maxLength={6}
                value={code}
                onChange={setCode}
                onComplete={verifyCode}
                disabled={busy === "verify"}
                autoFocus
              >
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription className="text-center">The code expires in 10 minutes.</FieldDescription>
            </Field>
            <Field>
              <Button onClick={() => verifyCode(code)} disabled={code.length !== 6 || busy === "verify"}>
                {busy === "verify" && <Loader2 className="animate-spin" />}
                Continue
              </Button>
              <FieldDescription className="text-center">
                Didn&apos;t get it?{" "}
                <button type="button" className="underline underline-offset-4" onClick={() => sendCode()} disabled={busy !== null}>
                  Send a new code
                </button>{" "}
                or{" "}
                <button type="button" className="underline underline-offset-4" onClick={() => setStep("email")}>
                  use a different email
                </button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Clippifi</CardTitle>
          <CardDescription>Sign in or create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={sendCode}>
            <FieldGroup>
              {googleEnabled && (
                <>
                  <Field>
                    <Button variant="outline" type="button" onClick={continueWithGoogle} disabled={busy !== null}>
                      {busy === "google" ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
                      Continue with Google
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">Or</FieldSeparator>
                </>
              )}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit" disabled={busy !== null}>
                  {busy === "send" && <Loader2 className="animate-spin" />}
                  Continue with email
                </Button>
                <FieldDescription className="text-center">We&apos;ll email you a code. No password needed.</FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our <Link href="/terms">Terms of Service</Link> and{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </FieldDescription>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.29h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.87c2.26-2.09 3.58-5.17 3.58-8.64Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.08.72-2.45 1.16-4.06 1.16-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A11.99 11.99 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.6 4.59 1.8l3.43-3.43A11.97 11.97 0 0 0 1.29 6.6l4 3.1C6.23 6.86 8.88 4.75 12 4.75Z" />
    </svg>
  );
}
