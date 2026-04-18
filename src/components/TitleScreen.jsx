// ============================================================
// FISH TYCOON 2 — TITLE SCREEN (Cute Cozy Redesign)
// ============================================================
import React, { useState, useEffect } from 'react';
import { loadGame } from '../data/gameState.js';
import { startMusic } from '../services/soundService.js';
import TitleBackground from './title/TitleBackground.jsx';
import TitleBubbles from './title/TitleBubbles.jsx';
import TitleLogo from './title/TitleLogo.jsx';
import TitleButtons from './title/TitleButtons.jsx';

export default function TitleScreen({ onStart }) {
  const [hasSave, setHasSave] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const save = loadGame();
      setHasSave(!!save);
    } catch {}
    const t = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleStart = (mode) => {
    startMusic();
    setFadeOut(true);
    setTimeout(() => onStart(mode), 800);
  };

  return (
    <div className={`title-screen-v2 ${fadeOut ? 'ts-fade-out' : ''} ${ready ? 'ts-ready' : ''}`}>
      <TitleBackground />
      <TitleBubbles />

      <div className="ts-content">
        <div className="ts-logo-area">
          <TitleLogo />
        </div>
        <div className="ts-buttons-area">
          <TitleButtons hasSave={hasSave} onStart={handleStart} />
        </div>
        <div className="ts-footer">
          <span className="ts-version">v0.12</span>
        </div>
      </div>
    </div>
  );
}
