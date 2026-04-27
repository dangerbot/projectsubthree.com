"use client";

import { useState } from "react";
import ChatPanel from "./components/ChatPanel";
import DashboardPanel from "./components/DashboardPanel";
import {
  EMPTY_CONTEXT,
  type RunnerContext,
} from "./lib/runner-context";
import type { TrainingPlan } from "./lib/training-plan";

type Tab = "context" | "plan" | "log" | "settings";

export default function Home() {
  const [runnerContext, setRunnerContext] =
    useState<RunnerContext>(EMPTY_CONTEXT);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("context");
  const [isBuildingPlan, setIsBuildingPlan] = useState(false);

  // Called when a plan is generated from chat
  const handlePlanGenerated = (plan: TrainingPlan) => {
    setIsBuildingPlan(true);
    setActiveTab("plan");
    // Brief delay to show the "building" animation, then reveal the plan
    setTimeout(() => {
      setTrainingPlan(plan);
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
        />
      </div>
    </div>
  );
}
