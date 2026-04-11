// ============================================================
// FISH TYCOON 2 — CAMPAIGN PANEL
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';
import { MILESTONES, getChapterProgress } from '../data/campaign.js';

export default function CampaignPanel() {
  const state = useGameStore();
  const completed = state.player?.completedMilestones || [];
  const chapters = getChapterProgress(state);

  const totalDone = completed.length;
  const totalMilestones = MILESTONES.length;
  const pct = Math.round((totalDone / totalMilestones) * 100);

  return (
    <div className="campaign-panel">
      <div className="campaign-header">
        <div className="campaign-title">🏆 Campaign Progress</div>
        <div className="campaign-overall">
          <div className="campaign-overall-text">{totalDone}/{totalMilestones} milestones ({pct}%)</div>
          <div className="campaign-overall-bar">
            <div className="campaign-overall-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {Object.entries(chapters).map(([chNum, ch]) => {
        const chapterMilestones = MILESTONES.filter(m => m.chapter === Number(chNum));
        const allDone = ch.done === ch.total;

        return (
          <div key={chNum} className={`campaign-chapter ${allDone ? 'complete' : ''}`}>
            <div className="campaign-chapter-header">
              <span className="campaign-chapter-name">{ch.name}</span>
              <span className="campaign-chapter-count">{ch.done}/{ch.total}</span>
            </div>

            <div className="campaign-milestones">
              {chapterMilestones.map(m => {
                const done = completed.includes(m.id);
                let progress = null;

                // Show progress hints for incomplete milestones
                if (!done) {
                  try { progress = m.check(state); } catch {}
                }

                return (
                  <div key={m.id} className={`campaign-milestone ${done ? 'done' : ''}`}>
                    <span className="campaign-milestone-icon">{done ? '✅' : m.icon}</span>
                    <div className="campaign-milestone-info">
                      <div className="campaign-milestone-title">{m.title}</div>
                      <div className="campaign-milestone-desc">{m.desc}</div>
                    </div>
                    {done && m.reward?.coins && (
                      <span className="campaign-milestone-reward">+🪙{m.reward.coins}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
