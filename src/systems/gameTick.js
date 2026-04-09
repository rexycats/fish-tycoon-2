// ============================================================
// FISH TYCOON 2 — GAME TICK SYSTEM v7 (multi-tank)
// ============================================================

import { GROWTH_STAGES, computePhenotype, getSpeciesFromPhenotype, RARITY, createFish, rarityFromScore, computeRarityScore } from '../data/genetics.js';
import { addLog, TANK_TYPES } from '../data/gameState.js';

export const TICK_INTERVAL_MS = 1000;

// --- RATES (per real second) ---
const HUNGER_RATE        = 0.025;
const WATER_DECAY_RATE   = 0.002; // 0.004 was ~14.4 pts/hr — too fast for casual sessions; 0.002 = ~7.2 pts/hr, full tank lasts ~13.9 h
const HEALTH_HUNGER_DMG  = 0.06;
const HEALTH_WATER_DMG   = 0.03;
const HEALTH_REGEN       = 0.01;

// --- PASSIVE INCOME ---
// Once per minute, tanks with adult fish trickle a small coin bonus
// based on happiness + placed decoration count. Max ~3 coins/min/tank —
// meaningful during fish-dry spells, negligible vs active selling.
const PASSIVE_INCOME_INTERVAL = 60;   // ticks (= 1 real minute)
const PASSIVE_INCOME_BASE     = 4;    // coins/min at 100% happiness, 0 decor
const PASSIVE_DECOR_BONUS     = 0.25; // +25% per placed decoration, capped at 10

// --- DISEASE SYSTEM ---
export const DISEASES = {
  ich: {
    id: 'ich', name: 'Ich', emoji: '🔴',
    desc: 'White-spot disease. Spreads quickly between fish.',
    healthDmgPerSec: 0.08,
    spreadChancePerSec: 0.003,
    color: '#ff4444',
    curedBy: 'antibiotic',
    treatmentName: 'Antibiotic',
  },
  fin_rot: {
    id: 'fin_rot', name: 'Fin Rot', emoji: '🟤',
    desc: 'Bacterial infection. Caused by poor water quality.',
    healthDmgPerSec: 0.04,
    spreadChancePerSec: 0.001,
    color: '#a06020',
    curedBy: 'antibiotic',
    treatmentName: 'Antibiotic',
  },
  bloat: {
    id: 'bloat', name: 'Bloat', emoji: '🟡',
    desc: 'Digestive illness. Linked to overfeeding.',
    healthDmgPerSec: 0.05,
    spreadChancePerSec: 0,
    color: '#d4c020',
    curedBy: 'digestiveRemedy',
    treatmentName: 'Digestive Remedy',
  },
  velvet: {
    id: 'velvet', name: 'Velvet', emoji: '🟠',
    desc: 'Parasitic infection. Hard to spot until advanced.',
    healthDmgPerSec: 0.1,
    spreadChancePerSec: 0.004,
    color: '#e06820',
    curedBy: 'antiparasitic',
    treatmentName: 'Antiparasitic',
  },
};

// Disease outbreak chance factors (per second)
const DISEASE_BASE_CHANCE  = 0.00008;  // base chance per fish per second
const DISEASE_WATER_MULT   = 3.5;      // multiplier when water quality < 30
const DISEASE_CROWD_MULT   = 2.0;      // multiplier when tank is >80% full

const CUSTOMER_BASE_INTERVAL_MS  = 18_000;
const BASE_OFFLINE_SECONDS       = 60 * 60 * 48;   // 48h base cap
const TANK_SITTER_BONUS_SECONDS  = 60 * 60 * 24;   // +24h per Tank Sitter level

const CUSTOMER_TYPES = [
  { id: 'tourist',   name: 'Tourist',       budgetMult: 0.85, haggle: 0.0,  rarityBias: 'common',   emoji: '👒' },
  { id: 'hobbyist',  name: 'Fish Hobbyist', budgetMult: 1.0,  haggle: 0.2,  rarityBias: 'uncommon', emoji: '🎣' },
  { id: 'collector', name: 'Collector',     budgetMult: 1.3,  haggle: 0.05, rarityBias: 'rare',     emoji: '🧐' },
  { id: 'breeder',   name: 'Pro Breeder',   budgetMult: 1.1,  haggle: 0.35, rarityBias: 'uncommon', emoji: '🔬' },
  { id: 'rich',      name: 'Wealthy Patron',budgetMult: 1.8,  haggle: 0.0,  rarityBias: 'epic',     emoji: '💎' },
  { id: 'kid',       name: 'Excited Kid',   budgetMult: 0.7,  haggle: 0.0,  rarityBias: 'common',   emoji: '👦' },
];

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

// ── Tank type bonuses ──────────────────────────────────────
function getTankBonuses(tankType) {
  switch (tankType) {
    case 'breeding': return { breedingSpeedMult: 0.8, healthRegenMult: 1.0 };
    case 'grow':     return { growSpeedMult: 0.75,    healthRegenMult: 1.1 };
    case 'display':  return { salePriceMult: 1.1,     healthRegenMult: 1.0 };
    default:         return { healthRegenMult: 1.0 };
  }
}

// ── Spread disease within a tank ──────────────────────────
function maybeSpreadDisease(tankFish, wq, capacity) {
  const sickFish = tankFish.filter(f => f.stage !== 'egg' && f.disease);
  if (sickFish.length === 0) return tankFish;

  const crowded = tankFish.length / (capacity || 12) > 0.8;
  return tankFish.map(fish => {
    if (fish.disease || fish.stage === 'egg') return fish;
    for (const sick of sickFish) {
      const disease = DISEASES[sick.disease];
      if (!disease || disease.spreadChancePerSec === 0) continue;
      let chance = disease.spreadChancePerSec;
      if (wq < 30) chance *= DISEASE_WATER_MULT;
      if (crowded) chance *= DISEASE_CROWD_MULT;
      if (Math.random() < chance) {
        return { ...fish, disease: sick.disease, diseaseSince: Date.now() };
      }
    }
    return fish;
  });
}

// ── Process one tank's fish for one tick ───────────────────
function processOneTank(tank, allFish, messages, now, hatcheryLevel = 0) {
  const tankFish = allFish.filter(f => f.tankId === tank.id);
  const bonuses  = getTankBonuses(tank.type);

  const wq        = Math.max(0, tank.waterQuality - WATER_DECAY_RATE * 1); // per-tick decay (1 tick = 1 second)
  const temp      = tank.temperature ?? 74;
  const tempDrift = temp > 74 ? -0.002 : temp < 74 ? 0.002 : 0;
  const newTemp   = Math.round((temp + tempDrift) * 1000) / 1000;
  const tempStress = newTemp < 65 || newTemp > 85;

  // Auto-feed
  let supplies = { ...tank.supplies };
  const feedTick = (tank.autoFeedTick || 0) + 1;
  let autoFeedUsed = false;
  let autoFeedTriggered = false; // true when the interval fired, regardless of outcome
  if (tank.autoFeed && feedTick >= 40 && supplies.food > 0) {
    autoFeedTriggered = true;
    const hungryFish = tankFish.filter(f => f.stage !== 'egg' && (f.hunger || 0) > 30);
    if (hungryFish.length > 0) {
      autoFeedUsed = true;
      supplies = { ...supplies, food: supplies.food - 1 };
    }
  }

  // Disease: random outbreaks
  let fishWithDisease = tankFish.map(fish => {
    if (fish.disease || fish.stage === 'egg') return fish;
    let chance = DISEASE_BASE_CHANCE;
    if (wq < 30) chance *= DISEASE_WATER_MULT;
    if (tankFish.length / (tank.capacity || 12) > 0.8) chance *= DISEASE_CROWD_MULT;
    if (Math.random() < chance) {
      const diseaseIds = Object.keys(DISEASES);
      // Bias: fin_rot more likely with bad water, bloat more likely if hungry
      let pool = diseaseIds;
      if (wq < 30) pool = ['fin_rot', 'fin_rot', 'ich', 'velvet'];
      if ((fish.hunger || 0) > 70) pool = ['bloat', 'bloat', 'ich'];
      const diseaseId = pool[Math.floor(Math.random() * pool.length)];
      const diseaseDef = DISEASES[diseaseId];
      messages.push({ message: `🚨 ${fish.species?.name || 'A fish'} in ${tank.name} contracted ${diseaseDef?.name || diseaseId}! Use ${diseaseDef?.treatmentName || 'medicine'} to cure it.`, severity: 'critical' });
      return { ...fish, disease: diseaseId, diseaseSince: Date.now() };
    }
    return fish;
  });

  // Disease: spreading
  fishWithDisease = maybeSpreadDisease(fishWithDisease, wq, tank.capacity);

  // Process each fish in this tank
  const updatedTankFish = fishWithDisease.map(fish => {
    let f = { ...fish };
    f.age = (f.age || 0) + 1;

    if (f.stage !== 'egg') {
      // Auto-feed effect
      if (autoFeedUsed) f.hunger = Math.max(0, (f.hunger || 0) - 35);
      f.hunger = Math.min(100, (f.hunger || 0) + HUNGER_RATE);

      const regen = HEALTH_REGEN * (bonuses.healthRegenMult || 1);

      // Additive damage — all active stressors compound, capped at 0.25/tick
      let dmg = 0;
      if (f.disease) {
        const disease = DISEASES[f.disease];
        if (disease) dmg += disease.healthDmgPerSec;
      }
      if (f.hunger >= 90) dmg += HEALTH_HUNGER_DMG;
      if (wq < 25)        dmg += HEALTH_WATER_DMG;
      if (tempStress)     dmg += 0.02;

      if (dmg > 0) {
        f.health = Math.max(0, f.health - Math.min(dmg, 0.25));
      } else if (f.hunger < 40 && wq > 60) {
        f.health = Math.min(100, f.health + regen);
      }
    }

    // Growth stage progression
    const stageDuration  = GROWTH_STAGES[f.stage]?.durationMs ?? Infinity;
    const timeInStage    = now - f.stageStartedAt;
    const hatcheryMult   = 1 - hatcheryLevel * 0.15;           // -15 / -30 / -45% grow time
    const growMult       = (bonuses.growSpeedMult || 1) * hatcheryMult;

    if (f.stage === 'egg' && timeInStage >= stageDuration * growMult) {
      f.stage = 'juvenile'; f.stageStartedAt = now;
      messages.push(`🐣 An egg in ${tank.name} hatched into a ${f.species?.name || 'fish'}!`);
    } else if (f.stage === 'juvenile' && timeInStage >= stageDuration * growMult) {
      f.stage = 'adult'; f.stageStartedAt = now;
      messages.push(`🐟 A ${f.species?.name || 'fish'} in ${tank.name} grew into an adult!`);
    }

    return f;
  });

  // Tank happiness
  const adults = updatedTankFish.filter(f => f.stage !== 'egg');
  let happiness = 100;
  if (adults.length > 0) {
    const avgHealth = adults.reduce((s, f) => s + (f.health || 100), 0) / adults.length;
    const avgHunger = adults.reduce((s, f) => s + (f.hunger || 0),   0) / adults.length;
    happiness = Math.round((avgHealth * 0.4) + (Math.max(0, 100 - avgHunger) * 0.35) + (wq * 0.25));
  }

  const updatedTank = {
    ...tank,
    waterQuality: wq,
    temperature: newTemp,
    happiness,
    autoFeedTick: (autoFeedUsed || autoFeedTriggered) ? 0 : Math.min(feedTick, 40),  // reset after interval fires; cap at 40 when out of food
    supplies,
  };

  return { updatedTank, updatedTankFish };
}

// ============================================================
// DAILY CHALLENGES
// ============================================================
const CHALLENGE_TEMPLATES = [
  { id: 'sell_common',    emoji: '🐟', desc: 'Sell 3 common fish today',          type: 'sell_rarity',   rarity: 'common',   goal: 3,  reward: 40  },
  { id: 'sell_uncommon',  emoji: '✨', desc: 'Sell 2 uncommon fish today',         type: 'sell_rarity',   rarity: 'uncommon', goal: 2,  reward: 80  },
  { id: 'sell_rare',      emoji: '💎', desc: 'Sell 1 rare fish today',             type: 'sell_rarity',   rarity: 'rare',     goal: 1,  reward: 150 },
  { id: 'earn_coins',     emoji: '🪙', desc: 'Earn 200 coins today',               type: 'earn_coins',    goal: 200,          reward: 60  },
  { id: 'breed_eggs',     emoji: '🥚', desc: 'Collect 2 eggs from breeding today', type: 'breed_eggs',    goal: 2,            reward: 70  },
  { id: 'treat_water',    emoji: '🧪', desc: 'Treat water quality 2 times today',  type: 'treat_water',   goal: 2,            reward: 35  },
  { id: 'cure_fish',      emoji: '💊', desc: 'Cure a sick fish today',             type: 'cure_fish',     goal: 1,            reward: 50  },
  { id: 'happiness_high', emoji: '😊', desc: 'Keep tank happiness above 90% for 10 minutes', type: 'happiness_timer', goal: 600, reward: 55 },
  { id: 'sell_5_fish',    emoji: '🛒', desc: 'Sell 5 fish in total today',         type: 'sell_any',      goal: 5,            reward: 90  },
  { id: 'discover',       emoji: '🔍', desc: 'Discover 1 new species today',       type: 'discover',      goal: 1,            reward: 100 },
];

function todayUTCDay() {
  return Math.floor(Date.now() / 86_400_000);
}

function generateDailyChallenges(day) {
  // Shuffle and pick 3 diverse challenges
  const shuffled = [...CHALLENGE_TEMPLATES].sort(() => Math.random() - 0.5);
  const picked = [];
  const types = new Set();
  for (const t of shuffled) {
    if (!types.has(t.type.split('_')[0])) {
      picked.push({ ...t, progress: 0, completed: false });
      types.add(t.type.split('_')[0]);
    }
    if (picked.length === 3) break;
  }
  // Fallback: if we couldn't get 3 diverse ones, just take first 3
  while (picked.length < 3) {
    const next = shuffled[picked.length];
    if (next) picked.push({ ...next, progress: 0, completed: false });
  }
  return { day, challenges: picked };
}

export function refreshDailyChallenges(state) {
  const today = todayUTCDay();
  const dc = state.dailyChallenges;
  if (!dc || dc.day !== today) {
    return { ...state, dailyChallenges: generateDailyChallenges(today) };
  }
  return state;
}

// Called from App.jsx when a challenge-relevant event occurs
export function updateChallengeProgress(state, eventType, payload = {}) {
  const dc = state.dailyChallenges;
  if (!dc || !dc.challenges) return state;
  const today = todayUTCDay();
  if (dc.day !== today) return state;

  let coinsAwarded = 0;
  const messages = [];
  const updated = dc.challenges.map(c => {
    if (c.completed) return c;
    let progress = c.progress;
    let matches = false;

    if (c.type === 'sell_rarity' && eventType === 'sell' && payload.rarity === c.rarity) {
      matches = true; progress += 1;
    } else if (c.type === 'sell_any' && eventType === 'sell') {
      matches = true; progress += 1;
    } else if (c.type === 'earn_coins' && eventType === 'earn_coins') {
      matches = true; progress += (payload.amount || 0);
    } else if (c.type === 'breed_eggs' && eventType === 'collect_egg') {
      matches = true; progress += 1;
    } else if (c.type === 'treat_water' && eventType === 'treat_water') {
      matches = true; progress += 1;
    } else if (c.type === 'cure_fish' && eventType === 'cure_fish') {
      matches = true; progress += 1;
    } else if (c.type === 'discover' && eventType === 'discover') {
      matches = true; progress += 1;
    } else if (c.type === 'happiness_timer' && eventType === 'happiness_tick') {
      // payload.tanks = array of happiness values
      // Challenge says "tank happiness" (singular) — any one tank ≥ 90% counts
      const anyHigh = (payload.tanks || []).some(h => h >= 90);
      if (anyHigh) { matches = true; progress += 1; }
    }

    if (!matches) return c;
    const completed = progress >= c.goal;
    if (completed && !c.completed) {
      coinsAwarded += c.reward;
      messages.push(`🎯 Daily challenge complete: ${c.emoji} ${c.desc}! +🪙${c.reward}`);
    }
    return { ...c, progress: Math.min(progress, c.goal), completed };
  });

  let next = { ...state, dailyChallenges: { ...dc, challenges: updated } };
  if (coinsAwarded > 0) {
    next = { ...next, player: { ...next.player, coins: next.player.coins + coinsAwarded } };
  }
  if (messages.length > 0) {
    const entries = messages.map(message => ({ time: Date.now(), message, severity: 'warn' }));
    next = { ...next, log: [...entries, ...next.log].slice(0, 60) };
  }
  return next;
}

// ============================================================
// SINGLE TICK
// ============================================================
export function processTick(state) {
  // Guard against corrupt state — should never happen but prevents a total crash
  if (!state || !Array.isArray(state.fish) || !Array.isArray(state.tanks)) return state;
  let next = { ...state };
  const messages = [];
  const now = Date.now();

  // Process each tank independently.
  // Build a Map of fishId → fish for O(1) replacement instead of
  // repeatedly filter+spread the whole array for each tank.
  const updatedTanks = [];
  const fishById = new Map(next.fish.map(f => [f.id, f]));

  for (const tank of next.tanks) {
    const { updatedTank, updatedTankFish } = processOneTank(tank, [...fishById.values()], messages, now, next.shop?.upgrades?.hatchery?.level || 0);
    updatedTanks.push(updatedTank);
    for (const f of updatedTankFish) fishById.set(f.id, f);
  }

  let updatedFish = [...fishById.values()];
  next = { ...next, tanks: updatedTanks, fish: updatedFish };

  // Remove dead fish from all tanks — record autopsy data
  const deadFish = next.fish.filter(f => f.stage !== 'egg' && f.health <= 0);
  if (deadFish.length > 0) {
    const deadIds = new Set(deadFish.map(f => f.id));
    // Build autopsy records
    const now2 = Date.now();
    const newAutopsies = deadFish.map(f => {
      const tank = next.tanks.find(t => t.id === f.tankId);
      // Determine cause of death
      let cause = 'Unknown';
      let detail = '';
      if (f.disease) {
        cause = `${DISEASES[f.disease]?.name || f.disease}`;
        detail = DISEASES[f.disease]?.desc || '';
      } else if (f.hunger >= 90) {
        cause = 'Starvation';
        detail = 'Hunger reached critical levels.';
      } else if ((tank?.waterQuality ?? 100) < 25) {
        cause = 'Water Toxicity';
        detail = 'Water quality was critically low.';
      } else if ((tank?.temperature ?? 74) < 65 || (tank?.temperature ?? 74) > 85) {
        cause = 'Temperature Shock';
        detail = 'Tank temperature was out of safe range.';
      } else {
        cause = 'Old Age / Unknown';
        detail = 'Fish died without a clear stressor.';
      }
      return {
        id: crypto.randomUUID(),
        _fishId: f.id,
        fishName: f.species?.name || 'Unknown',
        rarity: f.species?.rarity || 'common',
        phenotype: f.phenotype,
        genome: f.genome,
        diedAt: now2,
        ageMinutes: Math.floor((f.age || 0) / 60),
        cause,
        detail,
        tankName: tank?.name || 'Unknown Tank',
        waterQuality: Math.round(tank?.waterQuality ?? 0),
        hunger: Math.round(f.hunger || 0),
        disease: f.disease || null,
      };
    });
    next = {
      ...next,
      fish: next.fish.filter(f => !deadIds.has(f.id)),
      shop: { ...next.shop, listedFish: next.shop.listedFish.filter(id => !deadIds.has(id)) },
      breedingTank: {
        ...next.breedingTank,
        slots: next.breedingTank.slots.map(s => deadIds.has(s) ? null : s),
      },
      player: {
        ...next.player,
        autopsies: [...(next.player.autopsies || []), ...newAutopsies].slice(0, 50),
      },
    };
    for (const f of deadFish) messages.push(`💀 ${f.species?.name || 'A fish'} has died. (Cause: ${newAutopsies.find(a => a._fishId === f.id)?.cause || 'Unknown'})`);
  }

  // Breeding tank timer
  const bt = next.breedingTank;
  if (bt.breedingStartedAt && !bt.eggReady) {
    // Clear stored genome for any parent that died this tick so collectEgg()
    // cannot silently produce offspring from a dead fish's DNA.
    const deadIdSet = new Set(deadFish.map(f => f.id));
    const genomeA = deadIdSet.has(bt.slots[0]) ? null : bt.storedGenomeA;
    const genomeB = deadIdSet.has(bt.slots[1]) ? null : bt.storedGenomeB;
    const btCurrent = (genomeA !== bt.storedGenomeA || genomeB !== bt.storedGenomeB)
      ? { ...bt, storedGenomeA: genomeA, storedGenomeB: genomeB }
      : bt;

    const bothSlotsEmpty = !btCurrent.slots[0] && !btCurrent.slots[1];
    const hasGenomes = btCurrent.storedGenomeA && btCurrent.storedGenomeB;
    if (bothSlotsEmpty && !hasGenomes) {
      // Parents died AND no stored genomes — cancel breeding
      next = { ...next, breedingTank: { ...btCurrent, breedingStartedAt: null, slots: [null, null] } };
      messages.push('💔 Breeding cancelled — both parents are gone.');
    } else if (now - btCurrent.breedingStartedAt >= btCurrent.breedingDurationMs) {
      next = { ...next, breedingTank: { ...btCurrent, eggReady: true } };
      messages.push('🥚 A breeding egg is ready to collect!');
    } else {
      next = { ...next, breedingTank: btCurrent };
    }
  }

  // Customer visits
  const customerInterval = getCustomerInterval(next);
  if (now - next.shop.lastCustomerAt >= customerInterval && next.shop.listedFish.length > 0) {
    next = processCustomerVisit(next, messages);
  }

  // Batch all messages into one state update — avoids N full state spreads
  // Passive income: once per minute, happy tanks with adult fish earn visitor tips
  const passiveTick = (next.passiveTick || 0) + 1;
  if (passiveTick >= PASSIVE_INCOME_INTERVAL) {
    let tip = 0;
    for (const tank of next.tanks) {
      const adults = next.fish.filter(f => f.tankId === tank.id && f.stage === 'adult');
      if (adults.length === 0) continue;
      const placed = tank.decorations?.placed?.length || 0;
      const decorMult = 1 + Math.min(10, placed) * PASSIVE_DECOR_BONUS;
      tip += Math.floor((tank.happiness / 100) * decorMult * PASSIVE_INCOME_BASE);
    }
    if (tip > 0) {
      next = { ...next, player: { ...next.player, coins: next.player.coins + tip, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + tip } };
      messages.push(`💰 Visitors left a ${tip}-coin tip!`);
      // Passive tips count toward the daily earn coins challenge alongside sales.
      next = updateChallengeProgress(next, 'earn_coins', { amount: tip });
    }
    next = { ...next, passiveTick: 0 };
  } else {
    next = { ...next, passiveTick };
  }

  // Refresh daily challenges at UTC midnight and track happiness timer challenge
  next = refreshDailyChallenges(next);
  const happinessValues = next.tanks.map(t => t.happiness || 0);
  next = updateChallengeProgress(next, 'happiness_tick', { tanks: happinessValues });

  // survived_night — only evaluated during the 11 pm–6 am window AND only
  // when the achievement hasn't been earned yet.  We use player.nightWatchEarned
  // as a fast boolean flag so we avoid scanning the full achievements array
  // (and doing the fish loop) on every tick outside that window or after it fires.
  if (!next.player.nightWatchEarned) {
    const hour = new Date().getHours();
    if (hour >= 23 || hour < 6) {
      if (next.fish.length > 0 && next.fish.every(f => (f.health || 0) > 0)) {
        const NIGHT_REWARD = 500; // secret tier
        next = {
          ...next,
          player: {
            ...next.player,
            coins: next.player.coins + NIGHT_REWARD,
            nightWatchEarned: true,
            achievements: [
              ...(next.player.achievements || []),
              { id: 'survived_night', unlockedAt: Date.now(), reward: NIGHT_REWARD },
            ],
          },
        };
        messages.push('🌙 Achievement unlocked: Night Watch! All fish survived the night. +🪙500');
      }
    }
  }

  if (messages.length > 0) {
    const newEntries = messages.map(m =>
      typeof m === 'string' ? { time: Date.now(), message: m } : { time: Date.now(), ...m }
    );
    next = { ...next, log: [...newEntries, ...next.log].slice(0, 60) };
  }

  return { ...next, lastTickAt: now };
}
// ============================================================
// CUSTOMER
// ============================================================
function getCustomerInterval(state) {
  const repBonus = Math.min(0.5, (state.shop.reputation || 0) / 200);
  const adLevel  = state.shop.upgrades?.reputation?.level || 0;
  const adBonus  = adLevel * 0.15;
  return Math.round(CUSTOMER_BASE_INTERVAL_MS * (1 - Math.min(0.75, repBonus + adBonus)));
}

function pickCustomerType(state) {
  const level    = state.shop.level || 1;
  const rep      = state.shop.reputation || 0;
  const vipLevel = state.shop.upgrades?.vip?.level || 0;

  // VIP Membership lowers the rep threshold for Wealthy Patron and eventually removes the shop-level gate
  const richRepThreshold   = vipLevel >= 2 ? 10 : vipLevel >= 1 ? 25 : 50;
  const richLevelThreshold = vipLevel >= 3 ? 1  : 3;

  const pool = CUSTOMER_TYPES.filter(c => {
    if (c.id === 'rich'      && (level < richLevelThreshold || rep < richRepThreshold)) return false;
    if (c.id === 'collector' && level < 2) return false;
    return true;
  });

  // VIP Membership also doubles the chance of a Wealthy Patron appearing (add an extra entry)
  const weighted = [...pool];
  if (vipLevel >= 1 && pool.some(c => c.id === 'rich')) {
    const rich = pool.find(c => c.id === 'rich');
    weighted.push(rich); // second slot = twice as likely
    if (vipLevel >= 3) weighted.push(rich); // triple at max
  }

  return weighted[Math.floor(Math.random() * weighted.length)];
}

function pickFishToBuy(listedIds, fish, customer) {
  const listed = listedIds.map(id => fish.find(f => f.id === id)).filter(Boolean);
  if (listed.length === 0) return null;
  const biasLevel = RARITY_ORDER[customer.rarityBias] ?? 0;
  const scored = listed.map(f => {
    const diff = Math.abs((RARITY_ORDER[f.species?.rarity ?? 'common'] ?? 0) - biasLevel);
    return { fish: f, score: Math.random() * 0.4 + (1 / (diff + 1)) };
  }).sort((a, b) => b.score - a.score);
  return scored[0].fish;
}

function processCustomerVisit(state, messages) {
  const customer = pickCustomerType(state);
  // Only consider fish the customer can afford (their budget vs ask price)
  const lightingBonus = 1 + (state.shop.upgrades?.lighting?.level || 0) * 0.10;
  const listedIds = state.shop.listedFish.filter(id => {
    const f = state.fish.find(fi => fi.id === id);
    if (!f) return false;
    const fishTank  = state.tanks.find(t => t.id === f.tankId);
    const tankBonus = getTankBonuses(fishTank?.type).salePriceMult || 1;
    const happiness = fishTank?.happiness ?? 100;
    const happBonus = 1 + (happiness / 100) * 0.2;
    const autoPrice = Math.round((f.species?.basePrice ?? 10) * (f.health / 100) * happBonus * tankBonus * lightingBonus);
    const askPrice  = state.shop.fishPrices?.[id] ?? autoPrice;
    const budget    = Math.round(askPrice * customer.budgetMult);
    // Only show fish where budget meets at least the walkaway threshold (65% of ask price).
    // If nothing affordable is found, this customer simply doesn't visit — next one will.
    return budget >= Math.round(askPrice * 0.65);
  });

  // No fish in budget — customer passes without entering the shop at all
  if (listedIds.length === 0) return state;

  const fish = pickFishToBuy(listedIds, state.fish, customer);
  if (!fish) return state;

  // Display tank gives a sale price bonus; Premium Lighting adds on top
  const fishTank   = state.tanks.find(t => t.id === fish.tankId);
  const tankBonus  = getTankBonuses(fishTank?.type).salePriceMult || 1;
  const happiness  = fishTank?.happiness ?? 100;
  const happBonus  = 1 + (happiness / 100) * 0.2;
  const autoPrice  = Math.round((fish.species?.basePrice ?? 10) * (fish.health / 100) * happBonus * tankBonus * lightingBonus);
  const askPrice   = state.shop.fishPrices?.[fish.id] ?? autoPrice;

  // Customer budget is their max willingness to pay
  const maxBudget  = Math.round(askPrice * customer.budgetMult);

  // Haggle logic: customer tries to negotiate if price is above their comfort zone
  let finalPrice = askPrice;
  let priceNote  = '';
  const overBudget = askPrice > maxBudget;

  if (overBudget && customer.haggle > 0 && Math.random() < customer.haggle) {
    // Haggler makes a counteroffer
    const offer = Math.round(maxBudget * (0.85 + Math.random() * 0.15));
    finalPrice   = offer;
    priceNote    = ` (haggled down from 🪙${askPrice})`;
  } else if (overBudget) {
    // Not a haggler but can barely afford — they pay their max
    finalPrice = maxBudget;
    priceNote  = ` (paid max budget, asked 🪙${askPrice})`;
  } else if (askPrice < autoPrice * 0.7) {
    // Bargain! Customer is very happy — small rep bonus
    priceNote = ` (bargain price!)`;
  }

  const earnedCoins = Math.max(1, finalPrice);
  const repGain     = Math.ceil((fish.species?.rarityScore ?? 5) / 10) + (askPrice > autoPrice ? 1 : 0);

  messages.push(`${customer.emoji} ${customer.name} bought your ${fish.species?.name || 'fish'} for 🪙${earnedCoins}${priceNote}!`);

  // Clean up ask price after sale
  const fishPrices = { ...(state.shop.fishPrices || {}) };
  delete fishPrices[fish.id];

  const soldState = {
    ...state,
    player: {
      ...state.player,
      coins: state.player.coins + earnedCoins,
      totalCoinsEarned: (state.player.totalCoinsEarned || 0) + earnedCoins,
    },
    fish: state.fish.filter(f => f.id !== fish.id),
    shop: {
      ...state.shop,
      listedFish: state.shop.listedFish.filter(id => id !== fish.id),
      fishPrices,
      lastCustomerAt: Date.now(),
      reputation: Math.min(999, (state.shop.reputation || 0) + repGain),
      salesHistory: [
        {
          time: Date.now(), type: 'sale',
          customerName: customer.name, customerEmoji: customer.emoji,
          fishName: fish.species?.name || 'Unknown', fishRarity: fish.species?.rarity || 'common',
          coins: earnedCoins, askPrice,
        },
        ...(state.shop.salesHistory || []),
      ].slice(0, 20),
    },
  };
  // Update daily challenge progress for sell events.
  // 'sell' covers both sell_rarity and sell_any (see updateChallengeProgress).
  const afterSell = updateChallengeProgress(soldState, 'sell', { rarity: fish.species?.rarity || 'common' });
  return updateChallengeProgress(afterSell, 'earn_coins', { amount: earnedCoins });
}

// ============================================================
// OFFLINE PROGRESS & DISCOVERY EVENTS
// ============================================================
const OFFLINE_FOUND_ITEMS = [
  { id: 'pearl_snail',   label: 'Pearl Snail Shell',  emoji: '🐚', desc: 'A lustrous spiral shell left behind by a passing snail.' },
  { id: 'driftwood',     label: 'Smooth Driftwood',   emoji: '🪵', desc: 'Worn smooth by current. Would look great in any tank.' },
  { id: 'mystery_stone', label: 'Glowing Pebble',     emoji: '🪨', desc: 'Faintly luminescent. No one knows why.' },
  { id: 'ancient_coin',  label: 'Ancient Coin',       emoji: '🪙', desc: 'A corroded coin of unknown origin. Worth keeping.' },
  { id: 'kelp_fragment', label: 'Rare Kelp Sprig',    emoji: '🌿', desc: 'A cutting from a deep-water kelp variety.' },
  { id: 'glass_float',   label: 'Glass Float',        emoji: '🔵', desc: 'An old fisherman\'s float, perfectly preserved.' },
];

const OFFLINE_MESSAGES = [
  { type: 'calm',      text: 'The tanks were peaceful.',                          emoji: '😌' },
  { type: 'calm',      text: 'Everything stayed in order.',                       emoji: '🌊' },
  { type: 'calm',      text: 'Your fish hardly noticed you were gone.',           emoji: '🐟' },
  { type: 'curious',   text: 'The fish seemed restless near the glass.',          emoji: '👀' },
  { type: 'curious',   text: 'An unusual current stirred the water briefly.',     emoji: '🌀' },
  { type: 'curious',   text: 'The lights flickered for a moment, then steadied.', emoji: '💡' },
];

function generateOfflineEvent(state, secondsAway) {
  // Events only fire after 5+ minutes away; longer absences = more likely
  const minutes = secondsAway / 60;
  if (minutes < 5) return null;

  const roll = Math.random();
  const eventChance = Math.min(0.85, 0.3 + (minutes / 120) * 0.55); // 30%–85%
  if (roll > eventChance) return null;

  const eventRoll = Math.random();
  // Pick the tank with the most available space so the visitor has room.
  const tankId = (state.tanks.reduce((best, t) => {
    const used = state.fish.filter(f => f.tankId === t.id).length;
    const free = (t.capacity || 12) - used;
    const bestUsed = state.fish.filter(f => f.tankId === best.id).length;
    const bestFree = (best.capacity || 12) - bestUsed;
    return free > bestFree ? t : best;
  }, state.tanks[0]))?.id || 'tank_0';

  // Visitor fish: rare stranger appears in your tank (30% of events)
  if (eventRoll < 0.30) {
    const targetRarity = Math.random() < 0.6 ? 'uncommon' : 'rare';
    const visitor = createFish({ stage: 'adult', tankId, targetRarity });
    return {
      type: 'visitor',
      emoji: '🐠',
      headline: 'A visitor arrived!',
      detail: `A wild **${visitor.species?.name || 'fish'}** (${visitor.species?.rarity || 'common'}) swam in through a gap in the lid and decided to stay.`,
      fish: visitor,
    };
  }

  // Found item: a collectible appears (40% of events)
  if (eventRoll < 0.70) {
    const item = OFFLINE_FOUND_ITEMS[Math.floor(Math.random() * OFFLINE_FOUND_ITEMS.length)];
    const bonus = Math.floor(15 + Math.random() * 40);
    return {
      type: 'found_item',
      emoji: item.emoji,
      headline: `Found: ${item.label}`,
      detail: item.desc,
      coinBonus: bonus,
      itemId: item.id,
    };
  }

  // Spontaneous mutation: one of your juveniles hatched with unusual colouring (30% of events)
  const juveniles = state.fish.filter(f => f.stage === 'juvenile' || f.stage === 'egg');
  if (juveniles.length > 0) {
    const subject = juveniles[Math.floor(Math.random() * juveniles.length)];
    return {
      type: 'mutation',
      emoji: '✨',
      headline: 'Spontaneous mutation!',
      detail: `**${subject.species?.name || 'A fish'}** developed an unusual shimmer during the night. Its value may be higher than expected.`,
      fishId: subject.id,
    };
  }

  // Fallback to found item
  const item = OFFLINE_FOUND_ITEMS[Math.floor(Math.random() * OFFLINE_FOUND_ITEMS.length)];
  return {
    type: 'found_item',
    emoji: item.emoji,
    headline: `Found: ${item.label}`,
    detail: item.desc,
    coinBonus: Math.floor(15 + Math.random() * 35),
    itemId: item.id,
  };
}

export function applyOfflineProgress(state) {
  const now             = Date.now();
  const elapsed         = now - (state.lastTickAt || now);
  const tankSitterLevel = state.shop?.upgrades?.tankSitter?.level || 0;
  const maxOfflineSecs  = BASE_OFFLINE_SECONDS + tankSitterLevel * TANK_SITTER_BONUS_SECONDS;
  const secondsElapsed  = Math.min(Math.floor(elapsed / 1000), maxOfflineSecs);

  if (secondsElapsed < 5) return state;

  let next = { ...state };
  let eggsHatched = 0, fishedGrown = 0, coinsEarned = 0, fishSold = 0;

  // Update each tank's water quality
  next = {
    ...next,
    tanks: next.tanks.map(t => ({
      ...t,
      waterQuality: Math.max(0, t.waterQuality - WATER_DECAY_RATE * secondsElapsed),
    })),
  };

  // Bulk fish update per tank.
  // NOTE: `{ ...fish }` is a shallow copy — fish.genome, fish.species, and
  // fish.phenotype are still shared references. Only mutate top-level scalar
  // fields (age, hunger, health, stage, stageStartedAt) on `f`; never mutate
  // nested objects in place or you'll corrupt the original state.
  const updatedFish = next.fish.map(fish => {
    let f   = { ...fish };
    f.age   = (f.age || 0) + secondsElapsed;
    const tank = next.tanks.find(t => t.id === f.tankId);
    const bonuses = getTankBonuses(tank?.type);

    if (f.stage !== 'egg') {
      f.hunger = Math.min(100, (f.hunger || 0) + HUNGER_RATE * secondsElapsed);
      if (f.hunger >= 90) f.health = Math.max(0, f.health - HEALTH_HUNGER_DMG * secondsElapsed * 0.5);
    }

    // Stage progression
    let remaining = secondsElapsed * 1000;
    let stageStart = f.stageStartedAt;
    const lastTick = state.lastTickAt || now;
    const hatcheryLevel = next.shop?.upgrades?.hatchery?.level || 0;
    const hatcheryMult  = 1 - hatcheryLevel * 0.15;
    const growMult = (bonuses.growSpeedMult || 1) * hatcheryMult;

    if (f.stage === 'egg') {
      const timeAlready = lastTick - stageStart;
      const timeToHatch = Math.max(0, GROWTH_STAGES.egg.durationMs * growMult - timeAlready);
      if (remaining >= timeToHatch) {
        f.stage = 'juvenile';
        remaining -= timeToHatch; // remaining = ms left in offline window after hatch
        stageStart = now - remaining; // juvenile started `remaining` ms ago
        eggsHatched++;
      }
    }
    if (f.stage === 'juvenile') {
      // For pre-existing juveniles: timeAlready = elapsed time since stageStart.
      // For eggs that just hatched above: stageStart = now - remaining, so timeAlready = remaining,
      // correctly reflecting how far into juvenile they already are.
      const timeAlready = now - stageStart;
      const timeToGrow  = Math.max(0, GROWTH_STAGES.juvenile.durationMs * growMult - timeAlready);
      if (timeToGrow === 0) {
        f.stage = 'adult'; stageStart = now; fishedGrown++;
      }
    }
    f.stageStartedAt = stageStart;
    return f;
  });

  next = { ...next, fish: updatedFish };

  // Remove fish that died offline (health <= 0), clean up shop listings + breeding slots
  const offlineDeadFish = next.fish.filter(f => f.stage !== 'egg' && f.health <= 0);
  if (offlineDeadFish.length > 0) {
    const deadIds = new Set(offlineDeadFish.map(f => f.id));
    const offlineAutopsies = offlineDeadFish.map(f => {
      const tank = next.tanks.find(t => t.id === f.tankId);
      return {
        id: crypto.randomUUID(),
        fishName: f.species?.name || 'Unknown', rarity: f.species?.rarity || 'common',
        phenotype: f.phenotype, genome: f.genome,
        diedAt: now, ageMinutes: Math.floor((f.age || 0) / 60),
        cause: f.hunger >= 90 ? 'Starvation (offline)' : 'Poor conditions (offline)',
        detail: 'Fish died while you were away.',
        tankName: tank?.name || 'Unknown Tank',
        waterQuality: Math.round(tank?.waterQuality ?? 0),
        hunger: Math.round(f.hunger || 0), disease: f.disease || null,
      };
    });
    next = {
      ...next,
      fish: next.fish.filter(f => !deadIds.has(f.id)),
      shop: { ...next.shop, listedFish: next.shop.listedFish.filter(id => !deadIds.has(id)) },
      breedingTank: {
        ...next.breedingTank,
        slots: next.breedingTank.slots.map(s => deadIds.has(s) ? null : s),
      },
      player: {
        ...next.player,
        autopsies: [...(next.player.autopsies || []), ...offlineAutopsies].slice(0, 50),
      },
    };
  }

  // Offline customer visits
  const customerInterval = getCustomerInterval(next);
  const actualVisits = Math.min(
    Math.floor((secondsElapsed * 1000) / customerInterval),
    next.shop.listedFish.length * 3,
    15,
  );
  for (let i = 0; i < actualVisits && next.shop.listedFish.length > 0; i++) {
    const msgs = [];
    const prevCoins = next.player.coins;
    next = processCustomerVisit(next, msgs);
    const earned = next.player.coins - prevCoins;
    if (earned > 0) { coinsEarned += earned; fishSold++; }
  }

  // Breeding tank
  const bt = next.breedingTank;
  if (bt.breedingStartedAt && !bt.eggReady && now - bt.breedingStartedAt >= bt.breedingDurationMs) {
    next = { ...next, breedingTank: { ...bt, eggReady: true } };
  }

  // Generate a discovery event
  const offlineEvent = generateOfflineEvent(state, secondsElapsed);
  if (offlineEvent) {
    if (offlineEvent.type === 'visitor' && offlineEvent.fish) {
      const tank = next.tanks.find(t => t.id === offlineEvent.fish.tankId);
      const count = next.fish.filter(f => f.tankId === offlineEvent.fish.tankId).length;
      if (count < (tank?.capacity || 12)) {
        next = { ...next, fish: [...next.fish, offlineEvent.fish] };
      }
    }
    if (offlineEvent.type === 'found_item' && offlineEvent.coinBonus) {
      next = { ...next, player: { ...next.player, coins: next.player.coins + offlineEvent.coinBonus } };
    }
    if (offlineEvent.type === 'mutation' && offlineEvent.fishId) {
      next = {
        ...next,
        fish: next.fish.map(f => f.id === offlineEvent.fishId
          ? { ...f, species: { ...f.species, basePrice: Math.round((f.species?.basePrice ?? 10) * 1.5) }, _mutated: true }
          : f
        ),
      };
    }
  }

  // Summary
  next = { ...next, lastTickAt: now };
  const minutes = Math.round(secondsElapsed / 60);
  const timeLabel = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const ambientMsg = OFFLINE_MESSAGES[Math.floor(Math.random() * OFFLINE_MESSAGES.length)];
  const offlineSummary = {
    timeAway: timeLabel, secondsAway: secondsElapsed,
    eggsHatched, fishedGrown, coinsEarned, fishSold,
    waterQualityLost: Math.round(WATER_DECAY_RATE * secondsElapsed),
    fishDied: offlineDeadFish.length,
    offlineEvent,
    ambientMessage: ambientMsg,
    hasEvents: eggsHatched > 0 || fishedGrown > 0 || coinsEarned > 0 || offlineDeadFish.length > 0 || !!offlineEvent,
  };
  next = { ...next, offlineSummary };

  if (offlineSummary.hasEvents) {
    const parts = [];
    if (eggsHatched) parts.push(`${eggsHatched} egg${eggsHatched > 1 ? 's' : ''} hatched`);
    if (fishedGrown) parts.push(`${fishedGrown} fish grew up`);
    if (fishSold)    parts.push(`sold ${fishSold} fish for 🪙${coinsEarned}`);
    next = addLog(next, `⏰ Back after ${timeLabel}! ${parts.join(', ')}.`);
  } else {
    next = addLog(next, `⏰ Back after ${timeLabel}. Your tanks are peaceful.`);
  }

  return next;
}
