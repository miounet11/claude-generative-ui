import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { getResourceLibrary } from "../../../lib/marketing";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 中文资源",
  description:
    "面向中文团队的生成式 UI 文章与参考资料，覆盖架构、安全、产品设计与部署交付。",
  alternates: createLocalizedAlternates("zh-CN", "/resources"),
  openGraph: {
    title: "StreamCanvas 中文资源",
    description: "阅读关于生成式 UI 架构、安全与产品设计的中文长文。",
    url: absoluteUrl(localizePath("zh-CN", "/resources")),
  },
};

export default function ChineseResourcesPage() {
  const resourceLibrary = getResourceLibrary("zh-CN");

  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/resources" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">资源</div>
        <h1 className="hero-title small">给认真做 AI 界面的团队准备的中文内容。</h1>
        <p className="hero-copy">
          这个内容库帮助团队从“视觉演示”过渡到“可上线的生成式 UI 产品”：包括架构、安全、用户体验与生产交付。
        </p>
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
            <Link className="text-link" href={localizePath("zh-CN", item.href)}>
              阅读文章
            </Link>
          </article>
        ))}
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
