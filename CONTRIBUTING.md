# Contributing

Typenow is at the foundation stage. Read the [product strategy](docs/product-strategy.md) and [SDK plan](docs/web-sdk.md) before proposing substantial product changes. Open an issue to discuss larger changes, then send a focused pull request.

Use Node 24 and pnpm 11.0.6:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Before submitting:

```sh
pnpm format:check
pnpm cf:typegen
pnpm typecheck
pnpm build:production
pnpm deploy:dry-run
```

CI repeats these checks. Product demos must remain clearly illustrative until the backend exists. New motion must respect reduced motion, and controls must support keyboard and touch interaction.

The app and project documentation are AGPL-3.0-only. Contributions under `packages/web`, `packages/react`, and `packages/sdk` are MIT licensed. Existing third-party assets retain their respective terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Submit only material you have permission to contribute.
