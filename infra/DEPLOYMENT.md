# Deployment

This repository includes an isolated deployment bundle intended not to disturb existing programs on the target host.

## Runtime model

- Preferred path: Next.js standalone runtime managed by `systemd`
- Fallback path: Docker Compose when the host can pull container bases reliably
- Nginx proxies `codeclaude.cn` to `127.0.0.1:3210`

## Host steps: standalone + systemd

```bash
pnpm build
rsync -az apps/web/.next/standalone/ root@server:/opt/streamcanvas-web/
rsync -az apps/web/.next/static/ root@server:/opt/streamcanvas-web/apps/web/.next/static/
cp infra/systemd/streamcanvas-web.service /etc/systemd/system/streamcanvas-web.service
systemctl daemon-reload
systemctl enable --now streamcanvas-web
cp infra/nginx/codeclaude.cn.conf /www/server/panel/vhost/nginx/www.codeclaude.cn.conf
/www/server/nginx/sbin/nginx -t -c /www/server/nginx/conf/nginx.conf
/www/server/nginx/sbin/nginx -s reload -c /www/server/nginx/conf/nginx.conf
```

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
```

## Why this is safe

- The app binds only to `127.0.0.1:3210`
- The public cutover is only an nginx vhost change for `codeclaude.cn`
- Existing host services continue running on their own ports and vhosts
