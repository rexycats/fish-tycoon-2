import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore.js';

/**
 * Tracks coin changes and produces floating delta animations.
 * Subscribes only to player.coins — no full-state re-render.
 */
export function useCoinDeltas() {
  const coins = useGameStore(s => s.player.coins);
  const [deltas, setDeltas] = useState([]);
  const counter = useRef(0);
  const prevCoins = useRef(coins);

  useEffect(() => {
    const diff = coins - prevCoins.current;
    prevCoins.current = coins;
    if (diff === 0) return;
    const abs = Math.abs(diff);
    const tier = abs >= 500 ? 'mega' : abs >= 100 ? 'big' : abs >= 20 ? 'mid' : 'small';
    const id = ++counter.current;
    setDeltas(prev => [...prev.slice(-6), { id, diff, tier }]);
    const t = setTimeout(() => setDeltas(prev => prev.filter(d => d.id !== id)), 1800);
    return () => clearTimeout(t);
  }, [coins]);

  return deltas;
}
