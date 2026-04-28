/**
 * Plan Generator — stamps out a full training plan from AI decisions.
 *
 * The AI decides: start phase, race date, adjustments.
 * This function does the mechanical work in milliseconds.
 */

import {
  PHASES,
  type PhaseDefinition,
  type WeekTemplate,
  type DayTemplate,
  type WorkoutType,
} from "./base-plan";

// --- Output types (what the frontend renders) ---

export interface PlanDay {
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  miles: number | null;
  type: WorkoutType;
  description: string;
  note?: string;
  completed?: boolean;
}

export interface PlanWeek {
  weekNumber: number; // Overall week number (1-based)
  phaseWeekNumber: number; // Week within the phase (1-based)
  phaseName: string;
  phaseShortName: string;
  isRestWeek: boolean;
  totalMiles: number;
  workouts: PlanDay[];
}

export interface GeneratedPlan {
  phases: PlanPhaseSummary[];
  weeks: PlanWeek[];
  totalWeeks: number;
  peakMileage: number;
  longestRun: number;
  raceDate: string | null;
  generatedAt: string;
}

export interface PlanPhaseSummary {
  name: string;
  shortName: string;
  description: string;
  startWeek: number; // Overall week number where this phase starts
  endWeek: number;
  weekCount: number;
}

// --- Generator config (what the AI provides) ---

export interface WorkoutConfig {
  workoutsPerWeek: number; // 0, 1, or 2
  types: WorkoutType[]; // e.g. ["threshold"] or ["threshold", "yasso"]
}

export interface PlanConfig {
  startPhaseIndex: number; // Which phase to start in (0-based index into PHASES)
  startWeekInPhase: number; // Which week within that phase (0-based)
  raceDate?: string; // ISO date string, optional
  phaseAdjustments?: PhaseAdjustment[]; // Compress or extend specific phases
  workoutOverride?: Partial<Record<number, WorkoutConfig>>; // Per-phase workout config (key = phase index). AI can override defaults.
}

export interface PhaseAdjustment {
  phaseIndex: number;
  action: "compress" | "extend";
  weeks: number; // How many weeks to add or remove from on-weeks
}

// --- Day names ---

const DAY_NAMES: PlanDay["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// --- Description generators ---

function describeDay(template: DayTemplate, dayName: string): string {
  if (template.miles === null) {
    return dayName === "Sun" || dayName === "Fri" ? "Rest day" : "Rest or light cross-training";
  }

  switch (template.type) {
    case "easy":
      if (template.miles <= 3) return "Easy recovery run";
      if (template.miles <= 5) return "Easy pace, conversational";
      if (template.miles <= 8) return "Easy pace";
      return "Easy pace, steady effort";
    case "long":
      return `Long run — easy effort, no faster than 7:45/mi`;
    case "threshold":
      return `Threshold development — 1mi warmup, middle at 6:30/mi, 1mi cooldown`;
    case "yasso":
      return `Yasso 800s — warmup, 800m at 3:00 w/ jog recovery, cooldown`;
    case "race-pace-long":
      return `Race pace long run — last few miles at 6:51/mi, warmup + cooldown`;
    case "fartlek":
      return `Fartlek — mix of paces, have fun with it`;
    case "race":
      return `RACE DAY — 26.2 miles`;
    case "rest":
      return "Rest day";
    default:
      return "Easy pace";
  }
}

// --- Default workout assignments by phase ---
// Rules from Steve:
// - Pick medium-length runs (not the shortest recovery, not the long run)
// - Never put a workout the day before or after the long run
// - Pull back on workouts as mileage nears peak
// - Phase 0-1: all easy (no workouts)
// - Early phases: 1 workout/week
// - Mid phases: 1-2 workouts/week
// - Peak phases (8-9): pull back to 1 or 0
// - Final Race Prep + Taper: race pace long runs handle the quality

const DEFAULT_WORKOUT_CONFIG: Record<number, WorkoutConfig> = {
  // Phase 0: no workouts
  // Phase 1: no workouts
  2: { workoutsPerWeek: 1, types: ["threshold"] },
  3: { workoutsPerWeek: 1, types: ["threshold"] },
  4: { workoutsPerWeek: 1, types: ["threshold"] },
  5: { workoutsPerWeek: 2, types: ["threshold", "yasso"] },
  6: { workoutsPerWeek: 2, types: ["threshold", "yasso"] },
  7: { workoutsPerWeek: 2, types: ["threshold", "yasso"] },
  8: { workoutsPerWeek: 1, types: ["threshold"] }, // Pulling back near peak
  9: { workoutsPerWeek: 1, types: ["threshold"] }, // Peak — easy does it
  10: { workoutsPerWeek: 1, types: ["threshold"] },
  // Final Race Prep (11): race pace long runs are the quality work
  // Taper (12): race pace long runs
  // Race Week (13): nothing
};

/**
 * Find the index of the long run day (type "long" or "race-pace-long") in a week.
 */
function findLongRunIndex(workouts: PlanDay[]): number {
  const longIdx = workouts.findIndex((d) => d.type === "long" || d.type === "race-pace-long");
  return longIdx >= 0 ? longIdx : 5; // Default to Saturday if not found
}

/**
 * Check if a day index is adjacent to the long run (or is the long run).
 */
function isAdjacentToLongRun(dayIndex: number, longRunIndex: number): boolean {
  return Math.abs(dayIndex - longRunIndex) <= 1 ||
    // Wrap-around: Mon(0) is adjacent to Sun(6)
    (dayIndex === 0 && longRunIndex === 6) ||
    (dayIndex === 6 && longRunIndex === 0);
}

/**
 * Assign workouts to a week's plan days.
 * Picks medium-length easy runs that aren't adjacent to the long run.
 */
function assignWorkouts(week: PlanWeek, config: WorkoutConfig, phaseIndex: number): void {
  if (config.workoutsPerWeek === 0 || week.isRestWeek) return;

  const longIdx = findLongRunIndex(week.workouts);

  // Find eligible days: must be "easy" type, have miles, not adjacent to long run
  // Sort by miles descending to prefer medium-length runs
  const eligible = week.workouts
    .map((d, i) => ({ day: d, index: i }))
    .filter(({ day, index }) =>
      day.type === "easy" &&
      day.miles !== null &&
      day.miles >= 5 && // At least 5 miles (not a recovery 3-miler)
      !isAdjacentToLongRun(index, longIdx)
    )
    .sort((a, b) => (b.day.miles ?? 0) - (a.day.miles ?? 0));

  const toAssign = Math.min(config.workoutsPerWeek, eligible.length, config.types.length);

  for (let i = 0; i < toAssign; i++) {
    const slot = eligible[i];
    const workoutType = config.types[i];
    slot.day.type = workoutType;
    slot.day.description = describeDay({ miles: slot.day.miles, type: workoutType }, slot.day.day);
  }
}

// --- Core generator ---

function expandPhaseWeeks(
  phase: PhaseDefinition,
  onWeeksOverride?: number,
  startWeekInPhase: number = 0
): WeekTemplate[] {
  const weeks: WeekTemplate[] = [];
  const effectiveOnWeeks = onWeeksOverride ?? phase.onWeeks;

  if (phase.buildPattern === "progressive" && phase.progressiveWeeks) {
    // Progressive phases: use the specific week templates
    const available = phase.progressiveWeeks.slice(startWeekInPhase);
    // If we have adjustments that changed onWeeks, take what we can
    for (let i = 0; i < Math.min(effectiveOnWeeks - startWeekInPhase, available.length); i++) {
      weeks.push(available[i]);
    }
  } else {
    // Static phases: repeat the on-template for each on-week
    const onCount = effectiveOnWeeks - startWeekInPhase;
    for (let i = 0; i < onCount; i++) {
      weeks.push(phase.onTemplate);
    }
  }

  // Add rest week if the phase has one
  if (phase.restWeeks > 0 && phase.restTemplate) {
    weeks.push(phase.restTemplate);
  }

  return weeks;
}

function weekTemplateToPlanWeek(
  template: WeekTemplate,
  overallWeekNum: number,
  phaseWeekNum: number,
  phaseName: string,
  phaseShortName: string,
  isRestWeek: boolean
): PlanWeek {
  const workouts: PlanDay[] = template.days.map((day, i) => ({
    day: DAY_NAMES[i],
    miles: day.miles,
    type: day.type,
    description: describeDay(day, DAY_NAMES[i]),
    note: day.note,
    completed: false,
  }));

  return {
    weekNumber: overallWeekNum,
    phaseWeekNumber: phaseWeekNum,
    phaseName,
    phaseShortName,
    isRestWeek,
    totalMiles: template.totalMiles,
    workouts,
  };
}

/**
 * Generate a full training plan.
 *
 * Called by the AI via tool use. The AI provides the coaching decisions,
 * this function does the mechanical work.
 */
export function generatePlan(config: PlanConfig): GeneratedPlan {
  const weeks: PlanWeek[] = [];
  const phases: PlanPhaseSummary[] = [];
  let overallWeek = 1;
  let peakMileage = 0;
  let longestRun = 0;

  for (let pi = config.startPhaseIndex; pi < PHASES.length; pi++) {
    const phase = PHASES[pi];
    const startWeek = pi === config.startPhaseIndex ? config.startWeekInPhase : 0;

    // Check for phase adjustments
    const adjustment = config.phaseAdjustments?.find((a) => a.phaseIndex === pi);
    let effectiveOnWeeks = phase.onWeeks;
    if (adjustment) {
      if (adjustment.action === "compress") {
        effectiveOnWeeks = Math.max(1, phase.onWeeks - adjustment.weeks);
      } else if (adjustment.action === "extend") {
        effectiveOnWeeks = phase.onWeeks + adjustment.weeks;
      }
    }

    const expandedWeeks = expandPhaseWeeks(phase, effectiveOnWeeks, startWeek);
    const phaseStartWeek = overallWeek;
    let phaseWeekNum = startWeek + 1;

    const onWeekCount = expandedWeeks.length - (phase.restWeeks > 0 ? 1 : 0);

    for (let wi = 0; wi < expandedWeeks.length; wi++) {
      const template = expandedWeeks[wi];
      const isRestWeek = phase.restWeeks > 0 && wi === expandedWeeks.length - 1;

      const planWeek = weekTemplateToPlanWeek(
        template,
        overallWeek,
        phaseWeekNum,
        phase.name,
        phase.shortName,
        isRestWeek
      );

      // Assign workouts (AI override > default > none)
      const workoutConfig = config.workoutOverride?.[pi] ?? DEFAULT_WORKOUT_CONFIG[pi];
      if (workoutConfig && !isRestWeek) {
        assignWorkouts(planWeek, workoutConfig, pi);
      }

      weeks.push(planWeek);

      // Track peak mileage and longest run
      if (template.totalMiles > peakMileage) {
        peakMileage = template.totalMiles;
      }
      for (const day of template.days) {
        if (day.miles && day.miles > longestRun) {
          longestRun = day.miles;
        }
      }

      overallWeek++;
      phaseWeekNum++;
    }

    phases.push({
      name: phase.name,
      shortName: phase.shortName,
      description: phase.description,
      startWeek: phaseStartWeek,
      endWeek: overallWeek - 1,
      weekCount: expandedWeeks.length,
    });
  }

  return {
    phases,
    weeks,
    totalWeeks: weeks.length,
    peakMileage,
    longestRun,
    raceDate: config.raceDate ?? null,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate a plan summary for the AI to reference.
 * Lighter than the full plan — just phases and weekly totals.
 */
export function generatePlanOutline(config: PlanConfig): string {
  const plan = generatePlan(config);
  const lines: string[] = [];

  lines.push(`Training Plan: ${plan.totalWeeks} weeks | Peak: ${plan.peakMileage} mi/wk | Longest run: ${plan.longestRun} mi`);
  if (plan.raceDate) lines.push(`Race date: ${plan.raceDate}`);
  lines.push("");

  for (const phase of plan.phases) {
    lines.push(`${phase.name} (${phase.shortName}) — Weeks ${phase.startWeek}-${phase.endWeek} (${phase.weekCount} weeks)`);
    lines.push(`  ${phase.description}`);

    // Show weekly miles for this phase
    const phaseWeeks = plan.weeks.filter((w) => w.weekNumber >= phase.startWeek && w.weekNumber <= phase.endWeek);
    const miles = phaseWeeks.map((w) => `${w.totalMiles}${w.isRestWeek ? " (rest)" : ""}`).join(", ");
    lines.push(`  Miles/week: ${miles}`);
    lines.push("");
  }

  return lines.join("\n");
}
