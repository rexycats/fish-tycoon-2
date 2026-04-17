// ============================================================
// FISH TYCOON 2 — EQUIPMENT SYSTEM
// Per-tank equipment that needs purchase, maintenance, and repair
// ============================================================

export const EQUIPMENT_TYPES = {
  filter: {
    id: 'filter',
    label: 'Filter',
    desc: 'Slows water quality decay. Each filter reduces WQ loss by 25%.',
    cost: 100,
    maxPerTank: 3,
    effect: { wqDecayMult: 0.75 }, // multiplicative per unit
    breakdownChance: 0.0003, // per tick
    repairCost: 30,
  },
  heater: {
    id: 'heater',
    label: 'Heater',
    desc: 'Stabilizes temperature. Prevents temperature drift from weather.',
    cost: 150,
    maxPerTank: 2,
    effect: { tempStabilize: true },
    breakdownChance: 0.0002,
    repairCost: 40,
  },
  aerator: {
    id: 'aerator',
    label: 'Aerator',
    desc: 'Improves oxygen. +5% health regen per unit.',
    cost: 120,
    maxPerTank: 2,
    effect: { healthRegenMult: 1.05 },
    breakdownChance: 0.0002,
    repairCost: 35,
  },
  uvSterilizer: {
    id: 'uvSterilizer',
    label: 'UV Sterilizer',
    desc: 'Reduces disease chance by 30% per unit.',
    cost: 250,
    maxPerTank: 1,
    effect: { diseaseResist: 0.7 },
    breakdownChance: 0.0004,
    repairCost: 60,
  },
};

export function getEquipmentEffects(equipment) {
  const effects = { wqDecayMult: 1, healthRegenMult: 1, diseaseResist: 1, tempStabilize: false };
  if (!equipment) return effects;
  for (const eq of equipment) {
    if (eq.broken) continue; // broken equipment has no effect
    const type = EQUIPMENT_TYPES[eq.typeId];
    if (!type) continue;
    if (type.effect.wqDecayMult) effects.wqDecayMult *= type.effect.wqDecayMult;
    if (type.effect.healthRegenMult) effects.healthRegenMult *= type.effect.healthRegenMult;
    if (type.effect.diseaseResist) effects.diseaseResist *= type.effect.diseaseResist;
    if (type.effect.tempStabilize) effects.tempStabilize = true;
  }
  return effects;
}

export function createEquipment(typeId) {
  return {
    id: crypto.randomUUID(),
    typeId,
    broken: false,
    installedAt: Date.now(),
  };
}
