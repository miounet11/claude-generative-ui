"use client";

import Link from "next/link";

import {
  getLocaleLabel,
  localizePath,
  siteLocaleCookieMaxAge,
  siteLocaleCookieName,
  siteLocales,
  type SiteLocale,
} from "../lib/locales";
import { getMarketingContent } from "../lib/marketing";

export function LanguageSwitcher({
  currentPath = "/",
  locale = "en",
}: {
  currentPath?: string;
  locale?: SiteLocale;
}) {
  const content = getMarketingContent(locale);

  function persistLocalePreference(targetLocale: SiteLocale) {
    document.cookie = `${siteLocaleCookieName}=${encodeURIComponent(targetLocale)}; Max-Age=${siteLocaleCookieMaxAge}; Path=/; SameSite=Lax`;
  }

  return (
    <div className="lang-switcher-wrap">
      <span className="lang-caption">{content.languageLabel}</span>
      <div className="lang-switcher" aria-label={content.languageLabel}>
        {siteLocales.map((targetLocale) => {
          const href = localizePath(targetLocale, currentPath);
          const isActive = targetLocale === locale;

          return (
            <Link
              aria-current={isActive ? "page" : undefined}
              className={`lang-option${isActive ? " active" : ""}`}
              href={href}
              key={targetLocale}
              onClick={() => persistLocalePreference(targetLocale)}
              prefetch={false}
            >
              {getLocaleLabel(targetLocale)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
