# Fish Tycoon 2 — Design Brief

> **Vibe:** Cute cozy aquarium toy. Think Stardew Valley meets a capsule-toy machine at an aquarium gift shop.

---

## 1. Palette

### Backgrounds
| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-top` | `#c8f3ff` | Top of page gradient |
| `--bg-bottom` | `#eefcff` | Bottom of page gradient |
| `--bg-highlight` | `rgba(255,255,255,0.55)` | Radial light spots on bg |

### Panels
| Token | Value | Usage |
|-------|-------|-------|
| `--panel` | `rgba(255,255,255,0.72)` | All card/panel fills |
| `--panel-solid` | `#f5fbff` | When backdrop-filter unavailable |
| `--panel-border` | `rgba(255,255,255,0.88)` | Panel stroke |
| `--panel-hover` | `rgba(255,255,255,0.85)` | Hovered panel fill |

### Text
| Token | Hex | Usage |
|-------|-----|-------|
| `--text` | `#2c4a62` | Primary text (headings, body) |
| `--text-soft` | `#4a708a` | Secondary text (descriptions) |
| `--text-muted` | `#8ba3b8` | Tertiary (timestamps, hints) |
| `--text-on-accent` | `#1a3a4a` | Text on pastel accent bg |

### Accents (pastel)
| Token | Hex | Name | Section |
|-------|-----|------|---------|
| `--pink` | `#ffb7d5` | Rose | Magic Fish |
| `--peach` | `#ffd3b6` | Peach | Shop / Market |
| `--mint` | `#bdf3d4` | Mint | Decorations |
| `--yellow` | `#ffe99a` | Butter | Achievements / Goals |
| `--lavender` | `#d8c7ff` | Lavender | Breeding |
| `--aqua` | `#8fe7ff` | Sky | Stats / Records / Campaign |

### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#6cc88a` | Positive outcomes, cure, hatch |
| `--warning` | `#f0b840` | Caution, low supplies |
| `--error` | `#f07070` | Danger, death, failure |
| `--info` | `#7dcfea` | Neutral info, tips |
| `--gold` | `#f0b840` | Coins, premium, legendary |
| `--gold-light` | `#ffe99a` | Gold highlights |

### Rarity
| Tier | Color | Glow |
|------|-------|------|
| Common | `#a0b0c0` | none |
| Uncommon | `#6cc88a` | `rgba(108,200,138,0.2)` |
| Rare | `#5cbfcf` | `rgba(92,191,207,0.25)` |
| Epic | `#c0a0e8` | `rgba(192,160,232,0.3)` |
| Legendary | `#f0b840` | `rgba(240,184,64,0.35)` |

---

## 2. Shape Language

### Border Radius
| Context | Radius | Token |
|---------|--------|-------|
| Full panels, modals | 24px | `--radius-xl` |
| Cards, sections | 16px | `--radius` |
| Inner cards, inputs | 12px | `--radius-sm` |
| Small items, tags | 8px | `--radius-xs` |
| Buttons, badges, pills | 999px | `--radius-pill` |

**Rule:** Nothing in the UI should have radius < 8px. If something looks sharp, round it.

### Shadows
| Name | Value | Usage |
|------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(87,163,191,0.08)` | Subtle depth on small items |
| `--shadow-md` | `0 6px 20px rgba(87,163,191,0.12)` | Standard panel shadow |
| `--shadow-lg` | `0 10px 30px rgba(87,163,191,0.18)` | Elevated modals/overlays |
| `--shadow-glow` | `0 0 20px rgba(143,231,255,0.15)` | Soft highlight glow |

**Rule:** All shadows use blue-tinted rgba(87,163,191,...). Never use rgba(0,0,0,...) above 0.12 opacity.

### Borders
- Panel borders: `1.5px solid var(--panel-border)` — barely visible, just enough to define edges
- Accent borders: `3px solid var(--section-color)` on the left side of section panels
- No harsh dark borders anywhere

---

## 3. Typography

### Font Stack
| Role | Family | Fallback |
|------|--------|----------|
| Display (headings, titles) | Quicksand | Nunito, sans-serif |
| Body (content, labels) | Nunito | sans-serif |
| Mono (code, debug) | JetBrains Mono | monospace |

### Scale
| Token | Size | Usage |
|-------|------|-------|
| `--fs-xs` | 11px | Tiny labels, timestamps |
| `--fs-sm` | 12.5px | Secondary text, captions |
| `--fs-base` | 14px | Body text default |
| `--fs-md` | 16px | Emphasized body, stat values |
| `--fs-lg` | 20px | Section titles |
| `--fs-xl` | 26px | Panel headings |
| `--fs-2xl` | 36px | Page titles, coin display |

### Weight
| Weight | Usage |
|--------|-------|
| 400 | Body text, descriptions |
| 600 | Labels, stat values, buttons |
| 700 | Headings, section titles |
| 800 | Page titles, coin display |

### Rules
- **No all-caps** except tiny labels (xs size) and badge text
- **Letter-spacing:** -0.02em on headings, 0 on body, +0.04em on tiny labels
- **Line-height:** 1.5 for body, 1.2 for headings
- **Text shadows:** None. Ever. Zero. On any element.

---

## 4. Motion

### Named Animations
| Name | Duration | Easing | Keyframes | Usage |
|------|----------|--------|-----------|-------|
| `gentleBob` | 1.6s | ease-in-out | Y: 0 → -4px → 0 | Card hover, merchant portrait |
| `softBounce` | 0.4s | ease | scale: 0.92 → 1.05 → 1 | New notifications, unlocks |
| `sparkle` | 1.2s | ease-in-out | opacity: 0.4 → 1 → 0.4 + rotate ±5° | Legendary items, new badges |
| `bubbleDrift` | 8-12s | linear | Y: 100vh → -10vh, X: wobble ±10px | Background decoration |
| `coinPop` | 0.6s | ease-out | Y: 0 → -20px, opacity: 1 → 0 | Coin gain indicator |
| `slideIn` | 0.2s | ease-out | Y: 8px → 0, opacity: 0 → 1 | Tab content transitions |

### Transition Defaults
| Token | Duration | Usage |
|-------|----------|-------|
| `--tr-fast` | 100ms | Color changes, opacity |
| `--tr-normal` | 180ms | Transform, shadow, border |
| `--tr-slow` | 300ms | Panel slide, modal enter |

### Rules
- Hover transforms: `translateY(-1px) scale(1.02)` for buttons, `translateY(-3px)` for cards
- Active transforms: `translateY(1px) scale(0.98)` for buttons
- Never use `transition: all`. Always specify properties.
- Reduced motion: Respect `prefers-reduced-motion` — disable bob, sparkle, drift. Keep slideIn and softBounce.

---

## 5. Icon Conventions

### Format
All UI icons are **inline React SVG components**. No emoji. No icon fonts. No image files.

### Naming
| Category | Prefix | Example | Size |
|----------|--------|---------|------|
| Icon (mono, small) | `Icon` | `IconCoin`, `IconFood` | 16–24px |
| Illustration (multi, large) | `Illust` | `IllustEmptyTank` | 64–128px |
| Portrait (character face) | `Portrait` | `PortraitMerchant` | 48px |
| Badge/Frame (wraps content) | `Badge` / `Frame` | `FrameRare` | variable |

### Component Interface
```jsx
// Every icon component accepts:
{
  size: number,       // default 16 (icons) or 48 (illustrations)
  className: string,  // for CSS overrides
  style: object,      // for inline positioning
  title: string,      // optional accessibility label
}
```

### Color Rules
- **Icons:** Use `currentColor` for stroke/fill so they inherit from parent text color
- **Illustrations:** Use hardcoded pastel colors from the palette
- **Portraits:** Use hardcoded skin/hair/clothing colors
- **Frames:** Use rarity colors from the palette

### File Location
```
src/components/icons/
├── index.js          (barrel export)
├── IconCoin.jsx
├── IconFood.jsx
├── ...
├── IllustEmptyTank.jsx
├── PortraitMerchant.jsx
└── FrameRare.jsx
```

---

## 6. Section Theming

Each game section has a signature accent color used for:
- Left border accent on panels
- Active tab indicator
- Section header icon tint
- Progress bar fill

| Section | Accent | CSS Token |
|---------|--------|-----------|
| Shop / Market | Peach | `--peach` |
| Breeding / Genetics | Lavender | `--lavender` |
| Achievements / Goals | Butter Yellow | `--yellow` |
| Magic Fish | Rose Pink | `--pink` |
| Decorations | Mint | `--mint` |
| Stats / Records / Log | Aqua | `--aqua` |
| Office / Staff | Peach (lighter) | `--peach` |
| Campaign | Aqua | `--aqua` |
| Rare Market | Lavender + Pink | gradient |
| Settings | Neutral | panel default |

---

## 7. Anti-Patterns

These are **banned** from the cute redesign:

| # | Anti-Pattern | Why |
|---|-------------|-----|
| 1 | Dark backgrounds (`#0xxxxx`, `rgba(0-30,...)`) | Creates dashboard/admin feel |
| 2 | Pure black text (`#000`, `#111`) | Too harsh for cozy aesthetic |
| 3 | Sharp corners (radius < 8px) | Feels corporate/technical |
| 4 | Emoji in production UI | Inconsistent rendering, not cute enough |
| 5 | Heavy dark shadows (`rgba(0,0,0, >0.15)`) | Creates harsh depth |
| 6 | `text-transform: uppercase` on body text | Feels like a military/tech UI |
| 7 | Dense spacing (padding < 12px on panels) | Creates cognitive overload |
| 8 | Glassmorphism with dark tints | Belongs in a crypto dashboard |
| 9 | Multiple competing borders on a single element | Visual noise |
| 10 | `letter-spacing > 0.1em` on body text | Looks like a corporate deck |
| 11 | Angular/condensed fonts (Rajdhani, Barlow Condensed) | Technical feel |
| 12 | Neon/electric glow effects | Wrong vibe entirely |
