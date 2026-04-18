import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function HarlequinRasboraSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.5;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 110 55" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="55" cy="30" rx="46" ry="20" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="55" cy="30" rx="48" ry="22" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="55" cy="50" rx="30" ry="3" fill="rgba(0,0,0,0.12)" />
      {/* Body — coppery orange */}
      <ellipse cx="55" cy="30" rx="38" ry="15" fill="#e0a060" />
      {/* Signature black triangle patch */}
      <polygon points="55,24 82,30 55,42" fill="#1a1a1a" opacity="0.85" />
      {/* Pink/rose tint on back */}
      <ellipse cx="45" cy="24" rx="20" ry="6" fill="rgba(220,100,80,0.3)" />
      {/* Dorsal */}
      <path d="M40,15 Q50,6 62,15" fill="rgba(220,140,80,0.5)" />
      {/* Tail */}
      <path d="M92,24 L108,16 L108,44 L92,36Z" fill="rgba(200,120,60,0.6)" />
      {/* Eye */}
      <circle cx="24" cy="28" r="4" fill="#fff" />
      <circle cx="24" cy="28" r="2.5" fill="#1a1a1a" />
      <circle cx="25" cy="27" r="1" fill="rgba(255,255,255,0.8)" />
      {/* Specular */}
      <ellipse cx="45" cy="24" rx="14" ry="4" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}
