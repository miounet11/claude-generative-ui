import { absoluteUrl } from "../../lib/site";

export async function GET() {
  const body = `# StreamCanvas

StreamCanvas is an open-source generative UI project for AI applications.

Primary pages:
- Overview: ${absoluteUrl("/")}
- Demo: ${absoluteUrl("/demo")}
- Docs: ${absoluteUrl("/docs")}
- GitHub: https://github.com/miounet11/claude-generative-ui

Key packages:
- @streamcanvas/core: stream protocol, sanitization, reducer, parser helpers
- @streamcanvas/react: provider, chat thread, widget surface, registration APIs
- @streamcanvas/server: reference stream generator, health helpers, in-memory thread store

Deployment:
- Docker runtime: Dockerfile
- Compose stack: infra/docker-compose.yml
- nginx proxy config: infra/nginx/codeclaude.cn.conf
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
