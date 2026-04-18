# Fish Tycoon 2 — Visual Rules Checklist

Use this checklist to audit any component or screen for cute-compliance.
Every item should be ✅ before shipping.

---

## PALETTE

- [ ] **No dark backgrounds.** No element has a background darker than `#d0e8f0`. No `rgba(r,g,b,a)` where r,g,b are all below 100.
- [ ] **No pure black text.** Text colors are `#2c4a62` (primary), `#4a708a` (soft), or `#8ba3b8` (muted). Never `#000`, `#111`, `#222`.
- [ ] **Accents are pastel.** All accent colors come from the 6-color set: pink, peach, mint, yellow, lavender, aqua. No neon, no electric.
- [ ] **Section colors applied.** Each game section uses its designated accent color for: left border, active indicator, header tint.
- [ ] **Rarity uses correct colors.** Common=gray, Uncommon=mint, Rare=aqua, Epic=lavender, Legendary=gold. Consistent everywhere.
- [ ] **Semantic colors consistent.** Success=green, Warning=amber, Error=coral, Info=blue. Same hex values everywhere.
- [ ] **Panel fills are translucent white.** All panels use `rgba(255,255,255,0.72)` or the solid fallback `#f5fbff`. No dark panel fills remain.

## SHAPE

- [ ] **Minimum radius 8px.** No border-radius value is below 8px anywhere in the CSS (except 0px for resets/overrides and 1-2px for hairline dividers).
- [ ] **Panels have 24px radius.** All major panel containers use `border-radius: 24px`.
- [ ] **Cards have 16px radius.** Inner cards (fish cards, supply cards, achievement cards) use `border-radius: 16px`.
- [ ] **Buttons are pill-shaped.** All `.btn` elements use `border-radius: 999px`.
- [ ] **Badges/tags are pill-shaped.** Rarity badges, stat pills, tags use `border-radius: 999px`.
- [ ] **No sharp inner elements.** Inputs, selects, and small interactive elements have at least 8-12px radius.

## SHADOWS

- [ ] **No dark shadows.** No `box-shadow` uses `rgba(0,0,0,X)` where X > 0.12.
- [ ] **All shadows blue-tinted.** Shadows use `rgba(87,163,191,X)` or similar cool-blue tint.
- [ ] **Three shadow levels.** Small (sm), medium (md), large (lg) — no custom one-offs.
- [ ] **No text shadows.** `text-shadow: none` on all text. Zero exceptions.
- [ ] **No inset shadows imitating depth.** No `inset 0 -2px ...` style tricks that create dark grooves.

## TYPOGRAPHY

- [ ] **Quicksand for headings.** All h1, h2, h3, section titles, and panel headers use `font-family: 'Quicksand'`.
- [ ] **Nunito for body.** All body text, labels, descriptions, and UI text use `font-family: 'Nunito'`.
- [ ] **No angular fonts.** Zero references to Rajdhani, Barlow, or Barlow Condensed in the active CSS.
- [ ] **No uppercase body text.** `text-transform: uppercase` only on labels at `--fs-xs` size or smaller.
- [ ] **Readable sizes.** No text smaller than 11px. Body text is 14px minimum.
- [ ] **Comfortable line-height.** Body text: ≥1.4. Headings: ≥1.15.
- [ ] **Letter-spacing is subtle.** Body: 0. Headings: -0.02em max. Labels: +0.04em max.

## SPACING

- [ ] **Panel padding ≥ 16px.** No panel has less than 16px internal padding.
- [ ] **Card gap ≥ 10px.** Grid/flex gaps between cards are at least 10px.
- [ ] **Section gap ≥ 16px.** Vertical space between sections/groups is at least 16px.
- [ ] **Buttons have chunky padding.** Buttons have at least 10px vertical and 16px horizontal padding.
- [ ] **UI breathes.** No area of the screen feels cramped or overwhelming. Negative space is used intentionally.

## ICONS

- [ ] **No emoji in rendered UI.** Zero emoji characters (🪙🐟💧🌡️ etc.) appear in the production interface.
- [ ] **All icons are SVG components.** Icons are React components from `src/components/icons/`. No `<img>` tags for icons.
- [ ] **Consistent icon sizing.** Small icons: 16px. Medium: 20px. Large: 24px. Illustrations: 48-128px.
- [ ] **Icons inherit color.** Icon SVGs use `currentColor` for stroke/fill (except multicolor illustrations).
- [ ] **Icon naming follows convention.** `Icon{Name}`, `Illust{Name}`, `Portrait{Name}`, `Frame{Name}`.

## MOTION

- [ ] **Hover states use transform.** Buttons lift on hover (`translateY(-1px)`). Cards lift more (`translateY(-3px)`). No color-only hovers.
- [ ] **Active states press down.** Buttons compress on click (`translateY(1px) scale(0.98)`).
- [ ] **Disabled states are obvious.** Opacity 0.45, cursor: default, no hover transform.
- [ ] **Transitions are specified.** No `transition: all`. Every transition names its properties.
- [ ] **Transitions are ≥ 100ms.** No sub-100ms transitions (too jarring). Normal: 180ms.
- [ ] **Reduced motion respected.** `@media (prefers-reduced-motion)` disables looping animations (bob, sparkle, drift). Keeps one-shot transitions.

## CONSISTENCY

- [ ] **One panel style.** All 35+ panels look like they belong in the same game.
- [ ] **One button style.** All buttons share the same base appearance (white gradient pill with soft shadow).
- [ ] **One card style.** Fish cards, supply cards, upgrade cards, achievement cards share the same base (white, rounded, soft shadow).
- [ ] **Color-coded sections.** A player can tell which section they're in by the accent color.
- [ ] **Empty states have illustrations.** Every "nothing here yet" view has a cute SVG illustration, not just text.

---

## How to Use

### During Development
Before merging any PR that touches UI:
1. Open the affected screen
2. Walk this checklist
3. Fix any ❌ items
4. Mark items ✅ in the PR description

### Full Audit
Run through every screen (Title, Tank, HUD, Shop, Breeding, Fishdex, Achievements, Stats, Settings, Campaign, Rare Market, Offline Summary, all modals) and check every item. Record results in a table:

| Screen | Palette | Shape | Shadows | Type | Spacing | Icons | Motion | Score |
|--------|---------|-------|---------|------|---------|-------|--------|-------|
| Title  | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ | 6/7 |
| ...    |   |   |   |   |   |   |   |   |

### Scoring
- ✅ = Fully compliant
- ⚠️ = Minor issue (1-2 items failing)
- ❌ = Major issue (3+ items failing)

Target: All screens at ✅ or ⚠️ before v1.0.
