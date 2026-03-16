import type { MetadataRoute } from "next";

import { absoluteUrl, getSiteUrl } from "../lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    host: getSiteUrl(),
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
