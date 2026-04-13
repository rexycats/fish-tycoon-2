// ============================================================
// FISH TYCOON 2 — GENETICS ENGINE v3 (Phase 3)
// 400+ species via expanded gene system
// ============================================================

// Polyfill crypto.randomUUID for browsers without it (Safari <15.4, older Firefox)
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  crypto.randomUUID = () => '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}

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
      N: { name: 'None',          dominant: 10 },
      A: { name: 'Albino',        dominant: 9 },
      M: { name: 'Melanistic',    dominant: 8 },
      X: { name: 'Xanthic',       dominant: 7 },
      T: { name: 'Twin-tail',     dominant: 6 },
      S: { name: 'Starfish',      dominant: 5 },
      // Tier 2: Rare mutations
      I: { name: 'Iridescent',    dominant: 4 },
      L: { name: 'Bioluminescent',dominant: 3 },
      // Tier 3: Legendary mutations (recipe-only)
      C: { name: 'Crystalline',   dominant: 2 },
      V: { name: 'Void',          dominant: 1 },
      P: { name: 'Phoenix',       dominant: 0 },
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

function phenotypeKey(ph) {
  return [ph.bodyShape, ph.finType, ph.pattern, ph.primaryColor, ph.secondaryColor, ph.glow, ph.size, ph.mutation].join('-');
}

const NAMED_SPECIES = {
  'Orb-Veil-Marble-Crimson-Orange-Normal-Giant-None':      'Vermillion Veil',
  'Orb-Veil-Marble-Crimson-Orange-Normal-Medium-None':     'Coral Puffer',
  'Orb-Veil-Marble-Crimson-Rose-Normal-Giant-None':        'Blushing Gourami',
  'Orb-Veil-Marble-Crimson-Rose-Normal-Medium-None':       'Rose Molly',
  'Orb-Veil-Spotted-Crimson-Orange-Normal-Giant-None':     'Ember Goby',
  'Orb-Veil-Spotted-Crimson-Rose-Normal-Giant-None':       'Cherry Blossom Guppy',
  'Orb-Veil-Tiger-Crimson-Orange-Normal-Giant-None':       'Tiger Goby',
  'Orb-Veil-Lined-Crimson-Orange-Normal-Medium-None':      'Striped Ember Platy',
  'Orb-Veil-Plain-Crimson-Orange-Normal-Medium-None':      'Fireball',
  'Orb-Flowing-Marble-Crimson-Orange-Normal-Giant-None':   'Magma Gourami',
  'Orb-Flowing-Marble-Crimson-Rose-Normal-Giant-None':     'Petal Gourami',
  'Orb-Flowing-Spotted-Crimson-Orange-Normal-Giant-None':  'Speckled Ember Puffer',
  'Orb-Flowing-Tiger-Crimson-Orange-Normal-Giant-None':    'Flame Tiger',
  'Orb-Broad-Marble-Crimson-Orange-Normal-Giant-None':     'Ruby Cichlid',
  'Orb-Angular-Marble-Crimson-Orange-Normal-Giant-None':   'Crimson Darter',
  'Round-Veil-Marble-Crimson-Orange-Normal-Giant-None':    'Crimson Sunfish',
  'Round-Veil-Marble-Crimson-Orange-Normal-Medium-None':   'Ruby Danio',
  'Round-Veil-Spotted-Crimson-Orange-Normal-Giant-None':   'Speckled Ruby Barb',
  'Round-Veil-Tiger-Crimson-Orange-Normal-Giant-None':     'Tiger Ruby Barb',
  'Round-Flowing-Marble-Crimson-Orange-Normal-Giant-None': 'Magma Perch',
  'Round-Broad-Marble-Crimson-Orange-Normal-Giant-None':   'Red Cichlid',
  'Round-Broad-Marble-Crimson-Rose-Normal-Giant-None':     'Rosy Cichlid',
  'Delta-Veil-Marble-Crimson-Orange-Normal-Giant-None':    'Crimson Rasbora',
  'Delta-Flowing-Marble-Crimson-Rose-Normal-Giant-None':   'Flame Wing',
  'Slender-Veil-Marble-Crimson-Orange-Normal-Giant-None':  'Scarlet Swordtail',
  'Slender-Flowing-Marble-Crimson-Orange-Normal-Giant-None':'Ember Rainbowfish',
  'Slender-Angular-Tiger-Crimson-Orange-Normal-Giant-None':'Fire Viper',
  'Eel-Veil-Marble-Crimson-Orange-Normal-Giant-None':      'Fire Eel',
  'Eel-Flowing-Plain-Crimson-Orange-Normal-Giant-None':    'Lava Eel',
  'Orb-Veil-Marble-Gold-Orange-Normal-Giant-None':         'Gilded Puffer',
  'Orb-Veil-Marble-Gold-Rose-Normal-Giant-None':           'Sunburst Molly',
  'Orb-Veil-Spotted-Gold-Orange-Normal-Giant-None':        'Gold Fleck Goby',
  'Orb-Veil-Tiger-Gold-Orange-Normal-Giant-None':          'Amber Tiger Puffer',
  'Orb-Flowing-Marble-Gold-Orange-Normal-Giant-None':      'Molten Gourami',
  'Round-Veil-Marble-Gold-Orange-Normal-Giant-None':       'Gold Coin Barb',
  'Round-Veil-Marble-Gold-Rose-Normal-Medium-None':        'Daffodil Platy',
  'Round-Flowing-Marble-Gold-Orange-Normal-Giant-None':    'Sunspot Perch',
  'Delta-Veil-Marble-Gold-Orange-Normal-Giant-None':       'Sunrise Tetra',
  'Delta-Veil-Spotted-Gold-Rose-Normal-Giant-None':        'Speckled Saffron Darter',
  'Delta-Flowing-Marble-Gold-Teal-Normal-Giant-None':      'Teal-Gold Flash',
  'Slender-Veil-Marble-Gold-Orange-Normal-Giant-None':     'Golden Swordtail',
  'Slender-Flowing-Marble-Gold-Orange-Normal-Giant-None':  'Gilded Rainbowfish',
  'Slender-Flowing-Tiger-Gold-Teal-Normal-Giant-None':     'Tiger Rainbowfish',
  'Eel-Veil-Tiger-Gold-Orange-Normal-Giant-None':          'Tiger Moray',
  'Eel-Flowing-Plain-Gold-Orange-Normal-Giant-None':       'Gilt Eel',
  'Orb-Veil-Marble-Azure-Silver-Normal-Giant-None':        'Azure Puffer',
  'Orb-Veil-Marble-Azure-Indigo-Normal-Giant-None':        'Midnight Goby',
  'Orb-Veil-Spotted-Azure-Silver-Normal-Giant-None':       'Sapphire Guppy',
  'Orb-Veil-Tiger-Azure-Teal-Normal-Giant-None':           'Blue Tiger Puffer',
  'Orb-Flowing-Marble-Azure-Indigo-Normal-Giant-None':     'Ocean Gourami',
  'Round-Veil-Marble-Azure-Silver-Normal-Giant-None':      'Cobalt Cichlid',
  'Round-Veil-Marble-Azure-Indigo-Normal-Medium-None':     'Ink Platy',
  'Round-Flowing-Marble-Azure-Silver-Normal-Giant-None':   'Storm Perch',
  'Delta-Veil-Marble-Azure-Silver-Normal-Giant-None':      'Glacier Tetra',
  'Slender-Veil-Marble-Azure-Silver-Normal-Giant-None':    'Celestial Swordtail',
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
  'Orb-Veil-Marble-Crimson-Orange-Ultraviolet-Giant-None':    'Crimson Sphere',
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
  // Scores reflect how RARE the trait is to see, not its dominance.
  // Dominant alleles appear often → low score. Recessive = high score.
  // Body shapes (Orb dominant → Eel recessive)
  Orb: 0, Round: 1, Delta: 2, Slender: 3, Eel: 5,
  // Fin types (Veil dominant → Nub recessive)
  Veil: 0, Flowing: 1, Broad: 2, Angular: 3, Nub: 5,
  // Patterns (Marble dominant → Plain recessive)
  Marble: 0, Spotted: 1, Tiger: 2, Lined: 3, Plain: 4,
  // Primary colors (Crimson dominant → White recessive)
  Crimson: 0, Gold: 1, Violet: 2, Azure: 1, Emerald: 2, White: 4,
  // Secondary colors (Orange dominant → Silver recessive)
  Orange: 0, Rose: 1, Teal: 1, Indigo: 2, Silver: 3,
  // Glow (Ultraviolet is DOMINANT so it's common — low score!)
  Ultraviolet: 0, Radiant: 1, Luminous: 2, Normal: 3,
  // Size (Leviathan is DOMINANT so it's common — low score!)
  Leviathan: 0, Giant: 1, Medium: 1, Tiny: 2, Dwarf: 4,
  // Mutations (None is very dominant = common. Tier 2-3 only via recipes)
  None: 0, Albino: 4, Melanistic: 4, Xanthic: 5, 'Twin-tail': 5, Starfish: 6,
  Iridescent: 8, Bioluminescent: 9, Crystalline: 14, Void: 16, Phoenix: 18,
};

function computeRarityScore(phenotype) {
  let score = 0;
  for (const val of Object.values(phenotype)) {
    score += ALLELE_RARITY_SCORES[val] ?? 1;
  }
  return score;
}

function rarityFromScore(score) {
  if (score >= 18) return 'legendary';
  if (score >= 12) return 'epic';
  if (score >= 7) return 'rare';
  if (score >= 3) return 'uncommon';
  return 'common';
}

function basePriceFromScore(score, rarity) {
  const base = Math.max(8, score * 4 + 8);
  const mult = { common: 1, uncommon: 2, rare: 5, epic: 12, legendary: 30 }[rarity] || 1;
  return Math.round(base * mult);
}

export function getSpeciesFromPhenotype(phenotype, genome = null) {
  const key = phenotypeKey(phenotype);
  let name = NAMED_SPECIES[key] || generateProceduralName(phenotype, genome);
  const score = computeRarityScore(phenotype);
  const rarity = rarityFromScore(score);
  let basePrice = basePriceFromScore(score, rarity);

  // Purity price boost — only when genome is provided
  // (Name suffix is already handled in generateProceduralName)
  if (genome) {
    let pureCount = 0, totalGenes = 0;
    for (const g of Object.keys(GENES)) {
      if (!genome[g]) continue;
      totalGenes++;
      if (genome[g][0] === genome[g][1]) pureCount++;
    }
    if (pureCount === totalGenes && totalGenes > 0) {
      basePrice = Math.round(basePrice * 3);
    } else if (pureCount >= 5) {
      basePrice = Math.round(basePrice * 2);
    } else if (pureCount >= 3) {
      basePrice = Math.round(basePrice * 1.4);
    }
  }

  return { name, rarity, basePrice, rarityScore: score };
}

const ADJ = {
  Crimson: ['Crimson','Ruby','Scarlet','Ember','Blaze','Phoenix','Inferno','Garnet','Vermillion','Cinnabar'],
  Gold: ['Golden','Amber','Sunlit','Gilded','Honeyed','Aureate','Topaz','Marigold','Saffron','Sovereign'],
  Violet: ['Amethyst','Twilight','Royal','Imperial','Orchid','Mystic','Indigo','Nebula','Regal','Phantom'],
  Azure: ['Sapphire','Cobalt','Midnight','Arctic','Pacific','Celestial','Storm','Glacier','Abyss','Tidal'],
  Emerald: ['Jade','Verdant','Jungle','Malachite','Fern','Sylvan','Evergreen','Moss','Serpentine','Tropic'],
  White: ['Pearl','Ghost','Ivory','Crystal','Diamond','Frost','Opal','Platinum','Moonlit','Spectral'],
};
const NOUN = {
  Orb:     ['Oracle','Lantern','Globe','Jewel','Bubble','Moon','Pearl','Marble','Gem','Droplet'],
  Round:   ['Emperor','Sovereign','Guardian','Sentinel','Baron','Knight','Regent','Warden','Herald','Noble'],
  Delta:   ['Dart','Arrow','Phantom','Whisper','Flash','Spark','Streak','Bolt','Zephyr','Glider'],
  Slender: ['Blade','Dagger','Spear','Needle','Lance','Rapier','Stiletto','Sabre','Pike','Striker'],
  Eel:     ['Serpent','Dragon','Viper','Wyrm','Shadow','Spectre','Wraith','Shade','Phantom','Crawler'],
};
const PATTERN_MOD = {
  Spotted: ['Spotted ','Dappled ','Freckled ','Star-marked ','Constellation '],
  Tiger:   ['Tiger ','Banded ','Ringed ','Striped ','Barred '],
  Marble:  ['Marbled ','Painted ','Mosaic ','Veined ','Swirled '],
  Lined:   ['Lined ','Pinstripe ','Threaded ','Traced ','Etched '],
  Plain:   ['','','','',''],
};
const FIN_MOD = {
  Veil:    [' Veiltail',' Cascadia',' Silktail',' Flowtail',''],
  Flowing: [' Fantail',' Wisp',' Plume','',''],
  Broad:   ['','','','',''],
  Angular: ['','','','',''],
  Nub:     ['','','','',''],
};
const SIZE_MOD = {
  Dwarf:     ['Little ','Pygmy ','Petite ','Miniature ',''],
  Tiny:      ['','','','',''],
  Medium:    ['','','','',''],
  Giant:     ['Grand ','Great ','King ','Elder ',''],
  Leviathan: ['Titan ','Colossal ','Ancient ','Leviathan ','Primordial '],
};
const GLOWPFX = { Luminous: 'Luminous ', Radiant: 'Radiant ', Ultraviolet: '' };

// Rare title patterns for epic/legendary fish
const EPIC_TITLES = [
  (adj, noun) => `${adj} ${noun}`,
  (adj, noun) => `The ${adj} ${noun}`,
  (adj, noun) => `${noun} of ${adj} Depths`,
  (adj, noun) => `${adj} ${noun} Rex`,
  (adj, noun) => `${noun} Primus`,
];
const LEGENDARY_TITLES = [
  (adj, noun) => `${adj} ${noun} the Magnificent`,
  (adj, noun) => `The Eternal ${adj} ${noun}`,
  (adj, noun) => `${noun} of the ${adj} Abyss`,
  (adj, noun) => `${adj} ${noun} Imperator`,
  (adj, noun) => `The Last ${adj} ${noun}`,
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateProceduralName(ph, genome = null) {
  const glow = GLOWPFX[ph.glow] || '';
  const showSize = ph.size === 'Dwarf' || ph.size === 'Tiny' || ph.size === 'Giant' || ph.size === 'Leviathan';
  const size = showSize ? pick(SIZE_MOD[ph.size] || ['']) : '';
  const showPattern = ph.pattern !== 'Plain' && Math.random() < 0.5; // 50% chance to show pattern
  const pattern = showPattern ? pick(PATTERN_MOD[ph.pattern] || ['']) : '';
  const adj = pick(ADJ[ph.primaryColor] || ['Mystery']);
  const noun = pick(NOUN[ph.bodyShape] || ['Fish']);
  const showFin = (ph.finType === 'Veil' || ph.finType === 'Flowing') && Math.random() < 0.4;
  const fin = showFin ? pick(FIN_MOD[ph.finType] || ['']) : '';
  // Mutation prefix replaces the old "(Mutation)" suffix
  const MUTATION_PREFIX = {
    Albino: ['Ghost ', 'Spectral ', 'Phantom '],
    Melanistic: ['Void ', 'Shadow ', 'Obsidian '],
    Xanthic: ['Solar ', 'Gilded ', 'Sunfire '],
    'Twin-tail': ['Mirror ', 'Twin ', 'Gemini '],
    Starfish: ['Star ', 'Astral ', 'Celestial '],
    Iridescent: ['Prismatic ', 'Opal ', 'Chromatic '],
    Bioluminescent: ['Abyssal ', 'Deepglow ', 'Noctis '],
    Crystalline: ['Crystal ', 'Glass ', 'Diamond '],
    Void: ['Cosmic ', 'Nebula ', 'Void '],
    Phoenix: ['Ember ', 'Phoenix ', 'Eternal '],
  };
  const mutPrefix = (ph.mutation && ph.mutation !== 'None' && MUTATION_PREFIX[ph.mutation])
    ? pick(MUTATION_PREFIX[ph.mutation])
    : '';

  // ── Purity suffix (Feature 5) ─────────────────────────
  const PURITY_SUFFIX = [
    null, null, null,       // 0-2 pure: no suffix
    'the Refined',          // 3
    'the Refined',          // 4
    'the Pure',             // 5
    'the Pure',             // 6
    'the Perfected',        // 7
    'the Perfected',        // 8
  ];
  let suffix = '';
  if (genome) {
    let pureCount = 0;
    for (const gene of Object.keys(GENES)) {
      if (genome[gene]?.[0] === genome[gene]?.[1]) pureCount++;
    }
    if (PURITY_SUFFIX[pureCount]) suffix = ' ' + PURITY_SUFFIX[pureCount];
  }

  // Rare fish get dramatic title patterns
  const score = computeRarityScore(ph);
  const rarity = rarityFromScore(score);

  if (rarity === 'legendary' && Math.random() < 0.7) {
    const titleFn = pick(LEGENDARY_TITLES);
    return `${mutPrefix}${glow}${titleFn(adj, noun)}${suffix}`.replace(/  +/g, ' ').trim();
  }
  if (rarity === 'epic' && Math.random() < 0.4) {
    const titleFn = pick(EPIC_TITLES);
    return `${mutPrefix}${glow}${titleFn(adj, noun)}${suffix}`.replace(/  +/g, ' ').trim();
  }

  return `${mutPrefix}${glow}${size}${pattern}${adj} ${noun}${fin}${suffix}`.replace(/  +/g, ' ').trim();
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

// ═══════════════════════════════════════════════════════════
// CARRIER TRAITS — show hidden recessive alleles
// ═══════════════════════════════════════════════════════════
export function getCarrierTraits(genome) {
  if (!genome) return [];
  const carriers = [];
  for (const gene of Object.keys(GENES)) {
    if (!genome[gene]) continue;
    const [a1, a2] = genome[gene];
    const geneData = GENES[gene];
    const d1 = geneData.alleles[a1]?.dominant ?? 0;
    const d2 = geneData.alleles[a2]?.dominant ?? 0;
    const expressed = d1 >= d2 ? a1 : a2;
    const recessive = d1 >= d2 ? a2 : a1;
    // If the two alleles differ, the recessive is "carried" but hidden
    if (expressed !== recessive && geneData.alleles[recessive]) {
      const recessiveName = geneData.alleles[recessive].name;
      const expressedName = geneData.alleles[expressed].name;
      // Skip boring carriers (None, Normal, Plain, Medium, Standard)
      if (['None', 'Normal', 'Plain', 'Medium', 'Standard', 'Nub'].includes(recessiveName)) continue;
      carriers.push({
        gene: geneData.name,
        geneKey: gene,
        expressed: expressedName,
        carried: recessiveName,
        allele: recessive,
      });
    }
  }
  return carriers;
}

// ═══════════════════════════════════════════════════════════
// LEGENDARY COMBINATIONS — named allele combos players chase
// ═══════════════════════════════════════════════════════════
export const LEGENDARY_COMBOS = [
  {
    id: 'void_flame',
    name: 'Void Flame',
    desc: 'Dark body with glowing crimson veins. Born from shadow and fire.',
    traits: { mutation: 'Melanistic', primaryColor: 'Crimson', glow: 'Ultraviolet' },
    emoji: '🔥',
    priceBonus: 20,
    particle: 'ember',
  },
  {
    id: 'ghost_pearl',
    name: 'Ghost Pearl',
    desc: 'Translucent with a faint ethereal shimmer. Barely there, hauntingly beautiful.',
    traits: { mutation: 'Albino', primaryColor: 'White', glow: 'Luminous' },
    emoji: '👻',
    priceBonus: 15,
    particle: 'mist',
  },
  {
    id: 'dragon_king',
    name: 'Dragon King',
    desc: 'A serpentine golden dragon. Legends say it grants wishes.',
    traits: { bodyShape: 'Eel', primaryColor: 'Gold', glow: 'Radiant' },
    emoji: '🐉',
    priceBonus: 18,
    particle: 'gold',
  },
  {
    id: 'abyssal_star',
    name: 'Abyssal Star',
    desc: 'A violet orb pulsing with ultraviolet light from the deepest trench.',
    traits: { bodyShape: 'Orb', primaryColor: 'Violet', glow: 'Ultraviolet' },
    emoji: '⭐',
    priceBonus: 22,
    particle: 'star',
  },
  {
    id: 'solar_eclipse',
    name: 'Solar Eclipse',
    desc: 'A dark delta with a blazing crimson corona. Blots out the light.',
    traits: { bodyShape: 'Delta', primaryColor: 'Crimson', mutation: 'Melanistic' },
    emoji: '🌑',
    priceBonus: 16,
    particle: 'corona',
  },
  {
    id: 'jade_emperor',
    name: 'Jade Emperor',
    desc: 'A massive emerald sovereign. Ancient and wise beyond its years.',
    traits: { primaryColor: 'Emerald', size: 'Giant', glow: 'Radiant' },
    emoji: '🏯',
    priceBonus: 14,
    particle: 'jade',
  },
  {
    id: 'frost_wraith',
    name: 'Frost Wraith',
    desc: 'An azure phantom trailing ice crystals. The water chills wherever it swims.',
    traits: { primaryColor: 'Azure', mutation: 'Albino', bodyShape: 'Slender' },
    emoji: '❄️',
    priceBonus: 13,
    particle: 'ice',
  },
  {
    id: 'golden_enigma',
    name: 'Golden Enigma',
    desc: 'A marbled golden orb that seems to shift patterns as you watch.',
    traits: { primaryColor: 'Gold', pattern: 'Marble', bodyShape: 'Orb' },
    emoji: '✨',
    priceBonus: 10,
    particle: 'shimmer',
  },
];

/**
 * Check if a phenotype matches any legendary combo.
 * Returns the combo object or null.
 */
export function checkLegendaryCombo(phenotype) {
  if (!phenotype) return null;
  for (const combo of LEGENDARY_COMBOS) {
    let match = true;
    for (const [trait, value] of Object.entries(combo.traits)) {
      if (phenotype[trait] !== value) { match = false; break; }
    }
    if (match) return combo;
  }
  return null;
}

export function breedGenomes(genomeA, genomeB, donorGenome = null, mutationRate = 0.02) {
  const offspring = {};
  const DONOR_CHANCE = 0.18; // each allele slot has 18% chance to inherit from donor
  for (const gene of Object.keys(GENES)) {
    if (!genomeA[gene] || !genomeB[gene]) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    const mutate = Math.random() < mutationRate;
    if (mutate) {
      // For the mutation gene, restrict random rolls to Tier 1 only
      // Tier 2/3 mutations (I,L,C,V,P) require specific breeding recipes
      const TIER1_MUTATION_ALLELES = ['N', 'A', 'M', 'X', 'T', 'S'];
      const alleleKeys = gene === 'mutation'
        ? TIER1_MUTATION_ALLELES
        : Object.keys(GENES[gene].alleles);
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

  // ── Check mutation recipes ──────────────────────────────
  // If breeding parents match a recipe, override the mutation gene
  const recipeAllele = checkMutationRecipe(genomeA, genomeB);
  if (recipeAllele && offspring.mutation) {
    offspring.mutation = [recipeAllele, recipeAllele]; // homozygous legendary mutation
  }

  return offspring;
}

// ── Mutation Recipes ────────────────────────────────────────
// Tier 2-3 mutations can be triggered by specific parent combinations.
// Recipe matches override random mutation for the mutation gene only.
const MUTATION_RECIPES = [
  // Tier 2
  {
    id: 'iridescent',
    allele: 'I',
    tier: 2,
    chance: 0.15,
    check: (phA, phB) =>
      phA.glow !== 'Normal' && phB.glow !== 'Normal',
    hint: 'Breed two fish that both have glow traits',
  },
  {
    id: 'bioluminescent',
    allele: 'L',
    tier: 2,
    chance: 0.10,
    check: (phA, phB) =>
      (phA.glow === 'Ultraviolet' || phB.glow === 'Ultraviolet') &&
      (phA.glow !== 'Normal' && phB.glow !== 'Normal'),
    hint: 'Breed an Ultraviolet fish with another glowing fish',
  },
  // Tier 3
  {
    id: 'crystalline',
    allele: 'C',
    tier: 3,
    chance: 0.08,
    check: (phA, phB) =>
      phA.mutation === 'Albino' && phB.mutation === 'Albino' &&
      (phA.glow === 'Ultraviolet' || phB.glow === 'Ultraviolet'),
    hint: 'Ancient legends speak of Albino pairs touched by ultraviolet light...',
  },
  {
    id: 'void',
    allele: 'V',
    tier: 3,
    chance: 0.06,
    check: (phA, phB) => {
      const h = new Date().getHours();
      const isNight = h >= 22 || h < 5;
      return phA.mutation === 'Melanistic' && phB.mutation === 'Melanistic' && isNight;
    },
    hint: 'Two Melanistic fish bred under the darkest skies might become something more...',
  },
  {
    id: 'phoenix',
    allele: 'P',
    tier: 3,
    chance: 0.05,
    check: (phA, phB, genomeA, genomeB) => {
      // One parent must have a Tier 2+ mutation, the other must have 5+ pure genes
      const hasTier2A = ['Iridescent','Bioluminescent','Crystalline','Void','Phoenix'].includes(phA.mutation);
      const hasTier2B = ['Iridescent','Bioluminescent','Crystalline','Void','Phoenix'].includes(phB.mutation);
      const countPure = (g) => {
        let c = 0;
        for (const gene of Object.keys(GENES)) {
          if (g?.[gene]?.[0] === g?.[gene]?.[1]) c++;
        }
        return c;
      };
      const pureA = countPure(genomeA);
      const pureB = countPure(genomeB);
      return (hasTier2A && pureB >= 5) || (hasTier2B && pureA >= 5);
    },
    hint: 'A mutant paired with a pure-bred specimen may transcend nature itself...',
  },
];

export { MUTATION_RECIPES };

/**
 * Check if a breeding pair triggers a mutation recipe.
 * Returns the recipe allele key if triggered, null otherwise.
 */
export function checkMutationRecipe(genomeA, genomeB) {
  const phA = computePhenotype(genomeA);
  const phB = computePhenotype(genomeB);
  // Check recipes in order (tier 3 first for priority)
  const sorted = [...MUTATION_RECIPES].sort((a, b) => b.tier - a.tier);
  for (const recipe of sorted) {
    if (recipe.check(phA, phB, genomeA, genomeB) && Math.random() < recipe.chance) {
      return recipe.allele;
    }
  }
  return null;
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
  const TIER1_MUTATION_ALLELES = ['N', 'A', 'M', 'X', 'T', 'S'];
  for (const [gene, geneData] of Object.entries(GENES)) {
    const alleleKeys = gene === 'mutation'
      ? TIER1_MUTATION_ALLELES
      : Object.keys(geneData.alleles);
    const dominantKey = Object.entries(geneData.alleles)
      .sort((a, b) => b[1].dominant - a[1].dominant)[0][0];
    const weighted = Math.random() < 0.7 ? dominantKey : alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    const a2 = alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    genome[gene] = [weighted, a2];
  }
  return genome;
}

const PERSONALITIES = [
  { id: 'playful',   label: '🎭 Playful',   desc: 'Does tricks near the glass', weight: 3 },
  { id: 'shy',       label: '🫣 Shy',       desc: 'Hides behind decorations',   weight: 3 },
  { id: 'curious',   label: '🔍 Curious',   desc: 'Follows your cursor',        weight: 2 },
  { id: 'lazy',      label: '😴 Lazy',      desc: 'Idles more, swims less',     weight: 3 },
  { id: 'aggressive',label: '😤 Aggressive', desc: 'Chases other fish',         weight: 1.5 },
  { id: 'social',    label: '🤝 Social',    desc: 'Stays near other fish',      weight: 2 },
  { id: 'gluttonous',label: '🍽️ Gluttonous', desc: 'Gets hungry faster',       weight: 1.5 },
  { id: 'hardy',     label: '💪 Hardy',     desc: 'Resists disease better',     weight: 1.5 },
];
export function createFish({ genome = null, stage = 'adult', parentIds = [], tankId = 'tank_0', targetRarity = null, generation = 1 } = {}) {
  let resolvedGenome = genome || randomGenome();
  let phenotype = computePhenotype(resolvedGenome);
  let species = getSpeciesFromPhenotype(phenotype, resolvedGenome);
  // Retry up to 20 times to hit the target rarity tier (used by shop purchases)
  if (targetRarity && !genome) {
    for (let i = 0; i < 20 && species.rarity !== targetRarity; i++) {
      resolvedGenome = randomGenome();
      phenotype = computePhenotype(resolvedGenome);
      species = getSpeciesFromPhenotype(phenotype, resolvedGenome);
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

  // ── Personality ────────────────────────────────────────────
  const pTotal = PERSONALITIES.reduce((s, p) => s + p.weight, 0);
  let pRoll = Math.random() * pTotal;
  let personality = PERSONALITIES[0];
  for (const p of PERSONALITIES) {
    pRoll -= p.weight;
    if (pRoll <= 0) { personality = p; break; }
  }

  return {
    id: crypto.randomUUID(),
    genome: resolvedGenome,
    phenotype,
    species,
    colorVariant,
    personality: personality.id,
    stage,
    bornAt: now,
    stageStartedAt: now,
    health: 100,
    hunger: 0,
    age: 0,
    forSale: false,
    parentIds,
    generation,
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
