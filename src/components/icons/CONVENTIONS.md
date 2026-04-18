# Fish Tycoon 2 — SVG Naming Conventions

## Category Prefixes

| Category | Prefix | Size | Colors | Example |
|----------|--------|------|--------|---------|
| **Icon** | `Icon` | 16-24px | `currentColor` (inherits) | `IconCoin.jsx` |
| **Illustration** | `Illust` | 64-128px | Hardcoded pastels | `IllustEmptyTank.jsx` |
| **Portrait** | `Portrait` | 48px | Hardcoded skin/hair | `PortraitMerchant.jsx` |
| **Frame** | `Frame` | Variable (wraps children) | Rarity-themed | `FrameRare.jsx` |
| **Badge** | `Badge` | 24-32px | Tier-themed | `BadgeGold.jsx` |

## Component Interface

Every SVG component accepts these props:

```jsx
{
  size: number,       // Width in px. Height scales proportionally.
                      // Default: 16 (Icon), 48 (Portrait), 96 (Illust)
  className: string,  // CSS class for positioning/overrides
  style: object,      // Inline style for one-off adjustments
  title: string,      // Accessibility label (renders <title> in SVG)
}
```

Frames additionally accept:
```jsx
{
  children: ReactNode, // Content to wrap
  width: number,       // Frame width
  height: number,      // Frame height
}
```

## SVG Rules

1. **viewBox:** Always `"0 0 24 24"` for icons. Variable for others.
2. **Fill:** Icons use `currentColor`. Others use hardcoded hex.
3. **Stroke:** 2px, `strokeLinecap="round"`, `strokeLinejoin="round"` for icons.
4. **No IDs in SVGs** unless namespaced (e.g. `id="iconCoin_grad1"`). Avoid ID collisions when multiple instances render.
5. **No `<style>` blocks inside SVGs.** Use inline attributes.
6. **Export:** Named export from own file + re-export from `index.js`.

## File Location

```
src/components/icons/
├── index.js              ← barrel export
├── CONVENTIONS.md        ← this file
│
├── IconCoin.jsx          ← core icons
├── IconStar.jsx
├── IconFood.jsx
├── ...
│
├── IconFishBag.jsx       ← shop/supply icons
├── IconMedicinePill.jsx
├── ...
│
├── IconAlertFood.jsx     ← tank alert icons
├── IconAlertDisease.jsx
├── ...
│
├── IllustEmptyTank.jsx   ← empty-state illustrations
├── IllustNoFish.jsx
├── ...
│
├── PortraitMerchant.jsx  ← character portraits
├── PortraitCollector.jsx
├── ...
│
├── FrameCommon.jsx       ← rarity frames
├── FrameRare.jsx
├── ...
│
└── BadgeGold.jsx         ← achievement badges
```

## Migration Plan

The 15 existing icons in `src/components/GameIcons.jsx` will be:
1. Kept in `GameIcons.jsx` as the legacy source (avoid breaking imports)
2. Re-exported from `src/components/icons/index.js`
3. Gradually replaced with standalone files as each gets redesigned

This allows incremental migration without breaking existing `import { IconCoin } from './GameIcons.jsx'` references.
