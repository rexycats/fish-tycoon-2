# Fish Tycoon 2 — Steam Gap Analysis
## vs. Megaquarium, Planet Zoo, Two Point Hospital, Game Dev Tycoon

---

## EXECUTIVE SUMMARY

Fish Tycoon 2 has strong genetics/breeding mechanics and polished aquarium visuals, but it's missing the structural pillars that define a Steam tycoon game. The top-rated Steam tycoons (Megaquarium 95%, Planet Coaster 94%, Two Point Hospital 89%) share a common DNA: **spatial layout**, **staff management**, **campaign progression**, **research unlocks**, and **guest simulation**. Our game has none of these. What we have is closer to an idle/clicker with a breeding minigame than a tycoon sim.

---

## WHAT WE HAVE (strengths)

| System | Depth | Notes |
|--------|-------|-------|
| **Genetics** | Deep | 8 genes, Mendelian inheritance, dominant/recessive, carrier detection, mutation system, purity scoring |
| **Breeding** | Good | Multi-bay, clutch sizes, offspring prediction, donor slot, bonding |
| **Species** | Good | 26 hand-drawn SVG sprite species + procedural phenotype combinations |
| **Tank rendering** | Good | Depth layers, caustics, god rays, day/night cycle, weather effects, parallax |
| **Economy** | Basic | Buy/sell fish, upgrades, loans, passive income, market fluctuations, haggling |
| **Collection** | Good | Fishdex, achievements, milestones, magic fish, discovery ceremony |
| **Meta-progression** | Partial | Prestige system, ascension tree (designed), seasonal events |
| **Polish** | Good | Custom SVG icon set, ambient sound, keyboard shortcuts, escape menu, save/load |

## WHAT TOP STEAM TYCOONS HAVE THAT WE DON'T

### 1. SPATIAL LAYOUT (Critical — defines the genre)
**Megaquarium, Planet Zoo, Two Point Hospital, Planet Coaster** all have a 2D or 3D floor plan where you place objects in space. You decide WHERE tanks go, WHERE paths lead, WHERE equipment sits. Guest satisfaction depends on layout design.

**Our game:** Tabs. The aquarium is a single viewport. You can't place tanks in a room. You can't design walkways. There is no spatial puzzle.

### 2. STAFF MANAGEMENT (Critical)
**Megaquarium:** Hire feeders, cleaners, fixers. Staff level up, specialize, need breaks. Staff placement and zone assignment matters.
**Two Point Hospital:** Hire doctors, nurses, janitors with personality traits. Train them. Watch them burn out.

**Our game:** Zero staff. Fish feed themselves or the player clicks "Feed." No labor cost, no scheduling, no staffing puzzle.

### 3. CAMPAIGN MODE (Critical for retention)
**Megaquarium:** 10 campaign levels, each with unique constraints, map layout, and objectives. Sandbox unlocks after campaign.
**Two Point Hospital:** 15+ hospital levels across different regions, each with unique diseases and challenges.
**Game Dev Tycoon:** Linear progression from garage to AAA studio across decades.

**Our game:** Sandbox only. No structured progression. No victory conditions. No authored challenges. The player has no idea what "winning" looks like.

### 4. GUEST SIMULATION (Important)
**Megaquarium:** Guests walk around, look at tanks, get hungry, tired, need toilets. Guest satisfaction = prestige points = unlocks.
**Planet Zoo:** Guests have moods, preferences, spending habits. Guest flow is a design constraint.

**Our game:** Customers are invisible auto-timers. They arrive, buy a fish, leave. No visual presence, no needs, no pathing, no spending on amenities.

### 5. EQUIPMENT SYSTEMS (Important)
**Megaquarium:** Filters, heaters, protein skimmers, pumps — each needs space, power, placement. Equipment breaks down. Balancing equipment vs. guest space is the core puzzle.

**Our game:** No equipment. Water quality is a single number that degrades over time. Temperature is auto-managed. There's no spatial puzzle about where to put filters.

### 6. TANK COMPATIBILITY (Important)
**Megaquarium:** Fish have specific requirements — temperature range, salinity, food type, aggressiveness. Putting the wrong fish together = death. This is the core design challenge.

**Our game:** Any fish can go in any tank. No compatibility constraints. No predator/prey. No salinity. No schooling requirements.

### 7. RESEARCH/TECH TREE (Important)
**Megaquarium:** Earn Ecology and Science points from exhibits. Spend to unlock new species, equipment, decorations. Progress is gated by research.
**Game Dev Tycoon:** Research new technologies, platforms, genres across decades.

**Our game:** Partial research system exists in data files but isn't functional. Upgrades are a flat list in the shop, not a tree.

### 8. SPEED CONTROLS (Basic quality of life)
Every tycoon game has 1x / 2x / 3x speed + pause. Our game has pause but no speed control.

### 9. UNDO/BULLDOZE (Basic quality of life)
Every spatial tycoon has undo. We have no placement to undo, but we also have no way to undo a mis-sold fish or accidental action.

### 10. DIFFICULTY SETTINGS
Most tycoons have Easy/Normal/Hard. Some have custom difficulty with sliders. We have none.

### 11. COMPOSED SOUNDTRACK
Every Steam game has a real soundtrack — composed loops, 10-20 tracks, mood-responsive. We have procedural sine-wave drones. This alone would fail Steam audio expectations.

### 12. STATISTICS & GRAPHS
**Game Dev Tycoon:** Sales graphs, review scores, market share over time.
**Megaquarium:** Prestige tracking, revenue graphs, animal happiness over time.

**Our game:** A StatsPanel with flat numbers. No graphs, no trends, no history.

---

## 50-STEP IMPROVEMENT PLAN

### TIER 1 — Structural (makes it a real tycoon game)

1. **Speed controls** — Add 1x/2x/3x buttons to the status bar. Multiply `gameTick` delta by speed factor. Every tycoon has this. Simplest high-impact addition.

2. **Campaign mode — 10 levels** — Design 10 authored levels with unique starting conditions, constraints (limited species, small budget, specific goals), and win conditions. Each level teaches a mechanic. This is what Megaquarium's 95% rating is built on.

3. **Level 1: "Your First Tank"** — Start with 1 empty tank, 200 coins, 3 species available. Goal: sell 5 fish. Teaches buy/sell loop.

4. **Level 2: "Breeding Basics"** — Start with 2 adults. Goal: discover 3 new species through breeding. Teaches genetics.

5. **Level 3: "The Collector"** — Goal: fill Fishdex to 15 entries. Teaches exploration and variety.

6. **Level 4: "Market Pressure"** — Start with debt. Goal: repay 2000-coin loan before 30 minutes. Teaches economy optimization.

7. **Level 5: "Rare Finds"** — Only uncommon+ species appear in market. Goal: breed a Rare fish. Teaches advanced genetics.

8. **Levels 6-10: Escalating challenges** — Introduce prestige, multiple tanks, wanted board pressure, seasonal events. Final level: reach Prestige Level 1.

9. **Staff system — Feeders** — Hire staff who auto-feed fish on a schedule. Staff cost daily wages. Staff have a skill level (affects feed efficiency). This removes the need for the player to manually click "Feed" every 30 seconds.

10. **Staff system — Cleaners** — Staff who maintain water quality automatically. Higher-skill cleaners maintain better quality. Without staff, WQ drops faster.

11. **Staff roles and leveling** — Staff gain XP from working. Level up to unlock specializations: Breeder (faster breeding), Veterinarian (auto-cure disease), Entertainer (boosts customer happiness).

12. **Tank compatibility constraints** — Each species gets a temperature range, water type (freshwater/saltwater/brackish), and aggression level. Putting incompatible fish together causes stress, fighting, or death. This creates the core placement puzzle.

13. **Predator/prey system** — Large aggressive fish eat small peaceful ones if placed in the same tank. Players must read species cards carefully. Megaquarium's bannerfish-eating-moray-eel moments are what make it memorable.

14. **Schooling requirements** — Some species need 3+ of the same kind in one tank to be happy. Keeping a single schooling fish causes stress and eventual death.

### TIER 2 — Content depth (makes it replayable)

15. **Species expansion to 50+** — Add 25+ more species with unique sprites. Target: every tank theme has 8-10 species that "belong" there.

16. **Equipment system — Filters** — Tanks need filters based on size. Larger tanks need multiple filters. Filters break down and need repair/replacement. This adds ongoing maintenance cost.

17. **Equipment system — Heaters/Chillers** — Tanks need temperature control equipment. Different species need different temps. Equipment has running costs.

18. **Gift shop** — Passive income building. Sells merchandise based on your rarest displayed species. Revenue scales with visitor count and fish prestige.

19. **Snack bar / café** — Another amenity building. Guests get hungry. No food = shorter visits = less revenue.

20. **Research tree (functional)** — Turn the existing research data into a visual tech tree. Spend Science Points (earned from breeding) to unlock new species, equipment, decorations, and upgrades. Gate mid/late-game content behind research.

21. **Tank sizes** — Small (4 fish), Medium (8 fish), Large (12 fish), Huge (20 fish). Larger tanks cost more but attract more visitors and house bigger species.

22. **Tank shapes** — Standard rectangle, L-shaped, circular, tunnel (walk-through). Each shape has different capacity and visibility bonuses.

23. **Composed soundtrack** — 8-12 looping music tracks. Calm daytime, atmospheric night, tension during storms, celebration for discoveries. Could use royalty-free library or commission.

24. **Sound effects library** — Distinct sounds for: feed, sell, breed, discover, upgrade, disease, death, customer arrive, customer buy, level up, achievement, prestige. Currently most are sine-wave bleeps.

25. **Statistics dashboard with graphs** — Revenue over time, species discovered over time, fish population chart, best-selling species. React recharts is already available.

26. **Difficulty settings** — Easy (2x coins, no disease), Normal (default), Hard (0.5x coins, faster disease, expensive staff), Custom (sliders for each parameter).

27. **Seasonal decorations** — During seasonal events, special decorations appear that boost visitor happiness. Limited-time content creates urgency.

28. **Fish shows / competitions** — Weekly competition where your best fish is judged. Rewards coins and prestige. Already partially built (FishShowPanel exists).

### TIER 3 — Engagement loops (makes people play for 50+ hours)

29. **Visitor simulation** — Visitors walk around the aquarium (even if it's a simplified top-down map). They stop at tanks, express reactions, leave reviews. High-value exhibits attract more visitors.

30. **Reviews system** — Visitors leave text reviews like "Beautiful golden fish!" or "Tanks were dirty." Reviews affect reputation which affects visitor count. The existing reviews.js data file has this partially built.

31. **Reputation milestones** — At reputation thresholds, unlock: newspaper features (visitor spike), TV coverage (major visitor spike), international recognition (unlock exotic species suppliers).

32. **Supplier system** — Different suppliers offer different species at different prices. Unlock new suppliers through research or reputation. Some suppliers are seasonal.

33. **Random events (expanded)** — Power outage (all equipment stops), pipe burst (water quality crash), celebrity visit (huge reputation boost), health inspection (fail = fines), fish escape (comedy moment). Some of these exist in randomEvents.js but need more variety and visual presentation.

34. **Aquarium expansion** — Start with 1 room. Expand to adjacent rooms. Each room can have a theme. Different rooms have different lighting. This approximates spatial layout without requiring a full 2D placement system.

35. **Tutorial expansion** — 12-step tutorial that teaches: feeding, selling, breeding, genetics, decorating, tank themes, water quality, temperature, diseases, wanted board, daily challenges, prestige. Current 4-step tutorial skips most mechanics.

36. **Notification center** — Instead of log messages that scroll away, important events get pinned notifications. "Rare fish born!", "Disease outbreak in Tank 2", "Wanted poster expiring in 2 hours". Can be dismissed.

37. **Fish aging and lifespan** — Fish live for a set number of in-game days. Older fish are more valuable (experience bonus) but eventually die of old age. Creates a cycle of breeding replacements.

38. **Breeding journal** — Track every breeding pair and their offspring. Show family trees. Let players see which combinations produced which results. The GeneJournal component exists but could be much richer.

### TIER 4 — Polish and community (makes it review well on Steam)

39. **Steam achievements** — 30-50 Steam achievements mapped from existing in-game achievements. steamService.js exists but needs full integration.

40. **Steam trading cards** — Design 8 trading cards featuring species art. Revenue stream from Steam marketplace.

41. **Cloud save** — Use Steam Cloud to sync saves across devices. Essential for Steam release.

42. **Localization framework** — Extract all user-facing strings to a locale file. Support at least EN, ES, FR, DE, JA, ZH. Tycoon games have huge international audiences.

43. **Accessibility options** — Colorblind mode (exists), screen reader labels, adjustable text size, high contrast mode. Two Point Hospital got praised for this.

44. **Controller support** — Basic gamepad navigation for Steam Deck compatibility. Tycoon games are increasingly played on Deck.

45. **Photo mode** — Let players take screenshots of their best tanks with a clean UI-free view. Share to Steam Community screenshots.

46. **Modding support** — Allow custom species definitions via JSON files. Steam Workshop integration for sharing custom fish. Megaquarium has this and it massively extends lifespan.

47. **Performance optimization** — Profile and optimize the 620KB JS bundle. Code-split the store. Lazy-load sections. Target 60fps with 50+ fish.

48. **Onboarding flow** — First-time user experience with a character guide (aquarium mentor) who pops up with contextual tips. Not just tutorial steps but ongoing hints.

49. **End-game content** — After prestige, what? Design a "True Ending" condition: collect all 100+ species, fill all achievement slots, reach prestige level 10. Give players a final goal.

50. **Demo/trailer** — Build a 2-minute gameplay trailer showing: breeding discovery, rare fish reveal, tank decoration, customer sales, day/night cycle, weather, prestige. This IS the game's first impression on Steam store.

---

## PRIORITY MATRIX

| Priority | Steps | Impact | Effort |
|----------|-------|--------|--------|
| **Do first** | 1, 12, 13, 14, 23, 24 | Core gameplay feel | Medium |
| **Do second** | 2-8, 9-11, 25, 26 | Campaign + staff = real tycoon | High |
| **Do third** | 15-22, 27, 28, 35 | Content depth | Medium |
| **Do fourth** | 29-38 | Engagement loops | High |
| **Do last** | 39-50 | Steam-readiness | Medium |

**The single most impactful change:** Add speed controls (step 1) + tank compatibility (step 12) + campaign mode (steps 2-8). These three things transform the game from "idle clicker with fish" to "aquarium tycoon."
