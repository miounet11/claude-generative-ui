import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { createLocaleAlternates } from "../../lib/locales";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas Security",
  description:
    "Security model for StreamCanvas including sandboxed rendering, host-only actions, deployment boundaries, and operational controls.",
  alternates: createLocaleAlternates("/security"),
  openGraph: {
    title: "StreamCanvas Security",
    description:
      "Understand the safety boundaries behind StreamCanvas and how the platform reduces rendering risk.",
    url: absoluteUrl("/security"),
  },
};

const controls = [
  {
    body: "HTML widgets render inside a sandboxed iframe instead of the host DOM, which limits blast radius and makes the rendering boundary explicit.",
    title: "Renderer isolation",
  },
  {
    body: "React component widgets are schema-validated before render, reducing the chance of arbitrary or malformed props reaching application code.",
    title: "Typed component mode",
  },
  {
    body: "User-triggered actions flow through registered client tools rather than arbitrary script execution in the host application.",
    title: "Trusted action path",
  },
  {
    body: "Production deployment binds the app only to localhost and exposes it publicly through nginx, preserving existing service boundaries on the server.",
    title: "Operational containment",
  },
];

export default function SecurityPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/security" locale="en" />

      <section className="docs-hero">
        <div className="eyebrow">Security</div>
        <h1 className="hero-title small">Built to reduce risk, not hide it behind a demo.</h1>
        <p className="hero-copy">
          StreamCanvas treats security as an application architecture problem. The
          platform makes the rendering boundary, action boundary, and deployment
          boundary explicit so teams can reason about real risk instead of assuming
          the browser will save them.
        </p>
      </section>

      <section className="section-grid">
        {controls.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">Control</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">Operational stance</div>
          <h2>Security decisions stay visible to the engineering team.</h2>
          <p>
            The default model is intentionally conservative: sandboxed widgets,
            explicit client tools, and self-hosted deployment behind a reverse
            proxy. Teams can loosen constraints later if they need to, but the
            starting point already reflects production concerns.
          </p>
        </div>
        <div className="docs-card">
          <div className="section-kicker">Review points</div>
          <div className="footer-list">
            <span>Sanitization strategy for streamed HTML</span>
            <span>Approval points for host actions</span>
            <span>Proxy and origin handling in production</span>
            <span>Auditability of widget-triggered operations</span>
          </div>
          <div className="cta-row">
            <Link className="primary-button" href="/docs">
              Read deployment docs
            </Link>
            <Link className="secondary-button" href="/resources/widget-rendering-security">
              Read the security article
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter locale="en" />
    </main>
  );
}
