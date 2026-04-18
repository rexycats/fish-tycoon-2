// ============================================================
// FISH TYCOON 2 — MAGIC FISH PANEL
// The 7 Magic Fish win condition tracker
// ============================================================

import React, { useState } from 'react';
import { MAGIC_FISH } from '../data/genetics.js';

const RARITY_COLORS = {
  uncommon:  '#5a9aaa',
  rare:      '#8a70a8',
  epic:      '#b0944a',
  legendary: '#a06080',
};

// Silhouette SVG matching the fish's body shape
function MagicSilhouette({ bodyShape, primaryColor, glow, found, size = 56 }) {
  const COLORS = {
    Crimson: ['#e84040', '#ff9090'], Gold: ['#e8a020', '#ffe080'],
    Violet:  ['#9040e8', '#c888ff'], Azure: ['#2080e8', '#80c8ff'],
    Emerald: ['#20a840', '#60e890'], White: ['#c0d0e0', '#f0f8ff'],
  };
  const [body, light] = found ? (COLORS[primaryColor] || ['#556', '#889']) : ['#1a2840', '#243654'];
  const s = size;
  const paths = {
    Orb:     `M${s*.5},${s*.14} a${s*.36},${s*.36} 0 1,0 0.01,0 Z`,
    Round:   `M${s*.5},${s*.18} a${s*.32},${s*.28} 0 1,0 0.01,0 Z`,
    Delta:   `M${s*.08},${s*.82} L${s*.92},${s*.5} L${s*.08},${s*.18} Z`,
    Slender: `M${s*.06},${s*.5} Q${s*.28},${s*.28} ${s*.88},${s*.44} Q${s*.28},${s*.72} ${s*.06},${s*.5} Z`,
    Eel:     `M${s*.04},${s*.5} Q${s*.28},${s*.34} ${s*.6},${s*.38} Q${s*.86},${s*.44} ${s*.96},${s*.5} Q${s*.86},${s*.56} ${s*.6},${s*.62} Q${s*.28},${s*.66} ${s*.04},${s*.5} Z`,
  };
  const glowColor = glow === 'Ultraviolet' ? '#d060ff' : glow === 'Radiant' ? '#ffe060' : glow === 'Luminous' ? '#60d0ff' : null;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}
         style={{ filter: found && glowColor ? `drop-shadow(0 0 8px ${glowColor})` : found ? 'none' : 'none' }}>
      <defs>
        <radialGradient id={`mf-grad-${bodyShape}-${primaryColor}-${found}`} cx="38%" cy="32%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={body} />
        </radialGradient>
      </defs>
      {!found && (
        <path d={paths[bodyShape] || paths.Round}
              fill="#0d1e30" stroke="#1e3a5a" strokeWidth="1" opacity="0.9" />
      )}
      {found && (
        <>
          <path d={paths[bodyShape] || paths.Round}
                fill={`url(#mf-grad-${bodyShape}-${primaryColor}-${found})`} opacity="0.95" />
          {glowColor && (
            <path d={paths[bodyShape] || paths.Round}
                  fill="none" stroke={glowColor} strokeWidth="2" opacity="0.5" />
          )}
        </>
      )}
    </svg>
  );
}

function MagicFishCard({ mf, found }) {
  const [expanded, setExpanded] = useState(false);
  const rc = RARITY_COLORS[mf.rarity] || '#888';

  return (
    <div
      className={`magic-card ${found ? 'magic-card-found' : 'magic-card-locked'}`}
      style={{ '--mrc': rc }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="magic-card-header">
        <div className="magic-card-number">#{mf.number}</div>
        <div className="magic-card-sprite">
          <MagicSilhouette
            bodyShape={mf.phenotype?.bodyShape}
            primaryColor={mf.phenotype?.primaryColor || 'Azure'}
            glow={mf.phenotype?.glow || 'Normal'}
            found={found}
            size={52}
          />
          {found && <div className="magic-found-badge">✓</div>}
        </div>
        <div className="magic-card-info">
          <div className="magic-card-title" style={{ color: found ? rc : '#3a5a7a' }}>
            {found ? mf.title : `Magic Fish #${mf.number}`}
          </div>
          <div className="magic-card-rarity" style={{ color: found ? rc : '#2a4060' }}>
            {found ? mf.rarity : '???'}
          </div>
          {found && (
            <div className="magic-card-reward">Rewarded <span className="coin-icon"/>{mf.reward.toLocaleString()}</div>
          )}
        </div>
        <div className="magic-card-chevron">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="magic-card-body">
          {found ? (
            <>
              <div className="magic-card-lore">"{mf.lore}"</div>
              <div className="magic-phenotype-tags">
                {Object.entries(mf.phenotype).map(([k, v]) => (
                  <span key={k} className="magic-ptag">
                    <span className="magic-ptag-key">{k}:</span> {v}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="magic-card-hint">{mf.hint}</div>
              <div className="magic-card-reward-preview">Discovery reward: <span className="coin-icon"/>{mf.reward.toLocaleString()}</div>
              <div className="magic-partial-traits">
                {Object.entries(mf.phenotype).slice(0, 2).map(([k, v]) => (
                  <span key={k} className="magic-ptag magic-ptag-hint">
                    <span className="magic-ptag-key">{k}:</span> {v}
                  </span>
                ))}
                {Object.keys(mf.phenotype).length > 2 && (
                  <span className="magic-ptag magic-ptag-hidden">+{Object.keys(mf.phenotype).length - 2} more traits hidden…</span>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function MagicFishPanel({ magicFishFound = [] }) {
  const foundSet = new Set(magicFishFound);
  const foundCount = foundSet.size;
  const allFound = foundCount === MAGIC_FISH.length;

  return (
    <div className="magic-panel">
      {/* Header */}
      <div className="magic-header">
        <div className="magic-header-left">
          <h2 className="magic-title">The 7 Magic Fish</h2>
          <p className="magic-subtitle">
            Ancient legends speak of seven extraordinary fish — each more wondrous than the last.
            Breed your way to the truth.
          </p>
        </div>
        <div className="magic-progress-wrap">
          <div className="magic-progress-label">{foundCount} / {MAGIC_FISH.length}</div>
          <div className="magic-progress-bar">
            {MAGIC_FISH.map(mf => (
              <div
                key={mf.id}
                className={`magic-progress-pip ${foundSet.has(mf.id) ? 'filled' : ''}`}
                style={{ '--mrc': RARITY_COLORS[mf.rarity] }}
                title={foundSet.has(mf.id) ? mf.title : `Magic Fish #${mf.number}`}
              />
            ))}
          </div>
          {allFound && (
            <div className="magic-complete-badge">COMPLETE</div>
          )}
        </div>
      </div>

      {/* Win banner */}
      {allFound && (
        <div className="magic-win-banner">
          <div className="magic-win-title">You've discovered all 7 Magic Fish!</div>
          <div className="magic-win-sub">Your aquarium has become a legend. The mysteries of the deep are yours.</div>
        </div>
      )}

      {/* Cards */}
      <div className="magic-cards-list">
        {MAGIC_FISH.map(mf => (
          <MagicFishCard key={mf.id} mf={mf} found={foundSet.has(mf.id)} />
        ))}
      </div>
    </div>
  );
}
