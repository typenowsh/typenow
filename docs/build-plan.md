# Typenow product build plan

Prepared for Karn on October 2, 2026. This is the implementation plan for the hosted service at typenow.sh and the open source edition deployed in a customer's Cloudflare account.

Build a customer inbox connected to the customer's product. Email, forms, and web chat share conversation history. A website preview prepares the initial support setup; approved knowledge, optional repository access, and verified customer context make that setup more useful over time. Karnstack is the first customer. Use it privately before beginning founder outreach.

This document defines the delivery order, product behavior, architecture boundaries, and evidence required to complete each milestone. It extends the [product research](product-strategy.md), [SDK contract](web-sdk.md), and [Dowel audit](dowel-audit.md). Milestone order is a dependency plan, not a calendar estimate. Re-estimate after each milestone using what we learned.

## Current state

| Area          | Status                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Marketing     | Live landing page, responsive product demonstrations, interactive chat demo, brand assets, and accessible motion.      |
| Repository    | Public repository, AGPL-3.0 app, MIT SDK workspaces, protected main branch, and secret scanning.                       |
| Delivery      | GitHub checks and automatic Cloudflare production deployment work. Staging is configured but has not been provisioned. |
| App           | Authentication, workspaces, inbox persistence, email delivery, forms, and customer context are not implemented.        |
| AI onboarding | Website crawling, generated setup previews, and repository connections are not implemented.                            |
| SDK and MCP   | Package names and contracts are planned. The SDK workspaces are private placeholders; there is no MCP server.          |

Only the completed marketing and delivery work is marked complete below. A deployed demonstration does not establish that the underlying product exists.

## Product quality

A sophisticated first release should make ordinary support work feel complete. A founder can find a conversation, understand the customer, write a reply, and see whether delivery succeeded. It needs good behavior when content is long, the network is slow, a provider fails, or two teammates act at once.

Apply these requirements as each surface is built:

- Preserve the landing page's cream, charcoal, and citron identity. Define dashboard typography, spacing, surfaces, and interaction states before expanding screens.
- Support keyboard navigation, visible focus, screen readers, touch, reduced motion, and narrow screens. Provide persistent actions on touch devices.
- Include realistic empty, loading, permission, error, retry, and quota states. Preserve drafts through navigation and recover them after a reload.
- Use explicit delivery states. Show a pending action immediately, but claim a message is sent only after the backend has durably accepted it.
- Keep conversation URLs shareable within an authorized workspace. Preserve selected filters and make browser back and forward useful.
- Keep long threads and large inboxes bounded through pagination. Load older messages deliberately and preserve scroll position.
- Provide light and dark dashboard themes with readable portaled menus, dialogs, and editors. Review real email content in both themes.
- Keep public and private information separate. Public chat responses must never include internal notes or the agent's full customer panel.

Dowel is a conditional dashboard choice. Run a small pilot against the existing audit, fix visible focus for bare fields before adoption, and test portals and mobile navigation in Typenow. Use the existing Base UI approach where Dowel does not fit. Do not let a component-library migration block a working inbox.

## Architecture decisions

These are proposed implementation choices. The proof tasks in milestone 1 must validate them in the deployed runtime before they become dependencies for the rest of the product.

| Component          | Responsibility                                                                                                                         | Introduce                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| TanStack Start app | Public marketing and setup previews, authenticated dashboard, server-side authorization, and versioned API.                            | Existing app; authenticated layout in milestone 1. |
| Cloudflare Workers | App requests and channel adapters. Add a separate background Worker only if the tested entrypoint or operational boundary requires it. | Milestone 1.                                       |
| D1                 | Workspace membership, conversation records, drafts, form definitions, jobs, delivery records, and usage.                               | Milestone 1.                                       |
| R2                 | Raw email where required, private attachments, source snapshots, exports, and backup files.                                            | Bind in milestone 1; use as features arrive.       |
| Queues             | Incoming-message processing, outbound delivery, lifecycle events, and recoverable work.                                                | Milestone 3.                                       |
| Workflows          | Durable crawl and analysis steps, polling, retries, and cancellation.                                                                  | Milestone 2.                                       |
| Durable Objects    | Authorized real-time chat connections and ordered notification delivery. D1 remains the durable conversation record.                   | Milestone 6.                                       |
| Email adapter      | Provider-specific receive, send, threading identifiers, delivery events, and reconciliation.                                           | Prove in milestone 1; ship in milestone 3.         |
| Model adapter      | A selected hosted model or customer-configured provider, validated outputs, budgets, and cancellation.                                 | Milestone 2.                                       |
| AI Gateway         | Model routing and observation, with sensitive body logging disabled by default. Application budget checks remain authoritative.        | When the first model path is proven.               |
| Search             | Indexed conversation and approved-knowledge search first. Introduce semantic retrieval only after measured need.                       | Milestones 3 and 8.                                |

Cloudflare Workflows supports persisted multi-step execution, retries, and external-event waits. That makes it a candidate for asynchronous crawl and analysis jobs. Keep large source documents in storage and pass references between job steps. [Workflows documentation](https://developers.cloudflare.com/workflows/)

Start with one application and a few clear server modules: identity, workspaces, conversations, delivery, forms, sources, and usage. Extract shared packages only when another runtime actually needs them. The dashboard, API, MCP tools, and background jobs must call the same permission and business rules.

Start with indexed, workspace-scoped D1 queries and a workspace-to-database resolver. The resolver should permit migration of a busy workspace later without changing public APIs. Do not implement a fleet of databases before measuring the pilot. D1 has finite database capacity; keep large message files in R2 and test query behavior under load. [D1 limits and scaling guidance](https://developers.cloudflare.com/d1/platform/limits/)

### Records and invariants

| Record group                                | Required behavior                                                                                                     |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Users, sessions, workspaces, memberships    | Server-derived identity, owner/admin/member capabilities, session revocation, and explicit workspace selection.       |
| Inboxes, connected addresses, customers     | Tenant-scoped addressing and identity claims. An email address supplied by a visitor does not prove ownership.        |
| Conversations, messages, notes, drafts      | One conversation model across channels; participant and visibility rules; versioned drafts; stable cursors.           |
| Deliveries, outbox jobs, provider events    | Unique retry keys, provider identifiers, delivery attempts, deduplicated lifecycle events, and uncertain-send review. |
| Forms, versions, submissions                | Draft and published versions; retained submission schema; durable submission acceptance.                              |
| Sources, snapshots, knowledge, setup drafts | Source attribution, versions, review state, freshness, deletion, and private access where appropriate.                |
| Integrations, credentials, audit events     | Scoped connector access, secret references, revocation, actor history, and redacted logs.                             |
| Usage events, reservations, entitlements    | Idempotent metering, concurrent quota enforcement, release of unused reservations, and visible allowances.            |

Every tenant-owned record carries a workspace ID. Authorization scopes every read, write, attachment, job, export, and tool call. Include the workspace in uniqueness constraints and storage paths. Global users and an unclaimed public preview have separate access rules.

An unclaimed preview belongs to an opaque browser credential, expires, and contains public source material only. Account creation can claim it once into an authorized workspace. A public URL does not grant ownership of a business, a sending domain, or a private repository.

## Milestone sequence

| Milestone | Working result                                                                                 | Dependency                                    |
| --------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------- |
| 0         | Brand, landing page, repository, production pipeline. Complete.                                | None.                                         |
| 1         | Secure app foundation, isolated staging, tested email and AI paths.                            | 0.                                            |
| 2         | Real website-to-support preview on the landing page, with editable drafts.                     | 1.                                            |
| 3         | Karnstack receives and replies to real email in the inbox.                                     | 1.                                            |
| 4         | Hosted and embedded forms create conversations; reviewed setup drafts can publish forms.       | 2 and 3.                                      |
| 5         | Karnstack's verified customer context appears beside support conversations.                    | 3.                                            |
| 6         | Real web chat and published web/React SDKs use the same inbox.                                 | 3 and 5.                                      |
| 7         | A small team can work together reliably, including notes, assignment, attachments, and search. | 3 through 6.                                  |
| 8         | Approved knowledge and reviewed AI drafts reduce repeated support work.                        | 2, 5, and 7.                                  |
| 9         | Selected GitHub repositories improve setup and knowledge freshness.                            | 2 and 8.                                      |
| 10        | API client and MCP let customers use their own AI clients to create forms and reply drafts.    | 4, 5, and 8.                                  |
| 11        | A clean Cloudflare self-host installation works, restores data, and upgrades.                  | 7; optional integrations tested when enabled. |
| 12        | Managed free/paid plans, onboarding, operational controls, and external pilot.                 | 7, 8, 10, and 11.                             |
| 13        | Further product depth follows observed use: advanced forms, automation, richer integrations.   | Retention and economics evidence from 12.     |

Implement in the numbered order for now. Milestones 2 and 3 both follow the foundation, but we will finish one before starting the next. Early feedback may change the sequence; record the reason here. Self-host configuration and usage metering begin in milestone 1 even though their full release gates come later.

## Milestone 1 App foundation and technical proofs

Build the infrastructure that lets every subsequent feature store real data and enforce access. Use staging for provider experiments.

1. Provision separate staging resources and add local migrations, fixtures, and environment validation. Keep production data out of previews and CI.
2. Choose a maintained authentication implementation through a short TanStack Start, Workers, and D1 compatibility proof. Verify sessions, secure cookies, logout, CSRF protection, and server-side route checks. Record the choice in an architecture decision.
3. Add login, workspace creation, membership rules, and the authenticated `/app` layout. Start with GitHub login for the founder pilot; implement email login and invitations before the external pilot.
4. Implement the permission entrypoint and database resolver. Seed two independent test workspaces and test unauthorized access across them.
5. Add request/job IDs, redacted structured errors, health checks, and the usage ledger. Resource-creating actions need quotas from their first release.
6. Run one owned-address email round trip. Verify inbound ingestion, reply headers, provider acceptance, delivery events, and failure handling. Inspect the current Karnstack mailbox setup before selecting a pilot address.
7. Prove a hosted customer's sending-domain path separately. Cloudflare's documented onboarding selects a domain in the same account; that does not establish arbitrary customer-domain onboarding. Keep the email adapter and choose a verified-domain provider if the native path is unsuitable. [Cloudflare domain configuration](https://developers.cloudflare.com/email-service/configuration/domains/)
8. Prove a bounded crawl and one model call on staging. Validate structured output, provider failures, cancellation, and recorded usage. Select the first model using actual Karnstack output quality and measured cost.
9. Pilot Dowel on the dashboard shell and a few controls. Resolve the audit's focus and touch issues before using affected components.

Complete when an authorized user can sign in, create a workspace, and sign out; another workspace cannot access its records; and the provider proofs have saved results and decisions. No primary mailbox migration is required to complete the proof.

## Milestone 2 Website preview and generated setup

Put a URL input on the landing page with the action "Preview my setup." This becomes a real asynchronous feature, with visible progress and a result that survives refresh.

1. Accept public HTTP(S) websites, normalize URLs, and restrict crawl destinations and redirects. Reject local/private network destinations and credentials in URLs. Prevent the feature from becoming an unrestricted fetch service.
2. Create a durable job with pending, crawling, analyzing, ready, partial, failed, canceled, and expired states. Add cancellation and cleanup of provider jobs and temporary artifacts.
3. Start with a proposed cap of 15 pages and depth 2. Prefer the homepage, product, pricing, documentation, contact, and help pages. Cap bytes, runtime, rendered pages, and model tokens independently.
4. Retrieve permitted content, store bounded source snapshots, and extract a product summary. Follow crawler rules and declare the actual AI-input purpose and retention use. Cloudflare's crawl endpoint supports Markdown, page/depth limits, and caching; static fetching can be used when rendering is unnecessary. [Crawl documentation](https://developers.cloudflare.com/browser-run/quick-actions/crawl-endpoint/)
5. Generate support categories, suggested FAQs, two form drafts, and a widget greeting. Validate output against our schema on the server. Workers AI's JSON mode is available, but its documentation explicitly says schema adherence is not guaranteed. [JSON mode documentation](https://developers.cloudflare.com/workers-ai/features/json-mode/)
6. Show sources beside factual answers. Label inferred support needs as suggestions and unanswered policies as "Needs your input." Suggested questions do not establish real request frequency.
7. Let visitors edit, remove, and regenerate individual sections. Preserve existing edits and show a comparison when regenerating.
8. Let an account claim the preview and save a setup draft. Activation is versioned and requires review; publishing forms becomes available in milestone 4 and widget configuration in milestone 6.
9. Add challenge/rate controls, atomic budget reservations, per-domain caching for permitted public content, anonymous expiry, and a global spending limit. Keep private repository and customer-context material out of public caches.

Complete when Karnstack and several different public sites produce useful, source-linked drafts; blocked or empty sites fail clearly; refresh/retry does not duplicate paid work; and actual cost per completed preview is recorded. The proposed caps are initial controls, not a public allowance commitment.

## Milestone 3 Inbox and dependable email

Build the first daily-use workflow. A customer emails a pilot address, Karn answers in Typenow, and the customer's reply returns to the same conversation.

1. Stage inbound content durably, then parse and normalize it. Deduplicate provider events within the correct workspace and inbox.
2. Implement bounded conversation lists, conversation detail, customers, labels, and open/waiting/resolved states. Customer replies reopen resolved work according to an explicit rule.
3. Add a composer with autosaved drafts, conflict detection, recipients, quoted-reply handling, and clear confirmation of the sending identity. Support plain text first and a small sanitized rich-text subset.
4. Create an outbox record before delivery. Track queued, provider accepted, delivered, bounced, failed, and unknown outcomes. Reconcile uncertain sends before offering a resend.
5. Thread using stored provider identifiers and reply references. Verify participants and recipient routing; subjects alone never select a conversation. Bound loops, auto-replies, and repeated delivery events.
6. Store attachments privately, enforce size limits, and authorize downloads. Sanitize email HTML and block remote content by default. Outbound attachment UX expands in milestone 7.
7. Make failed ingestion and failed replies visible with recovery actions. Log operational identifiers without exposing message bodies or credentials.
8. Add conversation links, filters, keyboard navigation that respects text inputs, accessible status announcements, and stable scroll behavior.
9. Add a basic backup/export and rehearse restoration with pilot messages and attachment references before making Typenow the primary support inbox. Milestone 11 expands this into installation and upgrade tooling.

Complete when a staged Karnstack round trip works on the deployed app, including reply threading, duplicate ingestion, a bounce, a provider error, and a send timeout with uncertain acceptance. Record every missing or misthreaded pilot message. Begin private daily use here.

## Milestone 4 Forms as conversation entry points

Make learner support and business inquiry forms usable outside the demo.

1. Build a document-style editor with text, email, select, textarea, and file fields. Add field order, required rules, helpful errors, and a preview using the actual renderer.
2. Add draft/published versions, hosted links, an iframe embed, success behavior, accessibility, and theme settings. Keep past submission schemas intact when a form changes.
3. Validate and durably accept submissions server-side, deduplicate retry IDs, apply spam controls and quotas, and create a conversation in the chosen inbox.
4. Support contactable and anonymous submissions deliberately. Collect an email when email continuation is needed; do not grant previous conversation history from a typed address.
5. Add submission detail, export, and signed webhooks with retries and delivery inspection.
6. Let a reviewed website setup draft create editable forms idempotently. Reapplying a setup must not create duplicates or silently overwrite published edits.

Complete when the two Karnstack forms accept real submissions, route them correctly, and permit a human email reply. Test edited versions, repeated submissions, webhook retries, quota behavior, and exports.

## Milestone 5 Verified product context

Connect Karnstack's actual learner system through a documented, read-only server contract.

1. Inspect how Karnstack authenticates learners and stores purchases and entitlements. Define a minimal connector using those actual systems.
2. Distinguish guest claims, verified customer identities, and explicit agent-authorized lookups. The browser cannot select an arbitrary private customer record.
3. Show relevant course access, purchase state, and account details beside the thread. Show source, fetch time, stale data, and unavailable states.
4. Add connector timeouts, credential rotation, caching scoped to the workspace/customer, and an audit history for lookups.
5. Publish a generic read-only connector contract and a maintained Karnstack example. Keep customer actions such as refunds out of this connector.

Complete when a course-access question exposes the correct customer's entitlement, another identity cannot retrieve it, and a connector outage still allows ordinary replies. The useful result is less manual account investigation; measure that during private use.

## Milestone 6 Web chat and browser SDKs

Replace the local widget demonstration with real messaging, using the [existing SDK plan](web-sdk.md).

1. Implement guest sessions and short-lived identity tokens issued by the host application's authenticated backend. Scope history to the visitor; reset state on logout and account changes.
2. Build `@typenow/web` with initialize/open/close/identify/reset/destroy methods, a default isolated widget, and managed or self-hosted endpoints. Load the conversation UI when needed.
3. Persist messages before acknowledgement. Use stable client IDs, cursors, reconnect recovery, and authorized real-time connections. Keep internal notes out of broadcasts.
4. Add explicit email follow-up for a supplied address and make the reply route visible to the teammate. Deduplicate chat and email notifications.
5. Build `@typenow/react` as a thin lifecycle wrapper. Test SSR and Strict Mode without duplicate widgets or sockets.
6. Add reviewed workspace configuration from the setup draft, install examples, CSP guidance, permitted origins, package builds, and versioned releases.

Complete when a learner can message from the Karnstack learning app, Karn can reply from the same inbox, reload/reconnect preserves authorized history, and requested email continuation threads correctly. Test guest-to-user association, logout, duplicate retries, and two-workspace isolation before publishing packages.

## Milestone 7 Team workflows and inbox depth

Finish the everyday controls that let a small company adopt Typenow.

- Ship email login, expiring invitations, member removal, and tested owner/admin/member capabilities.
- Add assignment, private notes, mentions, saved replies, internal notifications, and unread state distinct from conversation status.
- Add bounded full-text search, useful filters and saved views, bulk actions with undo where safe, and keyboard shortcuts with an accessible reference.
- Expand reply formatting and attachment uploads with progress, cancellation, retry, and clear encoded-size limits.
- Prevent teammates from unknowingly overwriting drafts or changing stale conversation state. Show conflicting changes and the recorded actor.
- Complete mobile navigation, dark mode, command search, customer pages, and settings. Use realistic long names, large threads, and empty workspaces in review.
- Measure query latency and client interaction with a staging fixture containing many conversations and a long thread. Fix unbounded queries and rendering before adding advanced search infrastructure.

Complete when two teammates can handle the same queue without losing drafts, confusing private notes with replies, or bypassing permissions. Run the workflows with keyboard and touch on the deployed app.

## Milestone 8 Knowledge and reviewed AI assistance

Turn reviewed source material and repeated support work into maintained knowledge.

1. Add editable knowledge sections with draft/published versions, citations, source timestamps, and an explicitly chosen public or private audience.
2. Let the website setup seed drafts. Schedule bounded recrawls and show source changes for review. Do not silently replace approved policies or manual answers.
3. Add source-grounded conversation summaries and reply drafts using approved knowledge and permitted customer context. Display sources and missing information beside the draft.
4. Suggest knowledge improvements from resolved conversations after redaction and review. Keep private customer details out of public articles.
5. Separate AI allowance and provider configuration from normal inbox operation. Enforce budgets before calls and keep messages usable when inference is unavailable.
6. Keep sending a human action. Test malicious source instructions, unsupported policies, stale sources, cross-workspace retrieval, and provider errors.

Complete when Karnstack can approve an answer, reuse it in a real conversation, inspect its source, and revise it when source material changes. Evaluate factual support and usefulness on a saved, redacted set of representative questions before changing the model or prompt.

## Milestone 9 GitHub product understanding

Offer "Connect GitHub" after the website preview, as an optional richer source.

1. Create a GitHub App requesting read-only contents and needed metadata for selected repositories. Explain what will be read and retained. Keep credentials server-side and revocable. [GitHub installation controls](https://docs.github.com/en/apps/using-github-apps/installing-a-github-app-from-a-third-party)
2. Start with selected documentation and configuration, then relevant route/integration definitions. Limit file types and size; exclude environment files, generated artifacts, and dependencies. Filter detected credentials before storing an index or sending model input. Never execute repository code during indexing.
3. Attribute observations to a commit and file location. Treat repository conventions as evidence to inspect, not proof of current production behavior or customer entitlements.
4. Suggest support categories, missing documentation, likely form needs, and SDK installation patches. Keep patches reviewable; no automatic merge or deployment.
5. Process signed, deduplicated update events and compare affected sources. Suggest revisions for approval. Respect user edits and remove access and retained repository material on disconnection according to the retention policy.

Complete when a selected Karnstack repository improves an identifiable setup result, a code change produces an attributable update suggestion, and revocation removes access. Never expose repository-derived content through an anonymous website preview.

## Milestone 10 API client and MCP

Let customers use their own Claude or Codex clients against the same product functions.

1. Expose a versioned API with scoped credentials, pagination, consistent errors, retry keys for mutations, rate limits, and an audit trail.
2. Build and publish `@typenow/sdk` with typed methods and tested managed/self-hosted endpoints. Implement meaningful packaging and release checks from [SDK releases](sdk-releases.md).
3. Implement MCP reads for conversations, approved knowledge, permitted customer context, and forms. Add mutations to create/edit form drafts and save reply drafts.
4. Make HTTP MCP authorization conform to the current protocol guidance and test the actual target clients. Token audience, workspace scope, revocation, and consent must be enforced server-side. [MCP authorization](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization)
5. Keep draft creation separate from publication and sending. A later send tool requires an expiring server-recorded approval bound to the exact recipients, channel, draft version, and content. Editing invalidates approval.
6. Document that the customer's AI-client plan supplies that client's inference. It does not fund Typenow's website crawls, background inference, or the customer's API-key usage.

Complete when Claude and Codex can inspect an authorized Karnstack conversation, create a useful form draft, and save a reply draft without access to another workspace. Revoked tokens and prompt instructions embedded in messages cannot authorize extra actions.

## Milestone 11 Self hosting and recovery

Prove the ownership promise using the same application core.

1. Provide a versioned configuration template and a deployment/readiness command that creates or verifies required resources, applies migrations, and checks bindings and secrets.
2. Deploy a tagged release into a clean Cloudflare account or isolated installation. Verify login, a form submission, an email round trip, and enabled chat. Describe any required provider accounts and DNS steps plainly.
3. Remove managed-service dependencies from self-host runtime paths. Widget assets, endpoints, authentication, and provider configuration must work with the customer's installation.
4. Document upgrades, reversible rollout where possible, database migration compatibility, exports, retention, and deletion. Keep credentials out of exported customer data.
5. Test a backup restoration into a separate installation, including attachment references and ownership. Restored pending deliveries must not automatically send old messages again.
6. Provide a single-workspace setup for a self-host operator while retaining the same workspace permission model. Core inbox, forms, API/MCP, and export features remain open source.

Complete when someone following the documentation can set up, use, export, restore, and upgrade the core without unpublished founder knowledge. Optional AI and GitHub features need explicit readiness checks when enabled.

## Milestone 12 Managed plans and external pilot

Prepare the cloud service for real free and paid workspaces.

1. Add billing through a provider chosen for Karnstack's actual business jurisdiction and account eligibility. Prove the payment and tax requirements before implementation commitments.
2. Implement entitlement changes, idempotent billing webhooks, a billing portal, invoices/receipts as supported, cancellation, and clear payment-failure states.
3. Use the existing proposed free and $15 workspace tiers as hypotheses. Keep form count unlimited; measure and bound submissions, outbound recipient deliveries, inbound processing, storage, chat traffic, previews, and AI separately.
4. Show usage and quota behavior before limits are reached. Preserve existing conversations and allow exports; never charge unexpected AI overages.
5. Complete onboarding with website setup, address verification, domain checks, and installation guidance. Explain which components are activated and which need credentials or review.
6. Add internal operational views for failed jobs, delivery health, resource usage, backups, and spending. Operational access to customer content must be explicit, scoped, and audited.
7. Set retention/deletion policies and a customer-facing privacy explanation. Maintain dependency updates, vulnerability reporting, upgrade notes, and incident procedures.
8. Onboard five to ten external founders through direct outreach after Karnstack's workflow is dependable. Observe setup and weekly work; keep public registration controlled until costs and abuse behavior are measured.

Complete when external users receive and answer real conversations repeatedly, several agree to pay after use, setup does not require hidden manual fixes, and measured infrastructure plus support effort supports the proposed price. Record churn and reasons for returning to their old mailbox.

## Milestone 13 Expansion based on evidence

These are product-depth candidates with a clear implementation boundary. Promote them into a milestone when active users repeatedly need them.

| Candidate                                               | Evidence to require                                                                             |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Conditional form logic, multi-step forms, routing rules | Real pilot forms cannot express a recurring workflow with the focused editor.                   |
| Public help center, custom domains, branding controls   | Teams maintain approved answers and want customers to find them outside chat.                   |
| Response-time reports and conversation analytics        | Teams need an action they can take from the report; event semantics are established.            |
| SLA targets, schedules, rules, and automations          | Multi-person teams have recurring routing or follow-up work that simple views cannot handle.    |
| Additional billing/account connectors                   | Repeated requests from active customers and a maintainer for each connector.                    |
| Richer chat, uploads, typing, presence                  | Measured chat use and a clear improvement to customer communication.                            |
| Autonomous answers or customer actions                  | Grounded draft quality, action-specific permissions, recoverable behavior, and explicit opt-in. |
| Other channels, enterprise identity, complex roles      | Paying customer demand supports the operation and maintenance cost.                             |

## Release gates

| Release               | Required evidence                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Website preview       | Milestones 1 and 2, bounded costs, honest partial/error states, source attribution, and protected preview access.                                                             |
| Karnstack inbox pilot | Milestones 1, 3, 4, and 5; working email/form round trips; tested tenant boundaries; recoverable delivery; a tested backup before relying on it for primary support.          |
| SDK preview           | Milestone 6 and the identity/reconnect/package checks. Published installation commands point to real packages.                                                                |
| External pilot        | Milestones 7 and 8 plus the readiness and operational parts of 11 and 12. Website setup creates usable reviewed configuration.                                                |
| Paid release          | Billing and quota tests, external repeat use, measured costs, and complete recovery/upgrade checks. MCP and GitHub can remain explicitly optional until their own gates pass. |

The self-hosted software does not depend on hosted billing. The cloud edition can keep billing disabled during the private pilot, but permissions, usage accounting, and cost limits must already work.

## How to build each milestone

Use small pull requests that finish a user-visible behavior or a necessary foundation. Each PR states its trigger, resulting behavior, data changes, and relevant verification. Separate unrelated library upgrades and visual experiments from a delivery or permission change.

For each milestone, record the working demonstration, remaining limitations, measured usage, and decision notes here. Mark it complete only after its exit condition works in the deployed environment. Do not turn the roadmap into a list of implemented claims prematurely.

Extend CI as the backend arrives with migration checks and meaningful integration tests. Prioritize workspace boundaries, durable message acceptance, retry deduplication, delivery uncertainty, draft conflicts, source attribution, and recovery. Add browser checks for the complete supported workflows. Documentation-only changes need formatting and link checks; use existing required checks without adding artificial tests.

Deploy schema changes with a staged compatibility plan: validate on staging, apply backward-compatible migrations, deploy compatible code, and perform destructive cleanup separately after the rollback window. A code rollback does not reverse data migrations.

## First implementation pull requests

The first work is milestone 1. These tasks are deliberately smaller than the later feature descriptions.

- [ ] 1.1 Add environment/config validation, staging resource definitions, local D1 migrations, R2 configuration, and two-workspace fixtures. Prove Worker build and migration behavior.
- [ ] 1.2 Choose and prove authentication on the deployed runtime. Add the permission entrypoint and tenant-boundary integration checks.
- [ ] 1.3 Ship login, workspace creation, dashboard navigation, and the Dowel control pilot with corrected focus behavior.
- [ ] 1.4 Prove the email adapter round trip and hosted-domain setup path; save threading/delivery/failure evidence.
- [ ] 1.5 Prove crawl/model output, usage reservations, provider cancellation, and cost recording. Record the first model choice.
- [ ] 1.6 Extend GitHub staging checks and migration/deploy handling, then close milestone 1 with a deployed demonstration.

Select authentication and model dependencies during their proof tasks. Recheck the Dowel package and audited issues before pinning it. Provision only resources required by the current milestone, keep credentials in environment secret stores, and make self-host configuration part of each resource addition.

## Decisions to resolve during implementation

| Decision                                   | Resolve by | Evidence                                                                                                        |
| ------------------------------------------ | ---------- | --------------------------------------------------------------------------------------------------------------- |
| Auth implementation                        | 1.2        | Deployed session behavior, security model, OAuth capability needed for future MCP, and self-host configuration. |
| Email provider and domain onboarding       | 1.4        | Owned-address round trip and a supported hosted customer-domain path.                                           |
| Crawl/model provider and preview allowance | 1.5 and 2  | Source quality, verified structured output, measured usage, and abort/retry behavior.                           |
| Dowel adoption                             | 1.3        | Focus, mobile, portal, SSR, and bundle checks in the actual app.                                                |
| Karnstack context integration              | 5          | Real identity and entitlement schema, minimal read-only access, and useful support cases.                       |
| GitHub permissions and retention           | 9          | Selected-source scope, revocation, webhook checks, and deletion behavior.                                       |
| Billing provider and final prices          | 12         | Business eligibility, measured operating costs, and pilot willingness to pay.                                   |

The license decision is already made: AGPL-3.0-only for the app and MIT for the SDKs. The visual identity and Cloudflare deployment direction are also established. The immediate next task is 1.1.
