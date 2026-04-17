// ============================================================
// OBJECTIVE BAR — Campaign objective tracker overlay
// ============================================================
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { getLevelById, getObjectiveProgress, checkObjective } from '../data/campaign.js';

export default function ObjectiveBar() {
  const campaign = useGameStore(s => s.campaign);
  // Subscribe to changing values so the component re-renders
  useGameStore(s => s.player?.stats);
  useGameStore(s => s.player?.fishdex?.length);
  useGameStore(s => s.fish?.length);
  useGameStore(s => s.player?.level);
  useGameStore(s => s.player?.totalCoinsEarned);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (campaign?.mode !== 'campaign' || !campaign.levelStartedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - campaign.levelStartedAt) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [campaign?.levelStartedAt, campaign?.mode]);

  if (campaign?.mode !== 'campaign' || !campaign.activeLevelId) return null;
  const level = getLevelById(campaign.activeLevelId);
  if (!level) return null;

  // Read full state for objective checking (re-render is triggered by subscriptions above)
  const state = useGameStore.getState();
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;

  return (
    <div className="objective-bar">
      <div className="obj-header">
        <span className="obj-level-name">{level.name}</span>
        <span className="obj-timer">{min}:{sec.toString().padStart(2, '0')}</span>
      </div>
      <div className="obj-list">
        {level.objectives.map(obj => {
          const done = checkObjective(obj, state);
          const prog = getObjectiveProgress(obj, state);
          return (
            <div key={obj.id} className={`obj-row ${done ? 'obj-row--done' : ''}`}>
              <span className="obj-check">{done ? '✓' : '○'}</span>
              <span className="obj-label">{obj.label}</span>
              <span className="obj-progress">{prog.current}/{prog.target}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
