import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function HammerheadSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'hh').slice(0,8), rarity=fish?.species?.rarity||'epic', aura=AURA[rarity];
  const W=size*1.4, H=size*0.65;
  const C = {
    body:'#687888', body2:'#384858', belly:'#90a0b0', light:'#a8b8c8',
    shadow:'#1a2838', accent:'#607080', fin:'#506070', fin2:'#405060',
    lateral:'#8898a8', scale:'#7888a0', outline:'#2a3848',
    eyeRing:'#506060', mouth:'#384858', gillSlit:'#2a3848',
  };

  return (
    <svg width={W} height={H} viewBox="0 0 125 44" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`hhsh-${uid}`} x="-18%" y="-25%" width="136%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.32"/>
        </filter>
        <filter id={`hhfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood floodColor={C.lateral} floodOpacity="0.35" result="c"/>
          <feComposite in="c" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id={`hhb-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.light}/>
          <stop offset="30%" stopColor={C.body}/>
          <stop offset="70%" stopColor={C.body2}/>
          <stop offset="100%" stopColor={C.shadow}/>
        </linearGradient>
        <radialGradient id={`hhd-${uid}`} cx="50%" cy="0%" r="85%">
          <stop offset="0%" stopColor={C.shadow} stopOpacity="0.5"/>
          <stop offset="45%" stopColor={C.shadow} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`hhbl-${uid}`} cx="50%" cy="100%" r="58%">
          <stop offset="0%" stopColor="#d0dce8" stopOpacity="0.55"/>
          <stop offset="60%" stopColor="#d0dce8" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#d0dce8" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`hhlat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={C.lateral} stopOpacity="0"/>
          <stop offset="25%" stopColor={C.lateral} stopOpacity="0.25"/>
          <stop offset="50%" stopColor={C.lateral} stopOpacity="0.4"/>
          <stop offset="75%" stopColor={C.lateral} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={C.lateral} stopOpacity="0"/>
        </linearGradient>
        <radialGradient id={`hhsp-${uid}`} cx="26%" cy="18%" r="42%">
          <stop offset="0%" stopColor="white" stopOpacity="0.5"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`hhfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.fin} stopOpacity="0.85"/>
          <stop offset="50%" stopColor={C.fin2} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.fin} stopOpacity="0.3"/>
        </linearGradient>
        <clipPath id={`hhclip-${uid}`}>
          <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z"/>
        </clipPath>
        {aura&&<filter id={`hha-${uid}`} x="-55%" y="-60%" width="210%" height="220%">
          <feGaussianBlur stdDeviation={aura.blur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>}
      </defs>

      {/* Aura */}
      {aura&&<ellipse cx="58" cy="22" rx="50" ry="18" fill={aura.color} opacity={aura.opacity} filter={`url(#hha-${uid})`}/>}

      {/* Tail — powerful crescent */}
      <g filter={`url(#hhfg-${uid})`} className="fish-tail-flowing">
        <path d="M100,22 C104,14 112,8 118,10 C114,16 112,20 112,22 C112,24 114,28 118,34 C112,36 104,30 100,22 Z"
          fill={`url(#hhfin-${uid})`} stroke={C.fin} strokeWidth="0.7" strokeOpacity="0.5"/>
        <path d="M102,22 C104,17 108,13 112,14 C110,18 109,21 109,22 C109,23 110,26 112,30 C108,31 104,27 102,22"
          fill={C.light} opacity="0.12"/>
        <line x1="102" y1="22" x2="114" y2="12" stroke={C.fin} strokeWidth="0.4" opacity="0.2"/>
        <line x1="102" y1="22" x2="116" y2="18" stroke={C.fin} strokeWidth="0.3" opacity="0.15"/>
        <line x1="102" y1="22" x2="116" y2="26" stroke={C.fin} strokeWidth="0.3" opacity="0.15"/>
        <line x1="102" y1="22" x2="114" y2="32" stroke={C.fin} strokeWidth="0.4" opacity="0.2"/>
      </g>

      {/* Dorsal fin — iconic shark triangle */}
      <g className="fish-dorsal" filter={`url(#hhfg-${uid})`}>
        <path d="M56,6 Q60,-2 66,4 L64,12" fill={`url(#hhfin-${uid})`} stroke={C.fin} strokeWidth="0.6" strokeOpacity="0.5"/>
        <line x1="58" y1="10" x2="61" y2="2" stroke={C.fin} strokeWidth="0.3" opacity="0.2"/>
        <line x1="62" y1="8" x2="63" y2="3" stroke={C.fin} strokeWidth="0.3" opacity="0.15"/>
      </g>

      {/* Second dorsal */}
      <path d="M78,8 Q80,4 83,7" fill={C.fin} opacity="0.4" className="fish-dorsal"/>

      {/* Pectoral fins */}
      <g className="fish-pectoral">
        <path d="M44,32 Q50,40 60,38" fill={`url(#hhfin-${uid})`} stroke={C.fin} strokeWidth="0.5" strokeOpacity="0.4"/>
        <line x1="46" y1="33" x2="54" y2="38" stroke={C.fin} strokeWidth="0.3" opacity="0.15"/>
      </g>

      {/* Anal fin */}
      <path d="M76,34 Q80,40 86,36" fill={`url(#hhfin-${uid})`} className="fish-anal-fin"/>

      {/* Body */}
      <g filter={`url(#hhsh-${uid})`}>
        <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill={`url(#hhb-${uid})`}/>
      </g>
      <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill={`url(#hhd-${uid})`}/>
      <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill={`url(#hhbl-${uid})`}/>
      <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill={`url(#hhlat-${uid})`}/>

      {/* Hammer head */}
      <path d="M28,22 Q24,12 12,10 Q6,14 8,22 Q6,30 12,34 Q24,32 28,22 Z" fill={`url(#hhb-${uid})`}/>
      <path d="M28,22 Q24,12 12,10 Q6,14 8,22 Q6,30 12,34 Q24,32 28,22 Z" fill={`url(#hhd-${uid})`}/>
      <path d="M28,22 Q24,12 12,10 Q6,14 8,22 Q6,30 12,34 Q24,32 28,22 Z" fill={`url(#hhbl-${uid})`}/>

      {/* Dermal denticle texture (shark skin) */}
      <g clipPath={`url(#hhclip-${uid})`} opacity="0.12">
        {Array.from({length:12},(_, i) => (
          <line key={i} x1={32+i*6} y1="8" x2={32+i*6} y2="36" stroke={C.scale} strokeWidth="0.6"/>
        ))}
        {Array.from({length:6},(_, i) => (
          <line key={`h${i}`} x1="28" y1={10+i*5} x2="102" y2={10+i*5} stroke={C.scale} strokeWidth="0.4"/>
        ))}
      </g>

      {/* Countershading line — belly white boundary */}
      <path d="M30,26 Q50,28 70,27 Q85,26 100,25" stroke="rgba(200,215,230,0.2)" strokeWidth="1" fill="none"/>

      {/* Specular */}
      <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill={`url(#hhsp-${uid})`}/>

      {/* Body outline */}
      <path d="M102,22 Q102,12 82,8 Q62,5 42,8 Q26,12 26,22 Q26,32 42,36 Q62,39 82,36 Q102,32 102,22 Z" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.3"/>
      <path d="M28,22 Q24,12 12,10 Q6,14 8,22 Q6,30 12,34 Q24,32 28,22 Z" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.3"/>

      {/* Gill slits — 5 vertical */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={32+i*3.5} y1={14} x2={32+i*3.5} y2={28} stroke={C.gillSlit} strokeWidth="0.9" opacity="0.3"/>
      ))}

      {/* Mouth */}
      <path d="M26,24 Q24,26 26,28" stroke={C.mouth} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>

      {/* Eyes on hammer ends — full detail */}
      {/* Left eye */}
      <circle cx="10" cy="13" r="4" fill="rgba(0,0,0,0.08)"/>
      <circle cx="10" cy="12.5" r="3.5" fill="#e8ece8"/>
      <circle cx="10" cy="12.5" r="2.8" fill={C.eyeRing}/>
      <circle cx="10" cy="12.5" r="2" fill="#0a0a12"/>
      <circle cx="9" cy="11.5" r="1" fill="white"/>
      <circle cx="10.8" cy="13.2" r="0.4" fill="rgba(255,255,255,0.3)"/>
      {/* Right eye */}
      <circle cx="10" cy="31" r="4" fill="rgba(0,0,0,0.08)"/>
      <circle cx="10" cy="31.5" r="3.5" fill="#e8ece8"/>
      <circle cx="10" cy="31.5" r="2.8" fill={C.eyeRing}/>
      <circle cx="10" cy="31.5" r="2" fill="#0a0a12"/>
      <circle cx="9" cy="30.5" r="1" fill="white"/>
      <circle cx="10.8" cy="32.2" r="0.4" fill="rgba(255,255,255,0.3)"/>

      {/* Nostrils on hammer underside */}
      <ellipse cx="14" cy="18" rx="1.5" ry="0.8" fill={C.shadow} opacity="0.2"/>
      <ellipse cx="14" cy="26" rx="1.5" ry="0.8" fill={C.shadow} opacity="0.2"/>

      {/* Ampullae of Lorenzini — electrosensory pores on hammer */}
      {[8,12,16,20].map((x,i) => (
        <circle key={i} cx={x} cy={22} r="0.5" fill={C.shadow} opacity="0.15"/>
      ))}

      {selected&&<ellipse cx="58" cy="22" rx="54" ry="21" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}

export default memo(HammerheadSprite);