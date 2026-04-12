// ============================================================
// FISH TYCOON 2 — BREEDING LAB (Phase 7: Drag-and-Drop)
// ============================================================

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { predictOffspringPhenotypes, RARITY, GENES, expressGene } from '../data/genetics.js';

// ── Per-gene Punnett square probabilities ──────────────────
function computeTraitOdds(genomeA, genomeB) {
  if (!genomeA || !genomeB) return [];
  const results = [];
  for (const [gene, geneDef] of Object.entries(GENES)) {
    if (!genomeA[gene] || !genomeB[gene]) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    // 4 equally probable combinations
    const combos = [
      expressGene(gene, a1, b1),
      expressGene(gene, a1, b2),
      expressGene(gene, a2, b1),
      expressGene(gene, a2, b2),
    ];
    const counts = {};
    for (const trait of combos) counts[trait] = (counts[trait] || 0) + 1;
    const outcomes = Object.entries(counts)
      .map(([trait, count]) => ({ trait, chance: Math.round((count / 4) * 100) }))
      .sort((a, b) => b.chance - a.chance);
    results.push({ gene, label: geneDef.name, outcomes });
  }
  return results;
}

// ── Trait odds grid ────────────────────────────────────────
function TraitOddsGrid({ genomeA, genomeB }) {
  const odds = useMemo(() => computeTraitOdds(genomeA, genomeB), [genomeA, genomeB]);
  if (odds.length === 0) return null;
  return (
    <div className="trait-odds-grid">
      <div className="trait-odds-title">🧬 Trait Inheritance</div>
      <div className="trait-odds-rows">
        {odds.map(({ gene, label, outcomes }) => (
          <div key={gene} className="trait-odds-row">
            <div className="trait-odds-label">{label}</div>
            <div className="trait-odds-bars">
              {outcomes.map(({ trait, chance }) => (
                <div key={trait} className="trait-odds-bar-wrap" title={`${trait}: ${chance}%`}>
                  <div className="trait-odds-bar"
                    style={{
                      width: `${chance}%`,
                      background: chance === 100 ? '#7ec8a0'
                        : chance >= 50 ? '#6ab0de'
                        : chance >= 25 ? '#b07ee8' : '#f0c040',
                    }}
                  />
                  <span className="trait-odds-text">
                    {trait} <span className="trait-odds-pct">{chance}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TraitTag({ label, value }) {
  return (
    <span className="trait-tag">
      <span className="trait-tag-label">{label}</span>
      <span className="trait-tag-value">{value}</span>
    </span>
  );
}

// ── Drop zone for a parent slot ────────────────────────────
function BreedSlot({ fish, slot, isDonor, onRemove, onDrop }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const fishId = e.dataTransfer.getData('fishId');
    if (fishId) onDrop(fishId, slot);
  };

  const slotLabel = isDonor ? '🧬 Genetic Donor' : `Parent ${slot}`;
  const emptyIcon = isDonor ? '🧬' : '🎯';
  const emptyHint = isDonor ? 'Optional — influences offspring traits' : 'Drag a fish here';

  if (!fish) {
    return (
      <div
        className={`breed-slot empty ${isDonor ? 'breed-slot--donor' : ''} ${dragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="breed-slot-num">{slotLabel}</div>
        <div className="breed-slot-icon">{emptyIcon}</div>
        <div className="breed-slot-hint">{emptyHint}</div>
      </div>
    );
  }

  const rarityColor = RARITY[fish.species?.rarity]?.color || '#888';
  const ph = fish.phenotype;
  return (
    <div
      className={`breed-slot filled ${isDonor ? 'breed-slot--donor' : ''} ${dragOver ? 'drag-over' : ''}`}
      style={{ '--rarity-color': rarityColor }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="breed-slot-num">{slotLabel}</div>
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
      <div className="predict-chance" style={{ color: rarityColor, fontWeight: 600 }}>{outcome.chance}%</div>
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
        {fish.phenotype?.bodyShape} · {fish.phenotype?.primaryColor}
        {fish.phenotype?.glow && fish.phenotype.glow !== 'Normal' ? ` · ${fish.phenotype.glow}` : ''}
        {fish.phenotype?.mutation && fish.phenotype.mutation !== 'None' ? ` · ${fish.phenotype.mutation}` : ''}
      </div>
      <button
        className={`btn btn-sm${inSlot ? ' btn-warn' : ''}`}
        onClick={e => { e.stopPropagation(); onSelect(fish.id); }}
      >
        {inSlot ? '✕ Remove' : 'Select'}
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
function BreedingLab({ fish, breedingTank, extraBays = [], maxBays = 1, onSelectForBreeding, onCollectEgg, onCancelBreeding, onNavigate }) {
  const [activeBay, setActiveBay] = useState(0);

  // Build array of all bays
  const allBays = [breedingTank, ...extraBays];
  const bay = allBays[activeBay] || breedingTank;

  const slots = bay?.slots || [null, null];
  const hasThirdSlot = slots.length >= 3;
  const fishA = (fish || []).find(f => f.id === slots[0]);
  const fishB = (fish || []).find(f => f.id === slots[1]);
  const fishC = hasThirdSlot ? (fish || []).find(f => f.id === slots[2]) : null;
  const bothSelected = fishA && fishB;

  // Real-species fish have a decorative genome that doesn't represent their visible traits,
  // so cross-breed predictions would be misleading. Suppress them for species fish.
  const canPredict = bothSelected &&
    fishA.species?.visualType !== 'species' &&
    fishB.species?.visualType !== 'species';

  const [, setTick] = useState(0);
  useEffect(() => {
    if (!bay.breedingStartedAt || bay.eggReady) return;
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [bay.breedingStartedAt, bay.eggReady]);

  const predictions = useMemo(() => {
    if (!canPredict) return [];
    return predictOffspringPhenotypes(fishA.genome, fishB.genome);
  }, [fishA?.id, fishB?.id, canPredict]);

  let progress = 0;
  let timeRemainingLabel = null;
  if (bay.breedingStartedAt && !bay.eggReady) {
    const elapsed = Date.now() - bay.breedingStartedAt;
    progress = Math.min(100, (elapsed / bay.breedingDurationMs) * 100);
    const msLeft = Math.max(0, bay.breedingDurationMs - elapsed);
    const secsLeft = Math.ceil(msLeft / 1000);
    timeRemainingLabel = secsLeft < 60
      ? `${secsLeft}s left`
      : `~${Math.ceil(secsLeft / 60)}m left`;
  } else if (bay.eggReady) {
    progress = 100;
  }

  const availableFish = fish.filter(f => f.stage === 'adult');

  // Handle drop onto a slot: slot=1 → index 0, slot=2 → index 1
  const handleSlotDrop = useCallback((fishId, slot) => {
    // If already in the exact target slot, no-op
    const inSlot0 = bay.slots[0] === fishId;
    const inSlot1 = bay.slots[1] === fishId;
    const inSlot2 = bay.slots[2] === fishId;
    if ((slot === 1 && inSlot0) || (slot === 2 && inSlot1) || (slot === 3 && inSlot2)) return;
    onSelectForBreeding(fishId, activeBay); // toggle/place into next available or donor slot
  }, [bay.slots, onSelectForBreeding]);

  return (
    <div className="breeding-lab">
      {/* Bay tabs — only show if more than 1 bay unlocked */}
      {maxBays > 1 && (
        <div className="breed-bay-tabs">
          {Array.from({ length: maxBays }, (_, i) => {
            const b = allBays[i];
            const hasEgg = b?.eggReady;
            const busy = b?.breedingStartedAt && !b?.eggReady;
            return (
              <button key={i} className={`breed-bay-tab ${activeBay === i ? 'active' : ''} ${hasEgg ? 'has-egg' : ''} ${busy ? 'busy' : ''}`}
                onClick={() => setActiveBay(i)}>
                Bay {i + 1} {hasEgg ? (b?.clutchSize > 1 ? `${'🥚'.repeat(b.clutchSize)}` : '🥚') : busy ? '⏳' : ''}
              </button>
            );
          })}
        </div>
      )}
      <div className="breed-top">
        {/* Parent slots */}
        <div className={`breed-parents${bay.breedingStartedAt && !bay.eggReady ? ' breed-parents--breeding' : ''} ${hasThirdSlot ? 'breed-parents--trio' : ''}`}>
          <BreedSlot fish={fishA} slot={1} onRemove={() => onSelectForBreeding(fishA?.id)} onDrop={handleSlotDrop} />
          <div className="breed-heart">💕</div>
          <BreedSlot fish={fishB} slot={2} onRemove={() => onSelectForBreeding(fishB?.id)} onDrop={handleSlotDrop} />
          {hasThirdSlot && (
            <>
              <div className="breed-heart breed-heart--donor" title="Genetic Donor influence">🧬</div>
              <BreedSlot
                fish={fishC}
                slot={3}
                isDonor={true}
                onRemove={() => onSelectForBreeding(fishC?.id)}
                onDrop={handleSlotDrop}
              />
            </>
          )}
        </div>

        {/* Progress / collect */}
        <div className="breed-status">
          {bay.eggReady ? (() => {
            const clutch = bay.clutchSize || 1;
            const eggEmoji = '🥚'.repeat(clutch);
            const clutchLabel = clutch === 3 ? 'Collect Triplets!' : clutch === 2 ? 'Collect Twins!' : 'Collect Egg!';
            return (
              <button className={`btn btn-collect pulse ${clutch > 1 ? 'btn-collect--multi' : ''}`} onClick={onCollectEgg}>
                {eggEmoji} {clutchLabel}
              </button>
            );
          })() : bay.breedingStartedAt ? (
            <div className="breed-progress-wrap">
              <div className="breed-progress-header">
                <div className="breed-progress-label">
                  Breeding… {bay.clutchSize > 1 && <span className="breed-clutch-badge">{bay.clutchSize === 3 ? '×3 Triplets!' : '×2 Twins!'}</span>}
                </div>
                {timeRemainingLabel && (
                  <div className="breed-progress-time">{timeRemainingLabel}</div>
                )}
              </div>
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

        {/* Per-gene trait inheritance breakdown */}
        {canPredict && bothSelected && (
          <TraitOddsGrid genomeA={fishA.genome} genomeB={fishB.genome} />
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
              inSlot={bay.slots.includes(f.id)}
              onSelect={(fid) => onSelectForBreeding(fid, activeBay)}
            />
          ))}
          {availableFish.length === 0 && (
            <div className="breed-no-fish">
              No adult fish available. Wait for juveniles to grow!
              {onNavigate && (
                <button className="btn btn-sm" style={{ marginTop: '8px', display: 'block' }} onClick={() => onNavigate('tank')}>
                  🐠 View Tank
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default BreedingLab;
