"use client";

import { useState, useRef, useEffect } from "react";
import type { RunnerContext as RunnerContextType } from "../lib/runner-context";

// ── Editable Stat (tap-to-edit for compact number fields) ──────────────────

function EditableStat({
  label,
  value,
  subtitle,
  unit,
  onSave,
}: {
  label: string;
  value: string | null;
  subtitle?: string | null;
  unit?: string;
  onSave: (val: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    onSave(trimmed === "" ? null : trimmed);
  };

  const hasValue = value !== null;
  // Adaptive sizing: short values (≤5 chars) get big mono, longer ones get smaller
  const isCompact = hasValue && value.length <= 6;

  return (
    <div
      className="cursor-pointer group"
      onClick={() => {
        if (!editing) {
          setDraft(value ?? "");
          setEditing(true);
        }
      }}
    >
      <div className="text-[10px] text-muted uppercase tracking-wider mb-1 flex items-center justify-between">
        {label}
        <svg
          className="w-2.5 h-2.5 text-muted opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>
      </div>
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-full bg-transparent text-sm font-mono text-foreground border-b border-accent/40 outline-none py-0.5"
        />
      ) : hasValue ? (
        <div>
          <div
            className={
              isCompact
                ? "text-lg font-mono font-bold text-foreground"
                : "text-sm font-mono font-semibold text-foreground"
            }
          >
            {value}
            {unit && isCompact && (
              <span className="text-[10px] text-muted ml-1">{unit}</span>
            )}
          </div>
          {subtitle && (
            <div className="text-[10px] text-muted mt-0.5">{subtitle}</div>
          )}
        </div>
      ) : (
        <div className="text-lg font-mono text-border-light group-hover:text-muted transition-colors">
          —
        </div>
      )}
    </div>
  );
}

// ── Editable Narrative Block (tap-to-edit for text fields) ──────────────────

function EditableNarrative({
  label,
  text,
  placeholder,
  accentColor,
  onSave,
}: {
  label: string;
  text: string | null;
  placeholder: string;
  accentColor?: string;
  onSave: (val: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      textareaRef.current?.focus();
      // Auto-resize
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height =
          textareaRef.current.scrollHeight + "px";
      }
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = draft.trim();
    onSave(trimmed === "" ? null : trimmed);
  };

  return (
    <div
      className="px-3 py-2.5 bg-background rounded-lg cursor-pointer group"
      onClick={() => {
        if (!editing) {
          setDraft(text ?? "");
          setEditing(true);
        }
      }}
    >
      <div
        className={`text-[10px] uppercase tracking-wider font-semibold mb-1 flex items-center justify-between ${accentColor || "text-muted"}`}
      >
        {label}
        <svg
          className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </svg>
      </div>
      {editing ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-full bg-transparent text-xs text-muted-light leading-relaxed border-b border-accent/40 outline-none resize-none py-0.5"
        />
      ) : text ? (
        <p className="text-xs text-muted-light leading-relaxed">{text}</p>
      ) : (
        <p className="text-xs text-border-light italic group-hover:text-muted transition-colors">
          {placeholder}
        </p>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function RunnerContext({
  data,
  onUpdate,
}: {
  data: RunnerContextType;
  onUpdate: (ctx: RunnerContextType) => void;
}) {
  // Helper to update a nested field and push to parent
  const update = (path: string, value: string | null) => {
    const next = structuredClone(data);
    const parts = path.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let target: any = next;
    for (let i = 0; i < parts.length - 1; i++) {
      target = target[parts[i]];
    }
    target[parts[parts.length - 1]] = value;
    onUpdate(next);
  };

  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden">
      {/* Header — clean, no progress bar */}
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">
          Runner Context
        </h3>
      </div>

      <div className="p-4 space-y-5">
        {/* Runner Story */}
        <EditableNarrative
          label="Your Story"
          text={data.story}
          placeholder="Tap to add your story"
          accentColor="text-accent"
          onSave={(v) => update("story", v)}
        />

        {/* NOW section */}
        <div>
          <div className="text-[10px] text-accent uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            Now
            <span className="text-muted font-normal">— last 6 weeks</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-background rounded-lg p-3">
              <EditableStat
                label="Weekly Miles"
                value={data.now.weeklyMileage}
                unit="mi/wk"
                onSave={(v) => update("now.weeklyMileage", v)}
              />
            </div>
            <div className="bg-background rounded-lg p-3">
              <EditableStat
                label="Longest Run"
                value={data.now.longestRun}
                unit="mi"
                onSave={(v) => update("now.longestRun", v)}
              />
            </div>
            <div className="bg-background rounded-lg p-3">
              <EditableStat
                label="Runs / Week"
                value={data.now.runsPerWeek}
                unit="×"
                onSave={(v) => update("now.runsPerWeek", v)}
              />
            </div>
          </div>
          <div className="mt-2">
            <EditableNarrative
              label="Status"
              text={data.now.currentFeeling}
              placeholder="How's running feeling right now?"
              onSave={(v) => update("now.currentFeeling", v)}
            />
          </div>
        </div>

        {/* PAST section */}
        <div>
          <div className="text-[10px] text-muted-light uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-muted-light" />
            Past
            <span className="text-muted font-normal">— proven capability</span>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded-lg p-3">
                <EditableStat
                  label="Marathons"
                  value={data.past.marathonsRun}
                  onSave={(v) => update("past.marathonsRun", v)}
                />
              </div>
              <div className="bg-background rounded-lg p-3">
                <EditableStat
                  label="PR"
                  value={data.past.bestMarathon}
                  subtitle={data.past.bestMarathonDate}
                  onSave={(v) => update("past.bestMarathon", v)}
                />
              </div>
              <div className="bg-background rounded-lg p-3">
                <EditableStat
                  label="Last Race"
                  value={data.past.lastMarathonTime ?? data.past.lastMarathon}
                  subtitle={
                    data.past.lastMarathonTime ? data.past.lastMarathon : null
                  }
                  onSave={(v) => update("past.lastMarathon", v)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded-lg p-3">
                <EditableStat
                  label="Peak Miles"
                  value={data.past.peakMileage}
                  unit="mi/wk"
                  onSave={(v) => update("past.peakMileage", v)}
                />
              </div>
              <div className="bg-background rounded-lg p-3">
                <EditableStat
                  label="Best Half"
                  value={data.past.bestHalf}
                  onSave={(v) => update("past.bestHalf", v)}
                />
              </div>
              <div className="bg-background rounded-lg p-3">
                {data.age ? (
                  <EditableStat
                    label="Age"
                    value={data.age}
                    onSave={(v) => update("age", v)}
                  />
                ) : (
                  <EditableStat
                    label="Sub-3 Tries"
                    value={data.past.subThreeAttempts}
                    onSave={(v) => update("past.subThreeAttempts", v)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Concerns & Injuries — always visible */}
        <EditableNarrative
          label="Concerns & Injuries"
          text={data.concerns}
          placeholder="None noted — tap to add"
          accentColor="text-warning"
          onSave={(v) => update("concerns", v)}
        />

        {/* Target Races — always visible */}
        <EditableNarrative
          label="Target Races"
          text={data.targetRaces}
          placeholder="No target yet — tap to add"
          accentColor="text-muted-light"
          onSave={(v) => update("targetRaces", v)}
        />

        {/* Sub-three attempts callout — only when age is shown (so sub-3 tries slot is taken) */}
        {data.age && data.past.subThreeAttempts && (
          <div
            className="px-3 py-2 bg-accent/5 border border-accent/10 rounded-lg cursor-pointer group"
            onClick={() => {
              const val = prompt("Sub-3 attempts:", data.past.subThreeAttempts ?? "");
              if (val !== null) update("past.subThreeAttempts", val.trim() || null);
            }}
          >
            <span className="text-[10px] text-accent uppercase tracking-wider font-medium">
              Sub-3 Attempts:{" "}
            </span>
            <span className="text-xs text-foreground font-mono">
              {data.past.subThreeAttempts}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
