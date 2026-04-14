// ============================================================
// AQUARIUM REVIEWS — critics rate your shop
// ============================================================

const REVIEW_HEADLINES = {
  1: ["Avoid at All Costs", "A Fishy Disaster", "Sad Tanks, Sadder Fish"],
  2: ["Room for Improvement", "Mediocre at Best", "Needs Work"],
  3: ["A Decent Spot", "Worth a Quick Visit", "Average Aquarium"],
  4: ["Hidden Gem!", "Impressive Collection", "A Must-Visit"],
  5: ["World-Class Aquarium!", "Absolute Perfection", "The Best in Town"],
};

const CRITIC_NAMES = [
  '🗞️ The Daily Reef', '📰 Ocean Times', '🎙️ AquaCritic', '📝 FishWeekly',
  'Marine Gazette', 'Coral Radio',
];

export function generateReview(state) {
  const tanks = state.tanks || [];
  const fish = state.fish || [];
  const shop = state.shop || {};

  // Score components (each 0-20, total 0-100 → star rating)
  let score = 0;

  // 1. Species diversity (0-20)
  const uniqueSpecies = new Set(fish.map(f => f.species?.name)).size;
  score += Math.min(20, uniqueSpecies * 3);

  // 2. Tank cleanliness (0-20)
  const avgWq = tanks.length > 0
    ? tanks.reduce((s, t) => s + (t.waterQuality || 0), 0) / tanks.length : 0;
  score += Math.round(avgWq / 5);

  // 3. Fish happiness (0-20)
  const avgHappy = tanks.length > 0
    ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length : 0;
  score += Math.round(avgHappy / 5);

  // 4. Tank count & decorations (0-20)
  const decorCount = tanks.reduce((s, t) => s + (t.decorations?.placed?.length || 0), 0);
  score += Math.min(20, tanks.length * 4 + decorCount * 2);

  // 5. Reputation & rare fish (0-20)
  const rareCount = fish.filter(f => ['rare','epic','legendary'].includes(f.species?.rarity)).length;
  score += Math.min(20, (shop.reputation || 0) / 3 + rareCount * 3);

  const stars = Math.max(1, Math.min(5, Math.ceil(score / 20)));
  const headlines = REVIEW_HEADLINES[stars];
  const headline = headlines[Math.floor(Math.random() * headlines.length)];
  const critic = CRITIC_NAMES[Math.floor(Math.random() * CRITIC_NAMES.length)];

  return {
    stars,
    score,
    headline,
    critic,
    generatedAt: Date.now(),
    details: {
      diversity: uniqueSpecies,
      cleanliness: Math.round(avgWq),
      happiness: Math.round(avgHappy),
      decorations: decorCount,
      rarefish: rareCount,
    },
  };
}
