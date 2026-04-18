import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function CardinalTetraSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="55" cy="30" rx="30" ry="12" fill="url(#ct_g)"/><rect x="30" y="26" width="35" height="3" rx="1.5" fill="#e03030" opacity="0.7"/>
      <path d="M38,18 Q48,10 58,18" fill="rgba(100,180,255,0.3)"/><path d="M82,24 L96,18 L96,42 L82,36Z" fill="rgba(200,60,60,0.4)"/>
      <circle cx="32" cy="28" r="3.5" fill="#fff"/><circle cx="32" cy="28" r="2" fill="#1a1a1a"/><circle cx="33" cy="27" r="0.8" fill="rgba(255,255,255,0.8)"/>
      <defs><linearGradient id="ct_g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2060d0"/><stop offset="45%" stopColor="#3080e0"/><stop offset="55%" stopColor="#e04040"/><stop offset="100%" stopColor="#e06060"/></linearGradient></defs>
    </svg>
  );
}
