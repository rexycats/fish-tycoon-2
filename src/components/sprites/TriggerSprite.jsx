import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
function TriggerSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'tr').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const W=size*1.05, H=size*0.85;
  const C={b:'#303830',b2:'#181e18',bl:'#404840',lt:'#586058',sh:'#0a100a',spot:'#e0c040',spot2:'#f0d850',lip:'#ff8030',fin:'#384038',outline:'#141a14'};
  return (
    <svg width={W} height={H} viewBox="0 0 84 68" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`trsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`trfg-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8" result="blur"/><feFlood floodColor={C.spot} floodOpacity="0.25" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`trb-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={C.lt}/><stop offset="28%" stopColor={C.bl}/><stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`trd-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.45"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`trbl-${uid}`} cx="50%" cy="100%" r="58%"><stop offset="0%" stopColor={C.lt} stopOpacity="0.4"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/></radialGradient>
        <radialGradient id={`trsp-${uid}`} cx="26%" cy="18%" r="40%"><stop offset="0%" stopColor="white" stopOpacity="0.35"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`trfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.8"/><stop offset="100%" stopColor={C.b2} stopOpacity="0.3"/></linearGradient>
        <clipPath id={`trclip-${uid}`}><path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z"/></clipPath>
        {aura&&<filter id={`tra-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="38" cy="34" rx="32" ry="26" fill={aura.color} opacity={aura.opacity} filter={`url(#tra-${uid})`}/>}
      <g filter={`url(#trfg-${uid})`} className="fish-tail"><path d="M64,34 L76,26 L74,34 L76,42 Z" fill={`url(#trfin-${uid})`} stroke={C.outline} strokeWidth="0.6" strokeOpacity="0.3"/></g>
      <g className="fish-dorsal" filter={`url(#trfg-${uid})`}>
        <path d="M34,10 Q38,0 42,4 L40,14" fill={C.fin} opacity="0.7" stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.4"/>
        <line x1="36" y1="12" x2="38" y2="4" stroke={C.outline} strokeWidth="0.6" opacity="0.3"/>
      </g>
      <path d="M32,8 Q42,2 56,8 L52,18" fill={`url(#trfin-${uid})`} className="fish-dorsal" opacity="0.6"/>
      <path d="M32,60 Q42,66 56,60 L52,50" fill={`url(#trfin-${uid})`} className="fish-anal-fin"/>
      <ellipse cx="26" cy="42" rx="8" ry="4" fill={`url(#trfin-${uid})`} transform="rotate(-18,26,42)" className="fish-pectoral"/>
      <g filter={`url(#trsh-${uid})`}><path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z" fill={`url(#trb-${uid})`}/></g>
      <path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z" fill={`url(#trd-${uid})`}/>
      <path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z" fill={`url(#trbl-${uid})`}/>
      <g clipPath={`url(#trclip-${uid})`}>
        {[18,28,38,48,58].map((x,i)=>[18,28,38,48].map((y,j)=>(
          (i+j)%3===0&&<circle key={`${i}${j}`} cx={x+(j%2)*5} cy={y+(i%2)*4} r={2.5+((i+j)%2)} fill={C.spot} opacity={0.3-j*0.04}/>
        )))}
        <ellipse cx="38" cy="50" rx="20" ry="8" fill={C.spot2} opacity="0.15"/>
        <path d="M10,30 Q30,26 56,30" stroke={C.spot} strokeWidth="0.6" fill="none" opacity="0.12"/>
      </g>
      <path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z" fill={`url(#trsp-${uid})`}/>
      <path d="M66,34 Q66,16 48,10 Q32,6 18,14 Q8,22 8,34 Q8,46 18,54 Q32,62 48,58 Q66,52 66,34 Z" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.25"/>
      <path d="M10,38 Q8,40 10,42" stroke={C.lip} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5"/>
      <circle cx="16" cy="30" r="4.5" fill="rgba(0,0,0,0.06)"/><circle cx="16" cy="29.5" r="4" fill="#fafafa"/><circle cx="16" cy="29.5" r="3" fill="#1a1a2a"/><circle cx="14.8" cy="28.3" r="1.3" fill="white"/><circle cx="16.8" cy="30.3" r="0.5" fill="rgba(255,255,255,0.3)"/>
      <circle cx="12" cy="34" r="0.8" fill={C.sh} opacity="0.2"/>
      {selected&&<ellipse cx="38" cy="34" rx="32" ry="28" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(TriggerSprite);