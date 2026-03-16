import type { SiteLocale } from "./locales";

interface NavigationItem {
  href: string;
  label: string;
}

interface MarketingBlock {
  body: string;
  title: string;
}

interface ResourceItem {
  category: string;
  description: string;
  href: string;
  readTime: string;
  title: string;
}

interface MarketingContent {
  footerDescription: string;
  footerExploreLabel: string;
  footerResourcesLabel: string;
  footerTagline: string;
  footerTrustLabel: string;
  githubLabel: string;
  languageLabel: string;
  resourceLibrary: ResourceItem[];
  siteNavigation: NavigationItem[];
  solutionTracks: MarketingBlock[];
  trustPillars: string[];
  platformLayers: MarketingBlock[];
}

const content: Record<SiteLocale, MarketingContent> = {
  en: {
    footerDescription:
      "StreamCanvas combines a reference application, typed protocol, React SDK, and safe deployment model so teams can move from demo to product without changing the core interaction model.",
    footerExploreLabel: "Explore",
    footerResourcesLabel: "Resources",
    footerTagline: "Professional generative UI, built for shipping.",
    footerTrustLabel: "Trust",
    githubLabel: "GitHub",
    languageLabel: "Language",
    resourceLibrary: [
      {
        category: "Architecture",
        description:
          "A practical guide to the layers required for a real generative UI product, from the event stream to the rendering surface.",
        href: "/resources/production-generative-ui",
        readTime: "8 min read",
        title: "What production generative UI actually needs",
      },
      {
        category: "Security",
        description:
          "Why rendering strategy matters, where teams get exposed, and how to reduce risk without killing the interactive experience.",
        href: "/resources/widget-rendering-security",
        readTime: "7 min read",
        title: "How to secure streamed widget rendering",
      },
      {
        category: "Product",
        description:
          "A framework for deciding where generative UI belongs in a product, what users expect, and which surfaces should remain traditional.",
        href: "/resources/ai-interface-architecture",
        readTime: "9 min read",
        title: "Designing AI interfaces that users can actually operate",
      },
    ],
    siteNavigation: [
      { href: "/platform", label: "Platform" },
      { href: "/solutions", label: "Solutions" },
      { href: "/security", label: "Security" },
      { href: "/resources", label: "Resources" },
      { href: "/docs", label: "Docs" },
      { href: "/demo", label: "Demo" },
    ],
    solutionTracks: [
      {
        body: "Embed AI workspaces directly into existing products so users can ask, approve, refine, and act without leaving the page.",
        title: "SaaS Copilots",
      },
      {
        body: "Render dashboards, launch plans, and operational briefings that stay useful while the model is still streaming.",
        title: "Operations Interfaces",
      },
      {
        body: "Turn prompts into charts, scenario summaries, and data review flows with structured callbacks to the host system.",
        title: "Analytics Experiences",
      },
      {
        body: "Use safe rendering and explicit approval patterns for workflows that require auditability, bounded inputs, and controlled actions.",
        title: "Regulated Workflows",
      },
    ],
    trustPillars: [
      "Sandboxed widget rendering by default",
      "Schema-validated React component mode",
      "Host-only actions through explicit client tools",
      "Self-hosted deployment on localhost-bound services",
    ],
    platformLayers: [
      {
        body: "A typed event contract for messages, widget creation, incremental HTML frames, component payloads, and host callbacks.",
        title: "Stream Protocol",
      },
      {
        body: "A sandboxed iframe renderer for HTML widgets plus schema-validated React components for app-native surfaces.",
        title: "Rendering Layer",
      },
      {
        body: "Client tools, approvals, and structured payloads let widgets trigger trusted host actions without arbitrary DOM access.",
        title: "Action Bridge",
      },
      {
        body: "Reference server helpers, standalone runtime support, and reverse-proxy deployment patterns for self-hosted teams.",
        title: "Operational Delivery",
      },
    ],
  },
  "zh-CN": {
    footerDescription:
      "StreamCanvas 将参考应用、类型化协议、React SDK 与安全部署模型打包在一起，让团队从演示走向正式产品时不必推翻交互方式。",
    footerExploreLabel: "浏览",
    footerResourcesLabel: "资源",
    footerTagline: "面向正式上线的专业生成式 UI。",
    footerTrustLabel: "可信边界",
    githubLabel: "GitHub",
    languageLabel: "语言",
    resourceLibrary: [
      {
        category: "架构",
        description:
          "一份面向正式产品的生成式 UI 架构指南，从事件流协议到渲染边界逐层拆解。",
        href: "/resources/production-generative-ui",
        readTime: "8 分钟阅读",
        title: "生产级生成式 UI 真正需要什么",
      },
      {
        category: "安全",
        description:
          "解释为什么渲染策略决定风险边界，以及如何在不破坏交互体验的前提下收敛风险。",
        href: "/resources/widget-rendering-security",
        readTime: "7 分钟阅读",
        title: "如何保护流式组件渲染的安全性",
      },
      {
        category: "产品",
        description:
          "帮助团队判断生成式 UI 应该放进产品的什么位置，以及哪些场景仍然更适合传统界面。",
        href: "/resources/ai-interface-architecture",
        readTime: "9 分钟阅读",
        title: "设计用户真正能操作的 AI 界面",
      },
    ],
    siteNavigation: [
      { href: "/platform", label: "平台" },
      { href: "/solutions", label: "方案" },
      { href: "/security", label: "安全" },
      { href: "/resources", label: "资源" },
      { href: "/docs", label: "文档" },
      { href: "/demo", label: "演示" },
    ],
    solutionTracks: [
      {
        body: "将 AI 工作台直接嵌入现有产品，让用户在同一页面内提问、审批、微调并执行动作。",
        title: "SaaS Copilot",
      },
      {
        body: "渲染仪表盘、计划画布与运营简报，让模型在流式返回时就开始提供可操作界面。",
        title: "运营工作台",
      },
      {
        body: "把 Prompt 转成图表、情景摘要与数据复核流程，并通过结构化回调连接宿主系统。",
        title: "分析型体验",
      },
      {
        body: "为需要审计、权限控制和边界清晰的流程提供更稳妥的生成式交互层。",
        title: "受监管流程",
      },
    ],
    trustPillars: [
      "默认使用沙箱 iframe 渲染组件",
      "Schema 校验后的 React 组件模式",
      "宿主动作只能通过显式注册的客户端工具执行",
      "支持绑定到 localhost 的自托管部署模式",
    ],
    platformLayers: [
      {
        body: "类型化事件协议统一描述消息、组件创建、增量 HTML 帧、组件载荷与宿主回调。",
        title: "流式协议层",
      },
      {
        body: "默认提供沙箱 iframe 渲染 HTML 组件，也支持 Schema 校验后的 React 原生组件。",
        title: "渲染层",
      },
      {
        body: "客户端工具、审批点与结构化载荷让生成式界面可以触发可信宿主动作，而不是任意 DOM 注入。",
        title: "动作桥接层",
      },
      {
        body: "参考服务端、独立运行时与反向代理部署模式，帮助团队在自托管环境里稳定交付。",
        title: "交付与运维层",
      },
    ],
  },
};

export const siteNavigation = content.en.siteNavigation;
export const platformLayers = content.en.platformLayers;
export const solutionTracks = content.en.solutionTracks;
export const trustPillars = content.en.trustPillars;
export const resourceLibrary = content.en.resourceLibrary;

export function getMarketingContent(locale: SiteLocale = "en"): MarketingContent {
  return content[locale];
}

export function getSiteNavigation(locale: SiteLocale = "en"): NavigationItem[] {
  return content[locale].siteNavigation;
}

export function getPlatformLayers(locale: SiteLocale = "en"): MarketingBlock[] {
  return content[locale].platformLayers;
}

export function getSolutionTracks(locale: SiteLocale = "en"): MarketingBlock[] {
  return content[locale].solutionTracks;
}

export function getTrustPillars(locale: SiteLocale = "en"): string[] {
  return content[locale].trustPillars;
}

export function getResourceLibrary(locale: SiteLocale = "en"): ResourceItem[] {
  return content[locale].resourceLibrary;
}
