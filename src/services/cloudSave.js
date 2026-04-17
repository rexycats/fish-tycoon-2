// ============================================================
// FISH TYCOON 2 — CLOUD SAVE SERVICE
// Syncs save data via Steam Cloud when running in Electron
// Falls back to localStorage when Steam is unavailable
// ============================================================

const CLOUD_SAVE_KEY = 'fish_tycoon_2_save';

// Check if Steam Cloud is available (Electron + Steamworks)
function isSteamAvailable() {
  return typeof window !== 'undefined' && window.electronAPI?.steamCloud;
}

// Save to Steam Cloud
export async function cloudSave(stateJson) {
  if (!isSteamAvailable()) return false;
  try {
    await window.electronAPI.steamCloud.write(CLOUD_SAVE_KEY, stateJson);
    console.log('[CloudSave] Saved to Steam Cloud');
    return true;
  } catch (err) {
    console.warn('[CloudSave] Steam Cloud write failed:', err);
    return false;
  }
}

// Load from Steam Cloud
export async function cloudLoad() {
  if (!isSteamAvailable()) return null;
  try {
    const data = await window.electronAPI.steamCloud.read(CLOUD_SAVE_KEY);
    if (data) {
      console.log('[CloudSave] Loaded from Steam Cloud');
      return data;
    }
    return null;
  } catch (err) {
    console.warn('[CloudSave] Steam Cloud read failed:', err);
    return null;
  }
}

// Delete cloud save
export async function cloudDelete() {
  if (!isSteamAvailable()) return false;
  try {
    await window.electronAPI.steamCloud.delete(CLOUD_SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}

// Sync strategy: compare timestamps, use newest
export async function syncSave(localSave) {
  const cloudData = await cloudLoad();
  if (!cloudData) {
    // No cloud save — push local to cloud
    if (localSave) await cloudSave(localSave);
    return localSave;
  }

  try {
    const local = localSave ? JSON.parse(localSave) : null;
    const cloud = JSON.parse(cloudData);

    const localTime = local?.lastSavedAt || 0;
    const cloudTime = cloud?.lastSavedAt || 0;

    if (cloudTime > localTime) {
      console.log('[CloudSave] Cloud save is newer — using cloud');
      // Also update local storage
      try { localStorage.setItem('fish_tycoon_2', cloudData); } catch {}
      return cloudData;
    } else {
      console.log('[CloudSave] Local save is newer — pushing to cloud');
      await cloudSave(localSave);
      return localSave;
    }
  } catch (err) {
    console.warn('[CloudSave] Sync error, using local:', err);
    return localSave;
  }
}

export function isCloudAvailable() {
  return isSteamAvailable();
}
