// ============================================================
// FISH TYCOON 2 — TANK SIZES
// ============================================================

export const TANK_SIZES = [
  { id: 'small',  label: 'Small',  capacity: 8,  cost: 0,     desc: 'Starter tank' },
  { id: 'medium', label: 'Medium', capacity: 12, cost: 300,   desc: 'Room for more variety' },
  { id: 'large',  label: 'Large',  capacity: 16, cost: 800,   desc: 'Spacious habitat' },
  { id: 'huge',   label: 'Huge',   capacity: 24, cost: 2000,  desc: 'Exhibition-class display' },
  { id: 'mega',   label: 'Mega',   capacity: 32, cost: 5000,  desc: 'The ultimate aquarium centerpiece', minLevel: 5 },
];

export function getTankSize(tank) {
  return TANK_SIZES.find(s => s.id === (tank.size || 'medium')) || TANK_SIZES[1];
}

export function getNextTankSize(tank) {
  const current = TANK_SIZES.findIndex(s => s.id === (tank.size || 'medium'));
  if (current < 0 || current >= TANK_SIZES.length - 1) return null;
  return TANK_SIZES[current + 1];
}
