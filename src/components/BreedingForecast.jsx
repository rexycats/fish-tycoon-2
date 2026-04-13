// ============================================================
// BREEDING FORECAST — Per-gene probabilities + carrier hints
// ============================================================
import React, { useMemo } from 'react';
import {
  perGeneBreedingForecast,
  breedingRarityForecast,
  findSharedCarriers,
  purityTier,
} from '../data/geneAnalysis.js';
import { RARITY } from '../data/genetics.js';
import Chromacode from './Chromacode.jsx';

export default function BreedingForecast({ fishA, fishB }) {
  if (!fishA?.genome || !fishB?.genome) return null;

  const forecast = useMemo(
    () => perGeneBreedingForecast(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );

  const rarityForecast = useMemo(
    () => breedingRarityForecast(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );

  const carriers = useMemo(
    () => findSharedCarriers(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );

  const purityA = purityTier(fishA.genome);
  const purityB = purityTier(fishB.genome);

  return (
    <div className="breed-forecast">
      <div className="breed-forecast-title">🧬 Gene Mixer</div>

      {/* Parent Chromacodes */}
      <div className="breed-forecast-parents">
        <div className="breed-forecast-parent">
          <div className="breed-forecast-parent-name">
            {fishA.species?.name || 'Parent A'} <span className="breed-forecast-gen">Gen {fishA.generation || 1}</span>
          </div>
          <Chromacode genome={fishA.genome} compact />
        </div>
        <div className="breed-forecast-x">×</div>
        <div className="breed-forecast-parent">
          <div className="breed-forecast-parent-name">
            {fishB.species?.name || 'Parent B'} <span className="breed-forecast-gen">Gen {fishB.generation || 1}</span>
          </div>
          <Chromacode genome={fishB.genome} compact />
        </div>
      </div>

      {/* Per-gene trait probabilities */}
      <div className="breed-forecast-genes">
        {forecast.map(g => (
          <div key={g.gene} className="breed-forecast-gene">
            <div className="bfg-label">{g.emoji} {g.shortName}</div>
            <div className="bfg-outcomes">
              {g.outcomes.map(o => (
                <div key={o.name} className="bfg-outcome" style={{ flex: o.percent }}>
                  <div className="bfg-bar" style={{ background: o.color, width: '100%' }} />
                  <div className="bfg-info">
                    <span className="bfg-name">{o.name}</span>
                    <span className="bfg-pct">{o.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Carrier hints */}
      {carriers.length > 0 && (
        <div className="breed-forecast-carriers">
          {carriers.map((c, i) => (
            <div key={i} className="breed-carrier-hint">
              💡 Both parents carry recessive <strong>{c.alleleName}</strong> ({c.geneName})!
              <span className="breed-carrier-chance">{c.chance}% chance of expression</span>
            </div>
          ))}
        </div>
      )}

      {/* Rarity distribution */}
      <div className="breed-forecast-rarity">
        <div className="bfr-title">Rarity Estimate</div>
        <div className="bfr-bars">
          {rarityForecast.distribution.map(r => (
            <div key={r.rarity} className="bfr-bar-row">
              <span className="bfr-label" style={{ color: RARITY[r.rarity]?.color || '#888' }}>
                {r.rarity}
              </span>
              <div className="bfr-track">
                <div className="bfr-fill" style={{
                  width: `${r.percent}%`,
                  background: RARITY[r.rarity]?.color || '#888',
                }} />
              </div>
              <span className="bfr-pct">{r.percent}%</span>
            </div>
          ))}
        </div>
        <div className="bfr-best">
          Best case: <span style={{ color: RARITY[rarityForecast.bestCase]?.color }}>
            {rarityForecast.bestCase.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Purity forecast */}
      <div className="breed-forecast-purity">
        <span>Offspring purity: ~{Math.round((purityA.pure + purityB.pure) / 2)}-{Math.max(purityA.pure, purityB.pure)}/{purityA.total} genes pure</span>
      </div>
    </div>
  );
}
