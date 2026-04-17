// ============================================================
// FISH TYCOON 2 — TANK COMPATIBILITY SYSTEM
// ============================================================
// Each species has water type, temperament, and temp range.
// Incompatible fish in the same tank cause stress warnings.
// ============================================================

export const SPECIES_COMPAT = {
  // Saltwater — Tropical
  clownfish:        { water: 'salt', temp: 'tropical', temperament: 'peaceful',       minTank: 4 },
  bluetang:         { water: 'salt', temp: 'tropical', temperament: 'semi-aggressive', minTank: 8 },
  mandarin_dragonet:{ water: 'salt', temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  moorish_idol:     { water: 'salt', temp: 'tropical', temperament: 'semi-aggressive', minTank: 8 },
  lionfish:         { water: 'salt', temp: 'tropical', temperament: 'aggressive',      minTank: 8 },
  triggerfish:      { water: 'salt', temp: 'tropical', temperament: 'aggressive',      minTank: 8 },
  seahorse:         { water: 'salt', temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  pufferfish:       { water: 'salt', temp: 'tropical', temperament: 'semi-aggressive', minTank: 6 },
  jellyfish:        { water: 'salt', temp: 'cold',    temperament: 'peaceful',       minTank: 6 },
  nautilus:         { water: 'salt', temp: 'cold',    temperament: 'peaceful',       minTank: 8 },
  cuttlefish:       { water: 'salt', temp: 'tropical', temperament: 'semi-aggressive', minTank: 8 },

  // Freshwater — Tropical
  betta:            { water: 'fresh', temp: 'tropical', temperament: 'aggressive',      minTank: 4 },
  angelfish:        { water: 'fresh', temp: 'tropical', temperament: 'semi-aggressive', minTank: 6 },
  neon_tetra:       { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  discus:           { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 8 },
  guppy:            { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  oscar:            { water: 'fresh', temp: 'tropical', temperament: 'aggressive',      minTank: 8 },
  corydoras:        { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  cherry_shrimp:    { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4 },
  arowana:          { water: 'fresh', temp: 'tropical', temperament: 'aggressive',      minTank: 10 },
  hammerhead:       { water: 'salt',  temp: 'tropical', temperament: 'aggressive',      minTank: 12 },

  // Freshwater — Cold
  goldfish:         { water: 'fresh', temp: 'cold',    temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  koi:              { water: 'fresh', temp: 'cold',    temperament: 'peaceful',       minTank: 8 },
  axolotl:          { water: 'fresh', temp: 'cold',    temperament: 'peaceful',       minTank: 6 },

  // Special
  electric_eel:     { water: 'fresh', temp: 'tropical', temperament: 'aggressive',      minTank: 10 },
  yellow_tang:      { water: 'salt',  temp: 'tropical', temperament: 'semi-aggressive', minTank: 6 },

  // Procedural species
  rainbow_fish:     { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  pleco:            { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  clown_loach:      { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 8, schoolSize: 3 },
  flame_tetra:      { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  powder_blue_tang: { water: 'salt',  temp: 'tropical', temperament: 'semi-aggressive', minTank: 8 },
  firemouth_cichlid:{ water: 'fresh', temp: 'tropical', temperament: 'semi-aggressive', minTank: 6 },
  harlequin_rasbora:{ water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  royal_gramma:     { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 4 },
  cardinal_tetra:   { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  dwarf_gourami:    { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 4 },
  banggai_cardinal: { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  leopard_wrasse:   { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  garden_eel:       { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  flame_angel:      { water: 'salt',  temp: 'tropical', temperament: 'semi-aggressive', minTank: 6 },
  emerald_crab:     { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 4 },
  regal_tang:       { water: 'salt',  temp: 'tropical', temperament: 'semi-aggressive', minTank: 8 },
  peacock_mantis:   { water: 'salt',  temp: 'tropical', temperament: 'aggressive',      minTank: 6 },
  blue_chromis:     { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 4, schoolSize: 3 },
  dragon_goby:      { water: 'fresh', temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  spotted_boxfish:  { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  sea_apple:        { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  wolf_eel:         { water: 'salt',  temp: 'cold',    temperament: 'aggressive',      minTank: 10 },
  sunburst_anthias: { water: 'salt',  temp: 'tropical', temperament: 'peaceful',       minTank: 6 },
  frogfish:         { water: 'salt',  temp: 'tropical', temperament: 'aggressive',      minTank: 6 },
};

// Default for procedural fish (non-species)
const DEFAULT_COMPAT = { water: 'fresh', temp: 'tropical', temperament: 'peaceful', minTank: 4 };

export function getCompat(fish) {
  if (fish?.species?.key && SPECIES_COMPAT[fish.species.key]) {
    return SPECIES_COMPAT[fish.species.key];
  }
  return DEFAULT_COMPAT;
}

// Check compatibility issues between a fish and existing tank fish
export function checkTankCompat(newFish, existingFish) {
  const issues = [];
  const nc = getCompat(newFish);

  for (const f of existingFish) {
    const fc = getCompat(f);

    // Water type mismatch
    if (nc.water !== fc.water) {
      issues.push({
        type: 'water',
        severity: 'critical',
        message: `${newFish.species?.name || 'This fish'} needs ${nc.water === 'salt' ? 'saltwater' : 'freshwater'} but ${f.species?.name || 'a fish'} needs ${fc.water === 'salt' ? 'saltwater' : 'freshwater'}!`,
      });
      break; // One water mismatch is enough
    }

    // Temperature mismatch
    if (nc.temp !== fc.temp) {
      issues.push({
        type: 'temp',
        severity: 'warning',
        message: `${newFish.species?.name || 'This fish'} prefers ${nc.temp} water but ${f.species?.name || 'a fish'} prefers ${fc.temp}.`,
      });
      break;
    }
  }

  // Aggressive fish with peaceful fish
  if (nc.temperament === 'aggressive') {
    const peaceful = existingFish.filter(f => getCompat(f).temperament === 'peaceful');
    if (peaceful.length > 0) {
      issues.push({
        type: 'aggression',
        severity: 'warning',
        message: `${newFish.species?.name || 'This fish'} is aggressive and may bully peaceful tankmates!`,
      });
    }
  }
  // Peaceful fish entering aggressive tank
  if (nc.temperament === 'peaceful') {
    const aggressors = existingFish.filter(f => getCompat(f).temperament === 'aggressive');
    if (aggressors.length > 0) {
      issues.push({
        type: 'aggression',
        severity: 'warning',
        message: `${aggressors[0].species?.name || 'An aggressive fish'} may bully ${newFish.species?.name || 'this fish'}!`,
      });
    }
  }

  return issues;
}

// Get compatibility summary for a tank
export function getTankCompatSummary(fishInTank) {
  if (fishInTank.length === 0) return { water: null, temp: null, issues: [] };
  const compats = fishInTank.map(getCompat);
  const waters = [...new Set(compats.map(c => c.water))];
  const temps = [...new Set(compats.map(c => c.temp))];
  const issues = [];
  if (waters.length > 1) issues.push('Mixed water types');
  if (temps.length > 1) issues.push('Mixed temperature preferences');
  const hasAggressive = compats.some(c => c.temperament === 'aggressive');
  const hasPeaceful = compats.some(c => c.temperament === 'peaceful');
  if (hasAggressive && hasPeaceful) issues.push('Aggressive + peaceful fish');
  // Schooling check
  const speciesCounts = new Map();
  for (const f of fishInTank) {
    const key = f.species?.key || f.species?.name || 'unknown';
    speciesCounts.set(key, (speciesCounts.get(key) || 0) + 1);
  }
  for (let i = 0; i < fishInTank.length; i++) {
    const c = compats[i];
    if (c.schoolSize) {
      const key = fishInTank[i].species?.key || fishInTank[i].species?.name || 'unknown';
      if ((speciesCounts.get(key) || 0) < c.schoolSize) {
        issues.push(`${fishInTank[i].species?.name || 'A fish'} needs ${c.schoolSize}+ of its kind`);
        break;
      }
    }
  }
  return { water: waters[0], temp: temps[0], issues };
}
