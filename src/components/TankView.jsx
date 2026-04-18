import { PERSONALITY_EMOJI, SPRITE_SIZE, EGG_HATCH_ANIM_MS } from '../data/constants.js';
import { rollMicroEvent } from '../systems/microEvents.js';
import { useGameStore } from '../store/gameStore.js';
// ============================================================
// FISH TYCOON 2 — TANK VIEW (Phase 11: Pseudo-3D Visual Overhaul)
// ============================================================

import React, { useEffect, useRef, useState, useMemo } from 'react';
import FishSprite from './FishSprite.jsx';
import { getDecorById, getThemeById } from '../data/decorations.js';
import { getBackground } from '../data/tankBackgrounds.js';
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

function getDayPhase(gc) {
  const d = gc ? new Date(gc) : new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 5  && h < 7)  return { phase: 'dawn',    label: 'DAWN'    };
  if (h >= 7  && h < 17) return { phase: 'day',     label: 'DAY'     };
  if (h >= 17 && h < 20) return { phase: 'dusk',    label: 'DUSK'    };
  if (h >= 20 && h < 22) return { phase: 'evening', label: 'EVE'  };
  return                         { phase: 'night',   label: 'NIGHT'   };
}

const DAY_PHASE_STYLES = {
  dawn:    { overlay: 'linear-gradient(180deg, rgba(255,140,50,0.25) 0%, rgba(255,100,30,0.08) 100%)', rayOpacity: 0.6, starCount: 0  },
  day:     { overlay: 'rgba(160,210,240,0.04)', rayOpacity: 0.95, starCount: 0  },
  dusk:    { overlay: 'linear-gradient(180deg, rgba(200,60,20,0.28) 0%, rgba(120,30,60,0.15) 100%)', rayOpacity: 0.35, starCount: 0  },
  evening: { overlay: 'linear-gradient(180deg, rgba(30,15,60,0.35) 0%, rgba(10,10,40,0.20) 100%)', rayOpacity: 0.15, starCount: 5  },
  night:   { overlay: 'linear-gradient(180deg, rgba(5,5,30,0.45) 0%, rgba(0,0,15,0.30) 100%)', rayOpacity: 0.08, starCount: 12 },
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

export default function TankView({ fish, selectedFishId, onSelectFish, waterQuality, tank, listedFishIds = [] }) {
  // Keep a ref so the animation loop (which has no deps) can read behavior profiles
  const fishMapRef = useRef({});

  // Memoize fishMap and fishIdSet — only rebuild when fish ids change
  const fishIds = fish.map(f => f.id).join(',');
  const fishIdSet = useMemo(() => new Set(fish.map(f => f.id)), [fishIds]); // eslint-disable-line react-hooks/exhaustive-deps
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
    const ids = fishIdSet;
    for (const id of Object.keys(pos)) {
      if (!ids.has(id)) delete pos[id];
    }
  }, [fishIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Convenience alias for reading positions in render (ref value, not state)
  const positions = posRef.current;

  const gameClock = useGameStore(s => s.gameClock);
  const [dayPhase, setDayPhase] = useState(() => getDayPhase(gameClock));
  const [hoveredFishId, setHoveredFishId] = useState(null);
  const [ripples, setRipples] = useState([]);      // click ripple effects
  const [feedSplash, setFeedSplash] = useState(0);  // feed particle trigger
  const [sparkles, setSparkles] = useState([]);     // sale sparkle effects
  const [justClickedId, setJustClickedId] = useState(null); // fish click wiggle
  const [clickBubbles, setClickBubbles] = useState([]);      // click bubble burst
  const [swimBubbles, setSwimBubbles] = useState([]);        // exhale bubble trails
  const [coinShowers, setCoinShowers] = useState([]);         // sale coin shower
  const [speechBubbles, setSpeechBubbles] = useState([]);     // sale speech bubbles
  const cursorRef = useRef({ x: -100, y: -100 });   // cursor position in % coords
  const tankElRef = useRef(null);
  const tickRef = useRef(0);

  // ── Swim bubble trails ─────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const positions = posRef.current;
      const alive = fish.filter(f => f.stage !== 'egg');
      if (alive.length === 0) return;
      // Pick a random fish to emit a bubble
      const f = alive[Math.floor(Math.random() * alive.length)];
      const pos = positions[f.id];
      if (!pos || pos.isIdle) return;
      const bx = pos.flipped ? pos.x - 2 : pos.x + 2;
      const by = pos.y - 1;
      const bid = `sb-${Date.now()}-${Math.random()}`;
      setSwimBubbles(prev => [...prev.slice(-12), {
        id: bid, x: bx, y: by,
        size: 2 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 3,
      }]);
      setTimeout(() => setSwimBubbles(prev => prev.filter(b => b.id !== bid)), 2000);
    }, 300);
    return () => clearInterval(interval);
  }, [fish]);

  // ── Micro-events (pearl finds, nuzzles, etc.) ────────
  const [microEvents, setMicroEvents] = useState([]);
  const lastMicroRef = useRef(0);
  const claimMicroEvent = useGameStore(s => s.claimMicroEvent);
  const weather = useGameStore(s => s.weather);

  useEffect(() => {
    const interval = setInterval(() => {
      const evt = rollMicroEvent(fish, tank?.id, lastMicroRef.current);
      if (evt) {
        lastMicroRef.current = Date.now();
        setMicroEvents(prev => [...prev.slice(-3), evt]);
        // Auto-expire
        setTimeout(() => {
          setMicroEvents(prev => prev.filter(e => e.id !== evt.id));
        }, evt.duration);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fish, tank?.id]);

  const handleMicroTap = (evt) => {
    claimMicroEvent(evt.id, evt.coins, evt.xp);
    setMicroEvents(prev => prev.map(e =>
      e.id === evt.id ? { ...e, tapped: true } : e
    ));
    setTimeout(() => {
      setMicroEvents(prev => prev.filter(e => e.id !== evt.id));
    }, 500);
  };

  useEffect(() => {
    setDayPhase(getDayPhase(gameClock));
  }, [gameClock]);

  // ── Cursor tracking (convert pixel → % of tank) ────────
  const handleTankMouseMove = (e) => {
    const rect = tankElRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;
    cursorRef.current = { x: px, y: py };
    // Set parallax CSS vars for background layers
    const el = tankElRef.current;
    if (el) {
      el.style.setProperty('--parallax-x', `${(px - 50) * 0.03}px`);
      el.style.setProperty('--parallax-y', `${(py - 50) * 0.02}px`);
    }
  };
  const handleTankMouseLeave = () => {
    cursorRef.current = { x: -100, y: -100 };
    const el = tankElRef.current;
    if (el) {
      el.style.setProperty('--parallax-x', '0px');
      el.style.setProperty('--parallax-y', '0px');
    }
  };

  // ── Click ripple ───────────────────────────────────────
  const handleTankClick = (e) => {
    const rect = tankElRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const id = Date.now();
    setRipples(prev => [...prev.slice(-4), { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1200);
  };

  // ── Feed splash trigger (listen for food changes) ──────
  const wq = waterQuality;  // declared early — used by prevWqRef and waterBg memo
  const prevFoodRef = useRef(tank?.supplies?.food ?? 0);
  useEffect(() => {
    const food = tank?.supplies?.food ?? 0;
    if (food < prevFoodRef.current) {
      setFeedSplash(Date.now());
    }
    prevFoodRef.current = food;
  }, [tank?.supplies?.food]);

  // ── Water treatment effect (listen for WQ jumps) ───────
  const [treatmentFlash, setTreatmentFlash] = useState(0);
  const prevWqRef = useRef(wq);
  useEffect(() => {
    if (wq > prevWqRef.current + 5) {
      setTreatmentFlash(Date.now());
      setTimeout(() => setTreatmentFlash(0), 2500);
    }
    prevWqRef.current = wq;
  }, [wq]);

  // ── Sale sparkle trigger (listen for fish removal) ──────
  const SALE_PHRASES = ['Thanks!', 'Perfect!', 'Love it!', 'Beautiful!', 'Amazing!', 'So pretty!'];
  const prevFishIdsRef = useRef(new Set(fishIdSet));
  useEffect(() => {
    const currentIds = fishIdSet;
    for (const id of prevFishIdsRef.current) {
      if (!currentIds.has(id) && positions[id]) {
        const pos = positions[id];
        const sparkleId = Date.now() + Math.random();
        setSparkles(prev => [...prev.slice(-3), { id: sparkleId, x: pos.x, y: pos.y }]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== sparkleId)), 1500);

        // Coin shower
        const showerId = sparkleId + 0.1;
        setCoinShowers(prev => [...prev.slice(-2), { id: showerId, x: pos.x, y: pos.y }]);
        setTimeout(() => setCoinShowers(prev => prev.filter(s => s.id !== showerId)), 1500);

        // Speech bubble
        const speechId = sparkleId + 0.2;
        const phrase = SALE_PHRASES[Math.floor(Math.random() * SALE_PHRASES.length)];
        setSpeechBubbles(prev => [...prev.slice(-1), { id: speechId, x: pos.x, y: pos.y - 8, text: phrase }]);
        setTimeout(() => setSpeechBubbles(prev => prev.filter(s => s.id !== speechId)), 2000);
      }
    }
    prevFishIdsRef.current = currentIds;
  }, [fishIds]); // eslint-disable-line react-hooks/exhaustive-deps

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
            // Assign idle behavior type
            if (isIdle) {
              if (y > 75 && Math.random() < 0.4) {
                p.idleBehavior = 'nibble'; // nibble at sand
              } else if (y < 25 && Math.random() < 0.3) {
                p.idleBehavior = 'surface'; // explore surface
              } else if (Math.random() < 0.2) {
                p.idleBehavior = 'explore'; // slow drift toward a plant
              } else {
                p.idleBehavior = 'rest';
              }
            }
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
            const idleBehavior = p.idleBehavior || 'rest';
            if (idleBehavior === 'nibble') {
              // Tilt nose down, tiny bobs near sand
              y += Math.sin(phase + t * BOB_FREQ * 0.5) * bobAmp * 0.2;
              tilt = tilt + (15 - tilt) * 0.03; // nose down
              if (y < 82) y += 0.03; // drift toward sand
            } else if (idleBehavior === 'surface') {
              // Drift up toward surface
              y += Math.sin(phase + t * BOB_FREQ * 0.4) * bobAmp * 0.3;
              tilt = tilt + (-8 - tilt) * 0.02; // nose slightly up
              if (y > 12) y -= 0.02;
            } else if (idleBehavior === 'explore') {
              // Slow horizontal drift
              x += Math.sin(phase + t * 0.001) * 0.015;
              y += Math.sin(phase + t * BOB_FREQ * 0.3) * bobAmp * 0.3;
              tilt = tilt * 0.96;
            } else {
              // Rest: gentle bob
              y += Math.sin(phase + t * BOB_FREQ * 0.35) * bobAmp * 0.45;
              tilt = tilt * 0.94;
            }
          }

          // ── Personality + cursor interaction ─────────────────
          const personality = fishObj?.personality || 'shy';
          const cursor = cursorRef.current;
          const cdx = x - cursor.x;
          const cdy = y - cursor.y;
          const cDist = Math.sqrt(cdx * cdx + cdy * cdy);

          if (personality === 'curious' && cDist < 25 && cDist > 2) {
            // Curious fish FOLLOW the cursor
            const force = (25 - cDist) / 25 * 0.04;
            vx -= (cdx / cDist) * force;
            vy -= (cdy / cDist) * force * 0.5;
          } else if (cDist < 15 && cDist > 0.5) {
            // All others flee
            const force = (15 - cDist) / 15 * (personality === 'shy' ? 0.12 : 0.08);
            vx += (cdx / cDist) * force;
            vy += (cdy / cDist) * force * 0.5;
          }

          // Aggressive: chase nearest fish
          if (personality === 'aggressive' && t % 30 === 0) {
            let closest = null, closestDist = 20;
            for (const otherId of Object.keys(pos)) {
              if (otherId === id) continue;
              const o = pos[otherId];
              const d = Math.sqrt((x - o.x) ** 2 + (y - o.y) ** 2);
              if (d < closestDist) { closest = o; closestDist = d; }
            }
            if (closest) {
              vx += (closest.x - x) * 0.003;
              vy += (closest.y - y) * 0.002;
            }
          }

          // Social: drift toward cluster center
          if (personality === 'social' && t % 60 === 0) {
            let sumX = 0, sumY = 0, n = 0;
            for (const otherId of Object.keys(pos)) {
              if (otherId === id) continue;
              sumX += pos[otherId].x; sumY += pos[otherId].y; n++;
            }
            if (n > 0) {
              vx += (sumX / n - x) * 0.002;
              vy += (sumY / n - y) * 0.001;
            }
          }

          // Playful: occasional speed burst
          if (personality === 'playful' && Math.random() < 0.003) {
            vx *= 2.5;
          }

          // Lazy: override idle probability
          if (personality === 'lazy') {
            if (!isIdle && Math.random() < 0.01) { isIdle = true; idleTimer = 200; }
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
  const waterBg = useMemo(() => {
    // Custom background from tankBackgrounds system
    if (tank?.backgroundId) {
      const bg = getBackground(tank.backgroundId);
      if (bg) return bg.gradient;
    }
    const theme = getThemeById(tank?.themes?.active || 'tropical');
    const stops = theme.waterGradient;
    // Blend wq degradation: as quality drops the water shifts murky brown
    const wqFactor = wq / 100; // 1 = pristine, 0 = filthy
    const murkR = Math.round((1 - wqFactor) * 30);
    const murkG = Math.round((1 - wqFactor) * 10);
    const murkB = Math.round(-(1 - wqFactor) * 15);
    const blend = (hex, opacity) => {
      const r = parseInt(hex.slice(1,3),16);
      const g = parseInt(hex.slice(3,5),16);
      const b = parseInt(hex.slice(5,7),16);
      const nr = Math.min(255, Math.max(0, r + murkR));
      const ng = Math.min(255, Math.max(0, g + murkG));
      const nb = Math.min(255, Math.max(0, b + murkB));
      return `rgba(${nr},${ng},${nb},${opacity})`;
    };
    const gradStops = stops.map(s => `${blend(s.color, s.opacity)} ${s.offset}`).join(', ');
    return `linear-gradient(to bottom, ${gradStops})`;
  }, [wq, tank?.themes?.active]);
  const ps = DAY_PHASE_STYLES[dayPhase.phase];

  // ── Helper: build fish container class list ─────────────
  function fishClasses(f, isSelected, depthLayer, pos) {
    const cls = ['fish-container', `depth-layer-${depthLayer}`];
    if (isSelected) cls.push('selected');
    if (f.disease) cls.push('fish-diseased');
    if (pos.isIdle) {
      cls.push('fish-idle-active');
      if (pos.idleBehavior) cls.push(`fish-idle--${pos.idleBehavior}`);
    }
    if (f.hunger > 70) cls.push('fish-hungry');
    if ((f.health || 100) < 30) cls.push('fish-critical');
    if (f.stage === 'egg') {
      cls.push('fish-egg');
      if (gameClock - (f.bornAt || 0) > EGG_HATCH_ANIM_MS) cls.push('egg-hatching');
    }
    if (f.species?.rarity === 'legendary') cls.push('fish-legendary');
    else if (f.species?.rarity === 'epic') cls.push('fish-epic');
    // Mutation visual effects
    const mut = f.phenotype?.mutation;
    if (mut && mut !== 'None') cls.push(`fish-mut--${mut.toLowerCase().replace(/[^a-z]/g, '')}`);
    // Purity glow for high-purity fish
    if (f.genome) {
      let pure = 0, total = 0;
      for (const g of Object.keys(f.genome)) { total++; if (f.genome[g][0] === f.genome[g][1]) pure++; }
      if (pure === total && total > 0) cls.push('fish-purity--perfected');
      else if (pure >= 5) cls.push('fish-purity--pure');
    }
    return cls.join(' ');
  }

  const sortedFish = useMemo(() => [...fish].sort((a, b) => {
    const la = posRef.current[a.id]?.depthLayer ?? 1;
    const lb = posRef.current[b.id]?.depthLayer ?? 1;
    return la - lb;
  }), [fishIds]); // depth layers are set at spawn and don't change

  const tankShape = tank?.size === 'huge' ? 'panoramic' : tank?.size === 'mega' ? 'cylinder' : tank?.size === 'large' ? 'wide' : 'standard';

  return (
    <div className={`tank-wrapper tank-shape--${tankShape}`}>
      <div className="day-phase-badge">{dayPhase.label}</div>

      {/* ── Alert indicator strip (item 11) ── */}
      {(() => {
        const alerts = [];
        const sickFish   = fish.filter(f => f.disease || f.health < 30);
        const hungryFish = fish.filter(f => f.hunger > 80);
        const foodLow    = (tank?.supplies?.food ?? 10) < 3;
        const wqLow      = (waterQuality ?? 100) < 40;
        if (sickFish.length > 0)   alerts.push({ key: 'sick',   icon: '', label: `${sickFish.length} sick`, cls: 'alert-pulse--red'   });
        if (hungryFish.length > 0) alerts.push({ key: 'hungry', icon: '', label: `${hungryFish.length} hungry`, cls: 'alert-pulse--orange' });
        if (foodLow)               alerts.push({ key: 'food',   icon: '', label: 'Low food',  cls: 'alert-pulse--orange' });
        if (wqLow)                 alerts.push({ key: 'wq',     icon: '', label: 'Bad water', cls: 'alert-pulse--red'   });
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
        {/* Corner glints — tiny SVG arc highlights at each bolt position */}
        {CORNER_BOLTS.map(({ corner, style }) => {
          // Arc sweep direction varies by corner to catch the light naturally
          const isRight  = corner === 'tr' || corner === 'br';
          const isBottom = corner === 'bl' || corner === 'br';
          const cx = 6, cy = 6;
          // 45° arc tangent point offsets
          const dx = isRight  ?  4 : -4;
          const dy = isBottom ?  4 : -4;
          const sweep = (isRight !== isBottom) ? 1 : 0;
          return (
            <svg
              key={`glint-${corner}`}
              className={`tank-corner-glint tank-corner-glint-${corner}`}
              style={{ ...style, position: 'absolute', width: 16, height: 16, pointerEvents: 'none' }}
              viewBox="0 0 16 16"
              overflow="visible">
              <path
                d={`M${cx + dx},${cy} A6,6,45,0,${sweep},${cx},${cy + dy}`}
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          );
        })}
        <div className="tank-bevel-top"/>
        <div className="tank-bevel-bottom"/>
        <div className="tank-bevel-left"/>
        <div className="tank-bevel-right"/>
        <div className="tank-glass-shimmer"/>
      </div>

      <div className="tank" ref={tankElRef} style={{ background: waterBg }}
        onMouseMove={handleTankMouseMove}
        onMouseLeave={handleTankMouseLeave}
        onClick={handleTankClick}
      >

        {/* ── SVG water distortion filter (applied to entire tank content) ── */}
        <svg className="tank-distortion-defs" width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <filter id="waterDistortion" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018"
                numOctaves="3" seed="42" result="noise">
                <animate attributeName="baseFrequency" values="0.012 0.018;0.015 0.022;0.012 0.018"
                  dur="8s" repeatCount="indefinite"/>
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6"
                xChannelSelector="R" yChannelSelector="G"/>
            </filter>
            {/* Volumetric light cone */}
            <linearGradient id="godRayGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)"/>
              <stop offset="40%" stopColor="rgba(255,255,255,0.06)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
            </linearGradient>
          </defs>
        </svg>

        {/* Distortion wrapper — wraps fish + decorations for underwater shimmer */}
        <div className="tank-distortion-layer">

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

        {/* Animated water surface wave */}
        <div className="water-surface">
          <svg viewBox="0 0 1600 30" preserveAspectRatio="none">
            <path d="M0,15 C100,5 200,25 400,12 C600,0 700,28 900,15 C1100,2 1200,22 1400,10 C1500,5 1600,18 1600,15 L1600,0 L0,0 Z"
              fill="rgba(10,25,60,0.85)"/>
            <path d="M0,18 C150,8 250,26 450,14 C650,3 750,25 950,16 C1150,5 1250,24 1450,12 C1550,8 1600,20 1600,18 L1600,0 L0,0 Z"
              fill="rgba(10,25,60,0.4)"/>
          </svg>
        </div>

        {/* Glass reflections */}
        <div className="glass-reflections">
          <div className="glass-streak glass-streak-1"/>
          <div className="glass-streak glass-streak-2"/>
          <div className="glass-streak glass-streak-3"/>
          <div className="glass-streak glass-streak-4"/>
        </div>

        {/* Water depth fog */}
        <div className="water-depth-fog"/>

        {/* Enhanced environment layers */}
        <div className="tank-sand-detail"/>
        <div className="caustic-floor"/>
        <div className="tank-highlight-top"/>

        {/* Water surface line */}
        <svg className="water-surface" viewBox="0 0 800 20" preserveAspectRatio="none">
          <path className="water-surface-wave wave-1" d="M0,10 Q100,2 200,10 Q300,18 400,10 Q500,2 600,10 Q700,18 800,10 L800,0 L0,0 Z" fill="rgba(100,180,255,0.08)"/>
          <path className="water-surface-wave wave-2" d="M0,12 Q100,5 200,12 Q300,19 400,12 Q500,5 600,12 Q700,19 800,12 L800,0 L0,0 Z" fill="rgba(140,200,255,0.05)"/>
          <line className="water-surface-line" x1="0" y1="10" x2="800" y2="10" stroke="rgba(180,220,255,0.15)" strokeWidth="1.5"/>
        </svg>

        {/* Swaying plants/seaweed */}
        <svg className="tank-plants" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="plantGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2a8040" stopOpacity="0.7"/>
              <stop offset="100%" stopColor="#1a5028" stopOpacity="0.9"/>
            </linearGradient>
            <linearGradient id="plantGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3a9050" stopOpacity="0.6"/>
              <stop offset="100%" stopColor="#206030" stopOpacity="0.8"/>
            </linearGradient>
          </defs>
          {/* Left cluster */}
          <path className="seaweed sw-1" d="M60,400 Q55,340 65,300 Q58,260 62,220 Q68,190 60,160" fill="none" stroke="url(#plantGrad1)" strokeWidth="5" strokeLinecap="round"/>
          <path className="seaweed sw-2" d="M75,400 Q80,350 72,310 Q78,270 70,240" fill="none" stroke="url(#plantGrad2)" strokeWidth="4" strokeLinecap="round"/>
          <path className="seaweed sw-3" d="M50,400 Q45,360 55,330 Q48,300 52,270" fill="none" stroke="url(#plantGrad1)" strokeWidth="3.5" strokeLinecap="round"/>
          {/* Right cluster */}
          <path className="seaweed sw-4" d="M720,400 Q725,345 715,300 Q722,265 718,230 Q710,200 720,170" fill="none" stroke="url(#plantGrad2)" strokeWidth="5" strokeLinecap="round"/>
          <path className="seaweed sw-5" d="M740,400 Q735,355 745,320 Q738,285 742,250" fill="none" stroke="url(#plantGrad1)" strokeWidth="4" strokeLinecap="round"/>
          {/* Center coral */}
          <path className="seaweed sw-6" d="M400,400 Q395,370 405,345 Q398,320 402,295" fill="none" stroke="rgba(180,80,100,0.5)" strokeWidth="4.5" strokeLinecap="round"/>
          <path className="seaweed sw-7" d="M385,400 Q390,365 382,340" fill="none" stroke="rgba(200,100,120,0.4)" strokeWidth="3" strokeLinecap="round"/>
        </svg>

        {/* Glass frame overlay */}
        <div className="tank-glass-frame"/>
        <div className="dust-motes">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="dust-mote" style={{
              left: `${(i * 29 + 7) % 95}%`,
              top: `${(i * 43 + 15) % 80 + 10}%`,
              animationDelay: `${(i * 1.7) % 10}s`,
              animationDuration: `${8 + (i % 5) * 3}s`,
            }}/>
          ))}
        </div>
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

        {/* Background SVG (far parallax layer) — driven by active tank theme */}
        <svg className="tank-bg-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          {(dayPhase.phase === 'night' || dayPhase.phase === 'evening')
            ? <circle cx="700" cy="40" r="22" fill="rgba(255,245,200,0.18)" />
            : dayPhase.phase === 'day'
              ? <circle cx="700" cy="35" r="28" fill="rgba(255,240,150,0.12)" />
              : <ellipse cx="700" cy="40" rx="30" ry="18" fill="rgba(255,160,60,0.14)" />
          }
          {/* Theme scenery layer */}
          <g dangerouslySetInnerHTML={{ __html: getThemeById(tank?.themes?.active || 'tropical').bgSvgFn() }} />
          {/* Layered sand/substrate gradient strip */}
          <defs>
            <linearGradient id="sandSubstrateGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#c8a862" stopOpacity="0.00"/>
              <stop offset="18%"  stopColor="#b89050" stopOpacity="0.18"/>
              <stop offset="42%"  stopColor="#a07838" stopOpacity="0.32"/>
              <stop offset="68%"  stopColor="#886030" stopOpacity="0.50"/>
              <stop offset="85%"  stopColor="#6a4420" stopOpacity="0.70"/>
              <stop offset="100%" stopColor="#3c2408" stopOpacity="0.88"/>
            </linearGradient>
          </defs>
          <rect x="0" y="330" width="800" height="70" fill="url(#sandSubstrateGrad)"/>
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
          {(() => {
            const activeTheme = getThemeById(tank?.themes?.active || 'tropical');
            const substrateDecor = activeTheme.substrateId ? getDecorById(activeTheme.substrateId) : null;
            if (!substrateDecor) return null;
            // Tile three instances across the floor for full coverage at natural scale
            const tiles = [
              { x: 140, y: 405, s: 2.8 },
              { x: 400, y: 406, s: 3.0 },
              { x: 660, y: 405, s: 2.8 },
            ];
            return (
              <g key="theme-substrate" dangerouslySetInnerHTML={{
                __html: tiles.map(t => substrateDecor.svgFn(t.x, t.y, t.s)).join('')
              }}/>
            );
          })()}
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

        {/* Air bubbler stone with bubble stream */}
        <div className="air-bubbler">
          <svg className="bubbler-stone" viewBox="0 0 40 25" width="40" height="25">
            <ellipse cx="20" cy="18" rx="18" ry="7" fill="#556070"/>
            <ellipse cx="20" cy="16" rx="15" ry="5" fill="#667080"/>
            <ellipse cx="18" cy="14" rx="6" ry="2" fill="#778898" opacity="0.4"/>
          </svg>
          <div className="bubbler-stream">
            {Array.from({length: 8}, (_, i) => (
              <div key={i} className={`bubbler-bubble bb-${i}`}/>
            ))}
          </div>
        </div>

        {/* Glass snail */}
        <div className="tank-snail">
          <svg viewBox="0 0 24 18" width="24" height="18">
            <ellipse cx="12" cy="14" rx="10" ry="4" fill="rgba(160,140,100,0.7)"/>
            <circle cx="14" cy="10" r="6" fill="rgba(140,120,80,0.8)"/>
            <path d="M14,10 Q16,7 14,5 Q12,7 14,10" fill="rgba(120,100,60,0.5)"/>
            <circle cx="14" cy="8" r="3.5" fill="rgba(160,140,100,0.6)"/>
            <line x1="6" y1="12" x2="3" y2="9" stroke="rgba(140,120,80,0.6)" strokeWidth="1" strokeLinecap="round"/>
            <line x1="8" y1="11" x2="6" y2="8" stroke="rgba(140,120,80,0.6)" strokeWidth="1" strokeLinecap="round"/>
            <circle cx="3" cy="9" r="1" fill="rgba(60,60,60,0.5)"/>
            <circle cx="6" cy="8" r="1" fill="rgba(60,60,60,0.5)"/>
          </svg>
        </div>

        {/* Scattered shells on sand */}
        <svg className="tank-shells" viewBox="0 0 800 400" preserveAspectRatio="none">
          <g opacity="0.5">
            <path d="M120,392 Q125,385 130,392 Q125,395 120,392" fill="#d8c8a0"/>
            <path d="M320,395 Q326,387 332,395 Q326,398 320,395" fill="#c8b890" transform="rotate(20,326,395)"/>
            <path d="M540,390 Q544,383 548,390 Q544,393 540,390" fill="#dcd0a8" transform="rotate(-15,544,390)"/>
            <ellipse cx="180" cy="396" rx="4" ry="3" fill="#c0b088" transform="rotate(30,180,396)"/>
            <ellipse cx="440" cy="394" rx="5" ry="3.5" fill="#d0c098"/>
            <ellipse cx="620" cy="393" rx="3.5" ry="2.5" fill="#b8a880" transform="rotate(-25,620,393)"/>
            {/* Starfish */}
            <g transform="translate(280,388) scale(0.5) rotate(15)">
              <path d="M0,-10 L2,-3 L10,-3 L4,2 L6,10 L0,5 L-6,10 L-4,2 L-10,-3 L-2,-3 Z" fill="rgba(200,100,80,0.4)"/>
            </g>
          </g>
        </svg>

        {/* Treasure chest */}
        <svg className="tank-chest" viewBox="0 0 36 30" width="36" height="30">
          <rect x="3" y="14" width="30" height="16" rx="2" fill="#8a5a2a"/>
          <rect x="3" y="14" width="30" height="16" rx="2" fill="none" stroke="#6a4020" strokeWidth="1.5"/>
          <rect x="5" y="10" width="26" height="8" rx="3" fill="#9a6a3a"/>
          <rect x="14" y="12" width="8" height="6" rx="1" fill="#c8a040"/>
          <circle cx="18" cy="15" r="2" fill="#ffd060"/>
          <line x1="3" y1="22" x2="33" y2="22" stroke="#6a4020" strokeWidth="1" opacity="0.5"/>
          <rect x="3" y="10" width="30" height="1" fill="rgba(255,255,255,0.1)"/>
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

        {/* Micro-events (Feature 2) */}
        {microEvents.map(evt => (
          <div key={evt.id}
            className={`micro-event ${evt.tapped ? 'micro-event-fade' : ''}`}
            style={{ left: `${evt.x}%`, top: `${evt.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={(e) => { e.stopPropagation(); if (!evt.tapped) handleMicroTap(evt); }}>
            <div className="micro-event-bubble">
              <span className="micro-event-emoji">{evt.emoji}</span>
              <span>{evt.label}</span>
              {evt.coins > 0 && <span className="micro-event-coins">+{evt.coins}<span className="coin-icon"/></span>}
            </div>
          </div>
        ))}

        <div className="day-night-overlay" style={{ background: ps.overlay }}/>
        {(dayPhase.phase === 'night' || dayPhase.phase === 'evening') && (
          <div className="moonlight-beam" />
        )}
        {treatmentFlash > 0 && (
          <div key={treatmentFlash} className="treatment-effect">
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} className="treatment-bubble" style={{
                left: `${5 + Math.random() * 90}%`,
                animationDelay: `${Math.random() * 0.8}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`,
                width: 3 + Math.random() * 5,
                height: 3 + Math.random() * 5,
              }} />
            ))}
          </div>
        )}

        {/* ── Weather visual effects ───────────────────── */}
        {weather?.id === 'rainy' && (
          <div className="weather-rain">
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} className="rain-drop" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.4 + Math.random() * 0.3}s`,
              }} />
            ))}
          </div>
        )}
        {weather?.id === 'stormy' && (
          <div className="weather-storm">
            {Array.from({ length: 50 }, (_, i) => (
              <div key={i} className="rain-drop rain-drop--heavy" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${0.3 + Math.random() * 0.2}s`,
              }} />
            ))}
            <div className="lightning-flash" />
          </div>
        )}
        {weather?.id === 'heatwave' && (
          <div className="weather-heat" />
        )}
        {weather?.id === 'aurora' && (
          <div className="weather-aurora">
            <div className="aurora-band aurora-band-1" />
            <div className="aurora-band aurora-band-2" />
            <div className="aurora-band aurora-band-3" />
          </div>
        )}
        {weather?.id === 'foggy' && (
          <div className="weather-fog" />
        )}

        {/* Step 2 & 6: Fish rendered sorted by depth, with tilt + animation */}
        {sortedFish.map(f => {
          const pos = positions[f.id] || { x: f.x??50, y: f.y??40, flipped: false, depthLayer: 1, tilt: 0, isIdle: false };
          const isSelected = f.id === selectedFishId;
          const layer = DEPTH_LAYERS[pos.depthLayer ?? 1];
          const baseSize = f.phenotype?.size === 'Giant' ? SPRITE_SIZE.giant : f.stage === 'egg' ? SPRITE_SIZE.egg : SPRITE_SIZE.normal;
          const spriteSize = Math.round(baseSize * layer.scale);
          const tiltAngle = pos.flipped ? -(pos.tilt || 0) : (pos.tilt || 0);
          const animClass = pos.isIdle ? 'fish-idle' : 'fish-swimming';
          const depthLayer = pos.depthLayer ?? 1;
          // Build depth filter inline so it overrides nothing and composes cleanly
          let depthFilter = '';
          if (depthLayer === 0) depthFilter = 'saturate(0.72) brightness(0.88) blur(1.2px) ';
          else if (layer.blur > 0) depthFilter = `blur(${layer.blur}px) `;
          const glowStr = isSelected ? 'drop-shadow(0 0 8px rgba(240,192,64,0.6))' : '';
          const isHovered = f.id === hoveredFishId;
          const healthPct = Math.round(f.health ?? 100);
          const satiety   = Math.max(0, 100 - Math.round(f.hunger ?? 0));
          const tooltipSide = pos.x > 65 ? 'left' : 'right';
          const tooltipVert = pos.y < 15 ? 'fish-tooltip--low' : pos.y > 80 ? 'fish-tooltip--high' : '';

          return (
            <div key={f.id}
              className={fishClasses(f, isSelected, depthLayer, pos) + (justClickedId === f.id ? ' fish-just-clicked' : '')}
              data-rarity={f.species?.rarity || 'common'}
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
              onClick={() => {
                onSelectFish(f.id === selectedFishId ? null : f.id);
                // Wiggle animation
                setJustClickedId(f.id);
                setTimeout(() => setJustClickedId(null), 350);
                // Bubble burst
                if (pos) {
                  const bubbles = Array.from({ length: 4 }, (_, i) => ({
                    id: `cb-${f.id}-${Date.now()}-${i}`,
                    x: pos.x + (Math.random() - 0.5) * 6,
                    y: pos.y + (Math.random() - 0.5) * 4,
                    size: 3 + Math.random() * 5,
                    dur: 0.5 + Math.random() * 0.5,
                    rise: -15 - Math.random() * 25,
                  }));
                  setClickBubbles(prev => [...prev.slice(-8), ...bubbles]);
                  setTimeout(() => setClickBubbles(prev => prev.filter(b => !bubbles.some(nb => nb.id === b.id))), 1200);
                }
              }}>
              <div className={`fish-anim-inner ${animClass}`}
                   data-species={f.species?.key || undefined}>
                <FishSprite fish={f} size={spriteSize} flipped={pos.flipped} selected={isSelected}/>
              </div>
              {f.stage !== 'adult' && <div className="stage-badge">{f.stage}</div>}
              {/* Floating status icons */}
              <div className="fish-status-icons">
                {f.disease && (
                  <span className="fish-status-icon fish-status-icon--sick" aria-label="Sick">!</span>
                )}
                {!f.disease && f.hunger > 60 && (
                  <span className="fish-status-icon fish-status-icon--hungry" aria-label="Hungry">H</span>
                )}
                {listedFishIds.includes(f.id) && (
                  <span className="fish-status-icon fish-status-icon--listed" aria-label="Listed">$</span>
                )}
                {f.bondedWith && fish.some(o => o.id === f.bondedWith) && (
                  <span className="fish-status-icon fish-status-icon--bonded" aria-label="Bonded">♥</span>
                )}
              </div>

              {/* Hover tooltip */}
              {isHovered && (
                <div className={`fish-tooltip fish-tooltip--${tooltipSide} ${tooltipVert}`}>
                  <div className="fish-tooltip-name">{f.species?.name || 'Unknown'}</div>
                  <div className="fish-tooltip-row">
                    <span>HP</span>
                    <div className="fish-tooltip-bar">
                      <div className="fish-tooltip-fill" style={{
                        width: `${healthPct}%`,
                        background: healthPct > 60 ? '#5aaa70' : healthPct > 30 ? '#b0944a' : '#c44040',
                        color: healthPct < 30 ? '#c44040' : 'transparent',
                        boxShadow: healthPct < 30 ? '0 0 6px currentColor' : 'none',
                        animation: healthPct < 30 ? 'bar-critical-pulse 1.1s ease-in-out infinite' : 'none',
                      }}/>
                    </div>
                    <span className="fish-tooltip-val">{healthPct}%</span>
                  </div>
                  <div className="fish-tooltip-row">
                    <span>Feed</span>
                    <div className="fish-tooltip-bar">
                      <div className="fish-tooltip-fill" style={{
                        width: `${satiety}%`,
                        background: satiety > 60 ? '#5db8e8' : satiety > 30 ? '#f5a742' : '#ff6055',
                        color: satiety < 20 ? '#ff6055' : 'transparent',
                        boxShadow: satiety < 20 ? '0 0 6px currentColor' : 'none',
                        animation: satiety < 20 ? 'bar-critical-pulse 1.1s ease-in-out infinite' : 'none',
                      }}/>
                    </div>
                    <span className="fish-tooltip-val">{satiety}%</span>
                  </div>
                  {f.disease && <div className="fish-tooltip-disease">{f.disease}</div>}
                  {f.personality && <div className="fish-tooltip-personality" style={{fontSize:'0.65rem',opacity:0.6,marginTop:2}}>
                    {PERSONALITY_EMOJI[f.personality] || ''}
                    {' '}{f.personality}
                  </div>}
                </div>
              )}
            </div>
          );
        })}

        {fish.length === 0 && (
          <div className="empty-tank">
            <svg width="80" height="60" viewBox="0 0 80 60" fill="none" style={{margin: '0 auto 8px', display: 'block', opacity: 0.5}}>
              <rect x="10" y="10" width="60" height="40" rx="6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
              <circle cx="40" cy="30" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
                <animate attributeName="cy" values="32;24;32" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="32" cy="35" r="2" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                <animate attributeName="cy" values="36;28;36" dur="4s" repeatCount="indefinite" />
              </circle>
            </svg>
            <p style={{fontWeight: 600, fontSize: '1rem', marginBottom: 4}}>No fish here yet</p>
            <p style={{opacity: 0.6, fontSize: '0.85rem'}}>Visit the Shop to buy your first fish!</p>
          </div>
        )}

        {wq < 40 && (
          <div className="dirty-water" style={{ opacity: (40 - wq) / 40 * 0.2 }}/>
        )}

        </div>{/* close tank-distortion-layer */}

        {/* Volumetric god rays — SVG cones with animated opacity */}
        <svg className="god-rays-svg" viewBox="0 0 800 400" preserveAspectRatio="none">
          <polygon points="180,0 120,400 240,400" fill="url(#godRayGrad)" className="god-ray-cone god-ray-1"/>
          <polygon points="350,0 300,400 400,400" fill="url(#godRayGrad)" className="god-ray-cone god-ray-2"/>
          <polygon points="520,0 470,400 570,400" fill="url(#godRayGrad)" className="god-ray-cone god-ray-3"/>
          <polygon points="650,0 610,400 700,400" fill="url(#godRayGrad)" className="god-ray-cone god-ray-4"/>
        </svg>

        {/* Floating plankton — tiny glowing dots */}
        <div className="plankton-layer">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className={`plankton plankton-${i % 5}`}
              style={{
                left: `${(i * 37 + 13) % 95}%`,
                top: `${(i * 53 + 7) % 85 + 5}%`,
                animationDelay: `${(i * 1.3) % 8}s`,
                animationDuration: `${12 + (i % 7) * 3}s`,
              }}
            />
          ))}
        </div>

        {/* ── Click ripple effects ──────────────────────── */}
        {ripples.map(r => (
          <div key={r.id} className="click-ripple" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
            <div className="click-ripple-ring click-ripple-ring-1"/>
            <div className="click-ripple-ring click-ripple-ring-2"/>
            <div className="click-ripple-ring click-ripple-ring-3"/>
          </div>
        ))}

        {/* ── Feed splash particles ───────────────────── */}
        {feedSplash > 0 && (
          <div key={feedSplash} className="feed-splash-container">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className={`feed-pellet-anim feed-pellet-${i}`}/>
            ))}
          </div>
        )}

        {/* ── Sale sparkle effects ────────────────────── */}
        {sparkles.map(s => (
          <div key={s.id} className="sale-sparkle" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={`sparkle-particle sparkle-${i}`}/>
            ))}
          </div>
        ))}

        {/* ── Sale coin shower ────────────────────────── */}
        {coinShowers.map(s => (
          <div key={s.id} className="coin-shower" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className="coin-shower-piece" style={{
                '--drift': `${(Math.random() - 0.5) * 50}px`,
                '--drop': `${30 + Math.random() * 50}px`,
                '--spin': `${Math.random() * 360}deg`,
                '--fall-dur': `${0.6 + Math.random() * 0.6}s`,
                animationDelay: `${i * 0.04}s`,
              }}><span className="coin-icon"/></span>
            ))}
          </div>
        ))}

        {/* ── Sale speech bubbles ─────────────────────── */}
        {speechBubbles.map(s => (
          <div key={s.id} className="sale-speech-bubble" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
            {s.text}
          </div>
        ))}

        {/* ── Fish click bubble burst ────────────────── */}
        {clickBubbles.map(b => (
          <div key={b.id} className="fish-click-bubbles" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
            <span className="fish-click-bubble" style={{
              '--bsize': `${b.size}px`,
              '--bdur': `${b.dur}s`,
              '--brise': `${b.rise}px`,
            }} />
          </div>
        ))}

        {/* ── Swim bubble trails ───────────────────────── */}
        {swimBubbles.map(b => (
          <div key={b.id} className="swim-bubble" style={{
            left: `${b.x}%`, top: `${b.y}%`,
            width: b.size, height: b.size,
            '--drift': `${b.drift}px`,
          }} />
        ))}

        {/* ── Fish ground shadows on substrate ─────────── */}
        {sortedFish.map(f => {
          if (f.stage === 'egg') return null;
          const pos = positions[f.id];
          if (!pos) return null;
          const sandY = 94;
          const dist = sandY - pos.y;
          const opacity = Math.max(0, Math.min(0.25, 0.3 - dist * 0.004));
          const spread = 8 + dist * 0.15;
          if (opacity < 0.03) return null;
          return (
            <div key={`shadow-${f.id}`} className="fish-ground-shadow" style={{
              left: `${pos.x}%`,
              top: `${sandY}%`,
              width: spread,
              height: spread * 0.3,
              opacity,
            }} />
          );
        })}

        {/* Step 4: Glass reflections */}
        <div className="tank-glass-left"/>
        <div className="tank-glass-right"/>
        <div className="tank-glass-top"/>
        <div className="tank-glass-bottom-fade"/>
      </div>
    </div>
  );
}
