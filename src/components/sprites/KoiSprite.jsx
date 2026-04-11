import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PAL = {
  default:{b:'#f0e8d8',b2:'#c0a880',bl:'#f8f0e0',lt:'#fffaf0',sh:'#806040',patch1:'#e03020',patch2:'#c02818',patch3:'#ff4030',fin:'#f0d8c0',lat:'#f8e8d0',outline:'#907050'},
  kohaku: {b:'#fff0e0',b2:'#e0c8a0',bl:'#fff8f0',lt:'#ffffff',sh:'#a08060',patch1:'#ff2010',patch2:'#d01808',patch3:'#ff5040',fin:'#ffe8d0',lat:'#fff0e0',outline:'#a08860'},
  showa:  {b:'#181818',b2:'#080808',bl:'#303030',lt:'#484848',sh:'#000000',patch1:'#e02010',patch2:'#ff4030',patch3:'#ffffff',fin:'#282828',lat:'#383838',outline:'#101010'},
};
function KoiSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'ki').slice(0,8), rarity=fish?.species?.rarity||'uncommon', aura=AURA[rarity];
  const v=fish?.colorVariant||'default', C=PAL[v]||PAL.default, W=size*1.15, H=size*0.7;
  return (
    <svg width={W} height={H} viewBox="0 0 95 55" onClick={onClick} style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`kish-${uid}`} x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/></filter>
        <filter id={`kifg-${uid}`} x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2" result="blur"/><feFlood floodColor={C.patch1} floodOpacity="0.3" result="c"/><feComposite in="c" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id={`kib-${uid}`} cx="30%" cy="26%" r="70%"><stop offset="0%" stopColor={C.lt}/><stop offset="25%" stopColor={C.bl}/><stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/></radialGradient>
        <radialGradient id={`kid-${uid}`} cx="50%" cy="0%" r="82%"><stop offset="0%" stopColor={C.sh} stopOpacity="0.4"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/></radialGradient>
        <radialGradient id={`kibl-${uid}`} cx="50%" cy="100%" r="58%"><stop offset="0%" stopColor={C.lt} stopOpacity="0.45"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/></radialGradient>
        <radialGradient id={`kisp-${uid}`} cx="28%" cy="20%" r="40%"><stop offset="0%" stopColor="white" stopOpacity="0.5"/><stop offset="100%" stopColor="white" stopOpacity="0"/></radialGradient>
        <linearGradient id={`kilat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stopColor={C.lat} stopOpacity="0"/><stop offset="30%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="50%" stopColor={C.lat} stopOpacity="0.3"/><stop offset="70%" stopColor={C.lat} stopOpacity="0.2"/><stop offset="100%" stopColor={C.lat} stopOpacity="0"/></linearGradient>
        <linearGradient id={`kifin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.fin} stopOpacity="0.85"/><stop offset="100%" stopColor={C.b2} stopOpacity="0.35"/></linearGradient>
        <clipPath id={`kiclip-${uid}`}><ellipse cx="42" cy="28" rx="30" ry="18"/></clipPath>
        {aura&&<filter id={`kia-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>
      {aura&&<ellipse cx="42" cy="28" rx="36" ry="22" fill={aura.color} opacity={aura.opacity} filter={`url(#kia-${uid})`}/>}
      <g filter={`url(#kifg-${uid})`} className="fish-tail-flowing">
        <path d="M70,28 Q78,18 84,16 Q80,22 82,28 Q80,34 84,40 Q78,38 70,28 Z" fill={`url(#kifin-${uid})`} stroke={C.outline} strokeWidth="0.6" strokeOpacity="0.3"/>
        <path d="M72,28 Q76,22 80,20 Q78,26 78,28 Q78,30 80,36 Q76,34 72,28" fill={C.lt} opacity="0.12"/>
        <line x1="72" y1="28" x2="80" y2="20" stroke={C.outline} strokeWidth="0.3" opacity="0.15"/>
        <line x1="72" y1="28" x2="80" y2="36" stroke={C.outline} strokeWidth="0.3" opacity="0.15"/>
      </g>
      <g className="fish-dorsal" filter={`url(#kifg-${uid})`}><path d="M34,10 Q42,4 52,8 L48,16" fill={`url(#kifin-${uid})`} stroke={C.outline} strokeWidth="0.5" strokeOpacity="0.3"/></g>
      <path d="M34,46 Q42,52 52,48 L48,40" fill={`url(#kifin-${uid})`} className="fish-anal-fin"/>
      <ellipse cx="28" cy="34" rx="8" ry="4" fill={`url(#kifin-${uid})`} transform="rotate(-18,28,34)" className="fish-pectoral" filter={`url(#kifg-${uid})`}/>
      <g filter={`url(#kish-${uid})`}><ellipse cx="42" cy="28" rx="30" ry="18" fill={`url(#kib-${uid})`}/></g>
      <ellipse cx="42" cy="28" rx="30" ry="18" fill={`url(#kid-${uid})`}/>
      <ellipse cx="42" cy="28" rx="30" ry="18" fill={`url(#kibl-${uid})`}/>
      <ellipse cx="42" cy="28" rx="30" ry="18" fill={`url(#kilat-${uid})`}/>
      <g clipPath={`url(#kiclip-${uid})`}>
        <ellipse cx="30" cy="24" rx="12" ry="10" fill={C.patch1} opacity="0.55"/>
        <ellipse cx="52" cy="30" rx="10" ry="8" fill={C.patch2} opacity="0.45"/>
        <ellipse cx="40" cy="34" rx="8" ry="6" fill={C.patch1} opacity="0.35"/>
        <circle cx="22" cy="30" r="5" fill={C.patch3} opacity="0.3"/>
        <circle cx="60" cy="24" r="6" fill={C.patch2} opacity="0.25"/>
        {[18,26,34,42,50,58,66].map((x,i)=><path key={i} d={`M${x},14 Q${x+3},28 ${x},42`} stroke={C.lat} strokeWidth="0.5" fill="none" opacity="0.08"/>)}
      </g>
      <ellipse cx="42" cy="28" rx="30" ry="18" fill={`url(#kisp-${uid})`}/>
      <ellipse cx="42" cy="28" rx="30" ry="18" fill="none" stroke={C.outline} strokeWidth="0.9" opacity="0.25"/>
      <path d="M14,22 Q16,28 14,34" stroke={C.sh} strokeWidth="0.9" fill="none" opacity="0.2"/>
      <path d="M10,26 Q8,28 10,30" stroke={C.sh} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d="M12,24 Q8,20 6,22" stroke={C.outline} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M12,32 Q8,36 6,34" stroke={C.outline} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
      <circle cx="16" cy="26" r="4" fill="rgba(0,0,0,0.06)"/><circle cx="16" cy="25.5" r="3.5" fill="#fafafa"/><circle cx="16" cy="25.5" r="2.5" fill="#1a1a2a"/><circle cx="15" cy="24.5" r="1.2" fill="white"/><circle cx="16.8" cy="26.3" r="0.5" fill="rgba(255,255,255,0.3)"/>
      {selected&&<ellipse cx="42" cy="28" rx="34" ry="22" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}
export default memo(KoiSprite);