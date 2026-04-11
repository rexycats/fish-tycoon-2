import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PAL = {
  default:{b:'#c83030',b2:'#802018',bl:'#e04848',lt:'#f06060',sh:'#401008',stripe:'#2050a0',stripe2:'#3068c0',fin:'#a02828',belly:'#e08060',lat:'#d04040',outline:'#501010'},
  blue:   {b:'#2050a0',b2:'#103070',bl:'#3868c0',lt:'#5080e0',sh:'#081838',stripe:'#60c8ff',stripe2:'#80d8ff',fin:'#1840a0',belly:'#6090c0',lat:'#4070c0',outline:'#0c2050'},
  green:  {b:'#308040',b2:'#185028',bl:'#489858',lt:'#60b070',sh:'#082810',stripe:'#40c060',stripe2:'#60d880',fin:'#287038',belly:'#70a078',lat:'#409050',outline:'#103818'},
};
function DiscusSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'dc').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const v=fish?.colorVariant||'default', C=PAL[v]||PAL.default, W=size, H=size;
  return (
    <svg width={W} height={H} viewBox="0 0 72 72" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`dcsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`dcfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feFlood floodColor={C.stripe} floodOpacity="0.3" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`dcb-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={C.lt}/><stop offset="25%" stopColor={C.bl}/><stop offset="55%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`dcd-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.42"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`dcbl-${uid}`} cx="50%" cy="100%" r="58%"><stop offset="0%" stopColor={C.belly} stopOpacity="0.5"/><stop offset="100%" stopColor={C.belly} stopOpacity="0"/></radialGradient>
        <radialGradient id={`dcsp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`dclat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stopColor={C.lat} stopOpacity="0"/><stop offset="30%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="50%" stopColor={C.lat} stopOpacity="0.35"/><stop offset="70%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="100%" stopColor={C.lat} stopOpacity="0"/></linearGradient>
        <linearGradient id={`dcfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.85"/><stop offset="100%" stopColor={C.b2} stopOpacity="0.35"/></linearGradient>
        <clipPath id={`dcclip-${uid}`}><circle cx="32" cy="36" r="24"/></clipPath>
        {aura&&<filter id={`dca-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<circle cx="32" cy="36" rx="30" ry="30" fill={aura.color} opacity={aura.opacity} filter={`url(#dca-${uid})`}/>}
      <g filter={`url(#dcfg-${uid})`} className="fish-tail"><path d="M54,36 L66,28 L64,36 L66,44 Z" fill={`url(#dcfin-${uid})`} stroke={C.outline} strokeWidth="0.6" strokeOpacity="0.3"/></g>
      <g className="fish-dorsal" filter={`url(#dcfg-${uid})`}><path d="M22,14 Q32,4 48,10 L44,20" fill={`url(#dcfin-${uid})`} stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.3"/>{[26,32,38,44].map((x,i)=><line key={i} x1={x} y1={18-i*0.5} x2={x+2} y2={8+i*0.5} stroke={C.outline} strokeWidth="0.3" opacity="0.15"/>)}</g>
      <path d="M22,58 Q32,68 48,62 L44,52" fill={`url(#dcfin-${uid})`} className="fish-anal-fin"/>
      <ellipse cx="24" cy="44" rx="8" ry="4" fill={`url(#dcfin-${uid})`} transform="rotate(-20,24,44)" className="fish-pectoral" filter={`url(#dcfg-${uid})`}/>
      <g filter={`url(#dcsh-${uid})`}><circle cx="32" cy="36" r="24" fill={`url(#dcb-${uid})`}/></g>
      <circle cx="32" cy="36" r="24" fill={`url(#dcd-${uid})`}/>
      <circle cx="32" cy="36" r="24" fill={`url(#dcbl-${uid})`}/>
      <circle cx="32" cy="36" r="24" fill={`url(#dclat-${uid})`}/>
      <g clipPath={`url(#dcclip-${uid})`}>
        {[0,1,2,3,4,5,6,7,8].map(i=><path key={i} d={`M${10+i*2},${20+i*4} Q${32+i},${34+i*1.5} ${54-i*2},${20+i*4}`} stroke={C.stripe} strokeWidth={1.2-i*0.05} fill="none" opacity={0.35-i*0.02}/>)}
        {[0,1,2,3,4].map(i=><path key={`v${i}`} d={`M${18+i*8},14 Q${20+i*8},36 ${18+i*8},58`} stroke={C.stripe2} strokeWidth="0.4" fill="none" opacity="0.08"/>)}
      </g>
      <circle cx="32" cy="36" r="24" fill={`url(#dcsp-${uid})`}/>
      <circle cx="32" cy="36" r="24" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.25"/>
      <path d="M10,38 Q8,40 10,42" stroke={C.sh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.35"/>
      <circle cx="14" cy="32" r="4.5" fill="rgba(0,0,0,0.06)"/><circle cx="14" cy="31.5" r="4" fill={C.b} opacity="0.5"/><circle cx="14" cy="31.5" r="3.2" fill="#fafafa"/><circle cx="14" cy="31.5" r="2.5" fill="#1a1a2a"/><circle cx="12.8" cy="30.3" r="1.2" fill="white"/><circle cx="14.8" cy="32.3" r="0.5" fill="rgba(255,255,255,0.3)"/>
      {selected&&<circle cx="32" cy="36" r="28" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(DiscusSprite);