import { createDemoConversationStream } from "@streamcanvas/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    input?: string;
  };

  return new Response(
    createDemoConversationStream(body.input ?? "Create a launch brief"),
    {
      headers: {
        "cache-control": "no-store",
        "content-type": "text/plain; charset=utf-8",
      },
    },
  );
}
