import { upgradeCost } from '../data/constants.js';
import { SUPPLIERS, getUnlockedSuppliers, getActiveSupplier } from '../data/suppliers.js';
import { useGameStore } from '../store/gameStore.js';
// ============================================================
// FISH TYCOON 2 — SHOP (Phase 7: Customer Walking Animation)
// ============================================================

import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import RareMarket from './RareMarket.jsx';

const RC = { common: '#5aaa70', uncommon: '#5a9aaa', rare: '#8a70a8', epic: '#b0944a', legendary: '#a06080' };

// ── Storefront customer SVG ────────────────────────────────
function CustomerFigure({ emoji, name, fishName, coins, rarity }) {
  const rc = RC[rarity] || '#5aaa70';
  // Vary customer appearance by name hash
  const hash = name ? name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  const hairColors = ['#3a2820', '#5a3830', '#2a2028', '#8a7040', '#c0a060', '#4a3020'];
  const shirtColors = ['#3a5a80', '#5a3a60', '#3a6050', '#6a4a30', '#4a4a5a', '#605040'];
  const skinTones = ['#f0c090', '#d4a878', '#c49068', '#e8b888', '#b88060', '#f0d0a8'];
  const hairColor = hairColors[hash % hairColors.length];
  const shirtColor = shirtColors[(hash * 3 + 1) % shirtColors.length];
  const skinColor = skinTones[(hash * 7 + 2) % skinTones.length];
  const hasHat = hash % 5 === 0;
  const hasGlasses = hash % 4 === 0;
  return (
    <div className="customer-walk">
      <div className="customer-figure">
        <svg width="32" height="56" viewBox="0 0 32 56" className="customer-body-svg">
          {/* Shadow */}
          <ellipse cx="16" cy="54" rx="10" ry="2" fill="rgba(0,0,0,0.15)" />
          {/* Legs */}
          <rect x="9" y="38" width="6" height="14" rx="2" fill={shirtColor} opacity="0.7" className="leg-l"/>
          <rect x="17" y="38" width="6" height="14" rx="2" fill={shirtColor} opacity="0.7" className="leg-r"/>
          {/* Body */}
          <rect x="7" y="20" width="18" height="20" rx="3" fill={shirtColor}/>
          <rect x="7" y="20" width="18" height="6" rx="2" fill={shirtColor} opacity="0.8"/>
          {/* Arms */}
          <rect x="0" y="22" width="8" height="5" rx="2" fill={shirtColor} className="arm-l"/>
          <rect x="24" y="22" width="8" height="5" rx="2" fill={shirtColor} className="arm-r"/>
          {/* Head */}
          <circle cx="16" cy="12" r="9" fill={skinColor}/>
          {/* Hair */}
          <ellipse cx="16" cy="7" rx="9" ry="5" fill={hairColor}/>
          {/* Eyes */}
          <circle cx="13" cy="12" r="1.2" fill="#1a1a1a"/>
          <circle cx="19" cy="12" r="1.2" fill="#1a1a1a"/>
          {hasGlasses && <circle cx="13" cy="12" r="2.5" fill="none" stroke="#3a3a3a" strokeWidth="0.8"/>}
          {hasGlasses && <circle cx="19" cy="12" r="2.5" fill="none" stroke="#3a3a3a" strokeWidth="0.8"/>}
          {hasGlasses && <line x1="15.5" y1="12" x2="16.5" y2="12" stroke="#3a3a3a" strokeWidth="0.6"/>}
          {/* Mouth */}
          <path d="M14,15 Q16,16.5 18,15" fill="none" stroke="#8a6050" strokeWidth="0.8"/>
          {/* Hat */}
          {hasHat && <rect x="8" y="2" width="16" height="3" rx="1" fill={hairColor}/>}
          {hasHat && <rect x="5" y="5" width="22" height="2" rx="1" fill={hairColor}/>}
        </svg>
      </div>
      <div className="customer-speech">
        <div className="customer-name">{name}</div>
        <div className="customer-bought">Bought <span style={{ color: rc }}>{fishName}</span></div>
        <div className="customer-paid">+{coins}</div>
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
        <rect x="180" y="4" width="240" height="28" rx="6" fill="#0a0e14" stroke="#d4a843" strokeWidth="1.5"/>
        <text x="300" y="22" textAnchor="middle" fill="#d4a843" fontSize="13"
              fontFamily="Cinzel, serif" fontWeight="600">Aquarium Shop</text>
        {/* Windows */}
        <rect x="30"  y="55" width="80" height="35" rx="4" fill="#141820" stroke="#2a3540" strokeWidth="1"/>
        <rect x="490" y="55" width="80" height="35" rx="4" fill="#141820" stroke="#2a3540" strokeWidth="1"/>
        {/* Door */}
        <rect x="250" y="58" width="100" height="32" rx="3" fill="#0c1420" stroke="#2a3540" strokeWidth="1"/>
        <circle cx="345" cy="74" r="3" fill="#d4a843"/>
        {/* Fish in windows */}
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
  slot: '',
  reputation: '',
  capacity:   '',
  breeding: '',
  lighting: '',
  vip:        '',
  hatchery:   '',
  tankSitter: '',
  purifier: '',
  autoMedic: '',
  mutagen:    '',
  insurance:  '',
  fame:       '',
  tempControl:'',
  luckyCharm: '',
  bulkBuyer:  '',
  whisperer:  '',
  genetics:   '',
  service:    '',
  deepSea:    '',
  breedBay: '',
};

function UpgradeCard({ id, upgrade, coins, onBuy }) {
  const maxLevel  = upgrade.maxLevel || 3;
  const maxed     = upgrade.level >= maxLevel;
  const icon      = UPGRADE_ICONS[id] || '';
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
        <span className="sale-rejected-label">Walked away (asked {event.askPrice})</span>
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
        Buy {amount} — {cost}
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
  sell: 'Listings', fish: 'Buy Fish', upgrades: 'Upgrades',
  supplies: 'Supplies', market: 'Market', history: 'Sales Log',
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
              const color = pct > 0 ? '#5aaa70' : pct < 0 ? '#c44040' : '#888';
              return (
                <span key={rarity} className="market-tag" style={{ color }}>
                  {rarity}: {pct > 0 ? '+' : ''}{pct}%
                </span>
              );
            })}
            {game.market.hotTrait && (
              <span className="market-tag market-tag--hot">
                {game.market.hotTrait.label} +{Math.round((game.market.hotTrait.bonus - 1) * 100)}%
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
            <span className="shop-stat-val">{player.totalCoinsEarned || 0}</span>
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
              <span className="pricing-hint-icon"></span>
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
                const ratio     = autoPrice > 0 ? askPrice / autoPrice : 1;
                const priceTag  = ratio > 1.4 ? { label: 'Very Pricey', cls: 'price-tag-high' }
                                : ratio > 1.15 ? { label: 'Above Market', cls: 'price-tag-above' }
                                : ratio < 0.7  ? { label: 'Bargain', cls: 'price-tag-low' }
                                : ratio < 0.9  ? { label: 'Below Market', cls: 'price-tag-below' }
                                : { label: 'Fair Price', cls: 'price-tag-fair' };
                return (
                  <div key={f.id} className="listing-card" style={{ '--rc': rc }}>
                    <div className="listing-name">{f.species?.name || 'Unknown'}</div>
                    <div className="listing-rarity" style={{ color: rc }}>
                      {f.species?.rarity || 'common'}
                      {marketMult > 1.1 && <span className="listing-hot-badge"> +{Math.round((marketMult - 1) * 100)}%</span>}
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
                          aria-label="Lower price">−</button>
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
                          aria-label="Raise price">+</button>
                      </div>
                      <div className="listing-price-meta">
                        <span className="listing-auto-price">Market: 🪙{autoPrice}</span>
                        <span className={`price-tag ${priceTag.cls}`}>{priceTag.label}</span>
                      </div>
                      <button
                        className="btn-reset-price"
                        onClick={() => onSetPrice(f.id, autoPrice)}
                        aria-label="Reset price">Reset to market</button>
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
                  List Selected ({selectedToList.size})
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    const commonUnlisted = availableFish.filter(f => f.species?.rarity === 'common');
                    setSelectedToList(new Set(commonUnlisted.map(f => f.id)));
                  }}
                  aria-label="Select all common"
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
                    View Tank
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

      {shopTab === 'fish' && (() => {
        const reputation = game?.shop?.reputation || 0;
        const unlockedSuppliers = getUnlockedSuppliers(reputation);
        const activeSupplier = getActiveSupplier(game);
        const pool = new Set(activeSupplier.speciesPool);
        const switchSupplier = useGameStore.getState().switchSupplier;
        return (
        <div className="supplies-panel">
          {/* Supplier selector */}
          <div className="supplier-selector">
            <div className="supplier-title">SUPPLIER</div>
            <div className="supplier-tabs">
              {unlockedSuppliers.map(s => (
                <button
                  key={s.id}
                  className={`supplier-tab ${activeSupplier.id === s.id ? 'supplier-tab--active' : ''}`}
                  onClick={() => switchSupplier(s.id)}
                >
                  <span className="supplier-tab-name">{s.name}</span>
                  {s.priceMult > 1 && <span className="supplier-tab-mult">x{s.priceMult}</span>}
                </button>
              ))}
              {SUPPLIERS.filter(s => !unlockedSuppliers.includes(s)).slice(0, 1).map(s => (
                <div key={s.id} className="supplier-tab supplier-tab--locked">
                  {s.name} — Rep {s.unlockRep}
                </div>
              ))}
            </div>
            <div className="supplier-desc">{activeSupplier.desc}</div>
          </div>

          <p className="upgrade-hint">Purchase fish to stock your tanks. Prices vary by supplier.</p>
          <div className="supplies-grid">
            <SupplyCard name="Common Fish"   emoji="" stock="∞" cost={Math.round(50 * activeSupplier.priceMult)}  amount={1} coins={player.coins} desc="A random common fish"            onBuy={() => onBuyFish(Math.round(50 * activeSupplier.priceMult),  'common')}   />
            <SupplyCard name="Uncommon Fish" emoji="" stock="∞" cost={Math.round(150 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="A random uncommon fish with better genetics"   onBuy={() => onBuyFish(Math.round(150 * activeSupplier.priceMult), 'uncommon')} />
            <SupplyCard name="Rare Fish"     emoji="" stock="∞" cost={Math.round(400 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="A rare fish — unusual traits, higher sale price"                onBuy={() => onBuyFish(Math.round(400 * activeSupplier.priceMult), 'rare')}     />
          </div>
          <div className="section-title mt">Species from {activeSupplier.name}</div>
          <p className="upgrade-hint">Iconic fish with fixed markings. Only species stocked by your current supplier are shown.</p>
          <div className="supplies-grid">
            {pool.has('clownfish') && <SupplyCard name="Clownfish"  emoji="" stock="∞" cost={Math.round(200 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Amphiprion ocellaris — vivid orange with 3 white bars." onBuy={() => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, 'clownfish')} />}
            {pool.has('bluetang') && <SupplyCard name="Blue Tang"  emoji="" stock="∞" cost={Math.round(350 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Paracanthurus hepatus — royal blue with bold black stripe." onBuy={() => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, 'bluetang')} />}
            {pool.has('betta') && <SupplyCard name="Betta"      emoji="" stock="∞" cost={Math.round(420 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Betta splendens — flowing crimson veil fins." onBuy={() => onBuyFish(Math.round(420 * activeSupplier.priceMult), null, 'betta')} />}
            {pool.has('angelfish') && <SupplyCard name="Angelfish"  emoji="" stock="∞" cost={Math.round(240 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Pterophyllum scalare — silver with 3 black bars." onBuy={() => onBuyFish(Math.round(240 * activeSupplier.priceMult), null, 'angelfish')} />}
            {pool.has('goldfish') && <SupplyCard name="Goldfish"   emoji="" stock="∞" cost={Math.round(120 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Carassius auratus — fancy twin veil tail, lazy bottom-dweller." onBuy={() => onBuyFish(Math.round(120 * activeSupplier.priceMult), null, 'goldfish')} />}
            {pool.has('mandarin_dragonet') && <SupplyCard name="Mandarin Dragonet" emoji="" stock="∞" cost={Math.round(1500 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Synchiropus splendidus — psychedelic blue-orange maze." onBuy={() => onBuyFish(Math.round(1500 * activeSupplier.priceMult), null, 'mandarin_dragonet')} />}
            {pool.has('neon_tetra') && <SupplyCard name="Neon Tetra" emoji="" stock="∞" cost={Math.round(60 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Paracheirodon innesi — electric blue neon stripe. Best in groups." onBuy={() => onBuyFish(Math.round(60 * activeSupplier.priceMult), null, 'neon_tetra')} />}
            {pool.has('discus') && <SupplyCard name="Discus" emoji="" stock="∞" cost={Math.round(500 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Symphysodon discus — King of the Aquarium." onBuy={() => onBuyFish(Math.round(500 * activeSupplier.priceMult), null, 'discus')} />}
            {pool.has('lionfish') && <SupplyCard name="Lionfish" emoji="" stock="∞" cost={Math.round(600 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Pterois volitans — dramatic venomous beauty." onBuy={() => onBuyFish(Math.round(600 * activeSupplier.priceMult), null, 'lionfish')} />}
            {pool.has('seahorse') && <SupplyCard name="Seahorse" emoji="" stock="∞" cost={Math.round(1000 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Hippocampus kuda — upright swimmer with curled tail." onBuy={() => onBuyFish(Math.round(1000 * activeSupplier.priceMult), null, 'seahorse')} />}
            {pool.has('pufferfish') && <SupplyCard name="Pufferfish" emoji="" stock="∞" cost={Math.round(200 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Tetraodon nigroviridis — round, spiky, full of personality." onBuy={() => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, 'pufferfish')} />}
            {pool.has('jellyfish') && <SupplyCard name="Moon Jellyfish" emoji="" stock="∞" cost={Math.round(450 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Aurelia aurita — translucent pulsing bell." onBuy={() => onBuyFish(Math.round(450 * activeSupplier.priceMult), null, 'jellyfish')} />}
            {pool.has('koi') && <SupplyCard name="Koi" emoji="" stock="∞" cost={Math.round(250 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Cyprinus rubrofuscus — elegant pond royalty." onBuy={() => onBuyFish(Math.round(250 * activeSupplier.priceMult), null, 'koi')} />}
            {pool.has('moorish_idol') && <SupplyCard name="Moorish Idol" emoji="" stock="∞" cost={Math.round(550 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Zanclus cornutus — dramatic black-white-yellow stripes." onBuy={() => onBuyFish(Math.round(550 * activeSupplier.priceMult), null, 'moorish_idol')} />}
            {pool.has('triggerfish') && <SupplyCard name="Triggerfish" emoji="" stock="∞" cost={Math.round(220 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Balistoides conspicillum — angular body, locking dorsal spine." onBuy={() => onBuyFish(Math.round(220 * activeSupplier.priceMult), null, 'triggerfish')} />}
            {pool.has('electric_eel') && <SupplyCard name="Electric Eel" emoji="" stock="∞" cost={Math.round(1100 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Electrophorus electricus — generates 860V." onBuy={() => onBuyFish(Math.round(1100 * activeSupplier.priceMult), null, 'electric_eel')} />}
            {pool.has('axolotl') && <SupplyCard name="Axolotl" emoji="" stock="∞" cost={Math.round(350 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Ambystoma mexicanum — the smiling salamander." onBuy={() => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, 'axolotl')} />}
            {pool.has('cherry_shrimp') && <SupplyCard name="Cherry Shrimp" emoji="" stock="∞" cost={Math.round(40 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Neocaridina davidi — tiny red algae cleaner." onBuy={() => onBuyFish(Math.round(40 * activeSupplier.priceMult), null, 'cherry_shrimp')} />}
            {pool.has('corydoras') && <SupplyCard name="Corydoras" emoji="" stock="∞" cost={Math.round(80 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Corydoras paleatus — armored bottom-feeder." onBuy={() => onBuyFish(Math.round(80 * activeSupplier.priceMult), null, 'corydoras')} />}
            {pool.has('guppy') && <SupplyCard name="Guppy" emoji="" stock="∞" cost={Math.round(30 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Poecilia reticulata — colorful fan tail, breeds prolifically." onBuy={() => onBuyFish(Math.round(30 * activeSupplier.priceMult), null, 'guppy')} />}
            {pool.has('oscar') && <SupplyCard name="Oscar" emoji="" stock="∞" cost={Math.round(300 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Astronotus ocellatus — intelligent, aggressive predator." onBuy={() => onBuyFish(Math.round(300 * activeSupplier.priceMult), null, 'oscar')} />}
            {pool.has('arowana') && <SupplyCard name="Arowana" emoji="" stock="∞" cost={Math.round(2000 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Osteoglossum bicirrhosum — the dragon fish of luck." onBuy={() => onBuyFish(Math.round(2000 * activeSupplier.priceMult), null, 'arowana')} />}
            {pool.has('nautilus') && <SupplyCard name="Nautilus" emoji="" stock="∞" cost={Math.round(800 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Nautilus pompilius — a living fossil." onBuy={() => onBuyFish(Math.round(800 * activeSupplier.priceMult), null, 'nautilus')} />}
            {pool.has('cuttlefish') && <SupplyCard name="Cuttlefish" emoji="" stock="∞" cost={Math.round(900 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Sepia officinalis — master of camouflage." onBuy={() => onBuyFish(Math.round(900 * activeSupplier.priceMult), null, 'cuttlefish')} />}
            {pool.has('hammerhead') && <SupplyCard name="Hammerhead" emoji="" stock="∞" cost={Math.round(3000 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Sphyrna lewini — apex predator with panoramic vision." onBuy={() => onBuyFish(Math.round(3000 * activeSupplier.priceMult), null, 'hammerhead')} />}
            {pool.has('yellow_tang') && <SupplyCard name="Yellow Tang" emoji="" stock="∞" cost={Math.round(280 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Zebrasoma flavescens — brilliant yellow reef cruiser." onBuy={() => onBuyFish(Math.round(280 * activeSupplier.priceMult), null, 'yellow_tang')} />}
            {pool.has('rainbow_fish') && <SupplyCard name="Rainbow Fish" emoji="" stock="∞" cost={Math.round(180 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Iridescent blue-to-orange scales." onBuy={() => onBuyFish(Math.round(180 * activeSupplier.priceMult), null, 'rainbow_fish')} />}
            {pool.has('pleco') && <SupplyCard name="Plecostomus" emoji="" stock="∞" cost={Math.round(60 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Armored algae-eater, keeps glass clean." onBuy={() => onBuyFish(Math.round(60 * activeSupplier.priceMult), null, 'pleco')} />}
            {pool.has('clown_loach') && <SupplyCard name="Clown Loach" emoji="" stock="∞" cost={Math.round(160 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Orange with black bands. Plays dead!" onBuy={() => onBuyFish(Math.round(160 * activeSupplier.priceMult), null, 'clown_loach')} />}
            {pool.has('flame_tetra') && <SupplyCard name="Flame Tetra" emoji="" stock="∞" cost={Math.round(40 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Tiny ember glowing red-orange." onBuy={() => onBuyFish(Math.round(40 * activeSupplier.priceMult), null, 'flame_tetra')} />}
            {pool.has('powder_blue_tang') && <SupplyCard name="Powder Blue Tang" emoji="" stock="∞" cost={Math.round(450 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Electric blue with yellow dorsal." onBuy={() => onBuyFish(Math.round(450 * activeSupplier.priceMult), null, 'powder_blue_tang')} />}
            {pool.has('firemouth_cichlid') && <SupplyCard name="Firemouth Cichlid" emoji="" stock="∞" cost={Math.round(140 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Flares bright red gill plates." onBuy={() => onBuyFish(Math.round(140 * activeSupplier.priceMult), null, 'firemouth_cichlid')} />}
            {pool.has('harlequin_rasbora') && <SupplyCard name="Harlequin Rasbora" emoji="" stock="∞" cost={Math.round(35 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Copper body with black triangle." onBuy={() => onBuyFish(Math.round(35 * activeSupplier.priceMult), null, 'harlequin_rasbora')} />}
            {pool.has('royal_gramma') && <SupplyCard name="Royal Gramma" emoji="" stock="∞" cost={Math.round(380 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Half purple, half gold beauty." onBuy={() => onBuyFish(Math.round(380 * activeSupplier.priceMult), null, 'royal_gramma')} />}
            {pool.has('cardinal_tetra') && <SupplyCard name="Cardinal Tetra" emoji="" stock="∞" cost={Math.round(45 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Full-body red and blue stripes." onBuy={() => onBuyFish(Math.round(45 * activeSupplier.priceMult), null, 'cardinal_tetra')} />}
            {pool.has('dwarf_gourami') && <SupplyCard name="Dwarf Gourami" emoji="" stock="∞" cost={Math.round(130 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Blue-red striped labyrinth fish." onBuy={() => onBuyFish(Math.round(130 * activeSupplier.priceMult), null, 'dwarf_gourami')} />}
            {pool.has('banggai_cardinal') && <SupplyCard name="Banggai Cardinalfish" emoji="" stock="∞" cost={Math.round(350 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Silver with bold black bars." onBuy={() => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, 'banggai_cardinal')} />}
            {pool.has('leopard_wrasse') && <SupplyCard name="Leopard Wrasse" emoji="" stock="∞" cost={Math.round(420 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Shifting leopard-like spots." onBuy={() => onBuyFish(Math.round(420 * activeSupplier.priceMult), null, 'leopard_wrasse')} />}
            {pool.has('garden_eel') && <SupplyCard name="Garden Eel" emoji="" stock="∞" cost={Math.round(200 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Sways like underwater grass." onBuy={() => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, 'garden_eel')} />}
            {pool.has('flame_angel') && <SupplyCard name="Flame Angelfish" emoji="" stock="∞" cost={Math.round(500 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Brilliant red-orange, blue-tipped." onBuy={() => onBuyFish(Math.round(500 * activeSupplier.priceMult), null, 'flame_angel')} />}
            {pool.has('emerald_crab') && <SupplyCard name="Emerald Crab" emoji="" stock="∞" cost={Math.round(55 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Tiny green algae destroyer." onBuy={() => onBuyFish(Math.round(55 * activeSupplier.priceMult), null, 'emerald_crab')} />}
            {pool.has('regal_tang') && <SupplyCard name="Regal Tang" emoji="" stock="∞" cost={Math.round(400 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Bright blue, palette-yellow tail." onBuy={() => onBuyFish(Math.round(400 * activeSupplier.priceMult), null, 'regal_tang')} />}
            {pool.has('peacock_mantis') && <SupplyCard name="Peacock Mantis Shrimp" emoji="" stock="∞" cost={Math.round(800 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Bullet-speed punches, 16 color channels." onBuy={() => onBuyFish(Math.round(800 * activeSupplier.priceMult), null, 'peacock_mantis')} />}
            {pool.has('blue_chromis') && <SupplyCard name="Blue Chromis" emoji="" stock="∞" cost={Math.round(50 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Shimmering blue schooling fish." onBuy={() => onBuyFish(Math.round(50 * activeSupplier.priceMult), null, 'blue_chromis')} />}
            {pool.has('dragon_goby') && <SupplyCard name="Dragon Goby" emoji="" stock="∞" cost={Math.round(170 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Prehistoric eel-shaped with tiny fangs." onBuy={() => onBuyFish(Math.round(170 * activeSupplier.priceMult), null, 'dragon_goby')} />}
            {pool.has('spotted_boxfish') && <SupplyCard name="Spotted Boxfish" emoji="" stock="∞" cost={Math.round(220 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Boxy body covered in white dots." onBuy={() => onBuyFish(Math.round(220 * activeSupplier.priceMult), null, 'spotted_boxfish')} />}
            {pool.has('sea_apple') && <SupplyCard name="Sea Apple" emoji="" stock="∞" cost={Math.round(350 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Vivid purple filter-feeding cucumber." onBuy={() => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, 'sea_apple')} />}
            {pool.has('wolf_eel') && <SupplyCard name="Wolf Eel" emoji="" stock="∞" cost={Math.round(900 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Fierce-looking fish that mates for life." onBuy={() => onBuyFish(Math.round(900 * activeSupplier.priceMult), null, 'wolf_eel')} />}
            {pool.has('sunburst_anthias') && <SupplyCard name="Sunburst Anthias" emoji="" stock="∞" cost={Math.round(1200 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Blazing orange-pink, extremely rare." onBuy={() => onBuyFish(Math.round(1200 * activeSupplier.priceMult), null, 'sunburst_anthias')} />}
            {pool.has('frogfish') && <SupplyCard name="Frogfish" emoji="" stock="∞" cost={Math.round(700 * activeSupplier.priceMult)} amount={1} coins={player.coins} desc="Master of disguise with built-in lure." onBuy={() => onBuyFish(Math.round(700 * activeSupplier.priceMult), null, 'frogfish')} />}
          </div>
        </div>
        );
      })()}

      {shopTab === 'supplies' && (
        <div className="supplies-panel">
          <p className="upgrade-hint">Buy supplies to keep your fish healthy and your water clean.</p>
          {!tank ? (
            <p className="fish-list-empty">No tank selected.</p>
          ) : (
            <div className="supplies-grid">
              <SupplyCard name="Fish Food"          emoji="" stock={tank.supplies?.food ?? 0}               cost={10} amount={10} coins={player.coins} desc="Reduces hunger for all fish"                          onBuy={() => onBuySupply('food',             10, 10)} />
              <SupplyCard name="Water Treatment"    emoji="" stock={tank.supplies?.waterTreatment ?? 0}     cost={25} amount={3}  coins={player.coins} desc="Restore water quality by 35 pts (~5h of decay)"                       onBuy={() => onBuySupply('waterTreatment',   25,  3)} />
              <SupplyCard name="Antibiotic"         emoji="" stock={tank.supplies?.antibiotic ?? 0}         cost={35} amount={2}  coins={player.coins} desc="Cures Ich and Fin Rot (bacterial infections)"        onBuy={() => onBuySupply('antibiotic',       35,  2)} />
              <SupplyCard name="Antiparasitic"      emoji="" stock={tank.supplies?.antiparasitic ?? 0}      cost={50} amount={2}  coins={player.coins} desc="Cures Velvet (parasitic infection)"                  onBuy={() => onBuySupply('antiparasitic',    50,  2)} />
              <SupplyCard name="Digestive Remedy"   emoji="" stock={tank.supplies?.digestiveRemedy ?? 0}    cost={30} amount={2}  coins={player.coins} desc="Cures Bloat (digestive illness)"                    onBuy={() => onBuySupply('digestiveRemedy',  30,  2)} />
              <SupplyCard name="Breeding Boost"     emoji="" stock={tank.supplies?.breedingBoost ?? 0}      cost={60} amount={1}  coins={player.coins} desc="Next breeding takes only 10 seconds"                 onBuy={() => onBuySupply('breedingBoost',    60,  1)} />
              <SupplyCard name="Diagnostic Kit"     emoji="" stock={tank.supplies?.diagnosticKit ?? 0}     cost={25} amount={2}  coins={player.coins} desc="Instantly identify an unknown illness during incubation"  onBuy={() => onBuySupply('diagnosticKit',    25,  2)} />
              <SupplyCard name="Vitamins"            emoji="" stock={tank.supplies?.vitamins ?? 0}          cost={40} amount={2}  coins={player.coins} desc="10 minutes of disease immunity for one fish"              onBuy={() => onBuySupply('vitamins',          40,  2)} />
              <SupplyCard name="Heater Cartridge"   emoji="" stock={tank.supplies?.heater ?? 0}             cost={30} amount={2}  coins={player.coins} desc="Nudges temperature 4°F toward 74°F"                 onBuy={() => onBuySupply('heater',           30,  2)} />
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
