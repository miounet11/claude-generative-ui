"use client";

import {
  ChatThread,
  registerClientTool,
  registerGenerativeComponent,
  StreamCanvasProvider,
  useStreamCanvasThread,
  WidgetSurface,
} from "@streamcanvas/react";
import { useDeferredValue, useEffect, useState } from "react";
import { z } from "zod";

import type { SiteLocale } from "../lib/locales";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

const demoContent: Record<
  SiteLocale,
  {
    bookmarksEmpty: string;
    bookmarksLabel: string;
    clearBookmarks: string;
    conversationLabel: string;
    conversationTitle: string;
    demoLabel: string;
    errorsLabel: string;
    heroTitle: string;
    idleLabel: string;
    lastEventEmpty: string;
    lastEventLabel: string;
    messagesLabel: string;
    presetsLabel: string;
    promptLabel: string;
    promptPresets: string[];
    readyLabel: string;
    resetLabel: string;
    resetStatusLabel: string;
    roleLabels: {
      assistant: string;
      system: string;
      user: string;
    };
    runLabel: string;
    savedToolLabel: string;
    statusLabel: string;
    streamLabel: string;
    streamingSuffix: string;
    taskBoardLabel: string;
    telemetryLabel: string;
    threadEmptyState: string;
    widgetsLabel: string;
    widgetLabel: string;
    widgetEmptyState: string;
    widgetTitle: string;
  }
> = {
  en: {
    bookmarksEmpty:
      "Use a widget action that calls bookmarkScenario and the saved scenario will appear here.",
    bookmarksLabel: "Saved scenarios",
    clearBookmarks: "Clear saved scenarios",
    conversationLabel: "Conversation",
    conversationTitle: "Prompt and assistant stream",
    demoLabel: "Reference app",
    errorsLabel: "Errors",
    heroTitle: "Sandboxed widgets, real stream protocol.",
    idleLabel: "Idle",
    lastEventEmpty: "No widget event yet.",
    lastEventLabel: "Last widget event",
    messagesLabel: "Messages",
    presetsLabel: "Suggested prompts",
    promptLabel: "Prompt composer",
    promptPresets: [
      "Build a revenue dashboard for this quarter's pipeline.",
      "Turn this launch plan into an execution board.",
      "Create an operating brief the team can save and share.",
    ],
    readyLabel: "Ready",
    resetLabel: "Reset thread",
    resetStatusLabel: "Thread reset",
    roleLabels: {
      assistant: "Assistant",
      system: "System",
      user: "You",
    },
    runLabel: "Run prompt",
    savedToolLabel: "Streaming…",
    statusLabel: "Thread status",
    streamLabel: "Streaming response",
    streamingSuffix: " / streaming",
    taskBoardLabel: "Component widget",
    telemetryLabel: "Workspace telemetry",
    threadEmptyState:
      "Start with a prompt. The assistant response and widgets stream into the thread.",
    widgetsLabel: "Widgets",
    widgetLabel: "Widget surface",
    widgetEmptyState:
      "Generated widgets appear here with a sandboxed renderer and event bridge.",
    widgetTitle: "Sandboxed render target",
  },
  "zh-CN": {
    bookmarksEmpty:
      "当组件动作调用 bookmarkScenario 时，已保存的场景会显示在这里，方便中国团队快速理解这个演示在做什么。",
    bookmarksLabel: "已保存场景",
    clearBookmarks: "清空已保存场景",
    conversationLabel: "对话流",
    conversationTitle: "Prompt 与助手流式返回",
    demoLabel: "参考应用",
    errorsLabel: "错误",
    heroTitle: "沙箱组件渲染，真实流式协议。",
    idleLabel: "空闲",
    lastEventEmpty: "暂时还没有组件事件。",
    lastEventLabel: "最近一次组件事件",
    messagesLabel: "消息",
    presetsLabel: "推荐 Prompt",
    promptLabel: "Prompt 编辑器",
    promptPresets: [
      "为本季度销售管道生成一个收入仪表盘。",
      "把这个发布计划整理成执行看板。",
      "生成一份可保存和分享的运营简报。",
    ],
    readyLabel: "就绪",
    resetLabel: "重置线程",
    resetStatusLabel: "线程已重置",
    roleLabels: {
      assistant: "助手",
      system: "系统",
      user: "你",
    },
    runLabel: "运行 Prompt",
    savedToolLabel: "流式返回中…",
    statusLabel: "线程状态",
    streamLabel: "正在流式响应",
    streamingSuffix: " / 流式返回中",
    taskBoardLabel: "组件小部件",
    telemetryLabel: "工作区指标",
    threadEmptyState: "从一个 Prompt 开始。助手的回答和组件会以流式方式进入对话。",
    widgetsLabel: "组件",
    widgetLabel: "组件画布",
    widgetEmptyState: "生成的组件会显示在这里，并通过沙箱渲染器和事件桥接与宿主应用协作。",
    widgetTitle: "沙箱渲染目标",
  },
};

function createTaskBoardDefinition(locale: SiteLocale) {
  return registerGenerativeComponent({
    name: "task-board",
    description: "Displays a launch control board with owner, priority, and status.",
    schema: z.object({
      subtitle: z.string(),
      title: z.string(),
      items: z.array(
        z.object({
          id: z.string(),
          owner: z.string(),
          priority: z.string(),
          status: z.string(),
          title: z.string(),
        }),
      ),
    }),
    component: function TaskBoard({ items, subtitle, title }) {
      const copy = demoContent[locale];

      return (
        <section className="task-board">
          <div className="task-board-header">
            <div>
              <div className="mini-label">{copy.taskBoardLabel}</div>
              <h3>{title}</h3>
            </div>
            <div className="task-board-subtitle">{subtitle}</div>
          </div>
          <div className="task-board-list">
            {items.map((item) => (
              <article className="task-card" key={item.id}>
                <div className="task-card-meta">
                  <span>{item.priority}</span>
                  <span>{item.status}</span>
                </div>
                <h4>{item.title}</h4>
                <p>{item.owner}</p>
              </article>
            ))}
          </div>
        </section>
      );
    },
  });
}

const bookmarkScenarioTool = registerClientTool({
  name: "bookmarkScenario",
  description: "Saves the current scenario in local storage for later review.",
  inputSchema: z
    .object({
      scenario: z.string().optional(),
      summary: z.string().optional(),
    })
    .passthrough(),
  async run(input) {
    const nextEntry = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2, 10),
      label: input.summary ?? input.scenario ?? "widget",
      savedAt: new Date().toISOString(),
    };
    const current = loadBookmarks();
    const next = [nextEntry, ...current].slice(0, 6);
    localStorage.setItem(bookmarkStorageKey, JSON.stringify(next));
    return {
      count: next.length,
      saved: nextEntry.label,
    };
  },
});

const bookmarkStorageKey = "streamcanvas.bookmarks";

interface BookmarkEntry {
  id: string;
  label: string;
  savedAt: string;
}

function loadBookmarks(): BookmarkEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(bookmarkStorageKey) ?? "[]") as BookmarkEntry[];
  } catch {
    return [];
  }
}

function DemoWorkspace({
  currentPath,
  locale,
}: {
  currentPath: string;
  locale: SiteLocale;
}) {
  const { isBusy, resetThread, sendPrompt, state } = useStreamCanvasThread();
  const copy = demoContent[locale];
  const [prompt, setPrompt] = useState(copy.promptPresets[0]);
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([]);
  const deferredPrompt = useDeferredValue(prompt);

  const visiblePresets = copy.promptPresets.filter((item) => {
    if (!deferredPrompt.trim()) {
      return true;
    }

    return item.toLowerCase().includes(deferredPrompt.toLowerCase());
  });

  useEffect(() => {
    setBookmarks(loadBookmarks());
  }, [state.lastWidgetEvent, state.messages.length]);

  function submitPrompt(value: string) {
    void sendPrompt(value);
  }

  function resetWorkspace() {
    setPrompt(copy.promptPresets[0]);
    resetThread(copy.resetStatusLabel);
  }

  function clearBookmarks() {
    localStorage.removeItem(bookmarkStorageKey);
    setBookmarks([]);
  }

  return (
    <main className="shell">
      <SiteHeader currentPath={currentPath} locale={locale} />

      <section className="demo-hero">
        <div>
          <div className="eyebrow">{copy.demoLabel}</div>
          <h1 className="hero-title small">{copy.heroTitle}</h1>
        </div>
        <div className="status-panel">
          <div className="mini-label">{copy.statusLabel}</div>
          <strong>{state.statusLabel ?? copy.readyLabel}</strong>
          <span>{isBusy ? copy.streamLabel : copy.idleLabel}</span>
        </div>
      </section>

      <section className="demo-grid">
        <aside className="control-panel">
          <div className="control-card">
            <div className="mini-label">{copy.telemetryLabel}</div>
            <div className="metric-grid">
              <div className="metric-card">
                <strong>{state.messages.length}</strong>
                <span>{copy.messagesLabel}</span>
              </div>
              <div className="metric-card">
                <strong>{state.widgets.length}</strong>
                <span>{copy.widgetsLabel}</span>
              </div>
              <div className="metric-card">
                <strong>{state.errors.length}</strong>
                <span>{copy.errorsLabel}</span>
              </div>
            </div>
          </div>

          <div className="control-card">
            <div className="mini-label">{copy.promptLabel}</div>
            <textarea
              className="prompt-textarea"
              onChange={(event) => setPrompt(event.target.value)}
              value={prompt}
            />
            <div className="button-row">
              <button
                className="primary-button"
                disabled={isBusy}
                onClick={() => submitPrompt(prompt)}
                type="button"
              >
                {isBusy ? copy.savedToolLabel : copy.runLabel}
              </button>
              <button
                className="secondary-button"
                onClick={resetWorkspace}
                type="button"
              >
                {copy.resetLabel}
              </button>
            </div>
          </div>

          <div className="control-card">
            <div className="mini-label">{copy.presetsLabel}</div>
            <div className="prompt-chip-list">
              {visiblePresets.map((preset) => (
                <button
                  className="prompt-chip"
                  key={preset}
                  onClick={() => {
                    setPrompt(preset);
                    submitPrompt(preset);
                  }}
                  type="button"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="control-card">
            <div className="mini-label">{copy.bookmarksLabel}</div>
            {bookmarks.length === 0 ? (
              <div className="empty-state">
                {copy.bookmarksEmpty}
              </div>
            ) : (
              <>
                <div className="bookmark-list">
                  {bookmarks.map((bookmark) => (
                    <article className="bookmark-item" key={bookmark.id}>
                      <strong>{bookmark.label}</strong>
                      <span>{new Date(bookmark.savedAt).toLocaleString()}</span>
                    </article>
                  ))}
                </div>
                <button
                  className="subtle-button"
                  onClick={clearBookmarks}
                  type="button"
                >
                  {copy.clearBookmarks}
                </button>
              </>
            )}
          </div>

          <div className="control-card">
            <div className="mini-label">{copy.lastEventLabel}</div>
            <div className="event-log">
              {state.lastWidgetEvent ? (
                <>
                  <strong>{state.lastWidgetEvent.eventType}</strong>
                  <span>{state.lastWidgetEvent.toolName ?? state.lastWidgetEvent.widgetId}</span>
                </>
              ) : (
                <span>{copy.lastEventEmpty}</span>
              )}
            </div>
          </div>
        </aside>

        <div className="workspace-grid">
          <section className="workspace-column">
            <div className="section-header">
              <div className="mini-label">{copy.conversationLabel}</div>
              <strong>{copy.conversationTitle}</strong>
            </div>
            <ChatThread
              emptyState={copy.threadEmptyState}
              roleLabels={copy.roleLabels}
              streamingSuffix={copy.streamingSuffix}
            />
          </section>

          <section className="workspace-column">
            <div className="section-header">
              <div className="mini-label">{copy.widgetLabel}</div>
              <strong>{copy.widgetTitle}</strong>
            </div>
            <WidgetSurface emptyState={copy.widgetEmptyState} />
          </section>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  );
}

export function DemoShell({
  currentPath = "/demo",
  locale = "en",
}: {
  currentPath?: string;
  locale?: SiteLocale;
}) {
  return (
    <StreamCanvasProvider
      components={[createTaskBoardDefinition(locale)]}
      endpoint={`/api/demo?locale=${encodeURIComponent(locale)}`}
      tools={[bookmarkScenarioTool]}
    >
      <DemoWorkspace currentPath={currentPath} locale={locale} />
    </StreamCanvasProvider>
  );
}
