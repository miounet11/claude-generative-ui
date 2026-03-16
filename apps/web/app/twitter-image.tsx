import { ImageResponse } from "next/og";

export const alt = "StreamCanvas";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background:
            "radial-gradient(circle at top left, rgba(242, 116, 5, 0.28), transparent 34%), radial-gradient(circle at top right, rgba(100, 216, 194, 0.22), transparent 28%), linear-gradient(180deg, #050a0d 0%, #0b1418 100%)",
          color: "#f4f0e5",
          display: "flex",
          fontFamily: "Avenir Next, Segoe UI, sans-serif",
          height: "100%",
          padding: "56px",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(244, 240, 229, 0.16)",
            borderRadius: "32px",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              maxWidth: "760px",
            }}
          >
            <div
              style={{
                color: "rgba(244, 240, 229, 0.72)",
                fontSize: "24px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            >
              StreamCanvas
            </div>
            <div
              style={{
                fontFamily: "Iowan Old Style, Palatino Linotype, serif",
                fontSize: "84px",
                letterSpacing: "-0.06em",
                lineHeight: 0.94,
              }}
            >
              Open-source Claude-style generative UI, built to ship.
            </div>
            <div
              style={{
                color: "rgba(244, 240, 229, 0.84)",
                fontSize: "30px",
                lineHeight: 1.45,
              }}
            >
              Typed streams, sandboxed widgets, React components, and a real
              deployment model.
            </div>
          </div>

          <div
            style={{
              color: "#64d8c2",
              display: "flex",
              fontSize: "24px",
              gap: "20px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <span>Demo</span>
            <span>Docs</span>
            <span>Deploy</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
