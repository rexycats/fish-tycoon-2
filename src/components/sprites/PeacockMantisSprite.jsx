import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function PeacockMantisSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="35" rx="34" ry="14" fill="url(#pm_g)"/><ellipse cx="60" cy="40" rx="26" ry="6" fill="rgba(60,200,140,0.2)"/>
      <path d="M96,28 L112,22 L112,48 L96,42Z" fill="url(#pm_tail)"/><path d="M28,28 Q18,20 16,30" fill="#40c8a0" stroke="#30a080" strokeWidth="1"/><path d="M26,32 Q14,24 12,35" fill="#40c8a0" stroke="#30a080" strokeWidth="1"/>
      <circle cx="32" cy="30" r="5" fill="#fff"/><circle cx="32" cy="30" r="3" fill="#2060a0"/><circle cx="33" cy="29" r="1.2" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="pm_g" cx="0.4" cy="0.4"><stop offset="0%" stopColor="#50d0a0"/><stop offset="50%" stopColor="#40b888"/><stop offset="100%" stopColor="#308868"/></radialGradient><linearGradient id="pm_tail" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#40c0a0"/><stop offset="50%" stopColor="#e06050"/><stop offset="100%" stopColor="#f0a040"/></linearGradient></defs>
    </svg>
  );
}
