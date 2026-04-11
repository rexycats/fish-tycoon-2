// ============================================================
// FISH TYCOON 2 — CAMPAIGN MILESTONES
// Structured progression goals from beginner to legendary
// ============================================================

export const MILESTONES = [
  // ── Chapter 1: Getting Started ────────────────────────
  {
    id: 'ch1_first_sale',
    chapter: 1, chapterName: '🐚 Getting Started',
    title: 'First Sale',
    desc: 'Sell your first fish to a customer',
    check: (s) => (s.player?.stats?.fishSold || 0) >= 1,
    reward: { coins: 50 },
    icon: '🪙',
  },
  {
    id: 'ch1_five_fish',
    chapter: 1, chapterName: '🐚 Getting Started',
    title: 'Small Collection',
    desc: 'Have 5 fish in your tanks at once',
    check: (s) => (s.fish || []).filter(f => f.stage !== 'egg').length >= 5,
    reward: { coins: 100 },
    icon: '🐟',
  },
  {
    id: 'ch1_first_breed',
    chapter: 1, chapterName: '🐚 Getting Started',
    title: 'First Offspring',
    desc: 'Breed your first egg',
    check: (s) => (s.player?.stats?.eggsCollected || 0) >= 1,
    reward: { coins: 75 },
    icon: '🥚',
  },
  {
    id: 'ch1_earn_500',
    chapter: 1, chapterName: '🐚 Getting Started',
    title: 'Pocket Change',
    desc: 'Earn 500 coins total',
    check: (s) => (s.player?.totalCoinsEarned || 0) >= 500,
    reward: { coins: 100 },
    icon: '💰',
  },

  // ── Chapter 2: Growing Business ───────────────────────
  {
    id: 'ch2_uncommon',
    chapter: 2, chapterName: '🌊 Growing Business',
    title: 'Uncommon Find',
    desc: 'Own an uncommon or rarer fish',
    check: (s) => (s.fish || []).some(f => ['uncommon','rare','epic','legendary'].includes(f.species?.rarity)),
    reward: { coins: 150 },
    icon: '✨',
  },
  {
    id: 'ch2_tank2',
    chapter: 2, chapterName: '🌊 Growing Business',
    title: 'Expansion',
    desc: 'Unlock your second tank',
    check: (s) => (s.tanks || []).length >= 2,
    reward: { coins: 200 },
    icon: '🏗️',
  },
  {
    id: 'ch2_10_sales',
    chapter: 2, chapterName: '🌊 Growing Business',
    title: 'Salesperson',
    desc: 'Sell 10 fish total',
    check: (s) => (s.player?.stats?.fishSold || 0) >= 10,
    reward: { coins: 200 },
    icon: '📈',
  },
  {
    id: 'ch2_cure',
    chapter: 2, chapterName: '🌊 Growing Business',
    title: 'Fish Doctor',
    desc: 'Successfully cure a sick fish',
    check: (s) => (s.player?.stats?.medicineUsed || 0) >= 1,
    reward: { coins: 100 },
    icon: '💊',
  },
  {
    id: 'ch2_earn_2500',
    chapter: 2, chapterName: '🌊 Growing Business',
    title: 'Comfortable Income',
    desc: 'Earn 2,500 coins total',
    check: (s) => (s.player?.totalCoinsEarned || 0) >= 2500,
    reward: { coins: 250 },
    icon: '💰',
  },

  // ── Chapter 3: Aspiring Aquarist ──────────────────────
  {
    id: 'ch3_rare',
    chapter: 3, chapterName: '🐠 Aspiring Aquarist',
    title: 'Rare Specimen',
    desc: 'Own a rare fish',
    check: (s) => (s.fish || []).some(f => ['rare','epic','legendary'].includes(f.species?.rarity)),
    reward: { coins: 300 },
    icon: '🌟',
  },
  {
    id: 'ch3_3_species',
    chapter: 3, chapterName: '🐠 Aspiring Aquarist',
    title: 'Diverse Collection',
    desc: 'Own 3 different real species at once',
    check: (s) => {
      const species = new Set((s.fish || []).filter(f => f.species?.visualType === 'species').map(f => f.species?.key));
      return species.size >= 3;
    },
    reward: { coins: 250 },
    icon: '🐙',
  },
  {
    id: 'ch3_research',
    chapter: 3, chapterName: '🐠 Aspiring Aquarist',
    title: 'Scholar',
    desc: 'Complete any research tier',
    check: (s) => Object.values(s.player?.research || {}).some(v => v >= 1),
    reward: { coins: 200 },
    icon: '🔬',
  },
  {
    id: 'ch3_10_discoveries',
    chapter: 3, chapterName: '🐠 Aspiring Aquarist',
    title: 'Explorer',
    desc: 'Discover 10 unique phenotypes',
    check: (s) => (s.discoveries || []).length >= 10,
    reward: { coins: 300 },
    icon: '📖',
  },
  {
    id: 'ch3_3star_review',
    chapter: 3, chapterName: '🐠 Aspiring Aquarist',
    title: 'Decent Reviews',
    desc: 'Get a 3-star or better aquarium review',
    check: (s) => (s.reviews || []).some(r => r.stars >= 3),
    reward: { coins: 200 },
    icon: '⭐',
  },

  // ── Chapter 4: Expert Breeder ─────────────────────────
  {
    id: 'ch4_epic',
    chapter: 4, chapterName: '⭐ Expert Breeder',
    title: 'Epic Discovery',
    desc: 'Own an epic fish',
    check: (s) => (s.fish || []).some(f => ['epic','legendary'].includes(f.species?.rarity)),
    reward: { coins: 500 },
    icon: '💎',
  },
  {
    id: 'ch4_tank3',
    chapter: 4, chapterName: '⭐ Expert Breeder',
    title: 'Aquarium Empire',
    desc: 'Unlock 3 tanks',
    check: (s) => (s.tanks || []).length >= 3,
    reward: { coins: 400 },
    icon: '🏛️',
  },
  {
    id: 'ch4_50_sales',
    chapter: 4, chapterName: '⭐ Expert Breeder',
    title: 'Merchant',
    desc: 'Sell 50 fish total',
    check: (s) => (s.player?.stats?.fishSold || 0) >= 50,
    reward: { coins: 500 },
    icon: '🤝',
  },
  {
    id: 'ch4_earn_10000',
    chapter: 4, chapterName: '⭐ Expert Breeder',
    title: 'Wealthy',
    desc: 'Earn 10,000 coins total',
    check: (s) => (s.player?.totalCoinsEarned || 0) >= 10000,
    reward: { coins: 500 },
    icon: '🏆',
  },
  {
    id: 'ch4_50_discoveries',
    chapter: 4, chapterName: '⭐ Expert Breeder',
    title: 'Naturalist',
    desc: 'Discover 50 unique phenotypes',
    check: (s) => (s.discoveries || []).length >= 50,
    reward: { coins: 500 },
    icon: '🔍',
  },

  // ── Chapter 5: Master Aquarist ────────────────────────
  {
    id: 'ch5_legendary',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'Legendary Fish',
    desc: 'Own a legendary fish',
    check: (s) => (s.fish || []).some(f => f.species?.rarity === 'legendary'),
    reward: { coins: 1000 },
    icon: '🏆',
  },
  {
    id: 'ch5_5star',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'World-Class Aquarium',
    desc: 'Get a 5-star review',
    check: (s) => (s.reviews || []).some(r => r.stars >= 5),
    reward: { coins: 1000 },
    icon: '⭐',
  },
  {
    id: 'ch5_all_magic',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'Magic Collector',
    desc: 'Find all 7 magic fish',
    check: (s) => (s.player?.magicFishFound || []).length >= 7,
    reward: { coins: 2000 },
    icon: '🔮',
  },
  {
    id: 'ch5_prestige',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'Prestige',
    desc: 'Prestige for the first time',
    check: (s) => (s.player?.prestigeLevel || 0) >= 1,
    reward: { coins: 1000 },
    icon: '🌟',
  },
  {
    id: 'ch5_100_discoveries',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'Master Cataloguer',
    desc: 'Discover 100 unique phenotypes',
    check: (s) => (s.discoveries || []).length >= 100,
    reward: { coins: 1500 },
    icon: '📚',
  },
  {
    id: 'ch5_earn_50000',
    chapter: 5, chapterName: '👑 Master Aquarist',
    title: 'Tycoon',
    desc: 'Earn 50,000 coins total',
    check: (s) => (s.player?.totalCoinsEarned || 0) >= 50000,
    reward: { coins: 2000 },
    icon: '💎',
  },
];

export function getCompletedMilestones(state) {
  const completed = state.player?.completedMilestones || [];
  return MILESTONES.filter(m => completed.includes(m.id));
}

export function getNextMilestones(state) {
  const completed = state.player?.completedMilestones || [];
  return MILESTONES.filter(m => !completed.includes(m.id));
}

export function checkMilestones(state) {
  const completed = state.player?.completedMilestones || [];
  const newlyCompleted = [];
  for (const m of MILESTONES) {
    if (completed.includes(m.id)) continue;
    try {
      if (m.check(state)) newlyCompleted.push(m);
    } catch {}
  }
  return newlyCompleted;
}

export function getChapterProgress(state) {
  const completed = new Set(state.player?.completedMilestones || []);
  const chapters = {};
  for (const m of MILESTONES) {
    if (!chapters[m.chapter]) chapters[m.chapter] = { name: m.chapterName, total: 0, done: 0 };
    chapters[m.chapter].total++;
    if (completed.has(m.id)) chapters[m.chapter].done++;
  }
  return chapters;
}
