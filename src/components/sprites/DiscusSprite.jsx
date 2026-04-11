import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function DiscusSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'dc').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const v=fish?.colorVariant||'default', W=size, H=size*0.95;
  const P = {
    default:{b:'#c84020',b2:'#801810',bl:'#e06040',lt:'#f08060',sh:'#400808',ac:'#d04828',fin:'#a03020',lat:'#e05838',str:'#1870c0'},
    blue:   {b:'#2848a0',b2:'#101860',bl:'#4060c0',lt:'#6080e0',sh:'#080830',ac:'#3050b0',fin:'#2040a0',lat:'#4868c0',str:'#80c0ff'},
    pigeon: {b:'#e8d0a0',b2:'#b09060',bl:'#f0e0c0',lt:'#f8f0d8',sh:'#706030',ac:'#d0b880',fin:'#c0a870',lat:'#e0c898',str:'#c09050'},
  }[v]||{b:'#c84020',b2:'#801810',bl:'#e06040',lt:'#f08060',sh:'#400808',ac:'#d04828',fin:'#a03020',lat:'#e05838',str:'#1870c0'};
  return (
    <svg width={W} height={H} viewBox="0 0 76 72" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`dcsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`dcfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feFlood floodColor={P.lat} floodOpacity="0.3" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`dcb-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={P.lt}/><stop offset="22%" stopColor={P.bl}/><stop offset="55%" stopColor={P.b}/><stop offset="100%" stopColor={P.b2}/></radialGradient>
        <radialGradient id={`dcd-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={P.sh} stopOpacity="0.45"/><stop offset="100%" stopColor={P.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`dcbl-${uid}`} cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor={P.lt} stopOpacity="0.45"/><stop offset="100%" stopColor={P.lt} stopOpacity="0"/></radialGradient>
        <radialGradient id={`dcsp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="50%" stopColor="white" stopOpacity="0.12"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`dclat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stopColor={P.lat} stopOpacity="0"/><stop offset="30%" stopColor={P.lat} stopOpacity="0.22"/><stop offset="50%" stopColor={P.lat} stopOpacity="0.38"/><stop offset="70%" stopColor={P.lat} stopOpacity="0.22"/><stop offset="100%" stopColor={P.lat} stopOpacity="0"/></linearGradient>
        <linearGradient id={`dcfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={P.fin} stopOpacity="0.85"/><stop offset="100%" stopColor={P.b2} stopOpacity="0.35"/></linearGradient>
        <clipPath id={`dcclip-${uid}`}><ellipse cx="34" cy="36" rx="24" ry="26"/></clipPath>
        {aura&&<filter id={`dca-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="34" cy="36" rx="30" ry="30" fill={aura.color} opacity={aura.opacity} filter={`url(#dca-${uid})`}/>}
      {/* Tail */}
      <g filter={`url(#dcfg-${uid})`} className="fish-tail">
        <path d="M56,36 Q64,26 70,24 Q66,32 68,36 Q66,40 70,48 Q64,46 56,36 Z" fill={`url(#dcfin-${uid})`} stroke={P.fin} strokeWidth="0.6" strokeOpacity="0.4"/>
        <line x1="58" y1="36" x2="66" y2="28" stroke={P.fin} strokeWidth="0.35" opacity="0.2"/>
        <line x1="58" y1="36" x2="66" y2="44" stroke={P.fin} strokeWidth="0.35" opacity="0.2"/>
      </g>
      {/* Dorsal — very tall, continuous */}
      <g className="fish-dorsal" filter={`url(#dcfg-${uid})`}>
        <path d="M20,12 Q30,2 46,4 Q56,8 62,16 L58,26" fill={`url(#dcfin-${uid})`} stroke={P.fin} strokeWidth="0.6" strokeOpacity="0.4"/>
        {[24,30,36,42,48,54].map((x,i)=><line key={i} x1={x} y1={18-i*0.6} x2={x+2} y2={6+i*0.8} stroke={P.fin} strokeWidth="0.3" opacity="0.18"/>)}
      </g>
      {/* Anal — mirrors dorsal */}
      <g className="fish-anal-fin">
        <path d="M20,60 Q30,70 46,68 Q56,64 62,56 L58,46" fill={`url(#dcfin-${uid})`} stroke={P.fin} strokeWidth="0.5" strokeOpacity="0.35"/>
        {[24,30,36,42,48,54].map((x,i)=><line key={i} x1={x} y1={54+i*0.6} x2={x+2} y2={66-i*0.8} stroke={P.fin} strokeWidth="0.3" opacity="0.15"/>)}
      </g>
      {/* Pectoral */}
      <ellipse cx="24" cy="42" rx="8" ry="4" fill={`url(#dcfin-${uid})`} transform="rotate(-25,24,42)" className="fish-pectoral" filter={`url(#dcfg-${uid})`}/>
      {/* Body — perfect disc */}
      <g filter={`url(#dcsh-${uid})`}><ellipse cx="34" cy="36" rx="24" ry="26" fill={`url(#dcb-${uid})`}/></g>
      <ellipse cx="34" cy="36" rx="24" ry="26" fill={`url(#dcd-${uid})`}/>
      <ellipse cx="34" cy="36" rx="24" ry="26" fill={`url(#dcbl-${uid})`}/>
      <ellipse cx="34" cy="36" rx="24" ry="26" fill={`url(#dclat-${uid})`}/>
      {/* Vertical stripes — the Discus signature */}
      <g clipPath={`url(#dcclip-${uid})`} opacity="0.22">
        {[16,22,28,34,40,46,52].map((x,i)=>(
          <line key={i} x1={x} y1="12" x2={x} y2="60" stroke={P.str} strokeWidth={1.8-i*0.1} opacity={0.4-(i%3)*0.05}/>
        ))}
        {/* Wavy horizontal stripes on face */}
        <path d="M12,30 Q18,28 24,30 Q30,32 34,30" stroke={P.str} strokeWidth="0.8" fill="none" opacity="0.3"/>
        <path d="M12,34 Q18,32 24,34 Q30,36 34,34" stroke={P.str} strokeWidth="0.8" fill="none" opacity="0.25"/>
        <path d="M12,38 Q18,36 24,38 Q30,40 34,38" stroke={P.str} strokeWidth="0.8" fill="none" opacity="0.2"/>
      </g>
      <ellipse cx="34" cy="36" rx="24" ry="26" fill={`url(#dcsp-${uid})`}/>
      <ellipse cx="34" cy="36" rx="24" ry="26" fill="none" stroke={P.sh} strokeWidth="0.9" opacity="0.25"/>
      {/* Gill */}
      <path d="M22,26 Q24,36 22,46" stroke={P.sh} strokeWidth="0.8" fill="none" opacity="0.18"/>
      {/* Mouth */}
      <path d="M12,38 Q10,39 12,40" stroke={P.sh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.35"/>
      {/* Eye — red in wild discus */}
      <circle cx="18" cy="34" r="5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="18" cy="33.5" r="4.5" fill="#fafafa"/>
      <circle cx="18" cy="33.5" r="3.5" fill="#c02020"/>
      <circle cx="18" cy="33.5" r="2.5" fill="#0a0a12"/>
      <circle cx="16.5" cy="32" r="1.3" fill="white"/>
      <circle cx="19" cy="34.5" r="0.5" fill="rgba(255,255,255,0.3)"/>
      <circle cx="14" cy="33" r="0.8" fill={P.sh} opacity="0.2"/>
      {selected&&<ellipse cx="34" cy="36" rx="28" ry="30" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(DiscusSprite);