import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PALETTES = {
  default:{b:'#c8b080',b2:'#806030',bl:'#d8c898',lt:'#e8d8b0',sh:'#504020',spot:'#3a2010',fin:'#b09060',fin2:'#907040',barb:'#a08050',outline:'#403018',plate:'#d0c090'},
  panda:{b:'#e8e0d0',b2:'#a09080',bl:'#f0e8e0',lt:'#f8f4f0',sh:'#605850',spot:'#121010',fin:'#d0c8b8',fin2:'#b0a898',barb:'#b0a898',outline:'#504840',plate:'#e0d8d0'},
  bronze:{b:'#b08840',b2:'#705020',bl:'#c8a058',lt:'#d8b870',sh:'#403010',spot:'#503818',fin:'#a07830',fin2:'#806020',barb:'#907030',outline:'#402810',plate:'#c0a050'},
};

function CorydorasSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'co').slice(0,8), rarity=fish?.species?.rarity||'common', aura=AURA[rarity];
  const v=fish?.colorVariant||'default';
  const C = PALETTES[v] || PALETTES.default;
  const W=size*0.9, H=size*0.65;

  return (
    <svg width={W} height={H} viewBox="0 0 68 44" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`cosh-${uid}`} x="-22%" y="-20%" width="144%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.30"/>
        </filter>
        <filter id={`cofg-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feFlood floodColor={C.plate} floodOpacity="0.25" result="c"/>
          <feComposite in="c" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id={`cob-${uid}`} cx="34%" cy="32%" r="64%">
          <stop offset="0%" stopColor={C.lt}/><stop offset="25%" stopColor={C.bl}/>
          <stop offset="55%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/>
        </radialGradient>
        <radialGradient id={`cod-${uid}`} cx="50%" cy="0%" r="78%">
          <stop offset="0%" stopColor={C.sh} stopOpacity="0.42"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`cobl-${uid}`} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor={C.lt} stopOpacity="0.45"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`cosp-${uid}`} cx="28%" cy="22%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`cofin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.fin} stopOpacity="0.8"/><stop offset="100%" stopColor={C.fin2} stopOpacity="0.35"/>
        </linearGradient>
        <clipPath id={`coclip-${uid}`}>
          <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z"/>
        </clipPath>
        {aura&&<filter id={`coa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>

      {aura&&<ellipse cx="32" cy="24" rx="26" ry="18" fill={aura.color} opacity={aura.opacity} filter={`url(#coa-${uid})`}/>}

      {/* Tail */}
      <g filter={`url(#cofg-${uid})`} className="fish-tail">
        <path d="M54,24 L62,18 L60,24 L62,30 Z" fill={`url(#cofin-${uid})`} stroke={C.fin} strokeWidth="0.5" strokeOpacity="0.35"/>
        <line x1="56" y1="24" x2="60" y2="20" stroke={C.fin2} strokeWidth="0.3" opacity="0.2"/>
        <line x1="56" y1="24" x2="60" y2="28" stroke={C.fin2} strokeWidth="0.3" opacity="0.2"/>
      </g>

      {/* Adipose fin — cory signature */}
      <path d="M46,12 Q48,8 50,11" fill={C.fin} opacity="0.4"/>

      {/* Dorsal fin — with locking spine */}
      <g className="fish-dorsal" filter={`url(#cofg-${uid})`}>
        <path d="M28,10 Q32,2 38,8" fill={`url(#cofin-${uid})`} stroke={C.fin} strokeWidth="0.5" strokeOpacity="0.4"/>
        <line x1="30" y1="9" x2="32" y2="4" stroke={C.fin} strokeWidth="0.6" opacity="0.3"/>
      </g>

      {/* Pectoral — with venomous spine */}
      <g className="fish-pectoral">
        <ellipse cx="24" cy="30" rx="7" ry="4" fill={`url(#cofin-${uid})`} transform="rotate(-18,24,30)"/>
        {/* Spine */}
        <line x1="18" y1="28" x2="16" y2="26" stroke={C.fin} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      </g>

      {/* Body — flat-bottomed armored catfish */}
      <g filter={`url(#cosh-${uid})`}>
        <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z" fill={`url(#cob-${uid})`}/>
      </g>
      <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z" fill={`url(#cod-${uid})`}/>
      <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z" fill={`url(#cobl-${uid})`}/>

      {/* Armored scute plates — 2 rows */}
      <g clipPath={`url(#coclip-${uid})`} opacity="0.2">
        {[16,22,28,34,40,46,52].map((x,i) => (
          <g key={i}>
            <path d={`M${x},16 L${x+4},15`} stroke={C.plate} strokeWidth="0.6"/>
            <path d={`M${x},20 L${x+4},19`} stroke={C.plate} strokeWidth="0.5"/>
            <ellipse cx={x+2} cy={18} rx="2.5" ry="1.8" fill="none" stroke={C.plate} strokeWidth="0.4" opacity="0.5"/>
          </g>
        ))}
        {/* Lateral line of plates */}
        <path d="M16,22 L52,22" stroke={C.plate} strokeWidth="0.6" opacity="0.3"/>
      </g>

      {/* Dark spots — species markings */}
      <circle cx="24" cy="22" rx="7" fill={C.spot} opacity="0.2"/>
      <circle cx="38" cy="24" rx="6" fill={C.spot} opacity="0.16"/>
      <circle cx="48" cy="22" rx="4" fill={C.spot} opacity="0.12"/>

      {/* Specular */}
      <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z" fill={`url(#cosp-${uid})`}/>

      {/* Outline */}
      <path d="M56,24 Q56,14 44,10 Q32,8 20,12 Q10,16 10,24 Q10,32 20,34 Q32,36 44,34 Q56,32 56,24 Z" fill="none" stroke={C.outline} strokeWidth="0.8" opacity="0.3"/>

      {/* Barbels — 2 pairs, signature catfish */}
      <path d="M12,26 Q7,30 4,28" stroke={C.barb} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <path d="M12,28 Q7,34 4,34" stroke={C.barb} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
      <circle cx="4" cy="28" r="0.6" fill={C.barb} opacity="0.4"/>
      <circle cx="4" cy="34" r="0.6" fill={C.barb} opacity="0.4"/>
      {/* Short mental barbels */}
      <path d="M12,30 Q9,32 8,31" stroke={C.barb} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M12,31 Q9,34 8,33" stroke={C.barb} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.45"/>

      {/* Eye */}
      <circle cx="14" cy="21" r="4" fill="rgba(0,0,0,0.08)"/>
      <circle cx="14" cy="20.5" r="3.5" fill="#fafafa"/>
      <circle cx="14" cy="20.5" r="2.5" fill="#1a1a2a"/>
      <circle cx="13" cy="19.5" r="1.2" fill="white"/>
      <circle cx="15" cy="21.5" r="0.45" fill="rgba(255,255,255,0.3)"/>

      {/* Mouth — downward-facing sucker */}
      <path d="M10,26 Q9,27 10,28" stroke={C.outline} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.35"/>

      {selected&&<ellipse cx="32" cy="24" rx="30" ry="18" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5" strokeDasharray="4 2"/>}
    </svg>
  );
}

export default memo(CorydorasSprite);