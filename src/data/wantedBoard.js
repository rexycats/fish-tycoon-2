// ============================================================
// WANTED BOARD — Breeding goals with specific trait targets
// ============================================================

const COLORS = ['Crimson', 'Gold', 'Violet', 'Azure', 'Emerald', 'White'];
const SHAPES = ['Round', 'Slender', 'Orb', 'Delta', 'Eel'];
const PATTERNS = ['Spotted', 'Tiger', 'Marble', 'Lined'];
const GLOWS = ['Luminous', 'Radiant', 'Ultraviolet'];

const BUYER_NAMES = [
  'A wealthy collector', 'The royal aquarium', 'A marine biologist',
  'A celebrity influencer', 'The city zoo', 'An eccentric millionaire',
  'A luxury hotel', 'A famous chef', 'A museum curator', 'A tech CEO',
];

/**
 * Generate a wanted poster. Difficulty scales with player level.
 */
export function generateWantedPoster(level = 1, existing = [], now = Date.now()) {
  const existingIds = new Set(existing.map(p => p.id));
  const difficulty = Math.min(4, Math.floor(level / 5) + 1);
  const traits = {};

  // Always require a color
  traits.primaryColor = COLORS[Math.floor(Math.random() * COLORS.length)];

  // Add more traits based on difficulty
  if (difficulty >= 2 || Math.random() < 0.5) {
    traits.bodyShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }
  if (difficulty >= 2 && Math.random() < 0.6) {
    traits.pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  }
  if (difficulty >= 3 && Math.random() < 0.4) {
    traits.glow = GLOWS[Math.floor(Math.random() * (difficulty >= 4 ? GLOWS.length : 2))];
  }

  // Calculate reward based on trait count and rarity
  const traitCount = Object.keys(traits).length;
  const hasGlow = !!traits.glow;
  const baseReward = 150 + traitCount * 200 + (hasGlow ? 500 : 0);
  const reward = Math.round(baseReward * (0.8 + Math.random() * 0.4));

  // Build description
  const desc = Object.entries(traits).map(([k, v]) => v).join(' + ');
  const buyer = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];

  const id = `wanted_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  if (existingIds.has(id)) return null;

  return {
    id,
    traits,
    reward,
    buyer,
    description: desc,
    createdAt: now,
    expiresAt: now + 1000 * 60 * 60 * 4, // 4 hours
    fulfilled: false,
  };
}

/**
 * Check if a fish matches a wanted poster's traits.
 */
export function fishMatchesPoster(fish, poster) {
  if (!fish?.phenotype || !poster?.traits) return false;
  for (const [trait, value] of Object.entries(poster.traits)) {
    if (fish.phenotype[trait] !== value) return false;
  }
  return fish.stage === 'adult';
}

/**
 * Generate initial set of wanted posters.
 */
export function generateInitialPosters(level = 1) {
  const posters = [];
  const count = Math.min(3, 1 + Math.floor(level / 8));
  for (let i = 0; i < count; i++) {
    const poster = generateWantedPoster(level, posters);
    if (poster) posters.push(poster);
  }
  return posters;
}
