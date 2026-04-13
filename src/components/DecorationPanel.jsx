// ============================================================
// FISH TYCOON 2 — DECORATION PANEL
// Buy, place, move and remove tank decorations
// ============================================================

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DECOR_CATALOG, DECOR_CATEGORIES, getDecorById, TANK_THEMES } from '../data/decorations.js';

const CAT_ORDER = ['substrate', 'plant', 'rock', 'coral', 'structure', 'special'];

// ── Tiny SVG preview for a tank theme card ──────────────────
function ThemePreview({ theme, size = 120 }) {
  const gradId = `tpg-${theme.id}`;
  return (
    <svg width={size} height={Math.round(size * 0.55)} viewBox="0 0 120 66"
         style={{ display: 'block', borderRadius: '6px 6px 0 0' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          {theme.waterGradient.map((s, i) => (
            <stop key={i} offset={s.offset} stopColor={s.color} stopOpacity={s.opacity}/>
          ))}
        </linearGradient>
      </defs>
      <rect width="120" height="66" fill={`url(#${gradId})`}/>
      <g dangerouslySetInnerHTML={{ __html: theme.bgSvgFn() }}
         transform="scale(0.15) translate(0, 0)"
         style={{ transformOrigin: '0 0' }}/>
      <rect x="0" y="54" width="120" height="12" fill="#7a5828" opacity="0.8"/>
      <rect x="0" y="58" width="120" height="8" fill="#9a7840" opacity="0.6"/>
    </svg>
  );
}

// ── Tiny SVG preview for the shop card ──────────────────────
function DecorPreview({ decor, size = 80 }) {
  // Center the decoration in a small preview box
  const cx = size / 2;
  const cy = size * 0.82;
  const scale = size / 120;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
         style={{ display: 'block' }}>
      <rect width={size} height={size} fill="#0a1828" rx="6"/>
      <g dangerouslySetInnerHTML={{ __html: decor.svgFn(cx, cy, scale * decor.defaultScale) }} />
    </svg>
  );
}

// ── Tank canvas with placed decorations ─────────────────────
function DecorationCanvas({ tank, activeTankFish, onPlace, onRemove, selectedDecorType, placingScale }) {
  const svgRef = useRef(null);
  const placed = tank.decorations?.placed || [];

  const handleCanvasClick = useCallback((e) => {
    if (!selectedDecorType) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    // Convert click to SVG 800×400 coordinate space
    const x = ((e.clientX - rect.left) / rect.width)  * 800;
    const y = ((e.clientY - rect.top)  / rect.height) * 400;
    onPlace(selectedDecorType, x, y, placingScale);
  }, [selectedDecorType, placingScale, onPlace]);

  return (
    <div className="decor-canvas-wrap">
      {selectedDecorType && (
        <div className="decor-placing-hint">
          Click anywhere in the tank to place · <strong>ESC</strong> to cancel
        </div>
      )}
      <svg
        ref={svgRef}
        className={`decor-canvas-svg ${selectedDecorType ? 'placing-mode' : ''}`}
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleCanvasClick}
      >
        {/* Water background */}
        <rect width="800" height="400" fill="#0e3a6e"/>
        <rect width="800" height="400" fill="url(#decor-water-grad)"/>
        <defs>
          <linearGradient id="decor-water-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1060a0" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#040e1a" stopOpacity="0.6"/>
          </linearGradient>
        </defs>

        {/* Sand floor */}
        <ellipse cx="400" cy="415" rx="450" ry="55" fill="#8a6830"/>
        <ellipse cx="400" cy="408" rx="440" ry="38" fill="#b88a50"/>

        {/* Placed decorations — rendered in order */}
        {placed.map((item) => {
          const decor = getDecorById(item.type);
          if (!decor) return null;
          return (
            <g key={item.instanceId}
               className="decor-placed-item"
               onClick={(e) => { if (!selectedDecorType) { e.stopPropagation(); onRemove(item.instanceId); }}}>
              <g dangerouslySetInnerHTML={{ __html: decor.svgFn(item.x, item.y, item.scale) }} />
              {!selectedDecorType && (
                <circle cx={item.x} cy={item.y - 60} r="10" fill="#e04040" opacity="0"
                        className="decor-remove-btn"/>
              )}
            </g>
          );
        })}

        {/* Fish silhouettes (simple placeholders) */}
        {activeTankFish?.slice(0, 8).map((f, i) => {
          const x = 80 + (i % 4) * 170;
          const y = 150 + Math.floor(i / 4) * 90;
          return (
            <ellipse key={f.id} cx={x} cy={y} rx="22" ry="12"
                     fill="#60a0d0" opacity="0.3"/>
          );
        })}

        {/* Water surface shimmer */}
        <rect width="800" height="8" fill="rgba(180,220,255,0.12)"/>
        {[0,1,2,3,4].map(i => (
          <path key={i} d={`M${i*200},4 Q${i*200+100},0 ${i*200+200},4`}
                fill="none" stroke="rgba(200,235,255,0.3)" strokeWidth="2"/>
        ))}

        {/* Placing cursor preview */}
        {selectedDecorType && (
          <text x="400" y="200" textAnchor="middle" fill="rgba(255,255,255,0.3)"
                fontSize="14" fontFamily="sans-serif">Click to place decoration</text>
        )}
      </svg>
    </div>
  );
}

// ── Shop card for a single decoration ────────────────────────
function DecorShopCard({ decor, owned, coins, onBuy, onSelectPlace, isSelected }) {
  const canAfford = coins >= decor.cost;
  const inStock = (owned || 0) > 0;

  return (
    <div className={`decor-shop-card ${isSelected ? 'decor-selected' : ''} ${inStock ? 'in-stock' : ''}`}
         onClick={() => inStock && onSelectPlace(decor.id)}>
      <div className="decor-preview-wrap">
        <DecorPreview decor={decor} size={72} />
        {inStock && <div className="decor-stock-badge">×{owned}</div>}
        {isSelected && <div className="decor-placing-badge">PLACING</div>}
      </div>
      <div className="decor-card-info">
        <div className="decor-card-name">{decor.label}</div>
        <div className="decor-card-desc">{decor.desc}</div>
        <div className="decor-card-actions">
          {decor.cost === 0 ? (
            <span className="decor-free-label">Free</span>
          ) : (
            <button
              className="btn btn-sm"
              disabled={!canAfford}
              onClick={e => { e.stopPropagation(); onBuy(decor.id); }}
              title={canAfford ? `Buy 1 for 🪙${decor.cost}` : `Need ${decor.cost - coins} more coins`}
            >
              🪙{decor.cost}
            </button>
          )}
          {inStock && (
            <button
              className={`btn btn-sm ${isSelected ? 'btn-warn' : 'btn-place'}`}
              onClick={e => { e.stopPropagation(); onSelectPlace(isSelected ? null : decor.id); }}
            >
              {isSelected ? '✕ Cancel' : '📍 Place'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Placed item list ──────────────────────────────────────────
function PlacedItemRow({ item, onRemove }) {
  const decor = getDecorById(item.type);
  if (!decor) return null;
  return (
    <div className="placed-item-row">
      <DecorPreview decor={decor} size={36} />
      <span className="placed-item-name">{decor.label}</span>
      <span className="placed-item-pos">({Math.round(item.x)}, {Math.round(item.y)})</span>
      <button className="btn btn-sm btn-warn" onClick={() => onRemove(item.instanceId)}>
        🗑 Remove
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
function DecorationPanel({ game, activeTank, onBuyDecor, onPlaceDecor, onRemoveDecor, unlockedDecorations = [], onClaimUnlockedDecor, onBuyTheme, onApplyTheme }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDecorType, setSelectedDecorType]  = useState(null);
  const [placingScale, setPlacingScale] = useState(1.0);
  const [subTab, setSubTab] = useState('themes'); // 'themes' | 'shop' | 'placed' | 'awards'

  const { player } = game;
  const owned = activeTank?.decorations?.owned || {};
  const placed = activeTank?.decorations?.placed || [];

  // Split catalog: shop items vs achievement-exclusive items
  const shopCatalog = DECOR_CATALOG.filter(d => !d.achievementLocked);
  const achievementCatalog = DECOR_CATALOG.filter(d => d.achievementLocked);

  const catalogFiltered = activeCategory === 'all'
    ? shopCatalog
    : shopCatalog.filter(d => d.category === activeCategory);

  const handleSelectPlace = (id) => {
    setSelectedDecorType(prev => prev === id ? null : id);
  };

  const handlePlace = (type, x, y, scale) => {
    onPlaceDecor(activeTank.id, type, x, y, scale);
    const decor = getDecorById(type);
    if (decor?.category === 'substrate') setSelectedDecorType(null);
  };

  // ESC cancels placing mode from anywhere on the page — not just when the panel div is focused
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSelectedDecorType(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="decor-panel">
      <div className="decor-header">
        <h2>Tank Decorations</h2>
        {activeTank && (
          <span className="decor-tank-name">Decorating: {activeTank.name}</span>
        )}
      </div>

      {/* Canvas preview */}
      <DecorationCanvas
        tank={activeTank || { decorations: { placed: [] } }}
        activeTankFish={game.fish.filter(f => f.tankId === activeTank?.id)}
        onPlace={handlePlace}
        onRemove={(instanceId) => onRemoveDecor(activeTank.id, instanceId)}
        selectedDecorType={selectedDecorType}
        placingScale={placingScale}
      />

      {/* Scale slider (shown when placing) */}
      {selectedDecorType && (
        <div className="decor-scale-row">
          <span className="decor-scale-label">Size</span>
          <input
            type="range" min="0.5" max="2.0" step="0.1"
            value={placingScale}
            onChange={e => setPlacingScale(parseFloat(e.target.value))}
            className="decor-scale-slider"
          />
          <span className="decor-scale-val">{placingScale.toFixed(1)}×</span>
          <button className="btn btn-sm btn-warn" onClick={() => setSelectedDecorType(null)}>Cancel</button>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="decor-subtabs">
        <button className={`decor-subtab ${subTab==='themes'?'active':''}`} onClick={() => setSubTab('themes')}>
          🎨 Themes
        </button>
        <button className={`decor-subtab ${subTab==='shop'?'active':''}`} onClick={() => setSubTab('shop')}>
          🛒 Decorations
        </button>
        <button className={`decor-subtab ${subTab==='placed'?'active':''}`} onClick={() => setSubTab('placed')}>
          📋 Placed ({placed.length})
        </button>
        <button className={`decor-subtab ${subTab==='awards'?'active':''}`} onClick={() => setSubTab('awards')}>
          🏆 Awards {unlockedDecorations.length > 0 ? `(${unlockedDecorations.length})` : ''}
        </button>
      </div>

      {subTab === 'themes' && (
        <div className="decor-themes-grid">
          {TANK_THEMES.map(theme => {
            const ownedThemes = activeTank?.themes?.owned || ['tropical'];
            const activeThemeId = activeTank?.themes?.active || 'tropical';
            const isOwned    = ownedThemes.includes(theme.id);
            const isActive   = activeThemeId === theme.id;
            const canAfford  = player.coins >= theme.cost;
            return (
              <div key={theme.id} className={`decor-theme-card ${isActive ? 'theme-active' : ''} ${isOwned ? 'theme-owned' : ''}`}>
                <div className="decor-theme-preview-wrap">
                  <ThemePreview theme={theme} size={160} />
                  {isActive && <div className="theme-active-badge">✓ Active</div>}
                </div>
                <div className="decor-theme-info">
                  <div className="decor-theme-name">{theme.emoji} {theme.label}</div>
                  <div className="decor-card-desc">{theme.desc}</div>
                  <div className="decor-card-actions">
                    {isOwned ? (
                      isActive ? (
                        <span className="decor-free-label">Applied</span>
                      ) : (
                        <button
                          className="btn btn-sm btn-place"
                          onClick={() => activeTank && onApplyTheme && onApplyTheme(activeTank.id, theme.id)}
                        >
                          🎨 Apply
                        </button>
                      )
                    ) : (
                      <button
                        className="btn btn-sm"
                        disabled={!canAfford}
                        title={canAfford ? `Buy for 🪙${theme.cost}` : `Need ${theme.cost - player.coins} more coins`}
                        onClick={() => activeTank && onBuyTheme && onBuyTheme(activeTank.id, theme.id)}
                      >
                        🪙{theme.cost}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {subTab === 'shop' && (
        <>
          {/* Category filter */}
          <div className="decor-categories">
            <button className={`decor-cat-btn ${activeCategory==='all'?'active':''}`}
                    onClick={() => setActiveCategory('all')}>All</button>
            {CAT_ORDER.map(cat => (
              <button key={cat}
                      className={`decor-cat-btn ${activeCategory===cat?'active':''}`}
                      onClick={() => setActiveCategory(cat)}>
                {DECOR_CATEGORIES[cat].emoji} {DECOR_CATEGORIES[cat].label}
              </button>
            ))}
          </div>

          {/* Shop grid */}
          <div className="decor-shop-grid">
            {catalogFiltered.map(decor => (
              <DecorShopCard
                key={decor.id}
                decor={decor}
                owned={owned[decor.id] || 0}
                coins={player.coins}
                onBuy={onBuyDecor}
                onSelectPlace={handleSelectPlace}
                isSelected={selectedDecorType === decor.id}
              />
            ))}
          </div>
        </>
      )}

      {subTab === 'placed' && (
        <div className="placed-items-list">
          {placed.length === 0 ? (
            <p className="decor-empty">No decorations placed yet. Buy some and click 📍 Place!</p>
          ) : (
            placed.map(item => (
              <PlacedItemRow
                key={item.instanceId}
                item={item}
                onRemove={(id) => onRemoveDecor(activeTank.id, id)}
              />
            ))
          )}
        </div>
      )}

      {subTab === 'awards' && (
        <div className="decor-awards-list">
          {achievementCatalog.length === 0 ? (
            <p className="decor-empty">No award decorations exist yet.</p>
          ) : (
            achievementCatalog.map(decor => {
              const isUnlocked = unlockedDecorations.includes(decor.id);
              const isClaimed  = (owned[decor.id] || 0) > 0;
              return (
                <div key={decor.id} className={`decor-award-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="decor-preview-wrap">
                    <DecorPreview decor={decor} size={72} />
                    {!isUnlocked && <div className="decor-locked-overlay">🔒</div>}
                    {isClaimed && <div className="decor-stock-badge">In Tank</div>}
                  </div>
                  <div className="decor-card-info">
                    <div className="decor-card-name">{decor.label}</div>
                    <div className="decor-card-desc">{decor.desc}</div>
                    <div className="decor-achievement-badge">
                      🏆 {decor.achievementLabel}
                    </div>
                    <div className="decor-card-actions" style={{ marginTop: 6 }}>
                      {isUnlocked ? (
                        isClaimed ? (
                          <button
                            className="btn btn-sm btn-place"
                            onClick={() => handleSelectPlace(decor.id)}
                          >
                            {selectedDecorType === decor.id ? '✕ Cancel' : '📍 Place'}
                          </button>
                        ) : (
                          <button
                            className="decor-claim-btn"
                            onClick={() => { onClaimUnlockedDecor(decor.id); }}
                          >
                            ✨ Add to Inventory
                          </button>
                        )
                      ) : (
                        <span className="decor-locked-hint">
                          Earn the <em>{decor.achievementLabel}</em> achievement to unlock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
export default DecorationPanel;
