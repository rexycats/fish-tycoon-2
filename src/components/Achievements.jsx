// ============================================================
// FISH TYCOON 2 — ACHIEVEMENTS PANEL
// ============================================================

import React, { useMemo } from 'react';
import { ACHIEVEMENT_DEFS } from '../data/gameState.js';
import { DECOR_CATALOG } from '../data/decorations.js';

// Mirror of the map in gameState.js — kept local so this component has no circular dep
const ACHIEVEMENT_DECOR_REWARDS = {
  tank_happy:  'golden_coral',
  species_10:  'ancient_ruin',
  three_tanks: 'sunken_galleon',
  magic_3:     'magic_orb',
  magic_7:     'legend_throne',
};

function AchievementCard({ def, unlock, onNavigate }) {
  const earned   = !!unlock;
  const isSecret = def.secret && !earned;
  const decorId  = ACHIEVEMENT_DECOR_REWARDS[def.id];
  const decor    = decorId ? DECOR_CATALOG.find(d => d.id === decorId) : null;
  const isLegend = def.id === 'magic_7';

  return (
    <div className={`ach-card ${earned ? 'earned' : 'locked'}`}>
      {/* Progress bar — 100% when earned, thin bottom stripe */}
      <div className="ach-progress" style={{ width: earned ? '100%' : '0%' }} />

      <div className="ach-emoji">{isSecret ? '?' : def.emoji}</div>
      <div className="ach-info">
        <div className="ach-label">{isSecret ? '???' : def.label}</div>
        <div className="ach-desc">{isSecret ? 'Keep playing to discover this achievement!' : def.desc}</div>

        {/* Reward preview — shown even on locked cards (unless secret) */}
        {!isSecret && (
          <div className="ach-rewards-row">
            <span className={`ach-coin-badge ach-coin-badge--${def.tier}`}>
              +🪙{def.tier === 'common' ? 25 : def.tier === 'rare' ? 100 : 500}
            </span>
            {decor && (
              earned && onNavigate ? (
                <button
                  className="ach-decor-badge ach-decor-badge--btn"
                  title={`${decor.desc} — click to open Decor tab`}
                  onClick={() => onNavigate('decor')}
                >
                  {decor.label} →
                </button>
              ) : (
                <span className="ach-decor-badge" title={decor.desc}>
                  {decor.label}
                </span>
              )
            )}
            {isLegend && (
              <span className="ach-legend-badge" aria-label="Unlocks the Legend Fish species in the Fishdex">
                Legend Fish
              </span>
            )}
          </div>
        )}

        {earned && (
          <div className="ach-date">
            Unlocked {new Date(unlock.unlockedAt).toLocaleDateString()}
            {unlock.reward > 0 && <span className="ach-earned-coins"> · Earned 🪙{unlock.reward.toLocaleString()}</span>}
          </div>
        )}
      </div>
      {earned && <div className="ach-badge">✓</div>}
    </div>
  );
}

function Achievements({ achievements, player, onNavigate }) {
  const earned = useMemo(
    () => Object.fromEntries((achievements || []).map(a => [a.id, a])),
    [achievements]
  );

  const count   = achievements?.length || 0;
  const total   = ACHIEVEMENT_DEFS.length;
  const pct     = Math.round((count / total) * 100);

  // Stats rows
  const achievementCoins = (achievements || []).reduce((sum, a) => sum + (a.reward || 0), 0);
  const unlockedDecorCount = (player.unlockedDecorations || []).length;

  const stats = [
    { label: 'Total Coins Earned',      value: `🪙 ${(player.totalCoinsEarned || 0).toLocaleString()}` },
    { label: 'Achievement Bonuses',     value: `${achievementCoins.toLocaleString()}` },
    { label: 'Species Discovered',      value: `${(player.fishdex || []).length}` },
    { label: 'Eggs Collected',          value: `${player.stats?.eggsCollected || 0}` },
    { label: 'Fish Treated',            value: `${player.stats?.medicineUsed || 0}` },
    { label: 'Water Treatments',        value: `${player.stats?.waterTreated || 0}` },
    ...(unlockedDecorCount > 0 ? [{ label: 'Decorations Unlocked', value: `${unlockedDecorCount}` }] : []),
  ];

  return (
    <div className="ach-panel">
      <div className="ach-header">
        <div className="ach-title-row">
          <h2>Achievements</h2>
          <div className="ach-progress-label">{count} / {total}</div>
        </div>

        {/* Progress bar */}
        <div className="ach-progress-bar-wrap">
          <div className="ach-progress-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Stats summary */}
        <div className="ach-stats-grid">
          {stats.map(s => (
            <div key={s.label} className="ach-stat-row">
              <span className="ach-stat-label">{s.label}</span>
              <span className="ach-stat-val">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement cards */}
      <div className="ach-list">
        {ACHIEVEMENT_DEFS.map(def => (
          <AchievementCard key={def.id} def={def} unlock={earned[def.id]} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}
export default Achievements;
