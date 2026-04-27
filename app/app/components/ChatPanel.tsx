"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "companion";
  content: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsStreaming(true);

    // Add an empty companion message that we'll stream into
    const companionMessage: Message = {
      role: "companion",
      content: "",
    };
    setMessages([...updatedMessages, companionMessage]);

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

        // Update the last message (the companion's response) with streamed text
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "companion",
            content: accumulated,
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      // Update the companion message with an error
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-accent-dim flex items-center justify-center">
          <span className="text-accent text-sm font-bold">S3</span>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Sub Three Companion
          </h2>
          <p className="text-xs text-muted">Your AI training partner</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-accent-dim flex items-center justify-center mb-4">
              <span className="text-accent text-2xl font-bold">S3</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Ready when you are
            </h3>
            <p className="text-sm text-muted max-w-md">
              Tell me about your running — where you are, where you&apos;ve been,
              and where you want to go. We&apos;ll figure out the path to 2:59:59
              together.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-accent-dim text-foreground rounded-br-sm"
                  : "bg-surface text-foreground border border-border rounded-bl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
                {/* Streaming cursor */}
                {isStreaming &&
                  i === messages.length - 1 &&
                  msg.role === "companion" && (
                    <span className="inline-block w-1.5 h-4 bg-accent ml-0.5 animate-pulse align-text-bottom" />
                  )}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-end gap-3 bg-surface rounded-xl border border-border px-4 py-3 focus-within:border-accent-dim transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me about your training..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-sm text-foreground placeholder-muted resize-none outline-none max-h-32 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent text-background flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
