// ============================================================
// FISH TYCOON 2 — GAME TICK SYSTEM v7 (multi-tank)
// ============================================================

import { GROWTH_STAGES, createFish } from '../data/genetics.js';
import { addLog } from '../data/gameState.js';

export const TICK_INTERVAL_MS = 1000;

// ============================================================
// MARKET PRICE FLUCTUATION SYSTEM
// Each UTC day generates new market conditions that affect all
// sale prices. Gives players a reason to time their sales.
// ============================================================
const MARKET_HEADLINES = [
  { mod: { common: 0.7, uncommon: 1.0, rare: 1.3, epic: 1.5 },  text: '📈 Rare fish market booming! Collectors paying top coin.' },
  { mod: { common: 1.4, uncommon: 1.1, rare: 0.9, epic: 0.8 },  text: '🐟 Common fish craze! Everyone wants an easy starter pet.' },
  { mod: { common: 0.9, uncommon: 1.3, rare: 1.1, epic: 1.0 },  text: '🌊 Mid-tier demand is high. Hobbyists are browsing.' },
  { mod: { common: 1.0, uncommon: 0.8, rare: 1.0, epic: 1.8 },  text: '💎 High-end buyers in town. Epic fish fetch premium prices.' },
  { mod: { common: 1.1, uncommon: 1.1, rare: 1.1, epic: 1.1 },  text: '☀️ Good weather brings steady foot traffic. Prices are fair.' },
  { mod: { common: 0.8, uncommon: 0.9, rare: 0.8, epic: 0.9 },  text: '📉 Slow day at the market. Buyers are cautious with coin.' },
  { mod: { common: 1.2, uncommon: 1.2, rare: 0.7, epic: 0.7 },  text: '🎪 Fish fair in town! Budget shoppers flooding in.' },
  { mod: { common: 0.9, uncommon: 1.0, rare: 1.4, epic: 1.2 },  text: '🧐 Collector convention nearby. Rare finds sell fast.' },
];

const HOT_TRAITS = [
  { gene: 'primaryColor', value: 'Crimson', label: '🔴 Crimson fish', bonus: 1.4 },
  { gene: 'primaryColor', value: 'Gold',    label: '🟡 Gold fish',    bonus: 1.4 },
  { gene: 'primaryColor', value: 'Azure',   label: '🔵 Azure fish',   bonus: 1.4 },
  { gene: 'primaryColor', value: 'Violet',  label: '🟣 Violet fish',  bonus: 1.5 },
  { gene: 'primaryColor', value: 'Emerald', label: '🟢 Emerald fish', bonus: 1.5 },
  { gene: 'glow',         value: 'Luminous', label: '✨ Glowing fish', bonus: 1.6 },
  { gene: 'glow',         value: 'Radiant',  label: '🌟 Radiant fish', bonus: 1.3 },
  { gene: 'mutation',     value: 'Albino',    label: '🤍 Albino fish',  bonus: 1.5 },
  { gene: 'mutation',     value: 'Twin-tail', label: '🐟 Twin-tail fish', bonus: 1.4 },
  { gene: 'bodyShape',    value: 'Eel',      label: '🐍 Eel-shaped fish', bonus: 1.3 },
  { gene: 'size',         value: 'Leviathan', label: '🐋 Leviathan fish',  bonus: 1.5 },
  { gene: 'pattern',      value: 'Tiger',    label: '🐯 Tiger-pattern fish', bonus: 1.3 },
];

export function refreshMarket(state) {
  const today = todayUTCDay();
  if (state.market?.day === today) return state;

  const rng = seededRandom(today * 1337);
  const headline = MARKET_HEADLINES[Math.floor(rng() * MARKET_HEADLINES.length)];
  const hotTrait = rng() < 0.7
    ? HOT_TRAITS[Math.floor(rng() * HOT_TRAITS.length)]
    : null;

  // Add small random noise ±10% to base modifiers for variety
  const modifiers = {};
  for (const [rarity, base] of Object.entries(headline.mod)) {
    modifiers[rarity] = Math.round((base + (rng() - 0.5) * 0.2) * 100) / 100;
  }

  const hotLabel = hotTrait ? ` ${hotTrait.label} are in demand today!` : '';
  const market = {
    day: today,
    modifiers,
    hotTrait: hotTrait ? { gene: hotTrait.gene, value: hotTrait.value, bonus: hotTrait.bonus, label: hotTrait.label } : null,
    headline: headline.text + hotLabel,
  };

  let next = { ...state, market };
  next = { ...next, log: [{ time: Date.now(), message: `📊 ${market.headline}`, severity: 'info' }, ...next.log].slice(0, 60) };
  return next;
}

/** Get the market multiplier for a specific fish */
export function getMarketMultiplier(fish, market) {
  if (!market || !market.modifiers) return 1.0;
  let mult = market.modifiers[fish.species?.rarity || 'common'] || 1.0;
  // Hot trait bonus
  if (market.hotTrait && fish.phenotype) {
    if (fish.phenotype[market.hotTrait.gene] === market.hotTrait.value) {
      mult *= market.hotTrait.bonus;
    }
  }
  return mult;
}

// ============================================================
// EARLY GAME EVENT SYSTEM
// Scripted events that fire once in the first few minutes to
// teach mechanics and create early engagement.
// ============================================================
const EARLY_EVENTS = [
  {
    id: 'firstCustomer',
    afterSecs: 45,           // 45 seconds in
    condition: (state) => state.fish.some(f => f.stage === 'adult'),
    fire: (state, messages) => {
      // Auto-list the first adult fish and trigger an immediate customer
      const adult = state.fish.find(f => f.stage === 'adult' && !state.shop.listedFish.includes(f.id));
      if (!adult) return state;
      messages.push({ message: `🔔 A customer is looking through the window! Try listing a fish for sale in the Shop tab.`, severity: 'warn' });
      // Force the next customer to arrive in 5 seconds
      return { ...state, shop: { ...state.shop, lastCustomerAt: Date.now() - 13_000 } };
    },
  },
  {
    id: 'giftEgg',
    afterSecs: 120,          // 2 minutes in
    fire: (state, messages) => {
      // Gift a free uncommon egg
      const tank = state.tanks[0];
      if (!tank) return state;
      const count = state.fish.filter(f => f.tankId === tank.id).length;
      if (count >= (tank.capacity || 12)) return state;
      const egg = createFish({ stage: 'egg', tankId: tank.id, targetRarity: 'uncommon' });
      messages.push({ message: `🎁 A mysterious egg appeared in your tank! It looks unusual...`, severity: 'warn' });
      messages.push({ message: `💡 Tip: Eggs hatch into juveniles, then grow into adults you can sell or breed.`, severity: 'info' });
      return { ...state, fish: [...state.fish, egg] };
    },
  },
  {
    id: 'breedHint',
    afterSecs: 300,          // 5 minutes in
    condition: (state) => state.fish.filter(f => f.stage === 'adult').length >= 2,
    fire: (state, messages) => {
      messages.push({ message: `🧬 You have two adult fish! Try the Breed tab to combine their traits and discover new species.`, severity: 'warn' });
      return state;
    },
  },
  {
    id: 'marketIntro',
    afterSecs: 180,          // 3 minutes in
    fire: (state, messages) => {
      messages.push({ message: `📊 The fish market shifts daily — check the Shop for today's hot traits and price trends!`, severity: 'info' });
      return state;
    },
  },
];

// --- RATES (per real second) ---
const HUNGER_RATE        = 0.012;  // 0→90 (damage threshold) in ~125 min (was 0.025 = ~60 min). One feeding now lasts ~62 min.
const WATER_DECAY_RATE   = 0.0008; // ~2.9 pts/hr — full tank lasts ~35 h (was 0.002 = ~7.2 pts/hr, ~14 h). Water treatment is a choice, not a chore.
const HEALTH_HUNGER_DMG  = 0.06;
const HEALTH_WATER_DMG   = 0.03;
const HEALTH_REGEN       = 0.025; // 50→100 in ~33 min (was 0.01 = ~83 min). Nursing a fish back is now visibly rewarding.
// Regen fires when hunger is below this threshold (fish is reasonably fed) and wq > 60.
// 60 matches the new hunger midpoint — fish fed once per hour sit around 40-50 hunger and now heal.
const HEALTH_REGEN_HUNGER_THRESHOLD = 60;

// --- PASSIVE INCOME ---
// Once per minute, tanks with adult fish trickle a small coin bonus
// based on happiness + placed decoration count.
// Max = floor(1.0 × (1 + 10×0.25) × 4) = 14 coins/min/tank at 100% happiness + 10 decor.
// Meaningful during fish-dry spells, negligible vs active selling.
const PASSIVE_INCOME_INTERVAL = 60;   // ticks (= 1 real minute)
// Auto-feed fires every AUTO_FEED_INTERVAL ticks (~40 seconds). The cap on
// autoFeedTick uses this constant so the two values stay in sync if changed.
const AUTO_FEED_INTERVAL = 40;
const PASSIVE_INCOME_BASE     = 4;    // coins/min at 100% happiness, 0 decor
const PASSIVE_DECOR_BONUS     = 0.25; // +25% per placed decoration, capped at 10

// --- DISEASE SYSTEM ---
export const DISEASES = {
  ich: {
    id: 'ich', name: 'Ich', emoji: '🔴',
    desc: 'White-spot disease. Spreads quickly between fish.',
    healthDmgPerSec: 0.02,
    spreadChancePerSec: 0.0008,
    color: '#ff4444',
    curedBy: 'antibiotic',
    treatmentName: 'Antibiotic',
  },
  fin_rot: {
    id: 'fin_rot', name: 'Fin Rot', emoji: '🟤',
    desc: 'Bacterial infection. Caused by poor water quality.',
    healthDmgPerSec: 0.01,
    spreadChancePerSec: 0.0003,
    color: '#a06020',
    curedBy: 'antibiotic',
    treatmentName: 'Antibiotic',
  },
  bloat: {
    id: 'bloat', name: 'Bloat', emoji: '🟡',
    desc: 'Digestive illness. Linked to overfeeding.',
    healthDmgPerSec: 0.015,
    spreadChancePerSec: 0,
    color: '#d4c020',
    curedBy: 'digestiveRemedy',
    treatmentName: 'Digestive Remedy',
  },
  velvet: {
    id: 'velvet', name: 'Velvet', emoji: '🟠',
    desc: 'Parasitic infection. Hard to spot until advanced.',
    healthDmgPerSec: 0.025,
    spreadChancePerSec: 0.001,
    color: '#e06820',
    curedBy: 'antiparasitic',
    treatmentName: 'Antiparasitic',
  },
};

// Disease outbreak chance factors (per second)
const DISEASE_BASE_CHANCE  = 0.000015; // base chance per fish per second (~5%/hr; was 0.00008 = ~25%/hr)
const DISEASE_WATER_MULT   = 2.0;      // multiplier when water quality < 30 (was 3.5)
const DISEASE_CROWD_MULT   = 1.5;      // multiplier when tank is >80% full (was 2.0)

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
function processOneTank(tank, tankFish, messages, now, hatcheryLevel = 0, playerBoosts = {}, upgradeLevels = {}) {
  const bonuses  = getTankBonuses(tank.type);

  // Active boost multipliers (boosts store expiry timestamps)
  const boostActive = (key) => (playerBoosts[key] || 0) > now;
  const growBoost      = boostActive('growSpeed')     ? 0.5  : 1.0; // 0.5 = 50% faster
  const regenBoost     = boostActive('healthRegen')   ? 3.0  : 1.0;

  // Water Purifier: -25% decay per level
  const purifierMult   = 1 - (upgradeLevels.purifier || 0) * 0.25;
  const wq        = Math.max(0, tank.waterQuality - WATER_DECAY_RATE * purifierMult);
  const temp      = tank.temperature ?? 74;
  // Climate Control: -30% drift per level
  const tempControlMult = 1 - (upgradeLevels.tempControl || 0) * 0.3;
  const baseDrift  = temp > 74 ? -0.002 : temp < 74 ? 0.002 : 0;
  const tempDrift  = baseDrift * tempControlMult;
  const newTemp   = Math.round((temp + tempDrift) * 1000) / 1000;
  const tempStress = newTemp < 65 || newTemp > 85;

  // Auto-feed
  let supplies = { ...tank.supplies };
  const feedTick = (tank.autoFeedTick || 0) + 1;
  let autoFeedUsed = false;
  let autoFeedTriggered = false; // true when the interval fired, regardless of outcome
  if (tank.autoFeed && feedTick >= AUTO_FEED_INTERVAL && supplies.food > 0) {
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

      const regen = HEALTH_REGEN * (bonuses.healthRegenMult || 1) * regenBoost;

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
      } else if (f.hunger < HEALTH_REGEN_HUNGER_THRESHOLD && wq > 60) {
        f.health = Math.min(100, f.health + regen);
      }
    }

    // Growth stage progression
    const stageDuration  = GROWTH_STAGES[f.stage]?.durationMs ?? Infinity;
    const timeInStage    = now - f.stageStartedAt;
    const hatcheryMult   = 1 - hatcheryLevel * 0.15;
    const growMult       = (bonuses.growSpeedMult || 1) * hatcheryMult * growBoost;

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
    autoFeedTick: (autoFeedUsed || autoFeedTriggered) ? 0 : Math.min(feedTick, AUTO_FEED_INTERVAL),  // reset after interval fires; cap at AUTO_FEED_INTERVAL when out of food
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
  { id: 'treat_water',    emoji: '🧪', desc: 'Treat water quality once today',      type: 'treat_water',   goal: 1,            reward: 50  },
  { id: 'cure_fish',      emoji: '💊', desc: 'Cure a sick fish today',             type: 'cure_fish',     goal: 1,            reward: 50  },
  { id: 'happiness_high', emoji: '😊', desc: 'Keep tank happiness above 90% for 10 minutes', type: 'happiness_timer', goal: 600, reward: 55 },
  { id: 'sell_5_fish',    emoji: '🛒', desc: 'Sell 5 fish in total today',         type: 'sell_any',      goal: 5,            reward: 90  },
  { id: 'discover',       emoji: '🔍', desc: 'Discover 1 new species today',       type: 'discover',      goal: 1,            reward: 100 },
];

function todayUTCDay() {
  return Math.floor(Date.now() / 86_400_000);
}

// Simple LCG seeded PRNG — same seed → same sequence on every device for a given day
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function generateDailyChallenges(day) {
  // Seed on UTC day so every device produces the same challenges for the same day
  const rng = seededRandom(day * 2654435761);
  const shuffled = [...CHALLENGE_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
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
    // Check if the previous day had all challenges completed before resetting.
    // Only treat it as consecutive if dc.day was exactly yesterday — a multi-day
    // absence correctly resets the streak to 0 rather than continuing it.
    const prevCompleted = dc?.challenges?.length > 0 && dc.challenges.every(c => c.completed);
    const isConsecutive = (dc?.day ?? -1) === today - 1;
    const currentStreak = state.player?.challengeStreak || 0;
    const newStreak = isConsecutive && prevCompleted ? currentStreak + 1 : 0;

    let next = { ...state, dailyChallenges: generateDailyChallenges(today) };
    if (newStreak !== currentStreak) {
      next = { ...next, player: { ...next.player, challengeStreak: newStreak } };
      if (newStreak > 1) {
        const mult = Math.min(2, 1 + newStreak * 0.1).toFixed(1);
        const msg = `🔥 Challenge streak: ${newStreak} days in a row! Today's rewards ×${mult}`;
        next = { ...next, log: [{ time: Date.now(), message: msg, severity: 'warn' }, ...next.log].slice(0, 60) };
      }
    }
    return next;
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
      // Apply streak multiplier: +10% per consecutive day, capped at ×2
      const streak = state.player?.challengeStreak || 0;
      const mult = Math.min(2, 1 + streak * 0.1);
      const reward = Math.round(c.reward * mult);
      coinsAwarded += reward;
      const multLabel = mult > 1 ? ` (×${mult.toFixed(1)} streak bonus)` : '';
      messages.push(`🎯 Daily challenge complete: ${c.emoji} ${c.desc}! +🪹${reward}${multLabel}`);
    }
    return { ...c, progress: Math.min(progress, c.goal), completed };
  });

  let next = { ...state, dailyChallenges: { ...dc, challenges: updated } };
  if (coinsAwarded > 0) {
    next = { ...next, player: {
      ...next.player,
      coins: next.player.coins + coinsAwarded,
      totalCoinsEarned: (next.player.totalCoinsEarned || 0) + coinsAwarded,
    } };
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
  // Pre-group fish by tankId once (O(n)) so each processOneTank call only
  // receives its own fish instead of filtering all fish per tank (O(n×t)).
  const updatedTanks = [];
  const allUpdatedFish = [];
  const hatcheryLevel = next.shop?.upgrades?.hatchery?.level || 0;

  // Build tankId → fish[] map once before the loop
  const fishByTank = new Map();
  for (const f of next.fish) {
    if (!fishByTank.has(f.tankId)) fishByTank.set(f.tankId, []);
    fishByTank.get(f.tankId).push(f);
  }

  const upgrades = next.shop?.upgrades || {};
  const upgradeLevels = {
    purifier:    upgrades.purifier?.level    || 0,
    autoMedic:   upgrades.autoMedic?.level   || 0,
    tempControl: upgrades.tempControl?.level || 0,
    fame:        upgrades.fame?.level        || 0,
    insurance:   upgrades.insurance?.level   || 0,
  };

  for (const tank of next.tanks) {
    const tankFishList = fishByTank.get(tank.id) || [];
    const { updatedTank, updatedTankFish } = processOneTank(tank, tankFishList, messages, now, hatcheryLevel, next.player?.boosts, upgradeLevels);
    updatedTanks.push(updatedTank);
    allUpdatedFish.push(...updatedTankFish);
  }

  // Any fish not belonging to a known tank (shouldn't happen, safe fallback)
  const processedIds = new Set(allUpdatedFish.map(f => f.id));
  for (const f of next.fish) {
    if (!processedIds.has(f.id)) allUpdatedFish.push(f);
  }

  next = { ...next, tanks: updatedTanks, fish: allUpdatedFish };

  // Remove dead fish from all tanks — record autopsy data
  const deadFish = next.fish.filter(f => f.stage !== 'egg' && f.health <= 0);
  if (deadFish.length > 0) {
    const deadIds = new Set(deadFish.map(f => f.id));
    // Build tank lookup once for autopsy records
    const tankById = new Map();
    for (const t of next.tanks) tankById.set(t.id, t);
    const now2 = Date.now();
    const newAutopsies = deadFish.map(f => {
      const tank = tankById.get(f.tankId);
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
      shop: {
        ...next.shop,
        listedFish: next.shop.listedFish.filter(id => !deadIds.has(id)),
        fishPrices: Object.fromEntries(
          Object.entries(next.shop.fishPrices || {}).filter(([id]) => !deadIds.has(id))
        ),
      },
      breedingTank: {
        ...next.breedingTank,
        slots: next.breedingTank.slots.map(s => deadIds.has(s) ? null : s),
      },
      player: {
        ...next.player,
        autopsies: [...(next.player.autopsies || []), ...newAutopsies].slice(0, 50),
      },
    };
    // Insurance: refund a % of fish base value on death
    const insuranceLevel = upgradeLevels.insurance || 0;
    if (insuranceLevel > 0) {
      const refundPct = insuranceLevel * 0.2;
      let totalRefund = 0;
      for (const f of deadFish) {
        const refund = Math.round((f.species?.basePrice ?? 10) * refundPct);
        totalRefund += refund;
      }
      if (totalRefund > 0) {
        next = { ...next, player: { ...next.player, coins: next.player.coins + totalRefund } };
        messages.push(`🛡️ Insurance payout: +🪙${totalRefund} for ${deadFish.length} lost fish.`);
      }
    }
    // Index-based lookup avoids O(n²) .find() per death message
    deadFish.forEach((f, i) => messages.push(`💀 ${f.species?.name || 'A fish'} has died. (Cause: ${newAutopsies[i]?.cause || 'Unknown'})`));
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
    // Also cancel when one parent died before its genome was captured —
    // the egg can never form and the slot would be stuck forever otherwise.
    const oneGenomeMissing = !btCurrent.storedGenomeA || !btCurrent.storedGenomeB;
    if ((bothSlotsEmpty && !hasGenomes) || oneGenomeMissing) {
      // Parent(s) lost before genome capture — cancel to unblock the slot
      next = { ...next, breedingTank: { ...btCurrent, breedingStartedAt: null, slots: [null, null], storedGenomeA: null, storedGenomeB: null } };
      messages.push('💔 Breeding cancelled — a parent was lost.');
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
    // Build a fresh count map from next.fish (post-tick, dead fish already removed)
    // — fishByTank was built pre-tick and is stale here.
    const passiveFishByTank = new Map();
    for (const f of next.fish) {
      if (f.stage !== 'adult') continue;
      passiveFishByTank.set(f.tankId, (passiveFishByTank.get(f.tankId) || 0) + 1);
    }
    let tip = 0;
    for (const tank of next.tanks) {
      const adultCount = passiveFishByTank.get(tank.id) || 0;
      if (adultCount === 0) continue;
      const placed = tank.decorations?.placed?.length || 0;
      const decorMult = 1 + Math.min(10, placed) * PASSIVE_DECOR_BONUS;
      const fameMult  = 1 + (upgradeLevels.fame || 0) * 0.15;
      tip += Math.floor((tank.happiness / 100) * decorMult * PASSIVE_INCOME_BASE * fameMult);
    }
    if (tip > 0) {
      const incomeBoost = (next.player?.boosts?.passiveIncome || 0) > now ? 2.0 : 1.0;
      const boostedTip  = Math.round(tip * incomeBoost);
      next = { ...next, player: { ...next.player, coins: next.player.coins + boostedTip, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + boostedTip } };
      messages.push(`💰 Visitors left a ${boostedTip}-coin tip!${incomeBoost > 1 ? ' (High Tide ×2!)' : ''}`);
      next = updateChallengeProgress(next, 'earn_coins', { amount: boostedTip });
    }
    next = { ...next, passiveTick: 0 };

    // Auto-Medic: per-minute chance to cure sick fish
    const autoMedicLevel = upgradeLevels.autoMedic || 0;
    if (autoMedicLevel > 0) {
      const cureChance = autoMedicLevel * 0.10; // 10% per level
      const cured = [];
      next = {
        ...next,
        fish: next.fish.map(f => {
          if (!f.disease || f.stage === 'egg') return f;
          if (Math.random() < cureChance) {
            cured.push(f.species?.name || 'A fish');
            return { ...f, disease: null, diseaseSince: null, health: Math.min(100, f.health + 10) };
          }
          return f;
        }),
      };
      if (cured.length > 0) {
        messages.push(`🩺 Auto-Medic cured ${cured.length} fish: ${cured.join(', ')}`);
        for (let i = 0; i < cured.length; i++) {
          next = updateChallengeProgress(next, 'cure_fish');
        }
      }
    }
  } else {
    next = { ...next, passiveTick };
  }

  // Refresh daily challenges at UTC midnight and track happiness timer challenge
  next = refreshDailyChallenges(next);
  // Refresh market prices daily
  next = refreshMarket(next);

  // Early game events — scripted moments that fire once in the first minutes
  const playAge = (now - (next.player.firstPlayedAt || now)) / 1000;
  for (const evt of EARLY_EVENTS) {
    if (next.player.tutorialFlags?.[evt.id]) continue; // already fired
    if (playAge < evt.afterSecs) continue;              // too early
    if (evt.condition && !evt.condition(next)) continue; // condition not met
    const evtMsgs = [];
    next = evt.fire(next, evtMsgs);
    next = { ...next, player: { ...next.player, tutorialFlags: { ...next.player.tutorialFlags, [evt.id]: true } } };
    if (evtMsgs.length > 0) {
      const entries = evtMsgs.map(m => typeof m === 'string' ? { time: Date.now(), message: m } : { time: Date.now(), ...m });
      next = { ...next, log: [...entries, ...next.log].slice(0, 60) };
    }
  }
  // Build a Set of tankIds that have at least one adult fish (O(n)) so the
  // tanks.filter() below is O(tanks) rather than O(n × tanks) every tick.
  const tanksWithAdults = new Set(next.fish.filter(f => f.stage === 'adult').map(f => f.tankId));
  const happinessValues = next.tanks
    .filter(t => tanksWithAdults.has(t.id))
    .map(t => t.happiness || 0);
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

function pickFishToBuy(listedFish, customer) {
  if (listedFish.length === 0) return null;
  const biasLevel = RARITY_ORDER[customer.rarityBias] ?? 0;
  const scored = listedFish.map(f => {
    const diff = Math.abs((RARITY_ORDER[f.species?.rarity ?? 'common'] ?? 0) - biasLevel);
    return { fish: f, score: Math.random() * 0.4 + (1 / (diff + 1)) };
  }).sort((a, b) => b.score - a.score);
  return scored[0].fish;
}

function processCustomerVisit(state, messages) {
  const customer = pickCustomerType(state);
  // Build fish lookup once — O(n) instead of O(n) per .find() call
  const fishById = new Map();
  for (const f of state.fish) fishById.set(f.id, f);
  const tankById = new Map();
  for (const t of state.tanks) tankById.set(t.id, t);
  // Only consider fish the customer can afford (their budget vs ask price)
  const lightingBonus = 1 + (state.shop.upgrades?.lighting?.level || 0) * 0.10;
  const listedFish = [];
  for (const id of state.shop.listedFish) {
    const f = fishById.get(id);
    if (!f) continue;
    const fishTank  = tankById.get(f.tankId);
    const tankBonus = getTankBonuses(fishTank?.type).salePriceMult || 1;
    const happiness = fishTank?.happiness ?? 100;
    const happBonus = 1 + (happiness / 100) * 0.2;
    const autoPrice = Math.round((f.species?.basePrice ?? 10) * (f.health / 100) * happBonus * tankBonus * lightingBonus * getMarketMultiplier(f, state.market));
    const askPrice  = state.shop.fishPrices?.[id] ?? autoPrice;
    const budget    = Math.round(askPrice * customer.budgetMult);
    if (budget >= Math.round(askPrice * 0.65)) listedFish.push(f);
  }

  // No fish in budget — customer passes without entering the shop at all
  if (listedFish.length === 0) return state;

  const fish = pickFishToBuy(listedFish, customer);
  if (!fish) return state;

  // Display tank gives a sale price bonus; Premium Lighting adds on top
  const fishTank   = tankById.get(fish.tankId);
  const tankBonus  = getTankBonuses(fishTank?.type).salePriceMult || 1;
  const happiness  = fishTank?.happiness ?? 100;
  const happBonus  = 1 + (happiness / 100) * 0.2;
  const marketMult = getMarketMultiplier(fish, state.market);
  const autoPrice  = Math.round((fish.species?.basePrice ?? 10) * (fish.health / 100) * happBonus * tankBonus * lightingBonus * marketMult);
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

  const salePriceBoost = (state.player?.boosts?.salePrice || 0) > Date.now() ? 1.25 : 1.0;
  const earnedCoins = Math.max(1, Math.round(finalPrice * salePriceBoost));
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
  // Pick the tank with the most available space. Precompute counts once (O(n))
  // to avoid O(tanks² × fish) repeated filter calls inside the reduce.
  const fishCountByTank = new Map();
  for (const f of state.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
  const tankId = state.tanks.reduce((best, t) => {
    const free     = (t.capacity    || 12) - (fishCountByTank.get(t.id)    || 0);
    const bestFree = (best.capacity || 12) - (fishCountByTank.get(best.id) || 0);
    return free > bestFree ? t : best;
  }, state.tanks[0])?.id || 'tank_0';

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
  let eggsHatched = 0, fishGrown = 0, coinsEarned = 0, fishSold = 0;

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
      // Apply starvation damage at half rate offline (player can't intervene)
      if (f.hunger >= 90) f.health = Math.max(0, f.health - HEALTH_HUNGER_DMG * secondsElapsed * 0.5);
      // Apply disease damage offline — diseased fish should still deteriorate while away
      if (f.disease) {
        const disease = DISEASES[f.disease];
        if (disease) f.health = Math.max(0, f.health - disease.healthDmgPerSec * secondsElapsed * 0.5);
      }
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
        f.stage = 'adult'; stageStart = now; fishGrown++;
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
    const offTankById = new Map();
    for (const t of next.tanks) offTankById.set(t.id, t);
    const offlineAutopsies = offlineDeadFish.map(f => {
      const tank = offTankById.get(f.tankId);
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
      shop: {
        ...next.shop,
        listedFish: next.shop.listedFish.filter(id => !deadIds.has(id)),
        fishPrices: Object.fromEntries(
          Object.entries(next.shop.fishPrices || {}).filter(([id]) => !deadIds.has(id))
        ),
      },
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
  // Snapshot the listed count BEFORE the loop — each sale mutates listedFish, so
  // reading listedFish.length inside the cap would allow more visits than were
  // possible when the player went offline.
  const customerInterval = getCustomerInterval(next);
  const startingListedCount = next.shop.listedFish.length;
  const actualVisits = Math.min(
    Math.floor((secondsElapsed * 1000) / customerInterval),
    startingListedCount * 3,
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
      coinsEarned += offlineEvent.coinBonus;  // include in offline summary earnings
      next = { ...next, player: { ...next.player, coins: next.player.coins + offlineEvent.coinBonus, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + offlineEvent.coinBonus } };
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
    eggsHatched, fishGrown, coinsEarned, fishSold,
    waterQualityLost: Math.round(WATER_DECAY_RATE * secondsElapsed),
    fishDied: offlineDeadFish.length,
    offlineEvent,
    ambientMessage: ambientMsg,
    hasEvents: eggsHatched > 0 || fishGrown > 0 || coinsEarned > 0 || offlineDeadFish.length > 0 || !!offlineEvent,
  };
  next = { ...next, offlineSummary };

  if (offlineSummary.hasEvents) {
    const parts = [];
    if (eggsHatched) parts.push(`${eggsHatched} egg${eggsHatched > 1 ? 's' : ''} hatched`);
    if (fishGrown) parts.push(`${fishGrown} fish grew up`);
    if (fishSold)    parts.push(`sold ${fishSold} fish for 🪙${coinsEarned}`);
    next = addLog(next, `⏰ Back after ${timeLabel}! ${parts.join(', ')}.`);
  } else {
    next = addLog(next, `⏰ Back after ${timeLabel}. Your tanks are peaceful.`);
  }

  return next;
}
