import { getGeneratedSitemapPaths } from "../../lib/generated-content";
import { absoluteUrl } from "../../lib/site";

export const dynamic = "force-dynamic";

function buildSitemapUrl(path: string) {
  return `<url><loc>${absoluteUrl(path)}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>`;
}

export async function GET() {
  const lastModified = new Date().toISOString();
  const staticPaths = [
    "/",
    "/demo",
    "/docs",
    "/platform",
    "/solutions",
    "/security",
    "/resources",
    "/claude-generative-ui",
    "/zh-CN",
    "/zh-CN/demo",
    "/zh-CN/docs",
    "/zh-CN/platform",
    "/zh-CN/solutions",
    "/zh-CN/security",
    "/zh-CN/resources",
    "/zh-CN/claude-generative-ui",
    "/resources/production-generative-ui",
    "/resources/widget-rendering-security",
    "/resources/ai-interface-architecture",
    "/zh-CN/resources/production-generative-ui",
    "/zh-CN/resources/widget-rendering-security",
    "/zh-CN/resources/ai-interface-architecture",
  ];
  const generatedPaths = await getGeneratedSitemapPaths();
  const urls = [...staticPaths, ...generatedPaths]
    .map((path) => {
      return `<url>
  <loc>${absoluteUrl(path)}</loc>
  <lastmod>${lastModified}</lastmod>
</url>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
    },
  });
}
