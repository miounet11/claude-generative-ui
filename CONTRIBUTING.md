# Contributing

## Local development

```bash
pnpm install
pnpm dev
pnpm test
```

## Expectations

- Keep new public APIs small and documented.
- Favor safe defaults over clever rendering shortcuts.
- Add or update tests when changing the stream protocol or reducer behavior.
- Do not introduce unsafe HTML execution into the host app DOM by default.
