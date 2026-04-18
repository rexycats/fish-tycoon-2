import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function SunburstAnthiasSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="58" cy="35" rx="32" ry="17" fill="url(#sba_g)"/><ellipse cx="58" cy="42" rx="22" ry="6" fill="rgba(255,180,100,0.2)"/>
      <path d="M35,18 Q50,4 70,18" fill="rgba(255,140,80,0.5)"/><path d="M35,52 Q50,64 70,52" fill="rgba(255,140,80,0.4)"/><path d="M88,28 L104,20 L104,50 L88,42Z" fill="rgba(255,160,100,0.6)"/><path d="M55,18 Q58,6 60,18" fill="rgba(255,140,80,0.6)" strokeWidth="1"/>
      <circle cx="34" cy="32" r="4.5" fill="#fff"/><circle cx="34" cy="32" r="2.5" fill="#e06080"/><circle cx="35" cy="31" r="1" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="sba_g" cx="0.35" cy="0.4"><stop offset="0%" stopColor="#ffa060"/><stop offset="100%" stopColor="#e07840"/></radialGradient></defs>
    </svg>
  );
}
