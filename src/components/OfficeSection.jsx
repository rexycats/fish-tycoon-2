// ============================================================
// OFFICE SECTION — Contracts, Decor, Autopsy
// Owns its own internal view state
// ============================================================
import React, { useState, memo } from 'react';
import GoalsPanel from './GoalsPanel.jsx';
import FishShowPanel from './FishShowPanel.jsx';
import DecorationPanel from './DecorationPanel.jsx';
import FishAutopsyPanel from './FishAutopsy.jsx';
import StaffPanel from './StaffPanel.jsx';
import ResearchPanel from './ResearchPanel.jsx';
import RoomPanel from './RoomPanel.jsx';
import TabErrorBoundary from './TabErrorBoundary.jsx';
import { useGameStore } from '../store/gameStore.js';

const MemoDecorationPanel = memo(DecorationPanel);
const MemoFishAutopsy = memo(FishAutopsyPanel);

const VIEWS = [
  { id: 'contracts', label: 'Contracts' },
  { id: 'staff',     label: 'Staff' },
  { id: 'research',  label: 'Research' },
  { id: 'rooms',     label: 'Rooms' },
  { id: 'decor',     label: 'Decor' },
  { id: 'autopsy',   label: 'Autopsy' },
];

export default function OfficeSection() {
  const [view, setView] = useState('contracts');

  // Bug 2 fix: subscribe to individual fields, not s.game
  const player = useGameStore(s => s.player);
  const fish   = useGameStore(s => s.fish);
  const tanks  = useGameStore(s => s.tanks);
  const shop   = useGameStore(s => s.shop);
  const activeTank = tanks?.[0]; // Decor always targets first tank for simplicity

  // Bug 4 fix: dailyChallenges is { day, challenges: [] } — extract the array
  const dailyChallenges = useGameStore(s => s.dailyChallenges?.challenges || []);

  // Bug 3 fix: wrap callbacks to provide tankId
  const _buyDecoration = useGameStore(s => s.buyDecoration);
  const _placeDecoration = useGameStore(s => s.placeDecoration);
  const _removeDecoration = useGameStore(s => s.removeDecoration);
  const _claimUnlockedDecoration = useGameStore(s => s.claimUnlockedDecoration);
  const _buyTheme = useGameStore(s => s.buyTheme);
  const _applyTheme = useGameStore(s => s.applyTheme);

  const handleBuyDecor = (decorId) => _buyDecoration(decorId, activeTank?.id);
  const handlePlaceDecor = (decorId) => _placeDecoration(decorId, activeTank?.id);
  const handleRemoveDecor = (decorId) => _removeDecoration(decorId, activeTank?.id);
  const handleClaimDecor = (decorId) => _claimUnlockedDecoration?.(decorId);
  const handleBuyTheme = (themeId) => _buyTheme(themeId, activeTank?.id);
  const handleApplyTheme = (themeId) => _applyTheme(themeId, activeTank?.id);

  // Build game-like object for DecorationPanel (it expects game.player, game.fish, etc)
  const game = { player, fish, tanks, shop };

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
        {view === 'contracts' && (
          <TabErrorBoundary name="contracts">
            <GoalsPanel />
            <FishShowPanel />
            <DailyChallengesPanel
              dailyChallenges={dailyChallenges}
              streak={player.challengeStreak || 0}
            />
          </TabErrorBoundary>
        )}
        {view === 'decor' && (
          <MemoDecorationPanel
            game={game}
            activeTank={activeTank}
            onBuyDecor={handleBuyDecor}
            onPlaceDecor={handlePlaceDecor}
            onRemoveDecor={handleRemoveDecor}
            unlockedDecorations={player.unlockedDecorations || []}
            onClaimUnlockedDecor={handleClaimDecor}
            onBuyTheme={handleBuyTheme}
            onApplyTheme={handleApplyTheme}
          />
        )}
        {view === 'staff' && (
          <StaffPanel />
        )}
        {view === 'research' && (
          <ResearchPanel />
        )}
        {view === 'rooms' && (
          <RoomPanel />
        )}
        {view === 'autopsy' && (
          <MemoFishAutopsy autopsies={player.autopsies || []} />
        )}
      </div>
    </div>
  );
}

// ── Daily Challenges ──────────────────────────────────────
function DailyChallengesPanel({ dailyChallenges, streak = 0 }) {
  const claimDailyReward = useGameStore(s => s.claimDailyReward);
  const player = useGameStore(s => s.player);

  if (!dailyChallenges || dailyChallenges.length === 0) return null;

  // Bug 5 fix: use toDateString() to match store format
  const today = new Date().toDateString();
  const canClaim = !player.lastDailyClaimDate || player.lastDailyClaimDate !== today;

  return (
    <div className="daily-challenges-panel">
      <h3 className="section-title">Daily Challenges</h3>
      {streak > 0 && (
        <div className="challenge-streak">
          Day {streak} streak
        </div>
      )}
      <div className="challenge-list">
        {dailyChallenges.map((c, i) => {
          const done = c.progress >= (c.goal || c.target);
          return (
            <div key={i} className={`challenge-card ${done ? 'challenge-card--done' : ''}`}>
              <div className="challenge-desc">{c.desc}</div>
              <div className="challenge-progress">
                <div className="challenge-bar">
                  <div className="challenge-bar-fill" style={{ width: `${Math.min(100, (c.progress / (c.goal || c.target || 1)) * 100)}%` }} />
                </div>
                <span className="challenge-count">{c.progress}/{c.goal || c.target}</span>
              </div>
              {done && <span className="challenge-reward">+{c.reward}</span>}
            </div>
          );
        })}
      </div>
      {canClaim && (
        <button className="btn btn-sm" onClick={claimDailyReward}>Claim Daily Reward</button>
      )}
    </div>
  );
}
