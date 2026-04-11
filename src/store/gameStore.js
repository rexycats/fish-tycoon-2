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
import { getDiseaseStage, CURE_SUCCESS_RATE } from '../systems/gameTick.js';
import { canPrestige as _canPrestige, performPrestige as _performPrestige } from '../data/prestige.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { DECOR_CATALOG, TANK_THEMES } from '../data/decorations.js';
import { fireToast } from '../components/ToastManager.jsx';
import { syncSteamAchievement, syncAllSteamAchievements } from '../services/steamService.js';
import { getLevelFromXp, XP_REWARDS, getLevelTitle } from '../data/levels.js';
import { RESEARCH_BRANCHES } from '../data/research.js';
import { LOAN_TIERS } from '../data/loans.js';
import { TANK_BACKGROUNDS } from '../data/tankBackgrounds.js';
import {
  playCoin, playBubble, playFeed, playBreed, playWarning,
  playDiscover, playSale, setSoundEnabled,
  playClick, playTabSwitch, playDeath, playSick, playLevelUp, playSplash,
} from '../services/soundService.js';

// ── Species phenotype lookup (static, module-level) ────────
// ── XP helper (Immer-compatible, call inside set()) ──────
function addXp(state, amount, source) {
  if (!amount || amount <= 0) return;
  const before = getLevelFromXp(state.player.xp || 0);
  state.player.xp = (state.player.xp || 0) + amount;
  const after = getLevelFromXp(state.player.xp);
  if (after.level > before.level) {
    // Level up!
    state.player._levelUpPending = after.level;
    addLogDraft(state, `🎉 LEVEL UP! You are now Level ${after.level} — ${getLevelTitle(after.level)}!`);
  }
}

const SPECIES_PHENOTYPES = {
  angelfish:         { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'White',   secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  clownfish:         { bodyShape: 'Round',   finType: 'Broad',   pattern: 'Lined',  primaryColor: 'Crimson', secondaryColor: 'Orange', glow: 'Normal',   size: 'Tiny',   mutation: 'None' },
  bluetang:          { bodyShape: 'Delta',   finType: 'Angular', pattern: 'Plain',  primaryColor: 'Azure',   secondaryColor: 'Indigo', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  betta:             { bodyShape: 'Slender', finType: 'Veil',    pattern: 'Marble', primaryColor: 'Violet',  secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
  goldfish:          { bodyShape: 'Round',   finType: 'Veil',    pattern: 'Plain',  primaryColor: 'Gold',    secondaryColor: 'Orange', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  mandarin_dragonet: { bodyShape: 'Slender', finType: 'Broad',   pattern: 'Marble', primaryColor: 'Azure',   secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
  neon_tetra:        { bodyShape: 'Slender', finType: 'Nub',     pattern: 'Lined',  primaryColor: 'Azure',   secondaryColor: 'Silver', glow: 'Luminous', size: 'Dwarf',  mutation: 'None' },
  discus:            { bodyShape: 'Round',   finType: 'Broad',   pattern: 'Tiger',  primaryColor: 'Crimson', secondaryColor: 'Orange', glow: 'Normal',   size: 'Giant',  mutation: 'None' },
  lionfish:          { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'Crimson', secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  seahorse:          { bodyShape: 'Eel',     finType: 'Nub',     pattern: 'Plain',  primaryColor: 'Gold',    secondaryColor: 'Orange', glow: 'Normal',   size: 'Tiny',   mutation: 'None' },
  pufferfish:        { bodyShape: 'Orb',     finType: 'Nub',     pattern: 'Spotted', primaryColor: 'Gold',   secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  jellyfish:         { bodyShape: 'Orb',     finType: 'Flowing', pattern: 'Plain',  primaryColor: 'Violet',  secondaryColor: 'Rose',   glow: 'Luminous', size: 'Medium', mutation: 'None' },
  koi:               { bodyShape: 'Round',   finType: 'Veil',    pattern: 'Spotted', primaryColor: 'White',  secondaryColor: 'Orange', glow: 'Normal',   size: 'Giant',  mutation: 'None' },
  moorish_idol:      { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'Gold',    secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  triggerfish:       { bodyShape: 'Delta',   finType: 'Angular', pattern: 'Lined',  primaryColor: 'Azure',   secondaryColor: 'Teal',   glow: 'Normal',   size: 'Medium', mutation: 'None' },
  electric_eel:      { bodyShape: 'Eel',     finType: 'Nub',     pattern: 'Plain',  primaryColor: 'Emerald', secondaryColor: 'Silver', glow: 'Luminous', size: 'Leviathan', mutation: 'None' },
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
          const state = get();
          if (state.paused) return;
          try {
            set(processTick(state));
          } catch (err) {
            console.error('[Store] Tick set failed:', err);
          }
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
          if (!fishId) return;
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

        useMedicine: (fishId, medicineType) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish || !fish.disease) return;
          const tank = fish.tankId ? state.tanks.find(t => t.id === fish.tankId) : null;
          if (!tank) return;

          const DISEASE_CURES = { ich: 'antibiotic', fin_rot: 'antibiotic', bloat: 'digestiveRemedy', velvet: 'antiparasitic', swim_bladder: 'digestiveRemedy', gill_flukes: 'antiparasitic', dropsy: 'antibiotic' };
          const correctMed = DISEASE_CURES[fish.disease] || 'antibiotic';

          // If no medicineType specified, auto-pick the correct one
          const medKey = medicineType || correctMed;

          if ((tank.supplies[medKey] || 0) <= 0) {
            playWarning();
            addLogDraft(state, `⚠️ No ${medKey} in ${tank.name}!`);
            return;
          }
          tank.supplies[medKey] -= 1;
          state.player.stats.medicineUsed = (state.player.stats.medicineUsed || 0) + 1;

          // Wrong medicine penalty — wastes supply AND speeds up disease
          if (medKey !== correctMed) {
            playWarning();
            // Advance disease by 60 seconds (makes it worse)
            fish.diseaseSince = (fish.diseaseSince || Date.now()) - 60_000;
            addLogDraft(state, `❌ Wrong treatment! ${medKey} doesn't treat ${fish.disease}. The disease worsened!`);
            if (!fish.treatmentLog) fish.treatmentLog = [];
            fish.treatmentLog.push({ med: medKey, at: Date.now(), result: 'wrong' });
            return;
          }

          // Stage-based cure success rate
          const stage = getDiseaseStage(fish.diseaseSince);
          const successRate = CURE_SUCCESS_RATE[stage] || 0.5;
          // Hardy personality bonus
          const hardyBonus = fish.personality === 'hardy' ? 0.15 : 0;
          const success = Math.random() < (successRate + hardyBonus);

          if (!fish.treatmentLog) fish.treatmentLog = [];
          fish.treatmentLog.push({ med: medKey, at: Date.now(), result: success ? 'cured' : 'failed', stage });

          if (success) {
            const diseaseName = fish.disease;
            if (!fish.immunities) fish.immunities = [];
            if (!fish.immunities.includes(diseaseName)) fish.immunities.push(diseaseName);
            fish.disease = null;
            fish.diseaseSince = null;
            fish.diagnosed = false;
            fish.health = Math.min(100, fish.health + 15);
            playCoin();
            addLogDraft(state, `💊 Cured ${fish.nickname || fish.species?.name || 'fish'} of ${diseaseName}! (${stage} stage, ${Math.round(successRate * 100)}% chance)`);
            addXp(state, XP_REWARDS.cureFish, 'cure');
          } else {
            playWarning();
            addLogDraft(state, `💊 Treatment failed on ${fish.nickname || fish.species?.name || 'fish'}! (${stage} stage, ${Math.round(successRate * 100)}% chance — try again)`);
          }
        }),

        // ── Diagnose a sick fish ─────────────────────────────
        diagnoseFish: (fishId) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish || !fish.disease || fish.diagnosed) return;
          const tank = fish.tankId ? state.tanks.find(t => t.id === fish.tankId) : null;
          if (!tank || (tank.supplies.diagnosticKit || 0) <= 0) {
            playWarning();
            addLogDraft(state, '⚠️ No diagnostic kits available!');
            return;
          }
          tank.supplies.diagnosticKit -= 1;
          fish.diagnosed = true;
          const d = DISEASES[fish.disease];
          playCoin();
          addLogDraft(state, `🔬 Diagnosis: ${d?.name || fish.disease} detected! Treat with ${d?.treatmentName || 'medicine'}.`);
        }),

        // ── Give vitamins to a fish ──────────────────────────
        giveVitamins: (fishId) => set(state => {
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish) return;
          const tank = fish.tankId ? state.tanks.find(t => t.id === fish.tankId) : null;
          if (!tank || (tank.supplies.vitamins || 0) <= 0) {
            playWarning();
            addLogDraft(state, '⚠️ No vitamins available!');
            return;
          }
          tank.supplies.vitamins -= 1;
          fish.vitaminUntil = Date.now() + 600_000; // 10 min immunity
          fish.health = Math.min(100, fish.health + 5);
          playCoin();
          addLogDraft(state, `💊 ${fish.nickname || fish.species?.name || 'fish'} received vitamins! 10 min disease immunity.`);
        }),
        moveFishToTank: (fishId, targetTankId) => set(state => {
          if (!fishId || !targetTankId) return;
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
          if (!unlock) {
            playWarning();
            addLogDraft(state, '⚠️ Maximum tanks reached!');
            return;
          }
          if (state.player.coins < unlock.cost) {
            playWarning();
            addLogDraft(state, '⚠️ Not enough coins!');
            return;
          }
          // Prestige gate for tanks 4+
          if (unlock.minPrestige && (state.player.prestigeLevel || 0) < unlock.minPrestige) {
            playWarning();
            addLogDraft(state, `⚠️ Requires Prestige Level ${unlock.minPrestige} to unlock!`);
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
          if (!fishId || !state.shop.listedFish) return;
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
          if (!fishId) return;
          state.shop.fishPrices[fishId] = price;
        }),

        buySupply: (supplyKey, cost, amount, tankId) => set(state => {
          // Bulk Buyer: -10% supply cost per level
          const bulkLevel = state.shop?.upgrades?.bulkBuyer?.level || 0;
          const actualCost = Math.max(1, Math.round(cost * (1 - bulkLevel * 0.10)));
          if (state.player.coins < actualCost) {
            playWarning();
            addLogDraft(state, '⚠️ Not enough coins!');
            return;
          }
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          state.player.coins -= actualCost;
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

          // Assign personality to adult fish
          if (!newFish.personality) {
            if (!newFish.personality) { const pList = ['playful','shy','curious','lazy','aggressive','social','gluttonous','hardy']; newFish.personality = pList[Math.floor(Math.random() * pList.length)]; }
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
          if (upgradeKey === 'deepSea') {
            state.tanks.forEach(t => { t.capacity = (t.capacity || 12) + 6; });
          }
          if (upgradeKey === 'breedBay') {
            state.maxBays = (state.maxBays || 1) + 1;
            const newBay = {
              slots: [null, null], eggReady: false, breedingStartedAt: null,
              breedingDurationMs: state.breedingTank.breedingDurationMs,
              storedGenomeA: null, storedGenomeB: null, storedGenomeC: null, storedTankId: null,
            };
            if (!state.extraBays) state.extraBays = [];
            state.extraBays.push(newBay);
            addLogDraft(state, `🧬 Breeding Bay ${state.maxBays} unlocked!`);
          }
          playCoin();
          addLogDraft(state, `⬆️ Upgraded ${upg.label} to level ${upg.level}!`);
          addXp(state, XP_REWARDS.buyUpgrade, 'upgrade');
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

        selectForBreeding: (fishId, bayIndex = 0) => set(state => {
          if (!fishId) return;
          const bt = bayIndex === 0 ? state.breedingTank : state.extraBays?.[bayIndex - 1];
          if (!bt) return;
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

        cancelBreeding: (bayIndex = 0) => set(state => {
          const bt = bayIndex === 0 ? state.breedingTank : state.extraBays?.[bayIndex - 1];
          if (!bt) return;
          bt.slots = [null, null];
          bt.breedingStartedAt = null;
          bt.eggReady = false;
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
        }),

        collectEgg: (bayIndex = 0) => set(state => {
          const bt = bayIndex === 0 ? state.breedingTank : state.extraBays?.[bayIndex - 1];
          if (!bt) return;
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
          const mutationBoostActive = (state.player?.boosts?.mutationBoost || 0) > Date.now();
          const mutationRate = (0.02 + mutagenLevel * 0.03) * (mutationBoostActive ? 3 : 1);
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
          addXp(state, XP_REWARDS.breedEgg, 'breed');
          const updated = updateChallengeProgress(state, 'collect_egg');
          Object.assign(state, updated);
        }),

        // ── Fish naming ──────────────────────────────────────
        renameFish: (fishId, name) => set(state => {
          if (!fishId) return;
          const fish = state.fish.find(f => f.id === fishId);
          if (fish) {
            fish.nickname = name.trim().slice(0, 24) || null;
          }
        }),

        // ── Haggle resolution ────────────────────────────────
        resolveHaggle: (action, counterPrice) => set(state => {
          const h = state.pendingHaggle;
          if (!h) return;
          state.pendingHaggle = null;

          if (action === 'decline') {
            addLogDraft(state, `🚶 ${h.customerName} left without buying.`);
            return;
          }

          const price = action === 'counter' ? counterPrice : h.offer;
          if (!price || price <= 0) return;

          const fish = h.fishId ? state.fish.find(f => f.id === h.fishId) : null;
          if (!fish) {
            addLogDraft(state, `⚠️ Fish no longer available.`);
            return;
          }

          // Complete the sale
          state.player.coins += price;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + price;
          state.fish = state.fish.filter(f => f.id !== h.fishId);
          state.shop.listedFish = state.shop.listedFish.filter(id => id !== h.fishId);
          if (state.shop.fishPrices) delete state.shop.fishPrices[h.fishId];
          state.player.stats.fishSold = (state.player.stats.fishSold || 0) + 1;
          state.shop.reputation = (state.shop.reputation || 0) + 1;
          if (!state.shop.salesHistory) state.shop.salesHistory = [];
          state.shop.salesHistory.push({ fishName: h.fishName, price, customer: h.customerName, at: Date.now() });
          playCoin();
          addLogDraft(state, `🤝 ${h.customerName}: Sold ${h.fishName} for 🪙${price}!`);
          const soldRarity = state.fish.find(f => f.id === h.fishId)?.species?.rarity;
          addXp(state, soldRarity === 'epic' ? XP_REWARDS.sellEpicFish : soldRarity === 'rare' ? XP_REWARDS.sellRareFish : XP_REWARDS.sellFish, 'sell');
        }),

        // ── Prestige ────────────────────────────────────────
        performPrestige: () => set(state => {
          // imported at top as _canPrestige, _performPrestige
          if (!_canPrestige(state)) return;
          const next = _performPrestige(state);
          Object.assign(state, next);
          addLogDraft(state, `🌟 PRESTIGE! You are now Prestige Level ${state.player.prestigeLevel}. All permanent bonuses increased.`);
        }),

        // ── Pause toggle ────────────────────────────────────
        paused: false,
        togglePause: () => set(state => { state.paused = !state.paused; }),

        // ── Special Orders ──────────────────────────────────
        fulfillOrder: (orderId, fishId) => set(state => {
          if (!fishId || !orderId) return;
          const order = (state.specialOrders || []).find(o => o.id === orderId);
          if (!order || order.fulfilled) return;
          const fish = state.fish.find(f => f.id === fishId);
          if (!fish) return;
          order.fulfilled = true;
          state.player.coins += order.reward;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + order.reward;
          state.fish = state.fish.filter(f => f.id !== fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter(id => id !== fishId);
          addXp(state, order.xpReward || 25, 'order');
          playCoin();
          addLogDraft(state, `📋 Order fulfilled for ${order.customer}! +🪙${order.reward}`);
        }),

        // ── Research ────────────────────────────────────────
        buyResearch: (branchId) => set(state => {
          const level = state.player?.research?.[branchId] || 0;
          const branch = RESEARCH_BRANCHES[branchId];
          if (!branch || level >= branch.tiers.length) return;
          const next = branch.tiers[level];
          if (state.player.coins < next.cost) { playWarning(); return; }
          state.player.coins -= next.cost;
          if (!state.player.research) state.player.research = {};
          state.player.research[branchId] = level + 1;
          addXp(state, 20, 'research');
          playCoin();
          addLogDraft(state, `🔬 Researched: ${next.label}! ${next.desc}`);
        }),

        // ── Loans ───────────────────────────────────────────
        takeLoan: (tierId) => set(state => {
          if (state.player?.activeLoan?.active) { playWarning(); return; }
          const tier = LOAN_TIERS.find(t => t.id === tierId);
          if (!tier) return;
          state.player.coins += tier.amount;
          state.player.activeLoan = { active: true, tierId: tier.id, amount: tier.amount, interest: tier.interest, repayBy: tier.repayBy, takenAt: Date.now() };
          playCoin();
          addLogDraft(state, `🏦 Loan: +🪙${tier.amount} at ${tier.interest*100}% interest.`);
        }),

        repayLoan: () => set(state => {
          const loan = state.player?.activeLoan;
          if (!loan?.active) return;
          const owed = Math.round(loan.amount * (1 + loan.interest));
          if (state.player.coins < owed) { playWarning(); return; }
          state.player.coins -= owed;
          state.player.activeLoan = { active: false };
          playCoin();
          addLogDraft(state, `🏦 Loan repaid! 🪙${owed}`);
        }),

        // ── Daily Rewards ───────────────────────────────────
        claimDailyReward: () => set(state => {
          const today = new Date().toDateString();
          if (state.player.lastDailyClaimDate === today) return;
          const last = state.player.lastDailyClaimDate;
          const wasYesterday = last && (new Date(today) - new Date(last)) / 86400000 <= 1;
          const streak = wasYesterday ? (state.player.dailyStreak || 0) + 1 : 1;
          state.player.dailyStreak = streak;
          state.player.lastDailyClaimDate = today;
          // Reward scales with streak
          const reward = 25 + streak * 10;
          state.player.coins += reward;
          addXp(state, 10, 'daily');
          playCoin();
          addLogDraft(state, `🎁 Day ${streak} login reward: +🪙${reward}!`);
        }),

        // ── Tank backgrounds ────────────────────────────────
        buyBackground: (bgId) => set(state => {
          const bg = TANK_BACKGROUNDS.find(b => b.id === bgId);
          if (!bg || bg.cost === 0 || (state.player.unlockedBackgrounds || []).includes(bgId)) return;
          if (state.player.coins < bg.cost) { playWarning(); return; }
          state.player.coins -= bg.cost;
          if (!state.player.unlockedBackgrounds) state.player.unlockedBackgrounds = [];
          state.player.unlockedBackgrounds.push(bgId);
          playCoin();
          addLogDraft(state, `🎨 Unlocked: ${bg.label}!`);
        }),

        setTankBackground: (tankId, bgId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (tank) tank.backgroundId = bgId;
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
    if (saveGame(state)) {
      // Flash save indicator
      useGameStore.setState({ _saveFlash: Date.now() });
    } else {
      fireToast('⚠️ Save failed — storage full?', 'alert', '💾');
    }
  }, 30_000);
}

// 2. Save on tab close / hide
function handleUnload() { saveGame(useGameStore.getState()); }
function handleVisibility() {
  if (document.visibilityState === 'hidden') {
    saveGame(useGameStore.getState());
    // Throttle tick to every 5s when hidden (saves CPU/battery)
    if (_tickInterval) clearInterval(_tickInterval);
    _tickInterval = setInterval(() => useGameStore.getState().tick(), 5000);
  } else {
    // Restore normal tick rate when visible
    if (_tickInterval) clearInterval(_tickInterval);
    _tickInterval = setInterval(() => useGameStore.getState().tick(), TICK_INTERVAL_MS);
  }
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
          if (ach) syncSteamAchievement(ach.id);
        }
      }
      prevLen = len;
    }
  );
}

// 7. Disease toast (fire once per fish per disease)
let _diseaseUnsub;
// 8b. Level-up watcher
let _levelUpUnsub;
function startLevelUpWatcher() {
  if (_levelUpUnsub) return;
  let prevLevel = getLevelFromXp(useGameStore.getState().player?.xp || 0).level;
  _levelUpUnsub = useGameStore.subscribe(
    (s) => s.player?.xp || 0,
    (xp) => {
      const { level } = getLevelFromXp(xp);
      if (level > prevLevel) {
        playLevelUp();
        fireToast(`Level Up! You are now Level ${level} — ${getLevelTitle(level)}`, 'achieve', '🎉');
      }
      prevLevel = level;
    }
  );
}

function startDiseaseWatcher() {
  if (_diseaseUnsub) return;
  const seen = new Set();
  _diseaseUnsub = useGameStore.subscribe(
    (s) => s.fish,
    (fish) => {
      for (const f of fish) {
        if (f.disease && !seen.has(f.id)) {
          seen.add(f.id);
          playSick();
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
  let wasReady = [useGameStore.getState().breedingTank?.eggReady || false, ...(useGameStore.getState().extraBays || []).map(b => b?.eggReady || false)].join(',');
  _breedUnsub = useGameStore.subscribe(
    (s) => {
      const main = s.breedingTank?.eggReady || false;
      const extra = (s.extraBays || []).map(b => b?.eggReady || false);
      return [main, ...extra].join(',');
    },
    (readyStr) => {
      const readyStates = readyStr.split(',').map(s => s === 'true');
      const anyNew = readyStates.some((r, i) => r && !(wasReady.split(',').map(s => s === 'true')[i]));
      if (anyNew) {
        playDiscover();
        fireToast('An egg is ready to collect! 🥚', 'sale', '🧬');
      }
      wasReady = readyStr;
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
            playDeath();
            fireToast(`${autopsy.fishName} has died 💀`, 'alert', '☠️');
          }
        }
      }
      prevIds = currentIds;
    }
  );
}

// 9. Random event toast
let _eventUnsub;
function startEventWatcher() {
  if (_eventUnsub) return;
  let lastEventId = useGameStore.getState().lastRandomEventId || null;
  _eventUnsub = useGameStore.subscribe(
    (s) => s.lastRandomEventId,
    (eventId) => {
      if (eventId && eventId !== lastEventId) {
        const event = useGameStore.getState().activeEvent;
        if (event) {
          fireToast(event.name + ' ' + event.desc, 'event', event.emoji);
        }
      }
      lastEventId = eventId;
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
  startLevelUpWatcher();
  startBreedingWatcher();
  startDeathWatcher();
  startEventWatcher();

  window.addEventListener('beforeunload', handleUnload);
  document.addEventListener('visibilitychange', handleVisibility);

  // Sync existing achievements to Steam on startup
  const achs = useGameStore.getState().player?.achievements || [];
  if (achs.length > 0) syncAllSteamAchievements(achs);
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
