import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10} };

function TriggerSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'tr').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size, H=size*0.75;
  const vs = variant==='niger'?{filter:'hue-rotate(180deg) brightness(0.7)'}:variant==='sunset'?{filter:'hue-rotate(-20deg) saturate(1.4)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 90 68" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`trsh-${uid}`} x="-15%" y="-15%" width="130%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/></filter>
        <radialGradient id={`trb-${uid}`} cx="32%" cy="28%" r="65%"><stop offset="0%" stopColor="#40c0e0"/><stop offset="40%" stopColor="#2090b0"/><stop offset="100%" stopColor="#105060"/></radialGradient>
        <radialGradient id={`trs-${uid}`} cx="28%" cy="20%" r="38%"><stop offset="0%" stopColor="white" stopOpacity="0.55"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`tra-${uid}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="42" cy="34" rx="34" ry="24" fill={aura.color} opacity={aura.opacity} filter={`url(#tra-${uid})`}/>}
      <path d="M68,34 L82,26 L80,34 L82,42 Z" fill="rgba(40,140,180,0.5)"/>
      {/* Dorsal trigger spine */}
      <path d="M32,10 L34,2 L36,8 L34,14" fill="#2090b0" stroke="#106080" strokeWidth="0.5"/>
      <path d="M28,12 Q35,4 44,10 L42,16 Q36,10 30,14 Z" fill="rgba(50,160,200,0.5)"/>
      <path d="M28,56 Q35,64 44,58 L42,52 Q36,58 30,54 Z" fill="rgba(50,160,200,0.5)"/>
      <g filter={`url(#trsh-${uid})`}>
        <ellipse cx="42" cy="34" rx="30" ry="20" fill={`url(#trb-${uid})`}/>
        {/* Pattern lines */}
        <path d="M20,28 Q30,24 42,26" stroke="rgba(100,220,255,0.3)" strokeWidth="1.5" fill="none"/>
        <path d="M20,34 Q30,30 42,32" stroke="rgba(100,220,255,0.25)" strokeWidth="1" fill="none"/>
        <path d="M20,40 Q30,38 42,38" stroke="rgba(100,220,255,0.2)" strokeWidth="1" fill="none"/>
        <ellipse cx="40" cy="42" rx="18" ry="5" fill="rgba(120,220,255,0.1)"/>
      </g>
      <ellipse cx="42" cy="34" rx="30" ry="20" fill={`url(#trs-${uid})`}/>
      <circle cx="22" cy="30" r="4.5" fill="#0a2030"/><circle cx="22" cy="30" r="3" fill="#153040"/><circle cx="20.5" cy="28.5" r="1.4" fill="white" opacity="0.85"/>
      <path d="M13,36 Q15,38 13,40" stroke="#105060" strokeWidth="0.8" fill="none"/>
      <ellipse cx="42" cy="62" rx="20" ry="2" fill="#000" opacity="0.08"/>
      {selected&&<ellipse cx="42" cy="34" rx="36" ry="26" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(TriggerSprite);
