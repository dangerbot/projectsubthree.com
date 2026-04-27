"use client";

import React from "react";

/**
 * Renders chat message text with basic markdown support:
 * - **bold**
 * - *italic*
 * - Line breaks (double newline = paragraph break)
 * - Lists (lines starting with - or *)
 *
 * Lightweight — no external markdown library needed.
 */
export default function MessageContent({ text }: { text: string }) {
  // Split into paragraphs on double newlines
  const paragraphs = text.split(/\n\n+/);

  return (
    <>
      {paragraphs.map((para, pi) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if this paragraph is a list (lines starting with - or *)
        const lines = trimmed.split("\n");
        const isList = lines.every(
          (line) =>
            line.trim().startsWith("- ") || line.trim().startsWith("* ")
        );

        if (isList) {
          return (
            <ul key={pi} className="list-disc list-inside space-y-1 my-1">
              {lines.map((line, li) => (
                <li key={li} className="text-sm leading-relaxed">
                  {formatInline(line.trim().replace(/^[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }

        // Regular paragraph — handle single newlines as line breaks
        return (
          <p key={pi} className={pi > 0 ? "mt-2" : ""}>
            {lines.map((line, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {formatInline(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

/**
 * Format inline markdown: **bold** and *italic*
 */
function formatInline(text: string): React.ReactNode {
  // Match **bold** and *italic* patterns
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Try **bold** first
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Try *italic*
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    // Find which comes first
    const boldIndex = boldMatch ? remaining.indexOf(boldMatch[0]) : -1;
    const italicIndex = italicMatch ? remaining.indexOf(italicMatch[0]) : -1;

    let firstMatch: RegExpMatchArray | null = null;
    let firstIndex = -1;

    if (boldIndex !== -1 && (italicIndex === -1 || boldIndex <= italicIndex)) {
      firstMatch = boldMatch;
      firstIndex = boldIndex;
    } else if (italicIndex !== -1) {
      firstMatch = italicMatch;
      firstIndex = italicIndex;
    }

    if (!firstMatch || firstIndex === -1) {
      // No more matches — push the rest as plain text
      parts.push(remaining);
      break;
    }

    // Push text before the match
    if (firstIndex > 0) {
      parts.push(remaining.slice(0, firstIndex));
    }

    // Push the formatted text
    if (firstMatch === boldMatch) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {firstMatch[1]}
        </strong>
      );
    } else {
      parts.push(
        <em key={key++} className="italic">
          {firstMatch[1]}
        </em>
      );
    }

    // Continue with the rest
    remaining = remaining.slice(firstIndex + firstMatch[0].length);
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
