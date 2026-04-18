import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';

export default function PlecoSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.5;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 60" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="50" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="52" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      {/* Shadow */}
      <ellipse cx="60" cy="56" rx="38" ry="4" fill="rgba(0,0,0,0.15)" />
      {/* Body — flat bottom, armored */}
      <ellipse cx="60" cy="35" rx="42" ry="16" fill="url(#plecoBody)" />
      {/* Armor plates */}
      {[0,1,2,3,4,5].map(i => <line key={i} x1={28+i*14} y1={22} x2={28+i*14} y2={48} stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />)}
      {/* Spots */}
      {[{x:40,y:30},{x:55,y:28},{x:70,y:31},{x:45,y:40},{x:65,y:42},{x:80,y:35}].map((s,i) =>
        <circle key={i} cx={s.x} cy={s.y} r="2.5" fill="rgba(90,70,40,0.4)" />
      )}
      {/* Sucker mouth */}
      <ellipse cx="20" cy="38" rx="6" ry="5" fill="#4a3a25" stroke="#3a2a18" strokeWidth="0.8" />
      <ellipse cx="20" cy="38" rx="3" ry="3" fill="#3a2a18" />
      {/* Dorsal fin */}
      <path d="M45,19 Q55,6 70,19" fill="rgba(80,60,35,0.7)" stroke="rgba(60,40,20,0.5)" strokeWidth="0.5" />
      {/* Tail */}
      <path d="M100,30 L115,22 L115,48 L100,40Z" fill="rgba(80,60,35,0.7)" />
      {/* Eye */}
      <circle cx="28" cy="30" r="4" fill="#1a1a10" />
      <circle cx="29" cy="29" r="1.5" fill="rgba(255,255,255,0.7)" />
      {/* Belly highlight */}
      <ellipse cx="60" cy="44" rx="30" ry="5" fill="rgba(180,160,120,0.2)" />
      <defs>
        <radialGradient id="plecoBody" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#7a6a45" />
          <stop offset="100%" stopColor="#4a3a25" />
        </radialGradient>
      </defs>
    </svg>
  );
}
