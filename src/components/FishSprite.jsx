// ============================================================
// FISH TYCOON 2 — FISH SVG SPRITE v2 (Phase 2 upgrade)
// ============================================================

import React from 'react';

export const BODY_COLORS = {
  Crimson: {
    body:'#d94040', body2:'#c02828', belly:'#f07070',
    fin:'#a81818', fin2:'#e05858', accent:'#ff9090', scale:'#b83030',
  },
  Gold: {
    body:'#d4920a', body2:'#b87800', belly:'#f8d060',
    fin:'#a06000', fin2:'#e0a820', accent:'#ffe080', scale:'#c07800',
  },
  Violet: {
    body:'#8830c8', body2:'#6818a8', belly:'#c070f0',
    fin:'#501090', fin2:'#a040d8', accent:'#e0a0ff', scale:'#7020b0',
  },
  Azure: {
    body:'#1870d0', body2:'#0c54b0', belly:'#60b0f8',
    fin:'#083890', fin2:'#2888e0', accent:'#90d0ff', scale:'#0e60b8',
  },
  Emerald: {
    body:'#1a9848', body2:'#0e7832', belly:'#50d880',
    fin:'#086028', fin2:'#28b858', accent:'#80f0a8', scale:'#128038',
  },
  White: {
    body:'#b8c8d8', body2:'#98aabb', belly:'#e8f0f8',
    fin:'#7890a8', fin2:'#c8d8e8', accent:'#ffffff', scale:'#a0b8cc',
  },
};

const RARITY_AURA = {
  common:   null,
  uncommon: { color:'#78c8ff', opacity:0.18 },
  rare:     { color:'#c878ff', opacity:0.25 },
  epic:     { color:'#ffe040', opacity:0.35 },
};

export default function FishSprite({ fish, size=60, flipped=false, selected=false, onClick }) {
  const { phenotype, species } = fish;
  const C       = BODY_COLORS[phenotype.primaryColor] || BODY_COLORS.Crimson;
  const isGlow  = phenotype.glow === 'Luminous';
  const isRound = phenotype.bodyShape === 'Round';
  const isFlow  = phenotype.finType === 'Flowing';
  const isSpot  = phenotype.pattern === 'Spotted';
  const isGiant = phenotype.size === 'Giant';
  const rarity  = species?.rarity || 'common';
  const aura    = RARITY_AURA[rarity];
  const uid     = (fish.id || 'x').slice(0,8);

  // EGG
  if (fish.stage === 'egg') {
    return (
      <svg width={size} height={size} viewBox="0 0 60 64" onClick={onClick}
        style={{cursor:onClick?'pointer':'default',overflow:'visible'}}>
        <defs>
          <radialGradient id={`eg-${uid}`} cx="38%" cy="32%" r="60%">
            <stop offset="0%"   stopColor="#fff8e8"/>
            <stop offset="60%"  stopColor="#f0d898"/>
            <stop offset="100%" stopColor="#c8a050"/>
          </radialGradient>
        </defs>
        {isGlow && <ellipse cx="30" cy="34" rx="18" ry="22" fill="#ffffa0" opacity="0.3"/>}
        {aura   && <ellipse cx="30" cy="34" rx="17" ry="21" fill={aura.color} opacity={aura.opacity}/>}
        <ellipse cx="30" cy="34" rx="13" ry="17" fill={`url(#eg-${uid})`}/>
        <ellipse cx="30" cy="34" rx="13" ry="17" fill="none" stroke="#c8a060" strokeWidth="1.2"/>
        <ellipse cx="25" cy="27" rx="3.5" ry="5" fill="white" opacity="0.45" transform="rotate(-15,25,27)"/>
        <ellipse cx="33" cy="25" rx="1.5" ry="2.5" fill="white" opacity="0.3"/>
        <ellipse cx="30" cy="50" rx="10" ry="2.5" fill="#000" opacity="0.12"/>
        {selected && <ellipse cx="30" cy="34" rx="17" ry="21" fill="none" stroke="#f0c040" strokeWidth="2" strokeDasharray="5 3"/>}
      </svg>
    );
  }

  // JUVENILE
  if (fish.stage === 'juvenile') {
    return (
      <svg width={size} height={size*0.75} viewBox="0 0 70 52" onClick={onClick}
        style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
        <defs>
          <radialGradient id={`jb-${uid}`} cx="60%" cy="38%" r="60%">
            <stop offset="0%"   stopColor={C.belly}/>
            <stop offset="100%" stopColor={C.body}/>
          </radialGradient>
        </defs>
        {isGlow && <ellipse cx="36" cy="28" rx="22" ry="16" fill="#ffffa0" opacity="0.3"/>}
        {aura   && <ellipse cx="36" cy="28" rx="20" ry="14" fill={aura.color} opacity={aura.opacity}/>}
        <path d="M18,28 Q6,20 8,28 Q6,36 18,28" fill={C.fin} opacity="0.9"/>
        <ellipse cx="36" cy="28" rx="18" ry="12" fill={`url(#jb-${uid})`}/>
        <path d="M28,16 Q36,10 44,16" fill={C.fin} opacity="0.8" stroke={C.fin} strokeWidth="0.5"/>
        {isSpot
          ? <><circle cx="34" cy="26" r="3.5" fill={C.fin} opacity="0.35"/><circle cx="42" cy="30" r="2.5" fill={C.fin} opacity="0.28"/></>
          : <><ellipse cx="34" cy="24" rx="10" ry="1.5" fill={C.fin} opacity="0.3"/><ellipse cx="36" cy="31" rx="9" ry="1.2" fill={C.fin} opacity="0.22"/></>
        }
        <ellipse cx="42" cy="22" rx="5" ry="3.5" fill="white" opacity="0.3" transform="rotate(-20,42,22)"/>
        <circle cx="50" cy="24" r="4" fill="white"/>
        <circle cx="50.5" cy="24.2" r="2.2" fill="#111"/>
        <circle cx="51.5" cy="23" r="0.8" fill="white" opacity="0.9"/>
        {selected && <ellipse cx="36" cy="28" rx="24" ry="18" fill="none" stroke="#f0c040" strokeWidth="2" strokeDasharray="5 3"/>}
      </svg>
    );
  }

  // ADULT
  const cx    = isRound ? 45 : 46;
  const cy    = 30;
  const rx    = isRound ? 28 : 22;
  const ry    = isRound ? 20 : 15;
  const tailX = cx - rx;
  const W     = isGiant ? size*1.35 : size;
  const H     = isGiant ? size*0.85 : size*0.65;

  return (
    <svg width={W} height={H} viewBox="0 0 100 60" onClick={onClick}
      style={{cursor:onClick?'pointer':'default',transform:flipped?'scaleX(-1)':'none',overflow:'visible'}}>
      <defs>
        <radialGradient id={`bg-${uid}`} cx="62%" cy="35%" r="65%">
          <stop offset="0%"   stopColor={C.belly}/>
          <stop offset="55%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>
        <linearGradient id={`fg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.fin2} stopOpacity="0.95"/>
          <stop offset="100%" stopColor={C.fin}  stopOpacity="0.7"/>
        </linearGradient>
        <clipPath id={`bc-${uid}`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry}/>
        </clipPath>
      </defs>

      {aura   && <ellipse cx={cx} cy={cy} rx={rx+12} ry={ry+10} fill={aura.color} opacity={aura.opacity}/>}
      {isGlow && !aura && <ellipse cx={cx} cy={cy} rx={rx+10} ry={ry+8} fill="#ffffa0" opacity="0.22"/>}

      {/* Tail */}
      {isFlow ? (
        <g opacity="0.92">
          <path d={`M${tailX+4},${cy-2} C${tailX-10},${cy-8} ${tailX-22},${cy-20} ${tailX-16},${cy-4} Z`} fill={`url(#fg-${uid})`}/>
          <path d={`M${tailX+4},${cy+2} C${tailX-10},${cy+8} ${tailX-22},${cy+20} ${tailX-16},${cy+4} Z`} fill={`url(#fg-${uid})`}/>
          <path d={`M${tailX+5},${cy} C${tailX-6},${cy-5} ${tailX-14},${cy-2} ${tailX-10},${cy} C${tailX-14},${cy+2} ${tailX-6},${cy+5} ${tailX+5},${cy}`}
                fill={C.accent} opacity="0.55"/>
        </g>
      ) : (
        <path d={`M${tailX+3},${cy-3} L${tailX-13},${cy-13} L${tailX-13},${cy} L${tailX-13},${cy+13} L${tailX+3},${cy+3} Z`}
              fill={`url(#fg-${uid})`} opacity="0.9"/>
      )}

      {/* Dorsal fin */}
      {isFlow
        ? <path d={`M${cx-rx*0.5},${cy-ry} C${cx-rx*0.1},${cy-ry-18} ${cx+rx*0.2},${cy-ry-14} ${cx+rx*0.5},${cy-ry+1}`} fill={`url(#fg-${uid})`} opacity="0.82"/>
        : <path d={`M${cx-rx*0.4},${cy-ry} C${cx-rx*0.1},${cy-ry-10} ${cx+rx*0.2},${cy-ry-8} ${cx+rx*0.4},${cy-ry+1}`}  fill={`url(#fg-${uid})`} opacity="0.82"/>
      }

      {/* Anal fin */}
      <path d={`M${cx-rx*0.1},${cy+ry} C${cx+rx*0.1},${cy+ry+8} ${cx+rx*0.35},${cy+ry+6} ${cx+rx*0.4},${cy+ry}`}
            fill={`url(#fg-${uid})`} opacity="0.7"/>

      {/* Pectoral fin */}
      <ellipse cx={cx+rx*0.05} cy={cy+ry*0.55} rx={isFlow?10:7} ry={isFlow?4:3}
               fill={C.fin} opacity="0.72" transform={`rotate(-25,${cx+rx*0.05},${cy+ry*0.55})`}/>

      {/* Body */}
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#bg-${uid})`}/>

      {/* Scales */}
      <g clipPath={`url(#bc-${uid})`} opacity="0.18">
        {Array.from({length:4}).map((_,row) =>
          Array.from({length:7}).map((_,col) => {
            const sx = cx-rx+col*(rx*2/6)+(row%2===0?0:rx/6);
            const sy = cy-ry+row*(ry*2/3.5);
            return <ellipse key={`${row}-${col}`} cx={sx} cy={sy} rx={rx*0.18} ry={ry*0.22}
                            fill="none" stroke={C.scale} strokeWidth="0.9"/>;
          })
        )}
      </g>

      {/* Pattern */}
      {isSpot ? (
        <g clipPath={`url(#bc-${uid})`} opacity="0.42">
          <circle cx={cx+4}  cy={cy-5} r={isRound?6:4.5} fill={C.fin}/>
          <circle cx={cx-6}  cy={cy+4} r={isRound?5:3.5} fill={C.fin}/>
          <circle cx={cx+12} cy={cy+5} r={isRound?4:3}   fill={C.fin}/>
          <circle cx={cx-2}  cy={cy-2} r={isRound?3:2}   fill={C.fin} opacity="0.6"/>
        </g>
      ) : (
        <g clipPath={`url(#bc-${uid})`} opacity="0.32">
          <ellipse cx={cx}   cy={cy-5} rx={rx*0.75} ry={2.2} fill={C.fin}/>
          <ellipse cx={cx-2} cy={cy+4} rx={rx*0.65} ry={1.8} fill={C.fin}/>
          <ellipse cx={cx+2} cy={cy-1} rx={rx*0.5}  ry={1.2} fill={C.fin} opacity="0.7"/>
        </g>
      )}

      {/* Belly sheen */}
      <ellipse cx={cx+rx*0.2} cy={cy+ry*0.22} rx={rx*0.5} ry={ry*0.35} fill={C.belly} opacity="0.28"/>
      {/* Specular */}
      <ellipse cx={cx+rx*0.28} cy={cy-ry*0.35} rx={rx*0.22} ry={ry*0.2}
               fill="white" opacity="0.38" transform={`rotate(-15,${cx+rx*0.28},${cy-ry*0.35})`}/>
      <ellipse cx={cx+rx*0.45} cy={cy-ry*0.5} rx={rx*0.1} ry={ry*0.1} fill="white" opacity="0.5"/>
      {/* Glow shimmer */}
      {isGlow && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#ffffa0" opacity="0.15"/>}

      {/* Eye */}
      <circle cx={cx+rx*0.72} cy={cy-ry*0.18} r={isRound?5.5:4.5} fill="white"/>
      <circle cx={cx+rx*0.72} cy={cy-ry*0.15} r={isRound?3.2:2.5} fill="#111"/>
      <circle cx={cx+rx*0.72} cy={cy-ry*0.15} r={isRound?3.2:2.5}
              fill="none" stroke={C.accent} strokeWidth="0.8" opacity="0.8"/>
      <circle cx={cx+rx*0.78} cy={cy-ry*0.28} r={1.1} fill="white" opacity="0.9"/>
      {/* Mouth */}
      <path d={`M${cx+rx-1},${cy+ry*0.12} Q${cx+rx+3},${cy+ry*0.28} ${cx+rx},${cy+ry*0.4}`}
            stroke="#33222a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {selected && (
        <ellipse cx={cx} cy={cy} rx={rx+7} ry={ry+6}
                 fill="none" stroke="#f0c040" strokeWidth="2.5" strokeDasharray="6 3" opacity="0.9"/>
      )}
    </svg>
  );
}
