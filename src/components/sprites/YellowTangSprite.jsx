import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function YellowTangSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'yt').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const W=size*1.05, H=size*0.9;
  const C = {
    body:'#ffd020', body2:'#c8a010', belly:'#ffe840', light:'#fff060',
    shadow:'#806000', accent:'#e0b818', fin:'#f0c818', fin2:'#d0a010',
    lateral:'#ffffa0', scale:'#e8c030', outline:'#907008',
    spine:'#ffffff', eyeRing:'#e0c020', mouth:'#b09010',
  };

  return (
    <svg width={W} height={H} viewBox="0 0 84 72" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`ytsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.28"/>
        </filter>
        <filter id={`ytfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood floodColor={C.lateral} floodOpacity="0.3" result="c"/>
          <feComposite in="c" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id={`ytb-${uid}`} cx="30%" cy="26%" r="70%">
          <stop offset="0%" stopColor={C.light}/><stop offset="22%" stopColor={C.belly}/>
          <stop offset="55%" stopColor={C.body}/><stop offset="100%" stopColor={C.body2}/>
        </radialGradient>
        <radialGradient id={`ytd-${uid}`} cx="50%" cy="0%" r="82%">
          <stop offset="0%" stopColor={C.shadow} stopOpacity="0.38"/>
          <stop offset="45%" stopColor={C.shadow} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`ytbl-${uid}`} cx="50%" cy="100%" r="58%">
          <stop offset="0%" stopColor={C.light} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={C.light} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`ytlat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor={C.lateral} stopOpacity="0"/>
          <stop offset="25%" stopColor={C.lateral} stopOpacity="0.2"/>
          <stop offset="50%" stopColor={C.lateral} stopOpacity="0.35"/>
          <stop offset="75%" stopColor={C.lateral} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={C.lateral} stopOpacity="0"/>
        </linearGradient>
        <radialGradient id={`ytsp-${uid}`} cx="26%" cy="18%" r="42%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id={`ytfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.fin} stopOpacity="0.88"/>
          <stop offset="50%" stopColor={C.fin2} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.fin} stopOpacity="0.3"/>
        </linearGradient>
        <clipPath id={`ytclip-${uid}`}><ellipse cx="38" cy="36" rx="26" ry="22"/></clipPath>
        {aura&&<filter id={`yta-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>

      {aura&&<ellipse cx="38" cy="36" rx="32" ry="26" fill={aura.color} opacity={aura.opacity} filter={`url(#yta-${uid})`}/>}

      {/* Tail */}
      <g filter={`url(#ytfg-${uid})`} className="fish-tail">
        <path d="M62,36 L74,26 L72,36 L74,46 Z" fill={`url(#ytfin-${uid})`} stroke={C.fin2} strokeWidth="0.6" strokeOpacity="0.4"/>
        <line x1="64" y1="36" x2="72" y2="28" stroke={C.fin2} strokeWidth="0.4" opacity="0.2"/>
        <line x1="64" y1="36" x2="72" y2="44" stroke={C.fin2} strokeWidth="0.4" opacity="0.2"/>
      </g>

      {/* Dorsal — tall, sweeping */}
      <g className="fish-dorsal" filter={`url(#ytfg-${uid})`}>
        <path d="M26,12 C32,2 44,0 58,6 L56,20" fill={`url(#ytfin-${uid})`} stroke={C.fin2} strokeWidth="0.6" strokeOpacity="0.4"/>
        {[30,36,42,48,54].map((x,i) => <line key={i} x1={x} y1={18-i*0.5} x2={x+2} y2={6-i*0.3} stroke={C.fin2} strokeWidth="0.3" opacity="0.18"/>)}
      </g>

      {/* Anal — equally tall, signature tang shape */}
      <g className="fish-anal-fin">
        <path d="M26,60 C32,70 44,72 58,66 L56,52" fill={`url(#ytfin-${uid})`} stroke={C.fin2} strokeWidth="0.5" strokeOpacity="0.3"/>
        {[32,40,48,54].map((x,i) => <line key={i} x1={x} y1={54+i*0.5} x2={x+2} y2={66+i*0.3} stroke={C.fin2} strokeWidth="0.3" opacity="0.15"/>)}
      </g>

      {/* Pectoral */}
      <ellipse cx="28" cy="42" rx="9" ry="4.5" fill={`url(#ytfin-${uid})`} transform="rotate(-22,28,42)" className="fish-pectoral" filter={`url(#ytfg-${uid})`}/>

      {/* Body — disc-shaped tang */}
      <g filter={`url(#ytsh-${uid})`}><ellipse cx="38" cy="36" rx="26" ry="22" fill={`url(#ytb-${uid})`}/></g>
      <ellipse cx="38" cy="36" rx="26" ry="22" fill={`url(#ytd-${uid})`}/>
      <ellipse cx="38" cy="36" rx="26" ry="22" fill={`url(#ytbl-${uid})`}/>
      <ellipse cx="38" cy="36" rx="26" ry="22" fill={`url(#ytlat-${uid})`}/>

      {/* Scale texture */}
      <g clipPath={`url(#ytclip-${uid})`} opacity="0.1">
        {[18,26,34,42,50,58].map((x,i) => <path key={i} d={`M${x},18 Q${x+4},36 ${x},54`} stroke={C.scale} strokeWidth="0.6" fill="none"/>)}
        {[22,28,34,40,46].map((y,i) => <line key={i} x1="14" y1={y} x2="62" y2={y} stroke={C.scale} strokeWidth="0.4"/>)}
      </g>

      {/* Specular */}
      <ellipse cx="38" cy="36" rx="26" ry="22" fill={`url(#ytsp-${uid})`}/>

      {/* Outline */}
      <ellipse cx="38" cy="36" rx="26" ry="22" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.3"/>

      {/* TAIL SCALPEL — white retractable spine, tang signature */}
      <path d="M60,34 L66,35 L60,36" fill={C.spine} opacity="0.7"/>
      <circle cx="64" cy="35" r="2" fill={C.spine} opacity="0.5"/>
      <circle cx="64" cy="35" r="1" fill={C.spine} opacity="0.8"/>
      {/* Warning ring around scalpel */}
      <circle cx="64" cy="35" r="3.5" fill="none" stroke={C.spine} strokeWidth="0.6" opacity="0.25"/>

      {/* Gill */}
      <path d="M26,28 Q27,36 26,44" stroke={C.shadow} strokeWidth="1" fill="none" opacity="0.2"/>

      {/* Mouth — small, pointed tang snout */}
      <path d="M12,38 Q10,39 12,40" stroke={C.mouth} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M12,37 Q14,36 18,37" stroke={C.outline} strokeWidth="0.5" fill="none" opacity="0.2"/>

      {/* Eye */}
      <circle cx="20" cy="34" r="5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="20" cy="33.5" r="4.5" fill="#fafafa"/>
      <circle cx="20" cy="33.5" r="3.5" fill={C.eyeRing}/>
      <circle cx="20" cy="33.5" r="2.5" fill="#0a0a12"/>
      <circle cx="18.5" cy="32" r="1.3" fill="white"/>
      <circle cx="21" cy="34.5" r="0.5" fill="rgba(255,255,255,0.3)"/>

      {/* Nostril */}
      <circle cx="14" cy="34" r="0.8" fill={C.shadow} opacity="0.25"/>

      {selected&&<ellipse cx="38" cy="36" rx="30" ry="26" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}

export default memo(YellowTangSprite);