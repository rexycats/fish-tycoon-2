// ============================================================
// FISH TYCOON 2 — TANK VIEW (Phase 11: Pseudo-3D Visual Overhaul)
// ============================================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import FishSprite from './FishSprite.jsx';
import { getDecorById } from '../data/decorations.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';

const SWIM_SPEED  = 0.007;
const BOB_AMP     = 0.025;
const BOB_FREQ    = 0.018;
const TURN_CHANCE = 0.0018;

// ── Per-species behavior profile defaults ────────────────────
// behaviorProfile fields (all optional — falls back to constants above):
//   swimSpeed       : multiplier applied to SWIM_SPEED  (default 1.0)
//   turnChance      : overrides TURN_CHANCE
//   bobAmplitude    : overrides BOB_AMP
//   preferredYRange : [minY, maxY] as % — fish drifts toward this band
//   idleProbability : chance per idleTimer reset to go idle (0–1)
//   dartiness       : 0–1; on turn, chance to do a sudden speed burst
function getBehaviorProfile(fish) {
  if (fish?.species?.visualType === 'species' && fish.species.key) {
    return REAL_SPECIES_MAP[fish.species.key]?.behaviorProfile || null;
  }
  return null;
}

const DEPTH_LAYERS = [
  { scale: 0.62, opacity: 0.52, z: 7,  blur: 0.7 },
  { scale: 1.00, opacity: 0.85, z: 10, blur: 0   },
  { scale: 1.22, opacity: 1.00, z: 13, blur: 0   },
];

function getDayPhase() {
  const h = new Date().getHours() + new Date().getMinutes() / 60;
  if (h >= 5  && h < 7)  return { phase: 'dawn',    label: '🌅 Dawn'    };
  if (h >= 7  && h < 17) return { phase: 'day',     label: '☀️ Day'     };
  if (h >= 17 && h < 20) return { phase: 'dusk',    label: '🌇 Dusk'    };
  if (h >= 20 && h < 22) return { phase: 'evening', label: '🌆 Evening'  };
  return                         { phase: 'night',   label: '🌙 Night'   };
}

const DAY_PHASE_STYLES = {
  dawn:    { overlay: 'rgba(255,150, 60,0.18)', rayOpacity: 0.55, starCount: 0  },
  day:     { overlay: 'rgba(180,230,255,0.06)', rayOpacity: 0.90, starCount: 0  },
  dusk:    { overlay: 'rgba(220, 80, 20,0.22)', rayOpacity: 0.45, starCount: 0  },
  evening: { overlay: 'rgba( 60, 20,100,0.35)', rayOpacity: 0.15, starCount: 5  },
  night:   { overlay: 'rgba( 10, 10, 50,0.52)', rayOpacity: 0.04, starCount: 12 },
};

const STARS = Array.from({ length: 12 }, (_, i) => ({
  x: ((i * 73 + 17) % 90) + 3,
  y: ((i * 41 + 11) % 22) + 2,
  r: ((i * 7)  % 3) * 0.4 + 0.6,
  delay: (i * 0.3) % 2,
}));

const CORNER_BOLTS = [
  { corner: 'tl', style: { top: 7, left: 7 } },
  { corner: 'tr', style: { top: 7, right: 7 } },
  { corner: 'bl', style: { bottom: 7, left: 7 } },
  { corner: 'br', style: { bottom: 7, right: 7 } },
];

export default function TankView({ fish, selectedFishId, onSelectFish, waterQuality, tank }) {
  // Keep a ref so the animation loop (which has no deps) can read behavior profiles
  const fishMapRef = useRef({});

  // Memoize fishMap — only rebuild when fish ids change, not every render
  const fishIds = fish.map(f => f.id).join(',');
  fishMapRef.current = useMemo(
    () => Object.fromEntries(fish.map(f => [f.id, f])),
    [fishIds] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Positions live in a ref — the animation loop mutates it directly.
  // A lightweight frame counter triggers React re-renders without ever
  // copying the entire positions object via setState each frame.
  const posRef  = useRef({});
  const [, setFrame] = useState(0);

  // Initialise positions for fish that don't have one yet
  const initPos = (f) => {
    const bp = getBehaviorProfile(f);
    const [minY, maxY] = bp?.preferredYRange ?? [20, 75];
    return {
      x: f.x ?? (10 + Math.random() * 80),
      y: f.y ?? (minY + Math.random() * (maxY - minY)),
      vx: (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.1),
      vy: 0,
      flipped: Math.random() > 0.5,
      phase: Math.random() * Math.PI * 2,
      depthLayer: Math.floor(Math.random() * 3),
      tilt: 0,
      isIdle: false,
      idleTimer: Math.floor(Math.random() * 200),
    };
  };

  // Seed initial positions once
  if (Object.keys(posRef.current).length === 0 && fish.length > 0) {
    for (const f of fish) posRef.current[f.id] = initPos(f);
  }

  // Sync posRef when fish list changes (add/remove)
  useEffect(() => {
    const pos = posRef.current;
    // Add new fish
    for (const f of fish) {
      if (!pos[f.id]) pos[f.id] = initPos(f);
    }
    // Remove gone fish
    const ids = new Set(fish.map(f => f.id));
    for (const id of Object.keys(pos)) {
      if (!ids.has(id)) delete pos[id];
    }
  }, [fish]);

  // Convenience alias for reading positions in render (ref value, not state)
  const positions = posRef.current;

  const [dayPhase, setDayPhase] = useState(getDayPhase);
  const [hoveredFishId, setHoveredFishId] = useState(null);
  const tickRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setDayPhase(getDayPhase()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let frameId;
    const animate = () => {
      tickRef.current++;
      const t = tickRef.current;
      const pos = posRef.current;

      for (const id of Object.keys(pos)) {
        const p = pos[id];
        let { x, y, vx, vy, phase, flipped, depthLayer, tilt, isIdle, idleTimer } = p;

          // ── Resolve per-species behavior profile ──────────────
          const fishObj = fishMapRef.current[id];
          const bp = fishObj ? getBehaviorProfile(fishObj) : null;
          const swimSpeed    = bp ? SWIM_SPEED * bp.swimSpeed       : SWIM_SPEED;
          const bobAmp       = bp ? bp.bobAmplitude                 : BOB_AMP;
          const turnChance   = bp ? bp.turnChance                   : TURN_CHANCE;
          const idleProb     = bp ? bp.idleProbability              : 0.12;
          const dartiness    = bp ? bp.dartiness                    : 0;
          const [prefYMin, prefYMax] = bp?.preferredYRange ?? [8, 80];

          idleTimer = (idleTimer || 0) - 1;
          if (idleTimer <= 0) {
            isIdle = Math.random() < idleProb;
            idleTimer = 80 + Math.floor(Math.random() * 260);
          }

          if (!isIdle) {
            x += vx * swimSpeed * 60;
            y += Math.sin(phase + t * BOB_FREQ) * bobAmp;
            const targetTilt = Math.max(-11, Math.min(11, vx * 16));
            tilt = tilt + (targetTilt - tilt) * 0.05;

            // Gentle drift toward preferred Y band
            if (bp?.preferredYRange) {
              const midY = (prefYMin + prefYMax) / 2;
              vy += (midY - y) * 0.00008;
              vy *= 0.97;
              y += vy;
            }
          } else {
            y += Math.sin(phase + t * BOB_FREQ * 0.35) * bobAmp * 0.45;
            tilt = tilt * 0.94;
          }

          if (x > 90) { vx = -Math.abs(vx) * (0.9 + Math.random() * 0.2); flipped = true;  x = 90; }
          if (x < 5)  { vx =  Math.abs(vx) * (0.9 + Math.random() * 0.2); flipped = false; x = 5;  }
          if (y > prefYMax) { vy -= 0.01; y = Math.min(y, prefYMax + 2); }
          if (y < prefYMin) { vy += 0.01; y = Math.max(y, prefYMin - 2); }
          if (y > 82) { y = 82; vy = -Math.abs(vy); }
          if (y < 6)  { y = 6;  vy =  Math.abs(vy); }

          if (Math.random() < turnChance) {
            const dart = dartiness > 0 && Math.random() < dartiness;
            const speed = dart ? 0.12 + Math.random() * 0.14 : 0.06 + Math.random() * 0.12;
            vx = (Math.random() - 0.5) * speed;
            vy = (Math.random() - 0.5) * 0.03;
            if (Math.abs(vx) < 0.02) vx = 0.05;
            flipped = vx < 0;
          }

        // Mutate in place — no object spread, no setState
        p.x = x; p.y = y; p.vx = vx; p.vy = vy;
        p.flipped = flipped; p.tilt = tilt;
        p.isIdle = isIdle; p.idleTimer = idleTimer;
      }

      // Trigger a re-render by incrementing a cheap counter
      setFrame(f => f + 1);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // wq must be declared at component scope — it is used both in the waterBg memo
  // and directly in JSX (dirty-water overlay). Scoping it inside useMemo would make
  // it invisible to the render return, causing a ReferenceError when wq < 40.
  const wq = waterQuality;
  const waterBg = useMemo(() => {
    const r = Math.round(wq > 60 ? 14  : wq > 30 ? 30  : 60);
    const g = Math.round(wq > 60 ? 62  : wq > 30 ? 78  : 72);
    const b = Math.round(wq > 60 ? 148 : wq > 30 ? 110 : 60);
    return `linear-gradient(to bottom, rgba(${r+32},${g+32},${b+32},0.90) 0%, rgba(${r+14},${g+14},${b+10},0.96) 40%, rgba(${r},${g},${b},0.99) 72%, rgba(${Math.max(0,r-20)},${Math.max(0,g-18)},${Math.max(0,b-30)},1) 100%)`;
  }, [wq]);
  const ps = DAY_PHASE_STYLES[dayPhase.phase];

  const sortedFish = useMemo(() => [...fish].sort((a, b) => {
    const la = posRef.current[a.id]?.depthLayer ?? 1;
    const lb = posRef.current[b.id]?.depthLayer ?? 1;
    return la - lb;
  }), [fishIds]); // depth layers are set at spawn and don't change

  return (
    <div className="tank-wrapper">
      <div className="day-phase-badge">{dayPhase.label}</div>

      {/* ── Alert indicator strip (item 11) ── */}
      {(() => {
        const alerts = [];
        const sickFish   = fish.filter(f => f.disease || f.health < 30);
        const hungryFish = fish.filter(f => f.hunger > 80);
        const foodLow    = (tank?.supplies?.food ?? 10) < 3;
        const wqLow      = (waterQuality ?? 100) < 40;
        if (sickFish.length > 0)   alerts.push({ key: 'sick',   icon: '🦠', label: `${sickFish.length} sick`, cls: 'alert-pulse--red'   });
        if (hungryFish.length > 0) alerts.push({ key: 'hungry', icon: '🍽️', label: `${hungryFish.length} hungry`, cls: 'alert-pulse--orange' });
        if (foodLow)               alerts.push({ key: 'food',   icon: '🍤', label: 'Low food',  cls: 'alert-pulse--orange' });
        if (wqLow)                 alerts.push({ key: 'wq',     icon: '💧', label: 'Bad water', cls: 'alert-pulse--red'   });
        if (alerts.length === 0) return null;
        return (
          <div className="tank-alert-strip">
            {alerts.map(a => (
              <div key={a.key} className={`tank-alert-badge ${a.cls}`}>
                <span>{a.icon}</span>
                <span className="tank-alert-label">{a.label}</span>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Step 4: Glass Tank Shell with corner bolts ── */}
      <div className="tank-glass-shell">
        {CORNER_BOLTS.map(({ corner, style }) => (
          <div key={corner} className={`tank-bolt tank-bolt-${corner}`} style={style}/>
        ))}
        <div className="tank-bevel-top"/>
        <div className="tank-bevel-bottom"/>
        <div className="tank-bevel-left"/>
        <div className="tank-bevel-right"/>
        <div className="tank-glass-shimmer"/>
      </div>

      <div className="tank" style={{ background: waterBg }}>

        <div className="tank-depth-far"/>
        <div className="tank-depth-mid"/>
        <div className="tank-depth-vignette"/>
        <div className="tank-depth-bottom"/>
        <div className="tank-depth-column"/>

        {/* Light rays — expanded to 8 */}
        <div className="light-rays" style={{ opacity: ps.rayOpacity }}>
          {[0,1,2,3,4,5,6,7].map(i => <div key={i} className={`ray ray-${i}`}/>)}
        </div>

        {/* Surface ripples */}
        <div className="surface-ripple"/>
        <div className="surface-ripple surface-ripple-2"/>
        <div className="surface-ripple surface-ripple-3"/>
        <div className="surface-shimmer"/>

        {/* Caustics — 4 staggered layers */}
        <div className="caustic-layer caustic-a"/>
        <div className="caustic-layer caustic-b"/>
        <div className="caustic-layer caustic-c"/>
        <div className="caustic-layer caustic-d"/>

        {/* Ambient mid-water particles */}
        <div className="particles">
          {[0,1,2,3,4,5,6,7,8,9,10,11].map(i =>
            <div key={i} className={`particle particle-${i}`}/>
          )}
        </div>

        {ps.starCount > 0 && (
          <svg className="night-stars" viewBox="0 0 100 30" preserveAspectRatio="none">
            {STARS.slice(0, ps.starCount).map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.65"
                      className="star-twinkle" style={{ animationDelay: `${s.delay}s` }}/>
            ))}
          </svg>
        )}

        {/* Background SVG (far parallax layer) */}
        <svg className="tank-bg-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          {(dayPhase.phase === 'night' || dayPhase.phase === 'evening')
            ? <circle cx="700" cy="40" r="22" fill="rgba(255,245,200,0.18)" />
            : dayPhase.phase === 'day'
              ? <circle cx="700" cy="35" r="28" fill="rgba(255,240,150,0.12)" />
              : <ellipse cx="700" cy="40" rx="30" ry="18" fill="rgba(255,160,60,0.14)" />
          }
          {/* Step 2: far-back rock silhouettes */}
          <g opacity="0.13" fill="#0c1c36">
            <ellipse cx="140" cy="392" rx="115" ry="38"/>
            <ellipse cx="470" cy="394" rx="135" ry="32"/>
            <path d="M0,400 Q35,345 75,378 Q115,332 160,368 Q200,342 245,382 L245,400 Z"/>
            <path d="M555,400 Q595,348 638,378 Q678,338 718,362 Q758,348 800,372 L800,400 Z"/>
          </g>
          <g opacity="0.28" fill="#1a2840">
            <rect x="560" y="210" width="60" height="120"/>
            <rect x="555" y="200" width="10" height="25"/>
            <rect x="570" y="200" width="10" height="20"/>
            <rect x="585" y="200" width="10" height="25"/>
            <rect x="600" y="200" width="10" height="22"/>
            <rect x="610" y="200" width="10" height="28"/>
            <rect x="540" y="260" width="35" height="70"/>
            <rect x="537" y="252" width="8" height="18"/>
            <rect x="548" y="252" width="8" height="14"/>
            <rect x="558" y="252" width="8" height="18"/>
            <rect x="572" y="235" width="14" height="18" fill="#0a1828" opacity="0.6"/>
            <rect x="590" y="235" width="14" height="18" fill="#0a1828" opacity="0.6"/>
            <rect x="548" y="278" width="10" height="14" fill="#0a1828" opacity="0.6"/>
            <path d="M572,330 L572,310 Q579,300 586,310 L586,330 Z" fill="#0a1828" opacity="0.6"/>
          </g>
          {[680,720,760].map((x,i) => (
            <path key={i} d={`M${x},400 C${x+15},350 ${x-10},300 ${x+20},240 C${x+35},190 ${x+5},160 ${x+25},120`}
                  stroke="#1a5030" strokeWidth="6" fill="none" opacity="0.22"
                  style={{animationDelay:`${i*0.8}s`}} className="kelp-sway"/>
          ))}
          <ellipse cx="100" cy="390" rx="70" ry="30" fill="#1a3050" opacity="0.3"/>
          <ellipse cx="300" cy="395" rx="90" ry="25" fill="#152840" opacity="0.25"/>
          <ellipse cx="650" cy="390" rx="80" ry="28" fill="#1a3050" opacity="0.28"/>
          {/* Step 2: Mid-ground coral silhouettes */}
          <g opacity="0.30" fill="#162848">
            <path d="M28,400 Q43,358 33,318 Q48,288 38,258 Q53,278 48,318 Q58,358 73,400 Z"/>
            <path d="M348,400 Q368,378 358,348 Q378,323 363,298 Q383,318 373,353 Q388,373 398,400 Z"/>
          </g>
        </svg>

        {/* Foreground SVG */}
        <svg className="tank-fg-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          {/* Step 2: Sandy bottom with 3D bump shading */}
          <ellipse cx="400" cy="432" rx="490" ry="62" fill="#6a4820" opacity="0.45"/>
          <ellipse cx="400" cy="422" rx="465" ry="55" fill="#7a5828"/>
          <ellipse cx="400" cy="416" rx="452" ry="46" fill="#8a6830"/>
          <ellipse cx="400" cy="411" rx="440" ry="38" fill="#9a7840"/>
          <ellipse cx="400" cy="406" rx="428" ry="28" fill="#aa8848"/>
          <ellipse cx="400" cy="402" rx="415" ry="20" fill="#be9a58"/>
          {/* Sandy top highlight — 3D bump from above */}
          <ellipse cx="370" cy="400" rx="290" ry="12" fill="#d0ac68" opacity="0.50"/>
          <ellipse cx="330" cy="399" rx="170" ry="7"  fill="#deba76" opacity="0.28"/>
          {/* Sand ripples */}
          {[55,118,182,248,315,385,455,525,595,658,718].map((x,i) => (
            <ellipse key={i} cx={x+(i%3)*4} cy={406+(i%4)*2} rx={9+i%7} ry={3+(i%3)*0.7}
              fill={['#b09050','#c09860','#cfa060','#9e7c38','#a88040'][i%5]} opacity="0.70"/>
          ))}
          {Array.from({length:16},(_, i)=>(
            <circle key={i} cx={48+i*47+(i%3)*6} cy={405+(i%4)*3}
              r={0.8+(i%3)*0.5}
              fill={['#ba9052','#cca858','#c29655'][i%3]} opacity="0.48"/>
          ))}
          <g transform="translate(80,320)">
            <ellipse cx="0" cy="60" rx="32" ry="22" fill="#c06840"/>
            <ellipse cx="0" cy="55" rx="28" ry="18" fill="#d07848"/>
            {[[-12,0],[0,-8],[12,0],[0,8],[-8,-4],[8,-4]].map(([dx,dy],i)=>(
              <path key={i} d={`M${dx-6},${55+dy} Q${dx},${50+dy} ${dx+6},${55+dy}`}
                    stroke="#b05830" strokeWidth="1.5" fill="none" opacity="0.6"/>
            ))}
            <path d="M-40,70 C-45,40 -35,20 -38,0" stroke="#e08040" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M-40,70 C-30,35 -20,18 -22,2" stroke="#d07030" strokeWidth="7" fill="none" strokeLinecap="round"/>
            <path d="M-40,70 C-50,30 -55,12 -52,-5" stroke="#e09050" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <circle cx="-38" cy="0"  r="5" fill="#ff9060"/>
            <circle cx="-22" cy="2"  r="5" fill="#ff8050"/>
            <circle cx="-52" cy="-5" r="4" fill="#ffa070"/>
            <circle cx="40" cy="62" r="18" fill="#e05050"/>
            <circle cx="40" cy="58" r="14" fill="#f06060"/>
            {[0,45,90,135,180,225,270,315].map((deg,i)=>(
              <circle key={i} cx={40+12*Math.cos(deg*Math.PI/180)} cy={58+12*Math.sin(deg*Math.PI/180)}
                      r="3" fill="#d04040" opacity="0.7"/>
            ))}
          </g>
          <g transform="translate(390,350)">
            <ellipse cx="0" cy="40" rx="22" ry="12" fill="#c05080"/>
            {[-25,-16,-8,0,8,16,25].map((dx,i) => (
              <g key={i}>
                <path d={`M${dx},42 C${dx+(i%2===0?-5:5)},20 ${dx+(i%2===0?3:-3)},5 ${dx},0`}
                      stroke="#e060a0" strokeWidth="3.5" fill="none" strokeLinecap="round"
                      style={{transformOrigin:`${dx}px 42px`}} className="anemone-tentacle"/>
                <circle cx={dx} cy={0} r="4" fill="#ff80c0" opacity="0.9"/>
              </g>
            ))}
          </g>
          <g transform="translate(660,0)">
            {[0,22,44].map((x,i) => (
              <path key={i} d={`M${x+10},400 C${x+20},340 ${x},280 ${x+25},210 C${x+40},155 ${x+15},120 ${x+30},70`}
                    stroke={['#2d8050','#359060','#28704a'][i]} strokeWidth={8-i*2} fill="none" strokeLinecap="round"
                    className="kelp-sway" style={{animationDelay:`${i*0.6}s`}}/>
            ))}
            <path d="M100,400 L100,280" stroke="#c87840" strokeWidth="5" strokeLinecap="round"/>
            {[280,300,320,340,360,380].map((y,i) => (
              <path key={i} d={`M100,${y} Q${100+30*(i%2===0?1:-1)},${y-15} ${100+55*(i%2===0?1:-1)},${y}`}
                    stroke="#d08040" strokeWidth="2.5" fill="none" opacity="0.8"/>
            ))}
          </g>
          <ellipse cx="250" cy="400" rx="28" ry="16" fill="#506070"/>
          <ellipse cx="255" cy="396" rx="24" ry="12" fill="#607080"/>
          <ellipse cx="248" cy="393" rx="11"  ry="4"  fill="#788898" opacity="0.38"/>
          <ellipse cx="500" cy="402" rx="20" ry="12" fill="#485868"/>
          <ellipse cx="505" cy="398" rx="16" ry="9"  fill="#586878"/>
          <ellipse cx="500" cy="395" rx="8"  ry="3.5" fill="#6a7a8a" opacity="0.38"/>
          <circle cx="82"  cy="310" r="3"   fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" className="deco-bubble deco-b1"/>
          <circle cx="390" cy="340" r="2.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" className="deco-bubble deco-b2"/>
          <circle cx="672" cy="370" r="2"   fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="deco-bubble deco-b3"/>
          {(tank?.decorations?.placed || []).map(item => {
            const decor = getDecorById(item.type);
            if (!decor) return null;
            return (
              <g key={item.instanceId}
                 dangerouslySetInnerHTML={{ __html: decor.svgFn(item.x, item.y, item.scale) }}
              />
            );
          })}
        </svg>

        <div className="bubbles">
          {/* Large wobbling bubbles */}
          {[0,1,2,3].map(i => <div key={`lg-${i}`} className={`bubble bubble-lg bubble-lg-${i}`}/>)}
          {/* Mid bubbles */}
          {[0,1,2,3,4].map(i => <div key={`md-${i}`} className={`bubble bubble-md bubble-md-${i}`}/>)}
          {/* Micro bubbles */}
          {[0,1,2,3,4,5,6].map(i => <div key={`sm-${i}`} className={`bubble bubble-sm bubble-sm-${i}`}/>)}
          {/* Cluster bursts */}
          {[0,1].map(i => <div key={`cl-${i}`} className={`bubble bubble-cluster bubble-cl-${i}`}/>)}
        </div>

        <div className="day-night-overlay" style={{ background: ps.overlay }}/>

        {/* Step 2 & 6: Fish rendered sorted by depth, with tilt + animation */}
        {sortedFish.map(f => {
          const pos = positions[f.id] || { x: f.x??50, y: f.y??40, flipped: false, depthLayer: 1, tilt: 0, isIdle: false };
          const isSelected = f.id === selectedFishId;
          const layer = DEPTH_LAYERS[pos.depthLayer ?? 1];
          const baseSize = f.phenotype?.size === 'Giant' ? 76 : f.stage === 'egg' ? 36 : 54;
          const spriteSize = Math.round(baseSize * layer.scale);
          const tiltAngle = pos.flipped ? -(pos.tilt || 0) : (pos.tilt || 0);
          const animClass = pos.isIdle ? 'fish-idle' : 'fish-swimming';
          const depthLayer = pos.depthLayer ?? 1;
          // Build depth filter inline so it overrides nothing and composes cleanly
          let depthFilter = '';
          if (depthLayer === 0) depthFilter = 'saturate(0.72) brightness(0.88) blur(0.7px) ';
          else if (layer.blur > 0) depthFilter = `blur(${layer.blur}px) `;
          const glowStr = isSelected ? 'drop-shadow(0 0 8px rgba(240,192,64,0.6))' : '';
          const isHovered = f.id === hoveredFishId;
          const healthPct = Math.round(f.health ?? 100);
          const satiety   = Math.max(0, 100 - Math.round(f.hunger ?? 0));
          const tooltipSide = pos.x > 65 ? 'left' : 'right';

          return (
            <div key={f.id}
              className={`fish-container ${isSelected ? 'selected' : ''} depth-layer-${depthLayer}${f.disease ? ' fish-diseased' : ''}`}
              style={{
                left: `${pos.x}%`,
                top:  `${pos.y}%`,
                opacity: layer.opacity,
                zIndex:  isSelected ? 30 : isHovered ? 25 : layer.z,
                filter: (depthFilter + glowStr).trim() || undefined,
                transform: `translate(-50%, -50%) rotate(${tiltAngle}deg)`,
              }}
              onMouseEnter={() => setHoveredFishId(f.id)}
              onMouseLeave={() => setHoveredFishId(null)}
              onClick={() => onSelectFish(f.id === selectedFishId ? null : f.id)}>
              <div className={`fish-anim-inner ${animClass}`}>
                <FishSprite fish={f} size={spriteSize} flipped={pos.flipped} selected={isSelected}/>
              </div>
              {f.stage !== 'adult' && <div className="stage-badge">{f.stage}</div>}
              {f.hunger > 75 && <div className="hunger-indicator">🍽️</div>}
              {f.health < 30  && <div className="sick-indicator">💔</div>}
              {f.disease && <div className="disease-indicator">🦠</div>}

              {/* Hover tooltip */}
              {isHovered && (
                <div className={`fish-tooltip fish-tooltip--${tooltipSide}`}>
                  <div className="fish-tooltip-name">{f.species?.name || 'Unknown'}</div>
                  <div className="fish-tooltip-row">
                    <span>❤</span>
                    <div className="fish-tooltip-bar">
                      <div className="fish-tooltip-fill" style={{
                        width: `${healthPct}%`,
                        background: healthPct > 60 ? '#3ddba0' : healthPct > 30 ? '#f5c542' : '#ff5566'
                      }}/>
                    </div>
                    <span className="fish-tooltip-val">{healthPct}%</span>
                  </div>
                  <div className="fish-tooltip-row">
                    <span>🍤</span>
                    <div className="fish-tooltip-bar">
                      <div className="fish-tooltip-fill" style={{
                        width: `${satiety}%`,
                        background: satiety > 60 ? '#5db8e8' : satiety > 30 ? '#f5a742' : '#ff6055'
                      }}/>
                    </div>
                    <span className="fish-tooltip-val">{satiety}%</span>
                  </div>
                  {f.disease && <div className="fish-tooltip-disease">🦠 {f.disease}</div>}
                </div>
              )}
            </div>
          );
        })}

        {fish.length === 0 && (
          <div className="empty-tank">
            <p>Your tank is empty.</p>
            <p>Breed some fish to get started!</p>
          </div>
        )}

        {wq < 40 && (
          <div className="dirty-water" style={{ opacity: (40 - wq) / 40 * 0.45 }}/>
        )}

        {/* Step 4: Glass reflections */}
        <div className="tank-glass-left"/>
        <div className="tank-glass-right"/>
        <div className="tank-glass-top"/>
        <div className="tank-glass-bottom-fade"/>
      </div>
    </div>
  );
}
