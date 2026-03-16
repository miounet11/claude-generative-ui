import { absoluteUrl, getSiteUrl, siteDescription, siteName, siteTagline } from "./site";

export interface FaqItem {
  answer: string;
  question: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ArticleSchemaInput {
  datePublished?: string;
  description: string;
  keywords?: string[];
  path: string;
  title: string;
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    description: siteDescription,
    logo: absoluteUrl("/icon.svg"),
    name: siteName,
    sameAs: ["https://github.com/miounet11/claude-generative-ui"],
    url: getSiteUrl(),
  };
}

export function createWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: siteDescription,
    inLanguage: "en",
    name: siteName,
    url: getSiteUrl(),
  };
}

export function createSoftwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    applicationCategory: "DeveloperApplication",
    description: siteDescription,
    name: siteName,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    operatingSystem: "Web",
    tagline: siteTagline,
    url: getSiteUrl(),
  };
}

export function createFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
      name: item.question,
    })),
  };
}

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function createArticleSchema({
  datePublished = "2026-03-16T00:00:00.000Z",
  description,
  keywords = [],
  path,
  title,
}: ArticleSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    author: {
      "@type": "Organization",
      name: siteName,
    },
    dateModified: datePublished,
    datePublished,
    description,
    headline: title,
    image: absoluteUrl("/opengraph-image"),
    keywords: keywords.join(", "),
    mainEntityOfPage: absoluteUrl(path),
    publisher: {
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/icon.svg"),
      },
      name: siteName,
    },
    url: absoluteUrl(path),
  };
}
