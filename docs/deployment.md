# Deployment operations

The app follows the [TanStack Start hosting guide](https://tanstack.com/start/latest/docs/framework/react/guide/hosting), [Cloudflare framework guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/tanstack-start/), and [Cloudflare GitHub Actions guidance](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/).

## Environments

`apps/web/wrangler.jsonc` is the source configuration. Development uses `typenow-dev`; staging uses `typenow-staging` at `staging.typenow.sh`; production uses `typenow` at `typenow.sh`. Set `APP_ENV` and `APP_URL` for each environment. Vite validates these public configuration values before development and builds begin.

Development has local `DB` and `FILES` bindings. Staging defines a separate `typenow-staging` D1 database and `typenow-staging-files` R2 bucket. These are definitions, not provisioned resources. Production remains the marketing Worker with no D1 or R2 bindings until its app rollout. Bindings and variables are explicitly specified per environment because Wrangler does not inherit them.

Wrangler currently warns that production omits the top-level development bindings. This is intentional during the marketing-only phase. The production dry run must list no D1 or R2 resources; the staging dry run must list only its staging database and bucket.

With the [Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/reference/cloudflare-environments/), select the Cloudflare environment **at build time**. The generated configuration selects the deployment target. Do not add `--env` to the deploy command after building.

```sh
pnpm build:production
pnpm deploy:dry-run
pnpm deploy
```

For staging, run `pnpm build:staging` before the same deployment commands. Deploy immediately after the intended build: the generated target reflects the most recent build.

Before the first staging deployment, create its database and bucket from `apps/web`:

```sh
pnpm exec wrangler d1 create typenow-staging
pnpm exec wrangler r2 bucket create typenow-staging-files
```

Write the returned D1 database ID into `env.staging.d1_databases[0].database_id` in the source configuration, then apply its migrations:

```sh
pnpm exec wrangler d1 migrations apply DB --env staging --remote --config wrangler.jsonc
```

Build staging after recording its database ID, dry-run, then deploy. Do not apply development fixtures remotely. Database IDs are public resource identifiers; API tokens are secrets. For self-hosting, choose your own names, domain, and database ID. A dry run does not provision resources or prove remote access. Staging provisioning and deploy automation remain a reviewed operational step; the PR workflow does not deploy staging.

## GitHub environment

Create an environment named `production`, restricted to `main`. Add `CLOUDFLARE_ACCOUNT_ID` as an environment variable and `CLOUDFLARE_API_TOKEN` as an environment secret. Use a dedicated token with Workers Scripts edit, Workers Routes edit, and Account Settings read on the target account, plus Zone read for the target zone. Add other permissions only when real resources require them. The token's account/zone restrictions are the boundary; scripts-edit access is account scoped, not limited to a single Worker.

The CI workflow checks pull requests without credentials. The deploy job runs only in the upstream repository on `main`, after checks pass. It rebuilds without credentials, then passes the Cloudflare token to Wrangler's deployment step. Production deployments are serialized and are not canceled midway.

Rotate a compromised deployment token in Cloudflare, then replace the GitHub environment secret. Never copy a token into a workflow or shell command argument. Local deployment can use `pnpm --filter @typenow/app exec wrangler login` instead of a token.

## Self-hosting the current release

The current release hosts the marketing page, not a functioning customer inbox. To deploy your own copy:

1. Clone the repository and install with `pnpm install --frozen-lockfile`.
2. Edit Worker names, `APP_URL`, and the production domain in `apps/web/wrangler.jsonc`. For a `workers.dev` deployment, remove production `routes`, set `workers_dev` to `true`, and set `APP_URL` to that deployment's HTTPS origin.
3. Change the app's canonical URL, contact address, branding, and proposed commercial plan copy for your installation.
4. Log into your own Cloudflare account with Wrangler, build production, run the dry run, and deploy.

The upstream workflow's repository condition intentionally prevents forks from deploying to Typenow. For your own pipeline, update that condition and environment URL, then configure credentials for your own account. Custom Domains require a zone in that account. Wrangler creates the domain's DNS/certificate association; inspect existing web records before replacing them. Preserve email DNS records.

No remote database, queue, email, storage, or AI service is currently provisioned. Local D1/R2 and separate staging definitions are available for the foundation. Staging resource operations need D1 edit and R2 storage edit permissions in addition to the Worker/domain permissions. Keep its credentials separate from production. Extend production permissions only when the app is ready to use those resources; see [local development](local-development.md).

## Rollback

From `apps/web`, inspect production versions and roll back:

```sh
pnpm exec wrangler versions list --name typenow
pnpm exec wrangler rollback --name typenow
```

Rollback affects deployed code; it does not undo future database migrations. Fix or revert the offending commit on `main` so the next CI deployment does not reintroduce it.
