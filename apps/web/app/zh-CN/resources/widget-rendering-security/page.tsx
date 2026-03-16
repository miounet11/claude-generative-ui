import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../../components/json-ld";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../../lib/seo";
import { createLocalizedAlternates, localizePath } from "../../../../lib/locales";
import { absoluteUrl } from "../../../../lib/site";

export const metadata: Metadata = {
  title: "如何保护流式组件渲染的安全性",
  description:
    "解释生成式 UI 渲染层的主要风险，以及沙箱、Schema 校验和代理边界为什么能显著降低暴露面。",
  alternates: createLocalizedAlternates("zh-CN", "/resources/widget-rendering-security"),
  openGraph: {
    title: "如何保护流式组件渲染的安全性",
    description: "一份给中文工程团队看的生成式 UI 渲染安全实践说明。",
    url: absoluteUrl(localizePath("zh-CN", "/resources/widget-rendering-security")),
  },
};

export default function ChineseWidgetRenderingSecurityPage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首页", path: "/zh-CN" },
          { name: "资源", path: "/zh-CN/resources" },
          {
            name: "如何保护流式组件渲染的安全性",
            path: "/zh-CN/resources/widget-rendering-security",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "解释生成式 UI 渲染层的主要风险，以及沙箱、Schema 校验和代理边界为什么能显著降低暴露面。",
          keywords: [
            "组件渲染安全",
            "沙箱 iframe",
            "生成式 UI 安全",
            "流式组件",
          ],
          path: "/zh-CN/resources/widget-rendering-security",
          title: "如何保护流式组件渲染的安全性",
        })}
      />
      <SiteHeader currentPath="/resources/widget-rendering-security" locale="zh-CN" />

      <article className="article-layout">
        <div className="eyebrow">安全文章</div>
        <h1 className="article-title">如何保护流式组件渲染的安全性</h1>
        <p className="article-lead">
          在生成式 UI 产品里，最快引入风险的方式，就是把渲染层误当成一个纯前端便利特性。
          实际上，生成内容必须被隔离、校验，并受到显式宿主控制。
        </p>

        <div className="article-sections">
          <section className="article-section">
            <h2>先从隔离开始</h2>
            <p>
              如果把生成的 HTML 直接注入宿主页面，它就会共享同一个文档、同一个 JavaScript 上下文和同一套样式表面。沙箱 iframe
              能把渲染边界显式化，也更便于审查什么是可信、什么不是。
            </p>
          </section>
          <section className="article-section">
            <h2>优先使用类型化组件模式</h2>
            <p>
              不是每个结果都需要任意 HTML。当目标界面能映射到已知组件时，Schema 校验后的 React
              渲染往往更窄、更稳，也更适合长期维护。
            </p>
          </section>
          <section className="article-section">
            <h2>把宿主动作留给宿主应用</h2>
            <p>
              保存、审批、重跑或写回动作都应该由宿主应用拥有。通过注册客户端工具与审批点来承接这些动作，比让生成代码直接控制产品更容易评审和审计。
            </p>
          </section>
          <section className="article-section">
            <h2>部署同样要收口</h2>
            <p>
              即便渲染器本身设计得不错，部署松散也会破坏整体安全性。推荐把应用只绑定到 localhost，
              再交给 nginx 负责公网入口，同时把域名级改动限定在当前发布的站点里。
            </p>
          </section>
        </div>

        <div className="docs-card">
          <div className="section-kicker">继续阅读</div>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/security">
              安全总览
            </Link>
            <Link className="secondary-button" href="/zh-CN/resources/ai-interface-architecture">
              界面架构
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
