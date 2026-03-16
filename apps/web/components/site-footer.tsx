import Link from "next/link";

import { localizePath, type SiteLocale } from "../lib/locales";
import {
  getMarketingContent,
  getResourceLibrary,
  getSiteNavigation,
  getTrustPillars,
} from "../lib/marketing";

export function SiteFooter({ locale = "en" }: { locale?: SiteLocale }) {
  const content = getMarketingContent(locale);
  const navigation = getSiteNavigation(locale);
  const resources = getResourceLibrary(locale);
  const pillars = getTrustPillars(locale);

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-card">
          <div className="section-kicker">StreamCanvas</div>
          <h2>{content.footerTagline}</h2>
          <p>{content.footerDescription}</p>
        </div>

        <div className="footer-card">
          <div className="section-kicker">{content.footerExploreLabel}</div>
          <div className="footer-list">
            {navigation.map((item) => (
              <Link href={localizePath(locale, item.href)} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-card">
          <div className="section-kicker">{content.footerTrustLabel}</div>
          <div className="footer-list">
            {pillars.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="footer-card">
          <div className="section-kicker">{content.footerResourcesLabel}</div>
          <div className="footer-list">
            {resources.map((item) => (
              <Link href={localizePath(locale, item.href)} key={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
