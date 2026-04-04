// ============================================================
// FISH TYCOON 2 — GAME STATE & SAVE SYSTEM v7 (multi-tank)
// ============================================================

import { createFish } from './genetics.js';
import { getDefaultDecorations } from './decorations.js';

const SAVE_KEY     = 'fishtycoon2_save';
const SAVE_VERSION = 7;

// ── Tank types / purposes ──────────────────────────────────
export const TANK_TYPES = {
  display:  { label: 'Display Tank',  emoji: '🐠', desc: 'Show off your best fish. Happy fish sell for more.' },
  breeding: { label: 'Breeding Tank', emoji: '🧬', desc: 'Dedicated breeding environment. +20% egg success.' },
  grow:     { label: 'Grow-out Tank', emoji: '🐣', desc: 'Juveniles grow up 25% faster here.' },
};

// ── Tank unlock costs ──────────────────────────────────────
export const TANK_UNLOCK = [
  null,
  { cost: 500,  label: 'Unlock 2nd Tank', desc: 'A dedicated breeding or grow-out tank.' },
  { cost: 2000, label: 'Unlock 3rd Tank', desc: 'Triple your capacity and specialisation.' },
];

// ── Achievement definitions ────────────────────────────────
export const ACHIEVEMENT_DEFS = [
  { id: 'first_fish',      label: 'Aquarist',         desc: 'Discover your first species',         emoji: '🐟', secret: false },
  { id: 'species_5',       label: 'Explorer',          desc: 'Discover 5 different species',        emoji: '🔍', secret: false },
  { id: 'species_10',      label: 'Geneticist',        desc: 'Discover 10 different species',       emoji: '🧬', secret: false },
  { id: 'species_25',      label: 'Taxonomist',        desc: 'Discover 25 different species',       emoji: '📖', secret: false },
  { id: 'first_sale',      label: 'Merchant',          desc: 'Make your first sale',                emoji: '🏪', secret: false },
  { id: 'coins_500',       label: 'Entrepreneur',      desc: 'Earn 500 total coins from sales',     emoji: '🪙', secret: false },
  { id: 'coins_5000',      label: 'Tycoon',            desc: 'Earn 5,000 total coins from sales',   emoji: '💰', secret: false },
  { id: 'coins_50000',     label: 'Mogul',             desc: 'Earn 50,000 total coins from sales',  emoji: '🤑', secret: true  },
  { id: 'rare_discovery',  label: 'Rare Find',         desc: 'Discover a rare species',             emoji: '💎', secret: false },
  { id: 'epic_discovery',  label: 'Legendary Catch',   desc: 'Discover an epic species',            emoji: '✨', secret: true  },
  { id: 'full_tank',       label: 'Full House',        desc: 'Fill any tank to capacity',           emoji: '🐠', secret: false },
  { id: 'bred_5',          label: 'Matchmaker',        desc: 'Breed 5 batches of eggs',             emoji: '💕', secret: false },
  { id: 'bred_20',         label: 'Speed Breeder',     desc: 'Breed 20 batches of eggs',            emoji: '⚡', secret: false },
  { id: 'tank_happy',      label: 'Happy Habitat',     desc: 'Reach 100% tank happiness',           emoji: '😊', secret: false },
  { id: 'upgrade_max',     label: 'Maximalist',        desc: 'Max out any shop upgrade',            emoji: '⬆️', secret: false },
  { id: 'fish_rescued',    label: 'Healer',            desc: 'Use medicine on a sick fish',         emoji: '💊', secret: false },
  { id: 'water_pristine',  label: 'Pure Waters',       desc: 'Treat water back to 100% quality',   emoji: '🧪', secret: false },
  { id: 'survived_night',  label: 'Night Watch',       desc: 'Keep all fish alive overnight',       emoji: '🌙', secret: true  },
  { id: 'two_tanks',       label: 'Expanding Empire',  desc: 'Unlock a second tank',               emoji: '🏗️', secret: false },
  { id: 'three_tanks',     label: 'Aquarium Baron',    desc: 'Unlock all three tanks',             emoji: '👑', secret: true  },
  { id: 'magic_1',         label: 'First Wonder',      desc: 'Discover the first Magic Fish',      emoji: '🔮', secret: false },
  { id: 'magic_3',         label: 'Halfway There',     desc: 'Discover 3 of the 7 Magic Fish',     emoji: '✨', secret: false },
  { id: 'magic_7',         label: 'Legend of the Deep',desc: 'Discover all 7 Magic Fish',          emoji: '🌟', secret: true  },
];

// ── Default tank factory ───────────────────────────────────
export function createDefaultTank(id, type = 'display') {
  return {
    id,
    type,
    name: TANK_TYPES[type].label,
    capacity: 12,
    waterQuality: 100,
    temperature: 74,
    happiness: 100,
    autoFeed: false,
    autoFeedTick: 0,
    decorations: getDefaultDecorations(),
    supplies: {
      food: 25,
      medicine: 3,
      waterTreatment: 5,
      heater: 0,
      breedingBoost: 0,
    },
  };
}

export function createDefaultState() {
  const tank0 = createDefaultTank('tank_0', 'display');
  const starterFish = [
    createFish({ stage: 'adult', tankId: 'tank_0' }),
    createFish({ stage: 'adult', tankId: 'tank_0' }),
    createFish({ stage: 'adult', tankId: 'tank_0' }),
  ];

  return {
    version: SAVE_VERSION,
    lastSavedAt: Date.now(),
    lastTickAt: Date.now(),
    offlineSummary: null,

    player: {
      coins: 200,
      totalCoinsEarned: 0,
      shopLevel: 1,
      fishdex: [],
      achievements: [],
      magicFishFound: [],   // array of magic fish IDs found
      stats: { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0 },
      autopsies: [],        // post-mortem records
    },

    tanks: [tank0],
    fish: starterFish,

    shop: {
      level: 1,
      slots: 4,
      listedFish: [],
      fishPrices: {},
      reputation: 0,
      lastCustomerAt: 0,
      salesHistory: [],
      upgrades: {
        slot:       { level: 0, cost: 80,  label: 'Extra Slot',     description: '+1 sale slot' },
        reputation: { level: 0, cost: 120, label: 'Advertising',    description: 'Customers arrive faster' },
        capacity:   { level: 0, cost: 150, label: 'Tank Expansion', description: '+4 fish capacity (active tank)' },
        breeding:   { level: 0, cost: 200, label: 'Speed Breeding', description: '-25% breed time' },
      },
    },

    breedingTank: {
      slots: [null, null],
      eggReady: false,
      breedingStartedAt: null,
      breedingDurationMs: 30_000,
      storedGenomeA: null,
      storedGenomeB: null,
      storedTankId: null,
    },

    log: [
      { time: Date.now(), message: '🐠 Welcome to Fish Tycoon 2! Your aquarium awaits.' },
    ],
  };
}

// ── Migration: v6 → v7 ────────────────────────────────────
function migrateSave(parsed) {
  if (!parsed.tanks) {
    const old = parsed.tank || {};
    const base = createDefaultTank('tank_0', 'display');
    parsed.tanks = [{
      ...base,
      capacity:     old.capacity     ?? base.capacity,
      waterQuality: old.waterQuality ?? base.waterQuality,
      temperature:  old.temperature  ?? base.temperature,
      happiness:    old.happiness    ?? base.happiness,
      autoFeed:     old.autoFeed     ?? base.autoFeed,
      decorations:  Array.isArray(old.decorations) ? getDefaultDecorations() : (old.decorations ?? getDefaultDecorations()),
      supplies: { ...base.supplies, ...(old.supplies || {}) },
    }];
    delete parsed.tank;
  }
  if (parsed.fish) {
    parsed.fish = parsed.fish.map(f => ({ tankId: 'tank_0', ...f }));
  }
  parsed.tanks = parsed.tanks.map(t => ({
    autoFeedTick: 0,
    ...t,
    supplies: { breedingBoost: 0, ...t.supplies },
  }));
  if (!parsed.player.achievements) parsed.player.achievements = [];
  if (!parsed.player.stats) {
    parsed.player.stats = { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0 };
  }
  if (parsed.player.fishdex) {
    parsed.player.fishdex = parsed.player.fishdex.map(e => ({ aiName: null, aiLore: null, ...e }));
  }
  if (parsed.shop?.upgrades && !parsed.shop.upgrades.reputation) {
    parsed.shop.upgrades.reputation = { level: 0, cost: 120, label: 'Advertising', description: 'Customers arrive faster' };
  }
  if (!parsed.player.magicFishFound) parsed.player.magicFishFound = [];
  if (!parsed.player.autopsies) parsed.player.autopsies = [];
  if (!parsed.shop?.fishPrices) {
    parsed.shop = { ...parsed.shop, fishPrices: {} };
  }
  // Ensure breedingTank has storedGenome fields (added in phase 11 bugfix)
  if (parsed.breedingTank && parsed.breedingTank.storedGenomeA === undefined) {
    parsed.breedingTank = {
      storedGenomeA: null,
      storedGenomeB: null,
      storedTankId: null,
      ...parsed.breedingTank,
    };
  }
  parsed.version = SAVE_VERSION;
  return parsed;
}

export function saveGame(state) {
  try {
    // Strip transient _fishId fields from autopsies before saving
    const cleanState = {
      ...state,
      player: {
        ...state.player,
        autopsies: (state.player.autopsies || []).map(({ _fishId, ...rest }) => rest),
      },
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify({ ...cleanState, lastSavedAt: Date.now() }));
    return true;
  } catch (e) { console.error('Save failed:', e); return false; }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== SAVE_VERSION) {
      console.warn(`Migrating save from v${parsed.version} → v${SAVE_VERSION}`);
      return migrateSave(parsed);
    }
    return parsed;
  } catch (e) { console.error('Load failed:', e); return null; }
}

export function deleteSave() { localStorage.removeItem(SAVE_KEY); }

export function addLog(state, message) {
  return { ...state, log: [{ time: Date.now(), message }, ...state.log].slice(0, 60) };
}

// ── Achievements ───────────────────────────────────────────
export function checkAchievements(state, messages) {
  const earned = new Set(state.player.achievements.map(a => a.id));
  const newAchievements = [];

  function award(id) {
    if (earned.has(id)) return;
    const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
    if (!def) return;
    newAchievements.push({ id, unlockedAt: Date.now() });
    earned.add(id);
    messages.push(`🏆 Achievement unlocked: ${def.emoji} ${def.label}!`);
  }

  const { player, fish, tanks, shop } = state;
  const fishdex = player.fishdex || [];
  const stats   = player.stats   || {};

  if (fishdex.length >= 1)  award('first_fish');
  if (fishdex.length >= 5)  award('species_5');
  if (fishdex.length >= 10) award('species_10');
  if (fishdex.length >= 25) award('species_25');
  if (fishdex.some(e => e.rarity === 'rare'))  award('rare_discovery');
  if (fishdex.some(e => e.rarity === 'epic'))  award('epic_discovery');

  if ((shop.salesHistory || []).length >= 1) award('first_sale');
  if ((player.totalCoinsEarned || 0) >= 500)   award('coins_500');
  if ((player.totalCoinsEarned || 0) >= 5000)  award('coins_5000');
  if ((player.totalCoinsEarned || 0) >= 50000) award('coins_50000');

  const anyFull = tanks.some(t => fish.filter(f => f.tankId === t.id).length >= t.capacity && t.capacity > 0);
  if (anyFull) award('full_tank');
  if (tanks.some(t => (t.happiness || 0) >= 100)) award('tank_happy');
  if (tanks.length >= 2) award('two_tanks');
  if (tanks.length >= 3) award('three_tanks');

  const magicFound = (player.magicFishFound || []).length;
  if (magicFound >= 1) award('magic_1');
  if (magicFound >= 3) award('magic_3');
  if (magicFound >= 7) award('magic_7');

  if ((stats.eggsCollected || 0) >= 5)  award('bred_5');
  if ((stats.eggsCollected || 0) >= 20) award('bred_20');
  if ((stats.medicineUsed  || 0) >= 1) award('fish_rescued');
  if ((stats.waterTreated  || 0) >= 1) award('water_pristine');

  const upgrades = shop.upgrades || {};
  if (Object.values(upgrades).some(u => u.level >= 3)) award('upgrade_max');

  // survived_night: all fish alive and it is currently between 11pm and 6am
  if (fish.length > 0 && fish.every(f => (f.health || 0) > 0)) {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) award('survived_night');
  }

  if (newAchievements.length === 0) return state;
  return { ...state, player: { ...player, achievements: [...player.achievements, ...newAchievements] } };
}
