import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { createDefaultState, saveGame, loadGame, checkAchievements, ACHIEVEMENT_DEFS } from '../data/gameState.js';
import { processTick, applyOfflineProgress, TICK_INTERVAL_MS, refreshDailyChallenges } from '../systems/gameTick.js';
import { fireToast } from '../components/ToastManager.jsx';
import { playDiscover, playSale, setSoundEnabled } from '../services/soundService.js';

/**
 * useGameEngine
 *
 * Owns the canonical game state and every effect that runs on a schedule
 * or reacts to game-state transitions:
 *   - initial load + offline catch-up
 *   - game tick interval
 *   - auto-save (interval + beforeunload + visibilitychange)
 *   - achievement trigger
 *   - sound / toast side-effects (sales, achievements, disease alerts)
 *   - floating coin delta animations
 */
export function useGameEngine() {
  // Load once — both useState lazy initialisers share a single loadGame() call
  // via a ref seeded inside the first lazy init, so loadGame() is never called
  // more than once even under React Strict Mode's double-invocation.
  const initSaveRef = useRef(null);
  const [game, setGame] = useState(() => {
    const saved = loadGame();
    initSaveRef.current = saved;
    let g = saved ? applyOfflineProgress(saved) : createDefaultState();
    g = refreshDailyChallenges(g);
    return g;
  });

  const [showOffline, setShowOffline] = useState(() => {
    const saved = initSaveRef.current;
    return saved ? Date.now() - (saved.lastTickAt || Date.now()) > 30_000 : false;
  });

  const [soundOn, setSoundOn] = useState(true);

  // ── Floating coin deltas ───────────────────────────────────
  const [coinDeltas, setCoinDeltas] = useState([]);
  const coinDeltaCounter = useRef(0);
  const prevCoinsRef     = useRef(game.player.coins);

  // gameRef is used by auto-save so we always flush the latest state
  const gameRef = useRef(game);
  gameRef.current = game;

  // Track coin changes to spawn floating deltas
  useEffect(() => {
    const diff = game.player.coins - prevCoinsRef.current;
    prevCoinsRef.current = game.player.coins;
    if (diff === 0) return;
    const id = ++coinDeltaCounter.current;
    setCoinDeltas(prev => [...prev.slice(-6), { id, diff }]);
    const t = setTimeout(() => setCoinDeltas(prev => prev.filter(d => d.id !== id)), 1400);
    return () => clearTimeout(t);
  }, [game.player.coins]);

  // Refs that track previous lengths so sound/toast effects only fire on changes
  const prevSalesLenRef = useRef((game.shop.salesHistory || []).length);
  const prevAchCountRef = useRef((game.player.achievements || []).length);

  // ── Achievement trigger ─────────────────────────────────────
  // useMemo so the Map build + filter passes only run when a primitive dep
  // actually changes — not on every tick. The key is a joined string so React
  // can compare it with ===; the effect below only fires when it changes.
  const achTriggerKey = useMemo(() => {
    const fishdex = game.player.fishdex || [];
    const fishCountByTank = new Map();
    for (const f of game.fish) fishCountByTank.set(f.tankId, (fishCountByTank.get(f.tankId) || 0) + 1);
    const anyFull      = game.tanks.some(t => (fishCountByTank.get(t.id) || 0) >= (t.capacity || 12)) ? 1 : 0;
    const maxHappiness = game.tanks.reduce((m, t) => Math.max(m, Math.round(t.happiness || 0)), 0);
    const maxUpgLevel  = Object.values(game.shop.upgrades || {}).reduce((m, u) => Math.max(m, u.level || 0), 0);
    return [
      fishdex.length,
      fishdex.filter(e => e.rarity === 'rare').length,
      fishdex.filter(e => e.rarity === 'epic').length,
      (game.shop.salesHistory  || []).length,
      game.player.totalCoinsEarned   || 0,
      game.tanks.length,
      (game.player.magicFishFound || []).length,
      game.player.stats?.eggsCollected || 0,
      game.player.stats?.medicineUsed  || 0,
      game.player.stats?.waterTreated  || 0,
      anyFull,
      maxHappiness,
      maxUpgLevel,
    ].join(',');
  }, [game.fish, game.tanks, game.player.fishdex, game.player.totalCoinsEarned,
      game.player.magicFishFound, game.player.stats, game.shop.salesHistory,
      game.shop.upgrades]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setGame(prev => {
      const msgs = [];
      const next = checkAchievements(prev, msgs);
      return next === prev ? prev : next;
    });
  }, [achTriggerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Game tick ───────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setGame(prev => processTick(prev)), TICK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  // ── Auto-save ───────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => saveGame(gameRef.current), 30_000);
    return () => clearInterval(id);
  }, []);

  // Save on tab close / hide — prevents losing up to 30 s of progress
  useEffect(() => {
    const handleUnload     = () => saveGame(gameRef.current);
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') saveGame(gameRef.current);
    };
    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ── Sound + Toast: sales ────────────────────────────────────
  useEffect(() => {
    const history = game.shop.salesHistory || [];
    const len = history.length;
    if (len > prevSalesLenRef.current) {
      playSale();
      const sale = history[len - 1];
      if (sale) fireToast(`Sold ${sale.fishName} for 🪙${sale.coins}!`, 'sale', '💰');
      prevSalesLenRef.current = len;
    }
  }, [game.shop.salesHistory?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sound + Toast: achievements ─────────────────────────────
  useEffect(() => {
    const achs = game.player.achievements || [];
    const len  = achs.length;
    if (len > prevAchCountRef.current) {
      playDiscover();
      const newOnes = achs.slice(prevAchCountRef.current);
      for (const ach of newOnes) {
        const def = ACHIEVEMENT_DEFS?.find?.(a => a.id === ach.id);
        fireToast(def ? `Achievement: ${def.label}` : 'Achievement unlocked!', 'achieve', '🏆');
      }
      prevAchCountRef.current = len;
    }
  }, [game.player.achievements?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Toast: disease alerts ───────────────────────────────────
  // Fire at most once per fish per disease to avoid toast spam
  const diseasedRef    = useRef(new Set());
  // diseaseStateKey: only sick fish contribute. Early-exit when none are sick
  // (the common case) to skip the filter/map/sort allocation entirely.
  // Sorted for stability so React's dep comparison is order-independent.
  const diseaseStateKey = (() => {
    const fish = game.fish || [];
    if (!fish.some(f => f.disease)) return '';
    return fish
      .filter(f => f.disease)
      .map(f => `${f.id}:${f.disease}`)
      .sort()
      .join(',');
  })();

  useEffect(() => {
    for (const f of game.fish) {
      if (f.disease && !diseasedRef.current.has(f.id)) {
        diseasedRef.current.add(f.id);
        fireToast(`${f.species?.name || 'Fish'} is sick! 🦠`, 'alert', '🚨');
      } else if (!f.disease) {
        diseasedRef.current.delete(f.id);
      }
    }
  }, [diseaseStateKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sound toggle ────────────────────────────────────────────
  const toggleSound = useCallback(() => {
    setSoundOn(prev => { setSoundEnabled(!prev); return !prev; });
  }, []);

  return {
    game,
    setGame,
    showOffline,
    setShowOffline,
    soundOn,
    toggleSound,
    coinDeltas,
  };
}
