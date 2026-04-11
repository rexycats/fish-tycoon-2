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
    colorVariants:  ['default', 'cinnabar', 'snowflake', 'melanistic', 'platinum', 'midnight'],
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
    colorVariants:  ['default', 'gold', 'midnight', 'albino'],
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
    colorVariants:  ['default', 'cobalt', 'emerald', 'albino'],
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
    colorVariants:  ['default', 'gold', 'marble', 'smoky'],
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
    key:            'goldfish',
    name:           'Goldfish',
    scientificName: 'Carassius auratus',
    rarity:         'uncommon',
    visualType:     'species',
    basePrice:      90,
    lore:           'Selectively bred in China over a thousand years from wild carp, the goldfish was the first fish ever kept purely for ornamental purposes. Fancy varieties like the ryukin and oranda remain among the most popular aquarium fish on Earth.',
    habitat:        'Originally slow-moving freshwater rivers and ponds of East Asia; now worldwide in aquaria and garden ponds',
    funFact:        'Goldfish do not have a three-second memory — they can be trained to navigate mazes and remember them months later.',
    conservationStatus: 'Not Evaluated (domesticated species)',
    colorVariants:  ['default', 'kohaku', 'calico', 'black'],
    behaviorProfile: {
      swimSpeed:      0.38,
      turnChance:     0.028,
      bobAmplitude:   0.022,
      preferredYRange:[50, 85],
      idleProbability:0.30,
      dartiness:      0.10,
    },
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
    key:            'mandarin_dragonet',
    name:           'Mandarin Dragonet',
    scientificName: 'Synchiropus splendidus',
    rarity:         'epic',
    visualType:     'species',
    basePrice:      1200,
    lore:           'Widely considered the most beautiful fish in the ocean, the Mandarin Dragonet\'s psychedelic blue-and-orange maze pattern is produced not by pigment cells but by specialised pigmented cells called cyanophores — rare in fish. It is cloaked in a noxious mucus that deters nearly all predators.',
    habitat:        'Indo-Pacific coral reefs, sheltered lagoons and inshore reefs, 1–18m depth',
    funFact:        'Mandarin Dragonets have no scales — instead their body is coated in a pungent, bitter mucus so toxic that even other fish avoid eating them.',
    conservationStatus: 'Least Concern (declining from collection pressure in some areas)',
    colorVariants:  ['psychedelic', 'red', 'ghost'],
    behaviorProfile: {
      swimSpeed:      0.28,
      turnChance:     0.055,
      bobAmplitude:   0.008,
      preferredYRange:[72, 92],
      idleProbability:0.55,
      dartiness:      0.05,
    },
  },
  {
    key:            'neon_tetra',
    name:           'Neon Tetra',
    scientificName: 'Paracheirodon innesi',
    rarity:         'common',
    visualType:     'species',
    basePrice:      40,
    colorVariants:  ['default', 'gold', 'albino', 'green'],
    lore:           'A tiny jewel of the Amazon. Its iridescent blue stripe is produced by light-reflecting cells called iridophores — nature\'s own neon sign.',
    habitat:        'Blackwater streams of the Amazon basin, Peru & Brazil',
    funFact:        'Their neon stripe actually turns off at night. In darkness, the iridophores contract and the fish becomes almost invisible.',
    conservationStatus: 'Least Concern (widely captive-bred)',
    behaviorProfile: {
      swimSpeed:      0.8,
      turnChance:     0.04,
      bobAmplitude:   0.015,
      preferredYRange:[25, 60],
      idleProbability:0.15,
      dartiness:      0.5,
    },
  },
  {
    key:            'discus',
    name:           'Discus',
    scientificName: 'Symphysodon discus',
    rarity:         'rare',
    visualType:     'species',
    basePrice:      380,
    colorVariants:  ['default', 'cobalt', 'pigeon', 'snakeskin'],
    lore:           'Known as the "King of the Aquarium," the discus demands perfect water conditions and rewards its keeper with colours no painter could replicate.',
    habitat:        'Slow-moving tributaries of the Amazon River',
    funFact:        'Discus parents feed their fry with a special mucus secreted from their skin — one of the few fish species to "nurse" their young.',
    conservationStatus: 'Not Evaluated (heavily captive-bred)',
    behaviorProfile: {
      swimSpeed:      0.35,
      turnChance:     0.01,
      bobAmplitude:   0.01,
      preferredYRange:[20, 60],
      idleProbability:0.45,
      dartiness:      0.0,
    },
  },
  {
    key:            'lionfish',
    name:           'Lionfish',
    scientificName: 'Pterois volitans',
    rarity:         'rare',
    visualType:     'species',
    basePrice:      450,
    colorVariants:  ['default', 'black', 'golden'],
    lore:           'Beautiful and venomous. Each ornate spine carries enough toxin to ruin a diver\'s week. In the aquarium, it drifts with regal indifference.',
    habitat:        'Indo-Pacific coral reefs (invasive in the Atlantic)',
    funFact:        'A single lionfish can reduce native reef fish populations by 79%. They have no natural predators in Atlantic waters.',
    conservationStatus: 'Least Concern (invasive pest in many regions)',
    behaviorProfile: {
      swimSpeed:      0.3,
      turnChance:     0.008,
      bobAmplitude:   0.012,
      preferredYRange:[30, 70],
      idleProbability:0.55,
      dartiness:      0.1,
    },
  },
  {
    key:            'seahorse',
    name:           'Seahorse',
    scientificName: 'Hippocampus kuda',
    rarity:         'epic',
    visualType:     'species',
    basePrice:      800,
    colorVariants:  ['default', 'yellow', 'purple', 'white'],
    lore:           'Neither fast nor fierce, the seahorse survives through camouflage and patience. It anchors itself with a prehensile tail and waits for tiny crustaceans to drift by.',
    habitat:        'Seagrass beds and coral reefs, Indo-Pacific',
    funFact:        'Male seahorses carry the eggs in a brood pouch and give birth to live young — the only animal where the male becomes pregnant.',
    conservationStatus: 'Vulnerable (threatened by habitat loss and traditional medicine trade)',
    behaviorProfile: {
      swimSpeed:      0.15,
      turnChance:     0.005,
      bobAmplitude:   0.02,
      preferredYRange:[30, 80],
      idleProbability:0.7,
      dartiness:      0.0,
    },
  },
  {
    key: 'pufferfish', name: 'Pufferfish', scientificName: 'Tetraodon nigroviridis',
    rarity: 'uncommon', visualType: 'species', basePrice: 160,
    colorVariants: ['default', 'spotted', 'albino', 'blue'],
    lore: 'When threatened, the pufferfish inflates to twice its size by gulping water. Its skin contains tetrodotoxin — one of nature\'s deadliest poisons.',
    habitat: 'Brackish estuaries, Southeast Asia', funFact: 'Pufferfish are one of the few animals that can blink and close their eyes.',
    conservationStatus: 'Least Concern',
    behaviorProfile: { swimSpeed: 0.4, turnChance: 0.025, bobAmplitude: 0.018, preferredYRange: [35, 70], idleProbability: 0.4, dartiness: 0.2 },
  },
  {
    key: 'jellyfish', name: 'Moon Jellyfish', scientificName: 'Aurelia aurita',
    rarity: 'rare', visualType: 'species', basePrice: 350,
    colorVariants: ['default', 'pink', 'blue', 'gold'],
    lore: 'No brain, no heart, no blood — yet the moon jellyfish has drifted through every ocean on Earth for over 500 million years. It is older than dinosaurs, trees, and even most insects.',
    habitat: 'All oceans, surface to 200m depth', funFact: 'Jellyfish are 95% water. Some species are biologically immortal — they can revert to their juvenile form.',
    conservationStatus: 'Least Concern',
    behaviorProfile: { swimSpeed: 0.12, turnChance: 0.003, bobAmplitude: 0.025, preferredYRange: [10, 50], idleProbability: 0.6, dartiness: 0.0 },
  },
  {
    key: 'koi', name: 'Koi', scientificName: 'Cyprinus rubrofuscus',
    rarity: 'uncommon', visualType: 'species', basePrice: 200,
    colorVariants: ['default', 'tancho', 'showa', 'ogon'],
    lore: 'Bred for over a thousand years in Japanese rice paddies, the koi represents perseverance and good fortune. The finest specimens sell for millions of yen at auction.',
    habitat: 'Freshwater ponds, originally East Asia', funFact: 'Koi can live over 200 years. The oldest recorded koi, named Hanako, was 226 years old.',
    conservationStatus: 'Least Concern (domesticated)',
    behaviorProfile: { swimSpeed: 0.3, turnChance: 0.012, bobAmplitude: 0.01, preferredYRange: [40, 80], idleProbability: 0.35, dartiness: 0.05 },
  },
  {
    key: 'moorish_idol', name: 'Moorish Idol', scientificName: 'Zanclus cornutus',
    rarity: 'rare', visualType: 'species', basePrice: 420,
    colorVariants: ['default', 'phantom', 'golden'],
    lore: 'The Moors believed this fish brought happiness, and would release any caught in their nets. Its impossibly long dorsal filament trails behind like a banner.',
    habitat: 'Indo-Pacific coral reefs, 3–180m', funFact: 'Moorish Idols are notoriously difficult to keep in captivity. They often refuse food and waste away.',
    conservationStatus: 'Least Concern',
    behaviorProfile: { swimSpeed: 0.45, turnChance: 0.015, bobAmplitude: 0.014, preferredYRange: [15, 55], idleProbability: 0.25, dartiness: 0.3 },
  },
  {
    key: 'triggerfish', name: 'Clown Triggerfish', scientificName: 'Balistoides conspicillum',
    rarity: 'uncommon', visualType: 'species', basePrice: 180,
    colorVariants: ['default', 'niger', 'sunset'],
    lore: 'Armed with a locking dorsal spine that it raises when threatened, the triggerfish wedges itself into coral crevices and becomes virtually impossible to extract.',
    habitat: 'Indo-Pacific coral reefs, 1–75m', funFact: 'Triggerfish are known to attack divers who venture too close to their nests. They always charge upward.',
    conservationStatus: 'Least Concern',
    behaviorProfile: { swimSpeed: 0.5, turnChance: 0.03, bobAmplitude: 0.012, preferredYRange: [30, 65], idleProbability: 0.2, dartiness: 0.45 },
  },
  {
    key: 'electric_eel', name: 'Electric Eel', scientificName: 'Electrophorus electricus',
    rarity: 'epic', visualType: 'species', basePrice: 900,
    colorVariants: ['default', 'albino', 'midnight'],
    lore: 'Not actually an eel but a knifefish, this creature generates up to 860 volts — enough to stun a horse. In your tank, its bioelectricity is safely contained behind glass.',
    habitat: 'Amazon and Orinoco river basins, murky floodplains', funFact: 'Electric eels must surface to breathe air. They get 80% of their oxygen from gulping at the surface.',
    conservationStatus: 'Least Concern',
    behaviorProfile: { swimSpeed: 0.25, turnChance: 0.006, bobAmplitude: 0.008, preferredYRange: [60, 90], idleProbability: 0.5, dartiness: 0.1 },
  },
];

// Quick lookup by key
export const REAL_SPECIES_MAP = Object.fromEntries(
  REAL_SPECIES.map(s => [s.key, s])
);
