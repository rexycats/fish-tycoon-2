// ============================================================
// FISH TYCOON 2 — PRESTIGE SYSTEM
// Reset progress for permanent multipliers + new content
// ============================================================

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

  // Keep: prestige level, fishdex (species knowledge persists), achievements, settings
  // Reset: coins, fish, tanks, shop, breeding, challenges
  return {
    ...state,
    player: {
      ...state.player,
      coins: startCoins,
      totalCoinsEarned: 0,
      prestigeLevel: newLevel,
      prestigeTotalEarned: (state.player.prestigeTotalEarned || 0) + (state.player.totalCoinsEarned || 0),
      // Keep these
      fishdex: state.player.fishdex,
      achievements: state.player.achievements,
      magicFishFound: state.player.magicFishFound,
      stats: { ...state.player.stats, totalPrestiges: (state.player.stats?.totalPrestiges || 0) + 1 },
      autopsies: [],
      boosts: {},
      tutorialFlags: state.player.tutorialFlags,
      legendFishUnlocked: state.player.legendFishUnlocked,
      nightWatchEarned: false,
      seenFishdexCount: 0,
      seenShopFishCount: 0,
      seenAchCount: 0,
      challengeStreak: 0,
      unlockedDecorations: state.player.unlockedDecorations,
    },
    _prestigeJustHappened: true,
  };
}
