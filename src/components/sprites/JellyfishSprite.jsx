import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10} };

function JellyfishSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'jf').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const variant=fish?.colorVariant||'default', W=size*0.7, H=size;
  const vs = variant==='pink'?{filter:'hue-rotate(-30deg) saturate(1.3)'}:variant==='blue'?{filter:'hue-rotate(60deg)'}:variant==='gold'?{filter:'hue-rotate(120deg) saturate(0.8) brightness(1.2)'}:{};
  return (
    <svg width={W} height={H} viewBox="0 0 60 90" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible',...vs}}>
      <defs>
        <filter id={`jfsh-${uid}`} x="-25%" y="-15%" width="150%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2"/></filter>
        <radialGradient id={`jfb-${uid}`} cx="40%" cy="30%" r="60%"><stop offset="0%" stopColor="rgba(200,150,255,0.8)"/><stop offset="60%" stopColor="rgba(160,100,220,0.5)"/><stop offset="100%" stopColor="rgba(120,60,180,0.3)"/></radialGradient>
        <radialGradient id={`jfs-${uid}`} cx="35%" cy="20%" r="40%"><stop offset="0%" stopColor="white" stopOpacity="0.6"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        {aura&&<filter id={`jfa-${uid}`} x="-60%" y="-40%" width="220%" height="180%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="30" cy="30" rx="24" ry="20" fill={aura.color} opacity={aura.opacity} filter={`url(#jfa-${uid})`}/>}
      <g filter={`url(#jfsh-${uid})`}>
        <path d="M8,32 Q8,6 30,6 Q52,6 52,32 Q52,38 30,38 Q8,38 8,32 Z" fill={`url(#jfb-${uid})`}/>
        <path d="M8,32 Q8,6 30,6 Q52,6 52,32 Q52,38 30,38 Q8,38 8,32 Z" fill={`url(#jfs-${uid})`}/>
        <path d="M12,36 Q10,38 12,40" stroke="rgba(180,120,255,0.3)" strokeWidth="0.5" fill="none"/>
        <path d="M48,36 Q50,38 48,40" stroke="rgba(180,120,255,0.3)" strokeWidth="0.5" fill="none"/>
      </g>
      {/* Tentacles */}
      {[14,20,26,32,38,44].map((x,i)=>(
        <path key={i} d={`M${x},38 Q${x+(i%2?3:-3)},55 ${x},72 Q${x+(i%2?-2:2)},80 ${x+(i%2?1:-1)},88`}
          stroke={`rgba(${160+i*10},${100+i*15},255,${0.25+i*0.03})`} strokeWidth={1.5-i*0.1} fill="none" strokeLinecap="round"
          className="anemone-tentacle" style={{animationDelay:`${i*0.2}s`}}/>
      ))}
      {/* Inner glow */}
      <ellipse cx="30" cy="22" rx="12" ry="8" fill="rgba(220,180,255,0.25)"/>
      <ellipse cx="30" cy="85" rx="12" ry="1.5" fill="#000" opacity="0.05"/>
      {selected&&<ellipse cx="30" cy="30" rx="28" ry="24" fill="none" stroke="#f0c040" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.9" style={{animation:'shimmer-ring-march 0.9s linear infinite'}}/>}
    </svg>
  );
}
export default memo(JellyfishSprite);
