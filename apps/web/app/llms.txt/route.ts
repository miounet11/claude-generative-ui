import { absoluteUrl } from "../../lib/site";

export async function GET() {
  const body = `# StreamCanvas

StreamCanvas is an open-source generative UI project for AI applications.
The public site is bilingual in English and Simplified Chinese.

Primary pages:
- Overview: ${absoluteUrl("/")}
- 中文首页: ${absoluteUrl("/zh-CN")}
- Platform: ${absoluteUrl("/platform")}
- 中文平台页: ${absoluteUrl("/zh-CN/platform")}
- Solutions: ${absoluteUrl("/solutions")}
- Security: ${absoluteUrl("/security")}
- Resources: ${absoluteUrl("/resources")}
- Open-source Claude generative UI: ${absoluteUrl("/claude-generative-ui")}
- Demo: ${absoluteUrl("/demo")}
- 中文演示: ${absoluteUrl("/zh-CN/demo")}
- Docs: ${absoluteUrl("/docs")}
- 中文文档: ${absoluteUrl("/zh-CN/docs")}
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
