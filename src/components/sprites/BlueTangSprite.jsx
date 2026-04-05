// ============================================================
// FISH TYCOON — BlueTangSprite (Phase 12)
// ============================================================
// Design audit:
//   Body    : oval, laterally compressed — taller than long.
//             Royal blue radial gradient, top-left light source.
//   Markings: bold black lateral stripe arcing eye→body→tail.
//             Yellow forked tail. Yellow pectoral fin base streak.
//             Small yellow teardrop near tail spine.
//   Fins    : dorsal + anal run near full body length (high-fin
//             profile). Forked tail. Pectoral fin.
//             All semi-transparent with fin rays.
//   Shading : subsurface scatter on belly, specular wet-look,
//             dorsal shadow band, scale texture sheen.
// Layer order (back → front):
//   drop shadow → tail fin → dorsal fin → anal fin →
//   pectoral fin → body fill → black stripe (clipped) →
//   yellow tail patch → belly glow → scale texture →
//   specular → eye → mouth → selection ring → rarity aura
// ============================================================

import React, { memo } from 'react';

const RARITY_AURA = {
  common:    null,
  uncommon:  { color: '#78c8ff', opacity: 0.20, blur: 6  },
  rare:      { color: '#c878ff', opacity: 0.28, blur: 8  },
  epic:      { color: '#ffe040', opacity: 0.40, blur: 10 },
  legendary: { color: '#ff8040', opacity: 0.55, blur: 14 },
};

function BlueTangSprite({
  fish,
  size     = 60,
  flipped  = false,
  selected = false,
  onClick,
}) {
  const uid    = (fish?.id || 'bt').slice(0, 8);
  const rarity = fish?.species?.rarity || 'rare';
  const aura   = RARITY_AURA[rarity];
  const stage  = fish?.stage || 'adult';

  const W = size;
  const H = size * 0.72;

  // ── Egg: small blue oval ──────────────────────────────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.55} height={size * 0.65} viewBox="0 0 32 38"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-bt-${uid}`} cx="38%" cy="32%" r="58%">
            <stop offset="0%"   stopColor="#4a9fe8"/>
            <stop offset="55%"  stopColor="#1a6fce"/>
            <stop offset="100%" stopColor="#0a2a60"/>
          </radialGradient>
          <filter id={`egg-bt-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35"/>
          </filter>
        </defs>
        <ellipse cx="16" cy="20" rx="10" ry="13" fill={`url(#egg-bt-${uid})`} filter={`url(#egg-bt-sh-${uid})`}/>
        <ellipse cx="12" cy="14" rx="3" ry="3.5" fill="#6ab8f0" opacity="0.40"/>
        <ellipse cx="19" cy="25" rx="2" ry="2.5" fill="#061840" opacity="0.25"/>
      </svg>
    );
  }

  // ── Juvenile: smaller, paler, stripe less defined ─────────
  const isJuvenile = stage === 'juvenile';
  const stripeOpacity = isJuvenile ? 0.55 : 0.92;
  const bodyOpacity   = isJuvenile ? 0.85 : 1.00;

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 100 72"
      onClick={onClick}
      style={{
        cursor:    onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow:  'visible',
      }}
    >
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`bt-sh-${uid}`} x="-25%" y="-35%" width="150%" height="190%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#061428" floodOpacity="0.50"/>
        </filter>

        {/* ── Rarity aura glow ── */}
        {aura && (
          <filter id={`bt-aura-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip (markings stay inside body) ── */}
        {/* Blue tang body is taller — cx/cy/rx/ry reflect oval profile */}
        <clipPath id={`bt-body-clip-${uid}`}>
          <ellipse cx="44" cy="36" rx="28" ry="22"/>
        </clipPath>

        {/* ── Body gradient: royal blue, top-left light ── */}
        <radialGradient id={`bt-body-${uid}`} cx="32%" cy="26%" r="62%">
          <stop offset="0%"   stopColor="#4a9fe8"/>
          <stop offset="40%"  stopColor="#1a6fce"/>
          <stop offset="100%" stopColor="#0a2860"/>
        </radialGradient>

        {/* ── Belly subsurface scatter ── */}
        <radialGradient id={`bt-belly-${uid}`} cx="50%" cy="80%" r="55%">
          <stop offset="0%"   stopColor="#60b0ff" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="#1a6fce" stopOpacity="0"/>
        </radialGradient>

        {/* ── Dorsal shadow band ── */}
        <radialGradient id={`bt-dorsal-${uid}`} cx="50%" cy="0%" r="58%">
          <stop offset="0%"   stopColor="#061428" stopOpacity="0.32"/>
          <stop offset="100%" stopColor="#061428" stopOpacity="0"/>
        </radialGradient>

        {/* ── Specular highlight ── */}
        <radialGradient id={`bt-spec-${uid}`} cx="30%" cy="24%" r="26%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.75"/>
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Yellow tail gradient ── */}
        <linearGradient id={`bt-tail-${uid}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%"   stopColor="#f5c820" stopOpacity="0.45"/>
          <stop offset="60%"  stopColor="#f0b010" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#e09000" stopOpacity="0.95"/>
        </linearGradient>

        {/* ── Blue fin gradient ── */}
        <linearGradient id={`bt-fin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a6fce" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#0a2860" stopOpacity="0.35"/>
        </linearGradient>

        {/* ── Pectoral fin gradient ── */}
        <radialGradient id={`bt-pec-${uid}`} cx="25%" cy="35%" r="68%">
          <stop offset="0%"   stopColor="#4a9fe8" stopOpacity="0.70"/>
          <stop offset="100%" stopColor="#0a2860" stopOpacity="0.20"/>
        </radialGradient>

        {/* ── Scale texture ── */}
        <pattern id={`bt-scale-${uid}`} x="0" y="0" width="7" height="6" patternUnits="userSpaceOnUse">
          <ellipse cx="3.5" cy="3" rx="3" ry="2.2" fill="none" stroke="#0a3888" strokeWidth="0.35" opacity="0.18"/>
        </pattern>
      </defs>

      {/* ── Rarity aura (behind everything) ── */}
      {aura && (
        <ellipse cx="44" cy="36" rx="32" ry="26"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#bt-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="44" cy="36" rx="33" ry="27"
          fill="none" stroke="#ffe040" strokeWidth="2.2" opacity="0.85"/>
      )}

      {/* ════ TAIL FIN (forked, yellow) ════ */}
      <path d={`M 17 36 C 5 22, 0 14, 8 11 C 13 8, 18 22, 17 36 Z`}
        fill={`url(#bt-tail-${uid})`} filter={`url(#bt-sh-${uid})`}/>
      <path d={`M 17 36 C 5 50, 0 58, 8 61 C 13 64, 18 50, 17 36 Z`}
        fill={`url(#bt-tail-${uid})`}/>
      {/* Tail fin rays */}
      {[0.2, 0.5, 0.8].map((t, i) => (
        <line key={i}
          x1={17} y1={36}
          x2={1 + t * 10} y2={11 + t * 50}
          stroke="#c89000" strokeWidth="0.6" opacity="0.35"/>
      ))}

      {/* ════ DORSAL FIN (runs ~full body length, high profile) ════ */}
      <path d={`M 30 14 C 28 4, 36 1, 44 3 C 52 1, 60 3, 65 8 C 68 11, 66 14, 62 14 Z`}
        fill={`url(#bt-fin-${uid})`}/>
      {/* Dorsal fin rays */}
      {[[30,14,28,3],[37,14,36,1],[44,14,43,1],[51,14,52,1],[58,14,60,2],[63,14,66,7]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#0a2860" strokeWidth="0.5" opacity="0.30"/>
      ))}

      {/* ════ ANAL FIN (mirror of dorsal on belly side) ════ */}
      <path d={`M 30 58 C 28 68, 38 71, 48 69 C 56 67, 62 62, 65 58 Z`}
        fill={`url(#bt-fin-${uid})`}/>
      {/* Anal fin rays */}
      {[[30,58,28,68],[40,58,40,70],[52,58,54,68],[62,58,64,61]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#0a2860" strokeWidth="0.5" opacity="0.28"/>
      ))}

      {/* ════ PECTORAL FIN ════ */}
      <ellipse cx="62" cy="42" rx="10" ry="6"
        fill={`url(#bt-pec-${uid})`}
        transform="rotate(-15 62 42)"/>
      {/* Pectoral fin rays */}
      {[[-8,-2],[-3,-4],[2,-5],[6,-3],[9,-1]].map(([dx,dy],i) => (
        <line key={i}
          x1={62} y1={42}
          x2={62+dx*0.9} y2={42+dy*2.2+5}
          stroke="#0a3888" strokeWidth="0.4" opacity="0.22"/>
      ))}

      {/* ════ BODY ════ */}
      <ellipse cx="44" cy="36" rx="28" ry="22"
        fill={`url(#bt-body-${uid})`}
        opacity={bodyOpacity}
        filter={`url(#bt-sh-${uid})`}/>

      {/* ════ BLACK LATERAL STRIPE (clipped to body) ════ */}
      {/* The stripe is a sweeping arc: eye → body mid → tail base.
          Built as a thick curved path clipped to the body ellipse. */}
      <g clipPath={`url(#bt-body-clip-${uid})`} opacity={stripeOpacity}>
        {/* Main stripe body — tapers at each end */}
        <path d={`M 68 28 Q 55 32, 44 34 Q 30 36, 18 38 Q 16 40, 17 44
                   Q 30 42, 44 40 Q 55 38, 68 34 Z`}
          fill="#0a0a12"/>
        {/* Eye-end of stripe blends into eye area */}
        <ellipse cx="70" cy="31" rx="5" ry="4" fill="#0a0a12"/>
      </g>

      {/* ════ YELLOW TAIL BASE TEARDROP (the surgeonfish spine area) ════ */}
      <ellipse cx="20" cy="36" rx="4" ry="3"
        fill="#f5c820" opacity="0.80"
        clipPath={`url(#bt-body-clip-${uid})`}/>

      {/* ════ BELLY SUBSURFACE SCATTER ════ */}
      <ellipse cx="44" cy="36" rx="28" ry="22"
        fill={`url(#bt-belly-${uid})`}/>

      {/* ════ DORSAL SHADOW BAND ════ */}
      <ellipse cx="44" cy="36" rx="28" ry="22"
        fill={`url(#bt-dorsal-${uid})`}/>

      {/* ════ SCALE TEXTURE ════ */}
      <ellipse cx="44" cy="36" rx="28" ry="22"
        fill={`url(#bt-scale-${uid})`} opacity="0.55"
        clipPath={`url(#bt-body-clip-${uid})`}/>

      {/* ════ SPECULAR HIGHLIGHT ════ */}
      <ellipse cx="44" cy="36" rx="28" ry="22"
        fill={`url(#bt-spec-${uid})`}/>

      {/* ════ EYE ════ */}
      {/* The eye sits at the front of the body, partly inside the black stripe */}
      <circle cx="70" cy="31" r="5.5" fill="#0a0a12"/>
      <circle cx="70" cy="31" r="4.0" fill="#1a1828"/>
      <circle cx="70" cy="31" r="2.8" fill="#080610"/>
      <circle cx="68.5" cy="29.5" r="1.2" fill="#ffffff" opacity="0.88"/>
      <circle cx="71.5" cy="32.5" r="0.6" fill="#ffffff" opacity="0.45"/>
      {/* Thin yellow eye ring — blue tang characteristic */}
      <circle cx="70" cy="31" r="5.5" fill="none"
        stroke="#f5c820" strokeWidth="0.7" opacity="0.50"/>

      {/* ════ MOUTH ════ */}
      <path d={`M 74 37 Q 77 39, 74 40`}
        fill="none" stroke="#0a0a12" strokeWidth="1.1"
        strokeLinecap="round" opacity="0.65"/>

      {/* ════ PECTORAL FIN BASE YELLOW STREAK ════ */}
      {/* Short yellow dash where pectoral fin meets body */}
      <path d={`M 60 38 Q 63 36, 65 40`}
        fill="none" stroke="#f5c820" strokeWidth="1.5" opacity="0.55"
        strokeLinecap="round"/>

      {/* ════ LATERAL LINE ════ */}
      <path d={`M 20 35 Q 44 32, 68 34`}
        fill="none" stroke="#6ab8f0" strokeWidth="0.5" opacity="0.20"/>

      {/* ════ JUVENILE BADGE ════ */}
      {isJuvenile && (
        <text x="44" y="66" textAnchor="middle"
          fontSize="5" fill="#4a9fe8" opacity="0.75"
          fontFamily="sans-serif" fontWeight="bold">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(BlueTangSprite, (prev, next) =>
  prev.fish?.id      === next.fish?.id      &&
  prev.fish?.stage   === next.fish?.stage   &&
  prev.fish?.health  === next.fish?.health  &&
  prev.fish?.disease === next.fish?.disease &&
  prev.selected      === next.selected      &&
  prev.size          === next.size          &&
  prev.flipped       === next.flipped
);
