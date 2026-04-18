import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function FrogfishSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.6;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 72" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="38" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="38" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="64" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="58" cy="38" rx="30" ry="24" fill="url(#ff_g)"/>{[{x:45,y:28},{x:55,y:25},{x:65,y:30},{x:50,y:42},{x:62,y:45},{x:72,y:36}].map((s,i)=><circle key={i} cx={s.x} cy={s.y} r="3" fill="rgba(180,120,60,0.3)"/>)}
      <path d="M30,42 Q25,50 35,50" fill="rgba(200,140,70,0.6)"/><path d="M82,42 Q88,50 80,50" fill="rgba(200,140,70,0.6)"/><path d="M50,14 Q55,6 58,14" fill="rgba(200,140,70,0.7)" stroke="rgba(180,120,50,0.5)" strokeWidth="1"/>
      <circle cx="42" cy="26" r="5" fill="#fff"/><circle cx="42" cy="26" r="3" fill="#f0c020"/><circle cx="42" cy="26" r="1.5" fill="#1a1a1a"/>
      <defs><radialGradient id="ff_g" cx="0.4" cy="0.4"><stop offset="0%" stopColor="#d8a860"/><stop offset="100%" stopColor="#a07840"/></radialGradient></defs>
    </svg>
  );
}
