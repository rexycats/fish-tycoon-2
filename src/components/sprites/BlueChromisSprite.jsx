import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function BlueChromisSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="35" rx="32" ry="16" fill="url(#bc_g)"/><ellipse cx="60" cy="40" rx="24" ry="8" fill="rgba(100,180,255,0.2)"/>
      <path d="M40,20 Q52,6 68,20" fill="rgba(80,160,240,0.5)"/><path d="M88,28 L105,20 L105,50 L88,42Z" fill="rgba(80,160,240,0.6)"/>
      <circle cx="35" cy="32" r="4" fill="#fff"/><circle cx="35" cy="32" r="2.5" fill="#1a1a1a"/><circle cx="36" cy="31" r="1" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="bc_g" cx="0.4" cy="0.4"><stop offset="0%" stopColor="#60b0f0"/><stop offset="100%" stopColor="#3080d0"/></radialGradient></defs>
    </svg>
  );
}
