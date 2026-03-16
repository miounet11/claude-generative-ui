import Link from "next/link";

import type { SiteLocale } from "../lib/locales";
import { getGeneratedArticleCards } from "../lib/generated-content";

export async function GeneratedResourceSection({
  emptyMessage,
  kicker,
  heading,
  intro,
  locale,
  readLabel,
}: {
  emptyMessage?: string;
  kicker: string;
  heading: string;
  intro: string;
  locale: SiteLocale;
  readLabel: string;
}) {
  const items = await getGeneratedArticleCards(locale);

  if (items.length === 0) {
    return emptyMessage ? (
      <section className="section-stack">
        <article className="section-card wide-card">
          <div className="section-kicker">{kicker}</div>
          <h2>{heading}</h2>
          <p>{emptyMessage}</p>
        </article>
      </section>
    ) : null;
  }

  return (
    <section className="section-stack">
      <article className="section-card wide-card">
        <div className="section-kicker">{kicker}</div>
        <h2>{heading}</h2>
        <p>{intro}</p>
      </article>

      <div className="resource-grid">
        {items.map((item) => (
          <article className="resource-card" key={item.slug}>
            <div className="resource-meta">
              <span>{item.category}</span>
              <span>{item.readTime}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <Link className="text-link" href={item.href}>
              {readLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
