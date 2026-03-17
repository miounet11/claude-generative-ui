# Deployment

This repository includes an isolated deployment bundle intended not to disturb existing programs on the target host.

## Runtime model

- Preferred path: Next.js standalone runtime managed by `systemd`
- Fallback path: Docker Compose when the host can pull container bases reliably
- Nginx proxies `codeclaude.cn` to `127.0.0.1:3210`
- Generated content lives outside the Next build output so daily articles do not require a rebuild

## Host steps: standalone + systemd

```bash
pnpm build
rsync -az apps/web/.next/standalone/ root@server:/opt/streamcanvas-web/
ssh root@server "mkdir -p /opt/streamcanvas-web/apps/web/.next/static /opt/streamcanvas-web/content/generated"
rsync -az apps/web/.next/static/ root@server:/opt/streamcanvas-web/apps/web/.next/static/
rsync -az apps/web/content/generated/ root@server:/opt/streamcanvas-web/content/generated/
cp infra/systemd/streamcanvas-web.service /etc/systemd/system/streamcanvas-web.service
systemctl daemon-reload
systemctl enable streamcanvas-web
systemctl restart streamcanvas-web
cp infra/nginx/codeclaude.cn.conf /www/server/panel/vhost/nginx/www.codeclaude.cn.conf
/www/server/nginx/sbin/nginx -t -c /www/server/nginx/conf/nginx.conf
/www/server/nginx/sbin/nginx -s reload -c /www/server/nginx/conf/nginx.conf
```

## Host steps: daily content bot

```bash
mkdir -p /opt/streamcanvas-content-bot /opt/streamcanvas-content-bot/runtime
cp scripts/content-bot/publish-daily-content.mjs /opt/streamcanvas-content-bot/publish-daily-content.mjs
cp infra/systemd/streamcanvas-content-bot.service /etc/systemd/system/streamcanvas-content-bot.service
cp infra/systemd/streamcanvas-content-bot.timer /etc/systemd/system/streamcanvas-content-bot.timer
cp infra/systemd/streamcanvas-content-bot.env.example /etc/streamcanvas-content-bot.env
systemctl daemon-reload
systemctl enable --now streamcanvas-content-bot.timer
systemctl start streamcanvas-content-bot.service
```

Required bot env values:

- `STREAMCANVAS_BOT_API_URL`
- `STREAMCANVAS_BOT_API_KEY`
- `STREAMCANVAS_BOT_MODEL`
- `STREAMCANVAS_CONTENT_DIR=/opt/streamcanvas-web/content/generated`
- `STREAMCANVAS_BOT_STATE_DIR=/opt/streamcanvas-content-bot/runtime`

## Host steps: Docker fallback

```bash
cd /opt/claude-generative-ui
docker compose -f infra/docker-compose.yml up -d --build
```

## Validation

```bash
systemctl status streamcanvas-web
curl -I http://127.0.0.1:3210/
curl http://127.0.0.1:3210/api/health
curl -H 'Host: codeclaude.cn' http://127.0.0.1/api/health
curl http://127.0.0.1:3210/feed.xml
curl http://127.0.0.1:3210/sitemap.xml
systemctl status streamcanvas-content-bot.timer
```

## Why this is safe

- The app binds only to `127.0.0.1:3210`
- The public cutover is only an nginx vhost change for `codeclaude.cn`
- Generated articles live under `/opt/streamcanvas-web/content/generated` instead of inside the build output
- The standalone runtime expects `apps/web/.next/static` to exist before `streamcanvas-web` starts
- Existing host services continue running on their own ports and vhosts
