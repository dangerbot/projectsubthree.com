"use client";

import { useState } from "react";
import type { ReadinessFactor, RunnerContext } from "../lib/runner-context";

interface ReadinessData {
  subThreeProbability: number | null;
  injuryRisk: "low" | "moderate" | "elevated" | "high" | null;
  weeksTo95: number | null;
}

type ExpandedPanel = "probability" | "injury" | null;

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
}: {
  data: ReadinessData;
  factors?: ReadinessFactor[];
  injuryFactors?: ReadinessFactor[];
  concerns?: string | null;
  onUpdateConcerns?: (val: string | null) => void;
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
        <div className="bg-surface rounded-lg p-3 border border-border">
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
    </div>
  );
}
