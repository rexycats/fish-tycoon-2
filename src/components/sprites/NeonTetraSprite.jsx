import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
function NeonTetraSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'nt').slice(0,8), rarity=fish?.species?.rarity||'common', aura=AURA[rarity];
  const W=size*0.7, H=size*0.45;
  const C={b:'#708898',b2:'#405868',bl:'#90a8b8',lt:'#b0c8d8',sh:'#203040',neon:'#00c8ff',neon2:'#40e0ff',red:'#ff2020',red2:'#e01818',fin:'#80a0b0',belly:'#c0d0e0',outline:'#304858'};
  return (
    <svg width={W} height={H} viewBox="0 0 52 30" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`ntsh-${uid}`} x="-25%" y="-25%" width="150%" height="170%"><feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.25"/></filter>
        <filter id={`ntgl-${uid}`} x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.5" result="blur"/><feFlood floodColor={C.neon} floodOpacity="0.5" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`ntb-${uid}`} cx="32%" cy="28%" r="65%"><stop offset="0%" stopColor={C.lt}/><stop offset="28%" stopColor={C.bl}/><stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`ntd-${uid}`} cx="50%" cy="0%" r="78%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.4"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`ntbl-${uid}`} cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor={C.belly} stopOpacity="0.45"/><stop offset="100%" stopColor={C.belly} stopOpacity="0"/></radialGradient>
        <radialGradient id={`ntsp-${uid}`} cx="28%" cy="20%" r="38%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`ntneon-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stopColor={C.neon} stopOpacity="0.1"/><stop offset="20%" stopColor={C.neon} stopOpacity="0.8"/><stop offset="60%" stopColor={C.neon2} stopOpacity="0.9"/><stop offset="80%" stopColor={C.neon} stopOpacity="0.6"/><stop offset="100%" stopColor={C.neon} stopOpacity="0.1"/></linearGradient>
        <linearGradient id={`ntred-${uid}`} x1="50%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.red} stopOpacity="0.8"/><stop offset="100%" stopColor={C.red2} stopOpacity="0.5"/></linearGradient>
        <clipPath id={`ntclip-${uid}`}><ellipse cx="24" cy="15" rx="16" ry="8"/></clipPath>
        {aura&&<filter id={`nta-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="24" cy="15" rx="20" ry="12" fill={aura.color} opacity={aura.opacity} filter={`url(#nta-${uid})`}/>}
      <g className="fish-tail"><path d="M38,15 L46,10 L44,15 L46,20 Z" fill={C.red} opacity="0.5" stroke={C.outline} strokeWidth="0.4" strokeOpacity="0.3"/></g>
      <path d="M18,6 Q22,3 26,5" fill={C.fin} opacity="0.4" className="fish-dorsal"/>
      <path d="M22,8 Q24,6 26,7" fill={C.fin} opacity="0.25"/>
      <ellipse cx="18" cy="18" rx="4" ry="2" fill={C.fin} opacity="0.35" transform="rotate(-15,18,18)" className="fish-pectoral"/>
      <g filter={`url(#ntsh-${uid})`}><ellipse cx="24" cy="15" rx="16" ry="8" fill={`url(#ntb-${uid})`}/></g>
      <ellipse cx="24" cy="15" rx="16" ry="8" fill={`url(#ntd-${uid})`}/>
      <ellipse cx="24" cy="15" rx="16" ry="8" fill={`url(#ntbl-${uid})`}/>
      <g clipPath={`url(#ntclip-${uid})`}>
        {/* THE NEON STRIPE — the signature feature */}
        <g filter={`url(#ntgl-${uid})`}>
          <rect x="10" y="12" width="28" height="3" rx="1.5" fill={`url(#ntneon-${uid})`}/>
          <rect x="12" y="12.5" width="24" height="2" rx="1" fill={C.neon2} opacity="0.4"/>
        </g>
        {/* Red tail half */}
        <rect x="26" y="15" width="14" height="6" fill={`url(#ntred-${uid})`} opacity="0.5"/>
        <ellipse cx="34" cy="18" rx="6" ry="4" fill={C.red} opacity="0.35"/>
      </g>
      <ellipse cx="24" cy="15" rx="16" ry="8" fill={`url(#ntsp-${uid})`}/>
      <ellipse cx="24" cy="15" rx="16" ry="8" fill="none" stroke={C.outline} strokeWidth="0.6" opacity="0.2"/>
      <circle cx="11" cy="14" r="2.5" fill="rgba(0,0,0,0.05)"/><circle cx="11" cy="13.5" r="2.2" fill="#fafafa"/><circle cx="11" cy="13.5" r="1.6" fill="#1a1a2a"/><circle cx="10.3" cy="12.8" r="0.7" fill="white"/>
      {selected&&<ellipse cx="24" cy="15" rx="20" ry="12" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5" strokeDasharray="3 2"/>}
    </svg>
  );
}
export default memo(NeonTetraSprite);