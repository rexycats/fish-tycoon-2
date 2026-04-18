// ============================================================
// TITLE BACKGROUND — Underwater SVG scene
// ============================================================
import React from 'react';

export default function TitleBackground() {
  return (
    <svg className="title-scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Water gradient */}
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4f4ff" />
          <stop offset="35%" stopColor="#b8ecff" />
          <stop offset="70%" stopColor="#a0e0f8" />
          <stop offset="100%" stopColor="#90d8f0" />
        </linearGradient>
        {/* Light rays */}
        <radialGradient id="raysGrad" cx="0.5" cy="0.05" r="0.8">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        {/* Sand gradient */}
        <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e8d0" />
          <stop offset="100%" stopColor="#e8d8b8" />
        </linearGradient>
        {/* Cloud puff */}
        <radialGradient id="cloudGrad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Sky/water fill */}
      <rect width="1600" height="900" fill="url(#waterGrad)" />

      {/* Light rays from top-center */}
      <rect width="1600" height="900" fill="url(#raysGrad)" />
      {[0,1,2,3,4,5,6,7].map(i => {
        const angle = -30 + i * 8.5;
        const w = 40 + (i % 3) * 25;
        return (
          <polygon key={i}
            points={`${800 + angle * 2},0 ${800 + angle * 12 - w},900 ${800 + angle * 12 + w},900`}
            fill="rgba(255,255,255,0.04)"
          />
        );
      })}

      {/* Cloud/mist layer */}
      {[
        { x: 200, y: 380, rx: 180, ry: 30 },
        { x: 600, y: 400, rx: 250, ry: 35 },
        { x: 1100, y: 370, rx: 200, ry: 28 },
        { x: 1400, y: 390, rx: 160, ry: 32 },
      ].map((c, i) => (
        <ellipse key={i} cx={c.x} cy={c.y} rx={c.rx} ry={c.ry} fill="url(#cloudGrad)" />
      ))}

      {/* ── Sand floor ────────────────────────────── */}
      <path d="M0,780 Q200,740 400,760 Q600,780 800,750 Q1000,730 1200,755 Q1400,775 1600,745 L1600,900 L0,900 Z"
        fill="url(#sandGrad)" />
      <path d="M0,790 Q300,770 600,785 Q900,800 1200,775 Q1400,760 1600,770 L1600,900 L0,900 Z"
        fill="#efe0c8" opacity="0.5" />

      {/* ── Left seaweed/coral ─────────────────── */}
      <g transform="translate(80, 620)">
        {/* Tall seaweed */}
        <path d="M30,180 Q25,120 35,80 Q28,40 32,0" fill="none" stroke="#7cc8a0" strokeWidth="8" strokeLinecap="round" />
        <path d="M50,180 Q55,130 45,90 Q52,50 48,20" fill="none" stroke="#60b888" strokeWidth="7" strokeLinecap="round" />
        <path d="M15,180 Q10,140 20,110 Q15,80 18,50" fill="none" stroke="#90d8b0" strokeWidth="6" strokeLinecap="round" />
        {/* Coral */}
        <ellipse cx="70" cy="160" rx="25" ry="35" fill="#ffb0c0" opacity="0.8" />
        <ellipse cx="65" cy="150" rx="18" ry="25" fill="#ffc0d0" opacity="0.7" />
        <circle cx="55" cy="140" r="8" fill="#ffd0dd" opacity="0.6" />
        <circle cx="75" cy="135" r="6" fill="#ffd0dd" opacity="0.5" />
      </g>

      {/* More left plants */}
      <g transform="translate(160, 660)">
        <path d="M20,140 Q15,90 25,50 Q20,20 22,0" fill="none" stroke="#60c090" strokeWidth="6" strokeLinecap="round" />
        <path d="M40,140 Q45,100 38,60" fill="none" stroke="#80d0a8" strokeWidth="5" strokeLinecap="round" />
        {/* Broad leaf coral */}
        <ellipse cx="60" cy="120" rx="30" ry="20" fill="#80c8a0" opacity="0.6" />
      </g>

      {/* ── Right seaweed/coral ────────────────── */}
      <g transform="translate(1380, 630)">
        <path d="M30,170 Q35,110 25,70 Q32,30 28,0" fill="none" stroke="#70c098" strokeWidth="7" strokeLinecap="round" />
        <path d="M55,170 Q50,120 58,80 Q52,40 55,10" fill="none" stroke="#88d0a8" strokeWidth="6" strokeLinecap="round" />
        {/* Rock */}
        <ellipse cx="80" cy="155" rx="35" ry="22" fill="#b8c8d0" opacity="0.6" />
        <ellipse cx="85" cy="148" rx="25" ry="15" fill="#c8d4dc" opacity="0.5" />
      </g>

      {/* Right coral cluster */}
      <g transform="translate(1450, 680)">
        <path d="M10,120 Q5,80 15,40" fill="none" stroke="#60b888" strokeWidth="5" strokeLinecap="round" />
        <ellipse cx="40" cy="100" rx="20" ry="30" fill="#e8a8c0" opacity="0.7" />
        <ellipse cx="35" cy="90" rx="14" ry="20" fill="#f0b8d0" opacity="0.6" />
      </g>

      {/* ── Sand details: shells, starfish, coins ─ */}
      {/* Shell left */}
      <g transform="translate(120, 800) rotate(-15)">
        <path d="M0,12 Q8,-2 16,12 Q8,8 0,12 Z" fill="#f0d8c0" stroke="#e0c8a8" strokeWidth="1" />
        <path d="M3,10 Q8,2 13,10" fill="none" stroke="#e0c8a8" strokeWidth="0.5" />
      </g>
      {/* Shell right */}
      <g transform="translate(1420, 810) scale(1.3)">
        <ellipse cx="10" cy="10" rx="12" ry="10" fill="#d8b8e0" opacity="0.7" />
        <path d="M4,14 Q10,4 16,14" fill="none" stroke="#c0a0d0" strokeWidth="1" />
        <path d="M6,12 Q10,6 14,12" fill="none" stroke="#c0a0d0" strokeWidth="0.5" />
      </g>
      {/* Starfish left-bottom */}
      <g transform="translate(1350, 830) rotate(20) scale(0.9)">
        <path d="M12,0 L14.5,8 L23,10 L16.5,15 L18,24 L12,19 L6,24 L7.5,15 L1,10 L9.5,8 Z"
          fill="#f8c090" stroke="#e8a870" strokeWidth="0.8" />
      </g>
      {/* Starfish right area */}
      <g transform="translate(220, 835) rotate(-10) scale(0.7)">
        <path d="M12,0 L14.5,8 L23,10 L16.5,15 L18,24 L12,19 L6,24 L7.5,15 L1,10 L9.5,8 Z"
          fill="#f0a878" stroke="#e09060" strokeWidth="0.8" />
      </g>
      {/* Coins on sand */}
      <g transform="translate(1380, 850)">
        <ellipse cx="8" cy="5" rx="7" ry="4" fill="#f0c860" stroke="#d8a840" strokeWidth="0.8" />
        <ellipse cx="0" cy="3" rx="7" ry="4" fill="#e8c050" stroke="#d0a030" strokeWidth="0.8" />
      </g>

      {/* ── Sparkle stars scattered ────────────── */}
      {[
        { x: 300, y: 200, s: 6 }, { x: 500, y: 150, s: 4 }, { x: 900, y: 180, s: 5 },
        { x: 1200, y: 220, s: 4 }, { x: 700, y: 300, s: 3 }, { x: 1100, y: 160, s: 6 },
        { x: 400, y: 350, s: 3 }, { x: 1000, y: 280, s: 4 }, { x: 250, y: 320, s: 3 },
        { x: 1300, y: 300, s: 5 }, { x: 550, y: 250, s: 3 }, { x: 850, y: 350, s: 4 },
      ].map((star, i) => (
        <g key={i} transform={`translate(${star.x}, ${star.y})`} opacity={0.3 + (i % 3) * 0.15}>
          <line x1={-star.s} y1="0" x2={star.s} y2="0" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1={-star.s} x2="0" y2={star.s} stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1={-star.s * 0.5} y1={-star.s * 0.5} x2={star.s * 0.5} y2={star.s * 0.5} stroke="white" strokeWidth="1" strokeLinecap="round" />
          <line x1={star.s * 0.5} y1={-star.s * 0.5} x2={-star.s * 0.5} y2={star.s * 0.5} stroke="white" strokeWidth="1" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}
