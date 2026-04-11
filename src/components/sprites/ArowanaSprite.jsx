// ============================================================
// AROWANA — "Dragon Fish" — Museum Quality SVG Sprite
// The most expensive fish in the game. Every scale must shine.
// ============================================================
import React, { memo } from 'react';

const AURA = {
  common: null,
  uncommon: { color: '#78c8ff', opacity: 0.20, blur: 6 },
  rare:     { color: '#c878ff', opacity: 0.28, blur: 8 },
  epic:     { color: '#ffe040', opacity: 0.40, blur: 10 },
  legendary:{ color: '#ff60ff', opacity: 0.55, blur: 14 },
};

const PALETTES = {
  default: {
    body: '#d0a030', body2: '#906810', belly: '#e8c050', light: '#f0d870',
    shadow: '#604000', accent: '#c89020', fin: '#b08020', fin2: '#907018',
    lateral: '#f0d060', scale: '#e0b840', outline: '#705008',
    eyeRing: '#c89020', mouth: '#805010',
  },
  platinum: {
    body: '#c8c8c8', body2: '#808080', belly: '#e0e0e0', light: '#f0f0f0',
    shadow: '#404040', accent: '#b0b0b0', fin: '#a0a0a0', fin2: '#888888',
    lateral: '#d8d8d8', scale: '#c0c0c0', outline: '#606060',
    eyeRing: '#a0a0a0', mouth: '#707070',
  },
  red: {
    body: '#c04020', body2: '#701810', belly: '#e06040', light: '#f08060',
    shadow: '#400808', accent: '#a03018', fin: '#903020', fin2: '#702818',
    lateral: '#d05030', scale: '#b84028', outline: '#501008',
    eyeRing: '#c04020', mouth: '#802010',
  },
};

function ArowanaSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  const uid = (fish?.id || 'ar').slice(0, 8);
  const rarity = fish?.species?.rarity || 'epic';
  const aura = AURA[rarity];
  const v = fish?.colorVariant || 'default';
  const C = PALETTES[v] || PALETTES.default;
  const W = size * 1.5, H = size * 0.6;

  // Scale pattern positions — 7 columns × 3 rows along the body
  const scales = [];
  for (let col = 0; col < 8; col++) {
    for (let row = 0; row < 3; row++) {
      const x = 22 + col * 12;
      const y = 13 + row * 6 + (col % 2) * 3;
      scales.push({ x, y, rx: 5.5, ry: 2.8 });
    }
  }

  return (
    <svg width={W} height={H} viewBox="0 0 130 44" onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transform: flipped ? 'scaleX(-1)' : 'none', overflow: 'visible' }}>
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`arsh-${uid}`} x="-18%" y="-25%" width="136%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.32"/>
        </filter>

        {/* ── Fin rim-light glow ── */}
        <filter id={`arfg-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur"/>
          <feFlood floodColor={C.lateral} floodOpacity="0.4" result="colour"/>
          <feComposite in="colour" in2="blur" operator="in" result="glowColour"/>
          <feMerge><feMergeNode in="glowColour"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* ── Body gradient — 4-stop radial, light top-left ── */}
        <radialGradient id={`arb-${uid}`} cx="28%" cy="22%" r="72%" fx="24%" fy="17%">
          <stop offset="0%"   stopColor={C.light}/>
          <stop offset="25%"  stopColor={C.belly}/>
          <stop offset="58%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>

        {/* ── Dorsal shadow ── */}
        <radialGradient id={`ard-${uid}`} cx="50%" cy="0%" r="85%" fx="50%" fy="0%">
          <stop offset="0%"   stopColor={C.shadow} stopOpacity="0.5"/>
          <stop offset="45%"  stopColor={C.shadow} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>

        {/* ── Belly highlight ── */}
        <radialGradient id={`arbl-${uid}`} cx="50%" cy="100%" r="58%" fx="50%" fy="100%">
          <stop offset="0%"   stopColor={C.light} stopOpacity="0.55"/>
          <stop offset="60%"  stopColor={C.light} stopOpacity="0.15"/>
          <stop offset="100%" stopColor={C.light} stopOpacity="0"/>
        </radialGradient>

        {/* ── Lateral shimmer — iridescent horizontal band ── */}
        <linearGradient id={`arlat-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor={C.lateral} stopOpacity="0"/>
          <stop offset="25%"  stopColor={C.lateral} stopOpacity="0.3"/>
          <stop offset="50%"  stopColor={C.lateral} stopOpacity="0.5"/>
          <stop offset="75%"  stopColor={C.lateral} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.lateral} stopOpacity="0"/>
        </linearGradient>

        {/* ── Specular highlight — top-left wet look ── */}
        <radialGradient id={`arsp-${uid}`} cx="26%" cy="18%" r="42%" fx="22%" fy="14%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.6"/>
          <stop offset="50%"  stopColor="white" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient ── */}
        <linearGradient id={`arfin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.accent} stopOpacity="0.85"/>
          <stop offset="50%"  stopColor={C.fin2}   stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.fin}    stopOpacity="0.3"/>
        </linearGradient>

        {/* ── Scale highlight gradient ── */}
        <radialGradient id={`arsc-${uid}`} cx="40%" cy="30%" r="60%">
          <stop offset="0%"   stopColor={C.scale} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.scale} stopOpacity="0"/>
        </radialGradient>

        {/* ── Body clip path ── */}
        <clipPath id={`arclip-${uid}`}>
          <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"/>
        </clipPath>

        {/* ── Aura ── */}
        {aura && <filter id={`ara-${uid}`} x="-55%" y="-60%" width="210%" height="220%">
          <feGaussianBlur stdDeviation={aura.blur} result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>}
      </defs>

      {/* ═══ LAYER 1 — RARITY AURA ═══ */}
      {aura && <ellipse cx="58" cy="22" rx="50" ry="18"
        fill={aura.color} opacity={aura.opacity} filter={`url(#ara-${uid})`}/>}

      {/* ═══ LAYER 2 — TAIL FIN ═══ */}
      <g filter={`url(#arfg-${uid})`} className="fish-tail-flowing">
        {/* Upper lobe */}
        <path d="M108,20 C112,14 118,10 122,12 C118,16 116,20 116,22"
          fill={`url(#arfin-${uid})`} stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.6"/>
        {/* Lower lobe */}
        <path d="M108,24 C112,30 118,34 122,32 C118,28 116,24 116,22"
          fill={`url(#arfin-${uid})`} stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.6"/>
        {/* Central shimmer vein */}
        <path d="M110,22 Q114,20 118,21 Q114,24 110,22" fill={C.light} opacity="0.25"/>
        {/* Fin rays */}
        <line x1="110" y1="22" x2="118" y2="14" stroke={C.accent} strokeWidth="0.4" opacity="0.25"/>
        <line x1="110" y1="22" x2="120" y2="18" stroke={C.accent} strokeWidth="0.3" opacity="0.2"/>
        <line x1="110" y1="22" x2="120" y2="26" stroke={C.accent} strokeWidth="0.3" opacity="0.2"/>
        <line x1="110" y1="22" x2="118" y2="30" stroke={C.accent} strokeWidth="0.4" opacity="0.25"/>
      </g>

      {/* ═══ LAYER 3 — DORSAL FIN ═══ */}
      <g className="fish-dorsal" filter={`url(#arfg-${uid})`}>
        <path d="M62,5 C68,0 80,-1 96,4 L92,12"
          fill={`url(#arfin-${uid})`} stroke={C.accent} strokeWidth="0.6" strokeOpacity="0.5"/>
        {/* Fin rays */}
        {[65,72,79,86].map((x,i) => (
          <line key={i} x1={x} y1={10-i} x2={x+3} y2={3-i*0.5}
            stroke={C.accent} strokeWidth="0.35" opacity="0.2"/>
        ))}
      </g>

      {/* ═══ LAYER 4 — ANAL FIN ═══ */}
      <g className="fish-anal-fin">
        <path d="M62,39 C68,44 80,45 96,40 L92,32"
          fill={`url(#arfin-${uid})`} stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      </g>

      {/* ═══ LAYER 5 — PECTORAL FIN ═══ */}
      <ellipse cx="34" cy="28" rx="9" ry="4.5"
        fill={`url(#arfin-${uid})`} stroke={C.accent} strokeWidth="0.5" strokeOpacity="0.4"
        transform={`rotate(-18,34,28)`} className="fish-pectoral"
        filter={`url(#arfg-${uid})`}/>

      {/* ═══ LAYER 6 — BODY ═══ */}
      <g filter={`url(#arsh-${uid})`}>
        <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
          fill={`url(#arb-${uid})`}/>
      </g>

      {/* ── Dorsal shadow overlay ── */}
      <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
        fill={`url(#ard-${uid})`}/>

      {/* ── Belly highlight overlay ── */}
      <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
        fill={`url(#arbl-${uid})`}/>

      {/* ── Lateral shimmer overlay ── */}
      <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
        fill={`url(#arlat-${uid})`}/>

      {/* ═══ LAYER 7 — SCALES ═══ */}
      <g clipPath={`url(#arclip-${uid})`} opacity="0.3">
        {scales.map((s, i) => (
          <g key={i}>
            <ellipse cx={s.x} cy={s.y} rx={s.rx} ry={s.ry}
              fill="none" stroke={C.scale} strokeWidth="0.6" opacity="0.5"/>
            <ellipse cx={s.x - 1} cy={s.y - 0.8} rx={s.rx * 0.6} ry={s.ry * 0.5}
              fill={C.scale} opacity="0.15"/>
          </g>
        ))}
      </g>

      {/* ═══ LAYER 8 — SPECULAR ═══ */}
      <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
        fill={`url(#arsp-${uid})`}/>

      {/* ═══ LAYER 9 — BODY OUTLINE ═══ */}
      <path d="M112,22 C112,12 95,5 58,5 C28,5 8,12 8,22 C8,32 28,39 58,39 C95,39 112,32 112,22 Z"
        fill="none" stroke={C.outline} strokeWidth="1" opacity="0.35"/>

      {/* ═══ LAYER 10 — BARBELS ═══ */}
      <path d="M10,19 Q5,14 2,15" stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M10,25 Q5,30 2,29" stroke={C.accent} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Barbel tips — tiny bulbs */}
      <circle cx="2" cy="15" r="1" fill={C.accent} opacity="0.6"/>
      <circle cx="2" cy="29" r="1" fill={C.accent} opacity="0.6"/>

      {/* ═══ LAYER 11 — GILL PLATE ═══ */}
      <path d="M24,12 Q26,22 24,32" stroke={C.shadow} strokeWidth="1.2" fill="none" opacity="0.25"/>
      <path d="M26,14 Q27,22 26,30" stroke={C.shadow} strokeWidth="0.6" fill="none" opacity="0.15"/>

      {/* ═══ LAYER 12 — MOUTH ═══ */}
      <path d="M9,21 Q7,22 9,23" stroke={C.mouth} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.45"/>
      {/* Upper lip line */}
      <path d="M9,20 Q12,18 16,19" stroke={C.outline} strokeWidth="0.5" fill="none" opacity="0.2"/>

      {/* ═══ LAYER 13 — EYE ═══ */}
      {/* Eye shadow */}
      <circle cx="17" cy="20" r="5" fill="rgba(0,0,0,0.1)"/>
      {/* Sclera */}
      <circle cx="17" cy="19.5" r="4.5" fill="#fafafa"/>
      {/* Iris ring */}
      <circle cx="17" cy="19.5" r="3.8" fill={C.eyeRing}/>
      {/* Pupil */}
      <circle cx="17" cy="19.5" r="2.8" fill="#0a0a12"/>
      {/* Primary catchlight */}
      <circle cx="15.2" cy="17.8" r="1.6" fill="white"/>
      {/* Secondary catchlight */}
      <circle cx="18.5" cy="20.5" r="0.7" fill="rgba(255,255,255,0.4)"/>
      {/* Iris shimmer */}
      <path d="M14,19.5 Q17,17.5 20,19.5" stroke={C.lateral} strokeWidth="0.5" fill="none" opacity="0.3"/>

      {/* ═══ LAYER 14 — NOSTRIL ═══ */}
      <circle cx="12" cy="18" r="0.8" fill={C.shadow} opacity="0.3"/>

      {/* ═══ SELECTED RING ═══ */}
      {selected && <ellipse cx="58" cy="22" rx="56" ry="21" fill="none"
        stroke="rgba(240,192,64,0.5)" strokeWidth="2" strokeDasharray="5 3"/>}
    </svg>
  );
}

export default memo(ArowanaSprite);
