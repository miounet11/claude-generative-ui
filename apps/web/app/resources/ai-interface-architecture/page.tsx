import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../components/json-ld";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createLocaleAlternates } from "../../../lib/locales";
import { createArticleSchema, createBreadcrumbSchema } from "../../../lib/seo";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "Designing AI Interfaces That Users Can Actually Operate",
  description:
    "A product-focused guide to deciding where generative UI belongs, where plain text is enough, and how teams should structure AI work surfaces.",
  alternates: createLocaleAlternates("/resources/ai-interface-architecture"),
  openGraph: {
    title: "Designing AI Interfaces That Users Can Actually Operate",
    description:
      "A practical framework for product teams building serious AI interfaces.",
    url: absoluteUrl("/resources/ai-interface-architecture"),
  },
};

export default function AiInterfaceArchitecturePage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          {
            name: "Designing AI Interfaces That Users Can Actually Operate",
            path: "/resources/ai-interface-architecture",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "A product-focused guide to deciding where generative UI belongs, where plain text is enough, and how teams should structure AI work surfaces.",
          keywords: [
            "AI interface architecture",
            "generative UI design",
            "AI workflow UX",
            "operational AI interfaces",
          ],
          path: "/resources/ai-interface-architecture",
          title: "Designing AI Interfaces That Users Can Actually Operate",
        })}
      />
      <SiteHeader currentPath="/resources/ai-interface-architecture" locale="en" />

      <article className="article-layout">
        <div className="eyebrow">Product article</div>
        <h1 className="article-title">Designing AI interfaces that users can actually operate</h1>
        <p className="article-lead">
          Generative UI should not replace every response. It earns its place when
          the answer needs structure, controls, or progression that plain text
          cannot deliver efficiently.
        </p>

        <div className="article-sections">
          <section className="article-section">
            <h2>Use text when the task is interpretive</h2>
            <p>
              Explanations, summaries, and recommendations often work best as text.
              A UI surface becomes useful when the next step is interaction rather
              than reading alone.
            </p>
          </section>
          <section className="article-section">
            <h2>Use generative UI when the user needs structure</h2>
            <p>
              Dashboards, planning canvases, forms, approval flows, and scenario
              comparisons benefit from explicit layout. The interface lets the user
              inspect, adjust, and act without translating prose back into work.
            </p>
          </section>
          <section className="article-section">
            <h2>Keep the mental model stable</h2>
            <p>
              A professional product should not feel like a new paradigm every time
              the model chooses a different output shape. The surrounding chrome,
              action patterns, and trust cues need to remain familiar even when the
              content itself is generated.
            </p>
          </section>
          <section className="article-section">
            <h2>Design for refinement, not just reveal</h2>
            <p>
              The best AI interfaces treat the first render as a starting point.
              Users should be able to revise the assumptions, preserve the result, or
              push the surface into the host workflow without losing context.
            </p>
          </section>
        </div>

        <div className="docs-card">
          <div className="section-kicker">Continue reading</div>
          <div className="cta-row">
            <Link className="primary-button" href="/solutions">
              Solution patterns
            </Link>
            <Link className="secondary-button" href="/demo">
              Open the demo
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="en" />
    </main>
  );
}
