import Link from "next/link";

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

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  description:
    "Open-source generative UI for AI apps with streamed widgets, schema-validated React components, and a self-hostable reference app.",
  name: "StreamCanvas",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  operatingSystem: "Web",
  url: "https://codeclaude.cn",
};

export default function HomePage() {
  return (
    <main className="shell">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
        type="application/ld+json"
      />
      <header className="site-nav">
        <Link className="brand" href="/">
          StreamCanvas
        </Link>
        <nav className="nav-links">
          <Link href="/demo">Demo</Link>
          <a href="https://github.com/miounet11/claude-generative-ui" rel="noreferrer">
            GitHub
          </a>
        </nav>
      </header>

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
    </main>
  );
}
