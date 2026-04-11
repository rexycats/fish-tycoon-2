// ============================================================
// FISH TYCOON 2 — ELECTRON MAIN PROCESS
// Wraps the Vite-built web app in a native desktop window.
// Handles: window management, filesystem saves, Steam SDK.
// ============================================================

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

// ── Save file location ────────────────────────────────────
const SAVE_DIR = path.join(app.getPath('userData'), 'saves');
const SAVE_FILE = path.join(SAVE_DIR, 'fishtycoon2.json');
const SETTINGS_FILE = path.join(SAVE_DIR, 'settings.json');

function ensureSaveDir() {
  if (!fs.existsSync(SAVE_DIR)) fs.mkdirSync(SAVE_DIR, { recursive: true });
}

// ── Window state persistence ──────────────────────────────
function loadWindowState() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
    }
  } catch {}
  return { width: 1280, height: 800, x: undefined, y: undefined, maximized: false };
}

function saveWindowState(win) {
  try {
    const bounds = win.getBounds();
    const state = {
      width: bounds.width,
      height: bounds.height,
      x: bounds.x,
      y: bounds.y,
      maximized: win.isMaximized(),
    };
    ensureSaveDir();
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(state));
  } catch {}
}

// ── Steam SDK (optional — gracefully degrades) ────────────
let steamworks = null;
try {
  // steamworks.js is only available when Steam client is running
  // Install: npm install steamworks.js
  // Requires a valid steam_appid.txt in the app root
  steamworks = require('steamworks.js');
  steamworks.init(480); // Replace 480 with your actual Steam App ID
  console.log('[Steam] SDK initialized');
} catch {
  console.log('[Steam] SDK not available — running in standalone mode');
}

// ── Create main window ────────────────────────────────────
let mainWindow;

function createWindow() {
  const state = loadWindowState();

  mainWindow = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 960,
    minHeight: 600,
    title: 'Fish Tycoon 2',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    backgroundColor: '#0a1828',
    show: false, // Show after ready-to-show to avoid flash
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (state.maximized) mainWindow.maximize();

  // Load the built app
  if (process.env.VITE_DEV_SERVER_URL) {
    // Dev mode: load from Vite dev server
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    // Production: load from built files
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', () => saveWindowState(mainWindow));

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Remove menu bar in production
  if (!process.env.VITE_DEV_SERVER_URL) {
    mainWindow.setMenuBarVisibility(false);
  }
}

// ── IPC: Filesystem saves ─────────────────────────────────
ipcMain.handle('save:write', async (_, data) => {
  try {
    ensureSaveDir();
    // Write to temp file first, then rename (atomic write)
    const tmp = SAVE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, SAVE_FILE);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('save:read', async () => {
  try {
    if (!fs.existsSync(SAVE_FILE)) return { ok: true, data: null };
    const raw = fs.readFileSync(SAVE_FILE, 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('save:export', async (_, data) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `fishtycoon2-save-${new Date().toISOString().slice(0, 10)}.json`,
    filters: [{ name: 'JSON Save', extensions: ['json'] }],
  });
  if (result.canceled) return { ok: false };
  try {
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2));
    return { ok: true, path: result.filePath };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('save:import', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    filters: [{ name: 'JSON Save', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (result.canceled) return { ok: false };
  try {
    const raw = fs.readFileSync(result.filePaths[0], 'utf8');
    return { ok: true, data: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('save:getPath', async () => SAVE_DIR);

// ── IPC: Steam achievements ───────────────────────────────
ipcMain.handle('steam:setAchievement', async (_, achievementId) => {
  if (!steamworks) return { ok: false };
  try {
    steamworks.achievement.activate(achievementId);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

ipcMain.handle('steam:isRunning', async () => ({ running: !!steamworks }));

// ── App lifecycle ─────────────────────────────────────────
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Steam SDK needs periodic callbacks
if (steamworks) {
  setInterval(() => {
    try { steamworks.runCallbacks(); } catch {}
  }, 100);
}
