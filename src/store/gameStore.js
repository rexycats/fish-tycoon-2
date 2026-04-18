import { upgradeCost, BREEDING_BASE_MS, BREEDING_SPEED_FACTOR } from '../data/constants.js';
import { generateWantedPoster, fishMatchesPoster } from '../data/wantedBoard.js';
import { checkOrderFulfillment } from '../data/specialOrders.js';
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
  createDefaultState, saveGame, loadGame, loadGameAsync, checkAchievements,
  addLogDraft, createDefaultTank, TANK_UNLOCK, exportSave, importSave,
} from '../data/gameState.js';
import {
  processTick, applyOfflineProgress, TICK_INTERVAL_MS,
  refreshDailyChallenges, updateChallengeProgress,
  refreshMarket,
} from '../systems/gameTick.js';
import { breedGenomes, createFish, computePhenotype, getSpeciesFromPhenotype } from '../data/genetics.js';
import { getDiseaseStage, CURE_SUCCESS_RATE, DISEASES } from '../systems/gameTick.js';
import { canPrestige as _canPrestige, performPrestige as _performPrestige } from '../data/prestige.js';
import { canAscend, performAscension, buyUnlock, hasUnlock, getCoralReward, CORAL_SHOP } from '../data/ascension.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { DECOR_CATALOG, TANK_THEMES } from '../data/decorations.js';
import { fireToast } from '../components/ToastManager.jsx';
import { syncSteamAchievement, syncAllSteamAchievements } from '../services/steamService.js';
import { getLevelFromXp, XP_REWARDS, getLevelTitle } from '../data/levels.js';
import { CAMPAIGN_LEVELS, getLevelById, checkObjective, getStarRating } from '../data/campaign.js';
import { checkTankCompat } from '../data/compatibility.js';
import { createStaffMember, getStaffWage, getTrainCost, getHireCost, getMaxStaff, STAFF_ROLES } from '../data/staff.js';
import { RESEARCH_BRANCHES, getResearchEffects } from '../data/research.js';
import { TANK_SIZES, getNextTankSize } from '../data/tankSizes.js';
import { EQUIPMENT_TYPES, createEquipment } from '../data/equipment.js';
import { ROOMS } from '../data/rooms.js';
import { LOAN_TIERS } from '../data/loans.js';
import { TANK_BACKGROUNDS } from '../data/tankBackgrounds.js';
import { MILESTONES } from '../data/milestones.js';
import { checkNearMiss, getStreakMultiplier, getStreakLabel } from '../data/retention.js';
import {
  playCoin, playBubble, playFeed, playBreed, playWarning,
  playDiscover, setSoundEnabled,
  playSaleScaled, playDiscoverScaled, playCoinScaled, playAscension,
  playClick, playTabSwitch, playDeath, playSick, playLevelUp, playSplash,
  playEquipInstall, playRepair, playHire, playResearch, playVictory, playHatch,
} from '../services/soundService.js';

// ── Module-level constants ─────────────────────────────────
const DISEASE_CURES = {
  ich: 'antibiotic',
  fin_rot: 'antibiotic',
  bloat: 'digestiveRemedy',
  velvet: 'antiparasitic',
  swim_bladder: 'digestiveRemedy',
  gill_flukes: 'antiparasitic',
  dropsy: 'antibiotic',
};

const PERSONALITY_LIST = [
  'playful', 'shy', 'curious', 'lazy',
  'aggressive', 'social', 'gluttonous', 'hardy',
];

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
    addLogDraft(state, `LEVEL UP! You are now Level ${after.level} — ${getLevelTitle(after.level)}!`);
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
  // Recovery mode: ?safe=1 skips offline progress
  const isRecovery = typeof window !== 'undefined' && new URLSearchParams(window.location?.search).get('safe') === '1';
  if (isRecovery) console.warn('[Recovery Mode] Skipping offline progress');

  const saved = getInitSave();
  let g;
  if (!saved) {
    g = createDefaultState();
  } else if (isRecovery) {
    g = saved; // Skip applyOfflineProgress in recovery mode
  } else {
    try {
      g = applyOfflineProgress(saved);
    } catch (err) {
      console.error('[Init] applyOfflineProgress crashed, using raw save:', err);
      g = saved;
    }
  }
  try { g = refreshDailyChallenges(g); } catch { /* non-fatal */ }
  try { g = refreshMarket(g); } catch { /* non-fatal */ }
  return g;
}

// ============================================================
// HELPERS — reduce repeated lookups in store actions
// ============================================================
function findFish(state, fishId) { return fishId ? state.fish.find(f => f.id === fishId) : null; }
function findTank(state, tankId) { return tankId ? state.tanks.find(t => t.id === tankId) : null; }
function fishTank(state, fish) { return fish?.tankId ? findTank(state, fish.tankId) : null; }
function removeFishFromBreedSlots(state, fishId) {
  if (state.breedingTank?.slots) {
    state.breedingTank.slots = state.breedingTank.slots.map(s => s === fishId ? null : s);
  }
  for (const bay of (state.extraBays || [])) {
    if (bay?.slots) bay.slots = bay.slots.map(s => s === fishId ? null : s);
  }
}

// ============================================================
// STORE
// ============================================================
export const useGameStore = create(
  subscribeWithSelector(
    immer((_rawSet, get) => {
      const initial = buildInitialState();

      // Crashproof wrapper — catches errors in ALL store mutations
      const set = (fnOrObj) => {
        try { _rawSet(fnOrObj); }
        catch (err) { console.error('[Store] Mutation crashed:', err); }
      };

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
            const t0 = performance.now();
            set(processTick(state));
            const dt = performance.now() - t0;
            if (dt > 50) console.warn(`[Perf] Tick took ${dt.toFixed(1)}ms (>50ms threshold)`);
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
          const fish = findFish(state, fishId);
          if (!fish) return;
          const tank = fishTank(state, fish);
          if (!tank || tank.supplies.food <= 0) {
            playWarning();
            addLogDraft(state, 'No food in that tank!');
            return;
          }
          playFeed();
          tank.supplies.food -= 1;
          fish.hunger = Math.max(0, fish.hunger - 45);
          fish.health = Math.min(100, fish.health + 5);
          state.player.stats.fishFed = (state.player.stats.fishFed || 0) + 1;
        }),

        feedAllInTank: (tankId) => set(state => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          const hungry = state.fish.filter(f => f.tankId === tankId && f.stage !== 'egg' && f.hunger > 30);
          if (hungry.length === 0) return;
          const feedCount = Math.min(hungry.length, tank.supplies.food);
          if (feedCount === 0) {
            playWarning();
            addLogDraft(state, 'No food in that tank!');
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
          addLogDraft(state, `Fed ${feedCount} fish in ${tank.name}.`);
        }),

        useMedicine: (fishId, medicineType) => set(state => {
          const fish = findFish(state, fishId);
          if (!fish || !fish.disease) return;
          const tank = fishTank(state, fish);
          if (!tank) return;

          const correctMed = DISEASE_CURES[fish.disease] || 'antibiotic';

          // If no medicineType specified, auto-pick the correct one
          const medKey = medicineType || correctMed;

          if ((tank.supplies[medKey] || 0) <= 0) {
            playWarning();
            addLogDraft(state, `No ${medKey} in ${tank.name}!`);
            return;
          }
          tank.supplies[medKey] -= 1;
          state.player.stats.medicineUsed = (state.player.stats.medicineUsed || 0) + 1;

          // Wrong medicine penalty — wastes supply AND speeds up disease
          if (medKey !== correctMed) {
            playWarning();
            // Advance disease by 60 seconds (makes it worse)
            fish.diseaseSince = (fish.diseaseSince || state.gameClock || Date.now()) - 60_000;
            addLogDraft(state, `Wrong treatment! ${medKey} doesn't treat ${fish.disease}. The disease worsened!`);
            if (!fish.treatmentLog) fish.treatmentLog = [];
            fish.treatmentLog.push({ med: medKey, at: state.gameClock || Date.now(), result: 'wrong' });
            return;
          }

          // Stage-based cure success rate
          const stage = getDiseaseStage(fish.diseaseSince, state.gameClock);
          const successRate = CURE_SUCCESS_RATE[stage] || 0.5;
          // Hardy personality bonus + research cure bonus
          const hardyBonus = fish.personality === 'hardy' ? 0.15 : 0;
          const researchCureBonus = getResearchEffects(state).cureBonus || 0;
          const success = Math.random() < Math.min(0.99, successRate + hardyBonus + researchCureBonus);

          if (!fish.treatmentLog) fish.treatmentLog = [];
          fish.treatmentLog.push({ med: medKey, at: state.gameClock || Date.now(), result: success ? 'cured' : 'failed', stage });

          if (success) {
            const diseaseName = fish.disease;
            if (!fish.immunities) fish.immunities = [];
            if (!fish.immunities.includes(diseaseName)) fish.immunities.push(diseaseName);
            fish.disease = null;
            fish.diseaseSince = null;
            fish.diagnosed = false;
            fish.health = Math.min(100, fish.health + 15);
            playCoin();
            addLogDraft(state, `Cured ${fish.nickname || fish.species?.name || 'fish'} of ${diseaseName}! (${stage} stage, ${Math.round(successRate * 100)}% chance)`);
            addXp(state, XP_REWARDS.cureFish, 'cure');
            const updated = updateChallengeProgress(state, 'cure_fish');
            Object.assign(state, updated);
          } else {
            playWarning();
            addLogDraft(state, `Treatment failed on ${fish.nickname || fish.species?.name || 'fish'}! (${stage} stage, ${Math.round(successRate * 100)}% chance — try again)`);
          }
        }),

        // ── Diagnose a sick fish ─────────────────────────────
        diagnoseFish: (fishId) => set(state => {
          const fish = findFish(state, fishId);
          if (!fish || !fish.disease || fish.diagnosed) return;
          const tank = fishTank(state, fish);
          if (!tank || (tank.supplies.diagnosticKit || 0) <= 0) {
            playWarning();
            addLogDraft(state, 'No diagnostic kits available!');
            return;
          }
          tank.supplies.diagnosticKit -= 1;
          fish.diagnosed = true;
          const d = DISEASES[fish.disease];
          playCoin();
          addLogDraft(state, `Diagnosis: ${d?.name || fish.disease} detected! Treat with ${d?.treatmentName || 'medicine'}.`);
        }),

        // ── Give vitamins to a fish ──────────────────────────
        giveVitamins: (fishId) => set(state => {
          const fish = findFish(state, fishId);
          if (!fish) return;
          const tank = fishTank(state, fish);
          if (!tank || (tank.supplies.vitamins || 0) <= 0) {
            playWarning();
            addLogDraft(state, 'No vitamins available!');
            return;
          }
          tank.supplies.vitamins -= 1;
          fish.vitaminUntil = (state.gameClock || Date.now()) + 600_000; // 10 min immunity
          fish.health = Math.min(100, fish.health + 5);
          playCoin();
          addLogDraft(state, `${fish.nickname || fish.species?.name || 'fish'} received vitamins! 10 min disease immunity.`);
        }),
        moveFishToTank: (fishId, targetTankId) => set(state => {
          if (!fishId || !targetTankId) return;
          const fish = findFish(state, fishId);
          if (!fish) return;
          const target = findTank(state, targetTankId);
          if (!target) return;
          const count = state.fish.filter(f => f.tankId === targetTankId).length;
          if (count >= (target.capacity || 12)) {
            playWarning();
            addLogDraft(state, `${target.name} is full!`);
            return;
          }
          fish.tankId = targetTankId;
          playBubble();
        }),

        treatWater: (tankId) => set(state => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if ((tank.supplies.waterTreatment || 0) <= 0) {
            playWarning();
            addLogDraft(state, 'No water treatment supplies!');
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
          const tank = findTank(state, tankId);
          if (tank) tank.autoFeed = !tank.autoFeed;
        }),

        useHeater: (tankId) => set(state => {
          const tank = findTank(state, tankId);
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
          // Campaign constraint
          if (state.campaign?.mode === 'campaign') {
            const lvl = getLevelById(state.campaign.activeLevelId);
            if (lvl?.constraints?.maxTanks && state.tanks.length >= lvl.constraints.maxTanks) {
              fireToast('Tank limit reached for this level.', 'alert', '');
              return;
            }
          }
          const unlock = TANK_UNLOCK[state.tanks.length];
          if (!unlock) {
            playWarning();
            addLogDraft(state, 'Maximum tanks reached!');
            return;
          }
          if (state.player.coins < unlock.cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          // Prestige gate for tanks 4+
          if (unlock.minPrestige && (state.player.prestigeLevel || 0) < unlock.minPrestige) {
            playWarning();
            addLogDraft(state, `Requires Prestige Level ${unlock.minPrestige} to unlock!`);
            return;
          }
          state.player.coins -= unlock.cost;
          const newTank = createDefaultTank(`tank_${state.tanks.length}`, type);
          state.tanks.push(newTank);
          playCoin();
          addLogDraft(state, `Unlocked a new ${type} tank!`);
        }),

        renameTank: (tankId, name) => set(state => {
          const tank = findTank(state, tankId);
          if (tank) tank.name = name.trim().slice(0, 24) || tank.name;
        }),

        toggleSellFish: (fishId) => set(state => {
          if (!fishId || !state.shop.listedFish) return;
          const isListed = state.shop.listedFish.includes(fishId);
          if (!isListed && state.shop.listedFish.length >= state.shop.slots) {
            playWarning();
            addLogDraft(state, 'Shop full! Buy an upgrade to add more slots.');
            return;
          }
          if (isListed) {
            state.shop.listedFish = state.shop.listedFish.filter(id => id !== fishId);
            delete state.shop.fishPrices[fishId];
          } else {
            state.shop.listedFish.push(fishId);
          }
          playCoin();
          const fish = findFish(state, fishId);
          addLogDraft(state,
            isListed
              ? `Removed ${fish?.species?.name || 'fish'}.`
              : `Listed ${fish?.species?.name || 'fish'} for sale!`
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
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= actualCost;
          tank.supplies[supplyKey] = (tank.supplies[supplyKey] || 0) + amount;
          playCoin();
        }),

        buyFish: (cost, targetRarity, speciesKey) => set(state => {
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          // Find a tank with room
          const fishCountByTank = new Map();
          for (const f of state.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
          const tank = state.tanks.find(t => (fishCountByTank.get(t.id) || 0) < (t.capacity || 12));
          if (!tank) {
            playWarning();
            addLogDraft(state, 'All tanks are full!');
            return;
          }
          state.player.coins -= cost;

          let newFish;
          if (speciesKey && REAL_SPECIES_MAP[speciesKey]) {
            // Named species (clownfish, betta, etc.)
            const speciesDef = REAL_SPECIES_MAP[speciesKey];
            const phenotype = SPECIES_PHENOTYPES[speciesKey];
            newFish = createFish({ stage: 'adult', tankId: tank.id, phenotype, targetRarity: speciesDef.rarity, now: state.gameClock });
            // Override species info for real species
            newFish.species = { ...newFish.species, ...speciesDef, visualType: 'species', key: speciesKey };
          } else {
            // Generic fish by rarity
            newFish = createFish({ stage: 'adult', tankId: tank.id, targetRarity: targetRarity || 'common', now: state.gameClock });
          }

          // Assign personality to adult fish
          if (!newFish.personality) {
            if (!newFish.personality) {
              newFish.personality = PERSONALITY_LIST[Math.floor(Math.random() * PERSONALITY_LIST.length)];
            }
          }

          state.fish.push(newFish);
          state.player.stats.fishBought = (state.player.stats.fishBought || 0) + 1;
          playCoin();
          addLogDraft(state, `Bought a ${newFish.species?.name || 'fish'}!`);
          // Compatibility warning
          const tankmates = state.fish.filter(f => f.tankId === tank.id && f.id !== newFish.id);
          const issues = checkTankCompat(newFish, tankmates);
          for (const issue of issues) {
            addLogDraft(state, `${issue.message}`);
            if (issue.severity === 'critical') fireToast(issue.message, 'alert', '');
          }
        }),

        buyUpgrade: (upgradeKey) => set(state => {
          const upg = state.shop.upgrades[upgradeKey];
          if (!upg || upg.level >= (upg.maxLevel || 3)) return;
          const cost = upgradeCost(upg.cost, upg.level);
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
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
            const newDuration = Math.round(BREEDING_BASE_MS * Math.pow(BREEDING_SPEED_FACTOR, upg.level));
            state.breedingTank.breedingDurationMs = newDuration;
            // Also update all extra bays
            if (state.extraBays) {
              for (const bay of state.extraBays) {
                bay.breedingDurationMs = newDuration;
              }
            }
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
            addLogDraft(state, `Breeding Bay ${state.maxBays} unlocked!`);
          }
          playCoin();
          addLogDraft(state, `Upgraded ${upg.label} to level ${upg.level}!`);
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
          const tank = findTank(state, tankId) || state.tanks[0];
          if ((item.type === 'fish' || item.type === 'egg') && tank) {
            const count = state.fish.filter(f => f.tankId === tank.id).length;
            const needed = item.eggCount || 1;
            if (count + needed > (tank.capacity || 12)) {
              playWarning();
              addLogDraft(state, `Not enough room in ${tank.name}!`);
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
              const egg = createFish({ stage: 'egg', tankId: tank.id, targetRarity: rarity, now: state.gameClock });
              state.fish.push(egg);
              hatched.push(rarity);
            }
            const summary = hatched.join(', ');
            addLogDraft(state, `Mystery egg${eggCount > 1 ? 's' : ''} placed in ${tank.name}! (${summary})`);
            playCoin();
            return;
          }

          // ── Exotic Fish: spawn adult of target rarity ──
          if (item.type === 'fish' && item.targetRarity && tank) {
            const newFish = createFish({ stage: 'adult', tankId: tank.id, targetRarity: item.targetRarity, now: state.gameClock });
            state.fish.push(newFish);
            addLogDraft(state, `${newFish.species?.name || 'Exotic fish'} (${newFish.species?.rarity}) added to ${tank.name}!`);
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
            state.player.boosts[item.boost] = (state.gameClock || Date.now()) + item.boostDurationMs;
          }

          playCoin();
          addLogDraft(state, `Purchased ${item.label} from the Rare Market!`);
        }),

        buyDecoration: (decorId, tankId) => set(state => {
          const decor = DECOR_CATALOG.find(d => d.id === decorId);
          if (!decor || state.player.coins < decor.price) {
            playWarning();
            return;
          }
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= decor.price;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          playCoin();
        }),

        claimUnlockedDecoration: (decorId, tankId) => set(state => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          state.player.unlockedDecorations = (state.player.unlockedDecorations || []).filter(id => id !== decorId);
        }),

        placeDecoration: (decorId, tankId) => set(state => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if (!tank.decorations.placed) tank.decorations.placed = [];
          tank.decorations.placed.push(decorId);
          if (tank.decorations.owned) {
            const idx = tank.decorations.owned.indexOf(decorId);
            if (idx !== -1) tank.decorations.owned.splice(idx, 1);
          }
        }),

        removeDecoration: (decorId, tankId) => set(state => {
          const tank = findTank(state, tankId);
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
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= theme.price || 0;
          if (!tank.themes.owned) tank.themes.owned = [];
          tank.themes.owned.push(themeId);
          playCoin();
        }),

        applyTheme: (themeId, tankId) => set(state => {
          const tank = findTank(state, tankId);
          if (tank) tank.themes.active = themeId;
        }),

        selectForBreeding: (fishId, bayIndex = 0) => set(state => {
          if (!fishId) return;
          // Campaign constraint
          if (state.campaign?.mode === 'campaign') {
            const lvl = getLevelById(state.campaign.activeLevelId);
            if (lvl?.constraints?.breedingDisabled) {
              fireToast('Breeding is not available in this level.', 'alert', '');
              return;
            }
          }
          const bt = bayIndex === 0 ? state.breedingTank : state.extraBays?.[bayIndex - 1];
          if (!bt) return;
          if (bt.eggReady) return;
          if (bt.breedingStartedAt) return;
          const fish = findFish(state, fishId);
          if (!fish || fish.stage !== 'adult') return;
          if (bt.slots.includes(fishId)) {
            // Deselect
            bt.slots = bt.slots.map(s => s === fishId ? null : s);
            return;
          }
          // Check if fish is already in another bay
          const allBays = [state.breedingTank, ...(state.extraBays || [])];
          for (let i = 0; i < allBays.length; i++) {
            if (i === bayIndex) continue;
            if (allBays[i]?.slots?.includes(fishId)) {
              playWarning();
              addLogDraft(state, 'That fish is already in another breeding bay!');
              return;
            }
          }
          const emptyIdx = bt.slots.indexOf(null);
          if (emptyIdx === -1) return;
          bt.slots[emptyIdx] = fishId;
          // If both slots filled, start breeding
          if (bt.slots[0] && bt.slots[1]) {
            bt.breedingStartedAt = (state.gameClock || Date.now());
            state.player.stats.breedingsStarted = (state.player.stats.breedingsStarted || 0) + 1;
            const fishA = findFish(state, bt.slots[0]);
            const fishB = findFish(state, bt.slots[1]);
            // Feature 7: Bonding — fish that breed together become bonded
            if (fishA && fishB) {
              fishA.bondedWith = fishB.id;
              fishB.bondedWith = fishA.id;
            }
            bt.storedGenomeA = fishA?.genome || null;
            bt.storedGenomeB = fishB?.genome || null;
            bt.storedTankId = fishA?.tankId || state.tanks[0]?.id || 'tank_0';

            // ── Clutch size calculation ──────────────────────
            // Base: 1 egg. Twins: ~15%, Triplets: ~3%
            // Bonuses: parent health, hatchery level, same species
            const hpAvg = ((fishA?.health || 50) + (fishB?.health || 50)) / 200; // 0-1
            const hatcheryLvl = state.shop?.upgrades?.hatchery?.level || 0;
            const sameSpecies = fishA?.species?.key && fishA.species.key === fishB?.species?.key;
            const clutchBonus = hpAvg * 0.08 + hatcheryLvl * 0.04 + (sameSpecies ? 0.06 : 0);
            const roll = Math.random();
            const clutchSize = roll < 0.03 + clutchBonus * 0.5 ? 3
              : roll < 0.15 + clutchBonus ? 2 : 1;
            bt.clutchSize = clutchSize;

            playBreed();
            const clutchMsg = clutchSize > 1 ? ` (${clutchSize === 3 ? 'Triplets' : 'Twins'}! )` : '';
            addLogDraft(state, `Breeding started: ${fishA?.species?.name || '?'} × ${fishB?.species?.name || '?'}${clutchMsg}`);
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
          const tank = findTank(state, tankId);
          const currentCount = state.fish.filter(f => f.tankId === tankId).length;
          const capacity = tank?.capacity || 12;
          const clutchSize = bt.clutchSize || 1;
          const roomAvailable = capacity - currentCount;

          if (roomAvailable <= 0) {
            playWarning();
            addLogDraft(state, 'Target tank is full!');
            return;
          }

          const mutagenLevel = state.shop?.upgrades?.mutagen?.level || 0;
          const mutationBoostActive = (state.player?.boosts?.mutationBoost || 0) > (state.gameClock || Date.now());
          const rFx = getResearchEffects(state);
          const mutationRate = (0.02 + mutagenLevel * 0.03) * (mutationBoostActive ? 3 : 1) * (rFx.mutationRate || 1);

          // Create 1-3 eggs, each with unique genome
          const eggsToCreate = Math.min(clutchSize, roomAvailable);
          const parentA = findFish(state, bt.slots?.[0]);
          const parentB = findFish(state, bt.slots?.[1]);
          const parentGenA = parentA?.generation || 1;
          const parentGenB = parentB?.generation || 1;
          const childGen = Math.max(parentGenA, parentGenB) + 1;
          const parentIds = [bt.slots?.[0], bt.slots?.[1]].filter(Boolean);
          const newEggs = [];
          for (let i = 0; i < eggsToCreate; i++) {
            const childGenome = breedGenomes(bt.storedGenomeA, bt.storedGenomeB, null, mutationRate);
            const egg = createFish({ stage: 'egg', tankId, genome: childGenome, parentIds, generation: childGen, now: state.gameClock, targetRarity: rFx.rarityBoost > 1 ? 'uncommon' : null });
            newEggs.push(egg);
            state.fish.push(egg);
          }

          bt.eggReady = false;
          bt.breedingStartedAt = null;
          bt.slots = [null, null];
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
          bt.clutchSize = null;
          state.player.stats.eggsCollected = (state.player.stats.eggsCollected || 0) + eggsToCreate;
          playHatch();

          playCoin();
          if (eggsToCreate === 3) {
            playDiscoverScaled("rare");
            addLogDraft(state, `Triplets! Collected 3 eggs!`);
          } else if (eggsToCreate === 2) {
            addLogDraft(state, `Twins! Collected 2 eggs!`);
          } else {
            addLogDraft(state, 'Collected a new egg!');
          }
          if (clutchSize > roomAvailable) {
            addLogDraft(state, `Only ${roomAvailable} of ${clutchSize} eggs fit — tank is almost full!`);
          }

          addXp(state, XP_REWARDS.breedEgg * eggsToCreate, 'breed');

          // Queue hatch reveal for the first egg (gacha-style reveal)
          if (newEggs.length > 0) {
            state._pendingHatchReveal = newEggs[0];
          }

          // Near-miss check — would the offspring have been higher rarity?
          for (const egg of newEggs) {
            if (egg.genome) {
              const ph = computePhenotype(egg.genome);
              const sp = getSpeciesFromPhenotype(ph);
              const nearMiss = checkNearMiss({ species: sp });
              if (nearMiss) {
                addLogDraft(state, `${nearMiss.message} Breed similar parents to push past the threshold!`);
              }
            }
          }

          const updated = updateChallengeProgress(state, 'collect_egg');
          Object.assign(state, updated);
        }),

        // ── Fish naming ──────────────────────────────────────
        renameFish: (fishId, name) => set(state => {
          if (!fishId) return;
          const fish = findFish(state, fishId);
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
            addLogDraft(state, `${h.customerName} left without buying.`);
            return;
          }

          // Bug 3 fix: clamp counter to buyer's budget
          let price;
          if (action === 'counter') {
            const requested = Math.round(Number(counterPrice) || 0);
            if (requested <= 0) return;
            if (requested > (h.maxBudget || h.offer * 2)) {
              addLogDraft(state, `${h.customerName} refused your counteroffer.`);
              return;
            }
            price = requested;
          } else {
            price = h.offer;
          }

          // Bug 2 fix: capture fish BEFORE deletion
          const fish = findFish(state, h.fishId);
          if (!fish) {
            addLogDraft(state, `Fish no longer available.`);
            return;
          }
          const soldRarity = fish.species?.rarity;
          const fishName = fish.nickname || fish.species?.name || h.fishName || 'Unknown';

          // Complete the sale
          state.player.coins += price;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + price;
          state.fish = state.fish.filter(f => f.id !== h.fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter(id => id !== h.fishId);
          if (state.shop.fishPrices) delete state.shop.fishPrices[h.fishId];
          removeFishFromBreedSlots(state, h.fishId);
          state.player.stats.fishSold = (state.player.stats.fishSold || 0) + 1;
          state.shop.reputation = (state.shop.reputation || 0) + 1;
          if (!state.shop.salesHistory) state.shop.salesHistory = [];
          state.shop.salesHistory.unshift({ fishName, coins: price, customer: h.customerName, at: Date.now(), rarity: soldRarity });
          playCoinScaled(price);
          addLogDraft(state, `${h.customerName}: Sold ${fishName} for ${price}!`);
          addXp(state, soldRarity === 'epic' ? XP_REWARDS.sellEpicFish : soldRarity === 'rare' ? XP_REWARDS.sellRareFish : XP_REWARDS.sellFish, 'sell');
        }),

        // ── Prestige ────────────────────────────────────────
        performPrestige: () => set(state => {
          // imported at top as _canPrestige, _performPrestige
          if (!_canPrestige(state)) return;
          const next = _performPrestige(state);
          Object.assign(state, next);
          addLogDraft(state, `PRESTIGE! You are now Prestige Level ${state.player.prestigeLevel}. All permanent bonuses increased.`);
        }),

        // ── Pause toggle ────────────────────────────────────
        paused: false,
        togglePause: () => set(state => {
          state.paused = !state.paused;
          // Reset lastTickAt on unpause to prevent time-delta spike
          if (!state.paused) state.lastTickAt = Date.now();
        }),
        setGameSpeed: (speed) => set(state => { state.gameSpeed = Math.max(1, Math.min(3, speed)); }),

        // ── Campaign ──────────────────────────────────────
        startCampaignLevel: (levelId) => {
          const level = getLevelById(levelId);
          if (!level) return;
          const completedLevels = get().campaign?.completedLevels || {};
          const fresh = createDefaultState();
          const ls = level.startingState || {};
          // Build starting fish
          const startFish = [];
          const fishCount = ls.starterFishCount || 0;
          const fishStage = ls.starterFishStage || 'adult';
          for (let i = 0; i < fishCount; i++) {
            startFish.push(createFish({ stage: fishStage, tankId: 'tank_0' }));
          }
          // Build tanks
          const tanks = [];
          const tankCount = ls.tankCount || 1;
          const cap = level.constraints?.tankCapacity || 12;
          for (let i = 0; i < tankCount; i++) {
            const t = createDefaultTank(`tank_${i}`, 'display');
            t.capacity = cap;
            tanks.push(t);
          }
          const newState = {
            ...fresh,
            campaign: {
              mode: 'campaign',
              activeLevelId: levelId,
              completedLevels,
              levelCompleted: false,
              levelStartedAt: Date.now(),
            },
            player: {
              ...fresh.player,
              coins: ls.coins ?? 325,
              stats: { ...fresh.player.stats, fishBought: 0, fishListed: 0, breedingsStarted: 0, eggsHatched: 0, wantedFulfilled: 0, fishDied: 0, fishSold: 0, fishFed: 0 },
            },
            tanks,
            fish: ls.fish || startFish,
            maxBays: ls.maxBays ?? 1,
            breedingTank: {
              ...fresh.breedingTank,
              breedingDurationMs: fresh.breedingTank.breedingDurationMs,
            },
            gameClock: Date.now(),
            gameSpeed: 1,
            staff: [],
            lastWageDay: 0,
            giftShop: { unlocked: false, level: 0, totalEarned: 0 },
            cafe: { unlocked: false, level: 0, totalEarned: 0 },
            notifications: [],
            suppliers: { unlocked: ['basic'], activeSupplier: 'basic' },
            unlockedRooms: ['lobby'],
            roomAssignments: {},
          };
          set(state => { Object.assign(state, newState); });
        },

        completeCampaignLevel: () => set(state => {
          const levelId = state.campaign?.activeLevelId;
          if (!levelId) return;
          const level = getLevelById(levelId);
          if (!level) return;
          const stars = getStarRating(level, state);
          const prev = state.campaign.completedLevels?.[levelId];
          const bestStars = Math.max(stars, prev?.stars || 0);
          state.campaign.completedLevels[levelId] = { stars: bestStars, completedAt: Date.now() };
          playVictory();
          // Grant bonus coins (only first time)
          if (!prev?.stars && level.rewards?.bonusCoins) {
            state.player.coins += level.rewards.bonusCoins;
            state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + level.rewards.bonusCoins;
            addLogDraft(state, `Campaign reward: +${level.rewards.bonusCoins} coins!`);
          }
          // Unlock next levels
          if (level.rewards?.unlocks) {
            for (const uid of level.rewards.unlocks) {
              if (!state.campaign.completedLevels[uid]) {
                state.campaign.completedLevels[uid] = { stars: 0, unlocked: true };
              }
            }
          }
          state.campaign.activeLevelId = null;
          state.campaign.levelCompleted = false;
          state._pendingVictory = null;
        }),

        abandonCampaignLevel: () => set(state => {
          state.campaign.activeLevelId = null;
          state.campaign.levelCompleted = false;
        }),

        // ── Staff Management ────────────────────────────────
        hireStaff: (role) => set(state => {
          const cost = getHireCost(role);
          const maxStaff = getMaxStaff(state.player?.level || 1);
          if ((state.staff || []).length >= maxStaff) {
            fireToast(`Staff limit reached (${maxStaff}). Level up to hire more.`, 'alert', '');
            return;
          }
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins to hire!');
            return;
          }
          state.player.coins -= cost;
          const member = createStaffMember(role);
          if (!state.staff) state.staff = [];
          state.staff.push(member);
          playHire();
          addLogDraft(state, `Hired ${member.name} as ${STAFF_ROLES[role]?.label || role}.`);
        }),

        fireStaff: (staffId) => set(state => {
          const idx = (state.staff || []).findIndex(s => s.id === staffId);
          if (idx < 0) return;
          const member = state.staff[idx];
          addLogDraft(state, `${member.name} has been let go.`);
          state.staff.splice(idx, 1);
        }),

        assignStaff: (staffId, tankId) => set(state => {
          const member = (state.staff || []).find(s => s.id === staffId);
          if (!member) return;
          member.assignedTankId = tankId;
        }),

        trainStaff: (staffId) => set(state => {
          const member = (state.staff || []).find(s => s.id === staffId);
          if (!member) return;
          const roleDef = STAFF_ROLES[member.role];
          if (!roleDef || member.level >= roleDef.maxLevel) {
            fireToast('Already at max level.', 'alert', '');
            return;
          }
          const cost = getTrainCost(member);
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins to train!');
            return;
          }
          state.player.coins -= cost;
          member.level += 1;
          playCoin();
          addLogDraft(state, `${member.name} trained to level ${member.level + 1}!`);
        }),

        // ── Research ────────────────────────────────────────
        purchaseResearch: (branchId) => set(state => {
          const branch = RESEARCH_BRANCHES[branchId];
          if (!branch) return;
          if (!state.player.research) state.player.research = {};
          const level = state.player.research[branchId] || 0;
          if (level >= branch.tiers.length) {
            fireToast('Branch fully researched!', 'alert', '');
            return;
          }
          const tier = branch.tiers[level];
          if (state.player.coins < tier.cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins for research!');
            return;
          }
          state.player.coins -= tier.cost;
          state.player.research[branchId] = level + 1;
          playResearch();
          addLogDraft(state, `Researched: ${tier.label} — ${tier.desc}`);
          fireToast(`${tier.label}: ${tier.desc}`, 'success', '');

          // Apply breedSpeed research immediately to breeding duration
          const fx = getResearchEffects(state);
          if (fx.breedSpeed && fx.breedSpeed !== 1) {
            const baseDuration = 300000;
            const breedLvl = state.shop?.upgrades?.breeding?.level || 0;
            const newDuration = Math.round(baseDuration * Math.pow(0.7, breedLvl) * fx.breedSpeed);
            state.breedingTank.breedingDurationMs = newDuration;
            if (state.extraBays) {
              state.extraBays.forEach(bay => { bay.breedingDurationMs = newDuration; });
            }
          }
        }),

        // ── Tank Size Upgrade ───────────────────────────────
        upgradeTankSize: (tankId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          const next = getNextTankSize(tank);
          if (!next) {
            fireToast('Tank is already at maximum size.', 'alert', '');
            return;
          }
          if (next.minLevel && (state.player?.level || 1) < next.minLevel) {
            fireToast(`Requires player level ${next.minLevel}.`, 'alert', '');
            return;
          }
          if (state.player.coins < next.cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins to upgrade tank!');
            return;
          }
          state.player.coins -= next.cost;
          tank.size = next.id;
          const globalBonus = (state.shop?.upgrades?.capacity?.level || 0) * 4;
          tank.capacity = next.capacity + globalBonus;
          playCoin();
          addLogDraft(state, `${tank.name} upgraded to ${next.label} (${tank.capacity} fish)!`);
        }),

        // ── Equipment ───────────────────────────────────────
        buyEquipment: (tankId, typeId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          const eqType = EQUIPMENT_TYPES[typeId];
          if (!eqType) return;
          if (!tank.equipment) tank.equipment = [];
          const count = tank.equipment.filter(e => e.typeId === typeId).length;
          if (count >= eqType.maxPerTank) {
            fireToast(`Max ${eqType.maxPerTank} ${eqType.label}(s) per tank.`, 'alert', '');
            return;
          }
          if (state.player.coins < eqType.cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          state.player.coins -= eqType.cost;
          tank.equipment.push(createEquipment(typeId));
          playEquipInstall();
          addLogDraft(state, `Installed ${eqType.label} in ${tank.name}.`);
        }),

        repairEquipment: (tankId, equipmentId) => set(state => {
          const tank = state.tanks.find(t => t.id === tankId);
          if (!tank) return;
          const eq = (tank.equipment || []).find(e => e.id === equipmentId);
          if (!eq || !eq.broken) return;
          const eqType = EQUIPMENT_TYPES[eq.typeId];
          if (!eqType) return;
          if (state.player.coins < eqType.repairCost) {
            playWarning();
            addLogDraft(state, 'Not enough coins to repair!');
            return;
          }
          state.player.coins -= eqType.repairCost;
          eq.broken = false;
          playRepair();
          addLogDraft(state, `Repaired ${eqType.label} in ${tank.name}.`);
        }),

        // ── Amenities: Gift Shop + Café ─────────────────────
        unlockAmenity: (amenityId) => set(state => {
          const amenity = state[amenityId];
          if (!amenity) return;
          if (amenity.unlocked) {
            fireToast('Already unlocked!', 'alert', '');
            return;
          }
          const costs = { giftShop: 500, cafe: 750 };
          const cost = costs[amenityId] || 500;
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          state.player.coins -= cost;
          amenity.unlocked = true;
          playCoin();
          const names = { giftShop: 'Gift Shop', cafe: 'Café' };
          addLogDraft(state, `${names[amenityId] || amenityId} unlocked!`);
          fireToast(`${names[amenityId]} is now open for business!`, 'success', '');
        }),

        upgradeAmenity: (amenityId) => set(state => {
          const amenity = state[amenityId];
          if (!amenity || !amenity.unlocked) return;
          if (amenity.level >= 4) {
            fireToast('Already at max level!', 'alert', '');
            return;
          }
          const upgCosts = [0, 400, 1000, 2500, 6000];
          const cost = upgCosts[amenity.level + 1] || 9999;
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins to upgrade!');
            return;
          }
          state.player.coins -= cost;
          amenity.level += 1;
          playCoin();
          const names = { giftShop: 'Gift Shop', cafe: 'Café' };
          addLogDraft(state, `${names[amenityId]} upgraded to level ${amenity.level + 1}!`);
        }),

        // ── Rooms ────────────────────────────────────────────
        unlockRoom: (roomId) => set(state => {
          const room = ROOMS.find(r => r.id === roomId);
          if (!room) return;
          if ((state.unlockedRooms || []).includes(roomId)) {
            fireToast('Room already unlocked!', 'alert', '');
            return;
          }
          if (room.minRep && (state.shop?.reputation || 0) < room.minRep) {
            fireToast(`Requires ${room.minRep} reputation.`, 'alert', '');
            return;
          }
          if (room.minPrestige && (state.player?.prestigeLevel || 0) < room.minPrestige) {
            fireToast(`Requires Prestige ${room.minPrestige}.`, 'alert', '');
            return;
          }
          if (state.player.coins < room.cost) {
            playWarning();
            addLogDraft(state, 'Not enough coins!');
            return;
          }
          state.player.coins -= room.cost;
          if (!state.unlockedRooms) state.unlockedRooms = ['lobby'];
          state.unlockedRooms.push(roomId);
          playCoin();
          addLogDraft(state, `Unlocked ${room.label}!`);
          fireToast(`${room.label} is now open!`, 'success', '');
        }),

        assignTankToRoom: (tankId, roomId) => set(state => {
          if (!state.roomAssignments) state.roomAssignments = {};
          const room = ROOMS.find(r => r.id === roomId);
          if (!room) return;
          if (!(state.unlockedRooms || []).includes(roomId)) return;
          // Check room capacity
          const tanksInRoom = (state.tanks || []).filter(t => (state.roomAssignments[t.id] || 'lobby') === roomId).length;
          if (state.roomAssignments[tankId] !== roomId && tanksInRoom >= room.maxTanks) {
            fireToast(`${room.label} is full (${room.maxTanks} tanks max).`, 'alert', '');
            return;
          }
          state.roomAssignments[tankId] = roomId;
          addLogDraft(state, `Moved tank to ${room.label}.`);
        }),

        // ── Notifications ───────────────────────────────────
        pushNotification: (message, type = 'info') => set(state => {
          if (!state.notifications) state.notifications = [];
          state.notifications.unshift({ id: Date.now() + Math.random(), message, type, at: Date.now() });
          if (state.notifications.length > 20) state.notifications.length = 20;
        }),

        dismissNotification: (notifId) => set(state => {
          state.notifications = (state.notifications || []).filter(n => n.id !== notifId);
        }),

        // ── Suppliers ───────────────────────────────────────
        switchSupplier: (supplierId) => set(state => {
          const unlocked = state.suppliers?.unlocked || ['basic'];
          if (!unlocked.includes(supplierId)) {
            fireToast('Supplier not unlocked yet.', 'alert', '');
            return;
          }
          state.suppliers.activeSupplier = supplierId;
          addLogDraft(state, `Switched supplier to ${supplierId}.`);
        }),

        // ── Special Orders ──────────────────────────────────
        fulfillOrder: (orderId, fishId) => set(state => {
          if (!fishId || !orderId) return;
          const order = (state.specialOrders || []).find(o => o.id === orderId);
          if (!order || order.fulfilled) return;
          const fish = findFish(state, fishId);
          if (!fish) return;
          if (!checkOrderFulfillment(fish, order)) {
            playWarning();
            addLogDraft(state, 'That fish does not satisfy the special order.');
            return;
          }
          order.fulfilled = true;
          state.player.coins += order.reward;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + order.reward;
          state.fish = state.fish.filter(f => f.id !== fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter(id => id !== fishId);
          if (state.shop.fishPrices) delete state.shop.fishPrices[fishId];
          removeFishFromBreedSlots(state, fishId);
          addXp(state, order.xpReward || 25, 'order');
          playCoinScaled(order.reward);
          addLogDraft(state, `Order fulfilled for ${order.customer}! +${order.reward}`);
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
          addLogDraft(state, `Researched: ${next.label}! ${next.desc}`);
        }),

        // ── Loans ───────────────────────────────────────────
        takeLoan: (tierId) => set(state => {
          if (state.player?.activeLoan?.active) { playWarning(); return; }
          const tier = LOAN_TIERS.find(t => t.id === tierId);
          if (!tier) return;
          state.player.coins += tier.amount;
          state.player.activeLoan = { active: true, tierId: tier.id, amount: tier.amount, interest: tier.interest, repayBy: tier.repayBy, takenAt: (state.gameClock || Date.now()) };
          playCoin();
          addLogDraft(state, `Loan: +${tier.amount} at ${tier.interest*100}% interest.`);
        }),

        repayLoan: () => set(state => {
          const loan = state.player?.activeLoan;
          if (!loan?.active) return;
          const owed = Math.round(loan.amount * (1 + loan.interest));
          if (state.player.coins < owed) { playWarning(); return; }
          state.player.coins -= owed;
          state.player.activeLoan = { active: false };
          playCoin();
          addLogDraft(state, `Loan repaid! ${owed}`);
        }),

        // ── Daily Rewards ───────────────────────────────────
        claimDailyReward: () => set(state => {
          const today = new Date().toDateString();
          if (state.player.lastDailyClaimDate === today) return;
          const last = state.player.lastDailyClaimDate;
          const wasYesterday = last && (new Date(today) - new Date(last)) / 86400000 <= 1;
          const oldStreak = state.player.dailyStreak || 0;
          const streak = wasYesterday ? oldStreak + 1 : 1;

          // Streak broken penalty
          if (!wasYesterday && oldStreak >= 3) {
            const lostMult = getStreakMultiplier(oldStreak);
            addLogDraft(state, `${oldStreak}-day streak broken! Lost ${getStreakLabel(oldStreak)} (${Math.round((lostMult-1)*100)}% bonus). Starting over...`);
          }

          state.player.dailyStreak = streak;
          state.player.lastDailyClaimDate = today;
          const reward = 25 + streak * 10;
          state.player.coins += reward;
          addXp(state, 10, 'daily');
          playCoinScaled(reward);

          const mult = getStreakMultiplier(streak);
          const label = getStreakLabel(streak);
          const multMsg = mult > 1 ? ` ${label} — ${Math.round((mult-1)*100)}% coin bonus active!` : '';
          addLogDraft(state, `Day ${streak} reward: +${reward}!${multMsg}`);
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
          addLogDraft(state, `Unlocked: ${bg.label}!`);
        }),

        setTankBackground: (tankId, bgId) => set(state => {
          const tank = findTank(state, tankId);
          if (tank) tank.backgroundId = bgId;
        }),

        claimMilestone: (milestoneId) => set(state => {
          
          if (!state.player.completedMilestones) state.player.completedMilestones = [];
          if (state.player.completedMilestones.includes(milestoneId)) return;
          const m = MILESTONES.find(ms => ms.id === milestoneId);
          if (!m || !m.check(state)) return;
          state.player.completedMilestones.push(milestoneId);
          if (m.reward?.coins) {
            state.player.coins += m.reward.coins;
            state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + m.reward.coins;
          }
          addXp(state, 30, 'milestone');
          playCoinScaled(m.reward?.coins || 50);
          addLogDraft(state, `Milestone: ${m.title}! ${m.reward?.coins ? '+' + m.reward.coins : ''}`);
          // Trigger full-screen celebration
          state._pendingCelebration = {
            title: m.title,
            desc: m.desc || '',
            emoji: m.emoji || '',
            reward: m.reward?.coins ? `${m.reward.coins} coins` : null,
          };
        }),

        // ── Wanted Board ──────────────────────────────────
        fulfillWanted: (posterId, fishId) => set(state => {
          const poster = (state.wantedPosters || []).find(p => p.id === posterId);
          if (!poster || poster.fulfilled) return;
          const fish = findFish(state, fishId);
          if (!fish || !fishMatchesPoster(fish, poster)) return;
          poster.fulfilled = true;
          state.player.stats.wantedFulfilled = (state.player.stats.wantedFulfilled || 0) + 1;
          state.player.coins += poster.reward;
          // Remove the fish (delivered to buyer)
          state.fish = state.fish.filter(f => f.id !== fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter(id => id !== fishId);
          removeFishFromBreedSlots(state, fishId);
          playCoinScaled(poster.reward);
          playDiscoverScaled("uncommon");
          addXp(state, 30, 'wanted');
          addLogDraft(state, `Bounty fulfilled! Delivered ${fish.species?.name || 'fish'} to ${poster.buyer} for ${poster.reward}!`);
        }),

        refreshWantedBoard: () => set(state => {
          if (!state.wantedPosters) state.wantedPosters = [];
          const level = Math.floor((state.player.xp || 0) / 500) + 1;
          const active = state.wantedPosters.filter(p => !p.fulfilled && p.expiresAt > (state.gameClock || Date.now()));
          const maxPosters = Math.min(3, 1 + Math.floor(level / 8));
          while (active.length < maxPosters) {
            const poster = generateWantedPoster(level, active, state.gameClock);
            if (poster) { active.push(poster); state.wantedPosters.push(poster); }
            else break;
          }
        }),

        // ── Micro-events ──────────────────────────────────
        claimMicroEvent: (eventId, coins, xp) => set(state => {
          if (!state.player) return;
          state.player.coins += (coins || 0);
          if (xp) addXp(state, xp, 'micro');
          if (coins > 0) playCoin();
          state.lastMicroEventAt = (state.gameClock || Date.now());
        }),

        // ── Fish memorial ─────────────────────────────────
        addMemorial: (fish) => set(state => {
          if (!state.memorials) state.memorials = [];
          const descendants = state.fish.filter(f =>
            f.parentIds?.includes(fish.id)
          ).length;
          const totalEarned = (state.shop.salesHistory || [])
            .filter(s => s.fishName === fish.species?.name)
            .reduce((sum, s) => sum + (s.coins || 0), 0);
          state.memorials.unshift({
            id: fish.id,
            name: fish.nickname || fish.species?.name || 'Unknown',
            species: fish.species?.name,
            rarity: fish.species?.rarity,
            personality: fish.personality,
            generation: fish.generation || 1,
            livedDays: Math.round(((state.gameClock || (state.gameClock || Date.now())) - (fish.bornAt || (state.gameClock || (state.gameClock || Date.now())))) / 86400000 * 10) / 10,
            descendants,
            totalEarned,
            diedAt: (state.gameClock || Date.now()),
          });
          // Keep last 50 memorials
          if (state.memorials.length > 50) state.memorials.length = 50;
        }),

        resetGame: () => set(state => {
          const completedLevels = state.campaign?.completedLevels || {};
          const fresh = createDefaultState();
          Object.assign(state, fresh);
          state.campaign.completedLevels = completedLevels;
        }),

        handleExportSave: () => {
          exportSave(get());
        },

        quickSave: () => {
          const state = get();
          if (saveGame(state)) {
            set({ _saveFlash: Date.now() });
          } else {
            fireToast('Save failed — storage full?', 'alert', '');
          }
        },

        handleImportSave: async (file) => {
          try {
            const imported = await importSave(file);
            set(imported);
            fireToast('Save imported', 'info', '');
          } catch (e) {
            fireToast(e.message, 'alert', '');
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
      fireToast('Save failed — storage full?', 'alert', '');
    }
  }, 30_000);
}

// 2. Save on tab close / hide
function handleUnload() { saveGame(useGameStore.getState()); }
const HIDDEN_TICK_MS = 5000; // 5s tick when tab hidden (saves CPU/battery)
function handleVisibility() {
  if (document.visibilityState === 'hidden') {
    saveGame(useGameStore.getState());
    if (_tickInterval) clearInterval(_tickInterval);
    _tickInterval = setInterval(() => useGameStore.getState().tick(), HIDDEN_TICK_MS);
  } else {
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
        const sale = useGameStore.getState().shop.salesHistory[0];
        playSaleScaled(sale?.coins || 0);
        if (sale) fireToast(`Sold ${sale.fishName} for ${sale.coins}!`, 'info', '');
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
        playDiscoverScaled("uncommon");
        const achs = useGameStore.getState().player.achievements || [];
        for (let i = prevLen; i < len; i++) {
          const ach = achs[i];
          fireToast(ach ? `Achievement: ${ach.id}` : 'Achievement unlocked!', 'achieve', '');
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
        fireToast(`Level Up! You are now Level ${level} — ${getLevelTitle(level)}`, 'achieve', '');
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
          fireToast(`${f.species?.name || 'Fish'} is sick!`, 'alert', '');
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
        fireToast('An egg is ready to collect!', 'info', '');
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
            fireToast(`${autopsy.fishName} has died`, 'alert', '');
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

  // Refresh wanted board on startup
  useGameStore.getState().refreshWantedBoard();

  // Electron: async-hydrate from filesystem save (may be newer than localStorage)
  if (typeof window !== 'undefined' && window.electronAPI?.isElectron) {
    loadGameAsync().then(save => {
      if (!save) return;
      const current = useGameStore.getState();
      // Only hydrate if filesystem save is newer
      if ((save.lastSavedAt || 0) > (current.lastSavedAt || 0)) {
        console.log('[Electron] Hydrating from filesystem save (newer)');
        try {
          const hydrated = applyOfflineProgress(save);
          useGameStore.setState(hydrated);
        } catch (err) {
          console.warn('[Electron] Hydration failed, keeping localStorage state:', err);
        }
      }
    }).catch(err => console.warn('[Electron] Async load failed:', err));
  }
}

// ── Cleanup (for HMR) ──────────────────────────────────────
export function teardownSideEffects() {
  clearInterval(_saveInterval); _saveInterval = null;
  clearInterval(_tickInterval); _tickInterval = null;
  _achUnsub?.();      _achUnsub = null;
  _salesUnsub?.();    _salesUnsub = null;
  _achSoundUnsub?.(); _achSoundUnsub = null;
  _diseaseUnsub?.();  _diseaseUnsub = null;
  _levelUpUnsub?.();  _levelUpUnsub = null;
  _breedUnsub?.();    _breedUnsub = null;
  _deathUnsub?.();    _deathUnsub = null;
  _eventUnsub?.();    _eventUnsub = null;
  window.removeEventListener('beforeunload', handleUnload);
  document.removeEventListener('visibilitychange', handleVisibility);
}
