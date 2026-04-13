import { upgradeCost } from '../data/constants.js';
// ============================================================
// FISH TYCOON 2 — SHOP (Phase 7: Customer Walking Animation)
// ============================================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import RareMarket from './RareMarket.jsx';

const RC = { common: '#7ec8a0', uncommon: '#6ab0de', rare: '#b07ee8', epic: '#f0c040', legendary: '#ff7eb3' };

// ── Storefront customer SVG ────────────────────────────────
function CustomerFigure({ emoji, name, fishName, coins, rarity }) {
  const rc = RC[rarity] || '#7ec8a0';
  return (
    <div className="customer-walk">
      <div className="customer-figure">
        <div className="customer-emoji-bubble">{emoji}</div>
        <svg width="32" height="52" viewBox="0 0 32 52" className="customer-body-svg">
          {/* Head */}
          <circle cx="16" cy="10" r="9" fill="#f0c090"/>
          {/* Body */}
          <rect x="8" y="20" width="16" height="20" rx="3" fill="#4070c0"/>
          {/* Legs */}
          <rect x="8"  y="38" width="7" height="14" rx="2" fill="#304880" className="leg-l"/>
          <rect x="17" y="38" width="7" height="14" rx="2" fill="#304880" className="leg-r"/>
          {/* Arms */}
          <rect x="0"  y="22" width="9" height="5" rx="2" fill="#4070c0"/>
          <rect x="23" y="22" width="9" height="5" rx="2" fill="#4070c0"/>
        </svg>
      </div>
      <div className="customer-speech">
        <div className="customer-name">{name}</div>
        <div className="customer-bought">Bought <span style={{ color: rc }}>{fishName}</span></div>
        <div className="customer-paid">+🪙{coins}</div>
      </div>
    </div>
  );
}

// ── Storefront SVG header ──────────────────────────────────
function StorefrontSVG({ activeCustomer }) {
  return (
    <div className="shop-storefront">
      <svg className="storefront-svg" viewBox="0 0 600 90" preserveAspectRatio="xMidYMid meet">
        {/* Building facade */}
        <rect x="0" y="20" width="600" height="70" fill="#1a2840" rx="4"/>
        {/* Awning */}
        <path d="M0,20 L600,20 L600,50 L0,50 Z" fill="#1e5090"/>
        {/* Awning stripes */}
        {[0,1,2,3,4,5,6,7,8,9].map(i => (
          <rect key={i} x={i*68} y="20" width="30" height="30" fill="#1a4070" opacity="0.5"/>
        ))}
        {/* Awning fringe */}
        {Array.from({length: 20}).map((_,i) => (
          <path key={i} d={`M${i*32},50 Q${i*32+16},62 ${i*32+32},50`}
                fill="none" stroke="#2a70c0" strokeWidth="2"/>
        ))}
        {/* Sign */}
        <rect x="180" y="4" width="240" height="28" rx="6" fill="#0a1828" stroke="#d4a830" strokeWidth="1.5"/>
        <text x="300" y="22" textAnchor="middle" fill="#d4a830" fontSize="13"
              fontFamily="Cinzel, serif" fontWeight="600">🐠 Aquarium Shop</text>
        {/* Windows */}
        <rect x="30"  y="55" width="80" height="35" rx="4" fill="#0e3060" stroke="#2a5090" strokeWidth="1"/>
        <rect x="490" y="55" width="80" height="35" rx="4" fill="#0e3060" stroke="#2a5090" strokeWidth="1"/>
        {/* Door */}
        <rect x="250" y="58" width="100" height="32" rx="3" fill="#0c2448" stroke="#2a5090" strokeWidth="1"/>
        <circle cx="345" cy="74" r="3" fill="#d4a830"/>
        {/* Fish in windows */}
        <text x="70"  y="77" textAnchor="middle" fontSize="18">🐠</text>
        <text x="530" y="77" textAnchor="middle" fontSize="18">🐡</text>
      </svg>

      {/* Animated customer */}
      {activeCustomer && (
        <CustomerFigure
          emoji={activeCustomer.customerEmoji}
          name={activeCustomer.customerName}
          fishName={activeCustomer.fishName}
          coins={activeCustomer.coins}
          rarity={activeCustomer.fishRarity}
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────
function ReputationBar({ rep }) {
  const max = 999;
  const pct = (rep / max) * 100;
  const tier = rep < 100 ? 'Local Shop' : rep < 300 ? 'Known Store' : rep < 600 ? 'Popular Aquarium' : 'Famous Emporium';
  return (
    <div className="rep-bar-wrap">
      <div className="rep-bar-header">
        <span className="rep-label">Reputation: {tier}</span>
        <span className="rep-num">{rep} / {max}</span>
      </div>
      <div className="rep-bar">
        <div className="rep-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ComingSoonCard was removed (Bug 9: defined but never used anywhere in the tree)

const UPGRADE_ICONS = {
  slot:       '🪟',
  reputation: '📢',
  capacity:   '🐠',
  breeding:   '⚡',
  lighting:   '💡',
  vip:        '💎',
  hatchery:   '🥚',
  tankSitter: '🌙',
  purifier:   '💧',
  autoMedic:  '🩺',
  mutagen:    '🧬',
  insurance:  '🛡️',
  fame:       '⭐',
  tempControl:'🌡️',
  luckyCharm: '🍀',
  bulkBuyer:  '📦',
  whisperer:  '🐟',
  genetics:   '🔬',
  service:    '🤝',
  deepSea:    '🌊',
  breedBay:   '🧫',
};

function UpgradeCard({ id, upgrade, coins, onBuy }) {
  const maxLevel  = upgrade.maxLevel || 3;
  const maxed     = upgrade.level >= maxLevel;
  const icon      = UPGRADE_ICONS[id] || '⬆️';
  // Actual cost matches the store's formula: baseCost * 1.6^level
  const actualCost = upgradeCost(upgrade.cost, upgrade.level);
  const canAfford  = coins >= actualCost;
  const nextCost   = !maxed && upgrade.level + 1 < maxLevel
    ? upgradeCost(upgrade.cost, upgrade.level + 1)
    : null;
  return (
    <div className={`upgrade-card ${maxed ? 'maxed' : ''}`}>
      <div className="upgrade-title">{icon} {upgrade.label}</div>
      <div className="upgrade-desc">{upgrade.description}</div>
      <div className="upgrade-level">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <span key={i} className={`upgrade-pip ${i < upgrade.level ? 'filled' : ''}`} />
        ))}
      </div>
      <div className="upgrade-tier-label">Level {upgrade.level} / {maxLevel}</div>
      {maxed ? (
        <div className="upgrade-maxed">MAXED</div>
      ) : (
        <>
          <button className="btn btn-sm" disabled={!canAfford} onClick={() => onBuy(id)}
                  title={canAfford ? '' : `Need ${actualCost - coins} more coins`}>
            🪙 {actualCost}
          </button>
          {nextCost && (
            <div className="upgrade-next-cost">Next: 🪙{nextCost}</div>
          )}
        </>
      )}
    </div>
  );
}

function SaleEvent({ event }) {
  const rc = RC[event.fishRarity] || '#888';
  const isRejected = event.type === 'rejected';

  // Bug 6: compute ago at render time AND keep it live with a 10-second interval
  // so the label doesn't freeze at the value from when the History tab was opened.
  const getAgo = () => {
    const secs = Math.round((Date.now() - event.time) / 1000);
    return secs < 60 ? `${secs}s ago` : `${Math.floor(secs / 60)}m ago`;
  };
  const [agoLabel, setAgoLabel] = useState(getAgo);
  useEffect(() => {
    const id = setInterval(() => setAgoLabel(getAgo()), 10_000);
    return () => clearInterval(id);
  }, [event.time]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={`sale-event ${isRejected ? 'sale-rejected' : ''}`}>
      <span className="sale-emoji">{event.customerEmoji}</span>
      <div className="sale-info">
        <span className="sale-customer">{event.customerName}</span>
        <span className="sale-fish" style={{ color: isRejected ? '#888' : rc }}>{event.fishName}</span>
      </div>
      {isRejected ? (
        <span className="sale-rejected-label">❌ Walked away (asked 🪙{event.askPrice})</span>
      ) : (
        <span className="sale-coins">+🪙{event.coins}</span>
      )}
      <span className="sale-ago">{agoLabel}</span>
    </div>
  );
}

function SupplyCard({ name, emoji, stock, cost, amount, coins, desc, onBuy }) {
  const canAfford = coins >= cost;
  return (
    <div className="supply-card">
      <div className="supply-emoji">{emoji}</div>
      <div className="supply-name">{name}</div>
      <div className="supply-desc">{desc}</div>
      <div className="supply-stock">In stock: {stock}</div>
      <button className="btn btn-sm" disabled={!canAfford} onClick={onBuy}>
        Buy {amount} — 🪙{cost}
      </button>
    </div>
  );
}

// Bug 10: local draft-string input so the user can clear the field and retype
// without it snapping back. Game state is committed on blur or on any keystroke
// that already produces a valid integer ≥ 1 (so +/- buttons still feel instant).
function PriceInput({ value, max, onCommit }) {
  const [draft, setDraft] = useState(String(value));

  // Keep draft in sync when the external value changes (e.g. Reset to market).
  useEffect(() => { setDraft(String(value)); }, [value]);

  const commit = (raw) => {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 1) onCommit(Math.min(v, max));
    else setDraft(String(value)); // revert on empty / invalid on blur
  };

  return (
    <input
      type="number"
      className="listing-price-input"
      value={draft}
      min={1}
      max={max}
      onClick={e => e.stopPropagation()}
      onChange={e => {
        setDraft(e.target.value);
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v >= 1) onCommit(Math.min(v, max));
      }}
      onBlur={e => commit(e.target.value)}
    />
  );
}

// Bug 8: these were declared inside Shop() and re-created on every render.
// Hoisting to module scope makes them true constants — zero allocation cost.
const ALL_SHOP_TABS = ['sell', 'fish', 'upgrades', 'supplies', 'market', 'history'];
const TAB_LABELS = {
  sell: '📋 Listings', fish: '🐠 Buy Fish', upgrades: '⬆️ Upgrades',
  supplies: '🛒 Supplies', market: '🌟 Market', history: '📜 Sales Log',
};

// ── Main Shop component ────────────────────────────────────
// Tiny debounce helper — avoids importing a full library for one use
function useDebounced(fn, delayMs) {
  const timerRef = useRef(null);
  return useCallback((...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fn(...args), delayMs);
  }, [fn]); // eslint-disable-line react-hooks/exhaustive-deps
}

function Shop({ game, activeTank, onToggleSell, onSetPrice, onBuyUpgrade, onBuySupply, onBuyFish, onBuyRareItem, onNavigate }) {
  // Debounce +/− button clicks so rapid clicking doesn't fire dozens of setGame
  // calls per second. PriceInput text entry still commits on every valid keystroke
  // (intentional — felt snappy in testing), but button presses are batched.
  const debouncedSetPrice = useDebounced(onSetPrice, 80);
  const [shopTab, setShopTab] = useState('sell');
  
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [selectedToList, setSelectedToList] = useState(new Set());
  // Bug 2: initialise to current length so re-mounting the Shop tab (after switching
  // away and back) doesn't replay the last historical sale as a new animation.
  const prevSalesLen  = useRef((game.shop.salesHistory || []).length);
  const customerTimer = useRef(null);

  // Unmount-only cleanup so the 5-second display window isn't cancelled mid-animation.
  // Bug 2: previously the cleanup ran on every salesHistory change, killing the timer
  // immediately after it was set.
  useEffect(() => () => clearTimeout(customerTimer.current), []);

  // Detect new sale and trigger the customer walk animation.
  useEffect(() => {
    const history = game.shop.salesHistory || [];
    if (history.length > prevSalesLen.current) {
      const latest = history[history.length - 1];
      setActiveCustomer(latest);
      prevSalesLen.current = history.length;
      clearTimeout(customerTimer.current);
      customerTimer.current = setTimeout(() => setActiveCustomer(null), 5000);
    } else {
      prevSalesLen.current = history.length;
    }
  }, [game.shop.salesHistory?.length]);

  const { shop, fish, player, tanks } = game;
  const tank = activeTank || game.tanks?.[0];
  const listedFish    = (shop.listedFish || []).map(id => fish.find(f => f.id === id)).filter(Boolean);
  const availableFish = (fish || []).filter(f => f.stage === 'adult' && !(shop.listedFish || []).includes(f.id));

  return (
    <div className="shop-panel">
      {/* Animated storefront */}
      <StorefrontSVG activeCustomer={activeCustomer} />

      {/* Daily market ticker */}
      {game.market?.headline && (
        <div className="market-ticker">
          <div className="market-ticker-headline">{game.market.headline}</div>
          <div className="market-ticker-tags">
            {Object.entries(game.market.modifiers || {}).map(([rarity, mult]) => {
              const pct = Math.round((mult - 1) * 100);
              const color = pct > 0 ? '#7ec8a0' : pct < 0 ? '#ff7070' : '#888';
              return (
                <span key={rarity} className="market-tag" style={{ color }}>
                  {rarity}: {pct > 0 ? '+' : ''}{pct}%
                </span>
              );
            })}
            {game.market.hotTrait && (
              <span className="market-tag market-tag--hot">
                🔥 {game.market.hotTrait.label} +{Math.round((game.market.hotTrait.bonus - 1) * 100)}%
              </span>
            )}
          </div>
        </div>
      )}

      {/* Shop header */}
      <div className="shop-header">
        <div className="shop-header-left">
          <h2>Your Aquarium Shop</h2>
          <ReputationBar rep={shop.reputation || 0} />
        </div>
        <div className="shop-header-right">
          <div className="shop-stat">
            <span className="shop-stat-val">{listedFish.length}/{shop.slots}</span>
            <span className="shop-stat-label">Slots Used</span>
          </div>
          <div className="shop-stat">
            <span className="shop-stat-val">🪙{player.totalCoinsEarned || 0}</span>
            <span className="shop-stat-label">Total Earned</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="shop-tabs">
        {ALL_SHOP_TABS.map(t => (
          <button key={t} className={`shop-tab-btn ${shopTab === t ? 'active' : ''}`}
                  onClick={() => setShopTab(t)}>
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Sell tab */}
      {shopTab === 'sell' && (
        <div className="shop-sell">
          <div className="listings-section">
            <div className="section-title">
              Active Listings
              <span className="section-subtitle"> — set your ask price per fish</span>
            </div>
            <div className="pricing-hint">
              <span className="pricing-hint-icon">💡</span>
              Price too high? Customers walk away. Price fair? They buy. Hagglers may negotiate.
            </div>
            <div className="listings-grid">
              {listedFish.map(f => {
                const lightingBonus = 1 + (shop.upgrades?.lighting?.level || 0) * 0.10;
                const fishTank1  = tanks?.find(t => t.id === f.tankId);
                const tankBonus1 = fishTank1?.type === 'display' ? 1.1 : 1;
                const happBonus1 = 1 + ((fishTank1?.happiness ?? 100) / 100) * 0.2;
                // Market multiplier: daily fluctuation + hot trait bonus
                const mkt = game.market || {};
                let marketMult = mkt.modifiers?.[f.species?.rarity || 'common'] || 1.0;
                if (mkt.hotTrait && f.phenotype?.[mkt.hotTrait.gene] === mkt.hotTrait.value) {
                  marketMult *= mkt.hotTrait.bonus;
                }
                const autoPrice = Math.round((f.species?.basePrice ?? 10) * (f.health / 100) * happBonus1 * tankBonus1 * lightingBonus * marketMult);
                const askPrice  = shop.fishPrices?.[f.id] ?? autoPrice;
                const rc        = RC[f.species?.rarity] || '#888';
                const ratio     = askPrice / autoPrice;
                const priceTag  = ratio > 1.4 ? { label: '🔺 Very Pricey', cls: 'price-tag-high' }
                                : ratio > 1.15 ? { label: '↑ Above Market', cls: 'price-tag-above' }
                                : ratio < 0.7  ? { label: '🔻 Bargain', cls: 'price-tag-low' }
                                : ratio < 0.9  ? { label: '↓ Below Market', cls: 'price-tag-below' }
                                : { label: '✓ Fair Price', cls: 'price-tag-fair' };
                return (
                  <div key={f.id} className="listing-card" style={{ '--rc': rc }}>
                    <div className="listing-name">{f.species?.name || 'Unknown'}</div>
                    <div className="listing-rarity" style={{ color: rc }}>
                      {f.species?.rarity || 'common'}
                      {marketMult > 1.1 && <span className="listing-hot-badge"> 🔥 +{Math.round((marketMult - 1) * 100)}%</span>}
                    </div>
                    <div className="listing-health">
                      <div className="listing-health-bar">
                        <div style={{ width: `${f.health}%`, height: '100%', background: '#5dbe8a', borderRadius: 2 }} />
                      </div>
                      <span>{Math.round(f.health)}%</span>
                    </div>

                    {/* ── Price control ── */}
                    <div className="listing-price-section">
                      <label className="listing-price-label">Ask Price</label>
                      <div className="listing-price-row">
                        <button
                          className="price-adj-btn"
                          onClick={() => debouncedSetPrice(f.id, Math.max(1, Math.round(askPrice - Math.max(1, Math.round(askPrice * 0.05)))))}
                          title="Lower price by 5%">−</button>
                        <div className="listing-price-input-wrap">
                          <span className="price-coin">🪙</span>
                          {/* Bug 10: was a fully controlled input — parseInt('') = NaN caused
                              the guard to skip the update, snapping the field back to the old
                              value and making it impossible to clear and retype from scratch.
                              Now uses a local draft string; game state is only updated on blur
                              (or when the typed value is already a valid integer ≥ 1). */}
                          <PriceInput
                            value={askPrice}
                            max={autoPrice * 10}
                            onCommit={v => onSetPrice(f.id, v)}
                          />
                        </div>
                        <button
                          className="price-adj-btn"
                          onClick={() => debouncedSetPrice(f.id, Math.round(askPrice + Math.max(1, Math.round(askPrice * 0.05))))}
                          title="Raise price by 5%">+</button>
                      </div>
                      <div className="listing-price-meta">
                        <span className="listing-auto-price">Market: 🪙{autoPrice}</span>
                        <span className={`price-tag ${priceTag.cls}`}>{priceTag.label}</span>
                      </div>
                      <button
                        className="btn-reset-price"
                        onClick={() => onSetPrice(f.id, autoPrice)}
                        title="Reset to market price">Reset to market</button>
                    </div>

                    <button className="btn btn-sm btn-warn" onClick={() => onToggleSell(f.id)}>Delist</button>
                  </div>
                );
              })}
              {Array.from({ length: Math.max(0, shop.slots - listedFish.length) }).map((_, i) => (
                <div key={i} className="listing-card empty">
                  <span className="listing-empty-label">Empty Slot</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-title mt">
            Fish Available to List ({availableFish.length})
            {availableFish.length > 0 && (
              <div className="bulk-list-actions">
                <button
                  className="btn btn-sm"
                  disabled={selectedToList.size === 0 || listedFish.length >= shop.slots}
                  onClick={() => {
                    const slotsLeft = shop.slots - listedFish.length;
                    let listed = 0;
                    for (const id of selectedToList) {
                      if (listed >= slotsLeft) break;
                      onToggleSell(id);
                      listed++;
                    }
                    setSelectedToList(new Set());
                  }}
                  title={selectedToList.size === 0 ? 'Select fish below first' : `List ${Math.min(selectedToList.size, shop.slots - listedFish.length)} selected`}
                >
                  📋 List Selected ({selectedToList.size})
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    const commonUnlisted = availableFish.filter(f => f.species?.rarity === 'common');
                    setSelectedToList(new Set(commonUnlisted.map(f => f.id)));
                  }}
                  title="Select all common fish"
                >
                  Select Commons
                </button>
                {selectedToList.size > 0 && (
                  <button className="btn btn-sm" onClick={() => setSelectedToList(new Set())}>
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="fish-list">
            {availableFish.map(f => {
              const lightingBonus = 1 + (shop.upgrades?.lighting?.level || 0) * 0.10;
              const fishTank2  = tanks?.find(t => t.id === f.tankId);
              const tankBonus2 = fishTank2?.type === 'display' ? 1.1 : 1;
              const happBonus2 = 1 + ((fishTank2?.happiness ?? 100) / 100) * 0.2;
              const autoPrice = Math.round((f.species?.basePrice ?? 10) * (f.health / 100) * happBonus2 * tankBonus2 * lightingBonus);
              const rc = RC[f.species?.rarity] || '#888';
              const isChecked = selectedToList.has(f.id);
              return (
                <div key={f.id} className={`fish-list-item ${isChecked ? 'fish-list-item--selected' : ''}`}
                  onClick={e => { e.stopPropagation(); setSelectedToList(prev => { const s = new Set(prev); s.has(f.id) ? s.delete(f.id) : s.add(f.id); return s; }); }}>
                  <input
                    type="checkbox"
                    className="fli-checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    onClick={e => e.stopPropagation()}
                  />
                  <span className="fli-dot" style={{ background: rc }} />
                  <span className="fli-name">{f.species?.name || 'Unknown'}</span>
                  <span className="fli-rarity" style={{ color: rc }}>{f.species?.rarity || 'common'}</span>
                  <span className="fli-ph">
                    {f.phenotype?.bodyShape} · {f.phenotype?.primaryColor}
                    {f.phenotype?.glow && f.phenotype.glow !== 'Normal' ? ` · ${f.phenotype.glow}` : ''}
                    {f.phenotype?.mutation && f.phenotype.mutation !== 'None' ? ` · ${f.phenotype.mutation}` : ''}
                  </span>
                  <span className="fli-price">🪙{autoPrice}</span>
                  <button className="btn btn-sm" onClick={e => {
                    e.stopPropagation();
                    onToggleSell(f.id);
                    // Bug 4: clear this fish from the selection set so the
                    // "List Selected (N)" badge count stays accurate.
                    setSelectedToList(prev => { const s = new Set(prev); s.delete(f.id); return s; });
                  }}>List</button>
                </div>
              );
            })}
            {availableFish.length === 0 && (
              <div className="fish-list-empty">
                No adult fish available to list.
                {onNavigate && (
                  <button className="btn btn-sm" style={{ marginTop: '8px', display: 'block' }} onClick={() => onNavigate('tank')}>
                    🐠 View Tank
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {shopTab === 'upgrades' && (
        <div className="upgrades-panel">
          <p className="upgrade-hint">Invest your coins to grow your shop and breed better fish faster. Core upgrades now go to level 7 — and four advanced tiers await high-rollers.</p>

          <div className="section-title" style={{ marginBottom: '0.5rem' }}>Core Upgrades</div>
          <div className="upgrades-grid">
            {['slot', 'reputation', 'capacity', 'breeding'].map(id => {
              const upg = shop.upgrades?.[id];
              return upg ? <UpgradeCard key={id} id={id} upgrade={upg} coins={player.coins} onBuy={onBuyUpgrade} /> : null;
            })}
          </div>

          <div className="section-title" style={{ margin: '1rem 0 0.5rem' }}>Advanced Upgrades</div>
          <div className="upgrades-grid">
            {['lighting', 'vip', 'hatchery', 'tankSitter'].map(id => {
              const upg = shop.upgrades?.[id];
              return upg ? <UpgradeCard key={id} id={id} upgrade={upg} coins={player.coins} onBuy={onBuyUpgrade} /> : null;
            })}
          </div>

          <div className="section-title" style={{ margin: '1rem 0 0.5rem' }}>Expert Upgrades</div>
          <div className="upgrades-grid">
            {['purifier', 'autoMedic', 'mutagen', 'insurance', 'fame', 'tempControl', 'luckyCharm', 'bulkBuyer', 'whisperer', 'genetics', 'service', 'deepSea', 'breedBay'].map(id => {
              const upg = shop.upgrades?.[id];
              return upg ? <UpgradeCard key={id} id={id} upgrade={upg} coins={player.coins} onBuy={onBuyUpgrade} /> : null;
            })}
          </div>
        </div>
      )}

      {shopTab === 'fish' && (
        <div className="supplies-panel">
          <p className="upgrade-hint">Purchase fish to stock your tanks. Each fish is added directly to your active tank.</p>
          <div className="supplies-grid">
            <SupplyCard name="Common Fish"   emoji="🐟" stock="∞" cost={50}  amount={1} coins={player.coins} desc="A random common fish — good for building up stock"            onBuy={() => onBuyFish(50,  'common')}   />
            <SupplyCard name="Uncommon Fish" emoji="🐠" stock="∞" cost={150} amount={1} coins={player.coins} desc="A random uncommon fish with better genetics and higher value"   onBuy={() => onBuyFish(150, 'uncommon')} />
            <SupplyCard name="Rare Fish"     emoji="🌟" stock="∞" cost={400} amount={1} coins={player.coins} desc="A rare fish — unusual traits, higher sale price"                onBuy={() => onBuyFish(400, 'rare')}     />
          </div>
          <div className="section-title mt">🐠 Real Species</div>
          <p className="upgrade-hint">Iconic fish with fixed markings and species-specific behaviour in the tank.</p>
          <div className="supplies-grid">
            <SupplyCard name="Clownfish"  emoji="🤿" stock="∞" cost={200} amount={1} coins={player.coins} desc="Amphiprion ocellaris — vivid orange with 3 white bars. Darts near the bottom." onBuy={() => onBuyFish(200, null, 'clownfish')} />
            <SupplyCard name="Blue Tang"  emoji="🐟" stock="∞" cost={350} amount={1} coins={player.coins} desc="Paracanthurus hepatus — royal blue with bold black stripe and yellow tail. Sweeps the full tank." onBuy={() => onBuyFish(350, null, 'bluetang')} />
            <SupplyCard name="Betta"      emoji="🐠" stock="∞" cost={420} amount={1} coins={player.coins} desc="Betta splendens — flowing crimson veil fins with teal iridescent sheen. A regal, solitary drifter." onBuy={() => onBuyFish(420, null, 'betta')} />
            <SupplyCard name="Angelfish"  emoji="🪸" stock="∞" cost={240} amount={1} coins={player.coins} desc="Pterophyllum scalare — silver with 3 black bars and trailing dorsal filaments. A stately vertical swimmer." onBuy={() => onBuyFish(240, null, 'angelfish')} />
            <SupplyCard name="Goldfish"   emoji="🟡" stock="∞" cost={120} amount={1} coins={player.coins} desc="Carassius auratus — fancy twin veil tail, lazy bottom-dweller. May spawn in kohaku, calico or black moor variants." onBuy={() => onBuyFish(120, null, 'goldfish')} />
            <SupplyCard name="Mandarin Dragonet" emoji="🌈" stock="∞" cost={1500} amount={1} coins={player.coins} desc="Synchiropus splendidus — psychedelic blue-orange maze pattern. The rarest and most striking fish in the ocean." onBuy={() => onBuyFish(1500, null, 'mandarin_dragonet')} />
            <SupplyCard name="Neon Tetra"   emoji="💎" stock="∞" cost={60}   amount={1} coins={player.coins} desc="Paracheirodon innesi — tiny torpedo with an electric blue neon stripe. Best in groups." onBuy={() => onBuyFish(60, null, 'neon_tetra')} />
            <SupplyCard name="Discus"       emoji="🔴" stock="∞" cost={500}  amount={1} coins={player.coins} desc="Symphysodon discus — the King of the Aquarium. A stunning disc-shaped cichlid with vivid striping." onBuy={() => onBuyFish(500, null, 'discus')} />
            <SupplyCard name="Lionfish"     emoji="🦁" stock="∞" cost={600}  amount={1} coins={player.coins} desc="Pterois volitans — dramatic venomous beauty with radiating fan-like fin spines. Handle with care." onBuy={() => onBuyFish(600, null, 'lionfish')} />
            <SupplyCard name="Seahorse"     emoji="🐴" stock="∞" cost={1000} amount={1} coins={player.coins} desc="Hippocampus kuda — an upright swimmer with a curled prehensile tail. Males carry the young." onBuy={() => onBuyFish(1000, null, 'seahorse')} />
            <SupplyCard name="Pufferfish"   emoji="🐡" stock="∞" cost={200}  amount={1} coins={player.coins} desc="Tetraodon nigroviridis — round, spiky, and full of personality. Blinks its eyes!" onBuy={() => onBuyFish(200, null, 'pufferfish')} />
            <SupplyCard name="Moon Jellyfish" emoji="🪼" stock="∞" cost={450} amount={1} coins={player.coins} desc="Aurelia aurita — translucent pulsing bell with trailing tentacles. 500 million years of evolution." onBuy={() => onBuyFish(450, null, 'jellyfish')} />
            <SupplyCard name="Koi"          emoji="🎏" stock="∞" cost={250}  amount={1} coins={player.coins} desc="Cyprinus rubrofuscus — elegant pond royalty with vivid patches. Tancho, Showa, and Ogon variants." onBuy={() => onBuyFish(250, null, 'koi')} />
            <SupplyCard name="Moorish Idol" emoji="🏛️" stock="∞" cost={550}  amount={1} coins={player.coins} desc="Zanclus cornutus — dramatic black-white-yellow stripes with a trailing dorsal filament." onBuy={() => onBuyFish(550, null, 'moorish_idol')} />
            <SupplyCard name="Triggerfish"  emoji="🔫" stock="∞" cost={220}  amount={1} coins={player.coins} desc="Balistoides conspicillum — angular body, locking dorsal spine, vibrant blue patterns." onBuy={() => onBuyFish(220, null, 'triggerfish')} />
            <SupplyCard name="Electric Eel" emoji="⚡" stock="∞" cost={1100} amount={1} coins={player.coins} desc="Electrophorus electricus — generates 860V. Animated electric glow spots pulse along its body." onBuy={() => onBuyFish(1100, null, 'electric_eel')} />
            <SupplyCard name="Axolotl"      emoji="🦎" stock="∞" cost={400}  amount={1} coins={player.coins} desc="Ambystoma mexicanum — the smiling salamander with feathery gills. Can regenerate limbs!" onBuy={() => onBuyFish(400, null, 'axolotl')} />
            <SupplyCard name="Yellow Tang"   emoji="💛" stock="∞" cost={300}  amount={1} coins={player.coins} desc="Zebrasoma flavescens — a living splash of sunshine. Solid yellow with a retractable tail scalpel." onBuy={() => onBuyFish(300, null, 'yellow_tang')} />
            <SupplyCard name="Arowana"       emoji="🐉" stock="∞" cost={2500} amount={1} coins={player.coins} desc="Scleropages formosus — the dragon fish. Symbol of luck and prosperity. Premium collector's fish." onBuy={() => onBuyFish(2500, null, 'arowana')} />
            <SupplyCard name="Cherry Shrimp" emoji="🦐" stock="∞" cost={35}   amount={1} coins={player.coins} desc="Neocaridina davidi — tiny red cleanup crew. Grazes algae, breeds fast, sits on plants." onBuy={() => onBuyFish(35, null, 'cherry_shrimp')} />
            <SupplyCard name="Oscar"         emoji="🐗" stock="∞" cost={200}  amount={1} coins={player.coins} desc="Astronotus ocellatus — big, bold, full of personality. The puppy dog of fishkeeping." onBuy={() => onBuyFish(200, null, 'oscar')} />
            <SupplyCard name="Guppy"         emoji="🌈" stock="∞" cost={30}   amount={1} coins={player.coins} desc="Poecilia reticulata — the million fish. Cheap, colorful fan tail, breeds prolifically." onBuy={() => onBuyFish(30, null, 'guppy')} />
            <SupplyCard name="Cuttlefish"    emoji="🦑" stock="∞" cost={750}  amount={1} coins={player.coins} desc="Sepia officinalis — master of disguise. Changes color in milliseconds. Three hearts, W-shaped eyes." onBuy={() => onBuyFish(750, null, 'cuttlefish')} />
            <SupplyCard name="Corydoras"     emoji="🐱" stock="∞" cost={45}   amount={1} coins={player.coins} desc="Corydoras paleatus — armored catfish janitor. Scoots along the sand vacuuming up scraps." onBuy={() => onBuyFish(45, null, 'corydoras')} />
            <SupplyCard name="Hammerhead"    emoji="🔨" stock="∞" cost={1800} amount={1} coins={player.coins} desc="Sphyrna lewini — 360° binocular vision. A prestige predator that commands respect." onBuy={() => onBuyFish(1800, null, 'hammerhead')} />
            <SupplyCard name="Nautilus"      emoji="🐚" stock="∞" cost={600}  amount={1} coins={player.coins} desc="Nautilus pompilius — 500-million-year-old living fossil. Spiral shell, 90 tentacles, no suckers." onBuy={() => onBuyFish(600, null, 'nautilus')} />
          </div>
        </div>
      )}

      {shopTab === 'supplies' && (
        <div className="supplies-panel">
          <p className="upgrade-hint">Buy supplies to keep your fish healthy and your water clean.</p>
          {!tank ? (
            <p className="fish-list-empty">No tank selected.</p>
          ) : (
            <div className="supplies-grid">
              <SupplyCard name="Fish Food"          emoji="🍤" stock={tank.supplies?.food ?? 0}               cost={10} amount={10} coins={player.coins} desc="Reduces hunger for all fish"                          onBuy={() => onBuySupply('food',             10, 10)} />
              <SupplyCard name="Water Treatment"    emoji="🧪" stock={tank.supplies?.waterTreatment ?? 0}     cost={25} amount={3}  coins={player.coins} desc="Restore water quality by 35 pts (~5h of decay)"                       onBuy={() => onBuySupply('waterTreatment',   25,  3)} />
              <SupplyCard name="Antibiotic"         emoji="💊" stock={tank.supplies?.antibiotic ?? 0}         cost={35} amount={2}  coins={player.coins} desc="Cures Ich and Fin Rot (bacterial infections)"        onBuy={() => onBuySupply('antibiotic',       35,  2)} />
              <SupplyCard name="Antiparasitic"      emoji="🔬" stock={tank.supplies?.antiparasitic ?? 0}      cost={50} amount={2}  coins={player.coins} desc="Cures Velvet (parasitic infection)"                  onBuy={() => onBuySupply('antiparasitic',    50,  2)} />
              <SupplyCard name="Digestive Remedy"   emoji="🟡" stock={tank.supplies?.digestiveRemedy ?? 0}    cost={30} amount={2}  coins={player.coins} desc="Cures Bloat (digestive illness)"                    onBuy={() => onBuySupply('digestiveRemedy',  30,  2)} />
              <SupplyCard name="Breeding Boost"     emoji="💉" stock={tank.supplies?.breedingBoost ?? 0}      cost={60} amount={1}  coins={player.coins} desc="Next breeding takes only 10 seconds"                 onBuy={() => onBuySupply('breedingBoost',    60,  1)} />
              <SupplyCard name="Diagnostic Kit"     emoji="🔬" stock={tank.supplies?.diagnosticKit ?? 0}     cost={25} amount={2}  coins={player.coins} desc="Instantly identify an unknown illness during incubation"  onBuy={() => onBuySupply('diagnosticKit',    25,  2)} />
              <SupplyCard name="Vitamins"            emoji="💊" stock={tank.supplies?.vitamins ?? 0}          cost={40} amount={2}  coins={player.coins} desc="10 minutes of disease immunity for one fish"              onBuy={() => onBuySupply('vitamins',          40,  2)} />
              <SupplyCard name="Heater Cartridge"   emoji="🌡" stock={tank.supplies?.heater ?? 0}             cost={30} amount={2}  coins={player.coins} desc="Nudges temperature 4°F toward 74°F"                 onBuy={() => onBuySupply('heater',           30,  2)} />
            </div>
          )}
        </div>
      )}

      {shopTab === 'market' && (
        <RareMarket game={game} activeTank={activeTank} onBuyRareItem={onBuyRareItem} />
      )}

      {shopTab === 'history' && (
        <div className="history-panel">
          <div className="section-title">Recent Sales</div>
          {(shop.salesHistory || []).length === 0 ? (
            <p className="fish-list-empty">
              No sales yet.{' '}
              <button className="btn btn-sm" style={{ marginTop: '6px', display: 'inline-block' }} onClick={() => setShopTab('sell')}>
                List some fish →
              </button>
            </p>
          ) : (
            <div className="sales-list">
              {(shop.salesHistory || []).map((evt) => (
                // Bug 7: was key={i} — when salesHistory is trimmed to 20 entries
                // every existing key shifts by one, causing React to reuse wrong nodes.
                // Composite of time + fishName is stable and unique in practice.
                <SaleEvent key={`${evt.time}-${evt.fishName}`} event={evt} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Shop is only open on its own tab — memo ensures it doesn't re-render
// on every game tick while the player is looking at the tank view.
export default memo(Shop, (prev, next) =>
  prev.game?.shop          === next.game?.shop          &&
  prev.game?.fish          === next.game?.fish          &&
  prev.game?.tanks         === next.game?.tanks         &&
  prev.game?.player?.coins  === next.game?.player?.coins  &&
  prev.game?.player?.boosts === next.game?.player?.boosts &&
  prev.game?.rareMarket    === next.game?.rareMarket    &&
  prev.activeTank          === next.activeTank
);
