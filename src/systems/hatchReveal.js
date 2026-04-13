// ============================================================
// HATCH REVEAL — Gacha-style trait reveal system
// ============================================================

/**
 * Creates a reveal sequence from a hatched fish.
 * Each trait is revealed one at a time with escalating drama.
 */

const TRAIT_RARITY = {
  // Body shapes
  Round: 'common', Slender: 'common', Orb: 'uncommon', Delta: 'uncommon', Eel: 'rare',
  // Colors  
  Azure: 'common', Emerald: 'common', White: 'common',
  Crimson: 'uncommon', Gold: 'uncommon', Violet: 'rare',
  // Patterns
  Solid: 'common', Striped: 'common', Spotted: 'uncommon',
  Marbled: 'uncommon', Gradient: 'rare',
  // Glow
  Normal: 'common', Faint: 'uncommon', Bright: 'rare', Ultraviolet: 'epic',
  // Size
  Small: 'common', Medium: 'common', Large: 'uncommon', Giant: 'rare',
  // Mutations
  None: 'common', Albino: 'rare', Melanistic: 'rare', Iridescent: 'epic',
  'Double Tail': 'rare', Elongated: 'uncommon', Transparent: 'epic',
};

const RARITY_DRAMA = {
  common:    { delay: 400,  shake: 0,   particles: 0,  sound: 'soft',   glow: false },
  uncommon:  { delay: 600,  shake: 0,   particles: 3,  sound: 'chime',  glow: true  },
  rare:      { delay: 800,  shake: 2,   particles: 8,  sound: 'impact', glow: true  },
  epic:      { delay: 1200, shake: 5,   particles: 15, sound: 'epic',   glow: true  },
  legendary: { delay: 1500, shake: 8,   particles: 25, sound: 'legend', glow: true  },
};

const SPECIES_RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

export function createRevealSequence(fish) {
  const ph = fish.phenotype || {};
  const rarity = fish.species?.rarity || 'common';
  const rarityIdx = SPECIES_RARITY_ORDER.indexOf(rarity);

  // Build trait list — ordered from least to most exciting
  const traits = [];

  if (ph.bodyShape) traits.push({
    label: 'Body Shape', value: ph.bodyShape,
    rarity: TRAIT_RARITY[ph.bodyShape] || 'common',
  });
  if (ph.primaryColor) traits.push({
    label: 'Color', value: ph.primaryColor,
    rarity: TRAIT_RARITY[ph.primaryColor] || 'common',
  });
  if (ph.pattern && ph.pattern !== 'Solid') traits.push({
    label: 'Pattern', value: ph.pattern,
    rarity: TRAIT_RARITY[ph.pattern] || 'common',
  });
  if (ph.finType && ph.finType !== 'Standard') traits.push({
    label: 'Fin Type', value: ph.finType,
    rarity: TRAIT_RARITY[ph.finType] || 'common',
  });
  if (ph.size && ph.size !== 'Medium') traits.push({
    label: 'Size', value: ph.size,
    rarity: TRAIT_RARITY[ph.size] || 'common',
  });
  if (ph.glow && ph.glow !== 'Normal') traits.push({
    label: 'Glow', value: ph.glow,
    rarity: TRAIT_RARITY[ph.glow] || 'uncommon',
  });
  if (ph.mutation && ph.mutation !== 'None') traits.push({
    label: 'Mutation', value: '✨ ' + ph.mutation,
    rarity: TRAIT_RARITY[ph.mutation] || 'rare',
  });

  // Sort: common traits first, rare last (build anticipation)
  traits.sort((a, b) => SPECIES_RARITY_ORDER.indexOf(a.rarity) - SPECIES_RARITY_ORDER.indexOf(b.rarity));

  // Add drama info to each trait
  const steps = traits.map((t, i) => ({
    ...t,
    drama: RARITY_DRAMA[t.rarity] || RARITY_DRAMA.common,
    index: i,
  }));

  // Final reveal: the species rarity
  const finalReveal = {
    label: 'Rarity',
    value: `${'★'.repeat(rarityIdx + 1)} ${rarity.toUpperCase()}`,
    rarity,
    drama: RARITY_DRAMA[rarity] || RARITY_DRAMA.common,
    isFinal: true,
  };

  return {
    fish,
    steps,
    finalReveal,
    totalDuration: steps.reduce((sum, s) => sum + s.drama.delay, 0) + (finalReveal.drama.delay || 1000) + 2000,
    estimatedValue: fish.species?.basePrice || 50,
    speciesName: fish.species?.name || 'Unknown Species',
    personality: fish.personality,
    parentIds: fish.parentIds || [],
    generation: fish.generation || 1,
  };
}
