// ============================================================
// RESEARCH TREE — spend coins for permanent passive bonuses
// ============================================================

export const RESEARCH_BRANCHES = {
  marine_biology: {
    id: 'marine_biology', label: 'Marine Biology', emoji: '', color: '#40c8f0',
    tiers: [
      { cost: 200,  label: 'Basic Anatomy',        effect: { healthRegen: 1.1 },      desc: '+10% health regen' },
      { cost: 500,  label: 'Disease Resistance',    effect: { diseaseResist: 0.8 },    desc: '-20% disease chance' },
      { cost: 1200, label: 'Longevity Research',     effect: { lifespanMult: 1.25 },    desc: '+25% fish lifespan' },
      { cost: 3000, label: 'Regenerative Medicine',  effect: { cureBonus: 0.15 },       desc: '+15% cure success rate' },
    ],
  },
  genetics: {
    id: 'genetics', label: 'Genetics', emoji: '', color: '#c878ff',
    tiers: [
      { cost: 300,  label: 'Gene Mapping',          effect: { breedSpeed: 0.9 },       desc: '-10% breeding time' },
      { cost: 800,  label: 'Selective Breeding',     effect: { rarityBoost: 1.1 },      desc: '+10% rare offspring chance' },
      { cost: 2000, label: 'Mutation Control',        effect: { mutationRate: 1.3 },     desc: '+30% mutation rate' },
      { cost: 5000, label: 'Designer Genetics',       effect: { breedSpeed: 0.7, rarityBoost: 1.25 }, desc: '-30% breed time, +25% rarity' },
    ],
  },
  business: {
    id: 'business', label: 'Business', emoji: '', color: '#b0944a',
    tiers: [
      { cost: 250,  label: 'Marketing 101',         effect: { customerSpeed: 0.9 },    desc: '-10% time between customers' },
      { cost: 600,  label: 'Premium Pricing',        effect: { saleBonus: 1.1 },        desc: '+10% sale prices' },
      { cost: 1500, label: 'Brand Recognition',      effect: { repGain: 1.5 },          desc: '+50% reputation gain' },
      { cost: 4000, label: 'Franchise Empire',        effect: { passiveIncome: 1.3 },    desc: '+30% passive income' },
    ],
  },
};

function getResearchLevel(state, branchId) {
  return state.player?.research?.[branchId] || 0;
}

function getNextResearch(branchId, level) {
  const branch = RESEARCH_BRANCHES[branchId];
  if (!branch || level >= branch.tiers.length) return null;
  return branch.tiers[level];
}


// Collect all active research effects into a single multiplier object
export function getResearchEffects(state) {
  const r = state.player?.research || {};
  const effects = {
    healthRegen: 1, diseaseResist: 1, lifespanMult: 1, cureBonus: 0,
    breedSpeed: 1, rarityBoost: 1, mutationRate: 1,
    customerSpeed: 1, saleBonus: 1, repGain: 1, passiveIncome: 1,
  };
  for (const [branchId, level] of Object.entries(r)) {
    const branch = RESEARCH_BRANCHES[branchId];
    if (!branch) continue;
    for (let i = 0; i < level && i < branch.tiers.length; i++) {
      const tier = branch.tiers[i];
      for (const [key, val] of Object.entries(tier.effect)) {
        if (key === 'cureBonus') {
          effects[key] = (effects[key] || 0) + val;
        } else {
          effects[key] = (effects[key] || 1) * val;
        }
      }
    }
  }
  return effects;
}

export { getResearchLevel, getNextResearch };
