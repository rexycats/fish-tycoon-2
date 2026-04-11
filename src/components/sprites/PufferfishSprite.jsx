import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PALETTES = {
  default:{b:'#d0c040',b2:'#908020',bl:'#e0d060',lt:'#f0e080',sh:'#605008',spots:'#1a3818',fin:'#c0b030',belly:'#f0e8c0',outline:'#706010'},
  spotted:{b:'#c8b838',b2:'#887818',bl:'#d8c848',lt:'#e8d860',sh:'#584808',spots:'#1a3818',fin:'#b0a028',belly:'#e8e0b8',outline:'#685808'},
  albino: {b:'#f0e8d0',b2:'#d0c0a0',bl:'#f8f0e0',lt:'#fffff0',sh:'#908060',spots:'#c0b090',fin:'#e0d8c0',belly:'#ffffff',outline:'#a09870'},
  blue:   {b:'#3858a0',b2:'#182860',bl:'#4870c0',lt:'#6890e0',sh:'#081830',spots:'#0a1020',fin:'#3050a0',belly:'#a0b8e0',outline:'#182050'},
};

function PufferfishSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'pf').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const v=fish?.colorVariant||'default';
  const C = PALETTES[v] || PALETTES.default;
  const W=size, H=size*0.95;
  return (
    <svg width={W} height={H} viewBox="0 0 80 76" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`pfsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`pffg-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.5" result="blur"/><feFlood floodColor={C.lt} floodOpacity="0.25" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`pfb-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={C.lt}/><stop offset="22%" stopColor={C.bl}/><stop offset="55%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`pfd-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.4"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`pfbl-${uid}`} cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor={C.belly} stopOpacity="0.6"/><stop offset="100%" stopColor={C.belly} stopOpacity="0"/></radialGradient>
        <radialGradient id={`pfsp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.55"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`pffin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.8"/><stop offset="100%" stopColor={C.b2} stopOpacity="0.3"/></linearGradient>
        <clipPath id={`pfclip-${uid}`}><ellipse cx="36" cy="38" rx="24" ry="26"/></clipPath>
        {aura&&<filter id={`pfa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="36" cy="38" rx="30" ry="30" fill={aura.color} opacity={aura.opacity} filter={`url(#pfa-${uid})`}/>}
      {/* Tail — small fan */}
      <g filter={`url(#pffg-${uid})`} className="fish-tail"><path d="M58,38 Q66,28 72,26 Q68,34 70,38 Q68,42 72,50 Q66,48 58,38 Z" fill={`url(#pffin-${uid})`} stroke={C.fin} strokeWidth="0.5" strokeOpacity="0.4"/></g>
      {/* Dorsal — small, rear */}
      <path d="M44,14 Q48,8 52,12" fill={`url(#pffin-${uid})`} className="fish-dorsal"/>
      {/* Anal */}
      <path d="M44,62 Q48,68 52,64" fill={`url(#pffin-${uid})`} className="fish-anal-fin"/>
      {/* Pectoral — fan-shaped, always moving */}
      <ellipse cx="28" cy="42" rx="8" ry="5" fill={`url(#pffin-${uid})`} transform="rotate(-15,28,42)" className="fish-pectoral" filter={`url(#pffg-${uid})`}/>
      {/* Body — nearly spherical! */}
      <g filter={`url(#pfsh-${uid})`}><ellipse cx="36" cy="38" rx="24" ry="26" fill={`url(#pfb-${uid})`}/></g>
      <ellipse cx="36" cy="38" rx="24" ry="26" fill={`url(#pfd-${uid})`}/>
      <ellipse cx="36" cy="38" rx="24" ry="26" fill={`url(#pfbl-${uid})`}/>
      {/* Spots — the pufferfish pattern */}
      <g clipPath={`url(#pfclip-${uid})`}>
        {[[24,28],[32,24],[42,22],[50,28],[28,34],[38,30],[48,34],[22,40],[34,38],[46,40],[26,48],[36,46],[46,48],[30,54],[40,54]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={2.2+(i%3)*0.5} fill={C.spots} opacity={0.3-(i%4)*0.03}/>
        ))}
        {/* Belly division line */}
        <path d="M14,44 Q28,48 42,46 Q52,44 60,40" stroke={C.sh} strokeWidth="0.6" fill="none" opacity="0.12"/>
      </g>
      {/* Spines — subtle bumps (deflated state) */}
      <g clipPath={`url(#pfclip-${uid})`} opacity="0.08">
        {[[20,24],[30,18],[42,16],[52,22],[18,32],[56,32],[16,44],[56,44],[20,54],[30,58],[42,60],[52,54]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="1.5" fill={C.sh}/>
        ))}
      </g>
      <ellipse cx="36" cy="38" rx="24" ry="26" fill={`url(#pfsp-${uid})`}/>
      <ellipse cx="36" cy="38" rx="24" ry="26" fill="none" stroke={C.outline} strokeWidth="0.8" opacity="0.22"/>
      {/* Mouth — beak-like, fused teeth */}
      <path d="M14,40 Q10,38 8,40 Q10,42 14,40" fill={C.b2} opacity="0.5"/>
      <path d="M10,39 Q8,40 10,41" stroke={C.sh} strokeWidth="1" fill="none" opacity="0.3"/>
      {/* Eye — large, expressive, can blink! */}
      <circle cx="20" cy="34" r="7" fill="rgba(0,0,0,0.08)"/>
      <circle cx="20" cy="33.5" r="6.5" fill="#fafafa"/>
      <circle cx="20" cy="33.5" r="5" fill="#4080c0"/>
      <circle cx="20" cy="33.5" r="3.5" fill="#0a0a12"/>
      <circle cx="18" cy="31.5" r="1.8" fill="white"/>
      <circle cx="21.5" cy="35" r="0.7" fill="rgba(255,255,255,0.35)"/>
      {/* Eye ridge */}
      <path d="M14,30 Q18,28 24,30" stroke={C.b2} strokeWidth="1" fill="none" opacity="0.2"/>
      {/* Nostril */}
      <circle cx="14" cy="36" r="0.8" fill={C.sh} opacity="0.2"/>
      {selected&&<ellipse cx="36" cy="38" rx="28" ry="30" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(PufferfishSprite);