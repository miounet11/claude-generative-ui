import { absoluteUrl } from "./site";

export const siteLocales = ["en", "zh-CN"] as const;
export const defaultSiteLocale = "en";
export const siteLocaleCookieName = "streamcanvas_locale";

export type SiteLocale = (typeof siteLocales)[number];

export function isSiteLocale(value: string): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale);
}

export function normalizePath(path = "/"): string {
  if (!path || path === "/") {
    return "/";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "") || "/";
}

export function getPathLocale(path = "/"): SiteLocale {
  const normalized = normalizePath(path);

  return normalized === "/zh-CN" || normalized.startsWith("/zh-CN/")
    ? "zh-CN"
    : defaultSiteLocale;
}

export function unlocalizedPath(path = "/"): string {
  const normalized = normalizePath(path);

  if (normalized === "/zh-CN") {
    return "/";
  }

  if (normalized.startsWith("/zh-CN/")) {
    return normalized.slice("/zh-CN".length);
  }

  return normalized;
}

export function isLocalizablePath(path = "/"): boolean {
  const normalized = unlocalizedPath(path);

  return (
    normalized === "/" ||
    normalized === "/platform" ||
    normalized === "/solutions" ||
    normalized === "/security" ||
    normalized === "/resources" ||
    normalized.startsWith("/resources/") ||
    normalized === "/docs" ||
    normalized === "/demo" ||
    normalized === "/claude-generative-ui"
  );
}

export function localizePath(locale: SiteLocale, path = "/"): string {
  const basePath = unlocalizedPath(path);

  if (locale === defaultSiteLocale) {
    return basePath;
  }

  return basePath === "/" ? `/${locale}` : `/${locale}${basePath}`;
}

export function createLocaleAlternates(path = "/") {
  const englishPath = localizePath("en", path);
  const chinesePath = localizePath("zh-CN", path);

  return {
    canonical: englishPath,
    languages: {
      en: absoluteUrl(englishPath),
      "x-default": absoluteUrl(englishPath),
      "zh-CN": absoluteUrl(chinesePath),
    },
  };
}

export function createLocalizedAlternates(locale: SiteLocale, path = "/") {
  const localizedPath = localizePath(locale, path);

  return {
    canonical: localizedPath,
    languages: createLocaleAlternates(path).languages,
  };
}

export function getLocaleLabel(locale: SiteLocale): string {
  return locale === "zh-CN" ? "简体中文" : "English";
}

export function detectLocaleFromAcceptLanguage(
  headerValue: string | null | undefined,
): SiteLocale {
  if (!headerValue) {
    return defaultSiteLocale;
  }

  const normalized = headerValue.toLowerCase();

  if (
    normalized.includes("zh-cn") ||
    normalized.includes("zh-hans") ||
    normalized.includes("zh")
  ) {
    return "zh-CN";
  }

  return defaultSiteLocale;
}

export function resolvePreferredLocale({
  acceptLanguage,
  cookieLocale,
}: {
  acceptLanguage?: string | null;
  cookieLocale?: string | null;
}): SiteLocale {
  if (cookieLocale && isSiteLocale(cookieLocale)) {
    return cookieLocale;
  }

  return detectLocaleFromAcceptLanguage(acceptLanguage);
}
