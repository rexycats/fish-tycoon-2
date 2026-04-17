// ============================================================
// FISH TYCOON 2 — EVENT POPUP + CUSTOMER HAGGLE UI
// ============================================================
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

// ── Random Event Popup ──────────────────────────────────────
export function EventPopup() {
  const activeEvent = useGameStore(s => s.activeEvent);
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (activeEvent && activeEvent.id !== event?.id) {
      setEvent(activeEvent);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    }
  }, [activeEvent?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible || !event) return null;

  return (
    <div className="event-popup" onClick={() => setVisible(false)}>
      <div className="event-popup-emoji">{event.emoji}</div>
      <div className="event-popup-content">
        <div className="event-popup-title">{event.name}</div>
        <div className="event-popup-desc">{event.desc}</div>
      </div>
      <div className="event-popup-dismiss">✕</div>
    </div>
  );
}

// ── Customer Haggle Popup ────────────────────────────────────
export function HagglePopup() {
  const haggle = useGameStore(s => s.pendingHaggle);
  const resolveHaggle = useGameStore(s => s.resolveHaggle);
  const [counterOffer, setCounterOffer] = useState('');
  const [phase, setPhase] = useState('offer'); // 'offer' | 'counter' | 'result'
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (haggle) {
      setPhase('offer');
      setResult(null);
      setCounterOffer(String(Math.round((haggle.offer + haggle.askPrice) / 2)));
    }
  }, [haggle?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!haggle) return null;

  const handleAccept = () => {
    setResult({ accepted: true, price: haggle.offer });
    setPhase('result');
    setTimeout(() => resolveHaggle('accept'), 1500);
  };

  const handleDecline = () => {
    setResult({ accepted: false });
    setPhase('result');
    setTimeout(() => resolveHaggle('decline'), 1200);
  };

  const handleCounter = () => {
    if (phase === 'offer') {
      setPhase('counter');
      return;
    }
    const price = parseInt(counterOffer) || 0;
    if (price <= 0) return;
    // Customer accepts if counter is within their max budget
    const accepted = price <= haggle.maxBudget;
    // Customer might meet halfway if close
    const halfway = Math.round((price + haggle.offer) / 2);
    const finalPrice = accepted ? price : (halfway <= haggle.maxBudget ? halfway : 0);

    if (finalPrice > 0) {
      setResult({ accepted: true, price: finalPrice, countered: true });
      setPhase('result');
      setTimeout(() => resolveHaggle('counter', finalPrice), 1500);
    } else {
      setResult({ accepted: false, tooHigh: true });
      setPhase('result');
      setTimeout(() => resolveHaggle('decline'), 1500);
    }
  };

  return (
    <div className="haggle-overlay">
      <div className="haggle-popup">
        <div className="haggle-customer">
          <span className="haggle-emoji">{haggle.customerEmoji}</span>
          <span className="haggle-name">{haggle.customerName}</span>
        </div>

        <div className="haggle-speech">
          "{haggle.greeting}"
        </div>

        <div className="haggle-fish-info">
          Wants to buy: <strong>{haggle.fishName}</strong>
        </div>

        {phase === 'offer' && (
          <>
            <div className="haggle-offer">
              <span className="haggle-offer-label">Their offer:</span>
              <span className="haggle-offer-price">{haggle.offer}</span>
              <span className="haggle-offer-vs">
                {haggle.offer >= haggle.askPrice ? 'Above asking!' : `You asked ${haggle.askPrice}`}
              </span>
            </div>
            <div className="haggle-actions">
              <button className="btn btn-sm haggle-accept" onClick={handleAccept}>
                Accept {haggle.offer}
              </button>
              <button className="btn btn-sm haggle-counter" onClick={handleCounter}>
                Counter-offer
              </button>
              <button className="btn btn-sm haggle-decline" onClick={handleDecline}>
                No deal
              </button>
            </div>
          </>
        )}

        {phase === 'counter' && (
          <div className="haggle-counter-phase">
            <div className="haggle-counter-input">
              <span>Your price:</span>
              <input type="number" value={counterOffer} onChange={e => setCounterOffer(e.target.value)}
                min="1" className="haggle-input" autoFocus />
            </div>
            <div className="haggle-actions">
              <button className="btn btn-sm haggle-accept" onClick={handleCounter}>
                Send offer
              </button>
              <button className="btn btn-sm haggle-decline" onClick={handleDecline}>
                Walk away
              </button>
            </div>
          </div>
        )}

        {phase === 'result' && result && (
          <div className={`haggle-result ${result.accepted ? 'success' : 'failed'}`}>
            {result.accepted ? (
              <>
                <div className="haggle-result-icon">Deal</div>
                <div>SOLD for {result.price}!</div>
                {result.countered && <div className="haggle-result-sub">They accepted your counter-offer.</div>}
              </>
            ) : (
              <>
                <div className="haggle-result-icon">Left</div>
                <div>{result.tooHigh ? 'Too expensive! Customer walked away.' : 'Customer left without buying.'}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
