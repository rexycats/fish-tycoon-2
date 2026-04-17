// ============================================================
// FISH TYCOON 2 — AQUARIUM ROOMS
// Named zones that group tanks and provide themed bonuses
// ============================================================

export const ROOMS = [
  {
    id: 'lobby',
    label: 'Main Lobby',
    desc: 'Your entrance hall. Visitors see this first.',
    maxTanks: 2,
    cost: 0,
    bonus: { visitorMult: 1.0 },
    unlocked: true,
  },
  {
    id: 'tropical_wing',
    label: 'Tropical Wing',
    desc: 'A warm, humid gallery for reef species. +15% happiness for tropical fish.',
    maxTanks: 2,
    cost: 1500,
    bonus: { happinessMult: 1.15, tempType: 'tropical' },
    unlocked: false,
  },
  {
    id: 'deep_sea_hall',
    label: 'Deep Sea Hall',
    desc: 'A darkened chamber for deep-water creatures. -20% disease chance.',
    maxTanks: 2,
    cost: 3000,
    bonus: { diseaseResist: 0.8 },
    unlocked: false,
  },
  {
    id: 'breeding_lab',
    label: 'Breeding Lab',
    desc: 'A dedicated facility for genetics research. -15% breeding time.',
    maxTanks: 1,
    cost: 2000,
    bonus: { breedSpeedMult: 0.85 },
    unlocked: false,
  },
  {
    id: 'vip_gallery',
    label: 'VIP Gallery',
    desc: 'An exclusive viewing room for your rarest specimens. +25% sale price for fish in this room.',
    maxTanks: 2,
    cost: 5000,
    bonus: { saleMult: 1.25 },
    unlocked: false,
    minRep: 50,
  },
  {
    id: 'conservation_center',
    label: 'Conservation Center',
    desc: 'A research-focused area. +20% reputation gain from fish in this room.',
    maxTanks: 2,
    cost: 8000,
    bonus: { repMult: 1.2 },
    unlocked: false,
    minPrestige: 1,
  },
];

export function getRoomForTank(state, tankId) {
  const assignments = state.roomAssignments || {};
  const roomId = assignments[tankId] || 'lobby';
  return ROOMS.find(r => r.id === roomId) || ROOMS[0];
}

export function getUnlockedRooms(state) {
  const unlocked = state.unlockedRooms || ['lobby'];
  return ROOMS.filter(r => unlocked.includes(r.id));
}

export function getRoomBonus(state, tankId) {
  const room = getRoomForTank(state, tankId);
  return room.bonus || {};
}

export function getTanksInRoom(state, roomId) {
  const assignments = state.roomAssignments || {};
  return (state.tanks || []).filter(t => (assignments[t.id] || 'lobby') === roomId);
}
