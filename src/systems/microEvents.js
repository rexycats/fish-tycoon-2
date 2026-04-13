// ============================================================
// TANK MICRO-EVENTS — Pearl finds, nuzzles, customer countdowns
// ============================================================

const MICRO_EVENT_TYPES = [
  { id: 'pearl',     emoji: '🫧', label: 'Pearl found!',      coins: 8,  xp: 2, weight: 4, duration: 4000 },
  { id: 'shell',     emoji: '🐚', label: 'Shell discovered!', coins: 5,  xp: 1, weight: 5, duration: 3500 },
  { id: 'treasure',  emoji: '💎', label: 'Treasure!',         coins: 25, xp: 5, weight: 1, duration: 3000 },
  { id: 'nuzzle',    emoji: '💕', label: 'Fish nuzzle!',      coins: 0,  xp: 3, weight: 3, duration: 5000, needsTwoFish: true },
  { id: 'trick',     emoji: '🎭', label: 'Fish trick!',       coins: 3,  xp: 2, weight: 2, duration: 4000, personality: 'playful' },
  { id: 'crab',      emoji: '🦀', label: 'Hermit crab!',      coins: 2,  xp: 1, weight: 3, duration: 5000 },
  { id: 'starfish',  emoji: '⭐', label: 'Starfish visit!',   coins: 4,  xp: 1, weight: 2, duration: 4500 },
];

/**
 * Roll for a micro-event. Called every tick.
 * Returns null or an event object to display.
 */
export function rollMicroEvent(fish, tankId, lastEventAt) {
  const now = Date.now();
  const minInterval = 8000; // 8 seconds minimum between events
  if (now - (lastEventAt || 0) < minInterval) return null;

  const tankFish = fish.filter(f => f.tankId === tankId && f.stage !== 'egg');
  if (tankFish.length === 0) return null;

  // Base chance: 12% per tick (with 5s tick = roughly every 40s)
  if (Math.random() > 0.12) return null;

  // Weight-based selection
  const eligible = MICRO_EVENT_TYPES.filter(e => {
    if (e.needsTwoFish && tankFish.length < 2) return false;
    if (e.personality && !tankFish.some(f => f.personality === e.personality)) return false;
    return true;
  });
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = eligible[0];
  for (const e of eligible) {
    roll -= e.weight;
    if (roll <= 0) { picked = e; break; }
  }

  // Pick position (near a random fish)
  const sourceFish = tankFish[Math.floor(Math.random() * tankFish.length)];
  const x = Math.max(10, Math.min(90, (sourceFish.x || 50) + (Math.random() - 0.5) * 20));
  const y = Math.max(15, Math.min(85, (sourceFish.y || 50) + (Math.random() - 0.5) * 15));

  // For nuzzle, pick a second fish
  let secondFishId = null;
  if (picked.needsTwoFish) {
    const others = tankFish.filter(f => f.id !== sourceFish.id);
    if (others.length > 0) secondFishId = others[Math.floor(Math.random() * others.length)].id;
  }

  return {
    id: crypto.randomUUID(),
    type: picked.id,
    emoji: picked.emoji,
    label: picked.label,
    coins: picked.coins,
    xp: picked.xp,
    x, y,
    fishId: sourceFish.id,
    secondFishId,
    duration: picked.duration,
    createdAt: now,
    tapped: false,
  };
}
