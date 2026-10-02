# Typenow

[typenow.sh](https://typenow.sh) · [Build plan](docs/build-plan.md) · [Product strategy](docs/product-strategy.md) · [SDK plan](docs/web-sdk.md)

An open source customer inbox for small software teams. The direction is email, forms, and embedded chat in one inbox, with customer context and optional AI assistance.

**Current status:** the landing page and interactive product demonstrations are implemented. The inbox backend, authentication, hosted forms, live chat, MCP server, and SDKs are planned. The example widget and forms keep data locally in React state; they do not send messages or store submissions. Early access opens an email draft addressed to mail@karnstack.com. Pricing and allowances shown on the site are launch proposals.

## Development

Use Node 24 and pnpm 11.0.6, as declared in `.nvmrc` and `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm cf:typegen
pnpm db:migrate:local
pnpm db:seed:local
pnpm dev
```

Open http://127.0.0.1:3100. Local development needs no Cloudflare account or credentials.

```sh
pnpm cf:typegen
pnpm typecheck
pnpm test
pnpm format:check
pnpm build
pnpm preview
```

The production preview runs at http://127.0.0.1:3101. Run `pnpm format` to format source files. See [local development](docs/local-development.md) for D1 migrations, synthetic workspaces, R2 storage, and Worker runtime tests. Staging resources are defined separately; remote provisioning and app authorization are not implemented yet.

## Workspace

| Directory        | Purpose                                                             | License       |
| ---------------- | ------------------------------------------------------------------- | ------------- |
| `apps/web`       | TanStack Start application: marketing now, dashboard later          | AGPL-3.0-only |
| `packages/web`   | Planned `@typenow/web` browser widget                               | MIT           |
| `packages/react` | Planned `@typenow/react` bindings                                   | MIT           |
| `packages/sdk`   | Planned `@typenow/sdk` server client                                | MIT           |
| `docs`           | Product research, architecture direction, SDK contract, Dowel audit | AGPL-3.0-only |

SDK workspaces are private placeholders with no runtime implementation or npm release. See [SDK releases](docs/sdk-releases.md) for the publication plan.

The app uses React, TypeScript, Tailwind CSS, and the Cloudflare Vite plugin. Only `/` prerenders. Future dashboard routes belong under an authenticated layout with server-side authorization; they must not prerender customer data. Dowel is not currently a dependency; see [the audit](docs/dowel-audit.md).

## Deployment

Pull requests run formatting, generated Worker types, TypeScript, Worker runtime tests, local migration/fixture replay, and staging and production builds with Wrangler dry runs. Each roadmap step waits for Karn's explicit instruction before merging. Successful `main` pushes deploy the Worker to **https://typenow.sh** through the GitHub `production` environment. Forks cannot deploy upstream, and pull requests receive no deployment secrets. Action versions are pinned to commit SHAs and updated by Dependabot.

The production environment contains:

- Secret `CLOUDFLARE_API_TOKEN`: dedicated deployment token scoped to the Typenow Cloudflare account and domain.
- Variable `CLOUDFLARE_ACCOUNT_ID`: public account identifier; not an authentication credential.

Credentials are available only to the deployment step, after the build. Never put credentials in `wrangler.jsonc`, package files, source, or GitHub issue text. See [deployment operations](docs/deployment.md) for setup, self-hosting, and rollback.

## License and assets

The application and documentation are [AGPL-3.0-only](LICENSE). SDK workspaces are MIT licensed under their individual license files. Third-party fonts, design assets, and dependencies retain their own terms; see [third-party notices](THIRD_PARTY_NOTICES.md).

The landing page uses Inter, cream and charcoal surfaces, a citron accent, and restrained motion with reduced-motion support. Its inbox concept is original, interactive UI rendered from source; replace the example data with the real product before general availability.

See [contributing](CONTRIBUTING.md) and [security reporting](SECURITY.md).
