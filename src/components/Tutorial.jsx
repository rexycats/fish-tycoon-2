// ============================================================
// FISH TYCOON 2 — TUTORIAL OVERLAY
// ============================================================
import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { TUTORIAL_STEPS } from '../data/tutorial.js';

export default function Tutorial() {
  const tutorialStep = useGameStore(s => s.player?.tutorialStep ?? 0);
  const tutorialDone = useGameStore(s => s.player?.tutorialDone);
  const state = useGameStore();

  const step = TUTORIAL_STEPS[tutorialStep];

  // Auto-advance when waitFor condition is met
  useEffect(() => {
    if (!step || tutorialDone || !step.waitFor) return;
    const id = setInterval(() => {
      const s = useGameStore.getState();
      if (step.waitFor(s)) {
        useGameStore.setState(st => {
          st.player.tutorialStep = tutorialStep + 1;
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, [tutorialStep, tutorialDone, step]);

  if (tutorialDone || !step) return null;

  const isLast = tutorialStep >= TUTORIAL_STEPS.length - 1;
  const isFirst = tutorialStep === 0;
  const hasCondition = !!step.waitFor && !isFirst && !isLast;

  const advance = () => {
    if (isLast) {
      useGameStore.setState(st => { st.player.tutorialDone = true; });
    } else {
      useGameStore.setState(st => { st.player.tutorialStep = tutorialStep + 1; });
    }
  };

  const skip = () => {
    useGameStore.setState(st => { st.player.tutorialDone = true; });
  };

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-card">
        <div className="tutorial-progress">
          {TUTORIAL_STEPS.map((_, i) => (
            <div key={i} className={`tutorial-dot ${i < tutorialStep ? 'done' : ''} ${i === tutorialStep ? 'active' : ''}`} />
          ))}
        </div>
        <div className="tutorial-title">{step.title}</div>
        <div className="tutorial-text">{step.text}</div>
        {step.highlight && (
          <div className="tutorial-hint">
            Click the <strong>{{ shop: 'Shop', tank: 'Tank', breed: 'Breed', challenges: 'Goals' }[step.highlight] || step.highlight}</strong> tab
            {step.highlight === 'feed' ? ' or use the Feed button' : ''}
          </div>
        )}
        <div className="tutorial-actions">
          {!isFirst && (
            <button className="btn btn-sm" onClick={() => useGameStore.setState(st => { st.player.tutorialStep = tutorialStep - 1; })}>
              ← Back
            </button>
          )}
          <button className="btn btn-sm btn-primary" onClick={advance}>
            {isLast ? 'Start Playing' : hasCondition ? 'Skip →' : 'Next →'}
          </button>
          {!isLast && (
            <button className="btn btn-sm tutorial-skip" onClick={skip}>
              Skip Tutorial
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
