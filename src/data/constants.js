// ============================================================
// FISH TYCOON 2 — SHARED CONSTANTS
// Gameplay values used across multiple files
// ============================================================

// ── Economy ─────────────────────────────────────────────
export const UPGRADE_COST_SCALE = 1.6;
export const BREEDING_BASE_MS = 300_000; // 5 minutes
export const BREEDING_SPEED_FACTOR = 0.8; // per upgrade level

// ── Personality emoji map ───────────────────────────────
export const PERSONALITY_EMOJI = {
  playful:    '',
  shy:        '🫣',
  curious:    '',
  lazy:       '',
  aggressive: '',
  social:     '',
  gluttonous: '🍽️',
  hardy:      '',
};

// ── Fish sizing ─────────────────────────────────────────
export const EGG_HATCH_ANIM_MS = 90_000; // 90 seconds before hatch animation

export const SPRITE_SIZE = {
  egg:    36,
  normal: 54,
  giant:  76,
};

// ── Helper: upgrade cost at given level ──────────────────
export function upgradeCost(baseCost, level) {
  return Math.round(baseCost * Math.pow(UPGRADE_COST_SCALE, level));
}
