import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { resourceLibrary } from "../../lib/marketing";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas Resources",
  description:
    "Professional articles and reference material on production generative UI, rendering security, and AI interface architecture.",
  alternates: {
    canonical: "/resources",
  },
  openGraph: {
    title: "StreamCanvas Resources",
    description:
      "Read detailed guides on platform architecture, widget rendering, and AI interface design.",
    url: absoluteUrl("/resources"),
  },
};

export default function ResourcesPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader />

      <section className="docs-hero">
        <div className="eyebrow">Resources</div>
        <h1 className="hero-title small">Professional content for teams building serious AI interfaces.</h1>
        <p className="hero-copy">
          This library explains how to move from visual demos to operational
          generative UI: architecture, safety, user experience, and production
          delivery.
        </p>
      </section>

      <section className="resource-grid">
        {resourceLibrary.map((item) => (
          <article className="resource-card" key={item.href}>
            <div className="resource-meta">
              <span>{item.category}</span>
              <span>{item.readTime}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link className="text-link" href={item.href}>
              Read article
            </Link>
          </article>
        ))}
      </section>

      <SiteFooter />
    </main>
  );
}
