export async function POST(req: Request) {
  const body = await req.json();
  const messages = body.messages || [];

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    return new Response(
      JSON.stringify({ error: "N8N_WEBHOOK_URL not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Helper to extract text content from a message
  const getMessageContent = (msg: unknown): string => {
    if (!msg || typeof msg !== "object") return "";
    const m = msg as Record<string, unknown>;

    // Handle string content directly
    if (typeof m.content === "string") return m.content;

    // Handle parts array (AI SDK v6 format)
    if (Array.isArray(m.parts)) {
      return m.parts
        .map((part: unknown) => {
          if (typeof part === "string") return part;
          if (part && typeof part === "object") {
            const p = part as Record<string, unknown>;
            if (p.type === "text" && typeof p.text === "string") return p.text;
          }
          return "";
        })
        .join("");
    }

    // Handle content array
    if (Array.isArray(m.content)) {
      return m.content
        .map((part: unknown) => {
          if (typeof part === "string") return part;
          if (part && typeof part === "object") {
            const p = part as Record<string, unknown>;
            if (p.type === "text" && typeof p.text === "string") return p.text;
          }
          return "";
        })
        .join("");
    }

    return "";
  };

  try {
    // Format messages for n8n
    const formattedMessages = messages.map((m: unknown) => {
      const msg = m as Record<string, unknown>;
      return {
        role: msg.role || "user",
        content: getMessageContent(m),
      };
    });

    const latestMessage = formattedMessages[formattedMessages.length - 1];

    // Send messages to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: formattedMessages,
        latestMessage: latestMessage?.content || "",
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

    // Try to parse JSON, with fallback for text responses
    let n8nData;
    const responseText = await n8nResponse.text();

    try {
      n8nData = JSON.parse(responseText);
    } catch {
      // If not JSON, use the raw text
      n8nData = { response: responseText };
    }

    console.log("n8n response:", JSON.stringify(n8nData));

    // n8n should return: { response: "..." } or { output: "..." } or { message: "..." }
    let assistantMessage =
      n8nData.response ||
      n8nData.output ||
      n8nData.message ||
      n8nData.text ||
      n8nData.content ||
      "";

    // If still empty, stringify the entire response for debugging
    if (!assistantMessage && n8nData) {
      assistantMessage = typeof n8nData === "string" ? n8nData : `Received: ${JSON.stringify(n8nData)}`;
    }

    if (!assistantMessage) {
      assistantMessage = "Sorry, I didn't receive a response. Please try again.";
    }

    // Convert to AI SDK data stream format for assistant-ui
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send text content (0: prefix for text chunks)
        controller.enqueue(encoder.encode(`0:${JSON.stringify(assistantMessage)}\n`));

        // Send finish message (d: prefix for data/finish)
        controller.enqueue(
          encoder.encode(`d:${JSON.stringify({ finishReason: "stop" })}\n`)
        );

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
