# Fish Tycoon 2 — UI Screen Inventory & Classification

> Audit date: 2026-04-18
> Baseline: dark-dashboard aesthetic, pre-cute-redesign

## Classification Key
- ✅ **Minor** — colors/radius/shadow swap only, no structural changes
- ⚠️ **Moderate** — layout + color + icon replacement needed
- ❌ **Full redesign** — structural rework required

## Visibility Key (1-5)
- **5** — Always visible (HUD, tank, nav)
- **4** — Seen every session (shop, fish panel, status bar)
- **3** — Seen often (breeding, fishdex, achievements)
- **2** — Seen occasionally (stats, settings, modals, rare market)
- **1** — Seen rarely (ascension, modding, campaign, credits)

---

## Inventory

| # | Component | Lines | Vis | Class | Emoji | Inline Styles | Key Issues |
|---|-----------|-------|-----|-------|-------|---------------|------------|
| 1 | **TankView** | 1232 | 5 | ⚠️ | 2 | 28 | Dark tank frame, industrial bolts, heavy glass effects, many inline styles |
| 2 | **HUD** | 487 | 5 | ⚠️ | 1 | 5 | Dark glassmorphism, some emoji, already uses SVG icons partially |
| 3 | **NavRail** | 96 | 5 | ✅ | 0 | 0 | Just needs color/bg swap |
| 4 | **GameStatusBar** | 106 | 5 | ✅ | 0 | 0 | Dark bg, just needs color swap |
| 5 | **FishPanel** | 428 | 4 | ⚠️ | 2 | 11 | Uses SVG icons but has dark sections, coin emoji in onboarding text |
| 6 | **Shop** | 757 | 4 | ❌ | 6 | 14 | Heavy emoji use in supply cards, customer emoji, dark cards, dense layout |
| 7 | **FishSprite** | 766 | 5 | ✅ | 0 | 6 | Already SVG-based, just needs rarity frame adjustment |
| 8 | **TitleScreen** | 93 | 4 | ⚠️ | 0 | 0 | Currently dark, needs full pastel recolor |
| 9 | **BreedingLab** | 394 | 3 | ⚠️ | 1 | 14 | Dark panels, breeding bay needs toy-like frame |
| 10 | **Fishdex** | 487 | 3 | ⚠️ | 2 | 20 | Most inline styles of any component, dark card bg, needs collectible-card feel |
| 11 | **Achievements** | 145 | 3 | ⚠️ | 3 | 0 | Coin emoji in rewards, needs badge frames |
| 12 | **GoalsPanel** | 307 | 3 | ❌ | 9 | 6 | Most emoji of any component, milestone UI needs full rework |
| 13 | **StatsPanel** | ~200 | 2 | ✅ | 0 | 0 | Recharts graphs — just needs panel bg swap |
| 14 | **SettingsPanel** | ~140 | 2 | ✅ | 0 | 0 | Form controls, needs radius/color swap |
| 15 | **VictoryModal** | 60 | 2 | ⚠️ | 0 | 0 | Dark overlay, needs pastel treatment + star animation |
| 16 | **BriefingModal** | 45 | 2 | ✅ | 0 | 0 | Simple modal, just needs cute panel style |
| 17 | **CampaignMap** | 75 | 2 | ⚠️ | 0 | 0 | Needs node redesign, connector styling |
| 18 | **ObjectiveBar** | 60 | 3 | ✅ | 0 | 0 | Compact bar, just needs color swap |
| 19 | **RareMarket** | ~500 | 2 | ❌ | 0 | 0 | Needs unique magical identity, merchant portrait |
| 20 | **DecorationPanel** | 430 | 2 | ⚠️ | 4 | 4 | Dark cards, emoji categories |
| 21 | **StaffPanel** | ~120 | 2 | ⚠️ | 0 | 0 | List layout, needs card styling |
| 22 | **ResearchPanel** | ~150 | 2 | ⚠️ | 0 | 0 | Tree layout, needs node styling |
| 23 | **EquipmentPanel** | ~80 | 2 | ⚠️ | 0 | 0 | Grid, needs icon replacement |
| 24 | **AmenitiesPanel** | ~60 | 2 | ✅ | 0 | 0 | Simple cards |
| 25 | **ReviewsPanel** | ~80 | 2 | ✅ | 0 | 0 | List of reviews |
| 26 | **RoomPanel** | ~70 | 2 | ⚠️ | 0 | 0 | Room assignment, needs visual identity |
| 27 | **WantedBoard** | ~60 | 3 | ⚠️ | 2 | 0 | Bounty cards with emoji |
| 28 | **LogPanel** | ~60 | 3 | ✅ | 0 | 0 | Text log, just needs panel bg |
| 29 | **NotificationCenter** | ~50 | 4 | ✅ | 0 | 0 | Toast-like, needs color swap |
| 30 | **Mentor** | ~50 | 3 | ⚠️ | 0 | 0 | Speech bubble, needs cute character |
| 31 | **OfflineSummary** | ~120 | 3 | ⚠️ | 0 | 0 | Needs summary icons, currently text-heavy |
| 32 | **HatchReveal** | ~80 | 3 | ⚠️ | 1 | 5 | Key emotional moment, needs animation polish |
| 33 | **DiscoveryCeremony** | ~80 | 2 | ⚠️ | 0 | 0 | Celebration overlay, needs sparkle |
| 34 | **EventPopup** | ~110 | 2 | ⚠️ | 0 | 0 | Random event modal |
| 35 | **FishShowPanel** | ~120 | 2 | ⚠️ | 1 | 0 | Competition UI |
| 36 | **CatchOfDayPanel** | 237 | 2 | ⚠️ | 1 | 2 | Fishing minigame |
| 37 | **MagicFish** | 181 | 2 | ⚠️ | 2 | 5 | Collection panel, needs pink theme |
| 38 | **GeneJournal** | ~100 | 1 | ✅ | 0 | 0 | Data table, just needs panel bg |
| 39 | **AscensionTree** | ~200 | 1 | ❌ | 1 | 0 | Needs full tree layout redesign |
| 40 | **BreedingForecast** | ~80 | 3 | ✅ | 0 | 5 | Inline styles but simple content |
| 41 | **Chromacode** | ~50 | 2 | ✅ | 0 | 4 | Color display, fine as-is |
| 42 | **ModPanel** | ~80 | 1 | ✅ | 0 | 0 | Dev feature |
| 43 | **Credits** | ~50 | 1 | ✅ | 0 | 0 | Simple text |
| 44 | **ErrorBoundary** | 57 | 1 | ✅ | 0 | 7 | Already updated to pastel |
| 45 | **TabErrorBoundary** | ~30 | 1 | ✅ | 0 | 4 | Small wrapper |
| 46 | **GameTooltip** | ~30 | 4 | ✅ | 0 | 0 | Tooltip styling only |
| 47 | **ToastManager** | ~40 | 4 | ✅ | 0 | 0 | Toast styling only |
| 48 | **Tutorial** | ~80 | 3 | ⚠️ | 0 | 0 | Highlight overlay |
| 49 | **GameIcons** | ~80 | 5 | ✅ | 0 | 0 | Already SVG, expand coverage |
| 50 | **FishAutopsy** | 214 | 2 | ⚠️ | 0 | 7 | Dark cards, post-mortem reports |
| 51 | **OfficeSection** | ~1500 | 3 | ⚠️ | 0 | 0 | Lazy-loaded wrapper, inherits child issues |
| 52 | **RecordsSection** | ~800 | 3 | ⚠️ | 0 | 0 | Lazy-loaded wrapper, inherits child issues |

---

## Summary

| Classification | Count | Components |
|---------------|-------|------------|
| ✅ Minor (color/radius swap) | 20 | NavRail, GameStatusBar, FishSprite, StatsPanel, SettingsPanel, BriefingModal, ObjectiveBar, AmenitiesPanel, ReviewsPanel, LogPanel, NotificationCenter, GeneJournal, BreedingForecast, Chromacode, ModPanel, Credits, ErrorBoundary, TabErrorBoundary, GameTooltip, ToastManager |
| ⚠️ Moderate (layout + icons) | 25 | TankView, HUD, FishPanel, TitleScreen, BreedingLab, Fishdex, Achievements, CampaignMap, VictoryModal, DecorationPanel, StaffPanel, ResearchPanel, EquipmentPanel, RoomPanel, WantedBoard, Mentor, OfflineSummary, HatchReveal, DiscoveryCeremony, EventPopup, FishShowPanel, CatchOfDayPanel, MagicFish, Tutorial, FishAutopsy + wrappers |
| ❌ Full redesign | 4 | Shop, GoalsPanel, RareMarket, AscensionTree |
| **Total emoji to replace** | **41** | Mostly 🪙 coin (41 refs) plus ★ star (10) |
| **Total inline styles to extract** | **173** | TankView(28), Fishdex(20), Shop(14), BreedingLab(14) are worst |

## Priority Order (by visibility × severity)

1. **HUD** — Vis 5, ⚠️ — always on screen
2. **TankView** — Vis 5, ⚠️ — the centerpiece
3. **NavRail + StatusBar** — Vis 5, ✅ — easy quick wins
4. **Shop** — Vis 4, ❌ — most-used panel, most emoji
5. **FishPanel** — Vis 4, ⚠️ — fish detail view
6. **GoalsPanel** — Vis 3, ❌ — most emoji (9)
7. **TitleScreen** — Vis 4, ⚠️ — first impression
8. **Fishdex** — Vis 3, ⚠️ — most inline styles (20)
9. **BreedingLab** — Vis 3, ⚠️ — key gameplay
10. **Achievements** — Vis 3, ⚠️ — reward system
