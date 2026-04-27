"use client";

interface Workout {
  day: string;
  type: string;
  description: string;
  completed: boolean;
}

interface WeeklyPlanData {
  cycleWeek: string; // e.g. "Week 3 of 5"
  phase: string; // e.g. "Base Building"
  workouts: Workout[];
}

export default function WeeklyPlan({ data }: { data: WeeklyPlanData }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">This Week</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{data.phase}</span>
          <span className="text-xs text-muted-light bg-surface-hover px-2 py-0.5 rounded-full">
            {data.cycleWeek}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {data.workouts.map((workout, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-3 ${
              workout.completed ? "opacity-50" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                workout.completed
                  ? "border-accent bg-accent"
                  : "border-border-light"
              }`}
            >
              {workout.completed && (
                <svg
                  className="w-3 h-3 text-background"
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
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted w-8">{workout.day}</span>
                <span className="text-sm font-medium text-foreground">
                  {workout.type}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5 truncate">
                {workout.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
