// ============================================================
// FISH TYCOON 2 — FISHDEX (Phase 8: AI Lore & Names)
// ============================================================

import React, { useState, useMemo } from 'react';
import { RARITY } from '../data/genetics.js';
import FishSprite from './FishSprite.jsx';

// ── Fish silhouette ────────────────────────────────────────
function FishSilhouette({ bodyShape, primaryColor, glow, rarity, size = 48 }) {
  const colors = {
    Crimson: ['#e84040', '#ff7070'], Gold: ['#e8a020', '#ffd060'],
    Violet: ['#9040e8', '#c070ff'], Azure: ['#2080e8', '#60b0ff'],
    Emerald: ['#20a840', '#50d870'], White: ['#c0d0e0', '#eef4ff'],
  };
  const [body, light] = colors[primaryColor] || ['#888', '#aaa'];
  const rarityColor = RARITY[rarity]?.color || '#888';
  const glowFilter = glow !== 'Normal' ? `drop-shadow(0 0 ${glow === 'Ultraviolet' ? 8 : 4}px ${rarityColor})` : 'none';
  const s = size;
  const paths = {
    Orb:     `M${s*.5},${s*.15} a${s*.35},${s*.35} 0 1,0 0.01,0 Z`,
    Round:   `M${s*.5},${s*.18} a${s*.32},${s*.28} 0 1,0 0.01,0 Z`,
    Delta:   `M${s*.1},${s*.8} L${s*.9},${s*.5} L${s*.1},${s*.2} Z`,
    Slender: `M${s*.08},${s*.5} Q${s*.3},${s*.3} ${s*.85},${s*.45} Q${s*.3},${s*.7} ${s*.08},${s*.5} Z`,
    Eel:     `M${s*.05},${s*.5} Q${s*.3},${s*.35} ${s*.6},${s*.4} Q${s*.85},${s*.45} ${s*.95},${s*.5} Q${s*.85},${s*.55} ${s*.6},${s*.6} Q${s*.3},${s*.65} ${s*.05},${s*.5} Z`,
  };
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} style={{ filter: glowFilter }}>
      <defs>
        <radialGradient id={`fg-${bodyShape}-${primaryColor}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={body} />
        </radialGradient>
      </defs>
      <path d={paths[bodyShape] || paths.Round} fill={`url(#fg-${bodyShape}-${primaryColor})`} opacity="0.95" />
      {glow !== 'Normal' && (
        <path d={paths[bodyShape] || paths.Round} fill="none" stroke={rarityColor} strokeWidth="1.5" opacity="0.6" />
      )}
    </svg>
  );
}

// ── Single Fishdex card ────────────────────────────────────
function FishdexCard({ entry, onClick, isSelected }) {
  const rarityColor = RARITY[entry.rarity]?.color || '#888';
  const displayName = entry.aiName || entry.name;
  const isRealSpecies = entry.visualType === 'species';
  const isHighRarity = entry.rarity === 'legendary' || entry.rarity === 'epic';
  const ph = entry.phenotype || {};
  const hasProceduralPhenotype = !isRealSpecies && ph.bodyShape && ph.primaryColor;

  // Locked Legend Fish — special locked card
  if (entry._isLegendLocked) {
    return (
      <div className="fdex-card fdex-card--legendary fdex-card--legend-locked"
           style={{ '--rarity-color': rarityColor }}>
        <div className="fdex-card-ring" style={{ borderColor: rarityColor }} />
        <div className="fdex-card-sprite" style={{ fontSize: '2rem', opacity: 0.25 }}>🐉</div>
        <div className="fdex-card-name" style={{ color: rarityColor, opacity: 0.5 }}>???</div>
        <div className="fdex-card-rarity" style={{ color: rarityColor, opacity: 0.4 }}>legendary</div>
        <div style={{ fontSize: '10px', color: 'rgba(160,200,255,0.4)', textAlign: 'center', marginTop: 2, lineHeight: 1.4 }}>
          Discover all 7 Magic Fish to unlock
        </div>
      </div>
    );
  }

  const mockFish = isRealSpecies ? {
    id: `fdex-${entry.speciesKey}`,
    stage: 'adult',
    species: { visualType: 'species', key: entry.speciesKey, rarity: entry.rarity },
  } : null;
  return (
    <div className={`fdex-card ${isSelected ? 'selected' : ''} fdex-card--${entry.rarity}`}
         style={{ '--rarity-color': rarityColor }}
         onClick={onClick}>

      {/* Rarity glow ring */}
      <div className={`fdex-card-ring ${isHighRarity ? 'fdex-card-ring--pulse' : ''}`}
           style={{ borderColor: rarityColor, boxShadow: `0 0 10px ${rarityColor}44` }} />

      <div className="fdex-card-sprite">
        {isRealSpecies ? (
          <FishSprite fish={mockFish} size={56} selected={false} />
        ) : hasProceduralPhenotype ? (
          <FishSilhouette
            bodyShape={ph.bodyShape}
            primaryColor={ph.primaryColor}
            glow={ph.glow}
            rarity={entry.rarity}
            size={56}
          />
        ) : (
          <span style={{ fontSize: '1.2rem', opacity: 0.4 }}>?</span>
        )}
      </div>

      <div className="fdex-card-info">
        <div className="fdex-card-name">{displayName}</div>
        <div className="fdex-card-rarity" style={{ color: rarityColor }}>{entry.rarity}</div>
        <div className="fdex-card-price">🪙 {entry.basePrice}</div>
        {entry.firstDiscoveredAt && (
          <div className="fdex-card-date">
            📅 {new Date(entry.firstDiscoveredAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
          </div>
        )}
        {entry.conservationStatus && (
          <div className="fdex-card-status" title={entry.conservationStatus}>
            {entry.conservationStatus.startsWith('Least') ? '🟢' :
             entry.conservationStatus.startsWith('Near') ? '🟡' :
             entry.conservationStatus.startsWith('Vulnerable') ? '🟠' :
             entry.conservationStatus.startsWith('Endangered') ? '🔴' :
             entry.conservationStatus.startsWith('Critically') ? '🆘' : '⚪'}
          </div>
        )}
      </div>

      {/* Bottom accent line */}
      <div className="fdex-card-accent" style={{ background: rarityColor }} />
    </div>
  );
}

// ── Detail panel with AI lore ──────────────────────────────
function FishdexDetail({ entry, onGenerateLore, isGenerating, aiError }) {
  const rarityColor = RARITY[entry.rarity]?.color || '#888';
  const displayName = entry.aiName || entry.name;
  const ph = entry.phenotype || {};
  const isRealSpecies = entry.visualType === 'species';
  // Only show sprite for procedural fish that have a real phenotype
  const hasProceduralPhenotype = !isRealSpecies && ph.bodyShape && ph.primaryColor;

  const mockFish = isRealSpecies ? {
    id: `fdex-detail-${entry.speciesKey}`,
    stage: 'adult',
    species: { visualType: 'species', key: entry.speciesKey, rarity: entry.rarity },
  } : null;

  const traitRows = hasProceduralPhenotype ? [
    ['Body Shape',       ph.bodyShape],
    ['Primary Color',    ph.primaryColor],
    ['Secondary Color',  ph.secondaryColor],
    ['Fin Type',         ph.finType],
    ['Pattern',          ph.pattern],
    ['Glow',             ph.glow],
    ['Size',             ph.size],
    ['Mutation',         ph.mutation],
  ].filter(([, v]) => v && v !== 'None' && v !== 'Normal') : [];

  const discoveredAt = entry.firstDiscoveredAt
    ? new Date(entry.firstDiscoveredAt).toLocaleDateString()
    : 'Unknown';

  return (
    <div className="fdex-detail">
      <div className="fdex-detail-header" style={{ borderColor: rarityColor }}>
        <div className="fdex-detail-sprite">
          {isRealSpecies ? (
            <FishSprite fish={mockFish} size={72} selected={false} />
          ) : hasProceduralPhenotype ? (
            <FishSilhouette
              bodyShape={ph.bodyShape}
              primaryColor={ph.primaryColor}
              glow={ph.glow}
              rarity={entry.rarity}
              size={72}
            />
          ) : null}
        </div>
        <div className="fdex-detail-title">
          <h3 className="fdex-detail-name">{displayName}</h3>
          {isRealSpecies && entry.scientificName && (
            <div className="fdex-detail-scientific">
              <em>{entry.scientificName}</em>
            </div>
          )}
          {entry.aiName && entry.name !== entry.aiName && (
            <div className="fdex-detail-genetic">Classification: {entry.name}</div>
          )}
          <div className="fdex-detail-rarity" style={{ color: rarityColor }}>
            {entry.rarity.toUpperCase()}
          </div>
          <div className="fdex-detail-price">Base value: 🪙{entry.basePrice}</div>
          <div className="fdex-detail-date">First caught: {discoveredAt}</div>
          {entry.colorVariant && entry.colorVariant !== 'default' && entry.colorVariant !== 'psychedelic' && (
            <div className="fdex-detail-variant">✦ {entry.colorVariant.charAt(0).toUpperCase() + entry.colorVariant.slice(1)} variant</div>
          )}
        </div>
      </div>

      {/* Real species info block */}
      {isRealSpecies && (
        <div className="fdex-real-info">
          {entry.habitat && (
            <div className="fdex-real-row">
              <span className="fdex-real-label">Habitat</span>
              <span className="fdex-real-value">{entry.habitat}</span>
            </div>
          )}
          {entry.conservationStatus && (
            <div className="fdex-real-row">
              <span className="fdex-real-label">Status</span>
              <span className="fdex-real-value">{entry.conservationStatus}</span>
            </div>
          )}
          {entry.funFact && (
            <div className="fdex-funfact">
              <span className="fdex-funfact-icon">💡</span>
              <span>{entry.funFact}</span>
            </div>
          )}
          {entry.lore && !entry.aiLore && (
            <div className="fdex-lore-section">
              <div className="fdex-lore">
                <div className="fdex-lore-label">About</div>
                <p className="fdex-lore-text">{entry.lore}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Lore section */}
      <div className="fdex-lore-section">
        {entry.aiLore ? (
          <div className="fdex-lore">
            <div className="fdex-lore-label">Species Lore</div>
            <p className="fdex-lore-text">{entry.aiLore}</p>
          </div>
        ) : (
          <div className="fdex-lore-empty">
            <p className="fdex-lore-hint">No lore discovered for this species yet.</p>
            <button
              className="btn btn-ai"
              onClick={() => onGenerateLore(entry.name)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><span className="ai-spinner">◌</span> Consulting the Oracle…</>
              ) : (
                <>Generate Species Lore</>
              )}
            </button>
            {aiError && (
              <div className="ai-error-banner">
                {aiError === 'no_key'   && '🔑 Add an Anthropic API key (footer → 🤖 AI Key) to enable AI features'}
                {aiError === 'no_api'   && '🔑 API key rejected — check it\'s correct in the 🤖 AI Key settings'}
                {aiError === 'rate_limit' && '⏳ AI is busy — please wait a moment and try again'}
                {aiError === 'network' && '📡 Could not reach AI — check your connection and retry'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Traits grid — only for procedural fish with real phenotype data */}
      {hasProceduralPhenotype && traitRows.length > 0 && (
        <div className="fdex-traits">
          <div className="fdex-traits-title">Genetic Profile</div>
          <div className="fdex-traits-grid">
            {traitRows.map(([label, value]) => (
              <div key={label} className="fdex-trait-row">
                <span className="fdex-trait-label">{label}</span>
                <span className="fdex-trait-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Breeding hint — how to recreate this species */}
      {hasProceduralPhenotype && traitRows.length >= 2 && (
        <div className="fdex-breed-hint">
          <span className="fdex-breed-hint-icon">DNA</span>
          <span className="fdex-breed-hint-text">
            Breed fish with <strong>{traitRows[0][1]}</strong> + <strong>{traitRows[1][1]}</strong> traits to recreate this species.
            {ph.mutation && ph.mutation !== 'None' && (
              <> Requires <strong>{ph.mutation}</strong> mutation.</>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Fishdex ───────────────────────────────────────────
function Fishdex({ fishdex: _fishdex, onGenerateLore, generatingLoreFor, aiError, legendFishUnlocked }) {
  const fishdex = Array.isArray(_fishdex) ? _fishdex : [];
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');
  const [filterRarity, setFilterRarity] = useState('all');
  const [sortBy, setSortBy]       = useState('date');

  const rarities = ['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'];

  const LEGEND_FISH_ENTRY = {
    name: 'The Leviathan',
    rarity: 'legendary',
    basePrice: 9999,
    phenotype: { bodyShape: 'Eel', primaryColor: 'Violet', glow: 'Ultraviolet', mutation: 'Melanistic' },
    firstDiscoveredAt: 0,
    aiName: null, aiLore: null,
    _isLegendLocked: !legendFishUnlocked,
    _isLegend: true,
  };

  const filtered = useMemo(() => {
    let list = [...(fishdex || [])];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        (e.aiName || e.name).toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        (e.rarity||'').includes(q)
      );
    }
    if (filterRarity !== 'all') list = list.filter(e => (e.rarity||'common') === filterRarity);
    if (sortBy === 'name')   list.sort((a, b) => (a.aiName || a.name).localeCompare(b.aiName || b.name));
    if (sortBy === 'rarity') list.sort((a, b) => (['common','uncommon','rare','epic','legendary'].indexOf(b.rarity)) - (['common','uncommon','rare','epic','legendary'].indexOf(a.rarity)));
    if (sortBy === 'price')  list.sort((a, b) => b.basePrice - a.basePrice);
    if (sortBy === 'date')   list.sort((a, b) => (b.firstDiscoveredAt || 0) - (a.firstDiscoveredAt || 0));
    // Always append the Legend Fish entry at the end (locked or unlocked)
    if (filterRarity === 'all' || filterRarity === 'legendary') {
      if (!list.some(e => e._isLegend)) list.push(LEGEND_FISH_ENTRY);
    }
    return list;
  }, [fishdex, search, filterRarity, sortBy, legendFishUnlocked]);

  const selectedEntry = selected ? fishdex.find(e => e.name === selected) : null;
  const isGenerating = generatingLoreFor === selected;

  const rarityCounts = useMemo(() => {
    const c = { common: 0, uncommon: 0, rare: 0, epic: 0 };
    (fishdex || []).forEach(e => { if (c[e.rarity] !== undefined) c[e.rarity]++; });
    return c;
  }, [fishdex]);

  // Estimated species per rarity (for progress tracking)
  const SPECIES_TARGETS = { common: 15, uncommon: 12, rare: 8, epic: 5, legendary: 3 };
  const totalTarget = Object.values(SPECIES_TARGETS).reduce((a, b) => a + b, 0);
  const totalFound = (fishdex || []).length;
  const isFiltered = search || filterRarity !== 'all';

  // Group entries by rarity for the grouped view
  const groupedByRarity = useMemo(() => {
    const groups = {};
    for (const r of ['common', 'uncommon', 'rare', 'epic', 'legendary']) {
      groups[r] = (fishdex || []).filter(e => e.rarity === r);
    }
    return groups;
  }, [fishdex]);

  return (
    <div className="fishdex-panel">
      {/* Header with progress bar */}
      <div className="fdex-header">
        <div className="fdex-title-row">
          <h2>Fishdex</h2>
          <div className="fdex-count">{totalFound} species discovered</div>
        </div>
        <div className="fdex-progress">
          <div className="fdex-progress-track">
            <div className="fdex-progress-fill" style={{ width: `${Math.min(100, (totalFound / totalTarget) * 100)}%` }} />
          </div>
          <span className="fdex-progress-label">{totalFound}/{totalTarget} ({Math.round((totalFound / totalTarget) * 100)}%)</span>
        </div>
        <div className="fdex-rarity-summary">
          {Object.entries(rarityCounts).map(([r, n]) => (
            <div key={r} className="fdex-rarity-pip" style={{ color: RARITY[r]?.color || '#888' }}>
              <span className="fdex-rarity-num">{n}</span>
              <span className="fdex-rarity-name">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="fdex-filters">
        <input
          className="fdex-search"
          placeholder="🔍 Search species…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="fdex-filter-row">
          <div className="fdex-rarity-filters">
            {rarities.map(r => (
              <button key={r}
                className={`fdex-rarity-btn ${filterRarity === r ? 'active' : ''}`}
                style={{ '--rc': RARITY[r]?.color || '#aaa' }}
                onClick={() => setFilterRarity(r)}>
                {r}
              </button>
            ))}
          </div>
          <select className="fdex-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Latest first</option>
            <option value="rarity">By rarity</option>
            <option value="price">By value</option>
            <option value="name">By name</option>
          </select>
        </div>
      </div>

      {/* Main layout */}
      <div className="fdex-layout">
        {/* Card grid — grouped by rarity when unfiltered */}
        <div className="fdex-grid">
          {filtered.length === 0 ? (
            <div className="fdex-empty">
              {fishdex.length === 0
                ? 'Breed fish to start discovering species!'
                : 'No species match your filter.'}
            </div>
          ) : isFiltered ? (
            /* Flat list when search/filter active */
            filtered.map(entry => (
              <FishdexCard
                key={entry.name}
                entry={entry}
                onClick={() => setSelected(selected === entry.name ? null : entry.name)}
                isSelected={selected === entry.name}
              />
            ))
          ) : (
            /* Grouped by rarity with mystery slots */
            ['common', 'uncommon', 'rare', 'epic', 'legendary'].map(rarity => {
              const entries = groupedByRarity[rarity] || [];
              const target = SPECIES_TARGETS[rarity];
              const remaining = Math.max(0, target - entries.length);
              const rc = RARITY[rarity]?.color || '#888';
              return (
                <div key={rarity} className="fdex-rarity-group">
                  <div className="fdex-rarity-header" style={{ color: rc }}>
                    <span className="fdex-rarity-title">{RARITY[rarity]?.label || rarity}</span>
                    <span className="fdex-rarity-count">{entries.length}/{target}</span>
                    <div className="fdex-rarity-bar">
                      <div className="fdex-rarity-bar-fill" style={{ width: `${Math.min(100, (entries.length / target) * 100)}%`, background: rc }} />
                    </div>
                  </div>
                  <div className="fdex-rarity-cards">
                    {entries.map(entry => (
                      <FishdexCard
                        key={entry.name}
                        entry={entry}
                        onClick={() => setSelected(selected === entry.name ? null : entry.name)}
                        isSelected={selected === entry.name}
                      />
                    ))}
                    {/* Legend fish slot */}
                    {rarity === 'legendary' && !entries.some(e => e._isLegend) && (
                      <FishdexCard
                        entry={LEGEND_FISH_ENTRY}
                        onClick={() => {}}
                        isSelected={false}
                      />
                    )}
                    {/* Mystery slots for undiscovered species */}
                    {Array.from({ length: remaining }, (_, i) => (
                      <div key={`mystery-${rarity}-${i}`} className="fdex-mystery-slot" style={{ '--mc': rc }}>
                        <div className="fdex-mystery-icon">?</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Detail panel */}
        {selectedEntry && (
          <div className="fdex-detail-panel">
            <FishdexDetail
              entry={selectedEntry}
              onGenerateLore={onGenerateLore}
              isGenerating={isGenerating}
              aiError={aiError}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default Fishdex;
