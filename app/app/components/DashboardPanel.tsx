"use client";

import ReadinessNumbers from "./ReadinessNumbers";
import RunnerContext from "./RunnerContext";
import TrainingPlanView, { PlanBuilding } from "./TrainingPlanView";
import type { RunnerContext as RunnerContextType } from "../lib/runner-context";
import type { TrainingPlan } from "../lib/training-plan";

type Tab = "context" | "plan" | "log" | "settings";

interface DashboardPanelProps {
  runnerContext: RunnerContextType;
  onContextUpdate: (context: RunnerContextType) => void;
  trainingPlan: TrainingPlan | null;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isBuildingPlan: boolean;
}

export default function DashboardPanel({
  runnerContext,
  onContextUpdate,
  trainingPlan,
  activeTab,
  onTabChange,
  isBuildingPlan,
}: DashboardPanelProps) {
  // Live readiness data from the AI's assessment
  const readinessData = {
    subThreeProbability: runnerContext.readiness?.probability ?? null,
    injuryRisk: runnerContext.readiness?.injuryRisk ?? null,
    weeksTo95: runnerContext.readiness?.weeksTo95 ?? null,
  };
  const tabs: { id: Tab; label: string; enabled: boolean }[] = [
    { id: "context", label: "Context", enabled: true },
    { id: "plan", label: "Plan", enabled: true },
    { id: "log", label: "Log", enabled: false },
    { id: "settings", label: "Settings", enabled: false },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed header: branding + readiness numbers */}
      <div className="flex-shrink-0">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-muted uppercase tracking-wider">
              Target
            </div>
            <div className="text-sm font-mono font-bold text-accent">
              2:59:59
            </div>
          </div>
        </div>

        {/* Readiness numbers — always visible */}
        <div className="px-4 py-3 border-b border-border">
          <ReadinessNumbers
            data={readinessData}
            factors={runnerContext.readiness?.factors}
          />
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => tab.enabled && onTabChange(tab.id)}
              className={`flex-1 py-2.5 text-[11px] font-medium tracking-wide transition-colors relative ${
                activeTab === tab.id
                  ? "text-accent"
                  : tab.enabled
                    ? "text-muted hover:text-foreground"
                    : "text-border-light cursor-not-allowed"
              }`}
            >
              {tab.label}
              {!tab.enabled && (
                <span className="ml-1 text-[8px] text-border-light uppercase">
                  soon
                </span>
              )}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-accent rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "context" && (
          <div className="p-4">
            <RunnerContext data={runnerContext} onUpdate={onContextUpdate} />
          </div>
        )}

        {activeTab === "plan" && (
          <div>
            {isBuildingPlan ? (
              <PlanBuilding />
            ) : (
              <TrainingPlanView plan={trainingPlan} />
            )}
          </div>
        )}

        {activeTab === "log" && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="text-3xl font-mono font-bold text-border-light mb-3">
              —
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Training Log
            </h3>
            <p className="text-xs text-muted max-w-xs leading-relaxed">
              Track your completed workouts and notes here. Coming soon — once
              you have a plan, this is where you&apos;ll log your progress.
            </p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="text-3xl font-mono font-bold text-border-light mb-3">
              —
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Settings
            </h3>
            <p className="text-xs text-muted max-w-xs leading-relaxed">
              Preferences, integrations, and account settings. Coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
