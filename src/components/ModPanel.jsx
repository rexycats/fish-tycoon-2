// ============================================================
// MOD PANEL — Load and manage custom content
// ============================================================
import React, { useState, useRef } from 'react';
import { loadMod, clearMods, getCustomSpecies, getCustomDecorations, getCustomEvents, getModTemplate } from '../data/modding.js';

export default function ModPanel() {
  const [results, setResults] = useState(null);
  const [counts, setCounts] = useState({ species: 0, deco: 0, events: 0 });
  const fileRef = useRef(null);

  const refreshCounts = () => {
    setCounts({
      species: getCustomSpecies().length,
      deco: getCustomDecorations().length,
      events: getCustomEvents().length,
    });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = loadMod(text);
      setResults(res);
      refreshCounts();
    } catch (err) {
      setResults({ species: 0, decorations: 0, events: 0, errors: [err.message] });
    }
    e.target.value = '';
  };

  const handleClear = () => {
    clearMods();
    setResults(null);
    refreshCounts();
  };

  const handleTemplate = () => {
    const blob = new Blob([getModTemplate()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fish_tycoon_mod_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mod-panel">
      <div className="mod-title">MODDING</div>
      <div className="mod-desc">Load custom species, decorations, and events from JSON files.</div>

      <div className="mod-stats">
        <span>Custom species: {counts.species}</span>
        <span>Custom decorations: {counts.deco}</span>
        <span>Custom events: {counts.events}</span>
      </div>

      <div className="mod-actions">
        <input ref={fileRef} type="file" accept=".json" onChange={handleFile} style={{ display: 'none' }} />
        <button className="btn mod-btn" onClick={() => fileRef.current?.click()}>Load Mod (.json)</button>
        <button className="btn mod-btn" onClick={handleTemplate}>Download Template</button>
        {counts.species + counts.deco + counts.events > 0 && (
          <button className="btn mod-btn mod-btn--danger" onClick={handleClear}>Clear All Mods</button>
        )}
      </div>

      {results && (
        <div className="mod-results">
          <div className="mod-result-line">Loaded: {results.species} species, {results.decorations} decorations, {results.events} events</div>
          {results.errors.length > 0 && (
            <div className="mod-errors">
              {results.errors.map((e, i) => <div key={i} className="mod-error">{e}</div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
