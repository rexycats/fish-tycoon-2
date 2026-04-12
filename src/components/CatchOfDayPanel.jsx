// ============================================================
// CATCH OF THE DAY — Wild pond mini-game
// Click swimming shadows within 30 seconds
// ============================================================
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { pickShadow, createCaughtFish, canPlayCatch } from '../data/catchOfDay.js';
import { playCoin, playBubble, playDiscover } from '../services/soundService.js';

const GAME_DURATION = 30; // seconds
const SHADOW_LIFETIME = 3500; // ms before shadow swims away
const SPAWN_INTERVAL = 900; // ms between new shadows

const RARITY_COLORS = {
  common: '#7ec8a0', uncommon: '#6ab0de', rare: '#b07ee8',
  epic: '#f0c040', legendary: '#ff7eb3',
};

export default function CatchOfDayPanel() {
  const player = useGameStore(s => s.player);
  const tanks = useGameStore(s => s.tanks);
  const [phase, setPhase] = useState('intro'); // intro | playing | results
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [shadows, setShadows] = useState([]);
  const [caught, setCaught] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastCatchTime, setLastCatchTime] = useState(0);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const eligible = canPlayCatch({ player });

  const startGame = useCallback(() => {
    setPhase('playing');
    setTimeLeft(GAME_DURATION);
    setShadows([]);
    setCaught([]);
    setScore(0);
    setCombo(0);
  }, []);

  // Game timer
  useEffect(() => {
    if (phase !== 'playing') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setPhase('results');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  // Shadow spawner
  useEffect(() => {
    if (phase !== 'playing') return;
    const luckBonus = (player.prestigeLevel || 0) * 0.1;
    const spawn = () => {
      const shadow = pickShadow(luckBonus);
      const id = Date.now() + Math.random();
      const fromLeft = Math.random() > 0.5;
      setShadows(prev => [...prev.slice(-8), {
        id,
        rarity: shadow.rarity,
        speed: shadow.speed,
        size: shadow.size,
        points: shadow.points,
        y: 15 + Math.random() * 65,
        fromLeft,
        x: fromLeft ? -10 : 110,
        spawnedAt: Date.now(),
      }]);
    };
    spawn(); // First shadow immediately
    spawnRef.current = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(spawnRef.current);
  }, [phase, player.prestigeLevel]);

  // Animate shadows
  useEffect(() => {
    if (phase !== 'playing') return;
    const frame = setInterval(() => {
      setShadows(prev => prev
        .map(s => ({
          ...s,
          x: s.x + (s.fromLeft ? 1 : -1) * s.speed * 0.8,
        }))
        .filter(s => Date.now() - s.spawnedAt < SHADOW_LIFETIME && s.x > -15 && s.x < 115)
      );
    }, 50);
    return () => clearInterval(frame);
  }, [phase]);

  const handleCatch = (shadow) => {
    // Remove shadow
    setShadows(prev => prev.filter(s => s.id !== shadow.id));

    // Combo: catches within 1.5s of each other
    const now = Date.now();
    const newCombo = (now - lastCatchTime < 1500) ? combo + 1 : 1;
    setLastCatchTime(now);
    setCombo(newCombo);

    const comboMult = Math.min(3, 1 + (newCombo - 1) * 0.5);
    const points = Math.round(shadow.points * comboMult);
    setScore(s => s + points);
    setCaught(prev => [...prev, { ...shadow, comboMult }]);

    if (shadow.rarity === 'rare' || shadow.rarity === 'epic' || shadow.rarity === 'legendary') {
      playDiscover();
    } else {
      playBubble();
    }
  };

  const handleClaimCatch = () => {
    const tankId = tanks[0]?.id || 'tank_0';
    const capacity = tanks[0]?.capacity || 12;
    const currentCount = useGameStore.getState().fish.filter(f => f.tankId === tankId).length;
    const room = capacity - currentCount;

    // Keep only the best catches that fit
    const sorted = [...caught].sort((a, b) => b.points - a.points);
    const toKeep = sorted.slice(0, Math.min(3, room)); // Max 3 fish per game

    useGameStore.setState(state => {
      for (const shadow of toKeep) {
        const fish = createCaughtFish(shadow, tankId);
        state.fish.push(fish);
      }
      state.player.coins += Math.round(score * 0.1); // 10% of score as bonus coins
      state.player.xp = (state.player.xp || 0) + Math.min(50, Math.round(score * 0.2));
      state.player.lastCatchDate = new Date().toDateString();
      state.player.stats.catchGamesPlayed = (state.player.stats.catchGamesPlayed || 0) + 1;
      state.player.stats.fishCaught = (state.player.stats.fishCaught || 0) + toKeep.length;
    });

    playCoin();
    setPhase('claimed');
  };

  return (
    <div className="catch-game">
      <div className="catch-title">🎣 Catch of the Day</div>

      {phase === 'intro' && (
        <div className="catch-intro">
          <p>A wild pond has been spotted nearby! Click the swimming shadows to catch fish.</p>
          <p className="catch-rules">
            ⏱ {GAME_DURATION} seconds · 🐟 Keep up to 3 best catches · ⚡ Chain catches for combo multiplier
          </p>
          {!eligible ? (
            <div className="catch-cooldown">You've already fished today. Come back tomorrow!</div>
          ) : (
            <button className="btn btn-primary catch-start" onClick={startGame}>
              🎣 Cast your net!
            </button>
          )}
        </div>
      )}

      {phase === 'playing' && (
        <>
          <div className="catch-hud">
            <span className="catch-timer">{timeLeft}s</span>
            <span className="catch-score">Score: {score}</span>
            {combo > 1 && <span className="catch-combo">×{combo} COMBO!</span>}
            <span className="catch-count">Caught: {caught.length}</span>
          </div>
          <div className="catch-pond">
            {/* Water surface */}
            <div className="catch-surface"/>
            {/* Swimming shadows */}
            {shadows.map(s => (
              <div key={s.id} className={`catch-shadow catch-shadow--${s.rarity}`}
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  transform: `scaleX(${s.fromLeft ? 1 : -1}) scale(${s.size})`,
                }}
                onClick={() => handleCatch(s)}>
                <svg width="50" height="25" viewBox="0 0 50 25">
                  <ellipse cx="22" cy="12" rx="18" ry="8" fill="rgba(0,0,0,0.4)" />
                  <path d="M40,12 L48,6 L48,18 Z" fill="rgba(0,0,0,0.3)" />
                  {(s.rarity === 'epic' || s.rarity === 'legendary') && (
                    <ellipse cx="22" cy="12" rx="20" ry="10" fill="none"
                      stroke={RARITY_COLORS[s.rarity]} strokeWidth="1.5" opacity="0.5"/>
                  )}
                </svg>
                {s.rarity !== 'common' && (
                  <span className="catch-shadow-rarity" style={{ color: RARITY_COLORS[s.rarity] }}>
                    {s.rarity === 'legendary' ? '★' : s.rarity === 'epic' ? '◆' : s.rarity === 'rare' ? '●' : '○'}
                  </span>
                )}
              </div>
            ))}
            {/* Catch splash effects */}
            <div className="catch-ripples"/>
          </div>
        </>
      )}

      {phase === 'results' && (
        <div className="catch-results">
          <div className="catch-results-title">Time's up!</div>
          <div className="catch-results-score">Final Score: {score}</div>
          <div className="catch-results-summary">
            Caught {caught.length} fish
            {caught.filter(c => c.rarity === 'rare').length > 0 && ` · ${caught.filter(c => c.rarity === 'rare').length} rare`}
            {caught.filter(c => c.rarity === 'epic').length > 0 && ` · ${caught.filter(c => c.rarity === 'epic').length} epic!`}
            {caught.filter(c => c.rarity === 'legendary').length > 0 && ` · ${caught.filter(c => c.rarity === 'legendary').length} LEGENDARY!!`}
          </div>
          <div className="catch-results-rewards">
            <div>🐟 Keep up to 3 best fish</div>
            <div>🪙 +{Math.round(score * 0.1)} bonus coins</div>
            <div>⭐ +{Math.min(50, Math.round(score * 0.2))} XP</div>
          </div>
          <button className="btn btn-primary" onClick={handleClaimCatch}>
            Claim your catch!
          </button>
        </div>
      )}

      {phase === 'claimed' && (
        <div className="catch-claimed">
          <div className="catch-claimed-icon">🎣</div>
          <div>Great fishing! Your catches are in the tank.</div>
        </div>
      )}
    </div>
  );
}
