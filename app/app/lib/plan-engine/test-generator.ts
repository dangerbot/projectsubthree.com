/**
 * Quick verification script — run with: npx tsx app/lib/plan-engine/test-generator.ts
 * Checks that the generator output matches Steve's spreadsheet.
 */

import { generatePlan, generatePlanOutline, type PlanConfig } from "./index";
import { suggestEntryPoint } from "./base-plan";

// Test 1: Full plan from Phase 0
console.log("=== TEST 1: Full plan from Phase 0 ===");
const fullPlan = generatePlan({ startPhaseIndex: 0, startWeekInPhase: 0 });
console.log(`Total weeks: ${fullPlan.totalWeeks}`);
console.log(`Peak mileage: ${fullPlan.peakMileage}`);
console.log(`Longest run: ${fullPlan.longestRun}`);
console.log(`Phases: ${fullPlan.phases.length}`);
console.log("");

// Verify key weeks match spreadsheet
const checks = [
  { week: 1, expectedMiles: 20, label: "Phase 0 week 1" },
  { week: 7, expectedMiles: 25, label: "Phase 0 week 7" },
  { week: 8, expectedMiles: 30, label: "Phase 1 week 1" },
  { week: 13, expectedMiles: 35, label: "Phase 1 week 6" },
  { week: 14, expectedMiles: 37, label: "Phase 2 week 1" },
  { week: 19, expectedMiles: 33, label: "Phase 2 rest" },
  { week: 20, expectedMiles: 41, label: "Phase 3 week 1" },
  { week: 32, expectedMiles: 50, label: "Phase 5 week 1" },
  { week: 48, expectedMiles: 68, label: "Phase 9 PEAK" },
  { week: 52, expectedMiles: 67, label: "Phase 10 week 1" },
];

let passed = 0;
let failed = 0;
for (const check of checks) {
  const planWeek = fullPlan.weeks[check.week - 1];
  if (!planWeek) {
    console.log(`  FAIL: Week ${check.week} (${check.label}) — not found in plan`);
    failed++;
    continue;
  }
  const actual = planWeek.totalMiles;
  const match = Math.abs(actual - check.expectedMiles) < 0.5;
  console.log(
    `  ${match ? "PASS" : "FAIL"}: Week ${check.week} (${check.label}) — expected ${check.expectedMiles}, got ${actual} [${planWeek.phaseName}${planWeek.isRestWeek ? " REST" : ""}]`
  );
  if (match) passed++;
  else failed++;
}
console.log(`\n${passed}/${passed + failed} checks passed\n`);

// Test 2: Entry point suggestions
console.log("=== TEST 2: Entry point suggestions ===");
const cases = [
  { miles: 10, marathon: false },
  { miles: 22, marathon: true },
  { miles: 28, marathon: true },
  { miles: 32, marathon: true },
  { miles: 40, marathon: true },
];
for (const c of cases) {
  const entry = suggestEntryPoint(c.miles, c.marathon);
  console.log(`  ${c.miles} mi/wk, marathon=${c.marathon}: Phase ${entry.phaseIndex}, week ${entry.weekIndex} — ${entry.reasoning}`);
}

// Test 3: Plan from Phase 1 (experienced runner)
console.log("\n=== TEST 3: Plan from Phase 1 week 3 ===");
const partialPlan = generatePlan({ startPhaseIndex: 1, startWeekInPhase: 2 });
console.log(`Total weeks: ${partialPlan.totalWeeks}`);
console.log(`First week miles: ${partialPlan.weeks[0]?.totalMiles}`);
console.log(`First week phase: ${partialPlan.weeks[0]?.phaseName}`);

// Test 4: Workout assignments
console.log("=== TEST 4: Workout assignments ===");
const planWithWorkouts = generatePlan({ startPhaseIndex: 0, startWeekInPhase: 0 });

// Check Phase 0-1 have no workouts
const phase0weeks = planWithWorkouts.weeks.filter(w => w.phaseName === "Phase 0");
const phase0workouts = phase0weeks.flatMap(w => w.workouts).filter(d => d.type === "threshold" || d.type === "yasso");
console.log(`  Phase 0 workouts: ${phase0workouts.length} (expected 0) ${phase0workouts.length === 0 ? "PASS" : "FAIL"}`);

const phase1weeks = planWithWorkouts.weeks.filter(w => w.phaseName === "Phase 1");
const phase1workouts = phase1weeks.flatMap(w => w.workouts).filter(d => d.type === "threshold" || d.type === "yasso");
console.log(`  Phase 1 workouts: ${phase1workouts.length} (expected 0) ${phase1workouts.length === 0 ? "PASS" : "FAIL"}`);

// Check Phase 2 has threshold workouts on non-rest weeks
const phase2onWeeks = planWithWorkouts.weeks.filter(w => w.phaseName === "Phase 2" && !w.isRestWeek);
const phase2thresholds = phase2onWeeks.filter(w => w.workouts.some(d => d.type === "threshold"));
console.log(`  Phase 2 on-weeks with threshold: ${phase2thresholds.length}/${phase2onWeeks.length} ${phase2thresholds.length > 0 ? "PASS" : "FAIL"}`);

// Show a sample week with workouts
const sampleWeek = phase2thresholds[0];
if (sampleWeek) {
  console.log(`  Sample Phase 2 week ${sampleWeek.weekNumber}:`);
  sampleWeek.workouts.forEach(d => {
    const label = d.miles ? `${d.miles}mi ${d.type}` : "OFF";
    console.log(`    ${d.day}: ${label}`);
  });
}

// Check Phase 5 has 2 workouts
const phase5onWeeks = planWithWorkouts.weeks.filter(w => w.phaseName === "Phase 5" && !w.isRestWeek);
const phase5with2 = phase5onWeeks.filter(w => {
  const workoutCount = w.workouts.filter(d => d.type === "threshold" || d.type === "yasso").length;
  return workoutCount === 2;
});
console.log(`  Phase 5 on-weeks with 2 workouts: ${phase5with2.length}/${phase5onWeeks.length} ${phase5with2.length > 0 ? "PASS" : "FAIL"}`);

// Check Phase 9 (peak) has at most 1 workout
const phase9onWeeks = planWithWorkouts.weeks.filter(w => w.phaseName === "Phase 9" && !w.isRestWeek);
const phase9max = Math.max(...phase9onWeeks.map(w => w.workouts.filter(d => d.type === "threshold" || d.type === "yasso").length));
console.log(`  Phase 9 max workouts/week: ${phase9max} (expected ≤1) ${phase9max <= 1 ? "PASS" : "FAIL"}`);

// Check no workouts adjacent to long run
let adjacencyViolations = 0;
for (const w of planWithWorkouts.weeks) {
  const longIdx = w.workouts.findIndex(d => d.type === "long" || d.type === "race-pace-long");
  if (longIdx < 0) continue;
  for (let i = 0; i < w.workouts.length; i++) {
    if ((w.workouts[i].type === "threshold" || w.workouts[i].type === "yasso") &&
        (Math.abs(i - longIdx) <= 1 || (i === 0 && longIdx === 6) || (i === 6 && longIdx === 0))) {
      adjacencyViolations++;
    }
  }
}
console.log(`  Workouts adjacent to long run: ${adjacencyViolations} (expected 0) ${adjacencyViolations === 0 ? "PASS" : "FAIL"}`);

// Test 5: Plan outline
console.log("\n=== TEST 5: Plan outline ===");
console.log(generatePlanOutline({ startPhaseIndex: 1, startWeekInPhase: 0 }));
