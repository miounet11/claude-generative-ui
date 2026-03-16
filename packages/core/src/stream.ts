import { conversationStreamEventSchema } from "./types";
import type { ConversationStreamEvent } from "./types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function encodeConversationEvent(event: ConversationStreamEvent): string {
  return `${JSON.stringify(conversationStreamEventSchema.parse(event))}\n`;
}

export function decodeConversationEvent(frame: string): ConversationStreamEvent {
  return conversationStreamEventSchema.parse(JSON.parse(frame));
}

export function createConversationStreamParser(
  onEvent: (event: ConversationStreamEvent) => void,
): (chunk: string) => void {
  let buffer = "";

  return (chunk: string) => {
    buffer += chunk;
    const frames = buffer.split("\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      if (!frame.trim()) {
        continue;
      }

      onEvent(decodeConversationEvent(frame));
    }
  };
}

export async function consumeConversationResponse(
  source: Response | ReadableStream<Uint8Array>,
  onEvent: (event: ConversationStreamEvent) => void,
): Promise<void> {
  const stream = source instanceof Response ? source.body : source;

  if (!stream) {
    return;
  }

  const reader = stream.getReader();
  const parse = createConversationStreamParser(onEvent);

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    parse(decoder.decode(value, { stream: true }));
  }

  parse(decoder.decode());
}

export function chunkText(input: string, targetChunks = 4): string[] {
  const words = input.split(/\s+/).filter(Boolean);
  const chunkSize = Math.max(1, Math.ceil(words.length / targetChunks));
  const chunks: string[] = [];

  for (let index = 0; index < words.length; index += chunkSize) {
    const slice = words.slice(index, index + chunkSize).join(" ");
    chunks.push(`${slice}${index + chunkSize < words.length ? " " : ""}`);
  }

  return chunks.length ? chunks : [input];
}

export function createProgressiveHtmlFrames(
  html: string,
  targetFrames = 5,
): string[] {
  const length = html.length;
  const frames: string[] = [];

  for (let frame = 1; frame <= targetFrames; frame += 1) {
    const end = Math.max(1, Math.floor((length * frame) / targetFrames));
    frames.push(html.slice(0, end));
  }

  return frames;
}

export function toUint8Array(frame: string): Uint8Array {
  return encoder.encode(frame);
}

export function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
