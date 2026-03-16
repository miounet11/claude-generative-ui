import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#050a0d",
    description:
      "Open-source generative UI for AI apps with streamed widgets, safe rendering, and self-hostable deployment.",
    display: "standalone",
    icons: [
      {
        sizes: "any",
        src: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    name: "StreamCanvas",
    short_name: "StreamCanvas",
    start_url: "/",
    theme_color: "#f27405",
  };
}
