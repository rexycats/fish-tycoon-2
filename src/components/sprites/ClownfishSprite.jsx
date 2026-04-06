// ============================================================
// FISH TYCOON — ClownfishSprite (Phase 12)
// ============================================================
// Design audit:
//   Body    : deep rounded ellipse, warm orange radial gradient
//   Markings: 3 white bars (head / mid / tail) clipped to body
//             each bar has top-warm / bottom-cool linear gradient
//             and thin black outline strokes on each edge
//   Fins    : tail (forked), dorsal (notched — 2 lobes), pectorals
//             all semi-transparent with fin-ray lines
//   Shading : subsurface belly scatter, specular wet-look,
//             scale-texture sheen, depth shadow band
//   Rarity  : aura halo from RARITY_AURA
// Layer order (back → front):
//   drop shadow → tail fin → dorsal fin → pectoral fins →
//   body fill → white bars (clipped) → belly glow →
//   scale texture → specular → eye → mouth →
//   selection ring → rarity aura
// ============================================================

import React, { memo } from 'react';

const RARITY_AURA = {
  common:    null,
  uncommon:  { color: '#78c8ff', opacity: 0.20, blur: 6  },
  rare:      { color: '#c878ff', opacity: 0.28, blur: 8  },
  epic:      { color: '#ffe040', opacity: 0.40, blur: 10 },
  legendary: { color: '#ff8040', opacity: 0.55, blur: 14 },
};

// ── Colour variants ──────────────────────────────────────────
const VARIANTS_CF = {
  // Default: classic vivid orange
  default: { body: '#e8621a', bodyHi: '#f5a030', bar: '#f5f0e8', barShad: '#d8e4ee' },
  // Rare: cinnabar — deep red body, cream bars
  cinnabar: { body: '#b82010', bodyHi: '#e03020', bar: '#f8f0e0', barShad: '#ddd0c0' },
  // Rare: snowflake — pale gold body, white bars
  snowflake: { body: '#d4a030', bodyHi: '#f0c860', bar: '#ffffff', barShad: '#e8e8e8' },
  // Mutated: melanistic — charcoal body, dim bars
  melanistic: { body: '#2a1808', bodyHi: '#483020', bar: '#505050', barShad: '#303030' },
};

function ClownfishSprite({
  fish,
  size     = 60,
  flipped  = false,
  selected = false,
  onClick,
}) {
  const uid    = (fish?.id || 'cf').slice(0, 8);
  const rarity = fish?.species?.rarity || 'uncommon';
  const aura   = RARITY_AURA[rarity];
  const stage  = fish?.stage || 'adult';

  // Resolve colour variant
  const variantKey = fish?.colorVariant || 'default';
  const V = VARIANTS_CF[variantKey] || VARIANTS_CF.default;

  const W = size;
  const H = size * 0.68;

  // ── Juvenile: only 1 white bar (head bar), smaller body ──
  const isJuvenile = stage === 'juvenile';
  const barCount   = isJuvenile ? 1 : 3;

  // ── Variant hue-shift via CSS filter ────────────────────
  // 'default' keeps the original orange palette.
  // Others apply a CSS hue-rotation and/or brightness shift.
  const variantStyle = (() => {
    switch (variantKey) {
      case 'cinnabar':   return { filter: 'hue-rotate(-25deg) saturate(1.2) brightness(0.85)' };
      case 'snowflake':  return { filter: 'hue-rotate(20deg) saturate(0.65) brightness(1.15)' };
      case 'melanistic': return { filter: 'saturate(0.10) brightness(0.45)' };
      default:           return {};
    }
  })();

  // ── Egg: simple orange oval ───────────────────────────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.6} height={size * 0.7} viewBox="0 0 36 42"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-cf-${uid}`} cx="38%" cy="32%" r="58%">
            <stop offset="0%"   stopColor="#f5a030"/>
            <stop offset="55%"  stopColor="#e8621a"/>
            <stop offset="100%" stopColor="#a03008"/>
          </radialGradient>
          <filter id={`egg-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.35"/>
          </filter>
        </defs>
        <ellipse cx="18" cy="22" rx="11" ry="14" fill={`url(#egg-cf-${uid})`} filter={`url(#egg-sh-${uid})`}/>
        <ellipse cx="14" cy="16" rx="3.5" ry="4" fill="#f5b848" opacity="0.45"/>
        <ellipse cx="21" cy="28" rx="2"   ry="2.5" fill="#7a1e04" opacity="0.25"/>
      </svg>
    );
  }

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 100 68"
      onClick={onClick}
      style={{
        cursor:    onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow:  'visible',
        ...variantStyle,
      }}
    >
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`cf-sh-${uid}`} x="-25%" y="-35%" width="150%" height="190%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#1a0800" floodOpacity="0.45"/>
        </filter>

        {/* ── Rarity aura glow ── */}
        {aura && (
          <filter id={`cf-aura-${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip (all markings stay inside body) ── */}
        <clipPath id={`cf-body-clip-${uid}`}>
          <ellipse cx="46" cy="34" rx="30" ry="20"/>
        </clipPath>

        {/* ── Body gradient: warm orange, top-left light source ── */}
        <radialGradient id={`cf-body-${uid}`} cx="35%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#f5a030"/>
          <stop offset="40%"  stopColor="#e8621a"/>
          <stop offset="100%" stopColor="#8c2c04"/>
        </radialGradient>

        {/* ── White bar gradient (warm top → cool shadow bottom) ── */}
        <linearGradient id={`cf-bar-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fffaf0"/>
          <stop offset="55%"  stopColor="#f5f0e8"/>
          <stop offset="100%" stopColor="#c8d4dc"/>
        </linearGradient>

        {/* ── Belly subsurface scatter ── */}
        <radialGradient id={`cf-belly-${uid}`} cx="50%" cy="78%" r="55%">
          <stop offset="0%"   stopColor="#f8c060" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#e8621a" stopOpacity="0"/>
        </radialGradient>

        {/* ── Dorsal shadow band (dark from top) ── */}
        <radialGradient id={`cf-dorsal-${uid}`} cx="50%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#3a1400" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#3a1400" stopOpacity="0"/>
        </radialGradient>

        {/* ── Specular highlight ── */}
        <radialGradient id={`cf-spec-${uid}`} cx="32%" cy="25%" r="28%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.80"/>
          <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient (semi-transparent orange) ── */}
        <linearGradient id={`cf-fin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#e8621a" stopOpacity="0.90"/>
          <stop offset="100%" stopColor="#a03008" stopOpacity="0.40"/>
        </linearGradient>

        {/* ── Tail fin gradient ── */}
        <linearGradient id={`cf-tail-${uid}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%"   stopColor="#c84010" stopOpacity="0.50"/>
          <stop offset="100%" stopColor="#e86820" stopOpacity="0.90"/>
        </linearGradient>

        {/* ── Pectoral fin gradient ── */}
        <radialGradient id={`cf-pec-${uid}`} cx="20%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#f09040" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#c04010" stopOpacity="0.25"/>
        </radialGradient>

        {/* ── Scale texture ── */}
        <pattern id={`cf-scale-${uid}`} x="0" y="0" width="8" height="6" patternUnits="userSpaceOnUse">
          <ellipse cx="4" cy="3" rx="3.5" ry="2.5" fill="none" stroke="#c04808" strokeWidth="0.4" opacity="0.18"/>
        </pattern>
      </defs>

      {/* ── Rarity aura (behind everything) ── */}
      {aura && (
        <ellipse cx="46" cy="34" rx="33" ry="23"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#cf-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="46" cy="34" rx="34" ry="24"
          fill="none" stroke="#ffe040" strokeWidth="2.2" opacity="0.85"/>
      )}

      {/* ════ TAIL FIN ════ */}
      {/* Two lobes of the forked tail */}
      <path className="fish-tail" d={`M 18 34 C 6 22, 2 14, 10 12 C 16 10, 20 20, 18 34 Z`}
        fill={`url(#cf-tail-${uid})`} filter={`url(#cf-sh-${uid})`}/>
      <path className="fish-tail" d={`M 18 34 C 6 46, 2 54, 10 56 C 16 58, 20 48, 18 34 Z`}
        fill={`url(#cf-tail-${uid})`}/>
      {/* Fin rays */}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <line key={i}
          x1={18} y1={34}
          x2={2 + t * 10} y2={12 + t * 44}
          stroke="#a03008" strokeWidth="0.5" opacity="0.30"/>
      ))}

      {/* ════ DORSAL FIN (notched — 2 lobes, clownfish signature) ════ */}
      {/* Rear lobe */}
      <path className="fish-dorsal" d={`M 38 14 C 36 4, 46 2, 52 10 C 54 14, 50 14, 48 14 Z`}
        fill={`url(#cf-fin-${uid})`}/>
      {/* Front lobe (slightly taller) */}
      <path className="fish-dorsal" d={`M 52 14 C 52 4, 62 0, 68 8 C 70 12, 66 14, 62 14 Z`}
        fill={`url(#cf-fin-${uid})`}/>
      {/* Notch valley between lobes */}
      <path d={`M 48 14 C 49 10, 51 10, 52 14`}
        fill="#a03008" opacity="0.55"/>
      {/* Fin rays on dorsal */}
      {[[38,14,36,4],[44,14,42,3],[52,14,50,2],[58,14,56,1],[64,14,64,1]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#8c2c04" strokeWidth="0.5" opacity="0.28"/>
      ))}

      {/* ════ VENTRAL / ANAL FIN ════ */}
      <path d={`M 42 54 C 38 62, 32 64, 30 60 C 28 56, 34 52, 42 54 Z`}
        fill={`url(#cf-fin-${uid})`}/>

      {/* ════ PECTORAL FIN ════ */}
      <ellipse className="fish-fin" cx="58" cy="40" rx="10" ry="6"
        fill={`url(#cf-pec-${uid})`}
        transform="rotate(-20 58 40)"/>
      {/* Pectoral fin rays */}
      {[[-8,-2],[-4,-4],[0,-5],[4,-4],[8,-2]].map(([dx,dy],i) => (
        <line key={i}
          x1={58} y1={40}
          x2={58+dx*0.9} y2={40+dy*2.5+6}
          stroke="#c04010" strokeWidth="0.4" opacity="0.25"/>
      ))}

      {/* ════ BODY ════ */}
      <ellipse cx="46" cy="34" rx="30" ry="20"
        fill={`url(#cf-body-${uid})`}
        filter={`url(#cf-sh-${uid})`}/>

      {/* ════ WHITE BARS (clipped to body ellipse) ════ */}
      <g clipPath={`url(#cf-body-clip-${uid})`}>

        {/* Bar 1 — Head bar (just behind eye, always shown) */}
        {/* Black outlines first, then white fill on top */}
        <rect x="63" y="14" width="9"  height="40" fill="#1a0f08" opacity="0.85"/>
        <rect x="64" y="14" width="7"  height="40" fill={`url(#cf-bar-${uid})`}/>

        {/* Bar 2 — Mid-body bar */}
        {barCount >= 2 && <>
          <rect x="42" y="14" width="9"  height="40" fill="#1a0f08" opacity="0.85"/>
          <rect x="43" y="14" width="7"  height="40" fill={`url(#cf-bar-${uid})`}/>
        </>}

        {/* Bar 3 — Tail base bar */}
        {barCount >= 3 && <>
          <rect x="21" y="14" width="8"  height="40" fill="#1a0f08" opacity="0.85"/>
          <rect x="22" y="14" width="6"  height="40" fill={`url(#cf-bar-${uid})`}/>
        </>}
      </g>

      {/* ════ BELLY SUBSURFACE SCATTER ════ */}
      <ellipse cx="46" cy="34" rx="30" ry="20"
        fill={`url(#cf-belly-${uid})`}/>

      {/* ════ DORSAL SHADOW BAND ════ */}
      <ellipse cx="46" cy="34" rx="30" ry="20"
        fill={`url(#cf-dorsal-${uid})`}/>

      {/* ════ SCALE TEXTURE ════ */}
      <ellipse cx="46" cy="34" rx="30" ry="20"
        fill={`url(#cf-scale-${uid})`} opacity="0.6"
        clipPath={`url(#cf-body-clip-${uid})`}/>

      {/* ════ SPECULAR HIGHLIGHT ════ */}
      <ellipse cx="46" cy="34" rx="30" ry="20"
        fill={`url(#cf-spec-${uid})`}/>

      {/* ════ EYE ════ */}
      {/* Eye socket */}
      <circle cx="71" cy="31" r="5.5" fill="#1a0f08"/>
      {/* Iris */}
      <circle cx="71" cy="31" r="4.2" fill="#2a1808"/>
      {/* Iris highlight ring */}
      <circle cx="71" cy="31" r="3.5" fill="#3a2010" opacity="0.8"/>
      {/* Pupil */}
      <circle cx="71" cy="31" r="2.5" fill="#080402"/>
      {/* Primary glint */}
      <circle cx="69.5" cy="29.5" r="1.2" fill="#ffffff" opacity="0.90"/>
      {/* Secondary glint */}
      <circle cx="72.5" cy="32.5" r="0.6" fill="#ffffff" opacity="0.50"/>
      {/* Eye rim highlight */}
      <circle cx="71" cy="31" r="5.5" fill="none"
        stroke="#f5a030" strokeWidth="0.8" opacity="0.35"/>

      {/* ════ MOUTH ════ */}
      <path d={`M 78 36 Q 80 38, 78 39`}
        fill="none" stroke="#1a0f08" strokeWidth="1.2"
        strokeLinecap="round" opacity="0.70"/>

      {/* ════ LATERAL LINE (iridescent sheen) ════ */}
      <path d={`M 22 33 Q 46 30, 70 32`}
        fill="none" stroke="#ffd090" strokeWidth="0.6" opacity="0.22"/>

      {/* ════ JUVENILE badge label ════ */}
      {isJuvenile && (
        <text x="46" y="62" textAnchor="middle"
          fontSize="5" fill="#f5a030" opacity="0.75"
          fontFamily="sans-serif" fontWeight="bold">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(ClownfishSprite, (prev, next) =>
  prev.fish?.id           === next.fish?.id           &&
  prev.fish?.stage        === next.fish?.stage        &&
  prev.fish?.health       === next.fish?.health       &&
  prev.fish?.disease      === next.fish?.disease      &&
  prev.fish?.colorVariant === next.fish?.colorVariant &&
  prev.selected           === next.selected           &&
  prev.size               === next.size               &&
  prev.flipped            === next.flipped
);
