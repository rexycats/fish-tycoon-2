// ============================================================
// FISH TYCOON 2 — STEAM INTEGRATION SERVICE
// Maps in-game achievements to Steam achievements.
// Gracefully no-ops when not running in Electron/Steam.
// ============================================================

// Map game achievement IDs → Steam achievement API names
// These must match the achievements configured in Steamworks partner dashboard
const STEAM_ACHIEVEMENT_MAP = {
  first_fish:     'ACH_FIRST_FISH',
  species_5:      'ACH_EXPLORER',
  species_10:     'ACH_GENETICIST',
  species_25:     'ACH_TAXONOMIST',
  first_sale:     'ACH_MERCHANT',
  coins_500:      'ACH_ENTREPRENEUR',
  coins_5000:     'ACH_TYCOON',
  coins_50000:    'ACH_MOGUL',
  rare_discovery: 'ACH_RARE_FIND',
  epic_discovery: 'ACH_LEGENDARY_CATCH',
  full_tank:      'ACH_FULL_HOUSE',
  bred_5:         'ACH_MATCHMAKER',
  bred_20:        'ACH_SPEED_BREEDER',
  tank_happy:     'ACH_HAPPY_HABITAT',
  upgrade_max:    'ACH_MAXIMALIST',
  fish_rescued:   'ACH_HEALER',
  water_pristine: 'ACH_PURE_WATERS',
  survived_night: 'ACH_NIGHT_WATCH',
  two_tanks:      'ACH_EXPANDING_EMPIRE',
  three_tanks:    'ACH_AQUARIUM_BARON',
  magic_1:        'ACH_FIRST_WONDER',
  magic_3:        'ACH_HALFWAY_THERE',
  magic_7:        'ACH_LEGEND_OF_THE_DEEP',
  // New system achievements
  staff_hired:    'ACH_FIRST_HIRE',
  research_done:  'ACH_SCHOLAR',
  prestige_1:     'ACH_PRESTIGE',
  campaign_1:     'ACH_CAMPAIGN_START',
  campaign_5:     'ACH_CAMPAIGN_MASTER',
  true_ending:    'ACH_TRUE_ENDING',
  giftshop:       'ACH_ENTREPRENEUR_2',
  rep_100:        'ACH_FAMOUS',
};

let _steamAvailable = null;

async function isSteamAvailable() {
  if (_steamAvailable !== null) return _steamAvailable;
  if (typeof window === 'undefined' || !window.electronAPI?.steam) {
    _steamAvailable = false;
    return false;
  }
  try {
    const result = await window.electronAPI.steam.isRunning();
    _steamAvailable = result.running;
    return _steamAvailable;
  } catch {
    _steamAvailable = false;
    return false;
  }
}

/**
 * Sync a game achievement to Steam.
 * Call this whenever a new achievement is earned.
 * Safe to call from web — silently no-ops.
 */
export async function syncSteamAchievement(gameAchievementId) {
  if (!(await isSteamAvailable())) return;
  const steamId = STEAM_ACHIEVEMENT_MAP[gameAchievementId];
  if (!steamId) return;
  try {
    await window.electronAPI.steam.setAchievement(steamId);
    // Steam achievement unlocked
  } catch (err) {
    console.warn(`[Steam] Failed to set achievement ${steamId}:`, err);
  }
}

/**
 * Sync all existing achievements to Steam (call on game load).
 * Handles the case where player earned achievements while offline.
 */
export async function syncAllSteamAchievements(achievements) {
  if (!(await isSteamAvailable())) return;
  for (const ach of achievements) {
    await syncSteamAchievement(ach.id);
  }
}

;
