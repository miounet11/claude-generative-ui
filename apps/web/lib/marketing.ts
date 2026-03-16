export const siteNavigation = [
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/security", label: "Security" },
  { href: "/resources", label: "Resources" },
  { href: "/docs", label: "Docs" },
  { href: "/demo", label: "Demo" },
];

export const platformLayers = [
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
];

export const solutionTracks = [
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
];

export const trustPillars = [
  "Sandboxed widget rendering by default",
  "Schema-validated React component mode",
  "Host-only actions through explicit client tools",
  "Self-hosted deployment on localhost-bound services",
];

export const resourceLibrary = [
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
];
