import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "../components/MarketingNav";
import ArchitectureDiagram from "../components/ArchitectureDiagram";

export const metadata: Metadata = {
  title: "The Tech — Project Sub Three",
  description:
    "How Project Sub Three is built: the runner context model, AI + tool use architecture, and why this product is finally possible.",
};

export default function Tech() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-4">
          The Tech
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
          A concept I&apos;ve been carrying for two decades — that AI finally
          made possible to build.
        </h1>
        <p className="text-base md:text-lg font-light text-muted-light leading-[1.7] mb-14">
          The idea of a truly personal training coach isn&apos;t new. What&apos;s
          new is that the ingredients — messy runner data, natural
          conversation, decisions that adapt to context — can finally live
          together in one system.
        </p>

        <Section title="Why now">
          <p>
            I&apos;ve worked on some version of this idea for twenty years — at
            Nike, at Adidas building miCoach, at startups. Every attempt hit
            the same wall: real runner data is messy. Skipped days,
            self-reported paces, missing weeks, inconsistent devices, a
            marathon PR from ten years ago with no context. The old
            architectures couldn&apos;t use any of that. They needed clean
            inputs. Runners don&apos;t have clean inputs.
          </p>
          <p>
            Modern language models change the math. They accept messy,
            partial, natural-language input and produce useful output.
            They&apos;re also finally good enough at holding context and
            following training principles that a serious runner would take
            them seriously.
          </p>
          <p>
            That&apos;s the unlock. A prototype that would have taken a team
            of five and a research budget a decade ago is now something one
            product person can build in evenings.
          </p>
        </Section>

        <Section title="The runner context model">
          <p>
            The core data structure isn&apos;t a training plan. It&apos;s a
            <strong className="text-foreground/90">
              {" "}
              runner context
            </strong>{" "}
            — a structured record of who you are as a runner right now. Past
            races. Current mileage. Recent workouts. Injuries. What
            you&apos;re training for. How you&apos;re feeling. Where you
            broke last time.
          </p>
          <p>
            The AI companion reads this context on every message and writes
            back to it after every conversation. Every plan generation, every
            adjustment, every readiness score derives from the same context.
            It&apos;s the single source of truth for the runner-app
            relationship.
          </p>
          <p>
            Two properties of the context matter most:
          </p>
          <ul className="list-none pl-0 space-y-3 my-4">
            <Bullet>
              <strong className="text-foreground/90">
                Editable by both sides.
              </strong>{" "}
              The AI updates it as it learns about you. You can also edit it
              directly in the dashboard — the plan reflows the moment you do.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Structured but forgiving.
              </strong>{" "}
              It has a schema, so tools can act on it deterministically. But
              it accepts partial and messy input, so onboarding doesn&apos;t
              feel like filling out a tax form.
            </Bullet>
          </ul>
        </Section>

        <Section title="AI decides, tools execute">
          <p>
            The first prototype had the AI do everything — hold the
            conversation, update the context, generate a 56-week training
            plan, all in one streaming response. It worked for a two-week
            starter plan. It fell apart at scale.
          </p>
          <p>
            A full training plan is mostly deterministic: phases follow a
            structure, mileage progresses according to rules, workouts slot
            into days based on constraints. Asking a language model to
            regenerate that as JSON is like asking someone to recite a phone
            book while having a conversation. Slow, error-prone, and the
            wrong use of intelligence.
          </p>
          <p>
            The current architecture splits the work:
          </p>
          <ul className="list-none pl-0 space-y-3 my-4">
            <Bullet>
              <strong className="text-foreground/90">The AI</strong> handles
              conversation, context-building, coaching decisions,
              communication. This is where intelligence matters.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">A plan engine</strong> —
              a plain TypeScript function — handles plan generation.
              Fourteen phases, workout constraints, mileage progression, all
              encoded as data. Milliseconds to run.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">Claude&apos;s tool use</strong>{" "}
              is the bridge. Mid-conversation, the AI can call{" "}
              <code className="text-[13px] font-mono text-accent">
                generate_training_plan
              </code>{" "}
              with its coaching decisions, get a full plan back
              instantly, and continue the conversation knowing what was
              built.
            </Bullet>
          </ul>
          <p>
            That separation is what makes the living plan possible.
            Change one thing — a moved long run, a missed week — and the
            engine rebuilds the whole 56-week map with the ripple effect
            visible everywhere: sub-three probability updates, injury risk
            adjusts, phase transitions shift. If the AI had to regenerate the
            plan from scratch every time, the experience would be unusable.
          </p>
        </Section>

        <Section title="What this pattern unlocks next">
          <p>
            The context-plus-tools shape is deliberately extensible. Every
            new capability becomes another tool the AI can call without
            complicating the core conversation:
          </p>
          <ul className="list-none pl-0 space-y-3 my-4">
            <Bullet>
              <strong className="text-foreground/90">Data ingestion.</strong>{" "}
              Sync with Strava, Garmin, Apple Health so the context updates
              from actual miles run rather than self-report.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Multi-model orchestration.
              </strong>{" "}
              Different tasks call for different models. A cheap fast model
              handles casual chat and status updates. A larger model handles
              plan reasoning and race-day analysis. The router lives above
              the tools — the conversation doesn&apos;t change.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Specialist skills.
              </strong>{" "}
              A nutrition tool. A shoe-rotation tool. A race-day pacing
              strategy tool. Each is its own scoped intelligence with the
              context to be useful.
            </Bullet>
          </ul>
        </Section>

        <Section title="The stack">
          <p>
            Next.js 16 app deployed on Vercel. React 19 on the front end,
            server routes for the API layer. Claude Sonnet 4.6 handles the
            reasoning and tool orchestration. Supabase for auth and
            persistence — the runner context and training plans live in
            Postgres with per-user row-level security. All in one codebase,
            one deploy, no separate backend service.
          </p>
        </Section>

        <Section title="The architecture">
          <p>
            Zoom out and this is what we&apos;re building toward: an
            architecture that uses the right AI model for the right moment,
            the right skill for each action, and keeps one source of truth
            about the runner underneath it all. Today, one general-purpose
            model handles every job. Tomorrow, specialists — because the
            fastest, sharpest experience comes from picking the right brain
            for the task, not asking one brain to do everything.
          </p>
        </Section>

        {/* Diagram — full-width, breaks out of the article column for legibility */}
        <div className="not-prose -mx-2 md:-mx-8 mb-12 rounded-xl border border-border/40 bg-surface/30 p-4 md:p-6 overflow-x-auto">
          <ArchitectureDiagram />
          <p className="text-[11px] text-muted/70 mt-3 text-center italic">
            Aspirational architecture — how the pieces are meant to fit as
            the companion matures.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/method"
            className="text-[13px] text-muted hover:text-foreground transition"
          >
            ← Read the coaching methodology
          </Link>
          <Link
            href="/companion"
            className="inline-flex items-center bg-foreground text-background px-5 py-3 rounded text-[13px] font-semibold tracking-[0.12em] uppercase hover:opacity-85 active:scale-[0.98] transition"
          >
            Try the companion →
          </Link>
        </div>
      </article>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-accent/90 mb-4">
        {title}
      </h2>
      <div className="text-base font-light leading-[1.75] text-foreground/85 space-y-4">
        {children}
      </div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="text-accent/70 flex-shrink-0 mt-2">•</span>
      <span>{children}</span>
    </li>
  );
}
