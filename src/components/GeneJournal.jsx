// ============================================================
// GENE JOURNAL — Discovery tracking + mutation recipe hints
// ============================================================
import React, { useMemo, useState } from 'react';
import { GENES, MUTATION_RECIPES, RARITY } from '../data/genetics.js';
import { useGameStore } from '../store/gameStore.js';
import { purityTier, ALLELE_NAME_COLORS, GENE_ORDER } from '../data/geneAnalysis.js';
import Chromacode from './Chromacode.jsx';

// ── Mutation tier classification ─────────────────────────────
const MUTATION_TIERS = {
  None: 0,
  Albino: 1, Melanistic: 1, Xanthic: 1, 'Twin-tail': 1, Starfish: 1,
  Iridescent: 2, Bioluminescent: 2,
  Crystalline: 3, Void: 3, Phoenix: 3,
};

const TIER_LABELS = { 1: 'Tier 1', 2: 'Tier 2 — Rare', 3: 'Tier 3 — Legendary' };
const TIER_CLASSES = { 1: 'mut-tier-badge--t1', 2: 'mut-tier-badge--t2', 3: 'mut-tier-badge--t3' };

// ── Compute discoveries from fish + fishdex ──────────────────
function computeDiscoveries(fish, fishdex, memorials) {
  const seenAlleles = {};   // gene -> Set of allele keys
  const seenMutations = new Set();
  let maxPurity = 0;
  let maxGeneration = 1;

  // Initialize
  for (const gene of GENE_ORDER) {
    seenAlleles[gene] = new Set();
  }

  // Scan living fish
  for (const f of (fish || [])) {
    if (!f.genome) continue;
    for (const gene of GENE_ORDER) {
      if (!f.genome[gene]) continue;
      seenAlleles[gene].add(f.genome[gene][0]);
      seenAlleles[gene].add(f.genome[gene][1]);
    }
    if (f.phenotype?.mutation && f.phenotype.mutation !== 'None') {
      seenMutations.add(f.phenotype?.mutation);
    }
    const pt = purityTier(f.genome);
    if (pt.pure > maxPurity) maxPurity = pt.pure;
    if ((f.generation || 1) > maxGeneration) maxGeneration = f.generation;
  }

  // Scan fishdex entries
  for (const entry of (fishdex || [])) {
    if (entry.phenotype?.mutation && entry.phenotype.mutation !== 'None') {
      seenMutations.add(entry.phenotype?.mutation);
    }
  }

  // Scan memorials for generation records
  for (const m of (memorials || [])) {
    if ((m.generation || 1) > maxGeneration) maxGeneration = m.generation;
  }

  return { seenAlleles, seenMutations, maxPurity, maxGeneration };
}

export default function GeneJournal() {
  const fish = useGameStore(s => s.fish);
  const fishdex = useGameStore(s => s.player?.fishdex || []);
  const memorials = useGameStore(s => s.memorials || []);
  const [expandedGene, setExpandedGene] = useState(null);

  const disc = useMemo(
    () => computeDiscoveries(fish, fishdex, memorials),
    [fish, fishdex, memorials]
  );

  // Count totals
  const totalAlleles = GENE_ORDER.reduce((sum, g) => sum + Object.keys(GENES[g]?.alleles || {}).length, 0);
  const discoveredAlleles = GENE_ORDER.reduce((sum, g) => sum + disc.seenAlleles[g].size, 0);

  // Mutation discovery
  const allMutations = Object.entries(MUTATION_TIERS).filter(([name]) => name !== 'None');
  const discoveredMutations = allMutations.filter(([name]) => disc.seenMutations.has(name));

  // Recipes
  const discoveredRecipes = MUTATION_RECIPES.filter(r => {
    const mutName = GENES.mutation?.alleles[r.allele]?.name;
    return mutName && disc.seenMutations.has(mutName);
  });

  return (
    <div className="gene-journal">
      <h3 className="section-title">🧬 Gene Journal</h3>

      {/* Discovery progress bar */}
      <div className="gj-progress">
        <div className="gj-progress-header">
          <span>Alleles Discovered</span>
          <span className="gj-progress-count">{discoveredAlleles}/{totalAlleles}</span>
        </div>
        <div className="gj-progress-track">
          <div className="gj-progress-fill" style={{ width: `${(discoveredAlleles / totalAlleles) * 100}%` }} />
        </div>
      </div>

      {/* Per-gene allele discovery */}
      <div className="gj-genes">
        {GENE_ORDER.map(gene => {
          const geneData = GENES[gene];
          if (!geneData) return null;
          const allAlleles = Object.entries(geneData.alleles);
          const seen = disc.seenAlleles[gene];
          const expanded = expandedGene === gene;
          return (
            <div key={gene} className="gj-gene">
              <button className="gj-gene-header" onClick={() => setExpandedGene(expanded ? null : gene)}>
                <span className="gj-gene-name">{geneData.name}</span>
                <span className="gj-gene-count">{seen.size}/{allAlleles.length}</span>
                <div className="gj-gene-dots">
                  {allAlleles.map(([key, allele]) => (
                    <div key={key}
                      className={`gj-dot ${seen.has(key) ? 'gj-dot--found' : 'gj-dot--locked'}`}
                      style={{ background: seen.has(key) ? (ALLELE_NAME_COLORS[allele.name] || '#888') : undefined }}
                      title={seen.has(key) ? allele.name : '???'}
                    />
                  ))}
                </div>
                <span className="gj-toggle">{expanded ? '▲' : '▼'}</span>
              </button>
              {expanded && (
                <div className="gj-gene-detail">
                  {allAlleles.map(([key, allele]) => {
                    const found = seen.has(key);
                    return (
                      <div key={key} className={`gj-allele ${found ? 'gj-allele--found' : 'gj-allele--locked'}`}>
                        <span className="gj-allele-dot" style={{ background: found ? (ALLELE_NAME_COLORS[allele.name] || '#888') : '#333' }} />
                        <span className="gj-allele-name">{found ? allele.name : '???'}</span>
                        <span className="gj-allele-key">{found ? key : '?'}</span>
                        <span className="gj-allele-dom">Dom: {allele.dominant}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mutation discovery */}
      <div className="gj-mutations">
        <div className="gj-section-title">Mutations Found ({discoveredMutations.length}/{allMutations.length})</div>
        <div className="gj-mutation-grid">
          {allMutations.map(([name, tier]) => {
            const found = disc.seenMutations.has(name);
            return (
              <div key={name} className={`gj-mutation ${found ? 'gj-mutation--found' : 'gj-mutation--locked'}`}>
                <span className="gj-mutation-name">{found ? name : '???'}</span>
                <span className={`mut-tier-badge ${TIER_CLASSES[tier]}`}>{TIER_LABELS[tier]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mutation recipes */}
      <div className="gj-recipes">
        <div className="gj-section-title">🔮 Mutation Recipes</div>
        {MUTATION_RECIPES.map(recipe => {
          const mutName = GENES.mutation?.alleles[recipe.allele]?.name || '???';
          const discovered = disc.seenMutations.has(mutName);
          return (
            <div key={recipe.id} className={`gj-recipe ${discovered ? 'gj-recipe--found' : 'gj-recipe--locked'}`}>
              <div className="gj-recipe-header">
                <span className="gj-recipe-name">{discovered ? mutName : '???'}</span>
                <span className={`mut-tier-badge ${TIER_CLASSES[recipe.tier]}`}>{TIER_LABELS[recipe.tier]}</span>
              </div>
              <div className="gj-recipe-hint">
                {discovered ? recipe.hint : (
                  recipe.tier === 3
                    ? '🔒 An ancient mutation spoken of in legend. Perhaps certain combinations hold the key...'
                    : `🔒 ${recipe.hint}`
                )}
              </div>
              {discovered && (
                <div className="gj-recipe-chance">Success rate: {Math.round(recipe.chance * 100)}%</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Records */}
      <div className="gj-records">
        <div className="gj-section-title">📊 Records</div>
        <div className="gj-record-grid">
          <div className="gj-record">
            <span className="gj-record-label">Highest Purity</span>
            <span className="gj-record-value">{disc.maxPurity}/8 genes pure</span>
          </div>
          <div className="gj-record">
            <span className="gj-record-label">Longest Dynasty</span>
            <span className="gj-record-value">Gen {disc.maxGeneration}</span>
          </div>
          <div className="gj-record">
            <span className="gj-record-label">Species Discovered</span>
            <span className="gj-record-value">{fishdex.length}</span>
          </div>
          <div className="gj-record">
            <span className="gj-record-label">Mutations Found</span>
            <span className="gj-record-value">{discoveredMutations.length}/{allMutations.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
