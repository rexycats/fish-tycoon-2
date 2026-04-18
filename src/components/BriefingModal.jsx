// ============================================================
// BRIEFING MODAL — Campaign level intro (cute style)
// ============================================================
import React from 'react';

export default function BriefingModal({ level, onStart, onBack }) {
  if (!level) return null;

  return (
    <div className="cm-briefing-overlay" onClick={onBack}>
      <div className="cm-briefing" onClick={e => e.stopPropagation()}>
        {/* Header with level icon */}
        <div className="cm-briefing-header">
          <div className="cm-briefing-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="rgba(143,231,255,0.2)" stroke="#5cbfcf" strokeWidth="1.5" />
              <path d="M8 12l3 3 5-6" stroke="#5cbfcf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="cm-briefing-title">{level.name}</h3>
          <p className="cm-briefing-desc">{level.description}</p>
        </div>

        {/* Story text */}
        <div className="cm-briefing-story">
          {level.briefing.split('\n').map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Objectives */}
        <div className="cm-briefing-objectives">
          <div className="cm-briefing-obj-label">Objectives</div>
          {level.objectives.map(obj => (
            <div key={obj.id} className="cm-briefing-obj">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="#8fe7ff" strokeWidth="2" />
              </svg>
              <span>{obj.label}</span>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="cm-briefing-actions">
          <button className="cm-briefing-start" onClick={onStart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M7 4l14 8-14 8V4z" fill="white" strokeLinejoin="round" />
            </svg>
            Start Level
          </button>
          <button className="cm-briefing-back" onClick={onBack}>Back</button>
        </div>
      </div>
    </div>
  );
}
