"use client";

import { useState, useRef, useEffect } from "react";
import MessageContent from "./MessageContent";
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
}

export default function ChatPanel({
  onContextUpdate,
  runnerContext,
  onPlanGenerated,
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });

        // Aggressively strip any <context> or <plan> content from display.
        // Handles: complete blocks, partial blocks, and edge cases with whitespace.
        const displayText = stripHiddenBlocks(accumulated);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "companion",
            content: displayText,
          };
          return updated;
        });
      }

      // Streaming complete — parse context and plan, clean up the message
      const { cleanMessage: afterContext, updatedContext } =
        parseContextFromMessage(accumulated, runnerContext);
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

      // If a plan was generated, trigger the plan tab
      if (plan) {
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
          <h2 className="text-sm font-semibold text-foreground tracking-tight">
            Sub Three
          </h2>
          <p className="text-[10px] text-muted">Your AI training companion</p>
        </div>
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[768px] mx-auto px-6 py-6">
          {/* Welcome state — shown before conversation starts */}
          {!hasStarted && (
            <div className="flex flex-col justify-center min-h-[60vh] text-center px-4">
              <h3 className="text-2xl font-semibold text-foreground mb-3 tracking-tight">
                2:59:59
              </h3>
              <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
                You&apos;re here because you want to break three hours. I&apos;m
                here to help. Let&apos;s start by getting to know you as a
                runner.
              </p>
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
                        {/* Thinking dots — shown while waiting for first token */}
                        {isStreaming &&
                          i === messages.length - 1 &&
                          !msg.content && (
                            <div className="flex items-center gap-1 py-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                              <div className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                          )}
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
