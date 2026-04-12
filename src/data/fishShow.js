// ============================================================
// FISH SHOW — Weekly competition with 3 judging rounds
// ============================================================

const JUDGE_NAMES = [
  '👨‍⚖️ Judge Coral', '👩‍⚖️ Madame Reef', '🧑‍⚖️ Professor Tide',
  '👴 Old Salt', '👩‍🔬 Dr. Scales', '🎩 Sir Bubbles',
];

const SHOW_CATEGORIES = ['beauty', 'tricks', 'size'];

// Score a fish in each category (1-10)
export function scoreFish(fish) {
  const rarity = fish?.species?.rarity || 'common';
  const rarityScore = { common: 1, uncommon: 3, rare: 5, epic: 7, legendary: 10 }[rarity] || 1;
  const personality = fish?.personality || 'shy';
  const size = fish?.phenotype?.size || 'Medium';
  const health = fish?.health || 50;
  const healthBonus = health / 100;

  // Beauty: rarity + health + color variant bonus
  const hasVariant = fish?.colorVariant && fish.colorVariant !== 'default';
  const beauty = Math.min(10, Math.round(
    rarityScore * 0.6 + healthBonus * 3 + (hasVariant ? 1.5 : 0) + Math.random() * 1.5
  ));

  // Tricks: personality-based
  const trickScores = {
    playful: 8, curious: 7, social: 6, aggressive: 5,
    hardy: 4, gluttonous: 3, lazy: 2, shy: 1,
  };
  const tricks = Math.min(10, Math.round(
    (trickScores[personality] || 3) * 0.8 + healthBonus * 2 + Math.random() * 1.5
  ));

  // Size: bigger = better
  const sizeScores = { Dwarf: 2, Tiny: 3, Medium: 5, Giant: 8, Leviathan: 10 };
  const sizeScore = Math.min(10, Math.round(
    (sizeScores[size] || 5) * 0.7 + rarityScore * 0.2 + Math.random() * 2
  ));

  return { beauty, tricks, size: sizeScore, total: beauty + tricks + sizeScore };
}

// Generate AI competitors
export function generateCompetitors(playerLevel) {
  const count = 3 + Math.min(4, Math.floor(playerLevel / 5)); // 3-7 competitors
  const competitors = [];
  const names = [
    'Azure Dream', 'Coral King', 'Reef Runner', 'Tide Dancer',
    'Deep Blue', 'Pearl Diver', 'Wave Rider', 'Storm Chaser',
    'Moonlit Fin', 'Golden Scale', 'Shadow Swimmer', 'Crystal Eye',
  ];
  for (let i = 0; i < count; i++) {
    const base = 3 + Math.floor(playerLevel / 3) + Math.floor(Math.random() * 4);
    competitors.push({
      name: names[i % names.length],
      owner: JUDGE_NAMES[i % JUDGE_NAMES.length].split(' ').slice(1).join(' ') + "'s entry",
      beauty: Math.min(10, base + Math.floor(Math.random() * 3)),
      tricks: Math.min(10, base - 1 + Math.floor(Math.random() * 3)),
      size: Math.min(10, base - 1 + Math.floor(Math.random() * 4)),
      total: 0,
    });
    competitors[i].total = competitors[i].beauty + competitors[i].tricks + competitors[i].size;
  }
  return competitors.sort((a, b) => b.total - a.total);
}

// Rewards by placement
export function getShowReward(placement, entryCount) {
  if (placement === 1) return { coins: 500, xp: 50, label: '🥇 1st Place!', trophy: 'gold' };
  if (placement === 2) return { coins: 250, xp: 30, label: '🥈 2nd Place!', trophy: 'silver' };
  if (placement === 3) return { coins: 100, xp: 20, label: '🥉 3rd Place!', trophy: 'bronze' };
  return { coins: 25, xp: 5, label: `Placed #${placement} of ${entryCount + 1}`, trophy: null };
}

export function canEnterShow(state) {
  const lastShow = state.player?.lastShowDate;
  if (!lastShow) return true;
  const now = new Date();
  const last = new Date(lastShow);
  // Can enter once per day
  return now.toDateString() !== last.toDateString();
}

export { JUDGE_NAMES };
