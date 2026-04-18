import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function FiremouthCichlidSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="35" rx="36" ry="18" fill="url(#fm_g)"/><ellipse cx="45" cy="42" rx="18" ry="8" fill="rgba(240,80,40,0.4)"/>
      <path d="M38,17 Q55,4 75,17" fill="rgba(200,160,100,0.5)"/><path d="M94,28 L112,20 L112,50 L94,42Z" fill="rgba(200,160,100,0.5)"/>
      <circle cx="38" cy="30" r="5" fill="#fff"/><circle cx="38" cy="30" r="3" fill="#1a1a1a"/><circle cx="39" cy="29" r="1.2" fill="rgba(255,255,255,0.8)"/>
      <defs><radialGradient id="fm_g" cx="0.4" cy="0.4"><stop offset="0%" stopColor="#c8a870"/><stop offset="60%" stopColor="#a08050"/><stop offset="100%" stopColor="#806040"/></radialGradient></defs>
    </svg>
  );
}
