# Deployment

This repository includes an isolated deployment bundle intended not to disturb existing programs on the target host.

## Runtime model

- Docker runs the Next.js app as `streamcanvas-web`
- The container binds only to `127.0.0.1:3210` on the host
- Nginx proxies `codeclaude.cn` to that internal port

## Host steps

```bash
cd /opt/claude-generative-ui
docker compose -f infra/docker-compose.yml up -d --build
cp infra/nginx/codeclaude.cn.conf /etc/nginx/conf.d/codeclaude.cn.conf
nginx -t
systemctl reload nginx
```

## Why this is safe

- No host port 80/443 listener is created by the app container
- The new site stays behind nginx on a dedicated server block
- Existing host services continue running on their own ports
