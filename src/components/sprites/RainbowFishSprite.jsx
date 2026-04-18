import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function RainbowFishSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="60" cy="35" rx="40" ry="18" fill="url(#rbBody)" />
      {/* Iridescent scale lines */}
      {[24,28,32,36,40,44].map(y => <line key={y} x1="25" y1={y} x2="95" y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />)}
      <path d="M35,17 Q55,4 75,17" fill="rgba(40,140,220,0.5)" />
      <path d="M98,28 L114,18 L114,52 L98,42Z" fill="url(#rbTail)" />
      <path d="M38,50 Q48,60 58,48" fill="rgba(255,180,40,0.4)" />
      <circle cx="24" cy="32" r="5" fill="#fff" />
      <circle cx="24" cy="32" r="3" fill="#1a1a1a" />
      <circle cx="25" cy="31" r="1.2" fill="rgba(255,255,255,0.8)" />
      <ellipse cx="55" cy="28" rx="18" ry="5" fill="rgba(255,255,255,0.15)" />
      <defs>
        <linearGradient id="rbBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3090e0" />
          <stop offset="30%" stopColor="#40c0a0" />
          <stop offset="60%" stopColor="#e0c040" />
          <stop offset="100%" stopColor="#e08030" />
        </linearGradient>
        <linearGradient id="rbTail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4090d0" />
          <stop offset="100%" stopColor="#e08030" />
        </linearGradient>
      </defs>
    </svg>
  );
}
