import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "../../components/json-ld";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { createFaqSchema, createSoftwareSchema } from "../../lib/seo";
import { createLocalizedAlternates, localizePath } from "../../lib/locales";
import {
  getPlatformLayers,
  getResourceLibrary,
  getSolutionTracks,
} from "../../lib/marketing";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 中文版",
  description:
    "面向 AI 应用的开源生成式 UI：支持流式组件、Schema 校验、沙箱渲染，以及可自托管的参考应用。",
  alternates: createLocalizedAlternates("zh-CN", "/"),
  openGraph: {
    title: "StreamCanvas 中文版",
    description:
      "用更稳妥的方式构建生成式 UI，让团队把 Claude 风格交互真正交付到生产环境。",
    url: absoluteUrl(localizePath("zh-CN", "/")),
  },
  keywords: [
    "生成式 UI",
    "Claude 风格 UI",
    "开源 AI 前端",
    "AI 小部件",
    "流式组件渲染",
    "StreamCanvas",
  ],
};

const capabilities = [
  {
    body: "工具调用可以直接变成真实可操作的界面，而不是只能截图或回退成 Markdown。",
    title: "流式组件渲染",
  },
  {
    body: "默认使用沙箱 iframe 渲染，同时支持经过 Schema 校验的 React 组件模式。",
    title: "默认更安全",
  },
  {
    body: "一个仓库同时包含参考应用、核心协议、React SDK 和脚手架，方便团队直接评估。",
    title: "应用与 SDK 一体化",
  },
];

const proofPoints = [
  "服务端与客户端共用 NDJSON 事件流协议",
  "组件中的动作可以结构化回传到宿主应用",
  "优先采用 SVG 方案，离线演示也能运行",
];

const faqItems = [
  {
    answer:
      "StreamCanvas 是一个开源框架，用来构建可以在模型流式返回过程中生成真实组件、仪表盘与操作工作面的 AI 界面。",
    question: "StreamCanvas 是什么？",
  },
  {
    answer:
      "不会。默认渲染器使用沙箱 iframe，并且会先对 HTML 进行清洗，再把内容展示到组件画布中。",
    question: "StreamCanvas 会把原始 HTML 直接注入宿主页面吗？",
  },
  {
    answer:
      "可以。参考应用与服务端辅助包都支持自托管，React 包也可以直接对接你自己的后端服务。",
    question: "它可以自托管并集成到现有产品里吗？",
  },
];

export default function ChineseHomePage() {
  const platformLayers = getPlatformLayers("zh-CN");
  const resourceLibrary = getResourceLibrary("zh-CN");
  const solutionTracks = getSolutionTracks("zh-CN");

  return (
    <main className="shell">
      <JsonLd data={createSoftwareSchema()} />
      <JsonLd data={createFaqSchema(faqItems)} />
      <SiteHeader currentPath="/" locale="zh-CN" />

      <section className="hero">
        <div>
          <div className="eyebrow">面向正式产品的生成式 UI</div>
          <h1 className="hero-title">让界面和模型一起流式出现。</h1>
          <p className="hero-copy">
            StreamCanvas 把 Claude 风格的生成式 UI 打造成一个真正可交付的开源产品：
            更稳妥的渲染边界、可复用的 React 原语，以及一个可以直接验证交互方式的参考应用。
          </p>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/demo">
              打开中文演示
            </Link>
            <a className="secondary-button" href="https://github.com/miounet11/claude-generative-ui">
              查看仓库
            </a>
          </div>
          <div className="proof-list">
            {proofPoints.map((point) => (
              <div className="proof-pill" key={point}>
                {point}
              </div>
            ))}
          </div>
        </div>

        <aside className="preview-card">
          <div className="preview-label">参考架构</div>
          <div className="preview-metric-row">
            <div>
              <div className="preview-metric">4</div>
              <div className="preview-copy">公开交付面包含 4 个核心包</div>
            </div>
            <div>
              <div className="preview-metric">2</div>
              <div className="preview-copy">两种渲染模式：沙箱 HTML 与 React 组件</div>
            </div>
          </div>
          <pre className="code-panel">{`render_widget({
  id: "launch_brief",
  title: "季度发布简报",
  kind: "html",
  loadingMessages: ["正在起草简报"],
  html: "<section>...</section>"
})`}</pre>
        </aside>
      </section>

      <section className="section-grid">
        {capabilities.map((capability) => (
          <article className="section-card" key={capability.title}>
            <div className="section-kicker">价值</div>
            <h2>{capability.title}</h2>
            <p>{capability.body}</p>
          </article>
        ))}
      </section>

      <section className="section-grid">
        {platformLayers.slice(0, 3).map((layer) => (
          <article className="section-card" key={layer.title}>
            <div className="section-kicker">平台层</div>
            <h2>{layer.title}</h2>
            <p>{layer.body}</p>
          </article>
        ))}
      </section>

      <section className="section-stack">
        <article className="section-card wide-card">
          <div className="section-kicker">适合谁</div>
          <h2>把 AI 输出变成用户可以直接操作的界面，而不是只能阅读的文本。</h2>
          <p>
            StreamCanvas 适合 AI 产品团队、Agent 构建者、分析型 SaaS 以及希望加入生成式
            UI 层的业务系统。你可以先用落地页和演示应用评估交互方式，再把底层包接入到自己的产品中。
          </p>
        </article>
      </section>

      <section className="section-stack">
        <article className="section-card wide-card">
          <div className="section-kicker">搜索意图</div>
          <h2>如果你在找“开源 Claude 生成式 UI”，这里就是实际可用的答案。</h2>
          <p>
            StreamCanvas 不是对某个闭源实现做像素级复制，而是把真正有价值的交互模式开源化：
            类型化事件流、沙箱组件渲染、React SDK、宿主动作桥接，以及正式部署模型。
          </p>
          <Link className="text-link" href="/zh-CN/claude-generative-ui">
            阅读中文实现说明
          </Link>
        </article>
      </section>

      <section className="section-grid">
        {solutionTracks.slice(0, 3).map((track) => (
          <article className="section-card" key={track.title}>
            <div className="section-kicker">应用场景</div>
            <h2>{track.title}</h2>
            <p>{track.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">为运营和交付准备</div>
          <h2>在组件还没完全渲染完之前，就先让回答开始有用。</h2>
          <p>
            服务端通过一条流同时发送消息与组件事件，React 包负责消费这些事件、增量渲染界面，
            并把组件动作安全地桥接回宿主应用。落地页、演示路由和 SDK 共用同一套协议模型。
          </p>
        </div>
        <div className="timeline-card">
          <div className="timeline-step">
            <span>01</span>
            <strong>工具调用先规划界面结构</strong>
          </div>
          <div className="timeline-step">
            <span>02</span>
            <strong>服务端流式发送消息与组件帧</strong>
          </div>
          <div className="timeline-step">
            <span>03</span>
            <strong>沙箱渲染器把结构化事件发回宿主应用</strong>
          </div>
        </div>
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

      <section className="faq-grid">
        {faqItems.map((item) => (
          <article className="faq-card" key={item.question}>
            <div className="section-kicker">FAQ</div>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>

      <section className="launch-strip">
        <div>
          <div className="eyebrow">先验证，再扩展</div>
          <h2>先从参考应用开始，再过渡到 SDK 集成。</h2>
        </div>
        <Link className="primary-button" href="/zh-CN/demo">
          体验中文工作台
        </Link>
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
