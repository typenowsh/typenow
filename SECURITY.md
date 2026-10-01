# Security

Report vulnerabilities using [GitHub private vulnerability reporting](https://github.com/typenowsh/typenow/security/advisories/new). Do not post credentials or customer data in public issues.

The current release is a marketing page with local product demonstrations. Authentication, live messaging, form storage, and SDKs are not implemented yet.

Keep local credentials in ignored `.dev.vars` or environment files. Deployment credentials belong in the GitHub `production` environment. Never commit tokens, private keys, customer records, or Wrangler state. If a secret is exposed, revoke it before removing it from Git history.
