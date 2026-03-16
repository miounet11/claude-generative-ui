import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { createLocaleAlternates } from "../../lib/locales";
import { absoluteUrl } from "../../lib/site";
import { platformLayers, trustPillars } from "../../lib/marketing";

export const metadata: Metadata = {
  title: "StreamCanvas Platform",
  description:
    "Architecture, deployment model, rendering system, and application layers for the StreamCanvas generative UI platform.",
  alternates: createLocaleAlternates("/platform"),
  openGraph: {
    title: "StreamCanvas Platform",
    description:
      "Explore the platform layers behind StreamCanvas, from the event stream to deployment and safety controls.",
    url: absoluteUrl("/platform"),
  },
};

export default function PlatformPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/platform" locale="en" />

      <section className="docs-hero">
        <div className="eyebrow">Platform</div>
        <h1 className="hero-title small">A complete stack for streamed AI interfaces.</h1>
        <p className="hero-copy">
          StreamCanvas is not just a visual demo. It is a delivery model for
          interactive AI experiences with typed streams, safe rendering, component
          registration, and self-hosted operational control.
        </p>
      </section>

      <section className="section-grid">
        {platformLayers.map((layer) => (
          <article className="section-card" key={layer.title}>
            <div className="section-kicker">Layer</div>
            <h2>{layer.title}</h2>
            <p>{layer.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">Why teams use it</div>
          <h2>Keep the interaction model stable while the implementation matures.</h2>
          <p>
            Teams usually start with a high-visibility demo, then discover they need
            approvals, persistence, local actions, and deployment discipline. The
            platform exists so those requirements can be added without abandoning the
            user experience that made the product valuable in the first place.
          </p>
        </div>
        <div className="timeline-card">
          {trustPillars.map((item, index) => (
            <div className="timeline-step" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">Deployment modes</div>
          <pre className="code-panel">{`Local development
- pnpm dev

Production deployment
- Next.js standalone runtime
- systemd service
- nginx reverse proxy
- localhost-only app port`}</pre>
        </article>

        <article className="docs-card">
          <div className="section-kicker">Next step</div>
          <p className="docs-copy">
            Review the operational pages that explain deployment, security, and how
            teams apply the platform to customer-facing AI experiences.
          </p>
          <div className="cta-row">
            <Link className="primary-button" href="/security">
              Review security model
            </Link>
            <Link className="secondary-button" href="/resources">
              Read the resources
            </Link>
          </div>
        </article>
      </section>

      <SiteFooter locale="en" />
    </main>
  );
}
