// ============================================================
// GENE ANALYSIS — Purity, carriers, breeding forecast, Chromacode
// ============================================================

import { GENES, expressGene, computePhenotype, getSpeciesFromPhenotype } from './genetics.js';

// ── Allele display colors (for Chromacode visual) ────────────
const ALLELE_COLORS = {
  // bodyShape
  O: '#a0d8f0', R: '#70b8e0', D: '#4898cc', S: '#2878b0', E: '#185888',
  // finType
  V: '#f0c0f0', F: '#d8a0d8', B: '#b880b8', A: '#986098', N: '#784880',
  // pattern
  M: '#f0d888', T: '#d0b868', L: '#b09848', P: '#908040',
  // primaryColor
  C: '#ff4444', G: '#ffcc33', I: '#9966ff',  // Violet allele is V in primaryColor
  W: '#e0e8f0',
  // glow
  U: '#cc66ff',
  // size
  // mutation
  X: '#ff9900',
  // Generic fallbacks per gene
};

// Broader color map keyed by allele name
const ALLELE_NAME_COLORS = {
  Orb: '#a0d8f0', Round: '#70b8e0', Delta: '#4898cc', Slender: '#2878b0', Eel: '#185888',
  Veil: '#f0c0f0', Flowing: '#d8a0d8', Broad: '#b880b8', Angular: '#986098', Nub: '#784880',
  Marble: '#f0d888', Spotted: '#e0c868', Tiger: '#d0b050', Lined: '#b09838', Plain: '#908040',
  Crimson: '#ff4444', Gold: '#ffcc33', Violet: '#9966ff', Azure: '#4488ff', Emerald: '#44cc66', White: '#d8e4f0',
  Orange: '#ff8833', Rose: '#ff6699', Teal: '#44bbaa', Indigo: '#5544cc', Silver: '#b0bcc8',
  Normal: '#606878', Luminous: '#88ddff', Radiant: '#ffaa44', Ultraviolet: '#cc44ff',
  Leviathan: '#ff3366', Giant: '#dd6644', Medium: '#88aa88', Tiny: '#66aacc', Dwarf: '#4488aa',
  None: '#505860', Albino: '#f0e8e0', Melanistic: '#303040', Xanthic: '#ffdd00', 'Twin-tail': '#66ddcc', Starfish: '#ff88aa',
  Iridescent: '#88ffcc', Bioluminescent: '#44ffdd', Crystalline: '#c8e8ff', Void: '#220044', Phoenix: '#ff4400',
};

const GENE_ORDER = ['bodyShape', 'finType', 'pattern', 'primaryColor', 'secondaryColor', 'glow', 'size', 'mutation'];
const GENE_SHORT = {
  bodyShape: 'Body', finType: 'Fin', pattern: 'Pat', primaryColor: 'Color',
  secondaryColor: '2nd', glow: 'Glow', size: 'Size', mutation: 'Mut',
};
const GENE_EMOJI = {
  bodyShape: '', finType: '', pattern: '', primaryColor: '',
  secondaryColor: '', glow: '', size: '', mutation: '',
};

// ── Purity analysis ──────────────────────────────────────────

/**
 * Check if a gene is pure (homozygous — both alleles match).
 */
export function isGenePure(genome, gene) {
  if (!genome?.[gene]) return false;
  const [a1, a2] = genome[gene];
  return a1 === a2;
}

/**
 * Count how many genes are pure in a genome.
 */
export function purityCount(genome) {
  let count = 0;
  let total = 0;
  for (const gene of GENE_ORDER) {
    if (!genome?.[gene]) continue;
    total++;
    if (isGenePure(genome, gene)) count++;
  }
  return { pure: count, total };
}

/**
 * Get purity label and tier.
 */
export function purityTier(genome) {
  const { pure, total } = purityCount(genome);
  if (pure === total && total > 0) return { label: 'Perfected', tier: 4, pure, total };
  if (pure >= 5) return { label: 'Pure', tier: 3, pure, total };
  if (pure >= 3) return { label: 'Refined', tier: 2, pure, total };
  return { label: 'Mixed', tier: 1, pure, total };
}

// ── Carrier detection ────────────────────────────────────────

/**
 * Get the hidden (recessive) allele for a gene, if it differs from the expressed one.
 * Returns null if the gene is pure (both alleles express the same).
 */
export function getHiddenAllele(genome, gene) {
  if (!genome?.[gene]) return null;
  const [a1, a2] = genome[gene];
  if (a1 === a2) return null; // pure, no hidden
  const geneData = GENES[gene];
  if (!geneData) return null;
  const d1 = geneData.alleles[a1]?.dominant ?? 0;
  const d2 = geneData.alleles[a2]?.dominant ?? 0;
  // The hidden allele is the recessive one
  const hiddenKey = d1 >= d2 ? a2 : a1;
  return { key: hiddenKey, name: geneData.alleles[hiddenKey]?.name || hiddenKey };
}

/**
 * Find shared hidden alleles between two genomes (carrier hints).
 * "Both parents carry recessive Violet!"
 */
export function findSharedCarriers(genomeA, genomeB) {
  const shared = [];
  for (const gene of GENE_ORDER) {
    if (!genomeA?.[gene] || !genomeB?.[gene]) continue;
    const hiddenA = getHiddenAllele(genomeA, gene);
    const hiddenB = getHiddenAllele(genomeB, gene);
    if (!hiddenA || !hiddenB) continue;
    // Check if either parent carries the other's hidden allele
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    // Collect all recessive alleles both parents carry
    const recessivesA = new Set([a1, a2]);
    const recessivesB = new Set([b1, b2]);
    // Find alleles present in both (but recessive in at least one)
    for (const allele of recessivesA) {
      if (!recessivesB.has(allele)) continue;
      const geneData = GENES[gene];
      const name = geneData?.alleles[allele]?.name || allele;
      const expressed = expressGene(gene, a1, a2);
      // Only interesting if this allele is NOT the dominant expressed one in both
      if (expressed === name) continue; // already visible
      shared.push({
        gene,
        geneName: GENES[gene]?.name || gene,
        allele,
        alleleName: name,
        chance: 25, // 25% chance of homozygous recessive
      });
    }
  }
  return shared;
}

// ── Per-gene breeding forecast ───────────────────────────────

/**
 * For two parents, compute per-gene trait probabilities.
 * Returns an array of { gene, geneName, outcomes: [{ name, percent, isPure }] }
 */
export function perGeneBreedingForecast(genomeA, genomeB) {
  const forecast = [];
  for (const gene of GENE_ORDER) {
    if (!genomeA?.[gene] || !genomeB?.[gene]) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    // 4 equally likely combinations
    const combos = [
      [a1, b1], [a1, b2], [a2, b1], [a2, b2],
    ];
    const traitCounts = {};
    const purityCounts = {};
    for (const [x, y] of combos) {
      const trait = expressGene(gene, x, y);
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      const pure = x === y;
      purityCounts[trait] = (purityCounts[trait] || 0) + (pure ? 1 : 0);
    }
    const outcomes = Object.entries(traitCounts)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / 4) * 100),
        pureChance: Math.round((purityCounts[name] / 4) * 100),
        color: ALLELE_NAME_COLORS[name] || '#888',
      }))
      .sort((a, b) => b.percent - a.percent);
    forecast.push({
      gene,
      geneName: GENES[gene]?.name || gene,
      shortName: GENE_SHORT[gene] || gene,
      emoji: GENE_EMOJI[gene] || '',
      outcomes,
    });
  }
  return forecast;
}

/**
 * Estimate overall rarity distribution from breeding.
 */
export function breedingRarityForecast(genomeA, genomeB, samples = 200) {
  const rarityCounts = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
  let bestRarity = 'common';
  const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  for (let i = 0; i < samples; i++) {
    const genome = {};
    for (const gene of GENE_ORDER) {
      if (!genomeA?.[gene] || !genomeB?.[gene]) continue;
      const [a1, a2] = genomeA[gene];
      const [b1, b2] = genomeB[gene];
      const pick1 = Math.random() < 0.5 ? a1 : a2;
      const pick2 = Math.random() < 0.5 ? b1 : b2;
      genome[gene] = [pick1, pick2];
    }
    const ph = computePhenotype(genome);
    const sp = getSpeciesFromPhenotype(ph);
    rarityCounts[sp.rarity]++;
    if (rarityOrder.indexOf(sp.rarity) > rarityOrder.indexOf(bestRarity)) {
      bestRarity = sp.rarity;
    }
  }
  return {
    distribution: Object.entries(rarityCounts)
      .filter(([, c]) => c > 0)
      .map(([rarity, count]) => ({ rarity, percent: Math.round((count / samples) * 100) })),
    bestCase: bestRarity,
  };
}

// ── Chromacode data builder ──────────────────────────────────

/**
 * Build Chromacode display data for a genome.
 */
export function buildChromacode(genome) {
  const bars = [];
  for (const gene of GENE_ORDER) {
    if (!genome?.[gene]) continue;
    const [a1, a2] = genome[gene];
    const geneData = GENES[gene];
    if (!geneData) continue;
    const d1 = geneData.alleles[a1]?.dominant ?? 0;
    const d2 = geneData.alleles[a2]?.dominant ?? 0;
    const name1 = geneData.alleles[a1]?.name || a1;
    const name2 = geneData.alleles[a2]?.name || a2;
    const pure = a1 === a2;
    const dominant = d1 >= d2 ? 'left' : 'right';
    bars.push({
      gene,
      geneName: geneData.name,
      shortName: GENE_SHORT[gene] || gene,
      allele1: { key: a1, name: name1, color: ALLELE_NAME_COLORS[name1] || '#888', dominant: d1 },
      allele2: { key: a2, name: name2, color: ALLELE_NAME_COLORS[name2] || '#888', dominant: d2 },
      pure,
      dominantSide: dominant,
      expressed: expressGene(gene, a1, a2),
    });
  }
  return bars;
}

export { GENE_ORDER, GENE_SHORT, ALLELE_NAME_COLORS };
