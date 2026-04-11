// ============================================================
// FISH TYCOON 2 — ELECTRON PRELOAD
// Exposes a secure API bridge to the renderer process.
// contextIsolation: true — renderer cannot access Node.js.
// ============================================================

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Platform detection ────────────────────────────────
  isElectron: true,
  platform: process.platform,

  // ── Filesystem saves ──────────────────────────────────
  saveGame:     (data) => ipcRenderer.invoke('save:write', data),
  loadGame:     ()     => ipcRenderer.invoke('save:read'),
  exportSave:   (data) => ipcRenderer.invoke('save:export', data),
  importSave:   ()     => ipcRenderer.invoke('save:import'),
  getSavePath:  ()     => ipcRenderer.invoke('save:getPath'),

  // ── Steam integration ─────────────────────────────────
  steam: {
    isRunning:      ()    => ipcRenderer.invoke('steam:isRunning'),
    setAchievement: (id)  => ipcRenderer.invoke('steam:setAchievement', id),
  },
});
