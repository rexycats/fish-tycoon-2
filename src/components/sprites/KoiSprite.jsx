import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10} };

function KoiSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'ko').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size, H=size*0.6;
  const patches = variant==='tancho'?'#cc2020':variant==='showa'?'#1a1a1a':variant==='ogon'?'#d4a830':'#e84020';
  const vs = variant==='ogon'?{filter:'brightness(1.1)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 100 60" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`kosh-${uid}`} x="-15%" y="-20%" width="130%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/></filter>
        <radialGradient id={`kob-${uid}`} cx="35%" cy="28%" r="68%"><stop offset="0%" stopColor="#fff8e8"/><stop offset="40%" stopColor="#f0e8d0"/><stop offset="100%" stopColor="#c8b898"/></radialGradient>
        <radialGradient id={`kos-${uid}`} cx="30%" cy="18%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.65"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`koa-${uid}`} x="-50%" y="-60%" width="200%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="48" cy="30" rx="40" ry="22" fill={aura.color} opacity={aura.opacity} filter={`url(#koa-${uid})`}/>}
      {/* Tail — large fan */}
      <path d="M82,30 Q92,15 98,10 L95,30 L98,50 Q92,45 82,30 Z" fill="rgba(200,180,140,0.5)" stroke="rgba(160,140,100,0.3)" strokeWidth="0.5"/>
      {/* Dorsal */}
      <path d="M30,10 Q40,2 55,4 Q60,3 65,8 L62,16 Q50,8 35,12 Z" fill="rgba(240,230,210,0.5)"/>
      <g filter={`url(#kosh-${uid})`}>
        <ellipse cx="48" cy="30" rx="36" ry="18" fill={`url(#kob-${uid})`}/>
        {/* Color patches */}
        <ellipse cx="30" cy="26" rx="12" ry="10" fill={patches} opacity="0.6" transform="rotate(-10,30,26)"/>
        <ellipse cx="55" cy="32" rx="14" ry="9" fill={patches} opacity="0.5" transform="rotate(8,55,32)"/>
        {variant==='showa'&&<ellipse cx="42" cy="28" rx="8" ry="7" fill="#cc2020" opacity="0.5"/>}
        {/* Scale shimmer */}
        {[20,30,40,50,60,70].map((x,i)=><circle key={i} cx={x} cy={28+(i%3)*3} r="3" fill="rgba(255,255,255,0.08)"/>)}
        <ellipse cx="45" cy="38" rx="22" ry="6" fill="rgba(255,250,230,0.15)"/>
      </g>
      <ellipse cx="48" cy="30" rx="36" ry="18" fill={`url(#kos-${uid})`}/>
      {/* Whiskers (barbels) */}
      <path d="M14,28 Q8,32 4,30" stroke="rgba(160,140,100,0.4)" strokeWidth="1" fill="none"/>
      <path d="M14,32 Q8,36 4,38" stroke="rgba(160,140,100,0.4)" strokeWidth="1" fill="none"/>
      {/* Eye */}
      <circle cx="20" cy="27" r="4" fill="#1a1020"/><circle cx="20" cy="27" r="2.5" fill="#302020"/><circle cx="18.5" cy="25.5" r="1.3" fill="white" opacity="0.85"/>
      <ellipse cx="48" cy="55" rx="22" ry="2.5" fill="#000" opacity="0.08"/>
      {selected&&<ellipse cx="48" cy="30" rx="42" ry="24" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(KoiSprite);
