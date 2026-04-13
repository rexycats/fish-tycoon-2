// ============================================================
// WANTED BOARD — Breeding goal posters
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { fishMatchesPoster } from '../data/wantedBoard.js';

export default function WantedBoard() {
  const posters = useGameStore(s => s.wantedPosters || []);
  const fish = useGameStore(s => s.fish);
  const fulfillWanted = useGameStore(s => s.fulfillWanted);

  const activePosters = posters.filter(p => !p.fulfilled && p.expiresAt > Date.now());

  if (activePosters.length === 0) {
    return (
      <div className="wanted-board">
        <h3 className="wanted-title section-title">📋 Wanted Board</h3>
        <div className="wanted-empty">No active bounties. New ones appear as you level up!</div>
      </div>
    );
  }

  return (
    <div className="wanted-board">
      <h3 className="wanted-title section-title">📋 Wanted Board</h3>
      <div className="wanted-posters">
        {activePosters.map(poster => {
          const matchingFish = fish.filter(f => fishMatchesPoster(f, poster));
          const hoursLeft = Math.max(0, Math.ceil((poster.expiresAt - Date.now()) / 3600000));
          const urgent = hoursLeft <= 1;
          return (
            <div key={poster.id} className={`wanted-poster ${urgent ? 'wanted-poster--urgent' : ''}`}>
              <div className="wanted-poster-header">
                <span className="wanted-poster-buyer">{poster.buyer}</span>
                <span className={`wanted-poster-timer ${urgent ? 'wanted-poster-timer--urgent' : ''}`}>
                  ⏳ {hoursLeft}h left
                </span>
              </div>
              <div className="wanted-poster-wants">
                <span className="wanted-poster-label">WANTED:</span>
                {Object.entries(poster.traits).map(([trait, value]) => (
                  <span key={trait} className="wanted-trait-tag">{value}</span>
                ))}
              </div>
              <div className="wanted-poster-reward">
                Reward: <span className="wanted-reward-amount">🪙 {poster.reward}</span>
              </div>
              {matchingFish.length > 0 ? (
                <div className="wanted-poster-matches">
                  <span className="wanted-match-label">✅ {matchingFish.length} match{matchingFish.length > 1 ? 'es' : ''}!</span>
                  <button className="btn btn-primary btn-sm"
                    onClick={() => fulfillWanted(poster.id, matchingFish[0].id)}>
                    Deliver {matchingFish[0].species?.name || 'Fish'} → 🪙{poster.reward}
                  </button>
                </div>
              ) : (
                <div className="wanted-poster-hint">
                  Breed a fish with these traits to claim the bounty
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
