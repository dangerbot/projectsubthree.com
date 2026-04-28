import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../../lib/system-prompt";
import { PLAN_TOOLS } from "../../lib/plan-engine/tool-definition";
import { generatePlan, generatePlanOutline } from "../../lib/plan-engine/generator";
import type { PlanConfig, PhaseAdjustment } from "../../lib/plan-engine/generator";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Process a tool call from Claude and return the result.
 */
function processToolCall(
  toolName: string,
  toolInput: Record<string, unknown>
): { result: string; planData?: unknown } {
  if (toolName === "generate_training_plan") {
    const config: PlanConfig = {
      startPhaseIndex: (toolInput.startPhaseIndex as number) ?? 0,
      startWeekInPhase: (toolInput.startWeekInPhase as number) ?? 0,
      raceDate: toolInput.raceDate as string | undefined,
      phaseAdjustments: toolInput.phaseAdjustments as PhaseAdjustment[] | undefined,
    };

    const plan = generatePlan(config);
    const outline = generatePlanOutline(config);

    return {
      result: `Plan generated successfully. ${plan.totalWeeks} weeks, peak ${plan.peakMileage} mi/wk.\n\nOutline:\n${outline}`,
      planData: plan,
    };
  }

  if (toolName === "modify_training_plan") {
    // For now, return a message — full modification support comes next
    const modification = toolInput.modification as Record<string, unknown>;
    return {
      result: `Plan modification noted: ${modification.type} on phase ${modification.phaseIndex}. Reason: ${modification.reason ?? "not specified"}. Full modification support coming soon.`,
    };
  }

  return { result: `Unknown tool: ${toolName}` };
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const encoder = new TextEncoder();

    // We use a custom event protocol over the text stream:
    // Regular text is sent as-is (for streaming into chat)
    // Special events are sent as: \n__EVENT__:{json}\n
    // The frontend parses these out

    const readable = new ReadableStream({
      async start(controller) {
        try {
          // First API call — may produce text, tool calls, or both
          let currentMessages = messages.map(
            (msg: { role: string; content: string }) => ({
              role: msg.role === "companion" ? "assistant" : msg.role,
              content: msg.content,
            })
          );

          let continueLoop = true;

          while (continueLoop) {
            const response = await anthropic.messages.create({
              model: "claude-sonnet-4-6",
              max_tokens: 1024,
              system: SYSTEM_PROMPT,
              messages: currentMessages,
              tools: PLAN_TOOLS,
              stream: true,
            });

            let accumulatedText = "";
            const toolCalls: Array<{
              id: string;
              name: string;
              input: string;
            }> = [];
            let currentToolId = "";
            let currentToolName = "";
            let currentToolInput = "";
            let stopReason = "";

            for await (const event of response) {
              if (event.type === "content_block_start") {
                if (event.content_block.type === "tool_use") {
                  currentToolId = event.content_block.id;
                  currentToolName = event.content_block.name;
                  currentToolInput = "";
                }
              } else if (event.type === "content_block_delta") {
                if (event.delta.type === "text_delta") {
                  accumulatedText += event.delta.text;
                  controller.enqueue(encoder.encode(event.delta.text));
                } else if (event.delta.type === "input_json_delta") {
                  currentToolInput += event.delta.partial_json;
                }
              } else if (event.type === "content_block_stop") {
                if (currentToolId) {
                  toolCalls.push({
                    id: currentToolId,
                    name: currentToolName,
                    input: currentToolInput,
                  });
                  currentToolId = "";
                  currentToolName = "";
                  currentToolInput = "";
                }
              } else if (event.type === "message_delta") {
                stopReason = event.delta.stop_reason ?? "";
              }
            }

            // If there were tool calls, process them and continue
            if (stopReason === "tool_use" && toolCalls.length > 0) {
              // Build the assistant message with all content blocks
              const assistantContent: Array<
                | { type: "text"; text: string }
                | { type: "tool_use"; id: string; name: string; input: unknown }
              > = [];

              if (accumulatedText) {
                assistantContent.push({
                  type: "text",
                  text: accumulatedText,
                });
              }

              const toolResultMessages: Array<{
                type: "tool_result";
                tool_use_id: string;
                content: string;
              }> = [];

              for (const tc of toolCalls) {
                let parsedInput: Record<string, unknown> = {};
                try {
                  parsedInput = JSON.parse(tc.input);
                } catch {
                  parsedInput = {};
                }

                assistantContent.push({
                  type: "tool_use",
                  id: tc.id,
                  name: tc.name,
                  input: parsedInput,
                });

                const { result, planData } = processToolCall(
                  tc.name,
                  parsedInput
                );

                // Send plan data to frontend as a special event
                if (planData) {
                  const eventStr = `\n__EVENT__:${JSON.stringify({ type: "plan_generated", plan: planData })}\n`;
                  controller.enqueue(encoder.encode(eventStr));
                }

                // Signal the frontend that we're processing a tool and will continue
                const thinkingStr = `\n__EVENT__:${JSON.stringify({ type: "thinking" })}\n`;
                controller.enqueue(encoder.encode(thinkingStr));

                toolResultMessages.push({
                  type: "tool_result",
                  tool_use_id: tc.id,
                  content: result,
                });
              }

              // Add assistant message and tool results to conversation
              currentMessages = [
                ...currentMessages,
                { role: "assistant", content: assistantContent },
                { role: "user", content: toolResultMessages },
              ];

              // Reset accumulated text for the next loop iteration
              accumulatedText = "";

              // Continue the loop — Claude will respond to the tool results
            } else {
              // No more tool calls — we're done
              continueLoop = false;
            }
          }

          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Failed to get response from companion",
        detail: errorMessage,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
