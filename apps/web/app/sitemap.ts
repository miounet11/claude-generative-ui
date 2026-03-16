import type { MetadataRoute } from "next";

import { absoluteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 1,
      url: absoluteUrl("/"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: absoluteUrl("/demo"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.7,
      url: absoluteUrl("/docs"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: absoluteUrl("/platform"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: absoluteUrl("/solutions"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: absoluteUrl("/security"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.8,
      url: absoluteUrl("/resources"),
    },
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.75,
      url: absoluteUrl("/claude-generative-ui"),
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.6,
      url: absoluteUrl("/resources/production-generative-ui"),
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.6,
      url: absoluteUrl("/resources/widget-rendering-security"),
    },
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 0.6,
      url: absoluteUrl("/resources/ai-interface-architecture"),
    },
  ];
}
