import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff7eb3',opacity:0.55,blur:14} };

function ElectricEelSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'ee').slice(0,8), rarity=fish?.species?.rarity||'epic', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size*1.2, H=size*0.4;
  const vs = variant==='albino'?{filter:'saturate(0.2) brightness(1.5)'}:variant==='midnight'?{filter:'brightness(0.5) saturate(1.5)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 120 40" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`eesh-${uid}`} x="-10%" y="-25%" width="120%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3"/></filter>
        <linearGradient id={`eeb-${uid}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2a3a2a"/><stop offset="30%" stopColor="#3a5a30"/><stop offset="70%" stopColor="#2a4a28"/><stop offset="100%" stopColor="#1a2a1a"/></linearGradient>
        <radialGradient id={`ees-${uid}`} cx="20%" cy="25%" r="30%"><stop offset="0%" stopColor="white" stopOpacity="0.4"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`eea-${uid}`} x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="60" cy="20" rx="55" ry="14" fill={aura.color} opacity={aura.opacity} filter={`url(#eea-${uid})`}/>}
      <g filter={`url(#eesh-${uid})`}>
        {/* Serpentine body */}
        <path d="M8,20 Q20,12 35,18 Q50,24 65,18 Q80,12 95,18 Q108,22 115,20 Q108,26 95,24 Q80,18 65,24 Q50,30 35,24 Q20,18 8,24 Z" fill={`url(#eeb-${uid})`}/>
        {/* Yellow/orange belly stripe */}
        <path d="M12,22 Q30,20 50,22 Q70,24 90,22 Q105,21 112,22" stroke="#d4a030" strokeWidth="2.5" fill="none" opacity="0.6"/>
        {/* Electric glow spots */}
        {[25,45,65,85,100].map((x,i)=><circle key={i} cx={x} cy={20} r="2" fill="#60ff80" opacity={0.3+i*0.05}>
          <animate attributeName="opacity" values={`${0.2+i*0.05};${0.6+i*0.05};${0.2+i*0.05}`} dur={`${1.5+i*0.3}s`} repeatCount="indefinite"/>
        </circle>)}
        <path d="M8,20 Q20,12 35,18 Q50,24 65,18 Q80,12 95,18 Q108,22 115,20 Q108,26 95,24 Q80,18 65,24 Q50,30 35,24 Q20,18 8,24 Z" fill={`url(#ees-${uid})`}/>
      </g>
      {/* Eye */}
      <circle cx="12" cy="20" r="3" fill="#1a2a1a"/><circle cx="12" cy="20" r="2" fill="#2a3a20"/><circle cx="11" cy="19" r="1" fill="white" opacity="0.8"/>
      {/* Electric zap effect */}
      <path d="M40,14 L44,18 L38,20 L45,24" stroke="#80ff90" strokeWidth="0.8" fill="none" opacity="0.4">
        <animate attributeName="opacity" values="0;0.6;0" dur="2s" repeatCount="indefinite"/>
      </path>
      <ellipse cx="60" cy="36" rx="30" ry="1.5" fill="#000" opacity="0.06"/>
      {selected&&<ellipse cx="60" cy="20" rx="58" ry="16" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(ElectricEelSprite);
