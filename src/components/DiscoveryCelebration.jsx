// ============================================================
// DISCOVERY CELEBRATION — Theatric reveal when new species found
// ============================================================
import React, { useState, useEffect } from 'react';

const RARITY_CONFIG = {
  common:    { bg: 'rgba(80,160,255,0.08)',  border: 'rgba(80,160,255,0.25)',  stars: '⭐',     glow: '#4488ff' },
  uncommon:  { bg: 'rgba(80,200,120,0.08)',  border: 'rgba(80,200,120,0.25)',  stars: '⭐⭐',   glow: '#44cc88' },
  rare:      { bg: 'rgba(160,100,255,0.08)', border: 'rgba(160,100,255,0.25)', stars: '⭐⭐⭐',  glow: '#aa66ff' },
  epic:      { bg: 'rgba(255,180,40,0.08)',  border: 'rgba(255,180,40,0.25)',  stars: '⭐⭐⭐⭐', glow: '#ffbb33' },
  legendary: { bg: 'rgba(255,100,60,0.08)',  border: 'rgba(255,100,60,0.25)',  stars: '⭐⭐⭐⭐⭐', glow: '#ff6644' },
};

export default function DiscoveryCelebration({ species, onDismiss }) {
  const [phase, setPhase] = useState('enter'); // enter | show | exit

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 100);
    const t2 = setTimeout(() => setPhase('exit'), 3500);
    const t3 = setTimeout(() => onDismiss?.(), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (!species) return null;
  const cfg = RARITY_CONFIG[species.rarity] || RARITY_CONFIG.common;

  return (
    <div className={`disc-overlay disc-overlay--${phase}`} onClick={() => { setPhase('exit'); setTimeout(onDismiss, 400); }}>
      <div className={`disc-card disc-card--${species.rarity}`} style={{ '--disc-glow': cfg.glow }}>
        <div className="disc-badge">NEW SPECIES</div>
        <div className="disc-name">{species.name}</div>
        <div className="disc-stars">{cfg.stars}</div>
        <div className="disc-rarity">{species.rarity?.toUpperCase()}</div>
        {species.basePrice && (
          <div className="disc-value">Base value: 🪙{species.basePrice}</div>
        )}
        <div className="disc-hint">Tap to continue</div>
      </div>
      {/* Confetti particles for rare+ */}
      {['rare', 'epic', 'legendary'].includes(species.rarity) && (
        <div className="disc-confetti">
          {Array.from({ length: species.rarity === 'legendary' ? 20 : species.rarity === 'epic' ? 12 : 6 }).map((_, i) => (
            <span key={i} className="disc-confetti-piece" style={{
              '--cx': `${10 + Math.random() * 80}%`,
              '--cy': `${Math.random() * 100}%`,
              '--cd': `${0.8 + Math.random() * 1.5}s`,
              '--cr': `${Math.random() * 360}deg`,
              '--cc': ['#ff6644', '#ffbb33', '#aa66ff', '#44ccff', '#44dd99', '#ff88aa'][i % 6],
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
