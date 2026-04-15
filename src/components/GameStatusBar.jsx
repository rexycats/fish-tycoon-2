// ============================================================
// GAME STATUS BAR — Bottom bar: day, clock, level, fish, log, pause, coins, autosave
// ============================================================
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

export default function GameStatusBar({ paused, onTogglePause, showLog, onToggleLog }) {
  const fish = useGameStore(s => s.fish);
  const coins = useGameStore(s => s.player?.coins || 0);
  const level = useGameStore(s => s.player?.level || 1);
  const saveFlash = useGameStore(s => s._saveFlash);
  const day = useGameStore(s => {
    const created = s.player?.createdAt;
    if (!created) return 1;
    return Math.max(1, Math.floor((Date.now() - created) / 86_400_000) + 1);
  });

  const [clock, setClock] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  // Autosave indicator
  const [showSaved, setShowSaved] = useState(false);
  useEffect(() => {
    if (!saveFlash) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saveFlash]);

  const alive = fish?.length || 0;
  const sick = fish?.filter(f => f.disease)?.length || 0;

  return (
    <div className="game-status-bar">
      <span className="status-item">DAY {day}</span>
      <span className="status-separator" />
      <span className="status-item">{clock}</span>
      <span className="status-separator" />
      <span className="status-item">LV.{level}</span>
      <span className="status-separator" />
      <span className="status-item">{alive} FISH{sick > 0 ? <span className="status-sick"> ({sick} SICK)</span> : ''}</span>

      <span className="status-spacer" />

      {showSaved && <span className="status-saved">SAVED</span>}

      <button
        className={`speed-btn ${showLog ? 'speed-btn--active' : ''}`}
        onClick={onToggleLog}
        title="Toggle Log [L]"
      >LOG</button>

      <span className="status-separator" />

      <button
        className={`speed-btn ${paused ? 'speed-btn--active' : ''}`}
        onClick={onTogglePause}
        title="Pause [Space]"
      >{paused ? 'II' : '\u25B8'}</button>

      <span className="status-separator" />
      <span className="status-item status-item--coins">{coins.toLocaleString()}</span>
    </div>
  );
}
