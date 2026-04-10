// ============================================================
// FISH TYCOON — GoldfishSprite (Phase 12)
// ============================================================
// Design audit:
//   Silhouette : deep rounded body — nearly as tall as long.
//                Fancy/ryukin body type: pronounced hump behind
//                head, wide belly, tapering to a narrow caudal
//                peduncle. Head is small relative to body.
//   Tail       : twin butterfly/veil tail — deeply forked into
//                two broad lobes, each lobe wide and rounded at
//                the tip. The lobes split symmetrically. Long
//                trailing edge, semi-transparent fan.
//   Dorsal fin : tall triangular sail rising from the hump peak.
//   Pectorals  : small paired rounded fans near the gill plate.
//   Anal fins  : paired, short, below the caudal peduncle.
//   Markings   : solid warm orange-gold with a paler cream-gold
//                belly. Scale texture catches light as small
//                bright rhombus glints along the flanks.
//                Orange shades deeper toward the back and the
//                dorsal hump. No bars or stripes.
//   Palette    : body #e8820a (vivid orange-gold)
//                hump #c86008 (deep warm shadow)
//                belly #f8c868 (pale gold cream)
//                highlight #ffd090
//                fin #c86808 / #e8a020 (slightly darker than body)
//                scale glint #fff8d0
//   Eye        : large, dark brown #2a1000, white sclera,
//                pupil highlight.
//   Variants   : 'rare' → white/red kohaku (white body + red cap)
//                'calico' → orange+black+white blotched
//                'black' → melanistic (deep charcoal)
//   Shading    : radial top-left light source, belly scatter,
//                dorsal shadow band, specular wet-look glint.
//
// Layer order (back → front):
//   rarity aura → selection ring →
//   twin tail lobes → anal fins →
//   dorsal fin → pectoral fins →
//   body fill → belly glow → hump shadow →
//   scale texture glints → specular →
//   eye → mouth → juvenile badge
// ============================================================

import React, { memo } from 'react';

const RARITY_AURA = {
  common:    null,
  uncommon:  { color: '#78c8ff', opacity: 0.20, blur: 6  },
  rare:      { color: '#c878ff', opacity: 0.28, blur: 8  },
  epic:      { color: '#ffe040', opacity: 0.40, blur: 10 },
  legendary: { color: '#ff8040', opacity: 0.55, blur: 14 },
};

// ── Colour variant palettes ──────────────────────────────────
// Resolved from fish.species.colorVariant or fish.colorVariant
const VARIANTS = {
  // Default: classic orange-gold fancy goldfish
  default: {
    body:     '#e8820a',
    body2:    '#c86008',
    belly:    '#f8c868',
    hi:       '#ffd090',
    fin:      '#c86808',
    fin2:     '#e8a020',
    scale:    '#fff8d0',
    eyeRing:  null,
  },
  // Rare kohaku: white body with red "cap" patch on head
  kohaku: {
    body:     '#f5f0e8',
    body2:    '#d8d0c0',
    belly:    '#ffffff',
    hi:       '#ffffff',
    fin:      '#e8ddd0',
    fin2:     '#f0ece8',
    scale:    '#ffffff',
    eyeRing:  null,
    capColor: '#d83018',   // red cap on dorsal-head area
  },
  // Rare calico: orange body with black and white patches
  calico: {
    body:     '#e89030',
    body2:    '#c87010',
    belly:    '#f8d080',
    hi:       '#ffe0a0',
    fin:      '#c05010',
    fin2:     '#d87020',
    scale:    '#fff0c0',
    eyeRing:  null,
    patch1:   '#1a1008',   // black patch
    patch2:   '#f8f4f0',   // white patch
  },
  // Mutated/melanistic: deep charcoal black moor
  black: {
    body:     '#2a2018',
    body2:    '#18120c',
    belly:    '#483830',
    hi:       '#685040',
    fin:      '#1a100a',
    fin2:     '#382818',
    scale:    '#605040',
    eyeRing:  '#c8a070',   // telescope-eye gold ring
  },
};

function GoldfishSprite({
  fish,
  size     = 60,
  flipped  = false,
  selected = false,
  onClick,
}) {
  const uid    = (fish?.id || 'gf').slice(0, 8);
  const rarity = fish?.species?.rarity || 'uncommon';
  const aura   = RARITY_AURA[rarity];
  const stage  = fish?.stage || 'adult';

  // Resolve colour variant
  const variantKey = fish?.colorVariant || fish?.species?.colorVariant || 'default';
  const V = VARIANTS[variantKey] || VARIANTS.default;

  // ── Egg: small golden oval ────────────────────────────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.55} height={size * 0.65} viewBox="0 0 33 40"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-gf-${uid}`} cx="38%" cy="32%" r="58%">
            <stop offset="0%"   stopColor="#ffd090"/>
            <stop offset="55%"  stopColor="#e8820a"/>
            <stop offset="100%" stopColor="#a05008"/>
          </radialGradient>
          <filter id={`egg-gf-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.32"/>
          </filter>
        </defs>
        <ellipse cx="16" cy="24" rx="10" ry="14"
          fill={`url(#egg-gf-${uid})`}
          filter={`url(#egg-gf-sh-${uid})`}/>
        <ellipse cx="11" cy="17" rx="3.5" ry="4" fill="#ffd090" opacity="0.45"/>
      </svg>
    );
  }

  // ── Juvenile: same shape but smaller, shorter tail ────────
  const isJuvenile  = stage === 'juvenile';
  const tailOpacity = isJuvenile ? 0.55 : 0.82;
  const bodyOpacity = isJuvenile ? 0.85 : 1.00;
  const finOpacity  = isJuvenile ? 0.50 : 0.72;
  // Juvenile tail lobes are shorter / rounder (scale factor)
  const ts          = isJuvenile ? 0.60 : 1.00;  // tail scale

  const W = size;
  const H = size * 0.80;   // goldfish is deeper-bodied than most

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 100 80"
      onClick={onClick}
      style={{
        cursor:    onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow:  'visible',
      }}
    >
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`gf-sh-${uid}`} x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#1a0800" floodOpacity="0.48"/>
        </filter>

        {/* ── Rarity aura ── */}
        {aura && (
          <filter id={`gf-aura-${uid}`} x="-55%" y="-45%" width="210%" height="195%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip — deep rounded body ── */}
        <clipPath id={`gf-body-clip-${uid}`}>
          <ellipse cx="55" cy="42" rx="28" ry="24"/>
        </clipPath>

        {/* ── Body gradient: warm orange, top-left light ── */}
        <radialGradient id={`gf-body-${uid}`} cx="32%" cy="26%" r="72%">
          <stop offset="0%"   stopColor={V.hi}/>
          <stop offset="42%"  stopColor={V.body}/>
          <stop offset="100%" stopColor={V.body2}/>
        </radialGradient>

        {/* ── Belly scatter ── */}
        <radialGradient id={`gf-belly-${uid}`} cx="50%" cy="88%" r="55%">
          <stop offset="0%"   stopColor={V.belly} stopOpacity="0.75"/>
          <stop offset="100%" stopColor={V.belly}  stopOpacity="0"/>
        </radialGradient>

        {/* ── Dorsal shadow band ── */}
        <radialGradient id={`gf-dshadow-${uid}`} cx="50%" cy="0%" r="55%">
          <stop offset="0%"   stopColor={V.body2} stopOpacity="0.48"/>
          <stop offset="100%" stopColor={V.body2}  stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient ── */}
        <linearGradient id={`gf-fin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={V.fin2} stopOpacity="0.90"/>
          <stop offset="100%" stopColor={V.fin}  stopOpacity="0.55"/>
        </linearGradient>

        {/* ── Twin-tail gradient ── */}
        <linearGradient id={`gf-tail-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={V.fin2} stopOpacity="0.82"/>
          <stop offset="70%"  stopColor={V.fin}  stopOpacity="0.60"/>
          <stop offset="100%" stopColor={V.fin}  stopOpacity="0.30"/>
        </linearGradient>

        {/* ── Specular ── */}
        <radialGradient id={`gf-spec-${uid}`} cx="34%" cy="26%" r="28%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin rim glow ── */}
        <filter id={`gf-finglow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.0" result="blur"/>
          <feFlood floodColor={V.fin2} floodOpacity="0.40" result="colour"/>
          <feComposite in="colour" in2="blur" operator="in" result="glowColour"/>
          <feMerge><feMergeNode in="glowColour"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Rarity aura halo ── */}
      {aura && (
        <ellipse cx="55" cy="42" rx="34" ry="30"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#gf-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="55" cy="42" rx="36" ry="32"
          fill="none" stroke="#fff" strokeWidth="2" opacity="0.70"/>
      )}

      {/* ══════════════════════════════════════════════
          TWIN BUTTERFLY TAIL
          Two lobes split from caudal peduncle (x≈27, y≈42)
          Upper lobe fans up-left; lower lobe fans down-left.
          ══════════════════════════════════════════════ */}
      {/* Upper tail lobe */}
      <path
        className="fish-tail"
        d={`
          M 27 ${42 - 4}
          C ${27 - 18*ts} ${42 - 22*ts},
            ${27 - 28*ts} ${42 - 28*ts},
            ${27 - 30*ts} ${42 - 18*ts}
          C ${27 - 26*ts} ${42 - 8*ts},
            ${27 - 14*ts} ${42 - 4*ts},
            27 ${42 + 2}
          Z
        `}
        fill={`url(#gf-tail-${uid})`}
        opacity={tailOpacity}
        filter={`url(#gf-finglow-${uid})`}
      />
      {/* Lower tail lobe */}
      <path
        className="fish-tail"
        d={`
          M 27 ${42 + 4}
          C ${27 - 18*ts} ${42 + 22*ts},
            ${27 - 28*ts} ${42 + 28*ts},
            ${27 - 30*ts} ${42 + 18*ts}
          C ${27 - 26*ts} ${42 + 8*ts},
            ${27 - 14*ts} ${42 + 4*ts},
            27 ${42 - 2}
          Z
        `}
        fill={`url(#gf-tail-${uid})`}
        opacity={tailOpacity}
        filter={`url(#gf-finglow-${uid})`}
      />
      {/* Tail fin rays */}
      {[0.20, 0.42, 0.60, 0.78].map((t, i) => {
        const lx = 27 - 22*ts * t;
        const topY = (42 - 4) + t * (-14*ts);
        const botY = (42 + 4) + t * (14*ts);
        return (
          <line key={i}
            x1="27" y1="42" x2={lx} y2={i < 2 ? topY : botY}
            stroke={V.fin} strokeWidth="0.6" opacity="0.38"
          />
        );
      })}

      {/* ── Anal fins (paired, below body rear) ── */}
      <path
        d={`M 40 62 C 34 72, 28 74, 26 68 C 28 64, 36 62, 40 62 Z`}
        fill={`url(#gf-fin-${uid})`}
        opacity={finOpacity * 0.80}
        filter={`url(#gf-finglow-${uid})`}
      />

      {/* ── Body ellipse ── */}
      <ellipse cx="55" cy="42" rx="28" ry="24"
        fill={`url(#gf-body-${uid})`}
        filter={`url(#gf-sh-${uid})`}
        opacity={bodyOpacity}
      />

      {/* ── Kohaku red cap (variant-specific) ── */}
      {V.capColor && (
        <ellipse cx="76" cy="36" rx="10" ry="9"
          fill={V.capColor}
          clipPath={`url(#gf-body-clip-${uid})`}
          opacity="0.82"
        />
      )}

      {/* ── Calico patches (variant-specific) ── */}
      {V.patch1 && (
        <>
          <ellipse cx="60" cy="38" rx="9" ry="7"
            fill={V.patch1}
            clipPath={`url(#gf-body-clip-${uid})`}
            opacity="0.60"
          />
          <ellipse cx="46" cy="50" rx="7" ry="6"
            fill={V.patch2}
            clipPath={`url(#gf-body-clip-${uid})`}
            opacity="0.55"
          />
        </>
      )}

      {/* ── Belly glow ── */}
      <ellipse cx="55" cy="54" rx="22" ry="16"
        fill={`url(#gf-belly-${uid})`}
        clipPath={`url(#gf-body-clip-${uid})`}
      />

      {/* ── Dorsal shadow band (hump area) ── */}
      <ellipse cx="58" cy="22" rx="22" ry="16"
        fill={`url(#gf-dshadow-${uid})`}
        clipPath={`url(#gf-body-clip-${uid})`}
      />

      {/* ── Scale texture glints ── */}
      {[
        [52, 38], [62, 35], [72, 40], [58, 48], [68, 50], [48, 46], [76, 44],
      ].map(([sx, sy], i) => (
        <ellipse key={i} cx={sx} cy={sy} rx="2.2" ry="1.4"
          fill={V.scale} opacity="0.28"
          clipPath={`url(#gf-body-clip-${uid})`}
        />
      ))}

      {/* ── Specular wet-look ── */}
      <ellipse cx="67" cy="33" rx="8" ry="5"
        fill={`url(#gf-spec-${uid})`}
        clipPath={`url(#gf-body-clip-${uid})`}
      />
      <ellipse cx="71" cy="31" rx="2.5" ry="1.5"
        fill="#ffffff" opacity="0.52"
        clipPath={`url(#gf-body-clip-${uid})`}
      />

      {/* ── Dorsal fin (tall triangular sail) ── */}
      <path
        className="fish-dorsal"
        d={`
          M 58 20
          C 58 10, 64 8,  70 10
          C 72 12, 72 16, 70 18
          C 67 20, 62 20, 58 20
          Z
        `}
        fill={`url(#gf-fin-${uid})`}
        opacity={finOpacity}
        filter={`url(#gf-finglow-${uid})`}
      />
      {/* Dorsal rays */}
      <line x1="58" y1="20" x2="63" y2="10" stroke={V.fin} strokeWidth="0.7" opacity="0.40"/>
      <line x1="62" y1="20" x2="67" y2="9"  stroke={V.fin} strokeWidth="0.7" opacity="0.35"/>
      <line x1="66" y1="19" x2="70" y2="10" stroke={V.fin} strokeWidth="0.7" opacity="0.30"/>

      {/* ── Pectoral fin ── */}
      <path
        className="fish-fin"
        d={`M 72 44 C 76 50, 78 54, 74 56 C 70 56, 68 52, 70 46 Z`}
        fill={`url(#gf-fin-${uid})`}
        opacity={finOpacity * 0.70}
        filter={`url(#gf-finglow-${uid})`}
      />

      {/* ── Eye ── */}
      {/* Telescope-eye ring for black moor variant */}
      {V.eyeRing && (
        <circle cx="79" cy="38" r="5.5" fill={V.eyeRing} opacity="0.55"/>
      )}
      <circle cx="79" cy="38" r="4.5" fill="#f8ece0"/>
      <circle cx="79" cy="38" r="3.2" fill="#2a1000"/>
      <circle cx="80.5" cy="36.5" r="1.0" fill="#ffffff" opacity="0.85"/>
      {/* Secondary glint */}
      <circle cx="77.5" cy="39.5" r="0.5" fill="#ffffff" opacity="0.42"/>

      {/* ── Mouth ── */}
      <path d="M 83 41 Q 84 40.5 84 42" fill="none"
        stroke={V.body2} strokeWidth="0.9" strokeLinecap="round"/>

      {/* ── Gill plate line ── */}
      <path d="M 74 36 Q 72 42, 74 48" fill="none"
        stroke={V.body2} strokeWidth="0.7" strokeOpacity="0.40" strokeLinecap="round"/>

      {/* ── Juvenile badge ── */}
      {isJuvenile && (
        <text x="50%" y="74" textAnchor="middle" fontSize="5"
          fill="#ffd090" opacity="0.72" fontFamily="sans-serif">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(GoldfishSprite, (prev, next) =>
  prev.size      === next.size      &&
  prev.flipped   === next.flipped   &&
  prev.selected  === next.selected  &&
  prev.fish?.id  === next.fish?.id  &&
  prev.fish?.stage === next.fish?.stage &&
  prev.fish?.colorVariant === next.fish?.colorVariant
);
