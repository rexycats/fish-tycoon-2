// ============================================================
// SPECIAL ORDERS BOARD — 3 rotating customer requests
// ============================================================

const ORDER_TEMPLATES = [
  { trait: 'rarity',   values: ['rare','epic'],        emoji: '', prefix: 'Collector wants a' },
  { trait: 'pattern',  values: ['Spotted','Tiger','Marble','Lined'], emoji: '', prefix: 'Designer seeks a' },
  { trait: 'bodyShape',values: ['Orb','Delta','Slender','Eel'],     emoji: '', prefix: 'Breeder needs a' },
  { trait: 'finType',  values: ['Veil','Flowing'],     emoji: '', prefix: 'Enthusiast desires a' },
  { trait: 'glow',     values: ['Luminous'],           emoji: '', prefix: 'Night aquarium wants a' },
  { trait: 'size',     values: ['Giant','Leviathan'],  emoji: '', prefix: 'Aquarium park needs a' },
];

const CUSTOMER_NAMES = [
  'Dr. Marina Wells', 'Captain Reef', 'Professor Gill', 'Lady Coralline',
  'Baroness Tidepool', 'Mr. Saltwater', 'Chef Bubbles', 'Inspector Fin',
];

export function generateOrders(seed) {
  const rng = mulberry32(seed);
  const orders = [];
  const usedTemplates = new Set();

  for (let i = 0; i < 3; i++) {
    let tIdx;
    do { tIdx = Math.floor(rng() * ORDER_TEMPLATES.length); } while (usedTemplates.has(tIdx) && usedTemplates.size < ORDER_TEMPLATES.length);
    usedTemplates.add(tIdx);
    const tmpl = ORDER_TEMPLATES[tIdx];
    const val = tmpl.values[Math.floor(rng() * tmpl.values.length)];
    const reward = tmpl.trait === 'rarity' ? (val === 'epic' ? 800 : 400) : (200 + Math.floor(rng() * 300));
    const customer = CUSTOMER_NAMES[Math.floor(rng() * CUSTOMER_NAMES.length)];
    orders.push({
      id: `order_${seed}_${i}`,
      emoji: tmpl.emoji,
      customer,
      desc: `${tmpl.prefix} ${val.toLowerCase()} fish`,
      trait: tmpl.trait,
      value: val,
      reward: Math.round(reward),
      xpReward: 25,
      expiresAt: null, // refreshes daily
      fulfilled: false,
    });
  }
  return orders;
}

export function checkOrderFulfillment(fish, order) {
  if (!fish || !order || order.fulfilled) return false;
  const phenotype = fish.phenotype || {};
  const species = fish.species || {};
  switch (order.trait) {
    case 'rarity': return species.rarity === order.value;
    case 'pattern': return phenotype.pattern === order.value;
    case 'bodyShape': return phenotype.bodyShape === order.value;
    case 'finType': return phenotype.finType === order.value;
    case 'glow': return phenotype.glow === order.value;
    case 'size': return phenotype.size === order.value;
    default: return false;
  }
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function getDailyOrderSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}
