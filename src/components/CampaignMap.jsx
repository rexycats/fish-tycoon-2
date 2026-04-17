// ============================================================
// CAMPAIGN MAP — Level selection screen
// ============================================================
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { CAMPAIGN_LEVELS, getLevelById } from '../data/campaign.js';
import BriefingModal from './BriefingModal.jsx';

export default function CampaignMap({ onStartLevel, onBack }) {
  const completedLevels = useGameStore(s => s.campaign?.completedLevels || {});
  const [selectedLevel, setSelectedLevel] = useState(null);

  const isUnlocked = (level) => {
    if (level.unlocked) return true;
    return completedLevels[level.id]?.unlocked || completedLevels[level.id]?.stars > 0;
  };

  const getStars = (levelId) => completedLevels[levelId]?.stars || 0;

  const handleLevelClick = (level) => {
    if (!isUnlocked(level)) return;
    setSelectedLevel(level);
  };

  const handleStart = () => {
    if (selectedLevel) {
      onStartLevel(selectedLevel.id);
      setSelectedLevel(null);
    }
  };

  return (
    <div className="campaign-map">
      <div className="campaign-map-header">
        <button className="btn campaign-back-btn" onClick={onBack}>Back</button>
        <h2 className="campaign-title">CAMPAIGN</h2>
        <div className="campaign-subtitle">Complete objectives to unlock new levels</div>
      </div>

      <div className="campaign-path">
        {CAMPAIGN_LEVELS.map((level, i) => {
          const unlocked = isUnlocked(level);
          const stars = getStars(level.id);
          const completed = stars > 0;
          return (
            <React.Fragment key={level.id}>
              {i > 0 && (
                <div className={`campaign-connector ${completed || unlocked ? 'campaign-connector--active' : ''}`} />
              )}
              <button
                className={`campaign-node ${unlocked ? 'campaign-node--unlocked' : 'campaign-node--locked'} ${completed ? 'campaign-node--completed' : ''}`}
                onClick={() => handleLevelClick(level)}
                disabled={!unlocked}
              >
                <div className="campaign-node-number">{i + 1}</div>
                <div className="campaign-node-stars">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`campaign-star ${s <= stars ? 'campaign-star--earned' : ''}`}>★</span>
                  ))}
                </div>
                <div className="campaign-node-name">{level.name}</div>
                {!unlocked && <div className="campaign-node-lock">LOCKED</div>}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {selectedLevel && (
        <BriefingModal
          level={selectedLevel}
          onStart={handleStart}
          onBack={() => setSelectedLevel(null)}
        />
      )}
    </div>
  );
}
