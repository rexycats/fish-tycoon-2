// ============================================================
// FISH TYCOON 2 — GAME STATE & SAVE SYSTEM v7 (multi-tank)
// ============================================================

import { createFish } from './genetics.js';
import { getDefaultDecorations, getDefaultThemes } from './decorations.js';

const SAVE_KEY     = 'fishtycoon2_save';
const SAVE_VERSION = 8;

// ── Tank types / purposes ──────────────────────────────────
export const TANK_TYPES = {
  display:  { label: 'Display Tank',  emoji: '🐠', desc: 'Show off your best fish. Happy fish sell for more.' },
  breeding: { label: 'Breeding Tank', emoji: '🧬', desc: 'Dedicated breeding environment. +20% egg success.' },
  grow:     { label: 'Grow-out Tank', emoji: '🐣', desc: 'Juveniles grow up 25% faster here.' },
};

// ── Tank unlock costs ──────────────────────────────────────
export const TANK_UNLOCK = [
  null,
  { cost: 500,   label: 'Unlock 2nd Tank', desc: 'A dedicated breeding or grow-out tank.' },
  { cost: 2000,  label: 'Unlock 3rd Tank', desc: 'Triple your capacity and specialisation.' },
  { cost: 5000,  label: 'Unlock 4th Tank', desc: 'A premium habitat for your rarest specimens.', minPrestige: 1 },
  { cost: 12000, label: 'Unlock 5th Tank', desc: 'Industrial-scale aquarium expansion.', minPrestige: 2 },
  { cost: 25000, label: 'Unlock 6th Tank', desc: 'The ultimate aquarium baron setup.', minPrestige: 3 },
];

// ── Achievement definitions ────────────────────────────────
export const ACHIEVEMENT_DEFS = [
  { id: 'first_fish',      label: 'Aquarist',         desc: 'Discover your first species',         emoji: '🐟', secret: false, tier: 'common' },
  { id: 'species_5',       label: 'Explorer',          desc: 'Discover 5 different species',        emoji: '🔍', secret: false, tier: 'common' },
  { id: 'species_10',      label: 'Geneticist',        desc: 'Discover 10 different species',       emoji: '🧬', secret: false, tier: 'rare'   },
  { id: 'species_25',      label: 'Taxonomist',        desc: 'Discover 25 different species',       emoji: '📖', secret: false, tier: 'rare'   },
  { id: 'first_sale',      label: 'Merchant',          desc: 'Make your first sale',                emoji: '🏪', secret: false, tier: 'common' },
  { id: 'coins_500',       label: 'Entrepreneur',      desc: 'Earn 500 total coins from sales',     emoji: '🪙', secret: false, tier: 'common' },
  { id: 'coins_5000',      label: 'Tycoon',            desc: 'Earn 5,000 total coins from sales',   emoji: '💰', secret: false, tier: 'rare'   },
  { id: 'coins_50000',     label: 'Mogul',             desc: 'Earn 50,000 total coins from sales',  emoji: '🤑', secret: true,  tier: 'secret' },
  { id: 'rare_discovery',  label: 'Rare Find',         desc: 'Discover a rare species',             emoji: '💎', secret: false, tier: 'common' },
  { id: 'epic_discovery',  label: 'Legendary Catch',   desc: 'Discover an epic species',            emoji: '✨', secret: true,  tier: 'secret' },
  { id: 'full_tank',       label: 'Full House',        desc: 'Fill any tank to capacity',           emoji: '🐠', secret: false, tier: 'common' },
  { id: 'bred_5',          label: 'Matchmaker',        desc: 'Breed 5 batches of eggs',             emoji: '💕', secret: false, tier: 'common' },
  { id: 'bred_20',         label: 'Speed Breeder',     desc: 'Breed 20 batches of eggs',            emoji: '⚡', secret: false, tier: 'rare'   },
  { id: 'tank_happy',      label: 'Happy Habitat',     desc: 'Reach 100% tank happiness',           emoji: '😊', secret: false, tier: 'common' },
  { id: 'upgrade_max',     label: 'Maximalist',        desc: 'Max out any shop upgrade',            emoji: '⬆️', secret: false, tier: 'rare'   },
  { id: 'fish_rescued',    label: 'Healer',            desc: 'Use medicine on a sick fish',         emoji: '💊', secret: false, tier: 'common' },
  { id: 'water_pristine',  label: 'Pure Waters',       desc: 'Treat water back to 100% quality',   emoji: '🧪', secret: false, tier: 'common' },
  { id: 'survived_night',  label: 'Night Watch',       desc: 'Keep all fish alive overnight',       emoji: '🌙', secret: true,  tier: 'secret' },
  { id: 'two_tanks',       label: 'Expanding Empire',  desc: 'Unlock a second tank',               emoji: '🏗️', secret: false, tier: 'common' },
  { id: 'three_tanks',     label: 'Aquarium Baron',    desc: 'Unlock all three tanks',             emoji: '👑', secret: true,  tier: 'secret' },
  { id: 'magic_1',         label: 'First Wonder',      desc: 'Discover the first Magic Fish',      emoji: '🔮', secret: false, tier: 'rare'   },
  { id: 'magic_3',         label: 'Halfway There',     desc: 'Discover 3 of the 7 Magic Fish',     emoji: '✨', secret: false, tier: 'rare'   },
  { id: 'magic_7',         label: 'Legend of the Deep',desc: 'Discover all 7 Magic Fish',          emoji: '🌟', secret: true,  tier: 'secret' },
];

// ── Default tank factory ───────────────────────────────────
export function createDefaultTank(id, type = 'display') {
  const tankTypeDef = TANK_TYPES[type] || TANK_TYPES.display;
  return {
    id,
    type,
    name: tankTypeDef.label,
    capacity: 12,
    waterQuality: 100,
    temperature: 74,
    happiness: 100,
    autoFeed: false,
    autoFeedTick: 0,
    decorations: getDefaultDecorations(),
    themes: getDefaultThemes(),
    supplies: {
      food: 40,
      medicine: 0,           // legacy key — kept at 0 so old saves don't break
      antibiotic: 3,
      antiparasitic: 2,
      digestiveRemedy: 2,
      waterTreatment: 8,
      heater: 0,
      breedingBoost: 0,
    },
  };
}

export function createDefaultState() {
  const tank0 = createDefaultTank('tank_0', 'display');
  const starterFish = [
    createFish({ stage: 'juvenile', tankId: 'tank_0' }),
    createFish({ stage: 'juvenile', tankId: 'tank_0' }),
    createFish({ stage: 'juvenile', tankId: 'tank_0' }),
  ];

  return {
    version: SAVE_VERSION,
    lastSavedAt: Date.now(),
    lastTickAt: Date.now(),
    offlineSummary: null,

    player: {
      coins: 325,
      totalCoinsEarned: 0,
      xp: 0,
      research: { marine_biology: 0, genetics: 0, business: 0 },
      activeLoan: { active: false },
      dailyStreak: 0,
      lastDailyClaimDate: null,
      unlockedBackgrounds: ['tropical'],
      completedMilestones: [],
      completedMilestones: [],
      tutorialStep: 0,
      tutorialDone: false,
      completedMilestones: [],
      shopLevel: 1,
      fishdex: [],
      achievements: [],
      magicFishFound: [],   // array of magic fish IDs found
      stats: { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0 },
      autopsies: [],        // post-mortem records
      boosts: {},           // active booster flags, e.g. { rarityBoost: 1, luckyCharm: 1 }
      unlockedDecorations: [], // decoration IDs granted by achievements (not purchasable)
      legendFishUnlocked: false, // true after earning Legend of the Deep (magic_7)
      nightWatchEarned: false,  // fast flag — avoids scanning achievements[] every tick
      // UI badge watermarks — how many entries the player had last time they
      // visited each tab. Stored in save so import/export keeps them consistent.
      seenFishdexCount:  0,
      seenShopFishCount: 0,
      seenAchCount:      0,
      challengeStreak:   0,  // consecutive days all 3 challenges completed
      firstPlayedAt: Date.now(),  // when the game was first started
      tutorialFlags: {},          // { firstCustomer, giftEgg, breedHint, ... }
    },

    rareMarket: {
      lastRefreshDay: 0,    // UTC day number of last seen rotation
      purchased: [],        // [{ day, itemId }]
    },

    // ── Daily market price fluctuation ─────────────────────
    market: {
      day: 0,
      modifiers: {},
      hotTrait: null,
      headline: '',
    },

    // ── Wanted Board (breeding goals) ─────────────────────
    wantedPosters: [],

    // ── Fish memorials (death records) ────────────────────
    memorials: [],

    // ── Micro-event state ─────────────────────────────────
    lastMicroEventAt: 0,

    dailyChallenges: {
      day: 0,               // UTC day number when challenges were generated
      challenges: [],       // [{ id, desc, emoji, goal, progress, reward, completed }]
    },

    tanks: [tank0],
    fish: starterFish,
    passiveTick: 0,

    shop: {
      level: 1,
      slots: 4,
      listedFish: [],
      fishPrices: {},
      reputation: 0,
      lastCustomerAt: 0,
      salesHistory: [],
      upgrades: {
        slot:       { level: 0, maxLevel: 7, cost: 80,   label: 'Extra Slot',              description: '+1 sale slot per level (up to +7)' },
        reputation: { level: 0, maxLevel: 7, cost: 120,  label: 'Advertising',             description: 'Customers arrive faster (up to −75% interval)' },
        capacity:   { level: 0, maxLevel: 7, cost: 150,  label: 'Tank Expansion',          description: '+4 fish capacity per level (up to +28)' },
        breeding:   { level: 0, maxLevel: 7, cost: 200,  label: 'Speed Breeding',          description: '−20% breed time per level (up to −80%)' },
        lighting:   { level: 0, maxLevel: 3, cost: 350,  label: 'Premium Display Lighting',description: '+10% sale price per level' },
        vip:        { level: 0, maxLevel: 3, cost: 500,  label: 'VIP Membership',          description: 'Wealthy Patrons visit sooner & more often' },
        hatchery:   { level: 0, maxLevel: 3, cost: 450,  label: 'Hatchery',                description: '-15% egg & juvenile grow time per level' },
        tankSitter: { level: 0, maxLevel: 3, cost: 600,  label: 'Tank Sitter',             description: '+24h offline progress cap per level (base: 48h)' },
        purifier:   { level: 0, maxLevel: 3, cost: 300,  label: 'Water Purifier',           description: '-25% water decay rate per level' },
        autoMedic:  { level: 0, maxLevel: 3, cost: 400,  label: 'Auto-Medic',               description: '10% chance/min to auto-cure sick fish per level' },
        mutagen:    { level: 0, maxLevel: 3, cost: 500,  label: 'Mutation Catalyst',         description: '+3% mutation chance when breeding per level' },
        insurance:  { level: 0, maxLevel: 3, cost: 350,  label: 'Aquarium Insurance',        description: 'Refund 20% of fish value on death per level' },
        fame:       { level: 0, maxLevel: 5, cost: 250,  label: 'Aquarium Fame',             description: '+15% passive income per level' },
        tempControl:{ level: 0, maxLevel: 3, cost: 300,  label: 'Climate Control',           description: '-30% temperature drift per level' },
        luckyCharm: { level: 0, maxLevel: 3, cost: 550,  label: 'Lucky Charm',               description: '+5% chance of higher rarity from breeding per level' },
        bulkBuyer:  { level: 0, maxLevel: 5, cost: 200,  label: 'Bulk Buyer',                description: '-10% supply costs per level' },
        whisperer:  { level: 0, maxLevel: 3, cost: 350,  label: 'Fish Whisperer',             description: '+10% base happiness per level' },
        genetics:   { level: 0, maxLevel: 3, cost: 400,  label: 'Genetics Lab',               description: 'More breeding prediction detail per level' },
        service:    { level: 0, maxLevel: 5, cost: 280,  label: 'Customer Service',            description: '+15% customer tip bonus per level' },
        deepSea:    { level: 0, maxLevel: 3, cost: 800,  label: 'Deep Sea Permit',             description: '+6 tank capacity per level (all tanks)' },
        breedBay:   { level: 0, maxLevel: 2, cost: 1200, label: 'Extra Breeding Bay',           description: 'Unlock an additional breeding bay (up to 3 total)' },
      },
    },

    breedingTank: {
      slots: [null, null],
      eggReady: false,
      breedingStartedAt: null,
      breedingDurationMs: 300_000,
      storedGenomeA: null,
      storedGenomeB: null,
      storedGenomeC: null,
      storedTankId: null,
    },

    // Extra breeding bays (bay 0 = breedingTank above, these are bays 1+)
    extraBays: [],
    maxBays: 1,

    // ── New systems ──────────────────────────────────────
    specialOrders: [],        // 3 daily rotating orders
    lastOrderSeed: 0,
    reviews: [],              // aquarium reviews history
    lastReviewAt: 0,
    discoveries: [],          // unique phenotype discovery keys
    weather: null,            // current weather state
    lastWeatherSeed: 0,
    urgentOffer: null,        // limited-time loss aversion offer

    log: [
      { time: Date.now(), message: '🐠 Welcome to Fish Tycoon 2! Your aquarium awaits.' },
      { time: Date.now() - 1, message: '🎁 Starter bundle: 325 coins, food, water treatment, antibiotic, antiparasitic & digestive remedy included.' },
    ],
  };
}

// ── Migration ──────────────────────────────────────────────
// Each block is gated on fromVersion < N so:
//   a) blocks are self-documenting about when they were introduced
//   b) future developers adding a new field must bump SAVE_VERSION and add
//      a new gated block — forgetting either will be immediately obvious
//   c) migrateSave is a pure transformation: it receives the original version
//      rather than reading back from the object it's mutating
function migrateSave(parsed, fromVersion) {
  // v6 → v7: multi-tank restructure
  if (fromVersion < 7) {
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
  }

  // Always ensure tanks array is normalized (safe to re-apply)
  parsed.tanks = (parsed.tanks || []).map(t => ({
    autoFeedTick: 0,
    ...t,
    decorations: t.decorations ?? getDefaultDecorations(),
    themes: t.themes ?? getDefaultThemes(),
    supplies: { breedingBoost: 0, ...t.supplies },
  }));

  if (!parsed.player.achievements) parsed.player.achievements = [];
  if (!parsed.player.unlockedDecorations) parsed.player.unlockedDecorations = [];
  if (parsed.player.legendFishUnlocked === undefined) parsed.player.legendFishUnlocked = false;
  if (!parsed.player.stats) {
    parsed.player.stats = { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0 };
  }
  if (parsed.player.fishdex) {
    parsed.player.fishdex = parsed.player.fishdex.map(e => ({ aiName: null, aiLore: null, ...e }));
  }
  if (parsed.shop?.upgrades && !parsed.shop.upgrades.reputation) {
    parsed.shop.upgrades.reputation = { level: 0, cost: 120, label: 'Advertising', description: 'Customers arrive faster' };
  }
  // Migrate maxLevel and new upgrade categories into old saves
  if (parsed.shop?.upgrades) {
    const u = parsed.shop.upgrades;
    if (!u.slot.maxLevel || u.slot.maxLevel < 7)       u.slot       = { ...u.slot,       maxLevel: 7, description: '+1 sale slot per level (up to +7)' };
    if (!u.reputation?.maxLevel || u.reputation.maxLevel < 7) u.reputation = { ...(u.reputation||{}), maxLevel: 7, description: 'Customers arrive faster (up to −75% interval)' };
    if (!u.capacity?.maxLevel || u.capacity.maxLevel < 7)  u.capacity   = { ...(u.capacity||{}),   maxLevel: 7, description: '+4 fish capacity per level (up to +28)' };
    if (!u.breeding?.maxLevel || u.breeding.maxLevel < 7)  u.breeding   = { ...(u.breeding||{}),   maxLevel: 7, description: '−20% breed time per level (up to −80%)' };
    if (!u.lighting)    u.lighting    = { level: 0, maxLevel: 3, cost: 350,  label: 'Premium Display Lighting', description: '+10% sale price per level' };
    if (!u.vip)         u.vip         = { level: 0, maxLevel: 3, cost: 500,  label: 'VIP Membership',           description: 'Wealthy Patrons visit sooner & more often' };
    if (!u.hatchery)    u.hatchery    = { level: 0, maxLevel: 3, cost: 450,  label: 'Hatchery',                 description: '-15% egg & juvenile grow time per level' };
    if (!u.tankSitter)  u.tankSitter  = { level: 0, maxLevel: 3, cost: 600,  label: 'Tank Sitter',              description: '+24h offline progress cap per level (base: 48h)' };
    if (!u.purifier)    u.purifier    = { level: 0, maxLevel: 3, cost: 300,  label: 'Water Purifier',            description: '-25% water decay rate per level' };
    if (!u.autoMedic)   u.autoMedic   = { level: 0, maxLevel: 3, cost: 400,  label: 'Auto-Medic',                description: '10% chance/min to auto-cure sick fish per level' };
    if (!u.mutagen)     u.mutagen     = { level: 0, maxLevel: 3, cost: 500,  label: 'Mutation Catalyst',          description: '+3% mutation chance when breeding per level' };
    if (!u.insurance)   u.insurance   = { level: 0, maxLevel: 3, cost: 350,  label: 'Aquarium Insurance',         description: 'Refund 20% of fish value on death per level' };
    if (!u.fame)        u.fame        = { level: 0, maxLevel: 5, cost: 250,  label: 'Aquarium Fame',              description: '+15% passive income per level' };
    if (!u.tempControl) u.tempControl = { level: 0, maxLevel: 3, cost: 300,  label: 'Climate Control',            description: '-30% temperature drift per level' };
    if (!u.luckyCharm)  u.luckyCharm  = { level: 0, maxLevel: 3, cost: 550,  label: 'Lucky Charm',                description: '+5% chance of higher rarity from breeding per level' };
    if (!u.bulkBuyer)   u.bulkBuyer   = { level: 0, maxLevel: 5, cost: 200,  label: 'Bulk Buyer',                 description: '-10% supply costs per level' };
    if (!u.whisperer)   u.whisperer   = { level: 0, maxLevel: 3, cost: 350,  label: 'Fish Whisperer',              description: '+10% base happiness per level' };
    if (!u.genetics)    u.genetics    = { level: 0, maxLevel: 3, cost: 400,  label: 'Genetics Lab',                description: 'More breeding prediction detail per level' };
    if (!u.service)     u.service     = { level: 0, maxLevel: 5, cost: 280,  label: 'Customer Service',             description: '+15% customer tip bonus per level' };
    if (!u.deepSea)     u.deepSea     = { level: 0, maxLevel: 3, cost: 800,  label: 'Deep Sea Permit',              description: '+6 tank capacity per level (all tanks)' };
    if (!u.breedBay)    u.breedBay    = { level: 0, maxLevel: 2, cost: 1200, label: 'Extra Breeding Bay',            description: 'Unlock an additional breeding bay (up to 3 total)' };
  }
  if (parsed.extraBays === undefined) parsed.extraBays = [];
  if (parsed.maxBays === undefined) parsed.maxBays = 1 + (parsed.shop?.upgrades?.breedBay?.level || 0);
  if (parsed.player.xp === undefined) parsed.player.xp = Math.round((parsed.player.totalCoinsEarned || 0) * 0.05);
  // New system migrations
  if (!parsed.specialOrders) parsed.specialOrders = [];
  if (!parsed.reviews) parsed.reviews = [];
  if (!parsed.discoveries) parsed.discoveries = [];
  if (!parsed.player.research) parsed.player.research = { marine_biology: 0, genetics: 0, business: 0 };
  if (!parsed.player.activeLoan) parsed.player.activeLoan = { active: false };
  if (parsed.player.dailyStreak === undefined) parsed.player.dailyStreak = 0;
  if (!parsed.player.unlockedBackgrounds) parsed.player.unlockedBackgrounds = ['tropical'];
  if (!parsed.player.completedMilestones) parsed.player.completedMilestones = [];
  if (!parsed.player.completedMilestones) parsed.player.completedMilestones = []; // Retroactive XP from earnings
  if (!parsed.player.magicFishFound) parsed.player.magicFishFound = [];
  if (!parsed.player.autopsies) parsed.player.autopsies = [];
  if (!parsed.shop?.fishPrices) {
    parsed.shop = { ...parsed.shop, fishPrices: {} };
  }
  // Guard shop.listedFish missing in very old saves
  if (!parsed.shop?.listedFish) {
    parsed.shop = { ...parsed.shop, listedFish: [] };
  }
  // Guard breedingTank missing entirely (very old saves)
  if (!parsed.breedingTank) {
    parsed.breedingTank = {
      slots: [null, null], eggReady: false, breedingStartedAt: null,
      breedingDurationMs: 300000, storedGenomeA: null, storedGenomeB: null, storedTankId: null,
    };
  }
  // Guard breedingTank.slots not an array
  if (!Array.isArray(parsed.breedingTank.slots)) {
    parsed.breedingTank.slots = [null, null];
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
  // Add storedGenomeC for hatchery donor slot
  if (parsed.breedingTank && parsed.breedingTank.storedGenomeC === undefined) {
    parsed.breedingTank = { storedGenomeC: null, ...parsed.breedingTank };
  }
  // If hatchery is already unlocked, ensure slots array has 3 elements
  if ((parsed.shop?.upgrades?.hatchery?.level || 0) >= 1) {
    const bt = parsed.breedingTank;
    if (bt && Array.isArray(bt.slots) && bt.slots.length < 3) {
      parsed.breedingTank = { ...bt, slots: [...bt.slots, null] };
    }
  }
  if (!parsed.player.boosts)    parsed.player.boosts = {};
  if (!parsed.player.nightWatchEarned) parsed.player.nightWatchEarned = (parsed.player.achievements || []).some(a => a.id === 'survived_night');
  if (parsed.player.seenFishdexCount  == null) parsed.player.seenFishdexCount  = 0;
  if (parsed.player.seenShopFishCount == null) parsed.player.seenShopFishCount = 0;
  if (parsed.player.seenAchCount      == null) parsed.player.seenAchCount      = 0;
  if (parsed.passiveTick == null) parsed.passiveTick = 0;
  if (!parsed.rareMarket) parsed.rareMarket = { lastRefreshDay: 0, purchased: [] };
  if (!parsed.dailyChallenges) parsed.dailyChallenges = { day: 0, challenges: [] };
  // New: market price fluctuation
  if (!parsed.market) parsed.market = { day: 0, modifiers: {}, hotTrait: null, headline: '' };
  // New: early game / tutorial tracking
  if (!parsed.player.firstPlayedAt) parsed.player.firstPlayedAt = parsed.lastTickAt || Date.now();
  if (!parsed.player.tutorialFlags) parsed.player.tutorialFlags = {};
  // Migrate medicine → distinct treatments on old saves
  parsed.tanks = (parsed.tanks || []).map(t => {
    const s = t.supplies || {};
    if (s.antibiotic !== undefined) return t; // already migrated
    const legacy = s.medicine || 0;
    return {
      ...t,
      supplies: {
        ...s,
        medicine: 0,
        antibiotic:      legacy > 0 ? legacy : 3,
        antiparasitic:   legacy > 0 ? Math.max(1, Math.floor(legacy / 2)) : 2,
        digestiveRemedy: legacy > 0 ? Math.max(1, Math.floor(legacy / 2)) : 2,
      },
    };
  });

  // Migrate new features into old saves
  if (!parsed.wantedPosters) parsed.wantedPosters = [];
  if (!parsed.memorials) parsed.memorials = [];
  if (!parsed.lastMicroEventAt) parsed.lastMicroEventAt = 0;
  // Add generation field to existing fish
  if (parsed.fish) {
    parsed.fish = parsed.fish.map(f => ({
      generation: 1,
      ...f,
      // Validate genome structure — fill missing genes with random alleles
      genome: (() => {
        if (!f.genome || typeof f.genome !== 'object') return f.genome;
        const GENE_KEYS = ['bodyShape','finType','pattern','primaryColor','secondaryColor','glow','size','mutation'];
        for (const g of GENE_KEYS) {
          if (!f.genome[g] || !Array.isArray(f.genome[g]) || f.genome[g].length !== 2) {
            f.genome[g] = ['N','N']; // safe default
          }
        }
        return f.genome;
      })(),
      // Sanitize numeric fields
      health: Number.isFinite(f.health) ? f.health : 100,
      hunger: Number.isFinite(f.hunger) ? f.hunger : 0,
      age: Number.isFinite(f.age) ? f.age : 0,
    }));
  }

  // Validate fish genomes — remove fish with corrupted/missing critical fields
  if (parsed.fish) {
    parsed.fish = parsed.fish.filter(f => {
      if (!f || !f.id) return false;
      if (f.genome && typeof f.genome !== 'object') { f.genome = null; f.phenotype = null; f.species = null; }
      if (!Number.isFinite(f.health)) f.health = 100;
      if (!Number.isFinite(f.hunger)) f.hunger = 0;
      return true;
    });
    // Cap fish array at 200 to prevent memory issues
    if (parsed.fish.length > 200) parsed.fish.length = 200;
  }

  // Cap arrays to prevent unbounded growth
  if (parsed.memorials?.length > 50) parsed.memorials.length = 50;
  if (parsed.wantedPosters?.length > 20) parsed.wantedPosters.length = 20;
  if (parsed.log?.length > 60) parsed.log.length = 60;
  if (parsed.reviews?.length > 10) parsed.reviews.length = 10;
  if (parsed.player?.autopsies?.length > 100) parsed.player.autopsies.length = 100;
  if (parsed.player?.fishdex?.length > 500) parsed.player.fishdex.length = 500;

  parsed.version = SAVE_VERSION;
  return parsed;
}

// ── Platform detection ──────────────────────────────────
const isElectron = () => typeof window !== 'undefined' && window.electronAPI?.isElectron;

function cleanStateForSave(state) {
  return {
    ...state,
    player: {
      ...state.player,
      autopsies: (state.player.autopsies || []).map(({ _fishId, ...rest }) => rest),
    },
    lastSavedAt: Date.now(),
    // Strip store functions/UI state that shouldn't be persisted
    soundOn: undefined,
    showOffline: undefined,
  };
}

export function saveGame(state) {
  try {
    const cleanState = cleanStateForSave(state);
    // Sanitize NaN/Infinity in critical numeric fields
    if (cleanState.player) {
      if (!Number.isFinite(cleanState.player.coins)) cleanState.player.coins = 0;
      if (!Number.isFinite(cleanState.player.xp)) cleanState.player.xp = 0;
    }
    if (cleanState.fish) {
      for (const f of cleanState.fish) {
        if (!Number.isFinite(f.health)) f.health = 100;
        if (!Number.isFinite(f.hunger)) f.hunger = 0;
        if (!Number.isFinite(f.age)) f.age = 0;
        if (!Number.isFinite(f.x)) f.x = 50;
        if (!Number.isFinite(f.y)) f.y = 50;
      }
    }
    const json = JSON.stringify(cleanState);
    // Rotate backup — keep previous save in case current one corrupts
    try {
      const prev = localStorage.getItem(SAVE_KEY);
      if (prev) localStorage.setItem(SAVE_KEY + '_backup', prev);
    } catch { /* quota exceeded on backup is non-fatal */ }
    // Always save to localStorage (fast, synchronous)
    localStorage.setItem(SAVE_KEY, json);
    // Also save to filesystem in Electron (async, fire-and-forget)
    if (isElectron()) {
      window.electronAPI.saveGame(cleanState).catch(err =>
        console.warn('[Electron] Filesystem save failed:', err)
      );
    }
    return true;
  } catch (e) { console.error('Save failed:', e); return false; }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // Main save corrupted — try backup
      console.warn('Main save corrupted, trying backup...');
      const backup = localStorage.getItem(SAVE_KEY + '_backup');
      if (!backup) return null;
      parsed = JSON.parse(backup);
    }
    // Validate minimum structure
    if (!parsed || !parsed.player || !Array.isArray(parsed.fish)) {
      console.warn('Save missing required fields, trying backup...');
      const backup = localStorage.getItem(SAVE_KEY + '_backup');
      if (backup) {
        const backupParsed = JSON.parse(backup);
        if (backupParsed?.player && Array.isArray(backupParsed?.fish)) parsed = backupParsed;
        else return null;
      } else return null;
    }
    const fromVersion = parsed.version ?? 0;
    if (fromVersion !== SAVE_VERSION) {
      console.warn(`Migrating save from v${fromVersion} → v${SAVE_VERSION}`);
      return migrateSave(parsed, fromVersion);
    }
    return parsed;
  } catch (e) { console.error('Load failed:', e); return null; }
}
// ── Export / Import ────────────────────────────────────────
export async function exportSave(state) {
  const clean = {
    ...state,
    player: {
      ...state.player,
      autopsies: (state.player.autopsies || []).map(({ _fishId, ...rest }) => rest),
    },
    _exportedAt: new Date().toISOString(),
    _exportVersion: SAVE_VERSION,
  };

  if (isElectron()) {
    // Use native file dialog
    return window.electronAPI.exportSave(clean);
  }

  // Web: download via blob
  const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `fishtycoon2-save-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importSave(fileOrNull) {
  if (isElectron() && !fileOrNull) {
    // Use native file dialog
    const result = await window.electronAPI.importSave();
    if (!result.ok) throw new Error('Import cancelled');
    const parsed = result.data;
    if (!parsed.player || !parsed.fish || !parsed.tanks) {
      throw new Error('Invalid save file — missing required fields.');
    }
    const fromVersion = parsed.version ?? 0;
    return fromVersion !== SAVE_VERSION ? migrateSave(parsed, fromVersion) : parsed;
  }

  // Web: read from File object
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.player || !parsed.fish || !parsed.tanks) {
          return reject(new Error('Invalid save file — missing required fields.'));
        }
        const fromVersion = parsed.version ?? 0;
        const migrated = fromVersion !== SAVE_VERSION ? migrateSave(parsed, fromVersion) : parsed;
        resolve(migrated);
      } catch {
        reject(new Error('Could not parse save file — is it a valid JSON export?'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(fileOrNull);
  });
}

export function addLog(state, message) {
  return { ...state, log: [{ time: Date.now(), message }, ...(state.log || [])].slice(0, 60) };
}

/** Immer-compatible version — mutates draft.log in place */
export function addLogDraft(draft, message, severity) {
  if (!draft.log) draft.log = [];
  draft.log.unshift({ time: Date.now(), message, ...(severity ? { severity } : {}) });
  if (draft.log.length > 60) draft.log.length = 60;
}

// ── Achievements ───────────────────────────────────────────
const ACHIEVEMENT_TIER_REWARDS = { common: 25, rare: 100, secret: 500 };

// Decorations unlocked by specific achievements (not purchasable in shop)
const ACHIEVEMENT_DECOR_REWARDS = {
  tank_happy:  'golden_coral',
  species_10:  'ancient_ruin',
  three_tanks: 'sunken_galleon',
  magic_3:     'magic_orb',
  magic_7:     'legend_throne',
};

export function checkAchievements(state, messages) {
  // Guard against corrupt state
  if (!state?.player || !state?.fish || !state?.tanks) return state;
  // Fast path — all achievements already earned, nothing to check
  if ((state.player.achievements || []).length >= ACHIEVEMENT_DEFS.length) return state;

  const earned = new Set((state.player.achievements || []).map(a => a.id));
  const newAchievements = [];
  let coinsAwarded = 0;
  const newUnlockedDecorations = [];
  let legendFishGrant = false;

  function award(id) {
    if (earned.has(id)) return;
    const def = ACHIEVEMENT_DEFS.find(d => d.id === id);
    if (!def) return;
    const reward = ACHIEVEMENT_TIER_REWARDS[def.tier] ?? ACHIEVEMENT_TIER_REWARDS.common;
    newAchievements.push({ id, unlockedAt: Date.now(), reward });
    coinsAwarded += reward;
    earned.add(id);
    messages.push(`🏆 Achievement unlocked: ${def.emoji} ${def.label}! +🪙${reward}`);

    // Decoration reward
    const decorId = ACHIEVEMENT_DECOR_REWARDS[id];
    if (decorId && !(state.player.unlockedDecorations || []).includes(decorId) && !newUnlockedDecorations.includes(decorId)) {
      newUnlockedDecorations.push(decorId);
      messages.push(`🎨 Decoration unlocked: ${decorId.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}!`);
    }

    // Legend Fish unlock
    if (id === 'magic_7') legendFishGrant = true;
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

  // Precompute fish count per tank (O(n)) to avoid O(n×t) filter inside some()
  const fishCountByTank = new Map();
  for (const f of fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
  const anyFull = tanks.some(t => t.capacity > 0 && (fishCountByTank.get(t.id) || 0) >= t.capacity);
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
  if (Object.values(upgrades).some(u => u.level >= (u.maxLevel || 3))) award('upgrade_max');

  // survived_night is checked every tick in processTick (gameTick.js), not here,
  // because checkAchievements only fires on event triggers and would miss the
  // nightly window entirely if no other achievement fires between 11pm–6am.

  if (newAchievements.length === 0) return state;
  return {
    ...state,
    player: {
      ...player,
      coins: (player.coins || 0) + coinsAwarded,
      achievements: [...player.achievements, ...newAchievements],
      unlockedDecorations: [...(player.unlockedDecorations || []), ...newUnlockedDecorations],
      legendFishUnlocked: player.legendFishUnlocked || legendFishGrant,
    },
  };
}
