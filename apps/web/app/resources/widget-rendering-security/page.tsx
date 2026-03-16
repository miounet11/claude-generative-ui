import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../components/json-ld";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../lib/seo";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "How To Secure Streamed Widget Rendering",
  description:
    "A practical explanation of the rendering risks in generative UI and how sandboxing, validation, and proxy boundaries reduce exposure.",
  alternates: {
    canonical: "/resources/widget-rendering-security",
  },
  openGraph: {
    title: "How To Secure Streamed Widget Rendering",
    description:
      "A pragmatic guide to rendering safety for production generative UI systems.",
    url: absoluteUrl("/resources/widget-rendering-security"),
  },
};

export default function WidgetRenderingSecurityPage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          {
            name: "How To Secure Streamed Widget Rendering",
            path: "/resources/widget-rendering-security",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "A practical explanation of the rendering risks in generative UI and how sandboxing, validation, and proxy boundaries reduce exposure.",
          keywords: [
            "widget rendering security",
            "sandboxed iframe",
            "generative UI security",
            "streamed widgets",
          ],
          path: "/resources/widget-rendering-security",
          title: "How To Secure Streamed Widget Rendering",
        })}
      />
      <SiteHeader />

      <article className="article-layout">
        <div className="eyebrow">Security article</div>
        <h1 className="article-title">How to secure streamed widget rendering</h1>
        <p className="article-lead">
          The fastest way to create risk in a generative UI product is to treat the
          rendered surface as a front-end convenience instead of a trust boundary.
          Generated content needs isolation, validation, and explicit host controls.
        </p>

        <div className="article-sections">
          <section className="article-section">
            <h2>Start with isolation</h2>
            <p>
              If generated HTML is injected directly into the host page, it shares
              the same document, JavaScript context, and styling surface as the rest
              of the application. Sandboxed iframes keep the rendering layer explicit
              and make it much easier to reason about what is and is not trusted.
            </p>
          </section>
          <section className="article-section">
            <h2>Prefer typed component mode where possible</h2>
            <p>
              Not every result needs arbitrary HTML. When the target surface maps
              well to known components, schema-validated React rendering makes the
              contract narrower and often easier to maintain over time.
            </p>
          </section>
          <section className="article-section">
            <h2>Keep host actions explicit</h2>
            <p>
              Save, approve, rerun, and mutate actions should remain owned by the
              host application. Registered client tools and approval gates are easier
              to review than a loose bridge from generated code into the product.
            </p>
          </section>
          <section className="article-section">
            <h2>Contain the deployment</h2>
            <p>
              Even a safe renderer can be undermined by a sloppy deployment. Bind the
              application to localhost, let nginx expose the public edge, and keep
              site-specific changes limited to the domain that is being rolled out.
            </p>
          </section>
        </div>

        <div className="docs-card">
          <div className="section-kicker">Continue reading</div>
          <div className="cta-row">
            <Link className="primary-button" href="/security">
              Security overview
            </Link>
            <Link className="secondary-button" href="/resources/ai-interface-architecture">
              Interface architecture
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter />
    </main>
  );
}
