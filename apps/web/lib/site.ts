export const siteName = "StreamCanvas";
export const siteTagline = "Professional generative UI for AI apps.";
export const siteDescription =
  "Open-source generative UI for AI apps with streamed widgets, schema-validated components, and a self-hostable reference app.";

export function getSiteUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://codeclaude.cn";

  return value.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function socialPreviewImage(): string {
  return absoluteUrl("/opengraph-image");
}
