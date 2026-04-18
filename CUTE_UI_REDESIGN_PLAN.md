# Fish Tycoon 2 — Cute UI Redesign: 30-Step Plan

## Current State
- **52 components**, 17,378 lines of CSS, 73 CSS variables
- **38 emoji references** used as icons (coins, fish, tools, alerts)
- **173 inline style blocks** scattered across components
- Dark workshop/dashboard aesthetic throughout
- Fonts: Rajdhani + Barlow (angular, technical feel)
- Radius: 2–3px everywhere (sharp, corporate)
- Shadows: heavy black drop shadows

---

## Step 1: Define the Art Direction as a Reusable Design Brief

**Why:** Every subsequent step references this. Without a frozen brief, decisions drift.

**Files:** Create `src/design/BRIEF.md` (reference doc, not code)

**Done when:** A single markdown file exists that any step can reference for palette, shape language, motion rules, type scale, and icon conventions.

**Prompt:**
```
I'm redesigning Fish Tycoon 2's UI from a dark dashboard style to a cute, cozy aquarium toy style.

Create a design brief document (BRIEF.md) that covers:

1. PALETTE — Define exact hex values for: bg gradient (top/bottom), panel fill, panel border, text (primary/secondary/muted), and 6 accent pastels (pink, peach, mint, yellow, lavender, aqua). Also define success/warning/error/info colors in the same pastel family.

2. SHAPE LANGUAGE — Border radius rules (cards, buttons, badges, small items). Shadow definitions (soft only, no dark). Corner and edge treatment philosophy.

3. TYPOGRAPHY — Font stack (Quicksand for display, Nunito for body). Size scale from xs to 2xl. Weight usage rules. Letter-spacing and line-height.

4. MOTION — Define 4 named animations: gentleBob, softBounce, sparkle, bubbleDrift. Duration and easing for each. Rules for when to use which.

5. ICON CONVENTIONS — All UI icons are inline React SVG components. Naming: Icon{Name} (e.g. IconCoin, IconFood). Size prop, default 16px. Color inherits from CSS currentColor. No emoji in production UI.

6. SECTION THEMING — Color-code each game section: Shop=peach, Breeding=lavender, Achievements=yellow, Magic=pink, Decorations=mint, Stats=aqua.

7. ANTI-PATTERNS — List 10 things to explicitly avoid (dark backgrounds, sharp corners, heavy borders, emoji icons, dense spacing, etc.)

Output as clean markdown I can reference from any file.
```

---

## Step 2: Create a Visual Rules Checklist

**Why:** A pass/fail checklist catches regressions during and after redesign.

**Files:** Create `src/design/CHECKLIST.md`

**Done when:** A checklist exists with ~30 yes/no items covering palette, radius, shadows, spacing, emoji, typography.

**Prompt:**
```
Based on this design brief for Fish Tycoon 2 (a cute cozy aquarium game), create a visual compliance checklist with ~30 yes/no items.

Group them into:
- PALETTE (no dark backgrounds, no pure black text, accents are pastel, etc.)
- SHAPE (minimum radius 8px, buttons pill-shaped, cards 20-28px radius)
- TYPOGRAPHY (Quicksand headings, Nunito body, no all-caps except tiny labels)
- SPACING (min panel padding 16px, min card gap 12px, line-height ≥1.4)
- ICONS (no emoji in production, all icons are SVG components, consistent sizing)
- MOTION (hover states use transform not color-swap, transitions ≥100ms)
- SHADOWS (no rgba(0,0,0,>0.2), all shadows use blue-tinted rgba)

Format as a markdown checklist I can paste into a PR review.
```

---

## Step 3: Inventory All UI Screens and Classify

**Why:** Prioritize which screens to fix first based on player visibility and current quality.

**Files:** All 52 components in `src/components/`

**Done when:** A table exists classifying every screen as: ✅ OK / ⚠️ Needs work / ❌ Full redesign, plus estimated effort.

**Prompt:**
```
I have a React game (Fish Tycoon 2) with these 52 UI components:

[paste the component list]

I'm redesigning from dark-dashboard to cute-cozy-pastel.

For each component, classify it as:
- ✅ Minor tweaks (colors/radius only)
- ⚠️ Moderate rework (layout + color + icons)
- ❌ Full redesign needed

Also rank them by player visibility (how often seen, 1-5).

Output a markdown table with columns: Component | Classification | Visibility | Key Issues | Estimated Changes

Sort by visibility DESC then classification severity DESC.
```

---

## Step 4: Build an SVG Asset Backlog

**Why:** Know exactly which SVGs need to be created before you start building them.

**Files:** Reference from component audit

**Done when:** A grouped list of every SVG asset needed, with name, usage location, and priority.

**Prompt:**
```
I'm replacing all emoji and text-based icons in Fish Tycoon 2 with SVG React components.

Here are the current emoji usages across the codebase:
- 🪙 (coins) — HUD, shop, rewards, tooltips
- 🐟 (fish) — empty states, counts
- 💧 (water) — water quality indicator
- 🌡️ (temp) — temperature indicator
- 🍽️ (food) — food supply
- 🩺 (medicine) — cure/treatment
- ⭐ (star) — ratings, achievements
- 💀 (death) — fish died
- 🧬 (genetics) — breeding, genes
- 🏆 (trophy) — achievements
- 🔬 (research) — research panel
- 🧪 (lab) — breeding lab
- 🎣 (fishing) — catch of day
- 📰 (news) — events, reviews
- Plus: merchant portraits, rarity frames, empty state illustrations, tank alerts, offline summary icons, ascension tree nodes

Create a complete SVG asset backlog with columns:
Asset Name | Component Convention | Where Used | Priority (P1/P2/P3) | Complexity (S/M/L)

Group by: Core Icons, Item Icons, Status Icons, Portraits, Frames, Illustrations, Decorative.
```

---

## Step 5: Freeze Naming Conventions

**Why:** Inconsistent naming creates confusion and duplicate work.

**Files:** Create `src/components/icons/index.js` (barrel export)

**Done when:** A naming convention doc exists and an empty barrel file is ready.

**Prompt:**
```
I'm building an SVG icon system for a React game. Define naming conventions for:

1. ICONS (small, 16-24px, monochrome): Icon{Name}.jsx — e.g. IconCoin, IconFood, IconWater
2. ILLUSTRATIONS (larger, multicolor, decorative): Illust{Name}.jsx — e.g. IllustEmptyTank
3. BADGES (rarity frames, achievement frames): Badge{Name}.jsx
4. PORTRAITS (merchant/character faces): Portrait{Name}.jsx
5. FRAMES (decorative card borders): Frame{Name}.jsx

Rules:
- All components accept: size (number), className (string), style (object)
- Icons use currentColor for fill
- Illustrations/portraits use hard-coded colors
- All are pure functional components, no state
- Export everything from src/components/icons/index.js

Create the barrel file (index.js) with placeholder exports for the first 20 most important assets based on the Fish Tycoon 2 game.
```

---

## Step 6: Extract or Define Design Tokens

**Why:** CSS variables are the single source of truth. Get them right and everything downstream inherits correctly.

**Files:** `src/index.css` (`:root` block)

**Done when:** `:root` contains all tokens from the design brief, organized by category with comments. Old dark-theme variables are removed or aliased.

**Prompt:**
```
Here are my current CSS :root variables for Fish Tycoon 2:

[paste current :root block from index.css]

Replace them with a cute cozy aquarium theme. The new :root should have:

PALETTE:
--bg-top: #c8f3ff    --bg-bottom: #eefcff
--panel-bg: rgba(255,255,255,0.72)    --panel-border: rgba(255,255,255,0.88)
--text: #35506b    --text-soft: #6f8aa3    --text-muted: #90a8bf
--pink: #ffb7d5  --peach: #ffd3b6  --mint: #bdf3d4  --yellow: #ffe99a  --lavender: #d8c7ff  --aqua: #8fe7ff
--success: #6cc88a  --warning: #f0b840  --error: #f07070  --info: #8fe7ff

GEOMETRY:
--radius-xs: 8px  --radius-sm: 12px  --radius: 16px  --radius-xl: 24px  --radius-pill: 999px
--shadow-sm/md/lg using rgba(87,163,191,...)

TYPOGRAPHY:
--font-display: 'Quicksand'  --font-body: 'Nunito'
--fs-xs through --fs-2xl

MOTION:
--ease-bounce, --ease-soft, --tr-fast: 120ms, --tr-normal: 200ms

Keep backward compatibility by aliasing old names where possible (e.g. --accent → --pink).
Output only the :root block, well-commented.
```

---

## Step 7: Create a Cute Theme Foundation

**Why:** Global styles (body, *, headings, links) set the baseline. Everything inherits from here.

**Files:** `src/index.css` — body, *, h1-h3, button base

**Done when:** Opening the app shows pastel gradient background, white panels, rounded corners, Nunito/Quicksand fonts, with no dark remnants.

**Prompt:**
```
I'm updating Fish Tycoon 2's global CSS foundation. Here's my :root block:
[paste :root]

Now write the global styles for:
1. body — pastel gradient background with subtle radial light spots
2. *, *::before, *::after — box-sizing
3. h1, h2, h3 — Quicksand font, navy color, no text-shadow, -0.02em letter-spacing
4. button base — remove all default styles, set cursor pointer
5. input, select — rounded, light border, soft shadow
6. ::selection — use --aqua with 30% opacity
7. scrollbar — thin, pastel-themed (webkit + firefox)
8. ::placeholder — use --text-muted

Also add a .cute-panel utility class:
- background: var(--panel-bg)
- border: 1.5px solid var(--panel-border)
- border-radius: var(--radius-xl)
- box-shadow: var(--shadow-md)
- backdrop-filter: blur(10px)
- padding: 20px

Output only the CSS.
```

---

## Step 8: Refactor Shared Panel Shell Styles

**Why:** 35+ panels share similar structure. A single `.cute-panel` class replaces 35 separate background/border/radius/shadow declarations.

**Files:** `src/index.css`, plus potentially all panel components to add the className

**Done when:** All major panels (shop, fishdex, breeding lab, achievements, stats, etc.) use the same panel base class and look consistent.

**Prompt:**
```
I have 35+ panel components in Fish Tycoon 2 that each define their own background/border/radius/shadow. I want to unify them.

Here are the panel class names that need the shared style:
.shop-panel, .fishdex-panel, .fish-panel, .log-panel, .ach-panel, .magic-panel, .stats-panel, .decor-panel, .autopsy-panel, .supplies-panel, .breeding-lab, .goals-panel, .staff-panel, .research-panel, .equipment-panel, .amenities-panel, .reviews-panel, .room-panel, .fish-show-panel, .catch-panel, .mod-panel, .gene-journal, .notification-center, .settings-modal, .wanted-board

Write a single CSS rule that applies the cute panel treatment to ALL of these:
- background: rgba(255,255,255,0.72)
- border: 1.5px solid rgba(255,255,255,0.88)
- border-radius: 24px
- box-shadow: 0 10px 30px rgba(87,163,191,0.18)
- backdrop-filter: blur(10px)

Also add section-specific left border accents:
- Shop panels → peach (#ffd3b6)
- Breeding panels → lavender (#d8c7ff)
- Achievement panels → yellow (#ffe99a)
- Magic panels → pink (#ffb7d5)
- Decoration panels → mint (#bdf3d4)
- Stats/log panels → aqua (#8fe7ff)

Output only the CSS.
```

---

## Step 9: Standardize Interaction States

**Why:** Buttons, cards, tabs, and chips currently have inconsistent hover/active/disabled states.

**Files:** `src/index.css` — `.btn`, card hover states, tab active states

**Done when:** Every interactive element has: hover (lift + brighten), active (press down), disabled (50% opacity), focus-visible (aqua ring). Consistent across all component types.

**Prompt:**
```
Standardize all interaction states for Fish Tycoon 2's cute UI.

Write CSS for these interactive element categories:

1. .btn (all buttons):
   - Default: white gradient, pill shape, soft shadow
   - Hover: translateY(-1px), scale(1.02), stronger shadow
   - Active: translateY(1px), scale(0.98)
   - Disabled: opacity 0.45, no pointer
   - Focus-visible: 2px aqua ring

2. .btn-primary: aqua gradient
3. .btn-danger: soft red gradient
4. .btn-sell: peach gradient

5. Cards (.listing-card, .supply-card, .upgrade-card, .fdex-card, .ach-card):
   - Hover: translateY(-2px), border glow, gentle bob animation
   - Selected: aqua border, subtle aqua background tint

6. Tabs (.tank-tab, .nav-rail-btn, .fdex-tab):
   - Active: filled aqua background, darker text
   - Hover: light aqua tint

7. Chips/badges (.rarity-badge, .fish-tag):
   - Pill shaped, sticker feel, slight shadow

Include the @keyframes gentleBob animation.
Output only the CSS.
```

---

## Step 10: Create a Reusable React SVG Component Pattern

**Why:** Establish the template that all 40+ SVG components will follow.

**Files:** Create `src/components/icons/IconTemplate.jsx`, `src/components/icons/Icon.jsx` (wrapper)

**Done when:** A documented template exists showing: props interface, viewBox conventions, color inheritance, size scaling, className pass-through.

**Prompt:**
```
Create a reusable React SVG icon component pattern for Fish Tycoon 2.

Build two files:

1. src/components/icons/Icon.jsx — A wrapper component:
   - Props: name (string), size (number, default 16), className, style, title (accessibility)
   - Renders an <svg> with viewBox="0 0 24 24", width/height from size
   - Passes className and style through
   - If title provided, adds <title> element for screen readers
   - Export as default

2. src/components/icons/IconCoin.jsx — First real icon as an example:
   - A cute coin icon: circular, gold/yellow fill, with a subtle shine highlight and a "C" or fish symbol embossed
   - Uses the standard pattern from Icon.jsx
   - Colors: fill uses var(--yellow, #ffe99a) and var(--gold, #f0b840)
   - Should look cute/toy-like, not realistic

Also create src/components/icons/index.js barrel that exports both.

Make the pattern easy to copy for new icons. Include a comment header explaining the conventions.
```

---

## Step 11: Build the Core Icon Pack

**Why:** These icons appear on every screen. Replacing them removes the most visible emoji.

**Files:** `src/components/icons/` — Create 12-15 core icons

**Done when:** All HUD and navigation icons are SVG components. No emoji visible on the main game screen.

**Prompt:**
```
Build the core icon pack for Fish Tycoon 2. Create these SVG React components in src/components/icons/:

1. IconCoin — gold coin with fish emboss, cute shine
2. IconFood — fish food container or pellets
3. IconWater — water droplet, blue
4. IconTemp — thermometer, cute/rounded
5. IconHeart — health heart, pink, slightly puffy
6. IconStar — 5-point star, golden, rounded points
7. IconSkull — cute skull (not scary — think Animal Crossing), for fish death
8. IconDNA — double helix, purple/lavender, for genetics
9. IconFlask — lab flask/beaker, for research
10. IconShield — protective shield, for equipment
11. IconClock — clock face, for timers/aging
12. IconSparkle — sparkle/shine, for rarity/special
13. IconBubble — bubble, for decorative use
14. IconWarning — rounded triangle, for alerts
15. IconCheck — checkmark in circle, for completion

Each component should:
- Accept props: size (default 16), className, style
- Use viewBox="0 0 24 24"
- Use cute/rounded shapes, 2px stroke, rounded line caps
- Use currentColor for strokes so they inherit text color
- Have a subtle fill where appropriate
- Be pure functional components

Update index.js to export all of them. Output all files.
```

---

## Step 12: Build Supply and Shop Item Icons

**Why:** The shop screen is heavily emoji-dependent. Custom icons make it feel polished.

**Files:** `src/components/icons/` — 10-12 item icons

**Done when:** Shop supply cards, upgrade cards, and fish purchase buttons use SVG icons instead of emoji.

**Prompt:**
```
Build item icons for Fish Tycoon 2's shop. These replace emoji on supply cards and upgrade buttons.

Create these SVG React components:

1. IconMedicine — pill/capsule, pastel green
2. IconAntiparasitic — droplet with cross, teal  
3. IconDigestiveRemedy — stomach/potion bottle, peach
4. IconWaterTreatment — water drops with sparkle, blue
5. IconHeaterCartridge — heating element, orange/warm
6. IconFishNet — small net, for catching
7. IconFishBag — fish in bag (shop purchase icon)
8. IconUpgrade — upward arrow in circle, for upgrades
9. IconReputation — ribbon/rosette, for rep upgrades
10. IconAutoFeed — food bowl with timer/auto symbol
11. IconMutagen — DNA with lightning, for mutation upgrade
12. IconTankExpand — tank outline with plus, for tank upgrades

Same conventions as Step 11. Cute, rounded, 24x24 viewBox.
```

---

## Step 13: Build Tank Alert and Status Icons

**Why:** Tank alerts (low food, disease, water quality) currently use emoji or colored text. Custom SVG alerts are clearer and cuter.

**Files:** `src/components/icons/` — 8 alert icons, `src/components/TankView.jsx`

**Done when:** Tank alert badges in TankView use SVG icons. The alert strip at the top of the tank shows cute icons instead of emoji.

**Prompt:**
```
Build tank alert/status icons for Fish Tycoon 2's TankView component.

Currently the tank has an alert strip that shows text badges for: low food, low water quality, disease, overcrowded, temperature, equipment broken.

Create these alert SVG icons:
1. IconAlertFood — empty bowl with exclamation
2. IconAlertWater — murky water droplet
3. IconAlertDisease — bug/germ with warning
4. IconAlertCrowded — fish overlapping
5. IconAlertTemp — thermometer with warning
6. IconAlertEquip — wrench with exclamation
7. IconAlertDeath — cute ghost (fish spirit floating up)
8. IconAlertEgg — egg with crack/sparkle (ready to hatch)

These should be slightly larger than standard icons (default size 20).
Use warm warning colors (peach/coral for danger, yellow for caution, mint for info).
Style: cute and non-alarming — this is a cozy game, not a crisis dashboard.
```

---

## Step 14: Build Offline Summary Icons

**Why:** The offline summary popup shows what happened while away. It's one of the first things returning players see.

**Files:** `src/components/icons/`, `src/components/OfflineSummary.jsx`

**Done when:** Offline summary shows SVG icons for: coins earned, fish sold, fish died, fish bred, discoveries, events.

**Prompt:**
```
Build icons for Fish Tycoon 2's offline summary screen. This popup appears when a player returns after being away.

Create 6 summary-category icons (size 28-32, multicolor):
1. IllustCoinsEarned — pile of coins with sparkle
2. IllustFishSold — fish with price tag
3. IllustFishDied — fish angel/halo (cute, not sad)
4. IllustEggHatched — cracked egg with baby fish
5. IllustDiscovery — magnifying glass over fish silhouette
6. IllustEvent — scroll/newspaper with sparkle

These are slightly larger illustrations (not just icons). They can use multiple colors.
They should feel like achievement stamps or sticker rewards.
```

---

## Step 15: Build Ascension Tree Icons

**Why:** The ascension/prestige tree is an endgame screen with node icons. Currently uses emoji.

**Files:** `src/components/icons/`, `src/components/AscensionTree.jsx`

**Done when:** Each ascension node has a unique SVG icon matching its upgrade theme.

**Prompt:**
```
Build icons for Fish Tycoon 2's ascension tree. The ascension tree has upgrade nodes in these categories:

- Tank capacity bonuses
- Breeding speed bonuses  
- Income multipliers
- Rare fish chance
- Equipment durability
- Staff effectiveness
- Customer frequency
- Reputation gain

Create 8 ascension node icons (size 32, contained in circles):
1. IconAscTank — expanded tank outline
2. IconAscBreed — heart + DNA
3. IconAscIncome — coin with upward graph
4. IconAscRarity — diamond/gem sparkle
5. IconAscEquip — golden wrench
6. IconAscStaff — person with star
7. IconAscCustomer — happy face with shopping bag
8. IconAscRep — trophy with shine

Each should work at 32-48px inside a circular node. Use the section-appropriate pastel color.
```

---

## Step 16: Build Merchant Portrait SVGs

**Why:** The shop and rare market have merchants. Emoji merchant faces lack personality.

**Files:** `src/components/icons/`, `src/components/Shop.jsx`, `src/components/RareMarket.jsx`

**Done when:** Each merchant/customer type has a cute illustrated SVG portrait.

**Prompt:**
```
Build cute merchant portrait SVGs for Fish Tycoon 2. The game has customer types who buy fish:

1. PortraitCollector — glasses, bowtie, magnifying glass
2. PortraitFamily — parent and child, happy faces
3. PortraitAquarist — lab coat, clipboard
4. PortraitTourist — camera, hat, wide eyes
5. PortraitElder — gentle old person, kind smile
6. PortraitKid — big eyes, excited expression

Also the Rare Market merchant:
7. PortraitMerchant — mysterious cloaked figure with glowing items

Each is a 48x48 viewBox, bust portrait (head + shoulders). 
Style: cute chibi/kawaii, simple shapes, pastel colors, 2-3 color fills per portrait.
Think Stardew Valley meets Animal Crossing character portraits.
```

---

## Step 17: Build Reward, Rarity, and Badge Frames

**Why:** Rarity borders (common/uncommon/rare/epic/legendary) and achievement frames are currently just colored borders. Custom SVG frames add collectible charm.

**Files:** `src/components/icons/`, `src/components/FishSprite.jsx`, `src/components/Achievements.jsx`

**Done when:** Fish cards have rarity-themed SVG border frames. Achievement cards have unlock frames.

**Prompt:**
```
Build decorative frame SVGs for Fish Tycoon 2.

RARITY FRAMES (wrap around fish cards):
1. FrameCommon — simple rounded rect, thin gray border
2. FrameUncommon — rounded rect with subtle leaf/wave motif in mint
3. FrameRare — rounded rect with bubble corner accents in aqua
4. FrameEpic — rounded rect with shell corners in lavender, slight glow
5. FrameLegendary — ornate frame with coral/pearl decorations in gold, animated shimmer

BADGE FRAMES (for achievements):
6. BadgeBronze — shield shape, copper tones
7. BadgeSilver — shield shape, silver/blue tones
8. BadgeGold — shield shape, gold tones with sparkle

Each frame should be an SVG React component that wraps children:
<FrameRare>{children}</FrameRare>

Props: width, height, children
The frame renders as a border/overlay around the content.
```

---

## Step 18: Build Empty-State Illustrations

**Why:** Empty states (no fish, no achievements, empty tank) are player-facing messages. Cute illustrations make them encouraging rather than bleak.

**Files:** `src/components/icons/`, multiple components

**Done when:** Every "nothing here yet" state has a cute SVG illustration.

**Prompt:**
```
Build cute empty-state illustrations for Fish Tycoon 2.

1. IllustEmptyTank — cute empty aquarium with one bubble floating up, hopeful vibe (128x96)
2. IllustNoFish — fishing rod dangling into water, "waiting..." feel (96x96)
3. IllustNoAchievements — empty trophy shelf with cobwebs (cute cobwebs) (96x96)  
4. IllustNothingForSale — empty shop shelf with dust bunny (96x96)
5. IllustNoBreeding — two fish looking at each other with heart question mark (96x96)
6. IllustFirstVisit — welcome mat with bubbles and fish peeking out (128x96)

Style: pastel, minimal, cute and encouraging (not sad/empty-feeling).
Use soft lines, rounded shapes, pastel fills.
Each is a standalone React component that renders an SVG.
Should work on both light and white backgrounds.
```

---

## Step 19: Redesign the HUD

**Why:** The HUD (top overlay on tank) shows coins, food, water quality, temp, and action buttons. It's always visible and sets the tone.

**Files:** `src/components/HUD.jsx`, `src/index.css` (HUD section)

**Done when:** HUD uses SVG icons, has frosted-glass panel background, pill buttons, pastel stat pills, and feels like a toy control panel.

**Prompt:**
```
Redesign Fish Tycoon 2's HUD component for a cute cozy style.

Current HUD structure (from HUD.jsx):
- Row 1: Level badge, coin display, reputation, sound toggle
- Row 2: Tank stats (water quality bar, temperature, fish count, food count)
- Row 3: Action buttons (buy food, treat water, toggle auto-feed, use heater)
- Row 4: Active boosts display
- Feed All button

Current problems:
- Dark glassmorphism background
- Small, dense stat readouts
- Emoji icons (🪙, 💧, 🌡️, 🐟, 🍽️)
- Sharp corners, utility-app feel

Redesign goals:
- Frosted white panel: rgba(255,255,255,0.75), rounded 20px, soft shadow
- Replace all emoji with SVG icon components (IconCoin, IconWater, IconTemp, IconFood, etc.)
- Stat pills: each stat in a rounded capsule with icon + value + colored background
  - Water: aqua tint
  - Temp: peach tint (or blue if cold)
  - Fish count: mint tint
  - Food: yellow tint
- Action buttons: chunky pill buttons with icon + label
- Coin display: larger, with gentle bounce animation on change

Provide the updated JSX for the HUD component and any new CSS needed.
Don't change any game logic or store references — only visual/structural changes.
```

---

## Step 20: Redesign the Main Tank Frame and Overlays

**Why:** The tank is the centerpiece of the game. Its frame, water effects, and alert overlays should feel like looking into a cute aquarium toy.

**Files:** `src/components/TankView.jsx`, CSS tank section

**Done when:** Tank has rounded toy-like frame with pastel bolts/corners, soft water gradients, and cute alert badges.

**Prompt:**
```
Redesign Fish Tycoon 2's TankView frame for a cute aquarium toy look.

Current tank structure:
- Glass shell with corner bolts
- Water gradient background
- Seaweed SVG plants
- Sand substrate
- Bubble particles
- Alert strip (top badges for low food, disease, etc.)
- Day/night overlay tinting

Keep all the existing tank content (fish, plants, bubbles, decorations) but redesign:

1. FRAME — Rounded corners (16px), thicker pastel border, cute decorative corner pieces (shells or bubbles instead of industrial bolts)
2. WATER — Softer gradient: pale aqua at top → slightly deeper aqua at bottom, more translucent
3. ALERT STRIP — Replace text badges with cute SVG icon badges (IconAlertFood, etc.) in soft pill shapes
4. GLASS EFFECTS — Reduce heavy glassmorphism. Add a subtle curved highlight at top-left (toy glass reflection)
5. SAND — Warmer, more golden sand color
6. FRAME LABEL — Tank name in a cute banner/ribbon at the top

Provide CSS changes and any minimal JSX changes needed.
Don't change fish rendering, click handlers, or game logic.
```

---

## Step 21: Redesign Shop Cards

**Why:** The shop is where players spend the most time browsing. Cards need to feel like collectible toy capsules.

**Files:** `src/components/Shop.jsx`, CSS shop section

**Done when:** Fish purchase cards, supply cards, and upgrade cards have rounded corners, cute icons, sticker-like rarity badges, and gentle hover animations.

**Prompt:**
```
Redesign Fish Tycoon 2's Shop cards for a cute sticker/toy-capsule feel.

Card types:
1. Fish purchase cards (SupplyCard) — shows fish name, price, rarity
2. Supply cards (food, medicine, water treatment, heater) — shows item, stock, price
3. Upgrade cards — shows upgrade name, level, cost, effect

Current problems:
- Dark backgrounds, sharp corners
- Emoji icons for items
- Dense text layout
- No visual hierarchy between card types

Redesign:
- All cards: white bg, 20px radius, soft shadow, 1.5px pastel border
- Fish cards: rarity-colored top stripe or corner accent
- Supply cards: item SVG icon (24px) left-aligned, name + stock right
- Upgrade cards: level pips (filled/unfilled dots), progress feel
- Prices: coin icon + amount in gold pill badge
- Hover: gentle lift (translateY -3px) + shadow increase
- Disabled/can't afford: desaturated, no hover effect
- Section colors: shop cards have peach left border accent

Provide updated CSS. Note any JSX changes needed (icon swaps).
```

---

## Step 22: Redesign Rare Market

**Why:** The rare market is a special daily shop with unique items. It should feel magical and different from the normal shop.

**Files:** `src/components/RareMarket.jsx`, CSS

**Done when:** Rare market has a unique visual identity — more magical/premium than the regular shop, with merchant portrait, special item frames, and countdown timer.

**Prompt:**
```
Redesign Fish Tycoon 2's Rare Market for a cute magical shop feel.

The Rare Market:
- Opens daily with special items (rare fish, boost potions, mystery eggs)
- Has a merchant character
- Has a countdown timer to next refresh
- Items are premium/special

Redesign goals:
- Background: subtle gradient with sparkle particles (lavender → pink tint)
- Merchant area: SVG portrait with speech bubble greeting
- Item cards: special frame treatment — slightly larger, with glow border
- Mystery items: question mark silhouette with shimmer
- Timer: cute hourglass or clock icon with countdown
- "Sold out" state: gentle cross-hatch overlay, not harsh
- Colors: use lavender + pink as the rare market's signature palette

Current file structure has inline styles and emoji.
Provide CSS and note JSX changes.
```

---

## Step 23: Redesign Hatch/Reveal Flow

**Why:** Hatching an egg is a key emotional moment. It should feel magical and rewarding.

**Files:** `src/components/HatchReveal.jsx`, `src/components/DiscoveryCeremony.jsx`

**Done when:** Egg hatching has: egg wobble animation, crack sequence, burst of sparkles, fish reveal with rarity-appropriate flourish.

**Prompt:**
```
Redesign Fish Tycoon 2's egg hatch and fish reveal ceremony for maximum cute delight.

Current flow:
1. Egg appears in breeding bay
2. Timer counts down
3. Egg becomes "ready"  
4. Player clicks "Collect"
5. HatchReveal shows the new fish
6. If new species → DiscoveryCeremony plays

Redesign the visual flow:
1. WOBBLE: Egg gently wobbles (CSS keyframes, increasing intensity)
2. CRACK: Hairline cracks appear (SVG overlay lines)
3. BURST: Egg splits with sparkle particle burst
4. REVEAL: Fish fades in with gentle scale-up, surrounded by bubbles
5. DISCOVERY: If new species, add golden frame + "NEW SPECIES!" banner + confetti bubbles
6. RARITY FLAIR: Common = simple reveal, Rare = extra sparkle, Epic = rainbow shimmer, Legendary = full screen golden flash

Provide:
- CSS keyframes for wobble, crack, burst, reveal
- Any SVG elements needed for cracks/sparkles
- JSX structure changes for the reveal sequence
```

---

## Step 24: Redesign Fishdex

**Why:** The Fishdex (collection/encyclopedia) is where completionists spend time. Cards should feel like collectible stickers.

**Files:** `src/components/Fishdex.jsx`, CSS

**Done when:** Fishdex cards look like collectible stickers with rarity borders, discovery state (silhouette vs revealed), and detail modal with cute stats layout.

**Prompt:**
```
Redesign Fish Tycoon 2's Fishdex for a collectible sticker album feel.

Current Fishdex:
- Grid of fish species cards
- Undiscovered = dark silhouette with "?"
- Discovered = fish sprite + name + rarity badge
- Click opens detail view with traits, stats, breeding hints

Redesign:
- GRID: Cards in a sticker-album grid, slightly rotated/scattered for charm
- UNDISCOVERED: Pastel silhouette with "?" and subtle sparkle hint
- DISCOVERED: Full color fish in a rarity-bordered frame (see Step 17 frames)
- CARD BACK: Subtle pattern (bubbles, waves) visible on undiscovered
- DETAIL VIEW: Larger card with: fish illustration, name, rarity badge, trait pills, breeding recipe, AI lore text
- PROGRESS BAR: At top, "Species Discovered: X/Y" with cute progress bar
- NEW badge: Animated sparkle on newly discovered species

Colors: fishdex uses aqua as section accent.
Provide CSS and note JSX structural changes.
```

---

## Step 25: Redesign Achievements and Milestones

**Why:** Achievements and milestone panels reward long-term play. They should feel celebratory.

**Files:** `src/components/Achievements.jsx`, `src/components/GoalsPanel.jsx`

**Done when:** Achievement cards have badge frames, locked/unlocked states, and celebratory reveal animation. Milestones have progress bars.

**Prompt:**
```
Redesign Fish Tycoon 2's achievements and milestones panels.

ACHIEVEMENTS:
- Grid of achievement cards
- Each has: icon, title, description, reward amount
- States: locked (grayed, silhouette), unlocked (full color + stamp effect)

Redesign:
- Locked: frosted glass card, padlock icon, description as hint
- Unlocked: white card with gold border, badge frame (BadgeBronze/Silver/Gold), "ACHIEVED" stamp
- Reward: coin amount in golden pill
- Hover: gentle lift, if unlocked shows unlock date tooltip
- New achievements: pulsing golden glow until viewed

MILESTONES (in GoalsPanel):
- Linear progress goals with claim button
- States: in-progress, ready-to-claim, claimed

Redesign:
- Progress bar: rounded, pastel gradient fill (mint → aqua)
- Ready-to-claim: bouncing "Claim!" button with sparkle
- Claimed: checkmark stamp, dimmed slightly

Section accent color: yellow.
Provide CSS and note JSX changes.
```

---

## Step 26: Redesign Ascension Tree Layout

**Why:** The ascension tree is the endgame prestige system. It should feel like a skill tree in an RPG — visual, spatial, and rewarding.

**Files:** `src/components/AscensionTree.jsx`

**Done when:** Ascension tree shows nodes connected by lines/paths, with locked/unlocked states, cute node icons (Step 15), and a sense of progression.

**Prompt:**
```
Redesign Fish Tycoon 2's ascension tree for a cute RPG skill-tree feel.

Current ascension tree:
- List-based layout of upgrade nodes
- Each node has: name, description, cost, level
- Nodes unlock in order

Redesign:
- LAYOUT: Tree/constellation layout with nodes as circles connected by curved paths
- NODES: 48px circles with icon inside (from Step 15 icons), pastel background
- CONNECTIONS: Curved SVG paths between nodes, dotted if locked, solid if unlocked
- LOCKED: Node is grayscale, connection is dotted, tooltip shows requirements
- UNLOCKED: Full color, soft glow, connection is solid colored
- ACTIVE/MAX: Golden border, sparkle animation
- CENTER: Player's "ascension level" as a large central node
- BACKGROUND: Subtle starfield or bubble pattern

Use CSS Grid or absolute positioning for the tree layout.
Provide JSX structure and CSS. Don't change the game logic (unlock/purchase actions).
```

---

## Step 27: Redesign Modals and Popups

**Why:** Modals (victory, briefing, settings, game menu, API key, reset confirm) are high-visibility overlays. They should feel like cute dialog boxes.

**Files:** `src/components/VictoryModal.jsx`, `BriefingModal.jsx`, `SettingsPanel.jsx`, `EventPopup.jsx`, App.jsx modals

**Done when:** All modals share a consistent style: frosted overlay, rounded white panel, cute close button, soft entry animation.

**Prompt:**
```
Redesign all modals/popups in Fish Tycoon 2 for a cute dialog box style.

Modal components:
1. VictoryModal — campaign level complete
2. BriefingModal — campaign level intro
3. SettingsPanel — game settings
4. EventPopup — random event notification
5. Game menu (in App.jsx) — pause menu
6. Reset confirm dialog
7. API key setup

Shared modal style:
- Overlay: rgba(200,243,255,0.5) with backdrop-filter blur(8px)
- Panel: white bg (0.92 opacity), 28px radius, soft shadow
- Close button: top-right circle with X, hover rotates slightly
- Entry animation: scale from 0.9 to 1 + fade in, 200ms ease-out
- Exit: reverse animation

Type-specific additions:
- VictoryModal: star rating with golden sparkle, confetti burst on appear
- BriefingModal: campaign level illustration at top
- SettingsPanel: section headers with icons
- EventPopup: event-type colored accent border (good=mint, bad=peach, neutral=aqua)

Provide a shared CSS class (.cute-modal, .cute-overlay) plus type-specific overrides.
```

---

## Step 28: Add Subtle Cute Motion and Animation

**Why:** Motion is what makes the UI feel alive. Subtle, consistent animations create delight without distraction.

**Files:** `src/index.css` (animation section), various components

**Done when:** The game has: floating background bubbles, gentle card bob on hover, coin pop animation, sparkle on rarity items, and smooth page transitions.

**Prompt:**
```
Add cute motion and animation to Fish Tycoon 2.

Create these CSS animations and apply them:

1. @keyframes gentleBob — 1.6s ease infinite, translateY 0 → -4px → 0
   Apply to: fish cards on hover, merchant portrait, HUD coin icon

2. @keyframes softBounce — 0.4s ease, scale 0.9 → 1.05 → 1
   Apply to: new notifications, achievement unlock, egg ready indicator

3. @keyframes sparkle — 1s ease infinite, opacity 0.4 → 1 → 0.4 + subtle rotate
   Apply to: legendary items, new discovery badge, active boosts

4. @keyframes bubbleDrift — 8s linear infinite, translateY(100vh) → translateY(-10vh) + slight X wobble
   Apply to: decorative background bubbles (::before pseudo on .app)

5. @keyframes coinPop — 0.6s ease-out, translateY(0) → translateY(-20px) + fade out
   Apply to: coin gain indicators

6. @keyframes slideIn — 0.2s ease-out, translateY(10px) + opacity 0 → normal
   Apply to: panel/tab content when switching tabs

7. Page transitions: when switching sections (aquarium/market/breeding/records/office), content should fade-slide in from right

Provide all @keyframes and the CSS rules that apply them. Keep motion subtle — this is cozy, not energetic.
```

---

## Step 29: Consistency Cleanup Pass

**Why:** After 28 steps of changes, there will be inconsistencies, leftover dark styles, and missed emoji.

**Files:** All component files, `src/index.css`

**Done when:** Zero emoji in rendered UI, zero dark background remnants, all panels use consistent styling, all text is readable on light backgrounds.

**Prompt:**
```
Run a consistency cleanup pass on Fish Tycoon 2's UI after the cute redesign.

Check and fix:
1. EMOJI SCAN: Find all remaining emoji in component JSX (grep for unicode emoji ranges). Replace each with the appropriate SVG icon from our icon pack.

2. DARK REMNANTS: Find any remaining rgba(0-30, ...) backgrounds, #0xxxxx hex colors, or dark text shadows. Replace with light equivalents.

3. TEXT CONTRAST: Verify all text colors (#35506b etc.) are readable against the new white/pastel panels. Check: headings, body text, muted text, labels, prices, stat values.

4. BORDER RADIUS: Find any border-radius under 8px and bump to minimum 8px (except hairlines/dividers).

5. SHADOW AUDIT: Find any box-shadow using rgba(0,0,0,...) with opacity > 0.15 and replace with blue-tinted shadow.

6. INLINE STYLE AUDIT: Check the 173 inline style blocks for dark colors, sharp corners, or harsh shadows.

7. SPACING: Verify panel padding ≥ 16px, card gaps ≥ 10px everywhere.

8. FONT: Verify no references to Rajdhani, Barlow, or Barlow Condensed in CSS.

Provide a categorized list of issues found and the CSS/JSX fixes for each.
```

---

## Step 30: Final Cute-Compliance Audit and Punch List

**Why:** Final quality gate before shipping. Produces a punch list of any remaining issues.

**Files:** All files

**Done when:** A signed-off audit document confirms compliance with the design brief, or lists specific remaining items with priority.

**Prompt:**
```
Run a final cute-compliance audit of Fish Tycoon 2 against our design brief.

Check every item on the visual rules checklist (Step 2):

For each section of the game (Title Screen, Tank View, HUD, Shop, Breeding Lab, Fishdex, Achievements, Stats, Settings, Campaign Map, Rare Market, Offline Summary, Modals), verify:

1. ✅ or ❌ Background is pastel/light (no dark)
2. ✅ or ❌ Panels use cute-panel styling
3. ✅ or ❌ All buttons are pill-shaped
4. ✅ or ❌ All icons are SVG (no emoji)
5. ✅ or ❌ Typography is Quicksand/Nunito
6. ✅ or ❌ Border radius ≥ 8px everywhere
7. ✅ or ❌ Shadows are soft blue-tinted
8. ✅ or ❌ Section has correct accent color
9. ✅ or ❌ Hover states are gentle (lift, not glow)
10. ✅ or ❌ Empty states have illustrations

Output:
- Compliance score per section (out of 10)
- Overall compliance percentage
- Ranked punch list of remaining issues (P1/P2/P3)
- Estimated effort for each punch list item
```

---

## Recommended Execution Order for Fastest Visible Improvement

If you want the biggest visual impact in the shortest time, do these 10 steps first:

| Rank | Step | Why It's High Impact | Time |
|------|------|---------------------|------|
| 1 | **Step 6: Design Tokens** | Everything inherits from :root — change once, improve everywhere | 30 min |
| 2 | **Step 7: Theme Foundation** | Body background + global text = instant mood shift | 30 min |
| 3 | **Step 8: Panel Shells** | 35 panels go from dark to light in one CSS rule | 20 min |
| 4 | **Step 9: Interaction States** | All buttons and cards feel consistent and cute | 40 min |
| 5 | **Step 19: HUD Redesign** | The HUD is always visible — huge perception change | 1 hr |
| 6 | **Step 11: Core Icon Pack** | Removes the most visible emoji from the main screen | 2 hr |
| 7 | **Step 20: Tank Frame** | The tank is the centerpiece — this sells "aquarium toy" | 1 hr |
| 8 | **Step 27: Modals** | High-visibility overlays, shared style = fast consistency | 45 min |
| 9 | **Step 28: Motion** | Adds life and delight to everything already restyled | 30 min |
| 10 | **Step 21: Shop Cards** | The shop is the most-used panel after the tank | 1 hr |

**Total estimated time for top 10: ~8 hours**

These 10 steps alone will transform the game from "dark dashboard sim" to "cute aquarium toy" for 80%+ of the visible UI. The remaining 20 steps refine specific screens, add polish illustrations, and do cleanup.

---

## Quick Reference: Section → Accent Color Map

| Section | Accent Color | Variable |
|---------|-------------|----------|
| Shop / Market | Peach | `--peach: #ffd3b6` |
| Breeding | Lavender | `--lavender: #d8c7ff` |
| Achievements / Goals | Yellow | `--yellow: #ffe99a` |
| Magic Fish | Pink | `--pink: #ffb7d5` |
| Decorations | Mint | `--mint: #bdf3d4` |
| Stats / Records | Aqua | `--aqua: #8fe7ff` |
| Office / Staff | Peach (lighter) | `--peach: #ffd3b6` |
| Campaign | Aqua | `--aqua: #8fe7ff` |
| Rare Market | Lavender + Pink | gradient |
| Settings | Neutral | white/panel |
