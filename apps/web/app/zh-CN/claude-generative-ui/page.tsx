import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../../components/json-ld";
import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createBreadcrumbSchema, createFaqSchema } from "../../../lib/seo";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "开源 Claude 生成式 UI",
  description:
    "用中文解释 StreamCanvas 如何把 Claude 风格的生成式 UI 交互模式，打造成一个更适合交付和自托管的开源产品。",
  alternates: createLocalizedAlternates("zh-CN", "/claude-generative-ui"),
  openGraph: {
    title: "开源 Claude 生成式 UI",
    description:
      "理解 StreamCanvas 如何把 Claude 风格的交互模式，转化成团队真正能使用的开源产品与部署模型。",
    url: absoluteUrl(localizePath("zh-CN", "/claude-generative-ui")),
  },
};

const evaluationFaq = [
  {
    answer:
      "不是。StreamCanvas 借鉴的是有价值的交互模式，但协议、渲染器、SDK 与部署模型都是独立设计的开源实现。",
    question: "StreamCanvas 是要复制 Claude 吗？",
  },
  {
    answer:
      "因为很多人搜索这个词，其实是在寻找一种可复用、可自托管、可安全评估的交互方式，而不只是一个视觉效果。",
    question: "为什么要直接覆盖“Claude 生成式 UI”这个搜索意图？",
  },
  {
    answer:
      "先体验演示，再阅读平台与安全页面，最后把 React 包接入自己的后端，或者直接从参考服务端开始验证。",
    question: "最快的评估路径是什么？",
  },
];

const comparisonPoints = [
  {
    body: "多数搜索“开源 Claude 生成式 UI”的团队，真正想要的是交互模式，而不是像素级模仿。他们需要流式协议、组件渲染、可信动作回调和一条走向生产环境的路径。",
    title: "团队真正想找的东西",
  },
  {
    body: "最常见的危险捷径，是把生成的 HTML 直接塞进宿主页面。这样能快速做出演示，但也会让安全边界瞬间消失。",
    title: "最容易犯的错误",
  },
  {
    body: "StreamCanvas 把难点打包成完整产品：NDJSON 事件流、沙箱渲染器、Schema 校验后的 React 组件、宿主工具桥接和自托管应用外壳。",
    title: "StreamCanvas 已经提供的能力",
  },
];

export default function ChineseClaudeGenerativeUiPage() {
  return (
    <main className="shell docs-shell">
      <JsonLd
        data={createBreadcrumbSchema([
          { name: "首页", path: "/zh-CN" },
          { name: "开源 Claude 生成式 UI", path: "/zh-CN/claude-generative-ui" },
        ])}
      />
      <JsonLd data={createFaqSchema(evaluationFaq)} />
      <SiteHeader currentPath="/claude-generative-ui" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">搜索意图说明</div>
        <h1 className="hero-title small">把开源 Claude 生成式 UI 变成真正可用的东西。</h1>
        <p className="hero-copy">
          很多人从“Claude 风格生成式 UI”开始了解这个方向。StreamCanvas 的目标，是把这类兴趣转成一个真正能评估、能扩展、能自托管的开源产品。
        </p>
        <div className="cta-row">
          <Link className="primary-button" href="/zh-CN/demo">
            打开演示
          </Link>
          <Link className="secondary-button" href="/zh-CN/docs">
            阅读文档
          </Link>
        </div>
      </section>

      <section className="section-grid">
        {comparisonPoints.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">判断点</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">为什么需要这个页面</div>
          <h2>搜索意图和生产现实，经常不是同一回事。</h2>
          <p>
            用户可能因为看到了某个惊艳交互而搜索这个词，但工程团队最终需要的是流式语义、渲染控制、信任边界和一套能交给运维团队的部署方式。
          </p>
        </div>
        <div className="docs-card">
          <div className="section-kicker">你会得到什么</div>
          <div className="footer-list">
            <span>客户端和服务端共享的 NDJSON 协议</span>
            <span>默认沙箱 HTML 渲染模式</span>
            <span>Schema 校验后的 React 组件模式</span>
            <span>通过注册客户端工具触发可信宿主动作</span>
            <span>基于 nginx 与 localhost 端口的自托管部署模式</span>
          </div>
        </div>
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">评估路径</div>
          <pre className="code-panel">{`pnpm install
pnpm dev

# 然后依次查看：
- /zh-CN/demo
- /zh-CN/platform
- /zh-CN/security
- /zh-CN/docs`}</pre>
          <p className="docs-copy">
            这个页面用于覆盖搜索意图，真正的评估仍然发生在产品、协议和部署模型本身。
          </p>
        </article>

        <article className="docs-card">
          <div className="section-kicker">从这里继续</div>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/platform">
              平台总览
            </Link>
            <Link className="secondary-button" href="/zh-CN/security">
              安全模型
            </Link>
          </div>
          <Link className="text-link" href="https://github.com/miounet11/claude-generative-ui">
            查看 GitHub 仓库
          </Link>
        </article>
      </section>

      <section className="faq-grid">
        {evaluationFaq.map((item) => (
          <article className="faq-card" key={item.question}>
            <div className="section-kicker">FAQ</div>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
