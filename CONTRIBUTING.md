# Contributing

Typenow is at the foundation stage. Read the [build plan](docs/build-plan.md), [product strategy](docs/product-strategy.md), and [SDK plan](docs/web-sdk.md) before proposing substantial product changes. Open an issue to discuss larger changes, then send a focused pull request.

Build one roadmap step on a branch and open a PR with its behavior, data changes, test results, and remaining limitations. Write meaningful tests before implementing new backend behavior where practical, observe the expected failure, then implement and refactor with the tests passing. Tests should cover failure and recovery paths as well as successful requests.

Karn reviews each step before it merges. Wait for his explicit instruction to merge that PR. Do not enable auto-merge or begin the next roadmap step while review is pending.

Use Node 24 and pnpm 11.0.6:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Before submitting:

```sh
pnpm format:check
pnpm cf:typegen
pnpm db:migrate:local
pnpm db:seed:local
pnpm typecheck
pnpm test
pnpm build:staging
pnpm deploy:dry-run
pnpm build:production
pnpm deploy:dry-run
```

CI repeats these checks and replays local migrations and fixtures. Tests use isolated local Worker bindings without Cloudflare credentials. See [local development](docs/local-development.md) for the database, storage, and environment setup. Product demos must remain clearly illustrative until the backend exists. New motion must respect reduced motion, and controls must support keyboard and touch interaction.

The app and project documentation are AGPL-3.0-only. Contributions under `packages/web`, `packages/react`, and `packages/sdk` are MIT licensed. Existing third-party assets retain their respective terms; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Submit only material you have permission to contribute.
