"use client";

import { useState, useMemo } from "react";
import type { TrainingPlan, PlanPhase, PlanWeek } from "../lib/training-plan";

const typeColors: Record<string, string> = {
  easy: "text-accent",
  long: "text-blue-400",
  tempo: "text-orange-400",
  interval: "text-red-400",
  rest: "text-muted",
  cross: "text-purple-400",
  race: "text-yellow-400",
};

const typeBg: Record<string, string> = {
  easy: "bg-accent/10",
  long: "bg-blue-400/10",
  tempo: "bg-orange-400/10",
  interval: "bg-red-400/10",
  rest: "bg-background",
  cross: "bg-purple-400/10",
  race: "bg-yellow-400/10",
};

const typeLabel: Record<string, string> = {
  easy: "Easy",
  long: "Long",
  tempo: "Tempo",
  interval: "Intervals",
  rest: "Rest",
  cross: "Cross",
  race: "Race",
};

// ── Chevron icon ──────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

// ── Collapsible Week ──────────────────────────────────────────────────────────

function WeekRow({ week, isOpen, onToggle }: { week: PlanWeek; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      {/* Week header — clickable */}
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-accent/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Chevron open={isOpen} />
          <span className="text-xs font-semibold text-foreground">
            {week.label}
          </span>
        </div>
        <span className="text-[10px] text-muted font-mono">
          ~{week.totalMiles} mi
        </span>
      </button>

      {/* Daily workouts — collapsible */}
      {isOpen && (
        <div className="divide-y divide-border border-t border-border">
          {week.workouts.map((workout, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 ${workout.type === "rest" ? "opacity-50" : ""}`}
            >
              {/* Day label */}
              <span className="text-[10px] text-muted uppercase font-mono w-7 flex-shrink-0">
                {workout.day}
              </span>

              {/* Type badge */}
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${typeBg[workout.type] || "bg-background"} ${typeColors[workout.type] || "text-muted"}`}
              >
                {typeLabel[workout.type] || workout.type}
              </span>

              {/* Distance */}
              {workout.distance && (
                <span className="text-xs font-mono text-foreground flex-shrink-0">
                  {workout.distance}
                  <span className="text-[10px] text-muted ml-0.5">mi</span>
                </span>
              )}

              {/* Description */}
              <span className="text-[10px] text-muted truncate flex-1">
                {workout.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Phase Header ──────────────────────────────────────────────────────────────

function PhaseHeader({ phase }: { phase: PlanPhase }) {
  return (
    <div className="pt-5 pb-2 first:pt-0">
      <div className="flex items-baseline gap-2">
        <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
          Phase {phase.index}
        </span>
        <h4 className="text-sm font-semibold text-foreground">
          {phase.shortName}
        </h4>
      </div>
      <p className="text-[11px] text-muted leading-relaxed mt-1">
        {phase.description}
      </p>
    </div>
  );
}

// ── Empty & Building states ───────────────────────────────────────────────────

function EmptyPlan() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-3xl font-mono font-bold text-border-light mb-3">
        —
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        No plan yet
      </h3>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        Complete your onboarding conversation and your coach will build a
        personalized plan based on where you are today.
      </p>
    </div>
  );
}

export function PlanBuilding() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex gap-1.5 mb-4">
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-2">
        Building your plan
      </h3>
      <p className="text-xs text-muted max-w-xs leading-relaxed">
        Your coach is putting together a personalized plan based on your
        runner context...
      </p>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TrainingPlanView({
  plan,
}: {
  plan: TrainingPlan | null;
}) {
  if (!plan) return <EmptyPlan />;

  // Group weeks by phase
  const phaseGroups = useMemo(() => {
    const groups: Array<{ phase: PlanPhase | null; weeks: PlanWeek[] }> = [];

    if (plan.phases.length > 0) {
      // Build a map of phaseIndex → PlanPhase
      const phaseMap = new Map<number, PlanPhase>();
      for (const p of plan.phases) {
        phaseMap.set(p.index, p);
      }

      let currentPhaseIndex = -1;
      for (const week of plan.weeks) {
        if (week.phaseIndex !== currentPhaseIndex) {
          currentPhaseIndex = week.phaseIndex;
          groups.push({
            phase: phaseMap.get(currentPhaseIndex) ?? null,
            weeks: [],
          });
        }
        groups[groups.length - 1].weeks.push(week);
      }
    } else {
      // No phase data — just one flat group
      groups.push({ phase: null, weeks: plan.weeks });
    }

    return groups;
  }, [plan]);

  // Track which weeks are open — default: first week of first phase
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    if (plan.weeks.length > 0) {
      initial.add(plan.weeks[0].weekNumber);
    }
    return initial;
  });

  const toggleWeek = (weekNumber: number) => {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(weekNumber)) {
        next.delete(weekNumber);
      } else {
        next.add(weekNumber);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenWeeks(new Set(plan.weeks.map((w) => w.weekNumber)));
  };

  const collapseAll = () => {
    setOpenWeeks(new Set());
  };

  const allExpanded = openWeeks.size === plan.weeks.length;

  return (
    <div>
      {/* Plan header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground">
            {plan.phase}
          </h3>
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            className="text-[10px] text-accent hover:text-accent/80 transition-colors font-medium"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>
        <p className="text-[11px] text-muted leading-relaxed">
          {plan.summary}
        </p>
      </div>

      {/* Phase groups */}
      <div className="px-4 pb-4">
        {phaseGroups.map((group, gi) => (
          <div key={gi}>
            {/* Phase header */}
            {group.phase && <PhaseHeader phase={group.phase} />}

            {/* Weeks in this phase */}
            <div className="space-y-2 mt-2">
              {group.weeks.map((week) => (
                <WeekRow
                  key={week.weekNumber}
                  week={week}
                  isOpen={openWeeks.has(week.weekNumber)}
                  onToggle={() => toggleWeek(week.weekNumber)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
