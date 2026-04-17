// ============================================================
// FISH TYCOON 2 — FISH SVG SPRITE v4 (Phase 11 — Pseudo-3D)
// ============================================================
// Step 1: 3D Shading Overhaul
//   • Radial gradient light source top-left → round, dimensional body
//   • Dedicated belly highlight (warm soft gradient)
//   • Dorsal shadow band (dark radial from top, clipped to body)
//   • Lateral shimmer line (iridescent mid-body band)
//   • Drop shadow beneath each fish (feDropShadow)
//   • Fins: semi-transparent + dedicated rim-light glow filter
//     (feGaussianBlur + feComposite → accent halo bleeds around edges)
//   • Specular: primary wet-look + secondary + tertiary micro-glints
//   • Scale texture clipped to body (very subtle)
//   • Rarity aura halos (uncommon/rare/epic blurred glow)
//   • Egg + Juvenile also fully shaded with matching treatment
// ============================================================

import React, { memo, lazy, Suspense } from 'react';

// Lazy-loaded: each sprite is 12–17 KB of SVG paths. Using lazy() means
// the chunk is only fetched the first time a fish of that species renders.
const ClownfishSprite        = lazy(() => import('./sprites/ClownfishSprite.jsx'));
const BlueTangSprite         = lazy(() => import('./sprites/BlueTangSprite.jsx'));
const BettaSprite            = lazy(() => import('./sprites/BettaSprite.jsx'));
const AngelFishSprite        = lazy(() => import('./sprites/AngelFishSprite.jsx'));
const GoldfishSprite         = lazy(() => import('./sprites/GoldfishSprite.jsx'));
const MandarinDragonetSprite = lazy(() => import('./sprites/MandarinDragonetSprite.jsx'));
const NeonTetraSprite        = lazy(() => import('./sprites/NeonTetraSprite.jsx'));
const DiscusSprite           = lazy(() => import('./sprites/DiscusSprite.jsx'));
const LionfishSprite         = lazy(() => import('./sprites/LionfishSprite.jsx'));
const SeahorseSprite         = lazy(() => import('./sprites/SeahorseSprite.jsx'));
const PufferfishSprite       = lazy(() => import('./sprites/PufferfishSprite.jsx'));
const JellyfishSprite        = lazy(() => import('./sprites/JellyfishSprite.jsx'));
const KoiSprite              = lazy(() => import('./sprites/KoiSprite.jsx'));
const MoorishIdolSprite      = lazy(() => import('./sprites/MoorishIdolSprite.jsx'));
const TriggerSprite          = lazy(() => import('./sprites/TriggerSprite.jsx'));
const ElectricEelSprite      = lazy(() => import('./sprites/ElectricEelSprite.jsx'));
const AxolotlSprite          = lazy(() => import('./sprites/AxolotlSprite.jsx'));
const YellowTangSprite       = lazy(() => import('./sprites/YellowTangSprite.jsx'));
const ArowanaSprite          = lazy(() => import('./sprites/ArowanaSprite.jsx'));
const CherryShrimpSprite     = lazy(() => import('./sprites/CherryShrimp.jsx'));
const OscarSprite            = lazy(() => import('./sprites/OscarSprite.jsx'));
const GuppySprite            = lazy(() => import('./sprites/GuppySprite.jsx'));
const CuttlefishSprite       = lazy(() => import('./sprites/CuttlefishSprite.jsx'));
const CorydorasSprite        = lazy(() => import('./sprites/CorydorasSprite.jsx'));
const HammerheadSprite       = lazy(() => import('./sprites/HammerheadSprite.jsx'));
const NautilusSprite         = lazy(() => import('./sprites/NautilusSprite.jsx'));

// ── Species sprite routing (Phase 12) ───────────────────────
// Add new real-species entries here as they're built.
const SPECIES_SPRITE_MAP = {
  clownfish:         ClownfishSprite,
  bluetang:          BlueTangSprite,
  betta:             BettaSprite,
  angelfish:         AngelFishSprite,
  goldfish:          GoldfishSprite,
  mandarin_dragonet: MandarinDragonetSprite,
  neon_tetra:        NeonTetraSprite,
  discus:            DiscusSprite,
  lionfish:          LionfishSprite,
  seahorse:          SeahorseSprite,
  pufferfish:        PufferfishSprite,
  jellyfish:         JellyfishSprite,
  koi:               KoiSprite,
  moorish_idol:      MoorishIdolSprite,
  triggerfish:       TriggerSprite,
  electric_eel:      ElectricEelSprite,
  axolotl:           AxolotlSprite,
  yellow_tang:       YellowTangSprite,
  arowana:           ArowanaSprite,
  cherry_shrimp:     CherryShrimpSprite,
  oscar:             OscarSprite,
  guppy:             GuppySprite,
  cuttlefish:        CuttlefishSprite,
  corydoras:         CorydorasSprite,
  hammerhead:        HammerheadSprite,
  nautilus:          NautilusSprite,
};

// ─── COLOR PALETTES ─────────────────────────────────────────────────────────
// Each entry:
//   body/body2  : main hue (mid-tone / dark-tone)
//   belly       : lighter underside
//   fin/fin2    : fin dark / fin mid-bright
//   accent      : brightest fin highlight
//   light       : specular / shimmer highlight
//   shadow      : deep shadow for dorsal band
//   lateral     : iridescent lateral-line shimmer colour
const BODY_COLORS = {
  Crimson: {
    body:'#d94040', body2:'#c02828', belly:'#f07070',
    fin:'#a81818',  fin2:'#e05858', accent:'#ff9090',
    scale:'#b83030', light:'#ff9090', shadow:'#7a0f0f',
    lateral:'#ffb0b0',
  },
  Gold: {
    body:'#d4920a', body2:'#b87800', belly:'#f8d060',
    fin:'#a06000',  fin2:'#e0a820', accent:'#ffe080',
    scale:'#c07800', light:'#ffe090', shadow:'#704000',
    lateral:'#fff0a0',
  },
  Violet: {
    body:'#8830c8', body2:'#6818a8', belly:'#c070f0',
    fin:'#501090',  fin2:'#a040d8', accent:'#e0a0ff',
    scale:'#7020b0', light:'#e0a0ff', shadow:'#2a0060',
    lateral:'#f0c0ff',
  },
  Azure: {
    body:'#1870d0', body2:'#0c54b0', belly:'#60b0f8',
    fin:'#083890',  fin2:'#2888e0', accent:'#90d0ff',
    scale:'#0e60b8', light:'#90d8ff', shadow:'#041a60',
    lateral:'#b0e8ff',
  },
  Emerald: {
    body:'#1a9848', body2:'#0e7832', belly:'#50d880',
    fin:'#086028',  fin2:'#28b858', accent:'#80f0a8',
    scale:'#128038', light:'#80f0a8', shadow:'#033018',
    lateral:'#a0ffcc',
  },
  White: {
    body:'#b8c8d8', body2:'#98aabb', belly:'#e8f0f8',
    fin:'#7890a8',  fin2:'#c8d8e8', accent:'#ffffff',
    scale:'#a0b8cc', light:'#ffffff', shadow:'#4a6070',
    lateral:'#ffffff',
  },
};

// ─── RARITY AURA ────────────────────────────────────────────────────────────
const RARITY_AURA = {
  common:    null,
  uncommon:  { color:'#78c8ff', opacity:0.18, blur:5  },
  rare:      { color:'#c878ff', opacity:0.30, blur:8  },
  epic:      { color:'#ffe040', opacity:0.42, blur:11, pulse: true },
  legendary: { color:'#ff60ff', opacity:0.55, blur:14, pulse: true, rainbow: true },
};

// ============================================================
// ─── EGG SPRITE ─────────────────────────────────────────────
// ============================================================
function EggSprite({ uid, size, aura, isGlow, selected, onClick }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 64" onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', overflow: 'visible' }}>
      <defs>
        <filter id={`eshadow-${uid}`} x="-35%" y="-25%" width="170%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="3.5"
                        floodColor="#000" floodOpacity="0.35"/>
        </filter>
        {aura && (
          <filter id={`eaura-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={aura.blur} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
        {/* Main egg — radial, light top-left */}
        <radialGradient id={`eg-${uid}`} cx="30%" cy="25%" r="68%" fx="26%" fy="20%">
          <stop offset="0%"   stopColor="#fff8e8"/>
          <stop offset="35%"  stopColor="#f8e8b8"/>
          <stop offset="68%"  stopColor="#f0d898"/>
          <stop offset="100%" stopColor="#c8a050"/>
        </radialGradient>
        {/* Dorsal shadow */}
        <radialGradient id={`egdorsal-${uid}`} cx="50%" cy="0%" r="72%" fx="50%" fy="0%">
          <stop offset="0%"   stopColor="#80500a" stopOpacity="0.45"/>
          <stop offset="60%"  stopColor="#80500a" stopOpacity="0.08"/>
          <stop offset="100%" stopColor="#80500a" stopOpacity="0"/>
        </radialGradient>
        {/* Belly highlight */}
        <radialGradient id={`egbelly-${uid}`} cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
          <stop offset="0%"   stopColor="#fff8d0" stopOpacity="0.55"/>
          <stop offset="100%" stopColor="#fff8d0" stopOpacity="0"/>
        </radialGradient>
        {/* Specular */}
        <radialGradient id={`egspec-${uid}`} cx="28%" cy="22%" r="38%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.80"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
      </defs>

      {aura && (
        <ellipse cx="30" cy="34" rx="20" ry="24"
                 fill={aura.color} opacity={aura.opacity}
                 filter={`url(#eaura-${uid})`}/>
      )}
      {isGlow && !aura && (
        <ellipse cx="30" cy="34" rx="20" ry="24" fill="#ffffa0" opacity="0.32"/>
      )}

      <g filter={`url(#eshadow-${uid})`}>
        <ellipse cx="30" cy="34" rx="13" ry="17" fill={`url(#eg-${uid})`}/>
      </g>
      <ellipse cx="30" cy="34" rx="13" ry="17" fill={`url(#egdorsal-${uid})`}/>
      <ellipse cx="30" cy="34" rx="13" ry="17" fill={`url(#egbelly-${uid})`}/>
      <ellipse cx="30" cy="34" rx="13" ry="17" fill={`url(#egspec-${uid})`}/>
      <ellipse cx="30" cy="34" rx="13" ry="17"
               fill="none" stroke="#c8a060" strokeWidth="1.1" opacity="0.6"/>

      {/* Glints */}
      <ellipse cx="23" cy="25" rx="4.5" ry="6.5" fill="white" opacity="0.52"
               transform="rotate(-15,23,25)"/>
      <ellipse cx="32" cy="23" rx="1.8" ry="2.8" fill="white" opacity="0.38"/>

      {/* Floor shadow */}
      <ellipse cx="30" cy="53" rx="10" ry="2.2" fill="#000" opacity="0.12"/>

      {selected && (
        <ellipse cx="30" cy="34" rx="18" ry="22"
                 fill="none" stroke="#b0944a" strokeWidth="2"
                 strokeDasharray="5 3" opacity="0.9"
                 style={{ animation: 'shimmer-ring-march 0.9s linear infinite' }}/>
      )}
    </svg>
  );
}

// ============================================================
// ─── JUVENILE SPRITE ─────────────────────────────────────────
// ============================================================
function JuvenileSprite({ uid, C, size, aura, isGlow, isSpot, selected, flipped, onClick }) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 70 52" onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow: 'visible',
      }}>
      <defs>
        <filter id={`jshadow-${uid}`} x="-35%" y="-35%" width="170%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3"
                        floodColor="#000" floodOpacity="0.32"/>
        </filter>
        {/* Fin rim-light glow */}
        <filter id={`jfinglow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feFlood floodColor={C.accent} floodOpacity="0.40" result="colour"/>
          <feComposite in="colour" in2="blur"    operator="in"   result="glowColour"/>
          <feMerge>
            <feMergeNode in="glowColour"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {aura && (
          <filter id={`jaura-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={aura.blur} result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        )}
        {/* Body — 3D radial, light top-left */}
        <radialGradient id={`jb-${uid}`} cx="30%" cy="24%" r="72%" fx="26%" fy="20%">
          <stop offset="0%"   stopColor={C.light}/>
          <stop offset="30%"  stopColor={C.belly}/>
          <stop offset="65%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>
        {/* Dorsal shadow */}
        <radialGradient id={`jd-${uid}`} cx="50%" cy="0%" r="80%" fx="50%" fy="0%">
          <stop offset="0%"   stopColor={C.shadow} stopOpacity="0.50"/>
          <stop offset="55%"  stopColor={C.shadow} stopOpacity="0.10"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>
        {/* Belly highlight */}
        <radialGradient id={`jbelly-${uid}`} cx="50%" cy="100%" r="60%" fx="50%" fy="100%">
          <stop offset="0%"   stopColor={C.light} stopOpacity="0.50"/>
          <stop offset="100%" stopColor={C.light} stopOpacity="0"/>
        </radialGradient>
        {/* Specular */}
        <radialGradient id={`jspec-${uid}`} cx="28%" cy="20%" r="42%" fx="24%" fy="16%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.70"/>
          <stop offset="55%"  stopColor="white" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>
        {/* Fin gradient */}
        <linearGradient id={`jf-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.accent} stopOpacity="0.88"/>
          <stop offset="55%"  stopColor={C.fin2}   stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.fin}    stopOpacity="0.28"/>
        </linearGradient>
        <clipPath id={`jc-${uid}`}>
          <ellipse cx="36" cy="28" rx="18" ry="12"/>
        </clipPath>
      </defs>

      {aura && (
        <ellipse cx="36" cy="28" rx="28" ry="20"
                 fill={aura.color} opacity={aura.opacity}
                 filter={`url(#jaura-${uid})`}/>
      )}
      {isGlow && !aura && (
        <ellipse cx="36" cy="28" rx="26" ry="18" fill="#ffffa0" opacity="0.28"/>
      )}

      {/* Fins (behind body) */}
      <path d="M18,28 Q6,20 8,28 Q6,36 18,28"
            fill={`url(#jf-${uid})`}
            stroke={C.accent} strokeWidth="0.7" strokeOpacity="0.65"
            filter={`url(#jfinglow-${uid})`}/>
      <path d="M28,16 Q36,10 44,16"
            fill={`url(#jf-${uid})`}
            stroke={C.accent} strokeWidth="0.6" strokeOpacity="0.55"
            filter={`url(#jfinglow-${uid})`}/>

      {/* Body */}
      <g filter={`url(#jshadow-${uid})`}>
        <ellipse cx="36" cy="28" rx="18" ry="12" fill={`url(#jb-${uid})`}/>
      </g>
      <ellipse cx="36" cy="28" rx="18" ry="12" fill={`url(#jd-${uid})`}/>
      <ellipse cx="36" cy="28" rx="18" ry="12" fill={`url(#jbelly-${uid})`}/>

      {/* Pattern */}
      {isSpot
        ? <g clipPath={`url(#jc-${uid})`} opacity="0.38">
            <circle cx="34" cy="26" r="3.5" fill={C.fin}/>
            <circle cx="42" cy="30" r="2.5" fill={C.fin}/>
          </g>
        : <g clipPath={`url(#jc-${uid})`} opacity="0.25">
            <ellipse cx="34" cy="24" rx="10" ry="1.5" fill={C.fin}/>
            <ellipse cx="36" cy="31" rx="9"  ry="1.2" fill={C.fin}/>
          </g>
      }

      <ellipse cx="36" cy="28" rx="18" ry="12" fill={`url(#jspec-${uid})`}/>
      <ellipse cx="44" cy="21" rx="2.5" ry="1.8" fill="white" opacity="0.60"/>

      {/* Eye */}
      <circle cx="50" cy="24" r="4.2" fill="white"/>
      <circle cx="50" cy="24" r="4.2" fill="none" stroke={C.body2} strokeWidth="0.6" opacity="0.4"/>
      <circle cx="50.5" cy="24.2" r="2.4" fill="#111"/>
      <circle cx="50.5" cy="24.2" r="2.4" fill="none" stroke={C.accent} strokeWidth="0.7" opacity="0.7"/>
      <circle cx="51.5" cy="23"   r="0.9" fill="white" opacity="0.92"/>

      {/* Floor shadow */}
      <ellipse cx="36" cy="42" rx="14" ry="2.2" fill="#000" opacity="0.11"/>

      {selected && (
        <ellipse cx="36" cy="28" rx="25" ry="19"
                 fill="none" stroke="#b0944a" strokeWidth="2"
                 strokeDasharray="5 3" opacity="0.9"
                 style={{ animation: 'shimmer-ring-march 0.9s linear infinite' }}/>
      )}
    </svg>
  );
}

// ============================================================
// ─── ADULT SPRITE ────────────────────────────────────────────
// ============================================================
function FishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  const { phenotype, species } = fish;
  const C       = BODY_COLORS[phenotype.primaryColor] || BODY_COLORS.Crimson;
  const isGlow  = phenotype.glow     === 'Luminous';
  const isGiant = phenotype.size      === 'Giant';
  const isSpot  = phenotype.pattern   === 'Spotted';
  const rarity  = species?.rarity || 'common';
  const aura    = RARITY_AURA[rarity];
  const uid     = (fish.id || 'x').slice(0, 8);

  // ── Real species bypass (Phase 12) ──────────────────────
  // If the fish has a visualType:'species' + a known species key,
  // delegate entirely to the dedicated sprite component.
  if (fish.species?.visualType === 'species') {
    const SpeciesSprite = SPECIES_SPRITE_MAP[fish.species.key];
    if (SpeciesSprite) {
      return (
        <Suspense fallback={<svg width={size} height={size * 0.65} />}>
          <SpeciesSprite fish={fish} size={size} flipped={flipped} selected={selected} onClick={onClick}/>
        </Suspense>
      );
    }
  }

  if (fish.stage === 'egg')      return <EggSprite      uid={uid} size={size} aura={aura} isGlow={isGlow} selected={selected} onClick={onClick}/>;
  if (fish.stage === 'juvenile') return <JuvenileSprite uid={uid} size={size} C={C} aura={aura} isGlow={isGlow} isSpot={isSpot} selected={selected} flipped={flipped} onClick={onClick}/>;

  // ── Adult geometry — distinct shapes per body type ──────
  const W     = isGiant ? size * 1.35 : size;
  const _h     = isGiant ? size * 0.85 : size * 0.65;
  const shape = phenotype.bodyShape;
  const isRound = shape === 'Round' || shape === 'Orb';
  const fin   = phenotype.finType;

  // Body center, radii, and SVG path vary by body shape
  const BODY_GEOM = {
    Orb:     { cx: 44, cy: 30, rx: 22, ry: 22, path: null }, // perfect circle
    Round:   { cx: 45, cy: 30, rx: 28, ry: 20, path: null }, // wide ellipse
    Delta:   { cx: 46, cy: 30, rx: 24, ry: 16, path: 'M70,30 C70,18 58,12 42,14 C28,16 18,22 18,30 C18,38 28,44 42,46 C58,48 70,42 70,30 Z' },
    Slender: { cx: 48, cy: 30, rx: 30, ry: 11, path: 'M78,30 C78,22 65,16 48,16 C30,16 14,22 14,30 C14,38 30,44 48,44 C65,44 78,38 78,30 Z' },
    Eel:     { cx: 50, cy: 30, rx: 38, ry: 8,  path: 'M88,30 C88,24 75,20 55,20 C35,20 15,24 10,30 C15,36 35,40 55,40 C75,40 88,36 88,30 Z' },
  };
  const geom = BODY_GEOM[shape] || BODY_GEOM.Round;
  const { cx, cy, rx, ry } = geom;
  const tailX = shape === 'Eel' ? 12 : cx - rx;

  // Body clip path — either ellipse or custom path
  const bodyClipContent = geom.path
    ? <path d={geom.path}/>
    : <ellipse cx={cx} cy={cy} rx={rx} ry={ry}/>;
  const bodyFillContent = geom.path
    ? <path d={geom.path} fill={`url(#body-${uid})`}/>
    : <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#body-${uid})`}/>;
  const bodyOverlay = (gradId) => geom.path
    ? <path d={geom.path} fill={`url(#${gradId})`}/>
    : <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${gradId})`}/>;

  // Fin parameters by type
  const FIN_STYLE = {
    Veil:    { dorsalH: 26, tailSpread: 28, pectoralRx: 13, pectoralRy: 5, flowing: true },
    Flowing: { dorsalH: 22, tailSpread: 24, pectoralRx: 11, pectoralRy: 4.5, flowing: true },
    Broad:   { dorsalH: 16, tailSpread: 18, pectoralRx: 10, pectoralRy: 5.5, flowing: false },
    Angular: { dorsalH: 18, tailSpread: 16, pectoralRx: 8,  pectoralRy: 3, flowing: false },
    Nub:     { dorsalH: 8,  tailSpread: 10, pectoralRx: 5,  pectoralRy: 2, flowing: false },
  };
  const finStyle = FIN_STYLE[fin] || FIN_STYLE.Broad;

  // Pattern type
  const pattern = phenotype.pattern;
  const isTiger  = pattern === 'Tiger';
  const isMarble = pattern === 'Marble';
  const isLined  = pattern === 'Lined';
  const isPlain  = pattern === 'Plain';

  return (
    <svg width={W} height={_h} viewBox="0 0 100 60" onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        transform: flipped ? 'scaleX(-1)' : 'none',
        overflow: 'visible',
      }}>
      <defs>

        {/* ── Drop shadow ── */}
        <filter id={`fshadow-${uid}`} x="-28%" y="-35%" width="156%" height="200%">
          <feDropShadow dx="0" dy="6" stdDeviation="4"
                        floodColor="#000" floodOpacity="0.40"/>
        </filter>

        {/* ── Fin rim-light glow ──────────────────────────────────
             Blurs the fin shape, tints with accent colour, composites
             under the original → soft accent halo bleeds out from edges. */}
        <filter id={`finglow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.2" result="blur"/>
          <feFlood floodColor={C.accent} floodOpacity="0.48" result="colour"/>
          <feComposite in="colour" in2="blur"    operator="in"   result="glowColour"/>
          <feMerge>
            <feMergeNode in="glowColour"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* ── Luminous body glow ── */}
        {isGlow && (
          <filter id={`fglow-${uid}`} x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="5" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}

        {/* ── Rarity aura glow ── */}
        {aura && (
          <filter id={`faura-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={aura.blur} result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        )}

        {/* ── Body gradient — 3D radial, light source top-left ──
             0%   : pure specular highlight (C.light)
             28%  : bright underside / belly tint (C.belly)
             60%  : main hue (C.body)
             100% : deep shadow side (C.body2) */}
        <radialGradient id={`body-${uid}`} cx="28%" cy="22%" r="74%" fx="24%" fy="17%">
          <stop offset="0%"   stopColor={C.light}/>
          <stop offset="28%"  stopColor={C.belly}/>
          <stop offset="60%"  stopColor={C.body}/>
          <stop offset="100%" stopColor={C.body2}/>
        </radialGradient>

        {/* ── Dorsal shadow — dark band from top ── */}
        <radialGradient id={`dorsal-${uid}`} cx="50%" cy="0%" r="88%" fx="50%" fy="0%">
          <stop offset="0%"   stopColor={C.shadow} stopOpacity="0.58"/>
          <stop offset="48%"  stopColor={C.shadow} stopOpacity="0.14"/>
          <stop offset="100%" stopColor={C.shadow} stopOpacity="0"/>
        </radialGradient>

        {/* ── Belly highlight — warm glow from below ── */}
        <radialGradient id={`belly-${uid}`} cx="50%" cy="100%" r="68%" fx="50%" fy="100%">
          <stop offset="0%"   stopColor={C.light} stopOpacity="0.58"/>
          <stop offset="60%"  stopColor={C.light} stopOpacity="0.18"/>
          <stop offset="100%" stopColor={C.light} stopOpacity="0"/>
        </radialGradient>

        {/* ── Lateral shimmer — iridescent horizontal band ── */}
        <linearGradient id={`lateral-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%"   stopColor={C.lateral} stopOpacity="0"/>
          <stop offset="30%"  stopColor={C.lateral} stopOpacity="0.35"/>
          <stop offset="50%"  stopColor={C.lateral} stopOpacity="0.55"/>
          <stop offset="70%"  stopColor={C.lateral} stopOpacity="0.35"/>
          <stop offset="100%" stopColor={C.lateral} stopOpacity="0"/>
        </linearGradient>

        {/* ── Specular highlight — top-left wet look ── */}
        <radialGradient id={`spec-${uid}`} cx="28%" cy="20%" r="44%" fx="23%" fy="15%">
          <stop offset="0%"   stopColor="white" stopOpacity="0.78"/>
          <stop offset="55%"  stopColor="white" stopOpacity="0.18"/>
          <stop offset="100%" stopColor="white" stopOpacity="0"/>
        </radialGradient>

        {/* ── Fin gradient — bright accent edge → transparent base ── */}
        <linearGradient id={`fin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor={C.accent} stopOpacity="0.88"/>
          <stop offset="50%"  stopColor={C.fin2}   stopOpacity="0.55"/>
          <stop offset="100%" stopColor={C.fin}    stopOpacity="0.30"/>
        </linearGradient>

        {/* ── Clip path (scales + patterns) ── */}
        <clipPath id={`bc-${uid}`}>
          {bodyClipContent}
        </clipPath>

      </defs>

      {/* ══════════════════════════════════════════════
          LAYER 1 — RARITY / GLOW HALO (behind all)
          ══════════════════════════════════════════════ */}
      {aura && (
        <ellipse cx={cx} cy={cy} rx={rx + 16} ry={ry + 14}
                 fill={aura.color} opacity={aura.opacity}
                 filter={`url(#faura-${uid})`}/>
      )}
      {isGlow && !aura && (
        <ellipse cx={cx} cy={cy} rx={rx + 14} ry={ry + 12}
                 fill="#ffffa0" opacity="0.22"
                 filter={`url(#fglow-${uid})`}/>
      )}

      {/* ══════════════════════════════════════════════
          LAYER 2 — TAIL FIN
          ══════════════════════════════════════════════ */}
      {finStyle.flowing ? (
        <g filter={`url(#finglow-${uid})`} className="fish-tail-flowing">
          {/* Upper lobe — animated */}
          <path d={`M${tailX + 4},${cy - 2} C${tailX - 10},${cy - 10} ${tailX - finStyle.tailSpread},${cy - finStyle.tailSpread} ${tailX - finStyle.tailSpread * 0.6},${cy - 4} Z`}
                fill={`url(#fin-${uid})`}
                stroke={C.accent} strokeWidth="0.9" strokeOpacity="0.75"/>
          {/* Lower lobe */}
          <path d={`M${tailX + 4},${cy + 2} C${tailX - 10},${cy + 10} ${tailX - finStyle.tailSpread},${cy + finStyle.tailSpread} ${tailX - finStyle.tailSpread * 0.6},${cy + 4} Z`}
                fill={`url(#fin-${uid})`}
                stroke={C.accent} strokeWidth="0.9" strokeOpacity="0.75"/>
          {/* Central vein shimmer */}
          <path d={`M${tailX + 5},${cy} C${tailX - 6},${cy - 5} ${tailX - 15},${cy - 2} ${tailX - 10},${cy} C${tailX - 15},${cy + 2} ${tailX - 6},${cy + 5} ${tailX + 5},${cy}`}
                fill={C.light} opacity="0.42"/>
        </g>
      ) : (
        <path
          d={`M${tailX + 3},${cy - 3} L${tailX - finStyle.tailSpread * 0.8},${cy - finStyle.tailSpread} L${tailX - finStyle.tailSpread * 0.8},${cy} L${tailX - finStyle.tailSpread * 0.8},${cy + finStyle.tailSpread} L${tailX + 3},${cy + 3} Z`}
          fill={`url(#fin-${uid})`}
          stroke={C.accent} strokeWidth="0.8" strokeOpacity="0.65"
          filter={`url(#finglow-${uid})`} className="fish-tail"/>
      )}

      {/* ══════════════════════════════════════════════
          LAYER 3 — DORSAL FIN (animated)
          ══════════════════════════════════════════════ */}
      {finStyle.flowing
        ? <path
            d={`M${cx - rx * 0.5},${cy - ry} C${cx - rx * 0.1},${cy - ry - finStyle.dorsalH} ${cx + rx * 0.2},${cy - ry - finStyle.dorsalH * 0.8} ${cx + rx * 0.5},${cy - ry + 1}`}
            fill={`url(#fin-${uid})`}
            stroke={C.accent} strokeWidth="0.85" strokeOpacity="0.68"
            strokeLinecap="round" strokeLinejoin="round"
            filter={`url(#finglow-${uid})`} className="fish-dorsal"/>
        : <path
            d={`M${cx - rx * 0.4},${cy - ry} C${cx - rx * 0.1},${cy - ry - finStyle.dorsalH} ${cx + rx * 0.2},${cy - ry - finStyle.dorsalH * 0.75} ${cx + rx * 0.4},${cy - ry + 1}`}
            fill={`url(#fin-${uid})`}
            stroke={C.accent} strokeWidth="0.75" strokeOpacity="0.62"
            strokeLinecap="round" strokeLinejoin="round"
            filter={`url(#finglow-${uid})`} className="fish-dorsal"/>
      }

      {/* ══════════════════════════════════════════════
          LAYER 4 — ANAL FIN (bottom, animated)
          ══════════════════════════════════════════════ */}
      <path className="fish-anal-fin"
        d={`M${cx - rx * 0.1},${cy + ry} C${cx + rx * 0.1},${cy + ry + 11} ${cx + rx * 0.35},${cy + ry + 9} ${cx + rx * 0.4},${cy + ry}`}
        fill={`url(#fin-${uid})`}
        stroke={C.accent} strokeWidth="0.65" strokeOpacity="0.52"
        filter={`url(#finglow-${uid})`}/>

      {/* ══════════════════════════════════════════════
          LAYER 5 — PECTORAL FIN (animated)
          ══════════════════════════════════════════════ */}
      <ellipse className="fish-pectoral"
        cx={cx + rx * 0.05} cy={cy + ry * 0.55}
        rx={finStyle.pectoralRx} ry={finStyle.pectoralRy}
        fill={`url(#fin-${uid})`}
        stroke={C.accent} strokeWidth="0.65" strokeOpacity="0.55"
        transform={`rotate(-25,${cx + rx * 0.05},${cy + ry * 0.55})`}
        filter={`url(#finglow-${uid})`}/>

      {/* ══════════════════════════════════════════════
          LAYER 6 — BODY (3D gradient + drop shadow)
          ══════════════════════════════════════════════ */}
      <g filter={`url(#fshadow-${uid})`}>
        {bodyFillContent}
      </g>

      {/* Dorsal shadow overlay */}
      {bodyOverlay(`dorsal-${uid}`)}

      {/* Scale texture — subtle, clipped to body */}
      <g clipPath={`url(#bc-${uid})`} opacity="0.13">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            const sx = cx - rx + col * (rx * 2 / 6) + (row % 2 === 0 ? 0 : rx / 6);
            const sy = cy - ry + row * (ry * 2 / 3.5);
            return (
              <ellipse key={`${row}-${col}`}
                       cx={sx} cy={sy} rx={rx * 0.19} ry={ry * 0.23}
                       fill="none" stroke={C.scale} strokeWidth="0.9"/>
            );
          })
        )}
      </g>

      {/* Pattern — varies by phenotype */}
      {isSpot && (
        <g clipPath={`url(#bc-${uid})`} opacity="0.36">
          <circle cx={cx + 4}  cy={cy - 5} r={rx * 0.22} fill={C.fin}/>
          <circle cx={cx - 6}  cy={cy + 4} r={rx * 0.18} fill={C.fin}/>
          <circle cx={cx + 12} cy={cy + 5} r={rx * 0.15} fill={C.fin}/>
          <circle cx={cx - 2}  cy={cy - 2} r={rx * 0.10} fill={C.fin} opacity="0.6"/>
          <circle cx={cx - 10} cy={cy - 6} r={rx * 0.12} fill={C.fin} opacity="0.5"/>
        </g>
      )}
      {isTiger && (
        <g clipPath={`url(#bc-${uid})`} opacity="0.35">
          {[-0.4, -0.15, 0.1, 0.35].map((off, i) => (
            <ellipse key={i} cx={cx + rx * off} cy={cy} rx={rx * 0.06} ry={ry * 0.85}
              fill={C.fin} transform={`rotate(${10 - i * 5},${cx + rx * off},${cy})`}/>
          ))}
        </g>
      )}
      {isMarble && (
        <g clipPath={`url(#bc-${uid})`} opacity="0.28">
          <path d={`M${cx - rx * 0.6},${cy - ry * 0.3} Q${cx - rx * 0.2},${cy + ry * 0.4} ${cx + rx * 0.3},${cy - ry * 0.2} T${cx + rx * 0.7},${cy + ry * 0.1}`}
            stroke={C.fin} strokeWidth={rx * 0.12} fill="none" strokeLinecap="round"/>
          <path d={`M${cx - rx * 0.3},${cy + ry * 0.5} Q${cx},${cy - ry * 0.3} ${cx + rx * 0.5},${cy + ry * 0.3}`}
            stroke={C.fin} strokeWidth={rx * 0.08} fill="none" strokeLinecap="round" opacity="0.6"/>
        </g>
      )}
      {isLined && (
        <g clipPath={`url(#bc-${uid})`} opacity="0.25">
          <ellipse cx={cx}     cy={cy - ry * 0.35} rx={rx * 0.75} ry={2.2} fill={C.fin}/>
          <ellipse cx={cx - 2} cy={cy + ry * 0.25} rx={rx * 0.65} ry={1.8} fill={C.fin}/>
          <ellipse cx={cx + 2} cy={cy - ry * 0.05} rx={rx * 0.50} ry={1.2} fill={C.fin} opacity="0.7"/>
        </g>
      )}

      {/* Lateral shimmer line */}
      <ellipse
        cx={cx - rx * 0.05} cy={cy - ry * 0.08}
        rx={rx * 0.80} ry={ry * 0.20}
        fill={`url(#lateral-${uid})`}
        opacity="0.55"/>

      {/* Belly highlight */}
      <ellipse cx={cx + rx * 0.10} cy={cy + ry * 0.40}
               rx={rx * 0.60} ry={ry * 0.44}
               fill={`url(#belly-${uid})`}/>

      {/* Primary specular */}
      {bodyOverlay(`spec-${uid}`)}

      {/* Secondary glint — small bright ellipse */}
      <ellipse cx={cx + rx * 0.46} cy={cy - ry * 0.54}
               rx={rx * 0.10} ry={ry * 0.09}
               fill="white" opacity="0.72"/>

      {/* Tertiary micro-glint */}
      <ellipse cx={cx - rx * 0.20} cy={cy - ry * 0.62}
               rx={rx * 0.05} ry={ry * 0.045}
               fill="white" opacity="0.42"/>

      {/* Luminous shimmer (additive) */}
      {isGlow && (
        geom.path
          ? <path d={geom.path} fill="#ffffa0" opacity="0.12" filter={`url(#fglow-${uid})`}/>
          : <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#ffffa0" opacity="0.12" filter={`url(#fglow-${uid})`}/>
      )}

      {/* ══════════════════════════════════════════════
          LAYER 7 — EYE
          ══════════════════════════════════════════════ */}
      {/* Sclera */}
      <circle cx={cx + rx * 0.72} cy={cy - ry * 0.18} r={isRound ? 5.8 : 4.8} fill="white"/>
      {/* Eye rim */}
      <circle cx={cx + rx * 0.72} cy={cy - ry * 0.18} r={isRound ? 5.8 : 4.8}
              fill="none" stroke={C.body2} strokeWidth="0.7" opacity="0.45"/>
      {/* Pupil */}
      <circle cx={cx + rx * 0.72} cy={cy - ry * 0.15} r={isRound ? 3.3 : 2.6} fill="#111"/>
      {/* Iris ring */}
      <circle cx={cx + rx * 0.72} cy={cy - ry * 0.15} r={isRound ? 3.3 : 2.6}
              fill="none" stroke={C.accent} strokeWidth="0.9" opacity="0.78"/>
      {/* Primary eye glint */}
      <circle cx={cx + rx * 0.78} cy={cy - ry * 0.30} r={1.3} fill="white" opacity="0.95"/>
      {/* Secondary eye glint */}
      <circle cx={cx + rx * 0.67} cy={cy - ry * 0.05} r={0.6} fill="white" opacity="0.55"/>

      {/* ══════════════════════════════════════════════
          LAYER 8 — MOUTH
          ══════════════════════════════════════════════ */}
      <path d={`M${cx + rx - 1},${cy + ry * 0.12} Q${cx + rx + 3},${cy + ry * 0.28} ${cx + rx},${cy + ry * 0.40}`}
            stroke="#33222a" strokeWidth="1.3" fill="none" strokeLinecap="round"/>

      {/* ══════════════════════════════════════════════
          LAYER 9 — FLOOR SHADOW ELLIPSE
          ══════════════════════════════════════════════ */}
      <ellipse cx={cx} cy={cy + ry + 14} rx={rx * 0.74} ry={2.8}
               fill="#000" opacity="0.13"/>

      {/* ══════════════════════════════════════════════
          LAYER 10 — SELECTION RING (marching-ants shimmer)
          ══════════════════════════════════════════════ */}
      {selected && (
        <ellipse cx={cx} cy={cy} rx={rx + 9} ry={ry + 8}
                 fill="none" stroke="#b0944a" strokeWidth="2.5"
                 strokeDasharray="6 3"
                 opacity="0.92"
                 style={{ animation: 'shimmer-ring-march 0.9s linear infinite' }}/>
      )}
    </svg>
  );
}

// Only re-render when props that affect the visual actually change.
// Position/flipped updates come from TankView which manages its own
// rendering — FishSprite itself just needs fish data + selection state.
export default memo(FishSprite, (prev, next) =>
  prev.fish?.id       === next.fish?.id       &&
  prev.fish?.health   === next.fish?.health   &&
  prev.fish?.stage    === next.fish?.stage    &&
  prev.fish?.disease  === next.fish?.disease  &&
  prev.selected       === next.selected       &&
  prev.size           === next.size           &&
  prev.flipped        === next.flipped
);
