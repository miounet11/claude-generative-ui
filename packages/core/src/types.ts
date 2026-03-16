import { z } from "zod";

export const guidelineModuleSchema = z.enum([
  "interactive",
  "chart",
  "diagram",
  "form",
  "mockup",
]);

export const widgetKindSchema = z.enum(["html", "component"]);
export const widgetLibrarySchema = z.enum(["svg", "chartjs", "mermaid", "d3"]);
export const messageRoleSchema = z.enum(["user", "assistant", "system"]);
export const messageStatusSchema = z.enum(["streaming", "complete"]);
export const widgetStatusSchema = z.enum(["idle", "streaming", "complete", "error"]);
export const connectionPhaseSchema = z.enum(["idle", "streaming", "completed", "error"]);

export const componentInvocationSchema = z.object({
  name: z.string().min(1),
  props: z.record(z.string(), z.unknown()).default({}),
});

export const widgetPayloadSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  kind: widgetKindSchema.default("html"),
  loadingMessages: z.array(z.string().min(1)).max(4).default([]),
  html: z.string().default(""),
  libraries: z.array(widgetLibrarySchema).default(["svg"]),
  width: z.number().int().positive().max(1600).default(960),
  height: z.number().int().positive().max(1200).default(640),
  stateSchema: z.record(z.string(), z.unknown()).optional(),
  component: componentInvocationSchema.optional(),
});

export const conversationMessageSchema = z.object({
  id: z.string().min(1),
  role: messageRoleSchema,
  content: z.string(),
  status: messageStatusSchema.default("complete"),
  createdAt: z.string(),
});

export const widgetRecordSchema = widgetPayloadSchema.extend({
  error: z.string().optional(),
  status: widgetStatusSchema.default("idle"),
  updatedAt: z.string(),
});

export const widgetClientEventSchema = z.object({
  widgetId: z.string().min(1),
  eventType: z.string().min(1),
  toolName: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
});

export const conversationStreamEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("status"),
    phase: connectionPhaseSchema,
    label: z.string().optional(),
  }),
  z.object({
    type: z.literal("message.created"),
    message: conversationMessageSchema,
  }),
  z.object({
    type: z.literal("message.delta"),
    id: z.string().min(1),
    delta: z.string(),
  }),
  z.object({
    type: z.literal("message.complete"),
    id: z.string().min(1),
  }),
  z.object({
    type: z.literal("widget.created"),
    widget: widgetPayloadSchema,
  }),
  z.object({
    type: z.literal("widget.delta"),
    id: z.string().min(1),
    html: z.string(),
    append: z.boolean().default(false),
  }),
  z.object({
    type: z.literal("widget.complete"),
    id: z.string().min(1),
  }),
  z.object({
    type: z.literal("widget.error"),
    id: z.string().min(1),
    message: z.string(),
  }),
  z.object({
    type: z.literal("widget.event"),
    event: widgetClientEventSchema,
  }),
  z.object({
    type: z.literal("error"),
    message: z.string(),
  }),
]);

export type GuidelineModule = z.infer<typeof guidelineModuleSchema>;
export type WidgetKind = z.infer<typeof widgetKindSchema>;
export type WidgetLibrary = z.infer<typeof widgetLibrarySchema>;
export type ConversationMessage = z.infer<typeof conversationMessageSchema>;
export type WidgetPayload = z.infer<typeof widgetPayloadSchema>;
export type WidgetRecord = z.infer<typeof widgetRecordSchema>;
export type WidgetClientEvent = z.infer<typeof widgetClientEventSchema>;
export type ConversationStreamEvent = z.infer<typeof conversationStreamEventSchema>;
export type ConnectionPhase = z.infer<typeof connectionPhaseSchema>;

export interface StreamCanvasState {
  connection: ConnectionPhase;
  errors: string[];
  lastWidgetEvent: WidgetClientEvent | null;
  messages: ConversationMessage[];
  statusLabel: string | null;
  widgets: WidgetRecord[];
}
