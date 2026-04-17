// ============================================================
// FISH TYCOON 2 — STATISTICS DASHBOARD (with graphs)
// ============================================================
import React, { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTotalDailyWages } from '../data/staff.js';

const RC = { common: '#5aaa70', uncommon: '#5a9aaa', rare: '#8a70a8', epic: '#b0944a', legendary: '#a06080' };

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
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

const CHART_STYLE = {
  fontSize: 9,
  fontFamily: 'var(--font-mono)',
  fill: 'rgba(160,170,180,0.6)',
};

function ChartTooltipContent({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-chart-tooltip">
      <div className="stats-chart-tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {formatter ? formatter(p.value) : p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

function StatsChart({ data, dataKey, color, label, formatter }) {
  if (!data || data.length < 2) {
    return (
      <div className="stats-chart-empty">
        Not enough data yet. Keep playing to see your {label.toLowerCase()} trend.
      </div>
    );
  }
  return (
    <div className="stats-chart">
      <div className="stats-chart-title">{label}</div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={CHART_STYLE} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis tick={CHART_STYLE} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltipContent formatter={formatter} />} />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={1.5} fill={`url(#grad-${dataKey})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function StatsPanel() {
  const player = useGameStore(s => s.player);
  const fish   = useGameStore(s => s.fish);
  const tanks  = useGameStore(s => s.tanks);
  const shop   = useGameStore(s => s.shop);
  const staff  = useGameStore(s => s.staff || []);
  const statsHistory = useGameStore(s => s.statsHistory || []);

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

  // Chart data from snapshots
  const chartData = useMemo(() => {
    if (!statsHistory.length) return [];
    const firstT = statsHistory[0].t;
    return statsHistory.map(s => {
      const mins = Math.round((s.t - firstT) / 60_000);
      const hrs = Math.floor(mins / 60);
      const m = mins % 60;
      return {
        label: hrs > 0 ? `${hrs}h${m > 0 ? m + 'm' : ''}` : `${m}m`,
        coins: s.coins,
        earned: s.earned,
        fish: s.fish,
        species: s.species,
      };
    });
  }, [statsHistory]);

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

  // Top sellers
  const topSellers = useMemo(() => {
    const counts = {};
    for (const s of salesHistory) {
      const name = s.fishName || 'Unknown';
      if (!counts[name]) counts[name] = { count: 0, revenue: 0 };
      counts[name].count += 1;
      counts[name].revenue += s.coins || 0;
    }
    return Object.entries(counts)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [salesHistory]);

  const tankValue = useMemo(() =>
    fish.reduce((s, f) => s + (f.species?.basePrice || 0), 0),
    [fish]
  );

  const dailyWages = getTotalDailyWages(staff);
  const maxSpecies = Math.max(...Object.values(speciesByRarity), 1);

  return (
    <div className="stats-panel">
      <h2 className="stats-title">Aquarium Statistics</h2>

      {/* Key metrics */}
      <div className="stats-grid">
        <StatCard label="Time Played" value={timePlayed} />
        <StatCard label="Total Earned" value={player.totalCoinsEarned || 0} />
        <StatCard label="Current Coins" value={player.coins} />
        <StatCard label="Tank Value" value={tankValue} sub="base price of all fish" />
        <StatCard label="Fish Alive" value={fish.length} />
        <StatCard label="Species Found" value={fishdex.length} />
        <StatCard label="Fish Bred" value={stats.eggsCollected || 0} />
        <StatCard label="Fish Sold" value={stats.fishSold || 0} />
        <StatCard label="Fish Lost" value={autopsies.length} />
        <StatCard label="Staff" value={`${staff.length}`} sub={dailyWages > 0 ? `${dailyWages}/day wages` : null} />
        <StatCard label="Achievements" value={`${achievements.length}/23`} />
        <StatCard label="Streak" value={player.challengeStreak || 0} sub="daily challenge" />
      </div>

      {/* Graphs */}
      <div className="stats-charts">
        <StatsChart data={chartData} dataKey="earned" color="#d4a843" label="Total Revenue" />
        <StatsChart data={chartData} dataKey="coins" color="#4a8f8f" label="Coins on Hand" />
        <StatsChart data={chartData} dataKey="fish" color="#5aaa70" label="Fish Population" />
        <StatsChart data={chartData} dataKey="species" color="#8a70a8" label="Species Discovered" />
      </div>

      {/* Breakdowns */}
      <div className="stats-columns">
        <div className="stats-section">
          <div className="stats-section-title">Species by Rarity</div>
          {Object.entries(speciesByRarity).map(([rarity, count]) => (
            <MiniBar key={rarity} label={rarity} value={count} max={maxSpecies} color={RC[rarity] || '#888'} />
          ))}
        </div>

        {topSellers.length > 0 && (
          <div className="stats-section">
            <div className="stats-section-title">Top Sellers</div>
            {topSellers.map(s => (
              <MiniBar key={s.name} label={s.name} value={s.revenue} max={topSellers[0].revenue} color="#d4a843" />
            ))}
          </div>
        )}

        {deathsByCause.length > 0 && (
          <div className="stats-section">
            <div className="stats-section-title">Causes of Death</div>
            {deathsByCause.map(([cause, count]) => (
              <MiniBar key={cause} label={cause} value={count} max={deathsByCause[0][1]} color="#c04040" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
