import type { Metadata } from "next";
import Link from "next/link";

import { GeneratedResourceSection } from "../../components/generated-resource-section";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { createLocaleAlternates } from "../../lib/locales";
import { resourceLibrary } from "../../lib/marketing";
import { absoluteUrl } from "../../lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StreamCanvas Resources",
  description:
    "Professional articles and reference material on production generative UI, rendering security, and AI interface architecture.",
  alternates: createLocaleAlternates("/resources"),
  openGraph: {
    title: "StreamCanvas Resources",
    description:
      "Read detailed guides on platform architecture, widget rendering, and AI interface design.",
    url: absoluteUrl("/resources"),
  },
};

export default async function ResourcesPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/resources" locale="en" />

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

      <GeneratedResourceSection
        emptyMessage="The automated editorial stream will appear here as soon as the first daily articles are published."
        kicker="Daily publishing"
        heading="Daily generated editorial stream"
        intro="These articles are produced by an internal content pipeline focused on production generative UI, AI interface architecture, self-hosted delivery, and safe rendering. The goal is breadth without drifting into spam or unsafe topics."
        locale="en"
        readLabel="Read article"
      />

      <SiteFooter locale="en" />
    </main>
  );
}
