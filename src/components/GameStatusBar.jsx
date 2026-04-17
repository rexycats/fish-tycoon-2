// ============================================================
// GAME STATUS BAR — Bottom bar: day, clock, level, fish, speed, pause, coins
// ============================================================
import React, { useState, useEffect } from 'react';
import Tip from './GameTooltip.jsx';
import { useGameStore } from '../store/gameStore.js';

export default function GameStatusBar({ paused, onTogglePause, showLog, onToggleLog }) {
  const fish = useGameStore(s => s.fish);
  const coins = useGameStore(s => s.player?.coins || 0);
  const level = useGameStore(s => s.player?.level || 1);
  const saveFlash = useGameStore(s => s._saveFlash);
  const gameSpeed = useGameStore(s => s.gameSpeed || 1);
  const setGameSpeed = useGameStore(s => s.setGameSpeed);
  const gameClock = useGameStore(s => s.gameClock || Date.now());

  // Day counter based on game clock
  const day = useGameStore(s => {
    const created = s.player?.createdAt || s.player?.firstPlayedAt;
    const gc = s.gameClock || Date.now();
    if (!created) return 1;
    return Math.max(1, Math.floor((gc - created) / 86_400_000) + 1);
  });

  // Game clock display
  const gameDate = new Date(gameClock);
  const clock = gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Autosave indicator
  const [showSaved, setShowSaved] = useState(false);
  useEffect(() => {
    if (!saveFlash) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saveFlash]);

  const seasonalEvent = useGameStore(s => s.activeSeasonalEvent);
  const visitors = useGameStore(s => s.visitors);

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
      {visitors?.current > 0 && (
        <>
          <span className="status-separator" />
          <span className="status-item" title={`${visitors.perMin}/min — ${visitors.satisfaction}% satisfaction`}>{visitors.current} VISITORS</span>
        </>
      )}
      {seasonalEvent && (
        <>
          <span className="status-separator" />
          <span className="status-item status-item--seasonal" title={seasonalEvent.desc}>{seasonalEvent.name}</span>
        </>
      )}

      <span className="status-spacer" />

      {showSaved && <span className="status-saved">SAVED</span>}

      <button
        className={`speed-btn ${showLog ? 'speed-btn--active' : ''}`}
        onClick={onToggleLog}
      ><Tip text="Toggle Log [L]"><span>LOG</span></Tip></button>

      <span className="status-separator" />

      <div className="speed-controls">
        {[1, 2, 3].map(s => (
          <button
            key={s}
            className={`speed-btn speed-btn--speed ${gameSpeed === s ? 'speed-btn--active' : ''}`}
            onClick={() => setGameSpeed(s)}
            aria-label={`${s}x speed`}
          >
            {'▸'.repeat(s)}
          </button>
        ))}
      </div>

      <span className="status-separator" />

      <button
        className={`speed-btn ${paused ? 'speed-btn--active' : ''}`}
        onClick={onTogglePause}
      ><Tip text="Pause [Space]"><span>{paused ? 'II' : '\u25B8'}</span></Tip></button>

      <span className="status-separator" />
      <span className="status-item status-item--coins">{coins.toLocaleString()}</span>
    </div>
  );
}
