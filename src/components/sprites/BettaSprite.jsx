// ============================================================
// FISH TYCOON — BettaSprite (Phase 12)
// ============================================================
// Design audit:
//   Body    : slender torpedo — longer than tall. Deep crimson
//             with teal iridescent scale sheen. Upturned mouth.
//   Fins    : the defining feature. All fins are long, flowing,
//             veil-tail style with fine filament tips.
//             - Veil tail : deeply forked, wide fan, lobes taper
//               to filaments. Same red as body, darkening to
//               near-black at tips. Semi-transparent.
//             - Dorsal    : tall sail rising from mid-back.
//             - Anal      : long, runs full belly length.
//             - Pectorals : long draping feathers.
//             All fins have fine rays and translucent membranes.
//   Markings: iridescent teal (#20c8b0) shimmer on body scales
//             at ~30% opacity — no bars, colour IS the marking.
//             Gill plate teal flash patch. Teal eye ring.
//             Fin edges carry darker banding (translucency cue).
//   Shading : top-left light source. Belly subsurface scatter
//             (lighter red). Dorsal shadow band. Specular wet-look.
// Layer order (back → front):
//   rarity aura → selection ring →
//   veil tail lobes → anal fin → dorsal fin → pectoral fins →
//   body fill → iridescent sheen → gill flash → belly glow →
//   dorsal shadow → scale texture → specular →
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

function BettaSprite({
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

  // Betta is wider than tall — viewBox 110 × 80, body takes ~60% of height
  const W = size;
  const H = size * 0.73;

  // ── Egg: small deep-red oval with teal tint ───────────────
  if (stage === 'egg') {
    return (
      <svg width={size * 0.5} height={size * 0.6} viewBox="0 0 30 36"
        onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
        <defs>
          <radialGradient id={`egg-betta-${uid}`} cx="36%" cy="30%" r="60%">
            <stop offset="0%"   stopColor="#d44040"/>
            <stop offset="50%"  stopColor="#8c1a1a"/>
            <stop offset="100%" stopColor="#3a0808"/>
          </radialGradient>
          <filter id={`egg-betta-sh-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.40"/>
          </filter>
        </defs>
        <ellipse cx="15" cy="19" rx="9" ry="12"
          fill={`url(#egg-betta-${uid})`}
          filter={`url(#egg-betta-sh-${uid})`}/>
        {/* Teal iridescent glint */}
        <ellipse cx="11" cy="13" rx="3" ry="3.5" fill="#20c8b0" opacity="0.28"/>
        <ellipse cx="17" cy="24" rx="2" ry="2.2" fill="#200808" opacity="0.25"/>
      </svg>
    );
  }

  // ── Juvenile: shorter fins, paler, less iridescence ───────
  const isJuvenile     = stage === 'juvenile';
  const finOpacity     = isJuvenile ? 0.55 : 0.88;
  const bodyOpacity    = isJuvenile ? 0.82 : 1.00;
  const iridOpacity    = isJuvenile ? 0.15 : 0.32;
  // Juvenile fins are shorter — scale the fin path control points
  const finScale       = isJuvenile ? 0.65 : 1.00;

  // Helper: scale fin extension distance from body edge
  // Betta body centre: cx=55, cy=40. Right side (tail) at ~x=20, left (head) at ~x=88
  // Fin tips extend toward low x (tail side) and above/below body
  const fs = finScale;

  return (
    <svg
      width={W} height={H}
      viewBox="0 0 110 80"
      onClick={onClick}
      style={{
        cursor:    onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow:  'visible',
      }}
    >
      <defs>
        {/* ── Drop shadow ── */}
        <filter id={`betta-sh-${uid}`} x="-30%" y="-40%" width="160%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1a0408" floodOpacity="0.55"/>
        </filter>

        {/* ── Rarity aura glow ── */}
        {aura && (
          <filter id={`betta-aura-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={aura.blur}/>
          </filter>
        )}

        {/* ── Body clip ── */}
        {/* Betta body: slender torpedo. cx=55,cy=40, rx=33,ry=14 */}
        <clipPath id={`betta-body-clip-${uid}`}>
          <ellipse cx="55" cy="40" rx="33" ry="14"/>
        </clipPath>

        {/* ── Body gradient: crimson, top-left light ── */}
        <radialGradient id={`betta-body-${uid}`} cx="30%" cy="28%" r="65%">
          <stop offset="0%"   stopColor="#d44040"/>
          <stop offset="45%"  stopColor="#8c1a1a"/>
          <stop offset="100%" stopColor="#3a0808"/>
        </radialGradient>

        {/* ── Belly subsurface scatter ── */}
        <radialGradient id={`betta-belly-${uid}`} cx="50%" cy="85%" r="55%">
          <stop offset="0%"   stopColor="#e06060" stopOpacity="0.28"/>
          <stop offset="100%" stopColor="#8c1a1a" stopOpacity="0"/>
        </radialGradient>

        {/* ── Dorsal shadow band ── */}
        <radialGradient id={`betta-dorsal-${uid}`} cx="50%" cy="0%" r="55%">
          <stop offset="0%"   stopColor="#1a0408" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#1a0408" stopOpacity="0"/>
        </radialGradient>

        {/* ── Specular highlight ── */}
        <radialGradient id={`betta-spec-${uid}`} cx="28%" cy="24%" r="28%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.70"/>
          <stop offset="55%"  stopColor="#ffffff" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
        </radialGradient>

        {/* ── Iridescent teal sheen ── */}
        <radialGradient id={`betta-irid-${uid}`} cx="38%" cy="35%" r="60%">
          <stop offset="0%"   stopColor="#20c8b0" stopOpacity="0.45"/>
          <stop offset="55%"  stopColor="#10a898" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="#20c8b0" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient: crimson → near-black at tips ── */}
        <linearGradient id={`betta-fin-${uid}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%"   stopColor="#3a0808" stopOpacity="0.85"/>
          <stop offset="50%"  stopColor="#7a1010" stopOpacity="0.75"/>
          <stop offset="100%" stopColor="#c02828" stopOpacity="0.60"/>
        </linearGradient>

        {/* ── Veil tail lobe gradient (top lobe) ── */}
        <linearGradient id={`betta-tail-top-${uid}`} x1="1" y1="1" x2="0" y2="0">
          <stop offset="0%"   stopColor="#3a0808" stopOpacity="0.90"/>
          <stop offset="60%"  stopColor="#8c1a1a" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#c83030" stopOpacity="0.50"/>
        </linearGradient>

        {/* ── Veil tail lobe gradient (bottom lobe) ── */}
        <linearGradient id={`betta-tail-bot-${uid}`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3a0808" stopOpacity="0.90"/>
          <stop offset="60%"  stopColor="#8c1a1a" stopOpacity="0.72"/>
          <stop offset="100%" stopColor="#c83030" stopOpacity="0.50"/>
        </linearGradient>

        {/* ── Pectoral fin gradient ── */}
        <radialGradient id={`betta-pec-${uid}`} cx="80%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#c83030" stopOpacity="0.65"/>
          <stop offset="100%" stopColor="#3a0808" stopOpacity="0.20"/>
        </radialGradient>

        {/* ── Scale texture ── */}
        <pattern id={`betta-scale-${uid}`} x="0" y="0" width="6" height="5" patternUnits="userSpaceOnUse">
          <ellipse cx="3" cy="2.5" rx="2.6" ry="1.9" fill="none"
            stroke="#5a0808" strokeWidth="0.30" opacity="0.20"/>
        </pattern>
      </defs>

      {/* ── Rarity aura (behind everything) ── */}
      {aura && (
        <ellipse cx="55" cy="40" rx="42" ry="32"
          fill={aura.color} opacity={aura.opacity}
          filter={`url(#betta-aura-${uid})`}/>
      )}

      {/* ── Selection ring ── */}
      {selected && (
        <ellipse cx="55" cy="40" rx="44" ry="33"
          fill="none" stroke="#ffe040" strokeWidth="2.2" opacity="0.85"/>
      )}

      {/* ════ VEIL TAIL — TOP LOBE ════ */}
      {/* Flows back-left and upward from the tail junction (~x=22,y=40) */}
      {/* Top lobe sweeps up to a long trailing filament */}
      <path d={`
        M 22 38
        C ${22 - 10*fs} ${38 - 14*fs}, ${22 - 18*fs} ${38 - 26*fs}, ${22 - 20*fs} ${38 - 36*fs}
        C ${22 - 18*fs} ${38 - 40*fs}, ${22 - 14*fs} ${38 - 38*fs}, ${22 - 10*fs} ${38 - 30*fs}
        C ${22 - 4*fs}  ${38 - 20*fs}, 20 ${38 - 8*fs},  22 38
        Z
      `}
        fill={`url(#betta-tail-top-${uid})`}
        opacity={finOpacity}
        filter={`url(#betta-sh-${uid})`}/>
      {/* Top lobe fin rays */}
      {[0.15, 0.40, 0.65, 0.88].map((t, i) => {
        const tipX = 22 - (20 - t * 10) * fs;
        const tipY = 38 - (36 - t * 6)  * fs;
        return (
          <line key={i} x1={22} y1={38} x2={tipX} y2={tipY}
            stroke="#5a0808" strokeWidth="0.5" opacity={0.28 * finOpacity}/>
        );
      })}

      {/* ════ VEIL TAIL — BOTTOM LOBE ════ */}
      {/* Mirror: sweeps down to a long trailing filament */}
      <path d={`
        M 22 42
        C ${22 - 10*fs} ${42 + 14*fs}, ${22 - 18*fs} ${42 + 26*fs}, ${22 - 20*fs} ${42 + 36*fs}
        C ${22 - 18*fs} ${42 + 40*fs}, ${22 - 14*fs} ${42 + 38*fs}, ${22 - 10*fs} ${42 + 30*fs}
        C ${22 - 4*fs}  ${42 + 20*fs}, 20 ${42 + 8*fs},  22 42
        Z
      `}
        fill={`url(#betta-tail-bot-${uid})`}
        opacity={finOpacity}/>
      {/* Bottom lobe fin rays */}
      {[0.15, 0.40, 0.65, 0.88].map((t, i) => {
        const tipX = 22 - (20 - t * 10) * fs;
        const tipY = 42 + (36 - t * 6)  * fs;
        return (
          <line key={i} x1={22} y1={42} x2={tipX} y2={tipY}
            stroke="#5a0808" strokeWidth="0.5" opacity={0.28 * finOpacity}/>
        );
      })}

      {/* ════ VEIL TAIL — CENTRE FORK ════ */}
      {/* Narrow central lobe connecting the two outer lobes */}
      <path d={`
        M 22 38
        C ${18 - 8*fs} 38, ${18 - 12*fs} 40, ${22 - 12*fs} 40
        C ${22 - 12*fs} 40, ${18 - 8*fs} 42, 22 42
        Z
      `}
        fill="#7a1010" opacity={0.55 * finOpacity}/>

      {/* ════ ANAL FIN (runs full belly, trails back) ════ */}
      <path d={`
        M 30 ${40 + 13}
        C 36 ${40 + 18*fs}, 45 ${40 + 20*fs}, 55 ${40 + 18*fs}
        C 65 ${40 + 16*fs}, 72 ${40 + 12*fs}, 78 ${40 + 8}
        C 68 ${40 + 14}, 54 ${40 + 13}, 30 ${40 + 13}
        Z
      `}
        fill={`url(#betta-fin-${uid})`}
        opacity={finOpacity * 0.85}/>
      {/* Anal fin rays */}
      {[[30,53,32,53+14*fs],[42,53,44,53+17*fs],[54,53,55,53+15*fs],[66,53,67,53+10*fs]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#5a0808" strokeWidth="0.5" opacity={0.25 * finOpacity}/>
      ))}

      {/* ════ DORSAL FIN (tall sail from mid-back) ════ */}
      <path d={`
        M 38 ${40 - 14}
        C 40 ${40 - 14 - 16*fs}, 50 ${40 - 14 - 20*fs}, 60 ${40 - 14 - 16*fs}
        C 68 ${40 - 14 - 12*fs}, 74 ${40 - 14 - 5*fs},  78 ${40 - 14 - 2}
        C 70 ${40 - 14},         54 ${40 - 14},          38 ${40 - 14}
        Z
      `}
        fill={`url(#betta-fin-${uid})`}
        opacity={finOpacity * 0.90}/>
      {/* Dorsal fin rays */}
      {[[38,26,38,26-15*fs],[47,26,47,26-18*fs],[56,26,56,26-17*fs],[65,26,65,26-12*fs],[74,26,75,26-4*fs]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#5a0808" strokeWidth="0.5" opacity={0.25 * finOpacity}/>
      ))}

      {/* ════ PECTORAL FINS (long, draping, from behind gill) ════ */}
      {/* Left (visible) pectoral */}
      <path d={`
        M 78 42
        C 80 ${42 + 10*fs}, 74 ${42 + 18*fs}, 68 ${42 + 20*fs}
        C 72 ${42 + 14*fs}, 76 ${42 + 6*fs},  78 42
        Z
      `}
        fill={`url(#betta-pec-${uid})`}
        opacity={finOpacity * 0.78}/>
      {/* Pectoral rays */}
      {[[78,42,74,42+17*fs],[78,42,70,42+16*fs]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="#5a0808" strokeWidth="0.45" opacity={0.22 * finOpacity}/>
      ))}

      {/* ════ BODY ════ */}
      {/* Slender torpedo: cx=55, cy=40, rx=33, ry=14 */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-body-${uid})`}
        opacity={bodyOpacity}
        filter={`url(#betta-sh-${uid})`}/>

      {/* ════ IRIDESCENT TEAL SHEEN ════ */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-irid-${uid})`}
        opacity={iridOpacity}
        clipPath={`url(#betta-body-clip-${uid})`}/>

      {/* ════ GILL PLATE TEAL FLASH ════ */}
      {/* Small oval behind the eye, giving the characteristic gill flash */}
      <ellipse cx="81" cy="40" rx="5" ry="7"
        fill="#20c8b0" opacity={0.30 * bodyOpacity}
        clipPath={`url(#betta-body-clip-${uid})`}/>

      {/* ════ BELLY SUBSURFACE SCATTER ════ */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-belly-${uid})`}/>

      {/* ════ DORSAL SHADOW BAND ════ */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-dorsal-${uid})`}/>

      {/* ════ SCALE TEXTURE ════ */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-scale-${uid})`} opacity="0.55"
        clipPath={`url(#betta-body-clip-${uid})`}/>

      {/* ════ SPECULAR HIGHLIGHT ════ */}
      <ellipse cx="55" cy="40" rx="33" ry="14"
        fill={`url(#betta-spec-${uid})`}/>

      {/* ════ EYE ════ */}
      {/* Sits near head, slightly above mid-line */}
      <circle cx="85" cy="38" r="4.5" fill="#1a0408"/>
      <circle cx="85" cy="38" r="3.2" fill="#2a0810"/>
      <circle cx="85" cy="38" r="2.0" fill="#0a0208"/>
      <circle cx="83.8" cy="36.8" r="1.1" fill="#ffffff" opacity="0.90"/>
      <circle cx="86.2" cy="39.4" r="0.5" fill="#ffffff" opacity="0.42"/>
      {/* Teal eye ring — betta characteristic */}
      <circle cx="85" cy="38" r="4.5" fill="none"
        stroke="#20c8b0" strokeWidth="0.7" opacity="0.60"/>

      {/* ════ MOUTH (upturned, betta characteristic) ════ */}
      <path d="M 88 41 Q 90.5 40, 89 39"
        fill="none" stroke="#1a0408" strokeWidth="1.0"
        strokeLinecap="round" opacity="0.70"/>

      {/* ════ LATERAL LINE ════ */}
      <path d="M 24 40 Q 55 37, 82 39"
        fill="none" stroke="#c06060" strokeWidth="0.45" opacity="0.18"/>

      {/* ════ JUVENILE BADGE ════ */}
      {isJuvenile && (
        <text x="55" y="62" textAnchor="middle"
          fontSize="5" fill="#c83030" opacity="0.75"
          fontFamily="sans-serif" fontWeight="bold">
          juvenile
        </text>
      )}
    </svg>
  );
}

export default memo(BettaSprite, (prev, next) =>
  prev.fish?.id      === next.fish?.id      &&
  prev.fish?.stage   === next.fish?.stage   &&
  prev.fish?.health  === next.fish?.health  &&
  prev.fish?.disease === next.fish?.disease &&
  prev.selected      === next.selected      &&
  prev.size          === next.size          &&
  prev.flipped       === next.flipped
);
