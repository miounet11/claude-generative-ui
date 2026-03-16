import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { JsonLd } from "../components/json-ld";
import { LocaleAccessStrip } from "../components/locale-access-strip";
import { SiteFooter } from "../components/site-footer";
import { SiteHeader } from "../components/site-header";
import {
  createLocaleAlternates,
  resolvePreferredLocale,
  siteLocaleCookieName,
} from "../lib/locales";
import { createFaqSchema, createSoftwareSchema } from "../lib/seo";
import { platformLayers, resourceLibrary, solutionTracks } from "../lib/marketing";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "StreamCanvas",
  description:
    "Open-source generative UI for AI apps with streamed widgets, schema-validated React components, and a self-hostable reference app.",
  alternates: createLocaleAlternates("/"),
};
const capabilities = [
  {
    body: "Tool-call streams turn into real surfaces, not screenshots or markdown hacks.",
    title: "Live widget streaming",
  },
  {
    body: "Sandboxed iframe rendering by default, plus schema-validated React components.",
    title: "Safe by default",
  },
  {
    body: "Reference app, core protocol, React SDK, and a create-app scaffold in one repo.",
    title: "App plus SDK",
  },
];

const proofPoints = [
  "NDJSON stream protocol shared by server and client",
  "Inline widget actions bridged back to the host app",
  "SVG-first charts and operational surfaces that work offline",
];

const faqItems = [
  {
    answer:
      "StreamCanvas is an open-source framework for building AI interfaces that render real widgets, dashboards, and operational surfaces while the model streams.",
    question: "What is StreamCanvas?",
  },
  {
    answer:
      "No. The default renderer uses a sandboxed iframe and sanitizes widget HTML before it ever reaches the browser surface.",
    question: "Does StreamCanvas inject raw HTML into the host page?",
  },
  {
    answer:
      "Yes. The reference app and server helpers are self-hostable, and the React package is designed to plug into your own backend if you already have one.",
    question: "Can I self-host the app and SDK?",
  },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const preferredLocale = resolvePreferredLocale({
    acceptLanguage: headerStore.get("accept-language"),
    cookieLocale: cookieStore.get(siteLocaleCookieName)?.value,
  });

  if (preferredLocale === "zh-CN") {
    redirect("/zh-CN");
  }

  return (
    <main className="shell">
      <JsonLd data={createSoftwareSchema()} />
      <JsonLd data={createFaqSchema(faqItems)} />
      <SiteHeader currentPath="/" locale="en" />

      <section className="hero">
        <div>
          <div className="eyebrow">Generative UI for production apps</div>
          <h1 className="hero-title">Interfaces that stream in with the model.</h1>
          <p className="hero-copy">
            StreamCanvas packages Claude-style generative UI into an open-source
            product teams can actually ship: safe rendering, React primitives, and
            a reference app that proves the UX before integration work begins.
          </p>
          <div className="cta-row">
            <Link className="primary-button" href="/demo">
              Open the live demo
            </Link>
            <a className="secondary-button" href="https://github.com/miounet11/claude-generative-ui">
              View the repository
            </a>
          </div>
          <div className="proof-list">
            {proofPoints.map((point) => (
              <div className="proof-pill" key={point}>
                {point}
              </div>
            ))}
          </div>
        </div>

        <aside className="preview-card">
          <div className="preview-label">Reference architecture</div>
          <div className="preview-metric-row">
            <div>
              <div className="preview-metric">4</div>
              <div className="preview-copy">Packages in the public surface</div>
            </div>
            <div>
              <div className="preview-metric">2</div>
              <div className="preview-copy">Rendering modes: sandboxed HTML and React components</div>
            </div>
          </div>
          <pre className="code-panel">{`render_widget({
  id: "launch_brief",
  title: "Quarterly launch brief",
  kind: "html",
  loadingMessages: ["Drafting brief"],
  html: "<section>...</section>"
})`}</pre>
        </aside>
      </section>

      <section className="section-grid">
        {capabilities.map((capability) => (
          <article className="section-card" key={capability.title}>
            <div className="section-kicker">Why it matters</div>
            <h2>{capability.title}</h2>
            <p>{capability.body}</p>
          </article>
        ))}
      </section>

      <section className="section-grid">
        {platformLayers.slice(0, 3).map((layer) => (
          <article className="section-card" key={layer.title}>
            <div className="section-kicker">Platform layer</div>
            <h2>{layer.title}</h2>
            <p>{layer.body}</p>
          </article>
        ))}
      </section>

      <section className="section-stack">
        <article className="section-card wide-card">
          <div className="section-kicker">Who it is for</div>
          <h2>Ship AI interfaces users can act on, not just read.</h2>
          <p>
            StreamCanvas is built for AI product teams, agent builders, analytics
            apps, and SaaS platforms that want a generative UI layer without
            depending on brittle DOM hacks. You get a landing page and demo app for
            evaluation, then reusable packages for integration.
          </p>
        </article>
      </section>

      <LocaleAccessStrip locale="en" />

      <section className="section-stack">
        <article className="section-card wide-card">
          <div className="section-kicker">Search intent</div>
          <h2>Looking for open-source Claude generative UI?</h2>
          <p>
            StreamCanvas is the production-oriented open-source answer to that
            search: a Claude-style generative UI pattern with a typed stream,
            sandboxed widget renderer, React SDK, and self-hostable reference app.
          </p>
          <Link className="text-link" href="/claude-generative-ui">
            Read the implementation guide
          </Link>
        </article>
      </section>

      <section className="section-grid">
        {solutionTracks.slice(0, 3).map((track) => (
          <article className="section-card" key={track.title}>
            <div className="section-kicker">Where it fits</div>
            <h2>{track.title}</h2>
            <p>{track.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">Built for operators, not just demos</div>
          <h2>Stream a useful answer before the widget is complete.</h2>
          <p>
            The server package emits message and widget events over a single stream.
            The React package consumes that stream, renders progressive updates, and
            routes widget actions back into the host application. The landing page,
            demo route, and SDK all use the same protocol.
          </p>
        </div>
        <div className="timeline-card">
          <div className="timeline-step">
            <span>01</span>
            <strong>Tool call plans the surface</strong>
          </div>
          <div className="timeline-step">
            <span>02</span>
            <strong>Server streams message and widget frames</strong>
          </div>
          <div className="timeline-step">
            <span>03</span>
            <strong>Sandboxed renderer posts structured events back</strong>
          </div>
        </div>
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

      <section className="faq-grid">
        {faqItems.map((item) => (
          <article className="faq-card" key={item.question}>
            <div className="section-kicker">FAQ</div>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="launch-strip">
        <div>
          <div className="eyebrow">Ship fast, extend later</div>
          <h2>Start with the app. Graduate to the SDK.</h2>
        </div>
        <Link className="primary-button" href="/demo">
          Explore the demo workspace
        </Link>
      </section>

      <SiteFooter locale="en" />
    </main>
  );
}
