import Link from "next/link";

import { localizePath, type SiteLocale } from "../lib/locales";
import { getMarketingContent, getSiteNavigation } from "../lib/marketing";
import { LanguageSwitcher } from "./language-switcher";

export function SiteHeader({
  currentPath = "/",
  locale = "en",
}: {
  currentPath?: string;
  locale?: SiteLocale;
}) {
  const navigation = getSiteNavigation(locale);
  const content = getMarketingContent(locale);

  return (
    <header className="site-nav">
      <Link className="brand" href={localizePath(locale, "/")}>
        StreamCanvas
      </Link>
      <div className="nav-group">
        <nav className="nav-links">
          {navigation.map((item) => (
            <Link href={localizePath(locale, item.href)} key={item.href}>
              {item.label}
            </Link>
          ))}
          <a href="https://github.com/miounet11/claude-generative-ui" rel="noreferrer">
            {content.githubLabel}
          </a>
        </nav>
        <LanguageSwitcher currentPath={currentPath} locale={locale} />
      </div>
    </header>
  );
}
