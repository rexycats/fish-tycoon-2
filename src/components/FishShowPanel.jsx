// ============================================================
// FISH SHOW — Competition mini-game UI
// ============================================================
import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { scoreFish, generateCompetitors, getShowReward, canEnterShow, JUDGE_NAMES } from '../data/fishShow.js';
import { getLevelFromXp } from '../data/levels.js';
import FishSprite from './FishSprite.jsx';

export default function FishShowPanel() {
  const player = useGameStore(s => s.player);
  const fish = useGameStore(s => s.fish);
  const [phase, setPhase] = useState('select'); // select | judging | results
  const [selectedFishId, setSelectedFishId] = useState(null);
  const [scores, setScores] = useState(null);
  const [results, setResults] = useState(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [judgingStep, setJudgingStep] = useState(0);

  const eligible = canEnterShow({ player });
  const adults = useMemo(() => fish.filter(f => f.stage === 'adult'), [fish]);
  const { level } = getLevelFromXp(player.xp || 0);

  const handleEnter = () => {
    if (!selectedFishId || !eligible) return;
    const entry = fish.find(f => f.id === selectedFishId);
    if (!entry) return;

    const playerScores = scoreFish(entry);
    const competitors = generateCompetitors(level);

    setScores(playerScores);
    setPhase('judging');
    setCurrentRound(0);
    setJudgingStep(0);

    // Animate judging rounds
    const rounds = ['beauty', 'tricks', 'size'];
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step <= 3) {
        setCurrentRound(step);
        setJudgingStep(step);
      } else {
        clearInterval(interval);
        // Calculate placement
        const allEntries = [
          { name: entry.nickname || entry.species?.name || 'Your Fish', isPlayer: true, ...playerScores },
          ...competitors,
        ].sort((a, b) => b.total - a.total);

        const placement = allEntries.findIndex(e => e.isPlayer) + 1;
        const reward = getShowReward(placement, competitors.length);

        setResults({ allEntries, placement, reward, fishName: entry.nickname || entry.species?.name });
        setPhase('results');
      }
    }, 1200);
  };

  const handleClaimReward = () => {
    if (!results) return;
    useGameStore.setState(state => {
      state.player.coins += results.reward.coins;
      state.player.totalCoinsEarned = (state.player.totalCoinsEarned || 0) + results.reward.coins;
      state.player.xp = (state.player.xp || 0) + results.reward.xp;
      state.player.lastShowDate = new Date().toDateString();
      state.player.stats.showsEntered = (state.player.stats.showsEntered || 0) + 1;
      if (results.placement === 1) state.player.stats.showsWon = (state.player.stats.showsWon || 0) + 1;
    });
    setPhase('done');
  };

  const judge = JUDGE_NAMES[Math.floor(Math.random() * JUDGE_NAMES.length)];

  return (
    <div className="fish-show">
      <div className="fish-show-title">Fish Show</div>

      {!eligible && phase === 'select' && (
        <div className="fish-show-cooldown">
          You've already entered today's show. Come back tomorrow!
        </div>
      )}

      {phase === 'select' && eligible && (
        <>
          <p className="fish-show-intro">Select your best fish to compete in Beauty, Tricks, and Size!</p>
          <div className="fish-show-roster">
            {adults.length === 0 && <div className="goals-empty">No adult fish to enter.</div>}
            {adults.map(f => (
              <div key={f.id}
                className={`fish-show-entry ${selectedFishId === f.id ? 'selected' : ''}`}
                onClick={() => setSelectedFishId(f.id)}>
                <div className="fish-show-entry-sprite">
                  <FishSprite fish={f} size={40} />
                </div>
                <div className="fish-show-entry-info">
                  <div className="fish-show-entry-name">{f.nickname || f.species?.name}</div>
                  <div className="fish-show-entry-meta">
                    {f.species?.rarity} · {f.personality} · {f.phenotype?.size || 'Medium'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary fish-show-enter" disabled={!selectedFishId}
            onClick={handleEnter}>
            Enter the Show!
          </button>
        </>
      )}

      {phase === 'judging' && (
        <div className="fish-show-judging">
          <div className="fish-show-judge">{judge}</div>
          <div className="fish-show-rounds">
            {['Beauty', 'Tricks', 'Size'].map((label, i) => (
              <div key={i} className={`fish-show-round ${judgingStep > i ? 'revealed' : judgingStep === i ? 'judging' : ''}`}>
                <div className="fish-show-round-label">{label}</div>
                {judgingStep > i && scores && (
                  <div className="fish-show-round-score">
                    {[scores.beauty, scores.tricks, scores.size][i]}/10
                  </div>
                )}
                {judgingStep === i && <div className="fish-show-round-judging">Judging...</div>}
              </div>
            ))}
          </div>
          {judgingStep > 0 && scores && (
            <div className="fish-show-total">Total: {
              (judgingStep >= 1 ? scores.beauty : 0) +
              (judgingStep >= 2 ? scores.tricks : 0) +
              (judgingStep >= 3 ? scores.size : 0)
            }/30</div>
          )}
        </div>
      )}

      {phase === 'results' && results && (
        <div className="fish-show-results">
          <div className={`fish-show-placement fish-show-placement--${results.reward.trophy || 'none'}`}>
            {results.reward.label}
          </div>
          <div className="fish-show-results-fish">
            {results.fishName} scored {results.allEntries.find(e => e.isPlayer)?.total}/30
          </div>
          <div className="fish-show-leaderboard">
            {results.allEntries.slice(0, 5).map((entry, i) => (
              <div key={i} className={`fish-show-lb-row ${entry.isPlayer ? 'player' : ''}`}>
                <span className="fish-show-lb-rank">#{i + 1}</span>
                <span className="fish-show-lb-name">{entry.name}</span>
                <span className="fish-show-lb-score">{entry.total}/30</span>
              </div>
            ))}
          </div>
          <div className="fish-show-reward">
            Reward: 🪙{results.reward.coins} + {results.reward.xp} XP
          </div>
          <button className="btn btn-primary" onClick={handleClaimReward}>
            Claim Reward!
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="fish-show-done">
          <div className="fish-show-done-icon">Done</div>
          <div>Reward claimed! See you at the next show.</div>
        </div>
      )}
    </div>
  );
}
