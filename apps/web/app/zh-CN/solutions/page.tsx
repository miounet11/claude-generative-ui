import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { getSolutionTracks } from "../../../lib/marketing";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 解决方案",
  description:
    "查看 StreamCanvas 在 SaaS Copilot、运营工作台、分析型体验与受监管流程中的落地方式。",
  alternates: createLocalizedAlternates("zh-CN", "/solutions"),
  openGraph: {
    title: "StreamCanvas 解决方案",
    description: "了解生成式 UI 真正适合放进哪些产品场景，以及如何避免玩具化演示。",
    url: absoluteUrl(localizePath("zh-CN", "/solutions")),
  },
};

const buyerSignals = [
  "你需要把 AI 输出变成用户可以直接操作的界面，而不是只能阅读的文本。",
  "你希望前端继续掌控审批与可信动作，而不是把权限让给生成内容。",
  "你需要自托管部署与明确的运维归属。",
  "你希望产品、设计和工程团队围绕同一个交互模型协同推进。",
];

export default function ChineseSolutionsPage() {
  const solutionTracks = getSolutionTracks("zh-CN");

  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/solutions" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">解决方案</div>
        <h1 className="hero-title small">生成式 UI 真正值得出现的地方。</h1>
        <p className="hero-copy">
          StreamCanvas 适合那些“答案必须变成界面”的产品：仪表盘、执行计划、表单、运营工作台，以及用户需要直接操作的决策界面。
        </p>
      </section>

      <section className="section-grid">
        {solutionTracks.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">场景</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">典型信号</div>
          <div className="footer-list">
            {buyerSignals.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
        <article className="docs-card">
          <div className="section-kicker">示例流程</div>
          <pre className="code-panel">{`用户发起一个问题
助手生成消息 + 组件
组件逐步流式渲染
用户点击保存 / 审批 / 细化
宿主应用执行可信本地工具
对话和界面保持同步`}</pre>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/demo">
              打开演示
            </Link>
            <Link className="secondary-button" href="/zh-CN/platform">
              查看平台结构
            </Link>
          </div>
        </article>
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
