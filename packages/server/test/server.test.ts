import { describe, expect, it } from "vitest";

import {
  createDemoConversationStream,
  createHealthSnapshot,
  createMemoryThreadStore,
} from "../src/index";
import { createConversationStreamParser } from "../../core/src/stream";
import type { ConversationStreamEvent } from "../../core/src/types";

async function collectEvents(
  stream: ReadableStream<Uint8Array>,
): Promise<ConversationStreamEvent[]> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const events: ConversationStreamEvent[] = [];
  const parse = createConversationStreamParser((event) => {
    events.push(event);
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    parse(decoder.decode(value, { stream: true }));
  }

  parse(decoder.decode());
  return events;
}

describe("createHealthSnapshot", () => {
  it("returns an ok status and current thread count", () => {
    const store = createMemoryThreadStore();
    const snapshot = createHealthSnapshot(store);

    expect(snapshot.status).toBe("ok");
    expect(snapshot.threadCount).toBe(0);
    expect(snapshot.version).toBe("0.1.0");
  });
});

describe("createDemoConversationStream", () => {
  it("streams assistant and widget events for analytics prompts", async () => {
    const events = await collectEvents(
      createDemoConversationStream("Build a revenue dashboard", {
        latencyMs: 0,
      }),
    );

    expect(events.some((event) => event.type === "message.created")).toBe(true);
    expect(events.some((event) => event.type === "widget.created")).toBe(true);
    expect(events.some((event) => event.type === "widget.complete")).toBe(true);
  });

  it("returns a component widget for launch prompts", async () => {
    const events = await collectEvents(
      createDemoConversationStream("Turn this launch plan into a task board", {
        latencyMs: 0,
      }),
    );

    const widgetCreated = events.find(
      (event) => event.type === "widget.created",
    );

    expect(widgetCreated?.type).toBe("widget.created");
    if (widgetCreated?.type === "widget.created") {
      expect(widgetCreated.widget.kind).toBe("component");
      expect(widgetCreated.widget.component?.name).toBe("task-board");
    }
  });
});
