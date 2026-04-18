import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function FlameTetraSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="55" cy="30" rx="28" ry="14" fill="url(#ft_g)"/>
      <path d="M38,16 Q48,8 60,16" fill="rgba(240,120,40,0.5)"/><path d="M80,24 L96,16 L96,44 L80,36Z" fill="rgba(240,120,40,0.6)"/><path d="M38,44 Q48,54 60,44" fill="rgba(240,120,40,0.5)"/>
      <circle cx="34" cy="28" r="3.5" fill="#fff"/><circle cx="34" cy="28" r="2" fill="#1a1a1a"/><circle cx="35" cy="27" r="0.8" fill="rgba(255,255,255,0.8)"/>
      <defs><linearGradient id="ft_g" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#f08040"/><stop offset="50%" stopColor="#e06030"/><stop offset="100%" stopColor="#c04020"/></linearGradient></defs>
    </svg>
  );
}
