import Link from "next/link";

import { resourceLibrary, siteNavigation, trustPillars } from "../lib/marketing";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-card">
          <div className="section-kicker">StreamCanvas</div>
          <h2>Professional generative UI, built for shipping.</h2>
          <p>
            StreamCanvas combines a reference application, typed protocol, React
            SDK, and safe deployment model so teams can move from demo to product
            without changing the core interaction model.
          </p>
        </div>

        <div className="footer-card">
          <div className="section-kicker">Explore</div>
          <div className="footer-list">
            {siteNavigation.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="footer-card">
          <div className="section-kicker">Trust</div>
          <div className="footer-list">
            {trustPillars.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="footer-card">
          <div className="section-kicker">Resources</div>
          <div className="footer-list">
            {resourceLibrary.map((item) => (
              <Link href={item.href} key={item.href}>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
