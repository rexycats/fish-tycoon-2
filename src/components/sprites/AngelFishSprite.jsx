// ============================================================
// FISH TYCOON — AngelFishSprite (Phase 12)
// ============================================================
// Design audit:
//   Body    : extremely laterally compressed, taller than long.
//             Near-equilateral triangle. Silver-white base with
//             warm gold iridescence on forehead/flanks. Cool
//             grey shadows on lower flanks.
//   Markings: 3 bold vertical black bars:
//               1. Eye bar — runs through the eye, widest at mid.
//               2. Mid bar  — body centre, the broadest bar.
//               3. Tail bar — narrow, at tail base.
//             Fine black margin lines on dorsal & anal fin edges.
//   Fins    : Dorsal and anal fins are triangular extensions of
//             the body triangle, each ending in a long soft
//             trailing filament. Lyre tail — short, slightly
//             forked, with fine top/bottom ray filaments.
//             Pectorals: narrow, near-translucent.
//   Shading : top-left light source. Belly scatter (warm silver).
//             Dorsal shadow. Specular wet-look on body apex.
// Layer order (back → front):
//   rarity aura → selection ring →
//   lyre tail → dorsal fin + filament → anal fin + filament →
//   pectoral fins →
//   body fill → black bars (clipped) → gold iridescence →
//   belly scatter → dorsal shadow → scale texture → specular →
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

function AngelFishSprite({
  fish,
  size     = 60,
  flipped  = false,
  selected = false,
  onClick,
}) {
  const uid    = (fish?.id || 'af').slice(0, 8);
  const rarity = fish?.species?.rarity || 'uncommon';
  const aura   = RARITY_AURA[rarity];
  const stage  = fish?.stage || 'adult';

  // ── Colour variants via CSS hue-shift ────────────────────
  // 'default'  = silver-white with black bars (classic)
  // 'gold'     = golden body, dark amber bars
  // 'marble'   = desaturated with faint grey pattern
  // 'smoky'    = dark charcoal body (black angel variant)
  const variantKey = fish?.colorVariant || 'default';
  const variantStyle = (() => {
    switch (variantKey) {
      case 'gold':   return { filter: 'sepia(0.6) saturate(1.8) brightness(1.1)' };
      case 'marble': return { filter: 'saturate(0.25) contrast(1.15)' };
      case 'smoky':  return { filter: 'saturate(0.12) brightness(0.40)' };
      default:       return {};
    }
  })();

  // Angelfish viewBox: 90 wide × 120 tall — taller than wide.
  // Extra 10px headroom (5 top, 5 bottom) prevents dorsal/anal filament tips
  // from sitting exactly on the viewBox edge and getting subpixel-clipped.
  // W/H ratio reflects that — fish appears tall and narrow.
  const W = size * 0.82;
  const H = size * 1.20;

  // ── Egg: small silver oval with faint gold glint ──────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.48} height={size * 0.58} viewBox="0 0 28 34"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-af-${uid}`} cx="36%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#e8f2f8"/>
            <stop offset="50%"  stopColor="#b8ccd8"/>
            <stop offset="100%" stopColor="#7890a0"/>
          </radialGradient>
          <filter id={`egg-af-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.32"/>
          </filter>
        </defs>
        <ellipse cx="14" cy="23" rx="8" ry="11"
          fill={`url(#egg-af-${uid})`}
          filter={`url(#egg-af-sh-${uid})`}/>
        {/* Gold iridescent glint */}
        <ellipse cx="10" cy="17" rx="3" ry="3.5" fill="#d4c070" opacity="0.30"/>
        <ellipse cx="17" cy="28" rx="2" ry="2.5" fill="#506070" opacity="0.20"/>
      </svg>
    );
  }

  // ── Juvenile: 1 bar (eye bar only), shorter filaments ─────
  const isJuvenile     = stage === 'juvenile';
  const barCount       = isJuvenile ? 1 : 3;
  const filamentScale  = isJuvenile ? 0.50 : 1.00;
  const bodyOpacity    = isJuvenile ? 0.82 : 1.00;
  const finOpacity     = isJuvenile ? 0.60 : 0.88;
  const fs             = filamentScale;

  // ── Core geometry ─────────────────────────────────────────
  // viewBox: 0 0 90 110
  // Body ellipse: cx=46, cy=55, rx=20, ry=28  (taller than wide)
  // Head (right side): x≈66, mouth at x≈72
  // Tail (left side):  x≈26
  // Top of body: y≈27, bottom: y≈83
  // Dorsal fin rises above y=27; anal fin descends below y=83

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 90 120"
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
        <filter id={`af-sh-${uid}`} x="-30%" y="-25%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#101820" floodOpacity="0.50"/>
        </filter>

        {/* ── Rarity aura glow ── */}
        {aura && (
          <filter id={`af-aura-${uid}`} x="-50%" y="-40%" width="200%" height="180%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip — tall ellipse (shifted down 5px from original) ── */}
        <clipPath id={`af-body-clip-${uid}`}>
          <ellipse cx="46" cy="65" rx="20" ry="28"/>
        </clipPath>

        {/* ── Body gradient: silver-white, top-left light ── */}
        <radialGradient id={`af-body-${uid}`} cx="35%" cy="28%" r="68%">
          <stop offset="0%"   stopColor="#eaf4f8"/>
          <stop offset="38%"  stopColor="#c8dce8"/>
          <stop offset="100%" stopColor="#7090a8"/>
        </radialGradient>

        {/* ── Gold iridescence (forehead + upper flank) ── */}
        <radialGradient id={`af-gold-${uid}`} cx="62%" cy="25%" r="55%">
          <stop offset="0%"   stopColor="#d4c070" stopOpacity="0.38"/>
          <stop offset="60%"  stopColor="#c8b050" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#d4c070" stopOpacity="0"/>
        </radialGradient>

        {/* ── Belly / lower scatter ── */}
        <radialGradient id={`af-belly-${uid}`} cx="50%" cy="82%" r="55%">
          <stop offset="0%"   stopColor="#d8eef8" stopOpacity="0.30"/>
          <stop offset="100%" stopColor="#c8dce8" stopOpacity="0"/>
        </radialGradient>

        {/* ── Dorsal shadow ── */}
        <radialGradient id={`af-dorsal-${uid}`} cx="50%" cy="0%" r="60%">
          <stop offset="0%"   stopColor="#203040" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#203040" stopOpacity="0"/>
        </radialGradient>

        {/* ── Specular ── */}
        <radialGradient id={`af-spec-${uid}`} cx="34%" cy="26%" r="30%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.82"/>
          <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient (translucent silver) ── */}
        <linearGradient id={`af-fin-${uid}`} x1="0.5" y1="5" x2="0.5" y2="6">
          <stop offset="0%"   stopColor="#c0d8e8" stopOpacity="0.80"/>
          <stop offset="100%" stopColor="#8090a0" stopOpacity="0.20"/>
        </linearGradient>

        {/* ── Dorsal fin gradient (top to bottom) ── */}
        <linearGradient id={`af-dfin-${uid}`} x1="0.5" y1="5" x2="0.5" y2="6">
          <stop offset="0%"   stopColor="#a0b8c8" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#c0d8e8" stopOpacity="0.85"/>
        </linearGradient>

        {/* ── Anal fin gradient (bottom to top) ── */}
        <linearGradient id={`af-anlfin-${uid}`} x1="0.5" y1="6" x2="0.5" y2="5">
          <stop offset="0%"   stopColor="#a0b8c8" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#c0d8e8" stopOpacity="0.85"/>
        </linearGradient>

        {/* ── Tail fin gradient ── */}
        <linearGradient id={`af-tail-${uid}`} x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0%"   stopColor="#b0c8d8" stopOpacity="0.85"/>
          <stop offset="100%" stopColor="#6080a0" stopOpacity="0.30"/>
        </linearGradient>

        {/* ── Pectoral fin gradient ── */}
        <radialGradient id={`af-pec-${uid}`} cx="70%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#d8ecf8" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#8090a8" stopOpacity="0.15"/>
        </radialGradient>

        {/* ── Scale texture ── */}
        <pattern id={`af-scale-${uid}`} x="0" y="5" width="6" height="7" patternUnits="userSpaceOnUse">
          <ellipse cx="3" cy="3.5" rx="2.5" ry="3" fill="none"
            stroke="#7090a8" strokeWidth="0.32" opacity="0.18"/>
        </pattern>
      </defs>

      {/* ── Rarity aura ── */}
      {aura && (
        <ellipse cx="46" cy="60" rx="30" ry="40"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#af-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="46" cy="60" rx="31" ry="41"
          fill="none" stroke="#ffe040" strokeWidth="2.2" opacity="0.85"/>
      )}

      {/* ════ LYRE TAIL FIN ════ */}
      {/* Short, slightly forked — centred on x≈26, y=55 (left body edge) */}
      {/* Top ray arcs up-left, bottom ray arcs down-left */}
      {/* Top lobe */}
      <path className="fish-tail" d={`
        M 26 57
        C 18 51, 10 45, ${8 - 4*fs} ${43 - 8*fs}
        C ${10 - 2*fs} ${41 - 6*fs}, 16 47, 24 55
        Z
      `}
        fill={`url(#af-tail-${uid})`}
        opacity={finOpacity}
        filter={`url(#af-sh-${uid})`}/>
      {/* Bottom lobe */}
      <path className="fish-tail" d={`
        M 26 63
        C 18 69, 10 75, ${8 - 4*fs} ${77 + 8*fs}
        C ${10 - 2*fs} ${79 + 6*fs}, 16 73, 24 65
        Z
      `}
        fill={`url(#af-tail-${uid})`}
        opacity={finOpacity}/>
      {/* Tail fin rays */}
      {[
        [26, 57, 8 - 4*fs, 43 - 8*fs],
        [26, 60, 7 - 3*fs, 60],
        [26, 63, 8 - 4*fs, 77 + 8*fs],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#506070" strokeWidth="0.5" opacity={0.28 * finOpacity}/>
      ))}

      {/* ════ DORSAL FIN + FILAMENT ════ */}
      {/* Rises as a curved triangle above the body apex (body top ≈ y=27).
          Fan from x=35–62, peak at x=50,y=8, then narrows to a filament
          trailing back to approximately x=20, y=4*fs */}
      <path className="fish-dorsal" d={`
        M 35 32
        C 34 23, 38 15, 50 12
        C 58 10, 64 15, 65 23
        C 64 27, 62 32, 62 32
        Z
      `}
        fill={`url(#af-dfin-${uid})`}
        opacity={finOpacity}/>
      {/* Dorsal filament — trailing tip extends back-left */}
      <path d={`
        M 35 32
        C 32 25, 28 19, ${24 - 10*fs} ${13 - 8*fs}
      `}
        fill="none"
        stroke="#8090a0"
        strokeWidth={1.0}
        strokeLinecap="round"
        opacity={0.60 * finOpacity}/>
      {/* Dorsal fin rays */}
      {[
        [40, 32, 38, 17],
        [48, 32, 48, 12],
        [56, 32, 58, 16],
        [62, 32, 64, 23],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#6080a0" strokeWidth="0.5" opacity={0.25 * finOpacity}/>
      ))}
      {/* Black margin line on dorsal outer edge */}
      <path d="M 35 32 C 34 23, 38 15, 50 12 C 58 10, 64 15, 65 23"
        fill="none" stroke="#141820" strokeWidth="0.8"
        opacity={0.45 * finOpacity}/>

      {/* ════ ANAL FIN + FILAMENT ════ */}
      {/* Mirror of dorsal below the body base (body bottom ≈ y=83) */}
      <path className="fish-fin" d={`
        M 35 88
        C 34 97, 38 105, 50 108
        C 58 110, 64 105, 65 97
        C 64 93, 62 88, 62 88
        Z
      `}
        fill={`url(#af-anlfin-${uid})`}
        opacity={finOpacity}/>
      {/* Anal filament */}
      <path d={`
        M 35 88
        C 32 95, 28 101, ${24 - 10*fs} ${107 + 8*fs}
      `}
        fill="none"
        stroke="#8090a0"
        strokeWidth={1.0}
        strokeLinecap="round"
        opacity={0.60 * finOpacity}/>
      {/* Anal fin rays */}
      {[
        [40, 88, 38, 103],
        [48, 88, 48, 108],
        [56, 88, 58, 104],
        [62, 88, 64, 97],
      ].map(([x1,y1,x2,y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#6080a0" strokeWidth="0.5" opacity={0.25 * finOpacity}/>
      ))}
      {/* Black margin line on anal outer edge */}
      <path d="M 35 88 C 34 97, 38 105, 50 108 C 58 110, 64 105, 65 97"
        fill="none" stroke="#141820" strokeWidth="0.8"
        opacity={0.45 * finOpacity}/>

      {/* ════ PECTORAL FINS ════ */}
      {/* Narrow translucent fins from behind the gill plate */}
      <path className="fish-fin" d={`
        M 66 57
        C 70 61, 72 67, 70 73
        C 68 69, 66 63, 66 57
        Z
      `}
        fill={`url(#af-pec-${uid})`}
        opacity={finOpacity * 0.75}/>
      {/* Pectoral rays */}
      {[[66,57,70,71],[66,57,68,73]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#6080a0" strokeWidth="0.4" opacity={0.20 * finOpacity}/>
      ))}

      {/* ════ BODY ════ */}
      {/* Tall ellipse — taller than wide */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-body-${uid})`}
        opacity={bodyOpacity}
        filter={`url(#af-sh-${uid})`}/>

      {/* ════ BLACK VERTICAL BARS (clipped to body) ════ */}
      <g clipPath={`url(#af-body-clip-${uid})`}>

        {/* Bar 1 — Eye bar. Runs through the eye (~x=64), tilted slightly */}
        {/* Width ~6px, centred on x=62 */}
        <rect x="59" y="32" width="7" height="56" fill="#141820" opacity="0.88"/>

        {/* Bar 2 — Mid bar. Widest, at body centre (~x=46) */}
        {barCount >= 2 && (
          <rect x="42" y="32" width="9" height="56" fill="#141820" opacity="0.82"/>
        )}

        {/* Bar 3 — Tail bar. Narrowest, near tail base (~x=28) */}
        {barCount >= 3 && (
          <rect x="25" y="32" width="6" height="56" fill="#141820" opacity="0.72"/>
        )}
      </g>

      {/* ════ GOLD IRIDESCENCE ════ */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-gold-${uid})`}
        opacity={bodyOpacity}
        clipPath={`url(#af-body-clip-${uid})`}/>

      {/* ════ BELLY SCATTER ════ */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-belly-${uid})`}/>

      {/* ════ DORSAL SHADOW ════ */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-dorsal-${uid})`}/>

      {/* ════ SCALE TEXTURE ════ */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-scale-${uid})`} opacity="0.50"
        clipPath={`url(#af-body-clip-${uid})`}/>

      {/* ════ SPECULAR ════ */}
      <ellipse cx="46" cy="60" rx="20" ry="28"
        fill={`url(#af-spec-${uid})`}/>

      {/* ════ EYE ════ */}
      {/* Sits high on the head side — x≈65, y≈46 */}
      <circle cx="65" cy="51" r="5.0" fill="#141820"/>
      <circle cx="65" cy="51" r="3.6" fill="#202830"/>
      <circle cx="65" cy="51" r="2.4" fill="#0a0e14"/>
      {/* Primary glint */}
      <circle cx="63.6" cy="44.6" r="1.1" fill="#ffffff" opacity="0.92"/>
      {/* Secondary glint */}
      <circle cx="66.4" cy="47.4" r="0.5" fill="#ffffff" opacity="0.42"/>
      {/* Gold eye ring — angelfish characteristic */}
      <circle cx="65" cy="51" r="5.0" fill="none"
        stroke="#c8b050" strokeWidth="0.7" opacity="0.45"/>

      {/* ════ MOUTH ════ */}
      {/* Small, slightly upturned */}
      <path d="M 72 55 Q 74.5 53.5, 73 52"
        fill="none" stroke="#141820" strokeWidth="1.0"
        strokeLinecap="round" opacity="0.65"/>

      {/* ════ LATERAL LINE ════ */}
      <path d="M 28 59 Q 46 55, 64 57"
        fill="none" stroke="#d0e8f0" strokeWidth="0.45" opacity="0.20"/>

      {/* ════ JUVENILE BADGE ════ */}
      {isJuvenile && (
        <text x="46" y="113" textAnchor="middle"
          fontSize="5" fill="#8090a8" opacity="0.75"
          fontFamily="sans-serif" fontWeight="bold">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(AngelFishSprite, (prev, next) =>
  prev.fish?.id           === next.fish?.id           &&
  prev.fish?.stage        === next.fish?.stage        &&
  prev.fish?.health       === next.fish?.health       &&
  prev.fish?.disease      === next.fish?.disease      &&
  prev.fish?.colorVariant === next.fish?.colorVariant &&
  prev.selected           === next.selected           &&
  prev.size               === next.size               &&
  prev.flipped            === next.flipped
);
