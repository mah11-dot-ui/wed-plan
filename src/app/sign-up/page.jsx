"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Mail,
  Lock,
  Store,
  User,
  UserPlus,
  X,
} from "lucide-react";

import AuthShell from "@/components/auth-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { authClient, getSession, signUp } from "@/lib/auth-client";
import { roleDestination } from "@/lib/roles";

const inputClass =
  "h-11 w-full rounded-xl border border-cream-300 bg-background px-4 text-sm text-espresso outline-none transition-colors placeholder:text-espresso/40 focus:border-garnet focus:ring-2 focus:ring-garnet/15";

const roles = [
  {
    value: "customer",
    title: "I'm a Customer",
    text: "Book trusted vendors for my big day",
    icon: User,
  },
  {
    value: "vendor",
    title: "I'm a Vendor",
    text: "List my services and reach couples",
    icon: Store,
  },
];

function passwordChecks(password) {
  return [
    { label: "At least 6 characters", ok: password.length >= 6 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
  ];
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("customer");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const checks = passwordChecks(password);
  const passwordValid = checks.every((c) => c.ok);
  const googleEnabled = true; // button always shown; errors surface if unconfigured

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setError("");
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImageToImgBB = async (file) => {
    const key = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!key) {
      throw new Error(
        "Profile images need an ImgBB API key. Add NEXT_PUBLIC_IMGBB_API_KEY to .env.local, or skip the photo."
      );
    }
    const body = new FormData();
    body.append("image", file);
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
      method: "POST",
      body,
    });
    const payload = await response.json();
    if (!response.ok || !payload?.data?.url) {
      throw new Error(payload?.error?.message ?? "Image upload to ImgBB failed.");
    }
    return payload.data.url;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      return setError("Please enter a valid email address.");
    }
    if (!passwordValid) return setError("Your password doesn't meet the requirements below.");

    setSubmitting(true);
    try {
      let imageUrl;
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const { error: signUpError } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      if (signUpError) {
        setError(
          signUpError.message?.includes("already")
            ? "An account with this email already exists. Try signing in instead."
            : signUpError.message ?? "Could not create your account. Please try again."
        );
        setSubmitting(false);
        return;
      }

      setSuccess("Account created! Redirecting you now…");
      const session = await getSession();
      const sessionRole = session?.data?.user?.role ?? role;
      const destination = callbackUrl || roleDestination(sessionRole);
      setTimeout(() => router.push(destination), 1200);
    } catch (err) {
      setError(err?.message ?? "Something went wrong. Please try again.");
      setSubmitting(false);
    }
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
      title="Create your account"
      subtitle="Join WedPlan — it's free, and it takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-garnet hover:underline">
            Sign in
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
          <Check className="size-4" strokeWidth={3} aria-hidden="true" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide text-espresso/70">
            Full Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-espresso/40" aria-hidden="true" />
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ayesha Rahman"
              autoComplete="name"
              className={cn(inputClass, "pl-11")}
              required
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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
              placeholder="Create a password"
              autoComplete="new-password"
              className={cn(inputClass, "pl-11 pr-12")}
              required
              minLength={6}
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
          <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {checks.map((rule) => (
              <li
                key={rule.label}
                className={cn(
                  "flex items-center gap-1.5 text-[11px] font-medium transition-colors",
                  rule.ok ? "text-emerald-600 dark:text-emerald-400" : "text-espresso/50"
                )}
              >
                {rule.ok ? (
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <X className="size-3" strokeWidth={3} aria-hidden="true" />
                )}
                {rule.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Profile image (optional) */}
        <div className="space-y-1.5">
          <label htmlFor="image" className="text-xs font-semibold uppercase tracking-wide text-espresso/70">
            Profile Image <span className="font-normal normal-case text-espresso/45">(optional, via ImgBB)</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-dashed border-cream-300 bg-cream-200">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Your profile preview" className="size-full object-cover" />
              ) : (
                <ImagePlus className="size-6 text-espresso/40" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <label
                htmlFor="image"
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-cream-300 bg-background px-4 text-xs font-semibold text-espresso transition-colors hover:border-garnet/40 hover:text-garnet"
              >
                <ImagePlus className="size-4" aria-hidden="true" />
                {imageFile ? "Change photo" : "Upload a photo"}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="sr-only"
              />
              <p className="mt-1.5 truncate text-[11px] text-espresso/50">
                {imageFile ? imageFile.name : "JPG, PNG or GIF — max 5 MB"}
              </p>
            </div>
          </div>
        </div>

        {/* Account role */}
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-semibold uppercase tracking-wide text-espresso/70">
            Account Role
          </legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Choose your role">
            {roles.map(({ value, title, text, icon: Icon }) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={role === value}
                onClick={() => setRole(value)}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all duration-200",
                  role === value
                    ? "border-garnet/50 bg-garnet/5 ring-2 ring-garnet/20"
                    : "border-cream-300 bg-background hover:border-garnet/30"
                )}
              >
                <Icon
                  className={cn("size-5", role === value ? "text-garnet" : "text-espresso/50")}
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-espresso">{title}</span>
                <span className="text-[11px] leading-4 text-espresso/60">{text}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-garnet text-sm font-semibold text-garnet-foreground transition-colors hover:bg-garnet-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Creating your account…
            </>
          ) : (
            <>
              <UserPlus className="size-4" aria-hidden="true" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Divider */}
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

      <p className="mt-6 text-center text-[11px] leading-5 text-espresso/50">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="font-medium text-espresso/70 hover:text-garnet">Terms of Service</Link> and{" "}
        <Link href="/privacy" className="font-medium text-espresso/70 hover:text-garnet">Privacy Policy</Link>.
      </p>
    </AuthShell>
  );
}

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}
