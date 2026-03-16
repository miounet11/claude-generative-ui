import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import {
  createLocalizedAlternates,
  localizePath,
} from "../../../lib/locales";
import { getPlatformLayers, getTrustPillars } from "../../../lib/marketing";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 平台",
  description:
    "了解 StreamCanvas 的平台层次，包括流式协议、渲染系统、动作桥接与部署模型。",
  alternates: createLocalizedAlternates("zh-CN", "/platform"),
  openGraph: {
    title: "StreamCanvas 平台",
    description: "从事件流到安全边界，再到部署模型，全面了解 StreamCanvas 的平台结构。",
    url: absoluteUrl(localizePath("zh-CN", "/platform")),
  },
};

export default function ChinesePlatformPage() {
  const platformLayers = getPlatformLayers("zh-CN");
  const trustPillars = getTrustPillars("zh-CN");

  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/platform" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">平台</div>
        <h1 className="hero-title small">一套完整的流式 AI 界面交付栈。</h1>
        <p className="hero-copy">
          StreamCanvas 不只是一个视觉演示，而是一套可交付的生成式界面平台：
          类型化流、可控渲染、组件注册、宿主动作桥接与自托管运维模型。
        </p>
      </section>

      <section className="section-grid">
        {platformLayers.map((layer) => (
          <article className="section-card" key={layer.title}>
            <div className="section-kicker">层</div>
            <h2>{layer.title}</h2>
            <p>{layer.body}</p>
          </article>
        ))}
      </section>

      <section className="split-section">
        <div className="section-copy">
          <div className="eyebrow">为什么团队需要它</div>
          <h2>先稳定交互模型，再逐步补齐实现能力。</h2>
          <p>
            大多数团队先做出一个高曝光演示，随后才发现还需要审批、状态持久化、本地动作与稳定部署。
            这个平台存在的目的，就是让这些能力可以在不推翻用户体验的情况下逐步加上去。
          </p>
        </div>
        <div className="timeline-card">
          {trustPillars.map((item, index) => (
            <div className="timeline-step" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">部署模式</div>
          <pre className="code-panel">{`本地开发
- pnpm dev

生产部署
- Next.js standalone runtime
- systemd 服务
- nginx 反向代理
- 应用端口只绑定 localhost`}</pre>
        </article>

        <article className="docs-card">
          <div className="section-kicker">下一步</div>
          <p className="docs-copy">
            继续阅读部署、安全与产品场景页面，了解这套平台如何进入真实的客户界面和企业内部工作流。
          </p>
          <div className="cta-row">
            <Link className="primary-button" href="/zh-CN/security">
              查看安全模型
            </Link>
            <Link className="secondary-button" href="/zh-CN/resources">
              阅读中文资源
            </Link>
          </div>
        </article>
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
