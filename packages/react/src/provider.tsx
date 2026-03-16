"use client";

import {
  applyConversationEvent,
  consumeConversationResponse,
  createInitialState,
} from "@streamcanvas/core";
import type {
  ConversationStreamEvent,
  StreamCanvasState,
  WidgetClientEvent,
} from "@streamcanvas/core";
import {
  createContext,
  startTransition,
  useContext,
  useReducer,
  useState,
} from "react";
import type { ComponentType, ReactNode } from "react";
import type { ZodTypeAny } from "zod";

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function formatToolResult(result: unknown): string {
  if (typeof result === "string") {
    return result;
  }

  return JSON.stringify(result, null, 2);
}

export interface GenerativeComponentDefinition<
  Schema extends ZodTypeAny = ZodTypeAny,
> {
  component: ComponentType<Schema["_output"]>;
  description: string;
  name: string;
  schema: Schema;
}

export interface AnyGenerativeComponentDefinition {
  component: ComponentType<any>;
  description: string;
  name: string;
  schema: ZodTypeAny;
}

export interface ClientToolDefinition<
  Input extends Record<string, unknown> = Record<string, unknown>,
  Output = unknown,
> {
  description: string;
  inputSchema?: ZodTypeAny;
  name: string;
  outputSchema?: ZodTypeAny;
  run: (input: Input) => Promise<Output> | Output;
}

export interface StreamCanvasProviderProps {
  children: ReactNode;
  components?: AnyGenerativeComponentDefinition[];
  endpoint?: string;
  initialState?: Partial<StreamCanvasState>;
  onWidgetEvent?: (event: WidgetClientEvent) => void | Promise<void>;
  tools?: ClientToolDefinition[];
}

interface StreamCanvasContextValue {
  components: AnyGenerativeComponentDefinition[];
  endpoint: string;
  handleWidgetEvent: (event: WidgetClientEvent) => Promise<void>;
  isBusy: boolean;
  resetThread: () => void;
  sendPrompt: (input: string) => Promise<void>;
  state: StreamCanvasState;
  tools: ClientToolDefinition[];
}

const StreamCanvasContext = createContext<StreamCanvasContextValue | null>(null);

export function registerGenerativeComponent<
  Schema extends ZodTypeAny = ZodTypeAny,
>(definition: GenerativeComponentDefinition<Schema>) {
  return definition as AnyGenerativeComponentDefinition &
    GenerativeComponentDefinition<Schema>;
}

export function registerClientTool<
  Input extends Record<string, unknown> = Record<string, unknown>,
  Output = unknown,
>(definition: ClientToolDefinition<Input, Output>) {
  return definition;
}

export function StreamCanvasProvider({
  children,
  components = [],
  endpoint = "/api/demo",
  initialState,
  onWidgetEvent,
  tools = [],
}: StreamCanvasProviderProps) {
  const [state, dispatch] = useReducer(
    applyConversationEvent,
    createInitialState(initialState),
  );
  const [isBusy, setIsBusy] = useState(false);

  async function handleWidgetEvent(event: WidgetClientEvent) {
    startTransition(() => {
      dispatch({
        type: "widget.event",
        event,
      });
    });

    await onWidgetEvent?.(event);

    if (!event.toolName) {
      return;
    }

    const tool = tools.find((item) => item.name === event.toolName);
    if (!tool) {
      return;
    }

    try {
      const payload = tool.inputSchema
        ? tool.inputSchema.parse(event.payload)
        : event.payload;
      const result = await tool.run(payload as Record<string, unknown>);

      startTransition(() => {
        dispatch({
          type: "message.created",
          message: {
            id: createId("tool"),
            role: "system",
            content: `Tool ${tool.name} completed.\n${formatToolResult(result)}`,
            status: "complete",
            createdAt: new Date().toISOString(),
          },
        });
      });
    } catch (error) {
      startTransition(() => {
        dispatch({
          type: "error",
          message:
            error instanceof Error ? error.message : "Client tool execution failed.",
        });
      });
    }
  }

  async function sendPrompt(input: string) {
    const trimmed = input.trim();

    if (!trimmed || isBusy) {
      return;
    }

    startTransition(() => {
      dispatch({
        type: "status",
        phase: "streaming",
        label: "Generating a live response",
      });
      dispatch({
        type: "message.created",
        message: {
          id: createId("user"),
          role: "user",
          content: trimmed,
          status: "complete",
          createdAt: new Date().toISOString(),
        },
      });
    });

    setIsBusy(true);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ input: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Stream request failed with status ${response.status}.`);
      }

      await consumeConversationResponse(response, (event: ConversationStreamEvent) => {
        startTransition(() => {
          dispatch(event);
        });
      });
    } catch (error) {
      startTransition(() => {
        dispatch({
          type: "error",
          message:
            error instanceof Error ? error.message : "Prompt execution failed.",
        });
      });
    } finally {
      setIsBusy(false);
    }
  }

  function resetThread() {
    startTransition(() => {
      dispatch({
        type: "status",
        phase: "idle",
        label: "Thread reset",
      });
    });
  }

  const value: StreamCanvasContextValue = {
    components,
    endpoint,
    handleWidgetEvent,
    isBusy,
    resetThread,
    sendPrompt,
    state,
    tools,
  };

  return (
    <StreamCanvasContext.Provider value={value}>
      {children}
    </StreamCanvasContext.Provider>
  );
}

export function useStreamCanvasThread(): StreamCanvasContextValue {
  const context = useContext(StreamCanvasContext);

  if (!context) {
    throw new Error("useStreamCanvasThread must be used inside StreamCanvasProvider.");
  }

  return context;
}
