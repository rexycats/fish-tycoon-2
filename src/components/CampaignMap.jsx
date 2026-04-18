// ============================================================
// CAMPAIGN MAP — Cute cozy level selection
// ============================================================
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { CAMPAIGN_LEVELS, getLevelById } from '../data/campaign.js';
import BriefingModal from './BriefingModal.jsx';
import TitleBackground from './title/TitleBackground.jsx';
import TitleBubbles from './title/TitleBubbles.jsx';

const LEVEL_COLORS = [
  { bg: 'linear-gradient(135deg, #a8ecf8, #78d8ec)', border: '#60c8e0', glow: 'rgba(96,200,224,0.3)' },
  { bg: 'linear-gradient(135deg, #ffd0c0, #f8a8a0)', border: '#f09898', glow: 'rgba(240,152,152,0.3)' },
  { bg: 'linear-gradient(135deg, #d8c8f0, #c0b0e0)', border: '#b0a0d4', glow: 'rgba(176,160,212,0.3)' },
  { bg: 'linear-gradient(135deg, #ffe8a0, #f0d070)', border: '#e0c050', glow: 'rgba(224,192,80,0.3)' },
  { bg: 'linear-gradient(135deg, #bdf3d4, #90e0b0)', border: '#70c890', glow: 'rgba(112,200,144,0.3)' },
];

function LevelNode({ level, index, unlocked, completed, stars, onClick }) {
  const color = LEVEL_COLORS[index % LEVEL_COLORS.length];
  const locked = !unlocked;

  return (
    <button
      className={`cm-node ${unlocked ? 'cm-node--unlocked' : 'cm-node--locked'} ${completed ? 'cm-node--completed' : ''}`}
      onClick={onClick}
      disabled={locked}
      style={unlocked ? {
        background: color.bg,
        borderColor: color.border,
        boxShadow: `0 8px 24px ${color.glow}`,
      } : undefined}
    >
      {/* Number badge */}
      <div className="cm-node-num">{index + 1}</div>

      {/* Stars */}
      <div className="cm-node-stars">
        {[1, 2, 3].map(s => (
          <svg key={s} width="18" height="18" viewBox="0 0 24 24" className={`cm-star ${s <= stars ? 'cm-star--on' : ''}`}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
              fill={s <= stars ? '#f0b840' : 'rgba(255,255,255,0.3)'}
              stroke={s <= stars ? '#d8a030' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1" strokeLinejoin="round" />
          </svg>
        ))}
      </div>

      {/* Name */}
      <div className="cm-node-name">{level.name}</div>

      {/* Lock icon for locked levels */}
      {locked && (
        <div className="cm-node-lock">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="3" fill="rgba(140,160,180,0.3)" stroke="rgba(140,160,180,0.5)" strokeWidth="1.5" />
            <path d="M8 11V7a4 4 0 018 0v4" stroke="rgba(140,160,180,0.5)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

function Connector({ active }) {
  return (
    <div className={`cm-connector ${active ? 'cm-connector--active' : ''}`}>
      <svg width="48" height="8" viewBox="0 0 48 8">
        <line x1="0" y1="4" x2="48" y2="4"
          stroke={active ? 'rgba(96,200,224,0.6)' : 'rgba(180,200,220,0.3)'}
          strokeWidth="3" strokeLinecap="round"
          strokeDasharray={active ? 'none' : '6 4'} />
        {active && <circle cx="24" cy="4" r="3" fill="#8fe7ff" opacity="0.5" />}
      </svg>
    </div>
  );
}

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
    <div className="cm-screen">
      {/* Shared underwater background */}
      <TitleBackground />
      <TitleBubbles />

      {/* Content */}
      <div className="cm-content">
        {/* Back button */}
        <button className="cm-back" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="cm-header">
          <h2 className="cm-title">Campaign</h2>
          <p className="cm-desc">Complete objectives to unlock new levels</p>
        </div>

        {/* Level path */}
        <div className="cm-path">
          {CAMPAIGN_LEVELS.map((level, i) => {
            const unlocked = isUnlocked(level);
            const stars = getStars(level.id);
            const completed = stars > 0;
            return (
              <React.Fragment key={level.id}>
                {i > 0 && <Connector active={completed || unlocked} />}
                <LevelNode
                  level={level}
                  index={i}
                  unlocked={unlocked}
                  completed={completed}
                  stars={stars}
                  onClick={() => handleLevelClick(level)}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Briefing modal */}
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
