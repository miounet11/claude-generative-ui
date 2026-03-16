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

type DemoLocale = "en" | "zh-CN";

function now(): string {
  return new Date().toISOString();
}

function normalizeDemoLocale(value?: string): DemoLocale {
  if (value === "zh" || value === "zh-CN" || value === "zh-Hans") {
    return "zh-CN";
  }

  return "en";
}

function includesAny(input: string, values: string[]): boolean {
  return values.some((value) => input.includes(value));
}

function localizeDemoHtml(html: string, locale: DemoLocale): string {
  if (locale === "en") {
    return html;
  }

  const replacements: Array<[string, string]> = [
    ["Growth cockpit", "增长驾驶舱"],
    ["Pipeline quality is healthy, but activation is lagging new lead volume. This widget streams its structure before the detail view.", "销售管道质量保持健康，但激活率落后于新增线索增速。这个组件会先流式展示结构，再逐步补全细节。"],
    ["Qualified pipeline", "高质量销售管道"],
    ["Activation rate", "激活率"],
    ["Sales cycle", "销售周期"],
    ["+14% week on week", "周环比 +14%"],
    ["-3 pts after volume spike", "流量放大后下降 3 个点"],
    ["Stable in enterprise segment", "企业客户段保持稳定"],
    ["Conversion by motion", "不同增长动作的转化"],
    ["Immediate actions", "优先动作"],
    ["Route launch leads into a shorter activation sequence.", "将发布流量引导进更短的激活路径。"],
    ["Re-price the enterprise pilot to cut procurement delay.", "重新设计企业试点报价，缩短采购延迟。"],
    ["Protect SDR capacity from top-of-funnel noise.", "保护 SDR 资源，减少低质量线索噪音。"],
    ["Refresh scenario", "刷新场景"],
    ["Save snapshot", "保存快照"],
    ["Operating plan", "运营计划"],
    ["Quarterly launch brief", "季度发布简报"],
    ["Use the buttons below to signal what kind of follow-up the host application should run.", "使用下面的操作按钮，让宿主应用知道下一步需要执行哪种后续流程。"],
    ["What changed", "发生了什么变化"],
    ["Where to focus", "应该聚焦哪里"],
    ["Awareness is up after the announcement, but the self-serve funnel needs clearer qualification.", "公告发布后认知度有所提升，但自助转化漏斗还需要更清晰的资格判断。"],
    ["Keep onboarding short for lower-intent traffic and route expansion opportunities to sales faster.", "针对低意向流量保持更短的 onboarding，并把扩张机会更快交给销售。"],
    ["Decision note", "决策备注"],
    ["Protect onboarding conversion while sales prioritizes enterprise trials.", "在销售优先跟进企业试点时，优先保护 onboarding 转化率。"],
    ["Save brief", "保存简报"],
    ["Share with operator", "分享给运营负责人"],
    ["SMB", "中小企业"],
    ["Mid-market", "中型市场"],
    ["Enterprise", "企业"],
  ];

  return replacements.reduce((next, [from, to]) => next.replaceAll(from, to), html);
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

function analyticsFrames(title: string, locale: DemoLocale = "en"): string[] {
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
  ].map((frame) => localizeDemoHtml(frame, locale));
}

function operatingPlanFrames(locale: DemoLocale = "en"): string[] {
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
  ].map((frame) => localizeDemoHtml(frame, locale));
}

export function pickDemoScenario(input: string, localeInput?: string): DemoScenario {
  const prompt = input.toLowerCase();
  const locale = normalizeDemoLocale(localeInput);
  const isChinese = locale === "zh-CN";

  if (
    includesAny(prompt, ["launch", "backlog", "workflow", "task", "发布", "看板", "执行", "任务"])
  ) {
    return {
      id: "launch-board",
      assistantMessage:
        isChinese
          ? "我把这个请求整理成了一个执行看板，让团队在一个界面里同时看到负责人、优先级和执行风险。"
          : "I turned the prompt into an operational board so the team can see owners, sequencing, and execution risk in one surface.",
      widget: {
        id: "launch-board-widget",
        title: isChinese ? "发布执行看板" : "Launch control board",
        kind: "component",
        component: {
          name: "task-board",
          props: {
            title: isChinese ? "发布执行看板" : "Launch control board",
            items: [
              {
                id: "capture-proof",
                owner: isChinese ? "产品营销" : "Product marketing",
                priority: isChinese ? "当前" : "Now",
                status: isChinese ? "进行中" : "In motion",
                title: isChinese
                  ? "为发布页补齐 3 条客户证据素材"
                  : "Capture three customer proof points for the release page",
              },
              {
                id: "trim-onboarding",
                owner: isChinese ? "增长团队" : "Growth",
                priority: isChinese ? "当前" : "Now",
                status: isChinese ? "阻塞中" : "Blocked",
                title: isChinese
                  ? "在发布流量到来前，先从 onboarding 中删掉一个步骤"
                  : "Remove one step from onboarding before launch traffic lands",
              },
              {
                id: "partner-brief",
                owner: isChinese ? "创始团队" : "Founders",
                priority: isChinese ? "下一步" : "Next",
                status: isChinese ? "待排队" : "Queued",
                title: isChinese
                  ? "用新的定位材料向 5 家设计伙伴同步发布方案"
                  : "Brief five design partners with the new positioning deck",
              },
            ],
            subtitle:
              isChinese
                ? "这个组件模式演示了经过 Schema 校验的渲染路径，无需把原始 HTML 注入宿主页面。"
                : "A component widget demonstrates schema-validated rendering without injecting raw HTML.",
          },
        },
        height: 540,
        html: "",
        libraries: ["svg"],
        loadingMessages: [isChinese ? "正在整理发布任务" : "Sequencing launch tasks"],
        width: 960,
      },
    };
  }

  if (
    includesAny(prompt, ["sales", "dashboard", "analytics", "growth", "销售", "仪表盘", "分析", "增长"])
  ) {
    const frames = analyticsFrames(
      isChinese ? "收入增长仪表盘" : "Revenue motion dashboard",
      locale,
    );
    return {
      assistantMessage:
        isChinese
          ? "我生成了一个带明确行动建议的收入仪表盘，让用户在完整图表和动作层尚未全部到位之前就已经能开始使用。"
          : "I built a revenue dashboard with clear actions so the output is useful before the full chart and action layer land.",
      frames,
      id: "revenue-dashboard",
      widget: {
        id: "revenue-dashboard-widget",
        title: isChinese ? "收入增长仪表盘" : "Revenue motion dashboard",
        kind: "html",
        height: 680,
        html: frames.at(-1) ?? "",
        libraries: ["svg"],
        loadingMessages: isChinese
          ? ["正在流式生成 KPI 外壳", "正在渲染转化视图"]
          : ["Streaming KPI shell", "Rendering conversion view"],
        width: 980,
      },
    };
  }

  const frames = operatingPlanFrames(locale);
  return {
    assistantMessage:
      isChinese
        ? "我把答案组织成了一份带宿主回调的运营简报，因此这个演示能同时展示渐进式渲染和事件处理。"
        : "I framed the answer as an operating brief with host callbacks, so the demo shows both progressive rendering and event handling.",
    frames,
    id: "operating-brief",
    widget: {
      id: "operating-brief-widget",
      title: isChinese ? "季度发布简报" : "Quarterly launch brief",
      kind: "html",
      height: 620,
      html: frames.at(-1) ?? "",
      libraries: ["svg"],
      loadingMessages: isChinese
        ? ["正在起草简报", "正在连接运营动作"]
        : ["Drafting brief", "Linking operator actions"],
      width: 940,
    },
  };
}

export function createDemoConversationStream(
  input: string,
  options: {
    latencyMs?: number;
    locale?: string;
  } = {},
): ReadableStream<Uint8Array> {
  const latencyMs = options.latencyMs ?? 120;
  const locale = normalizeDemoLocale(options.locale);
  const scenario = pickDemoScenario(input, locale);
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
            label: locale === "zh-CN" ? "正在规划响应" : "Planning response",
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
            label: locale === "zh-CN" ? "可以继续输入新的 Prompt" : "Ready for another prompt",
          }),
        ),
      );
      controller.close();
    },
  });
}
