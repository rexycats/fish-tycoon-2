// ============================================================
// FISH TYCOON 2 — TITLE SCREEN
// ============================================================
import React, { useState, useEffect } from 'react';
import { loadGame } from '../data/gameState.js';
import { startMusic } from '../services/soundService.js';

export default function TitleScreen({ onStart }) {
  const [hasSave, setHasSave] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [bubbles] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      left: Math.random() * 100,
      size: 3 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.2,
    }))
  );

  useEffect(() => {
    try {
      const save = loadGame();
      setHasSave(!!save);
    } catch {}
  }, []);

  const handleStart = (mode) => {
    startMusic();
    setFadeOut(true);
    setTimeout(() => onStart(mode), 800);
  };

  return (
    <div className={`title-screen ${fadeOut ? 'title-fade-out' : ''}`}>
      {/* Underwater background effects */}
      <div className="title-bg">
        <div className="title-rays">
          {[0,1,2,3,4].map(i => <div key={i} className={`title-ray title-ray-${i}`}/>)}
        </div>
        <div className="title-bubbles">
          {bubbles.map((b, i) => (
            <div key={i} className="title-bubble" style={{
              left: `${b.left}%`, width: b.size, height: b.size,
              animationDelay: `${b.delay}s`, animationDuration: `${b.duration}s`,
              opacity: b.opacity,
            }}/>
          ))}
        </div>
        <div className="title-caustics"/>
      </div>

      {/* Logo */}
      <div className="title-logo-wrap">
        <div className="title-logo-glow"/>
        <h1 className="title-logo">
          <span className="title-logo-fish">🐠</span>
          <span className="title-logo-text">
            <span className="title-word-fish">Fish</span>
            <span className="title-word-tycoon">Tycoon</span>
            <span className="title-word-2">2</span>
          </span>
        </h1>
        <p className="title-tagline">Build your dream aquarium</p>
      </div>

      {/* Menu */}
      <div className="title-menu">
        {hasSave && (
          <button className="title-btn title-btn-primary" onClick={() => handleStart('continue')}>
            ▶ Continue
          </button>
        )}
        <button className="title-btn" onClick={() => handleStart(hasSave ? 'continue' : 'new')}>
          {hasSave ? '🔄 New Game' : '▶ Start Game'}
        </button>
      </div>

      <div className="title-footer">
        <span className="title-version">v0.1.0</span>
        <span className="title-credit">Made with 🐟</span>
      </div>
    </div>
  );
}
