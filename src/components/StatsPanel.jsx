// ============================================================
// FISH TYCOON 2 — STATISTICS DASHBOARD
// ============================================================
import React, { useMemo } from 'react';
import { useGameStore } from '../store/gameStore.js';

const RC = { common: '#7ec8a0', uncommon: '#6ab0de', rare: '#b07ee8', epic: '#f0c040', legendary: '#ff7eb3' };

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>
      <div className="stat-card-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      <div className="stat-card-label">{label}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="stat-mini-bar">
      <span className="stat-mini-label">{label}</span>
      <div className="stat-mini-track">
        <div className="stat-mini-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="stat-mini-val">{value}</span>
    </div>
  );
}

export default function StatsPanel() {
  const player = useGameStore(s => s.player);
  const fish   = useGameStore(s => s.fish);
  const tanks  = useGameStore(s => s.tanks);
  const shop   = useGameStore(s => s.shop);

  const stats = player.stats || {};
  const fishdex = player.fishdex || [];
  const achievements = player.achievements || [];
  const autopsies = player.autopsies || [];
  const salesHistory = shop.salesHistory || [];

  // Time played
  const timePlayed = useMemo(() => {
    const ms = Date.now() - (player.firstPlayedAt || Date.now());
    const hours = Math.floor(ms / 3_600_000);
    const mins = Math.floor((ms % 3_600_000) / 60_000);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }, [player.firstPlayedAt]);

  // Species by rarity
  const speciesByRarity = useMemo(() => {
    const counts = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
    for (const e of fishdex) counts[e.rarity] = (counts[e.rarity] || 0) + 1;
    return counts;
  }, [fishdex]);

  // Deaths by cause
  const deathsByCause = useMemo(() => {
    const counts = {};
    for (const a of autopsies) {
      const cause = a.cause || 'Unknown';
      counts[cause] = (counts[cause] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [autopsies]);

  // Current tank value
  const tankValue = useMemo(() =>
    fish.reduce((s, f) => s + (f.species?.basePrice || 0), 0),
    [fish]
  );

  const maxSpecies = Math.max(...Object.values(speciesByRarity), 1);

  return (
    <div className="stats-panel">
      <h2 className="stats-title">Aquarium Statistics</h2>

      <div className="stats-grid">
        <StatCard icon="⏱" label="Time Played" value={timePlayed} />
        <StatCard icon="" label="Total Earned" value={player.totalCoinsEarned || 0} />
        <StatCard icon="" label="Current Coins" value={player.coins} />
        <StatCard icon="" label="Tank Value" value={tankValue} sub="base price of all fish" />
        <StatCard icon="" label="Fish Alive" value={fish.length} />
        <StatCard icon="" label="Species Found" value={fishdex.length} />
        <StatCard icon="" label="Eggs Collected" value={stats.eggsCollected || 0} />
        <StatCard icon="" label="Medicine Used" value={stats.medicineUsed || 0} />
        <StatCard icon="🧪" label="Water Treated" value={stats.waterTreated || 0} />
        <StatCard icon="" label="Fish Lost" value={autopsies.length} />
        <StatCard icon="" label="Achievements" value={`${achievements.length}/23`} />
        <StatCard icon="" label="Magic Fish" value={`${(player.magicFishFound || []).length}/7`} />
        <StatCard icon="" label="Shop Rep" value={shop.reputation || 0} />
        <StatCard icon="" label="Total Sales" value={salesHistory.length} />
        <StatCard icon="" label="Challenge Streak" value={player.challengeStreak || 0} sub="consecutive days" />
        <StatCard icon="" label="Tanks" value={tanks.length} />
      </div>

      <div className="stats-section">
        <div className="stats-section-title">Species by Rarity</div>
        {Object.entries(speciesByRarity).map(([rarity, count]) => (
          <MiniBar key={rarity} label={rarity} value={count} max={maxSpecies} color={RC[rarity] || '#888'} />
        ))}
      </div>

      {deathsByCause.length > 0 && (
        <div className="stats-section">
          <div className="stats-section-title">Causes of Death</div>
          {deathsByCause.map(([cause, count]) => (
            <MiniBar key={cause} label={cause} value={count} max={deathsByCause[0][1]} color="#ff6055" />
          ))}
        </div>
      )}
    </div>
  );
}
