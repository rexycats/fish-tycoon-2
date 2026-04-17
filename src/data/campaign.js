// ============================================================
// FISH TYCOON 2 — CAMPAIGN LEVELS
// ============================================================
import { getLevelFromXp } from './levels.js';

export const CAMPAIGN_LEVELS = [
  {
    id: 'level_1',
    name: 'Your First Tank',
    description: 'Learn the basics of fish keeping.',
    briefing: "Welcome to your new aquarium! You've got a single tank, a small budget, and big dreams.\n\nStart by purchasing some fish from the Market, keep them fed and healthy, then list them for sale. Customers will visit automatically — the better your fish, the more they'll pay.",
    unlocked: true,

    startingState: {
      coins: 200,
      fish: [],
      maxBays: 0,
    },
    constraints: {
      breedingDisabled: true,
      maxTanks: 1,
      tankCapacity: 8,
    },

    objectives: [
      { id: 'buy_fish',  label: 'Buy your first fish',     type: 'stat', key: 'fishBought',      target: 1 },
      { id: 'feed_fish', label: 'Feed a fish',             type: 'stat', key: 'fishFed',          target: 1 },
      { id: 'list_fish', label: 'List a fish for sale',    type: 'stat', key: 'fishListed',       target: 1 },
      { id: 'sell_5',    label: 'Sell 5 fish',             type: 'stat', key: 'fishSold',          target: 5 },
      { id: 'earn_500',  label: 'Earn 500 coins',          type: 'player_field', key: 'totalCoinsEarned',  target: 500 },
    ],

    stars: {
      1: {},
      2: { stat: 'totalCoinsEarned', target: 800 },
      3: { stat: 'totalCoinsEarned', target: 1200 },
    },

    rewards: { unlocks: ['level_2'], bonusCoins: 100 },
  },

  {
    id: 'level_2',
    name: 'Breeding Basics',
    description: 'Combine traits to discover new species.',
    briefing: "You have two adult fish with different genetics. Go to the Breeding Lab, place them in the parent slots, and wait for eggs.\n\nEach offspring inherits a mix of traits from both parents — breed enough and you'll discover entirely new species. Use speed controls to fast-forward the breeding timer!",
    unlocked: false,

    startingState: {
      coins: 300,
      starterFishCount: 2,
      starterFishStage: 'adult',
      maxBays: 1,
    },
    constraints: {
      maxTanks: 1,
      tankCapacity: 10,
    },

    objectives: [
      { id: 'start_breed', label: 'Start a breeding pair',    type: 'stat', key: 'breedingsStarted', target: 1 },
      { id: 'collect_egg', label: 'Collect a breeding egg',   type: 'stat', key: 'eggsCollected',     target: 1 },
      { id: 'hatch_egg',   label: 'Hatch an egg',             type: 'stat', key: 'eggsHatched',       target: 1 },
      { id: 'discover_3',  label: 'Discover 5 new species',   type: 'fishdex', target: 5 },
      { id: 'own_8',       label: 'Own 8 fish at once',       type: 'fishCount', target: 8 },
    ],

    stars: {
      1: {},
      2: { type: 'fishdex', target: 7 },
      3: { type: 'fishdex', target: 10 },
    },

    rewards: { unlocks: ['level_3'], bonusCoins: 150 },
  },

  {
    id: 'level_3',
    name: 'The Collector',
    description: 'Build a diverse collection through strategic breeding.',
    briefing: "Your aquarium is growing! You now have two tanks and access to more species. Focus on breeding diverse combinations to expand your Fishdex.\n\nThe Wanted Board in the Market has special bounties — fulfill them for bonus coins. You'll need to breed strategically to find rare specimens.",
    unlocked: false,

    startingState: {
      coins: 500,
      starterFishCount: 3,
      starterFishStage: 'adult',
      maxBays: 1,
      tankCount: 2,
    },
    constraints: {
      maxTanks: 2,
      tankCapacity: 10,
    },

    objectives: [
      { id: 'discover_15', label: 'Discover 15 species',       type: 'fishdex',  target: 15 },
      { id: 'rare_fish',   label: 'Own a Rare+ fish',          type: 'hasRarity', rarity: ['rare', 'epic', 'legendary'] },
      { id: 'earn_2000',   label: 'Earn 2000 coins',           type: 'player_field', key: 'totalCoinsEarned', target: 2000 },
      { id: 'level_3',     label: 'Reach Level 3',             type: 'playerLevel', target: 3 },
      { id: 'wanted',      label: 'Complete a bounty',         type: 'stat', key: 'wantedFulfilled', target: 1 },
    ],

    stars: {
      1: {},
      2: { type: 'fishdex', target: 20 },
      3: { stat: 'totalCoinsEarned', target: 4000 },
    },

    rewards: { unlocks: ['level_4'], bonusCoins: 200 },
  },

  {
    id: 'level_4',
    name: 'Market Pressure',
    description: 'Repay your debt before time runs out.',
    briefing: "You've taken a loan to expand your operation. Sell fish fast to repay 3000 coins before the loan collectors come knocking.\n\nPrice your fish strategically — too high and customers walk away, too low and you won't make enough.",
    unlocked: false,

    startingState: {
      coins: 100,
      starterFishCount: 4,
      starterFishStage: 'adult',
      maxBays: 1,
      tankCount: 2,
    },
    constraints: {
      maxTanks: 2,
      tankCapacity: 12,
    },

    objectives: [
      { id: 'earn_3000',   label: 'Earn 3000 coins',           type: 'player_field', key: 'totalCoinsEarned', target: 3000 },
      { id: 'sell_15',     label: 'Sell 15 fish',              type: 'stat', key: 'fishSold', target: 15 },
      { id: 'no_death',    label: 'Keep all fish alive',       type: 'stat_max', key: 'fishDied', target: 0 },
    ],

    stars: {
      1: {},
      2: { stat: 'totalCoinsEarned', target: 5000 },
      3: { stat: 'fishSold', target: 25 },
    },

    rewards: { unlocks: ['level_5'], bonusCoins: 250 },
  },

  {
    id: 'level_5',
    name: 'Rare Finds',
    description: 'Breed your way to an Epic specimen.',
    briefing: "The collectors want rare fish. You have access to breeding bays and a good gene pool. Cross-breed strategically — check the offspring prediction panel to see which traits combine for higher rarity.\n\nYour goal: breed at least one Epic-rarity fish.",
    unlocked: false,

    startingState: {
      coins: 600,
      starterFishCount: 4,
      starterFishStage: 'adult',
      maxBays: 2,
      tankCount: 2,
    },
    constraints: {
      maxTanks: 3,
      tankCapacity: 12,
    },

    objectives: [
      { id: 'epic_fish',    label: 'Own an Epic fish',          type: 'hasRarity', rarity: ['epic', 'legendary'] },
      { id: 'discover_25',  label: 'Discover 25 species',       type: 'fishdex', target: 25 },
      { id: 'breed_10',     label: 'Collect 10 eggs',           type: 'stat', key: 'eggsCollected', target: 10 },
      { id: 'earn_5000',    label: 'Earn 5000 coins',           type: 'player_field', key: 'totalCoinsEarned', target: 5000 },
    ],

    stars: {
      1: {},
      2: { type: 'hasRarity', rarity: ['legendary'] },
      3: { type: 'fishdex', target: 35 },
    },

    rewards: { unlocks: [], bonusCoins: 500 },
  },
];

export function getLevelById(id) {
  return CAMPAIGN_LEVELS.find(l => l.id === id) || null;
}

// Check a single objective against game state
export function checkObjective(obj, state) {
  switch (obj.type) {
    case 'stat':
      return (state.player?.stats?.[obj.key] || 0) >= obj.target;
    case 'player_field':
      return (state.player?.[obj.key] || 0) >= obj.target;
    case 'stat_max':
      return (state.player?.stats?.[obj.key] || 0) <= obj.target;
    case 'fishdex':
      return (state.player?.fishdex || []).length >= obj.target;
    case 'fishCount':
      return (state.fish || []).length >= obj.target;
    case 'playerLevel':
      return getLevelFromXp(state.player?.xp || 0).level >= obj.target;
    case 'hasRarity': {
      const rarities = obj.rarity || [];
      return (state.fish || []).some(f => rarities.includes(f.species?.rarity));
    }
    default:
      return false;
  }
}

// Get progress value for display
export function getObjectiveProgress(obj, state) {
  switch (obj.type) {
    case 'stat':
      return { current: state.player?.stats?.[obj.key] || 0, target: obj.target };
    case 'player_field':
      return { current: state.player?.[obj.key] || 0, target: obj.target };
    case 'stat_max':
      return { current: state.player?.stats?.[obj.key] || 0, target: obj.target };
    case 'fishdex':
      return { current: (state.player?.fishdex || []).length, target: obj.target };
    case 'fishCount':
      return { current: (state.fish || []).length, target: obj.target };
    case 'playerLevel':
      return { current: getLevelFromXp(state.player?.xp || 0).level, target: obj.target };
    case 'hasRarity': {
      const has = (state.fish || []).some(f => (obj.rarity || []).includes(f.species?.rarity));
      return { current: has ? 1 : 0, target: 1 };
    }
    default:
      return { current: 0, target: 1 };
  }
}

// Check star ratings
export function getStarRating(level, state) {
  const allDone = level.objectives.every(o => checkObjective(o, state));
  if (!allDone) return 0;
  let stars = 1;
  if (level.stars[2]) {
    const s2 = level.stars[2];
    if (s2.stat && (state.player?.[s2.stat] || state.player?.stats?.[s2.stat] || 0) >= s2.target) stars = 2;
    if (s2.type === 'fishdex' && (state.player?.fishdex || []).length >= s2.target) stars = 2;
  }
  if (level.stars[3] && stars >= 2) {
    const s3 = level.stars[3];
    if (s3.stat && (state.player?.[s3.stat] || state.player?.stats?.[s3.stat] || 0) >= s3.target) stars = 3;
    if (s3.type === 'fishdex' && (state.player?.fishdex || []).length >= s3.target) stars = 3;
    if (s3.type === 'hasRarity' && (state.fish || []).some(f => (s3.rarity || []).includes(f.species?.rarity))) stars = 3;
  }
  return stars;
}
