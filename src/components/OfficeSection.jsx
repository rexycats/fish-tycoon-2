// ============================================================
// OFFICE SECTION — Contracts, Decor, Autopsy
// Owns its own internal view state
// ============================================================
import React, { useState, memo } from 'react';
import GoalsPanel from './GoalsPanel.jsx';
import FishShowPanel from './FishShowPanel.jsx';
import DecorationPanel from './DecorationPanel.jsx';
import FishAutopsyPanel from './FishAutopsy.jsx';
import TabErrorBoundary from './TabErrorBoundary.jsx';
import { useGameStore } from '../store/gameStore.js';

const MemoDecorationPanel = memo(DecorationPanel);
const MemoFishAutopsy = memo(FishAutopsyPanel);

const VIEWS = [
  { id: 'contracts', label: 'Contracts' },
  { id: 'decor',     label: 'Decor' },
  { id: 'autopsy',   label: 'Autopsy' },
];

export default function OfficeSection() {
  const [view, setView] = useState('contracts');
  const game = useGameStore(s => s.game);
  const player = useGameStore(s => s.player);
  const tanks = useGameStore(s => s.tanks);
  const activeTankId = tanks?.[0]?.id;
  const activeTank = tanks?.find(t => t.id === activeTankId) || tanks?.[0];
  const dailyChallenges = useGameStore(s => s.dailyChallenges || []);

  const buyDecoration = useGameStore(s => s.buyDecoration);
  const placeDecoration = useGameStore(s => s.placeDecoration);
  const removeDecoration = useGameStore(s => s.removeDecoration);
  const claimUnlockedDecoration = useGameStore(s => s.claimUnlockedDecoration);
  const buyTheme = useGameStore(s => s.buyTheme);
  const applyTheme = useGameStore(s => s.applyTheme);

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
            onBuyDecor={buyDecoration}
            onPlaceDecor={placeDecoration}
            onRemoveDecor={removeDecoration}
            unlockedDecorations={player.unlockedDecorations || []}
            onClaimUnlockedDecor={claimUnlockedDecoration}
            onBuyTheme={buyTheme}
            onApplyTheme={applyTheme}
          />
        )}
        {view === 'autopsy' && (
          <MemoFishAutopsy autopsies={player.autopsies || []} />
        )}
      </div>
    </div>
  );
}

// ── Daily Challenges (moved here from App.jsx) ────────────
function DailyChallengesPanel({ dailyChallenges, streak = 0 }) {
  const claimDailyReward = useGameStore(s => s.claimDailyReward);
  const player = useGameStore(s => s.player);
  if (!dailyChallenges || dailyChallenges.length === 0) return null;

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
          const done = c.progress >= c.target;
          return (
            <div key={i} className={`challenge-card ${done ? 'challenge-card--done' : ''}`}>
              <div className="challenge-desc">{c.desc}</div>
              <div className="challenge-progress">
                <div className="challenge-bar">
                  <div className="challenge-bar-fill" style={{ width: `${Math.min(100, (c.progress / c.target) * 100)}%` }} />
                </div>
                <span className="challenge-count">{c.progress}/{c.target}</span>
              </div>
              {done && <span className="challenge-reward">+{c.reward}</span>}
            </div>
          );
        })}
      </div>
      {!player.lastDailyClaimDate || player.lastDailyClaimDate !== new Date().toISOString().slice(0, 10) ? (
        <button className="btn btn-sm" onClick={claimDailyReward}>Claim Daily Reward</button>
      ) : null}
    </div>
  );
}
