"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * Marketing page. The hero (animated time, pace grid, tagline) is ported
 * from the original site/index.html, kept on-brand: minimalist, dark,
 * the numbers do the talking. Three sections follow: what it is, how it
 * works, and a final CTA into the app.
 */
export default function Landing() {
  const timeHRef = useRef<HTMLSpanElement>(null);
  const timeMRef = useRef<HTMLSpanElement>(null);
  const timeSRef = useRef<HTMLSpanElement>(null);
  const paceMiRef = useRef<HTMLDivElement>(null);
  const paceKmRef = useRef<HTMLDivElement>(null);
  const paceMphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateValue(
      el: HTMLElement,
      startVal: number,
      endVal: number,
      duration: number,
      formatter: (v: number) => string
    ) {
      const startTime = performance.now();
      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = startVal + (endVal - startVal) * eased;
        el.textContent = formatter(current);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function countdown() {
      if (!timeHRef.current || !timeMRef.current || !timeSRef.current) return;
      const totalSeconds = 3 * 60 * 60;
      const targetSeconds = 2 * 3600 + 59 * 60 + 59;
      const totalSteps = totalSeconds - targetSeconds;
      const duration = 2000;
      const startTime = performance.now();

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const currentTotal = Math.round(totalSeconds - totalSteps * eased);
        const h = Math.floor(currentTotal / 3600);
        const m = Math.floor((currentTotal % 3600) / 60);
        const s = currentTotal % 60;
        if (timeHRef.current) timeHRef.current.textContent = String(h);
        if (timeMRef.current)
          timeMRef.current.textContent = String(m).padStart(2, "0");
        if (timeSRef.current)
          timeSRef.current.textContent = String(s).padStart(2, "0");
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    function runPaces() {
      if (paceMiRef.current)
        animateValue(paceMiRef.current, 0, 411, 1400, (v) => {
          const mins = Math.floor(v / 60);
          const secs = Math.round(v % 60);
          return `${mins}:${String(secs).padStart(2, "0")}`;
        });
      if (paceKmRef.current)
        animateValue(paceKmRef.current, 0, 255, 1400, (v) => {
          const mins = Math.floor(v / 60);
          const secs = Math.round(v % 60);
          return `${mins}:${String(secs).padStart(2, "0")}`;
        });
      if (paceMphRef.current)
        animateValue(paceMphRef.current, 0, 8.8, 1400, (v) => v.toFixed(1));
    }

    const t1 = setTimeout(countdown, 1000);
    const t2 = setTimeout(runPaces, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ───── HERO ───────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-20 pb-24 max-w-[720px] mx-auto">
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.03) 0%, transparent 70%)",
          }}
        />

        <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-4 animate-fade-in">
          Project
        </p>

        <h1
          className="font-black leading-[0.92] tracking-[-0.03em] mb-2 animate-fade-in"
          style={{ fontSize: "clamp(56px, 12vw, 96px)" }}
        >
          <span className="block">SUB</span>
          <span className="block">THREE</span>
        </h1>

        <p className="text-sm font-light tracking-wider text-muted mb-14 animate-fade-in animation-delay-700">
          26.2 miles under 3 hours
        </p>

        {/* Animated time */}
        <div
          className="font-black tracking-[-0.04em] mb-10 tabular-nums animate-fade-in animation-delay-1000"
          style={{ fontSize: "clamp(36px, 8vw, 56px)" }}
        >
          <span ref={timeHRef}>3</span>
          <span className="text-muted/40">:</span>
          <span ref={timeMRef}>00</span>
          <span className="text-muted/40">:</span>
          <span ref={timeSRef}>00</span>
        </div>

        {/* Pace grid */}
        <div className="grid grid-cols-3 gap-px bg-border/40 rounded mb-12 overflow-hidden">
          <div className="bg-background py-5 text-center">
            <div
              ref={paceMiRef}
              className="font-bold tracking-tight mb-1 tabular-nums"
              style={{ fontSize: "clamp(22px, 4vw, 28px)" }}
            >
              0:00
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
              min / mile
            </div>
          </div>
          <div className="bg-background py-5 text-center">
            <div
              ref={paceKmRef}
              className="font-bold tracking-tight mb-1 tabular-nums"
              style={{ fontSize: "clamp(22px, 4vw, 28px)" }}
            >
              0:00
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
              min / km
            </div>
          </div>
          <div className="bg-background py-5 text-center">
            <div
              ref={paceMphRef}
              className="font-bold tracking-tight mb-1 tabular-nums"
              style={{ fontSize: "clamp(22px, 4vw, 28px)" }}
            >
              0.0
            </div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
              mph
            </div>
          </div>
        </div>

        <p className="text-base font-light leading-[1.7] text-muted-light max-w-[460px] mb-10 animate-fade-in animation-delay-3000">
          This isn&apos;t for everyone. But if you&apos;re the kind of runner who
          thinks about pace in the shower and adds an extra mile just to hit a
          round number —{" "}
          <em className="not-italic text-foreground/80">
            you might have a sub-three in you.
          </em>{" "}
          Let an AI companion get to know you and help you find out.
        </p>

        <div className="flex items-center gap-4 animate-fade-in animation-delay-3500">
          <Link
            href="/companion"
            className="inline-flex items-center bg-foreground text-background px-7 py-3.5 rounded text-[13px] font-semibold tracking-[0.12em] uppercase hover:opacity-85 active:scale-[0.98] transition"
          >
            Start your sub-three
          </Link>
          <a
            href="#how"
            className="text-[13px] text-muted hover:text-foreground transition"
          >
            How it works ↓
          </a>
        </div>
      </section>

      {/* ───── WHAT IT IS ─────────────────────────────────────────────── */}
      <section className="border-t border-border/50 px-6 py-24">
        <div className="max-w-[720px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-6">
            What it is
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
            Not a chatbot. A companion that knows your training and can actually
            do something about it.
          </h2>
          <p className="text-base md:text-lg font-light leading-[1.7] text-muted-light max-w-[600px]">
            Every conversation has the full context of your running — what
            you&apos;ve done, what&apos;s coming up, how you&apos;re feeling
            today. When life changes, the plan changes. When you finish a run,
            it&apos;s logged. When you ask &ldquo;am I really on pace for
            sub-three?&rdquo; — you get the math, not the platitudes.
          </p>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="how" className="border-t border-border/50 px-6 py-24">
        <div className="max-w-[960px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-6">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-14">
            Three things most AI tools get wrong.
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-border/40 rounded overflow-hidden">
            <div className="bg-background p-8">
              <div className="text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                01 — Context
              </div>
              <h3 className="text-xl font-semibold mb-3">Knows you</h3>
              <p className="text-sm font-light leading-[1.7] text-muted-light">
                Your history, fitness, target race, weekly mileage, what you
                did yesterday. The companion remembers — so you never start a
                conversation from zero.
              </p>
            </div>

            <div className="bg-background p-8">
              <div className="text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                02 — Adaptability
              </div>
              <h3 className="text-xl font-semibold mb-3">Adapts to life</h3>
              <p className="text-sm font-light leading-[1.7] text-muted-light">
                Played a long set of tennis last night? Sick on a long-run
                day? The plan rewrites itself — and shows you how your
                probability of breaking three shifts in real time.
              </p>
            </div>

            <div className="bg-background p-8">
              <div className="text-accent text-[11px] font-bold tracking-[0.3em] uppercase mb-4">
                03 — Action
              </div>
              <h3 className="text-xl font-semibold mb-3">Takes action</h3>
              <p className="text-sm font-light leading-[1.7] text-muted-light">
                Tell it you finished your long run. It marks it. Ask for a
                taper week. It builds one. Tool use, not just talk — the
                companion does the work, you stay in the conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───── APP PREVIEW ────────────────────────────────────────────── */}
      <section className="border-t border-border/50 px-6 py-24">
        <div className="max-w-[960px] mx-auto">
          <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-6">
            Inside the app
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-14">
            Chat on the left. Your training on the right. Always in sync.
          </h2>

          {/* Stylized preview — a hint at the split-screen pattern */}
          <div className="border border-border/60 rounded-lg overflow-hidden bg-surface/60">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-surface">
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="w-2.5 h-2.5 rounded-full bg-border" />
              <span className="ml-3 text-[11px] text-muted/70 tracking-wider">
                projectsubthree.com / companion
              </span>
            </div>

            <div className="grid grid-cols-2 min-h-[300px]">
              {/* Chat side */}
              <div className="p-6 border-r border-border/60 flex flex-col gap-4">
                <div className="text-xs text-muted/60 uppercase tracking-wider">
                  Conversation
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed">
                  You&apos;re here because you want to break three hours.
                  I&apos;m here to help. Let&apos;s start by getting to know
                  you as a runner.
                </div>
                <div className="self-end max-w-[80%] text-sm bg-accent/10 border border-accent/30 rounded-lg px-3 py-2 text-foreground/90">
                  Last marathon: 3:15. Currently running 24 mi/wk.
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed">
                  Got it. You&apos;re 15 minutes off. Let&apos;s build a plan
                  to find them.
                </div>
              </div>

              {/* Dashboard side */}
              <div className="p-6 flex flex-col gap-5">
                <div className="text-xs text-muted/60 uppercase tracking-wider">
                  Readiness
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-background border border-border/60 rounded p-3 text-center">
                    <div className="text-2xl font-bold tabular-nums">62%</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted/60 mt-1">
                      Probability
                    </div>
                  </div>
                  <div className="bg-background border border-border/60 rounded p-3 text-center">
                    <div className="text-2xl font-bold tabular-nums">16</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted/60 mt-1">
                      Weeks
                    </div>
                  </div>
                  <div className="bg-background border border-border/60 rounded p-3 text-center">
                    <div className="text-2xl font-bold tabular-nums">42</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted/60 mt-1">
                      Peak mi/wk
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted/60 uppercase tracking-wider mt-2">
                  This week
                </div>
                <div className="space-y-2 text-xs text-muted-light">
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Mon · Easy</span>
                    <span className="tabular-nums">5 mi</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Wed · Tempo</span>
                    <span className="tabular-nums">6 mi</span>
                  </div>
                  <div className="flex justify-between border-b border-border/40 pb-1.5">
                    <span>Fri · Easy</span>
                    <span className="tabular-nums">4 mi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sat · Long</span>
                    <span className="tabular-nums">12 mi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FINAL CTA ──────────────────────────────────────────────── */}
      <section className="border-t border-border/50 px-6 py-24">
        <div className="max-w-[720px] mx-auto text-center">
          <h2 className="font-black tracking-[-0.03em] leading-[0.95] mb-6"
              style={{ fontSize: "clamp(40px, 8vw, 72px)" }}>
            2:59:59
          </h2>
          <p className="text-base font-light text-muted-light max-w-[460px] mx-auto mb-10">
            One second under three hours. That&apos;s the only number that
            matters. Let&apos;s find out if it&apos;s in you.
          </p>
          <Link
            href="/companion"
            className="inline-flex items-center bg-foreground text-background px-8 py-4 rounded text-[13px] font-semibold tracking-[0.12em] uppercase hover:opacity-85 active:scale-[0.98] transition"
          >
            Start your sub-three
          </Link>
        </div>
      </section>

      {/* ───── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 px-6 py-10">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] tracking-wider text-muted/60">
          <span>projectsubthree.com</span>
          <span>An experiment in AI-native consumer product</span>
        </div>
      </footer>

      {/* Tailwind v4 doesn't ship fade-in utilities by default — define inline */}
      <style jsx global>{`
        @keyframes psub-fade-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          opacity: 0;
          animation: psub-fade-in 0.7s ease forwards;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-3500 {
          animation-delay: 3.5s;
        }
      `}</style>
    </main>
  );
}
