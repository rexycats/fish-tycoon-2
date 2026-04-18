import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function EmeraldCrabSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.6;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 72" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="38" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="38" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="64" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="38" rx="28" ry="22" fill="url(#ec_g)"/><ellipse cx="60" cy="44" rx="20" ry="8" fill="rgba(40,160,100,0.2)"/>
      <path d="M32,30 Q20,18 18,28 Q16,32 22,34" fill="#40a870" stroke="#308858" strokeWidth="1"/><path d="M88,30 Q100,18 102,28 Q104,32 98,34" fill="#40a870" stroke="#308858" strokeWidth="1"/><circle cx="18" cy="26" r="3" fill="#308858"/><circle cx="102" cy="26" r="3" fill="#308858"/>
      <circle cx="48" cy="28" r="3" fill="#fff"/><circle cx="48" cy="28" r="1.8" fill="#1a1a1a"/><circle cx="72" cy="28" r="3" fill="#fff"/><circle cx="72" cy="28" r="1.8" fill="#1a1a1a"/>
      <defs><radialGradient id="ec_g" cx="0.45" cy="0.4"><stop offset="0%" stopColor="#50c888"/><stop offset="100%" stopColor="#308858"/></radialGradient></defs>
    </svg>
  );
}
