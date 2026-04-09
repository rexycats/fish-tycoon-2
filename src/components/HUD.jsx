import React, { useState, useEffect, useRef } from 'react';

/* ── Animated coin counter ─────────────────────────────────── */
function CoinDisplay({ value }) {
  const [displayed, setDisplayed] = useState(value);
  const [flash, setFlash]         = useState(null); // 'up' | 'down' | null
  const prevRef = useRef(value);
  const rafRef  = useRef(null);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    const diff = value - prev;
    if (diff === 0) return;

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

  return (
    <div className={`hud2-coin ${flash ? `hud2-coin--${flash}` : ''}`}>
      <span className="hud2-coin-icon">🪙</span>
      <span className="hud2-coin-val">{displayed.toLocaleString()}</span>
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

/* ── Main HUD ──────────────────────────────────────────────── */
export default function HUD({
  player, shop, tanks, activeTank, fish,
  selectedFishTankId,
  onBuyFood, onTreatWater, onToggleAutoFeed, onUseHeater,
  soundOn, onToggleSound,
}) {
  // When a fish from a different tank is selected, show that tank's stats so
  // the HUD matches the fish the player is actually looking at.
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
      {/* Brand */}
      <div className="hud2-brand">
        <span className="hud2-logo">🐠</span>
        <span className="hud2-title">Fish Tycoon</span>
      </div>

      {/* Divider */}
      <div className="hud2-divider" />

      {/* Coins — hero element */}
      <CoinDisplay value={player.coins} />

      {/* Divider */}
      <div className="hud2-divider" />

      {/* Tank stats row */}
      <div className="hud2-pills">
        <StatPill icon="💧" value={`${wq}%`}  label="Water quality" color={wqCol}  alert={wqBad} />
        <StatPill icon="🌡" value={`${Math.round(temp)}°`} label="Temperature" color={tempCol} alert={tempBad} />
        <StatPill icon="🐟" value={`${fishCnt}/${tank.capacity ?? 12}`} label="Fish capacity" />
        <StatPill icon="🍤" value={food < 1 ? 'Empty' : `${food} feeds`} label={`Food supply (${food} remaining)`} alert={food < 3} />
      </div>

      {/* Divider */}
      <div className="hud2-divider" />

      {/* Status bars */}
      <div className="hud2-bars">
        <HappinessBar value={tank.happiness} />
        <RepBadge rep={shop?.reputation} />
      </div>

      {/* Divider */}
      <div className="hud2-divider" />

      {/* Quick actions */}
      <div className="hud2-actions">
        <button
          className={`hud2-btn ${tank.autoFeed ? 'hud2-btn--active' : ''}`}
          onClick={onToggleAutoFeed}
          title={tank.autoFeed ? 'Auto-feed ON' : 'Auto-feed OFF'}
        >
          🍤 <span className="hud2-btn-label">{tank.autoFeed ? 'Auto ✓' : 'Auto'}</span>
        </button>

        {tempBad && (
          <button
            className="hud2-btn hud2-btn--warn"
            onClick={onUseHeater}
            disabled={(tank.supplies?.heater || 0) <= 0}
            title={`Adjust temperature (${tank.supplies?.heater || 0} left)`}
          >
            🌡 <span className="hud2-btn-label">Temp</span>
          </button>
        )}

        {wqBad && (
          <button
            className="hud2-btn hud2-btn--warn"
            onClick={onTreatWater}
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

        {onToggleSound && (
          <button className="hud2-btn hud2-btn--icon" onClick={onToggleSound} title={soundOn ? 'Mute' : 'Unmute'}>
            {soundOn ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </header>
  );
}
