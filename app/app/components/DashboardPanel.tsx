"use client";

import ReadinessNumbers from "./ReadinessNumbers";
import WeeklyPlan from "./WeeklyPlan";
import RunnerContext from "./RunnerContext";

// Placeholder data — this will come from the runner context model + API later
const mockReadiness = {
  subThreeProbability: 34,
  injuryRisk: "low" as const,
  weeksTo95: 22,
};

const mockWeeklyPlan = {
  cycleWeek: "Week 3 of 5",
  phase: "Base Building",
  workouts: [
    {
      day: "Mon",
      type: "Easy Run",
      description: "7 miles @ 8:00/mi — keep it conversational",
      completed: true,
    },
    {
      day: "Tue",
      type: "Easy Run",
      description: "6 miles @ 8:00/mi — recovery day",
      completed: true,
    },
    {
      day: "Wed",
      type: "Threshold",
      description: "2mi easy + 4×1mi @ 6:26 w/ 1min jog + 2mi easy",
      completed: false,
    },
    {
      day: "Thu",
      type: "Easy Run",
      description: "7 miles @ 8:00/mi",
      completed: false,
    },
    {
      day: "Fri",
      type: "Rest",
      description: "Full rest or easy 30min walk",
      completed: false,
    },
    {
      day: "Sat",
      type: "Long Run",
      description: "18 miles — first 14 easy, last 4 @ marathon pace (6:49)",
      completed: false,
    },
    {
      day: "Sun",
      type: "Easy Run",
      description: "5 miles @ 8:15/mi — shake out the legs",
      completed: false,
    },
  ],
};

const mockRunnerContext = {
  sustainedMileage: 48,
  peakMileage: 55,
  longestRun: 18,
  currentVdot: 47,
  targetVdot: 54,
  recentRaces: [
    { distance: "Half Marathon", time: "1:32:14", date: "Mar 2026" },
    { distance: "10K", time: "42:18", date: "Jan 2026" },
    { distance: "5K", time: "20:02", date: "Dec 2025" },
  ],
};

export default function DashboardPanel() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <ReadinessNumbers data={mockReadiness} />
        <WeeklyPlan data={mockWeeklyPlan} />
        <RunnerContext data={mockRunnerContext} />
      </div>
    </div>
  );
}
