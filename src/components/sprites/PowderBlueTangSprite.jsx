import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function PowderBlueTangSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="58" cy="35" rx="34" ry="20" fill="url(#pbt_g)"/><path d="M25,35 Q30,30 25,25" fill="#f0c020" stroke="#d0a020" strokeWidth="1"/>
      <path d="M35,15 Q55,2 78,15" fill="rgba(100,190,230,0.5)"/><path d="M35,55 Q55,68 78,55" fill="rgba(100,190,230,0.4)"/><path d="M90,28 L108,20 L108,50 L90,42Z" fill="rgba(100,190,230,0.6)"/>
      <circle cx="32" cy="32" r="5" fill="#fff"/><circle cx="32" cy="32" r="3" fill="#1a1a1a"/><circle cx="33" cy="31" r="1.2" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="pbt_g" cx="0.4" cy="0.35"><stop offset="0%" stopColor="#80d0f0"/><stop offset="100%" stopColor="#50a0d0"/></radialGradient></defs>
    </svg>
  );
}
