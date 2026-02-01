import { type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(
      JSON.stringify({ error: "N8N_WEBHOOK_URL not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Send messages to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map((m) => ({
          role: m.role,
          content: typeof m.content === "string"
            ? m.content
            : m.content.map(part =>
                part.type === "text" ? part.text : ""
              ).join(""),
        })),
        // Include the latest user message for convenience
        latestMessage: messages[messages.length - 1]?.content,
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("n8n webhook error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get response from n8n" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const n8nData = await n8nResponse.json();

    // n8n should return: { response: "..." } or { output: "..." } or { message: "..." }
    const assistantMessage =
      n8nData.response ||
      n8nData.output ||
      n8nData.message ||
      n8nData.text ||
      (typeof n8nData === "string" ? n8nData : JSON.stringify(n8nData));

    // Convert to UI Message Stream format for assistant-ui
    // This simulates a streaming response from the complete n8n response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send the message as a complete text delta
        const data = {
          type: "text-delta",
          textDelta: assistantMessage,
        };
        controller.enqueue(encoder.encode(`0:${JSON.stringify(data)}\n`));

        // Send finish message
        const finish = {
          type: "finish",
          finishReason: "stop",
        };
        controller.enqueue(encoder.encode(`0:${JSON.stringify(finish)}\n`));

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Vercel-AI-Data-Stream": "v1",
      },
    });
  } catch (error) {
    console.error("Error calling n8n webhook:", error);
    return new Response(
      JSON.stringify({ error: "Failed to connect to n8n" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
