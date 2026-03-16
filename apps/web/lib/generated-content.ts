import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { SiteLocale } from "./locales";
import { localizePath } from "./locales";

export interface GeneratedFaqItem {
  answer: string;
  question: string;
}

export interface GeneratedArticleSection {
  body: string;
  title: string;
}

export interface GeneratedArticleLocaleContent {
  category: string;
  cta: {
    href: string;
    label: string;
  };
  description: string;
  excerpt: string;
  faq: GeneratedFaqItem[];
  heroKicker: string;
  keywords: string[];
  readTime: string;
  sections: GeneratedArticleSection[];
  title: string;
}

export interface GeneratedArticle {
  cluster: string;
  primaryKeyword: string;
  publishedAt: string;
  slug: string;
  tags: string[];
  updatedAt: string;
  locales: Record<SiteLocale, GeneratedArticleLocaleContent>;
}

export interface GeneratedArticleCard {
  category: string;
  description: string;
  href: string;
  publishedAt: string;
  readTime: string;
  slug: string;
  title: string;
}

const GENERATED_CONTENT_DIR = process.env.STREAMCANVAS_CONTENT_DIR;

function getCandidateDirectories() {
  return [
    GENERATED_CONTENT_DIR,
    path.join(process.cwd(), "content/generated"),
    path.join(process.cwd(), "apps/web/content/generated"),
  ].filter((value): value is string => Boolean(value));
}

async function resolveGeneratedContentDirectory() {
  for (const candidate of getCandidateDirectories()) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
}

function isGeneratedArticle(value: unknown): value is GeneratedArticle {
  if (!value || typeof value !== "object") {
    return false;
  }

  const article = value as Partial<GeneratedArticle>;

  return (
    typeof article.slug === "string" &&
    typeof article.primaryKeyword === "string" &&
    typeof article.publishedAt === "string" &&
    typeof article.updatedAt === "string" &&
    Array.isArray(article.tags) &&
    Boolean(article.locales?.en?.title) &&
    Boolean(article.locales?.["zh-CN"]?.title)
  );
}

async function readGeneratedArticle(filePath: string) {
  try {
    const content = await readFile(filePath, "utf8");
    const parsed = JSON.parse(content) as unknown;

    if (!isGeneratedArticle(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getGeneratedArticles() {
  const directory = await resolveGeneratedContentDirectory();

  if (!directory) {
    return [] as GeneratedArticle[];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(directory, entry.name));

  const articles = await Promise.all(files.map(readGeneratedArticle));

  return articles
    .filter((article): article is GeneratedArticle => article !== null)
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export async function getGeneratedArticle(slug: string) {
  const articles = await getGeneratedArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getGeneratedArticleCards(
  locale: SiteLocale,
  limit?: number,
) {
  const cards = (await getGeneratedArticles()).map((article) => {
    const localized = article.locales[locale];

    return {
      category: localized.category,
      description: localized.description,
      href: localizePath(locale, `/resources/${article.slug}`),
      publishedAt: article.publishedAt,
      readTime: localized.readTime,
      slug: article.slug,
      title: localized.title,
    } satisfies GeneratedArticleCard;
  });

  return typeof limit === "number" ? cards.slice(0, limit) : cards;
}

export async function getGeneratedSitemapPaths() {
  return (await getGeneratedArticles()).flatMap((article) => [
    localizePath("en", `/resources/${article.slug}`),
    localizePath("zh-CN", `/resources/${article.slug}`),
  ]);
}
