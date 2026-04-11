// ============================================================
// FISH TYCOON — NeonTetraSprite
// Small torpedo body, neon blue lateral stripe, red rear half
// ============================================================
import React, { memo } from 'react';

const RARITY_AURA = {
  common:   null,
  uncommon: { color: '#78c8ff', opacity: 0.20, blur: 6  },
  rare:     { color: '#c878ff', opacity: 0.28, blur: 8  },
  epic:     { color: '#ffe040', opacity: 0.40, blur: 10 },
};

function NeonTetraSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  const uid = (fish?.id || 'nt').slice(0, 8);
  const rarity = fish?.species?.rarity || 'common';
  const aura = RARITY_AURA[rarity];
  const variant = fish?.colorVariant || 'default';
  const W = size;
  const H = size * 0.5;

  const variantStyle = variant === 'gold' ? { filter: 'hue-rotate(40deg) saturate(1.3)' }
    : variant === 'albino' ? { filter: 'saturate(0.3) brightness(1.3)' }
    : variant === 'green' ? { filter: 'hue-rotate(80deg)' }
    : {};

  return (
    <svg width={W} height={H} viewBox="0 0 100 50" onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transform: flipped ? 'scaleX(-1)' : 'none', overflow: 'visible', ...variantStyle }}>
      <defs>
        <filter id={`ntsh-${uid}`} x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/>
        </filter>
        <radialGradient id={`ntbody-${uid}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#e8e8f0"/>
          <stop offset="40%" stopColor="#c0c8d8"/>
          <stop offset="100%" stopColor="#8090a8"/>
        </radialGradient>
        <linearGradient id={`ntstripe-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00b8ff"/>
          <stop offset="50%" stopColor="#0090ff"/>
          <stop offset="100%" stopColor="#0060e0"/>
        </linearGradient>
        <linearGradient id={`ntred-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ff2020"/>
          <stop offset="100%" stopColor="#cc1010"/>
        </linearGradient>
        {aura && (
          <filter id={`ntaura-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={aura.blur} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
        <radialGradient id={`ntspec-${uid}`} cx="30%" cy="20%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.7"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {aura && <ellipse cx="50" cy="25" rx="35" ry="18" fill={aura.color} opacity={aura.opacity} filter={`url(#ntaura-${uid})`}/>}

      {/* Tail fin */}
      <path d="M82,25 L98,14 L95,25 L98,36 Z" fill="#ff3030" opacity="0.7" stroke="#cc2020" strokeWidth="0.5"/>

      <g filter={`url(#ntsh-${uid})`}>
        {/* Body */}
        <ellipse cx="48" cy="25" rx="34" ry="13" fill={`url(#ntbody-${uid})`}/>
        {/* Red rear half */}
        <path d="M50,13 Q70,12 82,25 Q70,38 50,37 Z" fill={`url(#ntred-${uid})`} opacity="0.6"/>
        {/* Neon blue stripe */}
        <path d="M18,24 Q35,22 55,23 Q70,23 82,25" stroke={`url(#ntstripe-${uid})`} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M18,24 Q35,22 55,23 Q70,23 82,25" stroke="rgba(100,200,255,0.5)" strokeWidth="5" fill="none" strokeLinecap="round" style={{filter:'blur(2px)'}}/>
        {/* Belly */}
        <ellipse cx="45" cy="32" rx="22" ry="5" fill="white" opacity="0.15"/>
      </g>

      {/* Dorsal fin */}
      <path d="M38,13 Q42,4 50,12" fill="rgba(200,210,220,0.4)" stroke="rgba(150,160,180,0.3)" strokeWidth="0.5"/>
      {/* Anal fin */}
      <path d="M45,37 Q48,44 55,37" fill="rgba(200,210,220,0.4)" stroke="rgba(150,160,180,0.3)" strokeWidth="0.5"/>

      {/* Specular */}
      <ellipse cx="48" cy="25" rx="34" ry="13" fill={`url(#ntspec-${uid})`}/>

      {/* Eye */}
      <circle cx="22" cy="23" r="3.5" fill="#1a1a30"/>
      <circle cx="22" cy="23" r="2.2" fill="#2a2a50"/>
      <circle cx="20.5" cy="21.5" r="1.2" fill="white" opacity="0.85"/>

      {/* Floor shadow */}
      <ellipse cx="48" cy="46" rx="20" ry="2.5" fill="#000" opacity="0.1"/>

      {selected && (
        <ellipse cx="48" cy="25" rx="40" ry="20" fill="none" stroke="#f0c040" strokeWidth="1.5"
          strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>
      )}
    </svg>
  );
}

export default memo(NeonTetraSprite);
