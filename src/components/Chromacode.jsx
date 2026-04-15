// ============================================================
// CHROMACODE — Visual DNA bar for fish genome
// ============================================================
import React from 'react';
import { buildChromacode, purityTier } from '../data/geneAnalysis.js';

const PURITY_STYLES = {
  1: { label: 'Mixed',     color: '#708090', glow: false },
  2: { label: 'Refined',   color: '#5a9aaa', glow: false },
  3: { label: 'Pure',      color: '#8a70a8', glow: true  },
  4: { label: 'Perfected', color: '#ffd700', glow: true  },
};

export default function Chromacode({ genome, compact = false, showLabels = true }) {
  if (!genome) return null;

  const bars = buildChromacode(genome);
  const purity = purityTier(genome);
  const ps = PURITY_STYLES[purity.tier] || PURITY_STYLES[1];

  return (
    <div className={`chromacode ${compact ? 'chromacode--compact' : ''} ${purity.tier >= 3 ? 'chromacode--glowing' : ''}`}>
      {/* Purity badge */}
      <div className="chromacode-purity" style={{ color: ps.color }}>
        <span className="chromacode-purity-label">{ps.label}</span>
        <span className="chromacode-purity-count">{purity.pure}/{purity.total}</span>
      </div>

      {/* DNA bar */}
      <div className="chromacode-bars">
        {bars.map((bar) => {
          const isDominantLeft = bar.dominantSide === 'left';
          return (
            <div key={bar.gene}
              className={`chromacode-gene ${bar.pure ? 'chromacode-gene--pure' : ''}`}
              title={`${bar.geneName}: ${bar.expressed}${!bar.pure ? ` (carries ${isDominantLeft ? bar.allele2.name : bar.allele1.name})` : ' (pure)'}`}>
              {/* Left allele */}
              <div
                className={`chromacode-bar ${isDominantLeft ? 'chromacode-bar--dominant' : 'chromacode-bar--recessive'}`}
                style={{ background: bar.allele1.color }}
              />
              {/* Right allele */}
              <div
                className={`chromacode-bar ${!isDominantLeft ? 'chromacode-bar--dominant' : 'chromacode-bar--recessive'}`}
                style={{ background: bar.allele2.color }}
              />
              {/* Pure indicator */}
              {bar.pure && <div className="chromacode-pure-dot" style={{ background: bar.allele1.color }} />}
            </div>
          );
        })}
      </div>

      {/* Gene labels */}
      {showLabels && !compact && (
        <div className="chromacode-labels">
          {bars.map(bar => (
            <div key={bar.gene} className="chromacode-label">{bar.shortName}</div>
          ))}
        </div>
      )}
    </div>
  );
}
