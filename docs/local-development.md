# Local app foundation

Use Node 24 and pnpm 11.0.6. No Cloudflare account or secrets are needed for local development or tests.

```sh
pnpm install --frozen-lockfile
pnpm cf:typegen
pnpm db:migrate:local
pnpm db:seed:local
pnpm dev
```

The default environment in `apps/web/wrangler.jsonc` uses `APP_ENV=development` and `APP_URL=http://127.0.0.1:3100`. Change the URL if you change the dev port. Vite validates the selected environment's variables before development or build begins. The same parser can validate Worker bindings when server features are added. Staging and production require HTTPS; development also accepts HTTP on localhost, 127.0.0.1, and IPv6 loopback. The value must be an origin, without credentials, a path, query, or fragment. Validation errors identify the configuration key without echoing its value.

`DB` is a local D1 database; `FILES` is local R2 storage. Both use Wrangler's persisted local state under `apps/web/.wrangler`, which is ignored by Git. Local development does not use remote bindings. The local commands explicitly use the source Wrangler configuration, the default environment, and `--local`. Never use the fixture SQL with `--remote`. `requireStorage` rejects missing D1/R2 bindings when an app feature requests storage; the production marketing environment intentionally has neither.

The first migration creates workspaces and inboxes. An inbox belongs to an existing workspace; its slug is unique within that workspace. Workspace deletion is restricted while inboxes exist. The composite workspace/inbox key is available for future tenant-owned foreign keys. IDs and names cannot be empty. This schema does not implement sessions or authorization; step 1.2 adds the permission boundary.

The fixtures contain two synthetic workspaces, Acme and Orbit, each with a `support` inbox. Seeding again preserves edited rows and does not duplicate them. Fixtures are development data, separate from migrations, and are never part of a production deployment. Authentication will add real workspace creation in a later step.

## Tests

```sh
pnpm test
pnpm --filter @typenow/app test:watch
pnpm typecheck
```

Vitest uses the [Cloudflare Workers integration](https://developers.cloudflare.com/workers/testing/vitest-integration/) to run tests inside workerd with local D1 and R2 bindings. Remote bindings are explicitly disabled. Each test resets its storage; database tests then apply the actual SQL migrations and fixtures. These tests do not share the developer's persisted `.wrangler` database.

The test Worker is a binding harness for the foundation modules, not the TanStack Start request entrypoint. CI separately builds and dry-runs the actual staging and production app Workers. Tests cover origin validation, repeatable migrations and fixtures, database constraints, and R2 reads and writes. R2 workspace prefixes are a storage convention, not authorization; downloads must gain server-side workspace checks when attachments are implemented.

## Schema changes

Add a new numbered SQL migration under `apps/web/migrations`; do not rewrite a migration that has been applied to a shared environment. Use backward-compatible changes while old and new code may run together. Keep fixtures under `apps/web/fixtures` and extend integration tests for the behavior introduced by each migration.

CI applies migrations and fixtures twice to check the real Wrangler command path as well as the integration tests. A Worker rollback does not reverse a database migration. Remote staging migration/deploy handling is added in step 1.6.
