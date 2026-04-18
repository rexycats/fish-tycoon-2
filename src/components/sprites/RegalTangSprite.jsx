import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function RegalTangSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="58" cy="35" rx="34" ry="20" fill="url(#rt_g)"/><path d="M40,22 Q55,30 70,22 Q75,40 70,48 Q55,40 40,48 Q35,35 40,22" fill="rgba(20,20,60,0.6)"/>
      <path d="M35,15 Q55,2 78,15" fill="rgba(40,60,160,0.5)"/><path d="M90,28 L108,20 L108,50 L90,42Z" fill="#f0c020"/>
      <circle cx="35" cy="30" r="4.5" fill="#fff"/><circle cx="35" cy="30" r="2.5" fill="#1a1a1a"/><circle cx="36" cy="29" r="1" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="rt_g" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#4070d0"/><stop offset="100%" stopColor="#2040a0"/></radialGradient></defs>
    </svg>
  );
}
