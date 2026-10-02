# Repository instructions

Follow [the build plan](docs/build-plan.md) and [contribution workflow](CONTRIBUTING.md).

- Implement one numbered roadmap step per branch and pull request.
- Use meaningful tests first for new backend behavior where practical. Confirm the expected failure before implementing the behavior.
- Run the relevant tests, type checks, formatting, migration checks, and Worker builds before requesting review.
- Open a PR and report its scope, verification, and limitations. Wait for Karn's explicit instruction to merge that PR.
- Do not merge, enable auto-merge, or start the next roadmap step while approval is pending.
- Keep secrets in local ignored files or provider secret stores. Never commit credentials or customer data.
- Keep tests and fixtures local. Never seed synthetic fixtures into remote databases.
