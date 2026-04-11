// ============================================================
// FISH TYCOON 2 — GAME CONSTANTS
// All tunable gameplay numbers in one place for easy balancing
// ============================================================

// ── Economy ─────────────────────────────────────────────────
export const STARTING_COINS = 325;
export const TICK_INTERVAL_MS = 1000;
export const AUTO_SAVE_INTERVAL_MS = 30_000;

// ── Tank defaults ───────────────────────────────────────────
export const DEFAULT_TANK_CAPACITY = 12;
export const DEFAULT_WATER_QUALITY = 100;
export const DEFAULT_TEMPERATURE = 74;

// ── Fish lifespan by rarity (seconds) ───────────────────────
export const LIFESPAN_BY_RARITY = {
  common:    60 * 60 * 8,     // 8 hours
  uncommon:  60 * 60 * 16,    // 16 hours
  rare:      60 * 60 * 24,    // 24 hours
  epic:      60 * 60 * 48,    // 48 hours
  legendary: 60 * 60 * 72,    // 72 hours
};

// ── Customer timing ─────────────────────────────────────────
export const CUSTOMER_BASE_INTERVAL_MS = 18_000;
export const HAGGLE_CHANCE = 0.35; // % of eligible customers that trigger interactive haggle

// ── Offline progress ────────────────────────────────────────
export const BASE_OFFLINE_SECONDS = 60 * 60 * 48;   // 48h base cap
export const TANK_SITTER_BONUS_SECONDS = 60 * 60 * 24; // +24h per level

// ── Disease ─────────────────────────────────────────────────
export const DISEASE_BASE_CHANCE = 0.000015;
export const DISEASE_WATER_MULT = 2.0;
export const DISEASE_CROWD_MULT = 1.5;
export const ELDER_HEALTH_DECAY = 0.005;
export const WRONG_MEDICINE_PENALTY_SECONDS = 60;
export const VITAMIN_DURATION_MS = 600_000; // 10 minutes

// ── Passive income ──────────────────────────────────────────
export const PASSIVE_INCOME_BASE = 4;
export const PASSIVE_INCOME_INTERVAL = 60; // ticks (1 minute)
export const PASSIVE_DECOR_BONUS = 0.25;

// ── Random events ───────────────────────────────────────────
export const EVENT_INTERVAL_MIN = 180; // minimum seconds between events
export const EVENT_INTERVAL_MAX = 420; // maximum seconds between events

// ── Breeding ────────────────────────────────────────────────
export const DEFAULT_BREEDING_DURATION_MS = 300_000; // 5 minutes
export const BREEDING_SPEED_REDUCTION = 0.8; // per upgrade level

// ── XP rewards ──────────────────────────────────────────────
export { XP_REWARDS } from './levels.js';
