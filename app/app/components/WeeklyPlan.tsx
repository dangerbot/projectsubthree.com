"use client";

interface Workout {
  day: string;
  type: string;
  description: string;
  completed: boolean;
}

interface WeeklyPlanData {
  cycleWeek: string;
  phase: string;
  workouts: Workout[];
}

export default function WeeklyPlan({ data }: { data: WeeklyPlanData }) {
  const completedCount = data.workouts.filter((w) => w.completed).length;
  const totalCount = data.workouts.length;

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">This Week</h3>
          <span className="text-[10px] text-muted font-mono">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted uppercase tracking-wider">
            {data.phase}
          </span>
          <span className="text-[10px] text-muted-light bg-surface-hover px-2 py-0.5 rounded-full font-mono">
            {data.cycleWeek}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="divide-y divide-border/50">
        {data.workouts.map((workout, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
              workout.completed
                ? "opacity-40"
                : "hover:bg-surface-hover"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                workout.completed
                  ? "border-accent bg-accent"
                  : "border-border-light"
              }`}
            >
              {workout.completed && (
                <svg
                  className="w-2.5 h-2.5 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-[10px] text-muted font-mono w-7 flex-shrink-0">
              {workout.day}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground">
                {workout.type}
              </span>
              <span className="text-xs text-muted ml-2">
                {workout.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
