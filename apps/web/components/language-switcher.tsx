import Link from "next/link";

import {
  getLocaleLabel,
  localizePath,
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
            >
              {getLocaleLabel(targetLocale)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
