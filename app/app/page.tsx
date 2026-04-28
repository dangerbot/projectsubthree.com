"use client";

import { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import DashboardPanel from "./components/DashboardPanel";
import {
  EMPTY_CONTEXT,
  type RunnerContext,
} from "./lib/runner-context";
import { convertGeneratedPlan, type TrainingPlan } from "./lib/training-plan";

type Tab = "context" | "plan" | "log" | "settings";

export default function Home() {
  const [runnerContext, setRunnerContext] =
    useState<RunnerContext>(EMPTY_CONTEXT);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("context");
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);
  const [reviewTrigger, setReviewTrigger] = useState(0);

  // Called when a plan is generated — handles both old <plan> block format
  // and new tool-generated GeneratedPlan format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePlanGenerated = (plan: any) => {
    setIsBuildingPlan(true);
    setActiveTab("plan");

    // Detect if this is a GeneratedPlan (from tool) or TrainingPlan (from <plan> block)
    const isEnginePlan = plan.phases && plan.weeks && plan.totalWeeks;
    const convertedPlan: TrainingPlan = isEnginePlan
      ? convertGeneratedPlan(plan)
      : plan;

    // Brief delay to show the "building" animation, then reveal the plan
    setTimeout(() => {
      setTrainingPlan(convertedPlan);
      setIsBuildingPlan(false);
    }, 2000);
  };

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
      <div className="w-[440px] flex-shrink-0">
        <DashboardPanel
          runnerContext={runnerContext}
          onContextUpdate={setRunnerContext}
          trainingPlan={trainingPlan}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isBuildingPlan={isBuildingPlan}
          onRequestReview={() => setReviewTrigger((n) => n + 1)}
        />
      </div>
    </div>
  );
}
