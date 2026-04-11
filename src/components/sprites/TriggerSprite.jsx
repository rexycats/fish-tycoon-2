import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function TriggerSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'tr').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const W=size*1.05, H=size*0.85;
  const C = { b:'#1a3050',b2:'#0a1828',bl:'#2a4060',lt:'#3a5878',sh:'#040c18',
    spot:'#f0d840',spot2:'#ffffff',fin:'#1a2840',lip:'#e8a020',outline:'#081420',lat:'#284060' };
  return (
    <svg width={W} height={H} viewBox="0 0 82 66" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`trsh-${uid}`} x="-22%" y="-18%" width="144%" height="156%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`trfg-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="1.8" result="blur"/><feFlood floodColor={C.spot} floodOpacity="0.25" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`trb-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={C.lt}/><stop offset="25%" stopColor={C.bl}/><stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`trd-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.45"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`trbl-${uid}`} cx="50%" cy="100%" r="55%"><stop offset="0%" stopColor={C.lt} stopOpacity="0.4"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/></radialGradient>
        <radialGradient id={`trsp-${uid}`} cx="28%" cy="20%" r="42%"><stop offset="0%" stopColor="white" stopOpacity="0.4"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`trlat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stopColor={C.lat} stopOpacity="0"/><stop offset="30%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="50%" stopColor={C.lat} stopOpacity="0.3"/><stop offset="70%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="100%" stopColor={C.lat} stopOpacity="0"/></linearGradient>
        <linearGradient id={`trfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.8"/><stop offset="100%" stopColor={C.b2} stopOpacity="0.35"/></linearGradient>
        <clipPath id={`trclip-${uid}`}><ellipse cx="36" cy="33" rx="26" ry="23"/></clipPath>
        {aura&&<filter id={`tra-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="36" cy="33" rx="32" ry="28" fill={aura.color} opacity={aura.opacity} filter={`url(#tra-${uid})`}/>}
      {/* Tail — small, angular */}
      <g className="fish-tail"><path d="M60,33 Q66,26 72,24 Q68,30 70,33 Q68,36 72,42 Q66,40 60,33 Z" fill={`url(#trfin-${uid})`} stroke={C.fin} strokeWidth="0.5" strokeOpacity="0.4"/></g>
      {/* Trigger spine — THE defining feature, lockable dorsal */}
      <g className="fish-dorsal" filter={`url(#trfg-${uid})`}>
        <path d="M30,12 Q34,0 38,10" fill={C.fin} opacity="0.7" stroke={C.outline} strokeWidth="0.8" strokeOpacity="0.5"/>
        <line x1="34" y1="10" x2="34" y2="2" stroke={C.outline} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      </g>
      {/* Second dorsal + anal — symmetric */}
      <path d="M42,12 Q48,6 56,10 L52,18" fill={`url(#trfin-${uid})`} stroke={C.outline} strokeWidth="0.4" strokeOpacity="0.3"/>
      <g className="fish-anal-fin"><path d="M42,54 Q48,60 56,56 L52,48" fill={`url(#trfin-${uid})`}/></g>
      {/* Pectoral */}
      <ellipse cx="26" cy="38" rx="7" ry="4" fill={`url(#trfin-${uid})`} transform="rotate(-20,26,38)" className="fish-pectoral"/>
      {/* Body — angular, compressed */}
      <g filter={`url(#trsh-${uid})`}><ellipse cx="36" cy="33" rx="26" ry="23" fill={`url(#trb-${uid})`}/></g>
      <ellipse cx="36" cy="33" rx="26" ry="23" fill={`url(#trd-${uid})`}/>
      <ellipse cx="36" cy="33" rx="26" ry="23" fill={`url(#trbl-${uid})`}/>
      <ellipse cx="36" cy="33" rx="26" ry="23" fill={`url(#trlat-${uid})`}/>
      {/* Clown triggerfish pattern — large white spots on dark body */}
      <g clipPath={`url(#trclip-${uid})`}>
        {/* Large white belly spots */}
        {[[24,44,5],[32,48,4.5],[40,46,5],[48,42,4],[22,50,3.5],[36,52,4],[50,48,3]].map(([x,y,r],i)=>(
          <circle key={i} cx={x} cy={y} r={r} fill={C.spot2} opacity={0.5-(i%3)*0.05}/>
        ))}
        {/* Yellow saddle marking */}
        <ellipse cx="40" cy="20" rx="12" ry="6" fill={C.spot} opacity="0.45"/>
        <ellipse cx="36" cy="18" rx="8" ry="4" fill={C.spot} opacity="0.3"/>
        {/* Dark mesh network pattern */}
        {[20,28,36,44,52].map((x,i)=><path key={i} d={`M${x},16 Q${x+4},33 ${x},50`} stroke={C.outline} strokeWidth="0.4" fill="none" opacity="0.1"/>)}
      </g>
      <ellipse cx="36" cy="33" rx="26" ry="23" fill={`url(#trsp-${uid})`}/>
      <ellipse cx="36" cy="33" rx="26" ry="23" fill="none" stroke={C.outline} strokeWidth="0.8" opacity="0.22"/>
      {/* Orange lips — real clown trigger feature */}
      <path d="M12,35 Q8,33 6,35 Q8,37 12,35" fill={C.lip} opacity="0.6"/>
      <path d="M8,34 Q6,35 8,36" stroke={C.outline} strokeWidth="0.8" fill="none" opacity="0.3"/>
      {/* Eye — set high, with ridge */}
      <circle cx="18" cy="28" r="5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="18" cy="27.5" r="4.5" fill="#fafafa"/>
      <circle cx="18" cy="27.5" r="3.5" fill="#1a4028"/>
      <circle cx="18" cy="27.5" r="2.5" fill="#0a0a12"/>
      <circle cx="16.5" cy="26" r="1.3" fill="white"/>
      <circle cx="19" cy="28.5" r="0.5" fill="rgba(255,255,255,0.3)"/>
      {/* Eye ridge groove */}
      <path d="M14,24 Q16,22 22,24" stroke={C.b} strokeWidth="0.8" fill="none" opacity="0.2"/>
      {/* Gill */}
      <path d="M22,24 Q24,33 22,42" stroke={C.sh} strokeWidth="0.7" fill="none" opacity="0.15"/>
      {selected&&<ellipse cx="36" cy="33" rx="30" ry="27" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(TriggerSprite);