import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "../../../../components/json-ld";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../../lib/seo";
import { getGeneratedArticle } from "../../../../lib/generated-content";
import { createLocalizedAlternates, localizePath } from "../../../../lib/locales";
import { absoluteUrl } from "../../../../lib/site";

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

  const localized = article.locales["zh-CN"];

  return {
    title: localized.title,
    description: localized.description,
    alternates: createLocalizedAlternates("zh-CN", `/resources/${slug}`),
    openGraph: {
      title: localized.title,
      description: localized.description,
      url: absoluteUrl(localizePath("zh-CN", `/resources/${slug}`)),
    },
  };
}

export default async function ChineseGeneratedResourcePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const article = await getGeneratedArticle(slug);

  if (!article) {
    notFound();
  }

  const localized = article.locales["zh-CN"];

  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首页", path: "/zh-CN" },
          { name: "资源", path: "/zh-CN/resources" },
          { name: localized.title, path: `/zh-CN/resources/${article.slug}` },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          datePublished: article.publishedAt,
          description: localized.description,
          keywords: localized.keywords,
          path: `/zh-CN/resources/${article.slug}`,
          title: localized.title,
        })}
      />
      <SiteHeader currentPath={`/resources/${article.slug}`} locale="zh-CN" />

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
          <div className="section-kicker">下一步</div>
          <p className="docs-copy">
            这篇文章属于 StreamCanvas 的持续内容流，每天围绕生产级生成式 UI、界面架构与安全交付补充原创内容。
          </p>
          <div className="cta-row">
            <Link className="primary-button" href={localized.cta.href}>
              {localized.cta.label}
            </Link>
            <Link className="secondary-button" href="/zh-CN/resources">
              返回资源中心
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
