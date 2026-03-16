import { describe, expect, it } from "vitest";

import { applyConversationEvent, createInitialState } from "../src/state";
import { sanitizeWidgetHtml } from "../src/sanitize";
import {
  createConversationStreamParser,
  encodeConversationEvent,
} from "../src/stream";
import type { ConversationStreamEvent } from "../src/types";

describe("sanitizeWidgetHtml", () => {
  it("removes scripts and inline handlers", () => {
    const html = `
      <section>
        <button onclick="alert('x')">Run</button>
        <script>alert('unsafe')</script>
      </section>
    `;

    const sanitized = sanitizeWidgetHtml(html);

    expect(sanitized).not.toContain("onclick");
    expect(sanitized).not.toContain("<script>");
  });
});

describe("createConversationStreamParser", () => {
  it("parses events across chunk boundaries", () => {
    const events: ConversationStreamEvent[] = [];
    const parser = createConversationStreamParser((event) => {
      events.push(event);
    });

    const frameA = encodeConversationEvent({
      type: "status",
      phase: "streaming",
      label: "Booting",
    });
    const frameB = encodeConversationEvent({
      type: "message.created",
      message: {
        id: "assistant-1",
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: new Date().toISOString(),
      },
    });

    const combined = `${frameA}${frameB}`;
    parser(combined.slice(0, 17));
    parser(combined.slice(17));

    expect(events).toHaveLength(2);
    expect(events[0].type).toBe("status");
    expect(events[1].type).toBe("message.created");
  });
});

describe("applyConversationEvent", () => {
  it("updates messages and widgets progressively", () => {
    const initial = createInitialState();
    const createdState = applyConversationEvent(initial, {
      type: "message.created",
      message: {
        id: "assistant-1",
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: new Date().toISOString(),
      },
    });
    const messageState = applyConversationEvent(createdState, {
      type: "message.delta",
      id: "assistant-1",
      delta: "Streaming answer",
    });
    const widgetState = applyConversationEvent(messageState, {
      type: "widget.created",
      widget: {
        id: "widget-1",
        title: "Launch plan",
        kind: "html",
        loadingMessages: [],
        html: "",
        libraries: ["svg"],
        width: 900,
        height: 560,
      },
    });
    const completed = applyConversationEvent(widgetState, {
      type: "widget.delta",
      id: "widget-1",
      html: "<section>Complete</section>",
      append: false,
    });

    expect(completed.messages[0]?.content).toBe("Streaming answer");
    expect(completed.widgets[0]?.html).toContain("Complete");
    expect(completed.connection).toBe("streaming");
  });
});
