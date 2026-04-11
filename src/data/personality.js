// ============================================================
// FISH TYCOON 2 — FISH PERSONALITY SYSTEM
// Each fish develops personality traits over time.
// Traits affect behavior, sale value, and create emotional bonds.
// ============================================================

export const PERSONALITY_TRAITS = {
  playful:    { label: 'Playful',    emoji: '🎉', desc: 'Does tricks near the glass',     valueMult: 1.1, behaviorMod: { dartiness: 0.8, idleProbability: -0.15 } },
  shy:        { label: 'Shy',        emoji: '🫣', desc: 'Hides behind decorations',        valueMult: 0.95, behaviorMod: { swimSpeed: -0.2, idleProbability: 0.3 } },
  aggressive: { label: 'Aggressive', emoji: '😤', desc: 'Chases smaller fish',             valueMult: 1.05, behaviorMod: { dartiness: 0.6, swimSpeed: 0.3 } },
  curious:    { label: 'Curious',    emoji: '🧐', desc: 'Follows your cursor',             valueMult: 1.15, behaviorMod: { turnChance: 0.02 } },
  lazy:       { label: 'Lazy',       emoji: '😴', desc: 'Barely moves, loves sleeping',    valueMult: 0.9,  behaviorMod: { swimSpeed: -0.4, idleProbability: 0.5 } },
  glutton:    { label: 'Glutton',    emoji: '🍽️', desc: 'Always hungry, eats 2× food',     valueMult: 0.95, behaviorMod: {} },
  social:     { label: 'Social',     emoji: '💕', desc: 'Swims near other fish',           valueMult: 1.1,  behaviorMod: { idleProbability: -0.1 } },
  loner:      { label: 'Loner',      emoji: '🌑', desc: 'Prefers the tank edges',          valueMult: 1.0,  behaviorMod: {} },
  showoff:    { label: 'Show-off',   emoji: '✨', desc: 'Poses for visitors (bonus tips)', valueMult: 1.2,  behaviorMod: { dartiness: 0.4 } },
  zen:        { label: 'Zen',        emoji: '🧘', desc: 'Calms nearby fish',               valueMult: 1.05, behaviorMod: { swimSpeed: -0.15, bobAmplitude: -0.005 } },
};

const TRAIT_KEYS = Object.keys(PERSONALITY_TRAITS);

/**
 * Assign a personality to a fish based on its genetics + randomness.
 * Called when a fish reaches adulthood.
 */
export function assignPersonality(fish) {
  if (fish.personality) return fish.personality; // Already assigned
  // Weight by rarity — rarer fish more likely to get high-value personalities
  const rarityWeights = {
    common: [0.2, 0.2, 0.1, 0.05, 0.15, 0.1, 0.1, 0.05, 0.02, 0.03],
    uncommon: [0.15, 0.12, 0.1, 0.1, 0.1, 0.08, 0.12, 0.05, 0.08, 0.1],
    rare: [0.1, 0.08, 0.08, 0.15, 0.05, 0.05, 0.12, 0.05, 0.15, 0.17],
    epic: [0.08, 0.05, 0.05, 0.18, 0.03, 0.03, 0.1, 0.05, 0.2, 0.23],
  };
  const weights = rarityWeights[fish.species?.rarity] || rarityWeights.common;
  let r = Math.random();
  for (let i = 0; i < TRAIT_KEYS.length; i++) {
    r -= weights[i] || (1 / TRAIT_KEYS.length);
    if (r <= 0) return TRAIT_KEYS[i];
  }
  return TRAIT_KEYS[Math.floor(Math.random() * TRAIT_KEYS.length)];
}

/**
 * Get bonding level based on fish age (in seconds).
 * Longer-lived fish develop deeper bonds.
 */
export function getBondLevel(age) {
  if (age > 86400)  return { level: 3, label: 'Soulmate',  emoji: '💎', tipBonus: 0.3  }; // 24+ hours
  if (age > 28800)  return { level: 2, label: 'Best Friend', emoji: '💛', tipBonus: 0.15 }; // 8+ hours
  if (age > 7200)   return { level: 1, label: 'Buddy',     emoji: '🤝', tipBonus: 0.05 }; // 2+ hours
  return { level: 0, label: 'New', emoji: '', tipBonus: 0 };
}
