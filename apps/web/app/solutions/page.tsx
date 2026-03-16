import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { solutionTracks } from "../../lib/marketing";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas Solutions",
  description:
    "Use cases for StreamCanvas across SaaS copilots, operations interfaces, analytics workflows, and regulated product teams.",
  alternates: {
    canonical: "/solutions",
  },
  openGraph: {
    title: "StreamCanvas Solutions",
    description:
      "See where StreamCanvas fits in real products and how teams use generative UI beyond toy demos.",
    url: absoluteUrl("/solutions"),
  },
};

const buyerSignals = [
  "You need AI output to become an actionable surface, not just text.",
  "You want the frontend to stay in control of approvals and trusted actions.",
  "You need self-hosted deployment and predictable operational ownership.",
  "You want product, design, and engineering to share the same interaction model.",
];

export default function SolutionsPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader />

      <section className="docs-hero">
        <div className="eyebrow">Solutions</div>
        <h1 className="hero-title small">Where generative UI actually earns its place.</h1>
        <p className="hero-copy">
          StreamCanvas is built for products where the response needs to become a
          working interface: dashboards, plans, forms, operational workspaces, and
          guided decisions that users can directly act on.
        </p>
      </section>

      <section className="section-grid">
        {solutionTracks.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">Use case</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">Good fit</div>
          <div className="footer-list">
            {buyerSignals.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article className="docs-card">
          <div className="section-kicker">Example workflow</div>
          <pre className="code-panel">{`User asks for a launch view
Assistant creates message + widget
Widget streams in progressively
User clicks save / approve / refine
Host app executes trusted local tool
Conversation and UI remain in sync`}</pre>
          <div className="cta-row">
            <Link className="primary-button" href="/demo">
              See the live demo
            </Link>
            <Link className="secondary-button" href="/platform">
              Explore the platform
            </Link>
          </div>
        </article>
      </section>

      <SiteFooter />
    </main>
  );
}
