import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../../components/json-ld";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../../lib/seo";
import { createLocalizedAlternates, localizePath } from "../../../../lib/locales";
import { absoluteUrl } from "../../../../lib/site";

export const metadata: Metadata = {
  title: "生产级生成式 UI 真正需要什么",
  description:
    "一份面向中文团队的实践指南，解释生产级生成式 UI 在协议、渲染、安全与运维层面真正需要哪些能力。",
  alternates: createLocalizedAlternates("zh-CN", "/resources/production-generative-ui"),
  openGraph: {
    title: "生产级生成式 UI 真正需要什么",
    description: "从流式协议到部署模型，解释什么让一个演示变成真正能交付的产品。",
    url: absoluteUrl(localizePath("zh-CN", "/resources/production-generative-ui")),
  },
};

const sections = [
  {
    body: "生产系统不只是需要一个会吐出 HTML 的模型，还需要一份稳定的事件契约，让后端、前端与中间层都知道消息何时开始、组件何时创建、增量帧如何到达，以及结果何时完成或失败。",
    title: "1. 一份稳定的流式契约",
  },
  {
    body: "渲染不是视觉细节，而是信任边界。如果输出可以在宿主页面里直接执行，就等于把生成内容和业务逻辑放进了同一个安全域。更稳妥的系统会隔离渲染层，或者在需要深度集成时走类型化组件路径。",
    title: "2. 一条清晰的渲染边界",
  },
  {
    body: "用户最终总会想对界面做点什么：保存计划、打开记录、审批、重跑情景或把数据写回产品。生产系统必须显式提供一条可信动作路径，由宿主应用掌握权限与执行权。",
    title: "3. 一条可信的动作通道",
  },
  {
    body: "运维质量和 UI 质量同样重要。团队需要健康检查、重启策略、反向代理配置、只绑定本地端口的服务，以及一条能与同机其他系统共存的部署路线，否则基础设施限制很快就会变成产品推进的阻力。",
    title: "4. 一套可运营的交付模型",
  },
];

export default function ChineseProductionGenerativeUiPage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首页", path: "/zh-CN" },
          { name: "资源", path: "/zh-CN/resources" },
          {
            name: "生产级生成式 UI 真正需要什么",
            path: "/zh-CN/resources/production-generative-ui",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "一份面向中文团队的实践指南，解释生产级生成式 UI 在协议、渲染、安全与运维层面真正需要哪些能力。",
          keywords: [
            "生产级生成式 UI",
            "AI 界面架构",
            "流式组件",
            "生成式 UI 平台",
          ],
          path: "/zh-CN/resources/production-generative-ui",
          title: "生产级生成式 UI 真正需要什么",
        })}
      />
      <SiteHeader currentPath="/resources/production-generative-ui" locale="zh-CN" />

      <article className="article-layout">
        <div className="eyebrow">架构文章</div>
        <h1 className="article-title">生产级生成式 UI 真正需要什么</h1>
        <p className="article-lead">
          大多数团队一开始问的是“模型能不能生成一个实时组件”。更关键的问题其实是：
          当真实用户、真实数据和真实基础设施都介入后，这个界面还能不能保持稳定、安全和可运营。
        </p>

        <div className="article-sections">
          {sections.map((section) => (
            <section className="article-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>

        <div className="docs-card">
          <div className="section-kicker">继续阅读</div>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/resources/widget-rendering-security">
              渲染安全
            </Link>
            <Link className="secondary-button" href="/zh-CN/platform">
              平台总览
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
