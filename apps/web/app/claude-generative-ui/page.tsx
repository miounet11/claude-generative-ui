import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../components/json-ld";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { createLocaleAlternates } from "../../lib/locales";
import { createBreadcrumbSchema, createFaqSchema } from "../../lib/seo";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "Open-Source Claude Generative UI",
  description:
    "A self-hostable, production-oriented take on Claude-style generative UI with streamed widgets, React components, and safe rendering boundaries.",
  alternates: createLocaleAlternates("/claude-generative-ui"),
  openGraph: {
    title: "Open-Source Claude Generative UI",
    description:
      "Understand how StreamCanvas turns the Claude generative UI pattern into an open-source product teams can actually ship.",
    url: absoluteUrl("/claude-generative-ui"),
  },
};

const evaluationFaq = [
  {
    answer:
      "No. StreamCanvas borrows the useful interaction pattern but implements its own open-source protocol, renderer, SDK, and deployment model.",
    question: "Is StreamCanvas trying to clone Claude?",
  },
  {
    answer:
      "Because the exact search intent is often about reproducing the interaction model safely. StreamCanvas packages that pattern into something teams can evaluate, extend, and self-host.",
    question: "Why target the Claude generative UI term directly?",
  },
  {
    answer:
      "Use the live demo first, then review the platform and security pages, and finally wire the React package into your own backend or use the reference server helpers.",
    question: "What is the fastest evaluation path?",
  },
];

const comparisonPoints = [
  {
    body: "Most people searching for open-source Claude generative UI want the interaction pattern, not a pixel-perfect copy. They need a response stream, widget rendering, safe callbacks, and a path to production.",
    title: "What teams are really looking for",
  },
  {
    body: "The risky shortcut is dumping generated HTML into the host page. That can make the demo feel fast, but it also collapses the safety boundary between model output and application logic.",
    title: "What usually goes wrong",
  },
  {
    body: "StreamCanvas packages the hard parts together: NDJSON events, a sandboxed renderer, schema-validated React components, host-controlled tools, and a self-hostable app shell.",
    title: "What StreamCanvas ships today",
  },
];

export default function ClaudeGenerativeUiPage() {
  return (
    <main className="shell docs-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Open-Source Claude Generative UI", path: "/claude-generative-ui" },
        ])}
      />
      <JsonLd data={createFaqSchema(evaluationFaq)} />
      <SiteHeader currentPath="/claude-generative-ui" locale="en" />

      <section className="docs-hero">
        <div className="eyebrow">Intent guide</div>
        <h1 className="hero-title small">Open-source Claude generative UI, made practical.</h1>
        <p className="hero-copy">
          The public conversation often starts with Claude-style generative UI.
          StreamCanvas turns that interest into a usable open-source product:
          streamed widgets, typed component payloads, explicit host actions, and a
          deployment model that fits on a real server.
        </p>
        <div className="cta-row">
          <Link className="primary-button" href="/demo">
            Open the demo
          </Link>
          <Link className="secondary-button" href="/docs">
            Read the docs
          </Link>
        </div>
      </section>

      <section className="section-grid">
        {comparisonPoints.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">Signal</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">Why this page exists</div>
          <h2>Search intent and production reality usually diverge.</h2>
          <p>
            Users may search for Claude generative UI because they saw a compelling
            interaction. Engineering teams, however, need much more than a visual
            imitation. They need streaming semantics, rendering controls, trust
            boundaries, and a way to hand the feature to operations without
            creating a new class of deployment risk.
          </p>
        </div>
        <div className="docs-card">
          <div className="section-kicker">What you get</div>
          <div className="footer-list">
            <span>NDJSON protocol shared by client and server</span>
            <span>Sandboxed HTML widget mode</span>
            <span>Schema-validated React component mode</span>
            <span>Trusted host actions through registered client tools</span>
            <span>Standalone deployment behind nginx on localhost-only ports</span>
          </div>
        </div>
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">Evaluation path</div>
          <pre className="code-panel">{`pnpm install
pnpm dev

# then validate:
- /demo
- /platform
- /security
- /docs`}</pre>
          <p className="docs-copy">
            This route exists for discovery. The actual evaluation path is still
            the product itself, its protocol, and the deployment model behind it.
          </p>
        </article>

        <article className="docs-card">
          <div className="section-kicker">Continue from here</div>
          <div className="cta-row">
            <Link className="primary-button" href="/platform">
              Platform overview
            </Link>
            <Link className="secondary-button" href="/security">
              Security model
            </Link>
          </div>
          <Link className="text-link" href="https://github.com/miounet11/claude-generative-ui">
            View the GitHub repository
          </Link>
        </article>
      </section>

      <section className="faq-grid">
        {evaluationFaq.map((item) => (
          <article className="faq-card" key={item.question}>
            <div className="section-kicker">FAQ</div>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <SiteFooter locale="en" />
    </main>
  );
}
