import { getLevelFromXp } from './levels.js';
// ============================================================
// FISH TYCOON 2 — CAMPAIGN MILESTONES
// Structured goals that give players direction
// ============================================================

export const MILESTONES = [
  // ── Chapter 1: Getting Started ────────────────────────────
  {
    id: 'ch1_first_sale',
    chapter: 1, chapterTitle: 'Getting Started',
    title: 'First Sale',
    desc: 'Sell your first fish to a customer',
    emoji: '',
    check: (s) => (s.player.stats?.fishSold || 0) >= 1,
    reward: { coins: 50 },
  },
  {
    id: 'ch1_five_fish',
    chapter: 1, chapterTitle: 'Getting Started',
    title: 'Growing Collection',
    desc: 'Have 5 fish in your tank at once',
    emoji: '',
    check: (s) => s.fish.filter(f => f.stage !== 'egg').length >= 5,
    reward: { coins: 100 },
  },
  {
    id: 'ch1_first_breed',
    chapter: 1, chapterTitle: 'Getting Started',
    title: 'First Offspring',
    desc: 'Breed your first egg',
    emoji: '',
    check: (s) => (s.player.stats?.eggsCollected || 0) >= 1,
    reward: { coins: 75 },
  },
  {
    id: 'ch1_500_coins',
    chapter: 1, chapterTitle: 'Getting Started',
    title: 'Piggy Bank',
    desc: 'Earn 500 total coins',
    emoji: '',
    check: (s) => (s.player.totalCoinsEarned || 0) >= 500,
    reward: { coins: 100 },
  },

  // ── Chapter 2: Building the Business ──────────────────────
  {
    id: 'ch2_second_tank',
    chapter: 2, chapterTitle: 'Building the Business',
    title: 'Expansion',
    desc: 'Unlock your second tank',
    emoji: '',
    check: (s) => s.tanks.length >= 2,
    reward: { coins: 200 },
  },
  {
    id: 'ch2_rare_fish',
    chapter: 2, chapterTitle: 'Building the Business',
    title: 'Rare Find',
    desc: 'Own a rare-tier fish',
    emoji: '',
    check: (s) => s.fish.some(f => ['rare','epic','legendary'].includes(f.species?.rarity)),
    reward: { coins: 150 },
  },
  {
    id: 'ch2_10_sales',
    chapter: 2, chapterTitle: 'Building the Business',
    title: 'Merchant',
    desc: 'Sell 10 fish total',
    emoji: '',
    check: (s) => (s.player.stats?.fishSold || 0) >= 10,
    reward: { coins: 200 },
  },
  {
    id: 'ch2_3_species',
    chapter: 2, chapterTitle: 'Building the Business',
    title: 'Diversity',
    desc: 'Own 3 different real species',
    emoji: '',
    check: (s) => {
      const species = new Set(s.fish.filter(f => f.species?.visualType === 'species').map(f => f.species.key));
      return species.size >= 3;
    },
    reward: { coins: 250 },
  },
  {
    id: 'ch2_2000_coins',
    chapter: 2, chapterTitle: 'Building the Business',
    title: 'Comfortable',
    desc: 'Earn 2,000 total coins',
    emoji: '',
    check: (s) => (s.player.totalCoinsEarned || 0) >= 2000,
    reward: { coins: 200 },
  },

  // ── Chapter 3: The Expert ─────────────────────────────────
  {
    id: 'ch3_cure_disease',
    chapter: 3, chapterTitle: 'The Expert',
    title: 'Dr. Fishsticks',
    desc: 'Cure a diseased fish',
    emoji: '',
    check: (s) => (s.player.stats?.medicineUsed || 0) >= 1,
    reward: { coins: 150 },
  },
  {
    id: 'ch3_10_discoveries',
    chapter: 3, chapterTitle: 'The Expert',
    title: 'Explorer',
    desc: 'Discover 10 unique phenotypes',
    emoji: '',
    check: (s) => (s.discoveries || []).length >= 10,
    reward: { coins: 300 },
  },
  {
    id: 'ch3_3_star_review',
    chapter: 3, chapterTitle: 'The Expert',
    title: 'Three Stars',
    desc: 'Get a 3-star or better aquarium review',
    emoji: '',
    check: (s) => (s.reviews || []).some(r => r.stars >= 3),
    reward: { coins: 200 },
  },
  {
    id: 'ch3_level_10',
    chapter: 3, chapterTitle: 'The Expert',
    title: 'Aquarist',
    desc: 'Reach Level 10',
    emoji: '',
    check: (s) => {
      
      return getLevelFromXp(s.player.xp || 0).level >= 10;
    },
    reward: { coins: 500 },
  },
  {
    id: 'ch3_research',
    chapter: 3, chapterTitle: 'The Expert',
    title: 'Scholar',
    desc: 'Complete any research tier',
    emoji: '',
    check: (s) => {
      const r = s.player.research || {};
      return Object.values(r).some(v => v >= 1);
    },
    reward: { coins: 250 },
  },

  // ── Chapter 4: The Tycoon ─────────────────────────────────
  {
    id: 'ch4_epic_fish',
    chapter: 4, chapterTitle: 'The Tycoon',
    title: 'Epic Collector',
    desc: 'Own an epic-tier fish',
    emoji: '',
    check: (s) => s.fish.some(f => ['epic','legendary'].includes(f.species?.rarity)),
    reward: { coins: 500 },
  },
  {
    id: 'ch4_3_tanks',
    chapter: 4, chapterTitle: 'The Tycoon',
    title: 'Aquarium Complex',
    desc: 'Unlock 3 tanks',
    emoji: '',
    check: (s) => s.tanks.length >= 3,
    reward: { coins: 400 },
  },
  {
    id: 'ch4_50_sales',
    chapter: 4, chapterTitle: 'The Tycoon',
    title: 'Trader',
    desc: 'Sell 50 fish total',
    emoji: '',
    check: (s) => (s.player.stats?.fishSold || 0) >= 50,
    reward: { coins: 500 },
  },
  {
    id: 'ch4_10000_coins',
    chapter: 4, chapterTitle: 'The Tycoon',
    title: 'Wealthy',
    desc: 'Earn 10,000 total coins',
    emoji: '',
    check: (s) => (s.player.totalCoinsEarned || 0) >= 10000,
    reward: { coins: 500 },
  },
  {
    id: 'ch4_5_star_review',
    chapter: 4, chapterTitle: 'The Tycoon',
    title: 'Five Stars!',
    desc: 'Get a perfect 5-star aquarium review',
    emoji: '',
    check: (s) => (s.reviews || []).some(r => r.stars >= 5),
    reward: { coins: 1000 },
  },

  // ── Chapter 5: The Legend ─────────────────────────────────
  {
    id: 'ch5_50_discoveries',
    chapter: 5, chapterTitle: 'The Legend',
    title: 'Catalogue',
    desc: 'Discover 50 unique phenotypes',
    emoji: '',
    check: (s) => (s.discoveries || []).length >= 50,
    reward: { coins: 1000 },
  },
  {
    id: 'ch5_all_magic',
    chapter: 5, chapterTitle: 'The Legend',
    title: 'Magic Mastery',
    desc: 'Find all 7 Magic Fish',
    emoji: '',
    check: (s) => (s.player.magicFishFound || []).length >= 7,
    reward: { coins: 5000 },
  },
  {
    id: 'ch5_prestige',
    chapter: 5, chapterTitle: 'The Legend',
    title: 'Prestige',
    desc: 'Prestige for the first time',
    emoji: '',
    check: (s) => (s.player.prestigeLevel || 0) >= 1,
    reward: { coins: 2000 },
  },
  {
    id: 'ch5_50000_coins',
    chapter: 5, chapterTitle: 'The Legend',
    title: 'Mogul',
    desc: 'Earn 50,000 total coins',
    emoji: '',
    check: (s) => (s.player.totalCoinsEarned || 0) >= 50000,
    reward: { coins: 2000 },
  },
  {
    id: 'ch5_legendary',
    chapter: 5, chapterTitle: 'The Legend',
    title: 'Legendary Aquarist',
    desc: 'Reach Level 30',
    emoji: '',
    check: (s) => {
      
      return getLevelFromXp(s.player.xp || 0).level >= 30;
    },
    reward: { coins: 10000 },
  },
];

export function getMilestoneProgress(state) {
  const completed = state.player?.completedMilestones || [];
  const chapters = {};
  for (const m of MILESTONES) {
    if (!chapters[m.chapter]) chapters[m.chapter] = { title: m.chapterTitle, milestones: [], done: 0, total: 0 };
    const ch = chapters[m.chapter];
    const isDone = completed.includes(m.id);
    const isReady = !isDone && m.check(state);
    ch.milestones.push({ ...m, isDone, isReady });
    ch.total++;
    if (isDone) ch.done++;
  }
  return chapters;
}
export function getTotalMilestones() { return MILESTONES.length; }
export function getCompletedCount(state) { return (state.player?.completedMilestones || []).length; }
