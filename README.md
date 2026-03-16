# StreamCanvas

StreamCanvas packages generative UI into an open-source product teams can ship:

- A **core protocol** for message and widget streaming
- A **React SDK** with a sandboxed widget surface and component registry
- A **server package** that emits live NDJSON widget streams
- A **Next.js reference app** and a `create-streamcanvas` scaffold

This repository is named `claude-generative-ui` for discoverability, but the public-facing project brand is **StreamCanvas**.

## Why this exists

The goal is not to clone Claude's internal implementation. The goal is to turn the useful part of the pattern into a production-safe OSS project:

- progressive widget streaming
- structured host callbacks
- safe-by-default rendering
- component-based extensibility
- self-hostable reference infrastructure

## Packages

- `@streamcanvas/core`: schemas, reducer, stream parser, sanitization, guideline loader
- `@streamcanvas/react`: `StreamCanvasProvider`, `ChatThread`, `WidgetSurface`
- `@streamcanvas/server`: in-memory thread store, health snapshot, demo stream generator
- `create-streamcanvas`: starter app scaffold
- `apps/web`: landing page plus live demo

## Quickstart

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Docs

- Overview: `/`
- Open-source Claude generative UI guide: `/claude-generative-ui`
- Demo: `/demo`
- Docs: `/docs`
- Platform: `/platform`
- Security: `/security`
- Resources: `/resources`
- Agent-readable index: `/llms.txt`

## Deployment

- Standalone service template: `infra/systemd/streamcanvas-web.service`
- Reverse proxy config: `infra/nginx/codeclaude.cn.conf`
- Container fallback: `infra/docker-compose.yml`

## Public API

```ts
import {
  StreamCanvasProvider,
  ChatThread,
  WidgetSurface,
  registerClientTool,
  registerGenerativeComponent,
} from "@streamcanvas/react";
```

```ts
import {
  createDemoConversationStream,
  createHealthSnapshot,
  createMemoryThreadStore,
} from "@streamcanvas/server";
```

## Design choices

- **Sandboxed iframe rendering** instead of injecting raw HTML into the host app DOM
- **SVG-first demos** so charts and diagrams work offline
- **Schema-validated component widgets** for complex app-native UI
- **NDJSON event stream** shared by the client and server packages

## Repository scripts

- `pnpm dev`: run the reference app
- `pnpm build`: build all packages and the app
- `pnpm test`: run the core test suite
- `pnpm typecheck`: run TypeScript checks across workspaces
- `bash scripts/deploy-safe.sh`: build and print the isolated deployment steps

## Reference app highlights

- live demo workspace with prompt presets, telemetry, and saved scenario history
- keyword-targeted content hub for discovery and evaluation
- metadata routes for sitemap, robots, web manifest, and share cards

## License

MIT
