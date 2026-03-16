import Link from "next/link";

import { localizePath, type SiteLocale } from "../lib/locales";

const copy = {
  en: {
    body:
      "StreamCanvas is fully available in English and Simplified Chinese. The site remembers your language choice and can route first-time Chinese visitors directly into the Chinese experience.",
    kicker: "Language access",
    primaryCta: "Open the Chinese version",
    secondaryCta: "Read the English docs",
    title: "Bilingual by default, ready for global evaluation.",
  },
  "zh-CN": {
    body:
      "StreamCanvas 目前完整支持 English 和简体中文。站点会记住你的语言选择，并可在首次访问时把中文用户直接引导到中文版本。",
    kicker: "语言访问",
    primaryCta: "切换到 English",
    secondaryCta: "阅读中文文档",
    title: "默认支持中英文，方便全球团队评估。",
  },
} satisfies Record<
  SiteLocale,
  {
    body: string;
    kicker: string;
    primaryCta: string;
    secondaryCta: string;
    title: string;
  }
>;

export function LocaleAccessStrip({ locale }: { locale: SiteLocale }) {
  const content = copy[locale];

  return (
    <section className="section-stack locale-access-strip">
      <article className="section-card wide-card">
        <div className="section-kicker">{content.kicker}</div>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <div className="cta-row">
          <Link
            className="secondary-button"
            href={locale === "en" ? "/zh-CN" : "/"}
          >
            {content.primaryCta}
          </Link>
          <Link className="text-link" href={localizePath(locale, "/docs")}>
            {content.secondaryCta}
          </Link>
        </div>
      </article>
    </section>
  );
}
