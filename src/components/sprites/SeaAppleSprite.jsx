import React from 'react';
import { RARITY_AURA } from '../FishSprite.jsx';
export default function SeaAppleSprite({ size = 64, selected = false, rarity = 'common', flip = false }) {
  const w = size, h = size * 0.6;
  const aura = RARITY_AURA[rarity] || '';
  return (
    <svg width={w} height={h} viewBox="0 0 120 72" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      {aura && <ellipse cx="60" cy="38" rx="48" ry="22" fill="none" stroke={aura} strokeWidth="2" opacity="0.5" />}
      {selected && <ellipse cx="60" cy="38" rx="50" ry="24" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.6" />}
      <ellipse cx="60" cy="64" rx="32" ry="3" fill="rgba(0,0,0,0.1)" />
      <ellipse cx="60" cy="38" rx="26" ry="22" fill="url(#sa_g)"/><line x1="60" y1="38" x2="84.0" y2="38.0" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <line x1="60" y1="38" x2="71.9" y2="55.3" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <line x1="60" y1="38" x2="47.9" y2="55.3" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <line x1="60" y1="38" x2="36.0" y2="37.8" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <line x1="60" y1="38" x2="48.2" y2="20.6" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <line x1="60" y1="38" x2="72.3" y2="20.8" stroke="rgba(180,100,200,0.2)" strokeWidth="2"/>
      <g><path d="M60,16 Q55,4 68.0,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q57,5 65.0,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q59,6 58.2,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q61,7 52.8,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q63,8 52.8,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q65,9 58.3,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q67,10 65.1,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M60,16 Q69,11 68.0,8" fill="none" stroke="rgba(200,120,240,0.5)" strokeWidth="1.5" strokeLinecap="round"/></g>
      
      <defs><radialGradient id="sa_g" cx="0.45" cy="0.4"><stop offset="0%" stopColor="#d080e0"/><stop offset="50%" stopColor="#a060c0"/><stop offset="100%" stopColor="#704898"/></radialGradient></defs>
    </svg>
  );
}
