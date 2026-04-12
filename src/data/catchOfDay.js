// ============================================================
// CATCH OF THE DAY — Daily wild pond mini-game
// Click swimming shadows to catch free fish
// ============================================================

import { createFish, randomGenome } from './genetics.js';

const SHADOW_TYPES = [
  { rarity: 'common',   weight: 50, speed: 1.0, size: 1.0,  points: 10 },
  { rarity: 'common',   weight: 30, speed: 1.2, size: 0.8,  points: 10 },
  { rarity: 'uncommon', weight: 12, speed: 1.5, size: 1.0,  points: 25 },
  { rarity: 'rare',     weight: 5,  speed: 2.0, size: 1.2,  points: 50 },
  { rarity: 'epic',     weight: 2,  speed: 2.8, size: 1.5,  points: 100 },
  { rarity: 'legendary',weight: 0.5,speed: 3.5, size: 0.6,  points: 250 },
];

// Pick a shadow type weighted by rarity
export function pickShadow(luckBonus = 0) {
  const adjusted = SHADOW_TYPES.map(s => ({
    ...s,
    weight: s.rarity === 'common' ? s.weight * (1 - luckBonus * 0.3) : s.weight * (1 + luckBonus),
  }));
  const total = adjusted.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * total;
  for (const s of adjusted) {
    roll -= s.weight;
    if (roll <= 0) return s;
  }
  return adjusted[0];
}
// Create a fish from a caught shadow
export function createCaughtFish(shadow, tankId) {
  return createFish({
    stage: 'adult',
    tankId,
    genome: randomGenome(),
    targetRarity: shadow.rarity,
  });
}

export function canPlayCatch(state) {
  const last = state.player?.lastCatchDate;
  if (!last) return true;
  return new Date().toDateString() !== last;
}

;
