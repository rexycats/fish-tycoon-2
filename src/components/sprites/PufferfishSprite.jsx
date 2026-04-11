import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10} };

function PufferfishSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'pf').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size, H=size*0.9;
  const vs = variant==='spotted'?{filter:'hue-rotate(20deg)'}:variant==='albino'?{filter:'saturate(0.2) brightness(1.4)'}:variant==='blue'?{filter:'hue-rotate(-80deg) saturate(1.2)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 80 72" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`pfsh-${uid}`} x="-20%" y="-15%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.3"/></filter>
        <radialGradient id={`pfb-${uid}`} cx="35%" cy="30%" r="65%"><stop offset="0%" stopColor="#f0e8a0"/><stop offset="50%" stopColor="#d0b840"/><stop offset="100%" stopColor="#908020"/></radialGradient>
        <radialGradient id={`pfs-${uid}`} cx="30%" cy="20%" r="38%"><stop offset="0%" stopColor="white" stopOpacity="0.6"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`pfa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="38" cy="36" rx="30" ry="28" fill={aura.color} opacity={aura.opacity} filter={`url(#pfa-${uid})`}/>}
      <path d="M62,36 L74,28 L72,36 L74,44 Z" fill="rgba(180,160,60,0.5)"/>
      <path d="M25,12 Q32,4 40,10" fill="rgba(200,180,80,0.4)"/>
      <path d="M25,60 Q32,68 40,62" fill="rgba(200,180,80,0.4)"/>
      <g filter={`url(#pfsh-${uid})`}>
        <ellipse cx="38" cy="36" rx="26" ry="24" fill={`url(#pfb-${uid})`}/>
        <ellipse cx="35" cy="46" rx="16" ry="8" fill="rgba(255,255,240,0.2)"/>
        {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*30*Math.PI/180;return <circle key={i} cx={38+22*Math.cos(a)} cy={36+20*Math.sin(a)} r="1.2" fill="rgba(120,100,20,0.4)"/>;})}
      </g>
      <ellipse cx="38" cy="36" rx="26" ry="24" fill={`url(#pfs-${uid})`}/>
      <circle cx="26" cy="30" r="5" fill="#fff8e0"/><circle cx="26" cy="30" r="3.5" fill="#1a1a30"/><circle cx="24.5" cy="28.5" r="1.5" fill="white" opacity="0.85"/>
      <path d="M16,38 Q18,40 16,42" stroke="#806020" strokeWidth="0.8" fill="none"/>
      <ellipse cx="38" cy="68" rx="18" ry="2" fill="#000" opacity="0.08"/>
      {selected&&<ellipse cx="38" cy="36" rx="34" ry="32" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(PufferfishSprite);
