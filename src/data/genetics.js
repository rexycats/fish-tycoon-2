// ============================================================
// FISH TYCOON 2 — GENETICS ENGINE v3 (Phase 3)
// 400+ species via expanded gene system
// ============================================================

export const GENES = {
  bodyShape: {
    name: 'Body Shape',
    alleles: {
      O: { name: 'Orb',      dominant: 4 },
      R: { name: 'Round',    dominant: 3 },
      D: { name: 'Delta',    dominant: 2 },
      S: { name: 'Slender',  dominant: 1 },
      E: { name: 'Eel',      dominant: 0 },
    },
  },
  finType: {
    name: 'Fin Type',
    alleles: {
      V: { name: 'Veil',     dominant: 4 },
      F: { name: 'Flowing',  dominant: 3 },
      B: { name: 'Broad',    dominant: 2 },
      A: { name: 'Angular',  dominant: 1 },
      N: { name: 'Nub',      dominant: 0 },
    },
  },
  pattern: {
    name: 'Pattern',
    alleles: {
      M: { name: 'Marble',   dominant: 4 },
      S: { name: 'Spotted',  dominant: 3 },
      T: { name: 'Tiger',    dominant: 2 },
      L: { name: 'Lined',    dominant: 1 },
      P: { name: 'Plain',    dominant: 0 },
    },
  },
  primaryColor: {
    name: 'Primary Color',
    alleles: {
      C: { name: 'Crimson',  dominant: 5 },
      G: { name: 'Gold',     dominant: 4 },
      V: { name: 'Violet',   dominant: 3 },
      A: { name: 'Azure',    dominant: 2 },
      E: { name: 'Emerald',  dominant: 1 },
      W: { name: 'White',    dominant: 0 },
    },
  },
  secondaryColor: {
    name: 'Secondary Color',
    alleles: {
      O: { name: 'Orange',   dominant: 4 },
      R: { name: 'Rose',     dominant: 3 },
      T: { name: 'Teal',     dominant: 2 },
      I: { name: 'Indigo',   dominant: 1 },
      S: { name: 'Silver',   dominant: 0 },
    },
  },
  glow: {
    name: 'Glow',
    alleles: {
      N: { name: 'Normal',      dominant: 1 },
      G: { name: 'Luminous',    dominant: 2 },
      R: { name: 'Radiant',     dominant: 3 },
      U: { name: 'Ultraviolet', dominant: 4 },
    },
  },
  size: {
    name: 'Size',
    alleles: {
      L: { name: 'Leviathan', dominant: 4 },
      G: { name: 'Giant',     dominant: 3 },
      M: { name: 'Medium',    dominant: 2 },
      T: { name: 'Tiny',      dominant: 1 },
      D: { name: 'Dwarf',     dominant: 0 },
    },
  },
  mutation: {
    name: 'Mutation',
    alleles: {
      N: { name: 'None',       dominant: 5 },
      A: { name: 'Albino',     dominant: 4 },
      M: { name: 'Melanistic', dominant: 3 },
      X: { name: 'Xanthic',    dominant: 2 },
      T: { name: 'Twin-tail',  dominant: 1 },
      S: { name: 'Starfish',   dominant: 0 },
    },
  },
};

export function expressGene(gene, allele1, allele2) {
  const geneData = GENES[gene];
  if (!geneData) return 'Unknown';
  const a1 = geneData.alleles[allele1];
  const a2 = geneData.alleles[allele2];
  if (!a1 && !a2) return 'Unknown';
  if (!a1) return a2.name;
  if (!a2) return a1.name;
  return a1.dominant >= a2.dominant ? a1.name : a2.name;
}

export function computePhenotype(genome) {
  const phenotype = {};
  for (const gene of Object.keys(GENES)) {
    if (!genome[gene]) continue;
    const [a1, a2] = genome[gene];
    phenotype[gene] = expressGene(gene, a1, a2);
  }
  return phenotype;
}

export function phenotypeKey(ph) {
  return [ph.bodyShape, ph.finType, ph.pattern, ph.primaryColor, ph.secondaryColor, ph.glow, ph.size, ph.mutation].join('-');
}

const NAMED_SPECIES = {
  'Orb-Veil-Marble-Crimson-Orange-Normal-Giant-None':      'Vermillion Veil',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Medium-None':     'Coral Orb',
  'Orb-Veil-Marble-Crimson-Rose-Normal-Giant-None':        'Blushing Globe',
  'Orb-Veil-Marble-Crimson-Rose-Normal-Medium-None':       'Rose Lantern',
  'Orb-Veil-Spotted-Crimson-Orange-Normal-Giant-None':     'Ember Globe',
  'Orb-Veil-Spotted-Crimson-Rose-Normal-Giant-None':       'Cherry Blossom Orb',
  'Orb-Veil-Tiger-Crimson-Orange-Normal-Giant-None':       'Tiger Lantern',
  'Orb-Veil-Lined-Crimson-Orange-Normal-Medium-None':      'Striped Ember',
  'Orb-Veil-Plain-Crimson-Orange-Normal-Medium-None':      'Fireball',
  'Orb-Flowing-Marble-Crimson-Orange-Normal-Giant-None':   'Magma Drifter',
  'Orb-Flowing-Marble-Crimson-Rose-Normal-Giant-None':     'Petal Drifter',
  'Orb-Flowing-Spotted-Crimson-Orange-Normal-Giant-None':  'Speckled Ember',
  'Orb-Flowing-Tiger-Crimson-Orange-Normal-Giant-None':    'Flame Tiger',
  'Orb-Broad-Marble-Crimson-Orange-Normal-Giant-None':     'Ruby Barrel',
  'Orb-Angular-Marble-Crimson-Orange-Normal-Giant-None':   'Crimson Shard',
  'Round-Veil-Marble-Crimson-Orange-Normal-Giant-None':    'Crimson Orb',
  'Round-Veil-Marble-Crimson-Orange-Normal-Medium-None':   'Ruby Puff',
  'Round-Veil-Spotted-Crimson-Orange-Normal-Giant-None':   'Speckled Ruby',
  'Round-Veil-Tiger-Crimson-Orange-Normal-Giant-None':     'Tiger Ruby',
  'Round-Flowing-Marble-Crimson-Orange-Normal-Giant-None': 'Magma Sphere',
  'Round-Broad-Marble-Crimson-Orange-Normal-Giant-None':   'Red Boulder',
  'Round-Broad-Marble-Crimson-Rose-Normal-Giant-None':     'Rosy Boulder',
  'Delta-Veil-Marble-Crimson-Orange-Normal-Giant-None':    'Crimson Delta',
  'Delta-Flowing-Marble-Crimson-Rose-Normal-Giant-None':   'Flame Wing',
  'Slender-Veil-Marble-Crimson-Orange-Normal-Giant-None':  'Scarlet Ribbon',
  'Slender-Flowing-Marble-Crimson-Orange-Normal-Giant-None':'Ember Dancer',
  'Slender-Angular-Tiger-Crimson-Orange-Normal-Giant-None':'Fire Viper',
  'Eel-Veil-Marble-Crimson-Orange-Normal-Giant-None':      'Fire Eel',
  'Eel-Flowing-Plain-Crimson-Orange-Normal-Giant-None':    'Lava Eel',
  'Orb-Veil-Marble-Gold-Orange-Normal-Giant-None':         'Gilded Orb',
  'Orb-Veil-Marble-Gold-Rose-Normal-Giant-None':           'Sunburst Veil',
  'Orb-Veil-Spotted-Gold-Orange-Normal-Giant-None':        'Gold Fleck',
  'Orb-Veil-Tiger-Gold-Orange-Normal-Giant-None':          'Amber Tiger',
  'Orb-Flowing-Marble-Gold-Orange-Normal-Giant-None':      'Molten Drifter',
  'Round-Veil-Marble-Gold-Orange-Normal-Giant-None':       'Gold Coin Fish',
  'Round-Veil-Marble-Gold-Rose-Normal-Medium-None':        'Daffodil Puff',
  'Round-Flowing-Marble-Gold-Orange-Normal-Giant-None':    'Sunspot Sphere',
  'Delta-Veil-Marble-Gold-Orange-Normal-Giant-None':       'Delta Sunrise',
  'Delta-Veil-Spotted-Gold-Rose-Normal-Giant-None':        'Speckled Saffron',
  'Delta-Flowing-Marble-Gold-Teal-Normal-Giant-None':      'Teal-Gold Flash',
  'Slender-Veil-Marble-Gold-Orange-Normal-Giant-None':     'Golden Spear',
  'Slender-Flowing-Marble-Gold-Orange-Normal-Giant-None':  'Gilded Ribbon',
  'Slender-Flowing-Tiger-Gold-Teal-Normal-Giant-None':     'Tiger Goldfish',
  'Eel-Veil-Tiger-Gold-Orange-Normal-Giant-None':          'Tiger Moray',
  'Eel-Flowing-Plain-Gold-Orange-Normal-Giant-None':       'Gilt Eel',
  'Orb-Veil-Marble-Azure-Silver-Normal-Giant-None':        'Azure Globe',
  'Orb-Veil-Marble-Azure-Indigo-Normal-Giant-None':        'Midnight Orb',
  'Orb-Veil-Spotted-Azure-Silver-Normal-Giant-None':       'Sapphire Bubble',
  'Orb-Veil-Tiger-Azure-Teal-Normal-Giant-None':           'Blue Tiger Globe',
  'Orb-Flowing-Marble-Azure-Indigo-Normal-Giant-None':     'Ocean Drifter',
  'Round-Veil-Marble-Azure-Silver-Normal-Giant-None':      'Cobalt Ball',
  'Round-Veil-Marble-Azure-Indigo-Normal-Medium-None':     'Ink Puff',
  'Round-Flowing-Marble-Azure-Silver-Normal-Giant-None':   'Storm Sphere',
  'Delta-Veil-Marble-Azure-Silver-Normal-Giant-None':      'Glacier Delta',
  'Slender-Veil-Marble-Azure-Silver-Normal-Giant-None':    'Celestial Streamer',
  'Slender-Flowing-Marble-Azure-Indigo-Normal-Giant-None': 'Tidal Serpent',
  'Slender-Flowing-Tiger-Azure-Teal-Normal-Giant-None':    'Reef Viper',
  'Eel-Flowing-Lined-Azure-Silver-Normal-Giant-None':      'Electric Eel',
  'Eel-Flowing-Marble-Azure-Indigo-Normal-Giant-None':     'Deep Current',
  'Orb-Veil-Marble-Violet-Rose-Normal-Giant-None':         'Amethyst Globe',
  'Orb-Veil-Spotted-Violet-Indigo-Normal-Giant-None':      'Nebula Orb',
  'Orb-Flowing-Marble-Violet-Silver-Normal-Giant-None':    'Lavender Drifter',
  'Round-Veil-Marble-Violet-Rose-Normal-Giant-None':       'Lilac Ball',
  'Delta-Veil-Marble-Violet-Indigo-Normal-Giant-None':     'Violet Delta',
  'Slender-Veil-Marble-Violet-Rose-Normal-Giant-None':     'Twilight Arrow',
  'Slender-Flowing-Marble-Violet-Indigo-Normal-Giant-None':'Mystic Ribbon',
  'Eel-Flowing-Marble-Violet-Indigo-Normal-Giant-None':    'Phantom Eel',
  'Orb-Veil-Marble-Emerald-Teal-Normal-Giant-None':        'Jade Orb',
  'Orb-Veil-Spotted-Emerald-Orange-Normal-Giant-None':     'Jungle Orb',
  'Round-Veil-Marble-Emerald-Teal-Normal-Giant-None':      'Forest Ball',
  'Delta-Veil-Marble-Emerald-Teal-Normal-Giant-None':      'Green Wedge',
  'Slender-Veil-Marble-Emerald-Teal-Normal-Giant-None':    'Malachite Dart',
  'Slender-Flowing-Marble-Emerald-Orange-Normal-Giant-None':'Rainforest Ribbon',
  'Eel-Angular-Lined-Emerald-Teal-Normal-Giant-None':      'Blade Eel',
  'Eel-Nub-Plain-Azure-Silver-Normal-Leviathan-None':      'Abyss Worm',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Leviathan-None':  'Great Crimson Globe',
  'Orb-Veil-Marble-Gold-Orange-Normal-Leviathan-None':     'Grand Gilded Orb',
  'Round-Flowing-Marble-Azure-Indigo-Normal-Leviathan-None':'Colossal Storm',
  'Delta-Veil-Marble-Violet-Indigo-Normal-Leviathan-None': 'Titan Delta',
  'Slender-Flowing-Tiger-Azure-Teal-Normal-Leviathan-None':'Sea Serpent',
  'Eel-Flowing-Marble-Emerald-Teal-Normal-Leviathan-None': 'Ancient Eel',
  'Orb-Veil-Marble-Gold-Rose-Normal-Dwarf-None':           'Micro Gilded',
  'Orb-Veil-Spotted-Azure-Silver-Normal-Dwarf-None':       'Sapphire Mote',
  'Slender-Flowing-Marble-Violet-Rose-Normal-Dwarf-None':  'Fairy Dart',
  'Eel-Flowing-Plain-Emerald-Teal-Normal-Dwarf-None':      'Sprout Eel',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Albino':    'Albino Orb',
  'Orb-Veil-Marble-Gold-Orange-Normal-Giant-Albino':       'White Gold',
  'Round-Veil-Marble-Azure-Silver-Normal-Giant-Albino':    'Ghost Puff',
  'Slender-Flowing-Marble-Violet-Rose-Normal-Giant-Albino':'Snow Ribbon',
  'Delta-Veil-Spotted-Emerald-Teal-Normal-Giant-Albino':   'Pale Jade',
  'Eel-Flowing-Plain-Azure-Silver-Normal-Giant-Albino':    'White Eel',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Melanistic':'Obsidian Orb',
  'Round-Veil-Marble-Gold-Orange-Normal-Giant-Melanistic': 'Midnight Gold',
  'Slender-Flowing-Marble-Azure-Indigo-Normal-Giant-Melanistic':'Shadow Serpent',
  'Eel-Flowing-Plain-Crimson-Orange-Normal-Giant-Melanistic':'Black Fire Eel',
  'Orb-Veil-Marble-Violet-Rose-Normal-Giant-Xanthic':      'Sulfur Globe',
  'Slender-Flowing-Marble-Azure-Silver-Normal-Giant-Xanthic':'Yellow Dart',
  'Delta-Veil-Tiger-Crimson-Orange-Normal-Giant-Xanthic':  'Citrine Delta',
  'Round-Veil-Marble-Crimson-Rose-Normal-Giant-Twin-tail': 'Double Fan',
  'Orb-Veil-Marble-Gold-Orange-Normal-Giant-Twin-tail':    'Twin Gold Orb',
  'Delta-Flowing-Marble-Azure-Silver-Normal-Giant-Twin-tail':'Forked Lightning',
  'Orb-Veil-Marble-Crimson-Orange-Luminous-Giant-None':    'Glowing Ember Orb',
  'Orb-Veil-Marble-Gold-Orange-Luminous-Giant-None':       'Solar Lantern',
  'Orb-Veil-Marble-Azure-Silver-Luminous-Giant-None':      'Radiant Azure Globe',
  'Orb-Veil-Marble-Violet-Rose-Luminous-Giant-None':       'Luminary Amethyst',
  'Orb-Veil-Marble-Emerald-Teal-Luminous-Giant-None':      'Bioluminescent Jade',
  'Orb-Veil-Marble-White-Silver-Luminous-Giant-None':      'Spirit Orb',
  'Round-Flowing-Marble-Azure-Indigo-Luminous-Giant-None': 'Deep Sea Beacon',
  'Slender-Flowing-Tiger-Azure-Teal-Luminous-Giant-None':  'Ethereal Viper',
  'Slender-Flowing-Marble-Violet-Indigo-Luminous-Giant-None':'Mystic Phantom',
  'Eel-Flowing-Plain-Azure-Silver-Luminous-Giant-None':    'Lanternfish Eel',
  'Delta-Veil-Marble-Gold-Orange-Luminous-Giant-None':     'Sunrise Beacon',
  'Orb-Veil-Marble-Crimson-Orange-Radiant-Giant-None':     'Nova Orb',
  'Orb-Veil-Marble-Gold-Orange-Radiant-Giant-None':        'Supernova Lantern',
  'Round-Flowing-Marble-Violet-Indigo-Radiant-Giant-None': 'Pulsar',
  'Slender-Flowing-Tiger-Emerald-Teal-Radiant-Giant-None': 'Radiant Sea Snake',
  'Eel-Flowing-Marble-Azure-Indigo-Radiant-Giant-None':    'Electric Phantom',
  'Orb-Veil-Marble-Crimson-Orange-Ultraviolet-Giant-None':    'UV Crimson Sphere',
  'Orb-Veil-Marble-Gold-Orange-Ultraviolet-Leviathan-None':   'Solar Emperor',
  'Orb-Veil-Marble-Violet-Indigo-Ultraviolet-Giant-None':     'Cosmic Orb',
  'Slender-Flowing-Tiger-Azure-Teal-Ultraviolet-Leviathan-None':'Leviathan Phantom',
  'Eel-Flowing-Marble-Violet-Indigo-Ultraviolet-Leviathan-None':'Ancient Specter',
  'Orb-Veil-Marble-Violet-Indigo-Ultraviolet-Leviathan-Starfish': 'Star Emperor',
  'Slender-Flowing-Plain-White-Silver-Ultraviolet-Giant-Albino':   'Angel Fish',
  'Eel-Flowing-Marble-Crimson-Orange-Ultraviolet-Leviathan-Melanistic':'Void Leviathan',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Starfish':  'Star Ruby',
  'Orb-Veil-Marble-Gold-Orange-Normal-Giant-Starfish':     'Gold Star',
  'Orb-Veil-Marble-Azure-Silver-Normal-Giant-Starfish':    'Sapphire Star',
  'Orb-Veil-Marble-Violet-Indigo-Normal-Giant-Starfish':   'Nebula Star',
  'Orb-Veil-Marble-Emerald-Teal-Normal-Giant-Starfish':    'Emerald Star',
};

const ALLELE_RARITY_SCORES = {
  Orb: 1, Round: 2, Delta: 3, Slender: 4, Eel: 6,
  Veil: 1, Flowing: 2, Broad: 3, Angular: 4, Nub: 5,
  Marble: 1, Spotted: 2, Tiger: 2, Lined: 3, Plain: 4,
  Crimson: 1, Gold: 2, Violet: 3, Azure: 2, Emerald: 3, White: 5,
  Orange: 1, Rose: 2, Teal: 2, Indigo: 3, Silver: 3,
  Normal: 1, Luminous: 10, Radiant: 18, Ultraviolet: 35,
  Leviathan: 8, Giant: 1, Medium: 1, Tiny: 2, Dwarf: 5,
  None: 1, Albino: 8, Melanistic: 8, Xanthic: 10, 'Twin-tail': 12, Starfish: 20,
};

export function computeRarityScore(phenotype) {
  let score = 0;
  for (const val of Object.values(phenotype)) {
    score += ALLELE_RARITY_SCORES[val] || 1;
  }
  return score;
}

export function rarityFromScore(score) {
  if (score >= 55) return 'legendary';
  if (score >= 30) return 'epic';
  if (score >= 18) return 'rare';
  if (score >= 10) return 'uncommon';
  return 'common';
}

export function basePriceFromScore(score, rarity) {
  const base = score * 3;
  const mult = { common: 1, uncommon: 2.5, rare: 6, epic: 15, legendary: 40 }[rarity] || 1;
  return Math.round(base * mult);
}

export function getSpeciesFromPhenotype(phenotype) {
  const key = phenotypeKey(phenotype);
  const name = NAMED_SPECIES[key] || generateProceduralName(phenotype);
  const score = computeRarityScore(phenotype);
  const rarity = rarityFromScore(score);
  const basePrice = basePriceFromScore(score, rarity);
  return { name, rarity, basePrice, rarityScore: score };
}

const ADJ = {
  Crimson: ['Scarlet','Ruby','Ember','Flame','Cinnabar'],
  Gold: ['Gilded','Amber','Honey','Solar','Aureate'],
  Violet: ['Mystic','Amethyst','Twilight','Dusk','Lavender'],
  Azure: ['Cobalt','Ocean','Sky','Sapphire','Cerulean'],
  Emerald: ['Jade','Forest','Jungle','Moss','Malachite'],
  White: ['Ghost','Pearl','Snow','Ivory','Opal'],
};
const NOUN = {
  Orb: ['Sphere','Globe','Orb','Lantern'],
  Round: ['Puff','Bubble','Bead','Drop'],
  Delta: ['Flash','Wedge','Chevron','Dart'],
  Slender: ['Arrow','Dart','Needle','Lance'],
  Eel: ['Eel','Serpent','Snake','Ribbon'],
};
const GLOWPFX = { Luminous: 'Glowing ', Radiant: 'Radiant ', Ultraviolet: 'UV ' };

function generateProceduralName(ph) {
  const glow = GLOWPFX[ph.glow] || '';
  const adj = (ADJ[ph.primaryColor] || ['Mystery'])[Math.floor(Math.random() * 5) % 5];
  const noun = (NOUN[ph.bodyShape] || ['Fish'])[Math.floor(Math.random() * 4) % 4];
  const mut = (ph.mutation && ph.mutation !== 'None') ? ` (${ph.mutation})` : '';
  return `${glow}${adj} ${noun}${mut}`;
}

export const RARITY = {
  common:    { label: 'Common',    color: '#7ec8a0', priceMultiplier: 1.0 },
  uncommon:  { label: 'Uncommon',  color: '#6ab0de', priceMultiplier: 2.5 },
  rare:      { label: 'Rare',      color: '#b07ee8', priceMultiplier: 6.0 },
  epic:      { label: 'Epic',      color: '#f0c040', priceMultiplier: 15.0 },
  legendary: { label: 'Legendary', color: '#ff7eb3', priceMultiplier: 40.0 },
};

export const GROWTH_STAGES = {
  egg:      { label: 'Egg',      durationMs: 60_000 * 2 },
  juvenile: { label: 'Juvenile', durationMs: 60_000 * 5 },
  adult:    { label: 'Adult',    durationMs: Infinity },
};

export function breedGenomes(genomeA, genomeB, donorGenome = null) {
  const offspring = {};
  const DONOR_CHANCE = 0.18; // each allele slot has 18% chance to inherit from donor
  for (const gene of Object.keys(GENES)) {
    if (!genomeA[gene] || !genomeB[gene]) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    const mutate = Math.random() < 0.02;
    if (mutate) {
      const alleleKeys = Object.keys(GENES[gene].alleles);
      offspring[gene] = [
        alleleKeys[Math.floor(Math.random() * alleleKeys.length)],
        alleleKeys[Math.floor(Math.random() * alleleKeys.length)],
      ];
    } else {
      // Pick each allele — donor can contribute if present
      const pickA = Math.random() < 0.5 ? a1 : a2;
      const pickB = Math.random() < 0.5 ? b1 : b2;
      const donor = donorGenome?.[gene];
      const allele0 = donor && Math.random() < DONOR_CHANCE ? donor[Math.random() < 0.5 ? 0 : 1] : pickA;
      const allele1 = donor && Math.random() < DONOR_CHANCE ? donor[Math.random() < 0.5 ? 0 : 1] : pickB;
      offspring[gene] = [allele0, allele1];
    }
  }
  return offspring;
}

// Exact Punnett-square offspring prediction.
// For each gene, the 4 possible diploid outcomes (a1/b1, a1/b2, a2/b1, a2/b2)
// are equally probable (each 1/4). We iterate all 4^N combinations, compute
// the expressed phenotype for each, and accumulate exact fractional weights.
// This is deterministic, fast (~4^8 = 65536 paths), and never noisy.
export function predictOffspringPhenotypes(genomeA, genomeB) {
  const geneKeys = Object.keys(GENES).filter(g => genomeA[g] && genomeB[g]);
  const N = geneKeys.length;
  const total = Math.pow(4, N);   // total equally-weighted paths
  const outcomes = {};            // speciesName → { species, weight }

  for (let path = 0; path < total; path++) {
    // Decode which of the 4 combinations to pick for each gene along this path
    const genome = {};
    let tmp = path;
    for (let gi = 0; gi < N; gi++) {
      const gene = geneKeys[gi];
      const [a1, a2] = genomeA[gene];
      const [b1, b2] = genomeB[gene];
      const combo = tmp % 4; tmp = (tmp / 4) | 0;
      // combos: 0→(a1,b1)  1→(a1,b2)  2→(a2,b1)  3→(a2,b2)
      genome[gene] = combo === 0 ? [a1, b1]
                   : combo === 1 ? [a1, b2]
                   : combo === 2 ? [a2, b1]
                                 : [a2, b2];
    }
    const ph = computePhenotype(genome);
    const sp = getSpeciesFromPhenotype(ph);
    if (!outcomes[sp.name]) outcomes[sp.name] = { species: sp, weight: 0 };
    outcomes[sp.name].weight++;
  }

  return Object.values(outcomes)
    .sort((a, b) => b.weight - a.weight)
    .map(o => ({ ...o, chance: Math.round((o.weight / total) * 100) }));
}

export function randomGenome() {
  const genome = {};
  for (const [gene, geneData] of Object.entries(GENES)) {
    const alleleKeys = Object.keys(geneData.alleles);
    const dominantKey = Object.entries(geneData.alleles)
      .sort((a, b) => b[1].dominant - a[1].dominant)[0][0];
    const weighted = Math.random() < 0.7 ? dominantKey : alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    const a2 = alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    genome[gene] = [weighted, a2];
  }
  return genome;
}

export function createFish({ genome = null, stage = 'adult', parentIds = [], tankId = 'tank_0', targetRarity = null } = {}) {
  let resolvedGenome = genome || randomGenome();
  let phenotype = computePhenotype(resolvedGenome);
  let species = getSpeciesFromPhenotype(phenotype);
  // Retry up to 20 times to hit the target rarity tier (used by shop purchases)
  if (targetRarity && !genome) {
    for (let i = 0; i < 20 && species.rarity !== targetRarity; i++) {
      resolvedGenome = randomGenome();
      phenotype = computePhenotype(resolvedGenome);
      species = getSpeciesFromPhenotype(phenotype);
    }
  }
  const now = Date.now();

  // ── Colour variant selection ──────────────────────────────
  // If the species defines colorVariants, pick one at random.
  // The first entry (default) is weighted 3× more than others,
  // 'rare' variants get 0.5× weight, matching their name.
  let colorVariant = null;
  if (species?.colorVariants?.length > 1) {
    const variants = species.colorVariants;
    const weights  = variants.map((v, i) =>
      i === 0 ? 3.0 :
      v === 'ghost' || v === 'black' ? 0.4 :
      v === 'kohaku' || v === 'red'  ? 0.7 :
      1.0
    );
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < variants.length; i++) {
      r -= weights[i];
      if (r <= 0) { colorVariant = variants[i]; break; }
    }
    colorVariant = colorVariant || variants[0];
  }

  return {
    id: crypto.randomUUID(),
    genome: resolvedGenome,
    phenotype,
    species,
    colorVariant,
    stage,
    bornAt: now,
    stageStartedAt: now,
    health: 100,
    hunger: 0,
    age: 0,
    forSale: false,
    parentIds,
    tankId,
    x: 10 + Math.random() * 80,
    y: 20 + Math.random() * 60,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.1,
  };
}


// ============================================================
// THE 7 MAGIC FISH — Win Condition
// Each requires a specific phenotype combination.
// Ordered by rough difficulty (1 = easiest, 7 = hardest).
// ============================================================
export const MAGIC_FISH = [
  {
    id:          'magic_1',
    number:      1,
    title:       'The Crimson Jewel',
    hint:        'A round-bodied crimson fish with a spotted pattern — said to bring good fortune.',
    lore:        'Ancient sailors once painted its likeness on the prow of their ships. Legend holds that any aquarium housing this fish will never know bad luck.',
    phenotype: {
      bodyShape:      'Round',
      primaryColor:   'Crimson',
      pattern:        'Spotted',
      glow:           'Normal',
      mutation:       'None',
    },
    reward:      150,
    rarity:      'uncommon',
  },
  {
    id:          'magic_2',
    number:      2,
    title:       'The Golden Arrow',
    hint:        'A slender gold fish with flowing fins and a tiger pattern — swift as a sunbeam.',
    lore:        'Priests of the sun god kept one in every temple fountain. Its shadow, they believed, could cure melancholy.',
    phenotype: {
      bodyShape:      'Slender',
      primaryColor:   'Gold',
      finType:        'Flowing',
      pattern:        'Tiger',
      glow:           'Normal',
      mutation:       'None',
    },
    reward:      400,
    rarity:      'rare',
  },
  {
    id:          'magic_3',
    number:      3,
    title:       'The Sapphire Phantom',
    hint:        'An azure eel with a luminous glow and indigo markings — it seems to swim through the dark itself.',
    lore:        'Deep-sea fishermen who glimpsed this creature through their lantern light would refuse to cast nets for a week, fearing it as a messenger from the abyss.',
    phenotype: {
      bodyShape:      'Eel',
      primaryColor:   'Azure',
      secondaryColor: 'Indigo',
      glow:           'Luminous',
      mutation:       'None',
    },
    reward:      900,
    rarity:      'rare',
  },
  {
    id:          'magic_4',
    number:      4,
    title:       'The Twin-Tailed Empress',
    hint:        'An orb-shaped violet fish with twin-tail mutation and veil fins — royalty in every fin stroke.',
    lore:        'Only one was ever kept in captivity — in the imperial palace of a dynasty long forgotten. The court astrologer wrote that its presence "calmed the stars themselves."',
    phenotype: {
      bodyShape:      'Orb',
      primaryColor:   'Violet',
      finType:        'Veil',
      glow:           'Normal',
      mutation:       'Twin-tail',
    },
    reward:      2000,
    rarity:      'epic',
  },
  {
    id:          'magic_5',
    number:      5,
    title:       'The Albino Serpent',
    hint:        'A leviathan-sized slender fish, albino mutation, with flowing fins — impossibly rare, impossibly beautiful.',
    lore:        'Described in only three manuscripts, each written a century apart, each describing the same impossible creature. Scholars assumed it was myth. Perhaps it still is.',
    phenotype: {
      bodyShape:      'Slender',
      size:           'Leviathan',
      finType:        'Flowing',
      glow:           'Normal',
      mutation:       'Albino',
    },
    reward:      5000,
    rarity:      'epic',
  },
  {
    id:          'magic_6',
    number:      6,
    title:       'The Radiant Sun Emperor',
    hint:        'A giant orb-shaped gold fish radiating brilliant light — it outshines everything in the tank.',
    lore:        'The last known sighting was recorded by a merchant who claimed it lit his entire shop from within a single tank. He sold it before he understood what he had.',
    phenotype: {
      bodyShape:      'Orb',
      primaryColor:   'Gold',
      size:           'Giant',
      glow:           'Radiant',
      mutation:       'None',
    },
    reward:      12000,
    rarity:      'epic',
  },
  {
    id:          'magic_7',
    number:      7,
    title:       'The Ancient Specter',
    hint:        'An ultraviolet leviathan eel with violet coloring and melanistic mutation — the rarest being in the ocean.',
    lore:        'The fish that ends all searches. Every great aquarist has chased it. A few have seen it. None have kept it — until now.',
    phenotype: {
      bodyShape:      'Eel',
      primaryColor:   'Violet',
      secondaryColor: 'Indigo',
      size:           'Leviathan',
      glow:           'Ultraviolet',
      mutation:       'Melanistic',
    },
    reward:      50000,
    rarity:      'legendary',
  },
];

// Check if a fish's phenotype matches a magic fish definition
export function checkMagicFishMatch(phenotype, magicFish) {
  for (const [key, val] of Object.entries(magicFish.phenotype)) {
    if (phenotype[key] !== val) return false;
  }
  return true;
}

