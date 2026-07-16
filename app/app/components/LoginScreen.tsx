"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Where the email link lands after Supabase verifies it.
  // Use the canonical domain in production (never the vercel.app alias);
  // keep the local origin during development.
  const getEmailRedirectTo = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const isLocal =
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.");
    return `${isLocal ? origin : "https://www.projectsubthree.com"}/companion`;
  };

  const handleSendOtp = async () => {
    if (!email.trim() || !acceptedTerms) return;
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: getEmailRedirectTo(),
      },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStep("otp");
    }
  };

  const handleGoogleSignIn = async () => {
    if (!acceptedTerms) return;
    setGoogleLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: getEmailRedirectTo() },
    });

    // On success the browser redirects to Google — we only land here on failure.
    if (err) {
      setGoogleLoading(false);
      setError(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: "email",
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    }
    // On success, the auth listener in AuthProvider picks up the session
  };

  const handleEmailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendOtp();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleVerifyOtp();
  };

  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="w-full max-w-sm px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">
            2:59:59
          </h1>
          <p className="text-sm text-muted">
            Your AI training companion
          </p>
        </div>

        {step === "email" ? (
          <>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleEmailKeyDown}
              autoFocus
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm text-foreground placeholder-muted/50 outline-none focus:border-accent/50 transition-colors"
            />

            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}

            {/* Prototype terms — required before continue */}
            <label className="flex items-start gap-2.5 mt-5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-accent cursor-pointer flex-shrink-0"
              />
              <span className="text-[12px] text-muted-light leading-relaxed">
                I understand this is a prototype and accept the{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-accent hover:underline"
                >
                  Terms of Use
                </Link>
                .
              </span>
            </label>

            <button
              onClick={handleSendOtp}
              disabled={!email.trim() || loading || !acceptedTerms}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-accent text-background text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              {loading ? "Sending code..." : "Continue"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted uppercase tracking-wider">
                or
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google sign-in */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading || !acceptedTerms}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-sm font-semibold text-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center justify-center gap-2.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              {googleLoading ? "Redirecting..." : "Continue with Google"}
            </button>

            <p className="text-[11px] text-muted/50 text-center mt-6 leading-relaxed">
              We&apos;ll send a 6-digit code to verify your email.
              No password needed. This is a personal prototype — things may
              break.
            </p>
          </>
        ) : (
          <>
            <label className="block text-[11px] font-semibold text-muted uppercase tracking-wider mb-2">
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={handleOtpKeyDown}
              autoFocus
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-foreground text-center text-xl font-mono tracking-[0.3em] placeholder-muted/30 outline-none focus:border-accent/50 transition-colors"
            />

            <p className="text-xs text-muted mt-2">
              Sent to <span className="text-foreground">{email}</span>
            </p>

            {error && (
              <p className="text-xs text-red-400 mt-2">{error}</p>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6 || loading}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-accent text-background text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              onClick={() => {
                setStep("email");
                setOtp("");
                setError(null);
              }}
              className="w-full mt-3 text-xs text-muted hover:text-foreground transition-colors py-2"
            >
              Use a different email
            </button>
          </>
        )}
      </div>
    </div>
  );
}
