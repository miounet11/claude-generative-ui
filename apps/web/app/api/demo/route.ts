import { createDemoConversationStream } from "@streamcanvas/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    input?: string;
  };
  const input = typeof body.input === "string" ? body.input : "Show a launch brief";

  return new Response(createDemoConversationStream(input), {
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
