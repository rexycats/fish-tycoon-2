// ============================================================
// AMENITIES PANEL — Gift Shop + Café
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';

const AMENITIES = [
  {
    id: 'giftShop',
    name: 'Gift Shop',
    desc: 'Sells merchandise themed to your rarest species. Income scales with rarity diversity.',
    unlockCost: 500,
    icon: 'SHOP',
    incomeDesc: 'Earns (3 + 2×level) × rarity tiers per minute',
  },
  {
    id: 'cafe',
    name: 'Café',
    desc: 'Visitors grab drinks and snacks. Income scales with average tank happiness.',
    unlockCost: 750,
    icon: 'CAFE',
    incomeDesc: 'Earns (2 + 2×level) × (happiness/50) per minute',
  },
];

const UPGRADE_COSTS = [0, 400, 1000, 2500, 6000];

export default function AmenitiesPanel() {
  const coins = useGameStore(s => s.player?.coins || 0);
  const giftShop = useGameStore(s => s.giftShop);
  const cafe = useGameStore(s => s.cafe);
  const unlockAmenity = useGameStore(s => s.unlockAmenity);
  const upgradeAmenity = useGameStore(s => s.upgradeAmenity);

  const getState = (id) => id === 'giftShop' ? giftShop : cafe;

  return (
    <div className="amenities-panel">
      <div className="amenities-title">AMENITIES</div>
      <div className="amenities-subtitle">Build facilities that generate passive income</div>

      <div className="amenities-grid">
        {AMENITIES.map(a => {
          const state = getState(a.id);
          const unlocked = state?.unlocked;
          const level = state?.level || 0;
          const totalEarned = state?.totalEarned || 0;
          const nextCost = level < 4 ? UPGRADE_COSTS[level + 1] : null;

          return (
            <div key={a.id} className={`amenity-card ${unlocked ? 'amenity-card--active' : ''}`}>
              <div className="amenity-card-header">
                <span className="amenity-card-icon">{a.icon}</span>
                <span className="amenity-card-name">{a.name}</span>
                {unlocked && <span className="amenity-card-level">LV.{level + 1}</span>}
              </div>
              <div className="amenity-card-desc">{a.desc}</div>

              {unlocked ? (
                <>
                  <div className="amenity-card-stats">
                    <span className="amenity-stat">Total earned: {totalEarned.toLocaleString()}</span>
                    <span className="amenity-stat amenity-stat--income">{a.incomeDesc}</span>
                  </div>
                  {nextCost !== null && (
                    <button
                      className="btn amenity-upgrade-btn"
                      onClick={() => upgradeAmenity(a.id)}
                      disabled={coins < nextCost}
                    >
                      Upgrade ({nextCost})
                    </button>
                  )}
                  {nextCost === null && (
                    <div className="amenity-maxed">MAX LEVEL</div>
                  )}
                </>
              ) : (
                <button
                  className="btn amenity-unlock-btn"
                  onClick={() => unlockAmenity(a.id)}
                  disabled={coins < a.unlockCost}
                >
                  Build ({a.unlockCost})
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
