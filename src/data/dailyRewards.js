// ============================================================
// DAILY LOGIN REWARDS
// ============================================================

export const DAILY_REWARDS = [
  { day: 1,  reward: 'coins',  amount: 50,   label: '50 Coins',        emoji: '🪙' },
  { day: 2,  reward: 'coins',  amount: 75,   label: '75 Coins',        emoji: '🪙' },
  { day: 3,  reward: 'food',   amount: 20,   label: '20 Fish Food',    emoji: '🍤' },
  { day: 4,  reward: 'coins',  amount: 100,  label: '100 Coins',       emoji: '🪙' },
  { day: 5,  reward: 'coins',  amount: 150,  label: '150 Coins',       emoji: '💰' },
  { day: 6,  reward: 'supply', amount: 3,    label: 'Medical Kit',     emoji: '💊', supplyKey: 'antibiotic' },
  { day: 7,  reward: 'egg',    amount: 1,    label: 'Mystery Egg!',    emoji: '🥚', rarity: 'uncommon' },
  { day: 14, reward: 'coins',  amount: 500,  label: '500 Coins!',      emoji: '💎' },
  { day: 21, reward: 'egg',    amount: 1,    label: 'Rare Egg!',       emoji: '🌟', rarity: 'rare' },
  { day: 30, reward: 'egg',    amount: 1,    label: 'Epic Egg!!',      emoji: '🏆', rarity: 'epic' },
];

export function getDailyReward(streak) {
  // Find the highest matching reward for this streak day
  const sorted = [...DAILY_REWARDS].sort((a, b) => b.day - a.day);
  for (const r of sorted) {
    if (streak >= r.day && streak % r.day === 0) return r;
  }
  // Default for days not in the list: scaling coins
  return { day: streak, reward: 'coins', amount: 25 + streak * 5, label: `${25 + streak * 5} Coins`, emoji: '🪙' };
}

export function canClaimDaily(state) {
  const last = state.player?.lastDailyClaimDate;
  if (!last) return true;
  const today = new Date().toDateString();
  return last !== today;
}

export function getStreak(state) {
  const last = state.player?.lastDailyClaimDate;
  if (!last) return 0;
  const lastDate = new Date(last);
  const today = new Date();
  const diff = Math.floor((today - lastDate) / 86400000);
  if (diff === 1) return (state.player?.dailyStreak || 0); // continuing streak
  if (diff === 0) return (state.player?.dailyStreak || 0); // already claimed today
  return 0; // streak broken
}
