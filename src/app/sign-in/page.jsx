"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, LogIn, Loader2, Mail } from "lucide-react";

import AuthShell from "@/components/auth-shell";
import { cn } from "cn";
import { authClient, getSession, signIn } from "@/lib/auth-client";
import { roleDestination } from "@/lib/roles";

const inputClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!password) return setError("Please enter your password.");

    setSubmitting(true);
    const { error: signInError } = await signIn.email({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(
        signInError.message?.toLowerCase().includes("invalid")
          ? "Invalid email or password. Please try again."
          : signInError.message ?? "Could not sign you in. Please try again."
      );
      setSubmitting(false);
      return;
    }

    setSuccess("Welcome back! Redirecting…");
    const session = await getSession();
    const role = session?.data?.user?.role ?? "customer";
    const destination = callbackUrl || roleDestination(role);
    setTimeout(() => router.push(destination), 900);
  };

  const handleGoogle = async () => {
    setError("");
    const { error: googleError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: callbackUrl || "/",
    });
    if (googleError) {
      setError(
        "Google sign-in isn't configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local."
      );
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your WedPlan account and bookings."
      footer={
        <>
          New to WedPlan?{" "}
          <Link href="/sign-up" className="font-semibold text-garnet hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-600/30 bg-emerald-600/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400"
        >
          <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide text-espresso/70">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={cn(inputClass, "pl-11")}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide text-espresso/70">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              className={cn(inputClass, "pl-11 pr-12")}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso/40 transition-colors hover:text-garnet"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-garnet text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Signing you in…
            </>
          ) : (
            <>
              <LogIn className="size-4" aria-hidden="true" />
              Sign In
            </>
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-cream-300" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-espresso/45">
          or continue with
        </span>
        <span className="h-px flex-1 bg-cream-300" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-cream-300 bg-background text-sm font-semibold text-espresso transition-colors hover:border-garnet/30 hover:text-garnet"
      >
        <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
          <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29a11.97 11.97 0 0 0 0 10.76l3.98-3.09z" />
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
        </svg>
        Continue with Google
      </button>

      {callbackUrl && (
        <p className="mt-4 text-center text-xs text-espresso/55">
          You&apos;ll be sent back to{" "}
          <span className="font-medium text-espresso/75">{callbackUrl}</span>{" "}
          after signing in.
        </p>
      )}
    </AuthShell>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
