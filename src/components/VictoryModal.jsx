// ============================================================
// VICTORY MODAL — Campaign level complete overlay
// ============================================================
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { getLevelById, getStarRating, CAMPAIGN_LEVELS } from '../data/campaign.js';
import { playVictory } from '../services/soundService.js';

export default function VictoryModal({ levelId, onContinue }) {
  useEffect(() => { playVictory(); }, []);
  const level = getLevelById(levelId);
  const state = useGameStore.getState();
  const stars = level ? getStarRating(level, state) : 0;
  const complete = useGameStore(s => s.completeCampaignLevel);
  const nextLevelId = level?.rewards?.unlocks?.[0];
  const nextLevel = nextLevelId ? getLevelById(nextLevelId) : null;

  const handleContinue = () => {
    complete();
    onContinue(nextLevelId);
  };

  if (!level) return null;

  return (
    <div className="victory-overlay" onClick={e => e.stopPropagation()}>
      <div className="victory-modal">
        <div className="victory-banner">LEVEL COMPLETE</div>
        <div className="victory-level-name">{level.name}</div>
        <div className="victory-stars">
          {[1, 2, 3].map(s => (
            <span key={s} className={`victory-star ${s <= stars ? 'victory-star--earned' : ''}`}>★</span>
          ))}
        </div>
        <div className="victory-actions">
          {nextLevel && (
            <button className="btn victory-btn victory-btn--next" onClick={handleContinue}>
              Next: {nextLevel.name}
            </button>
          )}
          <button className="btn victory-btn" onClick={() => { complete(); onContinue(null); }}>
            Campaign Map
          </button>
        </div>
      </div>
    </div>
  );
}
