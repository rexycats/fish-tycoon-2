import React, { memo } from 'react';
import FishSprite from './FishSprite.jsx';
import { RARITY, GENES } from '../data/genetics.js';
import { DISEASES } from '../systems/gameTick.js';

function FishPanel({ fish, onFeed, onSell, onMedicine, isListed, coins, medicineStock, tanks = [], onMoveFish }) {
  if (!fish) {
    return (
      <div className="panel fish-panel empty">
        <p className="hint">Click a fish in the tank to inspect it.</p>
      </div>
    );
  }

  const rarity = RARITY[fish.species.rarity];
  const salePrice = Math.round(fish.species.basePrice * (fish.health / 100));
  const ageMin = Math.floor(fish.age / 60);
  const needsMedicine = fish.health < 60 || !!fish.disease;
  const disease = fish.disease ? DISEASES[fish.disease] : null;

  return (
    <div className="panel fish-panel">
      <div className="fish-panel-header" style={{ borderColor: rarity.color }}>
        <FishSprite fish={fish} size={80} />
        <div className="fish-panel-title">
          <h2>{fish.species.name}</h2>
          <span className="rarity-badge" style={{ background: rarity.color }}>
            {rarity.label}
          </span>
          <span className="stage-label">{fish.stage}</span>
          {disease && (
            <span className="disease-badge" style={{ background: disease.color }}>
              {disease.emoji} {disease.name}
            </span>
          )}
        </div>
      </div>

      {/* Disease warning */}
      {disease && (
        <div className="disease-alert">
          <div className="disease-alert-title">{disease.emoji} {disease.name} Detected!</div>
          <div className="disease-alert-desc">{disease.desc}</div>
          {disease.spreadChancePerSec > 0 && (
            <div className="disease-alert-spread">⚠️ Contagious — may spread to other fish!</div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="fish-stats">
        <StatBar label="Health" value={fish.health} max={100} color={disease ? '#ff4444' : '#5dbe8a'} />
        <StatBar label="Hunger" value={fish.hunger} max={100} color="#e08840" invert />
        <div className="stat-row">
          <span>Age</span><span>{ageMin} min</span>
        </div>
        <div className="stat-row">
          <span>Value</span><span>🪙 {salePrice}</span>
        </div>
      </div>

      {/* Genetics */}
      <div className="genetics-grid">
        <h3>Genetics</h3>
        {Object.entries(fish.phenotype).map(([gene, expressed]) => (
          <div key={gene} className="gene-row">
            <span className="gene-name">{GENES[gene]?.name}</span>
            <span className="gene-val">{expressed}</span>
            <span className="gene-raw">{fish.genome[gene].join('')}</span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="fish-actions">
        <button className="btn btn-feed" onClick={() => onFeed(fish.id)}
                disabled={fish.hunger < 20}>
          🍤 Feed
        </button>
        <button
          className={`btn btn-medicine ${needsMedicine ? 'pulse' : ''}`}
          onClick={() => onMedicine(fish.id)}
          disabled={!needsMedicine || medicineStock <= 0}
          title={medicineStock <= 0 ? 'No medicine in stock' : needsMedicine ? `Use medicine (${medicineStock} left)` : 'Fish is healthy'}
        >
          💊 {disease ? `Cure (${medicineStock})` : `Treat (${medicineStock})`}
        </button>
        {isListed ? (
          <button className="btn btn-sell active" onClick={() => onSell(fish.id)}>
            🏪 Listed for sale
          </button>
        ) : (
          <button className="btn btn-sell" onClick={() => onSell(fish.id)}
                  disabled={fish.stage !== 'adult'}>
            💰 Sell ({salePrice} 🪙)
          </button>
        )}
      </div>

      {/* Move between tanks */}
      {tanks.length > 1 && onMoveFish && (
        <div className="fish-move">
          <span className="fish-move-label">Move to tank:</span>
          {tanks.filter(t => t.id !== fish.tankId).map(t => (
            <button key={t.id} className="btn btn-sm btn-move" onClick={() => onMoveFish(fish.id, t.id)}>
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBar({ label, value, max, color, invert }) {
  const pct = Math.round((value / max) * 100);
  const display = invert ? 100 - pct : pct;
  return (
    <div className="stat-bar-row">
      <span className="stat-label">{label}</span>
      <div className="stat-bar-bg">
        <div className="stat-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="stat-value">{display}%</span>
    </div>
  );
}

// Only re-render when the selected fish changes or its key stats update
export default memo(FishPanel, (prev, next) =>
  prev.fish?.id        === next.fish?.id        &&
  prev.fish?.health    === next.fish?.health     &&
  prev.fish?.hunger    === next.fish?.hunger     &&
  prev.fish?.disease   === next.fish?.disease    &&
  prev.isListed        === next.isListed         &&
  prev.coins           === next.coins            &&
  prev.medicineStock   === next.medicineStock    &&
  prev.tanks           === next.tanks
);
