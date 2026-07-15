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
  onRequestReview?: () => void;
  onSignOut?: () => void;
  userEmail?: string;
}

export default function DashboardPanel({
  runnerContext,
  onContextUpdate,
  trainingPlan,
  activeTab,
  onTabChange,
  isBuildingPlan,
  onRequestReview,
  onSignOut,
  userEmail,
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
    { id: "settings", label: "Settings", enabled: true },
  ];

  // Check if the runner still has mostly empty context
  const contextIsEmpty = !(
    runnerContext.now.weeklyMileage ||
    runnerContext.now.longestRun ||
    runnerContext.now.runsPerWeek ||
    runnerContext.past.marathonsRun ||
    runnerContext.past.bestMarathon ||
    runnerContext.past.bestHalf
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Fixed header: branding + readiness numbers */}
      <div className="flex-shrink-0">
        {/* Top bar */}
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Dashboard</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[9px] text-muted uppercase tracking-wider">
                Target
              </div>
              <div className="text-sm font-mono font-bold text-accent">
                2:59:59
              </div>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                title={userEmail ? `Sign out ${userEmail}` : "Sign out"}
                aria-label="Sign out"
                className="flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                {/* Simple logout icon (door + arrow) */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Readiness numbers — always visible */}
        <div className="px-4 py-3 border-b border-border">
          <ReadinessNumbers
            data={readinessData}
            factors={runnerContext.readiness?.factors}
            injuryFactors={runnerContext.readiness?.injuryFactors}
            concerns={runnerContext.concerns}
            onUpdateConcerns={(val) => {
              const next = { ...runnerContext, concerns: val };
              onContextUpdate(next);
            }}
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
            {contextIsEmpty ? (
              <div className="mb-4 px-4 py-3 rounded-lg border border-accent/20 bg-accent/5">
                <p className="text-xs text-foreground font-medium mb-1">
                  Start here — tap any field to fill it in
                </p>
                <p className="text-[11px] text-muted leading-relaxed">
                  The more I know about your running, the better I can coach
                  you. Fill in what you can — the chat will pick up where you
                  leave off.
                </p>
              </div>
            ) : onRequestReview ? (
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-sm font-semibold text-foreground">
                  Runner Context
                </h3>
                <button
                  onClick={onRequestReview}
                  className="text-[11px] text-accent border border-accent/30 rounded-md px-3 py-1.5 hover:bg-accent/10 hover:border-accent/50 transition-colors flex items-center gap-1.5"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                    />
                  </svg>
                  Apply
                </button>
              </div>
            ) : null}
            <RunnerContext data={runnerContext} onUpdate={onContextUpdate} hideHeader={!contextIsEmpty && !!onRequestReview} />
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
          <div className="p-4 space-y-6">
            {/* Account */}
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Account
                </h3>
              </div>
              <div className="p-4 space-y-4">
                {userEmail && (
                  <div>
                    <div className="text-[10px] text-muted uppercase tracking-wider mb-1">
                      Email
                    </div>
                    <div className="text-sm text-foreground font-mono">
                      {userEmail}
                    </div>
                  </div>
                )}
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
