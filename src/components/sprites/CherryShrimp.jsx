import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };
const PALETTES = {
  default:{b:'#e03030',b2:'#901010',bl:'#ff5050',lt:'#ff8080',sh:'#600808',leg:'#c02020',ant:'#d03030',egg:'#f0a030',seg:'#b01818'},
  blue:{b:'#3040c0',b2:'#101880',bl:'#5060e0',lt:'#8090ff',sh:'#080840',leg:'#2030a0',ant:'#3040d0',egg:'#4060f0',seg:'#1828a0'},
  yellow:{b:'#d0b020',b2:'#907010',bl:'#e0c840',lt:'#f0e060',sh:'#504008',leg:'#b09818',ant:'#c0a828',egg:'#e0c030',seg:'#a08818'},
};

function CherryShrimpSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'cs').slice(0,8), rarity=fish?.species?.rarity||'common', aura=AURA[rarity];
  const v=fish?.colorVariant||'default';
  const C = PALETTES[v] || PALETTES.default;
  const W=size*0.8, H=size*0.58;

  return (
    <svg width={W} height={H} viewBox="0 0 58 38" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`cssh-${uid}`} x="-25%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.28"/>
        </filter>
        <radialGradient id={`csb-${uid}`} cx="36%" cy="28%" r="62%">
          <stop offset="0%" stopColor={C.lt}/><stop offset="28%" stopColor={C.bl}/>
          <stop offset="58%" stopColor={C.b}/><stop offset="100%" stopColor={C.b2}/>
        </radialGradient>
        <radialGradient id={`csd-${uid}`} cx="50%" cy="0%" r="75%">
          <stop offset="0%" stopColor={C.sh} stopOpacity="0.4"/><stop offset="100%" stopColor={C.sh} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`csbl-${uid}`} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor={C.lt} stopOpacity="0.4"/><stop offset="100%" stopColor={C.lt} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`cssp-${uid}`} cx="32%" cy="22%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity="0.45"/><stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`csclip-${uid}`}>
          <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"/>
        </clipPath>
        {aura&&<filter id={`csa-${uid}`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation={aura.blur} result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>}
      </defs>

      {aura&&<ellipse cx="30" cy="18" rx="24" ry="16" fill={aura.color} opacity={aura.opacity} filter={`url(#csa-${uid})`}/>}

      {/* Tail fan — uropods */}
      <g className="fish-tail">
        <path d="M12,22 Q6,18 2,20 Q4,22 6,24 Q2,24 0,26 Q4,27 8,26 Q4,28 2,30 Q6,30 14,26"
          fill={C.b} opacity="0.55" stroke={C.b2} strokeWidth="0.5" strokeOpacity="0.4"/>
        {/* Tail veining */}
        <line x1="10" y1="22" x2="4" y2="20" stroke={C.seg} strokeWidth="0.3" opacity="0.25"/>
        <line x1="10" y1="24" x2="4" y2="26" stroke={C.seg} strokeWidth="0.3" opacity="0.25"/>
        <line x1="10" y1="26" x2="4" y2="30" stroke={C.seg} strokeWidth="0.3" opacity="0.25"/>
      </g>

      {/* Body — curved shrimp shape */}
      <g filter={`url(#cssh-${uid})`}>
        <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"
          fill={`url(#csb-${uid})`}/>
      </g>
      <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"
        fill={`url(#csd-${uid})`}/>
      <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"
        fill={`url(#csbl-${uid})`}/>

      {/* Segment lines */}
      <g clipPath={`url(#csclip-${uid})`} opacity="0.2">
        {[24,28,32,36,40].map((x,i) => (
          <path key={i} d={`M${x},${10+i*0.5} Q${x+1.5},${17+i*0.8} ${x},${26+i*0.5}`}
            stroke={C.seg} strokeWidth="0.7" fill="none"/>
        ))}
      </g>

      {/* Swimmerets — pleopods for carrying eggs */}
      {[20,24,28,32].map((x,i) => (
        <g key={i}>
          <path d={`M${x},${24+i%2*0.5} Q${x-1},${27} ${x-2},${29}`}
            stroke={C.leg} strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.4"/>
        </g>
      ))}

      {/* Walking legs — 5 pairs */}
      {[22,26,30,34,38].map((x,i) => (
        <g key={i}>
          <line x1={x} y1={23+i%2} x2={x-2} y2={32+i%2*0.5}
            stroke={C.leg} strokeWidth="0.9" strokeLinecap="round" opacity="0.45"/>
          {/* Tiny claw tips */}
          <circle cx={x-2} cy={32+i%2*0.5} r="0.4" fill={C.leg} opacity="0.3"/>
        </g>
      ))}

      {/* Antennae — 2 long, 2 short */}
      <path d="M42,10 Q48,4 54,2" stroke={C.ant} strokeWidth="0.8" fill="none" opacity="0.55" strokeLinecap="round"/>
      <path d="M40,8 Q46,2 52,4" stroke={C.ant} strokeWidth="0.8" fill="none" opacity="0.45" strokeLinecap="round"/>
      <path d="M42,12 Q46,8 50,8" stroke={C.ant} strokeWidth="0.5" fill="none" opacity="0.3" strokeLinecap="round"/>
      <path d="M42,14 Q46,12 48,12" stroke={C.ant} strokeWidth="0.5" fill="none" opacity="0.25" strokeLinecap="round"/>

      {/* Specular */}
      <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"
        fill={`url(#cssp-${uid})`}/>

      {/* Outline */}
      <path d="M44,16 Q46,10 42,8 Q36,6 30,8 Q24,10 20,14 Q16,18 14,22 Q12,26 16,28 Q20,28 24,26 Q30,22 36,20 Q42,18 44,16 Z"
        fill="none" stroke={C.sh} strokeWidth="0.7" opacity="0.25"/>

      {/* Rostrum — pointed head projection */}
      <path d="M44,12 L48,10 L46,12" fill={C.b} opacity="0.5"/>

      {/* Eye — on stalk */}
      <circle cx="43" cy="11" r="3" fill="rgba(0,0,0,0.08)"/>
      <circle cx="43" cy="10.5" r="2.5" fill="#fafafa"/>
      <circle cx="43" cy="10.5" r="1.8" fill="#1a1a2a"/>
      <circle cx="42" cy="9.8" r="0.9" fill="white"/>
      <circle cx="43.5" cy="11" r="0.35" fill="rgba(255,255,255,0.3)"/>

      {selected&&<ellipse cx="30" cy="18" rx="26" ry="16" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5" strokeDasharray="4 2"/>}
    </svg>
  );
}

export default memo(CherryShrimpSprite);