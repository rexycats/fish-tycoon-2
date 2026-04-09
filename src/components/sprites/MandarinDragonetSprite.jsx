// ============================================================
// FISH TYCOON — MandarinDragonetSprite (Phase 12)
// ============================================================
// Design audit:
//   Silhouette : small elongated body — slender and torpedo-like
//                but with a distinctively large fan-like dorsal
//                fin that dominates the profile. Head is blunt
//                with a downturned froggy mouth. Body tapers to
//                a narrow, squared-off tail. Short rounded tail
//                fin. Pectoral fins large and wing-like, splayed
//                outward. No true pelvic fins visible.
//
//   Markings   : THE defining fish for psychedelic pattern.
//                Electric blue body covered in a dense orange/red
//                maze pattern — irregular closed cells like a
//                topographic map or stained glass. No two cells
//                are the same size. The dorsal fin is the same
//                pattern but the cells are more elongated. Tail
//                fin: blue with orange spots/cells. Pectorals:
//                translucent blue-green with orange dots.
//                The blue is NOT a uniform colour — it grades
//                from deep cobalt in shadows to electric cyan
//                on highlights.
//
//   Palette    : base blue    #0a4ab8 (deep cobalt)
//                blue mid     #1260d8 (electric blue)
//                blue hi      #20a0f0 (cyan highlight)
//                orange maze  #f07010 (vivid orange)
//                orange edge  #e84808 (deep orange outline)
//                orange hi    #ffa040 (highlight orange)
//                green shimmer#20d080 (iridescent sheen)
//                eye          #f8d820 (bright yellow iris)
//
//   Rarity     : epic (highest non-legendary tier)
//                Gold aura halo glows around it.
//
//   Variants   : 'psychedelic' (default) — classic blue+orange
//                'red'   — rare red-phase (red body, blue maze)
//                'ghost' — melanistic near-black with dim pattern
//
//   Shading    : soft top-left radial on body. The maze pattern
//                itself provides most of the visual complexity.
//                Specular glint on top of the pattern (small).
//
// Layer order (back → front):
//   rarity epic aura → selection ring →
//   tail fin → pectoral fins →
//   body fill → maze pattern cells → iridescent sheen →
//   belly glow → dorsal fin → dorsal maze →
//   specular → eye → mouth → juvenile badge
// ============================================================

import React, { memo } from 'react';

const RARITY_AURA = {
  common:    null,
  uncommon:  { color: '#78c8ff', opacity: 0.20, blur: 6  },
  rare:      { color: '#c878ff', opacity: 0.28, blur: 8  },
  epic:      { color: '#ffe040', opacity: 0.45, blur: 12 },
  legendary: { color: '#ff8040', opacity: 0.55, blur: 14 },
};

// ── Colour variants ──────────────────────────────────────────
const VARIANTS = {
  // Classic psychedelic: electric blue body with orange maze
  psychedelic: {
    bodyBase:  '#0a4ab8',
    bodyMid:   '#1260d8',
    bodyHi:    '#20a0f0',
    maze:      '#f07010',
    mazeEdge:  '#e84808',
    mazeHi:    '#ffa040',
    shimmer:   '#20d080',
    tail:      '#1260d8',
    tailSpot:  '#f07010',
    pectoral:  '#1880c8',
    eyeColor:  '#f8d820',
  },
  // Red-phase variant: warm red body with blue maze
  red: {
    bodyBase:  '#a81010',
    bodyMid:   '#d02020',
    bodyHi:    '#f04848',
    maze:      '#1868d8',
    mazeEdge:  '#0848a8',
    mazeHi:    '#60b0ff',
    shimmer:   '#f070c0',
    tail:      '#c02020',
    tailSpot:  '#2060c8',
    pectoral:  '#c03030',
    eyeColor:  '#f8d820',
  },
  // Ghost / melanistic: near-black with dim ghost pattern
  ghost: {
    bodyBase:  '#181818',
    bodyMid:   '#282828',
    bodyHi:    '#404040',
    maze:      '#304840',
    mazeEdge:  '#203028',
    mazeHi:    '#506858',
    shimmer:   '#385048',
    tail:      '#202020',
    tailSpot:  '#304840',
    pectoral:  '#282828',
    eyeColor:  '#8090a8',
  },
};

// Pre-defined maze cells for body (closed irregular polygons)
// These are offsets within a 100x60 viewBox.
// Each cell: array of [x,y] points forming a closed polygon.
// The pattern covers the body ellipse (cx=52, cy=32, rx=30, ry=18).
const MAZE_CELLS = [
  // Upper cluster
  [[42,20],[50,19],[54,23],[50,26],[44,25]],
  [[54,19],[62,18],[66,23],[60,26],[54,23]],
  [[44,25],[50,26],[52,31],[46,32],[41,28]],
  [[50,26],[60,26],[62,31],[54,31],[52,31]],
  [[60,26],[66,23],[70,27],[66,32],[62,31]],
  // Middle band
  [[38,29],[44,28],[46,34],[40,35],[36,32]],
  [[46,32],[54,31],[56,36],[48,37],[44,34]],
  [[54,31],[62,31],[64,36],[56,36]],
  [[62,31],[68,30],[72,34],[66,38],[64,36]],
  // Lower cluster
  [[40,35],[46,34],[48,39],[42,40],[38,37]],
  [[48,37],[56,36],[58,41],[50,42],[46,39]],
  [[56,36],[64,36],[66,40],[58,41]],
  [[64,36],[70,36],[72,40],[66,40]],
  // Tail-ward small cells
  [[42,40],[50,40],[50,44],[44,44]],
  [[50,42],[58,41],[58,44],[51,44]],
  // Head-side small cells
  [[68,22],[74,23],[76,28],[70,29],[66,25]],
  [[70,29],[76,28],[78,33],[72,35],[68,32]],
];

// Maze cells for dorsal fin (elongated, narrower cells)
const DORSAL_CELLS = [
  [[48,10],[54,9],[56,14],[50,15]],
  [[54,9],[60,8],[62,13],[56,14]],
  [[60,8],[66,9],[68,14],[62,13]],
  [[50,15],[56,14],[58,18],[52,18]],
  [[56,14],[62,13],[64,18],[58,18]],
];

function pointsStr(pts) {
  return pts.map(([x, y]) => `${x},${y}`).join(' ');
}

function MandarinDragonetSprite({
  fish,
  size     = 60,
  flipped  = false,
  selected = false,
  onClick,
}) {
  const uid    = (fish?.id || 'md').slice(0, 8);
  const rarity = fish?.species?.rarity || 'epic';
  const aura   = RARITY_AURA[rarity];
  const stage  = fish?.stage || 'adult';

  const variantKey = fish?.colorVariant || fish?.species?.colorVariant || 'psychedelic';
  const V = VARIANTS[variantKey] || VARIANTS.psychedelic;

  // ── Egg: vivid blue-orange speckled oval ─────────────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.55} height={size * 0.65} viewBox="0 0 33 40"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-md-${uid}`} cx="38%" cy="32%" r="58%">
            <stop offset="0%"   stopColor={V.bodyHi}/>
            <stop offset="55%"  stopColor={V.bodyMid}/>
            <stop offset="100%" stopColor={V.bodyBase}/>
          </radialGradient>
          <filter id={`egg-md-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.40"/>
          </filter>
        </defs>
        <ellipse cx="16" cy="24" rx="10" ry="14"
          fill={`url(#egg-md-${uid})`}
          filter={`url(#egg-md-sh-${uid})`}/>
        {/* Orange speckles */}
        {[[10,20],[18,17],[14,28],[20,25],[12,14]].map(([sx,sy],i) => (
          <circle key={i} cx={sx} cy={sy} r="1.5" fill={V.maze} opacity="0.65"/>
        ))}
        <ellipse cx="11" cy="17" rx="3" ry="3.5" fill={V.bodyHi} opacity="0.40"/>
      </svg>
    );
  }

  // ── Juvenile: same design, smaller fins, less intense pattern
  const isJuvenile   = stage === 'juvenile';
  const mazeOpacity  = isJuvenile ? 0.45 : 0.90;
  const bodyOpacity  = isJuvenile ? 0.88 : 1.00;
  const dorsalOpacity= isJuvenile ? 0.50 : 0.85;
  const ds           = isJuvenile ? 0.55 : 1.00;  // dorsal scale

  const W = size;
  const H = size * 0.72;

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
        <filter id={`md-sh-${uid}`} x="-30%" y="-35%" width="160%" height="200%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#050a20" floodOpacity="0.55"/>
        </filter>

        {/* ── Rarity aura (epic gold) ── */}
        {aura && (
          <filter id={`md-aura-${uid}`} x="-60%" y="-50%" width="220%" height="210%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip ── */}
        <clipPath id={`md-body-clip-${uid}`}>
          <ellipse cx="52" cy="36" rx="30" ry="18"/>
        </clipPath>

        {/* ── Dorsal clip ── */}
        <clipPath id={`md-dorsal-clip-${uid}`}>
          <path d={`
            M 48 ${20 - 12*ds}
            C 50 ${6 - 4*ds}, 58 ${4 - 4*ds}, 66 ${6 - 4*ds}
            C 70 ${8 - 2*ds}, 70 ${14 - 2*ds}, 68 ${18 - 2*ds}
            C 64 20, 54 20, 48 20
            Z
          `}/>
        </clipPath>

        {/* ── Body gradient ── */}
        <radialGradient id={`md-body-${uid}`} cx="35%" cy="28%" r="70%">
          <stop offset="0%"   stopColor={V.bodyHi}/>
          <stop offset="45%"  stopColor={V.bodyMid}/>
          <stop offset="100%" stopColor={V.bodyBase}/>
        </radialGradient>

        {/* ── Belly glow ── */}
        <radialGradient id={`md-belly-${uid}`} cx="50%" cy="90%" r="50%">
          <stop offset="0%"   stopColor={V.bodyHi} stopOpacity="0.50"/>
          <stop offset="100%" stopColor={V.bodyHi} stopOpacity="0"/>
        </radialGradient>

        {/* ── Iridescent shimmer ── */}
        <linearGradient id={`md-shimmer-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={V.shimmer} stopOpacity="0"/>
          <stop offset="45%"  stopColor={V.shimmer} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={V.shimmer} stopOpacity="0"/>
        </linearGradient>

        {/* ── Tail fin gradient ── */}
        <linearGradient id={`md-tail-${uid}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor={V.tail} stopOpacity="0.90"/>
          <stop offset="100%" stopColor={V.tail} stopOpacity="0.40"/>
        </linearGradient>

        {/* ── Pectoral gradient ── */}
        <radialGradient id={`md-pect-${uid}`} cx="20%" cy="20%" r="80%">
          <stop offset="0%"   stopColor={V.bodyHi}   stopOpacity="0.85"/>
          <stop offset="100%" stopColor={V.pectoral} stopOpacity="0.30"/>
        </radialGradient>

        {/* ── Specular ── */}
        <radialGradient id={`md-spec-${uid}`} cx="32%" cy="26%" r="25%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.80"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin glow filter ── */}
        <filter id={`md-finglow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feFlood floodColor={V.bodyHi} floodOpacity="0.40" result="colour"/>
          <feComposite in="colour" in2="blur" operator="in" result="glowColour"/>
          <feMerge><feMergeNode in="glowColour"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>

        {/* ── Epic glow filter for overall sprite ── */}
        <filter id={`md-epic-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feFlood floodColor={aura?.color || '#ffe040'} floodOpacity="0.25" result="colour"/>
          <feComposite in="colour" in2="blur" operator="in" result="glow"/>
          <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Epic aura halo ── */}
      {aura && (
        <ellipse cx="52" cy="36" rx="38" ry="28"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#md-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="52" cy="36" rx="40" ry="30"
          fill="none" stroke="#fff" strokeWidth="2" opacity="0.65"/>
      )}

      {/* ══════════════════════════════════════════
          TAIL FIN — squared-off fan
          ══════════════════════════════════════════ */}
      <path
        className="fish-tail"
        d={`
          M 22 30
          C 10 26, 6 30, 8 36
          C 10 42, 14 44, 22 42
          Z
        `}
        fill={`url(#md-tail-${uid})`}
        opacity="0.82"
        filter={`url(#md-finglow-${uid})`}
      />
      {/* Tail orange spots */}
      {[[12,30],[10,36],[14,42],[9,33],[13,39]].map(([sx,sy],i) => (
        <circle key={i} cx={sx} cy={sy} r="1.8"
          fill={V.tailSpot} opacity={mazeOpacity * 0.75}/>
      ))}
      {/* Tail rays */}
      {[28,32,36,40].map((y,i) => (
        <line key={i} x1="22" y1={y} x2="8" y2={y + (y-36)*0.3}
          stroke={V.bodyHi} strokeWidth="0.6" opacity="0.30"/>
      ))}

      {/* ══════════════════════════════════════════
          PECTORAL FINS — large wing-like fans
          ══════════════════════════════════════════ */}
      {/* Main pectoral */}
      <path
        className="fish-fin"
        d={`
          M 68 38
          C 74 42, 80 48, 78 54
          C 74 56, 68 52, 66 46
          Z
        `}
        fill={`url(#md-pect-${uid})`}
        opacity="0.72"
        filter={`url(#md-finglow-${uid})`}
      />
      {/* Pectoral dots */}
      {[[73,45],[76,50],[70,48]].map(([sx,sy],i) => (
        <circle key={i} cx={sx} cy={sy} r="1.5"
          fill={V.maze} opacity={mazeOpacity * 0.55}/>
      ))}

      {/* ══════════════════════════════════════════
          BODY
          Ellipse cx=52, cy=36, rx=30, ry=18
          ══════════════════════════════════════════ */}
      <ellipse cx="52" cy="36" rx="30" ry="18"
        fill={`url(#md-body-${uid})`}
        filter={`url(#md-sh-${uid})`}
        opacity={bodyOpacity}
      />

      {/* ── Maze pattern cells on body ── */}
      {MAZE_CELLS.map((pts, i) => (
        <polygon key={i}
          points={pointsStr(pts)}
          fill={V.maze}
          stroke={V.mazeEdge}
          strokeWidth="0.8"
          clipPath={`url(#md-body-clip-${uid})`}
          opacity={mazeOpacity}
        />
      ))}

      {/* ── Iridescent shimmer overlay ── */}
      <ellipse cx="52" cy="32" rx="28" ry="14"
        fill={`url(#md-shimmer-${uid})`}
        clipPath={`url(#md-body-clip-${uid})`}
        opacity="0.60"
      />

      {/* ── Belly glow ── */}
      <ellipse cx="52" cy="50" rx="22" ry="12"
        fill={`url(#md-belly-${uid})`}
        clipPath={`url(#md-body-clip-${uid})`}
      />

      {/* ══════════════════════════════════════════
          DORSAL FIN — large fan, THE signature feature
          ══════════════════════════════════════════ */}
      <path
        className="fish-dorsal"
        d={`
          M 48 20
          C 50 ${8 - 4*ds}, 58 ${4 - 4*ds}, 66 ${6 - 2*ds}
          C 70 ${8 - 2*ds}, 70 ${14 - 2*ds}, 68 18
          C 64 20, 54 20, 48 20
          Z
        `}
        fill={V.bodyMid}
        opacity={dorsalOpacity}
        filter={`url(#md-finglow-${uid})`}
      />
      {/* Dorsal maze cells */}
      {DORSAL_CELLS.map((pts, i) => (
        <polygon key={i}
          points={pointsStr(pts)}
          fill={V.maze}
          stroke={V.mazeEdge}
          strokeWidth="0.7"
          clipPath={`url(#md-dorsal-clip-${uid})`}
          opacity={mazeOpacity * 0.85}
        />
      ))}
      {/* Dorsal rays */}
      {[48,54,60,66].map((x,i) => (
        <line key={i} x1={x} y1="20" x2={x + 2} y2={10 - 2*ds}
          stroke={V.bodyHi} strokeWidth="0.6" opacity="0.35"/>
      ))}

      {/* ── Specular wet-look ── */}
      <ellipse cx="65" cy="29" rx="7" ry="4"
        fill={`url(#md-spec-${uid})`}
        clipPath={`url(#md-body-clip-${uid})`}
      />
      <circle cx="68" cy="27" r="2"
        fill="#ffffff" opacity="0.50"
        clipPath={`url(#md-body-clip-${uid})`}
      />

      {/* ── Eye — bright yellow iris (characteristic) ── */}
      <circle cx="78" cy="34" r="4.5" fill="#f0e8d0"/>
      <circle cx="78" cy="34" r="3.5" fill={V.eyeColor}/>
      <circle cx="78" cy="34" r="2.2" fill="#0a0808"/>
      <circle cx="79.2" cy="32.8" r="1.0" fill="#ffffff" opacity="0.90"/>
      {/* Secondary glint */}
      <circle cx="76.8" cy="35.2" r="0.5" fill="#ffffff" opacity="0.42"/>

      {/* ── Mouth (downturned froggy mouth) ── */}
      <path d="M 81 37 Q 82.5 38 82 36.5" fill="none"
        stroke={V.bodyBase} strokeWidth="1.0" strokeLinecap="round"/>

      {/* ── Juvenile badge ── */}
      {isJuvenile && (
        <text x="50%" y="66" textAnchor="middle" fontSize="5"
          fill={V.bodyHi} opacity="0.72" fontFamily="sans-serif">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(MandarinDragonetSprite, (prev, next) =>
  prev.size      === next.size      &&
  prev.flipped   === next.flipped   &&
  prev.selected  === next.selected  &&
  prev.fish?.id  === next.fish?.id  &&
  prev.fish?.stage === next.fish?.stage &&
  prev.fish?.colorVariant === next.fish?.colorVariant
);
