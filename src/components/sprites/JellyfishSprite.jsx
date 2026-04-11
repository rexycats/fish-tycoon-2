import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function JellyfishSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'jf').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const W=size*0.8, H=size*1.1;
  const C = {
    bell:'rgba(180,200,240,0.35)', bell2:'rgba(140,160,220,0.2)', bellEdge:'rgba(200,220,255,0.4)',
    bellLight:'rgba(220,235,255,0.5)', organ:'rgba(220,180,140,0.4)', organ2:'rgba(200,160,120,0.3)',
    tentacle:'rgba(180,200,240,0.25)', tentTip:'rgba(160,180,220,0.15)', oral:'rgba(200,180,220,0.3)',
  };

  return (
    <svg width={W} height={H} viewBox="0 0 60 80" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`jfgl-${uid}`} x="-40%" y="-30%" width="180%" height="170%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id={`jfb-${uid}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%" stopColor="rgba(220,235,255,0.6)"/>
          <stop offset="40%" stopColor="rgba(180,200,240,0.35)"/>
          <stop offset="80%" stopColor="rgba(140,160,220,0.2)"/>
          <stop offset="100%" stopColor="rgba(120,140,200,0.1)"/>
        </radialGradient>
        <radialGradient id={`jfsp-${uid}`} cx="30%" cy="22%" r="38%">
          <stop offset="0%" stopColor="white" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`jfrm-${uid}`} cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="rgba(200,180,220,0.3)"/>
          <stop offset="100%" stopColor="rgba(200,180,220,0)"/>
        </radialGradient>
        {aura&&<filter id={`jfa-${uid}`} x="-60%" y="-50%" width="220%" height="200%">
          <feGaussianBlur stdDeviation={aura.blur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>}
      </defs>

      {aura&&<ellipse cx="30" cy="24" rx="24" ry="18" fill={aura.color} opacity={aura.opacity} filter={`url(#jfa-${uid})`}/>}

      {/* Trailing tentacles — 8 long, flowing */}
      <g className="fish-tail-flowing" opacity="0.7">
        {[12,16,20,24,28,32,36,40].map((x,i) => {
          const len = 22 + (i%3)*8;
          const wave = (i%2===0) ? 3 : -3;
          return (
            <path key={i}
              d={`M${x},38 Q${x+wave},${38+len*0.3} ${x-wave*0.5},${38+len*0.6} Q${x+wave*0.8},${38+len*0.8} ${x},${38+len}`}
              stroke={C.tentacle} strokeWidth={1.2 - i*0.05} fill="none" strokeLinecap="round"/>
          );
        })}
      </g>

      {/* Oral arms — 4 thicker, frilly */}
      <g className="fish-anal-fin">
        {[20,26,32,38].map((x,i) => (
          <path key={i}
            d={`M${x},36 Q${x+(i%2===0?4:-4)},44 ${x},52 Q${x+(i%2===0?-3:3)},56 ${x},60`}
            stroke={C.oral} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity={0.4 - i*0.03}/>
        ))}
      </g>

      {/* Bell — translucent dome */}
      <g filter={`url(#jfgl-${uid})`}>
        <path d="M6,36 Q6,8 30,6 Q54,8 54,36 Z" fill={`url(#jfb-${uid})`}/>
      </g>

      {/* Bell rim — scalloped edge */}
      <path d="M6,36 Q10,40 14,36 Q18,40 22,36 Q26,40 30,36 Q34,40 38,36 Q42,40 46,36 Q50,40 54,36"
        stroke={C.bellEdge} strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Internal organs — visible through transparent bell */}
      <ellipse cx="30" cy="26" rx="10" ry="6" fill={C.organ} opacity="0.6"/>
      <ellipse cx="30" cy="26" rx="7" ry="4" fill={C.organ2} opacity="0.4"/>
      {/* Four-leaf clover gonad pattern */}
      <circle cx="26" cy="24" r="3" fill={C.organ} opacity="0.3"/>
      <circle cx="34" cy="24" r="3" fill={C.organ} opacity="0.3"/>
      <circle cx="26" cy="28" r="3" fill={C.organ} opacity="0.25"/>
      <circle cx="34" cy="28" r="3" fill={C.organ} opacity="0.25"/>

      {/* Radial canals */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const angle = (i * 45 - 90) * Math.PI / 180;
        const x2 = 30 + 18 * Math.cos(angle);
        const y2 = 22 + 14 * Math.sin(angle);
        return <line key={i} x1="30" y1="22" x2={x2} y2={y2}
          stroke={C.bellEdge} strokeWidth="0.5" opacity="0.2"/>;
      })}

      {/* Specular on bell */}
      <path d="M6,36 Q6,8 30,6 Q54,8 54,36 Z" fill={`url(#jfsp-${uid})`}/>

      {/* Bell outline — very faint */}
      <path d="M6,36 Q6,8 30,6 Q54,8 54,36" fill="none" stroke={C.bellEdge} strokeWidth="0.8" opacity="0.3"/>

      {/* Rim glow */}
      <path d="M6,36 Q6,8 30,6 Q54,8 54,36 Z" fill={`url(#jfrm-${uid})`}/>

      {/* Pulsation ring — suggests contraction */}
      <ellipse cx="30" cy="30" rx="20" ry="4" fill="none" stroke={C.bellEdge} strokeWidth="0.6" opacity="0.15"/>

      {selected&&<ellipse cx="30" cy="30" rx="26" ry="22" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="1.5" strokeDasharray="4 3"/>}
    </svg>
  );
}

export default memo(JellyfishSprite);