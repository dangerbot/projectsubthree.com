"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MessageContent from "./MessageContent";
import ThinkingBolt from "./ThinkingBolt";
import {
  parseContextFromMessage,
  type RunnerContext,
} from "../lib/runner-context";
import { parsePlanFromMessage, type TrainingPlan } from "../lib/training-plan";

/**
 * Strip all hidden blocks (<context>, <plan>) from display text.
 * Handles complete blocks, partial/streaming blocks, and edge cases.
 */
function stripHiddenBlocks(text: string): string {
  return text
    // Complete blocks (greedy within tags)
    .replace(/<context>[\s\S]*?<\/context>/g, "")
    .replace(/<plan>[\s\S]*?<\/plan>/g, "")
    // Partial blocks (tag opened but not closed — still streaming)
    .replace(/<context>[\s\S]*$/g, "")
    .replace(/<plan>[\s\S]*$/g, "")
    // Catch any leftover closing tags
    .replace(/<\/context>/g, "")
    .replace(/<\/plan>/g, "")
    .trim();
}

interface Message {
  role: "user" | "companion";
  content: string;
}

interface ChatPanelProps {
  onContextUpdate: (context: RunnerContext) => void;
  runnerContext: RunnerContext;
  onPlanGenerated: (plan: TrainingPlan) => void;
  reviewTrigger?: number;
}

export default function ChatPanel({
  onContextUpdate,
  runnerContext,
  onPlanGenerated,
  reviewTrigger = 0,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Track reviewTrigger — when it increments (from dashboard CTA), send context review
  const prevTriggerRef = useRef(reviewTrigger);
  useEffect(() => {
    if (reviewTrigger > 0 && reviewTrigger !== prevTriggerRef.current) {
      prevTriggerRef.current = reviewTrigger;
      const summary = buildContextSummary();
      sendMessage(
        `Read and review my updated runner context:\n${summary}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewTrigger]);

  // Build a context summary for the "review my context" flow
  const buildContextSummary = (): string => {
    const ctx = runnerContext;
    const parts: string[] = [];
    if (ctx.now.weeklyMileage) parts.push(`Weekly mileage: ${ctx.now.weeklyMileage}`);
    if (ctx.now.longestRun) parts.push(`Longest recent run: ${ctx.now.longestRun} mi`);
    if (ctx.now.runsPerWeek) parts.push(`Runs per week: ${ctx.now.runsPerWeek}`);
    if (ctx.now.currentFeeling) parts.push(`Current feeling: ${ctx.now.currentFeeling}`);
    if (ctx.past.marathonsRun) parts.push(`Marathons run: ${ctx.past.marathonsRun}`);
    if (ctx.past.bestMarathon) parts.push(`Best marathon: ${ctx.past.bestMarathon}`);
    if (ctx.past.bestMarathonDate) parts.push(`Best marathon date: ${ctx.past.bestMarathonDate}`);
    if (ctx.past.lastMarathon) parts.push(`Last marathon: ${ctx.past.lastMarathon}`);
    if (ctx.past.lastMarathonTime) parts.push(`Last marathon time: ${ctx.past.lastMarathonTime}`);
    if (ctx.past.bestHalf) parts.push(`Best half: ${ctx.past.bestHalf}`);
    if (ctx.past.peakMileage) parts.push(`Peak mileage: ${ctx.past.peakMileage}`);
    if (ctx.past.subThreeAttempts) parts.push(`Sub-three attempts: ${ctx.past.subThreeAttempts}`);
    if (ctx.age) parts.push(`Age: ${ctx.age}`);
    if (ctx.concerns) parts.push(`Concerns: ${ctx.concerns}`);
    if (ctx.targetRaces) parts.push(`Target races: ${ctx.targetRaces}`);
    return parts.length > 0 ? parts.join("\n") : "No details filled in yet.";
  };

  // Demo shortcut — pre-fills context and sends a summary message
  const triggerDemo = () => {
    const demoContext = {
      ...runnerContext,
      now: {
        weeklyMileage: "24",
        longestRun: "6",
        runsPerWeek: "4",
        currentFeeling: "good",
      },
      past: {
        marathonsRun: "1",
        bestMarathon: "3:15",
        bestMarathonDate: "2 months ago",
        lastMarathon: "2 months ago",
        lastMarathonTime: "3:15",
        bestHalf: null,
        peakMileage: "50",
        subThreeAttempts: null,
      },
      story: "Ran my first marathon 2 months ago in 3:15. Peak mileage was 50 miles/week. Currently maintaining 24 miles/week across 4 runs. Ready to chase sub-3.",
    };
    onContextUpdate(demoContext);
    sendMessage(
      `Read and review my updated runner context:\nLast marathon: 3:15 (2 months ago)\nLongest run: 20 miles (a few weeks before the marathon)\nPeak mileage: 50 mi/wk\nCurrently running: 4 days/week, 6 miles each, 24 miles total\nNo target race date yet`
    );
  };

  // Check if the runner has filled in any context directly
  const hasUserContext = !!(
    runnerContext.now.weeklyMileage ||
    runnerContext.past.marathonsRun ||
    runnerContext.past.bestMarathon ||
    runnerContext.past.bestHalf ||
    runnerContext.now.runsPerWeek
  );

  // Show the "review my context" CTA — evergreen, available any time
  // the runner has filled in context and the companion isn't streaming
  const showContextCTA =
    hasStarted &&
    !isStreaming &&
    messages.length >= 2 &&
    hasUserContext;

  // Handle sending — works for both typed input and starter taps
  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    // On first message, seed the welcome as a companion message so it scrolls up naturally
    const baseMessages = !hasStarted
      ? [
          {
            role: "companion" as const,
            content:
              "You're here because you want to break three hours. I'm here to help. Let's start by getting to know you as a runner.",
          },
        ]
      : messages;

    if (!hasStarted) setHasStarted(true);

    const userMessage: Message = {
      role: "user",
      content: text.trim(),
    };

    const updatedMessages = [...baseMessages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Add an empty companion message that we'll stream into
    setMessages([...updatedMessages, { role: "companion", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role === "companion" ? "assistant" : msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader available");

      let accumulated = "";
      let toolPlanGenerated = false;
      let isToolThinking = false;
      let textLengthAtThinking = 0;
      const processedEvents = new Set<number>();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        // Check for __EVENT__ protocol messages from tool calls
        const eventPattern = /\n__EVENT__:(.*?)\n/g;
        let eventMatch;
        while ((eventMatch = eventPattern.exec(accumulated)) !== null) {
          if (processedEvents.has(eventMatch.index)) continue;
          processedEvents.add(eventMatch.index);

          try {
            const event = JSON.parse(eventMatch[1]);
            if (event.type === "plan_generated" && event.plan) {
              onPlanGenerated(event.plan);
              toolPlanGenerated = true;
            }
            if (event.type === "thinking") {
              isToolThinking = true;
              // Snapshot how much visible text we had before the tool gap
              const currentText = stripHiddenBlocks(
                accumulated.replace(/\n__EVENT__:.*?\n/g, "")
              );
              textLengthAtThinking = currentText.length;
            }
          } catch {
            // Ignore malformed events
          }
        }

        // Strip events from display text
        const textForDisplay = accumulated.replace(/\n__EVENT__:.*?\n/g, "");
        const displayText = stripHiddenBlocks(textForDisplay);

        // Once new text arrives after the thinking event, exit thinking state
        if (isToolThinking && displayText.length > textLengthAtThinking) {
          isToolThinking = false;
        }

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "companion",
            // During tool thinking gap, show empty so the bolt reappears
            content: isToolThinking ? "" : displayText,
          };
          return updated;
        });
      }

      // Streaming complete — strip events, then parse context and plan
      const textOnly = accumulated.replace(/\n__EVENT__:.*?\n/g, "");
      const { cleanMessage: afterContext, updatedContext } =
        parseContextFromMessage(textOnly, runnerContext);
      const { cleanMessage: afterPlan, plan } =
        parsePlanFromMessage(afterContext);

      // Final safety: strip anything the parsers might have missed
      const finalMessage = stripHiddenBlocks(afterPlan);

      // Update the displayed message
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "companion",
          content: finalMessage,
        };
        return updated;
      });

      // Update the runner context in the dashboard
      onContextUpdate(updatedContext);

      // If a plan was generated via old <plan> block (fallback), trigger it
      if (plan && !toolPlanGenerated) {
        onPlanGenerated(plan);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "companion",
          content:
            "Something went wrong — I couldn't connect. Make sure the API key is set up in .env.local and try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      textareaRef.current?.focus();
    }
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-[768px] mx-auto px-6 py-4">
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            title="Open projectsubthree.com in a new tab"
            className="inline-block group"
          >
            <h2 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-accent transition-colors">
              Sub Three
            </h2>
            <p className="text-[10px] text-muted">Your AI training companion</p>
          </Link>
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[768px] mx-auto px-6 py-6">
          {/* Welcome state — shown before conversation starts */}
          {!hasStarted && (
            <div className="flex flex-col justify-center min-h-[60vh] px-4">
              {/* Hero */}
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                  2:59:59
                </h3>
                <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                  You&apos;re here because you want to break three hours.
                  I&apos;m here to help.
                </p>
              </div>

              {/* Getting started checklist */}
              <div className="max-w-sm mx-auto mt-8">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">
                  How to get started
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-mono text-accent">1</span>
                    </span>
                    <span className="text-xs text-muted leading-relaxed">
                      Fill out your{" "}
                      <span className="text-accent font-medium">
                        Runner Context
                      </span>{" "}
                      on the right as best you can
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-mono text-accent">2</span>
                    </span>
                    <span className="text-xs text-muted leading-relaxed">
                      Tap{" "}
                      <span className="text-accent font-medium">Apply</span>{" "}
                      to let me review what you&apos;ve entered
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full border border-accent/40 flex items-center justify-center mt-0.5">
                      <span className="text-[10px] font-mono text-accent">3</span>
                    </span>
                    <span className="text-xs text-muted leading-relaxed">
                      Answer any follow-up questions I have
                    </span>
                  </li>
                </ol>

                <p className="text-xs text-muted/60 leading-relaxed mt-5">
                  I&apos;ll create a plan based on what I know. It can be
                  adjusted as we go — as I learn more about you, or based on
                  any requests or needs you have.
                </p>
              </div>

              {/* Quick-start starters */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {[
                  "I want to break 3 hours",
                  "I just ran my first marathon",
                  "I'm getting back into running",
                  "I've been close but can't crack it",
                ].map((starter) => (
                  <button
                    key={starter}
                    onClick={() => sendMessage(starter)}
                    className="text-xs text-muted-light border border-border rounded-full px-4 py-2 hover:border-accent/40 hover:text-foreground transition-colors"
                  >
                    {starter}
                  </button>
                ))}
                <button
                  onClick={triggerDemo}
                  className="text-xs text-muted/40 border border-border/40 rounded-full px-4 py-2 hover:border-accent/40 hover:text-accent transition-colors"
                >
                  Let&apos;s Go
                </button>
              </div>
            </div>
          )}

          {/* Messages — inside the same centered container */}
          {hasStarted && (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  {msg.role === "companion" ? (
                    <div className="max-w-full py-1">
                      <div className="text-sm leading-relaxed text-foreground">
                        {/* Thinking bolt — shown while waiting for first token */}
                        {isStreaming &&
                          i === messages.length - 1 &&
                          !msg.content && <ThinkingBolt />}
                        {msg.content && <MessageContent text={msg.content} />}
                        {/* Streaming cursor — shown once text starts flowing */}
                        {isStreaming &&
                          i === messages.length - 1 &&
                          msg.content && (
                            <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse align-text-bottom rounded-sm" />
                          )}
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-[85%] rounded-2xl px-4 py-3 border border-accent/30 bg-accent/10 relative overflow-hidden rounded-br-sm">
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
                      <p className="relative text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                        {msg.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {/* Context review CTA — shown during onboarding when user has filled in context */}
              {showContextCTA && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      const summary = buildContextSummary();
                      sendMessage(
                        `Read and review my updated runner context:\n${summary}`
                      );
                    }}
                    className="text-xs text-accent border border-accent/30 rounded-full px-4 py-2 hover:bg-accent/10 hover:border-accent/50 transition-colors"
                  >
                    Review my updated context →
                  </button>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input — also centered within the same max-width */}
      <div className="border-t border-border">
        <div className="max-w-[768px] mx-auto px-6 py-4">
          <div className="flex items-end gap-3 bg-surface rounded-xl border border-border pl-4 pr-3 py-3 focus-within:border-accent/40 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your training..."
              rows={1}
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm text-foreground placeholder-muted resize-none outline-none max-h-32 disabled:opacity-50 leading-relaxed"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent text-background flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
