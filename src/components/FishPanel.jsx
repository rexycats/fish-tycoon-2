import React, { memo, useState, useEffect, useRef } from 'react';
import FishSprite from './FishSprite.jsx';
import { RARITY, GENES } from '../data/genetics.js';
import { DISEASES, getMarketMultiplier, getDiseaseStage, CURE_SUCCESS_RATE } from '../systems/gameTick.js';
import { useGameStore } from '../store/gameStore.js';

function FishPanel({ fish, onFeed, onSell, onMedicine, isListed, medicineStock, foodStock = 0, tanks = [], onMoveFish, isFirstRun, onNavigate }) {
  const prevFishId = useRef(null);
  const [entering, setEntering] = useState(false);
  const [showGenetics, setShowGenetics] = useState(false);
  const [showMove, setShowMove] = useState(false);

  useEffect(() => {
    if (fish?.id !== prevFishId.current) {
      setEntering(true);
      setShowGenetics(false); // Fix 1: auto-close genetics when selecting a new fish
      setShowMove(false);     // Fix 4: collapse move section on fish change
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
          {isFirstRun && (
            <div className="fish-panel-onboarding">
              <p className="fish-panel-onboarding-title">🎮 How to play</p>
              <p className="fish-panel-onboarding-step">🍤 Feed fish to keep them healthy</p>
              <p className="fish-panel-onboarding-step">📈 Juveniles grow into adults over time</p>
              <p className="fish-panel-onboarding-step">💰 Sell adults in the Shop to earn coins</p>
              <p className="fish-panel-onboarding-step">⬆️ Use coins to upgrade your aquarium</p>
              {onNavigate && (
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginTop: 10, width: '100%' }}
                  onClick={() => onNavigate('shop')}
                >
                  🏪 Open Shop →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const rarity = RARITY[fish.species.rarity];
  const market = useGameStore(s => s.market);
  const marketMult = getMarketMultiplier(fish, market);
  const basePrice = Math.round(fish.species.basePrice * (fish.health / 100));
  const salePrice = Math.round(basePrice * marketMult);
  const marketDelta = marketMult !== 1 ? Math.round((marketMult - 1) * 100) : 0;
  // Fix 2: human-readable age
  const ageMin = Math.floor(fish.age / 60);
  const ageLabel = ageMin < 60
    ? `${ageMin} min`
    : `${Math.floor(ageMin / 60)}h ${ageMin % 60}m`;
  // Fix 6: value health delta
  const healthDelta = Math.round((fish.health / 100 - 1) * 100);
  const showDelta = fish.health < 98;
  const needsMedicine = fish.health < 60 || !!fish.disease;
  const disease = fish.disease ? DISEASES[fish.disease] : null;
  const healthPct = Math.round(fish.health);
  const satietyPct = Math.max(0, 100 - Math.round(fish.hunger));
  const healthColor = disease ? '#ff4455' : healthPct > 70 ? '#3ddba0' : healthPct > 40 ? '#f5c542' : '#ff6055';
  const satietyColor = satietyPct > 70 ? '#5db8e8' : satietyPct > 40 ? '#f5a742' : '#ff6055';
  const hasGenetics = fish.genome && fish.species?.visualType !== 'species';
  const isLegendary = fish.species.rarity === 'legendary';
  const isEpic      = fish.species.rarity === 'epic';
  const rarityShimmer = isLegendary ? 'fp-hero--legendary' : isEpic ? 'fp-hero--epic' : '';

  // Recommended action logic
  const isSick    = needsMedicine && medicineStock > 0;
  const isHungry  = fish.hunger >= 40;
  const isAdult   = fish.stage === 'adult';
  const bestAction = isSick ? 'medicine' : isHungry ? 'feed' : isAdult ? 'sell' : null;
  const recommendation = disease
    ? `${disease.emoji} ${disease.name} — treat immediately`
    : isHungry
    ? '🍤 Hungry — feed now'
    : isAdult && !isListed
    ? '💰 Ready to sell'
    : null;

  // Status emoji label
  const statusLabel = disease
    ? `Sick 🦠`
    : fish.hunger >= 60
    ? 'Hungry 🍤'
    : isAdult
    ? 'Ready 💰'
    : null;

  return (
    <div className={`fish-panel ${entering ? 'fish-panel--entering' : ''}`}>

      {/* ── Step 5: Rarity color strip ── */}
      <div className="fp-rarity-strip" style={{ background: rarity.color }} />

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
            {statusLabel && <span className="fp-status-label">{statusLabel}</span>}
          </div>
          <h2 className="fp-name">
            {fish.nickname ? <span className="fp-nickname">{fish.nickname}</span> : null}
            <span className={fish.nickname ? 'fp-species-sub' : ''}>{fish.species.name}</span>
            <button className="fp-rename-btn" title="Rename this fish"
              onClick={() => {
                const name = prompt('Name this fish:', fish.nickname || '');
                if (name !== null) {
                  useGameStore.getState().renameFish(fish.id, name);
                }
              }}>✏️</button>
          </h2>
          <div className="fp-meta-row">
            <span className="fp-meta-chip">⏱ {ageLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Step 6: Prominent value display ── */}
      <div className="fp-value-banner" style={{ '--rarity-color': rarity.color }}>
        <span className="fp-value-coin">🪙</span>
        <span className="fp-value-number">{salePrice}</span>
        <span className="fp-value-label">sale value</span>
        {marketDelta !== 0 && (
          <span className={`fp-value-delta ${marketDelta > 0 ? 'fp-value-delta--up' : ''}`}>
            {marketDelta > 0 ? '📈' : '📉'} {marketDelta > 0 ? '+' : ''}{marketDelta}% market
          </span>
        )}
        {showDelta && (
          <span className="fp-value-delta" title={`Health penalty: ${healthDelta}%`}>
            {healthDelta}% {disease ? 'sick' : 'health'}
          </span>
        )}
      </div>

      {disease && (() => {
        const stage = getDiseaseStage(fish.diseaseSince);
        const isIncubating = stage === 'incubating';
        const hasDiagnosis = fish.diagnosed || !isIncubating;
        const symptomText = disease.symptoms?.[stage] || '';
        const cureName = disease.treatmentName;
        return (
          <div className={`fp-disease fp-disease--${stage}`}>
            <div className="fp-disease-icon">{hasDiagnosis ? disease.emoji : '❓'}</div>
            <div className="fp-disease-body">
              <div className="fp-disease-name">
                {hasDiagnosis ? `${disease.name} — ${stage}` : 'Unknown Illness — Incubating'}
              </div>
              {hasDiagnosis ? (
                <>
                  <div className="fp-disease-desc">{disease.desc}</div>
                  <div className="fp-disease-symptom">Symptoms: {symptomText || 'none visible yet'}</div>
                  <div className="fp-disease-cure">Treatment: {cureName}</div>
                  {stage === 'severe' || stage === 'critical' ? (
                    <div className="fp-disease-warn">⚠ Cure success: {Math.round((CURE_SUCCESS_RATE[stage] || 0.5) * 100)}%</div>
                  ) : null}
                </>
              ) : (
                <div className="fp-disease-desc">
                  Something seems wrong... Use a 🔬 Diagnostic Kit to identify, or wait for symptoms.
                </div>
              )}
              {disease.spreadChancePerSec > 0 && (
                <div className="fp-disease-spread">⚠ Contagious — isolate or treat quickly!</div>
              )}
            </div>
          </div>
        );
      })()}

      {recommendation && (
        <div className="fp-recommendation">
          <span className="fp-rec-text">{recommendation}</span>
        </div>
      )}

      {/* ── Step 7: Grouped stats with section headers ── */}
      <div className="fp-section">
        <div className="fp-section-header">
          <span className="fp-section-icon">❤️</span>
          <span className="fp-section-title">Health</span>
        </div>
        <div className="fp-section-body">
          <RichStatBar label="Health" value={healthPct} color={healthColor} icon="❤" />
          <RichStatBar label="Satiety" value={satietyPct} color={satietyColor} icon="🍤" />
        </div>
      </div>

      <div className="fp-actions">
        <ActionBtn icon="🍤" label={`Feed (${foodStock})`} onClick={() => onFeed(fish.id)}
          disabled={fish.hunger < 20} variant="feed" highlight={bestAction === 'feed'}
          disabledTitle="Fish is full" />
        <ActionBtn icon="💊"
          label={disease ? `${disease.treatmentName} (${medicineStock})` : `Treat (${medicineStock})`}
          onClick={() => onMedicine(fish.id)}
          disabled={!needsMedicine || medicineStock <= 0}
          disabledTitle={medicineStock <= 0 ? 'No medicine in stock' : 'Fish is healthy — no treatment needed'}
          variant="medicine" pulse={needsMedicine && medicineStock > 0} highlight={bestAction === 'medicine'} />
        {isListed ? (
          <ActionBtn icon="🏪" label="Listed" onClick={() => onSell(fish.id)} variant="listed" />
        ) : (
          <ActionBtn icon="💰" label={`Sell · ${salePrice}🪙`}
            onClick={() => onSell(fish.id)} disabled={fish.stage !== 'adult'} variant="sell" highlight={bestAction === 'sell'}
            disabledTitle={`Can't sell yet — fish is still a ${fish.stage}`} />
        )}
      </div>

      {/* ── Step 8: Collapsible genetics ── */}
      {hasGenetics && (
        <div className="fp-section fp-section--genetics">
          <button className="fp-section-header fp-section-header--toggle" onClick={() => setShowGenetics(v => !v)}>
            <span className="fp-section-icon">🧬</span>
            <span className="fp-section-title">Genetics</span>
            <span className="fp-toggle-arrow">{showGenetics ? '▲' : '▼'}</span>
          </button>
          {showGenetics && (
            <div className="fp-section-body fp-gene-grid">
              {Object.entries(fish.phenotype).map(([gene, expressed]) => (
                <div key={gene} className="fp-gene-row">
                  <span className="fp-gene-name">{GENES[gene]?.name}</span>
                  <span className="fp-gene-val">{expressed}</span>
                  <span className="fp-gene-raw">{fish.genome[gene]?.join('') ?? '??'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tanks.length > 1 && onMoveFish && (
        <div className="fp-move">
          <button
            className={`fp-move-toggle${showMove ? ' fp-move-toggle--open' : ''}`}
            onClick={() => setShowMove(v => !v)}
          >
            ↔ Move to tank {showMove ? '▲' : '▼'}
          </button>
          {showMove && (
            <div className="fp-move-btns">
              {tanks.filter(t => t.id !== fish.tankId).map(t => (
                <button key={t.id} className="fp-move-btn" onClick={() => { onMoveFish(fish.id, t.id); setShowMove(false); }}>
                  {t.name}
                </button>
              ))}
            </div>
          )}
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

function ActionBtn({ icon, label, onClick, disabled, variant, pulse, highlight, disabledTitle }) {
  return (
    <button
      className={`fp-action-btn fp-action-btn--${variant}${pulse ? ' fp-action-btn--pulse' : ''}${highlight ? ' fp-action-btn--highlight' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={disabled && disabledTitle ? disabledTitle : undefined}
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
  prev.foodStock       === next.foodStock        &&
  prev.medicineStock   === next.medicineStock    &&
  prev.tanks           === next.tanks            &&
  prev.isFirstRun      === next.isFirstRun       &&
  prev.onNavigate      === next.onNavigate
);
