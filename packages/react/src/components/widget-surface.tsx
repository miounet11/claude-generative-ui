"use client";

import { sanitizeWidgetHtml } from "@streamcanvas/core";
import type { WidgetClientEvent, WidgetRecord } from "@streamcanvas/core";
import { createElement, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { useStreamCanvasThread } from "../provider";

export interface WidgetSurfaceProps {
  allowUnsafeHtml?: boolean;
  className?: string;
  emptyState?: string;
  widgetId?: string;
}

function createWidgetShell(widgetId: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root {
        color-scheme: dark;
        font-family: "Avenir Next", "Segoe UI", sans-serif;
      }
      * {
        box-sizing: border-box;
      }
      html, body {
        margin: 0;
        min-height: 100%;
        background:
          radial-gradient(circle at top right, rgba(59, 180, 165, 0.16), transparent 35%),
          linear-gradient(180deg, #081117 0%, #0d171d 100%);
        color: #f4f0e5;
      }
      body {
        padding: 16px;
      }
      #root {
        display: grid;
        gap: 12px;
      }
      @keyframes streamcanvas-pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
      }
      .streamcanvas-shell {
        animation: streamcanvas-pulse 1.6s ease-in-out infinite;
        color: rgba(244, 240, 229, 0.66);
        border: 1px dashed rgba(244, 240, 229, 0.18);
        border-radius: 18px;
        padding: 16px;
      }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="streamcanvas-shell">Waiting for widget content…</div>
    </div>
    <script>
      const widgetId = ${JSON.stringify(widgetId)};
      const root = document.getElementById("root");

      function collectPayload(node) {
        const payload = {};
        for (const [key, value] of Object.entries(node.dataset || {})) {
          payload[key] = value;
        }

        const form = node.closest("form");
        if (form) {
          const data = new FormData(form);
          for (const [key, value] of data.entries()) {
            payload[key] = typeof value === "string" ? value : String(value);
          }
        }

        return payload;
      }

      window.addEventListener("message", (event) => {
        const data = event.data;
        if (!data || data.type !== "streamcanvas:render" || data.widgetId !== widgetId) {
          return;
        }

        root.innerHTML = data.html || "";
      });

      document.addEventListener("click", (event) => {
        const target = event.target.closest("[data-sc-event], [data-sc-tool]");
        if (!target) {
          return;
        }

        event.preventDefault();
        parent.postMessage(
          {
            type: "streamcanvas:event",
            widgetId,
            eventType: target.dataset.scEvent || "click",
            toolName: target.dataset.scTool || undefined,
            payload: collectPayload(target),
          },
          "*",
        );
      });

      document.addEventListener("submit", (event) => {
        const form = event.target.closest("form[data-sc-event], form[data-sc-tool]");
        if (!form) {
          return;
        }

        event.preventDefault();
        parent.postMessage(
          {
            type: "streamcanvas:event",
            widgetId,
            eventType: form.dataset.scEvent || "submit",
            toolName: form.dataset.scTool || undefined,
            payload: collectPayload(form),
          },
          "*",
        );
      });
    </script>
  </body>
</html>`;
}

function HtmlWidgetFrame({
  allowUnsafeHtml = false,
  onEvent,
  widget,
}: {
  allowUnsafeHtml?: boolean;
  onEvent: (event: WidgetClientEvent) => Promise<void>;
  widget: WidgetRecord;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const payload = event.data as
        | ({
            type?: string;
          } & WidgetClientEvent)
        | undefined;

      if (!payload || payload.type !== "streamcanvas:event") {
        return;
      }

      if (payload.widgetId !== widget.id) {
        return;
      }

      void onEvent({
        widgetId: payload.widgetId,
        eventType: payload.eventType,
        toolName: payload.toolName,
        payload: payload.payload ?? {},
      });
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onEvent, widget.id]);

  useEffect(() => {
    if (!isReady || !iframeRef.current?.contentWindow) {
      return;
    }

    iframeRef.current.contentWindow.postMessage(
      {
        type: "streamcanvas:render",
        widgetId: widget.id,
        html: sanitizeWidgetHtml(widget.html, {
          allowUnsafeHtml,
        }),
      },
      "*",
    );
  }, [allowUnsafeHtml, isReady, widget.html, widget.id]);

  return (
    <iframe
      ref={iframeRef}
      onLoad={() => setIsReady(true)}
      sandbox="allow-forms allow-scripts"
      srcDoc={createWidgetShell(widget.id)}
      style={{
        border: "0",
        borderRadius: "1rem",
        minHeight: widget.height,
        overflow: "hidden",
        width: "100%",
      }}
      title={widget.title}
    />
  );
}

function ComponentWidget({ widget }: { widget: WidgetRecord }) {
  const { components } = useStreamCanvasThread();

  if (!widget.component) {
    return (
      <div style={{ color: "#f4f0e5" }}>
        Component widget declared without a component payload.
      </div>
    );
  }

  const definition = components.find((item) => item.name === widget.component?.name);

  if (!definition) {
    return (
      <div style={{ color: "#f4f0e5" }}>
        No component named <strong>{widget.component.name}</strong> is registered.
      </div>
    );
  }

  const propsResult = definition.schema.safeParse(widget.component.props);

  if (!propsResult.success) {
    return (
      <div style={{ color: "#f4f0e5" }}>
        Props for <strong>{widget.component.name}</strong> failed validation.
      </div>
    );
  }

  return createElement(
    definition.component as (props: Record<string, unknown>) => ReactNode,
    propsResult.data as Record<string, unknown>,
  );
}

function WidgetCard({
  allowUnsafeHtml = false,
  widget,
}: {
  allowUnsafeHtml?: boolean;
  widget: WidgetRecord;
}) {
  const { handleWidgetEvent } = useStreamCanvasThread();

  return (
    <article
      style={{
        background: "rgba(11, 15, 18, 0.72)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "1.35rem",
        overflow: "hidden",
      }}
    >
      <header
        style={{
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex",
          gap: "0.75rem",
          justifyContent: "space-between",
          padding: "0.95rem 1.1rem",
        }}
      >
        <div>
          <div
            style={{
              color: "rgba(244, 240, 229, 0.52)",
              fontSize: "0.72rem",
              letterSpacing: "0.16em",
              marginBottom: "0.3rem",
              textTransform: "uppercase",
            }}
          >
            Widget
          </div>
          <div style={{ color: "#f4f0e5", fontSize: "1rem", fontWeight: 600 }}>
            {widget.title}
          </div>
        </div>
        <div
          style={{
            color:
              widget.status === "error"
                ? "#ff8f7a"
                : widget.status === "complete"
                  ? "#64d8c2"
                  : "#f4b26c",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {widget.status}
        </div>
      </header>
      <div style={{ padding: "1rem" }}>
        {widget.kind === "component" ? (
          <ComponentWidget widget={widget} />
        ) : (
          <HtmlWidgetFrame
            allowUnsafeHtml={allowUnsafeHtml}
            onEvent={handleWidgetEvent}
            widget={widget}
          />
        )}
        {widget.error ? (
          <div
            style={{
              color: "#ff8f7a",
              fontSize: "0.88rem",
              marginTop: "0.75rem",
            }}
          >
            {widget.error}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function WidgetSurface({
  allowUnsafeHtml = false,
  className,
  emptyState = "Generated widgets appear here with a sandboxed renderer and event bridge.",
  widgetId,
}: WidgetSurfaceProps) {
  const { state } = useStreamCanvasThread();
  const widgets = widgetId
    ? state.widgets.filter((widget) => widget.id === widgetId)
    : state.widgets;

  return (
    <div className={className} style={{ display: "grid", gap: "1rem" }}>
      {widgets.length === 0 ? (
        <div
          style={{
            border: "1px dashed rgba(255,255,255,0.18)",
            borderRadius: "1.25rem",
            color: "rgba(244, 240, 229, 0.68)",
            padding: "1.25rem",
          }}
        >
          {emptyState}
        </div>
      ) : null}
      {widgets.map((widget) => (
        <WidgetCard
          key={widget.id}
          allowUnsafeHtml={allowUnsafeHtml}
          widget={widget}
        />
      ))}
    </div>
  );
}
