import type { Metadata } from "next";

import { DemoShell } from "../../../components/demo-shell";
import { createLocalizedAlternates, localizePath } from "../../../lib/locales";
import { absoluteUrl } from "../../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas 中文演示",
  description:
    "用中文体验 StreamCanvas 的流式组件、沙箱渲染、宿主回调与参考生成式 UI 工作流。",
  alternates: createLocalizedAlternates("zh-CN", "/demo"),
  openGraph: {
    title: "StreamCanvas 中文演示",
    description:
      "用中文验证 StreamCanvas 的交互模型，包括 Prompt 流、组件渲染与可保存场景。",
    url: absoluteUrl(localizePath("zh-CN", "/demo")),
  },
};

export default function ChineseDemoPage() {
  return <DemoShell currentPath="/demo" locale="zh-CN" />;
}
