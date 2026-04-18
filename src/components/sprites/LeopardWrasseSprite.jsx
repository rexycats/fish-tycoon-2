import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function LeopardWrasseSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="35" rx="36" ry="16" fill="url(#lw_g)"/>
      {[{x:38,y:30},{x:48,y:26},{x:58,y:32},{x:68,y:28},{x:78,y:34},{x:43,y:38},{x:55,y:40},{x:65,y:38},{x:75,y:42}].map((s,i)=>
        <circle key={i} cx={s.x} cy={s.y} r="3" fill="rgba(200,60,80,0.35)"/>
      )}
      <path d="M35,19 Q55,5 80,19" fill="rgba(220,100,60,0.4)"/>
      <path d="M94,28 L110,20 L110,50 L94,42Z" fill="rgba(220,160,80,0.5)"/>
      <circle cx="32" cy="32" r="4.5" fill="#fff"/>
      <circle cx="32" cy="32" r="2.5" fill="#1a1a1a"/>
      <circle cx="33" cy="31" r="1" fill="rgba(255,255,255,0.8)"/>
      <defs>
        <radialGradient id="lw_g" cx="0.4" cy="0.4">
          <stop offset="0%" stopColor="#e8c080"/>
          <stop offset="100%" stopColor="#c09050"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
