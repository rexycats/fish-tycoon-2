# Fish Tycoon 2 — SVG Asset Backlog

> Every visual element that needs an SVG component, grouped by category and priority.

## Priority Key
- **P1** — Blocks the redesign. Visible every session. Do first.
- **P2** — Important for polish. Visible often. Do second.
- **P3** — Nice to have. Visible rarely. Do last.

## Complexity Key
- **S** — Simple (single shape, 1-2 colors, <20 SVG elements)
- **M** — Medium (2-4 shapes, 3-4 colors, 20-50 SVG elements)
- **L** — Large (complex illustration, 5+ colors, 50+ SVG elements)

---

## 1. Core Icons (16-24px, monochrome via currentColor)

> Replace emoji and text-based indicators throughout the UI.
> **Already exist in GameIcons.jsx:** IconWater, IconTemp, IconFish, IconFood, IconCoin, IconHeart, IconDNA, IconLoan, IconFeed, IconMedicine, IconDiagnose, IconVitamins, IconSell, IconListed, IconMove

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| IconCoin | `<IconCoin size={16} />` | 🪙 (41 refs) | HUD, Shop, Achievements, Goals, rewards everywhere | P1 | S |
| IconStar | `<IconStar size={16} />` | ★ ⭐ (10 refs) | Campaign stars, reviews, victory, goals | P1 | S |
| IconFood | *exists* | text "Food" | HUD stat pill, supply card | P1 | S |
| IconWater | *exists* | text "WQ" | HUD stat pill | P1 | S |
| IconTemp | *exists* | text "Temp" | HUD stat pill | P1 | S |
| IconHeart | *exists* | text "HP" | Fish health bar | P1 | S |
| IconShield | `<IconShield />` | none | Equipment panel, protection | P2 | S |
| IconClock | `<IconClock />` | none | Timers, aging, breeding countdown | P2 | S |
| IconSparkle | `<IconSparkle />` | ✨ | Rarity indicator, new discovery | P2 | S |
| IconBubble | `<IconBubble />` | none | Decorative, breeding, water | P3 | S |
| IconWarning | `<IconWarning />` | ⚠️ | Alert badges | P2 | S |
| IconCheck | `<IconCheck />` | ✓ text | Completion, checkmarks | P2 | S |
| IconLock | `<IconLock />` | 🔒 text | Locked items, locked tanks | P2 | S |
| IconUnlock | `<IconUnlock />` | none | Unlock animations | P3 | S |
| IconGear | `<IconGear />` | ⚙️ | Settings button | P2 | S |
| IconVolume | `<IconVolume />` | 🔊 | Sound toggle | P2 | S |
| IconMute | `<IconMute />` | 🔇 | Sound toggle (off) | P2 | S |
| IconPause | `<IconPause />` | ⏸ | Pause indicator | P2 | S |
| IconPlay | `<IconPlay />` | ▶ | Resume | P2 | S |
| IconSpeed | `<IconSpeed />` | 1x/2x/3x text | Speed control | P3 | S |

**Total: 20 icons (15 already exist, 5 new P1, 10 new P2-P3)**

---

## 2. Supply & Shop Item Icons (20-24px, colored)

> Replace emoji props on supply cards and shop items.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| IconFishBag | `<IconFishBag />` | empty emoji prop | Fish purchase cards in Shop | P1 | M |
| IconMedicinePill | `<IconMedicinePill />` | empty emoji prop | Medicine supply card | P2 | S |
| IconAntiparasitic | `<IconAntiparasitic />` | empty emoji prop | Antiparasitic supply card | P2 | S |
| IconDigestiveRemedy | `<IconDigestiveRemedy />` | empty emoji prop | Digestive remedy card | P2 | S |
| IconWaterTreatKit | `<IconWaterTreatKit />` | empty emoji prop | Water treatment supply | P2 | S |
| IconHeaterCartridge | `<IconHeaterCartridge />` | empty emoji prop | Heater supply card | P2 | S |
| IconAutoFeeder | `<IconAutoFeeder />` | text | Auto-feed toggle/upgrade | P2 | S |
| IconMutagen | `<IconMutagen />` | text | Mutagen upgrade | P3 | S |
| IconUpgradeArrow | `<IconUpgradeArrow />` | text | Generic upgrade indicator | P2 | S |
| IconRepRibbon | `<IconRepRibbon />` | text | Reputation upgrade | P3 | S |
| IconTankPlus | `<IconTankPlus />` | text | Tank unlock/expand | P2 | S |
| IconGiftShop | `<IconGiftShop />` | text | Gift shop amenity | P3 | S |
| IconCafe | `<IconCafe />` | text | Café amenity | P3 | S |

**Total: 13 icons**

---

## 3. Tank Alert & Status Icons (20px, colored)

> Replace text badges in the tank alert strip.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| IconAlertFood | `<IconAlertFood />` | "Low Food" text | TankView alert strip | P1 | S |
| IconAlertWater | `<IconAlertWater />` | "Low WQ" text | TankView alert strip | P1 | S |
| IconAlertDisease | `<IconAlertDisease />` | "Sick" text | TankView alert strip | P1 | S |
| IconAlertCrowded | `<IconAlertCrowded />` | "Full" text | TankView alert strip | P2 | S |
| IconAlertTemp | `<IconAlertTemp />` | "Cold/Hot" text | TankView alert strip | P2 | S |
| IconAlertEquip | `<IconAlertEquip />` | "Broken" text | TankView alert strip | P2 | S |
| IconAlertDeath | `<IconAlertDeath />` | skull/text | Death notification | P2 | M |
| IconAlertEgg | `<IconAlertEgg />` | "Ready!" text | Egg ready in breeding bay | P2 | S |

**Total: 8 icons**

---

## 4. Merchant & Character Portraits (48px, multicolor)

> Replace emoji customer faces and add merchant personality.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| PortraitCollector | `<PortraitCollector />` | customer emoji | Shop sale animation | P2 | L |
| PortraitFamily | `<PortraitFamily />` | customer emoji | Shop sale animation | P2 | L |
| PortraitAquarist | `<PortraitAquarist />` | customer emoji | Shop sale animation | P3 | L |
| PortraitTourist | `<PortraitTourist />` | customer emoji | Shop sale animation | P3 | L |
| PortraitElder | `<PortraitElder />` | customer emoji | Shop sale animation | P3 | L |
| PortraitKid | `<PortraitKid />` | customer emoji | Shop sale animation | P3 | L |
| PortraitMerchant | `<PortraitMerchant />` | text | Rare Market header | P2 | L |
| PortraitMarina | `<PortraitMarina />` | text | Mentor bubble | P3 | L |

**Total: 8 portraits**

---

## 5. Rarity & Badge Frames (variable size, decorative)

> Wrap fish cards and achievement cards with collectible-feel borders.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| FrameCommon | `<FrameCommon>{children}</FrameCommon>` | plain border | Fishdex, fish panel | P2 | M |
| FrameUncommon | `<FrameUncommon>{children}</FrameUncommon>` | green border | Fishdex, fish panel | P2 | M |
| FrameRare | `<FrameRare>{children}</FrameRare>` | blue border | Fishdex, fish panel | P2 | M |
| FrameEpic | `<FrameEpic>{children}</FrameEpic>` | purple border | Fishdex, fish panel | P2 | M |
| FrameLegendary | `<FrameLegendary>{children}</FrameLegendary>` | gold border | Fishdex, fish panel | P2 | M |
| BadgeBronze | `<BadgeBronze />` | text | Achievement tier | P3 | M |
| BadgeSilver | `<BadgeSilver />` | text | Achievement tier | P3 | M |
| BadgeGold | `<BadgeGold />` | text | Achievement tier | P3 | M |

**Total: 8 frames/badges**

---

## 6. Empty-State Illustrations (64-128px, multicolor)

> Replace "nothing here" text with cute encouraging illustrations.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| IllustEmptyTank | `<IllustEmptyTank />` | "Your tank is empty" text | TankView | P2 | L |
| IllustNoFish | `<IllustNoFish />` | "No fish selected" text | FishPanel | P2 | L |
| IllustNoAchievements | `<IllustNoAchievements />` | "No achievements yet" | Achievements | P3 | L |
| IllustEmptyShop | `<IllustEmptyShop />` | "No fish for sale" | Shop | P3 | L |
| IllustNoBreeding | `<IllustNoBreeding />` | "Select fish to breed" | BreedingLab | P3 | L |
| IllustWelcome | `<IllustWelcome />` | text | TitleScreen | P3 | L |
| IllustOffline | `<IllustOffline />` | text | OfflineSummary header | P3 | L |

**Total: 7 illustrations**

---

## 7. Decorative & Animated Elements

> Background decoration and animated flourishes.

| Asset | Convention | Replaces | Where Used | Priority | Size |
|-------|-----------|----------|------------|----------|------|
| DecoBubbles | CSS pseudo / SVG bg | none | App background | P2 | S |
| DecoWaves | SVG pattern | none | Section dividers | P3 | S |
| DecoShells | SVG pattern | none | Panel header accents | P3 | S |
| DecoSparkle | CSS animation | none | Legendary/new items | P2 | S |
| DecoConfetti | CSS/SVG particles | none | Victory, discovery | P3 | M |

**Total: 5 decorative elements**

---

## Summary by Priority

| Priority | Count | Estimated Effort |
|----------|-------|-----------------|
| **P1** | 10 | 3 hours |
| **P2** | 38 | 10 hours |
| **P3** | 21 | 6 hours |
| **Total** | **69 assets** | **~19 hours** |

## Existing Assets That Can Be Reused

15 icons already exist in `src/components/GameIcons.jsx`:
IconWater, IconTemp, IconFish, IconFood, IconCoin, IconHeart, IconDNA, IconLoan, IconFeed, IconMedicine, IconDiagnose, IconVitamins, IconSell, IconListed, IconMove

These need:
- Move to `src/components/icons/` directory
- Add `className` and `style` props
- Verify they use `currentColor`
- Add to barrel export `index.js`
