# SDK releases

Reserved packages in the `typenow` npm organization:

- `@typenow/web`: framework-independent browser chat widget.
- `@typenow/react`: React integration over the browser package.
- `@typenow/sdk`: server-side API client.

All three workspaces are currently `private: true`, at `0.0.0`, with no implementation. Do not publish placeholders. Build and test the identity and messaging contract in [web-sdk.md](web-sdk.md) before making installation commands available to customers.

Before the first release, add explicit exports, TypeScript declarations, a `files` allowlist, package builds, meaningful integration tests, and a reviewed versioning plan. Verify the tarball with `npm pack --dry-run` and remove `private` only from the package being released. Keep the application and workspace root private.

Use [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) for later automated releases from this public repository, with package-specific trusted publisher settings and GitHub OIDC. Restrict publication to a release environment. Do not introduce a long-lived npm token into source or the application deployment workflow. The npm owner must authenticate for package and publisher setup; no npm credentials are needed for app CI or Cloudflare deployment.
