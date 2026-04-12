// ============================================================
// FISH TYCOON 2 — RANDOM EVENTS SYSTEM
// Periodic surprises that create dramatic moments
// ============================================================

import { createFish, randomGenome } from '../data/genetics.js';

const EVENT_INTERVAL_MIN = 180; // minimum seconds between events
const EVENT_INTERVAL_MAX = 420; // maximum seconds between events

const RANDOM_EVENTS = [
  {
    id: 'celebrity_visit',
    name: '⭐ Celebrity Visit!',
    desc: 'A famous aquarium influencer is touring your shop! Tips doubled for 2 minutes.',
    emoji: '⭐',
    weight: 10,
    minRep: 5,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, passiveIncome: Date.now() + 120_000 },
      },
    }),
    message: '⭐ Celebrity visit! Passive income doubled for 2 minutes!',
  },
  {
    id: 'storm_egg',
    name: '🌊 Storm Surge!',
    desc: 'A storm churns the ocean! Water quality drops, but something washed into your tank...',
    emoji: '🌊',
    weight: 8,
    minRep: 0,
    effect: (state) => {
      const tanks = state.tanks.map(t => ({
        ...t,
        waterQuality: Math.max(20, t.waterQuality - 25),
      }));
      // Gift a mystery egg
      const tankId = state.tanks[0]?.id || 'tank_0';
      const egg = createFish({ stage: 'egg', tankId, genome: randomGenome(), targetRarity: 'rare' });
      return { ...state, tanks, fish: [...state.fish, egg] };
    },
    message: '🌊 Storm! Water quality dropped, but a mystery egg washed in! 🥚',
  },
  {
    id: 'gold_rush',
    name: '💰 Gold Rush!',
    desc: 'A collector is desperate for fish! Sale prices boosted 50% for 2 minutes.',
    emoji: '💰',
    weight: 8,
    minRep: 10,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, salePrice: Date.now() + 120_000 },
      },
    }),
    message: '💰 Gold Rush! A collector is buying — sale prices +50% for 2 minutes!',
  },
  {
    id: 'disease_outbreak',
    name: '🦠 Disease Outbreak!',
    desc: 'A mysterious illness is spreading through your tanks! Quick, use medicine!',
    emoji: '🦠',
    weight: 6,
    minRep: 0,
    effect: (state) => {
      const diseases = ['Ich', 'Fin Rot', 'Velvet'];
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      const adults = state.fish.filter(f => f.stage === 'adult' && !f.disease);
      if (adults.length === 0) return state;
      // Infect 1-3 random fish
      const infectCount = Math.min(adults.length, 1 + Math.floor(Math.random() * 3));
      const shuffled = [...adults].sort(() => Math.random() - 0.5);
      const infected = new Set(shuffled.slice(0, infectCount).map(f => f.id));
      return {
        ...state,
        fish: state.fish.map(f =>
          infected.has(f.id) ? { ...f, disease, diseaseSince: Date.now() } : f
        ),
      };
    },
    message: '🦠 Disease outbreak! Check your fish and use medicine quickly!',
  },
  {
    id: 'lucky_current',
    name: '🍀 Lucky Current!',
    desc: 'A warm current brings exotic plankton. Next breeding has 3× mutation chance!',
    emoji: '🍀',
    weight: 7,
    minRep: 0,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, mutationBoost: Date.now() + 300_000 },
      },
    }),
    message: '🍀 Lucky Current! Mutation chance tripled for the next 5 minutes!',
  },
  {
    id: 'fish_competition',
    name: '🏆 Fish Competition!',
    desc: 'The Regional Aquarium Awards are judging your tanks! High happiness = big prize!',
    emoji: '🏆',
    weight: 6,
    minRep: 15,
    effect: (state) => {
      const bestHappiness = Math.max(...state.tanks.map(t => t.happiness || 0));
      const prize = Math.round(bestHappiness * 5 + Math.random() * 200);
      return {
        ...state,
        player: {
          ...state.player,
          coins: state.player.coins + prize,
          totalCoinsEarned: (state.player.totalCoinsEarned || 0) + prize,
        },
      };
    },
    message: (state) => {
      const bestHappiness = Math.max(...state.tanks.map(t => t.happiness || 0));
      const prize = Math.round(bestHappiness * 5 + 100);
      return `🏆 Fish Competition! Your tanks scored ${bestHappiness}% — you win ~🪙${prize}!`;
    },
  },
  {
    id: 'power_surge',
    name: '⚡ Power Surge!',
    desc: 'An electrical surge hit your building! Temperature fluctuating wildly!',
    emoji: '⚡',
    weight: 5,
    minRep: 0,
    effect: (state) => ({
      ...state,
      tanks: state.tanks.map(t => ({
        ...t,
        temperature: (t.temperature || 74) + (Math.random() > 0.5 ? 8 : -8),
      })),
    }),
    message: '⚡ Power surge! Tank temperatures swinging — use heaters to stabilize!',
  },
  {
    id: 'speed_grow',
    name: '🌱 Growth Spurt!',
    desc: 'Something in the water is making your fish grow faster! Eggs and juveniles develop 2× speed for 3 minutes.',
    emoji: '🌱',
    weight: 7,
    minRep: 0,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, growSpeed: Date.now() + 180_000 },
      },
    }),
    message: '🌱 Growth Spurt! Eggs and juveniles grow 2× faster for 3 minutes!',
  },
  {
    id: 'generous_donor',
    name: '🎁 Generous Donor!',
    desc: 'An anonymous benefactor donated supplies to your aquarium!',
    emoji: '🎁',
    weight: 6,
    minRep: 0,
    effect: (state) => ({
      ...state,
      tanks: state.tanks.map(t => ({
        ...t,
        supplies: {
          ...t.supplies,
          food: (t.supplies?.food || 0) + 20,
          waterTreatment: (t.supplies?.waterTreatment || 0) + 5,
          antibiotic: (t.supplies?.antibiotic || 0) + 3,
        },
      })),
    }),
    message: '🎁 Generous Donor! Free supplies delivered to all tanks!',
  },
  {
    id: 'rare_sighting',
    name: '✨ Rare Sighting!',
    desc: 'Word has spread about your rare fish! Reputation boost!',
    emoji: '✨',
    weight: 5,
    minRep: 20,
    effect: (state) => ({
      ...state,
      shop: {
        ...state.shop,
        reputation: Math.min(999, (state.shop.reputation || 0) + 15),
      },
    }),
    message: '✨ Rare Sighting! Your aquarium is trending — +15 reputation!',
  },
];

/**
 * Check if a random event should trigger this tick.
 * Returns the updated state with event applied, or unchanged state.
 */
export function processRandomEvent(state, messages) {
  const now = Date.now();
  const lastEvent = state.lastRandomEvent || 0;
  const elapsed = (now - lastEvent) / 1000;

  // Not enough time passed
  if (elapsed < EVENT_INTERVAL_MIN) return state;

  // Probability increases as time passes beyond minimum
  const overtime = elapsed - EVENT_INTERVAL_MIN;
  const maxOvertime = EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN;
  const chance = Math.min(0.8, overtime / maxOvertime * 0.02); // ~2% per second after min

  if (Math.random() > chance) return state;

  // Pick an event weighted by... weight, filtered by rep
  const rep = state.shop?.reputation || 0;
  const eligible = RANDOM_EVENTS.filter(e => rep >= (e.minRep || 0));
  if (eligible.length === 0) return state;

  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = eligible[0];
  for (const e of eligible) {
    roll -= e.weight;
    if (roll <= 0) { picked = e; break; }
  }

  // Apply effect
  let next = picked.effect(state);
  next = { ...next, lastRandomEvent: now, lastRandomEventId: picked.id };

  // Generate message
  const msg = typeof picked.message === 'function' ? picked.message(state) : picked.message;
  messages.push(msg);

  // Store event for UI popup
  next = {
    ...next,
    activeEvent: {
      id: picked.id,
      name: picked.name,
      desc: picked.desc,
      emoji: picked.emoji,
      triggeredAt: now,
    },
  };

  return next;
}
