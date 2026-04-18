import { r as reactExports, j as jsxRuntimeExports, R as React } from "./index-CuAPajpT.js";
function Toast({ id, message, type, emoji, onDismiss }) {
  const [phase, setPhase] = reactExports.useState("enter");
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), 20);
    const t2 = setTimeout(() => setPhase("exit"), 3200);
    const t3 = setTimeout(() => onDismiss(id), 3700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [id, onDismiss]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `toast toast--${type} toast--${phase}`,
      onClick: () => {
        setPhase("exit");
        setTimeout(() => onDismiss(id), 450);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toast-emoji", children: emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "toast-msg", children: message }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-progress" })
      ]
    }
  );
}
let _addToast = null;
function fireToast(message, type = "info", emoji = "") {
  if (_addToast) _addToast({ message, type, emoji });
}
function ToastManager() {
  const [toasts, setToasts] = reactExports.useState([]);
  const counterRef = reactExports.useRef(0);
  const addToast = reactExports.useCallback((toast) => {
    const id = ++counterRef.current;
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);
  }, []);
  reactExports.useEffect(() => {
    _addToast = addToast;
    return () => {
      _addToast = null;
    };
  }, [addToast]);
  const dismiss = reactExports.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toast-portal", children: toasts.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(Toast, { ...t, onDismiss: dismiss }, t.id)) });
}
if (typeof crypto !== "undefined" && !crypto.randomUUID) {
  crypto.randomUUID = () => "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
}
const GENES = {
  bodyShape: {
    name: "Body Shape",
    alleles: {
      O: { name: "Orb", dominant: 4 },
      R: { name: "Round", dominant: 3 },
      D: { name: "Delta", dominant: 2 },
      S: { name: "Slender", dominant: 1 },
      E: { name: "Eel", dominant: 0 }
    }
  },
  finType: {
    name: "Fin Type",
    alleles: {
      V: { name: "Veil", dominant: 4 },
      F: { name: "Flowing", dominant: 3 },
      B: { name: "Broad", dominant: 2 },
      A: { name: "Angular", dominant: 1 },
      N: { name: "Nub", dominant: 0 }
    }
  },
  pattern: {
    name: "Pattern",
    alleles: {
      M: { name: "Marble", dominant: 4 },
      S: { name: "Spotted", dominant: 3 },
      T: { name: "Tiger", dominant: 2 },
      L: { name: "Lined", dominant: 1 },
      P: { name: "Plain", dominant: 0 }
    }
  },
  primaryColor: {
    name: "Primary Color",
    alleles: {
      C: { name: "Crimson", dominant: 5 },
      G: { name: "Gold", dominant: 4 },
      V: { name: "Violet", dominant: 3 },
      A: { name: "Azure", dominant: 2 },
      E: { name: "Emerald", dominant: 1 },
      W: { name: "White", dominant: 0 }
    }
  },
  secondaryColor: {
    name: "Secondary Color",
    alleles: {
      O: { name: "Orange", dominant: 4 },
      R: { name: "Rose", dominant: 3 },
      T: { name: "Teal", dominant: 2 },
      I: { name: "Indigo", dominant: 1 },
      S: { name: "Silver", dominant: 0 }
    }
  },
  glow: {
    name: "Glow",
    alleles: {
      N: { name: "Normal", dominant: 1 },
      G: { name: "Luminous", dominant: 2 },
      R: { name: "Radiant", dominant: 3 },
      U: { name: "Ultraviolet", dominant: 4 }
    }
  },
  size: {
    name: "Size",
    alleles: {
      L: { name: "Leviathan", dominant: 4 },
      G: { name: "Giant", dominant: 3 },
      M: { name: "Medium", dominant: 2 },
      T: { name: "Tiny", dominant: 1 },
      D: { name: "Dwarf", dominant: 0 }
    }
  },
  mutation: {
    name: "Mutation",
    alleles: {
      N: { name: "None", dominant: 10 },
      A: { name: "Albino", dominant: 9 },
      M: { name: "Melanistic", dominant: 8 },
      X: { name: "Xanthic", dominant: 7 },
      T: { name: "Twin-tail", dominant: 6 },
      S: { name: "Starfish", dominant: 5 },
      // Tier 2: Rare mutations
      I: { name: "Iridescent", dominant: 4 },
      L: { name: "Bioluminescent", dominant: 3 },
      // Tier 3: Legendary mutations (recipe-only)
      C: { name: "Crystalline", dominant: 2 },
      V: { name: "Void", dominant: 1 },
      P: { name: "Phoenix", dominant: 0 }
    }
  }
};
function expressGene(gene, allele1, allele2) {
  const geneData = GENES[gene];
  if (!geneData) return "Unknown";
  const a1 = geneData.alleles[allele1];
  const a2 = geneData.alleles[allele2];
  if (!a1 && !a2) return "Unknown";
  if (!a1) return a2.name;
  if (!a2) return a1.name;
  return a1.dominant >= a2.dominant ? a1.name : a2.name;
}
function computePhenotype(genome) {
  const phenotype = {};
  for (const gene of Object.keys(GENES)) {
    if (!genome[gene]) continue;
    const [a1, a2] = genome[gene];
    phenotype[gene] = expressGene(gene, a1, a2);
  }
  return phenotype;
}
function phenotypeKey(ph) {
  return [ph.bodyShape, ph.finType, ph.pattern, ph.primaryColor, ph.secondaryColor, ph.glow, ph.size, ph.mutation].join("-");
}
const NAMED_SPECIES = {
  "Orb-Veil-Marble-Crimson-Orange-Normal-Giant-None": "Vermillion Veil",
  "Orb-Veil-Marble-Crimson-Orange-Normal-Medium-None": "Coral Puffer",
  "Orb-Veil-Marble-Crimson-Rose-Normal-Giant-None": "Blushing Gourami",
  "Orb-Veil-Marble-Crimson-Rose-Normal-Medium-None": "Rose Molly",
  "Orb-Veil-Spotted-Crimson-Orange-Normal-Giant-None": "Ember Goby",
  "Orb-Veil-Spotted-Crimson-Rose-Normal-Giant-None": "Cherry Blossom Guppy",
  "Orb-Veil-Tiger-Crimson-Orange-Normal-Giant-None": "Tiger Goby",
  "Orb-Veil-Lined-Crimson-Orange-Normal-Medium-None": "Striped Ember Platy",
  "Orb-Veil-Plain-Crimson-Orange-Normal-Medium-None": "Fireball",
  "Orb-Flowing-Marble-Crimson-Orange-Normal-Giant-None": "Magma Gourami",
  "Orb-Flowing-Marble-Crimson-Rose-Normal-Giant-None": "Petal Gourami",
  "Orb-Flowing-Spotted-Crimson-Orange-Normal-Giant-None": "Speckled Ember Puffer",
  "Orb-Flowing-Tiger-Crimson-Orange-Normal-Giant-None": "Flame Tiger",
  "Orb-Broad-Marble-Crimson-Orange-Normal-Giant-None": "Ruby Cichlid",
  "Orb-Angular-Marble-Crimson-Orange-Normal-Giant-None": "Crimson Darter",
  "Round-Veil-Marble-Crimson-Orange-Normal-Giant-None": "Crimson Sunfish",
  "Round-Veil-Marble-Crimson-Orange-Normal-Medium-None": "Ruby Danio",
  "Round-Veil-Spotted-Crimson-Orange-Normal-Giant-None": "Speckled Ruby Barb",
  "Round-Veil-Tiger-Crimson-Orange-Normal-Giant-None": "Tiger Ruby Barb",
  "Round-Flowing-Marble-Crimson-Orange-Normal-Giant-None": "Magma Perch",
  "Round-Broad-Marble-Crimson-Orange-Normal-Giant-None": "Red Cichlid",
  "Round-Broad-Marble-Crimson-Rose-Normal-Giant-None": "Rosy Cichlid",
  "Delta-Veil-Marble-Crimson-Orange-Normal-Giant-None": "Crimson Rasbora",
  "Delta-Flowing-Marble-Crimson-Rose-Normal-Giant-None": "Flame Wing",
  "Slender-Veil-Marble-Crimson-Orange-Normal-Giant-None": "Scarlet Swordtail",
  "Slender-Flowing-Marble-Crimson-Orange-Normal-Giant-None": "Ember Rainbowfish",
  "Slender-Angular-Tiger-Crimson-Orange-Normal-Giant-None": "Fire Viper",
  "Eel-Veil-Marble-Crimson-Orange-Normal-Giant-None": "Fire Eel",
  "Eel-Flowing-Plain-Crimson-Orange-Normal-Giant-None": "Lava Eel",
  "Orb-Veil-Marble-Gold-Orange-Normal-Giant-None": "Gilded Puffer",
  "Orb-Veil-Marble-Gold-Rose-Normal-Giant-None": "Sunburst Molly",
  "Orb-Veil-Spotted-Gold-Orange-Normal-Giant-None": "Gold Fleck Goby",
  "Orb-Veil-Tiger-Gold-Orange-Normal-Giant-None": "Amber Tiger Puffer",
  "Orb-Flowing-Marble-Gold-Orange-Normal-Giant-None": "Molten Gourami",
  "Round-Veil-Marble-Gold-Orange-Normal-Giant-None": "Gold Coin Barb",
  "Round-Veil-Marble-Gold-Rose-Normal-Medium-None": "Daffodil Platy",
  "Round-Flowing-Marble-Gold-Orange-Normal-Giant-None": "Sunspot Perch",
  "Delta-Veil-Marble-Gold-Orange-Normal-Giant-None": "Sunrise Tetra",
  "Delta-Veil-Spotted-Gold-Rose-Normal-Giant-None": "Speckled Saffron Darter",
  "Delta-Flowing-Marble-Gold-Teal-Normal-Giant-None": "Teal-Gold Flash",
  "Slender-Veil-Marble-Gold-Orange-Normal-Giant-None": "Golden Swordtail",
  "Slender-Flowing-Marble-Gold-Orange-Normal-Giant-None": "Gilded Rainbowfish",
  "Slender-Flowing-Tiger-Gold-Teal-Normal-Giant-None": "Tiger Rainbowfish",
  "Eel-Veil-Tiger-Gold-Orange-Normal-Giant-None": "Tiger Moray",
  "Eel-Flowing-Plain-Gold-Orange-Normal-Giant-None": "Gilt Eel",
  "Orb-Veil-Marble-Azure-Silver-Normal-Giant-None": "Azure Puffer",
  "Orb-Veil-Marble-Azure-Indigo-Normal-Giant-None": "Midnight Goby",
  "Orb-Veil-Spotted-Azure-Silver-Normal-Giant-None": "Sapphire Guppy",
  "Orb-Veil-Tiger-Azure-Teal-Normal-Giant-None": "Blue Tiger Puffer",
  "Orb-Flowing-Marble-Azure-Indigo-Normal-Giant-None": "Ocean Gourami",
  "Round-Veil-Marble-Azure-Silver-Normal-Giant-None": "Cobalt Cichlid",
  "Round-Veil-Marble-Azure-Indigo-Normal-Medium-None": "Ink Platy",
  "Round-Flowing-Marble-Azure-Silver-Normal-Giant-None": "Storm Perch",
  "Delta-Veil-Marble-Azure-Silver-Normal-Giant-None": "Glacier Tetra",
  "Slender-Veil-Marble-Azure-Silver-Normal-Giant-None": "Celestial Swordtail",
  "Slender-Flowing-Marble-Azure-Indigo-Normal-Giant-None": "Tidal Serpent",
  "Slender-Flowing-Tiger-Azure-Teal-Normal-Giant-None": "Reef Viper",
  "Eel-Flowing-Lined-Azure-Silver-Normal-Giant-None": "Electric Eel",
  "Eel-Flowing-Marble-Azure-Indigo-Normal-Giant-None": "Deep Current",
  "Orb-Veil-Marble-Violet-Rose-Normal-Giant-None": "Amethyst Globe",
  "Orb-Veil-Spotted-Violet-Indigo-Normal-Giant-None": "Nebula Orb",
  "Orb-Flowing-Marble-Violet-Silver-Normal-Giant-None": "Lavender Drifter",
  "Round-Veil-Marble-Violet-Rose-Normal-Giant-None": "Lilac Ball",
  "Delta-Veil-Marble-Violet-Indigo-Normal-Giant-None": "Violet Delta",
  "Slender-Veil-Marble-Violet-Rose-Normal-Giant-None": "Twilight Arrow",
  "Slender-Flowing-Marble-Violet-Indigo-Normal-Giant-None": "Mystic Ribbon",
  "Eel-Flowing-Marble-Violet-Indigo-Normal-Giant-None": "Phantom Eel",
  "Orb-Veil-Marble-Emerald-Teal-Normal-Giant-None": "Jade Orb",
  "Orb-Veil-Spotted-Emerald-Orange-Normal-Giant-None": "Jungle Orb",
  "Round-Veil-Marble-Emerald-Teal-Normal-Giant-None": "Forest Ball",
  "Delta-Veil-Marble-Emerald-Teal-Normal-Giant-None": "Green Wedge",
  "Slender-Veil-Marble-Emerald-Teal-Normal-Giant-None": "Malachite Dart",
  "Slender-Flowing-Marble-Emerald-Orange-Normal-Giant-None": "Rainforest Ribbon",
  "Eel-Angular-Lined-Emerald-Teal-Normal-Giant-None": "Blade Eel",
  "Eel-Nub-Plain-Azure-Silver-Normal-Leviathan-None": "Abyss Worm",
  "Orb-Veil-Marble-Crimson-Orange-Normal-Leviathan-None": "Great Crimson Globe",
  "Orb-Veil-Marble-Gold-Orange-Normal-Leviathan-None": "Grand Gilded Orb",
  "Round-Flowing-Marble-Azure-Indigo-Normal-Leviathan-None": "Colossal Storm",
  "Delta-Veil-Marble-Violet-Indigo-Normal-Leviathan-None": "Titan Delta",
  "Slender-Flowing-Tiger-Azure-Teal-Normal-Leviathan-None": "Sea Serpent",
  "Eel-Flowing-Marble-Emerald-Teal-Normal-Leviathan-None": "Ancient Eel",
  "Orb-Veil-Marble-Gold-Rose-Normal-Dwarf-None": "Micro Gilded",
  "Orb-Veil-Spotted-Azure-Silver-Normal-Dwarf-None": "Sapphire Mote",
  "Slender-Flowing-Marble-Violet-Rose-Normal-Dwarf-None": "Fairy Dart",
  "Eel-Flowing-Plain-Emerald-Teal-Normal-Dwarf-None": "Sprout Eel",
  "Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Albino": "Albino Orb",
  "Orb-Veil-Marble-Gold-Orange-Normal-Giant-Albino": "White Gold",
  "Round-Veil-Marble-Azure-Silver-Normal-Giant-Albino": "Ghost Puff",
  "Slender-Flowing-Marble-Violet-Rose-Normal-Giant-Albino": "Snow Ribbon",
  "Delta-Veil-Spotted-Emerald-Teal-Normal-Giant-Albino": "Pale Jade",
  "Eel-Flowing-Plain-Azure-Silver-Normal-Giant-Albino": "White Eel",
  "Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Melanistic": "Obsidian Orb",
  "Round-Veil-Marble-Gold-Orange-Normal-Giant-Melanistic": "Midnight Gold",
  "Slender-Flowing-Marble-Azure-Indigo-Normal-Giant-Melanistic": "Shadow Serpent",
  "Eel-Flowing-Plain-Crimson-Orange-Normal-Giant-Melanistic": "Black Fire Eel",
  "Orb-Veil-Marble-Violet-Rose-Normal-Giant-Xanthic": "Sulfur Globe",
  "Slender-Flowing-Marble-Azure-Silver-Normal-Giant-Xanthic": "Yellow Dart",
  "Delta-Veil-Tiger-Crimson-Orange-Normal-Giant-Xanthic": "Citrine Delta",
  "Round-Veil-Marble-Crimson-Rose-Normal-Giant-Twin-tail": "Double Fan",
  "Orb-Veil-Marble-Gold-Orange-Normal-Giant-Twin-tail": "Twin Gold Orb",
  "Delta-Flowing-Marble-Azure-Silver-Normal-Giant-Twin-tail": "Forked Lightning",
  "Orb-Veil-Marble-Crimson-Orange-Luminous-Giant-None": "Glowing Ember Orb",
  "Orb-Veil-Marble-Gold-Orange-Luminous-Giant-None": "Solar Lantern",
  "Orb-Veil-Marble-Azure-Silver-Luminous-Giant-None": "Radiant Azure Globe",
  "Orb-Veil-Marble-Violet-Rose-Luminous-Giant-None": "Luminary Amethyst",
  "Orb-Veil-Marble-Emerald-Teal-Luminous-Giant-None": "Bioluminescent Jade",
  "Orb-Veil-Marble-White-Silver-Luminous-Giant-None": "Spirit Orb",
  "Round-Flowing-Marble-Azure-Indigo-Luminous-Giant-None": "Deep Sea Beacon",
  "Slender-Flowing-Tiger-Azure-Teal-Luminous-Giant-None": "Ethereal Viper",
  "Slender-Flowing-Marble-Violet-Indigo-Luminous-Giant-None": "Mystic Phantom",
  "Eel-Flowing-Plain-Azure-Silver-Luminous-Giant-None": "Lanternfish Eel",
  "Delta-Veil-Marble-Gold-Orange-Luminous-Giant-None": "Sunrise Beacon",
  "Orb-Veil-Marble-Crimson-Orange-Radiant-Giant-None": "Nova Orb",
  "Orb-Veil-Marble-Gold-Orange-Radiant-Giant-None": "Supernova Lantern",
  "Round-Flowing-Marble-Violet-Indigo-Radiant-Giant-None": "Pulsar",
  "Slender-Flowing-Tiger-Emerald-Teal-Radiant-Giant-None": "Radiant Sea Snake",
  "Eel-Flowing-Marble-Azure-Indigo-Radiant-Giant-None": "Electric Phantom",
  "Orb-Veil-Marble-Crimson-Orange-Ultraviolet-Giant-None": "Crimson Sphere",
  "Orb-Veil-Marble-Gold-Orange-Ultraviolet-Leviathan-None": "Solar Emperor",
  "Orb-Veil-Marble-Violet-Indigo-Ultraviolet-Giant-None": "Cosmic Orb",
  "Slender-Flowing-Tiger-Azure-Teal-Ultraviolet-Leviathan-None": "Leviathan Phantom",
  "Eel-Flowing-Marble-Violet-Indigo-Ultraviolet-Leviathan-None": "Ancient Specter",
  "Orb-Veil-Marble-Violet-Indigo-Ultraviolet-Leviathan-Starfish": "Star Emperor",
  "Slender-Flowing-Plain-White-Silver-Ultraviolet-Giant-Albino": "Angel Fish",
  "Eel-Flowing-Marble-Crimson-Orange-Ultraviolet-Leviathan-Melanistic": "Void Leviathan",
  "Orb-Veil-Marble-Crimson-Orange-Normal-Giant-Starfish": "Star Ruby",
  "Orb-Veil-Marble-Gold-Orange-Normal-Giant-Starfish": "Gold Star",
  "Orb-Veil-Marble-Azure-Silver-Normal-Giant-Starfish": "Sapphire Star",
  "Orb-Veil-Marble-Violet-Indigo-Normal-Giant-Starfish": "Nebula Star",
  "Orb-Veil-Marble-Emerald-Teal-Normal-Giant-Starfish": "Emerald Star"
};
const ALLELE_RARITY_SCORES = {
  // Scores reflect how RARE the trait is to see, not its dominance.
  // Dominant alleles appear often → low score. Recessive = high score.
  // Body shapes (Orb dominant → Eel recessive)
  Orb: 0,
  Round: 1,
  Delta: 2,
  Slender: 3,
  Eel: 5,
  // Fin types (Veil dominant → Nub recessive)
  Veil: 0,
  Flowing: 1,
  Broad: 2,
  Angular: 3,
  Nub: 5,
  // Patterns (Marble dominant → Plain recessive)
  Marble: 0,
  Spotted: 1,
  Tiger: 2,
  Lined: 3,
  Plain: 4,
  // Primary colors (Crimson dominant → White recessive)
  Crimson: 0,
  Gold: 1,
  Violet: 2,
  Azure: 1,
  Emerald: 2,
  White: 4,
  // Secondary colors (Orange dominant → Silver recessive)
  Orange: 0,
  Rose: 1,
  Teal: 1,
  Indigo: 2,
  Silver: 3,
  // Glow (Ultraviolet is DOMINANT so it's common — low score!)
  Ultraviolet: 0,
  Radiant: 1,
  Luminous: 2,
  Normal: 3,
  // Size (Leviathan is DOMINANT so it's common — low score!)
  Leviathan: 0,
  Giant: 1,
  Medium: 1,
  Tiny: 2,
  Dwarf: 4,
  // Mutations (None is very dominant = common. Tier 2-3 only via recipes)
  None: 0,
  Albino: 4,
  Melanistic: 4,
  Xanthic: 5,
  "Twin-tail": 5,
  Starfish: 6,
  Iridescent: 8,
  Bioluminescent: 9,
  Crystalline: 14,
  Void: 16,
  Phoenix: 18
};
function computeRarityScore(phenotype) {
  let score = 0;
  for (const val of Object.values(phenotype)) {
    score += ALLELE_RARITY_SCORES[val] ?? 1;
  }
  return score;
}
function rarityFromScore(score) {
  if (score >= 18) return "legendary";
  if (score >= 12) return "epic";
  if (score >= 7) return "rare";
  if (score >= 3) return "uncommon";
  return "common";
}
function basePriceFromScore(score, rarity) {
  const base = Math.max(8, score * 4 + 8);
  const mult = { common: 1, uncommon: 2, rare: 5, epic: 12, legendary: 30 }[rarity] || 1;
  return Math.round(base * mult);
}
function getSpeciesFromPhenotype(phenotype, genome = null) {
  const key = phenotypeKey(phenotype);
  let name = NAMED_SPECIES[key] || generateProceduralName(phenotype, genome);
  const score = computeRarityScore(phenotype);
  const rarity = rarityFromScore(score);
  let basePrice = basePriceFromScore(score, rarity);
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
  Crimson: ["Crimson", "Ruby", "Scarlet", "Ember", "Blaze", "Phoenix", "Inferno", "Garnet", "Vermillion", "Cinnabar"],
  Gold: ["Golden", "Amber", "Sunlit", "Gilded", "Honeyed", "Aureate", "Topaz", "Marigold", "Saffron", "Sovereign"],
  Violet: ["Amethyst", "Twilight", "Royal", "Imperial", "Orchid", "Mystic", "Indigo", "Nebula", "Regal", "Phantom"],
  Azure: ["Sapphire", "Cobalt", "Midnight", "Arctic", "Pacific", "Celestial", "Storm", "Glacier", "Abyss", "Tidal"],
  Emerald: ["Jade", "Verdant", "Jungle", "Malachite", "Fern", "Sylvan", "Evergreen", "Moss", "Serpentine", "Tropic"],
  White: ["Pearl", "Ghost", "Ivory", "Crystal", "Diamond", "Frost", "Opal", "Platinum", "Moonlit", "Spectral"]
};
const NOUN = {
  Orb: ["Oracle", "Lantern", "Globe", "Jewel", "Bubble", "Moon", "Pearl", "Marble", "Gem", "Droplet"],
  Round: ["Emperor", "Sovereign", "Guardian", "Sentinel", "Baron", "Knight", "Regent", "Warden", "Herald", "Noble"],
  Delta: ["Dart", "Arrow", "Phantom", "Whisper", "Flash", "Spark", "Streak", "Bolt", "Zephyr", "Glider"],
  Slender: ["Blade", "Dagger", "Spear", "Needle", "Lance", "Rapier", "Stiletto", "Sabre", "Pike", "Striker"],
  Eel: ["Serpent", "Dragon", "Viper", "Wyrm", "Shadow", "Spectre", "Wraith", "Shade", "Phantom", "Crawler"]
};
const PATTERN_MOD = {
  Spotted: ["Spotted ", "Dappled ", "Freckled ", "Star-marked ", "Constellation "],
  Tiger: ["Tiger ", "Banded ", "Ringed ", "Striped ", "Barred "],
  Marble: ["Marbled ", "Painted ", "Mosaic ", "Veined ", "Swirled "],
  Lined: ["Lined ", "Pinstripe ", "Threaded ", "Traced ", "Etched "],
  Plain: ["", "", "", "", ""]
};
const FIN_MOD = {
  Veil: [" Veiltail", " Cascadia", " Silktail", " Flowtail", ""],
  Flowing: [" Fantail", " Wisp", " Plume", "", ""],
  Broad: ["", "", "", "", ""],
  Angular: ["", "", "", "", ""],
  Nub: ["", "", "", "", ""]
};
const SIZE_MOD = {
  Dwarf: ["Little ", "Pygmy ", "Petite ", "Miniature ", ""],
  Tiny: ["", "", "", "", ""],
  Medium: ["", "", "", "", ""],
  Giant: ["Grand ", "Great ", "King ", "Elder ", ""],
  Leviathan: ["Titan ", "Colossal ", "Ancient ", "Leviathan ", "Primordial "]
};
const GLOWPFX = { Luminous: "Luminous ", Radiant: "Radiant ", Ultraviolet: "" };
const EPIC_TITLES = [
  (adj, noun) => `${adj} ${noun}`,
  (adj, noun) => `The ${adj} ${noun}`,
  (adj, noun) => `${noun} of ${adj} Depths`,
  (adj, noun) => `${adj} ${noun} Rex`,
  (adj, noun) => `${noun} Primus`
];
const LEGENDARY_TITLES = [
  (adj, noun) => `${adj} ${noun} the Magnificent`,
  (adj, noun) => `The Eternal ${adj} ${noun}`,
  (adj, noun) => `${noun} of the ${adj} Abyss`,
  (adj, noun) => `${adj} ${noun} Imperator`,
  (adj, noun) => `The Last ${adj} ${noun}`
];
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function generateProceduralName(ph, genome = null) {
  var _a, _b;
  const glow = GLOWPFX[ph.glow] || "";
  const showSize = ph.size === "Dwarf" || ph.size === "Tiny" || ph.size === "Giant" || ph.size === "Leviathan";
  const size = showSize ? pick(SIZE_MOD[ph.size] || [""]) : "";
  const showPattern = ph.pattern !== "Plain" && Math.random() < 0.5;
  const pattern = showPattern ? pick(PATTERN_MOD[ph.pattern] || [""]) : "";
  const adj = pick(ADJ[ph.primaryColor] || ["Mystery"]);
  const noun = pick(NOUN[ph.bodyShape] || ["Fish"]);
  const showFin = (ph.finType === "Veil" || ph.finType === "Flowing") && Math.random() < 0.4;
  const fin = showFin ? pick(FIN_MOD[ph.finType] || [""]) : "";
  const MUTATION_PREFIX = {
    Albino: ["Ghost ", "Spectral ", "Phantom "],
    Melanistic: ["Void ", "Shadow ", "Obsidian "],
    Xanthic: ["Solar ", "Gilded ", "Sunfire "],
    "Twin-tail": ["Mirror ", "Twin ", "Gemini "],
    Starfish: ["Star ", "Astral ", "Celestial "],
    Iridescent: ["Prismatic ", "Opal ", "Chromatic "],
    Bioluminescent: ["Abyssal ", "Deepglow ", "Noctis "],
    Crystalline: ["Crystal ", "Glass ", "Diamond "],
    Void: ["Cosmic ", "Nebula ", "Void "],
    Phoenix: ["Ember ", "Phoenix ", "Eternal "]
  };
  const mutPrefix = ph.mutation && ph.mutation !== "None" && MUTATION_PREFIX[ph.mutation] ? pick(MUTATION_PREFIX[ph.mutation]) : "";
  const PURITY_SUFFIX = [
    null,
    null,
    null,
    // 0-2 pure: no suffix
    "the Refined",
    // 3
    "the Refined",
    // 4
    "the Pure",
    // 5
    "the Pure",
    // 6
    "the Perfected",
    // 7
    "the Perfected"
    // 8
  ];
  let suffix = "";
  if (genome) {
    let pureCount = 0;
    for (const gene of Object.keys(GENES)) {
      if (((_a = genome[gene]) == null ? void 0 : _a[0]) === ((_b = genome[gene]) == null ? void 0 : _b[1])) pureCount++;
    }
    if (PURITY_SUFFIX[pureCount]) suffix = " " + PURITY_SUFFIX[pureCount];
  }
  const score = computeRarityScore(ph);
  const rarity = rarityFromScore(score);
  if (rarity === "legendary" && Math.random() < 0.7) {
    const titleFn = pick(LEGENDARY_TITLES);
    return `${mutPrefix}${glow}${titleFn(adj, noun)}${suffix}`.replace(/  +/g, " ").trim();
  }
  if (rarity === "epic" && Math.random() < 0.4) {
    const titleFn = pick(EPIC_TITLES);
    return `${mutPrefix}${glow}${titleFn(adj, noun)}${suffix}`.replace(/  +/g, " ").trim();
  }
  return `${mutPrefix}${glow}${size}${pattern}${adj} ${noun}${fin}${suffix}`.replace(/  +/g, " ").trim();
}
const RARITY = {
  common: { label: "Common", color: "#5aaa70", priceMultiplier: 1 },
  uncommon: { label: "Uncommon", color: "#5a9aaa", priceMultiplier: 2.5 },
  rare: { label: "Rare", color: "#8a70a8", priceMultiplier: 6 },
  epic: { label: "Epic", color: "#b0944a", priceMultiplier: 15 },
  legendary: { label: "Legendary", color: "#a06080", priceMultiplier: 40 }
};
const GROWTH_STAGES = {
  egg: { label: "Egg", durationMs: 6e4 * 2 },
  juvenile: { label: "Juvenile", durationMs: 6e4 * 5 },
  adult: { label: "Adult", durationMs: Infinity }
};
function getCarrierTraits(genome) {
  var _a, _b;
  if (!genome) return [];
  const carriers = [];
  for (const gene of Object.keys(GENES)) {
    if (!genome[gene]) continue;
    const [a1, a2] = genome[gene];
    const geneData = GENES[gene];
    const d1 = ((_a = geneData.alleles[a1]) == null ? void 0 : _a.dominant) ?? 0;
    const d2 = ((_b = geneData.alleles[a2]) == null ? void 0 : _b.dominant) ?? 0;
    const expressed = d1 >= d2 ? a1 : a2;
    const recessive = d1 >= d2 ? a2 : a1;
    if (expressed !== recessive && geneData.alleles[recessive]) {
      const recessiveName = geneData.alleles[recessive].name;
      const expressedName = geneData.alleles[expressed].name;
      if (["None", "Normal", "Plain", "Medium", "Standard", "Nub"].includes(recessiveName)) continue;
      carriers.push({
        gene: geneData.name,
        geneKey: gene,
        expressed: expressedName,
        carried: recessiveName,
        allele: recessive
      });
    }
  }
  return carriers;
}
const LEGENDARY_COMBOS = [
  {
    id: "void_flame",
    name: "Void Flame",
    desc: "Dark body with glowing crimson veins. Born from shadow and fire.",
    traits: { mutation: "Melanistic", primaryColor: "Crimson", glow: "Ultraviolet" },
    emoji: "",
    priceBonus: 20,
    particle: "ember"
  },
  {
    id: "ghost_pearl",
    name: "Ghost Pearl",
    desc: "Translucent with a faint ethereal shimmer. Barely there, hauntingly beautiful.",
    traits: { mutation: "Albino", primaryColor: "White", glow: "Luminous" },
    emoji: "",
    priceBonus: 15,
    particle: "mist"
  },
  {
    id: "dragon_king",
    name: "Dragon King",
    desc: "A serpentine golden dragon. Legends say it grants wishes.",
    traits: { bodyShape: "Eel", primaryColor: "Gold", glow: "Radiant" },
    emoji: "",
    priceBonus: 18,
    particle: "gold"
  },
  {
    id: "abyssal_star",
    name: "Abyssal Star",
    desc: "A violet orb pulsing with ultraviolet light from the deepest trench.",
    traits: { bodyShape: "Orb", primaryColor: "Violet", glow: "Ultraviolet" },
    emoji: "",
    priceBonus: 22,
    particle: "star"
  },
  {
    id: "solar_eclipse",
    name: "Solar Eclipse",
    desc: "A dark delta with a blazing crimson corona. Blots out the light.",
    traits: { bodyShape: "Delta", primaryColor: "Crimson", mutation: "Melanistic" },
    emoji: "",
    priceBonus: 16,
    particle: "corona"
  },
  {
    id: "jade_emperor",
    name: "Jade Emperor",
    desc: "A massive emerald sovereign. Ancient and wise beyond its years.",
    traits: { primaryColor: "Emerald", size: "Giant", glow: "Radiant" },
    emoji: "",
    priceBonus: 14,
    particle: "jade"
  },
  {
    id: "frost_wraith",
    name: "Frost Wraith",
    desc: "An azure phantom trailing ice crystals. The water chills wherever it swims.",
    traits: { primaryColor: "Azure", mutation: "Albino", bodyShape: "Slender" },
    emoji: "",
    priceBonus: 13,
    particle: "ice"
  },
  {
    id: "golden_enigma",
    name: "Golden Enigma",
    desc: "A marbled golden orb that seems to shift patterns as you watch.",
    traits: { primaryColor: "Gold", pattern: "Marble", bodyShape: "Orb" },
    emoji: "",
    priceBonus: 10,
    particle: "shimmer"
  }
];
function checkLegendaryCombo(phenotype) {
  if (!phenotype) return null;
  for (const combo of LEGENDARY_COMBOS) {
    let match = true;
    for (const [trait, value] of Object.entries(combo.traits)) {
      if (phenotype[trait] !== value) {
        match = false;
        break;
      }
    }
    if (match) return combo;
  }
  return null;
}
function breedGenomes(genomeA, genomeB, donorGenome = null, mutationRate = 0.02) {
  const offspring = {};
  const DONOR_CHANCE = 0.18;
  for (const gene of Object.keys(GENES)) {
    if (!genomeA[gene] || !genomeB[gene]) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    const mutate = Math.random() < mutationRate;
    if (mutate) {
      const TIER1_MUTATION_ALLELES = ["N", "A", "M", "X", "T", "S"];
      const alleleKeys = gene === "mutation" ? TIER1_MUTATION_ALLELES : Object.keys(GENES[gene].alleles);
      offspring[gene] = [
        alleleKeys[Math.floor(Math.random() * alleleKeys.length)],
        alleleKeys[Math.floor(Math.random() * alleleKeys.length)]
      ];
    } else {
      const pickA = Math.random() < 0.5 ? a1 : a2;
      const pickB = Math.random() < 0.5 ? b1 : b2;
      const donor = donorGenome == null ? void 0 : donorGenome[gene];
      const allele0 = donor && Math.random() < DONOR_CHANCE ? donor[Math.random() < 0.5 ? 0 : 1] : pickA;
      const allele1 = donor && Math.random() < DONOR_CHANCE ? donor[Math.random() < 0.5 ? 0 : 1] : pickB;
      offspring[gene] = [allele0, allele1];
    }
  }
  const recipeAllele = checkMutationRecipe(genomeA, genomeB);
  if (recipeAllele && offspring.mutation) {
    offspring.mutation = [recipeAllele, recipeAllele];
  }
  return offspring;
}
const MUTATION_RECIPES = [
  // Tier 2
  {
    id: "iridescent",
    allele: "I",
    tier: 2,
    chance: 0.15,
    check: (phA, phB) => phA.glow !== "Normal" && phB.glow !== "Normal",
    hint: "Breed two fish that both have glow traits"
  },
  {
    id: "bioluminescent",
    allele: "L",
    tier: 2,
    chance: 0.1,
    check: (phA, phB) => (phA.glow === "Ultraviolet" || phB.glow === "Ultraviolet") && (phA.glow !== "Normal" && phB.glow !== "Normal"),
    hint: "Breed an Ultraviolet fish with another glowing fish"
  },
  // Tier 3
  {
    id: "crystalline",
    allele: "C",
    tier: 3,
    chance: 0.08,
    check: (phA, phB) => phA.mutation === "Albino" && phB.mutation === "Albino" && (phA.glow === "Ultraviolet" || phB.glow === "Ultraviolet"),
    hint: "Ancient legends speak of Albino pairs touched by ultraviolet light..."
  },
  {
    id: "void",
    allele: "V",
    tier: 3,
    chance: 0.06,
    check: (phA, phB) => {
      const h = (/* @__PURE__ */ new Date()).getHours();
      const isNight = h >= 22 || h < 5;
      return phA.mutation === "Melanistic" && phB.mutation === "Melanistic" && isNight;
    },
    hint: "Two Melanistic fish bred under the darkest skies might become something more..."
  },
  {
    id: "phoenix",
    allele: "P",
    tier: 3,
    chance: 0.05,
    check: (phA, phB, genomeA, genomeB) => {
      const hasTier2A = ["Iridescent", "Bioluminescent", "Crystalline", "Void", "Phoenix"].includes(phA.mutation);
      const hasTier2B = ["Iridescent", "Bioluminescent", "Crystalline", "Void", "Phoenix"].includes(phB.mutation);
      const countPure = (g) => {
        var _a, _b;
        let c = 0;
        for (const gene of Object.keys(GENES)) {
          if (((_a = g == null ? void 0 : g[gene]) == null ? void 0 : _a[0]) === ((_b = g == null ? void 0 : g[gene]) == null ? void 0 : _b[1])) c++;
        }
        return c;
      };
      const pureA = countPure(genomeA);
      const pureB = countPure(genomeB);
      return hasTier2A && pureB >= 5 || hasTier2B && pureA >= 5;
    },
    hint: "A mutant paired with a pure-bred specimen may transcend nature itself..."
  }
];
function checkMutationRecipe(genomeA, genomeB) {
  const phA = computePhenotype(genomeA);
  const phB = computePhenotype(genomeB);
  const sorted = [...MUTATION_RECIPES].sort((a, b) => b.tier - a.tier);
  for (const recipe of sorted) {
    if (recipe.check(phA, phB, genomeA, genomeB) && Math.random() < recipe.chance) {
      return recipe.allele;
    }
  }
  return null;
}
function predictOffspringPhenotypes(genomeA, genomeB) {
  const geneKeys = Object.keys(GENES).filter((g) => genomeA[g] && genomeB[g]);
  const N = geneKeys.length;
  const total = Math.pow(4, N);
  const outcomes = {};
  for (let path = 0; path < total; path++) {
    const genome = {};
    let tmp = path;
    for (let gi = 0; gi < N; gi++) {
      const gene = geneKeys[gi];
      const [a1, a2] = genomeA[gene];
      const [b1, b2] = genomeB[gene];
      const combo = tmp % 4;
      tmp = tmp / 4 | 0;
      genome[gene] = combo === 0 ? [a1, b1] : combo === 1 ? [a1, b2] : combo === 2 ? [a2, b1] : [a2, b2];
    }
    const ph = computePhenotype(genome);
    const sp = getSpeciesFromPhenotype(ph);
    if (!outcomes[sp.name]) outcomes[sp.name] = { species: sp, weight: 0 };
    outcomes[sp.name].weight++;
  }
  return Object.values(outcomes).sort((a, b) => b.weight - a.weight).map((o) => ({ ...o, chance: Math.round(o.weight / total * 100) }));
}
function randomGenome() {
  const genome = {};
  const TIER1_MUTATION_ALLELES = ["N", "A", "M", "X", "T", "S"];
  for (const [gene, geneData] of Object.entries(GENES)) {
    const alleleKeys = gene === "mutation" ? TIER1_MUTATION_ALLELES : Object.keys(geneData.alleles);
    const dominantKey = Object.entries(geneData.alleles).sort((a, b) => b[1].dominant - a[1].dominant)[0][0];
    const weighted = Math.random() < 0.7 ? dominantKey : alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    const a2 = alleleKeys[Math.floor(Math.random() * alleleKeys.length)];
    genome[gene] = [weighted, a2];
  }
  return genome;
}
const PERSONALITIES = [
  { id: "playful", label: "Playful", desc: "Does tricks near the glass", weight: 3 },
  { id: "shy", label: "Shy", desc: "Hides behind decorations", weight: 3 },
  { id: "curious", label: "Curious", desc: "Follows your cursor", weight: 2 },
  { id: "lazy", label: "Lazy", desc: "Idles more, swims less", weight: 3 },
  { id: "aggressive", label: "Aggressive", desc: "Chases other fish", weight: 1.5 },
  { id: "social", label: "Social", desc: "Stays near other fish", weight: 2 },
  { id: "gluttonous", label: "Gluttonous", desc: "Gets hungry faster", weight: 1.5 },
  { id: "hardy", label: "Hardy", desc: "Resists disease better", weight: 1.5 }
];
function createFish({ genome = null, stage = "adult", parentIds = [], tankId = "tank_0", targetRarity = null, generation = 1, now: _now2 = null } = {}) {
  var _a;
  let resolvedGenome = genome || randomGenome();
  let phenotype = computePhenotype(resolvedGenome);
  let species = getSpeciesFromPhenotype(phenotype, resolvedGenome);
  if (targetRarity && !genome) {
    for (let i = 0; i < 20 && species.rarity !== targetRarity; i++) {
      resolvedGenome = randomGenome();
      phenotype = computePhenotype(resolvedGenome);
      species = getSpeciesFromPhenotype(phenotype, resolvedGenome);
    }
  }
  const now2 = _now2 || Date.now();
  let colorVariant = null;
  if (((_a = species == null ? void 0 : species.colorVariants) == null ? void 0 : _a.length) > 1) {
    const variants = species.colorVariants;
    const weights = variants.map(
      (v, i) => i === 0 ? 3 : v === "ghost" || v === "black" ? 0.4 : v === "kohaku" || v === "red" ? 0.7 : 1
    );
    const total = weights.reduce((s, w) => s + w, 0);
    let r = Math.random() * total;
    for (let i = 0; i < variants.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        colorVariant = variants[i];
        break;
      }
    }
    colorVariant = colorVariant || variants[0];
  }
  const pTotal = PERSONALITIES.reduce((s, p) => s + p.weight, 0);
  let pRoll = Math.random() * pTotal;
  let personality = PERSONALITIES[0];
  for (const p of PERSONALITIES) {
    pRoll -= p.weight;
    if (pRoll <= 0) {
      personality = p;
      break;
    }
  }
  return {
    id: crypto.randomUUID(),
    genome: resolvedGenome,
    phenotype,
    species,
    colorVariant,
    personality: personality.id,
    stage,
    bornAt: now2,
    stageStartedAt: now2,
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
    vy: (Math.random() - 0.5) * 0.1
  };
}
const MAGIC_FISH = [
  {
    id: "magic_1",
    number: 1,
    title: "The Crimson Jewel",
    hint: "A round-bodied crimson fish with a spotted pattern — said to bring good fortune.",
    lore: "Ancient sailors once painted its likeness on the prow of their ships. Legend holds that any aquarium housing this fish will never know bad luck.",
    phenotype: {
      bodyShape: "Round",
      primaryColor: "Crimson",
      pattern: "Spotted",
      glow: "Normal",
      mutation: "None"
    },
    reward: 150,
    rarity: "uncommon"
  },
  {
    id: "magic_2",
    number: 2,
    title: "The Golden Arrow",
    hint: "A slender gold fish with flowing fins and a tiger pattern — swift as a sunbeam.",
    lore: "Priests of the sun god kept one in every temple fountain. Its shadow, they believed, could cure melancholy.",
    phenotype: {
      bodyShape: "Slender",
      primaryColor: "Gold",
      finType: "Flowing",
      pattern: "Tiger",
      glow: "Normal",
      mutation: "None"
    },
    reward: 400,
    rarity: "rare"
  },
  {
    id: "magic_3",
    number: 3,
    title: "The Sapphire Phantom",
    hint: "An azure eel with a luminous glow and indigo markings — it seems to swim through the dark itself.",
    lore: "Deep-sea fishermen who glimpsed this creature through their lantern light would refuse to cast nets for a week, fearing it as a messenger from the abyss.",
    phenotype: {
      bodyShape: "Eel",
      primaryColor: "Azure",
      secondaryColor: "Indigo",
      glow: "Luminous",
      mutation: "None"
    },
    reward: 900,
    rarity: "rare"
  },
  {
    id: "magic_4",
    number: 4,
    title: "The Twin-Tailed Empress",
    hint: "An orb-shaped violet fish with twin-tail mutation and veil fins — royalty in every fin stroke.",
    lore: 'Only one was ever kept in captivity — in the imperial palace of a dynasty long forgotten. The court astrologer wrote that its presence "calmed the stars themselves."',
    phenotype: {
      bodyShape: "Orb",
      primaryColor: "Violet",
      finType: "Veil",
      glow: "Normal",
      mutation: "Twin-tail"
    },
    reward: 2e3,
    rarity: "epic"
  },
  {
    id: "magic_5",
    number: 5,
    title: "The Albino Serpent",
    hint: "A leviathan-sized slender fish, albino mutation, with flowing fins — impossibly rare, impossibly beautiful.",
    lore: "Described in only three manuscripts, each written a century apart, each describing the same impossible creature. Scholars assumed it was myth. Perhaps it still is.",
    phenotype: {
      bodyShape: "Slender",
      size: "Leviathan",
      finType: "Flowing",
      glow: "Normal",
      mutation: "Albino"
    },
    reward: 5e3,
    rarity: "epic"
  },
  {
    id: "magic_6",
    number: 6,
    title: "The Radiant Sun Emperor",
    hint: "A giant orb-shaped gold fish radiating brilliant light — it outshines everything in the tank.",
    lore: "The last known sighting was recorded by a merchant who claimed it lit his entire shop from within a single tank. He sold it before he understood what he had.",
    phenotype: {
      bodyShape: "Orb",
      primaryColor: "Gold",
      size: "Giant",
      glow: "Radiant",
      mutation: "None"
    },
    reward: 12e3,
    rarity: "epic"
  },
  {
    id: "magic_7",
    number: 7,
    title: "The Ancient Specter",
    hint: "An ultraviolet leviathan eel with violet coloring and melanistic mutation — the rarest being in the ocean.",
    lore: "The fish that ends all searches. Every great aquarist has chased it. A few have seen it. None have kept it — until now.",
    phenotype: {
      bodyShape: "Eel",
      primaryColor: "Violet",
      secondaryColor: "Indigo",
      size: "Leviathan",
      glow: "Ultraviolet",
      mutation: "Melanistic"
    },
    reward: 5e4,
    rarity: "legendary"
  }
];
function checkMagicFishMatch(phenotype, magicFish) {
  for (const [key, val] of Object.entries(magicFish.phenotype)) {
    if (phenotype[key] !== val) return false;
  }
  return true;
}
const DECOR_CATEGORIES = {
  substrate: { label: "Substrate", emoji: "" },
  plant: { label: "Plants", emoji: "" },
  rock: { label: "Rocks", emoji: "" },
  structure: { label: "Structures", emoji: "" },
  coral: { label: "Coral", emoji: "" },
  special: { label: "Special", emoji: "" }
};
const DECOR_CATALOG = [
  // ── Substrate ─────────────────────────────────────────────
  {
    id: "gravel_white",
    label: "White Gravel",
    category: "substrate",
    cost: 0,
    startOwned: 1,
    desc: "Clean white pebbles covering the tank floor.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${44 * s}" ry="${14 * s}" fill="#d0ccc0"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="${40 * s}" ry="${10 * s}" fill="#e8e4da"/>
      ${[[-16, 0], [0, -4], [14, 2], [-8, 4], [10, -2]].map(([dx, dy], i) => `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${5 * s}" ry="${3.5 * s}" fill="${["#ccc8bc", "#dedad0", "#e4e0d4"][i % 3]}"/>`).join("")}
    `
  },
  {
    id: "gravel_dark",
    label: "Dark Gravel",
    category: "substrate",
    cost: 20,
    startOwned: 0,
    desc: "Volcanic black and grey pebbles.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${44 * s}" ry="${14 * s}" fill="#3a3830"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="${40 * s}" ry="${10 * s}" fill="#4a4840"/>
      ${[[-16, 0], [0, -4], [14, 2], [-8, 4], [10, -2]].map(([dx, dy], i) => `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${5 * s}" ry="${3.5 * s}" fill="${["#504e46", "#3c3a32", "#5a5850"][i % 3]}"/>`).join("")}
    `
  },
  {
    id: "sand",
    label: "Golden Sand",
    category: "substrate",
    cost: 35,
    startOwned: 0,
    desc: "Smooth tropical sand — fish love it.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${46 * s}" ry="${15 * s}" fill="#c8a050"/>
      <ellipse cx="${x}" cy="${y - 2}" rx="${42 * s}" ry="${11 * s}" fill="#deb860"/>
      <ellipse cx="${x + 2}" cy="${y - 4}" rx="${36 * s}" ry="${7 * s}" fill="#e8c870" opacity="0.6"/>
    `
  },
  // ── Plants ────────────────────────────────────────────────
  {
    id: "plant_green",
    label: "Green Weed",
    category: "plant",
    cost: 0,
    startOwned: 1,
    desc: "Basic green aquatic plant.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x - 8 * s},${y - 30 * s} ${x - 18 * s},${y - 50 * s} ${x - 12 * s},${y - 70 * s}" stroke="#3a8040" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x + 6 * s},${y - 25 * s} ${x + 16 * s},${y - 44 * s} ${x + 10 * s},${y - 64 * s}" stroke="#2d7030" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x - 3 * s},${y - 18 * s} ${x + 8 * s},${y - 32 * s} ${x + 4 * s},${y - 48 * s}" stroke="#4a9050" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x - 12 * s}" cy="${y - 70 * s}" rx="${10 * s}" ry="${5 * s}" fill="#50a060" transform="rotate(-20,${x - 12 * s},${y - 70 * s})"/>
      <ellipse cx="${x + 10 * s}" cy="${y - 64 * s}" rx="${10 * s}" ry="${5 * s}" fill="#408050" transform="rotate(15,${x + 10 * s},${y - 64 * s})"/>
    `
  },
  {
    id: "plant_red",
    label: "Red Ludwigia",
    category: "plant",
    cost: 45,
    startOwned: 0,
    desc: "Vivid red aquatic plant — a show-stopper.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x - 6 * s},${y - 28 * s} ${x - 14 * s},${y - 48 * s} ${x - 8 * s},${y - 68 * s}" stroke="#904020" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x + 8 * s},${y - 22 * s} ${x + 18 * s},${y - 40 * s} ${x + 12 * s},${y - 60 * s}" stroke="#a04828" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${x},${y} C${x + 2 * s},${y - 16 * s} ${x - 10 * s},${y - 30 * s} ${x - 6 * s},${y - 46 * s}" stroke="#c05030" stroke-width="${4 * s}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x - 8 * s}" cy="${y - 68 * s}" rx="${10 * s}" ry="${5 * s}" fill="#d06040" transform="rotate(-18,${x - 8 * s},${y - 68 * s})"/>
      <ellipse cx="${x + 12 * s}" cy="${y - 60 * s}" rx="${10 * s}" ry="${5 * s}" fill="#b04030" transform="rotate(14,${x + 12 * s},${y - 60 * s})"/>
    `
  },
  {
    id: "kelp_tall",
    label: "Giant Kelp",
    category: "plant",
    cost: 80,
    startOwned: 0,
    desc: "Towering kelp sways hypnotically.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} C${x + 10 * s},${y - 40 * s} ${x - 8 * s},${y - 80 * s} ${x + 12 * s},${y - 120 * s}" stroke="#2d8050" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>
      <path d="M${x + 4 * s},${y} C${x + 16 * s},${y - 35 * s} ${x},${y - 72 * s} ${x + 18 * s},${y - 110 * s}" stroke="#359060" stroke-width="${5 * s}" fill="none" stroke-linecap="round"/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${x + (i % 2 ? 8 : -4) * s},${y - (28 + i * 28) * s} Q${x + (i % 2 ? 28 : -22) * s},${y - (38 + i * 28) * s} ${x + (i % 2 ? 18 : -14) * s},${y - (28 + i * 28) * s}" stroke="#40a060" stroke-width="${3 * s}" fill="none"/>`).join("")}
    `
  },
  {
    id: "grass_carpet",
    label: "Grass Carpet",
    category: "plant",
    cost: 120,
    startOwned: 0,
    desc: "Dense ground-cover grass — lush and natural.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      ${Array.from({ length: 16 }, (_, i) => {
      const bx = x - 36 * s + i * 5 * s;
      return `<path d="M${bx},${y} Q${bx + (i % 2 ? 3 : -3) * s},${y - 18 * s} ${bx + (i % 3 - 1) * 2 * s},${y - 28 * s}" stroke="${["#2a7030", "#358040", "#3a9048"][i % 3]}" stroke-width="${2.5 * s}" fill="none" stroke-linecap="round"/>`;
    }).join("")}
    `
  },
  // ── Rocks ─────────────────────────────────────────────────
  {
    id: "rock_small",
    label: "Small Rock",
    category: "rock",
    cost: 15,
    startOwned: 0,
    desc: "A smooth river stone.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y}" rx="${18 * s}" ry="${12 * s}" fill="#607080"/>
      <ellipse cx="${x - 3 * s}" cy="${y - 3 * s}" rx="${14 * s}" ry="${8 * s}" fill="#708090"/>
      <ellipse cx="${x - 6 * s}" cy="${y - 5 * s}" rx="${6 * s}" ry="${3 * s}" fill="#8090a0" opacity="0.6"/>
    `
  },
  {
    id: "rock_arch",
    label: "Rock Arch",
    category: "rock",
    cost: 90,
    startOwned: 0,
    desc: "A dramatic stone arch — fish love to swim through.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 30 * s}" y="${y - 50 * s}" width="${18 * s}" height="${50 * s}" rx="${6 * s}" fill="#607080"/>
      <rect x="${x + 12 * s}" y="${y - 50 * s}" width="${18 * s}" height="${50 * s}" rx="${6 * s}" fill="#607080"/>
      <path d="M${x - 30 * s},${y - 50 * s} Q${x},${y - 88 * s} ${x + 30 * s},${y - 50 * s}" stroke="#708090" stroke-width="${16 * s}" fill="none"/>
      <path d="M${x - 26 * s},${y - 50 * s} Q${x},${y - 82 * s} ${x + 26 * s},${y - 50 * s}" stroke="#8090a4" stroke-width="${6 * s}" fill="none" opacity="0.5"/>
      <ellipse cx="${x - 21 * s}" cy="${y - 4 * s}" rx="${9 * s}" ry="${4 * s}" fill="#506070"/>
      <ellipse cx="${x + 21 * s}" cy="${y - 4 * s}" rx="${9 * s}" ry="${4 * s}" fill="#506070"/>
    `
  },
  {
    id: "pebble_cluster",
    label: "Pebble Cluster",
    category: "rock",
    cost: 25,
    startOwned: 0,
    desc: "A group of colourful pebbles.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      ${[[-14, 0, "#8a7060"], [-4, -5, "#607080"], [6, 2, "#708870"], [-20, -3, "#706880"], [16, -2, "#806858"]].map(([dx, dy, c], _i) => `<ellipse cx="${x + dx * s}" cy="${y + dy * s}" rx="${10 * s}" ry="${7 * s}" fill="${c}"/><ellipse cx="${x + dx * s - 2 * s}" cy="${y + dy * s - 2 * s}" rx="${5 * s}" ry="${3 * s}" fill="white" opacity="0.15"/>`).join("")}
    `
  },
  // ── Structures ────────────────────────────────────────────
  {
    id: "castle",
    label: "Mini Castle",
    category: "structure",
    cost: 150,
    startOwned: 0,
    desc: "A classic aquarium castle ruin.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 24 * s}" y="${y - 55 * s}" width="${20 * s}" height="${55 * s}" rx="${2 * s}" fill="#5a6878"/>
      <rect x="${x + 4 * s}"  y="${y - 55 * s}" width="${20 * s}" height="${55 * s}" rx="${2 * s}" fill="#5a6878"/>
      <rect x="${x - 32 * s}" y="${y - 65 * s}" width="${12 * s}" height="${12 * s}" rx="${1 * s}" fill="#4a5868"/>
      <rect x="${x - 20 * s}" y="${y - 62 * s}" width="${12 * s}" height="${9 * s}"  rx="${1 * s}" fill="#4a5868"/>
      <rect x="${x + 8 * s}"  y="${y - 65 * s}" width="${12 * s}" height="${12 * s}" rx="${1 * s}" fill="#4a5868"/>
      <rect x="${x + 20 * s}" y="${y - 62 * s}" width="${12 * s}" height="${9 * s}"  rx="${1 * s}" fill="#4a5868"/>
      <rect x="${x - 24 * s}" y="${y - 45 * s}" width="${48 * s}" height="${12 * s}" rx="${2 * s}" fill="#5a6878"/>
      <rect x="${x - 8 * s}"  y="${y - 55 * s}" width="${16 * s}" height="${55 * s}" rx="${2 * s}" fill="#506070"/>
      <rect x="${x - 6 * s}"  y="${y - 40 * s}" width="${12 * s}" height="${20 * s}" rx="${2 * s}" fill="#1a2838" opacity="0.8"/>
      <rect x="${x - 14 * s}" y="${y - 30 * s}" width="${8 * s}"  height="${12 * s}" rx="${1 * s}" fill="#1a2838" opacity="0.6"/>
      <rect x="${x + 6 * s}"  y="${y - 30 * s}" width="${8 * s}"  height="${12 * s}" rx="${1 * s}" fill="#1a2838" opacity="0.6"/>
    `
  },
  {
    id: "shipwreck",
    label: "Shipwreck",
    category: "structure",
    cost: 200,
    startOwned: 0,
    desc: "A sunken ship — mystery beneath the waves.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x - 50 * s},${y} L${x - 60 * s},${y - 22 * s} L${x + 60 * s},${y - 22 * s} L${x + 50 * s},${y} Z" fill="#6a5040"/>
      <path d="M${x - 50 * s},${y} L${x - 60 * s},${y - 22 * s} L${x + 60 * s},${y - 22 * s} L${x + 50 * s},${y} Z" fill="none" stroke="#4a3828" stroke-width="${2 * s}"/>
      <rect x="${x - 10 * s}" y="${y - 48 * s}" width="${8 * s}" height="${28 * s}" rx="${1 * s}" fill="#584838" transform="rotate(-12,${x},${y - 22 * s})"/>
      <path d="M${x - 8 * s},${y - 48 * s} L${x + 12 * s},${y - 42 * s} L${x + 4 * s},${y - 28 * s} Z" fill="#7a6850" opacity="0.7"/>
      ${[[-30, -18], [-10, -16], [10, -18], [30, -16]].map(([dx, dy], _i) => `<rect x="${x + dx * s}" y="${y + dy * s}" width="${10 * s}" height="${8 * s}" rx="${1 * s}" fill="#1a1210" opacity="0.6"/>`).join("")}
      <ellipse cx="${x}" cy="${y}" rx="${52 * s}" ry="${8 * s}" fill="#584838"/>
    `
  },
  {
    id: "treasure_chest",
    label: "Treasure Chest",
    category: "structure",
    cost: 110,
    startOwned: 0,
    desc: "An open chest spilling gold coins.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 18 * s}" y="${y - 20 * s}" width="${36 * s}" height="${20 * s}" rx="${2 * s}" fill="#8a5820"/>
      <path d="M${x - 18 * s},${y - 20 * s} Q${x},${y - 34 * s} ${x + 18 * s},${y - 20 * s}" fill="#a06828"/>
      <rect x="${x - 16 * s}" y="${y - 18 * s}" width="${32 * s}" height="${3 * s}" fill="#c8901c"/>
      <rect x="${x - 4 * s}"  y="${y - 26 * s}" width="${8 * s}"  height="${8 * s}"  rx="${2 * s}" fill="#c8901c"/>
      <circle cx="${x}" cy="${y - 22 * s}" r="${3 * s}" fill="#e8b030"/>
      ${[[-8, -2], [0, -8], [8, -2], [-4, -6], [4, -6]].map(([dx, dy]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${3 * s}" fill="#f0c030" opacity="0.9"/>`).join("")}
    `
  },
  // ── Coral ─────────────────────────────────────────────────
  {
    id: "coral_red",
    label: "Red Coral",
    category: "coral",
    cost: 60,
    startOwned: 0,
    desc: "Branching red coral — a reef staple.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} L${x},${y - 40 * s}" stroke="#c04040" stroke-width="${5 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 20 * s} L${x - 16 * s},${y - 36 * s}" stroke="#c04040" stroke-width="${4 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 20 * s} L${x + 14 * s},${y - 34 * s}" stroke="#c04040" stroke-width="${4 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 34 * s} L${x - 10 * s},${y - 48 * s}" stroke="#d04848" stroke-width="${3 * s}" stroke-linecap="round"/>
      <path d="M${x - 16 * s},${y - 36 * s} L${x - 22 * s},${y - 50 * s}" stroke="#d04848" stroke-width="${3 * s}" stroke-linecap="round"/>
      <path d="M${x + 14 * s},${y - 34 * s} L${x + 20 * s},${y - 48 * s}" stroke="#d04848" stroke-width="${3 * s}" stroke-linecap="round"/>
      ${[[0, -40], [-16, -36], [14, -34], [-10, -48], [-22, -50], [20, -48]].map(([dx, dy]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${4 * s}" fill="#e05050"/>`).join("")}
    `
  },
  {
    id: "coral_brain",
    label: "Brain Coral",
    category: "coral",
    cost: 75,
    startOwned: 0,
    desc: "A massive rounded brain coral.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y - 14 * s}" rx="${24 * s}" ry="${18 * s}" fill="#c89040"/>
      <ellipse cx="${x}" cy="${y - 16 * s}" rx="${22 * s}" ry="${16 * s}" fill="#d8a050"/>
      ${[[-10, -6], [0, -2], [10, -6], [-6, 4], [6, 4], [0, 8], [-14, 0], [14, 0]].map(([dx, dy]) => `<path d="M${x + dx * s - 6 * s},${y + dy * s - 16 * s} Q${x + dx * s},${y + dy * s - 20 * s} ${x + dx * s + 6 * s},${y + dy * s - 16 * s}" stroke="#a07030" stroke-width="${2 * s}" fill="none"/>`).join("")}
      <ellipse cx="${x}" cy="${y - 4 * s}" rx="${22 * s}" ry="${5 * s}" fill="#b87828" opacity="0.5"/>
    `
  },
  {
    id: "anemone",
    label: "Anemone",
    category: "coral",
    cost: 85,
    startOwned: 0,
    desc: "Waving tentacles in vivid pink.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <ellipse cx="${x}" cy="${y - 4 * s}" rx="${18 * s}" ry="${8 * s}" fill="#c05090"/>
      ${Array.from({ length: 9 }, (_, i) => {
      const angle = i / 9 * Math.PI;
      const bx = x + (Math.cos(angle) * 14 - 7) * s;
      return `<path d="M${bx},${y - 4 * s} Q${bx + (i % 2 ? 6 : -6) * s},${y - 24 * s} ${bx + (i % 2 ? 2 : -2) * s},${y - 38 * s}" stroke="#e060a0" stroke-width="${3 * s}" fill="none" stroke-linecap="round"/><circle cx="${bx + (i % 2 ? 2 : -2) * s}" cy="${y - 38 * s}" r="${4.5 * s}" fill="#ff80c0"/>`;
    }).join("")}
    `
  },
  // ── Special ───────────────────────────────────────────────
  {
    id: "sunken_statue",
    label: "Sunken Statue",
    category: "special",
    cost: 250,
    startOwned: 0,
    desc: "An ancient statue, half-buried — mysterious.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 10 * s}" y="${y - 60 * s}" width="${20 * s}" height="${60 * s}" rx="${3 * s}" fill="#607858"/>
      <ellipse cx="${x}" cy="${y - 60 * s}" rx="${12 * s}" ry="${14 * s}" fill="#708060"/>
      <ellipse cx="${x}" cy="${y - 62 * s}" rx="${9 * s}"  ry="${10 * s}" fill="#809070" opacity="0.7"/>
      <rect x="${x - 18 * s}" y="${y - 35 * s}" width="${10 * s}" height="${6 * s}" rx="${2 * s}" fill="#607858" transform="rotate(-10,${x - 13 * s},${y - 32 * s})"/>
      <rect x="${x + 8 * s}"  y="${y - 32 * s}" width="${10 * s}" height="${6 * s}" rx="${2 * s}" fill="#607858" transform="rotate(8,${x + 13 * s},${y - 29 * s})"/>
      <ellipse cx="${x - 4 * s}" cy="${y - 58 * s}" rx="${3 * s}" ry="${2 * s}" fill="#1a2818" opacity="0.7"/>
      <ellipse cx="${x + 4 * s}" cy="${y - 58 * s}" rx="${3 * s}" ry="${2 * s}" fill="#1a2818" opacity="0.7"/>
      <path d="M${x - 4 * s},${y - 52 * s} Q${x},${y - 50 * s} ${x + 4 * s},${y - 52 * s}" stroke="#1a2818" stroke-width="${1.5 * s}" fill="none" opacity="0.7"/>
      <ellipse cx="${x}" cy="${y}" rx="${14 * s}" ry="${5 * s}" fill="#506048" opacity="0.6"/>
    `
  },
  {
    id: "bubble_wand",
    label: "Bubble Wand",
    category: "special",
    cost: 55,
    startOwned: 0,
    desc: "Creates a stream of rising bubbles.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 3 * s}" y="${y - 50 * s}" width="${6 * s}" height="${50 * s}" rx="${3 * s}" fill="#4070c0"/>
      <rect x="${x - 8 * s}" y="${y - 4 * s}" width="${16 * s}" height="${6 * s}" rx="${3 * s}" fill="#2050a0"/>
      ${[0, 1, 2].map((i) => `<circle cx="${x + (i % 2 ? 4 : -4) * s}" cy="${y - (15 + i * 14) * s}" r="${(3 - i * 0.5) * s}" fill="none" stroke="rgba(180,220,255,0.7)" stroke-width="${1.5 * s}"/>`).join("")}
    `
  },
  {
    id: "neon_sign",
    label: "Neon Sign",
    category: "special",
    cost: 180,
    startOwned: 0,
    desc: 'A glowing "FISH" neon sign. Pure vibes.',
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 32 * s}" y="${y - 28 * s}" width="${64 * s}" height="${28 * s}" rx="${4 * s}" fill="#0a0e18" stroke="#1a2840" stroke-width="${1.5 * s}"/>
      <text x="${x}" y="${y - 8 * s}" text-anchor="middle" font-size="${18 * s}" font-weight="bold" font-family="monospace"
            fill="#ff60a0" style="filter:drop-shadow(0 0 4px #ff60a0)">FISH</text>
      <rect x="${x - 32 * s}" y="${y - 28 * s}" width="${64 * s}" height="${28 * s}" rx="${4 * s}" fill="none" stroke="#ff60a0" stroke-width="${1.5 * s}" opacity="0.4"/>
    `
  },
  // ── Achievement-Exclusive Decorations ─────────────────────
  // These are NOT purchasable. They are granted only by specific achievements.
  // achievementId links back to the achievement that unlocks them.
  {
    id: "golden_coral",
    label: "Golden Coral",
    category: "coral",
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: "tank_happy",
    achievementLabel: "Happy Habitat",
    desc: "Radiant coral carved from solid gold. Awarded for reaching 100% tank happiness.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x},${y} L${x},${y - 44 * s}" stroke="#c8901c" stroke-width="${5 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 22 * s} L${x - 18 * s},${y - 40 * s}" stroke="#c8901c" stroke-width="${4 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 22 * s} L${x + 16 * s},${y - 38 * s}" stroke="#c8901c" stroke-width="${4 * s}" stroke-linecap="round"/>
      <path d="M${x},${y - 38 * s} L${x - 12 * s},${y - 54 * s}" stroke="#e0a830" stroke-width="${3 * s}" stroke-linecap="round"/>
      <path d="M${x - 18 * s},${y - 40 * s} L${x - 24 * s},${y - 54 * s}" stroke="#e0a830" stroke-width="${3 * s}" stroke-linecap="round"/>
      <path d="M${x + 16 * s},${y - 38 * s} L${x + 22 * s},${y - 52 * s}" stroke="#e0a830" stroke-width="${3 * s}" stroke-linecap="round"/>
      ${[[0, -44], [-18, -40], [16, -38], [-12, -54], [-24, -54], [22, -52]].map(([dx, dy]) => `<circle cx="${x + dx * s}" cy="${y + dy * s}" r="${5 * s}" fill="#f0c030"/><circle cx="${x + dx * s}" cy="${y + dy * s}" r="${2.5 * s}" fill="#fff8e0" opacity="0.7"/>`).join("")}
      <ellipse cx="${x}" cy="${y}" rx="${10 * s}" ry="${4 * s}" fill="#a07010" opacity="0.5"/>
    `
  },
  {
    id: "ancient_ruin",
    label: "Ancient Ruin",
    category: "structure",
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: "species_10",
    achievementLabel: "Geneticist",
    desc: "A moss-covered column from a forgotten civilisation. Awarded for discovering 10 species.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <rect x="${x - 12 * s}" y="${y - 72 * s}" width="${24 * s}" height="${72 * s}" rx="${3 * s}" fill="#6a7860"/>
      <rect x="${x - 14 * s}" y="${y - 74 * s}" width="${28 * s}" height="${8 * s}"  rx="${2 * s}" fill="#5a6850"/>
      <rect x="${x - 14 * s}" y="${y - 10 * s}" width="${28 * s}" height="${10 * s}" rx="${2 * s}" fill="#5a6850"/>
      ${[[0, 28], [0, 48], [0, 62]].map(([_, yOff]) => `<rect x="${x - 10 * s}" y="${y - yOff * s}" width="${20 * s}" height="${3 * s}" fill="#4a5840" opacity="0.6"/>`).join("")}
      <path d="M${x - 10 * s},${y - 60 * s} Q${x - 5 * s},${y - 55 * s} ${x - 8 * s},${y - 40 * s}" stroke="#4a8040" stroke-width="${3 * s}" fill="none" opacity="0.8" stroke-linecap="round"/>
      <path d="M${x + 6 * s},${y - 50 * s} Q${x + 12 * s},${y - 44 * s} ${x + 9 * s},${y - 30 * s}" stroke="#4a8040" stroke-width="${2.5 * s}" fill="none" opacity="0.7" stroke-linecap="round"/>
      <ellipse cx="${x}" cy="${y}" rx="${16 * s}" ry="${5 * s}" fill="#4a5840" opacity="0.5"/>
    `
  },
  {
    id: "sunken_galleon",
    label: "Sunken Galleon",
    category: "structure",
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: "three_tanks",
    achievementLabel: "Aquarium Baron",
    desc: "A grand galleon lost to the deep. Awarded for unlocking all three tanks.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <path d="M${x - 56 * s},${y} L${x - 66 * s},${y - 28 * s} L${x + 66 * s},${y - 28 * s} L${x + 56 * s},${y} Z" fill="#6a4828"/>
      <path d="M${x - 56 * s},${y} L${x - 66 * s},${y - 28 * s} L${x + 66 * s},${y - 28 * s} L${x + 56 * s},${y} Z" fill="none" stroke="#4a3020" stroke-width="${2 * s}"/>
      <rect x="${x - 12 * s}" y="${y - 58 * s}" width="${9 * s}" height="${32 * s}" rx="${1 * s}" fill="#4a3820" transform="rotate(-10,${x},${y - 28 * s})"/>
      <rect x="${x + 8 * s}"  y="${y - 52 * s}" width="${7 * s}" height="${26 * s}" rx="${1 * s}" fill="#4a3820" transform="rotate(6,${x},${y - 28 * s})"/>
      <path d="M${x - 10 * s},${y - 56 * s} L${x + 14 * s},${y - 48 * s} L${x + 6 * s},${y - 32 * s} Z" fill="#7a6040" opacity="0.5"/>
      ${[[-40, -24], [-20, -22], [0, -24], [20, -22], [40, -24]].map(([dx, dy]) => `<rect x="${x + dx * s}" y="${y + dy * s}" width="${10 * s}" height="${8 * s}" rx="${1 * s}" fill="#1a1208" opacity="0.65"/>`).join("")}
      <ellipse cx="${x}" cy="${y}" rx="${58 * s}" ry="${9 * s}" fill="#58401e"/>
      <path d="M${x - 30 * s},${y - 28 * s} Q${x},${y - 22 * s} ${x + 30 * s},${y - 28 * s}" stroke="#3a2810" stroke-width="${3 * s}" fill="none" opacity="0.5"/>
    `
  },
  {
    id: "magic_orb",
    label: "Magic Orb",
    category: "special",
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: "magic_3",
    achievementLabel: "Halfway There",
    desc: "A softly pulsing orb of arcane energy. Awarded for discovering 3 Magic Fish.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <circle cx="${x}" cy="${y - 22 * s}" r="${22 * s}" fill="url(#orbGrad${x | 0})" opacity="0.92"/>
      <defs>
        <radialGradient id="orbGrad${x | 0}" cx="38%" cy="35%">
          <stop offset="0%"   stop-color="#e0b8ff"/>
          <stop offset="55%"  stop-color="#8840e0"/>
          <stop offset="100%" stop-color="#3010a0"/>
        </radialGradient>
      </defs>
      <circle cx="${x - 6 * s}" cy="${y - 30 * s}" r="${6 * s}" fill="white" opacity="0.2"/>
      ${[0, 60, 120, 180, 240, 300].map((deg, i) => {
      const r2 = 16 * s, rx = x + Math.cos(deg * Math.PI / 180) * r2, ry = y - 22 * s + Math.sin(deg * Math.PI / 180) * r2;
      return `<circle cx="${rx}" cy="${ry}" r="${2.5 * s}" fill="#c080ff" opacity="${0.3 + i * 0.08}"/>`;
    }).join("")}
      <circle cx="${x}" cy="${y - 22 * s}" r="${22 * s}" fill="none" stroke="#b060ff" stroke-width="${1.5 * s}" opacity="0.5"/>
      <rect x="${x - 4 * s}" y="${y - 2 * s}" width="${8 * s}" height="${4 * s}" rx="${2 * s}" fill="#6030a0"/>
      <ellipse cx="${x}" cy="${y}" rx="${14 * s}" ry="${4 * s}" fill="#5020a0" opacity="0.4"/>
    `
  },
  {
    id: "legend_throne",
    label: "Legend Throne",
    category: "special",
    cost: 0,
    startOwned: 0,
    achievementLocked: true,
    achievementId: "magic_7",
    achievementLabel: "Legend of the Deep",
    desc: "An ancient coral throne fit for the ocean's ruler. Awarded for discovering all 7 Magic Fish.",
    defaultScale: 1,
    svgFn: (x, y, s) => `
      <!-- seat and back -->
      <rect x="${x - 26 * s}" y="${y - 50 * s}" width="${52 * s}" height="${8 * s}" rx="${3 * s}" fill="#1a3060"/>
      <rect x="${x - 22 * s}" y="${y - 50 * s}" width="${44 * s}" height="${50 * s}" rx="${2 * s}" fill="#1e3870"/>
      <!-- armrests -->
      <rect x="${x - 32 * s}" y="${y - 38 * s}" width="${12 * s}" height="${6 * s}" rx="${2 * s}" fill="#1a3060"/>
      <rect x="${x + 20 * s}" y="${y - 38 * s}" width="${12 * s}" height="${6 * s}" rx="${2 * s}" fill="#1a3060"/>
      <!-- legs -->
      <rect x="${x - 20 * s}" y="${y - 4 * s}" width="${8 * s}" height="${6 * s}" rx="${1 * s}" fill="#162850"/>
      <rect x="${x + 12 * s}" y="${y - 4 * s}" width="${8 * s}" height="${6 * s}" rx="${1 * s}" fill="#162850"/>
      <!-- star emblem -->
      <text x="${x}" y="${y - 22 * s}" text-anchor="middle" font-size="${22 * s}" style="filter:drop-shadow(0 0 5px #b0944a)">★</text>
      <!-- crown finials -->
      ${[-20, 0, 20].map((dx, i) => `<path d="M${x + dx * s},${y - 50 * s} L${x + dx * s},${y - 62 * s} L${x + (dx + 6) * s},${y - 56 * s} L${x + (dx + 12) * s},${y - 62 * s} L${x + (dx + 12) * s},${y - 50 * s}" fill="${["#c8901c", "#e0b030", "#c8901c"][i]}" stroke="#a07010" stroke-width="${s}"/>`).join("")}
      <!-- gold trim -->
      <rect x="${x - 26 * s}" y="${y - 52 * s}" width="${52 * s}" height="${3 * s}" rx="${1 * s}" fill="#e0b030" opacity="0.8"/>
      <rect x="${x - 24 * s}" y="${y - 2 * s}"  width="${48 * s}" height="${3 * s}" rx="${1 * s}" fill="#e0b030" opacity="0.6"/>
    `
  }
];
const TANK_THEMES = [
  {
    id: "tropical",
    label: "Tropical Reef",
    emoji: "",
    cost: 0,
    startOwned: true,
    desc: "Warm Caribbean blue with coral silhouettes and golden sand. The classic.",
    substrateId: "sand",
    waterGradient: [
      { offset: "0%", color: "#1a6ab8", opacity: 0.88 },
      { offset: "40%", color: "#145898", opacity: 0.9 },
      { offset: "72%", color: "#0e4480", opacity: 0.93 },
      { offset: "100%", color: "#0a2850", opacity: 0.96 }
    ],
    bgSvgFn: () => `
      <ellipse cx="100" cy="390" rx="80" ry="32" fill="#1a3050" opacity="0.30"/>
      <ellipse cx="700" cy="392" rx="90" ry="28" fill="#1a3050" opacity="0.28"/>
      <ellipse cx="400" cy="395" rx="120" ry="22" fill="#152840" opacity="0.25"/>
      <g opacity="0.28" fill="#162848">
        <path d="M30,400 Q48,360 38,322 Q55,290 42,258 Q58,278 52,322 Q65,360 78,400 Z"/>
        <path d="M350,400 Q372,378 360,348 Q382,320 365,296 Q386,318 376,354 Q390,375 402,400 Z"/>
        <path d="M680,400 Q695,370 685,342 Q700,315 690,288 Q708,310 700,348 Q714,372 724,400 Z"/>
      </g>
      ${[680, 714, 748].map((x, i) => `<path d="M${x},400 C${x + 14},348 ${x - 8},296 ${x + 18},238 C${x + 32},188 ${x + 4},158 ${x + 22},118" stroke="#1a5030" stroke-width="6" fill="none" opacity="0.22" class="kelp-sway" style="animation-delay:${i * 0.8}s"/>`).join("")}
    `
  },
  {
    id: "deep_ocean",
    label: "Deep Ocean",
    emoji: "",
    cost: 300,
    startOwned: false,
    desc: "Near-black abyssal waters with bioluminescent streaks. Dramatic and moody.",
    substrateId: "gravel_dark",
    waterGradient: [
      { offset: "0%", color: "#0a1838", opacity: 0.92 },
      { offset: "35%", color: "#06122c", opacity: 0.94 },
      { offset: "70%", color: "#040e22", opacity: 0.96 },
      { offset: "100%", color: "#020818", opacity: 0.98 }
    ],
    bgSvgFn: () => `
      <ellipse cx="200" cy="388" rx="100" ry="28" fill="#0a1828" opacity="0.6"/>
      <ellipse cx="600" cy="390" rx="120" ry="24" fill="#080f1e" opacity="0.6"/>
      ${[["#00e8c8", 120, 280, 0.12], ["#40a0ff", 340, 200, 0.1], ["#80ffee", 580, 310, 0.08], ["#20d8ff", 200, 340, 0.09], ["#60c0ff", 700, 260, 0.1]].map(([c, x, y, o]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="4" fill="${c}" opacity="${o}"/>
          <ellipse cx="${x}" cy="${y}" rx="18" ry="6" fill="${c}" opacity="${o * 0.4}"/>`).join("")}
      <path d="M0,360 Q80,340 160,360 Q240,342 320,360 Q400,344 480,360 Q560,342 640,360 Q720,344 800,360" stroke="#00e8c8" stroke-width="1" fill="none" opacity="0.08"/>
      <g opacity="0.35" fill="#060e1c">
        <path d="M60,400 Q80,365 72,335 Q88,308 75,280 Q92,302 85,338 Q100,368 115,400 Z"/>
        <path d="M640,400 Q658,370 650,342 Q664,316 655,290 Q670,312 663,345 Q678,373 690,400 Z"/>
      </g>
    `
  },
  {
    id: "amazon",
    label: "Amazon River",
    emoji: "",
    cost: 250,
    startOwned: false,
    desc: "Teal-green jungle waters thick with roots and tropical foliage.",
    substrateId: "gravel_dark",
    waterGradient: [
      { offset: "0%", color: "#10583a", opacity: 0.85 },
      { offset: "40%", color: "#0c4830", opacity: 0.88 },
      { offset: "72%", color: "#083822", opacity: 0.92 },
      { offset: "100%", color: "#042818", opacity: 0.95 }
    ],
    bgSvgFn: () => `
      <ellipse cx="150" cy="392" rx="100" ry="24" fill="#062010" opacity="0.5"/>
      <ellipse cx="620" cy="390" rx="110" ry="22" fill="#041808" opacity="0.5"/>
      ${[60, 180, 320, 460, 580, 700].map((x, i) => `
        <path d="M${x},400 C${x + 10 * (i % 2 ? 1 : -1)},360 ${x - 8 * (i % 3 ? 1 : -1)},310 ${x + 15 * (i % 2 ? 1 : -1)},240 C${x + 25 * (i % 3 ? 1 : -1)},180 ${x + 5},150 ${x + 18},100"
              stroke="${["#1a6030", "#246838", "#1c5828", "#2a7040", "#1e6030"][i % 5]}" stroke-width="${7 - i % 3}" fill="none" opacity="0.30" class="kelp-sway" style="animation-delay:${i * 0.5}s"/>
        <path d="M${x + 20},400 C${x + 30},370 ${x + 40},330 ${x + 15},280"
              stroke="#184820" stroke-width="4" fill="none" opacity="0.20"/>
      `).join("")}
      <g opacity="0.25" fill="#082810">
        ${[80, 220, 380, 520, 660].map((x, i) => `<ellipse cx="${x}" cy="${380 + i % 3 * 5}" rx="${55 + i * 8}" ry="18"/>`).join("")}
      </g>
    `
  },
  {
    id: "arctic",
    label: "Arctic",
    emoji: "",
    cost: 350,
    startOwned: false,
    desc: "Icy cyan waters with frost formations and pale volcanic floor.",
    substrateId: "gravel_white",
    waterGradient: [
      { offset: "0%", color: "#b8e8f8", opacity: 0.35 },
      { offset: "30%", color: "#5abcdc", opacity: 0.72 },
      { offset: "65%", color: "#1880b0", opacity: 0.9 },
      { offset: "100%", color: "#0a3848", opacity: 1 }
    ],
    bgSvgFn: () => `
      ${[[-30, 340, 50, 160], [-10, 380, 30, 180], [15, 360, 40, 140], [0, 400, 28, 200]].map(([dx, y, rx, ry], i) => `
        <ellipse cx="${150 + dx + i * 180}" cy="${y}" rx="${rx}" ry="${ry}"
                 fill="#c8ecf8" opacity="${0.12 + i % 3 * 0.04}"/>
      `).join("")}
      ${[[80, 200, 18], [200, 180, 14], [420, 220, 20], [560, 190, 16], [680, 210, 12]].map(([x, y, s]) => `
        <path d="M${x},${y + s} L${x},${y - s} M${x - s},${y} L${x + s},${y} M${x - s * 0.7},${y - s * 0.7} L${x + s * 0.7},${y + s * 0.7} M${x - s * 0.7},${y + s * 0.7} L${x + s * 0.7},${y - s * 0.7}"
              stroke="#a8d8f0" stroke-width="1.5" fill="none" opacity="0.18"/>
      `).join("")}
      <ellipse cx="400" cy="395" rx="430" ry="18" fill="#d0ecf8" opacity="0.14"/>
      <g opacity="0.22" fill="#8ccce8">
        ${[100, 300, 500, 680].map((x, i) => `<path d="M${x - 20},400 L${x},${370 - i * 5} L${x + 20},400 Z"/>`).join("")}
      </g>
    `
  },
  {
    id: "volcanic",
    label: "Volcanic Vent",
    emoji: "",
    cost: 500,
    startOwned: false,
    desc: "Scorching dark waters lit by glowing vents. Maximum drama.",
    substrateId: "gravel_dark",
    waterGradient: [
      { offset: "0%", color: "#281210", opacity: 0.88 },
      { offset: "40%", color: "#381808", opacity: 0.9 },
      { offset: "72%", color: "#482006", opacity: 0.93 },
      { offset: "100%", color: "#2a0c02", opacity: 0.96 }
    ],
    bgSvgFn: () => `
      ${[[120, 395, 80, 20, "#8a2000", 0.35], [400, 398, 60, 14, "#a03010", 0.3], [660, 396, 70, 18, "#7a1800", 0.35]].map(([cx, cy, rx, ry, c, o]) => `
        <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${o}"/>
        <ellipse cx="${cx}" cy="${cy - 2}" rx="${rx * 0.7}" ry="${ry * 0.6}" fill="#c04010" opacity="${o * 0.5}"/>
      `).join("")}
      ${[[100, 380], [420, 370], [680, 378]].map(([x, y], i) => `
        <path d="M${x},400 C${x - 5},${y} ${x + 8},${y - 30} ${x + 2},${y - 70} C${x - 4},${y - 110} ${x + 6},${y - 130} ${x},${y - 160}"
              stroke="#e04010" stroke-width="${3 + i}" fill="none" opacity="0.18" class="kelp-sway" style="animation-delay:${i * 0.6}s"/>
      `).join("")}
      ${[[160, 360], [340, 350], [540, 358], [720, 345]].map(([x, y], i) => `
        <ellipse cx="${x}" cy="${y}" rx="${8 + i * 2}" ry="${4 + i}" fill="#ff6020" opacity="${0.08 + i * 0.02}"/>
      `).join("")}
    `
  },
  {
    id: "sakura",
    label: "Sakura Pond",
    emoji: "",
    cost: 400,
    startOwned: false,
    desc: "Soft jade-green waters with drifting cherry blossoms. Serene.",
    substrateId: "sand",
    waterGradient: [
      { offset: "0%", color: "#2a6840", opacity: 0.65 },
      { offset: "38%", color: "#1e5030", opacity: 0.8 },
      { offset: "70%", color: "#143820", opacity: 0.92 },
      { offset: "100%", color: "#0c2810", opacity: 0.95 }
    ],
    bgSvgFn: () => `
      ${[100, 260, 440, 600, 730].map((x, i) => `
        <path d="M${x},400 C${x + 8 * (i % 2 ? 1 : -1)},350 ${x - 6},290 ${x + 12 * (i % 3 ? 1 : -1)},220 C${x + 20},170 ${x + 4},140 ${x + 14},90"
              stroke="${["#5a9060", "#4a8050", "#628858", "#508060", "#3a7048"][i % 5]}" stroke-width="${5 + i % 3}" fill="none" opacity="0.28" class="kelp-sway" style="animation-delay:${i * 0.7}s"/>
      `).join("")}
      ${[80, 200, 350, 480, 560, 680, 140, 310].map((x, i) => `
        <circle cx="${x}" cy="${80 + i * 30 + i % 3 * 20}" r="4" fill="#f8b8c8" opacity="${0.15 + i % 4 * 0.05}"/>
        <circle cx="${x + 8}" cy="${85 + i * 30 + i % 3 * 20}" r="3" fill="#fca8b8" opacity="${0.12 + i % 3 * 0.04}"/>
        <circle cx="${x - 6}" cy="${90 + i * 30 + i % 3 * 20}" r="3.5" fill="#f0b0c0" opacity="${0.1 + i % 4 * 0.03}"/>
      `).join("")}
      <ellipse cx="400" cy="395" rx="420" ry="20" fill="#2a5830" opacity="0.30"/>
      ${[60, 230, 460, 620].map((x, i) => `
        <ellipse cx="${x}" cy="${388 + i % 2 * 4}" rx="${50 + i * 10}" ry="12" fill="#1e4428" opacity="0.22"/>
      `).join("")}
    `
  }
];
function getThemeById(id) {
  return TANK_THEMES.find((t) => t.id === id) || TANK_THEMES[0];
}
function getDecorById(id) {
  return DECOR_CATALOG.find((d) => d.id === id) || null;
}
function getStarterOwnedDecor() {
  const owned = {};
  for (const d of DECOR_CATALOG) {
    if (d.startOwned > 0) owned[d.id] = d.startOwned;
  }
  return owned;
}
function getDefaultThemes() {
  return {
    owned: ["tropical"],
    active: "tropical"
  };
}
function getDefaultDecorations() {
  return {
    owned: getStarterOwnedDecor(),
    placed: [
      { instanceId: "init_gravel", type: "gravel_white", x: 400, y: 395, scale: 1 },
      { instanceId: "init_plant1", type: "plant_green", x: 680, y: 380, scale: 1 },
      { instanceId: "init_plant2", type: "plant_green", x: 120, y: 375, scale: 0.85 }
    ]
  };
}
const SAVE_KEY = "fishtycoon2_save";
const SAVE_VERSION = 14;
const TANK_TYPES = {
  display: { label: "Display Tank", emoji: "", desc: "Show off your best fish. Happy fish sell for more." },
  breeding: { label: "Breeding Tank", emoji: "", desc: "Dedicated breeding environment. +20% egg success." },
  grow: { label: "Grow-out Tank", emoji: "", desc: "Juveniles grow up 25% faster here." }
};
const TANK_UNLOCK = [
  null,
  { cost: 500, label: "Unlock 2nd Tank", desc: "A dedicated breeding or grow-out tank." },
  { cost: 2e3, label: "Unlock 3rd Tank", desc: "Triple your capacity and specialisation." },
  { cost: 5e3, label: "Unlock 4th Tank", desc: "A premium habitat for your rarest specimens.", minPrestige: 1 },
  { cost: 12e3, label: "Unlock 5th Tank", desc: "Industrial-scale aquarium expansion.", minPrestige: 2 },
  { cost: 25e3, label: "Unlock 6th Tank", desc: "The ultimate aquarium baron setup.", minPrestige: 3 }
];
const ACHIEVEMENT_DEFS = [
  { id: "first_fish", label: "Aquarist", desc: "Discover your first species", emoji: "", secret: false, tier: "common" },
  { id: "species_5", label: "Explorer", desc: "Discover 5 different species", emoji: "", secret: false, tier: "common" },
  { id: "species_10", label: "Geneticist", desc: "Discover 10 different species", emoji: "", secret: false, tier: "rare" },
  { id: "species_25", label: "Taxonomist", desc: "Discover 25 different species", emoji: "", secret: false, tier: "rare" },
  { id: "first_sale", label: "Merchant", desc: "Make your first sale", emoji: "", secret: false, tier: "common" },
  { id: "coins_500", label: "Entrepreneur", desc: "Earn 500 total coins from sales", emoji: "", secret: false, tier: "common" },
  { id: "coins_5000", label: "Tycoon", desc: "Earn 5,000 total coins from sales", emoji: "", secret: false, tier: "rare" },
  { id: "coins_50000", label: "Mogul", desc: "Earn 50,000 total coins from sales", emoji: "", secret: true, tier: "secret" },
  { id: "rare_discovery", label: "Rare Find", desc: "Discover a rare species", emoji: "", secret: false, tier: "common" },
  { id: "epic_discovery", label: "Legendary Catch", desc: "Discover an epic species", emoji: "", secret: true, tier: "secret" },
  { id: "full_tank", label: "Full House", desc: "Fill any tank to capacity", emoji: "", secret: false, tier: "common" },
  { id: "bred_5", label: "Matchmaker", desc: "Breed 5 batches of eggs", emoji: "", secret: false, tier: "common" },
  { id: "bred_20", label: "Speed Breeder", desc: "Breed 20 batches of eggs", emoji: "", secret: false, tier: "rare" },
  { id: "tank_happy", label: "Happy Habitat", desc: "Reach 100% tank happiness", emoji: "", secret: false, tier: "common" },
  { id: "upgrade_max", label: "Maximalist", desc: "Max out any shop upgrade", emoji: "", secret: false, tier: "rare" },
  { id: "fish_rescued", label: "Healer", desc: "Use medicine on a sick fish", emoji: "", secret: false, tier: "common" },
  { id: "water_pristine", label: "Pure Waters", desc: "Treat water back to 100% quality", emoji: "", secret: false, tier: "common" },
  { id: "survived_night", label: "Night Watch", desc: "Keep all fish alive overnight", emoji: "", secret: true, tier: "secret" },
  { id: "two_tanks", label: "Expanding Empire", desc: "Unlock a second tank", emoji: "", secret: false, tier: "common" },
  { id: "three_tanks", label: "Aquarium Baron", desc: "Unlock all three tanks", emoji: "", secret: true, tier: "secret" },
  { id: "magic_1", label: "First Wonder", desc: "Discover the first Magic Fish", emoji: "", secret: false, tier: "rare" },
  { id: "magic_3", label: "Halfway There", desc: "Discover 3 of the 7 Magic Fish", emoji: "", secret: false, tier: "rare" },
  { id: "magic_7", label: "Legend of the Deep", desc: "Discover all 7 Magic Fish", emoji: "", secret: true, tier: "secret" },
  { id: "hire_staff", label: "Boss Mode", desc: "Hire your first staff member", emoji: "", secret: false, tier: "common" },
  { id: "full_research", label: "Scholar", desc: "Complete an entire research branch", emoji: "", secret: false, tier: "rare" },
  { id: "equip_all", label: "Fully Equipped", desc: "Install 4 different equipment types", emoji: "", secret: false, tier: "rare" },
  { id: "five_star", label: "Five Stars", desc: "Receive a 5-star review", emoji: "", secret: false, tier: "common" },
  { id: "unlock_room", label: "Room to Grow", desc: "Unlock a second aquarium room", emoji: "", secret: false, tier: "common" },
  { id: "rep_100", label: "Famous Aquarium", desc: "Reach 100 reputation", emoji: "", secret: false, tier: "rare" },
  { id: "supplier_all", label: "Connected", desc: "Unlock all 5 suppliers", emoji: "", secret: true, tier: "secret" },
  { id: "species_50", label: "Completionist", desc: "Discover 50 different species", emoji: "", secret: true, tier: "secret" }
];
function createDefaultTank(id, type = "display") {
  const tankTypeDef = TANK_TYPES[type] || TANK_TYPES.display;
  return {
    id,
    type,
    size: "medium",
    name: tankTypeDef.label,
    capacity: 12,
    waterQuality: 100,
    temperature: 74,
    happiness: 100,
    equipment: [],
    autoFeed: false,
    autoFeedTick: 0,
    decorations: getDefaultDecorations(),
    themes: getDefaultThemes(),
    supplies: {
      food: 40,
      medicine: 0,
      // legacy key — kept at 0 so old saves don't break
      antibiotic: 3,
      antiparasitic: 2,
      digestiveRemedy: 2,
      waterTreatment: 8,
      heater: 0,
      breedingBoost: 0
    }
  };
}
function createDefaultState() {
  const tank0 = createDefaultTank("tank_0", "display");
  const starterFish = [
    createFish({ stage: "adult", tankId: "tank_0", targetRarity: "common" }),
    createFish({ stage: "adult", tankId: "tank_0", targetRarity: "uncommon" }),
    createFish({ stage: "juvenile", tankId: "tank_0" })
  ];
  return {
    version: SAVE_VERSION,
    lastSavedAt: Date.now(),
    lastTickAt: Date.now(),
    gameClock: Date.now(),
    gameSpeed: 1,
    difficulty: "normal",
    staff: [],
    lastWageDay: 0,
    statsHistory: [],
    lastSnapshotAt: 0,
    giftShop: { unlocked: false, level: 0, totalEarned: 0 },
    cafe: { unlocked: false, level: 0, totalEarned: 0 },
    notifications: [],
    suppliers: { unlocked: ["basic"], activeSupplier: "basic" },
    unlockedRooms: ["lobby"],
    roomAssignments: {},
    campaign: {
      mode: "sandbox",
      activeLevelId: null,
      completedLevels: {},
      levelCompleted: false
    },
    offlineSummary: null,
    player: {
      coins: 325,
      totalCoinsEarned: 0,
      xp: 0,
      research: { marine_biology: 0, genetics: 0, business: 0 },
      activeLoan: { active: false },
      dailyStreak: 0,
      lastDailyClaimDate: null,
      unlockedBackgrounds: ["tropical"],
      completedMilestones: [],
      tutorialStep: 0,
      tutorialDone: false,
      shopLevel: 1,
      fishdex: [],
      achievements: [],
      magicFishFound: [],
      // array of magic fish IDs found
      stats: { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0, fishBought: 0, fishListed: 0, breedingsStarted: 0, eggsHatched: 0, wantedFulfilled: 0, fishDied: 0, fishSold: 0, fishFed: 0 },
      autopsies: [],
      // post-mortem records
      boosts: {},
      // active booster flags, e.g. { rarityBoost: 1, luckyCharm: 1 }
      unlockedDecorations: [],
      // decoration IDs granted by achievements (not purchasable)
      legendFishUnlocked: false,
      // true after earning Legend of the Deep (magic_7)
      nightWatchEarned: false,
      // fast flag — avoids scanning achievements[] every tick
      // UI badge watermarks — how many entries the player had last time they
      // visited each tab. Stored in save so import/export keeps them consistent.
      seenFishdexCount: 0,
      seenShopFishCount: 0,
      seenAchCount: 0,
      challengeStreak: 0,
      // consecutive days all 3 challenges completed
      firstPlayedAt: Date.now(),
      // when the game was first started
      tutorialFlags: {}
      // { firstCustomer, giftEgg, breedHint, ... }
    },
    rareMarket: {
      lastRefreshDay: 0,
      // UTC day number of last seen rotation
      purchased: []
      // [{ day, itemId }]
    },
    // ── Daily market price fluctuation ─────────────────────
    market: {
      day: 0,
      modifiers: {},
      hotTrait: null,
      headline: ""
    },
    // ── Wanted Board (breeding goals) ─────────────────────
    wantedPosters: [],
    // ── Fish memorials (death records) ────────────────────
    memorials: [],
    // ── Micro-event state ─────────────────────────────────
    lastMicroEventAt: 0,
    dailyChallenges: {
      day: 0,
      // UTC day number when challenges were generated
      challenges: []
      // [{ id, desc, emoji, goal, progress, reward, completed }]
    },
    tanks: [tank0],
    fish: starterFish,
    passiveTick: 0,
    shop: {
      level: 1,
      slots: 4,
      listedFish: [],
      fishPrices: {},
      reputation: 0,
      lastCustomerAt: 0,
      salesHistory: [],
      upgrades: {
        slot: { level: 0, maxLevel: 7, cost: 80, label: "Extra Slot", description: "+1 sale slot per level (up to +7)" },
        reputation: { level: 0, maxLevel: 7, cost: 120, label: "Advertising", description: "Customers arrive faster (up to −75% interval)" },
        capacity: { level: 0, maxLevel: 7, cost: 150, label: "Tank Expansion", description: "+4 fish capacity per level (up to +28)" },
        breeding: { level: 0, maxLevel: 7, cost: 200, label: "Speed Breeding", description: "−20% breed time per level (up to −80%)" },
        lighting: { level: 0, maxLevel: 3, cost: 350, label: "Premium Display Lighting", description: "+10% sale price per level" },
        vip: { level: 0, maxLevel: 3, cost: 500, label: "VIP Membership", description: "Wealthy Patrons visit sooner & more often" },
        hatchery: { level: 0, maxLevel: 3, cost: 450, label: "Hatchery", description: "-15% egg & juvenile grow time per level" },
        tankSitter: { level: 0, maxLevel: 3, cost: 600, label: "Tank Sitter", description: "+24h offline progress cap per level (base: 48h)" },
        purifier: { level: 0, maxLevel: 3, cost: 300, label: "Water Purifier", description: "-25% water decay rate per level" },
        autoMedic: { level: 0, maxLevel: 3, cost: 400, label: "Auto-Medic", description: "10% chance/min to auto-cure sick fish per level" },
        mutagen: { level: 0, maxLevel: 3, cost: 500, label: "Mutation Catalyst", description: "+3% mutation chance when breeding per level" },
        insurance: { level: 0, maxLevel: 3, cost: 350, label: "Aquarium Insurance", description: "Refund 20% of fish value on death per level" },
        fame: { level: 0, maxLevel: 5, cost: 250, label: "Aquarium Fame", description: "+15% passive income per level" },
        tempControl: { level: 0, maxLevel: 3, cost: 300, label: "Climate Control", description: "-30% temperature drift per level" },
        luckyCharm: { level: 0, maxLevel: 3, cost: 550, label: "Lucky Charm", description: "+5% chance of higher rarity from breeding per level" },
        bulkBuyer: { level: 0, maxLevel: 5, cost: 200, label: "Bulk Buyer", description: "-10% supply costs per level" },
        whisperer: { level: 0, maxLevel: 3, cost: 350, label: "Fish Whisperer", description: "+10% base happiness per level" },
        genetics: { level: 0, maxLevel: 3, cost: 400, label: "Genetics Lab", description: "More breeding prediction detail per level" },
        service: { level: 0, maxLevel: 5, cost: 280, label: "Customer Service", description: "+15% customer tip bonus per level" },
        deepSea: { level: 0, maxLevel: 3, cost: 800, label: "Deep Sea Permit", description: "+6 tank capacity per level (all tanks)" },
        breedBay: { level: 0, maxLevel: 2, cost: 1200, label: "Extra Breeding Bay", description: "Unlock an additional breeding bay (up to 3 total)" }
      }
    },
    breedingTank: {
      slots: [null, null],
      eggReady: false,
      breedingStartedAt: null,
      breedingDurationMs: 3e5,
      storedGenomeA: null,
      storedGenomeB: null,
      storedGenomeC: null,
      storedTankId: null
    },
    // Extra breeding bays (bay 0 = breedingTank above, these are bays 1+)
    extraBays: [],
    maxBays: 1,
    // ── New systems ──────────────────────────────────────
    specialOrders: [],
    // 3 daily rotating orders
    lastOrderSeed: 0,
    reviews: [],
    // aquarium reviews history
    lastReviewAt: 0,
    discoveries: [],
    // unique phenotype discovery keys
    weather: null,
    // current weather state
    lastWeatherSeed: 0,
    urgentOffer: null,
    // limited-time loss aversion offer
    log: [
      { time: Date.now(), message: "Welcome to Fish Tycoon 2! Your aquarium awaits." },
      { time: Date.now() - 1, message: "Starter bundle: 325 coins, food, water treatment, antibiotic, antiparasitic & digestive remedy included." }
    ]
  };
}
function migrateSave(parsed, fromVersion) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  if (fromVersion < 7) {
    if (!parsed.tanks) {
      const old = parsed.tank || {};
      const base = createDefaultTank("tank_0", "display");
      parsed.tanks = [{
        ...base,
        capacity: old.capacity ?? base.capacity,
        waterQuality: old.waterQuality ?? base.waterQuality,
        temperature: old.temperature ?? base.temperature,
        happiness: old.happiness ?? base.happiness,
        autoFeed: old.autoFeed ?? base.autoFeed,
        decorations: Array.isArray(old.decorations) ? getDefaultDecorations() : old.decorations ?? getDefaultDecorations(),
        supplies: { ...base.supplies, ...old.supplies || {} }
      }];
      delete parsed.tank;
    }
    if (parsed.fish) {
      parsed.fish = parsed.fish.map((f) => ({ tankId: "tank_0", ...f }));
    }
  }
  parsed.tanks = (parsed.tanks || []).map((t) => ({
    autoFeedTick: 0,
    ...t,
    decorations: t.decorations ?? getDefaultDecorations(),
    themes: t.themes ?? getDefaultThemes(),
    supplies: { breedingBoost: 0, ...t.supplies }
  }));
  if (!parsed.player.achievements) parsed.player.achievements = [];
  if (!parsed.player.unlockedDecorations) parsed.player.unlockedDecorations = [];
  if (parsed.player.legendFishUnlocked === void 0) parsed.player.legendFishUnlocked = false;
  if (!parsed.player.stats) {
    parsed.player.stats = { eggsCollected: 0, totalFishBred: 0, medicineUsed: 0, waterTreated: 0 };
  }
  if (parsed.player.fishdex) {
    parsed.player.fishdex = parsed.player.fishdex.map((e) => ({ aiName: null, aiLore: null, ...e }));
  }
  if (((_a = parsed.shop) == null ? void 0 : _a.upgrades) && !parsed.shop.upgrades.reputation) {
    parsed.shop.upgrades.reputation = { level: 0, cost: 120, label: "Advertising", description: "Customers arrive faster" };
  }
  if ((_b = parsed.shop) == null ? void 0 : _b.upgrades) {
    const u = parsed.shop.upgrades;
    if (!u.slot.maxLevel || u.slot.maxLevel < 7) u.slot = { ...u.slot, maxLevel: 7, description: "+1 sale slot per level (up to +7)" };
    if (!((_c = u.reputation) == null ? void 0 : _c.maxLevel) || u.reputation.maxLevel < 7) u.reputation = { ...u.reputation || {}, maxLevel: 7, description: "Customers arrive faster (up to −75% interval)" };
    if (!((_d = u.capacity) == null ? void 0 : _d.maxLevel) || u.capacity.maxLevel < 7) u.capacity = { ...u.capacity || {}, maxLevel: 7, description: "+4 fish capacity per level (up to +28)" };
    if (!((_e = u.breeding) == null ? void 0 : _e.maxLevel) || u.breeding.maxLevel < 7) u.breeding = { ...u.breeding || {}, maxLevel: 7, description: "−20% breed time per level (up to −80%)" };
    if (!u.lighting) u.lighting = { level: 0, maxLevel: 3, cost: 350, label: "Premium Display Lighting", description: "+10% sale price per level" };
    if (!u.vip) u.vip = { level: 0, maxLevel: 3, cost: 500, label: "VIP Membership", description: "Wealthy Patrons visit sooner & more often" };
    if (!u.hatchery) u.hatchery = { level: 0, maxLevel: 3, cost: 450, label: "Hatchery", description: "-15% egg & juvenile grow time per level" };
    if (!u.tankSitter) u.tankSitter = { level: 0, maxLevel: 3, cost: 600, label: "Tank Sitter", description: "+24h offline progress cap per level (base: 48h)" };
    if (!u.purifier) u.purifier = { level: 0, maxLevel: 3, cost: 300, label: "Water Purifier", description: "-25% water decay rate per level" };
    if (!u.autoMedic) u.autoMedic = { level: 0, maxLevel: 3, cost: 400, label: "Auto-Medic", description: "10% chance/min to auto-cure sick fish per level" };
    if (!u.mutagen) u.mutagen = { level: 0, maxLevel: 3, cost: 500, label: "Mutation Catalyst", description: "+3% mutation chance when breeding per level" };
    if (!u.insurance) u.insurance = { level: 0, maxLevel: 3, cost: 350, label: "Aquarium Insurance", description: "Refund 20% of fish value on death per level" };
    if (!u.fame) u.fame = { level: 0, maxLevel: 5, cost: 250, label: "Aquarium Fame", description: "+15% passive income per level" };
    if (!u.tempControl) u.tempControl = { level: 0, maxLevel: 3, cost: 300, label: "Climate Control", description: "-30% temperature drift per level" };
    if (!u.luckyCharm) u.luckyCharm = { level: 0, maxLevel: 3, cost: 550, label: "Lucky Charm", description: "+5% chance of higher rarity from breeding per level" };
    if (!u.bulkBuyer) u.bulkBuyer = { level: 0, maxLevel: 5, cost: 200, label: "Bulk Buyer", description: "-10% supply costs per level" };
    if (!u.whisperer) u.whisperer = { level: 0, maxLevel: 3, cost: 350, label: "Fish Whisperer", description: "+10% base happiness per level" };
    if (!u.genetics) u.genetics = { level: 0, maxLevel: 3, cost: 400, label: "Genetics Lab", description: "More breeding prediction detail per level" };
    if (!u.service) u.service = { level: 0, maxLevel: 5, cost: 280, label: "Customer Service", description: "+15% customer tip bonus per level" };
    if (!u.deepSea) u.deepSea = { level: 0, maxLevel: 3, cost: 800, label: "Deep Sea Permit", description: "+6 tank capacity per level (all tanks)" };
    if (!u.breedBay) u.breedBay = { level: 0, maxLevel: 2, cost: 1200, label: "Extra Breeding Bay", description: "Unlock an additional breeding bay (up to 3 total)" };
  }
  if (parsed.extraBays === void 0) parsed.extraBays = [];
  if (parsed.maxBays === void 0) parsed.maxBays = 1 + (((_h = (_g = (_f = parsed.shop) == null ? void 0 : _f.upgrades) == null ? void 0 : _g.breedBay) == null ? void 0 : _h.level) || 0);
  if (parsed.player.xp === void 0) parsed.player.xp = Math.round((parsed.player.totalCoinsEarned || 0) * 0.05);
  if (!parsed.specialOrders) parsed.specialOrders = [];
  if (!parsed.reviews) parsed.reviews = [];
  if (!parsed.discoveries) parsed.discoveries = [];
  if (!parsed.player.research) parsed.player.research = { marine_biology: 0, genetics: 0, business: 0 };
  if (!parsed.player.activeLoan) parsed.player.activeLoan = { active: false };
  if (parsed.player.dailyStreak === void 0) parsed.player.dailyStreak = 0;
  if (!parsed.player.unlockedBackgrounds) parsed.player.unlockedBackgrounds = ["tropical"];
  if (!parsed.player.completedMilestones) parsed.player.completedMilestones = [];
  if (!parsed.player.magicFishFound) parsed.player.magicFishFound = [];
  if (!parsed.player.autopsies) parsed.player.autopsies = [];
  if (!((_i = parsed.shop) == null ? void 0 : _i.fishPrices)) {
    parsed.shop = { ...parsed.shop, fishPrices: {} };
  }
  if (!((_j = parsed.shop) == null ? void 0 : _j.listedFish)) {
    parsed.shop = { ...parsed.shop, listedFish: [] };
  }
  if (!parsed.breedingTank) {
    parsed.breedingTank = {
      slots: [null, null],
      eggReady: false,
      breedingStartedAt: null,
      breedingDurationMs: 3e5,
      storedGenomeA: null,
      storedGenomeB: null,
      storedTankId: null
    };
  }
  if (!Array.isArray(parsed.breedingTank.slots)) {
    parsed.breedingTank.slots = [null, null];
  }
  if (parsed.breedingTank && parsed.breedingTank.storedGenomeA === void 0) {
    parsed.breedingTank = {
      storedGenomeA: null,
      storedGenomeB: null,
      storedTankId: null,
      ...parsed.breedingTank
    };
  }
  if (parsed.breedingTank && parsed.breedingTank.storedGenomeC === void 0) {
    parsed.breedingTank = { storedGenomeC: null, ...parsed.breedingTank };
  }
  if ((((_m = (_l = (_k = parsed.shop) == null ? void 0 : _k.upgrades) == null ? void 0 : _l.hatchery) == null ? void 0 : _m.level) || 0) >= 1) {
    const bt = parsed.breedingTank;
    if (bt && Array.isArray(bt.slots) && bt.slots.length < 3) {
      parsed.breedingTank = { ...bt, slots: [...bt.slots, null] };
    }
  }
  if (!parsed.player.boosts) parsed.player.boosts = {};
  if (!parsed.player.nightWatchEarned) parsed.player.nightWatchEarned = (parsed.player.achievements || []).some((a) => a.id === "survived_night");
  if (parsed.player.seenFishdexCount == null) parsed.player.seenFishdexCount = 0;
  if (parsed.player.seenShopFishCount == null) parsed.player.seenShopFishCount = 0;
  if (parsed.player.seenAchCount == null) parsed.player.seenAchCount = 0;
  if (parsed.passiveTick == null) parsed.passiveTick = 0;
  if (!parsed.rareMarket) parsed.rareMarket = { lastRefreshDay: 0, purchased: [] };
  if (!parsed.dailyChallenges) parsed.dailyChallenges = { day: 0, challenges: [] };
  if (!parsed.market) parsed.market = { day: 0, modifiers: {}, hotTrait: null, headline: "" };
  if (!parsed.player.firstPlayedAt) parsed.player.firstPlayedAt = parsed.lastTickAt || Date.now();
  if (!parsed.player.tutorialFlags) parsed.player.tutorialFlags = {};
  parsed.tanks = (parsed.tanks || []).map((t) => {
    const s = t.supplies || {};
    if (s.antibiotic !== void 0) return t;
    const legacy = s.medicine || 0;
    return {
      ...t,
      supplies: {
        ...s,
        medicine: 0,
        antibiotic: legacy > 0 ? legacy : 3,
        antiparasitic: legacy > 0 ? Math.max(1, Math.floor(legacy / 2)) : 2,
        digestiveRemedy: legacy > 0 ? Math.max(1, Math.floor(legacy / 2)) : 2
      }
    };
  });
  if (!parsed.wantedPosters) parsed.wantedPosters = [];
  if (!parsed.memorials) parsed.memorials = [];
  if (!parsed.lastMicroEventAt) parsed.lastMicroEventAt = 0;
  if (parsed.fish) {
    parsed.fish = parsed.fish.map((f) => ({
      generation: 1,
      ...f,
      // Validate genome structure — fill missing genes with random alleles
      genome: (() => {
        if (!f.genome || typeof f.genome !== "object") return f.genome;
        const GENE_KEYS = ["bodyShape", "finType", "pattern", "primaryColor", "secondaryColor", "glow", "size", "mutation"];
        for (const g of GENE_KEYS) {
          if (!f.genome[g] || !Array.isArray(f.genome[g]) || f.genome[g].length !== 2) {
            f.genome[g] = ["N", "N"];
          }
        }
        return f.genome;
      })(),
      // Sanitize numeric fields
      health: Number.isFinite(f.health) ? f.health : 100,
      hunger: Number.isFinite(f.hunger) ? f.hunger : 0,
      age: Number.isFinite(f.age) ? f.age : 0
    }));
  }
  if (parsed.fish) {
    parsed.fish = parsed.fish.filter((f) => {
      if (!f || !f.id) return false;
      if (f.genome && typeof f.genome !== "object") {
        f.genome = null;
        f.phenotype = null;
        f.species = null;
      }
      if (!Number.isFinite(f.health)) f.health = 100;
      if (!Number.isFinite(f.hunger)) f.hunger = 0;
      return true;
    });
    if (parsed.fish.length > 200) parsed.fish.length = 200;
  }
  if (((_n = parsed.memorials) == null ? void 0 : _n.length) > 50) parsed.memorials.length = 50;
  if (((_o = parsed.wantedPosters) == null ? void 0 : _o.length) > 20) parsed.wantedPosters.length = 20;
  if (((_p = parsed.log) == null ? void 0 : _p.length) > 60) parsed.log.length = 60;
  if (((_q = parsed.reviews) == null ? void 0 : _q.length) > 10) parsed.reviews.length = 10;
  if (((_s = (_r = parsed.player) == null ? void 0 : _r.autopsies) == null ? void 0 : _s.length) > 100) parsed.player.autopsies.length = 100;
  if (((_u = (_t = parsed.player) == null ? void 0 : _t.fishdex) == null ? void 0 : _u.length) > 500) parsed.player.fishdex.length = 500;
  if (fromVersion < 9) {
    parsed.gameClock = parsed.gameClock || parsed.lastTickAt || Date.now();
    parsed.gameSpeed = parsed.gameSpeed || 1;
  }
  if (fromVersion < 10) {
    parsed.campaign = parsed.campaign || {
      mode: "sandbox",
      activeLevelId: null,
      completedLevels: {},
      levelCompleted: false
    };
    if ((_v = parsed.player) == null ? void 0 : _v.stats) {
      parsed.player.stats.fishBought = parsed.player.stats.fishBought || 0;
      parsed.player.stats.fishListed = parsed.player.stats.fishListed || 0;
      parsed.player.stats.breedingsStarted = parsed.player.stats.breedingsStarted || 0;
      parsed.player.stats.eggsHatched = parsed.player.stats.eggsHatched || 0;
      parsed.player.stats.wantedFulfilled = parsed.player.stats.wantedFulfilled || 0;
      parsed.player.stats.fishDied = parsed.player.stats.fishDied || 0;
      parsed.difficulty = parsed.difficulty || "normal";
    }
  }
  if (fromVersion < 11) {
    parsed.staff = parsed.staff || [];
    parsed.lastWageDay = parsed.lastWageDay || 0;
    parsed.statsHistory = parsed.statsHistory || [];
    parsed.lastSnapshotAt = parsed.lastSnapshotAt || 0;
  }
  if (fromVersion < 12) {
    if (parsed.tanks) {
      for (const t of parsed.tanks) {
        if (!t.size) t.size = "medium";
      }
    }
    parsed.giftShop = parsed.giftShop || { unlocked: false, level: 0, totalEarned: 0 };
    parsed.cafe = parsed.cafe || { unlocked: false, level: 0, totalEarned: 0 };
  }
  if (fromVersion < 13) {
    parsed.notifications = parsed.notifications || [];
    parsed.suppliers = parsed.suppliers || { unlocked: ["basic"], activeSupplier: "basic" };
    if (parsed.player) parsed.player.repMilestones = parsed.player.repMilestones || {};
    if (parsed.tanks) {
      for (const t of parsed.tanks) {
        if (!t.equipment) t.equipment = [];
      }
    }
  }
  if (fromVersion < 14) {
    parsed.unlockedRooms = parsed.unlockedRooms || ["lobby"];
    parsed.roomAssignments = parsed.roomAssignments || {};
    parsed.visitors = parsed.visitors || { current: 0, perMin: 0, satisfaction: 50, totalToday: 0 };
  }
  parsed.version = SAVE_VERSION;
  return parsed;
}
function normalizeSave(parsed) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s;
  if (!parsed) return parsed;
  if (!parsed.player) parsed.player = {};
  if (!parsed.player.stats) parsed.player.stats = {};
  (_a = parsed.player.stats).fishBought ?? (_a.fishBought = 0);
  (_b = parsed.player.stats).fishListed ?? (_b.fishListed = 0);
  (_c = parsed.player.stats).breedingsStarted ?? (_c.breedingsStarted = 0);
  (_d = parsed.player.stats).eggsHatched ?? (_d.eggsHatched = 0);
  (_e = parsed.player.stats).wantedFulfilled ?? (_e.wantedFulfilled = 0);
  (_f = parsed.player.stats).fishDied ?? (_f.fishDied = 0);
  (_g = parsed.player.stats).fishSold ?? (_g.fishSold = 0);
  (_h = parsed.player.stats).fishFed ?? (_h.fishFed = 0);
  (_i = parsed.player.stats).eggsCollected ?? (_i.eggsCollected = 0);
  (_j = parsed.player.stats).medicineUsed ?? (_j.medicineUsed = 0);
  (_k = parsed.player.stats).waterTreated ?? (_k.waterTreated = 0);
  if (!parsed.player.fishdex) parsed.player.fishdex = [];
  if (!parsed.player.achievements) parsed.player.achievements = [];
  if (!parsed.player.autopsies) parsed.player.autopsies = [];
  if (!parsed.player.tutorialFlags) parsed.player.tutorialFlags = {};
  if (!parsed.player.mentorFlags) parsed.player.mentorFlags = {};
  if (!parsed.player.repMilestones) parsed.player.repMilestones = {};
  if (!parsed.player.research) parsed.player.research = { marine_biology: 0, genetics: 0, business: 0 };
  (_l = parsed.player).coins ?? (_l.coins = 0);
  (_m = parsed.player).xp ?? (_m.xp = 0);
  (_n = parsed.player).totalCoinsEarned ?? (_n.totalCoinsEarned = 0);
  (_o = parsed.player).prestigeLevel ?? (_o.prestigeLevel = 0);
  if (!parsed.campaign) {
    parsed.campaign = { mode: "sandbox", activeLevelId: null, completedLevels: {}, levelCompleted: false };
  }
  if (!parsed.campaign.completedLevels) parsed.campaign.completedLevels = {};
  (_p = parsed.campaign).activeLevelId ?? (_p.activeLevelId = null);
  (_q = parsed.campaign).levelCompleted ?? (_q.levelCompleted = false);
  (_r = parsed.campaign).mode ?? (_r.mode = "sandbox");
  if (!parsed.shop) parsed.shop = { listedFish: [], fishPrices: {}, slots: 4, upgrades: {}, lastCustomerAt: 0, reputation: 0 };
  if (!parsed.shop.salesHistory) parsed.shop.salesHistory = [];
  if (!parsed.shop.upgrades) parsed.shop.upgrades = {};
  (_s = parsed.shop).reputation ?? (_s.reputation = 0);
  if (!parsed.tanks) parsed.tanks = [];
  for (const t of parsed.tanks) {
    if (!t.equipment) t.equipment = [];
    if (!t.supplies) t.supplies = {};
    if (!t.decorations) t.decorations = { placed: [] };
    t.size ?? (t.size = "medium");
    t.capacity ?? (t.capacity = 12);
    t.waterQuality ?? (t.waterQuality = 100);
    t.temperature ?? (t.temperature = 74);
    t.happiness ?? (t.happiness = 100);
  }
  if (!parsed.fish) parsed.fish = [];
  if (!parsed.breedingTank) {
    parsed.breedingTank = { slots: [null, null], eggReady: false, breedingStartedAt: null, breedingDurationMs: 3e5 };
  }
  if (!parsed.staff) parsed.staff = [];
  if (!parsed.notifications) parsed.notifications = [];
  if (!parsed.suppliers) parsed.suppliers = { unlocked: ["basic"], activeSupplier: "basic" };
  if (!parsed.unlockedRooms) parsed.unlockedRooms = ["lobby"];
  if (!parsed.roomAssignments) parsed.roomAssignments = {};
  if (!parsed.giftShop) parsed.giftShop = { unlocked: false, level: 0, totalEarned: 0 };
  if (!parsed.cafe) parsed.cafe = { unlocked: false, level: 0, totalEarned: 0 };
  if (!parsed.statsHistory) parsed.statsHistory = [];
  if (!parsed.reviews) parsed.reviews = [];
  if (!parsed.log) parsed.log = [];
  parsed.gameClock ?? (parsed.gameClock = Date.now());
  parsed.gameSpeed ?? (parsed.gameSpeed = 1);
  parsed.lastSnapshotAt ?? (parsed.lastSnapshotAt = 0);
  parsed.lastWageDay ?? (parsed.lastWageDay = 0);
  return parsed;
}
const isElectron = () => {
  var _a;
  return typeof window !== "undefined" && ((_a = window.electronAPI) == null ? void 0 : _a.isElectron);
};
function cleanStateForSave(state) {
  return {
    ...state,
    player: {
      ...state.player,
      autopsies: (state.player.autopsies || []).map(({ _fishId, ...rest }) => rest)
    },
    lastSavedAt: Date.now(),
    // Strip store functions/UI state that shouldn't be persisted
    soundOn: void 0,
    showOffline: void 0
  };
}
function saveGame(state) {
  try {
    const cleanState = cleanStateForSave(state);
    if (cleanState.player) {
      if (!Number.isFinite(cleanState.player.coins)) cleanState.player.coins = 0;
      if (!Number.isFinite(cleanState.player.xp)) cleanState.player.xp = 0;
    }
    if (cleanState.fish) {
      for (const f of cleanState.fish) {
        if (!Number.isFinite(f.health)) f.health = 100;
        if (!Number.isFinite(f.hunger)) f.hunger = 0;
        if (!Number.isFinite(f.age)) f.age = 0;
        if (!Number.isFinite(f.x)) f.x = 50;
        if (!Number.isFinite(f.y)) f.y = 50;
      }
    }
    const json = JSON.stringify(cleanState);
    try {
      const prev = localStorage.getItem(SAVE_KEY);
      if (prev) localStorage.setItem(SAVE_KEY + "_backup", prev);
    } catch {
    }
    localStorage.setItem(SAVE_KEY, json);
    if (isElectron()) {
      window.electronAPI.saveGame(cleanState).catch(
        (err) => console.warn("[Electron] Filesystem save failed:", err)
      );
    }
    return true;
  } catch (e) {
    console.error("Save failed:", e);
    return false;
  }
}
function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.warn("Main save corrupted, trying backup...");
      const backup = localStorage.getItem(SAVE_KEY + "_backup");
      if (!backup) return null;
      parsed = JSON.parse(backup);
    }
    if (!parsed || !parsed.player || !Array.isArray(parsed.fish)) {
      console.warn("Save missing required fields, trying backup...");
      const backup = localStorage.getItem(SAVE_KEY + "_backup");
      if (backup) {
        const backupParsed = JSON.parse(backup);
        if ((backupParsed == null ? void 0 : backupParsed.player) && Array.isArray(backupParsed == null ? void 0 : backupParsed.fish)) parsed = backupParsed;
        else return null;
      } else return null;
    }
    const fromVersion = parsed.version ?? 0;
    if (fromVersion !== SAVE_VERSION) {
      console.warn(`Migrating save from v${fromVersion} → v${SAVE_VERSION}`);
      return normalizeSave(migrateSave(parsed, fromVersion));
    }
    return normalizeSave(parsed);
  } catch (e) {
    console.error("Load failed:", e);
    return null;
  }
}
async function loadGameAsync() {
  try {
    if (isElectron()) {
      const result = await window.electronAPI.loadGame();
      if ((result == null ? void 0 : result.ok) && result.data) {
        const parsed = result.data;
        if ((parsed == null ? void 0 : parsed.player) && Array.isArray(parsed == null ? void 0 : parsed.fish)) {
          const fromVersion = parsed.version ?? 0;
          return normalizeSave(fromVersion !== SAVE_VERSION ? migrateSave(parsed, fromVersion) : parsed);
        }
      }
    }
  } catch (e) {
    console.warn("[Electron] Filesystem load failed, falling back to localStorage:", e);
  }
  return loadGame();
}
async function exportSave(state) {
  const clean = {
    ...state,
    player: {
      ...state.player,
      autopsies: (state.player.autopsies || []).map(({ _fishId, ...rest }) => rest)
    },
    _exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
    _exportVersion: SAVE_VERSION
  };
  if (isElectron()) {
    return window.electronAPI.exportSave(clean);
  }
  const blob = new Blob([JSON.stringify(clean, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fishtycoon2-save-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
async function importSave(fileOrNull) {
  if (isElectron() && !fileOrNull) {
    const result = await window.electronAPI.importSave();
    if (!result.ok) throw new Error("Import cancelled");
    const parsed = result.data;
    if (!parsed.player || !parsed.fish || !parsed.tanks) {
      throw new Error("Invalid save file — missing required fields.");
    }
    const fromVersion = parsed.version ?? 0;
    return normalizeSave(fromVersion !== SAVE_VERSION ? migrateSave(parsed, fromVersion) : parsed);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.player || !parsed.fish || !parsed.tanks) {
          return reject(new Error("Invalid save file — missing required fields."));
        }
        const fromVersion = parsed.version ?? 0;
        const migrated = normalizeSave(fromVersion !== SAVE_VERSION ? migrateSave(parsed, fromVersion) : parsed);
        resolve(migrated);
      } catch {
        reject(new Error("Could not parse save file — is it a valid JSON export?"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsText(fileOrNull);
  });
}
function addLog(state, message) {
  return { ...state, log: [{ time: Date.now(), message }, ...state.log || []].slice(0, 60) };
}
function addLogDraft(draft, message, severity) {
  if (!draft.log) draft.log = [];
  draft.log.unshift({ time: Date.now(), message, ...{} });
  if (draft.log.length > 60) draft.log.length = 60;
}
const ACHIEVEMENT_TIER_REWARDS = { common: 25, rare: 100, secret: 500 };
const ACHIEVEMENT_DECOR_REWARDS = {
  tank_happy: "golden_coral",
  species_10: "ancient_ruin",
  three_tanks: "sunken_galleon",
  magic_3: "magic_orb",
  magic_7: "legend_throne"
};
function checkAchievements(state, messages) {
  var _a;
  if (!(state == null ? void 0 : state.player) || !(state == null ? void 0 : state.fish) || !(state == null ? void 0 : state.tanks)) return state;
  if ((state.player.achievements || []).length >= ACHIEVEMENT_DEFS.length) return state;
  const earned = new Set((state.player.achievements || []).map((a) => a.id));
  const newAchievements = [];
  let coinsAwarded = 0;
  const newUnlockedDecorations = [];
  let legendFishGrant = false;
  function award(id) {
    if (earned.has(id)) return;
    const def = ACHIEVEMENT_DEFS.find((d) => d.id === id);
    if (!def) return;
    const reward = ACHIEVEMENT_TIER_REWARDS[def.tier] ?? ACHIEVEMENT_TIER_REWARDS.common;
    newAchievements.push({ id, unlockedAt: Date.now(), reward });
    coinsAwarded += reward;
    earned.add(id);
    messages.push(`🏆 Achievement unlocked: ${def.emoji} ${def.label}! +🪙${reward}`);
    const decorId = ACHIEVEMENT_DECOR_REWARDS[id];
    if (decorId && !(state.player.unlockedDecorations || []).includes(decorId) && !newUnlockedDecorations.includes(decorId)) {
      newUnlockedDecorations.push(decorId);
      messages.push(`Decoration unlocked: ${decorId.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}!`);
    }
    if (id === "magic_7") legendFishGrant = true;
  }
  const { player, fish, tanks, shop } = state;
  const fishdex = player.fishdex || [];
  const stats = player.stats || {};
  if (fishdex.length >= 1) award("first_fish");
  if (fishdex.length >= 5) award("species_5");
  if (fishdex.length >= 10) award("species_10");
  if (fishdex.length >= 25) award("species_25");
  if (fishdex.some((e) => e.rarity === "rare")) award("rare_discovery");
  if (fishdex.some((e) => e.rarity === "epic")) award("epic_discovery");
  if ((shop.salesHistory || []).length >= 1) award("first_sale");
  if ((player.totalCoinsEarned || 0) >= 500) award("coins_500");
  if ((player.totalCoinsEarned || 0) >= 5e3) award("coins_5000");
  if ((player.totalCoinsEarned || 0) >= 5e4) award("coins_50000");
  const fishCountByTank = /* @__PURE__ */ new Map();
  for (const f of fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
  const anyFull = tanks.some((t) => t.capacity > 0 && (fishCountByTank.get(t.id) || 0) >= t.capacity);
  if (anyFull) award("full_tank");
  if (tanks.some((t) => (t.happiness || 0) >= 100)) award("tank_happy");
  if (tanks.length >= 2) award("two_tanks");
  if (tanks.length >= 3) award("three_tanks");
  const magicFound = (player.magicFishFound || []).length;
  if (magicFound >= 1) award("magic_1");
  if (magicFound >= 3) award("magic_3");
  if (magicFound >= 7) award("magic_7");
  if ((stats.eggsCollected || 0) >= 5) award("bred_5");
  if ((stats.eggsCollected || 0) >= 20) award("bred_20");
  if ((stats.medicineUsed || 0) >= 1) award("fish_rescued");
  if ((stats.waterTreated || 0) >= 1) award("water_pristine");
  const upgrades = shop.upgrades || {};
  if (Object.values(upgrades).some((u) => u.level >= (u.maxLevel || 3))) award("upgrade_max");
  if ((state.staff || []).length >= 1) award("hire_staff");
  const research = player.research || {};
  if (Object.values(research).some((v) => v >= 4)) award("full_research");
  const allEqTypes = /* @__PURE__ */ new Set();
  for (const t of tanks) {
    for (const eq of t.equipment || []) allEqTypes.add(eq.typeId);
  }
  if (allEqTypes.size >= 4) award("equip_all");
  if ((state.reviews || []).some((r) => r.stars >= 5)) award("five_star");
  if ((state.unlockedRooms || []).length >= 2) award("unlock_room");
  if ((shop.reputation || 0) >= 100) award("rep_100");
  if ((((_a = state.suppliers) == null ? void 0 : _a.unlocked) || []).length >= 5) award("supplier_all");
  if (fishdex.length >= 50) award("species_50");
  if (newAchievements.length === 0) return state;
  return {
    ...state,
    player: {
      ...player,
      coins: (player.coins || 0) + coinsAwarded,
      achievements: [...player.achievements, ...newAchievements],
      unlockedDecorations: [...player.unlockedDecorations || [], ...newUnlockedDecorations],
      legendFishUnlocked: player.legendFishUnlocked || legendFishGrant
    }
  };
}
const PRESTIGE_BONUSES = {
  startCoins: { base: 325, perLevel: 200 }
};
function canPrestige(state) {
  const magicFound = (state.player.magicFishFound || []).length;
  const species = (state.player.fishdex || []).length;
  return magicFound >= 7 || species >= 50;
}
function performPrestige(state) {
  var _a;
  if (!canPrestige(state)) return state;
  const newLevel = (state.player.prestigeLevel || 0) + 1;
  const startCoins = PRESTIGE_BONUSES.startCoins.base + newLevel * PRESTIGE_BONUSES.startCoins.perLevel;
  const fresh = createDefaultState();
  return {
    ...fresh,
    // Preserved player data
    player: {
      ...fresh.player,
      coins: startCoins,
      totalCoinsEarned: 0,
      prestigeLevel: newLevel,
      prestigeTotalEarned: (state.player.prestigeTotalEarned || 0) + (state.player.totalCoinsEarned || 0),
      xp: 0,
      level: 1,
      // Keep these across prestige
      fishdex: state.player.fishdex || [],
      achievements: state.player.achievements || [],
      magicFishFound: state.player.magicFishFound || [],
      stats: { ...fresh.player.stats, totalPrestiges: (((_a = state.player.stats) == null ? void 0 : _a.totalPrestiges) || 0) + 1 },
      tutorialFlags: state.player.tutorialFlags,
      tutorialDone: state.player.tutorialDone,
      legendFishUnlocked: state.player.legendFishUnlocked,
      unlockedDecorations: state.player.unlockedDecorations || [],
      unlockedBackgrounds: state.player.unlockedBackgrounds || []
    },
    // Keep memorials (emotional memories persist across runs)
    memorials: state.memorials || [],
    _prestigeJustHappened: true
  };
}
let _ctx = null;
let _enabled = true;
let _masterVol = 0.7;
let _musicVol = 0.4;
let _sfxVol = 0.8;
let _musicGain = null;
let _sfxGain = null;
let _musicPlaying = false;
let _musicNodes = [];
function ctx() {
  if (!_ctx) {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
    _sfxGain = _ctx.createGain();
    _sfxGain.gain.value = _sfxVol * _masterVol;
    _sfxGain.connect(_ctx.destination);
    _musicGain = _ctx.createGain();
    _musicGain.gain.value = _musicVol * _masterVol;
    _musicGain.connect(_ctx.destination);
  }
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}
function setSoundEnabled(v) {
  _enabled = v;
  if (!v) stopMusic();
}
function setMasterVolume(v) {
  _masterVol = v;
  if (_sfxGain) _sfxGain.gain.value = _sfxVol * _masterVol;
  if (_musicGain) _musicGain.gain.value = _musicVol * _masterVol;
  try {
    localStorage.setItem("ft2_masterVol", v);
  } catch {
  }
}
function setMusicVolume(v) {
  _musicVol = v;
  if (_musicGain) _musicGain.gain.value = _musicVol * _masterVol;
  try {
    localStorage.setItem("ft2_musicVol", v);
  } catch {
  }
}
function setSFXVolume(v) {
  _sfxVol = v;
  if (_sfxGain) _sfxGain.gain.value = _sfxVol * _masterVol;
  try {
    localStorage.setItem("ft2_sfxVol", v);
  } catch {
  }
}
function getMasterVolume() {
  try {
    const v = localStorage.getItem("ft2_masterVol");
    if (v) _masterVol = parseFloat(v);
  } catch {
  }
  return _masterVol;
}
function getMusicVolume() {
  try {
    const v = localStorage.getItem("ft2_musicVol");
    if (v) _musicVol = parseFloat(v);
  } catch {
  }
  return _musicVol;
}
function getSFXVolume() {
  try {
    const v = localStorage.getItem("ft2_sfxVol");
    if (v) _sfxVol = parseFloat(v);
  } catch {
  }
  return _sfxVol;
}
function playSfx(fn) {
  if (!_enabled) return;
  try {
    const c = ctx();
    fn(c, _sfxGain);
  } catch {
  }
}
function playCoin() {
  playSfx((c, dest) => {
    [660, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.35);
      o.start(t);
      o.stop(t + 0.35);
    });
  });
}
function playBubble() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    o.frequency.setValueAtTime(900, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, c.currentTime + 0.12);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.12);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.12);
  });
}
function playFeed() {
  playSfx((c, dest) => {
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 0.08), c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.value = 2500;
    filt.Q.value = 0.8;
    const g = c.createGain();
    src.connect(filt);
    filt.connect(g);
    g.connect(dest);
    g.gain.setValueAtTime(0.35, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.12);
    src.start(c.currentTime);
    src.stop(c.currentTime + 0.12);
  });
}
function playDiscover() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "triangle";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.11;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.04);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.35);
      o.start(t);
      o.stop(t + 0.35);
    });
  });
}
function playBreed() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    o.frequency.setValueAtTime(330, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(660, c.currentTime + 0.28);
    g.gain.setValueAtTime(0.18, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.45);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.45);
  });
}
function playSale() {
  playSfx((c, dest) => {
    [880, 1108, 1320].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.07;
      g.gain.setValueAtTime(0.15, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.25);
      o.start(t);
      o.stop(t + 0.25);
    });
  });
}
function playWarning() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sawtooth";
    o.frequency.setValueAtTime(120, c.currentTime);
    g.gain.setValueAtTime(0.08, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.18);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.18);
  });
}
const SCALE = [261.6, 293.7, 329.6, 392, 440, 523.3];
const CHORD_PROGRESSION = [
  [130.8, 164.8, 196, 246.9],
  // Cmaj7
  [110, 130.8, 164.8, 196],
  // Am7
  [87.3, 110, 130.8, 164.8],
  // Fmaj7
  [98, 123.5, 146.8, 174.6]
  // G
];
let _chordIndex = 0;
function schedulePadChord(c, dest) {
  if (!_musicPlaying) return;
  const chord = CHORD_PROGRESSION[_chordIndex % CHORD_PROGRESSION.length];
  _chordIndex++;
  const now2 = c.currentTime;
  for (const freq of chord) {
    const o = c.createOscillator();
    const g = c.createGain();
    const filt = c.createBiquadFilter();
    o.type = "sine";
    o.frequency.value = freq;
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(300, now2);
    filt.frequency.linearRampToValueAtTime(600, now2 + 4);
    filt.frequency.linearRampToValueAtTime(200, now2 + 8);
    o.connect(filt);
    filt.connect(g);
    g.connect(dest);
    g.gain.setValueAtTime(0, now2);
    g.gain.linearRampToValueAtTime(0.012, now2 + 2);
    g.gain.setValueAtTime(0.012, now2 + 6);
    g.gain.exponentialRampToValueAtTime(1e-3, now2 + 9);
    o.start(now2);
    o.stop(now2 + 9);
  }
  setTimeout(() => schedulePadChord(c, dest), 8e3 + Math.random() * 4e3);
}
function scheduleShimmer(c, dest) {
  if (!_musicPlaying) return;
  const shimmerFreqs = [1047, 1175, 1319, 1568, 1760];
  const freq = shimmerFreqs[Math.floor(Math.random() * shimmerFreqs.length)];
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  o.connect(g);
  g.connect(dest);
  const now2 = c.currentTime;
  g.gain.setValueAtTime(0, now2);
  g.gain.linearRampToValueAtTime(6e-3, now2 + 0.1);
  g.gain.exponentialRampToValueAtTime(1e-3, now2 + 1.5);
  o.start(now2);
  o.stop(now2 + 1.5);
  setTimeout(() => scheduleShimmer(c, dest), 5e3 + Math.random() * 1e4);
}
function createDroneLayer(c, freq, dest) {
  const o = c.createOscillator(), g = c.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  const lfo = c.createOscillator(), lfoG = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoG.gain.value = 3;
  lfo.connect(lfoG);
  lfoG.connect(o.frequency);
  lfo.start();
  g.gain.value = 0.04;
  o.connect(g);
  g.connect(dest);
  o.start();
  return { osc: o, gain: g, lfo };
}
function scheduleNote(c, dest) {
  if (!_musicPlaying) return;
  const freq = SCALE[Math.floor(Math.random() * SCALE.length)] * (Math.random() < 0.3 ? 0.5 : 1);
  const o = c.createOscillator(), g = c.createGain();
  o.type = Math.random() < 0.5 ? "sine" : "triangle";
  o.frequency.value = freq;
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 800;
  o.connect(filt);
  filt.connect(g);
  g.connect(dest);
  const now2 = c.currentTime;
  g.gain.setValueAtTime(0, now2);
  g.gain.linearRampToValueAtTime(0.03, now2 + 0.5);
  g.gain.exponentialRampToValueAtTime(1e-3, now2 + 4);
  o.start(now2);
  o.stop(now2 + 4);
  const nextDelay = 3e3 + Math.random() * 5e3;
  setTimeout(() => scheduleNote(c, dest), nextDelay);
}
function startMusic() {
  if (_musicPlaying) return;
  _musicPlaying = true;
  const c = ctx();
  const dest = _musicGain;
  _musicNodes.push(createDroneLayer(c, 65.4, dest));
  _musicNodes.push(createDroneLayer(c, 98, dest));
  scheduleNote(c, dest);
  setTimeout(() => scheduleNote(c, dest), 2e3);
  setTimeout(() => schedulePadChord(c, dest), 3e3);
  setTimeout(() => scheduleShimmer(c, dest), 6e3);
  startAmbientNoise(c, dest);
  scheduleAmbientBubble(c, dest);
}
function startAmbientNoise(c, dest) {
  const bufferSize = c.sampleRate * 2;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = c.createBufferSource();
  noise.buffer = buffer;
  noise.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 200;
  lp.Q.value = 1;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 80;
  lfo.connect(lfoGain);
  lfoGain.connect(lp.frequency);
  lfo.start();
  const g = c.createGain();
  g.gain.value = 0.025;
  noise.connect(lp);
  lp.connect(g);
  g.connect(dest);
  noise.start();
  _musicNodes.push({ osc: noise, lfo });
}
function scheduleAmbientBubble(c, dest) {
  if (!_musicPlaying) return;
  const delay = 3 + Math.random() * 8;
  setTimeout(() => {
    if (!_musicPlaying) return;
    const o = c.createOscillator();
    const g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    const freq = 400 + Math.random() * 600;
    o.frequency.setValueAtTime(freq, c.currentTime);
    o.frequency.exponentialRampToValueAtTime(freq * 0.3, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.015, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.15);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.15);
    scheduleAmbientBubble(c, dest);
  }, delay * 1e3);
}
function stopMusic() {
  _musicPlaying = false;
  for (const node of _musicNodes) {
    try {
      node.osc.stop();
      node.lfo.stop();
    } catch {
    }
  }
  _musicNodes = [];
}
function isMusicPlaying() {
  return _musicPlaying;
}
function playClick() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    o.frequency.value = 1200;
    g.gain.setValueAtTime(0.06, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.06);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.06);
  });
}
function playTabSwitch() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    o.frequency.value = 800;
    o.frequency.exponentialRampToValueAtTime(1100, c.currentTime + 0.08);
    g.gain.setValueAtTime(0.05, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.08);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.08);
  });
}
function playDeath() {
  playSfx((c, dest) => {
    [220, 185, 147].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.2;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.5);
      o.start(t);
      o.stop(t + 0.5);
    });
  });
}
function playSick() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sawtooth";
    o.frequency.value = 200;
    o.frequency.exponentialRampToValueAtTime(150, c.currentTime + 0.2);
    g.gain.setValueAtTime(0.04, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.25);
    o.start(c.currentTime);
    o.stop(c.currentTime + 0.25);
  });
}
function playLevelUp() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047, 1319].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "triangle";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.15, t + 0.05);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.4);
      o.start(t);
      o.stop(t + 0.4);
    });
  });
}
let _lastSfxType = "";
let _lastSfxTime = 0;
function sfxThrottle(type) {
  const now2 = Date.now();
  if (type === _lastSfxType && now2 - _lastSfxTime < 50) return false;
  _lastSfxType = type;
  _lastSfxTime = now2;
  return true;
}
function playSaleScaled(value) {
  if (!sfxThrottle("sale")) return;
  if (value >= 500) {
    playSfx((c, dest) => {
      [660, 830, 990, 1320, 1580].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(dest);
        o.type = i < 3 ? "sine" : "triangle";
        o.frequency.value = freq;
        const t = c.currentTime + i * 0.06;
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(1e-3, t + 0.5);
        o.start(t);
        o.stop(t + 0.5);
      });
    });
  } else if (value >= 200) {
    playSfx((c, dest) => {
      [880, 1108, 1320, 1760].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(dest);
        o.type = "sine";
        o.frequency.value = freq;
        const t = c.currentTime + i * 0.065;
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(1e-3, t + 0.35);
        o.start(t);
        o.stop(t + 0.35);
      });
    });
  } else if (value >= 50) {
    playSale();
  } else {
    playSfx((c, dest) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.1, c.currentTime);
      g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.2);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.2);
    });
  }
}
function playDiscoverScaled(rarity) {
  if (!sfxThrottle("discover")) return;
  const rarityNotes = {
    common: [[523, 659], "triangle", 0.12, 0.3],
    uncommon: [[523, 659, 784], "triangle", 0.14, 0.35],
    rare: [[523, 659, 784, 1047], "triangle", 0.16, 0.4],
    epic: [[440, 554, 659, 880, 1047], "sine", 0.18, 0.5],
    legendary: [[392, 494, 587, 784, 988, 1175, 1568, 1976], "sine", 0.15, 0.45]
  };
  const [notes, wave, vol, dur] = rarityNotes[rarity] || rarityNotes.common;
  playSfx((c, dest) => {
    notes.forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = wave;
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.03);
      g.gain.exponentialRampToValueAtTime(1e-3, t + dur);
      o.start(t);
      o.stop(t + dur);
    });
  });
}
function playCoinScaled(amount) {
  if (!sfxThrottle("coin")) return;
  if (amount >= 500) {
    playSfx((c, dest) => {
      [660, 880, 1047, 1320, 1568].forEach((freq, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.connect(g);
        g.connect(dest);
        o.type = "sine";
        o.frequency.value = freq;
        const t = c.currentTime + i * 0.05;
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(1e-3, t + 0.3);
        o.start(t);
        o.stop(t + 0.3);
      });
    });
  } else if (amount >= 100) {
    playCoin();
  } else {
    playSfx((c, dest) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.06, c.currentTime);
      g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.15);
      o.start(c.currentTime);
      o.stop(c.currentTime + 0.15);
    });
  }
}
function playEquipInstall() {
  playSfx((c, dest) => {
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "square";
    o.frequency.setValueAtTime(180, c.currentTime);
    o.frequency.linearRampToValueAtTime(120, c.currentTime + 0.15);
    g.gain.setValueAtTime(0.15, c.currentTime);
    g.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.2);
    o.start();
    o.stop(c.currentTime + 0.2);
    const o2 = c.createOscillator(), g2 = c.createGain();
    o2.connect(g2);
    g2.connect(dest);
    o2.type = "sine";
    o2.frequency.value = 660;
    g2.gain.setValueAtTime(0, c.currentTime + 0.15);
    g2.gain.linearRampToValueAtTime(0.1, c.currentTime + 0.18);
    g2.gain.exponentialRampToValueAtTime(1e-3, c.currentTime + 0.4);
    o2.start(c.currentTime + 0.15);
    o2.stop(c.currentTime + 0.4);
  });
}
function playRepair() {
  playSfx((c, dest) => {
    [400, 500, 600].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "triangle";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.12);
      o.start(t);
      o.stop(t + 0.12);
    });
  });
}
function playHire() {
  playSfx((c, dest) => {
    [330, 415, 494].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.06;
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.3);
      o.start(t);
      o.stop(t + 0.3);
    });
  });
}
function playResearch() {
  playSfx((c, dest) => {
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = "sine";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.03);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.25);
      o.start(t);
      o.stop(t + 0.25);
    });
  });
}
function playHatch() {
  playSfx((c, dest) => {
    const noise = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 0.1, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (c.sampleRate * 0.02));
    noise.buffer = buf;
    const ng = c.createGain();
    noise.connect(ng);
    ng.connect(dest);
    ng.gain.value = 0.15;
    noise.start();
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g);
    g.connect(dest);
    o.type = "sine";
    o.frequency.value = 880;
    const t = c.currentTime + 0.08;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.02);
    g.gain.exponentialRampToValueAtTime(1e-3, t + 0.4);
    o.start(t);
    o.stop(t + 0.4);
  });
}
function playVictory() {
  playSfx((c, dest) => {
    const notes = [523, 659, 784, 1047, 784, 1047, 1318];
    notes.forEach((freq, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.connect(g);
      g.connect(dest);
      o.type = i < 4 ? "sine" : "triangle";
      o.frequency.value = freq;
      const t = c.currentTime + i * 0.12;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.03);
      g.gain.exponentialRampToValueAtTime(1e-3, t + 0.35);
      o.start(t);
      o.stop(t + 0.35);
    });
  });
}
const UPGRADE_COST_SCALE = 1.6;
const BREEDING_BASE_MS = 3e5;
const BREEDING_SPEED_FACTOR = 0.8;
const PERSONALITY_EMOJI = {
  playful: "",
  shy: "🫣",
  curious: "",
  lazy: "",
  aggressive: "",
  social: "",
  gluttonous: "🍽️",
  hardy: ""
};
const EGG_HATCH_ANIM_MS = 9e4;
const SPRITE_SIZE = {
  egg: 36,
  normal: 54,
  giant: 76
};
function upgradeCost(baseCost, level) {
  return Math.round(baseCost * Math.pow(UPGRADE_COST_SCALE, level));
}
const COLORS = ["Crimson", "Gold", "Violet", "Azure", "Emerald", "White"];
const SHAPES = ["Round", "Slender", "Orb", "Delta", "Eel"];
const PATTERNS = ["Spotted", "Tiger", "Marble", "Lined"];
const GLOWS = ["Luminous", "Radiant", "Ultraviolet"];
const BUYER_NAMES = [
  "A wealthy collector",
  "The royal aquarium",
  "A marine biologist",
  "A celebrity influencer",
  "The city zoo",
  "An eccentric millionaire",
  "A luxury hotel",
  "A famous chef",
  "A museum curator",
  "A tech CEO"
];
function generateWantedPoster(level = 1, existing = [], now2 = Date.now()) {
  const existingIds = new Set(existing.map((p) => p.id));
  const difficulty = Math.min(4, Math.floor(level / 5) + 1);
  const traits = {};
  traits.primaryColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  if (difficulty >= 2 || Math.random() < 0.5) {
    traits.bodyShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }
  if (difficulty >= 2 && Math.random() < 0.6) {
    traits.pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
  }
  if (difficulty >= 3 && Math.random() < 0.4) {
    traits.glow = GLOWS[Math.floor(Math.random() * (difficulty >= 4 ? GLOWS.length : 2))];
  }
  const traitCount = Object.keys(traits).length;
  const hasGlow = !!traits.glow;
  const baseReward = 150 + traitCount * 200 + (hasGlow ? 500 : 0);
  const reward = Math.round(baseReward * (0.8 + Math.random() * 0.4));
  const desc = Object.entries(traits).map(([k, v]) => v).join(" + ");
  const buyer = BUYER_NAMES[Math.floor(Math.random() * BUYER_NAMES.length)];
  const id = `wanted_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  if (existingIds.has(id)) return null;
  return {
    id,
    traits,
    reward,
    buyer,
    description: desc,
    createdAt: now2,
    expiresAt: now2 + 1e3 * 60 * 60 * 4,
    // 4 hours
    fulfilled: false
  };
}
function fishMatchesPoster(fish, poster) {
  if (!(fish == null ? void 0 : fish.phenotype) || !(poster == null ? void 0 : poster.traits)) return false;
  for (const [trait, value] of Object.entries(poster.traits)) {
    if (fish.phenotype[trait] !== value) return false;
  }
  return fish.stage === "adult";
}
const ORDER_TEMPLATES = [
  { trait: "rarity", values: ["rare", "epic"], emoji: "", prefix: "Collector wants a" },
  { trait: "pattern", values: ["Spotted", "Tiger", "Marble", "Lined"], emoji: "", prefix: "Designer seeks a" },
  { trait: "bodyShape", values: ["Orb", "Delta", "Slender", "Eel"], emoji: "", prefix: "Breeder needs a" },
  { trait: "finType", values: ["Veil", "Flowing"], emoji: "", prefix: "Enthusiast desires a" },
  { trait: "glow", values: ["Luminous"], emoji: "", prefix: "Night aquarium wants a" },
  { trait: "size", values: ["Giant", "Leviathan"], emoji: "", prefix: "Aquarium park needs a" }
];
const CUSTOMER_NAMES = [
  "Dr. Marina Wells",
  "Captain Reef",
  "Professor Gill",
  "Lady Coralline",
  "Baroness Tidepool",
  "Mr. Saltwater",
  "Chef Bubbles",
  "Inspector Fin"
];
function generateOrders(seed) {
  const rng = mulberry32$1(seed);
  const orders = [];
  const usedTemplates = /* @__PURE__ */ new Set();
  for (let i = 0; i < 3; i++) {
    let tIdx;
    do {
      tIdx = Math.floor(rng() * ORDER_TEMPLATES.length);
    } while (usedTemplates.has(tIdx) && usedTemplates.size < ORDER_TEMPLATES.length);
    usedTemplates.add(tIdx);
    const tmpl = ORDER_TEMPLATES[tIdx];
    const val = tmpl.values[Math.floor(rng() * tmpl.values.length)];
    const reward = tmpl.trait === "rarity" ? val === "epic" ? 800 : 400 : 200 + Math.floor(rng() * 300);
    const customer = CUSTOMER_NAMES[Math.floor(rng() * CUSTOMER_NAMES.length)];
    orders.push({
      id: `order_${seed}_${i}`,
      emoji: tmpl.emoji,
      customer,
      desc: `${tmpl.prefix} ${val.toLowerCase()} fish`,
      trait: tmpl.trait,
      value: val,
      reward: Math.round(reward),
      xpReward: 25,
      expiresAt: null,
      // refreshes daily
      fulfilled: false
    });
  }
  return orders;
}
function checkOrderFulfillment(fish, order) {
  if (!fish || !order || order.fulfilled) return false;
  const phenotype = fish.phenotype || {};
  const species = fish.species || {};
  switch (order.trait) {
    case "rarity":
      return species.rarity === order.value;
    case "pattern":
      return phenotype.pattern === order.value;
    case "bodyShape":
      return phenotype.bodyShape === order.value;
    case "finType":
      return phenotype.finType === order.value;
    case "glow":
      return phenotype.glow === order.value;
    case "size":
      return phenotype.size === order.value;
    default:
      return false;
  }
}
function mulberry32$1(a) {
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function getDailyOrderSeed() {
  const d = /* @__PURE__ */ new Date();
  return d.getFullYear() * 1e4 + (d.getMonth() + 1) * 100 + d.getDate();
}
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    React.useCallback(() => selector(api.getState()), [api, selector]),
    React.useCallback(() => selector(api.getInitialState()), [api, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const subscribeWithSelectorImpl = (fn) => (set2, get2, api) => {
  const origSubscribe = api.subscribe;
  api.subscribe = (selector, optListener, options) => {
    let listener = selector;
    if (optListener) {
      const equalityFn = (options == null ? void 0 : options.equalityFn) || Object.is;
      let currentSlice = selector(api.getState());
      listener = (state) => {
        const nextSlice = selector(state);
        if (!equalityFn(currentSlice, nextSlice)) {
          const previousSlice = currentSlice;
          optListener(currentSlice = nextSlice, previousSlice);
        }
      };
      if (options == null ? void 0 : options.fireImmediately) {
        optListener(currentSlice, currentSlice);
      }
    }
    return origSubscribe(listener);
  };
  const initialState = fn(set2, get2, api);
  return initialState;
};
const subscribeWithSelector = subscribeWithSelectorImpl;
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
function die(error, ...args) {
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}
var O = Object;
var getPrototypeOf = O.getPrototypeOf;
var CONSTRUCTOR = "constructor";
var PROTOTYPE = "prototype";
var CONFIGURABLE = "configurable";
var ENUMERABLE = "enumerable";
var WRITABLE = "writable";
var VALUE = "value";
var isDraft = (value) => !!value && !!value[DRAFT_STATE];
function isDraftable(value) {
  var _a;
  if (!value)
    return false;
  return isPlainObject(value) || isArray(value) || !!value[DRAFTABLE] || !!((_a = value[CONSTRUCTOR]) == null ? void 0 : _a[DRAFTABLE]) || isMap(value) || isSet(value);
}
var objectCtorString = O[PROTOTYPE][CONSTRUCTOR].toString();
var cachedCtorStrings = /* @__PURE__ */ new WeakMap();
function isPlainObject(value) {
  if (!value || !isObjectish(value))
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null || proto === O[PROTOTYPE])
    return true;
  const Ctor = O.hasOwnProperty.call(proto, CONSTRUCTOR) && proto[CONSTRUCTOR];
  if (Ctor === Object)
    return true;
  if (!isFunction(Ctor))
    return false;
  let ctorString = cachedCtorStrings.get(Ctor);
  if (ctorString === void 0) {
    ctorString = Function.toString.call(Ctor);
    cachedCtorStrings.set(Ctor, ctorString);
  }
  return ctorString === objectCtorString;
}
function each(obj, iter, strict = true) {
  if (getArchtype(obj) === 0) {
    const keys = strict ? Reflect.ownKeys(obj) : O.keys(obj);
    keys.forEach((key) => {
      iter(key, obj[key], obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : isArray(thing) ? 1 : isMap(thing) ? 2 : isSet(thing) ? 3 : 0;
}
var has = (thing, prop, type = getArchtype(thing)) => type === 2 ? thing.has(prop) : O[PROTOTYPE].hasOwnProperty.call(thing, prop);
var get = (thing, prop, type = getArchtype(thing)) => (
  // @ts-ignore
  type === 2 ? thing.get(prop) : thing[prop]
);
var set = (thing, propOrOldValue, value, type = getArchtype(thing)) => {
  if (type === 2)
    thing.set(propOrOldValue, value);
  else if (type === 3) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
};
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
var isArray = Array.isArray;
var isMap = (target) => target instanceof Map;
var isSet = (target) => target instanceof Set;
var isObjectish = (target) => typeof target === "object";
var isFunction = (target) => typeof target === "function";
var isBoolean = (target) => typeof target === "boolean";
function isArrayIndex(value) {
  const n = +value;
  return Number.isInteger(n) && String(n) === value;
}
var latest = (state) => state.copy_ || state.base_;
var getFinalValue = (state) => state.modified_ ? state.copy_ : state.base_;
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (isArray(base))
    return Array[PROTOTYPE].slice.call(base);
  const isPlain = isPlainObject(base);
  if (strict === true || strict === "class_only" && !isPlain) {
    const descriptors = O.getOwnPropertyDescriptors(base);
    delete descriptors[DRAFT_STATE];
    let keys = Reflect.ownKeys(descriptors);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const desc = descriptors[key];
      if (desc[WRITABLE] === false) {
        desc[WRITABLE] = true;
        desc[CONFIGURABLE] = true;
      }
      if (desc.get || desc.set)
        descriptors[key] = {
          [CONFIGURABLE]: true,
          [WRITABLE]: true,
          // could live with !!desc.set as well here...
          [ENUMERABLE]: desc[ENUMERABLE],
          [VALUE]: base[key]
        };
    }
    return O.create(getPrototypeOf(base), descriptors);
  } else {
    const proto = getPrototypeOf(base);
    if (proto !== null && isPlain) {
      return { ...base };
    }
    const obj = O.create(proto);
    return O.assign(obj, base);
  }
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    O.defineProperties(obj, {
      set: dontMutateMethodOverride,
      add: dontMutateMethodOverride,
      clear: dontMutateMethodOverride,
      delete: dontMutateMethodOverride
    });
  }
  O.freeze(obj);
  if (deep)
    each(
      obj,
      (_key, value) => {
        freeze(value, true);
      },
      false
    );
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
var dontMutateMethodOverride = {
  [VALUE]: dontMutateFrozenCollections
};
function isFrozen(obj) {
  if (obj === null || !isObjectish(obj))
    return true;
  return O.isFrozen(obj);
}
var PluginMapSet = "MapSet";
var PluginPatches = "Patches";
var PluginArrayMethods = "ArrayMethods";
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}
var isPluginLoaded = (pluginKey) => !!plugins[pluginKey];
var currentScope;
var getCurrentScope = () => currentScope;
var createScope = (parent_, immer_) => ({
  drafts_: [],
  parent_,
  immer_,
  // Whenever the modified draft contains a draft from another scope, we
  // need to prevent auto-freezing so the unowned draft can be finalized.
  canAutoFreeze_: true,
  unfinalizedDrafts_: 0,
  handledSet_: /* @__PURE__ */ new Set(),
  processedForPatches_: /* @__PURE__ */ new Set(),
  mapSetPlugin_: isPluginLoaded(PluginMapSet) ? getPlugin(PluginMapSet) : void 0,
  arrayMethodsPlugin_: isPluginLoaded(PluginArrayMethods) ? getPlugin(PluginArrayMethods) : void 0
});
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    scope.patchPlugin_ = getPlugin(PluginPatches);
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
var enterScope = (immer2) => currentScope = createScope(currentScope, immer2);
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 || state.type_ === 1)
    state.revoke_();
  else
    state.revoked_ = true;
}
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
    }
    const { patchPlugin_ } = scope;
    if (patchPlugin_) {
      patchPlugin_.generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope
      );
    }
  } else {
    result = finalize(scope, baseDraft);
  }
  maybeFreeze(scope, result, true);
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    const finalValue = handleValue(value, rootScope.handledSet_, rootScope);
    return finalValue;
  }
  if (!isSameScope(state, rootScope)) {
    return value;
  }
  if (!state.modified_) {
    return state.base_;
  }
  if (!state.finalized_) {
    const { callbacks_ } = state;
    if (callbacks_) {
      while (callbacks_.length > 0) {
        const callback = callbacks_.pop();
        callback(rootScope);
      }
    }
    generatePatchesAndFinalize(state, rootScope);
  }
  return state.copy_;
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}
function markStateFinalized(state) {
  state.finalized_ = true;
  state.scope_.unfinalizedDrafts_--;
}
var isSameScope = (state, rootScope) => state.scope_ === rootScope;
var EMPTY_LOCATIONS_RESULT = [];
function updateDraftInParent(parent, draftValue, finalizedValue, originalKey) {
  const parentCopy = latest(parent);
  const parentType = parent.type_;
  if (originalKey !== void 0) {
    const currentValue = get(parentCopy, originalKey, parentType);
    if (currentValue === draftValue) {
      set(parentCopy, originalKey, finalizedValue, parentType);
      return;
    }
  }
  if (!parent.draftLocations_) {
    const draftLocations = parent.draftLocations_ = /* @__PURE__ */ new Map();
    each(parentCopy, (key, value) => {
      if (isDraft(value)) {
        const keys = draftLocations.get(value) || [];
        keys.push(key);
        draftLocations.set(value, keys);
      }
    });
  }
  const locations = parent.draftLocations_.get(draftValue) ?? EMPTY_LOCATIONS_RESULT;
  for (const location of locations) {
    set(parentCopy, location, finalizedValue, parentType);
  }
}
function registerChildFinalizationCallback(parent, child, key) {
  parent.callbacks_.push(function childCleanup(rootScope) {
    var _a;
    const state = child;
    if (!state || !isSameScope(state, rootScope)) {
      return;
    }
    (_a = rootScope.mapSetPlugin_) == null ? void 0 : _a.fixSetContents(state);
    const finalizedValue = getFinalValue(state);
    updateDraftInParent(parent, state.draft_ ?? state, finalizedValue, key);
    generatePatchesAndFinalize(state, rootScope);
  });
}
function generatePatchesAndFinalize(state, rootScope) {
  var _a;
  const shouldFinalize = state.modified_ && !state.finalized_ && (state.type_ === 3 || state.type_ === 1 && state.allIndicesReassigned_ || (((_a = state.assigned_) == null ? void 0 : _a.size) ?? 0) > 0);
  if (shouldFinalize) {
    const { patchPlugin_ } = rootScope;
    if (patchPlugin_) {
      const basePath = patchPlugin_.getPath(state);
      if (basePath) {
        patchPlugin_.generatePatches_(state, basePath, rootScope);
      }
    }
    markStateFinalized(state);
  }
}
function handleCrossReference(target, key, value) {
  const { scope_ } = target;
  if (isDraft(value)) {
    const state = value[DRAFT_STATE];
    if (isSameScope(state, scope_)) {
      state.callbacks_.push(function crossReferenceCleanup() {
        prepareCopy(target);
        const finalizedValue = getFinalValue(state);
        updateDraftInParent(target, value, finalizedValue, key);
      });
    }
  } else if (isDraftable(value)) {
    target.callbacks_.push(function nestedDraftCleanup() {
      const targetCopy = latest(target);
      if (target.type_ === 3) {
        if (targetCopy.has(value)) {
          handleValue(value, scope_.handledSet_, scope_);
        }
      } else {
        if (get(targetCopy, key, target.type_) === value) {
          if (scope_.drafts_.length > 1 && (target.assigned_.get(key) ?? false) === true && target.copy_) {
            handleValue(
              get(target.copy_, key, target.type_),
              scope_.handledSet_,
              scope_
            );
          }
        }
      }
    });
  }
}
function handleValue(target, handledSet, rootScope) {
  if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
    return target;
  }
  if (isDraft(target) || handledSet.has(target) || !isDraftable(target) || isFrozen(target)) {
    return target;
  }
  handledSet.add(target);
  each(target, (key, value) => {
    if (isDraft(value)) {
      const state = value[DRAFT_STATE];
      if (isSameScope(state, rootScope)) {
        const updatedValue = getFinalValue(state);
        set(target, key, updatedValue, target.type_);
        markStateFinalized(state);
      }
    } else if (isDraftable(value)) {
      handleValue(value, handledSet, rootScope);
    }
  });
  return target;
}
function createProxyProxy(base, parent) {
  const baseIsArray = isArray(base);
  const state = {
    type_: baseIsArray ? 1 : 0,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    // actually instantiated in `prepareCopy()`
    assigned_: void 0,
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false,
    // `callbacks` actually gets assigned in `createProxy`
    callbacks_: void 0
  };
  let target = state;
  let traps = objectTraps;
  if (baseIsArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return [proxy, state];
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    let arrayPlugin = state.scope_.arrayMethodsPlugin_;
    const isArrayWithStringProp = state.type_ === 1 && typeof prop === "string";
    if (isArrayWithStringProp) {
      if (arrayPlugin == null ? void 0 : arrayPlugin.isArrayOperationMethod(prop)) {
        return arrayPlugin.createMethodInterceptor(state, prop);
      }
    }
    const source = latest(state);
    if (!has(source, prop, state.type_)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (isArrayWithStringProp && state.operationMethod && (arrayPlugin == null ? void 0 : arrayPlugin.isMutatingArrayMethod(
      state.operationMethod
    )) && isArrayIndex(prop)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      const childKey = state.type_ === 1 ? +prop : prop;
      const childDraft = createProxy(state.scope_, value, state, childKey);
      return state.copy_[childKey] = childDraft;
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc == null ? void 0 : desc.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2 == null ? void 0 : current2[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_.set(prop, false);
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop, state.type_)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_.set(prop, true);
    handleCrossReference(state, prop, value);
    return true;
  },
  deleteProperty(state, prop) {
    prepareCopy(state);
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_.set(prop, false);
      markChanged(state);
    } else {
      state.assigned_.delete(prop);
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      [WRITABLE]: true,
      [CONFIGURABLE]: state.type_ !== 1 || prop !== "length",
      [ENUMERABLE]: desc[ENUMERABLE],
      [VALUE]: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
for (let key in objectTraps) {
  let fn = objectTraps[key];
  arrayTraps[key] = function() {
    const args = arguments;
    args[0] = args[0][0];
    return fn.apply(this, args);
  };
}
arrayTraps.deleteProperty = function(state, prop) {
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  var _a;
  const desc = getDescriptorFromProto(source, prop);
  return desc ? VALUE in desc ? desc[VALUE] : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    (_a = desc.get) == null ? void 0 : _a.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.assigned_ = /* @__PURE__ */ new Map();
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    this.useStrictIteration_ = false;
    this.produce = (base, recipe, patchListener) => {
      if (isFunction(base) && !isFunction(recipe)) {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (!isFunction(recipe))
        die(6);
      if (patchListener !== void 0 && !isFunction(patchListener))
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(scope, base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || !isObjectish(base)) {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin(PluginPatches).generateReplacementPatches_(base, result, {
            patches_: p,
            inversePatches_: ip
          });
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (isFunction(base)) {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (isBoolean(config == null ? void 0 : config.autoFreeze))
      this.setAutoFreeze(config.autoFreeze);
    if (isBoolean(config == null ? void 0 : config.useStrictShallowCopy))
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    if (isBoolean(config == null ? void 0 : config.useStrictIteration))
      this.setUseStrictIteration(config.useStrictIteration);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(scope, base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  /**
   * Pass false to use faster iteration that skips non-enumerable properties
   * but still handles symbols for compatibility.
   *
   * By default, strict iteration is enabled (includes all own properties).
   */
  setUseStrictIteration(value) {
    this.useStrictIteration_ = value;
  }
  shouldUseStrictIteration() {
    return this.useStrictIteration_;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin(PluginPatches).applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(rootScope, value, parent, key) {
  const [draft, state] = isMap(value) ? getPlugin(PluginMapSet).proxyMap_(value, parent) : isSet(value) ? getPlugin(PluginMapSet).proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = (parent == null ? void 0 : parent.scope_) ?? getCurrentScope();
  scope.drafts_.push(draft);
  state.callbacks_ = (parent == null ? void 0 : parent.callbacks_) ?? [];
  state.key_ = key;
  if (parent && key !== void 0) {
    registerChildFinalizationCallback(parent, state, key);
  } else {
    state.callbacks_.push(function rootDraftCleanup(rootScope2) {
      var _a;
      (_a = rootScope2.mapSetPlugin_) == null ? void 0 : _a.fixSetContents(state);
      const { patchPlugin_ } = rootScope2;
      if (state.modified_ && patchPlugin_) {
        patchPlugin_.generatePatches_(state, [], rootScope2);
      }
    });
  }
  return draft;
}
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  let strict = true;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    strict = state.scope_.immer_.shouldUseStrictIteration();
  } else {
    copy = shallowCopy(value, true);
  }
  each(
    copy,
    (key, childValue) => {
      set(copy, key, currentImpl(childValue));
    },
    strict
  );
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}
var immer$1 = new Immer2();
var produce = immer$1.produce;
const immerImpl = (initializer) => (set2, get2, store) => {
  store.setState = (updater, replace, ...args) => {
    const nextState = typeof updater === "function" ? produce(updater) : updater;
    return set2(nextState, replace, ...args);
  };
  return initializer(store.setState, get2, store);
};
const immer = immerImpl;
const EVENT_INTERVAL_MIN = 180;
const EVENT_INTERVAL_MAX = 420;
const RANDOM_EVENTS = [
  {
    id: "celebrity_visit",
    name: "Celebrity Visit!",
    desc: "A famous aquarium influencer is touring your shop! Tips doubled for 2 minutes.",
    emoji: "",
    weight: 10,
    minRep: 5,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, passiveIncome: _now + 12e4 }
      }
    }),
    message: "Celebrity visit! Passive income doubled for 2 minutes!"
  },
  {
    id: "storm_egg",
    name: "Storm Surge!",
    desc: "A storm churns the ocean! Water quality drops, but something washed into your tank...",
    emoji: "",
    weight: 8,
    minRep: 0,
    effect: (state) => {
      var _a;
      const tanks = state.tanks.map((t) => ({
        ...t,
        waterQuality: Math.max(20, t.waterQuality - 25)
      }));
      const tankId = ((_a = state.tanks[0]) == null ? void 0 : _a.id) || "tank_0";
      const egg = createFish({ stage: "egg", tankId, genome: randomGenome(), targetRarity: "rare" });
      return { ...state, tanks, fish: [...state.fish, egg] };
    },
    message: "Storm! Water quality dropped, but a mystery egg washed in!"
  },
  {
    id: "gold_rush",
    name: "Gold Rush!",
    desc: "A collector is desperate for fish! Sale prices boosted 50% for 2 minutes.",
    emoji: "",
    weight: 8,
    minRep: 10,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, salePrice: _now + 12e4 }
      }
    }),
    message: "Gold Rush! A collector is buying — sale prices +50% for 2 minutes!"
  },
  {
    id: "disease_outbreak",
    name: "Disease Outbreak!",
    desc: "A mysterious illness is spreading through your tanks! Quick, use medicine!",
    emoji: "",
    weight: 6,
    minRep: 0,
    effect: (state) => {
      const diseases = ["Ich", "Fin Rot", "Velvet"];
      const disease = diseases[Math.floor(Math.random() * diseases.length)];
      const adults = state.fish.filter((f) => f.stage === "adult" && !f.disease);
      if (adults.length === 0) return state;
      const infectCount = Math.min(adults.length, 1 + Math.floor(Math.random() * 3));
      const shuffled = [...adults].sort(() => Math.random() - 0.5);
      const infected = new Set(shuffled.slice(0, infectCount).map((f) => f.id));
      return {
        ...state,
        fish: state.fish.map(
          (f) => infected.has(f.id) ? { ...f, disease, diseaseSince: _now } : f
        )
      };
    },
    message: "Disease outbreak! Check your fish and use medicine quickly!"
  },
  {
    id: "lucky_current",
    name: "Lucky Current!",
    desc: "A warm current brings exotic plankton. Next breeding has 3× mutation chance!",
    emoji: "",
    weight: 7,
    minRep: 0,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, mutationBoost: _now + 3e5 }
      }
    }),
    message: "Lucky Current! Mutation chance tripled for the next 5 minutes!"
  },
  {
    id: "fish_competition",
    name: "Fish Competition!",
    desc: "The Regional Aquarium Awards are judging your tanks! High happiness = big prize!",
    emoji: "",
    weight: 6,
    minRep: 15,
    effect: (state) => {
      const bestHappiness = Math.max(...state.tanks.map((t) => t.happiness || 0));
      const prize = Math.round(bestHappiness * 5 + Math.random() * 200);
      return {
        ...state,
        player: {
          ...state.player,
          coins: state.player.coins + prize,
          totalCoinsEarned: (state.player.totalCoinsEarned || 0) + prize
        }
      };
    },
    message: (state) => {
      const bestHappiness = Math.max(...state.tanks.map((t) => t.happiness || 0));
      const prize = Math.round(bestHappiness * 5 + 100);
      return `🏆 Fish Competition! Your tanks scored ${bestHappiness}% — you win ~🪙${prize}!`;
    }
  },
  {
    id: "power_surge",
    name: "Power Surge!",
    desc: "An electrical surge hit your building! Temperature fluctuating wildly!",
    emoji: "",
    weight: 5,
    minRep: 0,
    effect: (state) => ({
      ...state,
      tanks: state.tanks.map((t) => ({
        ...t,
        temperature: (t.temperature || 74) + (Math.random() > 0.5 ? 8 : -8)
      }))
    }),
    message: "Power surge! Tank temperatures swinging — use heaters to stabilize!"
  },
  {
    id: "speed_grow",
    name: "Growth Spurt!",
    desc: "Something in the water is making your fish grow faster! Eggs and juveniles develop 2× speed for 3 minutes.",
    emoji: "",
    weight: 7,
    minRep: 0,
    effect: (state) => ({
      ...state,
      player: {
        ...state.player,
        boosts: { ...state.player.boosts, growSpeed: _now + 18e4 }
      }
    }),
    message: "Growth Spurt! Eggs and juveniles grow 2× faster for 3 minutes!"
  },
  {
    id: "generous_donor",
    name: "Generous Donor!",
    desc: "An anonymous benefactor donated supplies to your aquarium!",
    emoji: "",
    weight: 6,
    minRep: 0,
    effect: (state) => ({
      ...state,
      tanks: state.tanks.map((t) => {
        var _a, _b, _c;
        return {
          ...t,
          supplies: {
            ...t.supplies,
            food: (((_a = t.supplies) == null ? void 0 : _a.food) || 0) + 20,
            waterTreatment: (((_b = t.supplies) == null ? void 0 : _b.waterTreatment) || 0) + 5,
            antibiotic: (((_c = t.supplies) == null ? void 0 : _c.antibiotic) || 0) + 3
          }
        };
      })
    }),
    message: "Generous Donor! Free supplies delivered to all tanks!"
  },
  {
    id: "rare_sighting",
    name: "Rare Sighting!",
    desc: "Word has spread about your rare fish! Reputation boost!",
    emoji: "",
    weight: 5,
    minRep: 20,
    effect: (state) => ({
      ...state,
      shop: {
        ...state.shop,
        reputation: Math.min(999, (state.shop.reputation || 0) + 15)
      }
    }),
    message: "Rare Sighting! Your aquarium is trending — +15 reputation!"
  },
  {
    id: "health_inspection",
    name: "Health Inspection!",
    desc: "Inspectors are checking your tanks. If any water quality is below 50, you get fined!",
    emoji: "",
    weight: 8,
    minRep: 10,
    effect: (state) => {
      const lowTanks = state.tanks.filter((t) => t.waterQuality < 50);
      if (lowTanks.length > 0) {
        const fine = lowTanks.length * 50;
        return { ...state, player: { ...state.player, coins: Math.max(0, state.player.coins - fine) } };
      }
      return { ...state, shop: { ...state.shop, reputation: (state.shop.reputation || 0) + 5 } };
    },
    message: (state) => {
      const lowTanks = state.tanks.filter((t) => t.waterQuality < 50);
      return lowTanks.length > 0 ? `Health inspection failed! Fined ${lowTanks.length * 50} coins for dirty tanks.` : "Health inspection passed! +5 reputation.";
    }
  },
  {
    id: "supply_delivery",
    name: "Supply Delivery!",
    desc: "A generous supplier dropped off free supplies.",
    emoji: "",
    weight: 8,
    minRep: 0,
    effect: (state) => {
      const tanks = state.tanks.map((t) => {
        var _a, _b;
        return {
          ...t,
          supplies: { ...t.supplies, food: (((_a = t.supplies) == null ? void 0 : _a.food) || 0) + 5, medicine: (((_b = t.supplies) == null ? void 0 : _b.medicine) || 0) + 2 }
        };
      });
      return { ...state, tanks };
    },
    message: "Free supply delivery! +5 food and +2 medicine per tank."
  },
  {
    id: "collector_rush",
    name: "Collector Rush!",
    desc: "Word spread about your rare fish. Customers arrive twice as fast for 3 minutes!",
    emoji: "",
    weight: 6,
    minRep: 15,
    effect: (state) => {
      const _now2 = state.gameClock || Date.now();
      return { ...state, player: { ...state.player, boosts: { ...state.player.boosts, customerRush: _now2 + 18e4 } } };
    },
    message: "Collector rush! Double customer speed for 3 minutes!"
  },
  {
    id: "algae_bloom",
    name: "Algae Bloom!",
    desc: "An algae bloom hits your tanks. Water quality drops significantly.",
    emoji: "",
    weight: 7,
    minRep: 0,
    effect: (state) => {
      const tanks = state.tanks.map((t) => ({
        ...t,
        waterQuality: Math.max(15, t.waterQuality - 25)
      }));
      return { ...state, tanks };
    },
    message: "Algae bloom! Water quality dropped -25 in all tanks. Treat your water!"
  },
  {
    id: "breeding_season",
    name: "Breeding Season!",
    desc: "Spring currents enhance genetics. Breeding speed doubled for 5 minutes!",
    emoji: "",
    weight: 5,
    minRep: 5,
    effect: (state) => {
      const _now2 = state.gameClock || Date.now();
      return { ...state, player: { ...state.player, boosts: { ...state.player.boosts, breedSpeed: _now2 + 3e5 } } };
    },
    message: "Breeding season! Breeding speed doubled for 5 minutes!"
  },
  {
    id: "tourist_bus",
    name: "Tourist Bus!",
    desc: "A tour bus stopped at your aquarium. Massive tip incoming!",
    emoji: "",
    weight: 6,
    minRep: 8,
    effect: (state) => {
      var _a;
      const bonus = 50 + Math.floor((((_a = state.shop) == null ? void 0 : _a.reputation) || 0) * 2);
      return {
        ...state,
        player: { ...state.player, coins: state.player.coins + bonus, totalCoinsEarned: (state.player.totalCoinsEarned || 0) + bonus }
      };
    },
    message: (state) => {
      var _a;
      return `Tourist bus arrived! +${50 + Math.floor((((_a = state.shop) == null ? void 0 : _a.reputation) || 0) * 2)} coins in tips!`;
    }
  }
];
function processRandomEvent(state, messages) {
  var _a;
  const _now2 = state.gameClock || Date.now();
  const now2 = _now2;
  const lastEvent = state.lastRandomEvent || 0;
  const elapsed = (now2 - lastEvent) / 1e3;
  if (elapsed < EVENT_INTERVAL_MIN) return state;
  const overtime = elapsed - EVENT_INTERVAL_MIN;
  const maxOvertime = EVENT_INTERVAL_MAX - EVENT_INTERVAL_MIN;
  const chance = Math.min(0.8, overtime / maxOvertime * 0.02);
  if (Math.random() > chance) return state;
  const rep = ((_a = state.shop) == null ? void 0 : _a.reputation) || 0;
  const eligible = RANDOM_EVENTS.filter((e) => rep >= (e.minRep || 0));
  if (eligible.length === 0) return state;
  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = eligible[0];
  for (const e of eligible) {
    roll -= e.weight;
    if (roll <= 0) {
      picked = e;
      break;
    }
  }
  let next = picked.effect(state);
  next = { ...next, lastRandomEvent: now2, lastRandomEventId: picked.id };
  const msg = typeof picked.message === "function" ? picked.message(state) : picked.message;
  messages.push(msg);
  next = {
    ...next,
    activeEvent: {
      id: picked.id,
      name: picked.name,
      desc: picked.desc,
      emoji: picked.emoji,
      triggeredAt: now2
    }
  };
  return next;
}
const WEATHER_TYPES = [
  { id: "sunny", label: "Sunny", weight: 30, happinessBonus: 5, waterDecayMult: 1, customerSpeedMult: 0.9, visualOverlay: "rgba(255,220,140,0.06)" },
  { id: "cloudy", label: "Cloudy", weight: 25, happinessBonus: 0, waterDecayMult: 1, customerSpeedMult: 1, visualOverlay: "rgba(150,160,180,0.08)" },
  { id: "rainy", label: "Rainy", weight: 20, happinessBonus: -3, waterDecayMult: 0.8, customerSpeedMult: 1.2, visualOverlay: "rgba(100,120,160,0.12)" },
  { id: "stormy", label: "Stormy", weight: 8, happinessBonus: -8, waterDecayMult: 1.3, customerSpeedMult: 1.5, visualOverlay: "rgba(40,50,80,0.18)", fishScare: true },
  { id: "foggy", label: "Foggy", weight: 10, happinessBonus: -2, waterDecayMult: 1, customerSpeedMult: 1.3, visualOverlay: "rgba(180,190,200,0.15)" },
  { id: "heatwave", label: "Heat Wave", weight: 5, happinessBonus: -5, waterDecayMult: 1.5, customerSpeedMult: 0.8, visualOverlay: "rgba(255,100,40,0.08)", tempDrift: 0.01 },
  { id: "aurora", label: "Aurora", weight: 2, happinessBonus: 10, waterDecayMult: 0.7, customerSpeedMult: 0.7, visualOverlay: "rgba(100,200,160,0.08)", rare: true }
];
function getCurrentWeather(seed) {
  const rng = mulberry32(seed);
  const total = WEATHER_TYPES.reduce((s, w) => s + w.weight, 0);
  let roll = rng() * total;
  for (const w of WEATHER_TYPES) {
    roll -= w.weight;
    if (roll <= 0) return w;
  }
  return WEATHER_TYPES[0];
}
function getWeatherSeed() {
  const d = /* @__PURE__ */ new Date();
  return d.getFullYear() * 1e5 + (d.getMonth() + 1) * 1e3 + d.getDate() * 10 + Math.floor(d.getHours() / 3);
}
function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const REVIEW_HEADLINES = {
  1: ["Avoid at All Costs", "A Fishy Disaster", "Sad Tanks, Sadder Fish"],
  2: ["Room for Improvement", "Mediocre at Best", "Needs Work"],
  3: ["A Decent Spot", "Worth a Quick Visit", "Average Aquarium"],
  4: ["Hidden Gem!", "Impressive Collection", "A Must-Visit"],
  5: ["World-Class Aquarium!", "Absolute Perfection", "The Best in Town"]
};
const CRITIC_NAMES = [
  "The Daily Reef",
  "Ocean Times",
  "AquaCritic",
  "FishWeekly",
  "Marine Gazette",
  "Coral Radio"
];
function generateReview(state) {
  const tanks = state.tanks || [];
  const fish = state.fish || [];
  const shop = state.shop || {};
  let score = 0;
  const uniqueSpecies = new Set(fish.map((f) => {
    var _a;
    return (_a = f.species) == null ? void 0 : _a.name;
  })).size;
  score += Math.min(20, uniqueSpecies * 3);
  const avgWq = tanks.length > 0 ? tanks.reduce((s, t) => s + (t.waterQuality || 0), 0) / tanks.length : 0;
  score += Math.round(avgWq / 5);
  const avgHappy = tanks.length > 0 ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length : 0;
  score += Math.round(avgHappy / 5);
  const decorCount = tanks.reduce((s, t) => {
    var _a, _b;
    return s + (((_b = (_a = t.decorations) == null ? void 0 : _a.placed) == null ? void 0 : _b.length) || 0);
  }, 0);
  score += Math.min(20, tanks.length * 4 + decorCount * 2);
  const rareCount = fish.filter((f) => {
    var _a;
    return ["rare", "epic", "legendary"].includes((_a = f.species) == null ? void 0 : _a.rarity);
  }).length;
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
      rarefish: rareCount
    }
  };
}
function getDiscoveryKey(fish) {
  const p = (fish == null ? void 0 : fish.phenotype) || {};
  const s = (fish == null ? void 0 : fish.species) || {};
  return [
    s.visualType === "species" ? s.key : p.bodyShape,
    p.finType,
    p.pattern,
    p.primaryColor,
    p.glow
  ].join("|");
}
function checkNewDiscovery(fish, existingDiscoveries) {
  var _a, _b;
  const key = getDiscoveryKey(fish);
  if (!key || (existingDiscoveries == null ? void 0 : existingDiscoveries.includes(key))) return null;
  return {
    key,
    fishName: fish.nickname || ((_a = fish.species) == null ? void 0 : _a.name) || "Unknown",
    rarity: ((_b = fish.species) == null ? void 0 : _b.rarity) || "common",
    discoveredAt: Date.now()
  };
}
function getTotalPossibleDiscoveries() {
  return 5 * 5 * 5 * 8 * 3 + 16;
}
const RARITY_ORDER$1 = ["common", "uncommon", "rare", "epic", "legendary"];
function checkNearMiss(fish) {
  if (!(fish == null ? void 0 : fish.species)) return null;
  const rarity = fish.species.rarity || "common";
  const score = fish.species.rarityScore || 0;
  const idx = RARITY_ORDER$1.indexOf(rarity);
  if (idx >= RARITY_ORDER$1.length - 1) return null;
  const nextRarity = RARITY_ORDER$1[idx + 1];
  const thresholds = { common: 0, uncommon: 30, rare: 55, epic: 75, legendary: 90 };
  const nextThreshold = thresholds[nextRarity];
  const gap = nextThreshold - score;
  if (gap > 0 && gap <= 8) {
    return {
      currentRarity: rarity,
      nextRarity,
      gap,
      message: gap <= 3 ? `SO CLOSE! Just ${gap} points from ${nextRarity.toUpperCase()}!` : `Almost ${nextRarity}! Only ${gap} points away.`
    };
  }
  return null;
}
function checkJackpot(totalSales) {
  if (totalSales % 50 === 0 && totalSales > 0) return { multiplier: 10, label: "MEGA JACKPOT!", tier: "mega" };
  if (totalSales % 25 === 0 && totalSales > 0) return { multiplier: 5, label: "JACKPOT!", tier: "jackpot" };
  if (totalSales % 10 === 0 && totalSales > 0) return { multiplier: 2, label: "Lucky Sale!", tier: "lucky" };
  if (Math.random() < 0.03) return { multiplier: 3, label: "Surprise Bonus!", tier: "surprise" };
  return null;
}
const URGENT_OFFERS = [
  {
    id: "vip_collector",
    name: "VIP Collector",
    desc: "Will pay 5× for any Epic+ fish!",
    duration: 6e5,
    // 10 minutes
    multiplier: 5,
    targetRarity: ["epic", "legendary"],
    weight: 3
  },
  {
    id: "bulk_buyer",
    name: "Bulk Buyer",
    desc: "Buying ALL listed fish at 2× price!",
    duration: 3e5,
    // 5 minutes
    multiplier: 2,
    targetRarity: null,
    // any
    weight: 5
  },
  {
    id: "rare_hunter",
    name: "Rare Hunter",
    desc: "Seeking any Rare fish — pays 3× market!",
    duration: 48e4,
    // 8 minutes
    multiplier: 3,
    targetRarity: ["rare"],
    weight: 4
  },
  {
    id: "museum_curator",
    name: "Museum Curator",
    desc: "Wants unique species for exhibit — 4× for any species fish!",
    duration: 42e4,
    // 7 minutes
    multiplier: 4,
    targetRarity: null,
    requiresSpecies: true,
    // must be a real species, not procedural
    weight: 2
  }
];
function rollUrgentOffer() {
  if (Math.random() > 0.02) return null;
  const total = URGENT_OFFERS.reduce((s, o) => s + o.weight, 0);
  let roll = Math.random() * total;
  for (const offer of URGENT_OFFERS) {
    roll -= offer.weight;
    if (roll <= 0) return { ...offer, startedAt: Date.now(), expiresAt: Date.now() + offer.duration };
  }
  return URGENT_OFFERS[0];
}
function isOfferActive(offer) {
  return offer && Date.now() < offer.expiresAt;
}
function getStreakMultiplier(streak) {
  if (streak >= 30) return 1.5;
  if (streak >= 14) return 1.3;
  if (streak >= 7) return 1.15;
  if (streak >= 3) return 1.05;
  return 1;
}
function getStreakLabel(streak) {
  if (streak >= 30) return "Legendary Streak";
  if (streak >= 14) return "Hot Streak";
  if (streak >= 7) return "On Fire";
  if (streak >= 3) return "Building Momentum";
  return "";
}
function xpForLevel(level) {
  if (level <= 0) return 0;
  return Math.round(100 * Math.pow(level, 1.5));
}
function getLevelFromXp(xp) {
  let level = 0;
  let remaining = xp;
  while (remaining >= xpForLevel(level + 1)) {
    level++;
    remaining -= xpForLevel(level);
  }
  return { level, currentXp: remaining, nextLevelXp: xpForLevel(level + 1) };
}
const XP_REWARDS = {
  sellFish: 10,
  sellRareFish: 25,
  sellEpicFish: 50,
  breedEgg: 15,
  cureFish: 12,
  buyUpgrade: 8
};
function getLevelTitle(level) {
  if (level >= 30) return "Legendary Aquarist";
  if (level >= 25) return "Master Aquarist";
  if (level >= 20) return "Expert Aquarist";
  if (level >= 15) return "Senior Aquarist";
  if (level >= 10) return "Aquarist";
  if (level >= 5) return "Junior Aquarist";
  return "Novice";
}
const CAMPAIGN_LEVELS = [
  {
    id: "level_1",
    name: "Your First Tank",
    description: "Learn the basics of fish keeping.",
    briefing: "Welcome to your new aquarium! You've got a single tank, a small budget, and big dreams.\n\nStart by purchasing some fish from the Market, keep them fed and healthy, then list them for sale. Customers will visit automatically — the better your fish, the more they'll pay.",
    unlocked: true,
    startingState: {
      coins: 200,
      fish: [],
      maxBays: 0
    },
    constraints: {
      breedingDisabled: true,
      maxTanks: 1,
      tankCapacity: 8
    },
    objectives: [
      { id: "buy_fish", label: "Buy your first fish", type: "stat", key: "fishBought", target: 1 },
      { id: "feed_fish", label: "Feed a fish", type: "stat", key: "fishFed", target: 1 },
      { id: "list_fish", label: "List a fish for sale", type: "stat", key: "fishListed", target: 1 },
      { id: "sell_5", label: "Sell 5 fish", type: "stat", key: "fishSold", target: 5 },
      { id: "earn_500", label: "Earn 500 coins", type: "player_field", key: "totalCoinsEarned", target: 500 }
    ],
    stars: {
      1: {},
      2: { stat: "totalCoinsEarned", target: 800 },
      3: { stat: "totalCoinsEarned", target: 1200 }
    },
    rewards: { unlocks: ["level_2"], bonusCoins: 100 }
  },
  {
    id: "level_2",
    name: "Breeding Basics",
    description: "Combine traits to discover new species.",
    briefing: "You have two adult fish with different genetics. Go to the Breeding Lab, place them in the parent slots, and wait for eggs.\n\nEach offspring inherits a mix of traits from both parents — breed enough and you'll discover entirely new species. Use speed controls to fast-forward the breeding timer!",
    unlocked: false,
    startingState: {
      coins: 300,
      starterFishCount: 2,
      starterFishStage: "adult",
      maxBays: 1
    },
    constraints: {
      maxTanks: 1,
      tankCapacity: 10
    },
    objectives: [
      { id: "start_breed", label: "Start a breeding pair", type: "stat", key: "breedingsStarted", target: 1 },
      { id: "collect_egg", label: "Collect a breeding egg", type: "stat", key: "eggsCollected", target: 1 },
      { id: "hatch_egg", label: "Hatch an egg", type: "stat", key: "eggsHatched", target: 1 },
      { id: "discover_3", label: "Discover 5 new species", type: "fishdex", target: 5 },
      { id: "own_8", label: "Own 8 fish at once", type: "fishCount", target: 8 }
    ],
    stars: {
      1: {},
      2: { type: "fishdex", target: 7 },
      3: { type: "fishdex", target: 10 }
    },
    rewards: { unlocks: ["level_3"], bonusCoins: 150 }
  },
  {
    id: "level_3",
    name: "The Collector",
    description: "Build a diverse collection through strategic breeding.",
    briefing: "Your aquarium is growing! You now have two tanks and access to more species. Focus on breeding diverse combinations to expand your Fishdex.\n\nThe Wanted Board in the Market has special bounties — fulfill them for bonus coins. You'll need to breed strategically to find rare specimens.",
    unlocked: false,
    startingState: {
      coins: 500,
      starterFishCount: 3,
      starterFishStage: "adult",
      maxBays: 1,
      tankCount: 2
    },
    constraints: {
      maxTanks: 2,
      tankCapacity: 10
    },
    objectives: [
      { id: "discover_15", label: "Discover 15 species", type: "fishdex", target: 15 },
      { id: "rare_fish", label: "Own a Rare+ fish", type: "hasRarity", rarity: ["rare", "epic", "legendary"] },
      { id: "earn_2000", label: "Earn 2000 coins", type: "player_field", key: "totalCoinsEarned", target: 2e3 },
      { id: "level_3", label: "Reach Level 3", type: "playerLevel", target: 3 },
      { id: "wanted", label: "Complete a bounty", type: "stat", key: "wantedFulfilled", target: 1 }
    ],
    stars: {
      1: {},
      2: { type: "fishdex", target: 20 },
      3: { stat: "totalCoinsEarned", target: 4e3 }
    },
    rewards: { unlocks: ["level_4"], bonusCoins: 200 }
  },
  {
    id: "level_4",
    name: "Market Pressure",
    description: "Repay your debt before time runs out.",
    briefing: "You've taken a loan to expand your operation. Sell fish fast to repay 3000 coins before the loan collectors come knocking.\n\nPrice your fish strategically — too high and customers walk away, too low and you won't make enough.",
    unlocked: false,
    startingState: {
      coins: 100,
      starterFishCount: 4,
      starterFishStage: "adult",
      maxBays: 1,
      tankCount: 2
    },
    constraints: {
      maxTanks: 2,
      tankCapacity: 12
    },
    objectives: [
      { id: "earn_3000", label: "Earn 3000 coins", type: "player_field", key: "totalCoinsEarned", target: 3e3 },
      { id: "sell_15", label: "Sell 15 fish", type: "stat", key: "fishSold", target: 15 },
      { id: "no_death", label: "Keep all fish alive", type: "stat_max", key: "fishDied", target: 0 }
    ],
    stars: {
      1: {},
      2: { stat: "totalCoinsEarned", target: 5e3 },
      3: { stat: "fishSold", target: 25 }
    },
    rewards: { unlocks: ["level_5"], bonusCoins: 250 }
  },
  {
    id: "level_5",
    name: "Rare Finds",
    description: "Breed your way to an Epic specimen.",
    briefing: "The collectors want rare fish. You have access to breeding bays and a good gene pool. Cross-breed strategically — check the offspring prediction panel to see which traits combine for higher rarity.\n\nYour goal: breed at least one Epic-rarity fish.",
    unlocked: false,
    startingState: {
      coins: 600,
      starterFishCount: 4,
      starterFishStage: "adult",
      maxBays: 2,
      tankCount: 2
    },
    constraints: {
      maxTanks: 3,
      tankCapacity: 12
    },
    objectives: [
      { id: "epic_fish", label: "Own an Epic fish", type: "hasRarity", rarity: ["epic", "legendary"] },
      { id: "discover_25", label: "Discover 25 species", type: "fishdex", target: 25 },
      { id: "breed_10", label: "Collect 10 eggs", type: "stat", key: "eggsCollected", target: 10 },
      { id: "earn_5000", label: "Earn 5000 coins", type: "player_field", key: "totalCoinsEarned", target: 5e3 }
    ],
    stars: {
      1: {},
      2: { type: "hasRarity", rarity: ["legendary"] },
      3: { type: "fishdex", target: 35 }
    },
    rewards: { unlocks: [], bonusCoins: 500 }
  }
];
function getLevelById(id) {
  return CAMPAIGN_LEVELS.find((l) => l.id === id) || null;
}
function checkObjective(obj, state) {
  var _a, _b, _c, _d, _e, _f, _g;
  switch (obj.type) {
    case "stat":
      return (((_b = (_a = state.player) == null ? void 0 : _a.stats) == null ? void 0 : _b[obj.key]) || 0) >= obj.target;
    case "player_field":
      return (((_c = state.player) == null ? void 0 : _c[obj.key]) || 0) >= obj.target;
    case "stat_max":
      return (((_e = (_d = state.player) == null ? void 0 : _d.stats) == null ? void 0 : _e[obj.key]) || 0) <= obj.target;
    case "fishdex":
      return (((_f = state.player) == null ? void 0 : _f.fishdex) || []).length >= obj.target;
    case "fishCount":
      return (state.fish || []).length >= obj.target;
    case "playerLevel":
      return getLevelFromXp(((_g = state.player) == null ? void 0 : _g.xp) || 0).level >= obj.target;
    case "hasRarity": {
      const rarities = obj.rarity || [];
      return (state.fish || []).some((f) => {
        var _a2;
        return rarities.includes((_a2 = f.species) == null ? void 0 : _a2.rarity);
      });
    }
    default:
      return false;
  }
}
function getObjectiveProgress(obj, state) {
  var _a, _b, _c, _d, _e, _f, _g;
  switch (obj.type) {
    case "stat":
      return { current: ((_b = (_a = state.player) == null ? void 0 : _a.stats) == null ? void 0 : _b[obj.key]) || 0, target: obj.target };
    case "player_field":
      return { current: ((_c = state.player) == null ? void 0 : _c[obj.key]) || 0, target: obj.target };
    case "stat_max":
      return { current: ((_e = (_d = state.player) == null ? void 0 : _d.stats) == null ? void 0 : _e[obj.key]) || 0, target: obj.target };
    case "fishdex":
      return { current: (((_f = state.player) == null ? void 0 : _f.fishdex) || []).length, target: obj.target };
    case "fishCount":
      return { current: (state.fish || []).length, target: obj.target };
    case "playerLevel":
      return { current: getLevelFromXp(((_g = state.player) == null ? void 0 : _g.xp) || 0).level, target: obj.target };
    case "hasRarity": {
      const has2 = (state.fish || []).some((f) => {
        var _a2;
        return (obj.rarity || []).includes((_a2 = f.species) == null ? void 0 : _a2.rarity);
      });
      return { current: has2 ? 1 : 0, target: 1 };
    }
    default:
      return { current: 0, target: 1 };
  }
}
function getStarRating(level, state) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const allDone = level.objectives.every((o) => checkObjective(o, state));
  if (!allDone) return 0;
  let stars = 1;
  if (level.stars[2]) {
    const s2 = level.stars[2];
    if (s2.stat && (((_a = state.player) == null ? void 0 : _a[s2.stat]) || ((_c = (_b = state.player) == null ? void 0 : _b.stats) == null ? void 0 : _c[s2.stat]) || 0) >= s2.target) stars = 2;
    if (s2.type === "fishdex" && (((_d = state.player) == null ? void 0 : _d.fishdex) || []).length >= s2.target) stars = 2;
    if (s2.type === "hasRarity" && (state.fish || []).some((f) => {
      var _a2;
      return (s2.rarity || []).includes((_a2 = f.species) == null ? void 0 : _a2.rarity);
    })) stars = 2;
  }
  if (level.stars[3] && stars >= 2) {
    const s3 = level.stars[3];
    if (s3.stat && (((_e = state.player) == null ? void 0 : _e[s3.stat]) || ((_g = (_f = state.player) == null ? void 0 : _f.stats) == null ? void 0 : _g[s3.stat]) || 0) >= s3.target) stars = 3;
    if (s3.type === "fishdex" && (((_h = state.player) == null ? void 0 : _h.fishdex) || []).length >= s3.target) stars = 3;
    if (s3.type === "hasRarity" && (state.fish || []).some((f) => {
      var _a2;
      return (s3.rarity || []).includes((_a2 = f.species) == null ? void 0 : _a2.rarity);
    })) stars = 3;
  }
  return stars;
}
const SPECIES_COMPAT = {
  // Saltwater — Tropical
  clownfish: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 4 },
  bluetang: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 8 },
  mandarin_dragonet: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  moorish_idol: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 8 },
  lionfish: { water: "salt", temp: "tropical", temperament: "aggressive", minTank: 8 },
  triggerfish: { water: "salt", temp: "tropical", temperament: "aggressive", minTank: 8 },
  seahorse: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  pufferfish: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 6 },
  jellyfish: { water: "salt", temp: "cold", temperament: "peaceful", minTank: 6 },
  nautilus: { water: "salt", temp: "cold", temperament: "peaceful", minTank: 8 },
  cuttlefish: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 8 },
  // Freshwater — Tropical
  betta: { water: "fresh", temp: "tropical", temperament: "aggressive", minTank: 4 },
  angelfish: { water: "fresh", temp: "tropical", temperament: "semi-aggressive", minTank: 6 },
  neon_tetra: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  discus: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 8 },
  guppy: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  oscar: { water: "fresh", temp: "tropical", temperament: "aggressive", minTank: 8 },
  corydoras: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  cherry_shrimp: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4 },
  arowana: { water: "fresh", temp: "tropical", temperament: "aggressive", minTank: 10 },
  hammerhead: { water: "salt", temp: "tropical", temperament: "aggressive", minTank: 12 },
  // Freshwater — Cold
  goldfish: { water: "fresh", temp: "cold", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  koi: { water: "fresh", temp: "cold", temperament: "peaceful", minTank: 8 },
  axolotl: { water: "fresh", temp: "cold", temperament: "peaceful", minTank: 6 },
  // Special
  electric_eel: { water: "fresh", temp: "tropical", temperament: "aggressive", minTank: 10 },
  yellow_tang: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 6 },
  // Procedural species
  rainbow_fish: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 6 },
  pleco: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 6 },
  clown_loach: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 8, schoolSize: 3 },
  flame_tetra: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  powder_blue_tang: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 8 },
  firemouth_cichlid: { water: "fresh", temp: "tropical", temperament: "semi-aggressive", minTank: 6 },
  harlequin_rasbora: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  royal_gramma: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 4 },
  cardinal_tetra: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  dwarf_gourami: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4 },
  banggai_cardinal: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  leopard_wrasse: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  garden_eel: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  flame_angel: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 6 },
  emerald_crab: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 4 },
  regal_tang: { water: "salt", temp: "tropical", temperament: "semi-aggressive", minTank: 8 },
  peacock_mantis: { water: "salt", temp: "tropical", temperament: "aggressive", minTank: 6 },
  blue_chromis: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 4, schoolSize: 3 },
  dragon_goby: { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 6 },
  spotted_boxfish: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  sea_apple: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  wolf_eel: { water: "salt", temp: "cold", temperament: "aggressive", minTank: 10 },
  sunburst_anthias: { water: "salt", temp: "tropical", temperament: "peaceful", minTank: 6 },
  frogfish: { water: "salt", temp: "tropical", temperament: "aggressive", minTank: 6 }
};
const DEFAULT_COMPAT = { water: "fresh", temp: "tropical", temperament: "peaceful", minTank: 4 };
function getCompat(fish) {
  var _a;
  if (((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.key) && SPECIES_COMPAT[fish.species.key]) {
    return SPECIES_COMPAT[fish.species.key];
  }
  return DEFAULT_COMPAT;
}
function checkTankCompat(newFish, existingFish) {
  var _a, _b, _c, _d, _e, _f, _g;
  const issues = [];
  const nc = getCompat(newFish);
  for (const f of existingFish) {
    const fc = getCompat(f);
    if (nc.water !== fc.water) {
      issues.push({
        type: "water",
        severity: "critical",
        message: `${((_a = newFish.species) == null ? void 0 : _a.name) || "This fish"} needs ${nc.water === "salt" ? "saltwater" : "freshwater"} but ${((_b = f.species) == null ? void 0 : _b.name) || "a fish"} needs ${fc.water === "salt" ? "saltwater" : "freshwater"}!`
      });
      break;
    }
    if (nc.temp !== fc.temp) {
      issues.push({
        type: "temp",
        severity: "warning",
        message: `${((_c = newFish.species) == null ? void 0 : _c.name) || "This fish"} prefers ${nc.temp} water but ${((_d = f.species) == null ? void 0 : _d.name) || "a fish"} prefers ${fc.temp}.`
      });
      break;
    }
  }
  if (nc.temperament === "aggressive") {
    const peaceful = existingFish.filter((f) => getCompat(f).temperament === "peaceful");
    if (peaceful.length > 0) {
      issues.push({
        type: "aggression",
        severity: "warning",
        message: `${((_e = newFish.species) == null ? void 0 : _e.name) || "This fish"} is aggressive and may bully peaceful tankmates!`
      });
    }
  }
  if (nc.temperament === "peaceful") {
    const aggressors = existingFish.filter((f) => getCompat(f).temperament === "aggressive");
    if (aggressors.length > 0) {
      issues.push({
        type: "aggression",
        severity: "warning",
        message: `${((_f = aggressors[0].species) == null ? void 0 : _f.name) || "An aggressive fish"} may bully ${((_g = newFish.species) == null ? void 0 : _g.name) || "this fish"}!`
      });
    }
  }
  return issues;
}
function getTankCompatSummary(fishInTank) {
  var _a, _b, _c, _d, _e;
  if (fishInTank.length === 0) return { water: null, temp: null, issues: [] };
  const compats = fishInTank.map(getCompat);
  const waters = [...new Set(compats.map((c) => c.water))];
  const temps = [...new Set(compats.map((c) => c.temp))];
  const issues = [];
  if (waters.length > 1) issues.push("Mixed water types");
  if (temps.length > 1) issues.push("Mixed temperature preferences");
  const hasAggressive = compats.some((c) => c.temperament === "aggressive");
  const hasPeaceful = compats.some((c) => c.temperament === "peaceful");
  if (hasAggressive && hasPeaceful) issues.push("Aggressive + peaceful fish");
  const speciesCounts = /* @__PURE__ */ new Map();
  for (const f of fishInTank) {
    const key = ((_a = f.species) == null ? void 0 : _a.key) || ((_b = f.species) == null ? void 0 : _b.name) || "unknown";
    speciesCounts.set(key, (speciesCounts.get(key) || 0) + 1);
  }
  for (let i = 0; i < fishInTank.length; i++) {
    const c = compats[i];
    if (c.schoolSize) {
      const key = ((_c = fishInTank[i].species) == null ? void 0 : _c.key) || ((_d = fishInTank[i].species) == null ? void 0 : _d.name) || "unknown";
      if ((speciesCounts.get(key) || 0) < c.schoolSize) {
        issues.push(`${((_e = fishInTank[i].species) == null ? void 0 : _e.name) || "A fish"} needs ${c.schoolSize}+ of its kind`);
        break;
      }
    }
  }
  return { water: waters[0], temp: temps[0], issues };
}
const FIRST_NAMES = [
  "Alex",
  "Sam",
  "Jordan",
  "Casey",
  "Morgan",
  "Riley",
  "Avery",
  "Quinn",
  "Charlie",
  "Jamie",
  "Kai",
  "Dakota",
  "Sage",
  "River",
  "Skyler",
  "Rowan",
  "Finley",
  "Harper",
  "Emery",
  "Blair",
  "Reese",
  "Hayden",
  "Eden",
  "Shay"
];
const STAFF_ROLES = {
  feeder: {
    id: "feeder",
    label: "Caretaker",
    desc: "Automatically feeds hungry fish in assigned tank.",
    baseWage: 8,
    // coins per game-day
    wagePerLevel: 4,
    // +4 per skill level
    maxLevel: 5,
    trainCost: [0, 50, 120, 250, 500],
    // cost to reach level 1,2,3,4,5
    effect: {
      // Feeds fish when hunger > threshold. Higher skill = lower threshold + faster
      hungerThreshold: [60, 50, 40, 30, 20],
      // by level (0-indexed)
      feedInterval: [45, 38, 30, 22, 15]
      // ticks between feeds
    }
  },
  cleaner: {
    id: "cleaner",
    label: "Technician",
    desc: "Maintains water quality in assigned tank.",
    baseWage: 10,
    wagePerLevel: 5,
    maxLevel: 5,
    trainCost: [0, 60, 140, 280, 550],
    effect: {
      // Restores WQ when below threshold. Higher skill = better threshold + more restored
      wqThreshold: [60, 65, 70, 75, 80],
      wqRestorePerTick: [3e-3, 5e-3, 8e-3, 0.012, 0.018]
    }
  },
  vet: {
    id: "vet",
    label: "Veterinarian",
    desc: "Diagnoses and treats sick fish in assigned tank.",
    baseWage: 15,
    wagePerLevel: 8,
    maxLevel: 5,
    trainCost: [0, 80, 200, 400, 800],
    effect: {
      // Chance per tick to auto-cure a diagnosed sick fish
      cureChancePerTick: [1e-3, 2e-3, 4e-3, 7e-3, 0.012],
      // Auto-diagnose after N ticks of incubation
      diagnoseTicks: [120, 90, 60, 40, 20]
    }
  }
};
function createStaffMember(role) {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const roleDef = STAFF_ROLES[role];
  if (!roleDef) return null;
  return {
    id: crypto.randomUUID(),
    name,
    role,
    level: 0,
    xp: 0,
    assignedTankId: null,
    hiredAt: Date.now(),
    feedTick: 0
    // internal counter for feeder interval
  };
}
function getStaffWage(staff) {
  const roleDef = STAFF_ROLES[staff.role];
  if (!roleDef) return 0;
  return roleDef.baseWage + roleDef.wagePerLevel * staff.level;
}
function getTotalDailyWages(staffList) {
  return staffList.reduce((sum, s) => sum + getStaffWage(s), 0);
}
function getTrainCost(staff) {
  const roleDef = STAFF_ROLES[staff.role];
  if (!roleDef || staff.level >= roleDef.maxLevel) return Infinity;
  return roleDef.trainCost[staff.level] || 999;
}
function getHireCost(role) {
  const costs = { feeder: 50, cleaner: 75, vet: 150 };
  return costs[role] || 50;
}
function getMaxStaff(playerLevel) {
  if (playerLevel >= 8) return 6;
  if (playerLevel >= 5) return 4;
  if (playerLevel >= 3) return 3;
  return 2;
}
const RESEARCH_BRANCHES = {
  marine_biology: {
    id: "marine_biology",
    label: "Marine Biology",
    emoji: "",
    color: "#40c8f0",
    tiers: [
      { cost: 200, label: "Basic Anatomy", effect: { healthRegen: 1.1 }, desc: "+10% health regen" },
      { cost: 500, label: "Disease Resistance", effect: { diseaseResist: 0.8 }, desc: "-20% disease chance" },
      { cost: 1200, label: "Longevity Research", effect: { lifespanMult: 1.25 }, desc: "+25% fish lifespan" },
      { cost: 3e3, label: "Regenerative Medicine", effect: { cureBonus: 0.15 }, desc: "+15% cure success rate" }
    ]
  },
  genetics: {
    id: "genetics",
    label: "Genetics",
    emoji: "",
    color: "#c878ff",
    tiers: [
      { cost: 300, label: "Gene Mapping", effect: { breedSpeed: 0.9 }, desc: "-10% breeding time" },
      { cost: 800, label: "Selective Breeding", effect: { rarityBoost: 1.1 }, desc: "+10% rare offspring chance" },
      { cost: 2e3, label: "Mutation Control", effect: { mutationRate: 1.3 }, desc: "+30% mutation rate" },
      { cost: 5e3, label: "Designer Genetics", effect: { breedSpeed: 0.7, rarityBoost: 1.25 }, desc: "-30% breed time, +25% rarity" }
    ]
  },
  business: {
    id: "business",
    label: "Business",
    emoji: "",
    color: "#b0944a",
    tiers: [
      { cost: 250, label: "Marketing 101", effect: { customerSpeed: 0.9 }, desc: "-10% time between customers" },
      { cost: 600, label: "Premium Pricing", effect: { saleBonus: 1.1 }, desc: "+10% sale prices" },
      { cost: 1500, label: "Brand Recognition", effect: { repGain: 1.5 }, desc: "+50% reputation gain" },
      { cost: 4e3, label: "Franchise Empire", effect: { passiveIncome: 1.3 }, desc: "+30% passive income" }
    ]
  }
};
function getResearchEffects(state) {
  var _a;
  const r = ((_a = state.player) == null ? void 0 : _a.research) || {};
  const effects = {
    healthRegen: 1,
    diseaseResist: 1,
    lifespanMult: 1,
    cureBonus: 0,
    breedSpeed: 1,
    rarityBoost: 1,
    mutationRate: 1,
    customerSpeed: 1,
    saleBonus: 1,
    repGain: 1,
    passiveIncome: 1
  };
  for (const [branchId, level] of Object.entries(r)) {
    const branch = RESEARCH_BRANCHES[branchId];
    if (!branch) continue;
    for (let i = 0; i < level && i < branch.tiers.length; i++) {
      const tier = branch.tiers[i];
      for (const [key, val] of Object.entries(tier.effect)) {
        if (key === "cureBonus") {
          effects[key] = (effects[key] || 0) + val;
        } else {
          effects[key] = (effects[key] || 1) * val;
        }
      }
    }
  }
  return effects;
}
const EVENTS = [
  {
    id: "winter_wonderland",
    name: "Winter Wonderland",
    startMonth: 12,
    startDay: 15,
    endMonth: 1,
    endDay: 5,
    bonuses: { passiveIncome: 1.5, breedingSpeed: 0.8 },
    specialFish: { name: "Frost Tetra", rarity: "rare", targetRarity: "rare" },
    desc: "Snowflake variants are more common! +50% passive income.",
    challengeBonus: 1.5
  },
  {
    id: "spring_bloom",
    name: "Spring Bloom",
    startMonth: 3,
    startDay: 20,
    endMonth: 4,
    endDay: 20,
    bonuses: { breedingSpeed: 0.6, mutationRate: 1.5 },
    specialFish: { name: "Cherry Blossom Koi", rarity: "rare", targetRarity: "rare" },
    desc: "Breeding is 40% faster! Mutation rates increased.",
    challengeBonus: 1
  },
  {
    id: "summer_splash",
    name: "Summer Splash",
    startMonth: 6,
    startDay: 21,
    endMonth: 8,
    endDay: 31,
    bonuses: { passiveIncome: 1.3, customerSpeed: 1.4 },
    specialFish: { name: "Sunbeam Angelfish", rarity: "epic", targetRarity: "epic" },
    desc: "Customers arrive 40% faster! More visitors = more tips.",
    challengeBonus: 1.2
  },
  {
    id: "halloween",
    name: "Spooky Season",
    startMonth: 10,
    startDay: 20,
    endMonth: 11,
    endDay: 2,
    bonuses: { rarityLuck: 1.5, passiveIncome: 1.2 },
    specialFish: { name: "Ghost Jellyfish", rarity: "epic", targetRarity: "epic" },
    desc: "Rare fish appear more often! Ghostly variants emerge.",
    challengeBonus: 1.3
  },
  {
    id: "lunar_new_year",
    name: "Lunar New Year",
    startMonth: 1,
    startDay: 20,
    endMonth: 2,
    endDay: 10,
    bonuses: { passiveIncome: 2, coinMult: 1.5 },
    specialFish: { name: "Golden Dragon Koi", rarity: "epic", targetRarity: "epic" },
    desc: "Double passive income! Golden fish are worth 50% more.",
    challengeBonus: 2
  }
];
function getActiveEvent() {
  const now2 = /* @__PURE__ */ new Date();
  const month = now2.getMonth() + 1;
  const day = now2.getDate();
  for (const event of EVENTS) {
    const { startMonth, startDay, endMonth, endDay } = event;
    let active = false;
    if (startMonth <= endMonth) {
      active = (month > startMonth || month === startMonth && day >= startDay) && (month < endMonth || month === endMonth && day <= endDay);
    } else {
      active = month > startMonth || month === startMonth && day >= startDay || (month < endMonth || month === endMonth && day <= endDay);
    }
    if (active) return event;
  }
  return null;
}
const EQUIPMENT_TYPES = {
  filter: {
    id: "filter",
    label: "Filter",
    desc: "Slows water quality decay. Each filter reduces WQ loss by 25%.",
    cost: 100,
    maxPerTank: 3,
    effect: { wqDecayMult: 0.75 },
    // multiplicative per unit
    breakdownChance: 3e-4,
    // per tick
    repairCost: 30
  },
  heater: {
    id: "heater",
    label: "Heater",
    desc: "Stabilizes temperature. Prevents temperature drift from weather.",
    cost: 150,
    maxPerTank: 2,
    effect: { tempStabilize: true },
    breakdownChance: 2e-4,
    repairCost: 40
  },
  aerator: {
    id: "aerator",
    label: "Aerator",
    desc: "Improves oxygen. +5% health regen per unit.",
    cost: 120,
    maxPerTank: 2,
    effect: { healthRegenMult: 1.05 },
    breakdownChance: 2e-4,
    repairCost: 35
  },
  uvSterilizer: {
    id: "uvSterilizer",
    label: "UV Sterilizer",
    desc: "Reduces disease chance by 30% per unit.",
    cost: 250,
    maxPerTank: 1,
    effect: { diseaseResist: 0.7 },
    breakdownChance: 4e-4,
    repairCost: 60
  }
};
function getEquipmentEffects(equipment) {
  const effects = { wqDecayMult: 1, healthRegenMult: 1, diseaseResist: 1, tempStabilize: false };
  if (!equipment) return effects;
  for (const eq of equipment) {
    if (eq.broken) continue;
    const type = EQUIPMENT_TYPES[eq.typeId];
    if (!type) continue;
    if (type.effect.wqDecayMult) effects.wqDecayMult *= type.effect.wqDecayMult;
    if (type.effect.healthRegenMult) effects.healthRegenMult *= type.effect.healthRegenMult;
    if (type.effect.diseaseResist) effects.diseaseResist *= type.effect.diseaseResist;
    if (type.effect.tempStabilize) effects.tempStabilize = true;
  }
  return effects;
}
function createEquipment(typeId) {
  return {
    id: crypto.randomUUID(),
    typeId,
    broken: false,
    installedAt: Date.now()
  };
}
function computeVisitorFlow(state) {
  var _a, _b, _c;
  const rep = ((_a = state.shop) == null ? void 0 : _a.reputation) || 0;
  const tanks = state.tanks || [];
  const fish = state.fish || [];
  const baseRate = 2 + Math.floor(rep / 10);
  const gameClock = state.gameClock || Date.now();
  const gameHour = Math.floor(gameClock % 864e5 / 36e5);
  let timeMultiplier = 1;
  if (gameHour >= 10 && gameHour <= 14) timeMultiplier = 1.5;
  else if (gameHour >= 16 && gameHour <= 19) timeMultiplier = 1.3;
  else if (gameHour >= 21 || gameHour <= 6) timeMultiplier = 0.3;
  const avgHappiness = tanks.length > 0 ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length : 50;
  const happinessMultiplier = 0.5 + avgHappiness / 100;
  const uniqueSpecies = new Set(fish.map((f) => {
    var _a2;
    return (_a2 = f.species) == null ? void 0 : _a2.key;
  }).filter(Boolean)).size;
  const diversityBonus = 1 + Math.min(0.5, uniqueSpecies * 0.03);
  const rareCount = fish.filter((f) => {
    var _a2;
    return ["rare", "epic", "legendary"].includes((_a2 = f.species) == null ? void 0 : _a2.rarity);
  }).length;
  const rareBonus = 1 + Math.min(0.3, rareCount * 0.05);
  const amenityBonus = 1 + (((_b = state.giftShop) == null ? void 0 : _b.unlocked) ? 0.15 + (state.giftShop.level || 0) * 0.05 : 0) + (((_c = state.cafe) == null ? void 0 : _c.unlocked) ? 0.1 + (state.cafe.level || 0) * 0.05 : 0);
  const visitorsPerMin = Math.round(
    baseRate * timeMultiplier * happinessMultiplier * diversityBonus * rareBonus * amenityBonus
  );
  return {
    visitorsPerMin,
    currentVisitors: Math.round(visitorsPerMin * (0.8 + Math.random() * 0.4)),
    timeMultiplier,
    avgHappiness: Math.round(avgHappiness),
    uniqueSpecies,
    rareCount
  };
}
function computeVisitorSatisfaction(state) {
  const tanks = state.tanks || [];
  const fish = state.fish || [];
  let score = 50;
  const avgWQ = tanks.length > 0 ? tanks.reduce((s, t) => s + (t.waterQuality || 0), 0) / tanks.length : 50;
  score += (avgWQ - 50) * 0.3;
  const avgHappy = tanks.length > 0 ? tanks.reduce((s, t) => s + (t.happiness || 0), 0) / tanks.length : 50;
  score += (avgHappy - 50) * 0.2;
  const uniqueSpecies = new Set(fish.map((f) => {
    var _a;
    return (_a = f.species) == null ? void 0 : _a.key;
  }).filter(Boolean)).size;
  score += Math.min(15, uniqueSpecies * 1.5);
  const sickCount = fish.filter((f) => f.disease).length;
  score -= sickCount * 3;
  const decorCount = tanks.reduce((s, t) => {
    var _a, _b;
    return s + (((_b = (_a = t.decorations) == null ? void 0 : _a.placed) == null ? void 0 : _b.length) || 0);
  }, 0);
  score += Math.min(10, decorCount * 1.5);
  score += Math.min(5, tanks.length * 1.5);
  return Math.max(0, Math.min(100, Math.round(score)));
}
const ROOMS = [
  {
    id: "lobby",
    label: "Main Lobby",
    desc: "Your entrance hall. Visitors see this first.",
    maxTanks: 2,
    cost: 0,
    bonus: { visitorMult: 1 },
    unlocked: true
  },
  {
    id: "tropical_wing",
    label: "Tropical Wing",
    desc: "A warm, humid gallery for reef species. +15% happiness for tropical fish.",
    maxTanks: 2,
    cost: 1500,
    bonus: { happinessMult: 1.15, tempType: "tropical" },
    unlocked: false
  },
  {
    id: "deep_sea_hall",
    label: "Deep Sea Hall",
    desc: "A darkened chamber for deep-water creatures. -20% disease chance.",
    maxTanks: 2,
    cost: 3e3,
    bonus: { diseaseResist: 0.8 },
    unlocked: false
  },
  {
    id: "breeding_lab",
    label: "Breeding Lab",
    desc: "A dedicated facility for genetics research. -15% breeding time.",
    maxTanks: 1,
    cost: 2e3,
    bonus: { breedSpeedMult: 0.85 },
    unlocked: false
  },
  {
    id: "vip_gallery",
    label: "VIP Gallery",
    desc: "An exclusive viewing room for your rarest specimens. +25% sale price for fish in this room.",
    maxTanks: 2,
    cost: 5e3,
    bonus: { saleMult: 1.25 },
    unlocked: false,
    minRep: 50
  },
  {
    id: "conservation_center",
    label: "Conservation Center",
    desc: "A research-focused area. +20% reputation gain from fish in this room.",
    maxTanks: 2,
    cost: 8e3,
    bonus: { repMult: 1.2 },
    unlocked: false,
    minPrestige: 1
  }
];
function getRoomForTank(state, tankId) {
  const assignments = state.roomAssignments || {};
  const roomId = assignments[tankId] || "lobby";
  return ROOMS.find((r) => r.id === roomId) || ROOMS[0];
}
function getRoomBonus(state, tankId) {
  const room = getRoomForTank(state, tankId);
  return room.bonus || {};
}
const _getCampaignLevel = (id) => CAMPAIGN_LEVELS.find((l) => l.id === id) || null;
const TICK_INTERVAL_MS = 1e3;
const MARKET_HEADLINES = [
  { mod: { common: 0.7, uncommon: 1, rare: 1.3, epic: 1.5 }, text: "Rare fish market booming! Collectors paying top coin." },
  { mod: { common: 1.4, uncommon: 1.1, rare: 0.9, epic: 0.8 }, text: "Common fish craze! Everyone wants an easy starter pet." },
  { mod: { common: 0.9, uncommon: 1.3, rare: 1.1, epic: 1 }, text: "Mid-tier demand is high. Hobbyists are browsing." },
  { mod: { common: 1, uncommon: 0.8, rare: 1, epic: 1.8 }, text: "High-end buyers in town. Epic fish fetch premium prices." },
  { mod: { common: 1.1, uncommon: 1.1, rare: 1.1, epic: 1.1 }, text: "Good weather brings steady foot traffic. Prices are fair." },
  { mod: { common: 0.8, uncommon: 0.9, rare: 0.8, epic: 0.9 }, text: "Slow day at the market. Buyers are cautious with coin." },
  { mod: { common: 1.2, uncommon: 1.2, rare: 0.7, epic: 0.7 }, text: "Fish fair in town! Budget shoppers flooding in." },
  { mod: { common: 0.9, uncommon: 1, rare: 1.4, epic: 1.2 }, text: "Collector convention nearby. Rare finds sell fast." }
];
const HOT_TRAITS = [
  { gene: "primaryColor", value: "Crimson", label: "Crimson fish", bonus: 1.4 },
  { gene: "primaryColor", value: "Gold", label: "Gold fish", bonus: 1.4 },
  { gene: "primaryColor", value: "Azure", label: "Azure fish", bonus: 1.4 },
  { gene: "primaryColor", value: "Violet", label: "Violet fish", bonus: 1.5 },
  { gene: "primaryColor", value: "Emerald", label: "Emerald fish", bonus: 1.5 },
  { gene: "glow", value: "Luminous", label: "Glowing fish", bonus: 1.6 },
  { gene: "glow", value: "Radiant", label: "Radiant fish", bonus: 1.3 },
  { gene: "mutation", value: "Albino", label: "Albino fish", bonus: 1.5 },
  { gene: "mutation", value: "Twin-tail", label: "Twin-tail fish", bonus: 1.4 },
  { gene: "bodyShape", value: "Eel", label: "Eel-shaped fish", bonus: 1.3 },
  { gene: "size", value: "Leviathan", label: "Leviathan fish", bonus: 1.5 },
  { gene: "pattern", value: "Tiger", label: "Tiger-pattern fish", bonus: 1.3 }
];
function refreshMarket(state) {
  var _a;
  const today = todayUTCDay();
  if (((_a = state.market) == null ? void 0 : _a.day) === today) return state;
  const rng = seededRandom(today * 1337);
  const headline = MARKET_HEADLINES[Math.floor(rng() * MARKET_HEADLINES.length)];
  const hotTrait = rng() < 0.7 ? HOT_TRAITS[Math.floor(rng() * HOT_TRAITS.length)] : null;
  const modifiers = {};
  for (const [rarity, base] of Object.entries(headline.mod)) {
    modifiers[rarity] = Math.round((base + (rng() - 0.5) * 0.2) * 100) / 100;
  }
  const hotLabel = hotTrait ? ` ${hotTrait.label} are in demand today!` : "";
  const market = {
    day: today,
    modifiers,
    hotTrait: hotTrait ? { gene: hotTrait.gene, value: hotTrait.value, bonus: hotTrait.bonus, label: hotTrait.label } : null,
    headline: headline.text + hotLabel
  };
  let next = { ...state, market };
  next = { ...next, log: [{ time: Date.now(), message: `${market.headline}`, severity: "info" }, ...next.log].slice(0, 60) };
  return next;
}
function getMarketMultiplier(fish, market) {
  var _a;
  if (!market || !market.modifiers) return 1;
  let mult = market.modifiers[((_a = fish.species) == null ? void 0 : _a.rarity) || "common"] || 1;
  if (market.hotTrait && fish.phenotype) {
    if (fish.phenotype[market.hotTrait.gene] === market.hotTrait.value) {
      mult *= market.hotTrait.bonus;
    }
  }
  return mult;
}
const EARLY_EVENTS = [
  {
    id: "firstCustomer",
    afterSecs: 45,
    // 45 seconds in
    condition: (state) => state.fish.some((f) => f.stage === "adult"),
    fire: (state, messages) => {
      const adult = state.fish.find((f) => f.stage === "adult" && !state.shop.listedFish.includes(f.id));
      if (!adult) return state;
      messages.push({ message: `A customer is looking through the window! Try listing a fish for sale in the Shop tab.`, severity: "warn" });
      return { ...state, shop: { ...state.shop, lastCustomerAt: now - 13e3 } };
    }
  },
  {
    id: "giftEgg",
    afterSecs: 120,
    // 2 minutes in
    fire: (state, messages) => {
      const tank = state.tanks[0];
      if (!tank) return state;
      const count = state.fish.filter((f) => f.tankId === tank.id).length;
      if (count >= (tank.capacity || 12)) return state;
      const egg = createFish({ stage: "egg", tankId: tank.id, targetRarity: "uncommon", now });
      messages.push({ message: `A mysterious egg appeared in your tank! It looks unusual...`, severity: "warn" });
      messages.push({ message: `Tip: Eggs hatch into juveniles, then grow into adults you can sell or breed.`, severity: "info" });
      return { ...state, fish: [...state.fish, egg] };
    }
  },
  {
    id: "breedHint",
    afterSecs: 300,
    // 5 minutes in
    condition: (state) => state.fish.filter((f) => f.stage === "adult").length >= 2,
    fire: (state, messages) => {
      messages.push({ message: `You have two adult fish! Try the Breed tab to combine their traits and discover new species.`, severity: "warn" });
      return state;
    }
  },
  {
    id: "marketIntro",
    afterSecs: 180,
    // 3 minutes in
    fire: (state, messages) => {
      messages.push({ message: `The fish market shifts daily — check the Shop for today's hot traits and price trends!`, severity: "info" });
      return state;
    }
  },
  {
    id: "geneticsHint",
    afterSecs: 600,
    // 10 minutes in
    condition: (state) => state.fish.some((f) => f.genome),
    fire: (state, messages) => {
      messages.push({ message: `Tip: Open a fish's Genetics panel to see its Chromacode — the colored DNA bar reveals hidden recessive traits!`, severity: "info" });
      return state;
    }
  },
  {
    id: "purityHint",
    afterSecs: 1200,
    // 20 minutes in
    condition: (state) => state.fish.filter((f) => f.stage === "adult").length >= 3,
    fire: (state, messages) => {
      messages.push({ message: `Tip: Fish with matching alleles (pure genes) are worth more. Breed carriers of the same trait to purify a lineage!`, severity: "info" });
      return state;
    }
  },
  {
    id: "mutationHint",
    afterSecs: 2400,
    // 40 minutes in
    fire: (state, messages) => {
      messages.push({ message: `A strange shimmer passes through the tank. Some say rare mutations can be bred with the right combination of parents...`, severity: "info" });
      return state;
    }
  }
];
const HUNGER_RATE = 0.012;
const WATER_DECAY_RATE = 8e-4;
const HEALTH_HUNGER_DMG = 0.06;
const HEALTH_WATER_DMG = 0.03;
const HEALTH_REGEN = 0.025;
const HEALTH_REGEN_HUNGER_THRESHOLD = 60;
const LIFESPAN_BY_RARITY = {
  common: 60 * 60 * 8,
  // 8 hours
  uncommon: 60 * 60 * 16,
  // 16 hours
  rare: 60 * 60 * 24,
  // 24 hours
  epic: 60 * 60 * 48,
  // 48 hours
  legendary: 60 * 60 * 72
  // 72 hours
};
const ELDER_HEALTH_DECAY = 0.08;
const PASSIVE_INCOME_INTERVAL = 60;
const AUTO_FEED_INTERVAL = 40;
const PASSIVE_INCOME_BASE = 4;
const PASSIVE_DECOR_BONUS = 0.25;
const DISEASE_STAGES = ["incubating", "mild", "severe", "critical"];
const STAGE_DURATION = { incubating: 120, mild: 300, severe: 240, critical: 180 };
const CURE_SUCCESS_RATE = { incubating: 0.95, mild: 0.85, severe: 0.55, critical: 0.25 };
const DISEASES = {
  ich: {
    id: "ich",
    name: "Ich",
    emoji: "",
    desc: "White-spot disease. Spreads quickly between fish.",
    healthDmgPerSec: { incubating: 0, mild: 0.012, severe: 0.025, critical: 0.05 },
    spreadChancePerSec: 8e-4,
    color: "#ff4444",
    curedBy: "antibiotic",
    treatmentName: "Antibiotic",
    symptoms: { mild: "white spots", severe: "heavy spots, scratching", critical: "gasping, lethargic" }
  },
  fin_rot: {
    id: "fin_rot",
    name: "Fin Rot",
    emoji: "",
    desc: "Bacterial infection. Caused by poor water quality.",
    healthDmgPerSec: { incubating: 0, mild: 8e-3, severe: 0.018, critical: 0.04 },
    spreadChancePerSec: 3e-4,
    color: "#a06020",
    curedBy: "antibiotic",
    treatmentName: "Antibiotic",
    symptoms: { mild: "ragged fins", severe: "fins deteriorating", critical: "fin loss, redness" }
  },
  bloat: {
    id: "bloat",
    name: "Bloat",
    emoji: "",
    desc: "Digestive illness. Linked to overfeeding.",
    healthDmgPerSec: { incubating: 0, mild: 0.01, severe: 0.022, critical: 0.045 },
    spreadChancePerSec: 0,
    color: "#d4c020",
    curedBy: "digestiveRemedy",
    treatmentName: "Digestive Remedy",
    symptoms: { mild: "swollen belly", severe: "not eating", critical: "floating sideways" }
  },
  velvet: {
    id: "velvet",
    name: "Velvet",
    emoji: "",
    desc: "Parasitic infection. Hard to spot until advanced.",
    healthDmgPerSec: { incubating: 0, mild: 0.015, severe: 0.03, critical: 0.06 },
    spreadChancePerSec: 1e-3,
    color: "#e06820",
    curedBy: "antiparasitic",
    treatmentName: "Antiparasitic",
    symptoms: { mild: "gold dust coating", severe: "clamped fins", critical: "rapid breathing" }
  },
  swim_bladder: {
    id: "swim_bladder",
    name: "Swim Bladder",
    emoji: "",
    desc: "Buoyancy problems. Fish swims erratically or upside down.",
    healthDmgPerSec: { incubating: 0, mild: 5e-3, severe: 0.015, critical: 0.035 },
    spreadChancePerSec: 0,
    color: "#4488cc",
    curedBy: "digestiveRemedy",
    treatmentName: "Digestive Remedy",
    symptoms: { mild: "wobbly swimming", severe: "floating upside down", critical: "unable to move" }
  },
  gill_flukes: {
    id: "gill_flukes",
    name: "Gill Flukes",
    emoji: "",
    desc: "Parasitic worms in the gills. Reduces oxygen intake.",
    healthDmgPerSec: { incubating: 0, mild: 0.012, severe: 0.028, critical: 0.055 },
    spreadChancePerSec: 6e-4,
    color: "#9944cc",
    curedBy: "antiparasitic",
    treatmentName: "Antiparasitic",
    symptoms: { mild: "flashing gills", severe: "labored breathing", critical: "gasping at surface" }
  },
  dropsy: {
    id: "dropsy",
    name: "Dropsy",
    emoji: "",
    desc: "Internal organ failure. Extremely dangerous. Often fatal.",
    healthDmgPerSec: { incubating: 0, mild: 0.018, severe: 0.04, critical: 0.08 },
    spreadChancePerSec: 2e-4,
    color: "#cc2060",
    curedBy: "antibiotic",
    treatmentName: "Antibiotic",
    symptoms: { mild: "pine-cone scales", severe: "bulging eyes", critical: "extreme swelling" }
  }
};
function getDiseaseStage(diseaseSince, now2) {
  if (!diseaseSince) return "mild";
  const elapsed = ((now2 || Date.now()) - diseaseSince) / 1e3;
  let total = 0;
  for (const stage of DISEASE_STAGES) {
    total += STAGE_DURATION[stage];
    if (elapsed < total) return stage;
  }
  return "critical";
}
function getDiseaseDamage(diseaseId, stage) {
  const d = DISEASES[diseaseId];
  if (!d) return 0.02;
  const dmg = d.healthDmgPerSec;
  return typeof dmg === "number" ? dmg : dmg[stage] || dmg.mild || 0.02;
}
const DISEASE_BASE_CHANCE = 15e-6;
const DISEASE_WATER_MULT = 2;
const DISEASE_CROWD_MULT = 1.5;
const CUSTOMER_BASE_INTERVAL_MS = 18e3;
const DIFFICULTY_PRESETS = {
  easy: { coinMult: 1.5, diseaseMult: 0.3, hungerMult: 0.7, waterDecayMult: 0.5, customerSpeedMult: 1.3, label: "Easy" },
  normal: { coinMult: 1, diseaseMult: 1, hungerMult: 1, waterDecayMult: 1, customerSpeedMult: 1, label: "Normal" },
  hard: { coinMult: 0.6, diseaseMult: 2, hungerMult: 1.5, waterDecayMult: 1.8, customerSpeedMult: 0.7, label: "Hard" }
};
function getDifficultyMults(state) {
  return DIFFICULTY_PRESETS[(state == null ? void 0 : state.difficulty) || "normal"] || DIFFICULTY_PRESETS.normal;
}
const BASE_OFFLINE_SECONDS = 60 * 60 * 48;
const TANK_SITTER_BONUS_SECONDS = 60 * 60 * 24;
const CUSTOMER_TYPES = [
  {
    id: "tourist",
    name: "Tourist",
    budgetMult: 0.85,
    haggle: 0,
    rarityBias: "common",
    emoji: "",
    greetings: ["Wow, what a cute shop!", "Do you ship internationally?", "I saw this place on TripAdvisor!"]
  },
  {
    id: "hobbyist",
    name: "Fish Hobbyist",
    budgetMult: 1,
    haggle: 0.2,
    rarityBias: "uncommon",
    emoji: "",
    greetings: ["Nice setup! What's your filtration?", "I've been keeping fish for years.", "Any new stock today?"]
  },
  {
    id: "collector",
    name: "Collector",
    budgetMult: 1.3,
    haggle: 0.05,
    rarityBias: "rare",
    emoji: "",
    greetings: ["I'm looking for something... special.", "My collection needs a centerpiece.", "Money is no object for the right specimen."]
  },
  {
    id: "breeder",
    name: "Pro Breeder",
    budgetMult: 1.1,
    haggle: 0.35,
    rarityBias: "uncommon",
    emoji: "",
    greetings: ["What's the genetic line on this one?", "I need good breeding stock.", "Let's talk price — I'm buying in bulk."]
  },
  {
    id: "rich",
    name: "Wealthy Patron",
    budgetMult: 1.8,
    haggle: 0,
    rarityBias: "epic",
    emoji: "",
    greetings: ["I'll take your finest specimen.", "Price is irrelevant. Show me the best.", "My yacht needs a new aquarium piece."]
  },
  {
    id: "kid",
    name: "Excited Kid",
    budgetMult: 0.7,
    haggle: 0,
    rarityBias: "common",
    emoji: "",
    greetings: ["FISHIES! Mom, look!!", "Can I name it?? Please?!", "This one is SO COOL!"]
  },
  {
    id: "influencer",
    name: "Influencer",
    budgetMult: 1.2,
    haggle: 0.15,
    rarityBias: "rare",
    emoji: "",
    greetings: ["This would get SO many likes.", "Hold on, I need to film this.", "My followers will love this!"]
  },
  {
    id: "scientist",
    name: "Marine Biologist",
    budgetMult: 0.95,
    haggle: 0.25,
    rarityBias: "rare",
    emoji: "",
    greetings: ["Fascinating morphology!", "I'm studying color mutations.", "This specimen shows interesting traits."]
  },
  {
    id: "grandma",
    name: "Kind Grandma",
    budgetMult: 1.4,
    haggle: 0,
    rarityBias: "common",
    emoji: "",
    greetings: ["My grandchild would love this!", "What a beautiful fish, dear.", "I'll take it — wrap it up nicely!"]
  }
];
const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };
function getTankBonuses(tankType) {
  switch (tankType) {
    case "breeding":
      return { breedingSpeedMult: 0.8, healthRegenMult: 1 };
    case "grow":
      return { growSpeedMult: 0.75, healthRegenMult: 1.1 };
    case "display":
      return { salePriceMult: 1.1, healthRegenMult: 1 };
    default:
      return { healthRegenMult: 1 };
  }
}
function maybeSpreadDisease(tankFish, wq, capacity, now2) {
  const sickFish = tankFish.filter((f) => f.stage !== "egg" && f.disease && getDiseaseStage(f.diseaseSince, now2) !== "incubating");
  if (sickFish.length === 0) return tankFish;
  const crowded = tankFish.length / (capacity || 12) > 0.8;
  return tankFish.map((fish) => {
    if (fish.disease || fish.stage === "egg") return fish;
    if (fish.vitaminUntil && fish.vitaminUntil > now2) return fish;
    const immunities = fish.immunities || [];
    for (const sick of sickFish) {
      if (immunities.includes(sick.disease)) continue;
      const disease = DISEASES[sick.disease];
      if (!disease || disease.spreadChancePerSec === 0) continue;
      let chance = disease.spreadChancePerSec;
      if (wq < 30) chance *= DISEASE_WATER_MULT;
      if (crowded) chance *= DISEASE_CROWD_MULT;
      if (fish.personality === "hardy") chance *= 0.4;
      if (Math.random() < chance) {
        return { ...fish, disease: sick.disease, diseaseSince: now2, diseaseStage: "incubating" };
      }
    }
    return fish;
  });
}
function processOneTank(tank, tankFish, messages, now2, hatcheryLevel = 0, playerBoosts = {}, upgradeLevels = {}, diff = {}, researchFx = {}, roomBonus = {}) {
  var _a, _b, _c, _d;
  const bonuses = getTankBonuses(tank.type);
  const boostActive = (key) => (playerBoosts[key] || 0) > now2;
  const growBoost = boostActive("growSpeed") ? 0.5 : 1;
  const regenBoost = boostActive("healthRegen") ? 3 : 1;
  const purifierMult = 1 - (upgradeLevels.purifier || 0) * 0.25;
  const eqFx = getEquipmentEffects(tank.equipment);
  const wq = Math.max(0, tank.waterQuality - WATER_DECAY_RATE * (diff.waterDecayMult || 1) * purifierMult * eqFx.wqDecayMult);
  const temp = tank.temperature ?? 74;
  const tempControlMult = 1 - (upgradeLevels.tempControl || 0) * 0.3;
  const baseDrift = temp > 74 ? -2e-3 : temp < 74 ? 2e-3 : 0;
  const tempDrift = eqFx.tempStabilize ? 0 : baseDrift * tempControlMult;
  const newTemp = Math.round((temp + tempDrift) * 1e3) / 1e3;
  const tempStress = newTemp < 65 || newTemp > 85;
  let supplies = { ...tank.supplies };
  const feedTick = (tank.autoFeedTick || 0) + 1;
  let autoFeedUsed = false;
  let autoFeedTriggered = false;
  if (tank.autoFeed && feedTick >= AUTO_FEED_INTERVAL && supplies.food > 0) {
    autoFeedTriggered = true;
    const hungryFish = tankFish.filter((f) => f.stage !== "egg" && (f.hunger || 0) > 30);
    if (hungryFish.length > 0) {
      autoFeedUsed = true;
      supplies = { ...supplies, food: supplies.food - 1 };
    }
  }
  let fishWithDisease = tankFish.map((fish) => {
    var _a2;
    if (fish.disease || fish.stage === "egg") return fish;
    if (fish.vitaminUntil && fish.vitaminUntil > now2) return fish;
    let chance = DISEASE_BASE_CHANCE * (diff.diseaseMult || 1) * (researchFx.diseaseResist || 1) * (eqFx.diseaseResist || 1) * (roomBonus.diseaseResist || 1);
    if (fish.personality === "hardy") chance *= 0.4;
    if (wq < 30) chance *= DISEASE_WATER_MULT;
    if (tankFish.length / (tank.capacity || 12) > 0.8) chance *= DISEASE_CROWD_MULT;
    if (Math.random() < chance) {
      const diseaseIds = Object.keys(DISEASES);
      let pool = diseaseIds;
      if (wq < 30) pool = ["fin_rot", "fin_rot", "ich", "velvet"];
      if ((fish.hunger || 0) > 70) pool = ["bloat", "bloat", "ich"];
      const diseaseId = pool[Math.floor(Math.random() * pool.length)];
      if ((fish.immunities || []).includes(diseaseId)) return fish;
      messages.push({ message: `${((_a2 = fish.species) == null ? void 0 : _a2.name) || "A fish"} in ${tank.name} looks unwell! Keep an eye on symptoms.`, severity: "critical" });
      return { ...fish, disease: diseaseId, diseaseSince: now2, diagnosed: false };
    }
    return fish;
  });
  fishWithDisease = maybeSpreadDisease(fishWithDisease, wq, tank.capacity);
  const updatedTankFish = fishWithDisease.map((fish) => {
    var _a2, _b2, _c2, _d2, _e;
    let f = { ...fish };
    f.age = Math.max(0, Math.floor((now2 - (f.bornAt || now2)) / 1e3));
    if (f.stage !== "egg") {
      if (autoFeedUsed) f.hunger = Math.max(0, (f.hunger || 0) - 35);
      f.hunger = Math.min(100, (f.hunger || 0) + HUNGER_RATE * (diff.hungerMult || 1) * (f.personality === "gluttonous" ? 1.4 : 1));
      const regen = HEALTH_REGEN * (bonuses.healthRegenMult || 1) * regenBoost * (researchFx.healthRegen || 1) * (eqFx.healthRegenMult || 1);
      let dmg = 0;
      if (f.disease) {
        const disease = DISEASES[f.disease];
        if (disease) {
          const stage = getDiseaseStage(f.diseaseSince, now2);
          f.diseaseStage = stage;
          dmg += getDiseaseDamage(f.disease, stage);
        }
      }
      if (f.hunger >= 90) dmg += HEALTH_HUNGER_DMG;
      if (wq < 25) dmg += HEALTH_WATER_DMG;
      if (tempStress) dmg += 0.02;
      const maxAge = Math.round((LIFESPAN_BY_RARITY[((_a2 = f.species) == null ? void 0 : _a2.rarity) || "common"] || LIFESPAN_BY_RARITY.common) * (researchFx.lifespanMult || 1));
      if (f.age > maxAge) {
        const elderAge = f.age - maxAge;
        dmg += ELDER_HEALTH_DECAY * Math.min(3, 1 + elderAge / maxAge);
        if (!f._elderLogged) {
          f._elderLogged = true;
          messages.push(`${((_b2 = f.species) == null ? void 0 : _b2.name) || "A fish"} in ${tank.name} is reaching old age.`);
        }
      }
      if (dmg > 0) {
        f.health = Math.max(0, f.health - Math.min(dmg, 0.25));
      } else if (f.hunger < HEALTH_REGEN_HUNGER_THRESHOLD && wq > 60) {
        f.health = Math.min(100, f.health + regen);
      }
    }
    const stageDuration = ((_c2 = GROWTH_STAGES[f.stage]) == null ? void 0 : _c2.durationMs) ?? Infinity;
    const timeInStage = now2 - f.stageStartedAt;
    const hatcheryMult = 1 - hatcheryLevel * 0.15;
    const growMult = (bonuses.growSpeedMult || 1) * hatcheryMult * growBoost;
    if (f.stage === "egg" && timeInStage >= stageDuration * growMult) {
      f.stage = "juvenile";
      f.stageStartedAt = now2;
      messages.push(`An egg in ${tank.name} hatched into a ${((_d2 = f.species) == null ? void 0 : _d2.name) || "fish"}!`);
    } else if (f.stage === "juvenile" && timeInStage >= stageDuration * growMult) {
      f.stage = "adult";
      f.stageStartedAt = now2;
      if (!f.personality) {
        const pList = ["playful", "shy", "curious", "lazy", "aggressive", "social", "gluttonous", "hardy"];
        f.personality = pList[Math.floor(Math.random() * pList.length)];
      }
      messages.push(`A ${((_e = f.species) == null ? void 0 : _e.name) || "fish"} in ${tank.name} grew into an adult!`);
    }
    return f;
  });
  const adults = updatedTankFish.filter((f) => f.stage !== "egg");
  let happiness = 100;
  let compatPenalty = 0;
  if (adults.length > 0) {
    const avgHealth = adults.reduce((s, f) => s + (f.health || 100), 0) / adults.length;
    const avgHunger = adults.reduce((s, f) => s + (f.hunger || 0), 0) / adults.length;
    happiness = Math.round(avgHealth * 0.4 + Math.max(0, 100 - avgHunger) * 0.35 + wq * 0.25);
    const whispererBonus = (upgradeLevels.whisperer || 0) * 0.1;
    happiness = Math.min(100, Math.round(happiness * (1 + whispererBonus)));
    const compats = adults.map((f) => getCompat(f));
    const waters = new Set(compats.map((c) => c.water));
    const temps = new Set(compats.map((c) => c.temp));
    const hasAggr = compats.some((c) => c.temperament === "aggressive");
    const hasPeace = compats.some((c) => c.temperament === "peaceful");
    if (waters.size > 1) compatPenalty += 25;
    if (temps.size > 1) compatPenalty += 10;
    if (hasAggr && hasPeace) compatPenalty += 15;
    const speciesCounts = /* @__PURE__ */ new Map();
    for (const f of adults) {
      const key = ((_a = f.species) == null ? void 0 : _a.key) || ((_b = f.species) == null ? void 0 : _b.name) || "unknown";
      speciesCounts.set(key, (speciesCounts.get(key) || 0) + 1);
    }
    for (const f of adults) {
      const c = getCompat(f);
      if (c.schoolSize) {
        const key = ((_c = f.species) == null ? void 0 : _c.key) || ((_d = f.species) == null ? void 0 : _d.name) || "unknown";
        if ((speciesCounts.get(key) || 0) < c.schoolSize) {
          compatPenalty += 8;
          break;
        }
      }
    }
    happiness = Math.max(0, happiness - compatPenalty);
    if (roomBonus.happinessMult) happiness = Math.min(100, Math.round(happiness * roomBonus.happinessMult));
  }
  let updatedEquipment = tank.equipment ? [...tank.equipment] : [];
  for (let i = 0; i < updatedEquipment.length; i++) {
    const eq = updatedEquipment[i];
    if (eq.broken) continue;
    const eqType = EQUIPMENT_TYPES[eq.typeId];
    if (eqType && Math.random() < (eqType.breakdownChance || 0)) {
      updatedEquipment[i] = { ...eq, broken: true };
      messages.push(`${eqType.label} broke down in ${tank.name}! Repair it to restore its effect.`);
    }
  }
  const updatedTank = {
    ...tank,
    waterQuality: wq,
    temperature: newTemp,
    happiness,
    equipment: updatedEquipment,
    autoFeedTick: autoFeedUsed || autoFeedTriggered ? 0 : Math.min(feedTick, AUTO_FEED_INTERVAL),
    supplies
  };
  for (const f of updatedTankFish) {
    if (!Number.isFinite(f.health)) f.health = 50;
    if (!Number.isFinite(f.hunger)) f.hunger = 0;
    if (!Number.isFinite(f.age)) f.age = 0;
  }
  if (!Number.isFinite(updatedTank.waterQuality)) updatedTank.waterQuality = 80;
  if (!Number.isFinite(updatedTank.temperature)) updatedTank.temperature = 74;
  return { updatedTank, updatedTankFish };
}
const CHALLENGE_TEMPLATES = [
  { id: "sell_common", emoji: "", desc: "Sell 3 common fish today", type: "sell_rarity", rarity: "common", goal: 3, reward: 40 },
  { id: "sell_uncommon", emoji: "", desc: "Sell 2 uncommon fish today", type: "sell_rarity", rarity: "uncommon", goal: 2, reward: 80 },
  { id: "sell_rare", emoji: "", desc: "Sell 1 rare fish today", type: "sell_rarity", rarity: "rare", goal: 1, reward: 150 },
  { id: "earn_coins", emoji: "", desc: "Earn 200 coins today", type: "earn_coins", goal: 200, reward: 60 },
  { id: "breed_eggs", emoji: "", desc: "Collect 2 eggs from breeding today", type: "breed_eggs", goal: 2, reward: 70 },
  { id: "treat_water", emoji: "", desc: "Treat water quality once today", type: "treat_water", goal: 1, reward: 50 },
  { id: "cure_fish", emoji: "", desc: "Cure a sick fish today", type: "cure_fish", goal: 1, reward: 50 },
  { id: "happiness_high", emoji: "", desc: "Keep tank happiness above 90% for 10 minutes", type: "happiness_timer", goal: 600, reward: 55 },
  { id: "sell_5_fish", emoji: "", desc: "Sell 5 fish in total today", type: "sell_any", goal: 5, reward: 90 },
  { id: "discover", emoji: "", desc: "Discover 1 new species today", type: "discover", goal: 1, reward: 100 }
];
function todayUTCDay() {
  return Math.floor(Date.now() / 864e5);
}
function seededRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
function generateDailyChallenges(day) {
  const rng = seededRandom(day * 2654435761);
  const shuffled = [...CHALLENGE_TEMPLATES];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picked = [];
  const types = /* @__PURE__ */ new Set();
  for (const t of shuffled) {
    if (!types.has(t.type.split("_")[0])) {
      picked.push({ ...t, progress: 0, completed: false });
      types.add(t.type.split("_")[0]);
    }
    if (picked.length === 3) break;
  }
  while (picked.length < 3) {
    const next = shuffled[picked.length];
    if (next) picked.push({ ...next, progress: 0, completed: false });
  }
  return { day, challenges: picked };
}
function refreshDailyChallenges(state) {
  var _a, _b;
  const today = todayUTCDay();
  const dc = state.dailyChallenges;
  if (!dc || dc.day !== today) {
    const prevCompleted = ((_a = dc == null ? void 0 : dc.challenges) == null ? void 0 : _a.length) > 0 && dc.challenges.every((c) => c.completed);
    const isConsecutive = ((dc == null ? void 0 : dc.day) ?? -1) === today - 1;
    const currentStreak = ((_b = state.player) == null ? void 0 : _b.challengeStreak) || 0;
    const newStreak = isConsecutive && prevCompleted ? currentStreak + 1 : 0;
    let next = { ...state, dailyChallenges: generateDailyChallenges(today) };
    if (newStreak !== currentStreak) {
      next = { ...next, player: { ...next.player, challengeStreak: newStreak } };
      if (newStreak > 1) {
        const mult = Math.min(2, 1 + newStreak * 0.1).toFixed(1);
        const msg = `Challenge streak: ${newStreak} days in a row! Today's rewards ×${mult}`;
        next = { ...next, log: [{ time: Date.now(), message: msg, severity: "warn" }, ...next.log].slice(0, 60) };
      }
    }
    return next;
  }
  return state;
}
function updateChallengeProgress(state, eventType, payload = {}) {
  const dc = state.dailyChallenges;
  if (!dc || !dc.challenges) return state;
  const today = todayUTCDay();
  if (dc.day !== today) return state;
  let coinsAwarded = 0;
  const messages = [];
  const updated = dc.challenges.map((c) => {
    var _a;
    if (c.completed) return c;
    let progress = c.progress;
    let matches = false;
    if (c.type === "sell_rarity" && eventType === "sell" && payload.rarity === c.rarity) {
      matches = true;
      progress += 1;
    } else if (c.type === "sell_any" && eventType === "sell") {
      matches = true;
      progress += 1;
    } else if (c.type === "earn_coins" && eventType === "earn_coins") {
      matches = true;
      progress += payload.amount || 0;
    } else if (c.type === "breed_eggs" && eventType === "collect_egg") {
      matches = true;
      progress += 1;
    } else if (c.type === "treat_water" && eventType === "treat_water") {
      matches = true;
      progress += 1;
    } else if (c.type === "cure_fish" && eventType === "cure_fish") {
      matches = true;
      progress += 1;
    } else if (c.type === "discover" && eventType === "discover") {
      matches = true;
      progress += 1;
    } else if (c.type === "happiness_timer" && eventType === "happiness_tick") {
      const anyHigh = (payload.tanks || []).some((h) => h >= 90);
      if (anyHigh) {
        matches = true;
        progress += 1;
      }
    }
    if (!matches) return c;
    const completed = progress >= c.goal;
    if (completed && !c.completed) {
      const streak = ((_a = state.player) == null ? void 0 : _a.challengeStreak) || 0;
      const mult = Math.min(2, 1 + streak * 0.1);
      const reward = Math.round(c.reward * mult);
      coinsAwarded += reward;
      const multLabel = mult > 1 ? ` (×${mult.toFixed(1)} streak bonus)` : "";
      messages.push(`Daily challenge complete: ${c.emoji} ${c.desc}! +${reward}${multLabel}`);
    }
    return { ...c, progress: Math.min(progress, c.goal), completed };
  });
  let next = { ...state, dailyChallenges: { ...dc, challenges: updated } };
  if (coinsAwarded > 0) {
    next = { ...next, player: {
      ...next.player,
      coins: next.player.coins + coinsAwarded,
      totalCoinsEarned: (next.player.totalCoinsEarned || 0) + coinsAwarded
    } };
  }
  if (messages.length > 0) {
    const entries = messages.map((message) => ({ time: Date.now(), message, severity: "warn" }));
    next = { ...next, log: [...entries, ...next.log].slice(0, 60) };
  }
  return next;
}
function processTick(state) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U;
  if (!state || !Array.isArray(state.fish) || !Array.isArray(state.tanks)) return state;
  if (!state.player) return state;
  if (!Number.isFinite(state.player.coins)) state.player.coins = 0;
  if (!Number.isFinite(state.player.xp)) state.player.xp = 0;
  if (!state.shop) state.shop = { listedFish: [], fishPrices: {}, slots: 4, upgrades: {}, lastCustomerAt: 0, reputation: 0 };
  if (!state.breedingTank) state.breedingTank = { slots: [null, null], eggReady: false, breedingStartedAt: null, breedingDurationMs: 3e5, storedGenomeA: null, storedGenomeB: null, storedTankId: null };
  if (!state.wantedPosters) state.wantedPosters = [];
  if (!state.memorials) state.memorials = [];
  try {
    let processBreedingBay = function(bay, deadIdSet2, now3) {
      if (!bay.breedingStartedAt || bay.eggReady) return bay;
      const genomeA = deadIdSet2.has(bay.slots[0]) ? null : bay.storedGenomeA;
      const genomeB = deadIdSet2.has(bay.slots[1]) ? null : bay.storedGenomeB;
      const updated = genomeA !== bay.storedGenomeA || genomeB !== bay.storedGenomeB ? { ...bay, storedGenomeA: genomeA, storedGenomeB: genomeB } : bay;
      const oneGenomeMissing = !updated.storedGenomeA || !updated.storedGenomeB;
      if (oneGenomeMissing) {
        messages.push("Breeding cancelled — a parent was lost.");
        return { ...updated, breedingStartedAt: null, slots: [null, null], storedGenomeA: null, storedGenomeB: null };
      }
      if (now3 - updated.breedingStartedAt >= (updated.breedingDurationMs || 3e5) * (seasonalBonuses.breedingSpeed || 1)) {
        messages.push("A breeding egg is ready to collect!");
        return { ...updated, eggReady: true };
      }
      return updated;
    }, _tip = function(id, cond, msg) {
      if (_tips[id]) return;
      if (!cond) return;
      next = { ...next, player: { ...next.player, tutorialFlags: { ...next.player.tutorialFlags, [id]: true } } };
      messages.push({ message: msg, severity: "tip" });
    };
    let next = { ...state };
    const messages = [];
    const realNow = Date.now();
    const realDelta = Math.max(0, Math.min(1e4, realNow - (state.lastTickAt || realNow)));
    const speed = state.gameSpeed || 1;
    const gameDelta = realDelta * speed;
    const now2 = (state.gameClock || realNow) + gameDelta;
    next.gameClock = now2;
    next.lastTickAt = realNow;
    const diff = getDifficultyMults(state);
    const researchFx = getResearchEffects(state);
    const seasonalEvent = getActiveEvent();
    const seasonalBonuses = (seasonalEvent == null ? void 0 : seasonalEvent.bonuses) || {};
    next.activeSeasonalEvent = seasonalEvent ? { id: seasonalEvent.id, name: seasonalEvent.name, desc: seasonalEvent.desc } : null;
    const updatedTanks = [];
    const allUpdatedFish = [];
    const hatcheryLevel = ((_c = (_b = (_a = next.shop) == null ? void 0 : _a.upgrades) == null ? void 0 : _b.hatchery) == null ? void 0 : _c.level) || 0;
    const fishByTank = /* @__PURE__ */ new Map();
    for (const f of next.fish) {
      if (!fishByTank.has(f.tankId)) fishByTank.set(f.tankId, []);
      fishByTank.get(f.tankId).push(f);
    }
    const upgrades = ((_d = next.shop) == null ? void 0 : _d.upgrades) || {};
    const upgradeLevels = {
      purifier: ((_e = upgrades.purifier) == null ? void 0 : _e.level) || 0,
      autoMedic: ((_f = upgrades.autoMedic) == null ? void 0 : _f.level) || 0,
      tempControl: ((_g = upgrades.tempControl) == null ? void 0 : _g.level) || 0,
      fame: ((_h = upgrades.fame) == null ? void 0 : _h.level) || 0,
      insurance: ((_i = upgrades.insurance) == null ? void 0 : _i.level) || 0,
      whisperer: ((_j = upgrades.whisperer) == null ? void 0 : _j.level) || 0,
      service: ((_k = upgrades.service) == null ? void 0 : _k.level) || 0
    };
    for (const tank of next.tanks) {
      const tankFishList = fishByTank.get(tank.id) || [];
      const roomBonus = getRoomBonus(next, tank.id);
      const { updatedTank, updatedTankFish } = processOneTank(tank, tankFishList, messages, now2, hatcheryLevel, (_l = next.player) == null ? void 0 : _l.boosts, upgradeLevels, diff, researchFx, roomBonus);
      updatedTanks.push(updatedTank);
      allUpdatedFish.push(...updatedTankFish);
    }
    const processedIds = new Set(allUpdatedFish.map((f) => f.id));
    for (const f of next.fish) {
      if (!processedIds.has(f.id)) allUpdatedFish.push(f);
    }
    next = { ...next, tanks: updatedTanks, fish: allUpdatedFish };
    const oldEggs = new Set(state.fish.filter((f) => f.stage === "egg").map((f) => f.id));
    const newlyHatched = allUpdatedFish.filter((f) => f.stage === "juvenile" && oldEggs.has(f.id)).length;
    if (newlyHatched > 0) {
      next = { ...next, player: { ...next.player, stats: { ...next.player.stats, eggsHatched: (((_m = next.player.stats) == null ? void 0 : _m.eggsHatched) || 0) + newlyHatched } } };
    }
    const deadFish = next.fish.filter((f) => f.stage !== "egg" && f.health <= 0);
    if (deadFish.length > 0) {
      const deadIds = new Set(deadFish.map((f) => f.id));
      const tankById = /* @__PURE__ */ new Map();
      for (const t of next.tanks) tankById.set(t.id, t);
      const now22 = now2;
      const newAutopsies = deadFish.map((f) => {
        var _a2, _b2, _c2, _d2, _e2;
        const tank = tankById.get(f.tankId);
        let cause = "Unknown";
        let detail = "";
        if (f.disease) {
          cause = `${((_a2 = DISEASES[f.disease]) == null ? void 0 : _a2.name) || f.disease}`;
          detail = ((_b2 = DISEASES[f.disease]) == null ? void 0 : _b2.desc) || "";
        } else if (f.hunger >= 90) {
          cause = "Starvation";
          detail = "Hunger reached critical levels.";
        } else if (((tank == null ? void 0 : tank.waterQuality) ?? 100) < 25) {
          cause = "Water Toxicity";
          detail = "Water quality was critically low.";
        } else if (((tank == null ? void 0 : tank.temperature) ?? 74) < 65 || ((tank == null ? void 0 : tank.temperature) ?? 74) > 85) {
          cause = "Temperature Shock";
          detail = "Tank temperature was out of safe range.";
        } else if (f._elderLogged) {
          const maxAge = LIFESPAN_BY_RARITY[((_c2 = f.species) == null ? void 0 : _c2.rarity) || "common"] || LIFESPAN_BY_RARITY.common;
          const ageDays = Math.floor((f.age || 0) / 3600);
          cause = "Old Age";
          detail = `Lived a full life of ${ageDays} game-hours.`;
        } else {
          cause = "Unknown";
          detail = "Fish died without a clear stressor.";
        }
        return {
          id: crypto.randomUUID(),
          _fishId: f.id,
          fishName: ((_d2 = f.species) == null ? void 0 : _d2.name) || "Unknown",
          rarity: ((_e2 = f.species) == null ? void 0 : _e2.rarity) || "common",
          phenotype: f.phenotype,
          genome: f.genome,
          diedAt: now22,
          ageMinutes: Math.floor((f.age || 0) / 60),
          cause,
          detail,
          tankName: (tank == null ? void 0 : tank.name) || "Unknown Tank",
          waterQuality: Math.round((tank == null ? void 0 : tank.waterQuality) ?? 0),
          hunger: Math.round(f.hunger || 0),
          disease: f.disease || null
        };
      });
      const memorials = [...next.memorials || []];
      for (const f of deadFish) {
        const desc2 = next.fish.filter((af) => {
          var _a2;
          return (_a2 = af.parentIds) == null ? void 0 : _a2.includes(f.id);
        }).length;
        memorials.unshift({
          id: f.id,
          name: f.nickname || ((_n = f.species) == null ? void 0 : _n.name) || "Unknown",
          species: (_o = f.species) == null ? void 0 : _o.name,
          rarity: (_p = f.species) == null ? void 0 : _p.rarity,
          personality: f.personality,
          generation: f.generation || 1,
          livedDays: Math.round((now2 - (f.bornAt || now2)) / 864e5 * 10) / 10,
          descendants: desc2,
          diedAt: now2
        });
      }
      next = {
        ...next,
        memorials: memorials.slice(0, 50),
        fish: next.fish.filter((f) => !deadIds.has(f.id)),
        shop: {
          ...next.shop,
          listedFish: next.shop.listedFish.filter((id) => !deadIds.has(id)),
          fishPrices: Object.fromEntries(
            Object.entries(next.shop.fishPrices || {}).filter(([id]) => !deadIds.has(id))
          )
        },
        breedingTank: {
          ...next.breedingTank,
          slots: next.breedingTank.slots.map((s) => deadIds.has(s) ? null : s)
        },
        extraBays: (next.extraBays || []).map((bay) => ({
          ...bay,
          slots: (bay.slots || []).map((s) => deadIds.has(s) ? null : s)
        })),
        player: {
          ...next.player,
          autopsies: [...next.player.autopsies || [], ...newAutopsies].slice(0, 50)
        }
      };
      const insuranceLevel = upgradeLevels.insurance || 0;
      if (insuranceLevel > 0) {
        const refundPct = insuranceLevel * 0.2;
        let totalRefund = 0;
        for (const f of deadFish) {
          const refund = Math.round((((_q = f.species) == null ? void 0 : _q.basePrice) ?? 10) * refundPct);
          totalRefund += refund;
        }
        if (totalRefund > 0) {
          next = { ...next, player: { ...next.player, coins: next.player.coins + totalRefund } };
          messages.push(`Insurance payout: +${totalRefund} for ${deadFish.length} lost fish.`);
        }
      }
      deadFish.forEach((f, i) => {
        var _a2, _b2;
        return messages.push(`${((_a2 = f.species) == null ? void 0 : _a2.name) || "A fish"} has died. (Cause: ${((_b2 = newAutopsies[i]) == null ? void 0 : _b2.cause) || "Unknown"})`);
      });
      next = { ...next, player: { ...next.player, stats: { ...next.player.stats, fishDied: (((_r = next.player.stats) == null ? void 0 : _r.fishDied) || 0) + deadFish.length } } };
    }
    const deadIdSet = new Set(deadFish.map((f) => f.id));
    next = { ...next, breedingTank: processBreedingBay(next.breedingTank, deadIdSet, now2) };
    if (((_s = next.extraBays) == null ? void 0 : _s.length) > 0) {
      next = { ...next, extraBays: next.extraBays.map((bay) => processBreedingBay(bay, deadIdSet, now2)) };
    }
    const customerInterval = getCustomerInterval(next);
    if (now2 - next.shop.lastCustomerAt >= customerInterval && next.shop.listedFish.length > 0) {
      next = processCustomerVisit(next, messages);
    }
    if (next.staff && next.staff.length > 0) {
      next = { ...next, staff: next.staff.map((s) => ({ ...s })) };
      const staffFishByTank = /* @__PURE__ */ new Map();
      for (const f of next.fish) {
        if (!staffFishByTank.has(f.tankId)) staffFishByTank.set(f.tankId, []);
        staffFishByTank.get(f.tankId).push(f);
      }
      for (const member of next.staff) {
        if (!member.assignedTankId) continue;
        const tank = next.tanks.find((t) => t.id === member.assignedTankId);
        if (!tank) continue;
        const tankFishList = staffFishByTank.get(member.assignedTankId) || [];
        const roleDef = STAFF_ROLES[member.role];
        if (!roleDef) continue;
        const lvl = Math.min(member.level, (roleDef.maxLevel || 5) - 1);
        if (member.role === "feeder") {
          member.feedTick = (member.feedTick || 0) + 1;
          const interval = roleDef.effect.feedInterval[lvl] || 40;
          const threshold = roleDef.effect.hungerThreshold[lvl] || 50;
          if (member.feedTick >= interval) {
            member.feedTick = 0;
            const hungryFish = tankFishList.filter((f) => f.stage !== "egg" && (f.hunger || 0) > threshold);
            if (hungryFish.length > 0 && (((_t = tank.supplies) == null ? void 0 : _t.food) || 0) > 0) {
              const target = hungryFish.sort((a, b) => (b.hunger || 0) - (a.hunger || 0))[0];
              target.hunger = Math.max(0, (target.hunger || 0) - 40);
              tank.supplies.food -= 1;
              member.xp = (member.xp || 0) + 1;
            }
          }
        }
        if (member.role === "cleaner") {
          const threshold = roleDef.effect.wqThreshold[lvl] || 65;
          const restore = roleDef.effect.wqRestorePerTick[lvl] || 5e-3;
          if (tank.waterQuality < threshold) {
            tank.waterQuality = Math.min(100, tank.waterQuality + restore);
            member.xp = (member.xp || 0) + 1;
          }
        }
        if (member.role === "vet") {
          const cureChance = roleDef.effect.cureChancePerTick[lvl] || 1e-3;
          const diagTicks = roleDef.effect.diagnoseTicks[lvl] || 100;
          for (const f of tankFishList) {
            if (!f.disease) continue;
            if (!f.diagnosed && f.diseaseSince) {
              const diseaseDuration = (now2 - f.diseaseSince) / 1e3;
              if (diseaseDuration > diagTicks) {
                f.diagnosed = true;
                messages.push(`${member.name} diagnosed ${((_u = f.species) == null ? void 0 : _u.name) || "a fish"} with ${f.disease}.`);
                member.xp = (member.xp || 0) + 3;
              }
            }
            if (f.diagnosed && Math.random() < cureChance) {
              if (!f.immunities) f.immunities = [];
              f.immunities.push(f.disease);
              const diseaseName = f.disease;
              f.disease = null;
              f.diseaseSince = null;
              f.diagnosed = false;
              f.diseaseStage = null;
              messages.push(`${member.name} cured ${((_v = f.species) == null ? void 0 : _v.name) || "a fish"} of ${diseaseName}!`);
              member.xp = (member.xp || 0) + 5;
              break;
            }
          }
        }
      }
    }
    if (next.staff && next.staff.length > 0) {
      const gameDay = Math.floor((now2 - (((_w = next.player) == null ? void 0 : _w.firstPlayedAt) || now2)) / 864e5);
      if (gameDay > (next.lastWageDay || 0)) {
        let totalWages = 0;
        for (const s of next.staff) totalWages += getStaffWage(s);
        if (totalWages > 0) {
          next = { ...next, player: { ...next.player, coins: Math.max(0, next.player.coins - totalWages) }, lastWageDay: gameDay };
          messages.push(`Staff wages: -${totalWages} coins.`);
        }
      }
    }
    const passiveTick = (next.passiveTick || 0) + 1;
    if (passiveTick >= PASSIVE_INCOME_INTERVAL) {
      const passiveFishByTank = /* @__PURE__ */ new Map();
      for (const f of next.fish) {
        if (f.stage !== "adult") continue;
        passiveFishByTank.set(f.tankId, (passiveFishByTank.get(f.tankId) || 0) + 1);
      }
      let tip = 0;
      for (const tank of next.tanks) {
        const adultCount = passiveFishByTank.get(tank.id) || 0;
        if (adultCount === 0) continue;
        const placed = ((_y = (_x = tank.decorations) == null ? void 0 : _x.placed) == null ? void 0 : _y.length) || 0;
        const decorMult = 1 + Math.min(10, placed) * PASSIVE_DECOR_BONUS;
        const fameMult = 1 + (upgradeLevels.fame || 0) * 0.15;
        tip += Math.floor(tank.happiness / 100 * decorMult * PASSIVE_INCOME_BASE * fameMult * (researchFx.passiveIncome || 1));
      }
      if (tip > 0) {
        const incomeBoost = ((((_A = (_z = next.player) == null ? void 0 : _z.boosts) == null ? void 0 : _A.passiveIncome) || 0) > now2 ? 2 : 1) * (seasonalBonuses.passiveIncome || 1);
        const serviceMult = 1 + (upgradeLevels.service || 0) * 0.15;
        const boostedTip = Math.round(tip * incomeBoost * serviceMult);
        next = { ...next, player: { ...next.player, coins: next.player.coins + boostedTip, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + boostedTip } };
        messages.push(`Visitors left a ${boostedTip}-coin tip!${incomeBoost > 1 ? " (High Tide ×2!)" : ""}`);
        next = updateChallengeProgress(next, "earn_coins", { amount: boostedTip });
      }
      next = { ...next, passiveTick: 0 };
      if ((_B = next.giftShop) == null ? void 0 : _B.unlocked) {
        const rarities = new Set(next.fish.map((f) => {
          var _a2;
          return (_a2 = f.species) == null ? void 0 : _a2.rarity;
        }).filter(Boolean));
        const diversityBonus = rarities.size;
        const shopLevel = next.giftShop.level || 0;
        const shopIncome = Math.floor((3 + shopLevel * 2) * diversityBonus);
        if (shopIncome > 0) {
          next = {
            ...next,
            player: { ...next.player, coins: next.player.coins + shopIncome, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + shopIncome },
            giftShop: { ...next.giftShop, totalEarned: (next.giftShop.totalEarned || 0) + shopIncome }
          };
        }
      }
      if ((_C = next.cafe) == null ? void 0 : _C.unlocked) {
        const avgHappiness = next.tanks.length > 0 ? next.tanks.reduce((s, t) => s + (t.happiness || 0), 0) / next.tanks.length : 50;
        const cafeLevel = next.cafe.level || 0;
        const cafeIncome = Math.floor((2 + cafeLevel * 2) * (avgHappiness / 50));
        if (cafeIncome > 0) {
          next = {
            ...next,
            player: { ...next.player, coins: next.player.coins + cafeIncome, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + cafeIncome },
            cafe: { ...next.cafe, totalEarned: (next.cafe.totalEarned || 0) + cafeIncome }
          };
        }
      }
      const visitorFlow = computeVisitorFlow(next);
      const visitorSatisfaction = computeVisitorSatisfaction(next);
      next = { ...next, visitors: {
        current: visitorFlow.currentVisitors,
        perMin: visitorFlow.visitorsPerMin,
        satisfaction: visitorSatisfaction,
        totalToday: (((_D = next.visitors) == null ? void 0 : _D.totalToday) || 0) + visitorFlow.currentVisitors
      } };
      const autoMedicLevel = upgradeLevels.autoMedic || 0;
      if (autoMedicLevel > 0) {
        const cureChance = autoMedicLevel * 0.1;
        const cured = [];
        next = {
          ...next,
          fish: next.fish.map((f) => {
            var _a2;
            if (!f.disease || f.stage === "egg") return f;
            if (Math.random() < cureChance) {
              cured.push(((_a2 = f.species) == null ? void 0 : _a2.name) || "A fish");
              return { ...f, disease: null, diseaseSince: null, health: Math.min(100, f.health + 10) };
            }
            return f;
          })
        };
        if (cured.length > 0) {
          messages.push(`Auto-Medic cured ${cured.length} fish: ${cured.join(", ")}`);
          for (let i = 0; i < cured.length; i++) {
            next = updateChallengeProgress(next, "cure_fish");
          }
        }
      }
    } else {
      next = { ...next, passiveTick };
    }
    next = refreshDailyChallenges(next);
    next = refreshMarket(next);
    if (!next.wantedPosters) next.wantedPosters = [];
    const activePosters = next.wantedPosters.filter((p) => !p.fulfilled && p.expiresAt > now2);
    const level = Math.floor((((_E = next.player) == null ? void 0 : _E.xp) || 0) / 500) + 1;
    const maxPosters = Math.min(3, 1 + Math.floor(level / 8));
    if (activePosters.length < maxPosters) {
      const newPoster = generateWantedPoster(level, next.wantedPosters, now2);
      if (newPoster) next.wantedPosters = [...next.wantedPosters, newPoster];
    }
    const playAge = (now2 - (next.player.firstPlayedAt || now2)) / 1e3;
    for (const evt of EARLY_EVENTS) {
      if ((_F = next.player.tutorialFlags) == null ? void 0 : _F[evt.id]) continue;
      if (playAge < evt.afterSecs) continue;
      if (evt.condition && !evt.condition(next)) continue;
      const evtMsgs = [];
      next = evt.fire(next, evtMsgs);
      next = { ...next, player: { ...next.player, tutorialFlags: { ...next.player.tutorialFlags, [evt.id]: true } } };
      if (evtMsgs.length > 0) {
        const entries = evtMsgs.map((m) => typeof m === "string" ? { time: Date.now(), message: m } : { time: Date.now(), ...m });
        next = { ...next, log: [...entries, ...next.log].slice(0, 60) };
      }
    }
    const tanksWithAdults = new Set(next.fish.filter((f) => f.stage === "adult").map((f) => f.tankId));
    const happinessValues = next.tanks.filter((t) => tanksWithAdults.has(t.id)).map((t) => t.happiness || 0);
    next = updateChallengeProgress(next, "happiness_tick", { tanks: happinessValues });
    if (!next.player.nightWatchEarned) {
      const hour = (/* @__PURE__ */ new Date()).getHours();
      if (hour >= 23 || hour < 6) {
        if (next.fish.length > 0 && next.fish.every((f) => (f.health || 0) > 0)) {
          const NIGHT_REWARD = 500;
          next = {
            ...next,
            player: {
              ...next.player,
              coins: next.player.coins + NIGHT_REWARD,
              nightWatchEarned: true,
              achievements: [
                ...next.player.achievements || [],
                { id: "survived_night", unlockedAt: now2, reward: NIGHT_REWARD }
              ]
            }
          };
          messages.push("Achievement unlocked: Night Watch! All fish survived the night. +500");
        }
      }
    }
    next = processRandomEvent(next, messages);
    if (messages.length > 0) {
      const newEntries = messages.map(
        (m) => typeof m === "string" ? { time: Date.now(), message: m } : { time: Date.now(), ...m }
      );
      next = { ...next, log: [...newEntries, ...next.log].slice(0, 60) };
      const notifs = [...next.notifications || []];
      const NOTIF_PATTERNS = [
        { test: /died|has died/, type: "critical" },
        { test: /old age|reaching old age/, type: "warning" },
        { test: /contracted|looks unwell/, type: "critical" },
        { test: /inspection|fine|fined/, type: "warning" },
        { test: /review.*5\/5|World-Class/, type: "success" },
        { test: /newspaper|TV station|Magazine|National|World-renowned/, type: "success" },
        { test: /cured.*of/, type: "success" },
        { test: /Tourist bus|Celebrity/, type: "info" }
      ];
      for (const entry of newEntries) {
        const msg = entry.message || "";
        for (const p of NOTIF_PATTERNS) {
          if (p.test.test(msg)) {
            notifs.unshift({ id: Date.now() + Math.random(), message: msg, type: p.type, at: Date.now() });
            break;
          }
        }
      }
      if (notifs.length > 20) notifs.length = 20;
      next = { ...next, notifications: notifs };
    }
    const orderSeed = getDailyOrderSeed();
    if (orderSeed !== (next.lastOrderSeed || 0)) {
      next = { ...next, specialOrders: generateOrders(orderSeed), lastOrderSeed: orderSeed };
    }
    const weatherSeed = getWeatherSeed();
    if (weatherSeed !== (next.lastWeatherSeed || 0)) {
      next = { ...next, weather: getCurrentWeather(weatherSeed), lastWeatherSeed: weatherSeed };
    }
    if (now2 - (next.lastReviewAt || 0) > 9e5 && next.fish.length > 0) {
      const review = generateReview(next);
      const reviews = [review, ...next.reviews || []].slice(0, 10);
      next = { ...next, reviews, lastReviewAt: now2 };
      if (review.stars >= 4) messages.push(`New review: "${review.headline}" — ${review.stars}/5 stars!`);
      if (review.stars <= 2) messages.push(`Bad review: "${review.headline}" — only ${review.stars}/5 stars.`);
      const repGain = review.stars >= 4 ? 3 : review.stars >= 3 ? 1 : 0;
      if (repGain > 0) {
        next = { ...next, shop: { ...next.shop, reputation: Math.min(999, (next.shop.reputation || 0) + repGain) } };
      }
    }
    const rep = ((_G = next.shop) == null ? void 0 : _G.reputation) || 0;
    const repMilestones = ((_H = next.player) == null ? void 0 : _H.repMilestones) || {};
    const REP_THRESHOLDS = [
      { rep: 10, id: "local_feature", msg: "Local newspaper featured your aquarium! +50 coins, +5 reputation.", coins: 50, repBonus: 5, unlockSupplier: "tropical" },
      { rep: 25, id: "tv_coverage", msg: "TV station covered your aquarium! +150 coins, new suppliers unlocked!", coins: 150, repBonus: 10, unlockSupplier: "exotic" },
      { rep: 50, id: "magazine_award", msg: "Aquarium Magazine award! +300 coins, deep sea suppliers unlocked!", coins: 300, repBonus: 15, unlockSupplier: "deep_sea" },
      { rep: 100, id: "national_fame", msg: "National recognition! +500 coins, premier suppliers unlocked!", coins: 500, repBonus: 20, unlockSupplier: "premier" },
      { rep: 200, id: "world_renowned", msg: "World-renowned aquarium! +1000 coins, legendary collectors visit.", coins: 1e3, repBonus: 25 }
    ];
    for (const m of REP_THRESHOLDS) {
      if (rep >= m.rep && !repMilestones[m.id]) {
        next = {
          ...next,
          player: {
            ...next.player,
            coins: next.player.coins + m.coins,
            totalCoinsEarned: (next.player.totalCoinsEarned || 0) + m.coins,
            repMilestones: { ...repMilestones, [m.id]: true }
          },
          shop: { ...next.shop, reputation: Math.min(999, (next.shop.reputation || 0) + m.repBonus) }
        };
        if (m.unlockSupplier) {
          const unlocked = [...((_I = next.suppliers) == null ? void 0 : _I.unlocked) || ["basic"]];
          if (!unlocked.includes(m.unlockSupplier)) unlocked.push(m.unlockSupplier);
          next = { ...next, suppliers: { ...next.suppliers, unlocked } };
        }
        messages.push(m.msg);
      }
    }
    const loan = (_J = next.player) == null ? void 0 : _J.activeLoan;
    if (loan == null ? void 0 : loan.active) {
      const elapsed = (now2 - loan.takenAt) / 1e3;
      if (elapsed > loan.repayBy) {
        const sorted = [...next.fish].filter((f) => f.stage === "adult").sort((a, b) => {
          var _a2, _b2;
          return (((_a2 = b.species) == null ? void 0 : _a2.basePrice) || 0) - (((_b2 = a.species) == null ? void 0 : _b2.basePrice) || 0);
        });
        if (sorted.length > 0) {
          const seized = sorted[0];
          const seizedId = seized.id;
          next = {
            ...next,
            fish: next.fish.filter((f) => f.id !== seizedId),
            shop: {
              ...next.shop,
              listedFish: (next.shop.listedFish || []).filter((id) => id !== seizedId),
              fishPrices: Object.fromEntries(
                Object.entries(next.shop.fishPrices || {}).filter(([id]) => id !== seizedId)
              )
            },
            breedingTank: {
              ...next.breedingTank,
              slots: (next.breedingTank.slots || []).map((s) => s === seizedId ? null : s)
            },
            extraBays: (next.extraBays || []).map((bay) => ({
              ...bay,
              slots: (bay.slots || []).map((s) => s === seizedId ? null : s)
            })),
            player: { ...next.player, activeLoan: { active: false } }
          };
          messages.push(`Loan overdue! The bank seized your ${((_K = seized.species) == null ? void 0 : _K.name) || "fish"} as collateral!`);
        } else {
          next = { ...next, player: { ...next.player, activeLoan: { active: false } } };
          messages.push("Loan overdue! Debt forgiven — no fish to seize.");
        }
      }
    }
    if (next.urgentOffer && !isOfferActive(next.urgentOffer)) {
      messages.push(`The ${next.urgentOffer.name} offer expired! You missed out.`);
      next = { ...next, urgentOffer: null };
    }
    if (!next.urgentOffer) {
      const newOffer = rollUrgentOffer();
      if (newOffer) {
        next = { ...next, urgentOffer: newOffer };
        const mins = Math.round(newOffer.duration / 6e4);
        messages.push(`${newOffer.name}: ${newOffer.desc} Expires in ${mins} minutes!`);
      }
    }
    for (const f of next.fish) {
      if (f._discoveryChecked) continue;
      const disc = checkNewDiscovery(f, next.discoveries || []);
      if (disc) {
        next = { ...next, discoveries: [...next.discoveries || [], disc.key] };
        messages.push(`NEW DISCOVERY: ${disc.fishName} — a unique phenotype combination!`);
      }
      f._discoveryChecked = true;
    }
    if (next.fish.length > 200) {
      console.warn(`[Tick] Fish array capped: ${next.fish.length} → 200`);
      next.fish = next.fish.slice(0, 200);
    }
    if (next.memorials && next.memorials.length > 50) next.memorials.length = 50;
    if (next.wantedPosters && next.wantedPosters.length > 20) next.wantedPosters.length = 20;
    const _tips = ((_L = next.player) == null ? void 0 : _L.tutorialFlags) || {};
    _tip(
      "tip_disease",
      next.fish.some((f) => f.disease && !f.diagnosed),
      "TIP: A fish looks unwell! Go to its inspector and use Medicine or Diagnose to identify the disease."
    );
    _tip(
      "tip_wq_low",
      next.tanks.some((t) => t.waterQuality < 35),
      "TIP: Water quality is critical! Use Treat Water on the tank, or hire a Technician to maintain it."
    );
    _tip(
      "tip_tank_full",
      next.tanks.every((t) => {
        const cnt = next.fish.filter((f) => f.tankId === t.id).length;
        return cnt >= (t.capacity || 12);
      }) && next.fish.length >= 6,
      "TIP: All tanks are full! Sell some fish or unlock a new tank from the Market."
    );
    _tip(
      "tip_first_rare",
      next.fish.some((f) => {
        var _a2;
        return ((_a2 = f.species) == null ? void 0 : _a2.rarity) === "rare";
      }) && !_tips.tip_first_rare,
      "TIP: You discovered a Rare fish! Rare fish sell for 6x the base price. Keep breeding for Epic and Legendary!"
    );
    _tip(
      "tip_elder",
      next.fish.some((f) => f._elderLogged),
      "TIP: A fish is reaching old age. Breed replacements before it passes — check the Age bar in its inspector."
    );
    _tip(
      "tip_first_egg",
      (((_N = (_M = next.player) == null ? void 0 : _M.stats) == null ? void 0 : _N.eggsCollected) || 0) === 1,
      "TIP: Egg collected! It will hatch into a juvenile, then grow to adult. Speed controls (. key) can fast-forward."
    );
    _tip(
      "tip_wanted",
      (next.wantedPosters || []).some((p) => !p.fulfilled),
      "TIP: The Wanted Board has bounties! Check Market for fish requests with bonus coin rewards."
    );
    _tip(
      "tip_staff_idle",
      (next.staff || []).some((s) => !s.assignedTankId),
      "TIP: You have unassigned staff! Go to Office → Staff and assign them to a tank."
    );
    if (!((_O = next.player) == null ? void 0 : _O.trueEndingReached)) {
      const achievements = ((_P = next.player) == null ? void 0 : _P.achievements) || [];
      const magicFish = ((_Q = next.player) == null ? void 0 : _Q.magicFishFound) || [];
      const fishdex = ((_R = next.player) == null ? void 0 : _R.fishdex) || [];
      const rep2 = ((_S = next.shop) == null ? void 0 : _S.reputation) || 0;
      const prestige = ((_T = next.player) == null ? void 0 : _T.prestigeLevel) || 0;
      if (achievements.length >= 20 && magicFish.length >= 7 && fishdex.length >= 25 && rep2 >= 100 && prestige >= 1) {
        next = { ...next, player: { ...next.player, trueEndingReached: true }, _pendingTrueEnding: true };
        messages.push("You have mastered the aquarium! The ocean bows to your expertise. True Ending achieved!");
      }
    }
    const SNAPSHOT_INTERVAL_MS = 3e5;
    if (now2 - (next.lastSnapshotAt || 0) >= SNAPSHOT_INTERVAL_MS) {
      const snapshot = {
        t: now2,
        coins: next.player.coins,
        earned: next.player.totalCoinsEarned || 0,
        fish: next.fish.length,
        species: (next.player.fishdex || []).length,
        tanks: next.tanks.length,
        staff: (next.staff || []).length
      };
      const history = [...next.statsHistory || [], snapshot];
      if (history.length > 200) history.splice(0, history.length - 200);
      next = { ...next, statsHistory: history, lastSnapshotAt: now2 };
    }
    if (((_U = next.campaign) == null ? void 0 : _U.mode) === "campaign" && next.campaign.activeLevelId && !next.campaign.levelCompleted) {
      const level2 = _getCampaignLevel(next.campaign.activeLevelId);
      if (level2) {
        const allMet = level2.objectives.every((o) => checkObjective(o, next));
        if (allMet) {
          next = { ...next, campaign: { ...next.campaign, levelCompleted: true }, _pendingVictory: level2.id };
        }
      }
    }
    _tickCrashCount = 0;
    return next;
  } catch (err) {
    _tickCrashCount = (_tickCrashCount || 0) + 1;
    if (_tickCrashCount <= 3) {
      console.error(`[GameTick] Tick crashed (${_tickCrashCount}/3) — returning previous state:`, err);
    }
    if (_tickCrashCount >= 10) {
      console.error("[GameTick] 10+ consecutive crashes — pausing tick to prevent freeze");
      return { ...state, paused: true };
    }
    return state;
  }
}
let _tickCrashCount = 0;
function getCustomerInterval(state) {
  var _a, _b, _c;
  const repBonus = Math.min(0.5, (state.shop.reputation || 0) / 200);
  const adLevel = ((_b = (_a = state.shop.upgrades) == null ? void 0 : _a.reputation) == null ? void 0 : _b.level) || 0;
  const adBonus = adLevel * 0.15;
  const rFx = getResearchEffects(state);
  const seasonal = getActiveEvent();
  const seasonalCust = ((_c = seasonal == null ? void 0 : seasonal.bonuses) == null ? void 0 : _c.customerSpeed) || 1;
  return Math.round(CUSTOMER_BASE_INTERVAL_MS * (1 - Math.min(0.75, repBonus + adBonus)) * (rFx.customerSpeed || 1) / seasonalCust);
}
function pickCustomerType(state) {
  var _a, _b;
  const level = state.shop.level || 1;
  const rep = state.shop.reputation || 0;
  const vipLevel = ((_b = (_a = state.shop.upgrades) == null ? void 0 : _a.vip) == null ? void 0 : _b.level) || 0;
  const richRepThreshold = vipLevel >= 2 ? 10 : vipLevel >= 1 ? 25 : 50;
  const richLevelThreshold = vipLevel >= 3 ? 1 : 3;
  const pool = CUSTOMER_TYPES.filter((c) => {
    if (c.id === "rich" && (level < richLevelThreshold || rep < richRepThreshold)) return false;
    if (c.id === "collector" && level < 2) return false;
    return true;
  });
  const weighted = [...pool];
  if (vipLevel >= 1 && pool.some((c) => c.id === "rich")) {
    const rich = pool.find((c) => c.id === "rich");
    weighted.push(rich);
    if (vipLevel >= 3) weighted.push(rich);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}
function pickFishToBuy(listedFish, customer) {
  if (listedFish.length === 0) return null;
  const biasLevel = RARITY_ORDER[customer.rarityBias] ?? 0;
  const scored = listedFish.map((f) => {
    var _a;
    const diff = Math.abs((RARITY_ORDER[((_a = f.species) == null ? void 0 : _a.rarity) ?? "common"] ?? 0) - biasLevel);
    return { fish: f, score: Math.random() * 0.4 + 1 / (diff + 1) };
  }).sort((a, b) => b.score - a.score);
  return scored[0].fish;
}
function processCustomerVisit(state, messages) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  const customer = pickCustomerType(state);
  const fishById = /* @__PURE__ */ new Map();
  for (const f of state.fish) fishById.set(f.id, f);
  const tankById = /* @__PURE__ */ new Map();
  for (const t of state.tanks) tankById.set(t.id, t);
  const lightingBonus = 1 + (((_b = (_a = state.shop.upgrades) == null ? void 0 : _a.lighting) == null ? void 0 : _b.level) || 0) * 0.1;
  const listedFish = [];
  for (const id of state.shop.listedFish) {
    const f = fishById.get(id);
    if (!f) continue;
    const fishTank3 = tankById.get(f.tankId);
    const tankBonus2 = getTankBonuses(fishTank3 == null ? void 0 : fishTank3.type).salePriceMult || 1;
    const happiness2 = (fishTank3 == null ? void 0 : fishTank3.happiness) ?? 100;
    const happBonus2 = 1 + happiness2 / 100 * 0.2;
    const maxAge = LIFESPAN_BY_RARITY[((_c = f.species) == null ? void 0 : _c.rarity) || "common"] || LIFESPAN_BY_RARITY.common;
    const ageFraction = Math.min(1, (f.age || 0) / maxAge);
    const vetBonus = ageFraction > 0.5 ? 1 + (ageFraction - 0.5) * 0.4 : 1;
    const autoPrice2 = Math.round((((_d = f.species) == null ? void 0 : _d.basePrice) ?? 10) * (f.health / 100) * happBonus2 * tankBonus2 * lightingBonus * vetBonus * getMarketMultiplier(f, state.market));
    const askPrice2 = ((_e = state.shop.fishPrices) == null ? void 0 : _e[id]) ?? autoPrice2;
    const budget = Math.round(askPrice2 * customer.budgetMult);
    if (budget >= Math.round(askPrice2 * 0.65)) listedFish.push(f);
  }
  if (listedFish.length === 0) return state;
  const fish = pickFishToBuy(listedFish, customer);
  if (!fish) return state;
  const fishTank2 = tankById.get(fish.tankId);
  const tankBonus = getTankBonuses(fishTank2 == null ? void 0 : fishTank2.type).salePriceMult || 1;
  const happiness = (fishTank2 == null ? void 0 : fishTank2.happiness) ?? 100;
  const happBonus = 1 + happiness / 100 * 0.2;
  const marketMult = getMarketMultiplier(fish, state.market);
  const autoPrice = Math.round((((_f = fish.species) == null ? void 0 : _f.basePrice) ?? 10) * (fish.health / 100) * happBonus * tankBonus * lightingBonus * marketMult);
  const askPrice = ((_g = state.shop.fishPrices) == null ? void 0 : _g[fish.id]) ?? autoPrice;
  const maxBudget = Math.round(askPrice * customer.budgetMult);
  let finalPrice = askPrice;
  let priceNote = "";
  const overBudget = askPrice > maxBudget;
  if (overBudget && customer.haggle > 0 && Math.random() < customer.haggle) {
    const offer2 = Math.round(maxBudget * (0.85 + Math.random() * 0.15));
    finalPrice = offer2;
    priceNote = ` (haggled down from ${askPrice})`;
  } else if (overBudget) {
    finalPrice = maxBudget;
    priceNote = ` (paid max budget, asked ${askPrice})`;
  } else if (askPrice < autoPrice * 0.7) {
    priceNote = ` (bargain price!)`;
  }
  let greeting = ((_h = customer.greetings) == null ? void 0 : _h[Math.floor(Math.random() * customer.greetings.length)]) || "";
  const CUSTOMER_HINTS = [
    "I heard if you breed two glowing fish, something magical happens to their offspring...",
    "A friend told me — breed two Albinos near an Ultraviolet fish, and you might see crystal...",
    "Some say Melanistic pairs bred at night produce fish that contain the stars themselves.",
    "I once saw a fish with a rainbow shimmer. The breeder said both parents had glowing genes.",
    "They call it the Phoenix mutation. Something about mixing rare mutants with purebred stock...",
    "My cousin breeds fish. She says purity matters — purebred fish are worth triple!",
    "Have you tried breeding for specific traits? Check those recessive genes carefully!",
    "The rarest fish in the world have every gene perfected. Seven out of seven, pure."
  ];
  if (Math.random() < 0.08) {
    greeting = CUSTOMER_HINTS[Math.floor(Math.random() * CUSTOMER_HINTS.length)];
  }
  if (!state.pendingHaggle && customer.haggle > 0 && Math.random() < 0.35) {
    const haggleOffer = Math.round(finalPrice * (0.75 + Math.random() * 0.2));
    return {
      ...state,
      pendingHaggle: {
        id: Date.now(),
        fishId: fish.id,
        fishName: fish.nickname || ((_i = fish.species) == null ? void 0 : _i.name) || "Unknown Fish",
        askPrice,
        offer: haggleOffer,
        maxBudget,
        customerName: customer.name,
        customerEmoji: customer.emoji,
        customerId: customer.id,
        greeting
      },
      shop: { ...state.shop, lastCustomerAt: now }
    };
  }
  const salePriceBoost = (((_k = (_j = state.player) == null ? void 0 : _j.boosts) == null ? void 0 : _k.salePrice) || 0) > now ? 1.25 : 1;
  const researchSaleBonus = getResearchEffects(state).saleBonus || 1;
  const roomSaleBonus = getRoomBonus(state, fish.tankId).saleMult || 1;
  const streakMult = getStreakMultiplier(((_l = state.player) == null ? void 0 : _l.dailyStreak) || 0);
  let urgentMult = 1;
  const offer = state.urgentOffer;
  if (offer && isOfferActive(offer)) {
    const rarityMatch = !offer.targetRarity || offer.targetRarity.includes((_m = fish.species) == null ? void 0 : _m.rarity);
    const speciesMatch = !offer.requiresSpecies || ((_n = fish.species) == null ? void 0 : _n.visualType) === "species";
    if (rarityMatch && speciesMatch) urgentMult = offer.multiplier;
  }
  const totalSales = (((_o = state.shop.salesHistory) == null ? void 0 : _o.length) || 0) + 1;
  const jackpot = checkJackpot(totalSales);
  const jackpotMult = jackpot ? jackpot.multiplier : 1;
  const earnedCoins = Math.max(1, Math.round(finalPrice * salePriceBoost * researchSaleBonus * roomSaleBonus * streakMult * urgentMult * jackpotMult));
  if (jackpot) messages.push(`${jackpot.label} ${jackpotMult}× payout on this sale! ${earnedCoins}`);
  if (urgentMult > 1) messages.push(`Urgent buyer paid ${urgentMult}× premium!`);
  const repGain = Math.ceil((((_p = fish.species) == null ? void 0 : _p.rarityScore) ?? 5) / 10) + (askPrice > autoPrice ? 1 : 0);
  messages.push(`${customer.emoji} ${customer.name}: "${greeting}" — bought your ${((_q = fish.species) == null ? void 0 : _q.name) || "fish"} for ${earnedCoins}${priceNote}!`);
  const fishPrices = { ...state.shop.fishPrices || {} };
  delete fishPrices[fish.id];
  const saleXp = ((_r = fish.species) == null ? void 0 : _r.rarity) === "epic" ? 50 : ((_s = fish.species) == null ? void 0 : _s.rarity) === "rare" ? 25 : 10;
  const soldState = {
    ...state,
    player: {
      ...state.player,
      coins: state.player.coins + earnedCoins,
      totalCoinsEarned: (state.player.totalCoinsEarned || 0) + earnedCoins,
      xp: (state.player.xp || 0) + saleXp
    },
    fish: state.fish.filter((f) => f.id !== fish.id),
    shop: {
      ...state.shop,
      listedFish: state.shop.listedFish.filter((id) => id !== fish.id),
      fishPrices,
      lastCustomerAt: now,
      reputation: Math.min(999, (state.shop.reputation || 0) + repGain),
      salesHistory: [
        {
          time: Date.now(),
          type: "sale",
          customerName: customer.name,
          customerEmoji: customer.emoji,
          fishName: ((_t = fish.species) == null ? void 0 : _t.name) || "Unknown",
          fishRarity: ((_u = fish.species) == null ? void 0 : _u.rarity) || "common",
          coins: earnedCoins,
          askPrice
        },
        ...state.shop.salesHistory || []
      ].slice(0, 20)
    }
  };
  const afterSell = updateChallengeProgress(soldState, "sell", { rarity: ((_v = fish.species) == null ? void 0 : _v.rarity) || "common" });
  return updateChallengeProgress(afterSell, "earn_coins", { amount: earnedCoins });
}
const OFFLINE_FOUND_ITEMS = [
  { id: "pearl_snail", label: "Pearl Snail Shell", emoji: "", desc: "A lustrous spiral shell left behind by a passing snail." },
  { id: "driftwood", label: "Smooth Driftwood", emoji: "", desc: "Worn smooth by current. Would look great in any tank." },
  { id: "mystery_stone", label: "Glowing Pebble", emoji: "", desc: "Faintly luminescent. No one knows why." },
  { id: "ancient_coin", label: "Ancient Coin", emoji: "", desc: "A corroded coin of unknown origin. Worth keeping." },
  { id: "kelp_fragment", label: "Rare Kelp Sprig", emoji: "", desc: "A cutting from a deep-water kelp variety." },
  { id: "glass_float", label: "Glass Float", emoji: "", desc: "An old fisherman's float, perfectly preserved." }
];
const OFFLINE_MESSAGES = [
  { type: "calm", text: "The tanks were peaceful.", emoji: "" },
  { type: "calm", text: "Everything stayed in order.", emoji: "" },
  { type: "calm", text: "Your fish hardly noticed you were gone.", emoji: "" },
  { type: "curious", text: "The fish seemed restless near the glass.", emoji: "" },
  { type: "curious", text: "An unusual current stirred the water briefly.", emoji: "" },
  { type: "curious", text: "The lights flickered for a moment, then steadied.", emoji: "" }
];
function generateOfflineEvent(state, secondsAway) {
  var _a, _b, _c, _d;
  const minutes = secondsAway / 60;
  if (minutes < 5) return null;
  const roll = Math.random();
  const eventChance = Math.min(0.85, 0.3 + minutes / 120 * 0.55);
  if (roll > eventChance) return null;
  const eventRoll = Math.random();
  const fishCountByTank = /* @__PURE__ */ new Map();
  for (const f of state.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
  const tankId = ((_a = state.tanks.reduce((best, t) => {
    const free = (t.capacity || 12) - (fishCountByTank.get(t.id) || 0);
    const bestFree = (best.capacity || 12) - (fishCountByTank.get(best.id) || 0);
    return free > bestFree ? t : best;
  }, state.tanks[0])) == null ? void 0 : _a.id) || "tank_0";
  if (eventRoll < 0.3) {
    const targetRarity = Math.random() < 0.6 ? "uncommon" : "rare";
    const visitor = createFish({ stage: "adult", tankId, targetRarity, now });
    return {
      type: "visitor",
      emoji: "",
      headline: "A visitor arrived!",
      detail: `A wild **${((_b = visitor.species) == null ? void 0 : _b.name) || "fish"}** (${((_c = visitor.species) == null ? void 0 : _c.rarity) || "common"}) swam in through a gap in the lid and decided to stay.`,
      fish: visitor
    };
  }
  if (eventRoll < 0.7) {
    const item2 = OFFLINE_FOUND_ITEMS[Math.floor(Math.random() * OFFLINE_FOUND_ITEMS.length)];
    const bonus = Math.floor(15 + Math.random() * 40);
    return {
      type: "found_item",
      emoji: item2.emoji,
      headline: `Found: ${item2.label}`,
      detail: item2.desc,
      coinBonus: bonus,
      itemId: item2.id
    };
  }
  const juveniles = state.fish.filter((f) => f.stage === "juvenile" || f.stage === "egg");
  if (juveniles.length > 0) {
    const subject = juveniles[Math.floor(Math.random() * juveniles.length)];
    return {
      type: "mutation",
      emoji: "",
      headline: "Spontaneous mutation!",
      detail: `**${((_d = subject.species) == null ? void 0 : _d.name) || "A fish"}** developed an unusual shimmer during the night. Its value may be higher than expected.`,
      fishId: subject.id
    };
  }
  const item = OFFLINE_FOUND_ITEMS[Math.floor(Math.random() * OFFLINE_FOUND_ITEMS.length)];
  return {
    type: "found_item",
    emoji: item.emoji,
    headline: `Found: ${item.label}`,
    detail: item.desc,
    coinBonus: Math.floor(15 + Math.random() * 35),
    itemId: item.id
  };
}
function applyOfflineProgress(state) {
  var _a, _b, _c, _d;
  const now2 = (state.gameClock || Date.now()) + secondsElapsed * 1e3;
  const elapsed = now2 - (state.lastTickAt || now2);
  const tankSitterLevel = ((_c = (_b = (_a = state.shop) == null ? void 0 : _a.upgrades) == null ? void 0 : _b.tankSitter) == null ? void 0 : _c.level) || 0;
  const maxOfflineSecs = BASE_OFFLINE_SECONDS + tankSitterLevel * TANK_SITTER_BONUS_SECONDS;
  const secondsElapsed = Math.min(Math.floor(elapsed / 1e3), maxOfflineSecs);
  if (secondsElapsed < 5) return state;
  let next = { ...state };
  let eggsHatched = 0, fishGrown = 0, coinsEarned = 0, fishSold = 0;
  next = {
    ...next,
    tanks: next.tanks.map((t) => ({
      ...t,
      waterQuality: Math.max(0, t.waterQuality - WATER_DECAY_RATE * secondsElapsed)
    }))
  };
  const updatedFish = next.fish.map((fish) => {
    var _a2, _b2, _c2;
    let f = { ...fish };
    f.age = Math.max(0, Math.floor((now2 - (f.bornAt || now2)) / 1e3));
    const tank = next.tanks.find((t) => t.id === f.tankId);
    const bonuses = getTankBonuses(tank == null ? void 0 : tank.type);
    if (f.stage !== "egg") {
      f.hunger = Math.min(100, (f.hunger || 0) + HUNGER_RATE * secondsElapsed);
      if (f.hunger >= 90) f.health = Math.max(0, f.health - HEALTH_HUNGER_DMG * secondsElapsed * 0.5);
      if (f.disease) {
        const stage = getDiseaseStage(f.diseaseSince, now2);
        const dmg = getDiseaseDamage(f.disease, stage);
        if (dmg > 0) f.health = Math.max(0, f.health - dmg * secondsElapsed * 0.5);
      }
    }
    let remaining = secondsElapsed * 1e3;
    let stageStart = f.stageStartedAt;
    const lastTick = state.lastTickAt || now2;
    const hatcheryLevel = ((_c2 = (_b2 = (_a2 = next.shop) == null ? void 0 : _a2.upgrades) == null ? void 0 : _b2.hatchery) == null ? void 0 : _c2.level) || 0;
    const hatcheryMult = 1 - hatcheryLevel * 0.15;
    const growMult = (bonuses.growSpeedMult || 1) * hatcheryMult;
    if (f.stage === "egg") {
      const timeAlready = lastTick - stageStart;
      const timeToHatch = Math.max(0, GROWTH_STAGES.egg.durationMs * growMult - timeAlready);
      if (remaining >= timeToHatch) {
        f.stage = "juvenile";
        remaining -= timeToHatch;
        stageStart = now2 - remaining;
        eggsHatched++;
      }
    }
    if (f.stage === "juvenile") {
      const timeAlready = now2 - stageStart;
      const timeToGrow = Math.max(0, GROWTH_STAGES.juvenile.durationMs * growMult - timeAlready);
      if (timeToGrow === 0) {
        f.stage = "adult";
        stageStart = now2;
        fishGrown++;
      }
    }
    f.stageStartedAt = stageStart;
    return f;
  });
  next = { ...next, fish: updatedFish };
  const offlineDeadFish = next.fish.filter((f) => f.stage !== "egg" && f.health <= 0);
  if (offlineDeadFish.length > 0) {
    const deadIds = new Set(offlineDeadFish.map((f) => f.id));
    const offTankById = /* @__PURE__ */ new Map();
    for (const t of next.tanks) offTankById.set(t.id, t);
    const offlineAutopsies = offlineDeadFish.map((f) => {
      var _a2, _b2;
      const tank = offTankById.get(f.tankId);
      return {
        id: crypto.randomUUID(),
        fishName: ((_a2 = f.species) == null ? void 0 : _a2.name) || "Unknown",
        rarity: ((_b2 = f.species) == null ? void 0 : _b2.rarity) || "common",
        phenotype: f.phenotype,
        genome: f.genome,
        diedAt: now2,
        ageMinutes: Math.floor((f.age || 0) / 60),
        cause: f.hunger >= 90 ? "Starvation (offline)" : "Poor conditions (offline)",
        detail: "Fish died while you were away.",
        tankName: (tank == null ? void 0 : tank.name) || "Unknown Tank",
        waterQuality: Math.round((tank == null ? void 0 : tank.waterQuality) ?? 0),
        hunger: Math.round(f.hunger || 0),
        disease: f.disease || null
      };
    });
    next = {
      ...next,
      fish: next.fish.filter((f) => !deadIds.has(f.id)),
      shop: {
        ...next.shop,
        listedFish: next.shop.listedFish.filter((id) => !deadIds.has(id)),
        fishPrices: Object.fromEntries(
          Object.entries(next.shop.fishPrices || {}).filter(([id]) => !deadIds.has(id))
        )
      },
      breedingTank: {
        ...next.breedingTank,
        slots: next.breedingTank.slots.map((s) => deadIds.has(s) ? null : s)
      },
      extraBays: (next.extraBays || []).map((bay) => {
        var _a2, _b2;
        const slot0Dead = deadIds.has((_a2 = bay.slots) == null ? void 0 : _a2[0]);
        const slot1Dead = deadIds.has((_b2 = bay.slots) == null ? void 0 : _b2[1]);
        if (!slot0Dead && !slot1Dead) return bay;
        return {
          ...bay,
          slots: (bay.slots || []).map((s) => deadIds.has(s) ? null : s),
          storedGenomeA: slot0Dead ? null : bay.storedGenomeA,
          storedGenomeB: slot1Dead ? null : bay.storedGenomeB,
          breedingStartedAt: slot0Dead || slot1Dead ? null : bay.breedingStartedAt,
          eggReady: slot0Dead || slot1Dead ? false : bay.eggReady
        };
      }),
      player: {
        ...next.player,
        autopsies: [...next.player.autopsies || [], ...offlineAutopsies].slice(0, 50)
      }
    };
  }
  const customerInterval = getCustomerInterval(next);
  const startingListedCount = next.shop.listedFish.length;
  const actualVisits = Math.min(
    Math.floor(secondsElapsed * 1e3 / customerInterval),
    startingListedCount * 3,
    15
  );
  for (let i = 0; i < actualVisits && next.shop.listedFish.length > 0; i++) {
    const msgs = [];
    const prevCoins = next.player.coins;
    next = processCustomerVisit(next, msgs);
    const earned = next.player.coins - prevCoins;
    if (earned > 0) {
      coinsEarned += earned;
      fishSold++;
    }
  }
  const bt = next.breedingTank;
  if (bt.breedingStartedAt && !bt.eggReady && now2 - bt.breedingStartedAt >= (bt.breedingDurationMs || 3e5)) {
    next = { ...next, breedingTank: { ...bt, eggReady: true } };
  }
  if (((_d = next.extraBays) == null ? void 0 : _d.length) > 0) {
    next = { ...next, extraBays: next.extraBays.map((bay) => {
      if (bay.breedingStartedAt && !bay.eggReady && now2 - bay.breedingStartedAt >= (bay.breedingDurationMs || 3e5)) {
        return { ...bay, eggReady: true };
      }
      return bay;
    }) };
  }
  const offlineEvent = generateOfflineEvent(state, secondsElapsed);
  if (offlineEvent) {
    if (offlineEvent.type === "visitor" && offlineEvent.fish) {
      const tank = next.tanks.find((t) => t.id === offlineEvent.fish.tankId);
      const count = next.fish.filter((f) => f.tankId === offlineEvent.fish.tankId).length;
      if (count < ((tank == null ? void 0 : tank.capacity) || 12)) {
        next = { ...next, fish: [...next.fish, offlineEvent.fish] };
      }
    }
    if (offlineEvent.type === "found_item" && offlineEvent.coinBonus) {
      coinsEarned += offlineEvent.coinBonus;
      next = { ...next, player: { ...next.player, coins: next.player.coins + offlineEvent.coinBonus, totalCoinsEarned: (next.player.totalCoinsEarned || 0) + offlineEvent.coinBonus } };
    }
    if (offlineEvent.type === "mutation" && offlineEvent.fishId) {
      next = {
        ...next,
        fish: next.fish.map(
          (f) => {
            var _a2;
            return f.id === offlineEvent.fishId ? { ...f, species: { ...f.species, basePrice: Math.round((((_a2 = f.species) == null ? void 0 : _a2.basePrice) ?? 10) * 1.5) }, _mutated: true } : f;
          }
        )
      };
    }
  }
  next = { ...next, lastTickAt: now2 };
  const minutes = Math.round(secondsElapsed / 60);
  const timeLabel = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  const ambientMsg = OFFLINE_MESSAGES[Math.floor(Math.random() * OFFLINE_MESSAGES.length)];
  const offlineSummary = {
    timeAway: timeLabel,
    secondsAway: secondsElapsed,
    eggsHatched,
    fishGrown,
    coinsEarned,
    fishSold,
    waterQualityLost: Math.round(WATER_DECAY_RATE * secondsElapsed),
    fishDied: offlineDeadFish.length,
    offlineEvent,
    ambientMessage: ambientMsg,
    hasEvents: eggsHatched > 0 || fishGrown > 0 || coinsEarned > 0 || offlineDeadFish.length > 0 || !!offlineEvent
  };
  next = { ...next, offlineSummary };
  if (offlineSummary.hasEvents) {
    const parts = [];
    if (eggsHatched) parts.push(`${eggsHatched} egg${eggsHatched > 1 ? "s" : ""} hatched`);
    if (fishGrown) parts.push(`${fishGrown} fish grew up`);
    if (fishSold) parts.push(`sold ${fishSold} fish for ${coinsEarned}`);
    next = addLog(next, `Back after ${timeLabel}! ${parts.join(", ")}.`);
  } else {
    next = addLog(next, `Back after ${timeLabel}. Your tanks are peaceful.`);
  }
  next = { ...next, gameClock: now2, lastTickAt: Date.now() };
  return next;
}
const REAL_SPECIES = [
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : deep rounded body, stubby rounded fins,
    //              almost no taper toward tail. Very compact.
    // Markings   : exactly 3 white bars — head (just behind eye),
    //              mid-body, tail base — each with thin black
    //              outlines. Bars taper slightly at top and bottom
    //              to follow body curve.
    // Palette    : vivid orange #e8621a with warm yellow highlight
    //              #f5a030 top-left, white bars #f5f0e8 with
    //              cool-shadow tint, black outlines #1a0f08.
    // Personality: short erratic darts + hovering pauses,
    //              prefers lower-mid tank, stays near anemones.
    // ────────────────────────────────────────────────────────
    key: "clownfish",
    name: "Clownfish",
    scientificName: "Amphiprion ocellaris",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 120,
    colorVariants: ["default", "cinnabar", "snowflake", "melanistic", "platinum", "midnight"],
    lore: "Found sheltering among the stinging tentacles of sea anemones, the clownfish is coated in a special mucus that makes it immune. A fearless defender of its home.",
    habitat: "Indo-Pacific coral reefs, 1–15m depth",
    funFact: "All clownfish are born male. The dominant fish in a group can change sex to become female.",
    conservationStatus: "Least Concern (vulnerable to bleaching events)",
    behaviorProfile: {
      swimSpeed: 0.55,
      turnChance: 0.045,
      bobAmplitude: 0.012,
      preferredYRange: [45, 78],
      idleProbability: 0.35,
      dartiness: 0.7
    }
  },
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : oval laterally-compressed body, taller than
    //              long. Prominent forked tail. Dorsal and anal
    //              fins run almost full body length giving a
    //              high-finned elegant profile. Blunt face.
    // Markings   : royal blue body, bold black lateral stripe
    //              arcing from eye through mid-body to tail base
    //              (a single sweeping brushstroke, not a stripe).
    //              Yellow tail and yellow pectoral fin base streak.
    //              Small yellow teardrop patch near tail spine.
    // Palette    : royal blue #1a6fce, deep navy shadow #0d3a7a,
    //              highlight #4a9fe8. Black stripe #0a0a12.
    //              Yellow tail #f5c820, yellow highlight #ffe060.
    // Personality: broad sweeping arcs, full tank height, active,
    //              rarely idle, prefers mid-to-upper water column.
    // ────────────────────────────────────────────────────────
    key: "bluetang",
    name: "Blue Tang",
    scientificName: "Paracanthurus hepatus",
    rarity: "rare",
    visualType: "species",
    basePrice: 280,
    colorVariants: ["default", "gold", "midnight", "albino"],
    lore: 'The blue tang carries a sharp spine near its tail — a scalpel-like defence that gives its family the name "surgeonfish". In the wild it roams coral reefs in loose schools, grazing on algae.',
    habitat: "Indo-Pacific coral reefs, 2–40m depth",
    funFact: "Blue tangs can change shade — they go pale when stressed or sleeping, and return to vivid blue when active.",
    conservationStatus: "Least Concern",
    behaviorProfile: {
      swimSpeed: 0.8,
      turnChance: 0.022,
      bobAmplitude: 0.018,
      preferredYRange: [15, 65],
      idleProbability: 0.08,
      dartiness: 0.2
    }
  },
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : slender torpedo body — much longer than tall.
    //              Dramatic veil tail fans wide (nearly body-height),
    //              deeply forked with long trailing lobes that
    //              taper to fine filaments. Dorsal fin tall and
    //              sail-like, rising from mid-back. Long flowing
    //              pectoral fins drape downward. Anal fin runs
    //              the full belly length, trailing behind.
    //              Head is small and pointed with upturned mouth.
    // Markings   : iridescent scale shimmer overlaid on base colour.
    //              Gill plate has a single teal scale-flash patch.
    //              Fin membranes carry faint darker banding near
    //              edges that gives a translucent, layered look.
    //              No bars or stripes — colour is the marking.
    // Palette    : deep crimson-red body #8c1a1a, warm highlight
    //              #c83030, belly lightens to #d44040. Fins are
    //              same deep red fading to near-black #3a0808 at
    //              tips. Iridescent teal sheen #20c8b0 overlaid
    //              at 25–35% on scales. Eye ring teal #20c8b0.
    // Personality: slow regal drift, frequent turns, patrols a
    //              narrow mid-tank horizontal band, flares fins
    //              briefly when near another fish, rarely idles.
    // ────────────────────────────────────────────────────────
    key: "betta",
    name: "Betta",
    scientificName: "Betta splendens",
    rarity: "rare",
    visualType: "species",
    basePrice: 320,
    colorVariants: ["default", "cobalt", "emerald", "albino"],
    lore: "Known as the Siamese fighting fish, the betta has been selectively bred for centuries into an astonishing variety of fin shapes and colour morphs. Each fish is a living work of art — and fiercely territorial.",
    habitat: "Shallow rice paddies and slow streams of Southeast Asia",
    funFact: "Bettas breathe air directly using a specialised organ called the labyrinth, letting them survive in oxygen-poor water.",
    conservationStatus: "Vulnerable (wild populations declining due to habitat loss)",
    behaviorProfile: {
      swimSpeed: 0.38,
      turnChance: 0.038,
      bobAmplitude: 0.022,
      preferredYRange: [30, 65],
      idleProbability: 0.18,
      dartiness: 0.12
    }
  },
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : almost perfectly equilateral triangle viewed
    //              from the side. Body is extremely laterally
    //              compressed and taller than long. Dorsal and
    //              anal fins extend the triangle upward and
    //              downward symmetrically, each ending in a long
    //              soft filament. Tail fin is small and lyre-shaped
    //              — short, slightly forked, with trailing filament
    //              tips on top and bottom rays. Pectoral fins are
    //              narrow and translucent. Mouth is small, slightly
    //              upturned. Profile is unmistakably triangular.
    // Markings   : silver-white base body. Three bold vertical black
    //              bars: one through the eye (eye bar), one at the
    //              mid-body (widest), one at the tail base (narrow).
    //              A fourth partial bar sometimes appears — omitted
    //              here for clarity. Bars taper to fine edges where
    //              they cross the upper and lower fin margins.
    //              Fine black margin line along dorsal and anal fin
    //              outer edges. No horizontal markings.
    // Palette    : body silver-white #d8e8f0 with warm yellow-gold
    //              iridescence #d4c070 on forehead and flanks at
    //              low opacity. Shadow flanks cool grey #8090a0.
    //              Black bars #141820. Fins translucent silver
    //              #b8ccd8 with black margin lines. Tail filaments
    //              fade to near-transparent.
    // Personality: slow stately vertical undulation, patrols full
    //              tank height with long unhurried sweeps, favours
    //              mid-column, rarely darts, often glides and holds.
    // ────────────────────────────────────────────────────────
    key: "angelfish",
    name: "Angelfish",
    scientificName: "Pterophyllum scalare",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 180,
    colorVariants: ["default", "gold", "marble", "smoky"],
    lore: "The freshwater angelfish has been a centrepiece of the aquarium hobby for over a century. Its triangular profile and regal bearing make it one of the most recognisable fish in the world — despite being a cichlid at heart.",
    habitat: "Amazon Basin slow-moving rivers and flooded forests, 0–10m depth",
    funFact: "Angelfish form devoted mating pairs and both parents guard their eggs fiercely, fanning them with their fins to keep the water oxygenated.",
    conservationStatus: "Least Concern",
    behaviorProfile: {
      swimSpeed: 0.42,
      turnChance: 0.018,
      bobAmplitude: 0.03,
      preferredYRange: [28, 70],
      // tightened from [20,75] — tall sprite clips tank edges
      idleProbability: 0.22,
      dartiness: 0.08
    }
  },
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : deep rounded body, nearly as tall as long.
    //              Fancy/ryukin body type with pronounced dorsal
    //              hump. Small head relative to body. Twin veil
    //              butterfly tail — two broad lobes, each wide
    //              and rounded. Tall triangular dorsal sail fin.
    //              Large wing-like pectoral fins.
    // Markings   : solid warm orange-gold with cream-gold belly.
    //              Scale texture catches light as rhombus glints.
    //              No bars or stripes — colour IS the marking.
    //              Colour variants: kohaku (white+red cap),
    //              calico (blotched), black (melanistic moor).
    // Palette    : body #e8820a, belly #f8c868, hump #c86008,
    //              fin #c86808 / #e8a020, glint #fff8d0.
    // Personality: slow graceful loops, prefers lower half of
    //              tank, gentle bob, occasionally flicks tail.
    // ────────────────────────────────────────────────────────
    key: "goldfish",
    name: "Goldfish",
    scientificName: "Carassius auratus",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 90,
    lore: "Selectively bred in China over a thousand years from wild carp, the goldfish was the first fish ever kept purely for ornamental purposes. Fancy varieties like the ryukin and oranda remain among the most popular aquarium fish on Earth.",
    habitat: "Originally slow-moving freshwater rivers and ponds of East Asia; now worldwide in aquaria and garden ponds",
    funFact: "Goldfish do not have a three-second memory — they can be trained to navigate mazes and remember them months later.",
    conservationStatus: "Not Evaluated (domesticated species)",
    colorVariants: ["default", "kohaku", "calico", "black"],
    behaviorProfile: {
      swimSpeed: 0.38,
      turnChance: 0.028,
      bobAmplitude: 0.022,
      preferredYRange: [50, 85],
      idleProbability: 0.3,
      dartiness: 0.1
    }
  },
  {
    // ── DESIGN AUDIT ────────────────────────────────────────
    // Silhouette : small elongated torpedo body with a huge
    //              fan-like dorsal fin that dominates the profile.
    //              Blunt head with downturned froggy mouth. Body
    //              tapers to a narrow squared-off tail. Pectoral
    //              fins large, wing-like and splayed outward.
    // Markings   : THE psychedelic fish. Electric blue body
    //              covered in dense orange-red maze/labyrinth
    //              pattern — irregular closed cells like stained
    //              glass. Dorsal fin carries the same pattern with
    //              more elongated cells. Tail fin: blue with orange
    //              spots. Pectorals: translucent blue-green.
    //              Bright yellow iris — distinctive and striking.
    //              Variants: psychedelic (default), red-phase,
    //              ghost (melanistic).
    // Palette    : base #0a4ab8, mid #1260d8, hi #20a0f0.
    //              Maze orange #f07010 / edge #e84808.
    //              Shimmer green #20d080. Eye #f8d820.
    // Personality: slow deliberate walk/hop along tank bottom,
    //              occasionally rises and drifts, very low in
    //              tank, uses pectorals to "walk". Rests often.
    // ────────────────────────────────────────────────────────
    key: "mandarin_dragonet",
    name: "Mandarin Dragonet",
    scientificName: "Synchiropus splendidus",
    rarity: "epic",
    visualType: "species",
    basePrice: 1200,
    lore: "Widely considered the most beautiful fish in the ocean, the Mandarin Dragonet's psychedelic blue-and-orange maze pattern is produced not by pigment cells but by specialised pigmented cells called cyanophores — rare in fish. It is cloaked in a noxious mucus that deters nearly all predators.",
    habitat: "Indo-Pacific coral reefs, sheltered lagoons and inshore reefs, 1–18m depth",
    funFact: "Mandarin Dragonets have no scales — instead their body is coated in a pungent, bitter mucus so toxic that even other fish avoid eating them.",
    conservationStatus: "Least Concern (declining from collection pressure in some areas)",
    colorVariants: ["psychedelic", "red", "ghost"],
    behaviorProfile: {
      swimSpeed: 0.28,
      turnChance: 0.055,
      bobAmplitude: 8e-3,
      preferredYRange: [72, 92],
      idleProbability: 0.55,
      dartiness: 0.05
    }
  },
  {
    key: "neon_tetra",
    name: "Neon Tetra",
    scientificName: "Paracheirodon innesi",
    rarity: "common",
    visualType: "species",
    basePrice: 40,
    colorVariants: ["default", "gold", "albino", "green"],
    lore: "A tiny jewel of the Amazon. Its iridescent blue stripe is produced by light-reflecting cells called iridophores — nature's own neon sign.",
    habitat: "Blackwater streams of the Amazon basin, Peru & Brazil",
    funFact: "Their neon stripe actually turns off at night. In darkness, the iridophores contract and the fish becomes almost invisible.",
    conservationStatus: "Least Concern (widely captive-bred)",
    behaviorProfile: {
      swimSpeed: 0.8,
      turnChance: 0.04,
      bobAmplitude: 0.015,
      preferredYRange: [25, 60],
      idleProbability: 0.15,
      dartiness: 0.5
    }
  },
  {
    key: "discus",
    name: "Discus",
    scientificName: "Symphysodon discus",
    rarity: "rare",
    visualType: "species",
    basePrice: 380,
    colorVariants: ["default", "cobalt", "pigeon", "snakeskin"],
    lore: 'Known as the "King of the Aquarium," the discus demands perfect water conditions and rewards its keeper with colours no painter could replicate.',
    habitat: "Slow-moving tributaries of the Amazon River",
    funFact: 'Discus parents feed their fry with a special mucus secreted from their skin — one of the few fish species to "nurse" their young.',
    conservationStatus: "Not Evaluated (heavily captive-bred)",
    behaviorProfile: {
      swimSpeed: 0.35,
      turnChance: 0.01,
      bobAmplitude: 0.01,
      preferredYRange: [20, 60],
      idleProbability: 0.45,
      dartiness: 0
    }
  },
  {
    key: "lionfish",
    name: "Lionfish",
    scientificName: "Pterois volitans",
    rarity: "rare",
    visualType: "species",
    basePrice: 450,
    colorVariants: ["default", "black", "golden"],
    lore: "Beautiful and venomous. Each ornate spine carries enough toxin to ruin a diver's week. In the aquarium, it drifts with regal indifference.",
    habitat: "Indo-Pacific coral reefs (invasive in the Atlantic)",
    funFact: "A single lionfish can reduce native reef fish populations by 79%. They have no natural predators in Atlantic waters.",
    conservationStatus: "Least Concern (invasive pest in many regions)",
    behaviorProfile: {
      swimSpeed: 0.3,
      turnChance: 8e-3,
      bobAmplitude: 0.012,
      preferredYRange: [30, 70],
      idleProbability: 0.55,
      dartiness: 0.1
    }
  },
  {
    key: "seahorse",
    name: "Seahorse",
    scientificName: "Hippocampus kuda",
    rarity: "epic",
    visualType: "species",
    basePrice: 800,
    colorVariants: ["default", "yellow", "purple", "white"],
    lore: "Neither fast nor fierce, the seahorse survives through camouflage and patience. It anchors itself with a prehensile tail and waits for tiny crustaceans to drift by.",
    habitat: "Seagrass beds and coral reefs, Indo-Pacific",
    funFact: "Male seahorses carry the eggs in a brood pouch and give birth to live young — the only animal where the male becomes pregnant.",
    conservationStatus: "Vulnerable (threatened by habitat loss and traditional medicine trade)",
    behaviorProfile: {
      swimSpeed: 0.15,
      turnChance: 5e-3,
      bobAmplitude: 0.02,
      preferredYRange: [30, 80],
      idleProbability: 0.7,
      dartiness: 0
    }
  },
  {
    key: "pufferfish",
    name: "Pufferfish",
    scientificName: "Tetraodon nigroviridis",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 160,
    colorVariants: ["default", "spotted", "albino", "blue"],
    lore: "When threatened, the pufferfish inflates to twice its size by gulping water. Its skin contains tetrodotoxin — one of nature's deadliest poisons.",
    habitat: "Brackish estuaries, Southeast Asia",
    funFact: "Pufferfish are one of the few animals that can blink and close their eyes.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.4, turnChance: 0.025, bobAmplitude: 0.018, preferredYRange: [35, 70], idleProbability: 0.4, dartiness: 0.2 }
  },
  {
    key: "jellyfish",
    name: "Moon Jellyfish",
    scientificName: "Aurelia aurita",
    rarity: "rare",
    visualType: "species",
    basePrice: 350,
    colorVariants: ["default", "pink", "blue", "gold"],
    lore: "No brain, no heart, no blood — yet the moon jellyfish has drifted through every ocean on Earth for over 500 million years. It is older than dinosaurs, trees, and even most insects.",
    habitat: "All oceans, surface to 200m depth",
    funFact: "Jellyfish are 95% water. Some species are biologically immortal — they can revert to their juvenile form.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.12, turnChance: 3e-3, bobAmplitude: 0.025, preferredYRange: [10, 50], idleProbability: 0.6, dartiness: 0 }
  },
  {
    key: "koi",
    name: "Koi",
    scientificName: "Cyprinus rubrofuscus",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 200,
    colorVariants: ["default", "tancho", "showa", "ogon"],
    lore: "Bred for over a thousand years in Japanese rice paddies, the koi represents perseverance and good fortune. The finest specimens sell for millions of yen at auction.",
    habitat: "Freshwater ponds, originally East Asia",
    funFact: "Koi can live over 200 years. The oldest recorded koi, named Hanako, was 226 years old.",
    conservationStatus: "Least Concern (domesticated)",
    behaviorProfile: { swimSpeed: 0.3, turnChance: 0.012, bobAmplitude: 0.01, preferredYRange: [40, 80], idleProbability: 0.35, dartiness: 0.05 }
  },
  {
    key: "moorish_idol",
    name: "Moorish Idol",
    scientificName: "Zanclus cornutus",
    rarity: "rare",
    visualType: "species",
    basePrice: 420,
    colorVariants: ["default", "phantom", "golden"],
    lore: "The Moors believed this fish brought happiness, and would release any caught in their nets. Its impossibly long dorsal filament trails behind like a banner.",
    habitat: "Indo-Pacific coral reefs, 3–180m",
    funFact: "Moorish Idols are notoriously difficult to keep in captivity. They often refuse food and waste away.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.45, turnChance: 0.015, bobAmplitude: 0.014, preferredYRange: [15, 55], idleProbability: 0.25, dartiness: 0.3 }
  },
  {
    key: "triggerfish",
    name: "Clown Triggerfish",
    scientificName: "Balistoides conspicillum",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 180,
    colorVariants: ["default", "niger", "sunset"],
    lore: "Armed with a locking dorsal spine that it raises when threatened, the triggerfish wedges itself into coral crevices and becomes virtually impossible to extract.",
    habitat: "Indo-Pacific coral reefs, 1–75m",
    funFact: "Triggerfish are known to attack divers who venture too close to their nests. They always charge upward.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.03, bobAmplitude: 0.012, preferredYRange: [30, 65], idleProbability: 0.2, dartiness: 0.45 }
  },
  {
    key: "electric_eel",
    name: "Electric Eel",
    scientificName: "Electrophorus electricus",
    rarity: "epic",
    visualType: "species",
    basePrice: 900,
    colorVariants: ["default", "albino", "midnight"],
    lore: "Not actually an eel but a knifefish, this creature generates up to 860 volts — enough to stun a horse. In your tank, its bioelectricity is safely contained behind glass.",
    habitat: "Amazon and Orinoco river basins, murky floodplains",
    funFact: "Electric eels must surface to breathe air. They get 80% of their oxygen from gulping at the surface.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.25, turnChance: 6e-3, bobAmplitude: 8e-3, preferredYRange: [60, 90], idleProbability: 0.5, dartiness: 0.1 }
  },
  {
    key: "axolotl",
    name: "Axolotl",
    scientificName: "Ambystoma mexicanum",
    rarity: "rare",
    visualType: "species",
    basePrice: 350,
    colorVariants: ["default", "leucistic", "golden", "wild"],
    lore: "The smiling salamander that never grows up. Axolotls retain their larval features throughout life, including their spectacular feathery gills.",
    habitat: "Lake Xochimilco, Mexico City",
    funFact: "Axolotls can regenerate limbs, heart tissue, and even parts of their brain.",
    conservationStatus: "Critically Endangered",
    behaviorProfile: { swimSpeed: 0.15, turnChance: 0.015, bobAmplitude: 6e-3, preferredYRange: [70, 95], idleProbability: 0.6, dartiness: 0.05 }
  },
  {
    key: "yellow_tang",
    name: "Yellow Tang",
    scientificName: "Zebrasoma flavescens",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 280,
    colorVariants: ["default"],
    lore: "A living splash of sunshine on the reef. The yellow tang is one of the most recognizable marine fish, prized for its vivid solid-yellow coloration.",
    habitat: "Hawaiian reefs, 2-46m",
    funFact: "Yellow tangs have a retractable scalpel-like spine near their tail that they use for defense.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.03, bobAmplitude: 0.015, preferredYRange: [20, 60], idleProbability: 0.15, dartiness: 0.3 }
  },
  {
    key: "arowana",
    name: "Asian Arowana",
    scientificName: "Scleropages formosus",
    rarity: "epic",
    visualType: "species",
    basePrice: 2e3,
    colorVariants: ["default", "platinum", "red"],
    lore: "The dragon fish. Believed to bring luck and prosperity in Asian culture, premium specimens sell for hundreds of thousands of dollars.",
    habitat: "Southeast Asian rivers and swamps",
    funFact: "Arowanas are mouthbrooders — males carry eggs in their mouths for weeks until they hatch.",
    conservationStatus: "Endangered",
    behaviorProfile: { swimSpeed: 0.35, turnChance: 0.01, bobAmplitude: 8e-3, preferredYRange: [15, 40], idleProbability: 0.35, dartiness: 0.15 }
  },
  {
    key: "cherry_shrimp",
    name: "Cherry Shrimp",
    scientificName: "Neocaridina davidi",
    rarity: "common",
    visualType: "species",
    basePrice: 30,
    colorVariants: ["default", "blue", "yellow"],
    lore: "Tiny, colorful, and endlessly entertaining. Cherry shrimp are the cleanup crew of the aquarium world, constantly grazing on algae.",
    habitat: "Taiwanese freshwater streams",
    funFact: "A single female can carry 20-30 eggs at a time, and they breed prolifically in captivity.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.1, turnChance: 0.04, bobAmplitude: 3e-3, preferredYRange: [80, 98], idleProbability: 0.7, dartiness: 0.02 }
  },
  {
    key: "oscar",
    name: "Oscar",
    scientificName: "Astronotus ocellatus",
    rarity: "uncommon",
    visualType: "species",
    basePrice: 180,
    colorVariants: ["default", "albino", "red"],
    lore: "Big, bold, and full of personality. Oscars recognize their owners and can be trained to eat from your hand. The puppy of the fish world.",
    habitat: "Amazon basin, slow-moving rivers",
    funFact: "Oscars rearrange their tank decorations to suit their preferences. They are interior decorators.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.3, turnChance: 0.02, bobAmplitude: 0.01, preferredYRange: [30, 70], idleProbability: 0.3, dartiness: 0.2 }
  },
  {
    key: "guppy",
    name: "Guppy",
    scientificName: "Poecilia reticulata",
    rarity: "common",
    visualType: "species",
    basePrice: 25,
    colorVariants: ["default", "cobra", "tuxedo"],
    lore: "The million fish. Guppies are the gateway drug of fishkeeping — cheap, colorful, and they breed like... well, guppies.",
    habitat: "Caribbean streams and ponds",
    funFact: "Female guppies can store sperm for months, producing multiple batches of fry from a single mating.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.55, turnChance: 0.05, bobAmplitude: 0.02, preferredYRange: [20, 70], idleProbability: 0.1, dartiness: 0.5 }
  },
  {
    key: "cuttlefish",
    name: "Cuttlefish",
    scientificName: "Sepia officinalis",
    rarity: "rare",
    visualType: "species",
    basePrice: 650,
    colorVariants: ["default"],
    lore: "Masters of disguise with W-shaped pupils and three hearts. Cuttlefish can change color, pattern, and texture in milliseconds.",
    habitat: "Mediterranean and North Sea, shallow waters",
    funFact: "Cuttlefish have one of the largest brain-to-body ratios of any invertebrate and can count.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.2, turnChance: 0.02, bobAmplitude: 5e-3, preferredYRange: [40, 80], idleProbability: 0.45, dartiness: 0.08 }
  },
  {
    key: "corydoras",
    name: "Corydoras",
    scientificName: "Corydoras paleatus",
    rarity: "common",
    visualType: "species",
    basePrice: 40,
    colorVariants: ["default", "panda", "bronze"],
    lore: "The armored catfish that scoots along the sand, vacuuming up leftover food. Corys are the janitors every aquarium needs.",
    habitat: "South American rivers, sandy bottoms",
    funFact: "Corydoras breathe air by gulping at the surface, making an adorable squeaking sound.",
    conservationStatus: "Least Concern",
    behaviorProfile: { swimSpeed: 0.2, turnChance: 0.04, bobAmplitude: 4e-3, preferredYRange: [85, 98], idleProbability: 0.5, dartiness: 0.1 }
  },
  {
    key: "hammerhead",
    name: "Hammerhead Shark",
    scientificName: "Sphyrna lewini",
    rarity: "epic",
    visualType: "species",
    basePrice: 1500,
    colorVariants: ["default"],
    lore: "The hammer-shaped head gives 360-degree binocular vision. A prestige predator that commands respect in any aquarium.",
    habitat: "Tropical oceans worldwide, 0-275m",
    funFact: "Hammerheads use their wide heads as metal detectors, sensing the electrical fields of buried prey.",
    conservationStatus: "Critically Endangered",
    behaviorProfile: { swimSpeed: 0.6, turnChance: 0.015, bobAmplitude: 8e-3, preferredYRange: [15, 50], idleProbability: 0.1, dartiness: 0.25 }
  },
  {
    key: "nautilus",
    name: "Nautilus",
    scientificName: "Nautilus pompilius",
    rarity: "rare",
    visualType: "species",
    basePrice: 500,
    colorVariants: ["default"],
    lore: "A living fossil unchanged for 500 million years. The nautilus drifts through the deep in its spiral shell, a relic of the age of dinosaurs.",
    habitat: "Indo-Pacific deep reefs, 100-700m",
    funFact: "Nautiluses have up to 90 tentacles but no suckers. They rely on a sticky mucus to grip prey.",
    conservationStatus: "Vulnerable",
    behaviorProfile: { swimSpeed: 0.12, turnChance: 0.01, bobAmplitude: 0.01, preferredYRange: [50, 85], idleProbability: 0.55, dartiness: 0.03 }
  },
  // ── Procedural species (rendered by genetic renderer with phenotype hints) ──
  {
    key: "rainbow_fish",
    name: "Rainbow Fish",
    scientificName: "Melanotaenia boesemani",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 180,
    lore: "Iridescent scales shift from blue to orange across the body.",
    habitat: "New Guinea freshwater lakes",
    behaviorProfile: { swimSpeed: 0.45, turnChance: 0.04, bobAmplitude: 0.01, preferredYRange: [30, 70], idleProbability: 0.3, dartiness: 0.15 }
  },
  {
    key: "pleco",
    name: "Plecostomus",
    scientificName: "Hypostomus plecostomus",
    rarity: "common",
    visualType: "procedural",
    basePrice: 60,
    lore: "The armored algae-eater that keeps your glass clean.",
    habitat: "South American rivers",
    behaviorProfile: { swimSpeed: 0.1, turnChance: 0.02, bobAmplitude: 3e-3, preferredYRange: [85, 98], idleProbability: 0.65, dartiness: 0.05 }
  },
  {
    key: "clown_loach",
    name: "Clown Loach",
    scientificName: "Chromobotia macracanthus",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 160,
    lore: "Bright orange with bold black bands. Plays dead when startled.",
    habitat: "Borneo and Sumatra rivers",
    behaviorProfile: { swimSpeed: 0.35, turnChance: 0.05, bobAmplitude: 8e-3, preferredYRange: [70, 95], idleProbability: 0.35, dartiness: 0.2 }
  },
  {
    key: "flame_tetra",
    name: "Flame Tetra",
    scientificName: "Hyphessobrycon flammeus",
    rarity: "common",
    visualType: "procedural",
    basePrice: 40,
    lore: "A tiny ember of a fish, glowing red-orange in planted tanks.",
    habitat: "Brazilian coastal streams",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.06, bobAmplitude: 0.012, preferredYRange: [30, 65], idleProbability: 0.25, dartiness: 0.3 }
  },
  {
    key: "powder_blue_tang",
    name: "Powder Blue Tang",
    scientificName: "Acanthurus leucosternon",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 450,
    lore: "Electric blue body with a striking yellow dorsal fin.",
    habitat: "Indian Ocean reefs",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.03, bobAmplitude: 0.01, preferredYRange: [20, 60], idleProbability: 0.2, dartiness: 0.15 }
  },
  {
    key: "firemouth_cichlid",
    name: "Firemouth Cichlid",
    scientificName: "Thorichthys meeki",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 140,
    lore: "Flares its bright red gill plates as a threat display.",
    habitat: "Central American rivers",
    behaviorProfile: { swimSpeed: 0.3, turnChance: 0.04, bobAmplitude: 6e-3, preferredYRange: [50, 80], idleProbability: 0.35, dartiness: 0.15 }
  },
  {
    key: "harlequin_rasbora",
    name: "Harlequin Rasbora",
    scientificName: "Trigonostigma heteromorpha",
    rarity: "common",
    visualType: "procedural",
    basePrice: 35,
    lore: "Copper body with a distinctive black triangle patch.",
    habitat: "Southeast Asian streams",
    behaviorProfile: { swimSpeed: 0.45, turnChance: 0.05, bobAmplitude: 0.01, preferredYRange: [25, 55], idleProbability: 0.3, dartiness: 0.25 }
  },
  {
    key: "royal_gramma",
    name: "Royal Gramma",
    scientificName: "Gramma loreto",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 380,
    lore: "Half purple, half gold — nature split the color palette in two.",
    habitat: "Caribbean reef caves",
    behaviorProfile: { swimSpeed: 0.3, turnChance: 0.04, bobAmplitude: 8e-3, preferredYRange: [55, 85], idleProbability: 0.4, dartiness: 0.1 }
  },
  {
    key: "cardinal_tetra",
    name: "Cardinal Tetra",
    scientificName: "Paracheirodon axelrodi",
    rarity: "common",
    visualType: "procedural",
    basePrice: 45,
    lore: "The neon tetra's brighter cousin with full-body red and blue stripes.",
    habitat: "Amazon blackwater streams",
    behaviorProfile: { swimSpeed: 0.48, turnChance: 0.055, bobAmplitude: 0.012, preferredYRange: [25, 55], idleProbability: 0.25, dartiness: 0.3 }
  },
  {
    key: "dwarf_gourami",
    name: "Dwarf Gourami",
    scientificName: "Trichogaster lalius",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 130,
    lore: "Bright blue and red striped labyrinth fish that breathes air.",
    habitat: "Indian slow-flowing waters",
    behaviorProfile: { swimSpeed: 0.2, turnChance: 0.03, bobAmplitude: 8e-3, preferredYRange: [15, 45], idleProbability: 0.45, dartiness: 0.08 }
  },
  {
    key: "banggai_cardinal",
    name: "Banggai Cardinalfish",
    scientificName: "Pterapogon kauderni",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 350,
    lore: "Silver with bold black bars. Males mouth-brood the eggs.",
    habitat: "Banggai Islands, Indonesia",
    behaviorProfile: { swimSpeed: 0.2, turnChance: 0.03, bobAmplitude: 6e-3, preferredYRange: [40, 70], idleProbability: 0.5, dartiness: 0.05 }
  },
  {
    key: "leopard_wrasse",
    name: "Leopard Wrasse",
    scientificName: "Macropharyngodon meleagris",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 420,
    lore: "Covered in leopard-like spots that shift as it matures.",
    habitat: "Indo-Pacific coral reefs",
    behaviorProfile: { swimSpeed: 0.4, turnChance: 0.045, bobAmplitude: 0.01, preferredYRange: [50, 80], idleProbability: 0.25, dartiness: 0.2 }
  },
  {
    key: "garden_eel",
    name: "Garden Eel",
    scientificName: "Heteroconger hassi",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 200,
    lore: "Colonies sway like underwater grass, ducking into burrows when spooked.",
    habitat: "Indo-Pacific sandy flats",
    behaviorProfile: { swimSpeed: 0.05, turnChance: 0.01, bobAmplitude: 0.015, preferredYRange: [80, 98], idleProbability: 0.7, dartiness: 0.4 }
  },
  {
    key: "flame_angel",
    name: "Flame Angelfish",
    scientificName: "Centropyge loricula",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 500,
    lore: "Brilliant red-orange with vertical black bars and blue-tipped fins.",
    habitat: "Pacific Ocean reefs",
    behaviorProfile: { swimSpeed: 0.35, turnChance: 0.04, bobAmplitude: 9e-3, preferredYRange: [35, 65], idleProbability: 0.3, dartiness: 0.12 }
  },
  {
    key: "emerald_crab",
    name: "Emerald Crab",
    scientificName: "Mithraculus sculptus",
    rarity: "common",
    visualType: "procedural",
    basePrice: 55,
    lore: "A tiny green crab that devours bubble algae. The cleanup crew MVP.",
    habitat: "Caribbean reefs",
    behaviorProfile: { swimSpeed: 0.08, turnChance: 0.02, bobAmplitude: 2e-3, preferredYRange: [90, 99], idleProbability: 0.6, dartiness: 0.05 }
  },
  {
    key: "regal_tang",
    name: "Regal Tang",
    scientificName: "Paracanthurus hepatus",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 400,
    lore: "Bright blue with a palette-shaped yellow tail marking.",
    habitat: "Indo-Pacific reefs",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.035, bobAmplitude: 0.01, preferredYRange: [20, 55], idleProbability: 0.2, dartiness: 0.15 }
  },
  {
    key: "peacock_mantis",
    name: "Peacock Mantis Shrimp",
    scientificName: "Odontodactylus scyllarus",
    rarity: "epic",
    visualType: "procedural",
    basePrice: 800,
    lore: "Punches prey at the speed of a bullet. Sees 16 color channels.",
    habitat: "Indo-Pacific shallow reefs",
    behaviorProfile: { swimSpeed: 0.15, turnChance: 0.03, bobAmplitude: 5e-3, preferredYRange: [75, 95], idleProbability: 0.5, dartiness: 0.35 }
  },
  {
    key: "blue_chromis",
    name: "Blue Chromis",
    scientificName: "Chromis cyanea",
    rarity: "common",
    visualType: "procedural",
    basePrice: 50,
    lore: "Shimmering blue schooling fish that darts among corals.",
    habitat: "Caribbean reefs",
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.06, bobAmplitude: 0.012, preferredYRange: [15, 45], idleProbability: 0.2, dartiness: 0.3 }
  },
  {
    key: "dragon_goby",
    name: "Dragon Goby",
    scientificName: "Gobioides broussonnetii",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 170,
    lore: "A prehistoric-looking eel-shaped goby with tiny fangs.",
    habitat: "Atlantic brackish estuaries",
    behaviorProfile: { swimSpeed: 0.15, turnChance: 0.02, bobAmplitude: 4e-3, preferredYRange: [80, 98], idleProbability: 0.55, dartiness: 0.1 }
  },
  {
    key: "spotted_boxfish",
    name: "Spotted Boxfish",
    scientificName: "Ostracion meleagris",
    rarity: "uncommon",
    visualType: "procedural",
    basePrice: 220,
    lore: "A boxy body covered in white polka dots. Surprisingly fast when alarmed.",
    habitat: "Indo-Pacific reefs",
    behaviorProfile: { swimSpeed: 0.25, turnChance: 0.04, bobAmplitude: 6e-3, preferredYRange: [40, 75], idleProbability: 0.4, dartiness: 0.2 }
  },
  {
    key: "sea_apple",
    name: "Sea Apple",
    scientificName: "Pseudocolochirus violaceus",
    rarity: "rare",
    visualType: "procedural",
    basePrice: 350,
    lore: "A vivid purple sea cucumber that filter-feeds with feathery tentacles.",
    habitat: "Indo-Pacific reefs",
    behaviorProfile: { swimSpeed: 0.03, turnChance: 0.01, bobAmplitude: 2e-3, preferredYRange: [85, 99], idleProbability: 0.8, dartiness: 0.02 }
  },
  {
    key: "wolf_eel",
    name: "Wolf Eel",
    scientificName: "Anarrhichthys ocellatus",
    rarity: "epic",
    visualType: "procedural",
    basePrice: 900,
    lore: "A fierce-looking fish that mates for life. Not actually an eel.",
    habitat: "North Pacific rocky reefs",
    behaviorProfile: { swimSpeed: 0.2, turnChance: 0.02, bobAmplitude: 5e-3, preferredYRange: [60, 90], idleProbability: 0.5, dartiness: 0.1 }
  },
  {
    key: "sunburst_anthias",
    name: "Sunburst Anthias",
    scientificName: "Serranocirrhitus latus",
    rarity: "epic",
    visualType: "procedural",
    basePrice: 1200,
    lore: "Blazing orange and pink. One of the rarest anthias in the hobby.",
    habitat: "Western Pacific deep reefs",
    behaviorProfile: { swimSpeed: 0.4, turnChance: 0.04, bobAmplitude: 0.01, preferredYRange: [20, 50], idleProbability: 0.25, dartiness: 0.15 }
  },
  {
    key: "frogfish",
    name: "Frogfish",
    scientificName: "Antennarius commerson",
    rarity: "epic",
    visualType: "procedural",
    basePrice: 700,
    lore: "A master of disguise that lures prey with a built-in fishing rod.",
    habitat: "Tropical reefs worldwide",
    behaviorProfile: { swimSpeed: 0.05, turnChance: 0.01, bobAmplitude: 3e-3, preferredYRange: [75, 95], idleProbability: 0.75, dartiness: 0.4 }
  }
];
const REAL_SPECIES_MAP = Object.fromEntries(
  REAL_SPECIES.map((s) => [s.key, s])
);
const STEAM_ACHIEVEMENT_MAP = {
  first_fish: "ACH_FIRST_FISH",
  species_5: "ACH_EXPLORER",
  species_10: "ACH_GENETICIST",
  species_25: "ACH_TAXONOMIST",
  first_sale: "ACH_MERCHANT",
  coins_500: "ACH_ENTREPRENEUR",
  coins_5000: "ACH_TYCOON",
  coins_50000: "ACH_MOGUL",
  rare_discovery: "ACH_RARE_FIND",
  epic_discovery: "ACH_LEGENDARY_CATCH",
  full_tank: "ACH_FULL_HOUSE",
  bred_5: "ACH_MATCHMAKER",
  bred_20: "ACH_SPEED_BREEDER",
  tank_happy: "ACH_HAPPY_HABITAT",
  upgrade_max: "ACH_MAXIMALIST",
  fish_rescued: "ACH_HEALER",
  water_pristine: "ACH_PURE_WATERS",
  survived_night: "ACH_NIGHT_WATCH",
  two_tanks: "ACH_EXPANDING_EMPIRE",
  three_tanks: "ACH_AQUARIUM_BARON",
  magic_1: "ACH_FIRST_WONDER",
  magic_3: "ACH_HALFWAY_THERE",
  magic_7: "ACH_LEGEND_OF_THE_DEEP",
  // New system achievements
  hire_staff: "ACH_FIRST_HIRE",
  full_research: "ACH_SCHOLAR",
  prestige_1: "ACH_PRESTIGE",
  campaign_1: "ACH_CAMPAIGN_START",
  campaign_5: "ACH_CAMPAIGN_MASTER",
  true_ending: "ACH_TRUE_ENDING",
  giftshop: "ACH_ENTREPRENEUR_2",
  rep_100: "ACH_FAMOUS"
};
let _steamAvailable = null;
async function isSteamAvailable() {
  var _a;
  if (_steamAvailable !== null) return _steamAvailable;
  if (typeof window === "undefined" || !((_a = window.electronAPI) == null ? void 0 : _a.steam)) {
    _steamAvailable = false;
    return false;
  }
  try {
    const result = await window.electronAPI.steam.isRunning();
    _steamAvailable = result.running;
    return _steamAvailable;
  } catch {
    _steamAvailable = false;
    return false;
  }
}
async function syncSteamAchievement(gameAchievementId) {
  if (!await isSteamAvailable()) return;
  const steamId = STEAM_ACHIEVEMENT_MAP[gameAchievementId];
  if (!steamId) return;
  try {
    await window.electronAPI.steam.setAchievement(steamId);
  } catch (err) {
    console.warn(`[Steam] Failed to set achievement ${steamId}:`, err);
  }
}
async function syncAllSteamAchievements(achievements) {
  if (!await isSteamAvailable()) return;
  for (const ach of achievements) {
    await syncSteamAchievement(ach.id);
  }
}
const TANK_SIZES = [
  { id: "small", label: "Small", capacity: 8, cost: 0, desc: "Starter tank", shape: "standard" },
  { id: "medium", label: "Medium", capacity: 12, cost: 300, desc: "Room for more variety", shape: "standard" },
  { id: "large", label: "Large", capacity: 16, cost: 800, desc: "Spacious habitat", shape: "wide" },
  { id: "huge", label: "Huge", capacity: 24, cost: 2e3, desc: "Exhibition-class display", shape: "panoramic" },
  { id: "mega", label: "Mega", capacity: 32, cost: 5e3, desc: "The ultimate aquarium centerpiece", minLevel: 5, shape: "cylinder" }
];
function getNextTankSize(tank) {
  const current2 = TANK_SIZES.findIndex((s) => s.id === (tank.size || "medium"));
  if (current2 < 0 || current2 >= TANK_SIZES.length - 1) return null;
  return TANK_SIZES[current2 + 1];
}
const LOAN_TIERS = [
  { id: "small", amount: 500, interest: 0.1, repayBy: 60 * 30, label: "Small Loan", desc: "500🪙 at 10% interest, repay within 30 min" },
  { id: "medium", amount: 2e3, interest: 0.15, repayBy: 60 * 60, label: "Business Loan", desc: "2,000🪙 at 15% interest, repay within 1 hour" },
  { id: "large", amount: 5e3, interest: 0.25, repayBy: 60 * 120, label: "Major Investment", desc: "5,000🪙 at 25% interest, repay within 2 hours" }
];
function getLoanStatus(loan, now2) {
  if (!loan || !loan.active) return null;
  const elapsed = (Date.now() - loan.takenAt) / 1e3;
  const remaining = Math.max(0, loan.repayBy - elapsed);
  const totalOwed = Math.round(loan.amount * (1 + loan.interest));
  const overdue = remaining <= 0;
  return { ...loan, remaining, totalOwed, overdue, elapsed };
}
const TANK_BACKGROUNDS = [
  {
    id: "tropical",
    label: "Tropical Reef",
    emoji: "",
    desc: "Warm coral waters with swaying anemones",
    cost: 0,
    // default
    gradient: "linear-gradient(180deg, #1a6ab0 0%, #155090 40%, #104078 70%, #0c3060 100%)",
    sandColor: "#c8a86a",
    ambientColor: "rgba(80,160,220,0.04)"
  },
  {
    id: "deep_ocean",
    label: "Deep Ocean",
    emoji: "",
    desc: "Dark abyssal depths with bioluminescence",
    cost: 500,
    gradient: "linear-gradient(180deg, #0c1838 0%, #0a1430 40%, #081028 70%, #060c20 100%)",
    sandColor: "#4a4a5a",
    ambientColor: "rgba(40,60,120,0.06)"
  },
  {
    id: "river",
    label: "Freshwater River",
    emoji: "",
    desc: "Clear flowing stream with pebbles and plants",
    cost: 800,
    gradient: "linear-gradient(180deg, #2a6848 0%, #205838 40%, #184830 70%, #103828 100%)",
    sandColor: "#8a7a60",
    ambientColor: "rgba(80,160,100,0.05)"
  },
  {
    id: "arctic",
    label: "Arctic Waters",
    emoji: "",
    desc: "Freezing polar waters with ice crystals",
    cost: 1200,
    minPrestige: 1,
    gradient: "linear-gradient(180deg, #2a4060 0%, #284058 40%, #304858 70%, #283848 100%)",
    sandColor: "#8090a0",
    ambientColor: "rgba(140,180,220,0.06)"
  },
  {
    id: "volcanic",
    label: "Volcanic Vent",
    emoji: "",
    desc: "Hydrothermal vents with glowing minerals",
    cost: 2e3,
    minPrestige: 2,
    gradient: "linear-gradient(180deg, #3a1810 0%, #401c10 40%, #482018 70%, #301410 100%)",
    sandColor: "#3a2a20",
    ambientColor: "rgba(200,60,20,0.05)"
  }
];
function getBackground(id) {
  return TANK_BACKGROUNDS.find((b) => b.id === id) || TANK_BACKGROUNDS[0];
}
const MILESTONES = [
  // ── Chapter 1: Getting Started ────────────────────────────
  {
    id: "ch1_first_sale",
    chapter: 1,
    chapterTitle: "Getting Started",
    title: "First Sale",
    desc: "Sell your first fish to a customer",
    emoji: "",
    check: (s) => {
      var _a;
      return (((_a = s.player.stats) == null ? void 0 : _a.fishSold) || 0) >= 1;
    },
    reward: { coins: 50 }
  },
  {
    id: "ch1_five_fish",
    chapter: 1,
    chapterTitle: "Getting Started",
    title: "Growing Collection",
    desc: "Have 5 fish in your tank at once",
    emoji: "",
    check: (s) => s.fish.filter((f) => f.stage !== "egg").length >= 5,
    reward: { coins: 100 }
  },
  {
    id: "ch1_first_breed",
    chapter: 1,
    chapterTitle: "Getting Started",
    title: "First Offspring",
    desc: "Breed your first egg",
    emoji: "",
    check: (s) => {
      var _a;
      return (((_a = s.player.stats) == null ? void 0 : _a.eggsCollected) || 0) >= 1;
    },
    reward: { coins: 75 }
  },
  {
    id: "ch1_500_coins",
    chapter: 1,
    chapterTitle: "Getting Started",
    title: "Piggy Bank",
    desc: "Earn 500 total coins",
    emoji: "",
    check: (s) => (s.player.totalCoinsEarned || 0) >= 500,
    reward: { coins: 100 }
  },
  // ── Chapter 2: Building the Business ──────────────────────
  {
    id: "ch2_second_tank",
    chapter: 2,
    chapterTitle: "Building the Business",
    title: "Expansion",
    desc: "Unlock your second tank",
    emoji: "",
    check: (s) => s.tanks.length >= 2,
    reward: { coins: 200 }
  },
  {
    id: "ch2_rare_fish",
    chapter: 2,
    chapterTitle: "Building the Business",
    title: "Rare Find",
    desc: "Own a rare-tier fish",
    emoji: "",
    check: (s) => s.fish.some((f) => {
      var _a;
      return ["rare", "epic", "legendary"].includes((_a = f.species) == null ? void 0 : _a.rarity);
    }),
    reward: { coins: 150 }
  },
  {
    id: "ch2_10_sales",
    chapter: 2,
    chapterTitle: "Building the Business",
    title: "Merchant",
    desc: "Sell 10 fish total",
    emoji: "",
    check: (s) => {
      var _a;
      return (((_a = s.player.stats) == null ? void 0 : _a.fishSold) || 0) >= 10;
    },
    reward: { coins: 200 }
  },
  {
    id: "ch2_3_species",
    chapter: 2,
    chapterTitle: "Building the Business",
    title: "Diversity",
    desc: "Own 3 different real species",
    emoji: "",
    check: (s) => {
      const species = new Set(s.fish.filter((f) => {
        var _a;
        return ((_a = f.species) == null ? void 0 : _a.visualType) === "species";
      }).map((f) => f.species.key));
      return species.size >= 3;
    },
    reward: { coins: 250 }
  },
  {
    id: "ch2_2000_coins",
    chapter: 2,
    chapterTitle: "Building the Business",
    title: "Comfortable",
    desc: "Earn 2,000 total coins",
    emoji: "",
    check: (s) => (s.player.totalCoinsEarned || 0) >= 2e3,
    reward: { coins: 200 }
  },
  // ── Chapter 3: The Expert ─────────────────────────────────
  {
    id: "ch3_cure_disease",
    chapter: 3,
    chapterTitle: "The Expert",
    title: "Dr. Fishsticks",
    desc: "Cure a diseased fish",
    emoji: "",
    check: (s) => {
      var _a;
      return (((_a = s.player.stats) == null ? void 0 : _a.medicineUsed) || 0) >= 1;
    },
    reward: { coins: 150 }
  },
  {
    id: "ch3_10_discoveries",
    chapter: 3,
    chapterTitle: "The Expert",
    title: "Explorer",
    desc: "Discover 10 unique phenotypes",
    emoji: "",
    check: (s) => (s.discoveries || []).length >= 10,
    reward: { coins: 300 }
  },
  {
    id: "ch3_3_star_review",
    chapter: 3,
    chapterTitle: "The Expert",
    title: "Three Stars",
    desc: "Get a 3-star or better aquarium review",
    emoji: "",
    check: (s) => (s.reviews || []).some((r) => r.stars >= 3),
    reward: { coins: 200 }
  },
  {
    id: "ch3_level_10",
    chapter: 3,
    chapterTitle: "The Expert",
    title: "Aquarist",
    desc: "Reach Level 10",
    emoji: "",
    check: (s) => {
      return getLevelFromXp(s.player.xp || 0).level >= 10;
    },
    reward: { coins: 500 }
  },
  {
    id: "ch3_research",
    chapter: 3,
    chapterTitle: "The Expert",
    title: "Scholar",
    desc: "Complete any research tier",
    emoji: "",
    check: (s) => {
      const r = s.player.research || {};
      return Object.values(r).some((v) => v >= 1);
    },
    reward: { coins: 250 }
  },
  // ── Chapter 4: The Tycoon ─────────────────────────────────
  {
    id: "ch4_epic_fish",
    chapter: 4,
    chapterTitle: "The Tycoon",
    title: "Epic Collector",
    desc: "Own an epic-tier fish",
    emoji: "",
    check: (s) => s.fish.some((f) => {
      var _a;
      return ["epic", "legendary"].includes((_a = f.species) == null ? void 0 : _a.rarity);
    }),
    reward: { coins: 500 }
  },
  {
    id: "ch4_3_tanks",
    chapter: 4,
    chapterTitle: "The Tycoon",
    title: "Aquarium Complex",
    desc: "Unlock 3 tanks",
    emoji: "",
    check: (s) => s.tanks.length >= 3,
    reward: { coins: 400 }
  },
  {
    id: "ch4_50_sales",
    chapter: 4,
    chapterTitle: "The Tycoon",
    title: "Trader",
    desc: "Sell 50 fish total",
    emoji: "",
    check: (s) => {
      var _a;
      return (((_a = s.player.stats) == null ? void 0 : _a.fishSold) || 0) >= 50;
    },
    reward: { coins: 500 }
  },
  {
    id: "ch4_10000_coins",
    chapter: 4,
    chapterTitle: "The Tycoon",
    title: "Wealthy",
    desc: "Earn 10,000 total coins",
    emoji: "",
    check: (s) => (s.player.totalCoinsEarned || 0) >= 1e4,
    reward: { coins: 500 }
  },
  {
    id: "ch4_5_star_review",
    chapter: 4,
    chapterTitle: "The Tycoon",
    title: "Five Stars!",
    desc: "Get a perfect 5-star aquarium review",
    emoji: "",
    check: (s) => (s.reviews || []).some((r) => r.stars >= 5),
    reward: { coins: 1e3 }
  },
  // ── Chapter 5: The Legend ─────────────────────────────────
  {
    id: "ch5_50_discoveries",
    chapter: 5,
    chapterTitle: "The Legend",
    title: "Catalogue",
    desc: "Discover 50 unique phenotypes",
    emoji: "",
    check: (s) => (s.discoveries || []).length >= 50,
    reward: { coins: 1e3 }
  },
  {
    id: "ch5_all_magic",
    chapter: 5,
    chapterTitle: "The Legend",
    title: "Magic Mastery",
    desc: "Find all 7 Magic Fish",
    emoji: "",
    check: (s) => (s.player.magicFishFound || []).length >= 7,
    reward: { coins: 5e3 }
  },
  {
    id: "ch5_prestige",
    chapter: 5,
    chapterTitle: "The Legend",
    title: "Prestige",
    desc: "Prestige for the first time",
    emoji: "",
    check: (s) => (s.player.prestigeLevel || 0) >= 1,
    reward: { coins: 2e3 }
  },
  {
    id: "ch5_50000_coins",
    chapter: 5,
    chapterTitle: "The Legend",
    title: "Mogul",
    desc: "Earn 50,000 total coins",
    emoji: "",
    check: (s) => (s.player.totalCoinsEarned || 0) >= 5e4,
    reward: { coins: 2e3 }
  },
  {
    id: "ch5_legendary",
    chapter: 5,
    chapterTitle: "The Legend",
    title: "Legendary Aquarist",
    desc: "Reach Level 30",
    emoji: "",
    check: (s) => {
      return getLevelFromXp(s.player.xp || 0).level >= 30;
    },
    reward: { coins: 1e4 }
  }
];
function getMilestoneProgress(state) {
  var _a;
  const completed = ((_a = state.player) == null ? void 0 : _a.completedMilestones) || [];
  const chapters = {};
  for (const m of MILESTONES) {
    if (!chapters[m.chapter]) chapters[m.chapter] = { title: m.chapterTitle, milestones: [], done: 0, total: 0 };
    const ch = chapters[m.chapter];
    const isDone = completed.includes(m.id);
    const isReady = !isDone && m.check(state);
    ch.milestones.push({ ...m, isDone, isReady });
    ch.total++;
    if (isDone) ch.done++;
  }
  return chapters;
}
function getTotalMilestones() {
  return MILESTONES.length;
}
function getCompletedCount(state) {
  var _a;
  return (((_a = state.player) == null ? void 0 : _a.completedMilestones) || []).length;
}
const DISEASE_CURES = {
  ich: "antibiotic",
  fin_rot: "antibiotic",
  bloat: "digestiveRemedy",
  velvet: "antiparasitic",
  swim_bladder: "digestiveRemedy",
  gill_flukes: "antiparasitic",
  dropsy: "antibiotic"
};
const PERSONALITY_LIST = [
  "playful",
  "shy",
  "curious",
  "lazy",
  "aggressive",
  "social",
  "gluttonous",
  "hardy"
];
function addXp(state, amount, source) {
  if (!amount || amount <= 0) return;
  const before = getLevelFromXp(state.player.xp || 0);
  state.player.xp = (state.player.xp || 0) + amount;
  const after = getLevelFromXp(state.player.xp);
  if (after.level > before.level) {
    state.player._levelUpPending = after.level;
    addLogDraft(state, `LEVEL UP! You are now Level ${after.level} — ${getLevelTitle(after.level)}!`);
  }
}
let _initSave;
function getInitSave() {
  if (_initSave === void 0) _initSave = loadGame();
  return _initSave;
}
function buildInitialState() {
  var _a;
  const isRecovery = typeof window !== "undefined" && new URLSearchParams((_a = window.location) == null ? void 0 : _a.search).get("safe") === "1";
  if (isRecovery) console.warn("[Recovery Mode] Skipping offline progress");
  const saved = getInitSave();
  let g;
  if (!saved) {
    g = createDefaultState();
  } else if (isRecovery) {
    g = saved;
  } else {
    try {
      g = applyOfflineProgress(saved);
    } catch (err) {
      console.error("[Init] applyOfflineProgress crashed, using raw save:", err);
      g = saved;
    }
  }
  try {
    g = refreshDailyChallenges(g);
  } catch {
  }
  try {
    g = refreshMarket(g);
  } catch {
  }
  return g;
}
function findFish(state, fishId) {
  return fishId ? state.fish.find((f) => f.id === fishId) : null;
}
function findTank(state, tankId) {
  return tankId ? state.tanks.find((t) => t.id === tankId) : null;
}
function fishTank(state, fish) {
  return (fish == null ? void 0 : fish.tankId) ? findTank(state, fish.tankId) : null;
}
function removeFishFromBreedSlots(state, fishId) {
  var _a;
  if ((_a = state.breedingTank) == null ? void 0 : _a.slots) {
    state.breedingTank.slots = state.breedingTank.slots.map((s) => s === fishId ? null : s);
  }
  for (const bay of state.extraBays || []) {
    if (bay == null ? void 0 : bay.slots) bay.slots = bay.slots.map((s) => s === fishId ? null : s);
  }
}
const useGameStore = create(
  subscribeWithSelector(
    immer((_rawSet, get2) => {
      const initial = buildInitialState();
      const set2 = (fnOrObj) => {
        try {
          _rawSet(fnOrObj);
        } catch (err) {
          console.error("[Store] Mutation crashed:", err);
        }
      };
      return {
        // ── Game state (flat — same shape as before) ──────────
        ...initial,
        // ── UI-only state ────────────────────────────────────
        soundOn: true,
        showOffline: getInitSave() ? Date.now() - (getInitSave().lastTickAt || Date.now()) > 3e4 : false,
        // ── Tick ─────────────────────────────────────────────
        // Called by setInterval every second. Bypasses Immer —
        // processTick reads plain state via get() and returns a new
        // plain object. set() shallow-merges it, avoiding Immer's
        // proxy creation + diff on every tick.
        tick: () => {
          const state = get2();
          if (state.paused) return;
          try {
            const t0 = performance.now();
            set2(processTick(state));
            const dt = performance.now() - t0;
            if (dt > 50) console.warn(`[Perf] Tick took ${dt.toFixed(1)}ms (>50ms threshold)`);
          } catch (err) {
            console.error("[Store] Tick set failed:", err);
          }
        },
        // ── Dismiss offline modal ────────────────────────────
        dismissOffline: () => set2({ showOffline: false }),
        // ── Sound ────────────────────────────────────────────
        toggleSound: () => set2((state) => {
          state.soundOn = !state.soundOn;
          setSoundEnabled(state.soundOn);
        }),
        // ════════════════════════════════════════════════════
        // PLAYER ACTIONS (migrated from useEconomy)
        // ════════════════════════════════════════════════════
        feedFish: (fishId) => set2((state) => {
          if (!fishId) return;
          const fish = findFish(state, fishId);
          if (!fish) return;
          const tank = fishTank(state, fish);
          if (!tank || tank.supplies.food <= 0) {
            playWarning();
            addLogDraft(state, "No food in that tank!");
            return;
          }
          playFeed();
          tank.supplies.food -= 1;
          fish.hunger = Math.max(0, fish.hunger - 45);
          fish.health = Math.min(100, fish.health + 5);
          state.player.stats.fishFed = (state.player.stats.fishFed || 0) + 1;
        }),
        feedAllInTank: (tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          const hungry = state.fish.filter((f) => f.tankId === tankId && f.stage !== "egg" && f.hunger > 30);
          if (hungry.length === 0) return;
          const feedCount = Math.min(hungry.length, tank.supplies.food);
          if (feedCount === 0) {
            playWarning();
            addLogDraft(state, "No food in that tank!");
            return;
          }
          tank.supplies.food -= feedCount;
          hungry.sort((a, b) => b.hunger - a.hunger);
          for (let i = 0; i < feedCount; i++) {
            hungry[i].hunger = Math.max(0, hungry[i].hunger - 45);
            hungry[i].health = Math.min(100, hungry[i].health + 5);
          }
          playFeed();
          addLogDraft(state, `Fed ${feedCount} fish in ${tank.name}.`);
        }),
        useMedicine: (fishId, medicineType) => set2((state) => {
          var _a, _b;
          const fish = findFish(state, fishId);
          if (!fish || !fish.disease) return;
          const tank = fishTank(state, fish);
          if (!tank) return;
          const correctMed = DISEASE_CURES[fish.disease] || "antibiotic";
          const medKey = medicineType || correctMed;
          if ((tank.supplies[medKey] || 0) <= 0) {
            playWarning();
            addLogDraft(state, `No ${medKey} in ${tank.name}!`);
            return;
          }
          tank.supplies[medKey] -= 1;
          state.player.stats.medicineUsed = (state.player.stats.medicineUsed || 0) + 1;
          if (medKey !== correctMed) {
            playWarning();
            fish.diseaseSince = (fish.diseaseSince || state.gameClock || Date.now()) - 6e4;
            addLogDraft(state, `Wrong treatment! ${medKey} doesn't treat ${fish.disease}. The disease worsened!`);
            if (!fish.treatmentLog) fish.treatmentLog = [];
            fish.treatmentLog.push({ med: medKey, at: state.gameClock || Date.now(), result: "wrong" });
            return;
          }
          const stage = getDiseaseStage(fish.diseaseSince, state.gameClock);
          const successRate = CURE_SUCCESS_RATE[stage] || 0.5;
          const hardyBonus = fish.personality === "hardy" ? 0.15 : 0;
          const success = Math.random() < successRate + hardyBonus;
          if (!fish.treatmentLog) fish.treatmentLog = [];
          fish.treatmentLog.push({ med: medKey, at: state.gameClock || Date.now(), result: success ? "cured" : "failed", stage });
          if (success) {
            const diseaseName = fish.disease;
            if (!fish.immunities) fish.immunities = [];
            if (!fish.immunities.includes(diseaseName)) fish.immunities.push(diseaseName);
            fish.disease = null;
            fish.diseaseSince = null;
            fish.diagnosed = false;
            fish.health = Math.min(100, fish.health + 15);
            playCoin();
            addLogDraft(state, `Cured ${fish.nickname || ((_a = fish.species) == null ? void 0 : _a.name) || "fish"} of ${diseaseName}! (${stage} stage, ${Math.round(successRate * 100)}% chance)`);
            addXp(state, XP_REWARDS.cureFish);
            const updated = updateChallengeProgress(state, "cure_fish");
            Object.assign(state, updated);
          } else {
            playWarning();
            addLogDraft(state, `Treatment failed on ${fish.nickname || ((_b = fish.species) == null ? void 0 : _b.name) || "fish"}! (${stage} stage, ${Math.round(successRate * 100)}% chance — try again)`);
          }
        }),
        // ── Diagnose a sick fish ─────────────────────────────
        diagnoseFish: (fishId) => set2((state) => {
          const fish = findFish(state, fishId);
          if (!fish || !fish.disease || fish.diagnosed) return;
          const tank = fishTank(state, fish);
          if (!tank || (tank.supplies.diagnosticKit || 0) <= 0) {
            playWarning();
            addLogDraft(state, "No diagnostic kits available!");
            return;
          }
          tank.supplies.diagnosticKit -= 1;
          fish.diagnosed = true;
          const d = DISEASES[fish.disease];
          playCoin();
          addLogDraft(state, `Diagnosis: ${(d == null ? void 0 : d.name) || fish.disease} detected! Treat with ${(d == null ? void 0 : d.treatmentName) || "medicine"}.`);
        }),
        // ── Give vitamins to a fish ──────────────────────────
        giveVitamins: (fishId) => set2((state) => {
          var _a;
          const fish = findFish(state, fishId);
          if (!fish) return;
          const tank = fishTank(state, fish);
          if (!tank || (tank.supplies.vitamins || 0) <= 0) {
            playWarning();
            addLogDraft(state, "No vitamins available!");
            return;
          }
          tank.supplies.vitamins -= 1;
          fish.vitaminUntil = (state.gameClock || Date.now()) + 6e5;
          fish.health = Math.min(100, fish.health + 5);
          playCoin();
          addLogDraft(state, `${fish.nickname || ((_a = fish.species) == null ? void 0 : _a.name) || "fish"} received vitamins! 10 min disease immunity.`);
        }),
        moveFishToTank: (fishId, targetTankId) => set2((state) => {
          if (!fishId || !targetTankId) return;
          const fish = findFish(state, fishId);
          if (!fish) return;
          const target = findTank(state, targetTankId);
          if (!target) return;
          const count = state.fish.filter((f) => f.tankId === targetTankId).length;
          if (count >= (target.capacity || 12)) {
            playWarning();
            addLogDraft(state, `${target.name} is full!`);
            return;
          }
          fish.tankId = targetTankId;
          playBubble();
        }),
        treatWater: (tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if ((tank.supplies.waterTreatment || 0) <= 0) {
            playWarning();
            addLogDraft(state, "No water treatment supplies!");
            return;
          }
          playBubble();
          tank.supplies.waterTreatment -= 1;
          tank.waterQuality = Math.min(100, tank.waterQuality + 35);
          state.player.stats.waterTreated = (state.player.stats.waterTreated || 0) + 1;
          const updated = updateChallengeProgress(state, "treat_water");
          Object.assign(state, updated);
        }),
        toggleAutoFeed: (tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (tank) tank.autoFeed = !tank.autoFeed;
        }),
        useHeater: (tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if ((tank.supplies.heater || 0) <= 0) {
            playWarning();
            return;
          }
          tank.supplies.heater -= 1;
          tank.temperature = 74;
          playBubble();
        }),
        unlockTank: (type) => set2((state) => {
          var _a, _b;
          if (((_a = state.campaign) == null ? void 0 : _a.mode) === "campaign") {
            const lvl = getLevelById(state.campaign.activeLevelId);
            if (((_b = lvl == null ? void 0 : lvl.constraints) == null ? void 0 : _b.maxTanks) && state.tanks.length >= lvl.constraints.maxTanks) {
              fireToast("Tank limit reached for this level.", "alert", "");
              return;
            }
          }
          const unlock = TANK_UNLOCK[state.tanks.length];
          if (!unlock) {
            playWarning();
            addLogDraft(state, "Maximum tanks reached!");
            return;
          }
          if (state.player.coins < unlock.cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          if (unlock.minPrestige && (state.player.prestigeLevel || 0) < unlock.minPrestige) {
            playWarning();
            addLogDraft(state, `Requires Prestige Level ${unlock.minPrestige} to unlock!`);
            return;
          }
          state.player.coins -= unlock.cost;
          const newTank = createDefaultTank(`tank_${state.tanks.length}`, type);
          state.tanks.push(newTank);
          playCoin();
          addLogDraft(state, `Unlocked a new ${type} tank!`);
        }),
        renameTank: (tankId, name) => set2((state) => {
          const tank = findTank(state, tankId);
          if (tank) tank.name = name.trim().slice(0, 24) || tank.name;
        }),
        toggleSellFish: (fishId) => set2((state) => {
          var _a, _b;
          if (!fishId || !state.shop.listedFish) return;
          const isListed = state.shop.listedFish.includes(fishId);
          if (!isListed && state.shop.listedFish.length >= state.shop.slots) {
            playWarning();
            addLogDraft(state, "Shop full! Buy an upgrade to add more slots.");
            return;
          }
          if (isListed) {
            state.shop.listedFish = state.shop.listedFish.filter((id) => id !== fishId);
            delete state.shop.fishPrices[fishId];
          } else {
            state.shop.listedFish.push(fishId);
          }
          playCoin();
          const fish = findFish(state, fishId);
          addLogDraft(
            state,
            isListed ? `Removed ${((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.name) || "fish"}.` : `Listed ${((_b = fish == null ? void 0 : fish.species) == null ? void 0 : _b.name) || "fish"} for sale!`
          );
        }),
        setFishPrice: (fishId, price) => set2((state) => {
          if (!fishId) return;
          state.shop.fishPrices[fishId] = price;
        }),
        buySupply: (supplyKey, cost, amount, tankId) => set2((state) => {
          var _a, _b, _c;
          const bulkLevel = ((_c = (_b = (_a = state.shop) == null ? void 0 : _a.upgrades) == null ? void 0 : _b.bulkBuyer) == null ? void 0 : _c.level) || 0;
          const actualCost = Math.max(1, Math.round(cost * (1 - bulkLevel * 0.1)));
          if (state.player.coins < actualCost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= actualCost;
          tank.supplies[supplyKey] = (tank.supplies[supplyKey] || 0) + amount;
          playCoin();
        }),
        buyFish: (cost, targetRarity, speciesKey) => set2((state) => {
          var _a;
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          const fishCountByTank = /* @__PURE__ */ new Map();
          for (const f of state.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
          const tank = state.tanks.find((t) => (fishCountByTank.get(t.id) || 0) < (t.capacity || 12));
          if (!tank) {
            playWarning();
            addLogDraft(state, "All tanks are full!");
            return;
          }
          state.player.coins -= cost;
          let newFish;
          if (speciesKey && REAL_SPECIES_MAP[speciesKey]) {
            const speciesDef = REAL_SPECIES_MAP[speciesKey];
            newFish = createFish({ stage: "adult", tankId: tank.id, targetRarity: speciesDef.rarity, now: state.gameClock });
            newFish.species = { ...newFish.species, ...speciesDef, visualType: "species", key: speciesKey };
          } else {
            newFish = createFish({ stage: "adult", tankId: tank.id, targetRarity: targetRarity || "common", now: state.gameClock });
          }
          if (!newFish.personality) {
            if (!newFish.personality) {
              newFish.personality = PERSONALITY_LIST[Math.floor(Math.random() * PERSONALITY_LIST.length)];
            }
          }
          state.fish.push(newFish);
          state.player.stats.fishBought = (state.player.stats.fishBought || 0) + 1;
          playCoin();
          addLogDraft(state, `Bought a ${((_a = newFish.species) == null ? void 0 : _a.name) || "fish"}!`);
          const tankmates = state.fish.filter((f) => f.tankId === tank.id && f.id !== newFish.id);
          const issues = checkTankCompat(newFish, tankmates);
          for (const issue of issues) {
            addLogDraft(state, `${issue.message}`);
            if (issue.severity === "critical") fireToast(issue.message, "alert", "");
          }
        }),
        buyUpgrade: (upgradeKey) => set2((state) => {
          const upg = state.shop.upgrades[upgradeKey];
          if (!upg || upg.level >= (upg.maxLevel || 3)) return;
          const cost = upgradeCost(upg.cost, upg.level);
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          state.player.coins -= cost;
          upg.level += 1;
          if (upgradeKey === "slot") state.shop.slots += 1;
          if (upgradeKey === "capacity") {
            state.tanks.forEach((t) => {
              t.capacity = (t.capacity || 12) + 4;
            });
          }
          if (upgradeKey === "breeding") {
            const newDuration = Math.round(BREEDING_BASE_MS * Math.pow(BREEDING_SPEED_FACTOR, upg.level));
            state.breedingTank.breedingDurationMs = newDuration;
            if (state.extraBays) {
              for (const bay of state.extraBays) {
                bay.breedingDurationMs = newDuration;
              }
            }
          }
          if (upgradeKey === "deepSea") {
            state.tanks.forEach((t) => {
              t.capacity = (t.capacity || 12) + 6;
            });
          }
          if (upgradeKey === "breedBay") {
            state.maxBays = (state.maxBays || 1) + 1;
            const newBay = {
              slots: [null, null],
              eggReady: false,
              breedingStartedAt: null,
              breedingDurationMs: state.breedingTank.breedingDurationMs,
              storedGenomeA: null,
              storedGenomeB: null,
              storedGenomeC: null,
              storedTankId: null
            };
            if (!state.extraBays) state.extraBays = [];
            state.extraBays.push(newBay);
            addLogDraft(state, `Breeding Bay ${state.maxBays} unlocked!`);
          }
          playCoin();
          addLogDraft(state, `Upgraded ${upg.label} to level ${upg.level}!`);
          addXp(state, XP_REWARDS.buyUpgrade);
        }),
        buyRareMarketItem: (item, tankId) => set2((state) => {
          var _a, _b;
          if (!item || state.player.coins < item.cost) {
            playWarning();
            return;
          }
          const today = Math.floor(Date.now() / 864e5);
          const purchased = (state.rareMarket.purchased || []).filter((p) => p.day === today);
          const boughtCount = purchased.filter((p) => p.itemId === item.id).length;
          if (boughtCount >= (item.limit || 1)) {
            playWarning();
            return;
          }
          const tank = findTank(state, tankId) || state.tanks[0];
          if ((item.type === "fish" || item.type === "egg") && tank) {
            const count = state.fish.filter((f) => f.tankId === tank.id).length;
            const needed = item.eggCount || 1;
            if (count + needed > (tank.capacity || 12)) {
              playWarning();
              addLogDraft(state, `Not enough room in ${tank.name}!`);
              return;
            }
          }
          state.player.coins -= item.cost;
          if (!state.rareMarket.purchased) state.rareMarket.purchased = [];
          state.rareMarket.purchased.push({ day: today, itemId: item.id });
          if (item.type === "egg" && item.rarityWeights && tank) {
            const weights = item.rarityWeights;
            const total = Object.values(weights).reduce((s, v) => s + v, 0);
            const eggCount = item.eggCount || 1;
            const hatched = [];
            for (let i = 0; i < eggCount; i++) {
              let roll = Math.random() * total;
              let rarity = "common";
              for (const [r, w] of Object.entries(weights)) {
                roll -= w;
                if (roll <= 0) {
                  rarity = r;
                  break;
                }
              }
              const egg = createFish({ stage: "egg", tankId: tank.id, targetRarity: rarity, now: state.gameClock });
              state.fish.push(egg);
              hatched.push(rarity);
            }
            const summary = hatched.join(", ");
            addLogDraft(state, `Mystery egg${eggCount > 1 ? "s" : ""} placed in ${tank.name}! (${summary})`);
            playCoin();
            return;
          }
          if (item.type === "fish" && item.targetRarity && tank) {
            const newFish = createFish({ stage: "adult", tankId: tank.id, targetRarity: item.targetRarity, now: state.gameClock });
            state.fish.push(newFish);
            addLogDraft(state, `${((_a = newFish.species) == null ? void 0 : _a.name) || "Exotic fish"} (${(_b = newFish.species) == null ? void 0 : _b.rarity}) added to ${tank.name}!`);
            playCoin();
            return;
          }
          if (item.supplies && tank) {
            for (const [key, amount] of Object.entries(item.supplies)) {
              tank.supplies[key] = (tank.supplies[key] || 0) + amount;
            }
          }
          if (item.restoreWater && tank) {
            tank.waterQuality = 100;
          }
          if (item.boost && item.boostDurationMs) {
            if (!state.player.boosts) state.player.boosts = {};
            state.player.boosts[item.boost] = (state.gameClock || Date.now()) + item.boostDurationMs;
          }
          playCoin();
          addLogDraft(state, `Purchased ${item.label} from the Rare Market!`);
        }),
        buyDecoration: (decorId, tankId) => set2((state) => {
          const decor = DECOR_CATALOG.find((d) => d.id === decorId);
          if (!decor || state.player.coins < decor.price) {
            playWarning();
            return;
          }
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= decor.price;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          playCoin();
        }),
        claimUnlockedDecoration: (decorId, tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
          state.player.unlockedDecorations = (state.player.unlockedDecorations || []).filter((id) => id !== decorId);
        }),
        placeDecoration: (decorId, tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if (!tank.decorations.placed) tank.decorations.placed = [];
          tank.decorations.placed.push(decorId);
          if (tank.decorations.owned) {
            const idx = tank.decorations.owned.indexOf(decorId);
            if (idx !== -1) tank.decorations.owned.splice(idx, 1);
          }
        }),
        removeDecoration: (decorId, tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (!tank) return;
          if (tank.decorations.placed) {
            const idx = tank.decorations.placed.indexOf(decorId);
            if (idx !== -1) tank.decorations.placed.splice(idx, 1);
          }
          if (!tank.decorations.owned) tank.decorations.owned = [];
          tank.decorations.owned.push(decorId);
        }),
        buyTheme: (themeId, tankId) => set2((state) => {
          const theme = TANK_THEMES.find((t) => t.id === themeId);
          if (!theme || state.player.coins < (theme.price || 0)) {
            playWarning();
            return;
          }
          const tank = findTank(state, tankId);
          if (!tank) return;
          state.player.coins -= theme.price || 0;
          if (!tank.themes.owned) tank.themes.owned = [];
          tank.themes.owned.push(themeId);
          playCoin();
        }),
        applyTheme: (themeId, tankId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (tank) tank.themes.active = themeId;
        }),
        selectForBreeding: (fishId, bayIndex = 0) => set2((state) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
          if (!fishId) return;
          if (((_a = state.campaign) == null ? void 0 : _a.mode) === "campaign") {
            const lvl = getLevelById(state.campaign.activeLevelId);
            if ((_b = lvl == null ? void 0 : lvl.constraints) == null ? void 0 : _b.breedingDisabled) {
              fireToast("Breeding is not available in this level.", "alert", "");
              return;
            }
          }
          const bt = bayIndex === 0 ? state.breedingTank : (_c = state.extraBays) == null ? void 0 : _c[bayIndex - 1];
          if (!bt) return;
          if (bt.eggReady) return;
          if (bt.breedingStartedAt) return;
          const fish = findFish(state, fishId);
          if (!fish || fish.stage !== "adult") return;
          if (bt.slots.includes(fishId)) {
            bt.slots = bt.slots.map((s) => s === fishId ? null : s);
            return;
          }
          const allBays = [state.breedingTank, ...state.extraBays || []];
          for (let i = 0; i < allBays.length; i++) {
            if (i === bayIndex) continue;
            if ((_e = (_d = allBays[i]) == null ? void 0 : _d.slots) == null ? void 0 : _e.includes(fishId)) {
              playWarning();
              addLogDraft(state, "That fish is already in another breeding bay!");
              return;
            }
          }
          const emptyIdx = bt.slots.indexOf(null);
          if (emptyIdx === -1) return;
          bt.slots[emptyIdx] = fishId;
          if (bt.slots[0] && bt.slots[1]) {
            bt.breedingStartedAt = state.gameClock || Date.now();
            state.player.stats.breedingsStarted = (state.player.stats.breedingsStarted || 0) + 1;
            const fishA = findFish(state, bt.slots[0]);
            const fishB = findFish(state, bt.slots[1]);
            if (fishA && fishB) {
              fishA.bondedWith = fishB.id;
              fishB.bondedWith = fishA.id;
            }
            bt.storedGenomeA = (fishA == null ? void 0 : fishA.genome) || null;
            bt.storedGenomeB = (fishB == null ? void 0 : fishB.genome) || null;
            bt.storedTankId = (fishA == null ? void 0 : fishA.tankId) || ((_f = state.tanks[0]) == null ? void 0 : _f.id) || "tank_0";
            const hpAvg = (((fishA == null ? void 0 : fishA.health) || 50) + ((fishB == null ? void 0 : fishB.health) || 50)) / 200;
            const hatcheryLvl = ((_i = (_h = (_g = state.shop) == null ? void 0 : _g.upgrades) == null ? void 0 : _h.hatchery) == null ? void 0 : _i.level) || 0;
            const sameSpecies = ((_j = fishA == null ? void 0 : fishA.species) == null ? void 0 : _j.key) && fishA.species.key === ((_k = fishB == null ? void 0 : fishB.species) == null ? void 0 : _k.key);
            const clutchBonus = hpAvg * 0.08 + hatcheryLvl * 0.04 + (sameSpecies ? 0.06 : 0);
            const roll = Math.random();
            const clutchSize = roll < 0.03 + clutchBonus * 0.5 ? 3 : roll < 0.15 + clutchBonus ? 2 : 1;
            bt.clutchSize = clutchSize;
            playBreed();
            const clutchMsg = clutchSize > 1 ? ` (${clutchSize === 3 ? "Triplets" : "Twins"}! )` : "";
            addLogDraft(state, `Breeding started: ${((_l = fishA == null ? void 0 : fishA.species) == null ? void 0 : _l.name) || "?"} × ${((_m = fishB == null ? void 0 : fishB.species) == null ? void 0 : _m.name) || "?"}${clutchMsg}`);
          }
        }),
        cancelBreeding: (bayIndex = 0) => set2((state) => {
          var _a;
          const bt = bayIndex === 0 ? state.breedingTank : (_a = state.extraBays) == null ? void 0 : _a[bayIndex - 1];
          if (!bt) return;
          bt.slots = [null, null];
          bt.breedingStartedAt = null;
          bt.eggReady = false;
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
        }),
        collectEgg: (bayIndex = 0) => set2((state) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
          const bt = bayIndex === 0 ? state.breedingTank : (_a = state.extraBays) == null ? void 0 : _a[bayIndex - 1];
          if (!bt) return;
          if (!bt.eggReady) return;
          if (!bt.storedGenomeA || !bt.storedGenomeB) return;
          const tankId = bt.storedTankId || ((_b = state.tanks[0]) == null ? void 0 : _b.id) || "tank_0";
          const tank = findTank(state, tankId);
          const currentCount = state.fish.filter((f) => f.tankId === tankId).length;
          const capacity = (tank == null ? void 0 : tank.capacity) || 12;
          const clutchSize = bt.clutchSize || 1;
          const roomAvailable = capacity - currentCount;
          if (roomAvailable <= 0) {
            playWarning();
            addLogDraft(state, "Target tank is full!");
            return;
          }
          const mutagenLevel = ((_e = (_d = (_c = state.shop) == null ? void 0 : _c.upgrades) == null ? void 0 : _d.mutagen) == null ? void 0 : _e.level) || 0;
          const mutationBoostActive = (((_g = (_f = state.player) == null ? void 0 : _f.boosts) == null ? void 0 : _g.mutationBoost) || 0) > (state.gameClock || Date.now());
          const mutationRate = (0.02 + mutagenLevel * 0.03) * (mutationBoostActive ? 3 : 1);
          const eggsToCreate = Math.min(clutchSize, roomAvailable);
          const parentA = findFish(state, (_h = bt.slots) == null ? void 0 : _h[0]);
          const parentB = findFish(state, (_i = bt.slots) == null ? void 0 : _i[1]);
          const parentGenA = (parentA == null ? void 0 : parentA.generation) || 1;
          const parentGenB = (parentB == null ? void 0 : parentB.generation) || 1;
          const childGen = Math.max(parentGenA, parentGenB) + 1;
          const parentIds = [(_j = bt.slots) == null ? void 0 : _j[0], (_k = bt.slots) == null ? void 0 : _k[1]].filter(Boolean);
          const newEggs = [];
          for (let i = 0; i < eggsToCreate; i++) {
            const childGenome = breedGenomes(bt.storedGenomeA, bt.storedGenomeB, null, mutationRate);
            const egg = createFish({ stage: "egg", tankId, genome: childGenome, parentIds, generation: childGen, now: state.gameClock });
            newEggs.push(egg);
            state.fish.push(egg);
          }
          bt.eggReady = false;
          bt.breedingStartedAt = null;
          bt.slots = [null, null];
          bt.storedGenomeA = null;
          bt.storedGenomeB = null;
          bt.clutchSize = null;
          state.player.stats.eggsCollected = (state.player.stats.eggsCollected || 0) + eggsToCreate;
          playHatch();
          playCoin();
          if (eggsToCreate === 3) {
            playDiscoverScaled("rare");
            addLogDraft(state, `Triplets! Collected 3 eggs!`);
          } else if (eggsToCreate === 2) {
            addLogDraft(state, `Twins! Collected 2 eggs!`);
          } else {
            addLogDraft(state, "Collected a new egg!");
          }
          if (clutchSize > roomAvailable) {
            addLogDraft(state, `Only ${roomAvailable} of ${clutchSize} eggs fit — tank is almost full!`);
          }
          addXp(state, XP_REWARDS.breedEgg * eggsToCreate);
          if (newEggs.length > 0) {
            state._pendingHatchReveal = newEggs[0];
          }
          for (const egg of newEggs) {
            if (egg.genome) {
              const ph = computePhenotype(egg.genome);
              const sp = getSpeciesFromPhenotype(ph);
              const nearMiss = checkNearMiss({ species: sp });
              if (nearMiss) {
                addLogDraft(state, `${nearMiss.message} Breed similar parents to push past the threshold!`);
              }
            }
          }
          const updated = updateChallengeProgress(state, "collect_egg");
          Object.assign(state, updated);
        }),
        // ── Fish naming ──────────────────────────────────────
        renameFish: (fishId, name) => set2((state) => {
          if (!fishId) return;
          const fish = findFish(state, fishId);
          if (fish) {
            fish.nickname = name.trim().slice(0, 24) || null;
          }
        }),
        // ── Haggle resolution ────────────────────────────────
        resolveHaggle: (action, counterPrice) => set2((state) => {
          var _a, _b;
          const h = state.pendingHaggle;
          if (!h) return;
          state.pendingHaggle = null;
          if (action === "decline") {
            addLogDraft(state, `${h.customerName} left without buying.`);
            return;
          }
          let price;
          if (action === "counter") {
            const requested = Math.round(Number(counterPrice) || 0);
            if (requested <= 0) return;
            if (requested > (h.maxBudget || h.offer * 2)) {
              addLogDraft(state, `${h.customerName} refused your counteroffer.`);
              return;
            }
            price = requested;
          } else {
            price = h.offer;
          }
          const fish = findFish(state, h.fishId);
          if (!fish) {
            addLogDraft(state, `Fish no longer available.`);
            return;
          }
          const soldRarity = (_a = fish.species) == null ? void 0 : _a.rarity;
          const fishName = fish.nickname || ((_b = fish.species) == null ? void 0 : _b.name) || h.fishName || "Unknown";
          state.player.coins += price;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + price;
          state.fish = state.fish.filter((f) => f.id !== h.fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter((id) => id !== h.fishId);
          if (state.shop.fishPrices) delete state.shop.fishPrices[h.fishId];
          removeFishFromBreedSlots(state, h.fishId);
          state.player.stats.fishSold = (state.player.stats.fishSold || 0) + 1;
          state.shop.reputation = (state.shop.reputation || 0) + 1;
          if (!state.shop.salesHistory) state.shop.salesHistory = [];
          state.shop.salesHistory.unshift({ fishName, coins: price, customer: h.customerName, at: Date.now(), rarity: soldRarity });
          playCoinScaled(price);
          addLogDraft(state, `${h.customerName}: Sold ${fishName} for ${price}!`);
          addXp(state, soldRarity === "epic" ? XP_REWARDS.sellEpicFish : soldRarity === "rare" ? XP_REWARDS.sellRareFish : XP_REWARDS.sellFish);
        }),
        // ── Prestige ────────────────────────────────────────
        performPrestige: () => set2((state) => {
          if (!canPrestige(state)) return;
          const next = performPrestige(state);
          Object.assign(state, next);
          addLogDraft(state, `PRESTIGE! You are now Prestige Level ${state.player.prestigeLevel}. All permanent bonuses increased.`);
        }),
        // ── Pause toggle ────────────────────────────────────
        paused: false,
        togglePause: () => set2((state) => {
          state.paused = !state.paused;
          if (!state.paused) state.lastTickAt = Date.now();
        }),
        setGameSpeed: (speed) => set2((state) => {
          state.gameSpeed = Math.max(1, Math.min(3, speed));
        }),
        // ── Campaign ──────────────────────────────────────
        startCampaignLevel: (levelId) => {
          var _a, _b;
          const level = getLevelById(levelId);
          if (!level) return;
          const completedLevels = ((_a = get2().campaign) == null ? void 0 : _a.completedLevels) || {};
          const fresh = createDefaultState();
          const ls = level.startingState || {};
          const startFish = [];
          const fishCount = ls.starterFishCount || 0;
          const fishStage = ls.starterFishStage || "adult";
          for (let i = 0; i < fishCount; i++) {
            startFish.push(createFish({ stage: fishStage, tankId: "tank_0" }));
          }
          const tanks = [];
          const tankCount = ls.tankCount || 1;
          const cap = ((_b = level.constraints) == null ? void 0 : _b.tankCapacity) || 12;
          for (let i = 0; i < tankCount; i++) {
            const t = createDefaultTank(`tank_${i}`, "display");
            t.capacity = cap;
            tanks.push(t);
          }
          const newState = {
            ...fresh,
            campaign: {
              mode: "campaign",
              activeLevelId: levelId,
              completedLevels,
              levelCompleted: false,
              levelStartedAt: Date.now()
            },
            player: {
              ...fresh.player,
              coins: ls.coins ?? 325,
              stats: { ...fresh.player.stats, fishBought: 0, fishListed: 0, breedingsStarted: 0, eggsHatched: 0, wantedFulfilled: 0, fishDied: 0, fishSold: 0, fishFed: 0 }
            },
            tanks,
            fish: ls.fish || startFish,
            maxBays: ls.maxBays ?? 1,
            breedingTank: {
              ...fresh.breedingTank,
              breedingDurationMs: fresh.breedingTank.breedingDurationMs
            },
            gameClock: Date.now(),
            gameSpeed: 1,
            staff: [],
            lastWageDay: 0,
            giftShop: { unlocked: false, level: 0, totalEarned: 0 },
            cafe: { unlocked: false, level: 0, totalEarned: 0 },
            notifications: [],
            suppliers: { unlocked: ["basic"], activeSupplier: "basic" },
            unlockedRooms: ["lobby"],
            roomAssignments: {}
          };
          set2((state) => {
            Object.assign(state, newState);
          });
        },
        completeCampaignLevel: () => set2((state) => {
          var _a, _b, _c;
          const levelId = (_a = state.campaign) == null ? void 0 : _a.activeLevelId;
          if (!levelId) return;
          const level = getLevelById(levelId);
          if (!level) return;
          const stars = getStarRating(level, state);
          const prev = (_b = state.campaign.completedLevels) == null ? void 0 : _b[levelId];
          const bestStars = Math.max(stars, (prev == null ? void 0 : prev.stars) || 0);
          state.campaign.completedLevels[levelId] = { stars: bestStars, completedAt: Date.now() };
          playVictory();
          if ((_c = level.rewards) == null ? void 0 : _c.unlocks) {
            for (const uid of level.rewards.unlocks) {
              if (!state.campaign.completedLevels[uid]) {
                state.campaign.completedLevels[uid] = { stars: 0, unlocked: true };
              }
            }
          }
          state.campaign.activeLevelId = null;
          state.campaign.levelCompleted = false;
          state._pendingVictory = null;
        }),
        abandonCampaignLevel: () => set2((state) => {
          state.campaign.activeLevelId = null;
          state.campaign.levelCompleted = false;
        }),
        // ── Staff Management ────────────────────────────────
        hireStaff: (role) => set2((state) => {
          var _a, _b;
          const cost = getHireCost(role);
          const maxStaff = getMaxStaff(((_a = state.player) == null ? void 0 : _a.level) || 1);
          if ((state.staff || []).length >= maxStaff) {
            fireToast(`Staff limit reached (${maxStaff}). Level up to hire more.`, "alert", "");
            return;
          }
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins to hire!");
            return;
          }
          state.player.coins -= cost;
          const member = createStaffMember(role);
          if (!state.staff) state.staff = [];
          state.staff.push(member);
          playHire();
          addLogDraft(state, `Hired ${member.name} as ${((_b = STAFF_ROLES[role]) == null ? void 0 : _b.label) || role}.`);
        }),
        fireStaff: (staffId) => set2((state) => {
          const idx = (state.staff || []).findIndex((s) => s.id === staffId);
          if (idx < 0) return;
          const member = state.staff[idx];
          addLogDraft(state, `${member.name} has been let go.`);
          state.staff.splice(idx, 1);
        }),
        assignStaff: (staffId, tankId) => set2((state) => {
          const member = (state.staff || []).find((s) => s.id === staffId);
          if (!member) return;
          member.assignedTankId = tankId;
        }),
        trainStaff: (staffId) => set2((state) => {
          const member = (state.staff || []).find((s) => s.id === staffId);
          if (!member) return;
          const roleDef = STAFF_ROLES[member.role];
          if (!roleDef || member.level >= roleDef.maxLevel) {
            fireToast("Already at max level.", "alert", "");
            return;
          }
          const cost = getTrainCost(member);
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins to train!");
            return;
          }
          state.player.coins -= cost;
          member.level += 1;
          playCoin();
          addLogDraft(state, `${member.name} trained to level ${member.level + 1}!`);
        }),
        // ── Research ────────────────────────────────────────
        purchaseResearch: (branchId) => set2((state) => {
          var _a, _b, _c;
          const branch = RESEARCH_BRANCHES[branchId];
          if (!branch) return;
          if (!state.player.research) state.player.research = {};
          const level = state.player.research[branchId] || 0;
          if (level >= branch.tiers.length) {
            fireToast("Branch fully researched!", "alert", "");
            return;
          }
          const tier = branch.tiers[level];
          if (state.player.coins < tier.cost) {
            playWarning();
            addLogDraft(state, "Not enough coins for research!");
            return;
          }
          state.player.coins -= tier.cost;
          state.player.research[branchId] = level + 1;
          playResearch();
          addLogDraft(state, `Researched: ${tier.label} — ${tier.desc}`);
          fireToast(`${tier.label}: ${tier.desc}`, "success", "");
          const fx = getResearchEffects(state);
          if (fx.breedSpeed && fx.breedSpeed !== 1) {
            const baseDuration = 3e5;
            const breedLvl = ((_c = (_b = (_a = state.shop) == null ? void 0 : _a.upgrades) == null ? void 0 : _b.breeding) == null ? void 0 : _c.level) || 0;
            const newDuration = Math.round(baseDuration * Math.pow(0.7, breedLvl) * fx.breedSpeed);
            state.breedingTank.breedingDurationMs = newDuration;
            if (state.extraBays) {
              state.extraBays.forEach((bay) => {
                bay.breedingDurationMs = newDuration;
              });
            }
          }
        }),
        // ── Tank Size Upgrade ───────────────────────────────
        upgradeTankSize: (tankId) => set2((state) => {
          var _a, _b, _c, _d;
          const tank = state.tanks.find((t) => t.id === tankId);
          if (!tank) return;
          const next = getNextTankSize(tank);
          if (!next) {
            fireToast("Tank is already at maximum size.", "alert", "");
            return;
          }
          if (next.minLevel && (((_a = state.player) == null ? void 0 : _a.level) || 1) < next.minLevel) {
            fireToast(`Requires player level ${next.minLevel}.`, "alert", "");
            return;
          }
          if (state.player.coins < next.cost) {
            playWarning();
            addLogDraft(state, "Not enough coins to upgrade tank!");
            return;
          }
          state.player.coins -= next.cost;
          tank.size = next.id;
          const globalBonus = (((_d = (_c = (_b = state.shop) == null ? void 0 : _b.upgrades) == null ? void 0 : _c.capacity) == null ? void 0 : _d.level) || 0) * 4;
          tank.capacity = next.capacity + globalBonus;
          playCoin();
          addLogDraft(state, `${tank.name} upgraded to ${next.label} (${tank.capacity} fish)!`);
        }),
        // ── Equipment ───────────────────────────────────────
        buyEquipment: (tankId, typeId) => set2((state) => {
          const tank = state.tanks.find((t) => t.id === tankId);
          if (!tank) return;
          const eqType = EQUIPMENT_TYPES[typeId];
          if (!eqType) return;
          if (!tank.equipment) tank.equipment = [];
          const count = tank.equipment.filter((e) => e.typeId === typeId).length;
          if (count >= eqType.maxPerTank) {
            fireToast(`Max ${eqType.maxPerTank} ${eqType.label}(s) per tank.`, "alert", "");
            return;
          }
          if (state.player.coins < eqType.cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          state.player.coins -= eqType.cost;
          tank.equipment.push(createEquipment(typeId));
          playEquipInstall();
          addLogDraft(state, `Installed ${eqType.label} in ${tank.name}.`);
        }),
        repairEquipment: (tankId, equipmentId) => set2((state) => {
          const tank = state.tanks.find((t) => t.id === tankId);
          if (!tank) return;
          const eq = (tank.equipment || []).find((e) => e.id === equipmentId);
          if (!eq || !eq.broken) return;
          const eqType = EQUIPMENT_TYPES[eq.typeId];
          if (!eqType) return;
          if (state.player.coins < eqType.repairCost) {
            playWarning();
            addLogDraft(state, "Not enough coins to repair!");
            return;
          }
          state.player.coins -= eqType.repairCost;
          eq.broken = false;
          playRepair();
          addLogDraft(state, `Repaired ${eqType.label} in ${tank.name}.`);
        }),
        // ── Amenities: Gift Shop + Café ─────────────────────
        unlockAmenity: (amenityId) => set2((state) => {
          const amenity = state[amenityId];
          if (!amenity) return;
          if (amenity.unlocked) {
            fireToast("Already unlocked!", "alert", "");
            return;
          }
          const costs = { giftShop: 500, cafe: 750 };
          const cost = costs[amenityId] || 500;
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          state.player.coins -= cost;
          amenity.unlocked = true;
          playCoin();
          const names = { giftShop: "Gift Shop", cafe: "Café" };
          addLogDraft(state, `${names[amenityId] || amenityId} unlocked!`);
          fireToast(`${names[amenityId]} is now open for business!`, "success", "");
        }),
        upgradeAmenity: (amenityId) => set2((state) => {
          const amenity = state[amenityId];
          if (!amenity || !amenity.unlocked) return;
          if (amenity.level >= 4) {
            fireToast("Already at max level!", "alert", "");
            return;
          }
          const upgCosts = [0, 400, 1e3, 2500, 6e3];
          const cost = upgCosts[amenity.level + 1] || 9999;
          if (state.player.coins < cost) {
            playWarning();
            addLogDraft(state, "Not enough coins to upgrade!");
            return;
          }
          state.player.coins -= cost;
          amenity.level += 1;
          playCoin();
          const names = { giftShop: "Gift Shop", cafe: "Café" };
          addLogDraft(state, `${names[amenityId]} upgraded to level ${amenity.level + 1}!`);
        }),
        // ── Rooms ────────────────────────────────────────────
        unlockRoom: (roomId) => set2((state) => {
          var _a, _b;
          const room = ROOMS.find((r) => r.id === roomId);
          if (!room) return;
          if ((state.unlockedRooms || []).includes(roomId)) {
            fireToast("Room already unlocked!", "alert", "");
            return;
          }
          if (room.minRep && (((_a = state.shop) == null ? void 0 : _a.reputation) || 0) < room.minRep) {
            fireToast(`Requires ${room.minRep} reputation.`, "alert", "");
            return;
          }
          if (room.minPrestige && (((_b = state.player) == null ? void 0 : _b.prestigeLevel) || 0) < room.minPrestige) {
            fireToast(`Requires Prestige ${room.minPrestige}.`, "alert", "");
            return;
          }
          if (state.player.coins < room.cost) {
            playWarning();
            addLogDraft(state, "Not enough coins!");
            return;
          }
          state.player.coins -= room.cost;
          if (!state.unlockedRooms) state.unlockedRooms = ["lobby"];
          state.unlockedRooms.push(roomId);
          playCoin();
          addLogDraft(state, `Unlocked ${room.label}!`);
          fireToast(`${room.label} is now open!`, "success", "");
        }),
        assignTankToRoom: (tankId, roomId) => set2((state) => {
          if (!state.roomAssignments) state.roomAssignments = {};
          const room = ROOMS.find((r) => r.id === roomId);
          if (!room) return;
          if (!(state.unlockedRooms || []).includes(roomId)) return;
          const tanksInRoom = (state.tanks || []).filter((t) => (state.roomAssignments[t.id] || "lobby") === roomId).length;
          if (state.roomAssignments[tankId] !== roomId && tanksInRoom >= room.maxTanks) {
            fireToast(`${room.label} is full (${room.maxTanks} tanks max).`, "alert", "");
            return;
          }
          state.roomAssignments[tankId] = roomId;
          addLogDraft(state, `Moved tank to ${room.label}.`);
        }),
        // ── Notifications ───────────────────────────────────
        pushNotification: (message, type = "info") => set2((state) => {
          if (!state.notifications) state.notifications = [];
          state.notifications.unshift({ id: Date.now() + Math.random(), message, type, at: Date.now() });
          if (state.notifications.length > 20) state.notifications.length = 20;
        }),
        dismissNotification: (notifId) => set2((state) => {
          state.notifications = (state.notifications || []).filter((n) => n.id !== notifId);
        }),
        // ── Suppliers ───────────────────────────────────────
        switchSupplier: (supplierId) => set2((state) => {
          var _a;
          const unlocked = ((_a = state.suppliers) == null ? void 0 : _a.unlocked) || ["basic"];
          if (!unlocked.includes(supplierId)) {
            fireToast("Supplier not unlocked yet.", "alert", "");
            return;
          }
          state.suppliers.activeSupplier = supplierId;
          addLogDraft(state, `Switched supplier to ${supplierId}.`);
        }),
        // ── Special Orders ──────────────────────────────────
        fulfillOrder: (orderId, fishId) => set2((state) => {
          if (!fishId || !orderId) return;
          const order = (state.specialOrders || []).find((o) => o.id === orderId);
          if (!order || order.fulfilled) return;
          const fish = findFish(state, fishId);
          if (!fish) return;
          if (!checkOrderFulfillment(fish, order)) {
            playWarning();
            addLogDraft(state, "That fish does not satisfy the special order.");
            return;
          }
          order.fulfilled = true;
          state.player.coins += order.reward;
          state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + order.reward;
          state.fish = state.fish.filter((f) => f.id !== fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter((id) => id !== fishId);
          if (state.shop.fishPrices) delete state.shop.fishPrices[fishId];
          removeFishFromBreedSlots(state, fishId);
          addXp(state, order.xpReward || 25);
          playCoinScaled(order.reward);
          addLogDraft(state, `Order fulfilled for ${order.customer}! +${order.reward}`);
        }),
        // ── Research ────────────────────────────────────────
        buyResearch: (branchId) => set2((state) => {
          var _a, _b;
          const level = ((_b = (_a = state.player) == null ? void 0 : _a.research) == null ? void 0 : _b[branchId]) || 0;
          const branch = RESEARCH_BRANCHES[branchId];
          if (!branch || level >= branch.tiers.length) return;
          const next = branch.tiers[level];
          if (state.player.coins < next.cost) {
            playWarning();
            return;
          }
          state.player.coins -= next.cost;
          if (!state.player.research) state.player.research = {};
          state.player.research[branchId] = level + 1;
          addXp(state, 20);
          playCoin();
          addLogDraft(state, `Researched: ${next.label}! ${next.desc}`);
        }),
        // ── Loans ───────────────────────────────────────────
        takeLoan: (tierId) => set2((state) => {
          var _a, _b;
          if ((_b = (_a = state.player) == null ? void 0 : _a.activeLoan) == null ? void 0 : _b.active) {
            playWarning();
            return;
          }
          const tier = LOAN_TIERS.find((t) => t.id === tierId);
          if (!tier) return;
          state.player.coins += tier.amount;
          state.player.activeLoan = { active: true, tierId: tier.id, amount: tier.amount, interest: tier.interest, repayBy: tier.repayBy, takenAt: state.gameClock || Date.now() };
          playCoin();
          addLogDraft(state, `Loan: +${tier.amount} at ${tier.interest * 100}% interest.`);
        }),
        repayLoan: () => set2((state) => {
          var _a;
          const loan = (_a = state.player) == null ? void 0 : _a.activeLoan;
          if (!(loan == null ? void 0 : loan.active)) return;
          const owed = Math.round(loan.amount * (1 + loan.interest));
          if (state.player.coins < owed) {
            playWarning();
            return;
          }
          state.player.coins -= owed;
          state.player.activeLoan = { active: false };
          playCoin();
          addLogDraft(state, `Loan repaid! ${owed}`);
        }),
        // ── Daily Rewards ───────────────────────────────────
        claimDailyReward: () => set2((state) => {
          const today = (/* @__PURE__ */ new Date()).toDateString();
          if (state.player.lastDailyClaimDate === today) return;
          const last = state.player.lastDailyClaimDate;
          const wasYesterday = last && (new Date(today) - new Date(last)) / 864e5 <= 1;
          const oldStreak = state.player.dailyStreak || 0;
          const streak = wasYesterday ? oldStreak + 1 : 1;
          if (!wasYesterday && oldStreak >= 3) {
            const lostMult = getStreakMultiplier(oldStreak);
            addLogDraft(state, `${oldStreak}-day streak broken! Lost ${getStreakLabel(oldStreak)} (${Math.round((lostMult - 1) * 100)}% bonus). Starting over...`);
          }
          state.player.dailyStreak = streak;
          state.player.lastDailyClaimDate = today;
          const reward = 25 + streak * 10;
          state.player.coins += reward;
          addXp(state, 10);
          playCoinScaled(reward);
          const mult = getStreakMultiplier(streak);
          const label = getStreakLabel(streak);
          const multMsg = mult > 1 ? ` ${label} — ${Math.round((mult - 1) * 100)}% coin bonus active!` : "";
          addLogDraft(state, `Day ${streak} reward: +${reward}!${multMsg}`);
        }),
        // ── Tank backgrounds ────────────────────────────────
        buyBackground: (bgId) => set2((state) => {
          const bg = TANK_BACKGROUNDS.find((b) => b.id === bgId);
          if (!bg || bg.cost === 0 || (state.player.unlockedBackgrounds || []).includes(bgId)) return;
          if (state.player.coins < bg.cost) {
            playWarning();
            return;
          }
          state.player.coins -= bg.cost;
          if (!state.player.unlockedBackgrounds) state.player.unlockedBackgrounds = [];
          state.player.unlockedBackgrounds.push(bgId);
          playCoin();
          addLogDraft(state, `Unlocked: ${bg.label}!`);
        }),
        setTankBackground: (tankId, bgId) => set2((state) => {
          const tank = findTank(state, tankId);
          if (tank) tank.backgroundId = bgId;
        }),
        claimMilestone: (milestoneId) => set2((state) => {
          var _a, _b, _c, _d;
          if (!state.player.completedMilestones) state.player.completedMilestones = [];
          if (state.player.completedMilestones.includes(milestoneId)) return;
          const m = MILESTONES.find((ms) => ms.id === milestoneId);
          if (!m || !m.check(state)) return;
          state.player.completedMilestones.push(milestoneId);
          if ((_a = m.reward) == null ? void 0 : _a.coins) {
            state.player.coins += m.reward.coins;
            state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + m.reward.coins;
          }
          addXp(state, 30);
          playCoinScaled(((_b = m.reward) == null ? void 0 : _b.coins) || 50);
          addLogDraft(state, `Milestone: ${m.title}! ${((_c = m.reward) == null ? void 0 : _c.coins) ? "+" + m.reward.coins : ""}`);
          state._pendingCelebration = {
            title: m.title,
            desc: m.desc || "",
            emoji: m.emoji || "",
            reward: ((_d = m.reward) == null ? void 0 : _d.coins) ? `${m.reward.coins} coins` : null
          };
        }),
        // ── Wanted Board ──────────────────────────────────
        fulfillWanted: (posterId, fishId) => set2((state) => {
          var _a;
          const poster = (state.wantedPosters || []).find((p) => p.id === posterId);
          if (!poster || poster.fulfilled) return;
          const fish = findFish(state, fishId);
          if (!fish || !fishMatchesPoster(fish, poster)) return;
          poster.fulfilled = true;
          state.player.stats.wantedFulfilled = (state.player.stats.wantedFulfilled || 0) + 1;
          state.player.coins += poster.reward;
          state.fish = state.fish.filter((f) => f.id !== fishId);
          state.shop.listedFish = (state.shop.listedFish || []).filter((id) => id !== fishId);
          removeFishFromBreedSlots(state, fishId);
          playCoinScaled(poster.reward);
          playDiscoverScaled("uncommon");
          addXp(state, 30);
          addLogDraft(state, `Bounty fulfilled! Delivered ${((_a = fish.species) == null ? void 0 : _a.name) || "fish"} to ${poster.buyer} for ${poster.reward}!`);
        }),
        refreshWantedBoard: () => set2((state) => {
          if (!state.wantedPosters) state.wantedPosters = [];
          const level = Math.floor((state.player.xp || 0) / 500) + 1;
          const active = state.wantedPosters.filter((p) => !p.fulfilled && p.expiresAt > (state.gameClock || Date.now()));
          const maxPosters = Math.min(3, 1 + Math.floor(level / 8));
          while (active.length < maxPosters) {
            const poster = generateWantedPoster(level, active, state.gameClock);
            if (poster) {
              active.push(poster);
              state.wantedPosters.push(poster);
            } else break;
          }
        }),
        // ── Micro-events ──────────────────────────────────
        claimMicroEvent: (eventId, coins, xp) => set2((state) => {
          if (!state.player) return;
          state.player.coins += coins || 0;
          if (xp) addXp(state, xp);
          if (coins > 0) playCoin();
          state.lastMicroEventAt = state.gameClock || Date.now();
        }),
        // ── Fish memorial ─────────────────────────────────
        addMemorial: (fish) => set2((state) => {
          var _a, _b, _c;
          if (!state.memorials) state.memorials = [];
          const descendants = state.fish.filter(
            (f) => {
              var _a2;
              return (_a2 = f.parentIds) == null ? void 0 : _a2.includes(fish.id);
            }
          ).length;
          const totalEarned = (state.shop.salesHistory || []).filter((s) => {
            var _a2;
            return s.fishName === ((_a2 = fish.species) == null ? void 0 : _a2.name);
          }).reduce((sum, s) => sum + (s.coins || 0), 0);
          state.memorials.unshift({
            id: fish.id,
            name: fish.nickname || ((_a = fish.species) == null ? void 0 : _a.name) || "Unknown",
            species: (_b = fish.species) == null ? void 0 : _b.name,
            rarity: (_c = fish.species) == null ? void 0 : _c.rarity,
            personality: fish.personality,
            generation: fish.generation || 1,
            livedDays: Math.round(((state.gameClock || (state.gameClock || Date.now())) - (fish.bornAt || (state.gameClock || (state.gameClock || Date.now())))) / 864e5 * 10) / 10,
            descendants,
            totalEarned,
            diedAt: state.gameClock || Date.now()
          });
          if (state.memorials.length > 50) state.memorials.length = 50;
        }),
        resetGame: () => set2((state) => {
          var _a;
          const completedLevels = ((_a = state.campaign) == null ? void 0 : _a.completedLevels) || {};
          const fresh = createDefaultState();
          Object.assign(state, fresh);
          state.campaign.completedLevels = completedLevels;
        }),
        handleExportSave: () => {
          exportSave(get2());
        },
        quickSave: () => {
          const state = get2();
          if (saveGame(state)) {
            set2({ _saveFlash: Date.now() });
          } else {
            fireToast("Save failed — storage full?", "alert", "");
          }
        },
        handleImportSave: async (file) => {
          try {
            const imported = await importSave(file);
            set2(imported);
            fireToast("Save imported", "info", "");
          } catch (e) {
            fireToast(e.message, "alert", "");
          }
        }
      };
    })
  )
);
let _saveInterval;
function startAutoSave() {
  if (_saveInterval) return;
  _saveInterval = setInterval(() => {
    const state = useGameStore.getState();
    if (saveGame(state)) {
      useGameStore.setState({ _saveFlash: Date.now() });
    } else {
      fireToast("Save failed — storage full?", "alert", "");
    }
  }, 3e4);
}
function handleUnload() {
  saveGame(useGameStore.getState());
}
const HIDDEN_TICK_MS = 5e3;
function handleVisibility() {
  if (document.visibilityState === "hidden") {
    saveGame(useGameStore.getState());
    if (_tickInterval) clearInterval(_tickInterval);
    _tickInterval = setInterval(() => useGameStore.getState().tick(), HIDDEN_TICK_MS);
  } else {
    if (_tickInterval) clearInterval(_tickInterval);
    _tickInterval = setInterval(() => useGameStore.getState().tick(), TICK_INTERVAL_MS);
  }
}
let _tickInterval;
function startTick() {
  if (_tickInterval) return;
  _tickInterval = setInterval(() => useGameStore.getState().tick(), TICK_INTERVAL_MS);
}
let _achUnsub;
function startAchievementChecker() {
  if (_achUnsub) return;
  const buildKey = (s) => {
    var _a, _b, _c;
    return [
      (s.player.fishdex || []).length,
      (s.shop.salesHistory || []).length,
      s.player.totalCoinsEarned || 0,
      s.tanks.length,
      (s.player.magicFishFound || []).length,
      ((_a = s.player.stats) == null ? void 0 : _a.eggsCollected) || 0,
      ((_b = s.player.stats) == null ? void 0 : _b.medicineUsed) || 0,
      ((_c = s.player.stats) == null ? void 0 : _c.waterTreated) || 0,
      s.fish.length
    ].join(",");
  };
  let prevKey = buildKey(useGameStore.getState());
  _achUnsub = useGameStore.subscribe((state) => {
    const key = buildKey(state);
    if (key === prevKey) return;
    prevKey = key;
    const msgs = [];
    const next = checkAchievements(state, msgs);
    if (next === state) return;
    useGameStore.setState((draft) => {
      draft.player.coins = next.player.coins;
      draft.player.achievements = next.player.achievements;
      draft.player.unlockedDecorations = next.player.unlockedDecorations;
      draft.player.legendFishUnlocked = next.player.legendFishUnlocked;
      if (msgs.length > 0) {
        const entries = msgs.map((m) => ({ time: Date.now(), message: m, severity: "warn" }));
        draft.log = [...entries, ...draft.log || []].slice(0, 60);
      }
    });
  });
}
let _salesUnsub;
function startSalesWatcher() {
  if (_salesUnsub) return;
  let prevLen = (useGameStore.getState().shop.salesHistory || []).length;
  _salesUnsub = useGameStore.subscribe(
    (s) => (s.shop.salesHistory || []).length,
    (len) => {
      if (len > prevLen) {
        const sale = useGameStore.getState().shop.salesHistory[0];
        playSaleScaled((sale == null ? void 0 : sale.coins) || 0);
        if (sale) fireToast(`Sold ${sale.fishName} for ${sale.coins}!`, "info", "");
      }
      prevLen = len;
    }
  );
}
let _achSoundUnsub;
function startAchSoundWatcher() {
  if (_achSoundUnsub) return;
  let prevLen = (useGameStore.getState().player.achievements || []).length;
  _achSoundUnsub = useGameStore.subscribe(
    (s) => (s.player.achievements || []).length,
    (len) => {
      if (len > prevLen) {
        playDiscoverScaled("uncommon");
        const achs = useGameStore.getState().player.achievements || [];
        for (let i = prevLen; i < len; i++) {
          const ach = achs[i];
          fireToast(ach ? `Achievement: ${ach.id}` : "Achievement unlocked!", "achieve", "");
          if (ach) syncSteamAchievement(ach.id);
        }
      }
      prevLen = len;
    }
  );
}
let _diseaseUnsub;
let _levelUpUnsub;
function startLevelUpWatcher() {
  var _a;
  if (_levelUpUnsub) return;
  let prevLevel = getLevelFromXp(((_a = useGameStore.getState().player) == null ? void 0 : _a.xp) || 0).level;
  _levelUpUnsub = useGameStore.subscribe(
    (s) => {
      var _a2;
      return ((_a2 = s.player) == null ? void 0 : _a2.xp) || 0;
    },
    (xp) => {
      const { level } = getLevelFromXp(xp);
      if (level > prevLevel) {
        playLevelUp();
        fireToast(`Level Up! You are now Level ${level} — ${getLevelTitle(level)}`, "achieve", "");
      }
      prevLevel = level;
    }
  );
}
function startDiseaseWatcher() {
  if (_diseaseUnsub) return;
  const seen = /* @__PURE__ */ new Set();
  _diseaseUnsub = useGameStore.subscribe(
    (s) => s.fish,
    (fish) => {
      var _a;
      for (const f of fish) {
        if (f.disease && !seen.has(f.id)) {
          seen.add(f.id);
          playSick();
          fireToast(`${((_a = f.species) == null ? void 0 : _a.name) || "Fish"} is sick!`, "alert", "");
        } else if (!f.disease) {
          seen.delete(f.id);
        }
      }
    }
  );
}
let _breedUnsub;
function startBreedingWatcher() {
  var _a;
  if (_breedUnsub) return;
  let wasReady = [((_a = useGameStore.getState().breedingTank) == null ? void 0 : _a.eggReady) || false, ...(useGameStore.getState().extraBays || []).map((b) => (b == null ? void 0 : b.eggReady) || false)].join(",");
  _breedUnsub = useGameStore.subscribe(
    (s) => {
      var _a2;
      const main = ((_a2 = s.breedingTank) == null ? void 0 : _a2.eggReady) || false;
      const extra = (s.extraBays || []).map((b) => (b == null ? void 0 : b.eggReady) || false);
      return [main, ...extra].join(",");
    },
    (readyStr) => {
      const readyStates = readyStr.split(",").map((s) => s === "true");
      const anyNew = readyStates.some((r, i) => r && !wasReady.split(",").map((s) => s === "true")[i]);
      if (anyNew) {
        playDiscover();
        fireToast("An egg is ready to collect!", "info", "");
      }
      wasReady = readyStr;
    }
  );
}
let _deathUnsub;
function startDeathWatcher() {
  if (_deathUnsub) return;
  let prevIds = new Set(useGameStore.getState().fish.map((f) => f.id));
  _deathUnsub = useGameStore.subscribe(
    (s) => s.fish.length,
    () => {
      const currentIds = new Set(useGameStore.getState().fish.map((f) => f.id));
      const autopsies = useGameStore.getState().player.autopsies || [];
      for (const id of prevIds) {
        if (!currentIds.has(id)) {
          const autopsy = autopsies.find((a) => a._fishId === id);
          if (autopsy) {
            playDeath();
            fireToast(`${autopsy.fishName} has died`, "alert", "");
          }
        }
      }
      prevIds = currentIds;
    }
  );
}
let _eventUnsub;
function startEventWatcher() {
  if (_eventUnsub) return;
  let lastEventId = useGameStore.getState().lastRandomEventId || null;
  _eventUnsub = useGameStore.subscribe(
    (s) => s.lastRandomEventId,
    (eventId) => {
      if (eventId && eventId !== lastEventId) {
        const event = useGameStore.getState().activeEvent;
        if (event) {
          fireToast(event.name + " " + event.desc, "event", event.emoji);
        }
      }
      lastEventId = eventId;
    }
  );
}
function bootSideEffects() {
  var _a, _b;
  startAutoSave();
  startTick();
  startAchievementChecker();
  startSalesWatcher();
  startAchSoundWatcher();
  startDiseaseWatcher();
  startLevelUpWatcher();
  startBreedingWatcher();
  startDeathWatcher();
  startEventWatcher();
  window.addEventListener("beforeunload", handleUnload);
  document.addEventListener("visibilitychange", handleVisibility);
  const achs = ((_a = useGameStore.getState().player) == null ? void 0 : _a.achievements) || [];
  if (achs.length > 0) syncAllSteamAchievements(achs);
  useGameStore.getState().refreshWantedBoard();
  if (typeof window !== "undefined" && ((_b = window.electronAPI) == null ? void 0 : _b.isElectron)) {
    loadGameAsync().then((save) => {
      if (!save) return;
      const current2 = useGameStore.getState();
      if ((save.lastSavedAt || 0) > (current2.lastSavedAt || 0)) {
        console.log("[Electron] Hydrating from filesystem save (newer)");
        try {
          const hydrated = applyOfflineProgress(save);
          useGameStore.setState(hydrated);
        } catch (err) {
          console.warn("[Electron] Hydration failed, keeping localStorage state:", err);
        }
      }
    }).catch((err) => console.warn("[Electron] Async load failed:", err));
  }
}
function teardownSideEffects() {
  clearInterval(_saveInterval);
  _saveInterval = null;
  clearInterval(_tickInterval);
  _tickInterval = null;
  _achUnsub == null ? void 0 : _achUnsub();
  _achUnsub = null;
  _salesUnsub == null ? void 0 : _salesUnsub();
  _salesUnsub = null;
  _achSoundUnsub == null ? void 0 : _achSoundUnsub();
  _achSoundUnsub = null;
  _diseaseUnsub == null ? void 0 : _diseaseUnsub();
  _diseaseUnsub = null;
  _levelUpUnsub == null ? void 0 : _levelUpUnsub();
  _levelUpUnsub = null;
  _breedUnsub == null ? void 0 : _breedUnsub();
  _breedUnsub = null;
  _deathUnsub == null ? void 0 : _deathUnsub();
  _deathUnsub = null;
  _eventUnsub == null ? void 0 : _eventUnsub();
  _eventUnsub = null;
  window.removeEventListener("beforeunload", handleUnload);
  document.removeEventListener("visibilitychange", handleVisibility);
}
const gameStore = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  bootSideEffects,
  teardownSideEffects,
  useGameStore
}, Symbol.toStringTag, { value: "Module" }));
export {
  checkMagicFishMatch as $,
  createFish as A,
  randomGenome as B,
  CURE_SUCCESS_RATE as C,
  DISEASES as D,
  EGG_HATCH_ANIM_MS as E,
  playDiscover as F,
  GENES as G,
  playBubble as H,
  playCoin as I,
  loadGame as J,
  startMusic as K,
  LIFESPAN_BY_RARITY as L,
  fishMatchesPoster as M,
  CAMPAIGN_LEVELS as N,
  getLevelById as O,
  PERSONALITY_EMOJI as P,
  checkObjective as Q,
  REAL_SPECIES_MAP as R,
  SPRITE_SIZE as S,
  TANK_UNLOCK as T,
  getObjectiveProgress as U,
  playVictory as V,
  getStarRating as W,
  EQUIPMENT_TYPES as X,
  addLogDraft as Y,
  updateChallengeProgress as Z,
  MAGIC_FISH as _,
  getThemeById as a,
  playDiscoverScaled as a0,
  ToastManager as a1,
  playClick as a2,
  isMusicPlaying as a3,
  playTabSwitch as a4,
  TANK_TYPES as a5,
  ACHIEVEMENT_DEFS as a6,
  DECOR_CATALOG as a7,
  isDraftable as a8,
  produce as a9,
  isDraft as aa,
  current as ab,
  getTotalDailyWages as ac,
  MUTATION_RECIPES as ad,
  getLoanStatus as ae,
  getStreakLabel as af,
  getStreakMultiplier as ag,
  getMilestoneProgress as ah,
  getCompletedCount as ai,
  checkOrderFulfillment as aj,
  RESEARCH_BRANCHES as ak,
  LOAN_TIERS as al,
  getTotalPossibleDiscoveries as am,
  TANK_BACKGROUNDS as an,
  getTotalMilestones as ao,
  TANK_THEMES as ap,
  DECOR_CATEGORIES as aq,
  STAFF_ROLES as ar,
  getHireCost as as,
  getStaffWage as at,
  getTrainCost as au,
  getMaxStaff as av,
  ROOMS as aw,
  gameStore as ax,
  getDecorById as b,
  computePhenotype as c,
  getSpeciesFromPhenotype as d,
  expressGene as e,
  RARITY as f,
  getBackground as g,
  getCompat as h,
  getMarketMultiplier as i,
  getDiseaseStage as j,
  getCarrierTraits as k,
  checkLegendaryCombo as l,
  getNextTankSize as m,
  getTankCompatSummary as n,
  upgradeCost as o,
  getLevelTitle as p,
  getLevelFromXp as q,
  getCustomerInterval as r,
  predictOffspringPhenotypes as s,
  getMasterVolume as t,
  useGameStore as u,
  getMusicVolume as v,
  getSFXVolume as w,
  setMasterVolume as x,
  setMusicVolume as y,
  setSFXVolume as z
};
