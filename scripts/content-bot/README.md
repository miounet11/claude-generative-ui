# StreamCanvas Content Bot

This bot publishes original bilingual resource pages for the StreamCanvas site.

## What it does

- Chooses approved topics from a fixed internal catalog
- Generates one English article per topic
- Translates and adapts the article into Simplified Chinese
- Validates structure, CTA links, and topic safety constraints
- Writes JSON files into `apps/web/content/generated`
- Tracks published topic IDs so daily runs do not duplicate pages

## Local usage

```bash
STREAMCANVAS_BOT_API_URL=... \
STREAMCANVAS_BOT_API_KEY=... \
STREAMCANVAS_BOT_MODEL=auto \
pnpm content:generate -- --count=3 --force
```

Useful flags:

- `--count=1..10`: override the daily batch size
- `--force`: run even if the bot already published today
- `--dry-run`: validate output without writing files

## Production layout

- Bot script: `/opt/streamcanvas-content-bot/publish-daily-content.mjs`
- Bot env: `/etc/streamcanvas-content-bot.env`
- Bot state: `/opt/streamcanvas-content-bot/runtime`
- Published content: `/opt/streamcanvas-web/content/generated`

The web service must expose:

```ini
Environment=STREAMCANVAS_CONTENT_DIR=/opt/streamcanvas-web/content/generated
```

## systemd

- Service template: `infra/systemd/streamcanvas-content-bot.service`
- Timer template: `infra/systemd/streamcanvas-content-bot.timer`
- Example env: `infra/systemd/streamcanvas-content-bot.env.example`
