// ============================================================
// WEATHER SYSTEM — affects mood, visuals, and gameplay
// ============================================================

const WEATHER_TYPES = [
  { id: 'sunny',      label: '☀️ Sunny',       weight: 30, happinessBonus: 5,  waterDecayMult: 1.0, customerSpeedMult: 0.9, visualOverlay: 'rgba(255,220,140,0.06)' },
  { id: 'cloudy',     label: '☁️ Cloudy',      weight: 25, happinessBonus: 0,  waterDecayMult: 1.0, customerSpeedMult: 1.0, visualOverlay: 'rgba(150,160,180,0.08)' },
  { id: 'rainy',      label: '🌧️ Rainy',      weight: 20, happinessBonus: -3, waterDecayMult: 0.8, customerSpeedMult: 1.2, visualOverlay: 'rgba(100,120,160,0.12)' },
  { id: 'stormy',     label: '⛈️ Stormy',     weight: 8,  happinessBonus: -8, waterDecayMult: 1.3, customerSpeedMult: 1.5, visualOverlay: 'rgba(40,50,80,0.18)', fishScare: true },
  { id: 'foggy',      label: '🌫️ Foggy',      weight: 10, happinessBonus: -2, waterDecayMult: 1.0, customerSpeedMult: 1.3, visualOverlay: 'rgba(180,190,200,0.15)' },
  { id: 'heatwave',   label: '🔥 Heat Wave',   weight: 5,  happinessBonus: -5, waterDecayMult: 1.5, customerSpeedMult: 0.8, visualOverlay: 'rgba(255,100,40,0.08)', tempDrift: 0.01 },
  { id: 'aurora',     label: '🌌 Aurora',       weight: 2,  happinessBonus: 10, waterDecayMult: 0.7, customerSpeedMult: 0.7, visualOverlay: 'rgba(100,200,160,0.08)', rare: true },
];

export function getCurrentWeather(seed) {
  const rng = mulberry32(seed);
  const total = WEATHER_TYPES.reduce((s, w) => s + w.weight, 0);
  let roll = rng() * total;
  for (const w of WEATHER_TYPES) {
    roll -= w.weight;
    if (roll <= 0) return w;
  }
  return WEATHER_TYPES[0];
}

export function getWeatherSeed() {
  const d = new Date();
  // Weather changes every 3 hours
  return d.getFullYear() * 100000 + (d.getMonth()+1) * 1000 + d.getDate() * 10 + Math.floor(d.getHours() / 3);
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export { WEATHER_TYPES };
