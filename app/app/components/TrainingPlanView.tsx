"use client";

import type { TrainingPlan } from "../lib/training-plan";

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

// Empty state shown before a plan is generated
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
        personalized starter plan based on where you are today.
      </p>
    </div>
  );
}

// Building animation shown when plan is being generated
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

export default function TrainingPlanView({
  plan,
}: {
  plan: TrainingPlan | null;
}) {
  if (!plan) return <EmptyPlan />;

  return (
    <div className="space-y-4">
      {/* Plan header */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-foreground">
            {plan.phase}
          </h3>
          <span className="text-[10px] text-muted font-mono">
            {plan.weeks.length} weeks
          </span>
        </div>
        <p className="text-xs text-muted-light leading-relaxed">
          {plan.summary}
        </p>
      </div>

      {/* Weeks */}
      <div className="space-y-3 px-4 pb-4">
        {plan.weeks.map((week) => (
          <div
            key={week.weekNumber}
            className="bg-surface rounded-xl border border-border overflow-hidden"
          >
            {/* Week header */}
            <div className="px-3 py-2.5 border-b border-border flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                {week.label}
              </span>
              <span className="text-[10px] text-muted font-mono">
                ~{week.totalMiles} mi
              </span>
            </div>

            {/* Daily workouts */}
            <div className="divide-y divide-border">
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
          </div>
        ))}
      </div>
    </div>
  );
}
