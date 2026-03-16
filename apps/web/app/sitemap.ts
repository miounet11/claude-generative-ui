import type { MetadataRoute } from "next";

import { localizePath } from "../lib/locales";
import { absoluteUrl } from "../lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = [
    { changeFrequency: "weekly" as const, path: "/", priority: 1 },
    { changeFrequency: "weekly" as const, path: "/demo", priority: 0.8 },
    { changeFrequency: "weekly" as const, path: "/docs", priority: 0.7 },
    { changeFrequency: "weekly" as const, path: "/platform", priority: 0.8 },
    { changeFrequency: "weekly" as const, path: "/solutions", priority: 0.8 },
    { changeFrequency: "weekly" as const, path: "/security", priority: 0.8 },
    { changeFrequency: "weekly" as const, path: "/resources", priority: 0.8 },
    { changeFrequency: "weekly" as const, path: "/claude-generative-ui", priority: 0.75 },
    {
      changeFrequency: "monthly" as const,
      path: "/resources/production-generative-ui",
      priority: 0.6,
    },
    {
      changeFrequency: "monthly" as const,
      path: "/resources/widget-rendering-security",
      priority: 0.6,
    },
    {
      changeFrequency: "monthly" as const,
      path: "/resources/ai-interface-architecture",
      priority: 0.6,
    },
  ];

  return routes.flatMap((route) => [
    {
      changeFrequency: route.changeFrequency,
      lastModified,
      priority: route.priority,
      url: absoluteUrl(localizePath("en", route.path)),
    },
    {
      changeFrequency: route.changeFrequency,
      lastModified,
      priority: route.priority,
      url: absoluteUrl(localizePath("zh-CN", route.path)),
    },
  ]);
}
