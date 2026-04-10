// ============================================================
// FISH TYCOON 2 — ZUSTAND GAME STORE
// Replaces: useGameEngine + useEconomy + useState(game)
//
// Architecture:
//   - Single Zustand store with Immer middleware for immutable updates
//   - Components subscribe via selectors → only re-render on relevant changes
//   - Tick system writes directly to the store (no React setState overhead)
//   - Actions are plain methods on the store (no useCallback boilerplate)
// ============================================================

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  createDefaultState, saveGame, loadGame, checkAchievements,
  addLogDraft, createDefaultTank, TANK_UNLOCK, exportSave, importSave,
} from '../data/gameState.js';
import {
  processTick, applyOfflineProgress, TICK_INTERVAL_MS,
  refreshDailyChallenges, updateChallengeProgress,
  refreshMarket,
} from '../systems/gameTick.js';
import { breedGenomes, createFish } from '../data/genetics.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { DECOR_CATALOG, TANK_THEMES } from '../data/decorations.js';
import { fireToast } from '../components/ToastManager.jsx';
import {
  playCoin, playBubble, playFeed, playBreed, playWarning,
  playDiscover, playSale, setSoundEnabled,
} from '../services/soundService.js';

// ── Species phenotype lookup (static, module-level) ────────
const SPECIES_PHENOTYPES = {
  angelfish:         { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'White',   secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  clownfish:         { bodyShape: 'Round',   finType: 'Broad',   pattern: 'Lined',  primaryColor: 'Crimson', secondaryColor: 'Orange', glow: 'Normal',   size: 'Tiny',   mutation: 'None' },
  bluetang:          { bodyShape: 'Delta',   finType: 'Angular', pattern: 'Plain',  primaryColor: 'Azure',   secondaryColor: 'Indigo', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  betta:             { bodyShape: 'Slender', finType: 'Veil',    pattern: 'Marble', primaryColor: 'Violet',  secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
  goldfish:          { bodyShape: 'Round',   finType: 'Veil',    pattern: 'Plain',  primaryColor: 'Gold',    secondaryColor: 'Orange', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  mandarin_dragonet: { bodyShape: 'Slender', finType: 'Broad',   pattern: 'Marble', primaryColor: 'Azure',   secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
};

// ── Initial load (once per page load) ──────────────────────
let _initSave;
function getInitSave() {
  if (_initSave === undefined) _initSave = loadGame();
  return _initSave;
}

function buildInitialState() {
  const saved = getInitSave();
  let g = saved ? applyOfflineProgress(saved) : createDefaultState();
  g = refreshDailyChallenges(g);
  g = refreshMarket(g);
  return g;
}

// ============================================================
// STORE
// ============================================================
export const useGameStore = create(
  subscribeWithSelector(
    immer((set, get) => {
      const initial = buildInitialState();

      return {
        // ── Game state (flat — same shape as before) ──────────
        ...initial,

        // ── UI-only state ────────────────────────────────────
        soundOn: true,
        showOffline: getInitSave()
          ? Date.now() - (getInitSave().lastTickAt || Date.now()) > 30_000
          : false,

        // ── Tick ─────────────────────────────────────────────
        // Called by setInterval every second. Bypasses Immer —
        // processTick reads plain state via get() and returns a new
        // plain object. set() shallow-merges it, avoiding Immer's
        // proxy creation + diff on every tick.
        tick: () => {
          set(processTick(get()));
        },

        // ── Dismiss offline modal ────────────────────────────
        dismissOffline: () => set({ showOffline: false }),

        // ── Sound ────────────────────────────────────────────
        toggleSound: () => set(state => {
          state.soundOn = !state.soundOn;
          setSoundEnabled(state.soundOn);
        }),

        // ════════════════════════════════════════════════════
        // PLAYER ACTIONS (migrated from useEconomy)
        // ════════════════════════════════════════════════════

        feedFish: (fishId) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish) return;
          const tank = state.tanks.find(t => t.id === fish.tankId);
          if (!tank || tank.supplies.food <= 0) {
            playWarning();
            addLogDraft(state, '⚠️ No food in that tank!');
            return;
          }
          playFeed();
          tank.supplies.food -= 1;
          fish.hunger = Math.max(0, fish.hunger - 45);
          fish.health = Math.min(100, fish.health + 5);
        }),

        feedAllInTank: (tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          const hungry = state.fish.filter(f => f.tankId === tankId && f.stage !== 'egg' && f.hunger > 30);
          if (hungry.length === 0) return;
          const feedCount = Math.min(hungry.length, tank.supplies.food);
          if (feedCount === 0) {
            playWarning();
            addLogDraft(state, '⚠️ No food in that tank!');
            return;
          }
          tank.supplies.food -= feedCount;
          // Feed the hungriest first
          hungry.sort((a, b) => b.hunger - a.hunger);
          for (let i = 0; i < feedCount; i++) {
            hungry[i].hunger = Math.max(0, hungry[i].hunger - 45);
            hungry[i].health = Math.min(100, hungry[i].health + 5);
          }
          playFeed();
          addLogDraft(state, `🍤 Fed ${feedCount} fish in ${tank.name}.`);
        }),

        useMedicine: (fishId) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish || !fish.disease) return;
          const tank = state.tanks.find(t => t.id === fish.tankId);
          if (!tank) return;

          const DISEASE_CURES = { ich: 'antibiotic', fin_rot: 'antibiotic', bloat: 'digestiveRemedy', velvet: 'antiparasitic' };
          const medKey = DISEASE_CURES[fish.disease] || 'antibiotic';
          if ((tank.supplies[medKey] || 0) <= 0) {
            playWarning();
            addLogDraft(state, `⚠️ No ${medKey} in ${tank.name}!`);
            return;
          }
          playCoin();
          tank.supplies[medKey] -= 1;
          const diseaseName = fish.disease;
          fish.disease = null;
          fish.diseaseSince = null;
          fish.health = Math.min(100, fish.health + 20);
          state.player.stats.medicineUsed = (state.player.stats.medicineUsed || 0) + 1;
          addLogDraft(state, `💊 Cured ${fish.species?.name || 'fish'} of ${diseaseName}!`);
          const updated = updateChallengeProgress(state, 'cure_fish');
          Object.assign(state, updated);
        }),

        moveFishToTank: (fishId, targetTankId) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish) return;
          const target = state.tanks.find(t => t.id === targetTankId);
          if (!target) return;
          const count = state.fish.filter(f => f.tankId === targetTankId).length;
          if (count >= (target.capacity || 12)) {
            playWarning();
            addLogDraft(state, `⚠️ ${target.name} is full!`);
            return;
          }
          fish.tankId = targetTankId;
          playBubble();
        }),

        treatWater: (tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          if ((tank.supplies.waterTreatment || 0) <= 0) {
            playWarning();
            addLogDraft(state, '⚠️ No water treatment supplies!');
            return;
          }
          playBubble();
          tank.supplies.waterTreatment -= 1;
          tank.waterQuality = Math.min(100, tank.waterQuality + 35);
          state.player.stats.waterTreated = (state.player.stats.waterTreated || 0) + 1;
          const updated = updateChallengeProgress(state, 'treat_water');
          Object.assign(state, updated);
        }),

        toggleAutoFeed: (tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (tank) tank.autoFeed = !tank.autoFeed;
        }),

        useHeater: (tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          if ((tank.supplies.heater || 0) <= 0) {
            playWarning();
            return;
          }
          tank.supplies.heater -= 1;
          tank.temperature = 74;
          playBubble();
        }),

        unlockTank: (type) => set(state => {
          const unlock = TANK_UNLOCK[state.tanks.length];
          if (!unlock || state.player.coins < unlock.cost) {
            playWarning();
            return;
          }
          state.player.coins -= unlock.cost;
          const newTank = createDefaultTank(`tank_${state.tanks.length}`, type);
          state.tanks.push(newTank);
          playCoin();
          addLogDraft(state, `🏗️ Unlocked a new ${type} tank!`);
        }),

        renameTank: (tankId, name) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (tank) tank.name = name.trim().slice(0, 24) || tank.name;
        }),

        toggleSellFish: (fishId) => set(state => {
          const isListed = state.shop.listedFish.includes(fishId);
          if (!isListed && state.shop.listedFish.length >= state.shop.slots) {
            playWarning();
            addLogDraft(state, '⚠️ Shop full! Buy an upgrade to add more slots.');
            return;
          }
          if (isListed) {
            state.shop.listedFish = state.shop.listedFish.filter(id => id !== fishId);
            delete state.shop.fishPrices[fishId];
          } else {
            state.shop.listedFish.push(fishId);
          }
          playCoin();
          const fish = state.fish.find(f => f.id === fishId);
          addLogDraft(state,
            isListed
              ? `🏪 Removed ${fish?.species?.name || 'fish'}.`
              : `🏪 Listed ${fish?.species?.name || 'fish'} for sale!`
          );
        }),

        setFishPrice: (fishId, price) => set(state => {
          state.shop.fishPrices[fishId] = price;
        }),

        buySupply: (supplyKey, cost, amount, tankId) => set(state => {
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, '⚠️ Not enough coins!');
            return;
          }
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          state.player.coins -= cost;
          tank.supplies[supplyKey] = (tank.supplies[supplyKey] || 0) + amount;
          playCoin();
        }),

        buyFish: (cost, targetRarity, speciesKey) => set(state => {
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, '⚠️ Not enough coins!');
            return;
          }
          // Find a tank with room
          const fishCountByTank = new Map();
          for (const f of state.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
          const tank = state.tanks.find(t => (fishCountByTank.get(t.id) || 0) < (t.capacity || 12));
          if (!tank) {
            playWarning();
            addLogDraft(state, '⚠️ All tanks are full!');
            return;
          }
          state.player.coins -= cost;

          let newFish;
          if (speciesKey && REAL_SPECIES_MAP[speciesKey]) {
            // Named species (clownfish, betta, etc.)
            const speciesDef = REAL_SPECIES_MAP[speciesKey];
            const phenotype = SPECIES_PHENOTYPES[speciesKey];
            newFish = createFish({ stage: 'adult', tankId: tank.id, phenotype, targetRarity: speciesDef.rarity });
            // Override species info for real species
            newFish.species = { ...newFish.species, ...speciesDef, visualType: 'species', key: speciesKey };
          } else {
            // Generic fish by rarity
            newFish = createFish({ stage: 'adult', tankId: tank.id, targetRarity: targetRarity || 'common' });
          }

          state.fish.push(newFish);
          playCoin();
          addLogDraft(state, `🐟 Bought a ${newFish.species?.name || 'fish'}!`);
        }),

        buyUpgrade: (upgradeKey) => set(state => {
          const upg = state.shop.upgrades[upgradeKey];
          if (!upg || upg.level >= (upg.maxLevel || 3)) return;
          const cost = Math.round(upg.cost * Math.pow(1.6, upg.level));
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, '⚠️ Not enough coins!');
            return;
          }
          state.player.coins -= cost;
          upg.level += 1;
          // Apply side effects
          if (upgradeKey === 'slot') state.shop.slots += 1;
          if (upgradeKey === 'capacity') {
            state.tanks.forEach(t => { t.capacity = (t.capacity || 12) + 4; });
          }
          if (upgradeKey === 'breeding') {
            state.breedingTank.breedingDurationMs = Math.round(300_000 * Math.pow(0.8, upg.level));
          }
          playCoin();
          addLogDraft(state, `⬆️ Upgraded ${upg.label} to level ${upg.level}!`);
        }),

        buyRareMarketItem: (item, tankId) => set(state => {
          if (!item || state.player.coins < item.cost) {
            playWarning();
            return;
          }
          const today = Math.floor(Date.now() / 86_400_000);
          const purchased = (state.rareMarket.purchased || []).filter(p => p.day === today);
          const boughtCount = purchased.filter(p => p.itemId === item.id).length;
          if (boughtCount >= (item.limit || 1)) {
            playWarning();
            return;
          }

          // Check tank capacity for fish/egg items
          const tank = state.tanks.find(t => t.id === tankId) || state.tanks[0];
          if ((item.type === 'fish' || item.type === 'egg') && tank) {
            const count = state.fish.filter(f => f.tankId === tank.id).length;
            const needed = item.eggCount || 1;
            if (count + needed > (tank.capacity || 12)) {
              playWarning();
              addLogDraft(state, `⚠️ Not enough room in ${tank.name}!`);
              return;
            }
          }

          state.player.coins -= item.cost;
          if (!state.rareMarket.purchased) state.rareMarket.purchased = [];
          state.rareMarket.purchased.push({ day: today, itemId: item.id });

          // ── Mystery Egg: roll rarity from weights, spawn eggs ──
          if (item.type === 'egg' && item.rarityWeights && tank) {
            const weights = item.rarityWeights;
            const total = Object.values(weights).reduce((s, v) => s + v, 0);
            const eggCount = item.eggCount || 1;
            const hatched = [];
            for (let i = 0; i < eggCount; i++) {
              let roll = Math.random() * total;
              let rarity = 'common';
              for (const [r, w] of Object.entries(weights)) {
                roll -= w;
                if (roll <= 0) { rarity = r; break; }
              }
              const egg = createFish({ stage: 'egg', tankId: tank.id, targetRarity: rarity });
              state.fish.push(egg);
              hatched.push(rarity);
            }
            const summary = hatched.join(', ');
            addLogDraft(state, `🥚 Mystery egg${eggCount > 1 ? 's' : ''} placed in ${tank.name}! (${summary})`);
            playCoin();
            return;
          }

          // ── Exotic Fish: spawn adult of target rarity ──
          if (item.type === 'fish' && item.targetRarity && tank) {
            const newFish = createFish({ stage: 'adult', tankId: tank.id, targetRarity: item.targetRarity });
            state.fish.push(newFish);
            addLogDraft(state, `🐠 ${newFish.species?.name || 'Exotic fish'} (${newFish.species?.rarity}) added to ${tank.name}!`);
            playCoin();
            return;
          }

          // ── Supplies ──
          if (item.supplies && tank) {
            for (const [key, amount] of Object.entries(item.supplies)) {
              tank.supplies[key] = (tank.supplies[key] || 0) + amount;
            }
          }

          // ── Instant water restore ──
          if (item.restoreWater && tank) {
            tank.waterQuality = 100;
          }

          // ── Timed boosts ──
          if (item.boost && item.boostDurationMs) {
            if (!state.player.boosts) state.player.boosts = {};
            state.player.boosts[item.boost] = Date.now() + item.boostDurationMs;
          }

          playCoin();
          addLogDraft(state, `🌟 Purchased ${item.label} from the Rare Market!`);
        }),

        buyDecoration: (decorId, tankId) => set(state => {
          const decor = DECOR_CATALOG.find(d => d.id === decorId);
          if (!decor || state.player.coins < decor.price) {
            playWarning();
            return;
          }
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          state.player.coins -= decor.price;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          playCoin();
        }),

        claimUnlockedDecoration: (decorId, tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          state.player.unlockedDecorations = (state.player.unlockedDecorations || []).filter(id => id !== decorId);
        }),

        placeDecoration: (decorId, tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          if (!tank.decorations.placed) tank.decorations.placed = [];
          tank.decorations.placed.push(decorId);
          if (tank.decorations.owned) {
            const idx = tank.decorations.owned.indexOf(decorId);
            if (idx !== -1) tank.decorations.owned.splice(idx, 1);
          }
        }),

        removeDecoration: (decorId, tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          if (tank.decorations.placed) {
            const idx = tank.decorations.placed.indexOf(decorId);
            if (idx !== -1) tank.decorations.placed.splice(idx, 1);
          }
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
        }),

        buyTheme: (themeId, tankId) => set(state => {
          const theme = TANK_THEMES.find(t => t.id === themeId);
          if (!theme || state.player.coins < (theme.price || 0)) {
            playWarning();
            return;
          }
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          state.player.coins -= theme.price || 0;
          if (!tank.themes.owned) tank.themes.owned = [];
          tank.themes.owned.push(themeId);
          playCoin();
        }),

        applyTheme: (themeId, tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (tank) tank.themes.active = themeId;
        }),

        selectForBreeding: (fishId) => set(state => {
          const bt = state.breedingTank;
          if (bt.eggReady) return;
          if (bt.breedingStartedAt) return;
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish || fish.stage !== 'adult') return;
          if (bt.slots.includes(fishId)) {
            // Deselect
            bt.slots = bt.slots.map(s => s === fishId ? null : s);
            return;
          }
          const emptyIdx = bt.slots.indexOf(null);
          if (emptyIdx === -1) return;
          bt.slots[emptyIdx] = fishId;
          // If both slots filled, start breeding
          if (bt.slots[0] && bt.slots[1]) {
            bt.breedingStartedAt = Date.now();
            const fishA = state.fish.find(f => f.id === bt.slots[0]);
            const fishB = state.fish.find(f => f.id === bt.slots[1]);
            bt.storedGenomeA = fishA?.genome || null;
            bt.storedGenomeB = fishB?.genome || null;
            bt.storedTankId = fishA?.tankId || state.tanks[0]?.id || 'tank_0';
            playBreed();
            addLogDraft(state, `🧬 Breeding started: ${fishA?.species?.name || '?'} × ${fishB?.species?.name || '?'}`);
          }
        }),

        cancelBreeding: () => set(state => {
          const bt = state.breedingTank;
          bt.slots = [null, null];
          bt.breedingStartedAt = null;
          bt.eggReady = false;
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
        }),

        collectEgg: () => set(state => {
          const bt = state.breedingTank;
          if (!bt.eggReady) return;
          if (!bt.storedGenomeA || !bt.storedGenomeB) return;
          const tankId = bt.storedTankId || state.tanks[0]?.id || 'tank_0';
          const tank = state.tanks.find(t => t.id === tankId);
          const count = state.fish.filter(f => f.tankId === tankId).length;
          if (count >= (tank?.capacity || 12)) {
            playWarning();
            addLogDraft(state, '⚠️ Target tank is full!');
            return;
          }
          const mutagenLevel = state.shop?.upgrades?.mutagen?.level || 0;
          const mutationRate = 0.02 + mutagenLevel * 0.03; // base 2% + 3% per level
          const childGenome = breedGenomes(bt.storedGenomeA, bt.storedGenomeB, null, mutationRate);
          const egg = createFish({ stage: 'egg', tankId, genome: childGenome });
          state.fish.push(egg);
          bt.eggReady = false;
          bt.breedingStartedAt = null;
          bt.slots = [null, null];
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
          state.player.stats.eggsCollected = (state.player.stats.eggsCollected || 0) + 1;
          playCoin();
          addLogDraft(state, '🥚 Collected a new egg!');
          const updated = updateChallengeProgress(state, 'collect_egg');
          Object.assign(state, updated);
        }),

        resetGame: () => set(state => {
          const fresh = createDefaultState();
          Object.assign(state, fresh);
        }),

        handleExportSave: () => {
          exportSave(get());
        },

        handleImportSave: async (file) => {
          try {
            const imported = await importSave(file);
            set(imported);
            fireToast('📂 Save imported!', 'info', '✅');
          } catch (e) {
            fireToast(e.message, 'alert', '❌');
          }
        },
      };
    })
  )
);

// ============================================================
// SELECTORS — components import these to subscribe to slices
// ============================================================

// ============================================================
// SIDE EFFECTS (subscriptions — run outside React)
// ============================================================

// 1. Auto-save every 30s
let _saveInterval;
function startAutoSave() {
  if (_saveInterval) return;
  _saveInterval = setInterval(() => {
    const state = useGameStore.getState();
    if (!saveGame(state)) {
      fireToast('⚠️ Save failed — storage full?', 'alert', '💾');
    }
  }, 30_000);
}

// 2. Save on tab close / hide
function handleUnload() { saveGame(useGameStore.getState()); }
function handleVisibility() {
  if (document.visibilityState === 'hidden') saveGame(useGameStore.getState());
}

// 3. Game tick interval
let _tickInterval;
function startTick() {
  if (_tickInterval) return;
  _tickInterval = setInterval(() => useGameStore.getState().tick(), TICK_INTERVAL_MS);
}

// 4. Achievement checker — subscribe to relevant scalar changes
let _achUnsub;
function startAchievementChecker() {
  if (_achUnsub) return;
  // Build a key from scalars that achievements depend on
  const buildKey = (s) => [
    (s.player.fishdex || []).length,
    (s.shop.salesHistory || []).length,
    s.player.totalCoinsEarned || 0,
    s.tanks.length,
    (s.player.magicFishFound || []).length,
    s.player.stats?.eggsCollected || 0,
    s.player.stats?.medicineUsed || 0,
    s.player.stats?.waterTreated || 0,
    s.fish.length,
  ].join(',');

  let prevKey = buildKey(useGameStore.getState());
  _achUnsub = useGameStore.subscribe((state) => {
    const key = buildKey(state);
    if (key === prevKey) return;
    prevKey = key;
    const msgs = [];
    const next = checkAchievements(state, msgs);
    if (next === state) return;
    // Apply achievement results
    useGameStore.setState(draft => {
      draft.player.coins = next.player.coins;
      draft.player.achievements = next.player.achievements;
      draft.player.unlockedDecorations = next.player.unlockedDecorations;
      draft.player.legendFishUnlocked = next.player.legendFishUnlocked;
      if (msgs.length > 0) {
        const entries = msgs.map(m => ({ time: Date.now(), message: m, severity: 'warn' }));
        draft.log = [...entries, ...(draft.log || [])].slice(0, 60);
      }
    });
  });
}

// 5. Sound + toast for sales
let _salesUnsub;
function startSalesWatcher() {
  if (_salesUnsub) return;
  let prevLen = (useGameStore.getState().shop.salesHistory || []).length;
  _salesUnsub = useGameStore.subscribe(
    (s) => (s.shop.salesHistory || []).length,
    (len) => {
      if (len > prevLen) {
        playSale();
        const sale = useGameStore.getState().shop.salesHistory[0];
        if (sale) fireToast(`Sold ${sale.fishName} for 🪙${sale.coins}!`, 'sale', '💰');
      }
      prevLen = len;
    }
  );
}

// 6. Sound + toast for achievements
let _achSoundUnsub;
function startAchSoundWatcher() {
  if (_achSoundUnsub) return;
  let prevLen = (useGameStore.getState().player.achievements || []).length;
  _achSoundUnsub = useGameStore.subscribe(
    (s) => (s.player.achievements || []).length,
    (len) => {
      if (len > prevLen) {
        playDiscover();
        const achs = useGameStore.getState().player.achievements || [];
        for (let i = prevLen; i < len; i++) {
          const ach = achs[i];
          fireToast(ach ? `Achievement: ${ach.id}` : 'Achievement unlocked!', 'achieve', '🏆');
        }
      }
      prevLen = len;
    }
  );
}

// 7. Disease toast (fire once per fish per disease)
let _diseaseUnsub;
function startDiseaseWatcher() {
  if (_diseaseUnsub) return;
  const seen = new Set();
  _diseaseUnsub = useGameStore.subscribe(
    (s) => s.fish,
    (fish) => {
      for (const f of fish) {
        if (f.disease && !seen.has(f.id)) {
          seen.add(f.id);
          fireToast(`${f.species?.name || 'Fish'} is sick! 🦠`, 'alert', '🚨');
        } else if (!f.disease) {
          seen.delete(f.id);
        }
      }
    }
  );
}

// 8. Breeding egg ready toast + sound
let _breedUnsub;
function startBreedingWatcher() {
  if (_breedUnsub) return;
  let wasReady = useGameStore.getState().breedingTank?.eggReady || false;
  _breedUnsub = useGameStore.subscribe(
    (s) => s.breedingTank?.eggReady,
    (eggReady) => {
      if (eggReady && !wasReady) {
        playDiscover();
        fireToast('An egg is ready to collect! 🥚', 'sale', '🧬');
      }
      wasReady = eggReady;
    }
  );
}

// 9. Fish death toast
let _deathUnsub;
function startDeathWatcher() {
  if (_deathUnsub) return;
  let prevIds = new Set(useGameStore.getState().fish.map(f => f.id));
  _deathUnsub = useGameStore.subscribe(
    (s) => s.fish.length,
    () => {
      const currentIds = new Set(useGameStore.getState().fish.map(f => f.id));
      // Check for fish that disappeared (died or sold — only toast for deaths via autopsy)
      const autopsies = useGameStore.getState().player.autopsies || [];
      for (const id of prevIds) {
        if (!currentIds.has(id)) {
          const autopsy = autopsies.find(a => a._fishId === id);
          if (autopsy) {
            fireToast(`${autopsy.fishName} has died 💀`, 'alert', '☠️');
          }
        }
      }
      prevIds = currentIds;
    }
  );
}

// ── Boot all side effects ──────────────────────────────────
export function bootSideEffects() {
  startAutoSave();
  startTick();
  startAchievementChecker();
  startSalesWatcher();
  startAchSoundWatcher();
  startDiseaseWatcher();
  startBreedingWatcher();
  startDeathWatcher();

  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', handleVisibility);
}

// ── Cleanup (for HMR) ──────────────────────────────────────
export function teardownSideEffects() {
  clearInterval(_saveInterval); _saveInterval = null;
  clearInterval(_tickInterval); _tickInterval = null;
  _achUnsub?.();    _achUnsub = null;
  _salesUnsub?.();  _salesUnsub = null;
  _achSoundUnsub?.(); _achSoundUnsub = null;
  _diseaseUnsub?.();  _diseaseUnsub = null;
  _breedUnsub?.();    _breedUnsub = null;
  _deathUnsub?.();    _deathUnsub = null;
  window.removeEventListener('beforeunload', handleUnload);
  document.removeEventListener('visibilitychange', handleVisibility);
}
