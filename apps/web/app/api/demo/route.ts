import { createDemoConversationStream } from "@streamcanvas/server";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as {
    input?: string;
    locale?: string;
  };
  const input = typeof body.input === "string" ? body.input : "Show a launch brief";
  const queryLocale = searchParams.get("locale") ?? undefined;
  const locale = typeof body.locale === "string" ? body.locale : queryLocale ?? "en";

  return new Response(createDemoConversationStream(input, { locale }), {
    headers: {
      "cache-control": "no-store",
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
