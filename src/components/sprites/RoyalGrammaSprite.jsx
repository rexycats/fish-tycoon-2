import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';

export default function RoyalGrammaSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.12)" />
      {/* Body — purple front, yellow rear */}
      <ellipse cx="60" cy="35" rx="42" ry="18" fill="url(#rgBody)" />
      {/* Dorsal fin */}
      <path d="M25,18 Q45,2 70,17" fill="rgba(120,40,180,0.6)" stroke="rgba(100,20,160,0.4)" strokeWidth="0.5" />
      {/* Black eye stripe */}
      <line x1="22" y1="24" x2="22" y2="42" stroke="#1a1a1a" strokeWidth="3" opacity="0.7" />
      {/* Tail */}
      <path d="M100,28 L116,20 L116,50 L100,42Z" fill="#e8c020" />
      {/* Pectoral */}
      <path d="M38,38 Q42,48 50,42" fill="rgba(160,80,220,0.4)" />
      {/* Eye */}
      <circle cx="24" cy="32" r="5" fill="#fff" />
      <circle cx="24" cy="32" r="3" fill="#1a1a1a" />
      <circle cx="25" cy="31" r="1.2" fill="rgba(255,255,255,0.8)" />
      {/* Specular */}
      <ellipse cx="50" cy="28" rx="15" ry="4" fill="rgba(255,255,255,0.12)" />
      <defs>
        <linearGradient id="rgBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8030c0" />
          <stop offset="50%" stopColor="#9040d0" />
          <stop offset="55%" stopColor="#e0c020" />
          <stop offset="100%" stopColor="#e8d040" />
        </linearGradient>
      </defs>
    </svg>
  );
}
