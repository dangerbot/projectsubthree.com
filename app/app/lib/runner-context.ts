/**
 * Runner context — the data structure that builds up through conversation.
 *
 * In the skateboard phase, this lives in React state (resets on refresh).
 * In the bicycle phase, this gets persisted to Supabase.
 */

export interface ReadinessFactor {
  name: string; // e.g. "Mileage Base"
  score: number; // 1-10
  note: string; // Brief explanation
}

export interface ReadinessAssessment {
  probability: number; // 0-100
  injuryRisk: "low" | "moderate" | "elevated" | "high";
  weeksTo95: number | null; // estimated weeks to 95% probability
  factors: ReadinessFactor[]; // probability factors
  injuryFactors: ReadinessFactor[]; // injury risk factors
}

export interface RunnerContext {
  // "Now" — what they're doing right now (last ~6 weeks)
  now: {
    weeklyMileage: string | null; // e.g. "15-20" or "0"
    longestRun: string | null; // e.g. "6" or "none"
    runsPerWeek: string | null; // e.g. "3-4" or "0"
    currentFeeling: string | null; // e.g. "Getting back into it"
  };
  // "Past" — proven capability
  past: {
    marathonsRun: string | null; // e.g. "14"
    bestMarathon: string | null; // e.g. "2:58"
    bestMarathonDate: string | null; // e.g. "Oct 2017"
    lastMarathon: string | null; // e.g. "2017" — when they last raced
    lastMarathonTime: string | null; // e.g. "3:12" — time of last marathon
    bestHalf: string | null; // e.g. "1:28"
    peakMileage: string | null; // e.g. "60"
    subThreeAttempts: string | null; // e.g. "12"
  };
  // Personal (only if volunteered)
  age: string | null;
  // The runner's story — a brief narrative summary
  story: string | null;
  // Concerns, injuries, limitations
  concerns: string | null;
  // Target races or dates
  targetRaces: string | null;
  // Readiness assessment — updated with every response
  readiness: ReadinessAssessment | null;
}

export const EMPTY_CONTEXT: RunnerContext = {
  now: {
    weeklyMileage: null,
    longestRun: null,
    runsPerWeek: null,
    currentFeeling: null,
  },
  past: {
    marathonsRun: null,
    bestMarathon: null,
    bestMarathonDate: null,
    lastMarathon: null,
    lastMarathonTime: null,
    bestHalf: null,
    peakMileage: null,
    subThreeAttempts: null,
  },
  age: null,
  story: null,
  concerns: null,
  targetRaces: null,
  readiness: null,
};

/**
 * Parse the hidden context JSON from a companion message.
 * Returns the updated context and the clean message (without the JSON block).
 */
export function parseContextFromMessage(
  rawMessage: string,
  currentContext: RunnerContext
): { cleanMessage: string; updatedContext: RunnerContext } {
  // Look for a JSON block wrapped in <context>...</context> tags
  // (may be followed by a <plan> block, so don't anchor to end of string)
  const contextMatch = rawMessage.match(
    /<context>([\s\S]*?)<\/context>/
  );

  if (!contextMatch) {
    return { cleanMessage: rawMessage, updatedContext: currentContext };
  }

  // Strip the context block from the visible message
  const cleanMessage = rawMessage
    .replace(/<context>[\s\S]*?<\/context>/, "")
    .trim();

  try {
    const parsed = JSON.parse(contextMatch[1]);

    // Merge parsed values into current context (only update non-null values)
    const updatedContext: RunnerContext = {
      now: {
        weeklyMileage:
          parsed.now?.weeklyMileage ?? currentContext.now.weeklyMileage,
        longestRun:
          parsed.now?.longestRun ?? currentContext.now.longestRun,
        runsPerWeek:
          parsed.now?.runsPerWeek ?? currentContext.now.runsPerWeek,
        currentFeeling:
          parsed.now?.currentFeeling ?? currentContext.now.currentFeeling,
      },
      past: {
        marathonsRun:
          parsed.past?.marathonsRun ?? currentContext.past.marathonsRun,
        bestMarathon:
          parsed.past?.bestMarathon ?? currentContext.past.bestMarathon,
        bestMarathonDate:
          parsed.past?.bestMarathonDate ?? currentContext.past.bestMarathonDate,
        lastMarathon:
          parsed.past?.lastMarathon ?? currentContext.past.lastMarathon,
        lastMarathonTime:
          parsed.past?.lastMarathonTime ?? currentContext.past.lastMarathonTime,
        bestHalf:
          parsed.past?.bestHalf ?? currentContext.past.bestHalf,
        peakMileage:
          parsed.past?.peakMileage ?? currentContext.past.peakMileage,
        subThreeAttempts:
          parsed.past?.subThreeAttempts ?? currentContext.past.subThreeAttempts,
      },
      age: parsed.age ?? currentContext.age,
      story: parsed.story ?? currentContext.story,
      concerns: parsed.concerns ?? currentContext.concerns,
      targetRaces: parsed.targetRaces ?? currentContext.targetRaces,
      readiness: parsed.readiness
        ? {
            probability: parsed.readiness.probability ?? 0,
            injuryRisk: parsed.readiness.injuryRisk ?? "low",
            weeksTo95: parsed.readiness.weeksTo95 ?? null,
            factors: Array.isArray(parsed.readiness.factors)
              ? parsed.readiness.factors.map(
                  (f: { name?: string; score?: number; note?: string }) => ({
                    name: f.name || "",
                    score: f.score || 1,
                    note: f.note || "",
                  })
                )
              : [],
            injuryFactors: Array.isArray(parsed.readiness.injuryFactors)
              ? parsed.readiness.injuryFactors.map(
                  (f: { name?: string; score?: number; note?: string }) => ({
                    name: f.name || "",
                    score: f.score || 1,
                    note: f.note || "",
                  })
                )
              : [],
          }
        : currentContext.readiness,
    };

    return { cleanMessage, updatedContext };
  } catch {
    // If JSON parsing fails, just return the message as-is
    return { cleanMessage: rawMessage, updatedContext: currentContext };
  }
}
