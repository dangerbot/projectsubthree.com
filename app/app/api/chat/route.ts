import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "../../lib/system-prompt";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("API Key present:", !!process.env.ANTHROPIC_API_KEY);
    console.log("Messages count:", messages.length);

    // Create a streaming response from Claude
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "companion" ? "assistant" : msg.role,
        content: msg.content,
      })),
    });

    // Convert the Anthropic stream into a ReadableStream for the browser
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
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
