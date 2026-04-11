import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PALETTES = {
  default:{b:'#a0aab8',b2:'#606878',bl:'#c0c8d0',lt:'#d8e0e8',sh:'#384858',tail:'#ff6830',tail2:'#ff9050',tail3:'#ffb070',spot1:'#4080ff',spot2:'#40c060',fin:'#8090a0',outline:'#303840'},
  cobra:{b:'#88a070',b2:'#506040',bl:'#a0b888',lt:'#b8d0a0',sh:'#283020',tail:'#d0c020',tail2:'#e8d840',tail3:'#f0e860',spot1:'#308020',spot2:'#60a040',fin:'#708060',outline:'#283020'},
  tuxedo:{b:'#1a2028',b2:'#0a1018',bl:'#303848',lt:'#485868',sh:'#040810',tail:'#ff3030',tail2:'#ff5050',tail3:'#ff7070',spot1:'#c02020',spot2:'#e04040',fin:'#202830',outline:'#080c14'},
};

function GuppySprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'gp').slice(0,8), rarity=fish?.species?.rarity||'common', aura=AURA[rarity];
  const v=fish?.colorVariant||'default';
  const C = PALETTES[v] || PALETTES.default;
  const W=size*0.75, H=size*0.65;

  return (
    <svg width={W} height={H} viewBox="0 0 58 46" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`gpsh-${uid}`} x="-25%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000" floodOpacity="0.28"/>
        </filter>
        <filter id={`gpfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood floodColor={C.tail} floodOpacity="0.4" result="c"/>
          <feComposite in="c" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id={`gpb-${uid}`} cx="32%" cy="28%" r="65%">
          <stop offset="0%" stopColor={C.lt}/><stop offset="28%" stopColor={C.bl}/>
          <stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/>
        </radialGradient>
        <radialGradient id={`gpd-${uid}`} cx="50%" cy="0%" r="78%">
          <stop offset="0%" stopColor={C.sh} stopOpacity="0.42"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`gpbl-${uid}`} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor={C.lt} stopOpacity="0.45"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`gpsp-${uid}`} cx="28%" cy="20%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="50%" stopColor="white" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`gptail-${uid}`} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={C.tail} stopOpacity="0.9"/>
          <stop offset="40%" stopColor={C.tail2} stopOpacity="0.7"/>
          <stop offset="80%" stopColor={C.tail3} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={C.tail} stopOpacity="0.3"/>
        </linearGradient>
        <clipPath id={`gpclip-${uid}`}><ellipse cx="22" cy="23" rx="16" ry="11"/></clipPath>
        {aura&&<filter id={`gpa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>

      {aura&&<ellipse cx="24" cy="23" rx="22" ry="18" fill={aura.color} opacity={aura.opacity} filter={`url(#gpa-${uid})`}/>}

      {/* Elaborate tail fan — the guppy's glory */}
      <g filter={`url(#gpfg-${uid})`} className="fish-tail-flowing">
        <path d="M36,23 Q46,8 54,6 Q48,14 50,23 Q48,32 54,40 Q46,38 36,23 Z"
          fill={`url(#gptail-${uid})`} stroke={C.tail} strokeWidth="0.5" strokeOpacity="0.5"/>
        <path d="M38,23 Q45,13 50,10 Q47,18 48,23 Q47,28 50,36 Q45,33 38,23 Z"
          fill={C.tail2} opacity="0.25"/>
        {/* Tail vein patterns */}
        <path d="M38,23 Q44,17 50,14" stroke={C.tail} strokeWidth="0.5" fill="none" opacity="0.3"/>
        <path d="M38,23 Q46,23 52,23" stroke={C.tail} strokeWidth="0.4" fill="none" opacity="0.2"/>
        <path d="M38,23 Q44,29 50,32" stroke={C.tail} strokeWidth="0.5" fill="none" opacity="0.3"/>
        {/* Tail spots */}
        <circle cx="44" cy="18" r="2" fill={C.spot1} opacity="0.25"/>
        <circle cx="46" cy="28" r="1.5" fill={C.spot2} opacity="0.2"/>
        <circle cx="42" cy="14" r="1" fill={C.spot1} opacity="0.15"/>
      </g>

      {/* Dorsal — small but colorful */}
      <path d="M18,12 Q22,7 28,10" fill={C.tail} opacity="0.4" className="fish-dorsal"/>

      {/* Body */}
      <g filter={`url(#gpsh-${uid})`}><ellipse cx="22" cy="23" rx="16" ry="11" fill={`url(#gpb-${uid})`}/></g>
      <ellipse cx="22" cy="23" rx="16" ry="11" fill={`url(#gpd-${uid})`}/>
      <ellipse cx="22" cy="23" rx="16" ry="11" fill={`url(#gpbl-${uid})`}/>

      {/* Color spots on body — varies by individual */}
      <g clipPath={`url(#gpclip-${uid})`}>
        <circle cx="30" cy="20" r="4" fill={C.tail} opacity="0.3"/>
        <circle cx="28" cy="25" r="3" fill={C.spot1} opacity="0.2"/>
        <circle cx="25" cy="18" r="2.5" fill={C.tail2} opacity="0.18"/>
        <circle cx="32" cy="24" r="2" fill={C.spot2} opacity="0.15"/>
      </g>

      {/* Specular */}
      <ellipse cx="22" cy="23" rx="16" ry="11" fill={`url(#gpsp-${uid})`}/>

      {/* Outline */}
      <ellipse cx="22" cy="23" rx="16" ry="11" fill="none" stroke={C.outline} strokeWidth="0.8" opacity="0.3"/>

      {/* Gravid spot (female guppies) */}
      <circle cx="30" cy="27" r="2" fill={C.sh} opacity="0.15"/>

      {/* Gill */}
      <path d="M14" cy="28" stroke={C.sh} strokeWidth="0.7" fill="none" opacity="0.2"/>

      {/* Eye */}
      <circle cx="12" cy="21" r="3.5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="12" cy="20.5" r="3" fill="#fafafa"/>
      <circle cx="12" cy="20.5" r="2.2" fill="#1a1a2a"/>
      <circle cx="11" cy="19.5" r="1.1" fill="white"/>
      <circle cx="13" cy="21.5" r="0.4" fill="rgba(255,255,255,0.3)"/>

      {/* Mouth */}
      <path d="M7,24 Q6,25 7,25.5" stroke={C.outline} strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.35"/>

      {selected&&<ellipse cx="24" cy="23" rx="20" ry="15" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5" strokeDasharray="4 2"/>}
    </svg>
  );
}

export default memo(GuppySprite);