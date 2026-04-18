# Fish Tycoon 2 — SVG Art Cohesion Rules

> Every SVG asset must follow these rules to maintain visual unity.

## Stroke Style
- **Width:** 2px for icons (24x24), 1.5px for small (16x16), 2.5px for large (48+)
- **Line cap:** `round` always — never `butt` or `square`
- **Line join:** `round` always — never `miter`
- **Color:** `currentColor` for icons, hardcoded pastels for illustrations

## Corner Softness
- **All rectangles:** rx/ry ≥ 3 (at 24x24 scale). No sharp corners.
- **Circles preferred** over rectangles where possible
- **Organic curves** preferred over straight edges for creature features

## Eye Style (for creatures/characters)
- **Shape:** Circle, never oval or almond
- **Size:** 2.5-3.5px radius at 24x24 scale (proportionally cute/large)
- **Pupil:** Solid dark circle, 60% of eye radius
- **Highlight:** Small white circle at 10 o'clock position, 30% of eye radius
- **Expression:** Default is neutral-happy. Never angry/sad unless contextual.

## Shadow Softness
- **Drop shadows:** Always use `rgba(87,163,191,X)` — never `rgba(0,0,0,X)`
- **Opacity range:** 0.05–0.15 for fills, 0.08–0.20 for shadows
- **No hard shadows.** Minimum blur radius of 4px for any shadow.

## Palette Family
All SVG fills must come from the approved palette:

| Usage | Colors |
|-------|--------|
| Primary fills | Use the 6 pastels: pink, peach, mint, yellow, lavender, aqua |
| Outlines | Use `currentColor` or `var(--text-soft)` |
| Highlights | White at 20-40% opacity |
| Depth | Same hue as fill, 10-20% darker |
| Backgrounds | White at 10-20% opacity |

### Specific Color Assignments
| Subject | Primary Fill | Accent |
|---------|-------------|--------|
| Coins/gold | `#ffe99a` → `#f0b840` | `#8a6420` emboss |
| Health/hearts | `#ffb7d5` | `#e06080` |
| Water/drops | `#8fe7ff` | `#5cbfcf` |
| Nature/growth | `#bdf3d4` | `#6cc88a` |
| Science/lab | `#d8c7ff` | `#9080c0` |
| Warning | `#ffe99a` | `#f0b840` |
| Error/danger | `#ffc4c4` | `#f07070` |

## Badge/Frame Language
- **Shape:** Rounded rectangle with radius ≥ 12px (at frame size)
- **Border:** 2px, colored per rarity tier
- **Corner accents:** Small decorative dots or circles, never sharp geometric shapes
- **Glow:** Subtle `box-shadow` in rarity color at 15-25% opacity for rare+

## Scale & Proportion
| Category | viewBox | Default size prop |
|----------|---------|------------------|
| Icon | 24×24 | 16px |
| Status icon | 24×24 | 20px |
| Item icon | 24×24 | 24px |
| Portrait | 48×48 | 48px |
| Illustration | 128×96 | 96px |
| Frame | variable | wraps content |

## Compliance Checklist
Before committing any SVG asset:
- [ ] Uses `strokeLinecap="round"` and `strokeLinejoin="round"`
- [ ] No sharp corners (all rects have rx ≥ 3)
- [ ] Eyes follow the circle+highlight pattern
- [ ] Colors come from the approved palette
- [ ] Shadows use blue-tinted rgba
- [ ] Renders clearly at both 1x and 2x display density
- [ ] No `<style>` blocks (use inline attributes)
- [ ] No conflicting `id` attributes
