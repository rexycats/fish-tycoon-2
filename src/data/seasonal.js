// ============================================================
// FISH TYCOON 2 — SEASONAL EVENTS
// Time-gated content based on real-world dates
// ============================================================

const EVENTS = [
  {
    id: 'winter_wonderland',
    name: '❄️ Winter Wonderland',
    startMonth: 12, startDay: 15, endMonth: 1, endDay: 5,
    bonuses: { passiveIncome: 1.5, breedingSpeed: 0.8 },
    specialFish: { name: 'Frost Tetra', rarity: 'rare', targetRarity: 'rare' },
    desc: 'Snowflake variants are more common! +50% passive income.',
    challengeBonus: 1.5,
  },
  {
    id: 'spring_bloom',
    name: '🌸 Spring Bloom',
    startMonth: 3, startDay: 20, endMonth: 4, endDay: 20,
    bonuses: { breedingSpeed: 0.6, mutationRate: 1.5 },
    specialFish: { name: 'Cherry Blossom Koi', rarity: 'rare', targetRarity: 'rare' },
    desc: 'Breeding is 40% faster! Mutation rates increased.',
    challengeBonus: 1.0,
  },
  {
    id: 'summer_splash',
    name: '☀️ Summer Splash',
    startMonth: 6, startDay: 21, endMonth: 8, endDay: 31,
    bonuses: { passiveIncome: 1.3, customerSpeed: 1.4 },
    specialFish: { name: 'Sunbeam Angelfish', rarity: 'epic', targetRarity: 'epic' },
    desc: 'Customers arrive 40% faster! More visitors = more tips.',
    challengeBonus: 1.2,
  },
  {
    id: 'halloween',
    name: '🎃 Spooky Season',
    startMonth: 10, startDay: 20, endMonth: 11, endDay: 2,
    bonuses: { rarityLuck: 1.5, passiveIncome: 1.2 },
    specialFish: { name: 'Ghost Jellyfish', rarity: 'epic', targetRarity: 'epic' },
    desc: 'Rare fish appear more often! Ghostly variants emerge.',
    challengeBonus: 1.3,
  },
  {
    id: 'lunar_new_year',
    name: '🧧 Lunar New Year',
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 10,
    bonuses: { passiveIncome: 2.0, coinMult: 1.5 },
    specialFish: { name: 'Golden Dragon Koi', rarity: 'epic', targetRarity: 'epic' },
    desc: 'Double passive income! Golden fish are worth 50% more.',
    challengeBonus: 2.0,
  },
];

export function getActiveEvent() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  for (const event of EVENTS) {
    const { startMonth, startDay, endMonth, endDay } = event;
    let active = false;
    if (startMonth <= endMonth) {
      active = (month > startMonth || (month === startMonth && day >= startDay))
            && (month < endMonth   || (month === endMonth   && day <= endDay));
    } else {
      // Wraps around year (e.g. Dec → Jan)
      active = (month > startMonth || (month === startMonth && day >= startDay))
            || (month < endMonth   || (month === endMonth   && day <= endDay));
    }
    if (active) return event;
  }
  return null;
}

export { EVENTS as SEASONAL_EVENTS };
