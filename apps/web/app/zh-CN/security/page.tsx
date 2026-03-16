import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 安全模型",
  description:
    "了解 StreamCanvas 如何通过沙箱渲染、宿主动作边界、部署隔离与显式控制点降低风险。",
  alternates: createLocalizedAlternates("zh-CN", "/security"),
  openGraph: {
    title: "StreamCanvas 安全模型",
    description: "从渲染边界到宿主动作桥接，再到部署边界，全面理解 StreamCanvas 的安全策略。",
    url: absoluteUrl(localizePath("zh-CN", "/security")),
  },
};

const controls = [
  {
    body: "HTML 组件默认渲染在沙箱 iframe 中，而不是直接注入到宿主 DOM，因此风险边界更明确。",
    title: "渲染隔离",
  },
  {
    body: "React 组件模式会先校验 props Schema，降低任意或畸形数据进入应用代码的概率。",
    title: "类型化组件模式",
  },
  {
    body: "用户动作通过注册的客户端工具回到宿主应用，而不是让生成内容直接执行宿主脚本。",
    title: "可信动作路径",
  },
  {
    body: "推荐部署方式是应用只绑定 localhost，再通过 nginx 暴露公网入口，避免破坏现有服务边界。",
    title: "运维隔离",
  },
];

export default function ChineseSecurityPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/security" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">安全</div>
        <h1 className="hero-title small">安全不是装饰，而是产品架构的一部分。</h1>
        <p className="hero-copy">
          StreamCanvas 把安全视为生成式界面的底层约束问题。渲染边界、宿主动作边界和部署边界都必须显式存在，团队才能真正评估风险。
        </p>
      </section>

      <section className="section-grid">
        {controls.map((item) => (
          <article className="section-card" key={item.title}>
            <div className="section-kicker">控制点</div>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">默认姿态</div>
          <h2>先用保守模型起步，再按需放宽。</h2>
          <p>
            默认配置刻意偏保守：沙箱组件、显式客户端工具、自托管部署与反向代理暴露边界。团队可以在真正理解风险之后再放宽策略，而不是先把边界取消掉。
          </p>
        </div>
        <div className="docs-card">
          <div className="section-kicker">评审清单</div>
          <div className="footer-list">
            <span>流式 HTML 的清洗策略</span>
            <span>宿主动作的审批点和权限模型</span>
            <span>生产环境里的代理与来源头处理</span>
            <span>组件触发动作的可审计性</span>
          </div>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/docs">
              阅读部署文档
            </Link>
            <Link className="secondary-button" href="/zh-CN/resources/widget-rendering-security">
              阅读安全文章
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
