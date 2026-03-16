import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../components/json-ld";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../lib/seo";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "What Production Generative UI Actually Needs",
  description:
    "A practical guide to the systems, controls, and product layers required for a production-grade generative UI platform.",
  alternates: {
    canonical: "/resources/production-generative-ui",
  },
  openGraph: {
    title: "What Production Generative UI Actually Needs",
    description:
      "From the stream protocol to deployment and approval paths, here is what separates a product from a demo.",
    url: absoluteUrl("/resources/production-generative-ui"),
  },
};

const sections = [
  {
    body: "A production system needs more than a model that can emit HTML. It needs a stable event contract so the backend, frontend, and any intermediate workers understand when a message starts, how a widget is created, how partial frames arrive, and how the result is marked complete or failed.",
    title: "1. A stable stream contract",
  },
  {
    body: "Rendering is not a cosmetic detail. If the output can execute inside the host page, you have effectively collapsed the trust boundary between generated content and application logic. Teams that ship safely either isolate the render target or use a typed component path when they need richer host integration.",
    title: "2. A clear rendering boundary",
  },
  {
    body: "Users eventually want to do something with the generated surface: save a plan, open a record, approve a change, rerun a scenario, or write data back into the product. Those actions need a deliberate bridge. Production systems register trusted tools and keep application authority on the host side.",
    title: "3. A trusted action path",
  },
  {
    body: "Operational quality matters as much as UI quality. Teams need health checks, restart behavior, reverse proxy configuration, local-only application ports, and a deployment path that can coexist with other services on the same host. Otherwise the first infrastructure constraint becomes the reason the feature stalls.",
    title: "4. An operating model",
  },
];

export default function ProductionGenerativeUiPage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          {
            name: "What Production Generative UI Actually Needs",
            path: "/resources/production-generative-ui",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "A practical guide to the systems, controls, and product layers required for a production-grade generative UI platform.",
          keywords: [
            "production generative UI",
            "AI interface architecture",
            "streamed widgets",
            "generative UI platform",
          ],
          path: "/resources/production-generative-ui",
          title: "What Production Generative UI Actually Needs",
        })}
      />
      <SiteHeader />

      <article className="article-layout">
        <div className="eyebrow">Architecture article</div>
        <h1 className="article-title">What production generative UI actually needs</h1>
        <p className="article-lead">
          Most teams start by asking whether a model can render a live widget. The
          more important question is whether the product can keep that interface
          stable, safe, and operable once real users and real infrastructure are
          involved.
        </p>

        <div className="article-sections">
          {sections.map((section) => (
            <section className="article-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <div className="docs-card">
          <div className="section-kicker">Continue reading</div>
          <div className="cta-row">
            <Link className="primary-button" href="/resources/widget-rendering-security">
              Rendering security
            </Link>
            <Link className="secondary-button" href="/platform">
              Platform overview
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
