# Dowel for Typenow

Audit date: October 1, 2026.

## Decision

Use Dowel for a small dashboard pilot after fixing bare-field focus visibility. Keep the landing page custom. Do not make Dowel a prerequisite for shipping Typenow.

Dowel provides useful controls, accessible behavior primitives, and a consistent visual language. Typenow should own the conversation list, conversation detail, reply workflow, mobile navigation, attachment handling, and data loading. Start with one complete support workflow and measure the actual application before expanding adoption.

This is a conditional adoption recommendation, not a claim that Dowel has been integrated or verified in Typenow.

## What was audited

The local clone of `karnstack/dowel` is clean, on main, and points to `git@github.com:karnstack/dowel.git`. Its commit is `77286e3d5f0e59717bc4632bf676c369488c5be0`, dated August 9. That snapshot exposes eight components as `dowel@0.0.0` and is substantially behind the current repository.

The useful adoption target is the current public repository under Karnstack and published package **@karnstack/dowel@0.3.0**. The audit inspected a read-only snapshot of GitHub main at **f28320fe78dda5a1772c24c8d6824b091f076329**, plus the actual published npm archive. The local clone was not updated or modified.

The current library is MIT-licensed, ESM, and targets React 19. It uses StyleX, Base UI, React Aria, TanStack Form, and TanStack Table. Consumers of the published package import compiled JavaScript and extracted CSS; they do not need a StyleX compiler.

Sources: [repository at the audited commit](https://github.com/karnstack/dowel/tree/f28320fe78dda5a1772c24c8d6824b091f076329), [package manifest](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/package.json), [build configuration](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/tsdown.config.ts#L18).

## Findings

### Fix before using bare fields: missing visible focus treatment

Input styles remove the outline at line 24. The bare variant removes border and background at line 56; its focus rule at line 63 keeps the background transparent without adding a visible indicator. Input and Textarea share these styles, and Composer uses bare fields.

This matters directly to a reply composer. Add a deliberate focus ring, underline, or implemented enclosing focus treatment upstream. Verify keyboard focus in light and dark mode before using Composer or bare Textarea. An insertion caret does not substitute for a deliberate control focus treatment.

[input/input.stylex.ts:24](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/input/input.stylex.ts#L24)

### Fix before relying on concealed actions: no touch fallback

HoverActions conceals controls with zero opacity and disabled pointer events, restoring them on focus within. DataTable also changes action visibility through mouse and focus handlers. Keyboard users have a path, but there is no coarse-pointer visibility rule.

Provide a persistent overflow control or always-visible actions on touch devices. Do not rely on synthetic hover to expose an important inbox action. Existing hover-actions tests do not establish real touch behavior.

[hover-actions/hover-actions.stylex.ts:14](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/hover-actions/hover-actions.stylex.ts#L14), [data-table/index.tsx:711](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/data-table/index.tsx#L711)

### Application requirement: mobile navigation

Sidebar hides its panel below 1024px. The documentation explicitly makes mobile disclosure an application responsibility. This is a documented boundary, not an unexpected defect.

Typenow needs its own mobile navigation before Sidebar can be its primary navigation. Dowel Drawer can supply the overlay primitive, while Typenow handles the trigger, route state, focus, and dismissal.

[sidebar/sidebar.stylex.ts:5](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/sidebar/sidebar.stylex.ts#L5), [Sidebar documentation:59](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/apps/docs/src/routes/components/sidebar.tsx#L59)

### Application requirement: conversation selection semantics

ListRow renders an li. Its selected and disabled props change styles and data attributes; they do not implement keyboard activation, selection semantics, or disabled behavior.

Use a real link or button within a conversation row. Typenow must own the active-conversation semantics and keyboard behavior. Adding an onClick to ListRow alone would produce an incomplete interaction.

[list/index.tsx:53](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/list/index.tsx#L53), [list/list.stylex.ts:35](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/list/list.stylex.ts#L35)

### Application requirement: bounded inbox results

DataTable maps the provided rows in expanded groups and has no public pagination or virtualization contract. That is reasonable for bounded results; it is not a suitable reason to load an entire workspace inbox into the browser.

Start with server-side cursor pagination and bounded pages. Add virtualization if measured usage warrants it. The audit did not benchmark large datasets, so this is an integration requirement rather than a measured performance failure.

[data-table/index.tsx:116](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/data-table/index.tsx#L116), [row rendering:939](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/data-table/index.tsx#L939)

### Polish issue: hover styling on disabled buttons

Button variants use unguarded hover rules. Shared disabled styles change opacity and cursor without excluding those hover backgrounds. The repository's own CLAUDE.md asks for disabled guards. Capability gating is also absent from these hover rules.

Restrict hover feedback to enabled controls and appropriate pointer capabilities. This finding concerns feedback and touch polish; it is not evidence that disabled controls can activate, since Base UI handles their behavior.

[button/button.stylex.ts:92](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/button/button.stylex.ts#L92)

## What supports adoption

- Base UI controls and overlays, React Aria calendar behavior, compound APIs, ref forwarding, and controlled/uncontrolled state.
- Required accessible labels on IconButton and Field label/error wiring.
- Native buttons default to type button, avoiding accidental form submission.
- Dialog portals receive the active theme; system theme uses CSS media queries without browser-only reads during rendering.
- Inputs use 16px text below 640px, buttons add 48px coarse-pointer hit areas, and ordinary dialogs have viewport bounds and scrolling.
- Button and dialog styles include reduced-motion variants.
- Explicit ESM, type, and CSS exports, extracted CSS, and an MIT license.
- Frozen-lockfile CI with formatting, type checking, builds, unit tests, browser checks, and Changesets publishing after successful main CI.

Examples: [button defaults](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/button/index.tsx#L53), [portal theming](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/dialog/index.tsx#L36), [input sizing](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/input/input.stylex.ts#L15), [coarse-pointer button targets](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/packages/dowel/src/components/button/button.stylex.ts#L32).

## TanStack Start and Cloudflare fit

Dowel's own docs use TanStack Start prerendering with failOnError enabled. The release CI successfully prerendered its component routes. That supports a pilot in Typenow's Start app, but does not prove hydration, overlay behavior, or Cloudflare runtime integration here.

Use the published package in dashboard routes. Keep the marketing page outside the authenticated dashboard layout and import Dowel CSS through that layout. Inspect the resulting bundles to confirm what becomes shared with marketing. Tailwind can coexist with compiled Dowel styles, but its preflight and broad element selectors need a deliberate check against controls and portaled overlays.

Dowel intentionally prevents visual overrides on controls. Respect that API instead of reaching into generated classes. Current documentation permits application styling hooks on layout primitives such as Sidebar and DataTable. The current font recommendation is Host Grotesk Variable; the older local clone recommends Inter.

Version 0.3.0 is pre-1.0. Pin the pilot dependency and review upgrades. The current README also retains a stale statement that releases stay on 0.0.x until a Sourcetown milestone; update that statement before describing the package's maturity publicly.

## Evidence and limits

The audit inspected [successful release CI](https://github.com/karnstack/dowel/actions/runs/33002325160). Its existing logs report **54 test files, 257 unit tests, and 8 browser checks passed**. These are CI results, not tests rerun for this audit.

The browser suite checks catalog contrast in light and dark mode using desktop Chrome at 1440 by 1000. It does not establish complete mobile, Safari, screen-reader, focus, or open-overlay coverage. The jsdom axe setup disables contrast checking.

[Browser contrast tests](https://github.com/karnstack/dowel/blob/f28320fe78dda5a1772c24c8d6824b091f076329/apps/docs/test/browser/contrast.spec.ts#L124)

The actual published npm archive was downloaded and inspected. All **727 generated class names referenced by its JavaScript** were present in its CSS. No runtime style injection was found.

| Published artifact | Raw size     | Gzip size   |
| ------------------ | ------------ | ----------- |
| JavaScript         | About 230 KB | About 46 KB |
| Complete CSS       | About 80 KB  | About 13 KB |

Those JavaScript sizes exclude dependencies and precede consumer tree shaking. They are not the final dashboard cost. Measure the real route chunks.

No local dependency installation, Dowel build, unit-test rerun, production-browser integration test, or Cloudflare deployment was performed. The local Dowel clone remained untouched. No Dowel changes were shipped.

## Proposed dashboard pilot

1. Pin @karnstack/dowel@0.3.0 in a separate pilot branch. Do not use the stale local 0.0.0 package.
2. Fix bare-field focus upstream before using Composer or bare Textarea.
3. Start with ThemeProvider, Button, IconButton, Field/Input, Menu, Dialog, Tooltip, Avatar, Badge, and loading/empty states.
4. Implement one full workflow: bounded conversation list, conversation detail, reply draft, send confirmation, and loading/error/empty states.
5. Add Typenow-owned mobile navigation and persistent touch actions.
6. Check SSR and hydration, light/dark portals, keyboard focus and Escape, 390px mobile layout, touch targets, long threads, and the production Cloudflare build. Measure route chunks.
7. Expand adoption only if that workflow works well without repeated styling workarounds.

If its visual choices fit the dashboard, Dowel offers useful dogfooding for both products. If they make the inbox awkward, use Base UI directly with Typenow styling. Dowel already builds on capable behavior primitives; switching libraries is not automatically a better outcome.
