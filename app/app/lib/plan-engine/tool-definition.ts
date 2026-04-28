/**
 * Claude Tool Definitions for Plan Engine
 *
 * These define the tools the AI can call during conversation.
 * The API route processes the tool calls and returns results.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages";

export const PLAN_TOOLS: Tool[] = [
  {
    name: "generate_training_plan",
    description: `Generate a full training plan for a runner based on your coaching assessment. Call this when you've gathered enough context to build their plan. The plan engine handles the week-by-week details — you just provide the coaching decisions.

IMPORTANT: You should call this tool instead of writing a <plan> JSON block. The tool generates the plan instantly and returns it to the Plan tab.

Entry point guidance:
- New to running / <20 mi/wk: startPhaseIndex=0 (Phase 0)
- 20-24 mi/wk with marathon experience: startPhaseIndex=0, startWeekInPhase=estimated week
- 25-29 mi/wk: startPhaseIndex=1 (Phase 1)
- 30-35 mi/wk: startPhaseIndex=1, startWeekInPhase=miles-30 (jump into matching week)
- 36-40 mi/wk with recent marathons: startPhaseIndex=2 (Phase 2)
- 40-50 mi/wk: startPhaseIndex=3 (Phase 3)
- 50+ mi/wk: startPhaseIndex=4 (Phase 4)

Phase index reference:
0=Phase 0 (Pre), 1=Phase 1 (Base), 2=Phase 2 (Step-Up Intro), 3=Phase 3 (Building),
4=Phase 4 (Strength), 5=Phase 5 (Big Build I), 6=Phase 6 (Big Build II),
7=Phase 7 (Big Build III), 8=Phase 8 (Peak Build), 9=Phase 9 (Peak Mileage),
10=Phase 10 (Longest Run), 11=Final Race Prep, 12=Taper, 13=Race Week`,
    input_schema: {
      type: "object" as const,
      required: ["startPhaseIndex", "startWeekInPhase"],
      properties: {
        startPhaseIndex: {
          type: "number",
          description:
            "Which phase to start the runner in (0-13). Base this on their current weekly mileage and experience.",
        },
        startWeekInPhase: {
          type: "number",
          description:
            "Which week within the starting phase (0-based). Use 0 to start at the beginning of the phase, or a higher number to skip ahead within it.",
        },
        raceDate: {
          type: "string",
          description:
            "Target race date in ISO format (YYYY-MM-DD). Optional — if provided, the plan works backward from this date.",
        },
        phaseAdjustments: {
          type: "array",
          description:
            "Optional adjustments to compress or extend specific phases based on your assessment.",
          items: {
            type: "object",
            required: ["phaseIndex", "action", "weeks"],
            properties: {
              phaseIndex: {
                type: "number",
                description: "Which phase to adjust (0-13)",
              },
              action: {
                type: "string",
                enum: ["compress", "extend"],
                description: "Whether to shorten or lengthen this phase",
              },
              weeks: {
                type: "number",
                description: "How many weeks to add or remove from the on-weeks",
              },
            },
          },
        },
      },
    },
  },
  {
    name: "modify_training_plan",
    description: `Modify the runner's existing training plan. Call this when the runner requests changes (move long run day, shorten plan, etc.) or when you're recommending adjustments based on their progress.

After modifying, the probability and injury risk should be reassessed to reflect the changes.`,
    input_schema: {
      type: "object" as const,
      required: ["modification"],
      properties: {
        modification: {
          type: "object",
          description: "The modification to apply",
          required: ["type"],
          properties: {
            type: {
              type: "string",
              enum: [
                "extend_phase",
                "compress_phase",
                "regenerate_from_phase",
              ],
              description: "Type of modification",
            },
            phaseIndex: {
              type: "number",
              description: "Which phase to modify",
            },
            weeks: {
              type: "number",
              description: "How many weeks to add/remove (for extend/compress)",
            },
            raceDate: {
              type: "string",
              description: "Updated race date if changed",
            },
            reason: {
              type: "string",
              description:
                "Why this modification is being made (shown to user)",
            },
          },
        },
      },
    },
  },
];
