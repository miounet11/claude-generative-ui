import type { Metadata } from "next";

import { DemoShell } from "../../components/demo-shell";
import { absoluteUrl } from "../../lib/site";

export const metadata: Metadata = {
  title: "StreamCanvas Demo",
  description:
    "Use the live StreamCanvas demo to test streamed widgets, sandboxed rendering, host callbacks, and the reference generative UI workflow.",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "StreamCanvas Demo",
    description:
      "Validate the StreamCanvas interaction model with live prompt streaming, widgets, and saved scenario callbacks.",
    url: absoluteUrl("/demo"),
  },
};

export default function DemoPage() {
  return <DemoShell />;
}
