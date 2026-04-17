// ============================================================
// FISH TYCOON 2 — SUPPLIER SYSTEM
// Different suppliers offer different species at different prices
// ============================================================

export const SUPPLIERS = [
  {
    id: 'basic',
    name: 'Local Fish Market',
    desc: 'Basic freshwater species at standard prices.',
    priceMult: 1.0,
    speciesPool: ['goldfish', 'neon_tetra', 'guppy', 'betta', 'corydoras', 'pleco', 'flame_tetra', 'harlequin_rasbora', 'cardinal_tetra', 'dwarf_gourami'],
    unlockRep: 0,
  },
  {
    id: 'tropical',
    name: 'Tropical Imports',
    desc: 'Colorful tropical species. Slightly pricier.',
    priceMult: 1.15,
    speciesPool: ['clownfish', 'angelfish', 'discus', 'cherry_shrimp', 'mandarin_dragonet', 'rainbow_fish', 'clown_loach', 'firemouth_cichlid', 'dragon_goby', 'spotted_boxfish'],
    unlockRep: 10,
  },
  {
    id: 'exotic',
    name: 'Exotic Aquatics',
    desc: 'Rare and unusual species at premium prices.',
    priceMult: 1.35,
    speciesPool: ['lionfish', 'seahorse', 'pufferfish', 'axolotl', 'moorish_idol', 'royal_gramma', 'banggai_cardinal', 'leopard_wrasse', 'garden_eel', 'flame_angel'],
    unlockRep: 25,
  },
  {
    id: 'deep_sea',
    name: 'Deep Sea Specimens',
    desc: 'Mysterious deep-water creatures. Very expensive.',
    priceMult: 1.6,
    speciesPool: ['jellyfish', 'nautilus', 'cuttlefish', 'electric_eel', 'arowana', 'peacock_mantis', 'wolf_eel', 'frogfish', 'sea_apple', 'powder_blue_tang'],
    unlockRep: 50,
  },
  {
    id: 'premier',
    name: 'Premier Collections',
    desc: 'The finest specimens money can buy.',
    priceMult: 1.8,
    speciesPool: ['koi', 'bluetang', 'triggerfish', 'oscar', 'hammerhead', 'yellow_tang', 'regal_tang', 'sunburst_anthias', 'emerald_crab', 'blue_chromis'],
    unlockRep: 100,
  },
];

export function getUnlockedSuppliers(reputation) {
  return SUPPLIERS.filter(s => reputation >= s.unlockRep);
}

export function getActiveSupplier(state) {
  const id = state.suppliers?.activeSupplier || 'basic';
  return SUPPLIERS.find(s => s.id === id) || SUPPLIERS[0];
}

export function getAvailableSpecies(state) {
  const supplier = getActiveSupplier(state);
  return supplier.speciesPool;
}
