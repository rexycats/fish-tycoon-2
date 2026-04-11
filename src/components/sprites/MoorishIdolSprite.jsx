import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10} };

function MoorishIdolSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'mi').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size*0.7, H=size;
  const vs = variant==='phantom'?{filter:'saturate(0.4) brightness(0.8)'}:variant==='golden'?{filter:'hue-rotate(15deg) saturate(1.2) brightness(1.1)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 55 80" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`mish-${uid}`} x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/></filter>
        <linearGradient id={`miy-${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffe040"/><stop offset="100%" stopColor="#d4a020"/></linearGradient>
        <radialGradient id={`mis-${uid}`} cx="30%" cy="20%" r="40%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`mia-${uid}`} x="-60%" y="-40%" width="220%" height="180%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="28" cy="42" rx="22" ry="28" fill={aura.color} opacity={aura.opacity} filter={`url(#mia-${uid})`}/>}
      {/* Long dorsal filament */}
      <path d="M30,18 Q32,4 40,0 Q38,8 35,16" fill="rgba(30,30,30,0.7)" stroke="rgba(20,20,20,0.5)" strokeWidth="0.5"/>
      {/* Tail */}
      <path d="M40,42 L52,36 L50,42 L52,48 Z" fill="#1a1a1a" opacity="0.7"/>
      <g filter={`url(#mish-${uid})`}>
        {/* Body — tall oval */}
        <ellipse cx="28" cy="42" rx="18" ry="24" fill={`url(#miy-${uid})`}/>
        {/* Black bands */}
        <path d="M12,30 Q20,28 28,28 Q28,56 12,54 Z" fill="#1a1a1a" opacity="0.85"/>
        <path d="M34,30 Q40,32 42,42 Q40,52 34,54 Q36,46 36,42 Q36,36 34,30 Z" fill="#1a1a1a" opacity="0.8"/>
        {/* White snout band */}
        <path d="M10,34 Q14,32 16,34 Q14,40 10,38 Z" fill="white" opacity="0.9"/>
        <ellipse cx="26" cy="50" rx="10" ry="4" fill="rgba(255,240,180,0.15)"/>
      </g>
      {/* Anal fin */}
      <path d="M18,64 Q22,72 30,66 Q26,70 20,66 Z" fill="#1a1a1a" opacity="0.6"/>
      <ellipse cx="28" cy="42" rx="18" ry="24" fill={`url(#mis-${uid})`}/>
      {/* Eye */}
      <circle cx="14" cy="38" r="3.5" fill="#1a1020"/><circle cx="14" cy="38" r="2.2" fill="#302020"/>
      <circle cx="14" cy="38" r="1.5" fill="#ffa020" opacity="0.4"/>
      <circle cx="12.8" cy="36.8" r="1.2" fill="white" opacity="0.85"/>
      <ellipse cx="28" cy="76" rx="14" ry="1.5" fill="#000" opacity="0.07"/>
      {selected&&<ellipse cx="28" cy="42" rx="24" ry="30" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(MoorishIdolSprite);
