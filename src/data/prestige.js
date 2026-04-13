// ============================================================
// FISH TYCOON 2 — PRESTIGE SYSTEM
// Reset progress for permanent multipliers + new content
// ============================================================

import { createDefaultState } from './gameState.js';

const PRESTIGE_BONUSES = {
  coinMult:     { base: 1.0, perLevel: 0.15, label: 'Coin Earn Rate',     icon: '🪙', desc: '+15% coin income per prestige' },
  breedSpeed:   { base: 1.0, perLevel: 0.10, label: 'Breeding Speed',     icon: '🧬', desc: '+10% faster breeding per prestige' },
  rarityLuck:   { base: 0,   perLevel: 0.02, label: 'Rarity Luck',        icon: '🍀', desc: '+2% chance of rarer offspring per prestige' },
  startCoins:   { base: 325, perLevel: 200,  label: 'Starting Capital',   icon: '💰', desc: '+200 starting coins per prestige' },
  maxTanks:     { base: 3,   perLevel: 1,    label: 'Max Tanks',          icon: '🏗️', desc: '+1 unlockable tank per prestige (up to 6)', max: 6 },
};

// Requirements to prestige
export function canPrestige(state) {
  const magicFound = (state.player.magicFishFound || []).length;
  const species = (state.player.fishdex || []).length;
  return magicFound >= 7 || species >= 50;
}

function getPrestigeLevel(state) {
  return state.player.prestigeLevel || 0;
}
export function performPrestige(state) {
  if (!canPrestige(state)) return state;
  const newLevel = (state.player.prestigeLevel || 0) + 1;
  const startCoins = PRESTIGE_BONUSES.startCoins.base + newLevel * PRESTIGE_BONUSES.startCoins.perLevel;

  // Get a fresh default state for everything that should reset
  const fresh = createDefaultState();

  // Keep: prestige level, fishdex, achievements, settings, unlocked decorations
  // Reset: coins, fish, tanks, shop, breeding, challenges, wanted board, memorials
  return {
    ...fresh,
    // Preserved player data
    player: {
      ...fresh.player,
      coins: startCoins,
      totalCoinsEarned: 0,
      prestigeLevel: newLevel,
      prestigeTotalEarned: (state.player.prestigeTotalEarned || 0) + (state.player.totalCoinsEarned || 0),
      xp: 0,
      level: 1,
      // Keep these across prestige
      fishdex: state.player.fishdex || [],
      achievements: state.player.achievements || [],
      magicFishFound: state.player.magicFishFound || [],
      stats: { ...fresh.player.stats, totalPrestiges: (state.player.stats?.totalPrestiges || 0) + 1 },
      tutorialFlags: state.player.tutorialFlags,
      tutorialDone: state.player.tutorialDone,
      legendFishUnlocked: state.player.legendFishUnlocked,
      unlockedDecorations: state.player.unlockedDecorations || [],
      unlockedBackgrounds: state.player.unlockedBackgrounds || [],
    },
    // Keep memorials (emotional memories persist across runs)
    memorials: state.memorials || [],
    _prestigeJustHappened: true,
  };
}
