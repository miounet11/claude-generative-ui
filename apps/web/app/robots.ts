import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    host: "https://codeclaude.cn",
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: "https://codeclaude.cn/sitemap.xml",
  };
}
