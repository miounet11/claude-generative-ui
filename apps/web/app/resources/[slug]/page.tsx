import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "../../../components/json-ld";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../lib/seo";
import { getGeneratedArticle } from "../../../lib/generated-content";
import { createLocaleAlternates } from "../../../lib/locales";
import { absoluteUrl } from "../../../lib/site";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getGeneratedArticle(slug);

  if (!article) {
    return {};
  }

  const localized = article.locales.en;

  return {
    title: localized.title,
    description: localized.description,
    alternates: createLocaleAlternates(`/resources/${slug}`),
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: absoluteUrl(`/resources/${slug}`),
    },
  };
}

export default async function GeneratedResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getGeneratedArticle(slug);

  if (!article) {
    notFound();
  }

  const localized = article.locales.en;

  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: localized.title, path: `/resources/${article.slug}` },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          datePublished: article.publishedAt,
          description: localized.description,
          keywords: localized.keywords,
          path: `/resources/${article.slug}`,
          title: localized.title,
        })}
      />
      <SiteHeader currentPath={`/resources/${article.slug}`} locale="en" />

      <article className="article-layout">
        <div className="eyebrow">{localized.heroKicker}</div>
        <h1 className="article-title">{localized.title}</h1>
        <p className="article-lead">{localized.excerpt}</p>

        <div className="article-sections">
          {localized.sections.map((section) => (
            <section className="article-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <section className="faq-grid">
          {localized.faq.map((item) => (
            <article className="faq-card" key={item.question}>
              <div className="section-kicker">FAQ</div>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </section>

        <div className="docs-card">
          <div className="section-kicker">Next step</div>
          <p className="docs-copy">
            This article is part of the StreamCanvas editorial stream: daily
            original content around production generative UI, interface
            architecture, and safe AI delivery.
          </p>
          <div className="cta-row">
            <Link className="primary-button" href={localized.cta.href}>
              {localized.cta.label}
            </Link>
            <Link className="secondary-button" href="/resources">
              Back to resources
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="en" />
    </main>
  );
}
