// ============================================================
// REVIEWS PANEL — Show aquarium reviews from critics
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export default function ReviewsPanel() {
  const reviews = useGameStore(s => s.reviews || []);
  const reputation = useGameStore(s => s.shop?.reputation || 0);

  // Average rating
  const avg = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.stars, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <div className="reviews-panel">
      <div className="reviews-header">
        <div>
          <div className="reviews-title">AQUARIUM REVIEWS</div>
          <div className="reviews-meta">{reviews.length} reviews — avg {avg}/5 — reputation: {reputation}</div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="reviews-empty">No reviews yet. Keep your aquarium running and critics will visit!</div>
      ) : (
        <div className="reviews-list">
          {reviews.map((r, i) => (
            <div key={i} className={`review-card review-card--${r.stars >= 4 ? 'good' : r.stars <= 2 ? 'bad' : 'mid'}`}>
              <div className="review-card-top">
                <span className="review-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                <span className="review-critic">{r.critic}</span>
              </div>
              <div className="review-headline">{r.headline}</div>
              <div className="review-details">
                Diversity: {r.details.diversity} species — Cleanliness: {r.details.cleanliness}% — Happiness: {r.details.happiness}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
