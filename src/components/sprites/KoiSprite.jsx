import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function KoiSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'ko').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const v=fish?.colorVariant||'default', W=size*1.1, H=size*0.75;
  const P = {
    default:{b:'#f0e8e0',b2:'#c0b0a0',bl:'#f8f0e8',lt:'#ffffff',sh:'#807060',fin:'#f0d0b0',pat:'#e03020',pat2:'#f04030',outline:'#908070'},
    kohaku: {b:'#f8f0e0',b2:'#d0c0a8',bl:'#ffffff',lt:'#ffffff',sh:'#908070',fin:'#f0d8c0',pat:'#e82020',pat2:'#f03030',outline:'#a09080'},
    showa:  {b:'#f8f0e0',b2:'#d0c0a8',bl:'#ffffff',lt:'#ffffff',sh:'#908070',fin:'#e0d0b8',pat:'#e82020',pat2:'#0a0a0a',outline:'#706050'},
  }[v]||{b:'#f0e8e0',b2:'#c0b0a0',bl:'#f8f0e8',lt:'#ffffff',sh:'#807060',fin:'#f0d0b0',pat:'#e03020',pat2:'#f04030',outline:'#908070'};
  return (
    <svg width={W} height={H} viewBox="0 0 88 58" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`kosh-${uid}`} x="-22%" y="-20%" width="144%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.28"/></filter>
        <filter id={`kofg-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8" result="blur"/><feFlood floodColor={P.pat} floodOpacity="0.25" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`kob-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={P.lt}/><stop offset="25%" stopColor={P.bl}/><stop offset="55%" stopColor={P.b}/><stop offset="100%" stopColor={P.b2}/></radialGradient>
        <radialGradient id={`kod-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={P.sh} stopOpacity="0.35"/><stop offset="100%" stopColor={P.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`kobl-${uid}`} cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor={P.lt} stopOpacity="0.45"/><stop offset="100%" stopColor={P.lt} stopOpacity="0"/></radialGradient>
        <radialGradient id={`kosp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.6"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`kofin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={P.fin} stopOpacity="0.8"/><stop offset="100%" stopColor={P.b2} stopOpacity="0.3"/></linearGradient>
        <clipPath id={`koclip-${uid}`}><ellipse cx="38" cy="29" rx="28" ry="19"/></clipPath>
        {aura&&<filter id={`koa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="38" cy="29" rx="34" ry="24" fill={aura.color} opacity={aura.opacity} filter={`url(#koa-${uid})`}/>}
      {/* Tail — forked, elegant */}
      <g filter={`url(#kofg-${uid})`} className="fish-tail-flowing">
        <path d="M64,29 Q72,18 78,16 Q74,24 76,29 Q74,34 78,42 Q72,40 64,29 Z" fill={`url(#kofin-${uid})`} stroke={P.outline} strokeWidth="0.5" strokeOpacity="0.3"/>
        <line x1="66" y1="29" x2="74" y2="20" stroke={P.outline} strokeWidth="0.3" opacity="0.15"/>
        <line x1="66" y1="29" x2="74" y2="38" stroke={P.outline} strokeWidth="0.3" opacity="0.15"/>
      </g>
      {/* Dorsal */}
      <g className="fish-dorsal"><path d="M32,12 Q38,4 50,8 L46,16" fill={`url(#kofin-${uid})`} stroke={P.outline} strokeWidth="0.5" strokeOpacity="0.3"/></g>
      {/* Anal */}
      <path d="M32,46 Q38,54 50,50 L46,42" fill={`url(#kofin-${uid})`} className="fish-anal-fin"/>
      {/* Pectoral */}
      <ellipse cx="24" cy="34" rx="8" ry="4" fill={`url(#kofin-${uid})`} transform="rotate(-18,24,34)" className="fish-pectoral" filter={`url(#kofg-${uid})`}/>
      {/* Body */}
      <g filter={`url(#kosh-${uid})`}><ellipse cx="38" cy="29" rx="28" ry="19" fill={`url(#kob-${uid})`}/></g>
      <ellipse cx="38" cy="29" rx="28" ry="19" fill={`url(#kod-${uid})`}/>
      <ellipse cx="38" cy="29" rx="28" ry="19" fill={`url(#kobl-${uid})`}/>
      {/* Koi color patches — the signature beauty */}
      <g clipPath={`url(#koclip-${uid})`}>
        <ellipse cx="22" cy="26" rx="10" ry="8" fill={P.pat} opacity="0.6"/>
        <ellipse cx="44" cy="24" rx="12" ry="9" fill={P.pat} opacity="0.55"/>
        <ellipse cx="56" cy="32" rx="8" ry="7" fill={P.pat} opacity="0.5"/>
        <ellipse cx="34" cy="34" rx="7" ry="6" fill={P.pat2} opacity="0.35"/>
        {/* Patch edge softening */}
        <ellipse cx="22" cy="26" rx="11" ry="9" fill={P.pat} opacity="0.1"/>
        <ellipse cx="44" cy="24" rx="13" ry="10" fill={P.pat} opacity="0.08"/>
        {/* Scale pattern */}
        {[18,26,34,42,50,58].map((x,i)=><path key={i} d={`M${x},16 Q${x+4},29 ${x},42`} stroke={P.b2} strokeWidth="0.4" fill="none" opacity="0.1"/>)}
        {[20,26,32,38].map((y,i)=><line key={i} x1="12" y1={y} x2="64" y2={y} stroke={P.b2} strokeWidth="0.3" opacity="0.06"/>)}
      </g>
      <ellipse cx="38" cy="29" rx="28" ry="19" fill={`url(#kosp-${uid})`}/>
      <ellipse cx="38" cy="29" rx="28" ry="19" fill="none" stroke={P.outline} strokeWidth="0.8" opacity="0.2"/>
      {/* Barbels */}
      <path d="M12,30 Q8,34 6,32" stroke={P.outline} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d="M12,32 Q8,36 6,36" stroke={P.outline} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.25"/>
      {/* Gill */}
      <path d="M20,22 Q22,29 20,36" stroke={P.sh} strokeWidth="0.7" fill="none" opacity="0.15"/>
      {/* Mouth */}
      <path d="M12,30 Q10,31 12,32" stroke={P.outline} strokeWidth="0.8" fill="none" opacity="0.3"/>
      {/* Eye */}
      <circle cx="16" cy="27" r="4" fill="rgba(0,0,0,0.06)"/><circle cx="16" cy="26.5" r="3.5" fill="#fafafa"/><circle cx="16" cy="26.5" r="2.5" fill="#1a1a2a"/><circle cx="15" cy="25.5" r="1.2" fill="white"/><circle cx="16.8" cy="27.3" r="0.4" fill="rgba(255,255,255,0.3)"/>
      {selected&&<ellipse cx="38" cy="29" rx="32" ry="23" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(KoiSprite);