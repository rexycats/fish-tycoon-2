// ============================================================
// BRIEFING MODAL — Campaign level start briefing
// ============================================================
import React from 'react';

export default function BriefingModal({ level, onStart, onBack }) {
  if (!level) return null;

  return (
    <div className="briefing-overlay" onClick={onBack}>
      <div className="briefing-modal" onClick={e => e.stopPropagation()}>
        <div className="briefing-header">{level.name}</div>
        <div className="briefing-desc">{level.description}</div>
        <div className="briefing-text">
          {level.briefing.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="briefing-objectives">
          <div className="briefing-obj-title">OBJECTIVES</div>
          {level.objectives.map(obj => (
            <div key={obj.id} className="briefing-obj-row">
              <span className="briefing-obj-dot">○</span>
              <span>{obj.label}</span>
            </div>
          ))}
        </div>
        <div className="briefing-actions">
          <button className="btn briefing-btn briefing-btn--start" onClick={onStart}>
            Start Level
          </button>
          <button className="btn briefing-btn" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
