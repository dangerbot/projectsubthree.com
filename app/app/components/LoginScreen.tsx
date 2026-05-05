"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginScreen() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError(null);

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });

    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setStep("otp");
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

            <button
              onClick={handleSendOtp}
              disabled={!email.trim() || loading}
              className="w-full mt-4 px-4 py-3 rounded-lg bg-accent text-background text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              {loading ? "Sending code..." : "Continue"}
            </button>

            <p className="text-[11px] text-muted/50 text-center mt-6 leading-relaxed">
              We&apos;ll send a 6-digit code to verify your email.
              No password needed.
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
