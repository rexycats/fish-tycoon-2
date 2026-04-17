# IMPLEMENTATION PLAN — Steps 1-5
## Speed Controls + Campaign Mode + First 3 Levels

---

## STEP 1: SPEED CONTROLS

### The Problem
Every tycoon game has 1x/2x/3x speed + pause. We only have pause. Players waiting 5 minutes for breeding or 18 seconds for customers have no way to fast-forward. This makes the game feel sluggish.

### The Solution — Game Clock
The game currently uses `Date.now()` for all timing (23 calls in gameTick.js, 18 in gameStore.js). Speed controls require a **virtual game clock** that advances faster than real time at higher speeds.

### Architecture

**New state field:**
```js
// gameState.js — add to createDefaultState()
gameClock: Date.now(),   // virtual clock, advances at speed * realDelta
gameSpeed: 1,            // 1, 2, or 3
```

**Tick modification (gameTick.js):**
```js
// processTick — line 681
// BEFORE:
const now = Date.now();
// AFTER:
const realNow = Date.now();
const realDelta = realNow - (state.lastTickAt || realNow);
const gameDelta = realDelta * (state.gameSpeed || 1);
const now = (state.gameClock || realNow) + gameDelta;
// ... later, in the return:
next = { ...next, gameClock: now, lastTickAt: realNow };
```

This single change makes every timer in the game (breeding, customer, disease, growth) automatically respect speed because they all compare against `now`.

**Store timestamp changes (gameStore.js):**
Every `Date.now()` that sets a gameplay timestamp (breedingStartedAt, diseaseSince, lastCustomerAt, vitaminUntil, bornAt, activeLoan.takenAt) must use `get().gameClock || Date.now()` instead. This ensures timestamps are on the same clock as the tick comparisons.

Timestamps that should STAY as `Date.now()`:
- `_saveFlash` (UI animation)
- `_pendingHatchReveal` (UI trigger)
- `log[].time` (display only)
- `lastSavedAt` (meta)
- `salesHistory[].at` (display only)

**Files to modify:**
| File | Changes |
|------|---------|
| `src/data/gameState.js` | Add `gameClock: Date.now()`, `gameSpeed: 1` to default state |
| `src/systems/gameTick.js` | Replace `const now = Date.now()` (line 681, 1392) with game clock calculation |
| `src/store/gameStore.js` | Replace ~12 gameplay `Date.now()` calls with `get().gameClock` |
| `src/components/GameStatusBar.jsx` | Add speed buttons, show game clock instead of wall clock |
| `src/data/gameState.js` | Add migration from save version 8 → 9 to seed `gameClock` |

**GameStatusBar UI:**
```
[ DAY 3 ] [ 14:22 ] [ LV.4 ] [ 12 FISH ] ... [ ▸ ▸▸ ▸▸▸ ] [ II ] [ 1,250 ]
                                                  1x 2x 3x   pause
```
Three small buttons next to pause. Active speed highlighted with teal accent.

**Store action:**
```js
setGameSpeed: (speed) => set(state => { state.gameSpeed = Math.max(1, Math.min(3, speed)); }),
```

**Keyboard shortcut:** `,` = slower, `.` = faster (standard in tycoon games).

**GameStatusBar clock display:**
Replace wall-clock `Date().toLocaleTimeString()` with game clock. Calculate game hours/minutes from gameClock modulo 86400000.

```js
// Game time display
const gc = useGameStore(s => s.gameClock || Date.now());
const gameDate = new Date(gc);
const clock = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
```

**Day counter:**
Replace `Math.floor((Date.now() - created) / 86400000)` with `Math.floor((gameClock - created) / 86400000)`.

**Save migration v8 → v9:**
```js
if (fromVersion < 9) {
  parsed.gameClock = parsed.gameClock || Date.now();
  parsed.gameSpeed = parsed.gameSpeed || 1;
  // Rebase all existing timestamps to gameClock
  // (they were set with Date.now() which equals gameClock at migration time)
}
parsed.version = 9;
```

**Testing checklist:**
- [ ] 1x speed: breeding takes 5 real minutes
- [ ] 3x speed: breeding takes ~1.7 real minutes
- [ ] Pause stops all game progression
- [ ] Save/load preserves game clock correctly
- [ ] Day counter advances 3x faster at 3x speed
- [ ] Customer visits happen 3x more frequently at 3x
- [ ] Disease progression speeds up at higher speeds
- [ ] Offline processing uses game clock, not wall clock
- [ ] UI speed buttons highlight correctly
- [ ] Keyboard `,` and `.` change speed

---

## STEP 2: CAMPAIGN MODE INFRASTRUCTURE

### The Problem
No structured progression. Players have no goals, no constraints, no authored experience. Every great tycoon (Megaquarium 95%, Two Point Hospital 89%) is defined by its campaign.

### Architecture

**New files:**
```
src/data/campaign.js          — Level definitions (objectives, constraints, starting state)
src/components/CampaignMap.jsx — Level selection screen (replaces title screen after first play)
src/components/ObjectiveBar.jsx — In-game objective tracker overlay
```

**Campaign data structure (`src/data/campaign.js`):**
```js
export const CAMPAIGN_LEVELS = [
  {
    id: 'level_1',
    name: 'Your First Tank',
    description: 'Learn the basics of fish keeping.',
    briefing: 'Welcome to your new aquarium! Start small — buy some fish, keep them healthy, and make your first sales.',
    mapPosition: { x: 10, y: 50 },  // position on campaign map

    // Starting conditions — override createDefaultState()
    startingState: {
      coins: 200,
      tanks: [{ id: 'tank_0', type: 'display', capacity: 8 }],
      fish: [],  // empty — player must buy first fish
      maxBays: 0,  // no breeding yet
    },

    // Constraints — things disabled for this level
    constraints: {
      breedingDisabled: true,
      maxTanks: 1,
      speciesAvailable: ['clownfish', 'goldfish', 'neon_tetra'],
      upgradesDisabled: ['deepSea', 'breedBay'],
    },

    // Objectives — ALL must be completed to win
    objectives: [
      { id: 'buy_fish',  label: 'Buy your first fish',     type: 'stat', stat: 'fishBought',    target: 1 },
      { id: 'feed_fish', label: 'Feed a fish',             type: 'stat', stat: 'fishFed',        target: 1 },
      { id: 'sell_5',    label: 'Sell 5 fish to customers', type: 'stat', stat: 'fishSold',       target: 5 },
      { id: 'earn_500',  label: 'Earn 500 coins total',    type: 'stat', stat: 'totalCoinsEarned', target: 500 },
    ],

    // Rewards for completing this level
    rewards: {
      unlocks: ['level_2'],
      coins: 100,  // bonus starting coins for next level
    },

    // Star rating thresholds (optional)
    stars: {
      1: { condition: 'complete' },
      2: { stat: 'totalCoinsEarned', target: 800 },
      3: { stat: 'totalCoinsEarned', target: 1200, time: 600 },  // under 10 min
    },
  },
  // ... levels 2-10
];
```

**Campaign state in game store:**
```js
// New top-level state fields:
campaign: {
  mode: 'sandbox',          // 'sandbox' | 'campaign'
  activeLevelId: null,      // current campaign level
  completedLevels: {},      // { level_1: { stars: 2, bestTime: 450 }, ... }
  levelStartedAt: null,     // gameClock when level started
  objectiveProgress: {},    // { buy_fish: 1, feed_fish: 0, ... }
},
```

**Campaign flow:**

```
Title Screen
  └─ "New Game" → Mode Selection
       ├─ "Campaign" → Campaign Map (level select)
       │    └─ Click Level 1 → Briefing Modal → Start Level
       │         └─ Playing... → All objectives met → Victory Modal
       │              └─ "Next Level" → Campaign Map (Level 2 unlocked)
       └─ "Sandbox" → Normal game (current behavior)
```

**New store actions:**
```js
startCampaignLevel: (levelId) => set(state => { ... }),
checkObjectives: () => { ... },  // called each tick
completeCampaignLevel: () => set(state => { ... }),
abandonCampaignLevel: () => set(state => { ... }),
```

**ObjectiveBar component (`src/components/ObjectiveBar.jsx`):**
Floating panel in top-right during campaign mode showing:
```
┌─ OBJECTIVES ──────────────────┐
│  ✓ Buy your first fish    1/1 │
│  ○ Feed a fish             0/1 │
│  ○ Sell 5 fish             2/5 │
│  ○ Earn 500 coins        340/500│
│                                │
│  ★★☆  Level 1 — 4:32         │
└────────────────────────────────┘
```

**Objective checking in gameTick:**
```js
// At end of processTick, if campaign mode:
if (next.campaign?.mode === 'campaign' && next.campaign.activeLevelId) {
  const level = CAMPAIGN_LEVELS.find(l => l.id === next.campaign.activeLevelId);
  if (level) {
    // Update objective progress from player stats
    const progress = {};
    for (const obj of level.objectives) {
      if (obj.type === 'stat') {
        progress[obj.id] = next.player.stats?.[obj.stat] || 0;
      } else if (obj.type === 'fishdex') {
        progress[obj.id] = (next.player.fishdex || []).length;
      } else if (obj.type === 'breed') {
        progress[obj.id] = next.player.stats?.eggsCollected || 0;
      }
    }
    next = { ...next, campaign: { ...next.campaign, objectiveProgress: progress } };

    // Check win condition: all objectives met
    const allMet = level.objectives.every(obj => (progress[obj.id] || 0) >= obj.target);
    if (allMet && !next.campaign.levelCompleted) {
      next = { ...next, campaign: { ...next.campaign, levelCompleted: true } };
      // Queue victory modal
      next._pendingVictory = level.id;
    }
  }
}
```

**Constraint enforcement:**
In the store actions (buyFish, selectForBreeding, unlockTank), check campaign constraints:
```js
// Helper
function getCampaignConstraints(state) {
  if (state.campaign?.mode !== 'campaign') return null;
  const level = CAMPAIGN_LEVELS.find(l => l.id === state.campaign.activeLevelId);
  return level?.constraints || null;
}

// In buyFish:
const constraints = getCampaignConstraints(state);
if (constraints?.speciesAvailable && !constraints.speciesAvailable.includes(speciesKey)) {
  addLogDraft(state, 'This species is not available in this level.');
  return;
}

// In selectForBreeding:
if (constraints?.breedingDisabled) {
  addLogDraft(state, 'Breeding is not available in this level.');
  return;
}
```

**CampaignMap component:**
A simple screen showing level nodes on a path. Completed levels show star ratings. Locked levels are grayed out. Click to start.

```
     ★★☆           ★☆☆           🔒
  [Level 1]  ───  [Level 2]  ───  [Level 3]  ─── ...
 Your First     Breeding        The
    Tank        Basics         Collector
```

**Save migration v9 → v10:**
```js
if (fromVersion < 10) {
  parsed.campaign = {
    mode: 'sandbox',
    activeLevelId: null,
    completedLevels: {},
    levelStartedAt: null,
    objectiveProgress: {},
  };
}
```

**Files to create/modify:**
| File | Action |
|------|--------|
| `src/data/campaign.js` | CREATE — Level definitions |
| `src/components/CampaignMap.jsx` | CREATE — Level selection screen |
| `src/components/ObjectiveBar.jsx` | CREATE — In-game objective tracker |
| `src/components/VictoryModal.jsx` | CREATE — Level complete overlay |
| `src/components/BriefingModal.jsx` | CREATE — Level start briefing |
| `src/data/gameState.js` | ADD campaign state + migration v10 |
| `src/store/gameStore.js` | ADD campaign actions + constraint checks |
| `src/systems/gameTick.js` | ADD objective checking at end of tick |
| `src/App.jsx` | ADD mode selection, campaign map, objective bar, victory modal |
| `src/components/TitleScreen.jsx` | ADD "Campaign" and "Sandbox" buttons |
| `src/components/GameStatusBar.jsx` | Show level name + timer in campaign mode |

---

## STEP 3: LEVEL 1 — "YOUR FIRST TANK"

### Design
**Goal:** Teach buy → feed → sell loop in 5-10 minutes.

**Starting state:**
- 200 coins
- 1 small tank (capacity 8)
- 0 fish (player must buy)
- Breeding disabled
- Only 3 species available: Clownfish, Goldfish, Neon Tetra

**Objectives:**
1. Buy your first fish (stat: fishBought >= 1)
2. Feed a fish (stat: fishFed >= 1)
3. List a fish for sale (stat: fishListed >= 1)
4. Sell 5 fish to customers (stat: fishSold >= 5)
5. Earn 500 coins total (stat: totalCoinsEarned >= 500)

**Star ratings:**
- ★ Complete all objectives
- ★★ Earn 800+ coins
- ★★★ Complete in under 8 minutes with 1200+ coins

**Briefing text:**
> "Welcome to your new aquarium! You've got a single tank, a small budget, and big dreams. Start by purchasing some fish from the Market, keep them fed and healthy, then list them for sale. Customers will visit automatically — the better your fish, the more they'll pay."

**What this teaches:**
- Navigate to Market tab (key 2)
- Buy fish from available stock
- Navigate back to Aquarium (key 1)
- Click fish to see inspector
- Feed fish (F key or button)
- List fish for sale (S key or button)
- Wait for customer to buy
- Understanding of coins as the core resource

**Stats tracking needed:**
The game already tracks `fishFed`, `totalCoinsEarned`, `fishSold` in `player.stats`. Need to add:
- `fishBought` — increment in `buyFish` action
- `fishListed` — increment in `toggleSellFish` action

---

## STEP 4: LEVEL 2 — "BREEDING BASICS"

### Design
**Goal:** Teach breeding → discovery loop in 10-15 minutes.

**Starting state:**
- 300 coins
- 1 tank (capacity 10) with 2 adult fish (different colors)
- 1 breeding bay unlocked
- 5 species available (Clownfish, Goldfish, Neon Tetra, Guppy, Betta)

**Objectives:**
1. Place two fish in breeding slots (stat: breedingsStarted >= 1)
2. Collect a breeding egg (stat: eggsCollected >= 1)
3. Wait for an egg to hatch (stat: eggsHatched >= 1)
4. Discover 3 new species via breeding (fishdex count >= 5, starting with 2 known)
5. Own 8+ fish simultaneously (current fish count >= 8)

**Star ratings:**
- ★ Complete all objectives
- ★★ Discover 5 species (fishdex >= 7)
- ★★★ Complete in under 12 minutes

**Briefing text:**
> "You have two adult fish with different genetics. Go to the Breeding Lab, place them in the parent slots, and wait for eggs. Each offspring inherits a mix of traits from both parents — breed enough and you'll discover entirely new species. Fill your Fishdex!"

**What this teaches:**
- Navigate to Breeding tab (key 3)
- Select/drag fish into breeding slots
- Understanding breeding timer (+ speed controls)
- Collecting eggs
- Egg → Juvenile → Adult lifecycle
- Fishdex discovery and notification
- Offspring inherit parent traits

**Stats tracking needed:**
- `breedingsStarted` — increment when both breeding slots fill
- `eggsHatched` — increment when egg → juvenile

---

## STEP 5: LEVEL 3 — "THE COLLECTOR"

### Design
**Goal:** Longer-form play combining buying, breeding, and selling to build a collection.

**Starting state:**
- 500 coins
- 2 tanks (capacity 10 each)
- 1 breeding bay
- 8 species available
- 3 starter fish (1 adult, 2 juveniles)

**Objectives:**
1. Discover 15 species in your Fishdex (fishdex >= 15)
2. Own a Rare or higher rarity fish (hasRareFish flag)
3. Earn 2000 coins total (totalCoinsEarned >= 2000)
4. Reach Level 3 (playerLevel >= 3)
5. Complete 1 Wanted Board bounty (wantedFulfilled >= 1)

**Star ratings:**
- ★ Complete all objectives
- ★★ Discover 20 species + earn 3000 coins
- ★★★ Complete in under 20 minutes + discover an Epic fish

**Briefing text:**
> "Your aquarium is growing! You now have two tanks and access to more species. Focus on breeding diverse combinations to expand your Fishdex. The Wanted Board in the Market has special bounties — fulfill them for bonus coins. You'll need to breed strategically to find rare specimens."

**What this teaches:**
- Multi-tank management
- Wanted Board system
- Rarity tiers and what drives them
- Selling expensive fish to fund more breeding
- XP and leveling system
- Strategic breeding (choosing parents for desired traits)

**Special objectives with custom checking:**
```js
// hasRareFish — needs custom check, not a simple stat counter
{ id: 'rare_fish', label: 'Own a Rare or better fish', type: 'custom',
  check: (state) => state.fish.some(f =>
    ['rare', 'epic', 'legendary'].includes(f.species?.rarity)
  )
},

// wantedFulfilled — already tracked
{ id: 'wanted', label: 'Complete a Wanted Board bounty', type: 'stat',
  stat: 'wantedFulfilled', target: 1
},
```

**Stats tracking needed:**
- `wantedFulfilled` — increment in `fulfillWanted` action

---

## IMPLEMENTATION ORDER

```
Phase A: Game Clock (2-3 hours)
  1. Add gameClock + gameSpeed to default state
  2. Modify processTick to use game clock
  3. Replace ~12 gameplay Date.now() in store
  4. Add speed buttons to GameStatusBar
  5. Add keyboard shortcuts (, and .)
  6. Save migration v8 → v9
  7. Test all timer systems at 3x

Phase B: Campaign Infrastructure (3-4 hours)
  1. Create campaign.js with level data structure
  2. Add campaign state to gameState.js
  3. Save migration v9 → v10
  4. Add startCampaignLevel / checkObjectives / completeCampaignLevel to store
  5. Add constraint enforcement to store actions
  6. Add objective checking to end of processTick
  7. Create ObjectiveBar.jsx
  8. Create VictoryModal.jsx
  9. Create BriefingModal.jsx
  10. Modify TitleScreen to show Campaign/Sandbox choice
  11. Wire into App.jsx

Phase C: Campaign Map (1-2 hours)
  1. Create CampaignMap.jsx
  2. Design level path layout
  3. Show star ratings on completed levels
  4. Lock/unlock flow

Phase D: Level Content (2-3 hours)
  1. Define Level 1 data (starting state, objectives, constraints, briefing)
  2. Define Level 2 data
  3. Define Level 3 data
  4. Add missing stat counters (fishBought, fishListed, breedingsStarted, eggsHatched)
  5. Add custom objective checkers
  6. Test full flow: Title → Campaign → Level 1 → Victory → Level 2 → Victory → Level 3

Phase E: Polish (1-2 hours)
  1. Victory confetti animation
  2. Star rating display
  3. Briefing modal styling
  4. Objective completion animation (checkmark + flash)
  5. Level timer display in ObjectiveBar
  6. Speed control tooltip hints
  7. Campaign map visual polish
```

**Total estimate: 10-14 hours of implementation**

---

## STAT TRACKING ADDITIONS

The following stats need to be added to `player.stats` and incremented in the appropriate store actions:

| Stat | Increment in | Current status |
|------|-------------|----------------|
| `fishBought` | `buyFish` action | MISSING — add |
| `fishListed` | `toggleSellFish` action | MISSING — add |
| `breedingsStarted` | `selectForBreeding` (when both slots fill) | MISSING — add |
| `eggsHatched` | `processOneTank` (egg → juvenile) | MISSING — add |
| `wantedFulfilled` | `fulfillWanted` action | MISSING — add |
| `fishSold` | `processCustomerVisit` | EXISTS |
| `fishFed` | `feedFish` action | EXISTS |
| `totalCoinsEarned` | various | EXISTS |
| `eggsCollected` | `collectEgg` action | EXISTS |

---

## RISK MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| Game clock drift on long sessions | Cap gameDelta to 10s max per tick to prevent clock jumps |
| Speed controls breaking offline processing | Offline processor already uses its own time calculation; keep it separate |
| Campaign constraints breaking sandbox saves | Campaign state is completely separate; sandbox mode ignores all constraints |
| Level 2 breeding timer too slow at 1x | Recommend 2x-3x in briefing; breeding duration is 5 min at 1x, ~1.7 min at 3x |
| Star ratings too hard/easy | Playtest each level 3 times at each speed, adjust thresholds |
| Save corruption during campaign | Campaign progress persists even if level is abandoned; no destructive operations |
