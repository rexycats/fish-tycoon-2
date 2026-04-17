// ============================================================
// FISH TYCOON 2 — STAFF SYSTEM
// ============================================================

// First names pool
const FIRST_NAMES = [
  'Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn',
  'Charlie', 'Jamie', 'Kai', 'Dakota', 'Sage', 'River', 'Skyler', 'Rowan',
  'Finley', 'Harper', 'Emery', 'Blair', 'Reese', 'Hayden', 'Eden', 'Shay',
];

export const STAFF_ROLES = {
  feeder: {
    id: 'feeder',
    label: 'Caretaker',
    desc: 'Automatically feeds hungry fish in assigned tank.',
    baseWage: 8,          // coins per game-day
    wagePerLevel: 4,      // +4 per skill level
    maxLevel: 5,
    trainCost: [0, 50, 120, 250, 500],  // cost to reach level 1,2,3,4,5
    effect: {
      // Feeds fish when hunger > threshold. Higher skill = lower threshold + faster
      hungerThreshold: [60, 50, 40, 30, 20],  // by level (0-indexed)
      feedInterval: [45, 38, 30, 22, 15],      // ticks between feeds
    },
  },
  cleaner: {
    id: 'cleaner',
    label: 'Technician',
    desc: 'Maintains water quality in assigned tank.',
    baseWage: 10,
    wagePerLevel: 5,
    maxLevel: 5,
    trainCost: [0, 60, 140, 280, 550],
    effect: {
      // Restores WQ when below threshold. Higher skill = better threshold + more restored
      wqThreshold: [60, 65, 70, 75, 80],
      wqRestorePerTick: [0.003, 0.005, 0.008, 0.012, 0.018],
    },
  },
  vet: {
    id: 'vet',
    label: 'Veterinarian',
    desc: 'Diagnoses and treats sick fish in assigned tank.',
    baseWage: 15,
    wagePerLevel: 8,
    maxLevel: 5,
    trainCost: [0, 80, 200, 400, 800],
    effect: {
      // Chance per tick to auto-cure a diagnosed sick fish
      cureChancePerTick: [0.001, 0.002, 0.004, 0.007, 0.012],
      // Auto-diagnose after N ticks of incubation
      diagnoseTicks: [120, 90, 60, 40, 20],
    },
  },
};

export function createStaffMember(role) {
  const name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const roleDef = STAFF_ROLES[role];
  if (!roleDef) return null;
  return {
    id: crypto.randomUUID(),
    name,
    role,
    level: 0,
    xp: 0,
    assignedTankId: null,
    hiredAt: Date.now(),
    feedTick: 0,         // internal counter for feeder interval
  };
}

export function getStaffWage(staff) {
  const roleDef = STAFF_ROLES[staff.role];
  if (!roleDef) return 0;
  return roleDef.baseWage + roleDef.wagePerLevel * staff.level;
}

export function getTotalDailyWages(staffList) {
  return staffList.reduce((sum, s) => sum + getStaffWage(s), 0);
}

export function getTrainCost(staff) {
  const roleDef = STAFF_ROLES[staff.role];
  if (!roleDef || staff.level >= roleDef.maxLevel) return Infinity;
  return roleDef.trainCost[staff.level] || 999;
}

export function getHireCost(role) {
  // Base hire cost varies by role
  const costs = { feeder: 50, cleaner: 75, vet: 150 };
  return costs[role] || 50;
}

// Max staff based on player level
export function getMaxStaff(playerLevel) {
  if (playerLevel >= 8) return 6;
  if (playerLevel >= 5) return 4;
  if (playerLevel >= 3) return 3;
  return 2;
}
