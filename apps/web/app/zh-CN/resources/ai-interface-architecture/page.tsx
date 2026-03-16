import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../../components/json-ld";
import { SiteFooter } from "../../../../components/site-footer";
import { SiteHeader } from "../../../../components/site-header";
import { createArticleSchema, createBreadcrumbSchema } from "../../../../lib/seo";
import { createLocalizedAlternates, localizePath } from "../../../../lib/locales";
import { absoluteUrl } from "../../../../lib/site";

export const metadata: Metadata = {
  title: "设计用户真正能操作的 AI 界面",
  description:
    "一份产品视角的中文指南，帮助团队判断何时应该使用生成式 UI，何时文本已经足够，以及如何设计稳定的 AI 工作面。",
  alternates: createLocalizedAlternates("zh-CN", "/resources/ai-interface-architecture"),
  openGraph: {
    title: "设计用户真正能操作的 AI 界面",
    description: "帮助中文产品团队理解生成式 UI 该放在哪里，以及怎样做才不会失控。",
    url: absoluteUrl(localizePath("zh-CN", "/resources/ai-interface-architecture")),
  },
};

export default function ChineseAiInterfaceArchitecturePage() {
  return (
    <main className="shell docs-shell article-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首页", path: "/zh-CN" },
          { name: "资源", path: "/zh-CN/resources" },
          {
            name: "设计用户真正能操作的 AI 界面",
            path: "/zh-CN/resources/ai-interface-architecture",
          },
        ])}
      />
      <JsonLd
        data={createArticleSchema({
          description:
            "一份产品视角的中文指南，帮助团队判断何时应该使用生成式 UI，何时文本已经足够，以及如何设计稳定的 AI 工作面。",
          keywords: [
            "AI 界面架构",
            "生成式 UI 设计",
            "AI 工作流体验",
            "可操作的 AI 界面",
          ],
          path: "/zh-CN/resources/ai-interface-architecture",
          title: "设计用户真正能操作的 AI 界面",
        })}
      />
      <SiteHeader currentPath="/resources/ai-interface-architecture" locale="zh-CN" />

      <article className="article-layout">
        <div className="eyebrow">产品文章</div>
        <h1 className="article-title">设计用户真正能操作的 AI 界面</h1>
        <p className="article-lead">
          生成式 UI 不应该替代每一种回答。只有当答案必须具备结构、控件或渐进式交互时，它才真正发挥价值。
        </p>

        <div className="article-sections">
          <section className="article-section">
            <h2>解释型任务往往仍适合纯文本</h2>
            <p>
              解释、总结与建议型任务很多时候本来就适合文本。只有当用户下一步是“操作”而不是“阅读”时，界面才开始产生明显价值。
            </p>
          </section>
          <section className="article-section">
            <h2>当用户需要结构时，再使用生成式 UI</h2>
            <p>
              仪表盘、计划画布、表单、审批流和情景对比都受益于明确的布局。界面能让用户直接检查、微调并执行下一步，而不是先把 prose 再翻译回工作。
            </p>
          </section>
          <section className="article-section">
            <h2>保持用户的心智模型稳定</h2>
            <p>
              专业产品不应该每次都像换一种范式。外围框架、动作模式和信任提示必须保持一致，即便内部内容是动态生成的。
            </p>
          </section>
          <section className="article-section">
            <h2>设计的重点是“继续完善”，而不是“一次揭晓”</h2>
            <p>
              最好的 AI 界面把首个渲染结果当成起点。用户应该可以修正假设、保留结果，或把界面推入宿主工作流，而不需要丢失上下文。
            </p>
          </section>
        </div>

        <div className="docs-card">
          <div className="section-kicker">继续阅读</div>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/solutions">
              查看解决方案
            </Link>
            <Link className="secondary-button" href="/zh-CN/demo">
              打开演示
            </Link>
          </div>
        </div>
      </article>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
