// ============================================================
// HATCH REVEAL — Gacha-style trait reveal overlay
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import { createRevealSequence } from '../systems/hatchReveal.js';
import { PERSONALITY_EMOJI } from '../data/constants.js';
import FishSprite from './FishSprite.jsx';

const RARITY_COLORS = {
  common:    '#aabbcc',
  uncommon:  '#66ccff',
  rare:      '#b07ee8',
  epic:      '#ffcc33',
  legendary: '#ff66aa',
};

export default function HatchReveal({ fish, onComplete }) {
  const [phase, setPhase] = useState('egg'); // egg | crack | reveal | traits | final | done
  const [revealedTraits, setRevealedTraits] = useState([]);
  const [showFinal, setShowFinal] = useState(false);
  const [seq] = useState(() => createRevealSequence(fish));
  const timerRef = useRef(null);

  useEffect(() => {
    // Phase timeline
    const timers = [];
    let t = 0;

    // Egg wobble
    timers.push(setTimeout(() => setPhase('crack'), t += 800));

    // Egg crack
    timers.push(setTimeout(() => setPhase('reveal'), t += 1200));

    // Show fish silhouette, then reveal traits one by one
    timers.push(setTimeout(() => setPhase('traits'), t += 600));

    // Reveal each trait
    for (let i = 0; i < seq.steps.length; i++) {
      const step = seq.steps[i];
      timers.push(setTimeout(() => {
        setRevealedTraits(prev => [...prev, step]);
      }, t += step.drama.delay));
    }

    // Final rarity reveal
    timers.push(setTimeout(() => {
      setShowFinal(true);
      setPhase('final');
    }, t += 800));

    // Auto-dismiss after showing everything
    timers.push(setTimeout(() => {
      setPhase('done');
    }, t += 2500));

    timerRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'done') {
    onComplete?.();
    return null;
  }

  const rarityColor = RARITY_COLORS[fish.species?.rarity] || '#aabbcc';
  const isHighRarity = ['rare', 'epic', 'legendary'].includes(fish.species?.rarity);

  return (
    <div className="hatch-overlay" onClick={() => { if (phase === 'final') { setPhase('done'); } }}>
      <div className={`hatch-container hatch-phase--${phase}`}>

        {/* Egg phase */}
        {(phase === 'egg' || phase === 'crack') && (
          <div className={`hatch-egg ${phase === 'crack' ? 'hatch-egg--cracking' : 'hatch-egg--wobble'}`}>
            <span className="hatch-egg-emoji">🥚</span>
            {phase === 'crack' && (
              <div className="hatch-crack-light" />
            )}
          </div>
        )}

        {/* Fish reveal */}
        {(phase === 'reveal' || phase === 'traits' || phase === 'final') && (
          <>
            <div className={`hatch-fish-spotlight ${isHighRarity ? 'hatch-fish-spotlight--rare' : ''}`}>
              <div className="hatch-fish-sprite">
                <FishSprite fish={fish} size={96} />
              </div>
            </div>

            <div className="hatch-species-name" style={{ color: rarityColor }}>
              {seq.speciesName}
            </div>

            {/* Trait roll */}
            {phase === 'traits' || phase === 'final' ? (
              <div className="hatch-traits">
                {revealedTraits.map((trait, i) => {
                  const color = RARITY_COLORS[trait.rarity] || '#aabbcc';
                  const isRare = ['rare', 'epic', 'legendary'].includes(trait.rarity);
                  return (
                    <div key={i} className={`hatch-trait ${isRare ? 'hatch-trait--rare' : ''}`}
                         style={{ '--trait-color': color, animationDelay: `${i * 0.05}s` }}>
                      <span className="hatch-trait-label">{trait.label}:</span>
                      <span className="hatch-trait-value" style={{ color }}>{trait.value}</span>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Final rarity reveal */}
            {showFinal && (
              <div className={`hatch-final hatch-final--${fish.species?.rarity || 'common'}`}
                   style={{ color: rarityColor }}>
                <div className="hatch-final-stars">
                  {seq.finalReveal.value}
                </div>
                {seq.legendaryCombo && (
                  <div className="hatch-legendary-combo">
                    <span className="hatch-legendary-emoji">{seq.legendaryCombo.emoji}</span>
                    <span className="hatch-legendary-name">{seq.legendaryCombo.name}</span>
                    <span className="hatch-legendary-desc">{seq.legendaryCombo.desc}</span>
                  </div>
                )}
                <div className="hatch-final-value">
                  Est. Value: 🪙 {seq.legendaryCombo ? seq.estimatedValue * seq.legendaryCombo.priceBonus : seq.estimatedValue}
                </div>
                {seq.generation > 1 && (
                  <div className="hatch-final-gen">
                    Generation {seq.generation} • {PERSONALITY_EMOJI[seq.personality] || ''} {seq.personality}
                  </div>
                )}
                <div className="hatch-tap-hint">Tap to continue</div>
              </div>
            )}
          </>
        )}

        {/* Particles */}
        {isHighRarity && phase === 'final' && (
          <div className="hatch-particles">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="hatch-particle"
                   style={{
                     '--px': `${Math.random() * 100}%`,
                     '--py': `${Math.random() * 100}%`,
                     '--delay': `${Math.random() * 1.5}s`,
                     '--color': rarityColor,
                   }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
