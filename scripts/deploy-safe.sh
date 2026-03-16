#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building StreamCanvas deployment bundle"
cd "$ROOT_DIR"
pnpm build

cat <<'EOF'
Next steps on the target host:

1. Clone or copy this repository to the server.
2. Run:
   docker compose -f infra/docker-compose.yml up -d --build
3. Install nginx config:
   cp infra/nginx/codeclaude.cn.conf /etc/nginx/conf.d/codeclaude.cn.conf
4. Validate and reload nginx:
   nginx -t && systemctl reload nginx

The app listens only on 127.0.0.1:3210 on the host.
EOF
