import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://codeclaude.cn"),
  title: "StreamCanvas",
  description:
    "Open-source generative UI for AI apps: stream live widgets, diagrams, dashboards, and operational surfaces from tool calls.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "generative UI",
    "Claude generative UI",
    "open source AI UI",
    "AI widgets",
    "Next.js AI interface",
    "StreamCanvas",
  ],
  openGraph: {
    title: "StreamCanvas",
    description:
      "Build production-ready generative UI with streamed widgets, safe rendering, and a self-hostable reference app.",
    siteName: "StreamCanvas",
    type: "website",
    url: "https://codeclaude.cn",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamCanvas",
    description:
      "Open-source generative UI for AI apps with live widgets, schema-validated components, and a self-hostable demo.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
