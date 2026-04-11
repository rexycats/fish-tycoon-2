import React, { memo } from 'react';
const AURA = { common:null,uncommon:{color:'#78c8ff',opacity:0.20,blur:6},rare:{color:'#c878ff',opacity:0.28,blur:8},epic:{color:'#ffe040',opacity:0.40,blur:10},legendary:{color:'#ff60ff',opacity:0.55,blur:14} };

function AxolotlSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const uid=(fish?.id||'ax').slice(0,8), rarity=fish?.species?.rarity||'rare', aura=AURA[rarity];
  const v=fish?.colorVariant||'default', W=size*1.2, H=size*0.9;
  const C = ({
    default:  {body:'#ffb0c8',body2:'#d07898',belly:'#ffd8e8',light:'#fff0f4',shadow:'#903860',accent:'#ff5888',fin:'#ff80a8',fin2:'#e06080',gill:'#ff3868',gillTip:'#ff90b0',gillMid:'#ff6090',lat:'#ffc0d8',spot:'#ffe0ec',iris:'#1a1020'},
    leucistic:{body:'#f4ece0',body2:'#d8c8b8',belly:'#faf6f0',light:'#ffffff',shadow:'#8a7868',accent:'#d8c0a8',fin:'#e8d8c8',fin2:'#c8b8a0',gill:'#e8a0a0',gillTip:'#ffc8c8',gillMid:'#f0b0b0',lat:'#f0e8dc',spot:'#f8f4f0',iris:'#604838'},
    golden:   {body:'#f0c848',body2:'#c09020',belly:'#f8dc78',light:'#fff8c0',shadow:'#805808',accent:'#e0a830',fin:'#e8c040',fin2:'#c8a020',gill:'#ff8828',gillTip:'#ffb058',gillMid:'#ff9838',lat:'#f4d458',spot:'#f8e880',iris:'#403008'},
    wild:     {body:'#4a5838',body2:'#303828',belly:'#586848',light:'#708060',shadow:'#1a2010',accent:'#3a4828',fin:'#485838',fin2:'#384028',gill:'#584030',gillTip:'#786050',gillMid:'#684840',lat:'#506040',spot:'#586848',iris:'#101808'},
  })[v]||{body:'#ffb0c8',body2:'#d07898',belly:'#ffd8e8',light:'#fff0f4',shadow:'#903860',accent:'#ff5888',fin:'#ff80a8',fin2:'#e06080',gill:'#ff3868',gillTip:'#ff90b0',gillMid:'#ff6090',lat:'#ffc0d8',spot:'#ffe0ec',iris:'#1a1020'};

  // Pre-compute gill branch data
  const gillBranches = [
    // Top-left gills: [startX, startY, cp1X, cp1Y, cp2X, cp2Y, endX, endY, sw, feather count]
    {sx:22,sy:28,cx:14,cy:16,ex:6,ey:10,sw:3.5,fc:4},
    {sx:26,sy:25,cx:20,cy:12,ex:14,ey:4,sw:4,fc:5},
    {sx:30,sy:26,cx:28,cy:14,ex:26,ey:2,sw:3.5,fc:4},
    // Bottom-left gills (mirror)
    {sx:22,sy:52,cx:14,cy:64,ex:6,ey:70,sw:3.5,fc:4},
    {sx:26,sy:55,cx:20,cy:68,ex:14,ey:76,sw:4,fc:5},
    {sx:30,sy:54,cx:28,cy:66,ex:26,ey:78,sw:3.5,fc:4},
  ];

  return (
    <svg width={W} height={H} viewBox="0 0 115 82" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`axsh-${uid}`} x="-28%" y="-22%" width="156%" height="164%">
          <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#000" floodOpacity="0.32"/>
        </filter>

        {/* ── Gill rim-light glow ── */}
        <filter id={`axglow-${uid}`} x="-90%" y="-90%" width="280%" height="280%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feFlood floodColor={C.gill} floodOpacity="0.45" result="colour"/>
          <feComposite in="colour" in2="blur" operator="in" result="glowColour"/>
          <feMerge><feMergeNode in="glowColour"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* ── Body gradient — 3D radial ── */}
        <radialGradient id={`axb-${uid}`} cx="30%" cy="26%" r="72%" fx="26%" fy="20%">
          <stop offset="0%"   stopColor={C.light}/>
          <stop offset="22%"  stopColor={C.belly}/>
          <stop offset="52%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>

        {/* ── Dorsal shadow ── */}
        <radialGradient id={`axdor-${uid}`} cx="50%" cy="0%" r="82%">
          <stop offset="0%"  stopColor={C.shadow} stopOpacity="0.48"/>
          <stop offset="50%" stopColor={C.shadow} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>

        {/* ── Belly highlight ── */}
        <radialGradient id={`axbel-${uid}`} cx="50%" cy="100%" r="62%">
          <stop offset="0%"  stopColor={C.light} stopOpacity="0.52"/>
          <stop offset="60%" stopColor={C.light} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={C.light} stopOpacity="0"/>
        </radialGradient>

        {/* ── Lateral shimmer ── */}
        <linearGradient id={`axlat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor={C.lat} stopOpacity="0"/>
          <stop offset="25%"  stopColor={C.lat} stopOpacity="0.28"/>
          <stop offset="50%"  stopColor={C.lat} stopOpacity="0.45"/>
          <stop offset="75%"  stopColor={C.lat} stopOpacity="0.28"/>
          <stop offset="100%" stopColor={C.lat} stopOpacity="0"/>
        </linearGradient>

        {/* ── Specular ── */}
        <radialGradient id={`axspec-${uid}`} cx="28%" cy="20%" r="42%" fx="24%" fy="16%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.68"/>
          <stop offset="55%"  stopColor="white" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>

        {/* ── Gill branch gradient ── */}
        <linearGradient id={`axgill-${uid}`} x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%"   stopColor={C.gill}    stopOpacity="0.35"/>
          <stop offset="40%"  stopColor={C.gillMid}  stopOpacity="0.65"/>
          <stop offset="100%" stopColor={C.gillTip}  stopOpacity="0.90"/>
        </linearGradient>

        {/* ── Fin gradient ── */}
        <linearGradient id={`axfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.fin}  stopOpacity="0.82"/>
          <stop offset="50%"  stopColor={C.fin2}  stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.body2} stopOpacity="0.28"/>
        </linearGradient>

        {/* ── Tail fin gradient ── */}
        <linearGradient id={`axtail-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor={C.body}  stopOpacity="0.7"/>
          <stop offset="100%" stopColor={C.body2} stopOpacity="0.3"/>
        </linearGradient>

        {/* ── Head gradient (slightly lighter) ── */}
        <radialGradient id={`axhead-${uid}`} cx="40%" cy="30%" r="65%">
          <stop offset="0%"   stopColor={C.light}/>
          <stop offset="30%"  stopColor={C.belly}/>
          <stop offset="65%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>

        {/* ── Aura ── */}
        {aura && <filter id={`axa-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={aura.blur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>}
      </defs>

      {/* ═══ LAYER 1 — RARITY AURA ═══ */}
      {aura && <ellipse cx="52" cy="41" rx="46" ry="32" fill={aura.color} opacity={aura.opacity} filter={`url(#axa-${uid})`}/>}

      {/* ═══ LAYER 2 — TAIL (flat newt tail with dorsal crest) ═══ */}
      <g className="fish-tail">
        {/* Tail fin membrane */}
        <path d="M85,41 Q94,33 102,35 Q98,41 102,47 Q94,49 85,41"
          fill={`url(#axtail-${uid})`} stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.4"/>
        {/* Tail vein */}
        <path d="M86,41 Q92,37 96,38" fill="none" stroke={C.body2} strokeWidth="0.5" opacity="0.3"/>
        <path d="M86,41 Q92,45 96,44" fill="none" stroke={C.body2} strokeWidth="0.5" opacity="0.3"/>
        {/* Dorsal crest on tail */}
        <path d="M86,36 Q90,30 96,33" fill={C.accent} opacity="0.25" stroke={C.accent} strokeWidth="0.4" strokeOpacity="0.3"/>
        {/* Ventral crest on tail */}
        <path d="M86,46 Q90,52 96,49" fill={C.accent} opacity="0.2"/>
      </g>

      {/* ═══ LAYER 3 — EXTERNAL GILLS (6 feathery branches) ═══ */}
      <g filter={`url(#axglow-${uid})`} className="fish-dorsal">
        {gillBranches.map((g, i) => (
          <g key={i}>
            {/* Main branch */}
            <path d={`M${g.sx},${g.sy} Q${g.cx},${g.cy} ${g.ex},${g.ey}`}
              stroke={`url(#axgill-${uid})`} strokeWidth={g.sw} fill="none" strokeLinecap="round"/>
            {/* Secondary thinner branch */}
            <path d={`M${g.sx},${g.sy} Q${(g.cx+g.sx)/2+2},${(g.cy+g.sy)/2} ${(g.ex+g.cx)/2+1},${(g.ey+g.cy)/2}`}
              stroke={C.gillTip} strokeWidth={g.sw*0.45} fill="none" strokeLinecap="round" opacity="0.45"/>
            {/* Feather barbs */}
            {Array.from({length:g.fc},(_, j)=>{
              const t=(j+1)/(g.fc+1);
              const mx=g.sx+(g.cx-g.sx)*t*0.8+(g.ex-g.cx)*t*0.2;
              const my=g.sy+(g.cy-g.sy)*t*0.8+(g.ey-g.cy)*t*0.2;
              const dx=i<3?(j%2===0?-4:4):(j%2===0?-4:4);
              const dy=i<3?(j%2===0?-2:2):(j%2===0?2:-2);
              return <path key={j} d={`M${mx},${my} Q${mx+dx},${my+dy} ${mx+dx*1.5},${my+dy*1.5}`}
                stroke={C.gillMid} strokeWidth="0.8" fill="none" opacity="0.5" strokeLinecap="round"/>;
            })}
            {/* Gill tip bulb */}
            <circle cx={g.ex} cy={g.ey} r={g.sw*0.75} fill={C.gillTip} opacity="0.72"/>
            <circle cx={g.ex-0.5} cy={g.ey-(i<3?0.5:-0.5)} r={g.sw*0.35} fill="white" opacity="0.25"/>
          </g>
        ))}
      </g>

      {/* ═══ LAYER 4 — BODY ═══ */}
      <g filter={`url(#axsh-${uid})`}>
        <ellipse cx="52" cy="41" rx="32" ry="19" fill={`url(#axb-${uid})`}/>
      </g>
      <ellipse cx="52" cy="41" rx="32" ry="19" fill={`url(#axdor-${uid})`}/>
      <ellipse cx="52" cy="41" rx="32" ry="19" fill={`url(#axbel-${uid})`}/>
      <ellipse cx="52" cy="41" rx="32" ry="19" fill={`url(#axlat-${uid})`}/>

      {/* ═══ LAYER 5 — HEAD ═══ */}
      <ellipse cx="28" cy="41" rx="22" ry="17" fill={`url(#axhead-${uid})`}/>
      <ellipse cx="28" cy="41" rx="22" ry="17" fill={`url(#axdor-${uid})`}/>
      <ellipse cx="28" cy="41" rx="22" ry="17" fill={`url(#axbel-${uid})`}/>

      {/* ═══ LAYER 6 — BODY TEXTURE ═══ */}
      {/* Scattered pale spots (axolotl freckles) */}
      {[[38,36],[46,34],[54,38],[62,36],[48,44],[56,42],[64,40],[42,40],[50,46],[60,44],[66,38],[44,48],[52,50]].map(([x,y],i)=>
        <circle key={i} cx={x+Math.sin(i)*1.5} cy={y+Math.cos(i)*1.2} r={1+i%3*0.4}
          fill={C.spot} opacity={0.12+i%4*0.03}/>
      )}
      {/* Faint body segment lines */}
      {[40,48,56,64,72].map((x,i)=>
        <path key={i} d={`M${x},${32+i%2} Q${x+1},41 ${x},${50-i%2}`}
          stroke={C.body2} strokeWidth="0.4" fill="none" opacity="0.08"/>
      )}

      {/* ═══ LAYER 7 — LEGS ═══ */}
      {/* Front pair */}
      <g className="fish-pectoral">
        <path d="M40,58 Q38,66 36,70" stroke={C.body} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M40,58 Q39,64 37,68" stroke={C.belly} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Toes */}
        <path d="M36,70 L32,73" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M36,70 L36,74" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M36,70 L40,73" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M36,70 L42,71" stroke={C.body} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      </g>
      {/* Back pair */}
      <g className="fish-anal-fin">
        <path d="M62,58 Q60,66 58,70" stroke={C.body} strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M62,58 Q61,64 59,68" stroke={C.belly} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4"/>
        <path d="M58,70 L54,73" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M58,70 L58,74" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M58,70 L62,73" stroke={C.body} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        <path d="M58,70 L64,71" stroke={C.body} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      </g>

      {/* ═══ LAYER 8 — SPECULAR HIGHLIGHTS ═══ */}
      <ellipse cx="52" cy="41" rx="32" ry="19" fill={`url(#axspec-${uid})`}/>
      <ellipse cx="28" cy="41" rx="22" ry="17" fill={`url(#axspec-${uid})`}/>
      {/* Secondary wet highlight on head */}
      <ellipse cx="22" cy="36" rx="8" ry="5" fill="white" opacity="0.08"/>

      {/* ═══ LAYER 9 — FACE ═══ */}
      {/* Smile — the iconic axolotl grin */}
      <path d="M17,46 Q24,52 31,46" stroke={C.shadow} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Subtle upper lip line */}
      <path d="M17,45 Q24,44 31,45" stroke={C.shadow} strokeWidth="0.6" fill="none" opacity="0.15"/>

      {/* Nostrils */}
      <circle cx="12" cy="40" r="1.2" fill={C.shadow} opacity="0.25"/>
      <circle cx="14" cy="40" r="1.2" fill={C.shadow} opacity="0.25"/>

      {/* ═══ LAYER 10 — EYES (large, round, cute with iris detail) ═══ */}
      {/* Left eye */}
      <circle cx="17" cy="37" r="6.5" fill="#fafafa"/>
      <circle cx="17" cy="37" r="6" fill={C.iris}/>
      {/* Iris ring detail */}
      <circle cx="17" cy="37" r="4.5" fill="none" stroke={C.shadow} strokeWidth="0.8" opacity="0.3"/>
      {/* Pupil */}
      <circle cx="17" cy="37" r="3.5" fill="#0a0a12"/>
      {/* Reflections */}
      <circle cx="15" cy="35" r="2.2" fill="white" opacity="0.85"/>
      <circle cx="18.5" cy="38.5" r="1" fill="white" opacity="0.35"/>

      {/* Right eye */}
      <circle cx="35" cy="37" r="6.5" fill="#fafafa"/>
      <circle cx="35" cy="37" r="6" fill={C.iris}/>
      <circle cx="35" cy="37" r="4.5" fill="none" stroke={C.shadow} strokeWidth="0.8" opacity="0.3"/>
      <circle cx="35" cy="37" r="3.5" fill="#0a0a12"/>
      <circle cx="33" cy="35" r="2.2" fill="white" opacity="0.85"/>
      <circle cx="36.5" cy="38.5" r="1" fill="white" opacity="0.35"/>

      {/* ═══ LAYER 11 — SELECTION RING ═══ */}
      {selected && <ellipse cx="52" cy="41" rx="38" ry="24"
        fill="none" stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}

export default memo(AxolotlSprite);
