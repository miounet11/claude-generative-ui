"use client";

import { useStreamCanvasThread } from "../provider";

export interface ChatThreadProps {
  className?: string;
}

const roleCopy = {
  assistant: "Assistant",
  system: "System",
  user: "You",
} as const;

export function ChatThread({ className }: ChatThreadProps) {
  const { state } = useStreamCanvasThread();

  return (
    <div className={className} style={{ display: "grid", gap: "1rem" }}>
      {state.messages.length === 0 ? (
        <div
          style={{
            border: "1px dashed rgba(255,255,255,0.2)",
            borderRadius: "1.25rem",
            color: "rgba(244, 240, 229, 0.68)",
            padding: "1.25rem",
          }}
        >
          Start with a prompt. The assistant response and widgets stream into the
          thread.
        </div>
      ) : null}
      {state.messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <article
            key={message.id}
            style={{
              background: isUser
                ? "linear-gradient(135deg, rgba(242, 116, 5, 0.18), rgba(242, 116, 5, 0.05))"
                : "rgba(11, 15, 18, 0.66)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1.25rem",
              padding: "1rem 1.1rem",
            }}
          >
            <div
              style={{
                color: "rgba(244, 240, 229, 0.52)",
                fontSize: "0.75rem",
                letterSpacing: "0.16em",
                marginBottom: "0.55rem",
                textTransform: "uppercase",
              }}
            >
              {roleCopy[message.role]}
              {message.status === "streaming" ? " / streaming" : ""}
            </div>
            <div
              style={{
                color: "#f4f0e5",
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
              }}
            >
              {message.content}
            </div>
          </article>
        );
      })}
    </div>
  );
}
