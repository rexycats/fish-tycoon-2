import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
function MoorishIdolSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'mi').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const W=size*0.9, H=size*1.1;
  const C={body:'#f0e040',body2:'#c0a020',white:'#f8f8f0',black:'#1a1a18',lt:'#fff060',sh:'#604000',fin:'#f0d830',outline:'#403008'};
  return (
    <svg width={W} height={H} viewBox="0 0 70 85" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`mish-${uid}`} x="-22%" y="-15%" width="144%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`mifg-${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feFlood floodColor={C.body} floodOpacity="0.3" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`mib-${uid}`} cx="32%" cy="30%" r="68%"><stop offset="0%" stopColor={C.lt}/><stop offset="30%" stopColor={C.body}/><stop offset="100%" stopColor={C.body2}/></radialGradient>
        <radialGradient id={`misp-${uid}`} cx="28%" cy="22%" r="40%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`mifin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.85"/><stop offset="100%" stopColor={C.body2} stopOpacity="0.4"/></linearGradient>
        <clipPath id={`miclip-${uid}`}><ellipse cx="32" cy="45" rx="22" ry="28"/></clipPath>
        {aura&&<filter id={`mia-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="32" cy="45" rx="28" ry="34" fill={aura.color} opacity={aura.opacity} filter={`url(#mia-${uid})`}/>}
      <g filter={`url(#mifg-${uid})`} className="fish-tail"><path d="M52,45 L64,38 L62,45 L64,52 Z" fill={`url(#mifin-${uid})`} stroke={C.outline} strokeWidth="0.6" strokeOpacity="0.3"/></g>
      <g className="fish-dorsal" filter={`url(#mifg-${uid})`}>
        <path d="M28,18 Q32,2 36,0 Q34,8 38,14" fill={C.white} opacity="0.8" stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.3"/>
        <path d="M30,16 Q32,6 34,4" stroke={C.outline} strokeWidth="0.3" fill="none" opacity="0.15"/>
      </g>
      <path d="M20,72 Q28,80 38,76 L36,66" fill={C.black} opacity="0.7" className="fish-anal-fin"/>
      <ellipse cx="24" cy="52" rx="7" ry="3.5" fill={`url(#mifin-${uid})`} transform="rotate(-25,24,52)" className="fish-pectoral"/>
      <g filter={`url(#mish-${uid})`}><ellipse cx="32" cy="45" rx="22" ry="28" fill={`url(#mib-${uid})`}/></g>
      <g clipPath={`url(#miclip-${uid})`}>
        <rect x="8" y="20" width="50" height="12" fill={C.black} opacity="0.8"/>
        <rect x="8" y="32" width="50" height="8" fill={C.body} opacity="0.6"/>
        <rect x="8" y="40" width="50" height="6" fill={C.white} opacity="0.7"/>
        <rect x="8" y="46" width="50" height="12" fill={C.black} opacity="0.8"/>
        <rect x="8" y="58" width="50" height="8" fill={C.body} opacity="0.5"/>
        <rect x="8" y="66" width="50" height="8" fill={C.black} opacity="0.6"/>
        {[14,20,26,32,38,44].map((x,i)=><path key={i} d={`M${x},20 Q${x+2},45 ${x},70`} stroke={C.lt} strokeWidth="0.4" fill="none" opacity="0.06"/>)}
      </g>
      <ellipse cx="32" cy="45" rx="22" ry="28" fill={`url(#misp-${uid})`}/>
      <ellipse cx="32" cy="45" rx="22" ry="28" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.3"/>
      <path d="M12,40 Q10,42 12,44" stroke={C.outline} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M14,38 Q12,40 14,42" stroke={C.sh} strokeWidth="0.5" fill="none" opacity="0.2"/>
      <circle cx="16" cy="36" r="4.5" fill="rgba(0,0,0,0.06)"/><circle cx="16" cy="35.5" r="4" fill={C.body}/><circle cx="16" cy="35.5" r="3" fill="#fafafa"/><circle cx="16" cy="35.5" r="2.2" fill="#1a1a2a"/><circle cx="15" cy="34.5" r="1" fill="white"/><circle cx="16.8" cy="36.2" r="0.4" fill="rgba(255,255,255,0.3)"/>
      {selected&&<ellipse cx="32" cy="45" rx="26" ry="32" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(MoorishIdolSprite);