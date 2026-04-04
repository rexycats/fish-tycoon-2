// ============================================================
// FISH TYCOON 2 — TANK VIEW (Phase 7: Day/Night Cycle)
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import FishSprite from './FishSprite.jsx';
import { getDecorById } from '../data/decorations.js';

const SWIM_SPEED  = 0.018;
const BOB_AMP     = 0.025;
const BOB_FREQ    = 0.018;
const TURN_CHANCE = 0.0018;

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

export default function TankView({ fish, selectedFishId, onSelectFish, waterQuality, tank }) {
  const [positions, setPositions] = useState(() =>
    Object.fromEntries(fish.map(f => [f.id, {
      x: f.x ?? (10 + Math.random() * 80),
      y: f.y ?? (20 + Math.random() * 55),
      vx: (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.25),
      vy: 0,
      flipped: Math.random() > 0.5,
      phase: Math.random() * Math.PI * 2,
    }]))
  );

  const [dayPhase, setDayPhase] = useState(getDayPhase);
  const tickRef = useRef(0);

  useEffect(() => {
    const t = setInterval(() => setDayPhase(getDayPhase()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setPositions(prev => {
      const next = { ...prev };
      for (const f of fish) {
        if (!next[f.id]) {
          next[f.id] = {
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 55,
            vx: (Math.random() > 0.5 ? 1 : -1) * (0.15 + Math.random() * 0.2),
            vy: 0, flipped: false, phase: Math.random() * Math.PI * 2,
          };
        }
      }
      const ids = new Set(fish.map(f => f.id));
      for (const id of Object.keys(next)) {
        if (!ids.has(id)) delete next[id];
      }
      return next;
    });
  }, [fish]);

  useEffect(() => {
    let frameId;
    const animate = () => {
      tickRef.current++;
      const t = tickRef.current;
      setPositions(prev => {
        const next = { ...prev };
        for (const [id, pos] of Object.entries(next)) {
          let { x, y, vx, vy, phase, flipped } = pos;
          x += vx * SWIM_SPEED * 60;
          y += Math.sin(phase + t * BOB_FREQ) * BOB_AMP;
          if (x > 90) { vx = -Math.abs(vx) * (0.9 + Math.random() * 0.2); flipped = true;  x = 90; }
          if (x < 5)  { vx =  Math.abs(vx) * (0.9 + Math.random() * 0.2); flipped = false; x = 5;  }
          if (y > 80) { vy = -Math.abs(vy); y = 80; }
          if (y < 8)  { vy =  Math.abs(vy); y = 8;  }
          if (Math.random() < TURN_CHANCE) {
            vx = (Math.random() - 0.5) * 0.5;
            vy = (Math.random() - 0.5) * 0.08;
            if (Math.abs(vx) < 0.05) vx = 0.15;
            flipped = vx < 0;
          }
          next[id] = { x, y, vx, vy, phase, flipped };
        }
        return next;
      });
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const wq = waterQuality;
  const waterR = Math.round(wq > 60 ? 14  : wq > 30 ? 30  : 60);
  const waterG = Math.round(wq > 60 ? 62  : wq > 30 ? 78  : 72);
  const waterB = Math.round(wq > 60 ? 148 : wq > 30 ? 110 : 60);
  const waterBg = `radial-gradient(ellipse at 50% 0%, rgba(${waterR+20},${waterG+20},${waterB+20},0.95) 0%, rgba(${waterR},${waterG},${waterB},0.98) 60%, rgba(${Math.max(0,waterR-10)},${Math.max(0,waterG-10)},${Math.max(0,waterB-20)},1) 100%)`;
  const ps = DAY_PHASE_STYLES[dayPhase.phase];

  return (
    <div className="tank-wrapper">
      <div className="day-phase-badge">{dayPhase.label}</div>
      <div className="tank" style={{ background: waterBg }}>

        <div className="tank-depth-far" />
        <div className="tank-depth-mid" />

        <div className="light-rays" style={{ opacity: ps.rayOpacity }}>
          {[0,1,2,3,4].map(i => <div key={i} className={`ray ray-${i}`}/>)}
        </div>

        <div className="caustics-overlay"/>

        {/* Night stars */}
        {ps.starCount > 0 && (
          <svg className="night-stars" viewBox="0 0 100 30" preserveAspectRatio="none">
            {STARS.slice(0, ps.starCount).map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.65"
                      className="star-twinkle" style={{ animationDelay: `${s.delay}s` }}/>
            ))}
          </svg>
        )}

        <svg className="tank-bg-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          {/* Celestial body */}
          {(dayPhase.phase === 'night' || dayPhase.phase === 'evening')
            ? <circle cx="700" cy="40" r="22" fill="rgba(255,245,200,0.18)" />
            : dayPhase.phase === 'day'
              ? <circle cx="700" cy="35" r="28" fill="rgba(255,240,150,0.12)" />
              : <ellipse cx="700" cy="40" rx="30" ry="18" fill="rgba(255,160,60,0.14)" />
          }
          {/* Castle ruin */}
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
        </svg>

        <svg className="tank-fg-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMax slice">
          <ellipse cx="400" cy="420" rx="450" ry="55" fill="#8a6830"/>
          <ellipse cx="400" cy="415" rx="440" ry="42" fill="#a07840"/>
          <ellipse cx="400" cy="410" rx="420" ry="30" fill="#b88a50"/>
          {[60,130,200,280,360,440,520,600,680,740].map((x,i) => (
            <ellipse key={i} cx={x} cy={404+((i%3)*3)} rx={8+i%5} ry={5+i%3}
                     fill={['#906030','#a07040','#c09060','#786028'][i%4]} opacity="0.9"/>
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
          <ellipse cx="500" cy="402" rx="20" ry="12" fill="#485868"/>
          <ellipse cx="505" cy="398" rx="16" ry="9"  fill="#586878"/>
          <circle cx="82"  cy="310" r="3"   fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" className="deco-bubble deco-b1"/>
          <circle cx="390" cy="340" r="2.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" className="deco-bubble deco-b2"/>
          <circle cx="672" cy="370" r="2"   fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" className="deco-bubble deco-b3"/>

          {/* ── User-placed decorations ── */}
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
          {[0,1,2,3,4,5,6,7].map(i => <div key={i} className={`bubble bubble-${i}`}/>)}
        </div>

        {/* Day/Night overlay */}
        <div className="day-night-overlay" style={{ background: ps.overlay }}/>

        {/* Fish */}
        {fish.map(f => {
          const pos = positions[f.id] || { x: f.x??50, y: f.y??40, flipped: false };
          const isSelected = f.id === selectedFishId;
          const spriteSize = f.phenotype?.size === 'Giant' ? 76 : f.stage === 'egg' ? 36 : 54;
          return (
            <div key={f.id}
              className={`fish-container ${isSelected ? 'selected' : ''}`}
              style={{ left:`${pos.x}%`, top:`${pos.y}%` }}
              onClick={() => onSelectFish(f.id === selectedFishId ? null : f.id)}>
              <FishSprite fish={f} size={spriteSize} flipped={pos.flipped} selected={isSelected}/>
              {f.stage !== 'adult' && <div className="stage-badge">{f.stage}</div>}
              {f.hunger > 75 && <div className="hunger-indicator">🍽️</div>}
              {f.health < 30  && <div className="sick-indicator">💔</div>}
              {f.disease && <div className="disease-indicator">🦠</div>}
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

        <div className="tank-glass-left"/>
        <div className="tank-glass-top"/>
      </div>
    </div>
  );
}
