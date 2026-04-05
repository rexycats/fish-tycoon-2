// ============================================================
// FISH TYCOON 2 — SHOP (Phase 7: Customer Walking Animation)
// ============================================================

import React, { useState, useEffect, useRef, memo } from 'react';
import { RARITY } from '../data/genetics.js';

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

function ComingSoonCard({ name, emoji, rarity, teaser }) {
  const rc = { common: '#7ec8a0', uncommon: '#6ab0de', rare: '#b07ee8', epic: '#f0c040' };
  return (
    <div className="supply-card supply-card--locked" title="Coming in a future update">
      <div className="sc-emoji" style={{ filter: 'grayscale(0.8)', opacity: 0.55 }}>{emoji}</div>
      <div className="sc-name" style={{ color: rc[rarity] || '#888' }}>{name}</div>
      <div className="sc-rarity" style={{ color: rc[rarity] || '#888', opacity: 0.7 }}>{rarity}</div>
      <div className="sc-desc" style={{ fontStyle: 'italic', opacity: 0.55 }}>{teaser}</div>
      <div className="sc-coming-soon-badge">Coming Soon</div>
    </div>
  );
}

function UpgradeCard({ id, upgrade, coins, onBuy }) {
  const canAfford = coins >= upgrade.cost;
  const maxed = upgrade.level >= 3;
  return (
    <div className={`upgrade-card ${maxed ? 'maxed' : ''}`}>
      <div className="upgrade-title">{upgrade.label}</div>
      <div className="upgrade-desc">{upgrade.description}</div>
      <div className="upgrade-level">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={`upgrade-pip ${i < upgrade.level ? 'filled' : ''}`} />
        ))}
      </div>
      {maxed ? (
        <div className="upgrade-maxed">MAXED</div>
      ) : (
        <button className="btn btn-sm" disabled={!canAfford} onClick={() => onBuy(id)}
                title={canAfford ? '' : `Need ${upgrade.cost - coins} more coins`}>
          🪙 {upgrade.cost}
        </button>
      )}
    </div>
  );
}

function SaleEvent({ event }) {
  const rc = RC[event.fishRarity] || '#888';
  const ago = Math.round((Date.now() - event.time) / 1000);
  const agoLabel = ago < 60 ? `${ago}s ago` : `${Math.floor(ago / 60)}m ago`;
  const isRejected = event.type === 'rejected';
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

// ── Main Shop component ────────────────────────────────────
function Shop({ game, activeTank, onToggleSell, onSetPrice, onBuyUpgrade, onBuySupply, onBuyFish }) {
  const [shopTab, setShopTab] = useState('sell');
  const [activeCustomer, setActiveCustomer] = useState(null);
  const prevSalesLen = useRef((game.shop.salesHistory || []).length);
  const customerTimer = useRef(null);

  // Detect new sale → trigger customer walk animation
  useEffect(() => {
    const history = game.shop.salesHistory || [];
    if (history.length > prevSalesLen.current) {
      const latest = history[0];
      setActiveCustomer(latest);
      prevSalesLen.current = history.length;
      clearTimeout(customerTimer.current);
      customerTimer.current = setTimeout(() => setActiveCustomer(null), 5000);
    } else {
      prevSalesLen.current = history.length;
    }
    return () => clearTimeout(customerTimer.current);
  }, [game.shop.salesHistory?.length]);

  const { shop, fish, player } = game;
  const tank = activeTank || game.tanks?.[0];
  const listedFish    = shop.listedFish.map(id => fish.find(f => f.id === id)).filter(Boolean);
  const availableFish = fish.filter(f => f.stage === 'adult' && !shop.listedFish.includes(f.id));

  return (
    <div className="shop-panel">
      {/* Animated storefront */}
      <StorefrontSVG activeCustomer={activeCustomer} />

      {/* Shop header */}
      <div className="shop-header">
        <div className="shop-header-left">
          <h2>🏪 Your Aquarium Shop</h2>
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
        {['sell', 'fish', 'upgrades', 'supplies', 'history'].map(t => (
          <button key={t} className={`shop-tab-btn ${shopTab === t ? 'active' : ''}`}
                  onClick={() => setShopTab(t)}>
            {{ sell: '📋 Listings', fish: '🐠 Buy Fish', upgrades: '⬆️ Upgrades', supplies: '🛒 Supplies', history: '📜 Sales Log' }[t]}
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
                const autoPrice = Math.round(f.species.basePrice * (f.health / 100));
                const askPrice  = shop.fishPrices?.[f.id] ?? autoPrice;
                const rc        = RC[f.species.rarity] || '#888';
                const ratio     = askPrice / autoPrice;
                const priceTag  = ratio > 1.4 ? { label: '🔺 Very Pricey', cls: 'price-tag-high' }
                                : ratio > 1.15 ? { label: '↑ Above Market', cls: 'price-tag-above' }
                                : ratio < 0.7  ? { label: '🔻 Bargain', cls: 'price-tag-low' }
                                : ratio < 0.9  ? { label: '↓ Below Market', cls: 'price-tag-below' }
                                : { label: '✓ Fair Price', cls: 'price-tag-fair' };
                return (
                  <div key={f.id} className="listing-card" style={{ '--rc': rc }}>
                    <div className="listing-name">{f.species.name}</div>
                    <div className="listing-rarity" style={{ color: rc }}>{f.species.rarity}</div>
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
                          onClick={() => onSetPrice(f.id, Math.max(1, askPrice - 5))}
                          title="Lower price by 5">−</button>
                        <div className="listing-price-input-wrap">
                          <span className="price-coin">🪙</span>
                          <input
                            type="number"
                            className="listing-price-input"
                            value={askPrice}
                            min={1}
                            max={autoPrice * 10}
                            onClick={e => e.stopPropagation()}
                            onChange={e => {
                              const v = parseInt(e.target.value);
                              if (!isNaN(v) && v >= 1) onSetPrice(f.id, v);
                            }}
                          />
                        </div>
                        <button
                          className="price-adj-btn"
                          onClick={() => onSetPrice(f.id, askPrice + 5)}
                          title="Raise price by 5">+</button>
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

          <div className="section-title mt">Fish Available to List ({availableFish.length})</div>
          <div className="fish-list">
            {availableFish.map(f => {
              const autoPrice = Math.round(f.species.basePrice * (f.health / 100));
              const rc = RC[f.species.rarity] || '#888';
              return (
                <div key={f.id} className="fish-list-item" onClick={e => { e.stopPropagation(); onToggleSell(f.id); }}>
                  <span className="fli-dot" style={{ background: rc }} />
                  <span className="fli-name">{f.species.name}</span>
                  <span className="fli-rarity" style={{ color: rc }}>{f.species.rarity}</span>
                  <span className="fli-ph">
                    {f.phenotype.bodyShape} · {f.phenotype.primaryColor}
                    {f.phenotype.glow !== 'Normal' ? ` · ${f.phenotype.glow}` : ''}
                    {f.phenotype.mutation !== 'None' ? ` · ${f.phenotype.mutation}` : ''}
                  </span>
                  <span className="fli-price">🪙{autoPrice}</span>
                  <button className="btn btn-sm" onClick={e => { e.stopPropagation(); onToggleSell(f.id); }}>List</button>
                </div>
              );
            })}
            {availableFish.length === 0 && (
              <div className="fish-list-empty">No adult fish available to list.</div>
            )}
          </div>
        </div>
      )}

      {shopTab === 'upgrades' && (
        <div className="upgrades-panel">
          <p className="upgrade-hint">Invest your coins to grow your shop and breed better fish faster.</p>
          <div className="upgrades-grid">
            {Object.entries(shop.upgrades || {}).map(([id, upg]) => (
              <UpgradeCard key={id} id={id} upgrade={upg} coins={player.coins} onBuy={onBuyUpgrade} />
            ))}
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
            <ComingSoonCard name="Goldfish" emoji="🟡" rarity="common" teaser="Carassius auratus — classic fancy tail, beginner-friendly, long-lived companion." />
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
              <SupplyCard name="Fish Food"        emoji="🍤" stock={tank.supplies?.food ?? 0}               cost={10} amount={10} coins={player.coins} desc="Reduces hunger for all fish"           onBuy={() => onBuySupply('food',          10, 10)} />
              <SupplyCard name="Water Treatment"  emoji="🧪" stock={tank.supplies?.waterTreatment ?? 0}     cost={25} amount={3}  coins={player.coins} desc="Restore water quality by 35%"         onBuy={() => onBuySupply('waterTreatment', 25, 3)} />
              <SupplyCard name="Medicine"         emoji="💊" stock={tank.supplies?.medicine ?? 0}           cost={40} amount={2}  coins={player.coins} desc="Restores sick fish to full health"     onBuy={() => onBuySupply('medicine',       40, 2)} />
              <SupplyCard name="Breeding Boost"   emoji="💉" stock={tank.supplies?.breedingBoost ?? 0}      cost={60} amount={1}  coins={player.coins} desc="Next breeding takes only 10 seconds"  onBuy={() => onBuySupply('breedingBoost',  60, 1)} />
              <SupplyCard name="Heater Cartridge" emoji="🌡" stock={tank.supplies?.heater ?? 0}             cost={30} amount={2}  coins={player.coins} desc="Nudges temperature 4°F toward 74°F"  onBuy={() => onBuySupply('heater',         30, 2)} />
            </div>
          )}
        </div>
      )}

      {shopTab === 'history' && (
        <div className="history-panel">
          <div className="section-title">Recent Sales</div>
          {(shop.salesHistory || []).length === 0 ? (
            <p className="fish-list-empty">No sales yet. List some fish!</p>
          ) : (
            <div className="sales-list">
              {(shop.salesHistory || []).map((evt, i) => (
                <SaleEvent key={i} event={evt} />
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
  prev.game?.shop         === next.game?.shop         &&
  prev.game?.fish         === next.game?.fish         &&
  prev.game?.player?.coins === next.game?.player?.coins &&
  prev.activeTank         === next.activeTank
);
