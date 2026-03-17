import type { Metadata } from "next";

import { SiteFooter } from "../../../components/site-footer";
import { SiteHeader } from "../../../components/site-header";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 中文文档",
  description:
    "面向中文团队的快速开始、架构、部署与 API 使用说明，帮助你更快评估 StreamCanvas。",
  alternates: createLocalizedAlternates("zh-CN", "/docs"),
  openGraph: {
    title: "StreamCanvas 中文文档",
    description: "快速开始、架构说明与部署指南的中文版本。",
    url: absoluteUrl(localizePath("zh-CN", "/docs")),
  },
};

const sections = [
  {
    body: "安装依赖、启动参考应用，然后打开演示线程验证消息流、组件渲染与客户端工具回调。",
    title: "快速开始",
  },
  {
    body: "使用 @streamcanvas/core 负责流式协议，@streamcanvas/react 提供前端组件原语，@streamcanvas/server 提供参考运行时辅助。",
    title: "架构",
  },
  {
    body: "推荐通过 nginx 反向代理把应用暴露在公网，同时让实际服务只绑定在 localhost 上，避免干扰已有系统。",
    title: "部署",
  },
];

export default function ChineseDocsPage() {
  return (
    <main className="shell docs-shell">
      <SiteHeader currentPath="/docs" locale="zh-CN" />

      <section className="docs-hero">
        <div className="eyebrow">中文文档</div>
        <h1 className="hero-title small">本地跑起来，安全部署，理性扩展。</h1>
        <p className="hero-copy">
          StreamCanvas 既是一个参考应用，也是一组可复用的软件包。这个页面是中文用户从 clone 到看到生成式
          UI 运行起来的最快路径。
        </p>
      </section>

      <section className="section-grid">
        {sections.map((section) => (
          <article className="section-card" key={section.title}>
            <div className="section-kicker">指南</div>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>

      <section className="docs-grid">
        <article className="docs-card">
          <div className="section-kicker">安装</div>
          <pre className="code-panel">{`pnpm install
pnpm dev`}</pre>
          <p className="docs-copy">
            打开 <strong>http://localhost:3000</strong>，使用演示 Prompt 验证消息流、组件渲染与客户端工具回调。
          </p>
        </article>

        <article className="docs-card">
          <div className="section-kicker">使用这些包</div>
          <pre className="code-panel">{`import {
  StreamCanvasProvider,
  ChatThread,
  WidgetSurface,
} from "@streamcanvas/react";`}</pre>
          <p className="docs-copy">
            React 包消费的是同一套 NDJSON 事件流，不论这个流来自参考服务端还是你自己的后端实现。
          </p>
        </article>

        <article className="docs-card">
          <div className="section-kicker">部署</div>
          <pre className="code-panel">{`pnpm build
rsync -az apps/web/.next/standalone/ server:/opt/streamcanvas-web/
ssh server "mkdir -p /opt/streamcanvas-web/apps/web/.next/static /opt/streamcanvas-web/content/generated"
rsync -az apps/web/.next/static/ server:/opt/streamcanvas-web/apps/web/.next/static/
systemctl restart streamcanvas-web`}</pre>
          <p className="docs-copy">
            推荐的生产路径是 Next.js standalone 运行时加 nginx 反向代理，应用只监听
            <strong>127.0.0.1:3210</strong>。新增的资源文章从文件系统动态读取，因此
            每日内容发布无需重新构建应用。重启服务前要先确保
            <code>.next/static</code> 目标目录已经存在。常规应用部署时不要覆盖线上
            生成内容目录，否则自动发布的文章会被冲掉。
          </p>
        </article>
      </section>

      <section className="docs-grid two-up">
        <article className="docs-card">
          <div className="section-kicker">脚手架</div>
          <pre className="code-panel">{`npx create-streamcanvas my-app
cd my-app
pnpm install
pnpm dev`}</pre>
        </article>

        <article className="docs-card">
          <div className="section-kicker">内容程序</div>
          <pre className="code-panel">{`STREAMCANVAS_BOT_API_URL=...
STREAMCANVAS_BOT_API_KEY=...
STREAMCANVAS_BOT_MODEL=auto
pnpm content:generate -- --count=3 --force`}</pre>
          <p className="docs-copy">
            这个内容程序会把中英文文章发布到资源中心，并同步扩展 RSS、sitemap 与
            站点的可发现性入口。
          </p>
        </article>

        <article className="docs-card">
          <div className="section-kicker">公开路由</div>
          <ul className="docs-list">
            <li><code>/zh-CN</code> 中文首页</li>
            <li><code>/zh-CN/platform</code> 架构与部署模型</li>
            <li><code>/zh-CN/solutions</code> 适用场景与产品匹配度</li>
            <li><code>/zh-CN/security</code> 安全边界与运营边界</li>
            <li><code>/zh-CN/resources</code> 中文内容中心</li>
            <li><code>/zh-CN/demo</code> 中文演示</li>
            <li><code>/feed.xml</code> RSS 订阅源</li>
            <li><code>/sitemap.xml</code> 动态站点地图</li>
            <li><code>/llms.txt</code> 面向 Agent 的站点索引</li>
            <li><code>/api/health</code> 健康检查</li>
            <li><code>/api/demo</code> NDJSON 演示流接口</li>
          </ul>
        </article>
      </section>

      <SiteFooter locale="zh-CN" />
    </main>
  );
}
