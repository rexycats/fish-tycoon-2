import React, { memo, useState, useEffect, useRef } from 'react';
import FishSprite from './FishSprite.jsx';
import { RARITY, GENES } from '../data/genetics.js';
import { DISEASES } from '../systems/gameTick.js';

function FishPanel({ fish, onFeed, onSell, onMedicine, isListed, coins, medicineStock, tanks = [], onMoveFish }) {
  const prevFishId = useRef(null);
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    if (fish?.id !== prevFishId.current) {
      setEntering(true);
      prevFishId.current = fish?.id;
      const t = setTimeout(() => setEntering(false), 400);
      return () => clearTimeout(t);
    }
  }, [fish?.id]);

  if (!fish) {
    return (
      <div className="fish-panel fish-panel--empty">
        <div className="fish-panel-empty-inner">
          <div className="fish-panel-empty-icon">🐠</div>
          <p className="fish-panel-empty-text">Select a fish</p>
          <p className="fish-panel-empty-sub">Click any fish in the tank</p>
        </div>
      </div>
    );
  }

  const rarity = RARITY[fish.species.rarity];
  const salePrice = Math.round(fish.species.basePrice * (fish.health / 100));
  const ageMin = Math.floor(fish.age / 60);
  const needsMedicine = fish.health < 60 || !!fish.disease;
  const disease = fish.disease ? DISEASES[fish.disease] : null;
  const healthPct = Math.round(fish.health);
  const satietyPct = Math.max(0, 100 - Math.round(fish.hunger));
  const healthColor = disease ? '#ff4455' : healthPct > 70 ? '#3ddba0' : healthPct > 40 ? '#f5c542' : '#ff6055';
  const satietyColor = satietyPct > 70 ? '#5db8e8' : satietyPct > 40 ? '#f5a742' : '#ff6055';
  const showGenetics = fish.genome && fish.species?.visualType !== 'species';
  const isLegendary = fish.species.rarity === 'legendary';
  const isEpic      = fish.species.rarity === 'epic';
  const rarityShimmer = isLegendary ? 'fp-hero--legendary' : isEpic ? 'fp-hero--epic' : '';

  return (
    <div className={`fish-panel ${entering ? 'fish-panel--entering' : ''}`}>
      <div className={`fp-hero ${rarityShimmer}`} style={{ '--rarity-color': rarity.color, '--rarity-color-dim': rarity.color + '22' }}>
        <div className="fp-hero-glow" style={{ background: rarity.color }} />
        <div className="fp-sprite-stage">
          <FishSprite fish={fish} size={112} />
          {isLegendary && <div className="fp-legendary-ring" style={{ borderColor: rarity.color, boxShadow: `0 0 18px ${rarity.color}88` }} />}
          {isEpic && <div className="fp-epic-ring" style={{ borderColor: rarity.color }} />}
        </div>
        <div className="fp-hero-info">
          <div className="fp-rarity-row">
            <span className={`fp-rarity-dot ${isLegendary ? 'fp-rarity-dot--pulse' : ''}`} style={{ background: rarity.color }} />
            <span className={`fp-rarity-label ${isLegendary ? 'fp-rarity-label--shimmer' : ''}`} style={{ color: rarity.color }}>{rarity.label}</span>
            <span className="fp-stage-pill">{fish.stage}</span>
          </div>
          <h2 className="fp-name">{fish.species.name}</h2>
          <div className="fp-meta-row">
            <span className="fp-meta-chip">⏱ {ageMin}m old</span>
            <span className="fp-meta-chip fp-meta-value">🪙 {salePrice}</span>
          </div>
        </div>
      </div>

      {disease && (
        <div className="fp-disease">
          <div className="fp-disease-icon">{disease.emoji}</div>
          <div className="fp-disease-body">
            <div className="fp-disease-name">{disease.name} Detected</div>
            <div className="fp-disease-desc">{disease.desc}</div>
            {disease.spreadChancePerSec > 0 && (
              <div className="fp-disease-spread">⚠ Contagious — may spread!</div>
            )}
          </div>
        </div>
      )}

      <div className="fp-vitals">
        <div className="fp-vitals-label">Vitals</div>
        <RichStatBar label="Health" value={healthPct} color={healthColor} icon="❤" />
        <RichStatBar label="Satiety" value={satietyPct} color={satietyColor} icon="🍤" />
      </div>

      <div className="fp-actions">
        <ActionBtn icon="🍤" label="Feed" onClick={() => onFeed(fish.id)}
          disabled={fish.hunger < 20} variant="feed" />
        <ActionBtn icon="💊"
          label={disease ? `Cure (${medicineStock})` : `Treat (${medicineStock})`}
          onClick={() => onMedicine(fish.id)}
          disabled={!needsMedicine || medicineStock <= 0}
          variant="medicine" pulse={needsMedicine && medicineStock > 0} />
        {isListed ? (
          <ActionBtn icon="🏪" label="Listed" onClick={() => onSell(fish.id)} variant="listed" />
        ) : (
          <ActionBtn icon="💰" label={`Sell · ${salePrice}🪙`}
            onClick={() => onSell(fish.id)} disabled={fish.stage !== 'adult'} variant="sell" />
        )}
      </div>

      {showGenetics && (
        <div className="fp-genetics">
          <div className="fp-genetics-label">Genetics</div>
          <div className="fp-gene-grid">
            {Object.entries(fish.phenotype).map(([gene, expressed]) => (
              <div key={gene} className="fp-gene-row">
                <span className="fp-gene-name">{GENES[gene]?.name}</span>
                <span className="fp-gene-val">{expressed}</span>
                <span className="fp-gene-raw">{fish.genome[gene]?.join('') ?? '??'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tanks.length > 1 && onMoveFish && (
        <div className="fp-move">
          <div className="fp-move-label">Move to tank</div>
          <div className="fp-move-btns">
            {tanks.filter(t => t.id !== fish.tankId).map(t => (
              <button key={t.id} className="fp-move-btn" onClick={() => onMoveFish(fish.id, t.id)}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RichStatBar({ label, value, color, icon }) {
  const [displayed, setDisplayed] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    const initial = prevValue.current;
    prevValue.current = value;
    const diff = value - initial;
    if (diff === 0) return;
    let start = null;
    const dur = 550;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(initial + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [value]);

  const pct = Math.max(0, Math.min(100, displayed));

  return (
    <div className="fp-stat-row">
      <div className="fp-stat-head">
        <span className="fp-stat-icon">{icon}</span>
        <span className="fp-stat-label">{label}</span>
        <span className="fp-stat-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="fp-bar-track">
        <div className="fp-bar-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}55` }} />
        <div className="fp-bar-shine" />
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, onClick, disabled, variant, pulse }) {
  return (
    <button
      className={`fp-action-btn fp-action-btn--${variant}${pulse ? ' fp-action-btn--pulse' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="fp-action-icon">{icon}</span>
      <span className="fp-action-label">{label}</span>
    </button>
  );
}

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
