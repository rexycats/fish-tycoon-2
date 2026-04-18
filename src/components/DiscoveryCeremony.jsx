// ============================================================
// DISCOVERY CEREMONY — Theatrical reveal for new species
// ============================================================
import { IconStar } from './icons/index.js';
import React, { useState, useEffect, useRef } from 'react';
import FishSprite from './FishSprite.jsx';

const RARITY_CONFIG = {
  common:    { bg: 'discovery-bg--common',    stars: 1,       color: '#6a7a88' },
  uncommon:  { bg: 'discovery-bg--uncommon',  stars: 2,      color: '#5aaa70' },
  rare:      { bg: 'discovery-bg--rare',      stars: 3,     color: '#5a8aaa' },
  epic:      { bg: 'discovery-bg--epic',      stars: 4,    color: '#8a70a8' },
  legendary: { bg: 'discovery-bg--legendary', stars: 5,   color: '#d4a843' },
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
                '--cc': ['#c44040', '#5a9aaa', '#d4a843', '#5aaa70', '#8a70a8', '#b07848'][i % 6],
              }}
            />
          ))}
        </div>
      )}

      <div className="discovery-card">
        <div className="discovery-banner">NEW SPECIES!</div>
        <div className="discovery-fish-display">
          <FishSprite
            fish={{
              id: 'discovery-preview',
              stage: 'adult',
              species: { name: species?.name, rarity: species?.rarity, key: species?.key, visualType: species?.visualType },
              phenotype: species?.phenotype || { primaryColor: 'Azure', bodyShape: 'Round', finType: 'Standard', pattern: 'Solid', glow: 'None', size: 'Normal', mutation: 'None' },
            }}
            size={100}
            flipped={false}
            selected={false}
          />
        </div>
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
          <div className="discovery-value">Base Value: {species.basePrice}</div>
        )}
      </div>

      <div className="discovery-tap-hint">tap to continue</div>
    </div>
  );
}
