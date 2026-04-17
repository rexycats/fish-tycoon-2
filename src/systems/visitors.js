// ============================================================
// FISH TYCOON 2 — VISITOR SIMULATION
// Track visitor flow, satisfaction, and behavior
// ============================================================

// Visitor arrival rate depends on time of day, reputation, happiness
export function computeVisitorFlow(state) {
  const rep = state.shop?.reputation || 0;
  const tanks = state.tanks || [];
  const fish = state.fish || [];

  // Base visitors per game-minute (scales with rep)
  const baseRate = 2 + Math.floor(rep / 10);

  // Time-of-day multiplier (game clock hours)
  const gameClock = state.gameClock || Date.now();
  const gameHour = Math.floor((gameClock % 86_400_000) / 3_600_000);
  let timeMultiplier = 1.0;
  if (gameHour >= 10 && gameHour <= 14) timeMultiplier = 1.5;       // lunch rush
  else if (gameHour >= 16 && gameHour <= 19) timeMultiplier = 1.3;  // afternoon
  else if (gameHour >= 21 || gameHour <= 6) timeMultiplier = 0.3;   // night

  // Happiness attraction
  const avgHappiness = tanks.length > 0
    ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length
    : 50;
  const happinessMultiplier = 0.5 + (avgHappiness / 100);

  // Species diversity bonus
  const uniqueSpecies = new Set(fish.map(f => f.species?.key).filter(Boolean)).size;
  const diversityBonus = 1 + Math.min(0.5, uniqueSpecies * 0.03);

  // Rare fish attraction
  const rareCount = fish.filter(f => ['rare', 'epic', 'legendary'].includes(f.species?.rarity)).length;
  const rareBonus = 1 + Math.min(0.3, rareCount * 0.05);

  // Gift shop / café draw
  const amenityBonus = 1
    + (state.giftShop?.unlocked ? 0.15 + (state.giftShop.level || 0) * 0.05 : 0)
    + (state.cafe?.unlocked ? 0.1 + (state.cafe.level || 0) * 0.05 : 0);

  const visitorsPerMin = Math.round(
    baseRate * timeMultiplier * happinessMultiplier * diversityBonus * rareBonus * amenityBonus
  );

  return {
    visitorsPerMin,
    currentVisitors: Math.round(visitorsPerMin * (0.8 + Math.random() * 0.4)),
    timeMultiplier,
    avgHappiness: Math.round(avgHappiness),
    uniqueSpecies,
    rareCount,
  };
}

// Compute visitor satisfaction (0-100)
export function computeVisitorSatisfaction(state) {
  const tanks = state.tanks || [];
  const fish = state.fish || [];
  let score = 50; // base

  // Cleanliness
  const avgWQ = tanks.length > 0
    ? tanks.reduce((s, t) => s + (t.waterQuality || 0), 0) / tanks.length
    : 50;
  score += (avgWQ - 50) * 0.3; // -15 to +15

  // Happiness
  const avgHappy = tanks.length > 0
    ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length
    : 50;
  score += (avgHappy - 50) * 0.2; // -10 to +10

  // Fish variety
  const uniqueSpecies = new Set(fish.map(f => f.species?.key).filter(Boolean)).size;
  score += Math.min(15, uniqueSpecies * 1.5);

  // Sick fish penalty
  const sickCount = fish.filter(f => f.disease).length;
  score -= sickCount * 3;

  // Decorations bonus
  const decorCount = tanks.reduce((s, t) => s + (t.decorations?.placed?.length || 0), 0);
  score += Math.min(10, decorCount * 1.5);

  // Tank count bonus
  score += Math.min(5, tanks.length * 1.5);

  return Math.max(0, Math.min(100, Math.round(score)));
}

// Generate visitor feedback quotes
const VISITOR_QUOTES = {
  high: [
    "Amazing collection! I'll definitely come back.",
    "The kids loved the rare fish display!",
    "Best aquarium in town, hands down.",
    "So peaceful here. The water is crystal clear.",
    "I bought three souvenirs from the gift shop!",
  ],
  mid: [
    "Nice place, but could use more variety.",
    "Pretty good, but some tanks need cleaning.",
    "Decent visit. Will consider returning.",
    "The fish are nice but the tanks feel cramped.",
  ],
  low: [
    "Kind of disappointing, honestly.",
    "The water looks dirty. Are the fish okay?",
    "Not much to see here yet.",
    "I expected more variety for the price.",
  ],
};

export function getVisitorQuote(satisfaction) {
  const tier = satisfaction >= 70 ? 'high' : satisfaction >= 40 ? 'mid' : 'low';
  const quotes = VISITOR_QUOTES[tier];
  return quotes[Math.floor(Math.random() * quotes.length)];
}
