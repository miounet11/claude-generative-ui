import { getGeneratedArticles } from "../../lib/generated-content";
import { absoluteUrl } from "../../lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const articles = await getGeneratedArticles();

  const items = articles
    .slice(0, 50)
    .map((article) => {
      const localized = article.locales.en;

      return `<item>
  <title>${escapeXml(localized.title)}</title>
  <link>${absoluteUrl(`/resources/${article.slug}`)}</link>
  <guid>${absoluteUrl(`/resources/${article.slug}`)}</guid>
  <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
  <description>${escapeXml(localized.description)}</description>
</item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>StreamCanvas Editorial Feed</title>
  <link>${absoluteUrl("/")}</link>
  <description>Daily original articles on production generative UI, AI interface architecture, and safe deployment patterns.</description>
  ${items}
</channel>
</rss>`;

  return new Response(body, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
    },
  });
}
