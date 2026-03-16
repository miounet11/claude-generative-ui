import type { Metadata } from "next";

import { JsonLd } from "../components/json-ld";
import { createOrganizationSchema, createWebsiteSchema } from "../lib/seo";
import { getSiteUrl, siteDescription, siteName, socialPreviewImage } from "../lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  keywords: [
    "generative UI",
    "Claude generative UI",
    "open source AI UI",
    "生成式 UI",
    "开源 Claude 生成式 UI",
    "AI widgets",
    "Next.js AI interface",
    "StreamCanvas",
  ],
  openGraph: {
    description: siteDescription,
    images: [
      {
        alt: siteName,
        height: 630,
        url: socialPreviewImage(),
        width: 1200,
      },
    ],
    siteName,
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    description: siteDescription,
    images: [socialPreviewImage()],
    title: siteName,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={createWebsiteSchema()} />
        <JsonLd data={createOrganizationSchema()} />
        {children}
      </body>
    </html>
  );
}
