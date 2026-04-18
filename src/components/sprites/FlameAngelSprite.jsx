import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function FlameAngelSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.6;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 72" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="58" cy="38" rx="46" ry="24" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="58" cy="38" rx="48" ry="26" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="58" cy="64" rx="28" ry="3" fill="rgba(0,0,0,0.12)" />
      <ellipse cx="58" cy="38" rx="36" ry="22" fill="#e85020" />
      {/* Black vertical bars */}
      {[0,1,2,3,4].map(i => <line key={i} x1={35+i*11} y1={18} x2={35+i*11} y2={58} stroke="#1a1a1a" strokeWidth="2.5" opacity="0.6" />)}
      {/* Blue-edged dorsal */}
      <path d="M30,16 Q50,0 76,16" fill="#e85020" stroke="#2060d0" strokeWidth="2" />
      {/* Blue-edged anal */}
      <path d="M30,58 Q50,72 76,58" fill="#e85020" stroke="#2060d0" strokeWidth="2" />
      {/* Tail */}
      <path d="M92,30 L110,20 L110,56 L92,46Z" fill="#e06020" stroke="#2060d0" strokeWidth="1" />
      {/* Eye */}
      <circle cx="30" cy="35" r="5" fill="#fff" />
      <circle cx="30" cy="35" r="3" fill="#1a1a1a" />
      <circle cx="31" cy="34" r="1.2" fill="rgba(255,255,255,0.8)" />
      {/* Specular */}
      <ellipse cx="52" cy="30" rx="14" ry="5" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}
