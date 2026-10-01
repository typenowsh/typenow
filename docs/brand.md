# Typenow brand

The mark is an abstract folded knot. Its open center and connected ribbons suggest several channels becoming one conversation. It was generated for Typenow using QuiverAI Arrow 2, then stripped of its background and normalized to the application's charcoal color.

Assets:

- `apps/web/public/brand-mark.svg`: standalone symbol, on a transparent background.
- `apps/web/public/brand/avatar-{citron,cream,charcoal,transparent}.{svg,png}`: 1024 × 1024 avatar exports with padding for square and circular crops.
- `apps/web/public/brand.svg`: static symbol and outlined Inter wordmark.
- `apps/web/public/wordmark.svg`: outlined Inter wordmark.
- `apps/web/public/favicon.svg`: charcoal symbol on a rounded citron background, visible in both light and dark browser themes.
- `apps/web/public/social-card.html`: source for the 1200 × 630 social image.
- `apps/web/src/components/brand-logo.tsx`: inline symbol for interaction, with a static wordmark.

The header and footer symbols gently unfold on pointer hover and settle back on exit. Each ribbon uses a transform transition of 240ms with up to 45ms of stagger. Press feedback is small and reversible. Keyboard focus is immediate, and reduced-motion preferences disable both transitions and movement. The mark never loops or moves on page load. No animation dependency or Quiver runtime integration is shipped.

Keep the symbol monochrome and maintain its negative space at small sizes. Use the charcoal mark on cream, white, or citron. Use the citron mark on charcoal. Keep every ribbon the same color. Do not stretch, add outlines or shadows, or turn the mark into a loading spinner.

## Square exports

| Citron, primary GitHub avatar                                          | Cream                                                                | Charcoal                                                                 |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ![Charcoal mark on citron](../apps/web/public/brand/avatar-citron.png) | ![Charcoal mark on cream](../apps/web/public/brand/avatar-cream.png) | ![Citron mark on charcoal](../apps/web/public/brand/avatar-charcoal.png) |

Each opaque PNG is under 40 KB. The transparent variant uses the same framing without a backdrop. PNGs are rasterized directly from their SVG counterparts; they contain no text or animation.

Regenerate the SVG exports with `pnpm brand:svg`. Export those SVGs to PNG at 1024 × 1024 using a vector renderer or browser canvas. Preserve transparency for the transparent variant. These exports are committed assets and are not required during application builds.

The wordmark outlines retain Inter's SIL Open Font License, included in the public fonts directory. See [third-party notices](../THIRD_PARTY_NOTICES.md) for asset provenance.
