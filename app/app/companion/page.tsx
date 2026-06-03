"use client";

import { useState, useEffect } from "react";
import ChatPanel from "../components/ChatPanel";
import DashboardPanel from "../components/DashboardPanel";
import LoginScreen from "../components/LoginScreen";
import { useAuth } from "../lib/auth-context";
import { usePersistence } from "../lib/use-persistence";
import {
  EMPTY_CONTEXT,
  type RunnerContext,
} from "../lib/runner-context";
import { convertGeneratedPlan, type TrainingPlan } from "../lib/training-plan";

type Tab = "context" | "plan" | "log" | "settings";

export default function Companion() {
  const { user, loading: authLoading, signOut } = useAuth();

  const [runnerContext, setRunnerContext] =
    useState<RunnerContext>(EMPTY_CONTEXT);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("context");
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [reviewTrigger, setReviewTrigger] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // Persistence — loads from DB, provides save functions
  const {
    loading: dbLoading,
    loadedContext,
    loadedPlan,
    saveContext,
    savePlan,
  } = usePersistence(user?.id);

  // Hydrate state from DB once fully loaded (wait for both context + plan queries)
  useEffect(() => {
    if (!dbLoading && loadedContext && !hydrated) {
      setRunnerContext(loadedContext);
      if (loadedPlan) {
        setTrainingPlan(loadedPlan);
        setActiveTab("plan");
      }
      setHydrated(true);
    }
  }, [dbLoading, loadedContext, loadedPlan, hydrated]);

  // Save context to DB on changes (after hydration)
  useEffect(() => {
    if (!hydrated || !user) return;
    const cleanup = saveContext(runnerContext);
    return cleanup;
  }, [runnerContext, hydrated, user, saveContext]);

  // ── Auth loading ────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin" />
      </div>
    );
  }

  // ── Not logged in ───────────────────────────────────────────────────────
  if (!user) {
    return <LoginScreen />;
  }

  // ── Loading runner data ─────────────────────────────────────────────────
  if (dbLoading || !hydrated) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <div className="text-center">
          <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent animate-spin mx-auto mb-3" />
          <p className="text-xs text-muted">Loading your data...</p>
        </div>
      </div>
    );
  }

  // ── Plan generated callback ─────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlanGenerated = (plan: any) => {
    setIsBuildingPlan(true);
    setActiveTab("plan");

    const isEnginePlan = plan.phases && plan.weeks && plan.totalWeeks;
    const convertedPlan: TrainingPlan = isEnginePlan
      ? convertGeneratedPlan(plan)
      : plan;

    setTimeout(() => {
      setTrainingPlan(convertedPlan);
      setIsBuildingPlan(false);
      // Save to DB
      savePlan(convertedPlan);
    }, 2000);
  };

  // ── Main app ────────────────────────────────────────────────────────────
  return (
    <div className="flex h-full">
      {/* Left: Conversation */}
      <div className="flex-1 min-w-0">
        <ChatPanel
          onContextUpdate={setRunnerContext}
          runnerContext={runnerContext}
          onPlanGenerated={handlePlanGenerated}
          reviewTrigger={reviewTrigger}
        />
      </div>

      {/* Divider */}
      <div className="w-px bg-border" />

      {/* Right: Dashboard */}
      <div className="w-[660px] flex-shrink-0">
        <DashboardPanel
          runnerContext={runnerContext}
          onContextUpdate={setRunnerContext}
          trainingPlan={trainingPlan}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isBuildingPlan={isBuildingPlan}
          onRequestReview={() => setReviewTrigger((n) => n + 1)}
          onSignOut={signOut}
          userEmail={user.email}
        />
      </div>
    </div>
  );
}
