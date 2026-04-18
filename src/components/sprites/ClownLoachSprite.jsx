import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';

export default function ClownLoachSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="50" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="52" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="35" ry="4" fill="rgba(0,0,0,0.12)" />
      {/* Body */}
      <ellipse cx="60" cy="35" rx="44" ry="18" fill="#f0a030" />
      {/* Black bands */}
      <path d="M30,18 Q32,35 30,52" stroke="#1a1a1a" strokeWidth="10" fill="none" opacity="0.85" />
      <path d="M55,17 Q57,35 55,53" stroke="#1a1a1a" strokeWidth="8" fill="none" opacity="0.85" />
      <path d="M78,20 Q80,35 78,50" stroke="#1a1a1a" strokeWidth="9" fill="none" opacity="0.85" />
      {/* Belly glow */}
      <ellipse cx="60" cy="45" rx="30" ry="8" fill="rgba(255,220,120,0.3)" />
      {/* Dorsal */}
      <path d="M40,17 Q55,4 72,17" fill="rgba(240,160,40,0.7)" stroke="rgba(200,120,20,0.5)" strokeWidth="0.5" />
      {/* Tail */}
      <path d="M102,28 L118,18 L118,52 L102,42Z" fill="#e89020" />
      <path d="M108,23 L118,18" stroke="#1a1a1a" strokeWidth="3" opacity="0.6" />
      <path d="M108,47 L118,52" stroke="#1a1a1a" strokeWidth="3" opacity="0.6" />
      {/* Red fins */}
      <path d="M42,50 Q48,60 58,50" fill="rgba(220,60,30,0.6)" />
      {/* Eye */}
      <circle cx="24" cy="32" r="5" fill="#fff" />
      <circle cx="24" cy="32" r="3" fill="#1a1a1a" />
      <circle cx="25" cy="31" r="1.2" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}
