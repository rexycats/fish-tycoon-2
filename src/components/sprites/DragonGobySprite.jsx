import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function DragonGobySprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="35" rx="42" ry="12" fill="url(#dg_g)"/>{[0,1,2,3,4,5,6].map(i=><line key={i} x1={25+i*12} y1={24} x2={25+i*12} y2={46} stroke="rgba(100,80,140,0.15)" strokeWidth="0.8"/>)}
      <path d="M25,23 Q55,8 90,23" fill="rgba(130,100,170,0.4)"/><path d="M100,28 L116,22 L116,48 L100,42Z" fill="rgba(130,100,170,0.5)"/>
      <circle cx="24" cy="32" r="2.5" fill="#e8e0d0"/><circle cx="24" cy="32" r="1.2" fill="#1a1a1a"/>
      <defs><radialGradient id="dg_g" cx="0.4" cy="0.4"><stop offset="0%" stopColor="#8878a8"/><stop offset="100%" stopColor="#605080"/></radialGradient></defs>
    </svg>
  );
}
