"use client";

import {
  ChatThread,
  StreamCanvasProvider,
  useStreamCanvasThread,
  WidgetSurface,
} from "@streamcanvas/react";
import { useState } from "react";

function StarterWorkspace() {
  const { sendPrompt } = useStreamCanvasThread();
  const [prompt, setPrompt] = useState(
    "Create an operating brief I can interact with.",
  );

  return (
    <main className="starter-shell">
      <h1>__APP_NAME__</h1>
      <p>Generated with create-streamcanvas.</p>
      <div className="starter-grid">
        <aside className="starter-card">
          <textarea
            className="starter-input"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
          <button
            className="starter-button"
            onClick={() => {
              void sendPrompt(prompt);
            }}
            type="button"
          >
            Run prompt
          </button>
        </aside>
        <section className="starter-card">
          <ChatThread />
          <div style={{ height: "1rem" }} />
          <WidgetSurface />
        </section>
      </div>
    </main>
  );
}

export function DemoShell() {
  return (
    <StreamCanvasProvider endpoint="/api/demo">
      <StarterWorkspace />
    </StreamCanvasProvider>
  );
}
