# StreamCanvas Replication Playbook

This document records the full path used to turn this repository into a deployable open-source product, a bilingual professional website, a production server deployment, and an automated content publishing system.

The goal is simple: make this repo reusable as a repeatable delivery template for future AI product launches.

## 1. Final Outcome

By the end of this buildout, the repository contains:

- an open-source generative UI product under the public brand `StreamCanvas`
- reusable packages for protocol, React UI, and server helpers
- a professional public website with product, docs, demo, platform, security, and resources pages
- English and Simplified Chinese versions of the key public routes
- production deployment via Next.js standalone runtime and `systemd`
- a bilingual editorial content system with dynamic article loading
- an automated daily publishing bot that writes new resource pages without rebuilding the app
- SEO surfaces for search engines and AI agents: `sitemap.xml`, `feed.xml`, `robots.txt`, and `llms.txt`

## 2. Current Production Snapshot

Current live example:

- Domain: `https://codeclaude.cn`
- Canonical brand: `StreamCanvas`
- Repository name kept for discoverability: `claude-generative-ui`
- Production web service: `streamcanvas-web`
- Production content timer: `streamcanvas-content-bot.timer`

Current deployment model:

- web app runs as a localhost-bound Next.js standalone service on `127.0.0.1:3210`
- nginx terminates HTTPS and proxies `codeclaude.cn` to the local app
- generated articles live outside the build output
- daily bot publishes JSON articles into the external content directory

Current server path layout:

- app root: `/opt/streamcanvas-web`
- standalone entry: `/opt/streamcanvas-web/apps/web/server.js`
- generated content: `/opt/streamcanvas-web/content/generated`
- bot root: `/opt/streamcanvas-content-bot`
- bot runtime state: `/opt/streamcanvas-content-bot/runtime`
- bot env file: `/etc/streamcanvas-content-bot.env`
- web service unit: `/etc/systemd/system/streamcanvas-web.service`
- bot service unit: `/etc/systemd/system/streamcanvas-content-bot.service`
- bot timer unit: `/etc/systemd/system/streamcanvas-content-bot.timer`
- nginx vhost file: `/www/server/panel/vhost/nginx/www.codeclaude.cn.conf`
- nginx binary: `/www/server/nginx/sbin/nginx`
- nginx main config: `/www/server/nginx/conf/nginx.conf`

## 3. Evolution Timeline

This is the high-level build sequence represented by the important commits:

- `a0a64b6` `Launch StreamCanvas v0.1.0`
  - established the initial product identity and repo structure
- `9d4317e` `Add SEO and deployment bundle`
  - added site metadata, SEO foundations, and deployment assets
- `d6ff603` `Add docs route and deployment hardening`
  - expanded docs and improved deployment safety
- `eb1943d` `Tune production proxy and site URL settings`
  - aligned runtime behavior with the production domain
- `34c6c9e` `Add standalone systemd deployment path`
  - standardized the standalone runtime + service model
- `2bffe19` `feat: expand streamcanvas site and demo experience`
  - grew the public-facing site and demo into a more complete product
- `930f4ba` `feat: add bilingual site and localized demo`
  - added Simplified Chinese site paths and localized product experience
- `f8ea860` `feat: add dynamic editorial content pipeline`
  - introduced generated resources, feed, dynamic sitemap, and the daily content bot
- `03cf9e1` `chore: bound content bot execution time`
  - added a systemd runtime cap for the bot
- `ae75b46` `fix: make content bot tolerate provider failures`
  - made the bot more resilient against upstream `504` and partial failures

## 4. What Was Built

### 4.1 Product Layer

Core product packages:

- `@streamcanvas/core`
  - stream schemas, parser, sanitization, reducer helpers
- `@streamcanvas/react`
  - provider, chat thread, widget surface, registration APIs
- `@streamcanvas/server`
  - demo stream generator, health helpers, in-memory thread store
- `create-streamcanvas`
  - starter scaffolding for downstream users

This made the project more than a landing page. It became a real installable product with a public API and a runnable reference implementation.

### 4.2 Website Layer

The public website was expanded into a full product site with:

- landing page
- platform page
- solutions page
- security page
- documentation page
- live demo page
- resources hub
- intent page targeting `Claude generative UI` discovery

This was later mirrored in Simplified Chinese under `/zh-CN`.

### 4.3 Multilingual Layer

The site now supports a bilingual public structure:

- English default routes
- Simplified Chinese localized routes under `/zh-CN`
- language switching in navigation
- locale alternates in metadata
- localized docs, platform, solutions, security, demo, and resources pages

This decision mattered for both user reach and search discoverability.

### 4.4 SEO Layer

The site was upgraded to support both traditional SEO and AI-agent discovery:

- route metadata for all major public pages
- canonical URLs
- locale alternates
- Open Graph / Twitter metadata
- `robots.txt`
- dynamic `sitemap.xml`
- dynamic `feed.xml`
- `llms.txt` for agent-readable site indexing

This made the site not just viewable, but discoverable.

### 4.5 Content Layer

The resources area was upgraded from static hand-written content to a hybrid model:

- static editorial pages for cornerstone topics
- generated resource pages loaded dynamically from filesystem JSON
- English and Chinese generated article routes
- resource hubs that automatically list generated articles

Most important decision:

- generated content is not part of the Next.js build output
- generated articles are loaded from disk at runtime
- this allows new content to go live without rebuilding or restarting the website

### 4.6 Automation Layer

The publishing bot:

- selects approved topics from an internal topic catalog
- generates original English articles
- translates them into Simplified Chinese
- validates output structure
- validates CTA links
- validates safety boundaries
- writes JSON files into the generated content directory
- tracks previously published topic IDs in bot state

Daily scheduling is handled by `systemd` using a timer unit.

## 5. Important Architecture Decisions

### 5.1 Keep the Repo Name, Change the Public Brand

The repo name `claude-generative-ui` was kept for discoverability, but the product was publicly branded as `StreamCanvas`.

Why:

- repo name captures high-intent search traffic
- public brand avoids looking like a clone product
- brand can evolve independently of the GitHub slug

### 5.2 Use Standalone + systemd Instead of a Heavy Container Requirement

The preferred production runtime is:

- `next build` with standalone output
- `systemd` service
- nginx reverse proxy
- app bound only to localhost

Why:

- lower moving parts
- safer coexistence with other services on the host
- easier updates with `rsync`
- easier recovery and status inspection with `systemctl`

### 5.3 Keep Generated Content Outside `.next`

Generated content lives in:

- local dev: `apps/web/content/generated`
- production: `/opt/streamcanvas-web/content/generated`

Why:

- avoids rebuilding after each article batch
- allows bot and app to evolve separately
- makes content replication, backup, and sync easier

### 5.4 Support Chinese as a First-Class Locale

Chinese was not added as an afterthought. The site structure, alternates, resource hub, and docs were all localized.

Why:

- Chinese users can understand the product immediately
- the project gains global utility
- the site can compete in both English and Chinese search environments

### 5.5 Treat AI-Agent Discovery as a First-Class Concern

The project added:

- `llms.txt`
- structured metadata
- content feed
- dynamic sitemap

Why:

- modern discovery is no longer only browser-search based
- AI agents and crawlers benefit from explicit machine-readable entry points

## 6. Production Deployment Design

### 6.1 Web Service Unit

The web service uses:

- `NODE_ENV=production`
- `HOSTNAME=127.0.0.1`
- `PORT=3210`
- `SITE_URL=https://codeclaude.cn`
- `NEXT_PUBLIC_SITE_URL=https://codeclaude.cn`
- `STREAMCANVAS_CONTENT_DIR=/opt/streamcanvas-web/content/generated`

Critical note:

- `STREAMCANVAS_CONTENT_DIR` must be present
- without it, the standalone app may not resolve the external content directory correctly in production

### 6.2 nginx Proxy

nginx handles:

- HTTP to HTTPS redirection
- `www` to apex redirect
- TLS certificate termination
- proxying `codeclaude.cn` to `127.0.0.1:3210`

The nginx layer was kept minimal on purpose to reduce interference with other host workloads.

### 6.3 Safe Update Pattern

When updating the standalone runtime, use:

```bash
rsync -az --delete --exclude 'content' apps/web/.next/standalone/ root@server:/opt/streamcanvas-web/
ssh root@server "mkdir -p /opt/streamcanvas-web/apps/web/.next/static /opt/streamcanvas-web/content/generated"
rsync -az --delete apps/web/.next/static/ root@server:/opt/streamcanvas-web/apps/web/.next/static/
rsync -az --delete apps/web/content/generated/ root@server:/opt/streamcanvas-web/content/generated/
systemctl restart streamcanvas-web
```

This is important.

Why:

- `--delete` is required to prevent stale route artifacts from older builds
- `--exclude 'content'` protects the external content directory while cleaning stale build files
- the standalone server only serves `/_next/static/*` when `apps/web/.next/static` exists before process start

Without this, some routes can continue serving older behavior from leftover standalone artifacts.

## 7. Automated Content Publishing Design

### 7.1 Topic Strategy

The bot only publishes around approved topic families such as:

- generative UI
- AI interface architecture
- self-hosted AI interfaces
- secure rendering
- workflow UI
- copilots
- operator-facing AI surfaces

### 7.2 Safety Boundaries

The bot explicitly avoids:

- illegal content
- gambling
- adult content
- politics
- hate content
- medical advice
- legal advice
- financial advice
- celebrity scandal content
- copyright copying
- competitor slander

This keeps the traffic strategy aligned with safe long-term brand growth.

### 7.3 Runtime Behavior

The bot now includes:

- retry logic
- request timeouts
- tolerance for partial failures
- ability to publish fewer than the target count when upstream is unstable
- state tracking to avoid duplication

Operational reality:

- the upstream content provider can return intermittent `504`
- the bot was hardened so one bad topic does not cancel the whole batch
- a batch only fails hard if zero articles are published

### 7.4 Scheduling

The timer currently runs once per day. The production example is scheduled for:

- `03:20` server local time

You can change this in:

- `infra/systemd/streamcanvas-content-bot.timer`

## 8. Files That Matter Most

Core product and site:

- `README.md`
- `apps/web/app/*`
- `apps/web/lib/marketing.ts`
- `apps/web/lib/site.ts`
- `apps/web/lib/locales.ts`
- `packages/core`
- `packages/react`
- `packages/server`

Generated content system:

- `apps/web/lib/generated-content.ts`
- `apps/web/components/generated-resource-section.tsx`
- `apps/web/app/resources/[slug]/page.tsx`
- `apps/web/app/zh-CN/resources/[slug]/page.tsx`
- `apps/web/app/feed.xml/route.ts`
- `apps/web/app/sitemap.xml/route.ts`
- `apps/web/app/llms.txt/route.ts`
- `apps/web/content/generated`

Automation and operations:

- `scripts/content-bot/publish-daily-content.mjs`
- `scripts/content-bot/README.md`
- `infra/systemd/streamcanvas-web.service`
- `infra/systemd/streamcanvas-content-bot.service`
- `infra/systemd/streamcanvas-content-bot.timer`
- `infra/systemd/streamcanvas-content-bot.env.example`
- `infra/DEPLOYMENT.md`

## 9. Exact Replication Procedure

Use this sequence to clone the entire program for a new product.

### Step 1: Define the Product Frame

Decide:

- repository slug
- public brand name
- core product narrative
- domain
- primary audience
- secondary locale(s)
- traffic strategy

Recommendation:

- keep a keyword-rich repo name if it helps discovery
- choose a cleaner public product brand for the actual site

### Step 2: Build the Installable Product Layer

Create:

- protocol/core package
- frontend package
- server/runtime package
- starter scaffold if applicable

Do not launch with only a landing page. Make sure the repo contains a real runnable artifact.

### Step 3: Build the Public Site

Minimum public routes:

- `/`
- `/platform`
- `/solutions`
- `/security`
- `/docs`
- `/demo`
- `/resources`
- one intent/discovery page tied to the market keyword

### Step 4: Add Multilingual Support Early

If the project needs more than one market:

- create locale routing
- add alternates
- localize navigation
- localize cornerstone pages
- localize resource hub content

Do not leave translation as a future enhancement if global reach matters.

### Step 5: Add SEO and Agent Discovery

Ship:

- canonical metadata
- alternates
- `robots.txt`
- `sitemap.xml`
- `feed.xml`
- `llms.txt`
- OG/Twitter metadata

### Step 6: Deploy with Isolation

Use:

- Next.js standalone runtime
- localhost binding only
- nginx reverse proxy
- `systemd` services

This makes the project safer to place on shared hosts.

### Step 7: Separate Generated Content from the Build

Store generated articles outside the standalone output.

Use an environment variable like:

```ini
STREAMCANVAS_CONTENT_DIR=/opt/your-app/content/generated
```

This is the key to no-rebuild publishing.

### Step 8: Add the Publishing Bot

The bot should:

- select from approved topic catalogs
- generate structured content
- validate the output
- write localized JSON files
- maintain publishing state
- tolerate provider instability

### Step 9: Install a Timer

Use `systemd` timer units instead of ad-hoc cron scattered across the machine.

This keeps the automation:

- inspectable
- restartable
- recoverable
- easy to duplicate

### Step 10: Verify Public Output

At minimum verify:

- home page
- docs page
- both locale resource hubs
- at least one generated article in each locale
- `feed.xml`
- `sitemap.xml`
- `llms.txt`
- service status
- timer status

## 10. Commands Used in Practice

Local verification:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Manual content generation:

```bash
STREAMCANVAS_BOT_API_URL=...
STREAMCANVAS_BOT_API_KEY=...
STREAMCANVAS_BOT_MODEL=auto
pnpm content:generate -- --count=3 --force
```

Web deployment:

```bash
rsync -az --delete --exclude 'content' apps/web/.next/standalone/ root@server:/opt/streamcanvas-web/
ssh root@server "mkdir -p /opt/streamcanvas-web/apps/web/.next/static /opt/streamcanvas-web/content/generated"
rsync -az --delete apps/web/.next/static/ root@server:/opt/streamcanvas-web/apps/web/.next/static/
rsync -az --delete apps/web/content/generated/ root@server:/opt/streamcanvas-web/content/generated/
systemctl restart streamcanvas-web
```

Bot deployment:

```bash
rsync -az scripts/content-bot/ root@server:/opt/streamcanvas-content-bot/
cp infra/systemd/streamcanvas-content-bot.service /etc/systemd/system/
cp infra/systemd/streamcanvas-content-bot.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now streamcanvas-content-bot.timer
```

nginx validation:

```bash
/www/server/nginx/sbin/nginx -t -c /www/server/nginx/conf/nginx.conf
/www/server/nginx/sbin/nginx -s reload -c /www/server/nginx/conf/nginx.conf
```

## 11. Secrets and Configuration Rules

Never commit:

- server passwords
- API keys
- bot runtime state
- production-only env files

Current repo protections:

- `.env*` files ignored
- `scripts/content-bot/runtime` ignored

Bot secrets should stay in:

- `/etc/streamcanvas-content-bot.env`

## 12. Operational Lessons Learned

### Lesson 1: Dynamic Content Must Be Externalized

If content is placed inside the build output, daily publishing becomes operationally expensive.

### Lesson 2: Standalone Updates Need Cleanup

Using `rsync` without `--delete` can leave stale route files behind.

### Lesson 3: Upstream LLM Stability Is a Real Constraint

Do not assume:

- JSON mode works
- long requests are stable
- bilingual generation succeeds in one shot

The final bot works because it was adapted to the provider’s real behavior.

### Lesson 4: Partial Success Is Better Than Total Failure

For content pipelines, it is often better to:

- publish 1 to 2 good pages
- skip failed topics
- continue tomorrow

than to fail the entire run because one topic timed out.

### Lesson 5: SEO Is a System, Not a Meta Tag

Real discoverability came from the combination of:

- keyword-targeted routes
- multilingual content
- resources hub
- machine-readable surfaces
- ongoing publication cadence

## 13. What To Customize First When Cloning This Template

For the next project, update these first:

- brand name and tagline
- public domain
- repository slug if needed
- site metadata and social cards
- marketing copy in `apps/web/lib/marketing.ts`
- route copy in `apps/web/app/*`
- language set in `apps/web/lib/locales.ts`
- topic catalog in `scripts/content-bot/publish-daily-content.mjs`
- allowed CTA links
- server service names
- deployment root paths
- nginx vhost filename
- bot schedule

## 14. Recommended Fast-Clone Checklist

Use this checklist for the next launch:

1. Fork the repo.
2. Rename the public brand.
3. Replace domain-related env and metadata.
4. Update product copy and route content.
5. Replace icons, OG assets, and screenshots.
6. Review locale strategy.
7. Review topic catalog and safety boundaries.
8. Run local verification.
9. Provision server directories and systemd units.
10. Deploy standalone output with `--delete`.
11. Sync generated content directory.
12. Configure nginx and certificates.
13. Enable web service.
14. Enable bot timer.
15. Verify public routes and feeds.

## 15. Bottom Line

This repository is no longer just a demo project.

It is now a reusable launch system for:

- open-source AI products
- professional bilingual product sites
- safe standalone deployments
- searchable content hubs
- automated daily content publishing

If reused carefully, this can serve as a repeatable factory for shipping the next product much faster than starting from zero.
