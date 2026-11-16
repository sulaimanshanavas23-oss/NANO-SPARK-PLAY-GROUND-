"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import { useApp } from "@/src/lib/store/app-provider";
import { buttonClass } from "@/components/shared/button";
import { cn } from "@/src/lib/utils";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function AuthForm() {
  const router = useRouter();
  const { profile, hydrated, cloudEnabled, signIn, signUp, signInWithGoogle, signOut } =
    useApp();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function reset(next: "signin" | "signup") {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setPending(true);
    const result =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(name, email, password);
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.message) {
      setMessage(result.message);
      return;
    }
    router.push("/dashboard");
  }

  async function google() {
    setError(null);
    setMessage(null);
    setPending(true);
    const result = await signInWithGoogle();
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (result.message) {
      setMessage(result.message);
      return;
    }
    router.push("/dashboard");
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-3xl border border-ink/[0.08] bg-white">
        <Loader2 className="h-5 w-5 animate-spin text-spark-dark" />
        <p className="text-[11px] text-ink-muted">Loading your session…</p>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="rounded-3xl border border-ink/[0.08] bg-white p-6 shadow-[0_24px_70px_-55px_rgba(17,17,17,0.5)] sm:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink font-display text-lg font-bold text-spark-yellow">
            {profile.name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-ink-muted/60">
              Signed in
            </p>
            <p className="font-display text-lg font-semibold">{profile.name}</p>
            <p className="text-[11px] text-ink-muted">{profile.email}</p>
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-warm/70 p-4">
          <p className="flex items-center gap-2 text-[11px] text-ink-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            {profile.provider === "demo"
              ? "Local demo session — your activity is saved in this browser."
              : "Account connected. Your activity syncs when cloud storage is configured."}
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <Link href="/dashboard" className={buttonClass("dark")}>
            Open my dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={() => signOut()}
            className={buttonClass("outline", "sm")}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/[0.08] bg-white p-6 shadow-[0_24px_70px_-55px_rgba(17,17,17,0.5)] sm:p-8">
      <div className="flex rounded-full bg-warm p-1">
        {(["signin", "signup"] as const).map((value) => (
          <button
            key={value}
            onClick={() => reset(value)}
            className={cn(
              "flex-1 rounded-full px-4 py-2 text-[11.5px] font-semibold transition-colors",
              mode === value
                ? "bg-ink text-white"
                : "text-ink-muted hover:text-ink",
            )}
          >
            {value === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      <h2 className="mt-6 font-display text-2xl font-semibold">
        {mode === "signin" ? "Welcome back." : "Start your playground."}
      </h2>
      <p className="mt-1 text-[11.5px] leading-relaxed text-ink-muted">
        {mode === "signin"
          ? "Sign in to keep your favourites, progress and recent lab activity together."
          : "Create a profile to save labs, track what you explore and return to your builds."}
      </p>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted/70">
              <User className="h-3 w-3" /> Full name
            </span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
              placeholder="Your name"
              className="w-full rounded-xl border border-ink/10 bg-warm/40 px-3.5 py-3 text-[12.5px] outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark focus:bg-white"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted/70">
            <Mail className="h-3 w-3" /> Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-ink/10 bg-warm/40 px-3.5 py-3 text-[12.5px] outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark focus:bg-white"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-muted/70">
            <Lock className="h-3 w-3" /> Password
          </span>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              placeholder="At least 6 characters"
              className="w-full rounded-xl border border-ink/10 bg-warm/40 px-3.5 py-3 pr-11 text-[12.5px] outline-none transition-colors placeholder:text-ink-muted/40 focus:border-spark-dark focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-ink-muted/60 transition-colors hover:bg-ink/[0.04] hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </label>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[11px] text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[11px] text-emerald-800">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary", "md", "w-full")}
        >
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-ink/10" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-muted/50">
          or
        </span>
        <span className="h-px flex-1 bg-ink/10" />
      </div>

      <button
        onClick={google}
        disabled={pending}
        className={buttonClass("outline", "md", "w-full")}
      >
        <GoogleMark />
        Continue with Google
      </button>

      <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-ink-muted/70">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
        {cloudEnabled
          ? "Authentication is handled by Supabase. Your password is never stored by Nano Playground."
          : "Cloud credentials are not configured, so this uses a local demo session stored only in your browser. Add Supabase keys to enable real accounts."}
      </p>
    </div>
  );
}
