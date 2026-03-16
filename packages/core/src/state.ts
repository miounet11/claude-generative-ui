import type {
  ConnectionPhase,
  ConversationMessage,
  ConversationStreamEvent,
  StreamCanvasState,
  WidgetPayload,
  WidgetRecord,
} from "./types";

function now(): string {
  return new Date().toISOString();
}

function createWidgetRecord(widget: WidgetPayload): WidgetRecord {
  return {
    ...widget,
    error: undefined,
    status: widget.kind === "component" ? "complete" : "streaming",
    updatedAt: now(),
  };
}

function upsertMessage(
  messages: ConversationMessage[],
  message: ConversationMessage,
): ConversationMessage[] {
  const existingIndex = messages.findIndex((item) => item.id === message.id);

  if (existingIndex === -1) {
    return [...messages, message];
  }

  return messages.map((item, index) => (index === existingIndex ? message : item));
}

function upsertWidget(widgets: WidgetRecord[], widget: WidgetRecord): WidgetRecord[] {
  const existingIndex = widgets.findIndex((item) => item.id === widget.id);

  if (existingIndex === -1) {
    return [...widgets, widget];
  }

  return widgets.map((item, index) => (index === existingIndex ? widget : item));
}

function updateConnection(
  state: StreamCanvasState,
  phase: ConnectionPhase,
  label?: string,
): StreamCanvasState {
  return {
    ...state,
    connection: phase,
    statusLabel: label ?? state.statusLabel,
  };
}

export function createInitialState(
  seed: Partial<StreamCanvasState> = {},
): StreamCanvasState {
  return {
    connection: seed.connection ?? "idle",
    errors: seed.errors ?? [],
    lastWidgetEvent: seed.lastWidgetEvent ?? null,
    messages: seed.messages ?? [],
    statusLabel: seed.statusLabel ?? null,
    widgets: seed.widgets ?? [],
  };
}

export function applyConversationEvent(
  state: StreamCanvasState,
  event: ConversationStreamEvent,
): StreamCanvasState {
  switch (event.type) {
    case "status":
      return updateConnection(state, event.phase, event.label);
    case "message.created":
      return {
        ...state,
        messages: upsertMessage(state.messages, event.message),
      };
    case "message.delta":
      return {
        ...state,
        connection: "streaming",
        messages: state.messages.map((message) =>
          message.id === event.id
            ? {
                ...message,
                content: message.content + event.delta,
                status: "streaming",
              }
            : message,
        ),
      };
    case "message.complete":
      return {
        ...state,
        messages: state.messages.map((message) =>
          message.id === event.id ? { ...message, status: "complete" } : message,
        ),
      };
    case "widget.created":
      return {
        ...state,
        widgets: upsertWidget(state.widgets, createWidgetRecord(event.widget)),
      };
    case "widget.delta":
      return {
        ...state,
        widgets: state.widgets.map((widget) =>
          widget.id === event.id
            ? {
                ...widget,
                html: event.append ? widget.html + event.html : event.html,
                status: "streaming",
                updatedAt: now(),
              }
            : widget,
        ),
      };
    case "widget.complete":
      return {
        ...state,
        widgets: state.widgets.map((widget) =>
          widget.id === event.id
            ? {
                ...widget,
                status: "complete",
                updatedAt: now(),
              }
            : widget,
        ),
      };
    case "widget.error":
      return {
        ...state,
        connection: "error",
        errors: [...state.errors, event.message],
        widgets: state.widgets.map((widget) =>
          widget.id === event.id
            ? {
                ...widget,
                error: event.message,
                status: "error",
                updatedAt: now(),
              }
            : widget,
        ),
      };
    case "widget.event":
      return {
        ...state,
        lastWidgetEvent: event.event,
      };
    case "error":
      return {
        ...state,
        connection: "error",
        errors: [...state.errors, event.message],
      };
    default:
      return state;
  }
}
