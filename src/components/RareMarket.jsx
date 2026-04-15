// ============================================================
// FISH TYCOON 2 — RARE MARKET v2
// Traveling Merchant with rotating daily inventory:
//   - Mystery eggs (gambling)
//   - Exotic fish (instant rare species)
//   - Supply bundles & boosters
//   - Daily deal (one item at 40% off)
//   - Reputation-gated premium tier
// ============================================================

import React, { useState, useEffect, useMemo } from 'react';

// ── Traveling Merchants ────────────────────────────────────
const MERCHANTS = [
  { id: 'pearl',  name: 'Pearl the Diver',        emoji: '', greeting: '"Fresh from the deep! You won\'t find these at any pet store."', specialty: 'fish' },
  { id: 'bones',  name: 'Old Bones McGill',       emoji: '', greeting: '"Arr... I\'ve got somethin\' special today, if ye\'ve got the coin."', specialty: 'eggs' },
  { id: 'flora',  name: 'Dr. Flora Chen',          emoji: '', greeting: '"I\'ve been running some fascinating experiments. Care to see the results?"', specialty: 'booster' },
  { id: 'kai',    name: 'Kai the Reef Runner',     emoji: '', greeting: '"Bro! Check out what washed up on the reef this morning!"', specialty: 'supplies' },
  { id: 'madame', name: 'Madame Coraline',         emoji: '', greeting: '"The tides whisper of rare creatures today... shall we see?"', specialty: 'eggs' },
  { id: 'jin',    name: 'Captain Jin',             emoji: '', greeting: '"Direct from the eastern trade routes. Premium stock only."', specialty: 'fish' },
];

// ── Mystery Eggs ───────────────────────────────────────────
const MYSTERY_EGGS = [
  {
    id: 'egg_common', emoji: '', label: 'Common Clutch',
    type: 'egg', tag: 'Mystery Egg',
    tagColor: 'rgba(126,200,160,0.15)', tagBorder: 'rgba(126,200,160,0.4)', tagText: '#5aaa70',
    desc: 'A clutch of 2 eggs. Mostly common species, but you might get lucky.',
    cost: 50, limit: 3,
    eggCount: 2, rarityWeights: { common: 70, uncommon: 25, rare: 5 },
  },
  {
    id: 'egg_exotic', emoji: '', label: 'Exotic Egg',
    type: 'egg', tag: 'Mystery Egg',
    tagColor: 'rgba(106,176,222,0.15)', tagBorder: 'rgba(106,176,222,0.4)', tagText: '#5a9aaa',
    desc: 'A single egg from an exotic source. High chance of uncommon or rare.',
    cost: 150, limit: 2,
    eggCount: 1, rarityWeights: { common: 15, uncommon: 50, rare: 30, epic: 5 },
  },
  {
    id: 'egg_legendary', emoji: '', label: 'Primordial Egg',
    type: 'egg', tag: 'Legendary Gamble',
    tagColor: 'rgba(255,126,179,0.15)', tagBorder: 'rgba(255,126,179,0.4)', tagText: '#a06080',
    desc: 'Recovered from the abyss. Could be anything — including something extraordinary.',
    cost: 500, limit: 1, minRep: 25,
    eggCount: 1, rarityWeights: { uncommon: 20, rare: 45, epic: 30, legendary: 5 },
  },
];

// ── Exotic Fish (direct purchase) ──────────────────────────
const EXOTIC_FISH = [
  {
    id: 'fish_uncommon_1',
    emoji: '',
    label: 'Uncommon Specimen',
    type: 'fish',
    tag: 'Exotic Fish',
    tagColor: 'rgba(106,176,222,0.15)',
    tagBorder: 'rgba(106,176,222,0.4)',
    tagText: '#5a9aaa',
    desc: 'A healthy adult of uncommon lineage. Ready to sell or breed.',
    cost: 120,
    limit: 1,
    targetRarity: 'uncommon',
  },
  {
    id: 'fish_uncommon_2',
    emoji: '',
    label: 'Unusual Catch',
    type: 'fish',
    tag: 'Exotic Fish',
    tagColor: 'rgba(106,176,222,0.15)',
    tagBorder: 'rgba(106,176,222,0.4)',
    tagText: '#5a9aaa',
    desc: 'Caught by a traveling fisherman. Uncommon traits guaranteed.',
    cost: 130,
    limit: 1,
    targetRarity: 'uncommon',
  },
  {
    id: 'fish_rare_1',
    emoji: '',
    label: 'Rare Import',
    type: 'fish',
    tag: 'Rare Fish',
    tagColor: 'rgba(176,126,232,0.15)',
    tagBorder: 'rgba(176,126,232,0.4)',
    tagText: '#8a70a8',
    desc: 'Imported from overseas. Guaranteed rare species.',
    cost: 350,
    limit: 1,
    targetRarity: 'rare',
  },
  {
    id: 'fish_rare_2',
    emoji: '',
    label: 'Deep-Sea Rarity',
    type: 'fish',
    tag: 'Rare Fish',
    tagColor: 'rgba(176,126,232,0.15)',
    tagBorder: 'rgba(176,126,232,0.4)',
    tagText: '#8a70a8',
    desc: 'Pulled from the twilight zone. Stunning and rare.',
    cost: 400,
    limit: 1,
    targetRarity: 'rare',
  },
  {
    id: 'fish_epic',
    emoji: '',
    label: 'Legendary Specimen',
    type: 'fish',
    tag: 'Epic Fish',
    tagColor: 'rgba(240,192,64,0.15)',
    tagBorder: 'rgba(240,192,64,0.4)',
    tagText: '#b0944a',
    desc: 'One of a kind. Epic rarity — the merchant\'s prized catch.',
    cost: 1200,
    limit: 1,
    targetRarity: 'epic',
    minRep: 50,
  },
];

// ── Supply bundles ─────────────────────────────────────────
const SUPPLY_ITEMS = [
  {
    id: 'bundle_medicine',
    emoji: '',
    label: 'Medicine Bundle',
    type: 'supplies',
    tag: 'Supplies',
    tagColor: 'rgba(100,180,220,0.2)',
    tagBorder: 'rgba(100,180,220,0.4)',
    tagText: '#5a9aaa',
    desc: 'Antibiotic ×3, Antiparasitic ×2, Digestive Remedy ×2.',
    cost: 120,
    limit: 2,
    supplies: { antibiotic: 3, antiparasitic: 2, digestiveRemedy: 2 },
  },
  {
    id: 'bundle_food',
    emoji: '',
    label: 'Premium Fish Food',
    type: 'supplies',
    tag: 'Supplies',
    tagColor: 'rgba(100,180,220,0.2)',
    tagBorder: 'rgba(100,180,220,0.4)',
    tagText: '#5a9aaa',
    desc: '+40 food supply for your active tank.',
    cost: 60,
    limit: 3,
    supplies: { food: 40 },
  },
  {
    id: 'bundle_water',
    emoji: '',
    label: 'Water Treatment Pack',
    type: 'supplies',
    tag: 'Supplies',
    tagColor: 'rgba(100,180,220,0.2)',
    tagBorder: 'rgba(100,180,220,0.4)',
    tagText: '#5a9aaa',
    desc: 'Water Treatment ×5, Antibiotic ×2.',
    cost: 90,
    limit: 2,
    supplies: { waterTreatment: 5, antibiotic: 2 },
  },
  {
    id: 'full_restore',
    emoji: '',
    label: 'Full Restoration',
    type: 'supplies',
    tag: 'Premium',
    tagColor: 'rgba(212,168,48,0.15)',
    tagBorder: 'rgba(212,168,48,0.4)',
    tagText: '#d4a830',
    desc: 'Instantly restores water quality to 100% + food ×10.',
    cost: 150,
    limit: 1,
    supplies: { food: 10 },
    restoreWater: true,
  },
  {
    id: 'heater_pack',
    emoji: '',
    label: 'Heater Pack',
    type: 'supplies',
    tag: 'Supplies',
    tagColor: 'rgba(100,180,220,0.2)',
    tagBorder: 'rgba(100,180,220,0.4)',
    tagText: '#5a9aaa',
    desc: 'Heater Cartridge ×4.',
    cost: 80,
    limit: 2,
    supplies: { heater: 4 },
  },
  {
    id: 'breed_sprint',
    emoji: '',
    label: 'Breeding Sprint',
    type: 'supplies',
    tag: 'Breeding',
    tagColor: 'rgba(160,100,240,0.15)',
    tagBorder: 'rgba(160,100,240,0.4)',
    tagText: '#b070f0',
    desc: 'Breeding Boost ×3. Cuts breeding cycles to 10 seconds.',
    cost: 140,
    limit: 1,
    supplies: { breedingBoost: 3 },
  },
  {
    id: 'bundle_antiparasitic',
    emoji: '',
    label: 'Antiparasitic Bundle',
    type: 'supplies',
    tag: 'Supplies',
    tagColor: 'rgba(100,180,220,0.2)',
    tagBorder: 'rgba(100,180,220,0.4)',
    tagText: '#5a9aaa',
    desc: 'Antiparasitic ×4, Digestive Remedy ×3.',
    cost: 130,
    limit: 2,
    supplies: { antiparasitic: 4, digestiveRemedy: 3 },
  },
];

// ── Boosters ───────────────────────────────────────────────
const BOOSTER_ITEMS = [
  {
    id: 'boost_grow',
    emoji: '',
    label: 'Growth Formula',
    type: 'booster',
    tag: 'Boost',
    tagColor: 'rgba(80,200,80,0.12)',
    tagBorder: 'rgba(80,200,80,0.35)',
    tagText: '#60c860',
    desc: 'All fish grow 50% faster for 10 minutes.',
    cost: 200,
    limit: 1,
    boost: 'growSpeed',
    boostDurationMs: 600_000,
  },
  {
    id: 'boost_health',
    emoji: '',
    label: 'Vitality Tonic',
    type: 'booster',
    tag: 'Boost',
    tagColor: 'rgba(80,200,80,0.12)',
    tagBorder: 'rgba(80,200,80,0.35)',
    tagText: '#60c860',
    desc: 'Health regenerates 3× faster for 10 minutes.',
    cost: 175,
    limit: 1,
    boost: 'healthRegen',
    boostDurationMs: 600_000,
  },
  {
    id: 'boost_price',
    emoji: '',
    label: 'Market Frenzy',
    type: 'booster',
    tag: 'Boost',
    tagColor: 'rgba(80,200,80,0.12)',
    tagBorder: 'rgba(80,200,80,0.35)',
    tagText: '#60c860',
    desc: 'Customers pay 25% more for 10 minutes.',
    cost: 250,
    limit: 1,
    boost: 'salePrice',
    boostDurationMs: 600_000,
  },
  {
    id: 'boost_income',
    emoji: '',
    label: 'High Tide',
    type: 'booster',
    tag: 'Boost',
    tagColor: 'rgba(80,200,80,0.12)',
    tagBorder: 'rgba(80,200,80,0.35)',
    tagText: '#60c860',
    desc: 'Passive coin income doubles for 10 minutes.',
    cost: 180,
    limit: 1,
    boost: 'passiveIncome',
    boostDurationMs: 600_000,
  },
];

const ALL_ITEMS = [...MYSTERY_EGGS, ...EXOTIC_FISH, ...SUPPLY_ITEMS, ...BOOSTER_ITEMS];

// ── Seeded PRNG ────────────────────────────────────────────
function seededRng(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

function getTodayUTCDay() { return Math.floor(Date.now() / 86_400_000); }

function getDailyRotation(day, reputation) {
  const rng = seededRng(day * 2654435761);

  // Pick merchant
  const merchant = MERCHANTS[Math.floor(rng() * MERCHANTS.length)];

  // Build item pool (filter by rep gate)
  const pool = ALL_ITEMS.filter(i => !i.minRep || reputation >= i.minRep);

  // Shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pick items: guarantee diversity
  const picked = [];
  const types = new Set();
  const want = { egg: 1, fish: 1, booster: 1, supplies: 1 };
  // First pass: one of each type
  for (const item of shuffled) {
    if (picked.length >= 6) break;
    if (!types.has(item.type) && (want[item.type] || 0) > 0) {
      picked.push(item);
      types.add(item.type);
    }
  }
  // Fill remaining slots
  for (const item of shuffled) {
    if (picked.length >= 6) break;
    if (!picked.includes(item)) picked.push(item);
  }

  // Daily deal: 40% off one random item
  const dealIdx = Math.floor(rng() * picked.length);

  return { merchant, items: picked, dealIdx };
}

function msUntilNextDay() {
  const now = Date.now();
  return (Math.floor(now / 86_400_000) + 1) * 86_400_000 - now;
}

function formatCountdown(ms) {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${h}h ${m}m`;
}

const BOOST_LABELS = {
  growSpeed:     'Growth +50%',
  healthRegen:   'Regen ×3',
  salePrice:     'Prices +25%',
  passiveIncome: 'Income ×2',
};

const RARITY_COLORS = {
  common: '#5aaa70', uncommon: '#5a9aaa', rare: '#8a70a8', epic: '#b0944a', legendary: '#a06080',
};

// ── Rarity odds display ────────────────────────────────────
function RarityOdds({ weights }) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  return (
    <div className="rmc-odds">
      {Object.entries(weights).map(([rarity, weight]) => (
        <span key={rarity} className="rmc-odds-chip" style={{ color: RARITY_COLORS[rarity] || '#888' }}>
          {rarity} {Math.round((weight / total) * 100)}%
        </span>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────
export default function RareMarket({ game, activeTank, onBuyRareItem }) {
  const today = getTodayUTCDay();
  const [countdown, setCountdown] = useState(msUntilNextDay);

  useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilNextDay()), 30_000);
    return () => clearInterval(t);
  }, []);

  const reputation = game?.shop?.reputation || 0;
  const { merchant, items, dealIdx } = useMemo(
    () => getDailyRotation(today, reputation),
    [today, reputation]
  );

  const coins     = game?.player?.coins ?? 0;
  const purchased = (game?.rareMarket?.purchased || []).filter(p => p.day === today);
  const boosts    = game?.player?.boosts || {};
  const activeBoosts = Object.entries(boosts).filter(([, expiresAt]) => expiresAt > Date.now());

  function boughtCount(itemId) {
    return purchased.filter(p => p.itemId === itemId).length;
  }

  // Locked items the player can't see yet (hint at progression)
  const lockedCount = ALL_ITEMS.filter(i => i.minRep && reputation < i.minRep).length;

  return (
    <div className="rare-market-panel">
      {/* Merchant header */}
      <div className="rare-market-header">
        <div className="rm-merchant">
          <span className="rm-merchant-emoji">{merchant.emoji}</span>
          <div>
            <div className="rare-market-title">{merchant.name}</div>
            <div className="rm-merchant-greeting">{merchant.greeting}</div>
          </div>
        </div>
        <div className="rm-header-right">
          <div className="rare-market-coins">{coins.toLocaleString()}</div>
          <div className="rare-market-subtitle">
            Refreshes in <span className="rare-market-countdown">{formatCountdown(countdown)}</span>
          </div>
        </div>
      </div>

      {/* Active boosts */}
      {activeBoosts.length > 0 && (
        <div className="rare-market-boosts">
          <span className="boosts-label">Active:</span>
          {activeBoosts.map(([key, expiresAt]) => {
            const minsLeft = Math.max(0, Math.ceil((expiresAt - Date.now()) / 60_000));
            return (
              <span key={key} className="boost-badge">
                {BOOST_LABELS[key] || key} {minsLeft}m
              </span>
            );
          })}
        </div>
      )}

      {/* Items grid */}
      <div className="rare-market-grid">
        {items.map((item, idx) => {
          const bought    = boughtCount(item.id);
          const soldOut   = bought >= item.limit;
          const isDeal    = idx === dealIdx;
          const effectiveCost = isDeal ? Math.round(item.cost * 0.6) : item.cost;
          const canAfford = coins >= effectiveCost && !soldOut;

          return (
            <div
              key={item.id}
              className={`rare-market-card${soldOut ? ' rare-market-card--maxed' : ''}${isDeal ? ' rare-market-card--deal' : ''}`}
            >
              {isDeal && <div className="rmc-deal-ribbon">40% OFF</div>}
              <div className="rmc-top-row">
                <div className="rmc-emoji">{item.emoji}</div>
                <span
                  className="rmc-tag"
                  style={{
                    background: item.tagColor,
                    border: `1px solid ${item.tagBorder}`,
                    color: item.tagText,
                  }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="rmc-label">{item.label}</div>
              <div className="rmc-desc">{item.desc}</div>

              {/* Show rarity odds for mystery eggs */}
              {item.rarityWeights && <RarityOdds weights={item.rarityWeights} />}

              <div className="rmc-footer">
                <div>
                  <div className="rmc-cost">
                    {isDeal && <span className="rmc-cost-original">{item.cost}</span>}
                    {effectiveCost.toLocaleString()}
                  </div>
                  {soldOut
                    ? <div className="rmc-maxed">✓ Purchased</div>
                    : <div className="rmc-limit">{item.limit - bought} left today</div>
                  }
                </div>
                <button
                  className={`market-buy-btn${!canAfford ? ' market-buy-btn--disabled' : ''}`}
                  disabled={!canAfford}
                  title={!soldOut && !canAfford
                    ? `Need ${(effectiveCost - coins).toLocaleString()} more`
                    : undefined}
                  onClick={() => onBuyRareItem(
                    { ...item, cost: effectiveCost },
                    activeTank?.id
                  )}
                >
                  {soldOut ? 'Sold Out' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reputation unlock hint */}
      {lockedCount > 0 && (
        <div className="rm-locked-hint">
          {lockedCount} premium item{lockedCount > 1 ? 's' : ''} locked — reach higher reputation to unlock
        </div>
      )}

      <div className="rare-market-note">
        {merchant.name} visits daily at UTC midnight · Mystery eggs hatch into your active tank ·
        The Daily Deal changes every day
      </div>
    </div>
  );
}
