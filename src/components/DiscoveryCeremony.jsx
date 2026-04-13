// ============================================================
// DISCOVERY CEREMONY — Theatrical reveal for new species
// ============================================================
import React, { useState, useEffect, useRef } from 'react';

const RARITY_CONFIG = {
  common:    { bg: 'discovery-bg--common',    stars: '★',       color: '#8899aa' },
  uncommon:  { bg: 'discovery-bg--uncommon',  stars: '★★',      color: '#44cc88' },
  rare:      { bg: 'discovery-bg--rare',      stars: '★★★',     color: '#6688ff' },
  epic:      { bg: 'discovery-bg--epic',      stars: '★★★★',    color: '#cc66ff' },
  legendary: { bg: 'discovery-bg--legendary', stars: '★★★★★',   color: '#ffaa33' },
};

export default function DiscoveryCeremony({ species, onDismiss }) {
  const [phase, setPhase] = useState('enter'); // enter | show | exit
  const timerRef = useRef(null);
  const config = RARITY_CONFIG[species?.rarity] || RARITY_CONFIG.common;

  useEffect(() => {
    // enter → show after 0.4s
    const t1 = setTimeout(() => setPhase('show'), 400);
    // auto-dismiss after 4s
    const t2 = setTimeout(() => setPhase('exit'), 4000);
    // remove after exit animation
    const t3 = setTimeout(() => onDismiss?.(), 4500);
    timerRef.current = [t1, t2, t3];
    return () => timerRef.current.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`discovery-ceremony discovery-phase--${phase} ${config.bg}`}
      onClick={() => { setPhase('exit'); setTimeout(() => onDismiss?.(), 500); }}
    >
      <div className="discovery-spotlight" />

      {/* Confetti for rare+ */}
      {['rare', 'epic', 'legendary'].includes(species?.rarity) && (
        <div className="discovery-confetti">
          {Array.from({ length: species.rarity === 'legendary' ? 30 : 15 }).map((_, i) => (
            <span
              key={i}
              className="discovery-confetti-piece"
              style={{
                '--cx': `${10 + Math.random() * 80}%`,
                '--cd': `${0.5 + Math.random() * 1.5}s`,
                '--cr': `${Math.random() * 360}deg`,
                '--cc': ['#ff4466', '#44bbff', '#ffcc33', '#44ff88', '#cc66ff', '#ff8844'][i % 6],
              }}
            />
          ))}
        </div>
      )}

      <div className="discovery-card">
        <div className="discovery-banner">NEW SPECIES!</div>
        <div className="discovery-name" style={{ color: config.color }}>
          {species?.name || 'Unknown'}
        </div>
        <div className="discovery-stars" style={{ color: config.color }}>
          {config.stars}
        </div>
        <div className="discovery-rarity">
          {species?.rarity?.toUpperCase()}
        </div>
        {species?.basePrice > 0 && (
          <div className="discovery-value">Base Value: 🪙{species.basePrice}</div>
        )}
      </div>

      <div className="discovery-tap-hint">tap to continue</div>
    </div>
  );
}
