import React, { memo } from 'react';
const AURA = { common:null, uncommon:{color:'#78c8ff',opacity:0.20,blur:6}, rare:{color:'#c878ff',opacity:0.28,blur:8}, epic:{color:'#ffe040',opacity:0.40,blur:10}, legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function NautilusSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'na').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const W=size*0.95, H=size*0.95;
  const C = {
    shell:'#d8c0a0', shell2:'#a08060', shellLight:'#f0e0c8', shellDark:'#705030',
    stripe:'#8a5428', interior:'#302010', tentacle:'#b89878', tentTip:'#d0b898',
    eye:'#1a2a1a', sclera:'#e0e8e0',
  };

  // Logarithmic spiral chambers
  const spirals = [
    {r:22, sw:1.3}, {r:17, sw:1.1}, {r:13, sw:0.9}, {r:9.5, sw:0.7}, {r:6.5, sw:0.5}
  ];
  // Tiger stripes
  const stripes = [0,30,60,90,120,150,180,210,240,270,300,330];

  return (
    <svg width={W} height={H} viewBox="0 0 68 68" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <filter id={`nash-${uid}`} x="-22%" y="-18%" width="144%" height="156%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.30"/>
        </filter>
        <filter id={`nafg-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feFlood floodColor={C.tentTip} floodOpacity="0.3" result="c"/>
          <feComposite in="c" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id={`nab-${uid}`} cx="38%" cy="30%" r="60%">
          <stop offset="0%" stopColor={C.shellLight}/>
          <stop offset="25%" stopColor={C.shell}/>
          <stop offset="60%" stopColor={C.shell2}/>
          <stop offset="100%" stopColor={C.shellDark}/>
        </radialGradient>
        <radialGradient id={`nad-${uid}`} cx="50%" cy="0%" r="78%">
          <stop offset="0%" stopColor={C.shellDark} stopOpacity="0.45"/>
          <stop offset="100%" stopColor={C.shellDark} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`nabl-${uid}`} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor={C.shellLight} stopOpacity="0.5"/>
          <stop offset="100%" stopColor={C.shellLight} stopOpacity="0"/>
        </radialGradient>
        <radialGradient id={`nasp-${uid}`} cx="30%" cy="24%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.55"/>
          <stop offset="50%" stopColor="white" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        <clipPath id={`naclip-${uid}`}>
          <circle cx="36" cy="30" r="22"/>
        </clipPath>
        {aura&&<filter id={`naa-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={aura.blur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>}
      </defs>

      {aura&&<circle cx="36" cy="32" r="28" fill={aura.color} opacity={aura.opacity} filter={`url(#naa-${uid})`}/>}

      {/* Tentacles — ~90 in real nautilus, we show 10 */}
      <g filter={`url(#nafg-${uid})`} className="fish-tail-flowing">
        {[0,1,2,3,4,5,6,7,8,9].map(i => {
          const baseX = 24 - i * 1.2;
          const baseY = 44 + i * 0.6;
          const midX = 16 - i * 2.2 + (i%2)*3;
          const midY = 50 + i * 1.2;
          const tipX = 12 - i * 1.8 + (i%3)*2;
          const tipY = 54 + i * 0.8;
          return (
            <g key={i}>
              <path d={`M${baseX},${baseY} Q${midX},${midY} ${tipX},${tipY}`}
                stroke={C.tentacle} strokeWidth={2 - i*0.1} fill="none" strokeLinecap="round" opacity={0.5 - i*0.03}/>
              {i % 3 === 0 && <circle cx={tipX} cy={tipY} r="1" fill={C.tentTip} opacity="0.4"/>}
            </g>
          );
        })}
      </g>

      {/* Shell — main circle */}
      <g filter={`url(#nash-${uid})`}>
        <circle cx="36" cy="30" r="22" fill={`url(#nab-${uid})`}/>
      </g>
      <circle cx="36" cy="30" r="22" fill={`url(#nad-${uid})`}/>
      <circle cx="36" cy="30" r="22" fill={`url(#nabl-${uid})`}/>

      {/* Tiger stripe radials */}
      <g clipPath={`url(#naclip-${uid})`}>
        {stripes.map((deg, i) => {
          const r=22, cx=36, cy=30;
          const x1 = cx + r*0.55*Math.cos(deg*Math.PI/180);
          const y1 = cy + r*0.55*Math.sin(deg*Math.PI/180);
          const x2 = cx + r*1.0*Math.cos(deg*Math.PI/180);
          const y2 = cy + r*1.0*Math.sin(deg*Math.PI/180);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={C.stripe} strokeWidth={2.5 + (i%3)*0.5} opacity={0.15 + (i%4)*0.03}/>;
        })}
      </g>

      {/* Spiral chamber lines */}
      {spirals.map((s, i) => {
        const cx=36, cy=30, r=s.r;
        const startAngle = -30;
        const endAngle = 300;
        const x1 = cx + r * Math.cos(startAngle * Math.PI / 180);
        const y1 = cy + r * Math.sin(startAngle * Math.PI / 180);
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={C.stripe} strokeWidth={s.sw} opacity={0.18 - i*0.02}/>
        );
      })}

      {/* Inner spiral detail */}
      <path d="M36,30 Q38,26 36,22 Q32,24 30,30 Q32,34 36,36 Q40,34 42,30 Q40,24 36,20"
        fill="none" stroke={C.stripe} strokeWidth="0.6" opacity="0.12"/>

      {/* Specular */}
      <circle cx="36" cy="30" r="22" fill={`url(#nasp-${uid})`}/>

      {/* Shell outline */}
      <circle cx="36" cy="30" r="22" fill="none" stroke={C.shellDark} strokeWidth="1" opacity="0.3"/>

      {/* Shell opening — dark interior with depth */}
      <path d="M16,30 Q14,36 16,44 Q20,46 26,44 Q22,40 18,34 Q16,30 18,24"
        fill={C.interior} opacity="0.5"/>
      <path d="M18,30 Q16,35 18,42 Q21,43 24,42 Q21,38 19,34 Q18,30 19,26"
        fill={C.interior} opacity="0.3"/>

      {/* Rim highlight on opening */}
      <path d="M15,28 Q14,34 15,42" stroke={C.shellLight} strokeWidth="1.5" fill="none" opacity="0.3" strokeLinecap="round"/>

      {/* Eye — peeping from shell */}
      <circle cx="22" cy="39" r="4.5" fill="rgba(0,0,0,0.08)"/>
      <circle cx="22" cy="38.5" r="4" fill={C.sclera}/>
      <circle cx="22" cy="38.5" r="3" fill={C.eye}/>
      <circle cx="22" cy="38.5" r="2.2" fill="#0a0a08"/>
      <circle cx="20.8" cy="37.3" r="1.2" fill="white"/>
      <circle cx="23" cy="39.5" r="0.5" fill="rgba(255,255,255,0.3)"/>

      {/* Hood — the fleshy part visible at opening */}
      <path d="M18,36 Q20,34 24,35 Q26,37 24,40 Q20,42 18,40 Z"
        fill={C.tentacle} opacity="0.5"/>
      <path d="M20,36 Q22,35 24,36" stroke={C.tentTip} strokeWidth="0.6" fill="none" opacity="0.3"/>

      {selected&&<circle cx="36" cy="32" r="28" fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}

export default memo(NautilusSprite);