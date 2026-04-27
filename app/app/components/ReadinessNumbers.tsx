"use client";

import { useState } from "react";
import type { ReadinessFactor } from "../lib/runner-context";

interface ReadinessData {
  subThreeProbability: number | null;
  injuryRisk: "low" | "moderate" | "elevated" | "high" | null;
  weeksTo95: number | null;
}

// Score bar for individual factors
function FactorBar({
  factor,
}: {
  factor: ReadinessFactor;
}) {
  const pct = (factor.score / 10) * 100;
  const color =
    factor.score >= 7
      ? "bg-accent"
      : factor.score >= 4
        ? "bg-warning"
        : "bg-danger";

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
}: {
  data: ReadinessData;
  factors?: ReadinessFactor[];
}) {
  const [expanded, setExpanded] = useState(false);
  const hasData = data.subThreeProbability !== null;

  const riskColors: Record<string, string> = {
    low: "text-accent",
    moderate: "text-warning",
    elevated: "text-warning",
    high: "text-danger",
  };

  const riskLabel: Record<string, string> = {
    low: "Low",
    moderate: "Med",
    elevated: "Elev",
    high: "High",
  };

  return (
    <div>
      {/* Summary row — tappable */}
      <div
        className={`grid grid-cols-3 gap-3 ${hasData ? "cursor-pointer" : ""}`}
        onClick={() => hasData && setExpanded(!expanded)}
      >
        {/* Sub-3 Probability */}
        <div className="bg-surface rounded-lg p-3 border border-accent/20 relative overflow-hidden">
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
        <div className="bg-surface rounded-lg p-3 border border-border relative overflow-hidden">
          {data.injuryRisk && (
            <div
              className={`absolute inset-0 ${data.injuryRisk === "low" ? "bg-accent/5" : data.injuryRisk === "high" ? "bg-danger/10" : "bg-warning/5"}`}
            />
          )}
          <div className="relative">
            <div className="text-muted text-[9px] uppercase tracking-widest font-medium mb-1">
              Injury Risk
            </div>
            <div
              className={`text-2xl font-mono font-bold tracking-tight ${data.injuryRisk ? riskColors[data.injuryRisk] : "text-muted-light"}`}
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
          <span className="text-[9px] text-muted">
            tap for details
          </span>
        </div>
      )}

      {/* Expanded detail panel */}
      {expanded && factors && factors.length > 0 && (
        <div className="mt-3 bg-surface rounded-lg border border-border p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[10px] text-accent uppercase tracking-widest font-semibold">
              Readiness Factors
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(false);
              }}
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
              These scores reflect where you are today — not where you&apos;ll be.
              Every factor improves with consistent training. The goal is to get
              the overall probability to 95%+ before race day.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
