"use client";

import { useState } from "react";
import type { ReadinessFactor } from "../lib/runner-context";

interface ReadinessData {
  subThreeProbability: number | null;
  injuryRisk: "low" | "moderate" | "elevated" | "high" | null;
  weeksTo95: number | null;
}

type ExpandedPanel = "probability" | "injury" | "weeks" | null;

// Shared probability model: p(w) = 1 - (1 - p0) * e^(-kw),
// with k chosen so p(weeksTo95) = 0.95.
function probAt(p0: number, weeksTo95: number, w: number): number {
  const safeP0 = Math.min(Math.max(p0, 0), 0.9);
  const k = Math.log((1 - safeP0) / 0.05) / weeksTo95;
  return 1 - (1 - safeP0) * Math.exp(-k * w);
}

// Parametric probability-over-weeks curve for the timeline panel.
function TimelineCurve({
  p0,
  weeksTo95,
  planWeeks,
}: {
  p0: number; // current probability, 0..1
  weeksTo95: number;
  planWeeks: number | null;
}) {
  const hasBuffer = planWeeks !== null && planWeeks > weeksTo95;
  const endWeek = hasBuffer ? planWeeks : Math.ceil(weeksTo95 * 1.15);

  const X0 = 30;
  const X1 = 480;
  const Y_AXIS = 120;
  const Y_TOP = 18;

  const p = (w: number) => probAt(p0, weeksTo95, w);
  const x = (w: number) => X0 + (w / endWeek) * (X1 - X0);
  const y = (prob: number) => Y_AXIS - prob * (Y_AXIS - Y_TOP);

  const samples = 60;
  const path = Array.from({ length: samples + 1 }, (_, i) => {
    const w = (i / samples) * endWeek;
    return `${i === 0 ? "M" : "L"} ${x(w).toFixed(1)} ${y(p(w)).toFixed(1)}`;
  }).join(" ");

  const x95 = x(weeksTo95);
  const pEnd = Math.min(99, Math.round(p(endWeek) * 100));

  return (
    <svg
      viewBox="0 0 500 150"
      className="w-full block"
      role="img"
      aria-label={`Probability curve reaching 95% at week ${weeksTo95}${hasBuffer ? `, flattening toward ${pEnd}% at week ${endWeek} when the plan ends` : ""}`}
    >
      <line
        x1={X0}
        y1={Y_AXIS}
        x2={X1}
        y2={Y_AXIS}
        style={{ stroke: "var(--border)" }}
        strokeWidth="1"
      />
      {hasBuffer && (
        <rect
          x={x95}
          y={Y_TOP + 2}
          width={X1 - x95}
          height={Y_AXIS - Y_TOP - 2}
          style={{ fill: "var(--accent)" }}
          opacity="0.06"
        />
      )}
      <path
        d={path}
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2"
      />
      <line
        x1={x95}
        y1={y(0.95)}
        x2={x95}
        y2={Y_AXIS}
        style={{ stroke: "var(--accent)" }}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.4"
      />
      <circle cx={x95} cy={y(0.95)} r="4" style={{ fill: "var(--accent)" }} />
      {hasBuffer && (
        <circle
          cx={X1}
          cy={y(p(endWeek))}
          r="4"
          style={{ fill: "var(--surface)", stroke: "var(--accent)" }}
          strokeWidth="2"
        />
      )}
      <text
        x={Math.min(x95, X1 - 45)}
        y={y(0.95) - 12}
        textAnchor="middle"
        style={{ fill: "var(--accent)" }}
        fontSize="12"
        fontFamily="var(--font-mono, monospace)"
        fontWeight="500"
      >
        95% · wk {weeksTo95}
      </text>
      {hasBuffer && (
        <text
          x={X1}
          y={y(p(endWeek)) + 22}
          textAnchor="middle"
          style={{ fill: "var(--muted)" }}
          fontSize="11"
          fontFamily="var(--font-mono, monospace)"
        >
          ~{pEnd}%
        </text>
      )}
      {hasBuffer && (
        <text
          x={(x95 + X1) / 2}
          y={Y_AXIS + 15}
          textAnchor="middle"
          style={{ fill: "var(--muted)" }}
          fontSize="10"
        >
          buffer
        </text>
      )}
      <text
        x={X0}
        y={Y_AXIS + 15}
        style={{ fill: "var(--muted)" }}
        fontSize="10"
      >
        wk 0
      </text>
      <text
        x={X1}
        y={Y_AXIS + 15}
        textAnchor="end"
        style={{ fill: "var(--muted)" }}
        fontSize="10"
      >
        wk {endWeek}
        {hasBuffer ? " · plan ends" : ""}
      </text>
    </svg>
  );
}

// Stat row for the timeline panel — mono number left, title + note right.
function TimelineRow({
  stat,
  title,
  note,
}: {
  stat: string;
  title: string;
  note: string;
}) {
  return (
    <div className="border-t border-border py-2.5 flex gap-3 items-baseline">
      <span className="font-mono text-[13px] text-foreground font-medium min-w-[64px] flex-shrink-0">
        {stat}
      </span>
      <div>
        <div className="text-xs text-foreground font-medium">{title}</div>
        <div className="text-[10px] text-muted leading-relaxed">{note}</div>
      </div>
    </div>
  );
}

// Score bar for individual factors
function FactorBar({
  factor,
  invertColor,
}: {
  factor: ReadinessFactor;
  invertColor?: boolean; // For injury factors where high = bad
}) {
  const pct = (factor.score / 10) * 100;

  let color: string;
  if (invertColor) {
    // For risk factors: low score = green (good), high = red (bad)
    color =
      factor.score <= 3
        ? "bg-accent"
        : factor.score <= 6
          ? "bg-warning"
          : "bg-danger";
  } else {
    // For readiness factors: high score = green (good)
    color =
      factor.score >= 7
        ? "bg-accent"
        : factor.score >= 4
          ? "bg-warning"
          : "bg-danger";
  }

  return (
    <div className="py-1.5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-foreground font-medium">
          {factor.name}
        </span>
        <span className="text-[10px] font-mono text-muted">
          {factor.score}/10
        </span>
      </div>
      <div className="h-1.5 bg-background rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] text-muted mt-0.5 leading-snug">
        {factor.note}
      </p>
    </div>
  );
}

export default function ReadinessNumbers({
  data,
  factors,
  injuryFactors,
  concerns,
  onUpdateConcerns,
  planWeeks,
}: {
  data: ReadinessData;
  factors?: ReadinessFactor[];
  injuryFactors?: ReadinessFactor[];
  concerns?: string | null;
  onUpdateConcerns?: (val: string | null) => void;
  planWeeks?: number | null;
}) {
  const [expanded, setExpanded] = useState<ExpandedPanel>(null);
  const [editingConcerns, setEditingConcerns] = useState(false);
  const [concernsDraft, setConcernsDraft] = useState("");
  const hasData = data.subThreeProbability !== null;

  const riskColors: Record<string, string> = {
    low: "text-accent",
    moderate: "text-warning",
    elevated: "text-warning",
    high: "text-danger",
  };

  const riskBorderColors: Record<string, string> = {
    low: "border-accent/20",
    moderate: "border-warning/20",
    elevated: "border-warning/20",
    high: "border-danger/20",
  };

  const riskLabel: Record<string, string> = {
    low: "Low",
    moderate: "Med",
    elevated: "Elev",
    high: "High",
  };

  const toggle = (panel: ExpandedPanel) => {
    setExpanded(expanded === panel ? null : panel);
  };

  // Timeline panel math — buffer between the physiological floor and the plan
  const bufferWeeks =
    data.weeksTo95 !== null && planWeeks != null && planWeeks > data.weeksTo95
      ? planWeeks - data.weeksTo95
      : null;
  const pEndPct =
    data.weeksTo95 !== null && data.weeksTo95 > 0 && planWeeks != null
      ? Math.min(
          99,
          Math.round(
            probAt(
              (data.subThreeProbability ?? 0) / 100,
              data.weeksTo95,
              planWeeks,
            ) * 100,
          ),
        )
      : null;

  return (
    <div>
      {/* Summary row — each card tappable independently */}
      <div className="grid grid-cols-3 gap-3">
        {/* Sub-3 Probability */}
        <div
          className={`bg-surface rounded-lg p-3 border relative overflow-hidden ${
            expanded === "probability" ? "border-accent/40" : "border-accent/20"
          } ${hasData ? "cursor-pointer" : ""}`}
          onClick={() => hasData && toggle("probability")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
          <div className="relative">
            <div className="text-muted text-[9px] uppercase tracking-widest font-medium mb-1">
              Sub-3 Probability
            </div>
            <div className="text-2xl font-mono font-bold text-accent tracking-tight">
              {data.subThreeProbability !== null ? (
                <>
                  {data.subThreeProbability}
                  <span className="text-base">%</span>
                </>
              ) : (
                <span className="text-muted-light">TBD</span>
              )}
            </div>
          </div>
        </div>

        {/* Injury Risk */}
        <div
          className={`bg-surface rounded-lg p-3 border relative overflow-hidden ${
            expanded === "injury"
              ? data.injuryRisk
                ? riskBorderColors[data.injuryRisk].replace("/20", "/40")
                : "border-border"
              : data.injuryRisk
                ? riskBorderColors[data.injuryRisk]
                : "border-border"
          } ${hasData ? "cursor-pointer" : ""}`}
          onClick={() => hasData && toggle("injury")}
        >
          {data.injuryRisk && (
            <div
              className={`absolute inset-0 ${
                data.injuryRisk === "low"
                  ? "bg-accent/5"
                  : data.injuryRisk === "high"
                    ? "bg-danger/10"
                    : "bg-warning/5"
              }`}
            />
          )}
          <div className="relative">
            <div className="text-muted text-[9px] uppercase tracking-widest font-medium mb-1">
              Injury Risk
            </div>
            <div
              className={`text-2xl font-mono font-bold tracking-tight ${
                data.injuryRisk ? riskColors[data.injuryRisk] : "text-muted-light"
              }`}
            >
              {data.injuryRisk ? riskLabel[data.injuryRisk] : "TBD"}
            </div>
          </div>
        </div>

        {/* Weeks to 95% */}
        <div
          className={`bg-surface rounded-lg p-3 border ${
            expanded === "weeks" ? "border-accent/40" : "border-border"
          } ${data.weeksTo95 !== null ? "cursor-pointer" : ""}`}
          onClick={() => data.weeksTo95 !== null && toggle("weeks")}
        >
          <div className="text-muted text-[9px] uppercase tracking-widest font-medium mb-1">
            Weeks to 95%
          </div>
          <div className="text-2xl font-mono font-bold text-foreground tracking-tight">
            {data.weeksTo95 !== null ? (
              <>
                {data.weeksTo95}
                <span className="text-sm text-muted ml-0.5">wk</span>
              </>
            ) : (
              <span className="text-muted-light">TBD</span>
            )}
          </div>
        </div>
      </div>

      {/* Expand hint */}
      {hasData && !expanded && (
        <div className="text-center mt-1.5">
          <span className="text-[9px] text-muted">tap for details</span>
        </div>
      )}

      {/* Probability detail panel */}
      {expanded === "probability" && factors && factors.length > 0 && (
        <div className="mt-3 bg-surface rounded-lg border border-accent/20 p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] text-accent uppercase tracking-widest font-semibold">
              Readiness Factors
            </h4>
            <button
              onClick={() => setExpanded(null)}
              className="text-[10px] text-muted hover:text-foreground transition-colors"
            >
              collapse
            </button>
          </div>
          {factors.map((factor, i) => (
            <FactorBar key={i} factor={factor} />
          ))}
          <div className="pt-2 border-t border-border mt-3">
            <p className="text-[10px] text-muted leading-relaxed">
              These scores reflect where you are today — not where you&apos;ll
              be. Every factor improves with consistent training. The goal is
              95%+ before race day.
            </p>
          </div>
        </div>
      )}

      {/* Injury risk detail panel */}
      {expanded === "injury" && (
        <div className="mt-3 bg-surface rounded-lg border border-warning/20 p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] text-warning uppercase tracking-widest font-semibold">
              Injury Risk Factors
            </h4>
            <button
              onClick={() => setExpanded(null)}
              className="text-[10px] text-muted hover:text-foreground transition-colors"
            >
              collapse
            </button>
          </div>

          {injuryFactors && injuryFactors.length > 0 ? (
            <>
              {injuryFactors.map((factor, i) => (
                <FactorBar key={i} factor={factor} invertColor />
              ))}
            </>
          ) : (
            <p className="text-[10px] text-muted py-2">
              Injury risk factors will appear as your coach learns more about
              you.
            </p>
          )}

          {/* Editable concerns / injury history */}
          <div className="pt-3 border-t border-border mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-warning uppercase tracking-widest font-semibold">
                Injury History & Concerns
              </span>
              {!editingConcerns && (
                <button
                  onClick={() => {
                    setConcernsDraft(concerns || "");
                    setEditingConcerns(true);
                  }}
                  className="text-[10px] text-muted hover:text-foreground transition-colors"
                >
                  edit
                </button>
              )}
            </div>
            {editingConcerns ? (
              <div>
                <textarea
                  autoFocus
                  value={concernsDraft}
                  onChange={(e) => setConcernsDraft(e.target.value)}
                  placeholder="Describe any past injuries, current concerns, chronic issues..."
                  className="w-full bg-background text-xs text-foreground leading-relaxed rounded-lg p-2 border border-border outline-none resize-none focus:border-warning/40"
                  rows={3}
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    onClick={() => {
                      const trimmed = concernsDraft.trim();
                      onUpdateConcerns?.(trimmed || null);
                      setEditingConcerns(false);
                    }}
                    className="text-[10px] text-accent hover:text-foreground transition-colors"
                  >
                    save
                  </button>
                  <button
                    onClick={() => setEditingConcerns(false)}
                    className="text-[10px] text-muted hover:text-foreground transition-colors"
                  >
                    cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-muted-light leading-relaxed">
                {concerns || "No concerns noted — tap edit to add any injury history or current issues."}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-border mt-2">
            <p className="text-[10px] text-muted leading-relaxed">
              Lower scores = lower risk. Recovery practices, nutrition, and
              strength work can bring your risk down even at high mileage.
            </p>
          </div>
        </div>
      )}

      {/* Weeks-to-95% detail panel — the timeline */}
      {expanded === "weeks" &&
        data.weeksTo95 !== null &&
        data.weeksTo95 > 0 && (
          <div className="mt-3 bg-surface rounded-lg border border-accent/20 p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[10px] text-accent uppercase tracking-widest font-semibold">
                The Timeline
              </h4>
              <button
                onClick={() => setExpanded(null)}
                className="text-[10px] text-muted hover:text-foreground transition-colors"
              >
                collapse
              </button>
            </div>

            <TimelineCurve
              p0={(data.subThreeProbability ?? 0) / 100}
              weeksTo95={data.weeksTo95}
              planWeeks={planWeeks ?? null}
            />

            <div className="mt-2">
              <TimelineRow
                stat={`${data.weeksTo95} wk`}
                title="The physiological floor"
                note="Aerobic base rebuilt, long runs banked, fitness peaked. What your body needs — assuming nothing goes wrong."
              />
              {bufferWeeks !== null && pEndPct !== null && (
                <>
                  <TimelineRow
                    stat={`+${bufferWeeks} wk`}
                    title="The real-life buffer"
                    note="Recovery cycles, an illness week, travel. The extra weeks are structure, not padding."
                  />
                  <TimelineRow
                    stat={`95→${pEndPct}%`}
                    title="What the buffer buys"
                    note={`Every week past ${data.weeksTo95} nudges the odds up — but the curve flattens. Race day is never 100%.`}
                  />
                </>
              )}
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-[10px] text-muted leading-relaxed">
                {bufferWeeks !== null
                  ? `You could be ready in ${data.weeksTo95} perfect weeks. The plan doesn't assume perfect.`
                  : "Build your plan to see the full timeline — buffer included."}
              </p>
            </div>
          </div>
        )}
    </div>
  );
}
