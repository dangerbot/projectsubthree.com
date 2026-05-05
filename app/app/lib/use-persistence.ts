"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "./supabase";
import { EMPTY_CONTEXT, type RunnerContext } from "./runner-context";
import type { TrainingPlan } from "./training-plan";

/**
 * Loads runner context and plan from Supabase on mount,
 * and saves changes back with debouncing.
 *
 * Returns { loading, loadedContext, loadedPlan } so the parent
 * can hydrate state before rendering the app.
 */
export function usePersistence(userId: string | undefined) {
  const [loading, setLoading] = useState(true);
  const [loadedContext, setLoadedContext] = useState<RunnerContext | null>(null);
  const [loadedPlan, setLoadedPlan] = useState<TrainingPlan | null>(null);

  // Track whether initial load is done — prevents saving stale data
  const hasLoaded = useRef(false);

  // ── Load on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    async function load() {
      try {
        // Load or create runner row
        const { data: runner, error: runnerErr } = await supabase
          .from("runners")
          .select("context")
          .eq("id", userId)
          .single();

        if (runnerErr && runnerErr.code === "PGRST116") {
          // No row yet — create one
          const { data: session } = await supabase.auth.getSession();
          const email = session?.session?.user?.email ?? "";
          const { error: insertErr } = await supabase.from("runners").insert({
            id: userId,
            email,
            context: EMPTY_CONTEXT,
          });
          if (insertErr) {
            console.error("Failed to create runner row:", insertErr);
          } else {
            console.log("Created new runner row");
          }
          setLoadedContext(EMPTY_CONTEXT);
        } else if (runnerErr) {
          console.error("Failed to load runner:", runnerErr);
          setLoadedContext(EMPTY_CONTEXT);
        } else {
          console.log("Loaded runner context from Supabase:", JSON.stringify(runner.context).slice(0, 100));
          setLoadedContext((runner.context as RunnerContext) ?? EMPTY_CONTEXT);
        }

        // Load active plan
        const { data: plans, error: planErr } = await supabase
          .from("plans")
          .select("plan")
          .eq("runner_id", userId)
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1);

        if (planErr) {
          console.error("Failed to load plan:", planErr);
        } else if (plans && plans.length > 0) {
          console.log("Loaded plan from Supabase:", plans[0].plan ? "yes" : "no");
          setLoadedPlan(plans[0].plan as TrainingPlan);
        } else {
          console.log("No active plan found in Supabase");
        }
      } catch (err) {
        console.error("Persistence load error:", err);
        setLoadedContext(EMPTY_CONTEXT);
      } finally {
        hasLoaded.current = true;
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  // ── Save context (debounced) ────────────────────────────────────────────
  const saveContext = useCallback(
    (context: RunnerContext) => {
      if (!userId || !hasLoaded.current) return;

      const timer = setTimeout(async () => {
        try {
          const { error } = await supabase
            .from("runners")
            .update({ context })
            .eq("id", userId);

          if (error) {
            console.error("Supabase save context error:", error);
          } else {
            console.log("Context saved to Supabase");
          }
        } catch (err) {
          console.error("Failed to save context:", err);
        }
      }, 1000);

      return () => clearTimeout(timer);
    },
    [userId]
  );

  // ── Save plan ───────────────────────────────────────────────────────────
  const savePlan = useCallback(
    async (plan: TrainingPlan) => {
      if (!userId || !hasLoaded.current) return;

      try {
        // Deactivate any existing plans
        const { error: deactivateErr } = await supabase
          .from("plans")
          .update({ is_active: false })
          .eq("runner_id", userId)
          .eq("is_active", true);

        if (deactivateErr) {
          console.error("Failed to deactivate old plans:", deactivateErr);
        }

        // Insert the new plan
        const { error: insertErr } = await supabase.from("plans").insert({
          runner_id: userId,
          plan,
          is_active: true,
        });

        if (insertErr) {
          console.error("Failed to insert plan:", insertErr);
        } else {
          console.log("Plan saved to Supabase");
        }
      } catch (err) {
        console.error("Failed to save plan:", err);
      }
    },
    [userId]
  );

  return { loading, loadedContext, loadedPlan, saveContext, savePlan };
}
