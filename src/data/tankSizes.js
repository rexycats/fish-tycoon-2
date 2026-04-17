// ============================================================
// FISH TYCOON 2 — TANK SIZES
// ============================================================

export const TANK_SIZES = [
  { id: 'small',  label: 'Small',  capacity: 8,  cost: 0,     desc: 'Starter tank', shape: 'standard' },
  { id: 'medium', label: 'Medium', capacity: 12, cost: 300,   desc: 'Room for more variety', shape: 'standard' },
  { id: 'large',  label: 'Large',  capacity: 16, cost: 800,   desc: 'Spacious habitat', shape: 'wide' },
  { id: 'huge',   label: 'Huge',   capacity: 24, cost: 2000,  desc: 'Exhibition-class display', shape: 'panoramic' },
  { id: 'mega',   label: 'Mega',   capacity: 32, cost: 5000,  desc: 'The ultimate aquarium centerpiece', minLevel: 5, shape: 'cylinder' },
];

export function getTankSize(tank) {
  return TANK_SIZES.find(s => s.id === (tank.size || 'medium')) || TANK_SIZES[1];
}

export function getNextTankSize(tank) {
  const current = TANK_SIZES.findIndex(s => s.id === (tank.size || 'medium'));
  if (current < 0 || current >= TANK_SIZES.length - 1) return null;
  return TANK_SIZES[current + 1];
}
