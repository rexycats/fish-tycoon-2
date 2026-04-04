import React from 'react';

export default function OfflineSummary({ summary, onDismiss }) {
  if (!summary || !summary.hasEvents) return null;

  return (
    <div className="offline-overlay" onClick={onDismiss}>
      <div className="offline-modal" onClick={e => e.stopPropagation()}>
        <div className="offline-title">⏰ While You Were Away</div>
        <div className="offline-time">{summary.timeAway} passed</div>

        <div className="offline-events">
          {summary.eggsHatched > 0 && (
            <div className="offline-event">
              <span className="oe-icon">🐣</span>
              <span>{summary.eggsHatched} egg{summary.eggsHatched > 1 ? 's' : ''} hatched</span>
            </div>
          )}
          {summary.fishedGrown > 0 && (
            <div className="offline-event">
              <span className="oe-icon">🐟</span>
              <span>{summary.fishedGrown} fish grew into adults</span>
            </div>
          )}
          {summary.fishSold > 0 && (
            <div className="offline-event">
              <span className="oe-icon">💰</span>
              <span>Sold {summary.fishSold} fish — earned 🪙{summary.coinsEarned}</span>
            </div>
          )}
          {summary.waterQualityLost > 10 && (
            <div className="offline-event warn">
              <span className="oe-icon">💧</span>
              <span>Water quality dropped by {summary.waterQualityLost}%</span>
            </div>
          )}
        </div>

        <button className="btn btn-collect" onClick={onDismiss}>Got it!</button>
      </div>
    </div>
  );
}
