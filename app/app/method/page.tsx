import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "../components/MarketingNav";

export const metadata: Metadata = {
  title: "The Method — Project Sub Three",
  description:
    "The coaching philosophy behind Project Sub Three: what 12 attempts at a sub-three marathon taught me, and what actually gets a runner to 2:59:59.",
};

export default function Method() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-4">
          The Method
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
          What twelve attempts at sub-three taught me — and what actually gets
          a runner there.
        </h1>
        <p className="text-base md:text-lg font-light text-muted-light leading-[1.7] mb-14">
          Project Sub Three isn&apos;t a generic training-plan generator. It&apos;s
          the coaching conversation I wish I&apos;d had during attempts 1
          through 11. This is the philosophy underneath it.
        </p>

        <Section title="The story">
          <p>
            My first marathon started at a blazing sub-three pace. Until mile
            18. The wall. I finished in 4 hours, the hardest way possible.
          </p>
          <p>
            I tried eleven more times. All failures. During those years I was
            at Adidas building miCoach, working alongside some of the top
            running coaches in the world. I was literally helping build the
            coaching tools while trying (and failing) to coach myself to a
            sub-three marathon.
          </p>
          <p>
            On attempt #12, after a year of focused, honest training, I broke
            through. 2 hours, 58 minutes. What I learned across those attempts
            is what this app is built on.
          </p>
        </Section>

        <Section title="The foundation: Daniels Running Formula">
          <p>
            The training structure is rooted in Jack Daniels&apos; system —
            the VDOT-based framework that pairs pace prescriptions to a
            runner&apos;s current fitness rather than to their goal. Easy pace
            is defined. Threshold pace is defined. Marathon pace is derived.
            Every workout has a purpose and a physiological target.
          </p>
          <p>
            The AI companion knows Daniels, uses Daniels, and translates
            Daniels into language a runner can actually feel. You don&apos;t
            have to read the book. You just have to have the conversation.
          </p>
        </Section>

        <Section title="Context beats plans">
          <p>
            The most important thing I learned across 12 attempts:
            <em className="not-italic text-foreground/85">
              {" "}
              a plan is only as good as the runner&apos;s ability to hold it.
            </em>{" "}
            Most training plans assume a healthy, undisturbed 16-week runway.
            Life doesn&apos;t work that way. Life gives you a lingering calf,
            a work trip, a bad week of sleep, a long tennis match Friday
            night.
          </p>
          <p>
            A good coach asks &ldquo;how are you feeling this week?&rdquo;
            before writing the workout. That&apos;s not a nicety — it&apos;s
            the entire game. Project Sub Three is built around continuously
            gathering context and letting that context drive what happens
            next. The plan bends. The goal doesn&apos;t.
          </p>
        </Section>

        <Section title="Where sub-three chasers actually break">
          <p>
            I&apos;ve been the runner who broke in each of these ways. If
            you&apos;ve tried and failed, one of these is probably yours too:
          </p>
          <ul className="list-none pl-0 space-y-3 my-4">
            <Bullet>
              <strong className="text-foreground/90">
                Going out too fast.
              </strong>{" "}
              You feel great in the corral. Your first 5K is 20 seconds
              ahead of pace. You don&apos;t notice. By mile 18, your legs
              do.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Not enough long-run volume.
              </strong>{" "}
              20 miles once, three weeks out, isn&apos;t enough. You need
              repeated exposure to the fatigue of hours on your feet.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Skipping the marathon-pace work.
              </strong>{" "}
              Tempo and threshold matter — but marathon-pace long runs
              teach your body what 6:52/mile feels like for a very long
              time.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Under-fueling.
              </strong>{" "}
              A sub-three marathoner burns roughly 3,000 calories in the
              race. If you take in fewer than 60g of carbs an hour, the
              wall is a math problem, not a mental one.
            </Bullet>
            <Bullet>
              <strong className="text-foreground/90">
                Ignoring taper.
              </strong>{" "}
              The two hardest weeks of the plan are the two weeks before
              the race, when you have to do less than your training brain
              wants.
            </Bullet>
          </ul>
        </Section>

        <Section title="What we&apos;re really building">
          <p>
            The magic of a coach isn&apos;t the workouts they give you.
            It&apos;s the ongoing relationship: someone who remembers what
            you did last week, notices the pattern, calls out the excuses,
            and adjusts on the fly. That&apos;s what I&apos;m trying to build
            here — not with rules, but with a conversation that has memory
            and a plan that can move.
          </p>
          <p>
            If it helps even one runner get to 2:59:59 in fewer than twelve
            attempts, it&apos;s worth every hour spent building it.
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/tech"
            className="text-[13px] text-muted hover:text-foreground transition"
          >
            ← Read the technical methodology
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
