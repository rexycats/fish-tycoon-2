// ============================================================
// FISH TYCOON 2 — RETENTION MECHANICS
// Near-miss, jackpots, loss aversion, streak pain
// ============================================================

import { RARITY } from './genetics.js';

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

// ── Near-Miss: check if offspring was close to next rarity ──
export function checkNearMiss(fish) {
  if (!fish?.species) return null;
  const rarity = fish.species.rarity || 'common';
  const score = fish.species.rarityScore || 0;
  const idx = RARITY_ORDER.indexOf(rarity);
  if (idx >= RARITY_ORDER.length - 1) return null; // Already legendary

  const nextRarity = RARITY_ORDER[idx + 1];

  // Rarity thresholds from genetics.js
  const thresholds = { common: 0, uncommon: 30, rare: 55, epic: 75, legendary: 90 };
  const nextThreshold = thresholds[nextRarity];
  const gap = nextThreshold - score;

  if (gap > 0 && gap <= 8) {
    return {
      currentRarity: rarity,
      nextRarity,
      gap,
      message: gap <= 3
        ? `SO CLOSE! Just ${gap} points from ${nextRarity.toUpperCase()}!`
        : `Almost ${nextRarity}! Only ${gap} points away.`,
    };
  }
  return null;
}

// ── Jackpot Sales: variable reward schedule ─────────────────
export function checkJackpot(totalSales) {
  // Jackpot triggers on specific sale counts with increasing rarity
  // Creates unpredictable "when will the next one hit?" excitement
  if (totalSales % 50 === 0 && totalSales > 0) return { multiplier: 10, label: '🎰 MEGA JACKPOT!', tier: 'mega' };
  if (totalSales % 25 === 0 && totalSales > 0) return { multiplier: 5,  label: '🎰 JACKPOT!', tier: 'jackpot' };
  if (totalSales % 10 === 0 && totalSales > 0) return { multiplier: 2,  label: '🎰 Lucky Sale!', tier: 'lucky' };
  // Random mini-jackpot: ~3% chance per sale
  if (Math.random() < 0.03) return { multiplier: 3, label: '🎰 Surprise Bonus!', tier: 'surprise' };
  return null;
}

// ── Loss Aversion: limited-time offers that expire ──────────
export const URGENT_OFFERS = [
  {
    id: 'vip_collector',
    name: '💎 VIP Collector',
    desc: 'Will pay 5× for any Epic+ fish!',
    duration: 600_000, // 10 minutes
    multiplier: 5,
    targetRarity: ['epic', 'legendary'],
    weight: 3,
  },
  {
    id: 'bulk_buyer',
    name: '📦 Bulk Buyer',
    desc: 'Buying ALL listed fish at 2× price!',
    duration: 300_000, // 5 minutes
    multiplier: 2,
    targetRarity: null, // any
    weight: 5,
  },
  {
    id: 'rare_hunter',
    name: '🔍 Rare Hunter',
    desc: 'Seeking any Rare fish — pays 3× market!',
    duration: 480_000, // 8 minutes
    multiplier: 3,
    targetRarity: ['rare'],
    weight: 4,
  },
  {
    id: 'museum_curator',
    name: '🏛️ Museum Curator',
    desc: 'Wants unique species for exhibit — 4× for any species fish!',
    duration: 420_000, // 7 minutes
    multiplier: 4,
    targetRarity: null,
    requiresSpecies: true, // must be a real species, not procedural
    weight: 2,
  },
];

export function rollUrgentOffer() {
  // ~2% chance per minute
  if (Math.random() > 0.02) return null;
  const total = URGENT_OFFERS.reduce((s, o) => s + o.weight, 0);
  let roll = Math.random() * total;
  for (const offer of URGENT_OFFERS) {
    roll -= offer.weight;
    if (roll <= 0) return { ...offer, startedAt: Date.now(), expiresAt: Date.now() + offer.duration };
  }
  return URGENT_OFFERS[0];
}

export function isOfferActive(offer) {
  return offer && Date.now() < offer.expiresAt;
}

// ── Streak Penalties ────────────────────────────────────────
export function getStreakMultiplier(streak) {
  // Streak gives a coin earning multiplier that's painful to lose
  if (streak >= 30) return 1.5;  // +50% after 30 days
  if (streak >= 14) return 1.3;  // +30% after 2 weeks
  if (streak >= 7)  return 1.15; // +15% after 1 week
  if (streak >= 3)  return 1.05; // +5% after 3 days
  return 1.0;
}

export function getStreakLabel(streak) {
  if (streak >= 30) return '🔥🔥🔥 Legendary Streak';
  if (streak >= 14) return '🔥🔥 Hot Streak';
  if (streak >= 7)  return '🔥 On Fire';
  if (streak >= 3)  return '✨ Building Momentum';
  return '';
}
