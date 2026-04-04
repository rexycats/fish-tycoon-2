import React from 'react';

function TempDisplay({ temp }) {
  const t = temp ?? 74;
  const stress = t < 65 || t > 85;
  const warn   = t < 68 || t > 82;
  const color  = stress ? '#e05050' : warn ? '#e0c040' : '#5dbe8a';
  return (
    <div className="hud-temp" title={`Temperature: ${t.toFixed(1)}°F`}>
      <span className="hud-stat-icon" style={{ fontSize: 14 }}>🌡</span>
      <span className="hud-stat-val" style={{ color, fontSize: 13 }}>{Math.round(t)}°F</span>
    </div>
  );
}

function HappinessMeter({ value }) {
  const clamped = Math.max(0, Math.min(100, value ?? 100));
  const color = clamped > 70 ? '#5dbe8a' : clamped > 40 ? '#e0c040' : '#e05050';
  const emoji = clamped > 70 ? '😊' : clamped > 40 ? '😐' : '😟';
  return (
    <div className="hud-happiness" title={`Happiness: ${clamped}%`}>
      <span className="hud-stat-icon">{emoji}</span>
      <div className="happiness-bar-bg">
        <div className="happiness-bar-fill" style={{ width: `${clamped}%`, background: color, transition: 'width 0.6s ease, background 0.4s ease' }} />
      </div>
      <span className="happiness-val" style={{ color }}>{clamped}%</span>
    </div>
  );
}

export default function HUD({ player, tanks, activeTank, fish, onBuyFood, onTreatWater, onToggleAutoFeed, onUseHeater, soundOn, onToggleSound }) {
  const tank = activeTank || tanks?.[0] || {};
  const wq = Math.round(tank.waterQuality ?? 100);
  const wqColor = wq > 70 ? '#5dbe8a' : wq > 40 ? '#e0c040' : '#e05050';
  const tankFishCount = fish ? fish.filter(f => f.tankId === tank.id).length : 0;

  return (
    <header className="hud">
      <div className="hud-brand">
        <span className="hud-logo">🐠</span>
        <span className="hud-title">Fish Tycoon 2</span>
      </div>

      <div className="hud-stats">
        <div className="hud-stat">
          <span className="hud-stat-icon">🪙</span>
          <span className="hud-stat-val">{player.coins}</span>
        </div>
        <div className="hud-stat" title="Water Quality (active tank)">
          <span className="hud-stat-icon">💧</span>
          <span className="hud-stat-val" style={{ color: wqColor }}>{wq}%</span>
        </div>
        <div className="hud-stat" title="Fish in active tank">
          <span className="hud-stat-icon">🐟</span>
          <span className="hud-stat-val">{tankFishCount} / {tank.capacity ?? 12}</span>
        </div>
        <div className="hud-stat" title="Food supply (active tank)">
          <span className="hud-stat-icon">🍤</span>
          <span className="hud-stat-val">{tank.supplies?.food ?? 0}</span>
        </div>
      </div>

      <HappinessMeter value={tank.happiness} />
      <TempDisplay temp={tank.temperature} />

      <div className="hud-actions">
        <button
          className={`btn btn-sm btn-autofeed ${tank.autoFeed ? 'active' : ''}`}
          onClick={onToggleAutoFeed}
          title={tank.autoFeed ? 'Auto-feed is ON — click to disable' : 'Enable auto-feed (uses food supply)'}
        >
          {tank.autoFeed ? '🍤 Auto: ON' : '🍤 Auto: OFF'}
        </button>
        {((tank.temperature ?? 74) < 68 || (tank.temperature ?? 74) > 82) && (
          <button className="btn btn-sm btn-warn" onClick={onUseHeater}
                  disabled={(tank.supplies?.heater || 0) <= 0} title={`Heater: ${tank.supplies?.heater || 0} left`}>
            🌡 Adjust Temp
          </button>
        )}
        {wq < 60 && (
          <button className="btn btn-sm btn-warn" onClick={onTreatWater}
                  disabled={(tank.supplies?.waterTreatment || 0) <= 0} title={`Water treatment: ${tank.supplies?.waterTreatment || 0} left`}>
            🧪 Treat Water
          </button>
        )}
        <button className="btn btn-sm" onClick={onBuyFood} disabled={player.coins < 10} title="Buy food (10 coins)">
          + Food (10🪙)
        </button>
        {onToggleSound && (
          <button className="btn btn-sm btn-sound" onClick={onToggleSound} title={soundOn ? 'Mute sounds' : 'Enable sounds'}>
            {soundOn ? '🔊' : '🔇'}
          </button>
        )}
      </div>
    </header>
  );
}
