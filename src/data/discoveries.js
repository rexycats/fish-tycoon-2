// ============================================================
// DISCOVERY JOURNAL — track unique phenotype combinations
// ============================================================

export function getDiscoveryKey(fish) {
  const p = fish?.phenotype || {};
  const s = fish?.species || {};
  // Key = body+fin+pattern+color+glow — each unique combo is a discovery
  return [
    s.visualType === 'species' ? s.key : p.bodyShape,
    p.finType, p.pattern, p.primaryColor, p.glow
  ].join('|');
}

export function checkNewDiscovery(fish, existingDiscoveries) {
  const key = getDiscoveryKey(fish);
  if (!key || existingDiscoveries?.includes(key)) return null;
  return {
    key,
    fishName: fish.nickname || fish.species?.name || 'Unknown',
    rarity: fish.species?.rarity || 'common',
    discoveredAt: Date.now(),
  };
}

// Estimate total possible discoveries
export function getTotalPossibleDiscoveries() {
  // 5 body shapes × 5 fin types × 5 patterns × 8 colors × 3 glows + 16 species
  return 5 * 5 * 5 * 8 * 3 + 16;
}
