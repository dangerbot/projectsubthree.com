/**
 * Plan Engine — the brain behind plan generation.
 *
 * AI makes decisions → plan engine stamps out the plan.
 */

export { PHASES, PACES, suggestEntryPoint, getPlanSummary } from "./base-plan";
export type { WorkoutType, DayTemplate, WeekTemplate, PhaseDefinition, EntryPointResult } from "./base-plan";

export { generatePlan, generatePlanOutline } from "./generator";
export type {
  PlanConfig,
  PhaseAdjustment,
  WorkoutConfig,
  GeneratedPlan,
  PlanPhaseSummary,
  PlanWeek,
  PlanDay,
} from "./generator";
