/**
 * Sub Three Base Training Plan — v1.0
 *
 * Source of truth for plan generation. Encoded from Steve's spreadsheet.
 * The AI doesn't generate this — it makes decisions about which parts
 * to use, and the plan engine stamps it out.
 */

// --- Workout Types ---

export type WorkoutType =
  | "easy"
  | "long"
  | "threshold"
  | "yasso"
  | "race-pace-long"
  | "fartlek"
  | "rest"
  | "race";

export interface DayTemplate {
  miles: number | null; // null = OFF
  type: WorkoutType;
  note?: string;
}

export interface WeekTemplate {
  days: [DayTemplate, DayTemplate, DayTemplate, DayTemplate, DayTemplate, DayTemplate, DayTemplate]; // Mon-Sun
  totalMiles: number;
}

export interface PhaseDefinition {
  name: string;
  shortName: string; // For UI display
  description: string;
  onWeeks: number; // Number of "on" weeks before rest
  restWeeks: number; // 0 or 1
  onTemplate: WeekTemplate; // What an "on" week looks like
  restTemplate: WeekTemplate | null; // What the rest week looks like (null if no rest)
  buildPattern?: "static" | "progressive"; // static = same every on-week, progressive = changes each week
  progressiveWeeks?: WeekTemplate[]; // If progressive, the full sequence of on-weeks
}

// --- Helper to create day templates ---

function easy(miles: number): DayTemplate {
  return { miles, type: "easy" };
}

function long(miles: number): DayTemplate {
  return { miles, type: "long" };
}

function off(): DayTemplate {
  return { miles: null, type: "rest" };
}

function racePaceLong(miles: number): DayTemplate {
  return { miles, type: "race-pace-long", note: "Last few miles at race pace (6:51/mi), warmup + cooldown included" };
}

function race(): DayTemplate {
  return { miles: 26.2, type: "race", note: "Race day!" };
}

// --- Week template helper ---

function week(
  mon: DayTemplate,
  tue: DayTemplate,
  wed: DayTemplate,
  thu: DayTemplate,
  fri: DayTemplate,
  sat: DayTemplate,
  sun: DayTemplate
): WeekTemplate {
  const days: WeekTemplate["days"] = [mon, tue, wed, thu, fri, sat, sun];
  const totalMiles = days.reduce((sum, d) => sum + (d.miles ?? 0), 0);
  return { days, totalMiles };
}

// --- Phase Definitions ---

export const PHASES: PhaseDefinition[] = [
  // Phase 0 — Pre-Phase (progressive build, 7 weeks)
  {
    name: "Phase 0",
    shortName: "Pre-Phase",
    description:
      "Build the running habit. Get to 4 consecutive weeks at 20-25 miles. Can extend as long as needed.",
    onWeeks: 7,
    restWeeks: 0,
    onTemplate: week(easy(4), easy(4), easy(4), easy(4), easy(4), easy(5), off()), // placeholder, progressive overrides
    restTemplate: null,
    buildPattern: "progressive",
    progressiveWeeks: [
      week(easy(3), easy(3), easy(3), easy(3), easy(3), easy(5), off()), // 20
      week(easy(3), easy(3), easy(3), easy(3), easy(3), easy(5), off()), // 20
      week(easy(3), easy(3), easy(3), easy(3), easy(4), easy(5), off()), // 21
      week(easy(3), easy(3), easy(3), easy(4), easy(4), easy(5), off()), // 22
      week(easy(3), easy(3), easy(4), easy(4), easy(4), easy(5), off()), // 23
      week(easy(3), easy(4), easy(4), easy(4), easy(4), easy(5), off()), // 24
      week(easy(4), easy(4), easy(4), easy(4), easy(4), easy(5), off()), // 25
    ],
  },

  // Phase 1 — Base Building (progressive, 6 weeks, long run grows 1mi/week)
  {
    name: "Phase 1",
    shortName: "Base Building",
    description:
      "All easy runs (~8:30/mi, no faster than 8:00). Long run grows 1 mile each week from 5 to 10.",
    onWeeks: 6,
    restWeeks: 0,
    onTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(10), off()), // placeholder
    restTemplate: null,
    buildPattern: "progressive",
    progressiveWeeks: [
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(5), off()),  // 30
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(6), off()),  // 31
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(7), off()),  // 32
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(8), off()),  // 33
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(9), off()),  // 34
      week(easy(5), easy(5), easy(5), easy(5), easy(5), long(10), off()), // 35
    ],
  },

  // Phase 2 — Intro Step-Up Cycle (5 on, 1 rest)
  {
    name: "Phase 2",
    shortName: "Step-Up Intro",
    description:
      "Introduce the 12-mile long run. First phase with a rest week. All easy.",
    onWeeks: 5,
    restWeeks: 1,
    onTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(12), off()), // 37
    restTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(8), off()), // 33
    buildPattern: "static",
  },

  // Phase 3 (5 on, 1 rest) — mid-week bump to 8, long to 13
  {
    name: "Phase 3",
    shortName: "Building Volume",
    description:
      "Mid-week run bumps to 8 miles. Long run to 13. Same step-up pattern.",
    onWeeks: 5,
    restWeeks: 1,
    onTemplate: week(easy(5), easy(5), easy(8), easy(5), easy(5), long(13), off()), // 41
    restTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(8), off()), // 33
    buildPattern: "static",
  },

  // Phase 4 (5 on, 1 rest) — two 8s, long to 15
  {
    name: "Phase 4",
    shortName: "Strength Building",
    description:
      "Two mid-week 8-milers. Long run to 15. Getting serious.",
    onWeeks: 5,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(5), easy(8), easy(5), easy(5), long(15), off()), // 46
    restTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(8), off()), // 33
    buildPattern: "static",
  },

  // Phase 5 (3 on, 1 rest) — the big build begins, Sunday added
  {
    name: "Phase 5",
    shortName: "Big Build I",
    description:
      "Switching to 4-week phases. Sunday run added. The big build starts here.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(5), easy(8), easy(5), easy(5), long(16), easy(3)), // 50
    restTemplate: week(easy(5), easy(5), easy(5), easy(5), easy(5), long(8), easy(3)), // 36
    buildPattern: "static",
  },

  // Phase 6 (3 on, 1 rest) — more 8s
  {
    name: "Phase 6",
    shortName: "Big Build II",
    description:
      "Four 8-mile days. Volume climbing. Rest weeks stay higher now.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(8), easy(8), easy(8), easy(5), long(16), easy(3)), // 56
    restTemplate: week(easy(8), easy(8), easy(8), easy(8), easy(5), long(8), easy(3)), // 48
    buildPattern: "static",
  },

  // Phase 7 (3 on, 1 rest) — Thursday to 10, long to 18
  {
    name: "Phase 7",
    shortName: "Big Build III",
    description:
      "Thursday bumps to 10. Long run reaches 18. Hitting real marathon training volume.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(8), easy(8), easy(10), easy(5), long(18), easy(3)), // 60
    restTemplate: week(easy(8), easy(8), easy(8), easy(8), easy(5), long(8), easy(3)), // 48
    buildPattern: "static",
  },

  // Phase 8 (3 on, 1 rest) — Tue+Thu to 10, long to 20, Sun to 5
  {
    name: "Phase 8",
    shortName: "Peak Build I",
    description:
      "Tuesday and Thursday hit 10. Long run to 20. Sunday to 5. Approaching peak.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(10), easy(8), easy(10), easy(5), long(20), easy(5)), // 66
    restTemplate: week(easy(8), easy(8), easy(8), easy(8), easy(5), long(8), easy(5)), // 50
    buildPattern: "static",
  },

  // Phase 9 — PEAK MILEAGE (3 on, 1 rest)
  {
    name: "Phase 9",
    shortName: "Peak Mileage",
    description:
      "68 miles/week — this is the peak. Long run to 22. The summit of the build.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(10), easy(8), easy(10), easy(5), long(22), easy(5)), // 68
    restTemplate: week(easy(8), easy(8), easy(8), easy(8), easy(5), long(8), easy(5)), // 50
    buildPattern: "static",
  },

  // Phase 10 — Longest Run (3 on, 1 rest)
  {
    name: "Phase 10",
    shortName: "Longest Run",
    description:
      "Long run hits 24 — the longest of the cycle. Slight volume drop to protect against injury. Watch closely.",
    onWeeks: 3,
    restWeeks: 1,
    onTemplate: week(easy(8), easy(10), easy(5), easy(10), easy(5), long(24), easy(5)), // 67
    restTemplate: week(easy(8), easy(8), easy(5), easy(8), easy(5), long(8), easy(5)), // 47
    buildPattern: "static",
  },

  // Final Race Prep (4 on, no rest week)
  {
    name: "Final Race Prep",
    shortName: "Race Prep",
    description:
      "Mileage drops. Long runs become race pace rehearsals. Feel what 6:51 feels like when tired.",
    onWeeks: 4,
    restWeeks: 0,
    onTemplate: week(easy(5), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(18), easy(3)), // 55
    restTemplate: null,
    buildPattern: "progressive",
    progressiveWeeks: [
      week(easy(5), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(18), easy(3)), // 55
      week(easy(5), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(18), easy(3)), // 55
      week(easy(5), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(18), easy(3)), // 55
      week(easy(5), easy(8), racePaceLong(11), easy(3), easy(5), racePaceLong(20), easy(3)), // 55
    ],
  },

  // Taper (3 weeks, progressive wind-down)
  {
    name: "Taper",
    shortName: "Taper",
    description:
      "Wind down volume. Maintain some race pace touches. Let the body absorb the training.",
    onWeeks: 3,
    restWeeks: 0,
    onTemplate: week(easy(8), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(13), easy(3)), // placeholder
    restTemplate: null,
    buildPattern: "progressive",
    progressiveWeeks: [
      week(easy(8), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(13), easy(3)), // 53
      week(easy(8), easy(8), racePaceLong(13), easy(3), easy(5), racePaceLong(13), easy(3)), // 53
      week(easy(8), easy(8), easy(8), easy(3), easy(5), easy(8), easy(3)),                   // 43
    ],
  },

  // Race Week
  {
    name: "Race Week",
    shortName: "Race Week!",
    description:
      "This is it. Easy early in the week, then go run your marathon.",
    onWeeks: 1,
    restWeeks: 0,
    onTemplate: week(easy(8), easy(8), easy(5), easy(5), easy(5), easy(5), race()), // 62.2
    restTemplate: null,
    buildPattern: "static",
  },
];

// --- Pace Constants ---

export const PACES = {
  easy: { min: "7:45", max: "8:30", note: "Conversational. No faster than 7:45." },
  threshold: { target: "6:30", note: "Slightly faster than marathon pace. Challenging but sustainable for 3-6 miles." },
  marathonRace: { target: "6:51", note: "Sub-3 marathon pace. 26.2 miles at this pace = 2:59:xx." },
  yasso800: { target: "3:00", note: "Per 800m. Recovery jog 400-800m between reps." },
} as const;

// --- Entry Point Rules ---

export interface EntryPointResult {
  phaseIndex: number; // Index into PHASES array
  weekIndex: number; // Which week within the phase to start (0-based)
  reasoning: string;
}

/**
 * Determines where a runner enters the plan.
 * The AI should call this or use similar logic when generating a plan.
 */
export function suggestEntryPoint(weeklyMiles: number, hasMarathon: boolean): EntryPointResult {
  if (weeklyMiles < 20 || !hasMarathon) {
    return {
      phaseIndex: 0, // Phase 0
      weekIndex: 0,
      reasoning: "Starting with Phase 0 to build running habit and base mileage.",
    };
  }

  if (weeklyMiles < 25) {
    return {
      phaseIndex: 0, // Phase 0
      weekIndex: Math.min(Math.floor(weeklyMiles - 20), 6),
      reasoning: "Entering Phase 0 at a point matching current volume.",
    };
  }

  if (weeklyMiles < 30) {
    return {
      phaseIndex: 1, // Phase 1
      weekIndex: 0,
      reasoning: "Current mileage supports starting Phase 1 from the beginning.",
    };
  }

  if (weeklyMiles <= 35) {
    // Map 30-35 into Phase 1 weeks (weeks correspond to 30, 31, 32, 33, 34, 35)
    const weekIndex = Math.min(Math.round(weeklyMiles - 30), 5);
    return {
      phaseIndex: 1, // Phase 1
      weekIndex,
      reasoning: `Jumping into Phase 1 week ${weekIndex + 1} to match current ${weeklyMiles} mi/week volume.`,
    };
  }

  if (weeklyMiles <= 40) {
    return {
      phaseIndex: 2, // Phase 2
      weekIndex: 0,
      reasoning: "Strong base. Starting at Phase 2 with the step-up cycle.",
    };
  }

  if (weeklyMiles <= 50) {
    return {
      phaseIndex: 3, // Phase 3
      weekIndex: 0,
      reasoning: "High existing volume. Entering at Phase 3.",
    };
  }

  return {
    phaseIndex: 4, // Phase 4
    weekIndex: 0,
    reasoning: "Very high existing volume. Entering at Phase 4.",
  };
}

// --- Summary Stats ---

export function getPlanSummary() {
  let totalWeeks = 0;
  for (const phase of PHASES) {
    totalWeeks += phase.onWeeks + phase.restWeeks;
  }
  return {
    totalWeeks,
    totalPhases: PHASES.length,
    peakMilesPerWeek: 68,
    longestRun: 24,
  };
}
