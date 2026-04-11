import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function MoorishIdolSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'mi').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const W=size, H=size*1.1;
  const C = { w:'#f8f8f0',y:'#f0d020',yDark:'#c0a010',blk:'#0a0a0a',blk2:'#1a1a1a',outline:'#303030',fin:'#f0e8d0',snout:'#c89820' };
  return (
    <svg width={W} height={H} viewBox="0 0 70 78" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`mish-${uid}`} x="-22%" y="-15%" width="144%" height="148%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`mifg-${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feFlood floodColor={C.y} floodOpacity="0.3" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`mib-${uid}`} cx="30%" cy="28%" r="68%"><stop offset="0%" stopColor="#ffffff"/><stop offset="30%" stopColor={C.w}/><stop offset="100%" stopColor="#d8d0c0"/></radialGradient>
        <radialGradient id={`misp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.55"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`mifin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.85"/><stop offset="100%" stopColor="#c0b898" stopOpacity="0.35"/></linearGradient>
        <clipPath id={`miclip-${uid}`}><ellipse cx="32" cy="42" rx="22" ry="26"/></clipPath>
        {aura&&<filter id={`mia-${uid}`} x="-60%" y="-50%" width="220%" height="200%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="32" cy="42" rx="28" ry="30" fill={aura.color} opacity={aura.opacity} filter={`url(#mia-${uid})`}/>}
      {/* Trailing dorsal filament — the iconic whip */}
      <g filter={`url(#mifg-${uid})`} className="fish-dorsal">
        <path d="M28,16 Q24,4 30,0 Q36,8 50,4 Q58,2 64,6" stroke={C.w} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M28,16 Q24,6 30,2" stroke={C.y} strokeWidth="0.8" fill="none" opacity="0.3"/>
      </g>
      {/* Dorsal fin base */}
      <path d="M22,18 Q28,10 40,14 Q48,18 52,24" fill={`url(#mifin-${uid})`} stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.3"/>
      {/* Anal */}
      <g className="fish-anal-fin"><path d="M22,66 Q28,74 40,72 Q48,68 52,60" fill={`url(#mifin-${uid})`} stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.3"/></g>
      {/* Tail */}
      <g className="fish-tail"><path d="M52,42 Q58,34 64,32 Q60,38 62,42 Q60,46 64,52 Q58,50 52,42 Z" fill={C.blk} opacity="0.8" stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.4"/></g>
      {/* Pectoral — small, transparent */}
      <ellipse cx="24" cy="46" rx="6" ry="3.5" fill={C.fin} opacity="0.4" transform="rotate(-20,24,46)" className="fish-pectoral"/>
      {/* Body — tall, compressed disc */}
      <g filter={`url(#mish-${uid})`}><ellipse cx="32" cy="42" rx="22" ry="26" fill={`url(#mib-${uid})`}/></g>
      {/* THE signature bands — black-yellow-white-black */}
      <g clipPath={`url(#miclip-${uid})`}>
        {/* Band 1 — black eye mask */}
        <rect x="10" y="30" width="12" height="24" fill={C.blk} opacity="0.85"/>
        <rect x="10" y="30" width="12" height="24" fill="none" stroke={C.blk2} strokeWidth="0.5" opacity="0.3"/>
        {/* Band 2 — yellow central */}
        <rect x="22" y="16" width="14" height="52" fill={C.y} opacity="0.8"/>
        <rect x="22" y="16" width="14" height="52" fill="none"/>
        {/* Yellow gradient overlay for depth */}
        <rect x="22" y="16" width="14" height="52" fill="url(#misp-${uid})" opacity="0.3"/>
        {/* Band 3 — white */}
        <rect x="36" y="16" width="8" height="52" fill={C.w} opacity="0.9"/>
        {/* Band 4 — black tail band */}
        <rect x="44" y="20" width="10" height="44" fill={C.blk} opacity="0.8"/>
        {/* Band transitions — soft edges */}
        <rect x="21" y="30" width="2" height="24" fill={C.blk} opacity="0.15"/>
        <rect x="35" y="16" width="2" height="52" fill={C.yDark} opacity="0.1"/>
        <rect x="43" y="20" width="2" height="44" fill="rgba(0,0,0,0.1)"/>
      </g>
      <ellipse cx="32" cy="42" rx="22" ry="26" fill={`url(#misp-${uid})`}/>
      <ellipse cx="32" cy="42" rx="22" ry="26" fill="none" stroke={C.outline} strokeWidth="0.8" opacity="0.25"/>
      {/* Snout — elongated, distinctive */}
      <path d="M12,42 Q6,40 4,42 Q6,44 12,42" fill={C.snout} opacity="0.6"/>
      <path d="M12,41 Q8,40 6,41" stroke={C.outline} strokeWidth="0.5" fill="none" opacity="0.2"/>
      {/* Mouth */}
      <path d="M6,42 Q4,43 6,43" stroke={C.outline} strokeWidth="0.8" fill="none" opacity="0.3"/>
      {/* Eye — on black band */}
      <circle cx="16" cy="40" r="4.5" fill="rgba(0,0,0,0.1)"/>
      <circle cx="16" cy="39.5" r="4" fill="#e8e8e0"/>
      <circle cx="16" cy="39.5" r="3" fill={C.y}/>
      <circle cx="16" cy="39.5" r="2" fill="#0a0a12"/>
      <circle cx="14.8" cy="38.2" r="1.1" fill="white"/>
      <circle cx="16.8" cy="40.5" r="0.4" fill="rgba(255,255,255,0.3)"/>
      {selected&&<ellipse cx="32" cy="42" rx="26" ry="30" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(MoorishIdolSprite);