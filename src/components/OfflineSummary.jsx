import React, { useState } from 'react';

function EventCard({ event }) {
  if (!event) return null;
  return (
    <div className="offline-discovery">
      <div className="offline-discovery-glow" />
      <div className="offline-discovery-emoji">{event.emoji}</div>
      <div className="offline-discovery-body">
        <div className="offline-discovery-headline">{event.headline}</div>
        <div className="offline-discovery-detail">
          {event.detail.split('**').map((part, i) =>
            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
          )}
        </div>
        {event.type === 'found_item' && event.coinBonus && (
          <div className="offline-discovery-reward">+🪙{event.coinBonus} added to your wallet</div>
        )}
        {event.type === 'visitor' && event.fish && event.fish.species && (
          <div className="offline-discovery-reward">
            {event.fish.species.name} added to your tank
          </div>
        )}
        {event.type === 'mutation' && (
          <div className="offline-discovery-reward">Sale value increased ×1.5</div>
        )}
      </div>
    </div>
  );
}

export default function OfflineSummary({ summary, onDismiss }) {
  const [revealed, setRevealed] = useState(false);

  if (!summary) return null;

  const { timeAway, eggsHatched, fishGrown, fishSold, coinsEarned,
          waterQualityLost, fishDied, offlineEvent, ambientMessage, hasEvents } = summary;

  const hasActivity = eggsHatched > 0 || fishGrown > 0 || fishSold > 0 || fishDied > 0;

  const handleReveal = () => {
    if (offlineEvent && !revealed) {
      setRevealed(true);
    } else {
      onDismiss();
    }
  };

  return (
    <div className="offline-overlay" onClick={onDismiss}>
      <div className="offline-modal offline-modal-v2" onClick={e => e.stopPropagation()}>

        <div className="offline-header">
          <div className="offline-away-badge">⏰ {timeAway}</div>
          <div className="offline-title-v2">While you were away…</div>
          {ambientMessage && (
            <div className="offline-ambient">
              <span>{ambientMessage.emoji}</span>
              <span>{ambientMessage.text}</span>
            </div>
          )}
        </div>

        {hasEvents && hasActivity && (
          <div className="offline-activity">
            {eggsHatched > 0 && (
              <div className="offline-row">
                <span className="offline-row-icon">🐣</span>
                <span className="offline-row-text">
                  {eggsHatched === 1 ? 'An egg hatched' : `${eggsHatched} eggs hatched`}
                </span>
              </div>
            )}
            {fishGrown > 0 && (
              <div className="offline-row">
                <span className="offline-row-icon">🐟</span>
                <span className="offline-row-text">
                  {fishGrown === 1 ? '1 juvenile grew into an adult' : `${fishGrown} juveniles grew into adults`}
                </span>
              </div>
            )}
            {fishSold > 0 && (
              <div className="offline-row">
                <span className="offline-row-icon">💰</span>
                <span className="offline-row-text">
                  Sold {fishSold} fish — earned <strong>🪙{coinsEarned}</strong>
                </span>
              </div>
            )}
            {fishDied > 0 && (
              <div className="offline-row offline-row-warn">
                <span className="offline-row-icon">💀</span>
                <span className="offline-row-text">
                  {fishDied === 1 ? "1 fish didn't make it" : `${fishDied} fish didn't make it`}
                </span>
              </div>
            )}
            {waterQualityLost > 15 && (
              <div className="offline-row offline-row-warn">
                <span className="offline-row-icon">💧</span>
                <span className="offline-row-text">
                  Water quality dropped {waterQualityLost}% — check your filters
                </span>
              </div>
            )}
          </div>
        )}

        {offlineEvent && !revealed && (
          <button className="offline-discover-btn" onClick={handleReveal}>
            <span>{offlineEvent.emoji}</span>
            <span>Something happened… tap to reveal</span>
            <span className="offline-discover-chevron">›</span>
          </button>
        )}

        {offlineEvent && revealed && (
          <EventCard event={offlineEvent} />
        )}

        <button
          className="btn btn-collect offline-dismiss"
          onClick={offlineEvent && !revealed ? handleReveal : onDismiss}
        >
          {offlineEvent && !revealed ? "What happened?" : "Let's go!"}
        </button>
      </div>
    </div>
  );
}
