import type { Metadata } from "next";
import Link from "next/link";
import MarketingNav from "../components/MarketingNav";

export const metadata: Metadata = {
  title: "The Training — Project Sub Three",
  description:
    "What each run in a sub-three marathon plan actually does: easy runs, long runs, marathon pace, threshold, and intervals — the physiology in plain English, and why plans stack the way they do.",
};

export default function Training() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MarketingNav />
      <article className="max-w-[680px] mx-auto px-6 pt-14 pb-20">
        <p className="text-[11px] font-medium tracking-[0.4em] text-muted/60 uppercase mb-4">
          The Training
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-6">
          Five kinds of running. One job for each.
        </h1>
        <p className="text-base md:text-lg font-light text-muted-light leading-[1.7] mb-14">
          Every run in the plan exists for a physiological reason. None of it
          is filler. The structure is rooted in Jack Daniels&apos; Running
          Formula — translated here into plain English. If you understand
          these five runs, you understand the whole plan.
        </p>

        <RunSection
          index="01"
          title="Easy runs — the engine"
          chart={<EasyWave />}
        >
          <p>
            Most of the plan is easy running. That surprises people chasing a
            2:59:59 — it shouldn&apos;t. Easy miles are where the aerobic
            engine gets built: more capillaries around each muscle fiber,
            more mitochondria inside them, a heart that pushes more blood
            per beat, and a body that gets better at burning fat instead of
            burning through its limited carbohydrate stores. Bones and
            tendons adapt on this schedule too — slower than your
            cardiovascular system, which is exactly why the miles that build
            them must be gentle.
          </p>
          <p>
            Easy means conversational — roughly 60 to 90 seconds per mile
            slower than marathon pace. The discipline isn&apos;t running
            these at all. It&apos;s running them slow enough that
            tomorrow&apos;s work doesn&apos;t suffer.
          </p>
          <WeekMixBar />
        </RunSection>

        <RunSection
          index="02"
          title="The long run — endurance"
          chart={<LongWave />}
        >
          <p>
            The long run is the same low intensity held for hours, and the
            hours are the point. Time on feet teaches the body to store more
            glycogen, spare it by burning fat, and hold running form when
            fatigue sets in. The wall you hit at mile 18 of a marathon is a
            fuel and durability problem. The long run is where that problem
            gets solved — weeks before race day, a little at a time.
          </p>
          <p>
            In this plan the long run grows a mile at a time, tops out
            around 20 to 24 miles, and never turns into a race. Effort stays
            easy. The distance is the workout.
          </p>
        </RunSection>

        <RunSection
          index="03"
          title="Marathon-pace runs — the rehearsal"
          chart={<MarathonWave />}
        >
          <p>
            Sub-three means 6:52 per mile for 26.2 miles. Marathon-pace
            segments — often planted inside a long run — teach your body to
            be efficient at exactly that effort: the precise muscle-fiber
            recruitment, the fuel burn rate, the rhythm. They&apos;re also
            the dress rehearsal for everything else: practicing gels at race
            effort, learning what 6:52 feels like on tired legs so you
            don&apos;t need your watch to tell you you&apos;re drifting.
          </p>
          <p>
            The pace itself is deliberately unheroic. It should feel almost
            easy for the first hour. That&apos;s what makes it holdable for
            three.
          </p>
        </RunSection>

        <RunSection
          index="04"
          title="Threshold runs — raising the redline"
          chart={<ThresholdWave />}
        >
          <p>
            There&apos;s an effort level — the redline — above which fatigue
            compounds fast. Below it, you can cruise; above it, the clock is
            ticking. Threshold runs sit right at that line: comfortably
            hard, about the pace you could race for an hour. Training there
            teaches your body to clear and reuse lactate faster, which moves
            the redline itself.
          </p>
          <p>
            This matters because marathon pace lives just below your
            redline. Every notch the redline moves up, 6:52 gets cheaper.
            The dose is modest: 20 to 40 minutes of work, continuous or in
            cruise intervals, once a week at most.
          </p>
        </RunSection>

        <RunSection
          index="05"
          title="Intervals — raising the ceiling"
          chart={<IntervalWave />}
        >
          <p>
            Intervals are the only runs that go over the redline: repeats of
            three to five minutes at a hard effort, with jog recoveries in
            between. They push your aerobic ceiling — the maximum rate at
            which your body can take in and use oxygen. A higher ceiling
            makes every pace below it a smaller fraction of max, including
            the one that matters.
          </p>
          <p>
            They&apos;re the hardest sessions in the plan and the smallest
            share of it. They show up in specific phases, sparingly, because
            the returns are real but the injury cost of overdoing them is
            too.
          </p>
        </RunSection>

        <Section title="Why the plan stacks the way it does">
          <p>
            The sequence isn&apos;t arbitrary. Base miles come first because
            everything else is built on top of the aerobic engine — and
            because tendons and bones need the longest runway. Quality work
            layers in only after the body can absorb it. As race day
            approaches, training gets more specific: more marathon pace,
            less of everything unrelated to 6:52.
          </p>
          <p>
            Adaptation happens during recovery, not during the workout.
            Stress plus rest equals progress; stress without rest equals
            injury. That&apos;s why every fourth week backs off, and why the
            final weeks — the taper — do less than your training brain
            wants. You don&apos;t gain fitness in the last two weeks. You
            can only lose the race there.
          </p>
          <PeriodizationChart />
          <p>
            One more honest curve: the returns diminish. The jump from 30 to
            50 miles a week buys a lot. The jump from 70 to 80 buys a
            little, and costs more sleep, more food, more injury risk. A
            good plan — and a good coach — spends your budget where the
            buying is good, and tells you when it isn&apos;t anymore.
          </p>
          <p>
            That&apos;s the philosophy. The companion&apos;s job is applying
            it to your actual week — the missed run, the tired legs, the
            tennis match you played anyway — and bending the plan without
            breaking the sequence.
          </p>
        </Section>

        <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/method"
            className="text-[13px] text-muted hover:text-foreground transition"
          >
            ← Read the method
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

/* ── Layout building blocks ─────────────────────────────────────────── */

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

function RunSection({
  index,
  title,
  chart,
  children,
}: {
  index: string;
  title: string;
  chart: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-14">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-[11px] font-mono text-accent/60">{index}</span>
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-accent/90">
          {title}
        </h2>
      </div>
      <div className="rounded-lg border border-border bg-surface/60 px-4 py-3 mb-5">
        {chart}
      </div>
      <div className="text-base font-light leading-[1.75] text-foreground/85 space-y-4">
        {children}
      </div>
    </section>
  );
}

/* ── Signature waveforms ────────────────────────────────────────────────
   Every chart shares the same frame: effort (y) over the run (x), with a
   dashed line marking the redline (threshold). The shape of each run type
   against that line is the entire story. */

const REDLINE_Y = 26;

function WaveFrame({
  d,
  caption,
  aboveRedline,
}: {
  d: string;
  caption: string;
  aboveRedline?: boolean;
}) {
  return (
    <figure className="m-0">
      <svg
        viewBox="0 0 280 92"
        className="w-full block"
        role="img"
        aria-label={caption}
      >
        <line
          x1="8"
          y1="82"
          x2="272"
          y2="82"
          style={{ stroke: "var(--border)" }}
          strokeWidth="1"
        />
        <line
          x1="8"
          y1={REDLINE_Y}
          x2="272"
          y2={REDLINE_Y}
          style={{ stroke: aboveRedline ? "var(--danger)" : "var(--muted)" }}
          strokeWidth="1"
          strokeDasharray="4 4"
          opacity="0.45"
        />
        <text
          x="272"
          y={REDLINE_Y - 5}
          textAnchor="end"
          style={{ fill: "var(--muted)" }}
          fontSize="9"
        >
          redline
        </text>
        <path
          d={d}
          fill="none"
          style={{ stroke: "var(--accent)" }}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <figcaption className="text-[10px] text-muted mt-1.5 font-mono">
        {caption}
      </figcaption>
    </figure>
  );
}

function EasyWave() {
  return (
    <WaveFrame
      d="M 8 72 C 40 70, 60 74, 92 71 C 124 68, 150 73, 184 70 C 214 68, 244 72, 272 70"
      caption="low effort, most days — the engine gets built here"
    />
  );
}

function LongWave() {
  return (
    <WaveFrame
      d="M 8 72 C 50 71, 90 72, 130 70 C 170 68, 200 68, 230 65 C 248 63, 262 62, 272 61"
      caption="same easy effort, held for hours — fatigue drifts in late"
    />
  );
}

function MarathonWave() {
  return (
    <WaveFrame
      d="M 8 74 C 20 70, 30 52, 44 48 L 236 47 C 250 49, 262 66, 272 72"
      caption="steady at 6:52/mi — below the redline, above easy"
    />
  );
}

function ThresholdWave() {
  return (
    <WaveFrame
      d="M 8 76 C 22 72, 34 48, 50 36 C 58 31, 66 30, 80 30 L 208 30 C 224 31, 240 52, 254 64 C 262 70, 268 74, 272 75"
      caption="comfortably hard, held just under the line — 20–40 min"
    />
  );
}

function IntervalWave() {
  return (
    <WaveFrame
      aboveRedline
      d="M 8 76 L 34 76 C 42 76, 42 14, 50 14 L 64 14 C 72 14, 72 70, 80 70 L 94 70 C 102 70, 102 14, 110 14 L 124 14 C 132 14, 132 70, 140 70 L 154 70 C 162 70, 162 14, 170 14 L 184 14 C 192 14, 192 70, 200 70 L 214 70 C 222 70, 222 14, 230 14 L 244 14 C 252 14, 252 76, 260 76 L 272 76"
      caption="3–5 min over the line, jog it back down — sparingly"
    />
  );
}

/* ── Weekly mix bar — easy vs quality ───────────────────────────────── */

function WeekMixBar() {
  return (
    <figure className="m-0 mt-5">
      <div
        className="flex h-3 rounded-full overflow-hidden"
        role="img"
        aria-label="About 80 percent of weekly miles are easy, 20 percent are quality"
      >
        <div className="w-[80%]" style={{ background: "var(--accent-dim)" }} />
        <div className="w-[20%]" style={{ background: "var(--accent)" }} />
      </div>
      <figcaption className="flex justify-between text-[10px] text-muted mt-1.5 font-mono">
        <span>~80% easy miles</span>
        <span>~20% quality</span>
      </figcaption>
    </figure>
  );
}

/* ── Periodization — how weeks stack into a season ──────────────────── */

function PeriodizationChart() {
  // Weekly volume bars: rising blocks with a cutback every 4th week,
  // a peak, then the taper into race day.
  const bars = [
    30, 34, 38, 26, 44, 50, 56, 38, 62, 70, 78, 52, 88, 96, 58, 34,
  ];
  const labels: { at: number; text: string }[] = [
    { at: 1.5, text: "base" },
    { at: 5.5, text: "build" },
    { at: 12.5, text: "peak" },
    { at: 14.5, text: "taper" },
  ];
  const W = 340;
  const H = 110;
  const barW = 15;
  const gap = 4.5;
  const x0 = 8;
  const chartH = 84;

  return (
    <figure className="m-0 my-6 rounded-lg border border-border bg-surface/60 px-4 py-3">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        role="img"
        aria-label="Weekly mileage rises in blocks with a cutback every fourth week, peaks, then tapers into race day"
      >
        <line
          x1={x0}
          y1={chartH}
          x2={W - 8}
          y2={chartH}
          style={{ stroke: "var(--border)" }}
          strokeWidth="1"
        />
        {bars.map((v, i) => {
          const h = (v / 100) * (chartH - 8);
          const isCutback = (i + 1) % 4 === 0 && i < 13;
          const isTaper = i >= 14;
          return (
            <rect
              key={i}
              x={x0 + i * (barW + gap)}
              y={chartH - h}
              width={barW}
              height={h}
              rx="2"
              style={{
                fill: "var(--accent)",
              }}
              opacity={isCutback ? 0.35 : isTaper ? 0.55 : 0.9}
            />
          );
        })}
        <circle
          cx={x0 + 16 * (barW + gap) + 8}
          cy={chartH - 6}
          r="3.5"
          style={{ fill: "var(--foreground)" }}
        />
        <text
          x={x0 + 16 * (barW + gap) + 8}
          y={chartH - 14}
          textAnchor="middle"
          style={{ fill: "var(--foreground)" }}
          fontSize="9"
          fontFamily="var(--font-mono, monospace)"
        >
          race
        </text>
        {labels.map((l) => (
          <text
            key={l.text}
            x={x0 + l.at * (barW + gap) + barW / 2}
            y={H - 8}
            textAnchor="middle"
            style={{ fill: "var(--muted)" }}
            fontSize="9"
          >
            {l.text}
          </text>
        ))}
      </svg>
      <figcaption className="text-[10px] text-muted mt-1.5 font-mono">
        stress, absorb, repeat — the dips are on purpose
      </figcaption>
    </figure>
  );
}
