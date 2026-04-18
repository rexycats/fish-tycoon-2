import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function DwarfGouramiSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.6;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 72" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="38" rx="46" ry="24" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="38" rx="48" ry="26" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="64" rx="30" ry="3" fill="rgba(0,0,0,0.12)" />
      {/* Body — round, deep */}
      <ellipse cx="58" cy="38" rx="38" ry="22" fill="url(#dgBody)" />
      {/* Diagonal stripes */}
      {[0,1,2,3,4,5,6].map(i => <line key={i} x1={28+i*10} y1={18} x2={22+i*10} y2={58} stroke="rgba(220,80,30,0.35)" strokeWidth="3" />)}
      {/* Dorsal */}
      <path d="M35,16 Q55,2 78,16" fill="rgba(40,100,200,0.5)" />
      {/* Anal fin */}
      <path d="M35,58 Q55,70 78,58" fill="rgba(40,100,200,0.4)" />
      {/* Tail */}
      <path d="M94,30 L112,22 L112,54 L94,46Z" fill="rgba(60,120,200,0.6)" />
      {/* Feeler fins */}
      <line x1="45" y1="48" x2="38" y2="66" stroke="rgba(220,120,40,0.6)" strokeWidth="1.5" />
      {/* Eye */}
      <circle cx="28" cy="34" r="5" fill="#fff" />
      <circle cx="28" cy="34" r="3" fill="#c02020" />
      <circle cx="29" cy="33" r="1.2" fill="rgba(255,255,255,0.8)" />
      <defs>
        <radialGradient id="dgBody" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#4090d0" />
          <stop offset="70%" stopColor="#3070b0" />
          <stop offset="100%" stopColor="#205090" />
        </radialGradient>
      </defs>
    </svg>
  );
}
