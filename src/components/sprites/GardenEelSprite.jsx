import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function GardenEelSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.55;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 66" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="35" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="35" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="58" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <path d="M60,58 Q58,40 62,25 Q65,15 60,8" fill="none" stroke="url(#ge_g)" strokeWidth="10" strokeLinecap="round"/><path d="M60,58 Q58,40 62,25 Q65,15 60,8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeLinecap="round"/>
      
      <circle cx="58" cy="12" r="3" fill="#fff"/><circle cx="58" cy="12" r="1.8" fill="#1a1a1a"/><circle cx="59" cy="11" r="0.8" fill="rgba(255,255,255,0.7)"/><path d="M55,16 Q58,18 61,16" fill="none" stroke="rgba(80,60,40,0.4)" strokeWidth="0.8" strokeLinecap="round"/>
      <defs><linearGradient id="ge_g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c8b890"/><stop offset="50%" stopColor="#a89870"/><stop offset="100%" stopColor="#887858"/></linearGradient></defs>
    </svg>
  );
}
