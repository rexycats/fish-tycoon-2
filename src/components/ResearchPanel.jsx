// ============================================================
// RESEARCH PANEL — Spend coins for permanent passive bonuses
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { RESEARCH_BRANCHES } from '../data/research.js';

export default function ResearchPanel() {
  const research = useGameStore(s => s.player?.research || {});
  const coins = useGameStore(s => s.player?.coins || 0);
  const purchaseResearch = useGameStore(s => s.purchaseResearch);

  return (
    <div className="research-panel">
      <div className="research-header">
        <div className="research-title">RESEARCH LAB</div>
        <div className="research-subtitle">Invest in permanent upgrades for your aquarium</div>
      </div>

      <div className="research-branches">
        {Object.values(RESEARCH_BRANCHES).map(branch => {
          const level = research[branch.id] || 0;
          const maxed = level >= branch.tiers.length;
          return (
            <div key={branch.id} className="research-branch">
              <div className="research-branch-header" style={{ borderLeftColor: branch.color }}>
                <span className="research-branch-label">{branch.label}</span>
                <span className="research-branch-progress">{level}/{branch.tiers.length}</span>
              </div>

              <div className="research-tiers">
                {branch.tiers.map((tier, i) => {
                  const unlocked = i < level;
                  const current = i === level;
                  const locked = i > level;
                  const canAfford = coins >= tier.cost;
                  return (
                    <div
                      key={i}
                      className={`research-tier ${unlocked ? 'research-tier--done' : ''} ${current ? 'research-tier--current' : ''} ${locked ? 'research-tier--locked' : ''}`}
                    >
                      <div className="research-tier-header">
                        <span className="research-tier-check">{unlocked ? '✓' : current ? '○' : '·'}</span>
                        <span className="research-tier-name">{tier.label}</span>
                        {!unlocked && <span className="research-tier-cost">{tier.cost}</span>}
                      </div>
                      <div className="research-tier-desc">{tier.desc}</div>
                      {current && !maxed && (
                        <button
                          className="btn research-buy-btn"
                          onClick={() => purchaseResearch(branch.id)}
                          disabled={!canAfford}
                          style={{ borderColor: canAfford ? branch.color : undefined }}
                        >
                          Research ({tier.cost})
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {maxed && (
                <div className="research-maxed" style={{ color: branch.color }}>
                  Fully Researched
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
