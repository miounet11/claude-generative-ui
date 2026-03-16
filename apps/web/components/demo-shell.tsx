"use client";

import {
  ChatThread,
  registerClientTool,
  registerGenerativeComponent,
  StreamCanvasProvider,
  useStreamCanvasThread,
  WidgetSurface,
} from "@streamcanvas/react";
import { useDeferredValue, useState } from "react";
import { z } from "zod";

const taskBoardDefinition = registerGenerativeComponent({
  name: "task-board",
  description: "Displays a launch control board with owner, priority, and status.",
  schema: z.object({
    subtitle: z.string(),
    title: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        owner: z.string(),
        priority: z.enum(["Now", "Next", "Later"]),
        status: z.string(),
        title: z.string(),
      }),
    ),
  }),
  component: function TaskBoard({ items, subtitle, title }) {
    return (
      <section className="task-board">
        <div className="task-board-header">
          <div>
            <div className="mini-label">Component widget</div>
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
    const storageKey = "streamcanvas.bookmarks";
    const nextEntry = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2, 10),
      label: input.summary ?? input.scenario ?? "widget",
      savedAt: new Date().toISOString(),
    };
    const current = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as {
      id: string;
      label: string;
      savedAt: string;
    }[];
    const next = [nextEntry, ...current].slice(0, 6);
    localStorage.setItem(storageKey, JSON.stringify(next));
    return {
      count: next.length,
      saved: nextEntry.label,
    };
  },
});

const promptPresets = [
  "Build a revenue dashboard for this quarter's pipeline.",
  "Turn this launch plan into an execution board.",
  "Create an operating brief the team can save and share.",
];

function DemoWorkspace() {
  const { isBusy, sendPrompt, state } = useStreamCanvasThread();
  const [prompt, setPrompt] = useState(promptPresets[0]);
  const deferredPrompt = useDeferredValue(prompt);

  const visiblePresets = promptPresets.filter((item) => {
    if (!deferredPrompt.trim()) {
      return true;
    }

    return item.toLowerCase().includes(deferredPrompt.toLowerCase());
  });

  function submitPrompt(value: string) {
    void sendPrompt(value);
  }

  return (
    <main className="shell">
      <header className="site-nav">
        <a className="brand" href="/">
          StreamCanvas
        </a>
        <nav className="nav-links">
          <a href="/">Overview</a>
          <a href="/docs">Docs</a>
          <a href="https://github.com/miounet11/claude-generative-ui">GitHub</a>
        </nav>
      </header>

      <section className="demo-hero">
        <div>
          <div className="eyebrow">Reference app</div>
          <h1 className="hero-title small">Sandboxed widgets, real stream protocol.</h1>
        </div>
        <div className="status-panel">
          <div className="mini-label">Thread status</div>
          <strong>{state.statusLabel ?? "Ready"}</strong>
          <span>{isBusy ? "Streaming response" : "Idle"}</span>
        </div>
      </section>

      <section className="demo-grid">
        <aside className="control-panel">
          <div className="control-card">
            <div className="mini-label">Prompt composer</div>
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
                {isBusy ? "Streaming…" : "Run prompt"}
              </button>
            </div>
          </div>

          <div className="control-card">
            <div className="mini-label">Suggested prompts</div>
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
            <div className="mini-label">Last widget event</div>
            <div className="event-log">
              {state.lastWidgetEvent ? (
                <>
                  <strong>{state.lastWidgetEvent.eventType}</strong>
                  <span>{state.lastWidgetEvent.toolName ?? state.lastWidgetEvent.widgetId}</span>
                </>
              ) : (
                <span>No widget event yet.</span>
              )}
            </div>
          </div>
        </aside>

        <div className="workspace-grid">
          <section className="workspace-column">
            <div className="section-header">
              <div className="mini-label">Conversation</div>
              <strong>Prompt and assistant stream</strong>
            </div>
            <ChatThread />
          </section>

          <section className="workspace-column">
            <div className="section-header">
              <div className="mini-label">Widget surface</div>
              <strong>Sandboxed render target</strong>
            </div>
            <WidgetSurface />
          </section>
        </div>
      </section>
    </main>
  );
}

export function DemoShell() {
  return (
    <StreamCanvasProvider
      components={[taskBoardDefinition]}
      endpoint="/api/demo"
      tools={[bookmarkScenarioTool]}
    >
      <DemoWorkspace />
    </StreamCanvasProvider>
  );
}
