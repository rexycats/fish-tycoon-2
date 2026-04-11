// ============================================================
// FISH TYCOON — DiscusSprite
// Round disc body, vibrant vertical stripes, tall fins
// ============================================================
import React, { memo } from 'react';

const RARITY_AURA = {
  common: null, uncommon: { color:'#78c8ff', opacity:0.20, blur:6 },
  rare: { color:'#c878ff', opacity:0.28, blur:8 }, epic: { color:'#ffe040', opacity:0.40, blur:10 },
};

function DiscusSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  const uid = (fish?.id || 'dc').slice(0, 8);
  const rarity = fish?.species?.rarity || 'rare';
  const aura = RARITY_AURA[rarity];
  const variant = fish?.colorVariant || 'default';
  const W = size;
  const H = size * 0.95;

  const variantStyle = variant === 'cobalt' ? { filter: 'hue-rotate(-60deg) saturate(1.4)' }
    : variant === 'pigeon' ? { filter: 'hue-rotate(30deg) saturate(0.8) brightness(1.1)' }
    : variant === 'snakeskin' ? { filter: 'hue-rotate(120deg) saturate(0.9)' }
    : {};

  return (
    <svg width={W} height={H} viewBox="0 0 80 76" onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transform: flipped ? 'scaleX(-1)' : 'none', overflow: 'visible', ...variantStyle }}>
      <defs>
        <filter id={`dcsh-${uid}`} x="-20%" y="-15%" width="140%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/>
        </filter>
        <radialGradient id={`dcbody-${uid}`} cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor="#ff8040"/>
          <stop offset="35%" stopColor="#e06020"/>
          <stop offset="70%" stopColor="#c04010"/>
          <stop offset="100%" stopColor="#801800"/>
        </radialGradient>
        <radialGradient id={`dcspec-${uid}`} cx="25%" cy="18%" r="35%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        {aura && (
          <filter id={`dcaura-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={aura.blur} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
      </defs>

      {aura && <ellipse cx="38" cy="38" rx="32" ry="30" fill={aura.color} opacity={aura.opacity} filter={`url(#dcaura-${uid})`}/>}

      {/* Tail */}
      <path d="M62,38 L76,28 L74,38 L76,48 Z" fill="#c04020" opacity="0.6"/>

      {/* Dorsal fin */}
      <path d="M20,12 Q30,2 45,5 Q55,4 60,10 L58,18 Q45,10 30,12 Z" fill="rgba(200,80,30,0.5)" stroke="rgba(160,50,20,0.3)" strokeWidth="0.5"/>
      {/* Anal fin */}
      <path d="M20,64 Q30,74 45,71 Q55,72 60,66 L58,58 Q45,66 30,64 Z" fill="rgba(200,80,30,0.5)" stroke="rgba(160,50,20,0.3)" strokeWidth="0.5"/>

      <g filter={`url(#dcsh-${uid})`}>
        {/* Disc body */}
        <ellipse cx="38" cy="38" rx="28" ry="26" fill={`url(#dcbody-${uid})`}/>
        {/* Vertical stripes */}
        {[16,22,28,34,40,46,52,58].map((x, i) => (
          <line key={i} x1={x} y1={38-Math.sqrt(Math.max(0,784-(x-38)*(x-38)))*26/28}
            x2={x} y2={38+Math.sqrt(Math.max(0,784-(x-38)*(x-38)))*26/28}
            stroke="rgba(255,200,100,0.25)" strokeWidth="1.5"/>
        ))}
        {/* Belly glow */}
        <ellipse cx="35" cy="48" rx="18" ry="8" fill="rgba(255,180,100,0.15)"/>
      </g>

      {/* Pectoral fin */}
      <path d="M28,36 Q22,42 26,50 Q30,44 32,38" fill="rgba(220,100,40,0.4)"/>

      {/* Specular */}
      <ellipse cx="38" cy="38" rx="28" ry="26" fill={`url(#dcspec-${uid})`}/>

      {/* Eye */}
      <circle cx="22" cy="34" r="4.5" fill="#200a00"/>
      <circle cx="22" cy="34" r="3" fill="#401800"/>
      <circle cx="22" cy="34" r="1.8" fill="#ff4020" opacity="0.5"/>
      <circle cx="20.5" cy="32.5" r="1.5" fill="white" opacity="0.8"/>

      {/* Mouth */}
      <path d="M11,37 Q13,39 11,41" stroke="#601000" strokeWidth="0.8" fill="none"/>

      <ellipse cx="38" cy="72" rx="18" ry="2" fill="#000" opacity="0.08"/>

      {selected && (
        <ellipse cx="38" cy="38" rx="36" ry="34" fill="none" stroke="#f0c040" strokeWidth="1.5"
          strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>
      )}
    </svg>
  );
}

export default memo(DiscusSprite);
