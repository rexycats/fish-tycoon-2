// ============================================================
// FISH TYCOON 2 — GAME TICK SYSTEM v7 (multi-tank)
// ============================================================

import { GROWTH_STAGES, computePhenotype, getSpeciesFromPhenotype, RARITY } from '../data/genetics.js';
import { addLog, checkAchievements, TANK_TYPES } from '../data/gameState.js';

export const TICK_INTERVAL_MS = 1000;

// --- RATES (per real second) ---
const HUNGER_RATE        = 0.025;
const WATER_DECAY_RATE   = 0.004;
const HEALTH_HUNGER_DMG  = 0.06;
const HEALTH_WATER_DMG   = 0.03;
const HEALTH_REGEN       = 0.01;

// --- DISEASE SYSTEM ---
export const DISEASES = {
  ich: {
    id: 'ich', name: 'Ich', emoji: '🔴',
    desc: 'White-spot disease. Spreads quickly between fish.',
    healthDmgPerSec: 0.08,
    spreadChancePerSec: 0.003,
    color: '#ff4444',
    curedBy: 'medicine',
  },
  fin_rot: {
    id: 'fin_rot', name: 'Fin Rot', emoji: '🟤',
    desc: 'Bacterial infection. Caused by poor water quality.',
    healthDmgPerSec: 0.04,
    spreadChancePerSec: 0.001,
    color: '#a06020',
    curedBy: 'medicine',
  },
  bloat: {
    id: 'bloat', name: 'Bloat', emoji: '🟡',
    desc: 'Digestive illness. Linked to overfeeding.',
    healthDmgPerSec: 0.05,
    spreadChancePerSec: 0,
    color: '#d4c020',
    curedBy: 'medicine',
  },
  velvet: {
    id: 'velvet', name: 'Velvet', emoji: '🟠',
    desc: 'Parasitic infection. Hard to spot until advanced.',
    healthDmgPerSec: 0.1,
    spreadChancePerSec: 0.004,
    color: '#e06820',
    curedBy: 'medicine',
  },
};

// Disease outbreak chance factors (per second)
const DISEASE_BASE_CHANCE  = 0.00008;  // base chance per fish per second
const DISEASE_WATER_MULT   = 3.5;      // multiplier when water quality < 30
const DISEASE_CROWD_MULT   = 2.0;      // multiplier when tank is >80% full

const CUSTOMER_BASE_INTERVAL_MS = 18_000;
const MAX_OFFLINE_SECONDS        = 60 * 60 * 12;

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
function processOneTank(tank, allFish, messages, now) {
  const tankFish = allFish.filter(f => f.tankId === tank.id);
  const bonuses  = getTankBonuses(tank.type);

  const wq        = Math.max(0, tank.waterQuality - WATER_DECAY_RATE);
  const temp      = tank.temperature ?? 74;
  const tempDrift = temp > 74 ? -0.002 : temp < 74 ? 0.002 : 0;
  const newTemp   = Math.round((temp + tempDrift) * 1000) / 1000;
  const tempStress = newTemp < 65 || newTemp > 85;

  // Auto-feed
  let supplies = { ...tank.supplies };
  const feedTick = (tank.autoFeedTick || 0) + 1;
  let autoFeedUsed = false;
  if (tank.autoFeed && feedTick >= 40 && supplies.food > 0) {
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
      messages.push(`🚨 ${fish.species.name} in ${tank.name} contracted ${DISEASES[diseaseId].name}! Treat quickly.`);
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

      // Disease damage (overrides normal health calculation)
      if (f.disease) {
        const disease = DISEASES[f.disease];
        if (disease) {
          f.health = Math.max(0, f.health - disease.healthDmgPerSec);
        }
      } else if (f.hunger >= 90) {
        f.health = Math.max(0, f.health - HEALTH_HUNGER_DMG);
      } else if (wq < 25) {
        f.health = Math.max(0, f.health - HEALTH_WATER_DMG);
      } else if (tempStress) {
        f.health = Math.max(0, f.health - 0.02);
      } else if (f.hunger < 40 && wq > 60) {
        f.health = Math.min(100, f.health + regen);
      }
    }

    // Growth stage progression
    const stageDuration = GROWTH_STAGES[f.stage]?.durationMs ?? Infinity;
    const timeInStage   = now - f.stageStartedAt;
    const growMult = bonuses.growSpeedMult || 1;

    if (f.stage === 'egg' && timeInStage >= stageDuration * growMult) {
      f.stage = 'juvenile'; f.stageStartedAt = now;
      messages.push(`🐣 An egg in ${tank.name} hatched into a ${f.species.name}!`);
    } else if (f.stage === 'juvenile' && timeInStage >= stageDuration * growMult) {
      f.stage = 'adult'; f.stageStartedAt = now;
      messages.push(`🐟 A ${f.species.name} in ${tank.name} grew into an adult!`);
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
    autoFeedTick: autoFeedUsed || feedTick >= 40 ? 0 : feedTick,
    supplies,
  };

  return { updatedTank, updatedTankFish };
}

// ============================================================
// SINGLE TICK
// ============================================================
export function processTick(state) {
  let next = { ...state };
  const messages = [];
  const now = Date.now();

  // Process each tank independently
  const updatedTanks = [];
  let updatedFish = [...next.fish];

  for (const tank of next.tanks) {
    const { updatedTank, updatedTankFish } = processOneTank(tank, updatedFish, messages, now);
    updatedTanks.push(updatedTank);
    // Replace this tank's fish in the global fish array
    updatedFish = [
      ...updatedFish.filter(f => f.tankId !== tank.id),
      ...updatedTankFish,
    ];
  }

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
        fishName: f.species.name,
        rarity: f.species.rarity,
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
        autopsies: [...(next.player.autopsies || []), ...newAutopsies].slice(0, 20),
      },
    };
    for (const f of deadFish) messages.push(`💀 ${f.species.name} has died. (Cause: ${newAutopsies.find(a => a.fishName === f.species.name)?.cause || 'Unknown'})`);
  }

  // Breeding tank timer
  const bt = next.breedingTank;
  if (bt.breedingStartedAt && !bt.eggReady) {
    if (now - bt.breedingStartedAt >= bt.breedingDurationMs) {
      next = { ...next, breedingTank: { ...bt, eggReady: true } };
      messages.push('🥚 A breeding egg is ready to collect!');
    }
  }

  // Customer visits
  const customerInterval = getCustomerInterval(next);
  if (now - next.shop.lastCustomerAt >= customerInterval && next.shop.listedFish.length > 0) {
    next = processCustomerVisit(next, messages);
  }

  next = checkAchievements(next, messages);
  for (const msg of messages) next = addLog(next, msg);
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
  const level = state.shop.level || 1;
  const rep   = state.shop.reputation || 0;
  const pool  = CUSTOMER_TYPES.filter(c => {
    if (c.id === 'rich'      && (level < 3 || rep < 50)) return false;
    if (c.id === 'collector' && level < 2) return false;
    return true;
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickFishToBuy(listedIds, fish, customer) {
  const listed = listedIds.map(id => fish.find(f => f.id === id)).filter(Boolean);
  if (listed.length === 0) return null;
  const biasLevel = RARITY_ORDER[customer.rarityBias] ?? 0;
  const scored = listed.map(f => {
    const diff = Math.abs((RARITY_ORDER[f.species.rarity] ?? 0) - biasLevel);
    return { fish: f, score: Math.random() * 0.4 + (1 / (diff + 1)) };
  }).sort((a, b) => b.score - a.score);
  return scored[0].fish;
}

function processCustomerVisit(state, messages) {
  const customer = pickCustomerType(state);
  // Only consider fish the customer can afford (their budget vs ask price)
  const listedIds = state.shop.listedFish.filter(id => {
    const f = state.fish.find(fi => fi.id === id);
    if (!f) return false;
    const fishTank  = state.tanks.find(t => t.id === f.tankId);
    const tankBonus = getTankBonuses(fishTank?.type).salePriceMult || 1;
    const happiness = fishTank?.happiness ?? 100;
    const happBonus = 1 + (happiness / 100) * 0.2;
    const autoPrice = Math.round(f.species.basePrice * (f.health / 100) * happBonus * tankBonus);
    const askPrice  = state.shop.fishPrices?.[id] ?? autoPrice;
    const budget    = Math.round(askPrice * customer.budgetMult);
    // Customer will only browse fish within their budget range (they may haggle on expensive ones)
    return budget >= Math.round(askPrice * 0.6);
  });

  const fish = pickFishToBuy(listedIds.length > 0 ? listedIds : state.shop.listedFish, state.fish, customer);
  if (!fish) return state;

  // Display tank gives a sale price bonus
  const fishTank   = state.tanks.find(t => t.id === fish.tankId);
  const tankBonus  = getTankBonuses(fishTank?.type).salePriceMult || 1;
  const happiness  = fishTank?.happiness ?? 100;
  const happBonus  = 1 + (happiness / 100) * 0.2;
  const autoPrice  = Math.round(fish.species.basePrice * (fish.health / 100) * happBonus * tankBonus);
  const askPrice   = state.shop.fishPrices?.[fish.id] ?? autoPrice;

  // Customer budget is their max willingness to pay
  const maxBudget  = Math.round(askPrice * customer.budgetMult);

  // Customer walks away if price is way too high for them
  if (maxBudget < Math.round(askPrice * 0.65)) {
    const repLoss = Math.max(1, Math.ceil(fish.species.rarityScore / 30));
    messages.push(`${customer.emoji} ${customer.name} looked at your ${fish.species.name} (asking 🪙${askPrice}) and walked away — too expensive!`);
    return {
      ...state,
      shop: {
        ...state.shop,
        lastCustomerAt: Date.now(),
        reputation: Math.max(0, (state.shop.reputation || 0) - repLoss),
        salesHistory: [
          { time: Date.now(), type: 'rejected', customerName: customer.name, customerEmoji: customer.emoji,
            fishName: fish.species.name, fishRarity: fish.species.rarity, coins: 0, askPrice },
          ...(state.shop.salesHistory || []),
        ].slice(0, 20),
      },
    };
  }

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
  const repGain     = Math.ceil(fish.species.rarityScore / 10) + (askPrice > autoPrice ? 1 : 0);

  messages.push(`${customer.emoji} ${customer.name} bought your ${fish.species.name} for 🪙${earnedCoins}${priceNote}!`);

  // Clean up ask price after sale
  const fishPrices = { ...(state.shop.fishPrices || {}) };
  delete fishPrices[fish.id];

  return {
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
          fishName: fish.species.name, fishRarity: fish.species.rarity,
          coins: earnedCoins, askPrice,
        },
        ...(state.shop.salesHistory || []),
      ].slice(0, 20),
    },
  };
}

// ============================================================
// OFFLINE PROGRESS
// ============================================================
export function applyOfflineProgress(state) {
  const now     = Date.now();
  const elapsed = now - (state.lastTickAt || now);
  const ticks   = Math.min(Math.floor(elapsed / 1000), MAX_OFFLINE_SECONDS);

  if (ticks < 5) return state;

  let next = { ...state };
  let eggsHatched = 0, fishedGrown = 0, coinsEarned = 0, fishSold = 0;

  // Update each tank's water quality
  next = {
    ...next,
    tanks: next.tanks.map(t => ({
      ...t,
      waterQuality: Math.max(0, t.waterQuality - WATER_DECAY_RATE * ticks),
    })),
  };

  // Bulk fish update per tank
  const updatedFish = next.fish.map(fish => {
    let f   = { ...fish };
    f.age   = (f.age || 0) + ticks;
    const tank = next.tanks.find(t => t.id === f.tankId);
    const bonuses = getTankBonuses(tank?.type);

    if (f.stage !== 'egg') {
      f.hunger = Math.min(100, (f.hunger || 0) + HUNGER_RATE * ticks);
      if (f.hunger >= 90) f.health = Math.max(0, f.health - HEALTH_HUNGER_DMG * ticks * 0.5);
    }

    // Stage progression
    let remaining = ticks * 1000;
    let stageStart = f.stageStartedAt;
    const lastTick = state.lastTickAt || now;
    const growMult = bonuses.growSpeedMult || 1;

    if (f.stage === 'egg') {
      const timeAlready = lastTick - stageStart;
      const timeToHatch = GROWTH_STAGES.egg.durationMs * growMult - timeAlready;
      if (remaining >= timeToHatch) {
        f.stage = 'juvenile'; stageStart = lastTick + timeToHatch;
        remaining -= timeToHatch; eggsHatched++;
      }
    }
    if (f.stage === 'juvenile') {
      const timeAlready = f.stage === 'juvenile' ? (lastTick - stageStart) : 0;
      const timeToGrow  = GROWTH_STAGES.juvenile.durationMs * growMult - timeAlready;
      if (remaining >= timeToGrow) {
        f.stage = 'adult'; stageStart = lastTick + timeToGrow; fishedGrown++;
      }
    }
    f.stageStartedAt = stageStart;
    return f;
  });

  next = { ...next, fish: updatedFish };

  // Offline customer visits
  const customerInterval = getCustomerInterval(next);
  const actualVisits = Math.min(
    Math.floor((ticks * 1000) / customerInterval),
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

  // Summary
  next = { ...next, lastTickAt: now };
  const minutes = Math.round(ticks / 60);
  const timeLabel = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const offlineSummary = {
    timeAway: timeLabel, secondsAway: ticks,
    eggsHatched, fishedGrown, coinsEarned, fishSold,
    waterQualityLost: Math.round(WATER_DECAY_RATE * ticks),
    hasEvents: eggsHatched > 0 || fishedGrown > 0 || coinsEarned > 0,
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
