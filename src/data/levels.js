// ============================================================
// FISH TYCOON 2 — LEVEL SYSTEM
// XP-based progression with unlocks and rewards
// ============================================================

// XP required to reach a given level: 100 * level^1.5
function xpForLevel(level) {
  if (level <= 0) return 0;
  return Math.round(100 * Math.pow(level, 1.5));
}
// Current level from total XP
export function getLevelFromXp(xp) {
  let level = 0;
  let remaining = xp;
  while (remaining >= xpForLevel(level + 1)) {
    level++;
    remaining -= xpForLevel(level);
  }
  return { level, currentXp: remaining, nextLevelXp: xpForLevel(level + 1) };
}

// XP rewards for actions
export const XP_REWARDS = {
  sellFish:       10,
  sellRareFish:   25,
  sellEpicFish:   50,
  breedEgg:       15,
  cureFish:       12,
  discoverSpecies:30,
  completeChallenge: 20,
  firstSale:      50,
  unlockTank:     40,
  buyUpgrade:     8,
  feedFish:       1,
  treatWater:     3,
};

// Level milestone unlocks
const LEVEL_UNLOCKS = [
  { level: 2,  unlock: 'shop_uncommon',   label: 'Uncommon fish in shop',     icon: '🐠' },
  { level: 3,  unlock: 'breeding_lab',    label: 'Breeding Lab access',       icon: '🧬' },
  { level: 5,  unlock: 'shop_rare',       label: 'Rare fish in shop',         icon: '🌟' },
  { level: 7,  unlock: 'decorations',     label: 'Decorations unlocked',      icon: '🪸' },
  { level: 10, unlock: 'rare_market',     label: 'Rare Market access',        icon: '🏪' },
  { level: 12, unlock: 'advanced_upgrades', label: 'Advanced upgrades',       icon: '⚡' },
  { level: 15, unlock: 'shop_epic',       label: 'Epic fish in shop',         icon: '💎' },
  { level: 18, unlock: 'expert_upgrades', label: 'Expert upgrades',           icon: '🔬' },
  { level: 20, unlock: 'prestige',        label: 'Prestige available',        icon: '🌟' },
  { level: 25, unlock: 'master_title',    label: 'Master Aquarist title',     icon: '👑' },
  { level: 30, unlock: 'legend_title',    label: 'Legendary Aquarist title',  icon: '🏆' },
];

// Level titles
export function getLevelTitle(level) {
  if (level >= 30) return '🏆 Legendary Aquarist';
  if (level >= 25) return '👑 Master Aquarist';
  if (level >= 20) return '⭐ Expert Aquarist';
  if (level >= 15) return '🐠 Senior Aquarist';
  if (level >= 10) return '🐟 Aquarist';
  if (level >= 5)  return '🌊 Junior Aquarist';
  return '🐚 Novice';
}

// Check if a feature is unlocked at current level
export function isUnlocked(featureKey, level) {
  const milestone = LEVEL_UNLOCKS.find(u => u.unlock === featureKey);
  if (!milestone) return true; // Not gated
  return level >= milestone.level;
}
