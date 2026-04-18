import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function WolfEelSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <path d="M20,35 Q40,20 60,30 Q80,40 100,35 Q110,32 115,35 Q110,38 100,40 Q80,45 60,38 Q40,30 20,40Z" fill="url(#we_g)"/>
      {[{x:35,y:32},{x:50,y:28},{x:65,y:34},{x:80,y:30},{x:95,y:36}].map((s,i)=>
        <circle key={i} cx={s.x} cy={s.y} r="2" fill="rgba(60,60,80,0.25)"/>
      )}
      <path d="M30,24 Q50,12 70,20 Q90,14 105,22" fill="rgba(120,110,130,0.4)"/>
      <path d="M30,48 Q50,56 70,48" fill="rgba(120,110,130,0.3)"/>
      <circle cx="24" cy="33" r="4" fill="#e0d8c0"/>
      <circle cx="24" cy="33" r="2.5" fill="#1a1a1a"/>
      <circle cx="25" cy="32" r="1" fill="rgba(255,255,255,0.6)"/>
      <path d="M18,38 Q22,42 28,38" fill="none" stroke="rgba(60,50,40,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
      <defs>
        <linearGradient id="we_g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#908898"/>
          <stop offset="50%" stopColor="#706878"/>
          <stop offset="100%" stopColor="#585060"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
