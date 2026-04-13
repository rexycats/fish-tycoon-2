import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { getLevelFromXp, getLevelTitle } from '../data/levels.js';
import { upgradeCost } from '../data/constants.js';
import { getCustomerInterval } from '../systems/gameTick.js';
import { TANK_UNLOCK } from '../data/gameState.js';

/* ── Income rate tracker ───────────────────────────────────── */
function IncomeRate() {
  const coins = useGameStore(s => s.player.coins);
  const [rate, setRate] = useState(0);
  const historyRef = useRef([]);

  useEffect(() => {
    const now = Date.now();
    historyRef.current.push({ time: now, coins });
    // Keep last 60 seconds of data
    const cutoff = now - 60_000;
    historyRef.current = historyRef.current.filter(h => h.time > cutoff);
    const history = historyRef.current;
    if (history.length < 2) return;
    const oldest = history[0];
    const dt = (now - oldest.time) / 60_000; // minutes
    if (dt < 0.08) return; // need at least ~5 seconds
    const earned = coins - oldest.coins;
    setRate(Math.max(0, Math.round(earned / dt)));
  }, [coins]);

  if (rate <= 0) return null;
  return (
    <span className="hud2-income-rate" title="Estimated income per minute">
      <span className="hud2-income-icon">📈</span>
      <span className="hud2-income-val">~{rate}/min</span>
    </span>
  );
}

/* ── Next goal teaser ──────────────────────────────────────── */
function NextGoalTeaser() {
  const coins = useGameStore(s => s.player.coins);
  const tanks = useGameStore(s => s.tanks);
  const upgrades = useGameStore(s => s.shop.upgrades);

  // Find cheapest next goal
  const goals = [];

  // Tank unlocks
  const tankCount = tanks?.length || 1;
  if (TANK_UNLOCK[tankCount]) {
    goals.push({
      label: TANK_UNLOCK[tankCount].label,
      cost: TANK_UNLOCK[tankCount].cost,
      icon: '🏠',
    });
  }

  // Upgrades
  if (upgrades) {
    const upgradeNames = { slot: 'Shop Slot', capacity: 'Tank Size', reputation: 'Advertising', breeding: 'Breed Speed', lighting: 'Lighting', vip: 'VIP Access', hatchery: 'Hatchery', tankSitter: 'Tank Sitter' };
    for (const [id, upg] of Object.entries(upgrades)) {
      if (upg.level >= (upg.maxLevel || 5)) continue;
      const cost = upgradeCost(upg.cost, upg.level);
      goals.push({
        label: `${upgradeNames[id] || id} Lv${upg.level + 1}`,
        cost,
        icon: '⬆️',
      });
    }
  }

  if (goals.length === 0) return null;

  // Sort by cost, pick closest affordable target
  goals.sort((a, b) => a.cost - b.cost);
  // Pick the cheapest one you haven't yet reached
  const goal = goals.find(g => g.cost > coins) || goals[goals.length - 1];
  if (!goal || coins >= goal.cost) return null;

  const pct = Math.min(100, Math.round((coins / goal.cost) * 100));

  return (
    <div className="hud2-next-goal" title={`${goal.label}: ${coins.toLocaleString()} / ${goal.cost.toLocaleString()} coins`}>
      <span className="hud2-goal-label">{goal.icon} {goal.label}</span>
      <div className="hud2-goal-bar">
        <div className="hud2-goal-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="hud2-goal-cost">🪙 {coins.toLocaleString()}/{goal.cost.toLocaleString()}</span>
    </div>
  );
}

/* ── Customer countdown ────────────────────────────────────── */
function CustomerCountdown() {
  const lastAt = useGameStore(s => s.shop.lastCustomerAt);
  const listed = useGameStore(s => s.shop.listedFish?.length || 0);
  const [secsLeft, setSecsLeft] = useState(null);

  useEffect(() => {
    if (listed <= 0) { setSecsLeft(null); return; }
    function update() {
      const state = useGameStore.getState();
      const interval = getCustomerInterval(state);
      const elapsed = Date.now() - (state.shop.lastCustomerAt || Date.now());
      const remaining = Math.max(0, Math.ceil((interval - elapsed) / 1000));
      setSecsLeft(remaining);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [lastAt, listed]);

  if (secsLeft === null || listed <= 0) return null;

  return (
    <span className="hud2-customer-timer" title="Time until next customer arrives">
      <span className="hud2-customer-icon">🚶</span>
      <span className="hud2-customer-val">
        {secsLeft > 0 ? `${secsLeft}s` : 'arriving...'}
      </span>
    </span>
  );
}

/* ── Animated coin counter ─────────────────────────────────── */
function CoinDisplay({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const [flash, setFlash]         = useState(null); // 'up' | 'down' | null
  const prevRef = useRef(value);
  const rafRef  = useRef(null);
  const lastDiffRef = useRef(0);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    const diff = value - prev;
    if (diff === 0) return;

    lastDiffRef.current = diff;
    setFlash(diff > 0 ? 'up' : 'down');
    const flashTimer = setTimeout(() => setFlash(null), 900);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start     = prev;
    const end       = value;
    const duration  = Math.min(700, Math.abs(diff) * 2 + 200);
    let startTime   = null;

    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);

    return () => {
      clearTimeout(flashTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  const bumpClass = flash === 'up'
    ? (lastDiffRef.current >= 200 ? ' hud2-coin-val--mega-bump' : ' hud2-coin-val--bump')
    : '';

  return (
    <div className={`hud2-coin ${flash ? `hud2-coin--${flash}` : ''}`}>
      <span className="hud2-coin-icon">🪙</span>
      <span className={`hud2-coin-val${bumpClass}`}>{displayed.toLocaleString()}</span>
    </div>
  );
}

/* ── Compact stat pill ─────────────────────────────────────── */
function StatPill({ icon, value, label, color, alert }) {
  return (
    <div className={`hud2-pill ${alert ? 'hud2-pill--alert' : ''}`} title={label}>
      <span className="hud2-pill-icon">{icon}</span>
      <span className="hud2-pill-val" style={color ? { color } : undefined}>{value}</span>
    </div>
  );
}

/* ── Reputation badge ──────────────────────────────────────── */
function RepBadge({ rep }) {
  const r    = rep || 0;
  const tier = r < 100 ? 'Local' : r < 300 ? 'Known' : r < 600 ? 'Popular' : 'Famous';
  const col  = r < 100 ? '#8aa4c8' : r < 300 ? '#6ab0de' : r < 600 ? '#b07ee8' : '#f0c040';
  const next = r < 100 ? 100 : r < 300 ? 300 : r < 600 ? 600 : 999;
  const pct  = Math.min(100, Math.round((r / next) * 100));
  return (
    <div className="hud2-rep" title={`Reputation ${r} — ${tier}\nNext tier at ${next}`}>
      <span className="hud2-rep-tier" style={{ color: col }}>{tier}</span>
      <div className="hud2-rep-track">
        <div className="hud2-rep-fill" style={{ width: `${pct}%`, background: col }} />
      </div>
    </div>
  );
}

/* ── Happiness mini-bar ────────────────────────────────────── */
function HappinessBar({ value }) {
  const v   = Math.max(0, Math.min(100, value ?? 100));
  const col = v > 70 ? '#3ddba0' : v > 40 ? '#f5c542' : '#ff5566';
  const em  = v > 70 ? '😊' : v > 40 ? '😐' : '😟';
  return (
    <div className="hud2-happy" title={`Happiness: ${v}%`}>
      <span className="hud2-happy-icon">{em}</span>
      <div className="hud2-happy-track">
        <div className="hud2-happy-fill" style={{ width: `${v}%`, background: col }} />
      </div>
    </div>
  );
}

/* ── Save indicator ─────────────────────────────────────────── */
function SaveIndicator() {
  const flash = useGameStore(s => s._saveFlash);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!flash) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(t);
  }, [flash]);
  if (!visible) return null;
  return <span className="hud2-save-indicator" title="Game saved">💾</span>;
}

/* ── Urgent Offer Banner ───────────────────────────────────── */
function UrgentOfferBanner() {
  const offer = useGameStore(s => s.urgentOffer);
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!offer?.expiresAt) return;
    const tick = () => {
      const ms = Math.max(0, offer.expiresAt - Date.now());
      if (ms <= 0) { setTimeLeft('EXPIRED'); return; }
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setTimeLeft(`${m}:${String(s).padStart(2, '0')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [offer?.expiresAt]);
  if (!offer || !offer.expiresAt || Date.now() >= offer.expiresAt) return null;
  return (
    <div className="hud2-urgent">
      <span className="hud2-urgent-name">{offer.name}</span>
      <span className="hud2-urgent-desc">{offer.desc}</span>
      <span className="hud2-urgent-timer">⏰ {timeLeft}</span>
    </div>
  );
}

/* ── Level / XP Bar ────────────────────────────────────────── */
function LevelBar({ xp }) {
  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp || 0);
  const pct = nextLevelXp > 0 ? Math.min(100, (currentXp / nextLevelXp) * 100) : 100;
  const title = getLevelTitle(level);
  return (
    <div className="hud2-level" title={`${title}\n${currentXp} / ${nextLevelXp} XP to next level`}>
      <span className="hud2-level-badge">Lv.{level}</span>
      <div className="hud2-level-track">
        <div className="hud2-level-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="hud2-level-xp">{currentXp}/{nextLevelXp}</span>
    </div>
  );
}

/* ── Main HUD ──────────────────────────────────────────────── */
export default function HUD({
  player, shop, tanks, activeTank, fish,
  selectedFishTankId,
  onBuyFood, onTreatWater, onToggleAutoFeed, onUseHeater,
  soundOn, onToggleSound,
}) {
  const displayTank = (selectedFishTankId && tanks?.find(t => t.id === selectedFishTankId)) || activeTank || tanks?.[0] || {};
  const tank    = displayTank;
  const wq      = Math.round(tank.waterQuality ?? 100);
  const temp    = tank.temperature ?? 74;
  const wqCol   = wq  > 70 ? '#3ddba0' : wq  > 40 ? '#f5c542' : '#ff5566';
  const tempCol = (temp < 68 || temp > 82) ? '#ff5566' : (temp < 71 || temp > 79) ? '#f5c542' : '#3ddba0';
  const fishCnt = fish ? fish.filter(f => f.tankId === tank.id).length : 0;
  const food    = tank.supplies?.food ?? 0;
  const tempBad = temp < 68 || temp > 82;
  const wqBad   = wq < 60;

  return (
    <header className="hud2">
      <UrgentOfferBanner />

      {/* ── Row 1: brand · coins · rep · sound ───────────────── */}
      <div className="hud2-row hud2-row--top">
        <div className="hud2-brand">
          <span className="hud2-logo">🐠</span>
          <span className="hud2-title">Fish Tycoon</span>
        </div>

        <div className="hud2-divider hud2-divider--v" />

        <CoinDisplay value={player.coins} />
        <IncomeRate />

        <LevelBar xp={player.xp} />

        <CustomerCountdown />

        <div className="hud2-spacer" />

        <div className="hud2-bars">
          <HappinessBar value={tank.happiness} />
          <RepBadge rep={shop?.reputation} />
        </div>

        {onToggleSound && (
          <>
            <div className="hud2-divider hud2-divider--v" />
            <button
              className="hud2-btn hud2-btn--icon"
              onClick={onToggleSound}
              title={soundOn ? 'Mute' : 'Unmute'}
            >
              {soundOn ? '🔊' : '🔇'}
            </button>
          </>
        )}
        <SaveIndicator />
      </div>

      {/* ── Row 2: tank stats · weather · quick actions ─────── */}
      <div className="hud2-row hud2-row--bottom">
        <div className="hud2-pills">
          {player.activeLoan?.active && (
            <StatPill icon="🏦" value="LOAN" label="Active loan — repay before deadline!" color="#ff6060" alert={true} />
          )}
          <StatPill icon="💧" value={`${wq}%`}  label="Water quality" color={wqCol}  alert={wqBad} />
          <StatPill icon="🌡" value={`${Math.round(temp)}°`} label="Temperature" color={tempCol} alert={tempBad} />
          <StatPill icon="🐟" value={`${fishCnt}/${tank.capacity ?? 12}`} label="Fish capacity" />
          <StatPill icon="🍤" value={food < 1 ? 'Empty' : `${food} feeds`} label={`Food supply (${food} remaining)`} alert={food < 3} />
        </div>

        <div className="hud2-spacer" />

        <div className="hud2-actions">
          <button
            className={`hud2-btn ${tank.autoFeed ? 'hud2-btn--active' : ''}`}
            onClick={() => onToggleAutoFeed(tank.id)}
            title={tank.autoFeed ? 'Auto-feed ON' : 'Auto-feed OFF'}
          >
            🍤 <span className="hud2-btn-label">{tank.autoFeed ? 'Auto ✓' : 'Auto'}</span>
          </button>

          {tempBad && (
            <button
              className="hud2-btn hud2-btn--warn"
              onClick={() => onUseHeater(tank.id)}
              disabled={(tank.supplies?.heater || 0) <= 0}
              title={`Adjust temperature (${tank.supplies?.heater || 0} left)`}
            >
              🌡 <span className="hud2-btn-label">Temp</span>
            </button>
          )}

          {wqBad && (
            <button
              className="hud2-btn hud2-btn--warn"
              onClick={() => onTreatWater(tank.id)}
              disabled={(tank.supplies?.waterTreatment || 0) <= 0}
              title={`Treat water (${tank.supplies?.waterTreatment || 0} left)`}
            >
              🧪 <span className="hud2-btn-label">Treat</span>
            </button>
          )}

          <button
            className="hud2-btn"
            onClick={onBuyFood}
            disabled={player.coins < 10}
            title="Buy 10 food (10🪙)"
          >
            + <span className="hud2-btn-label">Food</span>
          </button>

          <FeedAllButton tankId={tank?.id} food={food} />
        </div>
      </div>

      {/* ── Row 3: next goal teaser ────────────────────────── */}
      <NextGoalTeaser />

      {/* ── Row 4: active boosts (from Rare Market) ────────────── */}
      <ActiveBoosts />

    </header>
  );
}

const BOOST_INFO = {
  growSpeed:     { emoji: '🌱', label: 'Growth +50%' },
  healthRegen:   { emoji: '💖', label: 'Regen ×3' },
  salePrice:     { emoji: '📈', label: 'Prices +25%' },
  passiveIncome: { emoji: '🌊', label: 'Income ×2' },
};

function ActiveBoosts() {
  const boosts = useGameStore(s => s.player?.boosts || {});
  const [, tick] = useState(0);

  const active = Object.entries(boosts).filter(([, exp]) => exp > Date.now());

  useEffect(() => {
    if (active.length === 0) return;
    const id = setInterval(() => tick(t => t + 1), 10_000);
    return () => clearInterval(id);
  }, [active.length]);

  if (active.length === 0) return null;

  return (
    <div className="hud2-boosts">
      {active.map(([key, exp]) => {
        const info = BOOST_INFO[key] || { emoji: '⚡', label: key };
        const mins = Math.max(0, Math.ceil((exp - Date.now()) / 60_000));
        return (
          <span key={key} className="hud2-boost-pill">
            {info.emoji} {info.label} <span className="hud2-boost-time">{mins}m</span>
          </span>
        );
      })}
    </div>
  );
}

function FeedAllButton({ tankId, food }) {
  const feedAll = useGameStore(s => s.feedAllInTank);
  const hungryCount = useGameStore(s =>
    s.fish.filter(f => f.tankId === tankId && f.stage !== 'egg' && f.hunger > 30).length
  );
  if (hungryCount === 0) return null;
  return (
    <button
      className="hud2-btn hud2-btn--feed-all"
      onClick={() => feedAll(tankId)}
      disabled={food <= 0}
      title={`Feed ${hungryCount} hungry fish (1 food each)`}
    >
      🍤 <span className="hud2-btn-label">Feed All ({hungryCount})</span>
    </button>
  );
}
