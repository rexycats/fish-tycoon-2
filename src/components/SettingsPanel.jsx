// ============================================================
// FISH TYCOON 2 — SETTINGS PANEL
// ============================================================
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { setMasterVolume, setMusicVolume, setSFXVolume, getMasterVolume, getMusicVolume, getSFXVolume } from '../services/soundService.js';

export default function SettingsPanel({ onClose }) {
  const [master, setMaster] = useState(getMasterVolume);
  const [music, setMusic]   = useState(getMusicVolume);
  const [sfx, setSfx]       = useState(getSFXVolume);
  const distortion = useGameStore(s => s.settings?.distortion ?? true);
  const particles  = useGameStore(s => s.settings?.particles ?? true);
  const reducedMotion = useGameStore(s => s.settings?.reducedMotion ?? false);
  const colorblind = useGameStore(s => s.settings?.colorblind ?? false);

  const updateSetting = (key, val) => {
    useGameStore.setState(state => {
      if (!state.settings) state.settings = {};
      state.settings[key] = val;
    });
  };

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <div className="settings-title">⚙️ Settings</div>

        <div className="settings-section">
          <div className="settings-section-title">Audio</div>
          <SettingsSlider label="Master Volume" value={master} onChange={v => { setMaster(v); setMasterVolume(v); }} />
          <SettingsSlider label="Music" value={music} onChange={v => { setMusic(v); setMusicVolume(v); }} />
          <SettingsSlider label="Sound Effects" value={sfx} onChange={v => { setSfx(v); setSFXVolume(v); }} />
        </div>

        <div className="settings-section">
          <div className="settings-section-title">Graphics</div>
          <SettingsToggle label="Water Distortion" value={distortion} onChange={v => updateSetting('distortion', v)} hint="SVG ripple effect (disable for performance)" />
          <SettingsToggle label="Particles & Plankton" value={particles} onChange={v => updateSetting('particles', v)} hint="Floating particles and plankton dots" />
          <SettingsToggle label="Reduced Motion" value={reducedMotion} onChange={v => updateSetting('reducedMotion', v)} hint="Disable most animations" />
        </div>

        <div className="settings-section">
          <div className="settings-section-title">♿ Accessibility</div>
          <SettingsToggle label="Colorblind Mode" value={colorblind} onChange={v => updateSetting('colorblind', v)} hint="Use patterns + labels instead of color-only indicators" />
        </div>

        <div className="settings-section">
          <div className="settings-section-title">⌨️ Keyboard Shortcuts</div>
          <div className="settings-keys">
            <kbd>1</kbd>–<kbd>3</kbd> Switch tanks &nbsp;
            <kbd>F</kbd> Feed selected fish &nbsp;
            <kbd>A</kbd> Feed all &nbsp;
            <kbd>S</kbd> Toggle sell &nbsp;
            <kbd>M</kbd> Use medicine &nbsp;
            <kbd>Space</kbd> Pause &nbsp;
            <kbd>1-5</kbd> Navigate &nbsp;
            <kbd>Tab</kbd> Next section &nbsp;
            <kbd>Esc</kbd> Close
          </div>
        </div>

        {typeof window !== 'undefined' && window.electronAPI && (
          <div className="settings-section">
            <button className="btn btn-sm" onClick={() => document.documentElement.requestFullscreen?.()}>
              Toggle Fullscreen
            </button>
          </div>
        )}

        <div className="settings-section">
          <div className="settings-section-title">Save Management</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button className="btn btn-sm" onClick={() => {
              const s = useGameStore.getState();
              const blob = new Blob([JSON.stringify(s)], { type: 'application/json' });
              const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
              a.download = `fish-tycoon-save-${new Date().toISOString().slice(0,10)}.json`; a.click();
            }}>Export Save</button>
            <label className="btn btn-sm" style={{ cursor: 'pointer' }}>
              Import Save
              <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => {
                const file = e.target.files[0]; if (!file) return;
                const reader = new FileReader();
                reader.onload = ev => { try { useGameStore.getState().importSave(ev.target.result); } catch {} };
                reader.readAsText(file);
              }} />
            </label>
            <button className="btn btn-sm btn-danger" onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) useGameStore.getState().resetGame();
            }}>Reset Game</button>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn btn-sm btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function SettingsSlider({ label, value, onChange }) {
  return (
    <div className="settings-row">
      <span className="settings-label">{label}</span>
      <input type="range" min="0" max="1" step="0.05" value={value}
        onChange={e => onChange(parseFloat(e.target.value))} className="settings-slider" />
      <span className="settings-val">{Math.round(value * 100)}%</span>
    </div>
  );
}

function SettingsToggle({ label, value, onChange, hint }) {
  return (
    <div className="settings-row">
      <div>
        <span className="settings-label">{label}</span>
        {hint && <span className="settings-hint">{hint}</span>}
      </div>
      <button className={`settings-toggle ${value ? 'on' : 'off'}`} onClick={() => onChange(!value)}>
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
