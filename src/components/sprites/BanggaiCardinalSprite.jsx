import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function BanggaiCardinalSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.65;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 78" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="58" cy="40" rx="44" ry="26" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="58" cy="40" rx="46" ry="28" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="58" cy="70" rx="26" ry="3" fill="rgba(0,0,0,0.12)" />
      {/* Body — silver/white */}
      <ellipse cx="58" cy="40" rx="34" ry="20" fill="#d0d4d8" />
      {/* Black vertical bars */}
      <line x1="35" y1="20" x2="35" y2="60" stroke="#1a1a1a" strokeWidth="4" />
      <line x1="58" y1="20" x2="58" y2="60" stroke="#1a1a1a" strokeWidth="4" />
      <line x1="80" y1="22" x2="80" y2="58" stroke="#1a1a1a" strokeWidth="3" />
      {/* White spots on dark areas */}
      {[{x:36,y:32},{x:36,y:48},{x:59,y:30},{x:59,y:50},{x:81,y:35},{x:81,y:45}].map((s,i) =>
        <circle key={i} cx={s.x} cy={s.y} r="2" fill="rgba(255,255,255,0.7)" />
      )}
      {/* Tall dorsal */}
      <path d="M40,20 Q55,0 72,20" fill="rgba(30,30,30,0.6)" />
      {/* Long anal */}
      <path d="M40,58 Q55,76 72,58" fill="rgba(30,30,30,0.5)" />
      {/* Forked tail */}
      <path d="M90,32 L108,16 L105,40 L108,64 L90,48Z" fill="rgba(180,185,190,0.7)" />
      {/* Eye */}
      <circle cx="30" cy="38" r="6" fill="#fff" />
      <circle cx="30" cy="38" r="3.5" fill="#1a1a1a" />
      <circle cx="31" cy="37" r="1.5" fill="rgba(255,255,255,0.8)" />
    </svg>
  );
}
