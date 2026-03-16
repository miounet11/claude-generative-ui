import {
  chunkText,
  createProgressiveHtmlFrames,
  delay,
  encodeConversationEvent,
  toUint8Array,
  type ConversationMessage,
  type StreamCanvasState,
  type WidgetPayload,
  type WidgetRecord,
} from "@streamcanvas/core";

export interface ThreadRecord {
  id: string;
  messages: ConversationMessage[];
  updatedAt: string;
  widgets: WidgetRecord[];
}

export interface ThreadStoreStats {
  threadCount: number;
  updatedAt: string;
}

export interface ThreadStore {
  getThread: (id: string) => ThreadRecord | null;
  listThreads: () => ThreadRecord[];
  saveState: (id: string, state: StreamCanvasState) => ThreadRecord;
  stats: () => ThreadStoreStats;
}

export interface DemoScenario {
  assistantMessage: string;
  frames?: string[];
  id: string;
  widget: WidgetPayload;
}

function now(): string {
  return new Date().toISOString();
}

export function createMemoryThreadStore(): ThreadStore {
  const threads = new Map<string, ThreadRecord>();

  return {
    getThread(id) {
      return threads.get(id) ?? null;
    },
    listThreads() {
      return [...threads.values()];
    },
    saveState(id, state) {
      const record: ThreadRecord = {
        id,
        messages: state.messages,
        updatedAt: now(),
        widgets: state.widgets,
      };

      threads.set(id, record);
      return record;
    },
    stats() {
      return {
        threadCount: threads.size,
        updatedAt: now(),
      };
    },
  };
}

export function createHealthSnapshot(store?: ThreadStore) {
  return {
    runtime: "streamcanvas-demo-server",
    status: "ok",
    threadCount: store?.stats().threadCount ?? 0,
    timestamp: now(),
    version: "0.1.0",
  };
}

function analyticsFrames(title: string): string[] {
  return [
    `
      <style>
        .sc-hero { display:grid; gap:14px; }
        .sc-eyebrow { color:#67d5c4; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
      </style>
      <section class="sc-hero">
        <div class="sc-eyebrow">Growth cockpit</div>
        <div class="sc-title">${title}</div>
        <div class="sc-copy">Pipeline quality is healthy, but activation is lagging new lead volume. This widget streams its structure before the detail view.</div>
      </section>
    `,
    `
      <style>
        .sc-hero { display:grid; gap:14px; }
        .sc-eyebrow { color:#67d5c4; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
        .sc-metrics { display:grid; gap:12px; grid-template-columns:repeat(3, minmax(0, 1fr)); }
        .sc-metric { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
        .sc-label { color:rgba(244,240,229,0.52); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; }
        .sc-value { font-size:28px; font-weight:700; margin-top:8px; }
        .sc-delta { color:#67d5c4; margin-top:6px; }
      </style>
      <section class="sc-hero">
        <div class="sc-eyebrow">Growth cockpit</div>
        <div class="sc-title">${title}</div>
        <div class="sc-copy">Pipeline quality is healthy, but activation is lagging new lead volume. This widget streams its structure before the detail view.</div>
        <div class="sc-metrics">
          <div class="sc-metric"><div class="sc-label">Qualified pipeline</div><div class="sc-value">$2.4M</div><div class="sc-delta">+14% week on week</div></div>
          <div class="sc-metric"><div class="sc-label">Activation rate</div><div class="sc-value">38%</div><div class="sc-delta">-3 pts after volume spike</div></div>
          <div class="sc-metric"><div class="sc-label">Sales cycle</div><div class="sc-value">27d</div><div class="sc-delta">Stable in enterprise segment</div></div>
        </div>
      </section>
    `,
    `
      <style>
        .sc-hero { display:grid; gap:14px; }
        .sc-eyebrow { color:#67d5c4; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
        .sc-metrics { display:grid; gap:12px; grid-template-columns:repeat(3, minmax(0, 1fr)); }
        .sc-metric, .sc-panel { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
        .sc-label { color:rgba(244,240,229,0.52); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; }
        .sc-value { font-size:28px; font-weight:700; margin-top:8px; }
        .sc-delta { color:#67d5c4; margin-top:6px; }
        .sc-grid { display:grid; gap:12px; grid-template-columns:1.4fr 0.9fr; }
        .sc-list { display:grid; gap:10px; margin-top:12px; }
        .sc-item { background:rgba(8,17,23,0.72); border-radius:12px; padding:10px 12px; }
        .sc-bar { fill:url(#barGradient); }
        .sc-axis { stroke:rgba(244,240,229,0.18); stroke-width:1; }
      </style>
      <section class="sc-hero">
        <div class="sc-eyebrow">Growth cockpit</div>
        <div class="sc-title">${title}</div>
        <div class="sc-copy">Pipeline quality is healthy, but activation is lagging new lead volume. This widget streams its structure before the detail view.</div>
        <div class="sc-metrics">
          <div class="sc-metric"><div class="sc-label">Qualified pipeline</div><div class="sc-value">$2.4M</div><div class="sc-delta">+14% week on week</div></div>
          <div class="sc-metric"><div class="sc-label">Activation rate</div><div class="sc-value">38%</div><div class="sc-delta">-3 pts after volume spike</div></div>
          <div class="sc-metric"><div class="sc-label">Sales cycle</div><div class="sc-value">27d</div><div class="sc-delta">Stable in enterprise segment</div></div>
        </div>
        <div class="sc-grid">
          <div class="sc-panel">
            <div class="sc-label">Conversion by motion</div>
            <svg viewBox="0 0 440 220" width="100%" height="220" role="img" aria-label="Conversion by motion">
              <defs>
                <linearGradient id="barGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stop-color="#67d5c4"></stop>
                  <stop offset="100%" stop-color="#1f7c74"></stop>
                </linearGradient>
              </defs>
              <line class="sc-axis" x1="30" x2="410" y1="180" y2="180"></line>
              <rect class="sc-bar" x="55" y="90" width="72" height="90" rx="10"></rect>
              <rect class="sc-bar" x="180" y="60" width="72" height="120" rx="10"></rect>
              <rect class="sc-bar" x="305" y="108" width="72" height="72" rx="10"></rect>
              <text x="70" y="205" fill="#f4f0e5">SMB</text>
              <text x="190" y="205" fill="#f4f0e5">Mid-market</text>
              <text x="325" y="205" fill="#f4f0e5">Enterprise</text>
            </svg>
          </div>
          <div class="sc-panel">
            <div class="sc-label">Immediate actions</div>
            <div class="sc-list">
              <div class="sc-item">Route launch leads into a shorter activation sequence.</div>
              <div class="sc-item">Re-price the enterprise pilot to cut procurement delay.</div>
              <div class="sc-item">Protect SDR capacity from top-of-funnel noise.</div>
            </div>
          </div>
        </div>
      </section>
    `,
    `
      <style>
        .sc-hero { display:grid; gap:14px; }
        .sc-eyebrow { color:#67d5c4; font-size:12px; letter-spacing:0.18em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
        .sc-metrics { display:grid; gap:12px; grid-template-columns:repeat(3, minmax(0, 1fr)); }
        .sc-metric, .sc-panel { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
        .sc-label { color:rgba(244,240,229,0.52); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; }
        .sc-value { font-size:28px; font-weight:700; margin-top:8px; }
        .sc-delta { color:#67d5c4; margin-top:6px; }
        .sc-grid { display:grid; gap:12px; grid-template-columns:1.4fr 0.9fr; }
        .sc-list { display:grid; gap:10px; margin-top:12px; }
        .sc-item { background:rgba(8,17,23,0.72); border-radius:12px; padding:10px 12px; }
        .sc-bar { fill:url(#barGradient); }
        .sc-axis { stroke:rgba(244,240,229,0.18); stroke-width:1; }
        .sc-actions { display:flex; flex-wrap:wrap; gap:10px; }
        .sc-button { background:#f27405; border:none; border-radius:999px; color:#081117; cursor:pointer; font-weight:700; padding:12px 16px; }
        .sc-secondary { background:transparent; border:1px solid rgba(244,240,229,0.22); color:#f4f0e5; }
      </style>
      <section class="sc-hero">
        <div class="sc-eyebrow">Growth cockpit</div>
        <div class="sc-title">${title}</div>
        <div class="sc-copy">Pipeline quality is healthy, but activation is lagging new lead volume. This widget streams its structure before the detail view.</div>
        <div class="sc-metrics">
          <div class="sc-metric"><div class="sc-label">Qualified pipeline</div><div class="sc-value">$2.4M</div><div class="sc-delta">+14% week on week</div></div>
          <div class="sc-metric"><div class="sc-label">Activation rate</div><div class="sc-value">38%</div><div class="sc-delta">-3 pts after volume spike</div></div>
          <div class="sc-metric"><div class="sc-label">Sales cycle</div><div class="sc-value">27d</div><div class="sc-delta">Stable in enterprise segment</div></div>
        </div>
        <div class="sc-grid">
          <div class="sc-panel">
            <div class="sc-label">Conversion by motion</div>
            <svg viewBox="0 0 440 220" width="100%" height="220" role="img" aria-label="Conversion by motion">
              <defs>
                <linearGradient id="barGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stop-color="#67d5c4"></stop>
                  <stop offset="100%" stop-color="#1f7c74"></stop>
                </linearGradient>
              </defs>
              <line class="sc-axis" x1="30" x2="410" y1="180" y2="180"></line>
              <rect class="sc-bar" x="55" y="90" width="72" height="90" rx="10"></rect>
              <rect class="sc-bar" x="180" y="60" width="72" height="120" rx="10"></rect>
              <rect class="sc-bar" x="305" y="108" width="72" height="72" rx="10"></rect>
              <text x="70" y="205" fill="#f4f0e5">SMB</text>
              <text x="190" y="205" fill="#f4f0e5">Mid-market</text>
              <text x="325" y="205" fill="#f4f0e5">Enterprise</text>
            </svg>
          </div>
          <div class="sc-panel">
            <div class="sc-label">Immediate actions</div>
            <div class="sc-list">
              <div class="sc-item">Route launch leads into a shorter activation sequence.</div>
              <div class="sc-item">Re-price the enterprise pilot to cut procurement delay.</div>
              <div class="sc-item">Protect SDR capacity from top-of-funnel noise.</div>
            </div>
          </div>
        </div>
        <div class="sc-actions">
          <button class="sc-button" data-sc-event="refresh" data-sc-label="Refresh conversion view">Refresh scenario</button>
          <button class="sc-button sc-secondary" data-sc-tool="bookmarkScenario" data-sc-label="Save scenario" name="scenario" value="analytics">Save snapshot</button>
        </div>
      </section>
    `,
  ];
}

function operatingPlanFrames(): string[] {
  return [
    `
      <style>
        .sc-panel { display:grid; gap:14px; }
        .sc-kicker { color:#f4b26c; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
      </style>
      <section class="sc-panel">
        <div class="sc-kicker">Operating plan</div>
        <div class="sc-title">Quarterly launch brief</div>
        <div class="sc-copy">Use the buttons below to signal what kind of follow-up the host application should run.</div>
      </section>
    `,
    `
      <style>
        .sc-panel { display:grid; gap:14px; }
        .sc-kicker { color:#f4b26c; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
        .sc-grid { display:grid; gap:12px; grid-template-columns:1fr 1fr; }
        .sc-card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
        .sc-card h3 { margin:0 0 8px; font-size:16px; }
        .sc-card p { color:rgba(244,240,229,0.72); line-height:1.55; margin:0; }
      </style>
      <section class="sc-panel">
        <div class="sc-kicker">Operating plan</div>
        <div class="sc-title">Quarterly launch brief</div>
        <div class="sc-copy">Use the buttons below to signal what kind of follow-up the host application should run.</div>
        <div class="sc-grid">
          <div class="sc-card"><h3>What changed</h3><p>Awareness is up after the announcement, but the self-serve funnel needs clearer qualification.</p></div>
          <div class="sc-card"><h3>Where to focus</h3><p>Keep onboarding short for lower-intent traffic and route expansion opportunities to sales faster.</p></div>
        </div>
      </section>
    `,
    `
      <style>
        .sc-panel { display:grid; gap:14px; }
        .sc-kicker { color:#f4b26c; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; }
        .sc-title { font-size:32px; font-weight:700; letter-spacing:-0.04em; }
        .sc-copy { color:rgba(244,240,229,0.72); line-height:1.6; max-width:60ch; }
        .sc-grid { display:grid; gap:12px; grid-template-columns:1fr 1fr; }
        .sc-card, .sc-form { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:18px; padding:14px; }
        .sc-card h3 { margin:0 0 8px; font-size:16px; }
        .sc-card p { color:rgba(244,240,229,0.72); line-height:1.55; margin:0; }
        .sc-form { display:grid; gap:10px; }
        .sc-label { color:rgba(244,240,229,0.52); font-size:11px; letter-spacing:0.14em; text-transform:uppercase; }
        .sc-input { background:#081117; border:1px solid rgba(244,240,229,0.12); border-radius:12px; color:#f4f0e5; padding:12px; width:100%; }
        .sc-actions { display:flex; gap:10px; }
        .sc-button { background:#64d8c2; border:none; border-radius:999px; color:#081117; cursor:pointer; font-weight:700; padding:12px 16px; }
        .sc-secondary { background:transparent; border:1px solid rgba(244,240,229,0.22); color:#f4f0e5; }
      </style>
      <section class="sc-panel">
        <div class="sc-kicker">Operating plan</div>
        <div class="sc-title">Quarterly launch brief</div>
        <div class="sc-copy">Use the buttons below to signal what kind of follow-up the host application should run.</div>
        <div class="sc-grid">
          <div class="sc-card"><h3>What changed</h3><p>Awareness is up after the announcement, but the self-serve funnel needs clearer qualification.</p></div>
          <div class="sc-card"><h3>Where to focus</h3><p>Keep onboarding short for lower-intent traffic and route expansion opportunities to sales faster.</p></div>
        </div>
        <form class="sc-form" data-sc-tool="bookmarkScenario" data-sc-event="submit_brief">
          <div class="sc-label">Decision note</div>
          <input class="sc-input" name="summary" value="Protect onboarding conversion while sales prioritizes enterprise trials." />
          <div class="sc-actions">
            <button class="sc-button" type="submit">Save brief</button>
            <button class="sc-button sc-secondary" data-sc-event="share_brief" type="button">Share with operator</button>
          </div>
        </form>
      </section>
    `,
  ];
}

export function pickDemoScenario(input: string): DemoScenario {
  const prompt = input.toLowerCase();

  if (
    prompt.includes("launch") ||
    prompt.includes("backlog") ||
    prompt.includes("workflow") ||
    prompt.includes("task")
  ) {
    return {
      id: "launch-board",
      assistantMessage:
        "I turned the prompt into an operational board so the team can see owners, sequencing, and execution risk in one surface.",
      widget: {
        id: "launch-board-widget",
        title: "Launch control board",
        kind: "component",
        component: {
          name: "task-board",
          props: {
            title: "Launch control board",
            items: [
              {
                id: "capture-proof",
                owner: "Product marketing",
                priority: "Now",
                status: "In motion",
                title: "Capture three customer proof points for the release page",
              },
              {
                id: "trim-onboarding",
                owner: "Growth",
                priority: "Now",
                status: "Blocked",
                title: "Remove one step from onboarding before launch traffic lands",
              },
              {
                id: "partner-brief",
                owner: "Founders",
                priority: "Next",
                status: "Queued",
                title: "Brief five design partners with the new positioning deck",
              },
            ],
            subtitle:
              "A component widget demonstrates schema-validated rendering without injecting raw HTML.",
          },
        },
        height: 540,
        html: "",
        libraries: ["svg"],
        loadingMessages: ["Sequencing launch tasks"],
        width: 960,
      },
    };
  }

  if (
    prompt.includes("sales") ||
    prompt.includes("dashboard") ||
    prompt.includes("analytics") ||
    prompt.includes("growth")
  ) {
    const frames = analyticsFrames("Revenue motion dashboard");
    return {
      assistantMessage:
        "I built a revenue dashboard with clear actions so the output is useful before the full chart and action layer land.",
      frames,
      id: "revenue-dashboard",
      widget: {
        id: "revenue-dashboard-widget",
        title: "Revenue motion dashboard",
        kind: "html",
        height: 680,
        html: frames.at(-1) ?? "",
        libraries: ["svg"],
        loadingMessages: ["Streaming KPI shell", "Rendering conversion view"],
        width: 980,
      },
    };
  }

  const frames = operatingPlanFrames();
  return {
    assistantMessage:
      "I framed the answer as an operating brief with host callbacks, so the demo shows both progressive rendering and event handling.",
    frames,
    id: "operating-brief",
    widget: {
      id: "operating-brief-widget",
      title: "Quarterly launch brief",
      kind: "html",
      height: 620,
      html: frames.at(-1) ?? "",
      libraries: ["svg"],
      loadingMessages: ["Drafting brief", "Linking operator actions"],
      width: 940,
    },
  };
}

export function createDemoConversationStream(
  input: string,
  options: {
    latencyMs?: number;
  } = {},
): ReadableStream<Uint8Array> {
  const latencyMs = options.latencyMs ?? 120;
  const scenario = pickDemoScenario(input);
  const assistantMessageId = `${scenario.id}-assistant`;
  const widgetFrames =
    scenario.frames ??
    createProgressiveHtmlFrames(scenario.widget.html ?? "", 4);

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "status",
            phase: "streaming",
            label: "Planning response",
          }),
        ),
      );
      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "message.created",
            message: {
              id: assistantMessageId,
              role: "assistant",
              content: "",
              status: "streaming",
              createdAt: now(),
            },
          }),
        ),
      );

      for (const chunk of chunkText(scenario.assistantMessage, 5)) {
        await delay(latencyMs);
        controller.enqueue(
          toUint8Array(
            encodeConversationEvent({
              type: "message.delta",
              id: assistantMessageId,
              delta: chunk,
            }),
          ),
        );
      }

      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "message.complete",
            id: assistantMessageId,
          }),
        ),
      );

      await delay(latencyMs);
      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "widget.created",
            widget: {
              ...scenario.widget,
              html: scenario.widget.kind === "html" ? "" : scenario.widget.html,
            },
          }),
        ),
      );

      if (scenario.widget.kind === "html") {
        for (const frame of widgetFrames) {
          await delay(latencyMs);
          controller.enqueue(
            toUint8Array(
              encodeConversationEvent({
                type: "widget.delta",
                id: scenario.widget.id,
                html: frame,
                append: false,
              }),
            ),
          );
        }
      }

      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "widget.complete",
            id: scenario.widget.id,
          }),
        ),
      );
      controller.enqueue(
        toUint8Array(
          encodeConversationEvent({
            type: "status",
            phase: "completed",
            label: "Ready for another prompt",
          }),
        ),
      );
      controller.close();
    },
  });
}
