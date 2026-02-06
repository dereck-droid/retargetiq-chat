export const maxDuration = 60;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const response = await fetch(
    "https://server.advancedleadsolutions.com/webhook/retargetiq-chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Failed to get response from assistant" },
      { status: 500 }
    );
  }

  const data = await response.json();
  return Response.json({ response: data.output || data.response || data });
}
