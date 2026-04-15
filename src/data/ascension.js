// ============================================================
// FISH TYCOON 2 — ASCENSION SYSTEM (Meta Progression)
// Replaces the old prestige system with a skill tree + coral fragments
// ============================================================

import { createDefaultState } from './gameState.js';

// ── Ascension Tree ──────────────────────────────────────────
export const ASCENSION_BRANCHES = {
  collector: {
    id: 'collector', name: "Collector's Eye", icon: '', color: '#5aa8a0',
    desc: 'See more, find more, know more.',
    tiers: [
      { id: 'allele_scanner',    cost: 1, name: 'Allele Scanner',    desc: 'Fish panel shows hidden recessive alleles', icon: '' },
      { id: 'trait_forecast',    cost: 2, name: 'Trait Forecast',    desc: 'Customers preview what traits they want 30s early', icon: '' },
      { id: 'species_radar',     cost: 3, name: 'Species Radar',     desc: 'Undiscovered species glow in your tank', icon: '' },
      { id: 'better_starters',   cost: 4, name: 'Phenotype Memory',  desc: 'Start each run with 2 uncommon fish', icon: '' },
      { id: 'omniscience',       cost: 5, name: 'Omniscience',       desc: 'Gene Journal starts fully revealed', icon: '' },
    ],
  },
  mogul: {
    id: 'mogul', name: "Mogul's Touch", icon: '', color: '#d4a843',
    desc: 'Make more money, faster.',
    tiers: [
      { id: 'silver_tongue',     cost: 1, name: 'Silver Tongue',     desc: 'Haggling success rate +25%', icon: '' },
      { id: 'premium_clients',   cost: 2, name: 'Premium Clientele', desc: 'Wealthy Patrons appear 2× more often', icon: '' },
      { id: 'bulk_orders',       cost: 3, name: 'Bulk Orders',       desc: 'Wanted Board holds 5 posters instead of 3', icon: '' },
      { id: 'market_insider',    cost: 4, name: 'Market Insider',    desc: 'Hot trait shown 24h in advance', icon: '' },
      { id: 'golden_touch',      cost: 5, name: 'Golden Touch',      desc: 'Purity price bonus doubled', icon: '' },
    ],
  },
  weaver: {
    id: 'weaver', name: 'Gene Weaver', icon: '', color: '#cc66ff',
    desc: 'Faster, better, more controlled breeding.',
    tiers: [
      { id: 'fertility_boost',   cost: 1, name: 'Fertility Boost',   desc: 'Base clutch size becomes 2 eggs', icon: '' },
      { id: 'dominant_selector', cost: 2, name: 'Dominant Selector', desc: 'Choose which parent dominates one gene per breed', icon: '' },
      { id: 'mutation_catalyst', cost: 3, name: 'Mutation Catalyst', desc: 'Tier 1 mutations appear 3× more often', icon: '' },
      { id: 'recipe_mastery',    cost: 4, name: 'Recipe Mastery',    desc: 'Mutation recipe success rate +50%', icon: '' },
      { id: 'gene_splicing',     cost: 5, name: 'Gene Splicing',     desc: 'Guarantee 1 specific allele per breed (500🪙)', icon: '' },
    ],
  },
  master: {
    id: 'master', name: 'Aquarium Master', icon: '', color: '#44dd99',
    desc: 'Start stronger every run.',
    tiers: [
      { id: 'quick_start',       cost: 1, name: 'Quick Start',       desc: 'Start with 500🪙 instead of 325🪙', icon: '' },
      { id: 'auto_systems',      cost: 2, name: 'Auto-Systems',      desc: 'Auto-feed and purifier level 1 free at start', icon: '' },
      { id: 'tank_head_start',   cost: 3, name: 'Tank Head Start',   desc: 'Start with 2 tanks instead of 1', icon: '' },
      { id: 'legacy_hatchery',   cost: 4, name: 'Legacy Hatchery',   desc: 'Breeding bay available from the start + 1 free breed', icon: '' },
      { id: 'aquarium_empire',   cost: 5, name: 'Aquarium Empire',   desc: 'Start with all basic upgrades at level 1', icon: '' },
    ],
  },
};

// ── Ascension Requirements ──────────────────────────────────
export function getAscensionRequirements(level) {
  const l = level + 1; // next level
  return {
    collector:  { label: `Discover ${15 + l * 5} species`, check: (s) => (s.player.fishdex || []).length >= 15 + l * 5 },
    tycoon:     { label: `Earn ${(15000 * Math.pow(1.5, l)).toLocaleString()}🪙 lifetime`, check: (s) => (s.player.totalCoinsEarned || 0) >= 15000 * Math.pow(1.5, l) },
    geneticist: { label: l <= 2 ? 'Breed a Tier 2 mutation' : 'Breed a Tier 3 mutation', check: (s) => {
      const mutations = (s.player.fishdex || []).filter(e => e.phenotype?.mutation && e.phenotype.mutation !== 'None');
      if (l <= 2) return mutations.some(m => ['Iridescent', 'Bioluminescent'].includes(m.phenotype.mutation));
      return mutations.some(m => ['Crystalline', 'Void', 'Phoenix'].includes(m.phenotype.mutation));
    }},
    legend:     { label: `Find ${Math.min(7, 3 + l)} Magic Fish`, check: (s) => (s.player.magicFishFound || []).length >= Math.min(7, 3 + l) },
  };
}

export function canAscend(state) {
  const level = state.player?.ascensionLevel || 0;
  const reqs = getAscensionRequirements(level);
  return Object.values(reqs).some(r => r.check(state));
}

// ── Ascension Tree Helpers ──────────────────────────────────
export function hasUnlock(state, branchId, tierIndex) {
  return state.player?.ascensionTree?.[branchId]?.[tierIndex] === true;
}

export function canBuyUnlock(state, branchId, tierIndex) {
  const branch = ASCENSION_BRANCHES[branchId];
  if (!branch) return false;
  const tier = branch.tiers[tierIndex];
  if (!tier) return false;
  if (hasUnlock(state, branchId, tierIndex)) return false;
  // Must own previous tier (or be tier 0)
  if (tierIndex > 0 && !hasUnlock(state, branchId, tierIndex - 1)) return false;
  return (state.player?.ascensionPoints || 0) >= tier.cost;
}

export function buyUnlock(state, branchId, tierIndex) {
  const branch = ASCENSION_BRANCHES[branchId];
  if (!branch || !canBuyUnlock(state, branchId, tierIndex)) return state;
  const tier = branch.tiers[tierIndex];
  const tree = { ...(state.player.ascensionTree || { collector: [], mogul: [], weaver: [], master: [] }) };
  tree[branchId] = [...(tree[branchId] || [])];
  tree[branchId][tierIndex] = true;
  return {
    ...state,
    player: {
      ...state.player,
      ascensionPoints: (state.player.ascensionPoints || 0) - tier.cost,
      ascensionTree: tree,
    },
  };
}

// ── Coral Fragments ─────────────────────────────────────────
export const CORAL_SHOP = [
  { id: 'starter_uncommon', name: 'Starter Egg (Uncommon)', cost: 5,  icon: '', desc: 'Begin next run with a bonus uncommon egg' },
  { id: 'starter_rare',     name: 'Starter Egg (Rare)',     cost: 15, icon: '', desc: 'Begin next run with a bonus rare egg' },
  { id: 'coin_pouch',       name: 'Coin Pouch',             cost: 3,  icon: '', desc: '+200 starting coins on next run' },
  { id: 'lucky_charm',      name: 'Lucky Charm',            cost: 8,  icon: '', desc: '+5% mutation chance for first 10 breeds' },
  { id: 'theme_deep',       name: 'Deep Ocean Theme',       cost: 10, icon: '', desc: 'Permanent tank theme', cosmetic: true },
  { id: 'theme_biolum',     name: 'Bioluminescent Cave',    cost: 25, icon: '', desc: 'Permanent tank theme', cosmetic: true },
  { id: 'golden_scales',    name: 'Golden Scales',          cost: 20, icon: '', desc: 'All fish have subtle gold shimmer', cosmetic: true },
];

// ── Perform Ascension ───────────────────────────────────────
export function performAscension(state) {
  if (!canAscend(state)) return state;
  const oldLevel = state.player?.ascensionLevel || 0;
  const newLevel = oldLevel + 1;
  const apEarned = newLevel; // Ascension 1 = 1 AP, Ascension 2 = 2 AP, etc.

  const fresh = createDefaultState();

  // Calculate starting coins with Ascension bonuses
  let startCoins = 325 + newLevel * 200;
  const tree = state.player?.ascensionTree || { collector: [], mogul: [], weaver: [], master: [] };
  if (tree.master?.[0]) startCoins = Math.max(startCoins, 500 + newLevel * 200); // Quick Start

  // Apply Aquarium Master head starts
  const applyMasterUnlocks = (freshState) => {
    const s = { ...freshState };
    // Auto-Systems: free auto-feed + purifier L1
    if (tree.master?.[1]) {
      s.tanks = s.tanks.map(t => ({ ...t, autoFeed: true }));
      if (s.shop?.upgrades?.purifier) s.shop.upgrades.purifier.level = 1;
    }
    // Tank Head Start: 2 tanks
    if (tree.master?.[2] && s.tanks.length < 2) {
      const { createDefaultTank } = require('./gameState.js');
      s.tanks = [...s.tanks, createDefaultTank('tank_1', 'breeding')];
    }
    // Aquarium Empire: all basic upgrades L1
    if (tree.master?.[4] && s.shop?.upgrades) {
      for (const key of Object.keys(s.shop.upgrades)) {
        if (s.shop.upgrades[key].level === 0) s.shop.upgrades[key].level = 1;
      }
    }
    return s;
  };

  // Apply Collector starters
  const applyCollectorUnlocks = (fishArr) => {
    if (tree.collector?.[3]) {
      // Phenotype Memory: replace commons with uncommons
      const { createFish } = require('./genetics.js');
      return [
        createFish({ stage: 'juvenile', tankId: 'tank_0', targetRarity: 'uncommon' }),
        createFish({ stage: 'juvenile', tankId: 'tank_0', targetRarity: 'uncommon' }),
        createFish({ stage: 'juvenile', tankId: 'tank_0' }),
      ];
    }
    return fishArr;
  };

  // Apply coral shop bonuses for next run
  const bonuses = state.player?.ascensionBonuses || [];
  let bonusCoins = 0;
  for (const b of bonuses) {
    if (b === 'coin_pouch') bonusCoins += 200;
  }

  let result = applyMasterUnlocks(fresh);
  result.fish = applyCollectorUnlocks(result.fish);

  return {
    ...result,
    player: {
      ...result.player,
      coins: startCoins + bonusCoins,
      totalCoinsEarned: 0,
      ascensionLevel: newLevel,
      ascensionPoints: (state.player?.ascensionPoints || 0) + apEarned,
      ascensionPointsTotal: (state.player?.ascensionPointsTotal || 0) + apEarned,
      ascensionTree: tree,
      coralFragments: state.player?.coralFragments || 0,
      coralFragmentsTotal: state.player?.coralFragmentsTotal || 0,
      ascensionBonuses: [], // consumed
      xp: 0,
      level: 1,
      // Keep across ascension
      fishdex: state.player?.fishdex || [],
      achievements: state.player?.achievements || [],
      magicFishFound: state.player?.magicFishFound || [],
      stats: {
        ...result.player.stats,
        totalPrestiges: (state.player?.stats?.totalPrestiges || 0) + 1,
        totalAscensions: (state.player?.stats?.totalAscensions || 0) + 1,
      },
      tutorialFlags: state.player?.tutorialFlags,
      tutorialDone: state.player?.tutorialDone,
      legendFishUnlocked: state.player?.legendFishUnlocked,
      unlockedDecorations: state.player?.unlockedDecorations || [],
      unlockedBackgrounds: state.player?.unlockedBackgrounds || [],
      // Dynasty records persist
      dynastyRecords: {
        longestGeneration: Math.max(
          state.player?.dynastyRecords?.longestGeneration || 0,
          ...((state.fish || []).map(f => f.generation || 1))
        ),
        highestPurity: Math.max(
          state.player?.dynastyRecords?.highestPurity || 0,
          ...((state.fish || []).map(f => {
            if (!f.genome) return 0;
            let pure = 0;
            for (const g of Object.values(f.genome)) if (g[0] === g[1]) pure++;
            return pure;
          }))
        ),
        mostValuableSale: state.player?.dynastyRecords?.mostValuableSale || 0,
        totalAscensions: (state.player?.stats?.totalAscensions || 0) + 1,
      },
    },
    memorials: state.memorials || [],
    _ascensionJustHappened: true,
  };
}

// ── Coral Fragment Sources ──────────────────────────────────
export function getCoralReward(eventType, data = {}) {
  switch (eventType) {
    case 'sell_epic': return 1;
    case 'sell_legendary': return 3;
    case 'wanted_poster': return 1;
    case 'breed_t2_mutation': return 2;
    case 'breed_t3_mutation': return 5;
    case 'milestone_chapter': return 3;
    case 'daily_streak_7': return 2;
    default: return 0;
  }
}
