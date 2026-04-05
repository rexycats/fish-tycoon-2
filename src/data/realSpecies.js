// ============================================================
// FISH TYCOON — REAL SPECIES CATALOG (Phase 12)
// ============================================================
// Species with visualType: 'species' bypass the procedural
// genetic renderer and use a dedicated sprite component.
// Each entry documents the full design audit (Step 1) inline.
// ============================================================

export const REAL_SPECIES = [
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
    key:            'clownfish',
    name:           'Clownfish',
    scientificName: 'Amphiprion ocellaris',
    rarity:         'uncommon',
    visualType:     'species',
    basePrice:      120,
    lore:           'Found sheltering among the stinging tentacles of sea anemones, the clownfish is coated in a special mucus that makes it immune. A fearless defender of its home.',
    habitat:        'Indo-Pacific coral reefs, 1–15m depth',
    funFact:        'All clownfish are born male. The dominant fish in a group can change sex to become female.',
    conservationStatus: 'Least Concern (vulnerable to bleaching events)',
    behaviorProfile: {
      swimSpeed:      0.55,
      turnChance:     0.045,
      bobAmplitude:   0.012,
      preferredYRange:[45, 78],
      idleProbability:0.35,
      dartiness:      0.7,
    },
  },
];

// Quick lookup by key
export const REAL_SPECIES_MAP = Object.fromEntries(
  REAL_SPECIES.map(s => [s.key, s])
);
