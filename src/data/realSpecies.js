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
    key:            'bluetang',
    name:           'Blue Tang',
    scientificName: 'Paracanthurus hepatus',
    rarity:         'rare',
    visualType:     'species',
    basePrice:      280,
    lore:           'The blue tang carries a sharp spine near its tail — a scalpel-like defence that gives its family the name "surgeonfish". In the wild it roams coral reefs in loose schools, grazing on algae.',
    habitat:        'Indo-Pacific coral reefs, 2–40m depth',
    funFact:        'Blue tangs can change shade — they go pale when stressed or sleeping, and return to vivid blue when active.',
    conservationStatus: 'Least Concern',
    behaviorProfile: {
      swimSpeed:      0.80,
      turnChance:     0.022,
      bobAmplitude:   0.018,
      preferredYRange:[15, 65],
      idleProbability:0.08,
      dartiness:      0.2,
    },
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
    key:            'betta',
    name:           'Betta',
    scientificName: 'Betta splendens',
    rarity:         'rare',
    visualType:     'species',
    basePrice:      320,
    lore:           'Known as the Siamese fighting fish, the betta has been selectively bred for centuries into an astonishing variety of fin shapes and colour morphs. Each fish is a living work of art — and fiercely territorial.',
    habitat:        'Shallow rice paddies and slow streams of Southeast Asia',
    funFact:        'Bettas breathe air directly using a specialised organ called the labyrinth, letting them survive in oxygen-poor water.',
    conservationStatus: 'Vulnerable (wild populations declining due to habitat loss)',
    behaviorProfile: {
      swimSpeed:      0.38,
      turnChance:     0.038,
      bobAmplitude:   0.022,
      preferredYRange:[30, 65],
      idleProbability:0.18,
      dartiness:      0.12,
    },
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
    key:            'angelfish',
    name:           'Angelfish',
    scientificName: 'Pterophyllum scalare',
    rarity:         'uncommon',
    visualType:     'species',
    basePrice:      180,
    lore:           'The freshwater angelfish has been a centrepiece of the aquarium hobby for over a century. Its triangular profile and regal bearing make it one of the most recognisable fish in the world — despite being a cichlid at heart.',
    habitat:        'Amazon Basin slow-moving rivers and flooded forests, 0–10m depth',
    funFact:        'Angelfish form devoted mating pairs and both parents guard their eggs fiercely, fanning them with their fins to keep the water oxygenated.',
    conservationStatus: 'Least Concern',
    behaviorProfile: {
      swimSpeed:      0.42,
      turnChance:     0.018,
      bobAmplitude:   0.030,
      preferredYRange:[28, 70],  // tightened from [20,75] — tall sprite clips tank edges
      idleProbability:0.22,
      dartiness:      0.08,
    },
  },
];

// Quick lookup by key
export const REAL_SPECIES_MAP = Object.fromEntries(
  REAL_SPECIES.map(s => [s.key, s])
);
