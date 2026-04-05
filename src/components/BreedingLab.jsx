// ============================================================
// FISH TYCOON 2 — BREEDING LAB (Phase 7: Drag-and-Drop)
// ============================================================

import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { predictOffspringPhenotypes, RARITY } from '../data/genetics.js';

function TraitTag({ label, value }) {
  return (
    <span className="trait-tag">
      <span className="trait-tag-label">{label}</span>
      <span className="trait-tag-value">{value}</span>
    </span>
  );
}

// ── Drop zone for a parent slot ────────────────────────────
function BreedSlot({ fish, slot, onRemove, onDrop }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const fishId = e.dataTransfer.getData('fishId');
    if (fishId) onDrop(fishId, slot);
  };

  if (!fish) {
    return (
      <div
        className={`breed-slot empty ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="breed-slot-num">Parent {slot}</div>
        <div className="breed-slot-icon">🎯</div>
        <div className="breed-slot-hint">Drag a fish here</div>
      </div>
    );
  }

  const rarityColor = RARITY[fish.species?.rarity]?.color || '#888';
  const ph = fish.phenotype;
  return (
    <div
      className={`breed-slot filled ${dragOver ? 'drag-over' : ''}`}
      style={{ '--rarity-color': rarityColor }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="breed-slot-num">Parent {slot}</div>
      <div className="breed-slot-name">{fish.species?.name || 'Unknown'}</div>
      <div className="breed-slot-rarity" style={{ color: rarityColor }}>{fish.species?.rarity || 'common'}</div>
      <div className="breed-slot-traits">
        {ph.bodyShape && <TraitTag label="Body" value={ph.bodyShape} />}
        {ph.primaryColor && <TraitTag label="Color" value={ph.primaryColor} />}
        {ph.glow && ph.glow !== 'Normal' && <TraitTag label="Glow" value={ph.glow} />}
        {ph.mutation && ph.mutation !== 'None' && <TraitTag label="Mutation" value={ph.mutation} />}
      </div>
      <button className="btn btn-sm btn-danger" onClick={onRemove}>Remove</button>
    </div>
  );
}

function PredictionBar({ outcome }) {
  const rarityColor = RARITY[outcome.species?.rarity]?.color || '#888';
  return (
    <div className="predict-row">
      <div className="predict-name" style={{ color: rarityColor }}>{outcome.species?.name || 'Unknown'}</div>
      <div className="predict-rarity" style={{ color: rarityColor }}>{outcome.species?.rarity || 'common'}</div>
      <div className="predict-bar-wrap">
        <div className="predict-bar" style={{ width: `${outcome.chance}%`, background: rarityColor }} />
      </div>
      <div className="predict-chance">{outcome.chance}%</div>
      <div className="predict-price">🪙{outcome.species?.basePrice ?? '?'}</div>
    </div>
  );
}

// ── Draggable fish row ─────────────────────────────────────
function BreedFishRow({ fish, inSlot, onSelect, onDragStart }) {
  const rarityColor = RARITY[fish.species?.rarity]?.color || '#888';
  return (
    <div
      className={`breed-fish-row ${inSlot ? 'in-slot' : ''}`}
      draggable={!inSlot}
      onDragStart={(e) => {
        e.dataTransfer.setData('fishId', fish.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.(fish.id);
      }}
      onClick={() => onSelect(fish.id)}
    >
      <div className="bfr-drag-handle" title="Drag to a parent slot">⠿</div>
      <div className="bfr-dot" style={{ background: rarityColor }} />
      <div className="bfr-name">{fish.species?.name || 'Unknown'}</div>
      <div className="bfr-rarity" style={{ color: rarityColor }}>{fish.species?.rarity || 'common'}</div>
      <div className="bfr-traits">
        {fish.phenotype.bodyShape} · {fish.phenotype.primaryColor}
        {fish.phenotype.glow !== 'Normal' ? ` · ${fish.phenotype.glow}` : ''}
        {fish.phenotype.mutation !== 'None' ? ` · ${fish.phenotype.mutation}` : ''}
      </div>
      <button className="btn btn-sm">{inSlot ? '✓ Selected' : 'Select'}</button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function BreedingLab({ fish, breedingTank, onSelectForBreeding, onCollectEgg, onCancelBreeding }) {
  const slots = breedingTank?.slots || [null, null];
  const fishA = (fish || []).find(f => f.id === slots[0]);
  const fishB = (fish || []).find(f => f.id === slots[1]);
  const bothSelected = fishA && fishB;

  // Real-species fish have a decorative genome that doesn't represent their visible traits,
  // so cross-breed predictions would be misleading. Suppress them for species fish.
  const canPredict = bothSelected &&
    fishA.species?.visualType !== 'species' &&
    fishB.species?.visualType !== 'species';

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!breedingTank.breedingStartedAt || breedingTank.eggReady) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [breedingTank.breedingStartedAt, breedingTank.eggReady]);

  const predictions = useMemo(() => {
    if (!canPredict) return [];
    return predictOffspringPhenotypes(fishA.genome, fishB.genome);
  }, [fishA?.id, fishB?.id, canPredict]);

  let progress = 0;
  if (breedingTank.breedingStartedAt && !breedingTank.eggReady) {
    const elapsed = Date.now() - breedingTank.breedingStartedAt;
    progress = Math.min(100, (elapsed / breedingTank.breedingDurationMs) * 100);
  } else if (breedingTank.eggReady) {
    progress = 100;
  }

  const availableFish = fish.filter(f => f.stage === 'adult');

  // Handle drop onto a slot: slot=1 → index 0, slot=2 → index 1
  const handleSlotDrop = useCallback((fishId, slot) => {
    // Remove from current slot if already in one, then add to target slot
    const inSlot0 = breedingTank.slots[0] === fishId;
    const inSlot1 = breedingTank.slots[1] === fishId;
    if ((slot === 1 && inSlot0) || (slot === 2 && inSlot1)) return; // already there
    onSelectForBreeding(fishId); // toggle/place
  }, [breedingTank.slots, onSelectForBreeding]);

  return (
    <div className="breeding-lab">
      <div className="breed-top">
        {/* Parent slots */}
        <div className={`breed-parents${breedingTank.breedingStartedAt && !breedingTank.eggReady ? ' breed-parents--breeding' : ''}`}>
          <BreedSlot fish={fishA} slot={1} onRemove={() => onSelectForBreeding(fishA?.id)} onDrop={handleSlotDrop} />
          <div className="breed-heart">💕</div>
          <BreedSlot fish={fishB} slot={2} onRemove={() => onSelectForBreeding(fishB?.id)} onDrop={handleSlotDrop} />
        </div>

        {/* Progress / collect */}
        <div className="breed-status">
          {breedingTank.eggReady ? (
            <button className="btn btn-collect pulse" onClick={onCollectEgg}>
              🥚 Collect Egg!
            </button>
          ) : breedingTank.breedingStartedAt ? (
            <div className="breed-progress-wrap">
              <div className="breed-progress-label">Breeding…</div>
              <div className="breed-progress-bar">
                <div className="breed-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <button className="btn btn-sm btn-danger" style={{ marginTop: '8px' }} onClick={onCancelBreeding}>
                ✕ Cancel Breeding
              </button>
            </div>
          ) : bothSelected ? (
            <div className="breed-ready">✅ Ready to breed — watching…</div>
          ) : (
            <div className="breed-hint">
              <span className="breed-hint-icon">🎯</span>
              Drag two fish into the parent slots above — or click <strong>Select</strong>
            </div>
          )}
        </div>

        {/* Offspring predictions */}
        {bothSelected && !canPredict && (
          <div className="breed-predictions">
            <div className="breed-predictions-title">🔮 Offspring Prediction</div>
            <div className="predict-more" style={{ padding: '8px 0', color: '#6ab0de' }}>
              Offspring genetics are unpredictable when one or both parents are a real species.
              Breed them to find out!
            </div>
          </div>
        )}
        {bothSelected && predictions.length > 0 && (
          <div className="breed-predictions">
            <div className="breed-predictions-title">🔮 Possible Offspring</div>
            {predictions.slice(0, 6).map(o => (
              <PredictionBar key={o.species?.name || o.chance} outcome={o} />
            ))}
            {predictions.length > 6 && (
              <div className="predict-more">+{predictions.length - 6} more possibilities</div>
            )}
          </div>
        )}
      </div>

      {/* Fish selector list */}
      <div className="breed-selector">
        <div className="breed-selector-title">
          🐠 Available Adults ({availableFish.length})
          <span className="breed-selector-hint"> — drag fish to a slot or click Select</span>
        </div>
        <div className="breed-fish-list">
          {availableFish.map(f => (
            <BreedFishRow
              key={f.id}
              fish={f}
              inSlot={breedingTank.slots.includes(f.id)}
              onSelect={onSelectForBreeding}
            />
          ))}
          {availableFish.length === 0 && (
            <div className="breed-no-fish">No adult fish available. Wait for juveniles to grow!</div>
          )}
        </div>
      </div>
    </div>
  );
}
