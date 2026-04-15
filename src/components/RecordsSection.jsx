// ============================================================
// RECORDS SECTION — Fishdex, Achievements, Magic Fish, Stats
// Owns its own internal view state (no App-level tab dependency)
// ============================================================
import React, { useState, memo } from 'react';
import Fishdex from './Fishdex.jsx';
import Achievements from './Achievements.jsx';
import MagicFishPanel from './MagicFish.jsx';
import StatsPanel from './StatsPanel.jsx';
import GeneJournal from './GeneJournal.jsx';
import TabErrorBoundary from './TabErrorBoundary.jsx';
import { useGameStore } from '../store/gameStore.js';

const MemoFishdex = memo(Fishdex);
const MemoAchievements = memo(Achievements);
const MemoMagicFish = memo(MagicFishPanel);

const VIEWS = [
  { id: 'fishdex',  label: 'Fishdex' },
  { id: 'achieve',  label: 'Achievements' },
  { id: 'magic',    label: 'Magic Fish' },
  { id: 'stats',    label: 'Statistics' },
];

export default function RecordsSection({ onNavigate, generatingLoreFor, aiError, onGenerateLore }) {
  const [view, setView] = useState('fishdex');
  const player = useGameStore(s => s.player);

  return (
    <div className="sim-section">
      <div className="sim-sub-tabs">
        {VIEWS.map(v => (
          <button
            key={v.id}
            className={`sim-sub-tab${view === v.id ? ' active' : ''}`}
            onClick={() => setView(v.id)}
          >{v.label}</button>
        ))}
      </div>
      <div className="sim-section-content">
        {view === 'fishdex' && (
          <TabErrorBoundary name="fishdex">
            <MemoFishdex
              fishdex={player.fishdex || []}
              onGenerateLore={onGenerateLore}
              generatingLoreFor={generatingLoreFor}
              aiError={aiError}
              legendFishUnlocked={!!player.legendFishUnlocked}
            />
            <GeneJournal />
          </TabErrorBoundary>
        )}
        {view === 'achieve' && (
          <MemoAchievements
            achievements={player.achievements || []}
            player={player}
            onNavigate={onNavigate}
          />
        )}
        {view === 'magic' && (
          <MemoMagicFish magicFishFound={player.magicFishFound || []} />
        )}
        {view === 'stats' && <StatsPanel />}
      </div>
    </div>
  );
}
