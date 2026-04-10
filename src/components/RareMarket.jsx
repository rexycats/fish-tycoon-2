// ============================================================
// FISH TYCOON 2 — RARE MARKET
// Rotating daily selection of special items.
// Catalog is deterministically seeded from the UTC day number
// so every player sees the same 5 items per day.
// ============================================================

import React, { useState, useEffect } from 'react';

// ── Full item catalog ──────────────────────────────────────
const ALL_ITEMS = [
  // Supply bundles
  {
    id: 'bundle_medicine',
    emoji: '💊', label: 'Medicine Bundle',
    type: 'supplies',
    tag: 'Supplies', tagColor: 'rgba(100,180,220,0.2)', tagBorder: 'rgba(100,180,220,0.4)', tagText: '#6ab0de',
    desc: 'Antibiotic ×3, Antiparasitic ×2, Digestive Remedy ×2. Enough to handle any outbreak.',
    cost: 120, limit: 2,
    supplies: { antibiotic: 3, antiparasitic: 2, digestiveRemedy: 2 },
  },
  {
    id: 'bundle_food',
    emoji: '🍤', label: 'Premium Fish Food',
    type: 'supplies',
    tag: 'Supplies', tagColor: 'rgba(100,180,220,0.2)', tagBorder: 'rgba(100,180,220,0.4)', tagText: '#6ab0de',
    desc: 'A bulk bag of high-grade pellets. +40 food supply for your active tank.',
    cost: 60, limit: 3,
    supplies: { food: 40 },
  },
  {
    id: 'bundle_water',
    emoji: '🧪', label: 'Water Treatment Pack',
    type: 'supplies',
    tag: 'Supplies', tagColor: 'rgba(100,180,220,0.2)', tagBorder: 'rgba(100,180,220,0.4)', tagText: '#6ab0de',
    desc: 'Water Treatment ×5 and Antibiotic ×2. Keeps your water pristine for days.',
    cost: 90, limit: 2,
    supplies: { waterTreatment: 5, antibiotic: 2 },
  },
  {
    id: 'full_restore',
    emoji: '✨', label: 'Full Restoration',
    type: 'supplies',
    tag: 'Premium', tagColor: 'rgba(212,168,48,0.15)', tagBorder: 'rgba(212,168,48,0.4)', tagText: '#d4a830',
    desc: 'Instantly restores water quality to 100% and adds food ×10.',
    cost: 150, limit: 1,
    supplies: { food: 10 }, restoreWater: true,
  },
  {
    id: 'heater_pack',
    emoji: '🌡️', label: 'Heater Pack',
    type: 'supplies',
    tag: 'Supplies', tagColor: 'rgba(100,180,220,0.2)', tagBorder: 'rgba(100,180,220,0.4)', tagText: '#6ab0de',
    desc: 'Heater Cartridge ×4. Keep your tank temperature stable for longer.',
    cost: 80, limit: 2,
    supplies: { heater: 4 },
  },
  {
    id: 'breed_sprint',
    emoji: '⚡', label: 'Breeding Sprint',
    type: 'supplies',
    tag: 'Breeding', tagColor: 'rgba(160,100,240,0.15)', tagBorder: 'rgba(160,100,240,0.4)', tagText: '#b070f0',
    desc: 'Breeding Boost ×3. Each charge cuts your next breeding cycle to 10 seconds.',
    cost: 140, limit: 1,
    supplies: { breedingBoost: 3 },
  },
  {
    id: 'bundle_antiparasitic',
    emoji: '🔬', label: 'Antiparasitic Bundle',
    type: 'supplies',
    tag: 'Supplies', tagColor: 'rgba(100,180,220,0.2)', tagBorder: 'rgba(100,180,220,0.4)', tagText: '#6ab0de',
    desc: 'Antiparasitic ×4 and Digestive Remedy ×3. The specialist toolkit for stubborn outbreaks.',
    cost: 130, limit: 2,
    supplies: { antiparasitic: 4, digestiveRemedy: 3 },
  },
  // Boosters
  {
    id: 'boost_grow',
    emoji: '🌱', label: 'Growth Formula',
    type: 'booster',
    tag: 'Boost', tagColor: 'rgba(80,200,80,0.12)', tagBorder: 'rgba(80,200,80,0.35)', tagText: '#60c860',
    desc: 'All fish grow 50% faster for 10 minutes. Applied immediately on purchase.',
    cost: 200, limit: 1,
    boost: 'growSpeed', boostDurationMs: 10 * 60 * 1000,
  },
  {
    id: 'boost_health',
    emoji: '💖', label: 'Vitality Tonic',
    type: 'booster',
    tag: 'Boost', tagColor: 'rgba(80,200,80,0.12)', tagBorder: 'rgba(80,200,80,0.35)', tagText: '#60c860',
    desc: 'All fish regenerate health 3× faster for 10 minutes. Perfect after an outbreak.',
    cost: 175, limit: 1,
    boost: 'healthRegen', boostDurationMs: 10 * 60 * 1000,
  },
  {
    id: 'boost_price',
    emoji: '📈', label: 'Market Frenzy',
    type: 'booster',
    tag: 'Boost', tagColor: 'rgba(80,200,80,0.12)', tagBorder: 'rgba(80,200,80,0.35)', tagText: '#60c860',
    desc: 'Customers pay 25% more for every fish for 10 minutes.',
    cost: 250, limit: 1,
    boost: 'salePrice', boostDurationMs: 10 * 60 * 1000,
  },
  {
    id: 'boost_income',
    emoji: '🌊', label: 'High Tide',
    type: 'booster',
    tag: 'Boost', tagColor: 'rgba(80,200,80,0.12)', tagBorder: 'rgba(80,200,80,0.35)', tagText: '#60c860',
    desc: 'Passive coin income doubles for 10 minutes.',
    cost: 180, limit: 1,
    boost: 'passiveIncome', boostDurationMs: 10 * 60 * 1000,
  },
];

// ── Daily rotation — deterministic LCG seed from UTC day ──
function seededShuffle(arr, seed) {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function getTodayUTCDay() {
  return Math.floor(Date.now() / 86_400_000);
}

function getDailyItems(day) {
  const shuffled  = seededShuffle(ALL_ITEMS, day);
  const boosters  = shuffled.filter(i => i.type === 'booster');
  const supplies  = shuffled.filter(i => i.type === 'supplies');
  // Guarantee at least 1 booster and 2 supply items in every rotation
  const pinned = [boosters[0], supplies[0], supplies[1]].filter(Boolean);
  const rest   = shuffled.filter(i => !pinned.includes(i));
  const picked = [...pinned];
  for (const item of rest) {
    if (picked.length >= 5) break;
    picked.push(item);
  }
  return picked;
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
  growSpeed:     '🌱 Growth +50%',
  healthRegen:   '💖 Regen ×3',
  salePrice:     '📈 Prices +25%',
  passiveIncome: '🌊 Income ×2',
};

export default function RareMarket({ game, activeTank, onBuyRareItem }) {
  const [today]     = useState(getTodayUTCDay);
  const [countdown, setCountdown] = useState(msUntilNextDay);

  useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilNextDay()), 60_000);
    return () => clearInterval(t);
  }, []);

  const items     = getDailyItems(today);
  const coins     = game?.player?.coins ?? 0;
  const purchased = (game?.rareMarket?.purchased || []).filter(p => p.day === today);
  const boosts    = game?.player?.boosts || {};
  const activeBoosts = Object.entries(boosts).filter(([, expiresAt]) => expiresAt > Date.now());

  function boughtCount(itemId) {
    return purchased.filter(p => p.itemId === itemId).length;
  }

  return (
    <div className="rare-market-panel">
      <div className="rare-market-header">
        <div>
          <div className="rare-market-title">🌟 Rare Market</div>
          <div className="rare-market-subtitle">
            Refreshes in{' '}
            <span className="rare-market-countdown">{formatCountdown(countdown)}</span>
            {' · '}Day {today % 1000} rotation
          </div>
        </div>
        <div className="rare-market-coins">🪙 {coins.toLocaleString()}</div>
      </div>

      {activeBoosts.length > 0 && (
        <div className="rare-market-boosts">
          <span className="boosts-label">Active boosts:</span>
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

      <div className="rare-market-grid">
        {items.map(item => {
          const bought    = boughtCount(item.id);
          const soldOut   = bought >= item.limit;
          const canAfford = coins >= item.cost && !soldOut;

          return (
            <div
              key={item.id}
              className={`rare-market-card${soldOut ? ' rare-market-card--maxed' : ''}`}
            >
              <div style={{ fontSize: 26, lineHeight: 1 }}>{item.emoji}</div>
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
              <div className="rmc-label">{item.label}</div>
              <div className="rmc-desc">{item.desc}</div>
              <div className="rmc-footer">
                <div>
                  <div className="rmc-cost">🪙 {item.cost.toLocaleString()}</div>
                  {soldOut
                    ? <div className="rmc-maxed">✓ Purchased today</div>
                    : <div className="rmc-limit">{item.limit - bought} left today</div>
                  }
                </div>
                <button
                  className={`market-buy-btn${!canAfford ? ' market-buy-btn--disabled' : ''}`}
                  disabled={!canAfford}
                  title={!soldOut && !canAfford
                    ? `Need 🪙${(item.cost - coins).toLocaleString()} more`
                    : undefined}
                  onClick={() => onBuyRareItem(item, activeTank?.id)}
                >
                  {soldOut ? 'Sold Out' : 'Buy'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rare-market-note">
        Items rotate daily at UTC midnight · Boosts apply instantly and show time remaining ·
        Supply items go to your active tank
      </div>
    </div>
  );
}
