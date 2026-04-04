// ============================================================
// FISH TYCOON 2 — ACHIEVEMENTS PANEL
// ============================================================

import React, { useMemo } from 'react';
import { ACHIEVEMENT_DEFS } from '../data/gameState.js';

function AchievementCard({ def, unlock }) {
  const earned   = !!unlock;
  const isSecret = def.secret && !earned;

  return (
    <div className={`ach-card ${earned ? 'earned' : 'locked'}`}>
      <div className="ach-emoji">{isSecret ? '❓' : def.emoji}</div>
      <div className="ach-info">
        <div className="ach-label">{isSecret ? '???' : def.label}</div>
        <div className="ach-desc">{isSecret ? 'Keep playing to discover this achievement!' : def.desc}</div>
        {earned && (
          <div className="ach-date">
            Unlocked {new Date(unlock.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
      {earned && <div className="ach-badge">✓</div>}
    </div>
  );
}

export default function Achievements({ achievements, player }) {
  const earned = useMemo(
    () => Object.fromEntries((achievements || []).map(a => [a.id, a])),
    [achievements]
  );

  const count   = achievements?.length || 0;
  const total   = ACHIEVEMENT_DEFS.length;
  const pct     = Math.round((count / total) * 100);

  // Stats rows
  const stats = [
    { label: 'Total Coins Earned',   value: `🪙 ${(player.totalCoinsEarned || 0).toLocaleString()}` },
    { label: 'Species Discovered',   value: `📖 ${(player.fishdex || []).length}` },
    { label: 'Eggs Collected',       value: `🥚 ${player.stats?.eggsCollected || 0}` },
    { label: 'Fish Treated',         value: `💊 ${player.stats?.medicineUsed || 0}` },
    { label: 'Water Treatments',     value: `🧪 ${player.stats?.waterTreated || 0}` },
  ];

  return (
    <div className="ach-panel">
      <div className="ach-header">
        <div className="ach-title-row">
          <h2>🏆 Achievements</h2>
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
          <AchievementCard key={def.id} def={def} unlock={earned[def.id]} />
        ))}
      </div>
    </div>
  );
}
