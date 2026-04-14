// ============================================================
// FISH TYCOON 2 — CREDITS SCREEN
// ============================================================
import React from 'react';

export default function Credits({ onClose }) {
  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div className="credits-modal" onClick={e => e.stopPropagation()}>
        <div className="credits-title">Fish Tycoon 2</div>
        <div className="credits-version">Version 0.1.0 — Early Access</div>

        <div className="credits-section">
          <div className="credits-section-title">Game Design & Development</div>
          <div className="credits-entry">Built with React, Zustand, Vite & Web Audio API</div>
        </div>

        <div className="credits-section">
          <div className="credits-section-title">Technology</div>
          <div className="credits-entry">16 hand-crafted SVG fish species</div>
          <div className="credits-entry">Procedural genetics engine with Mendelian inheritance</div>
          <div className="credits-entry">Procedural ambient music synthesis</div>
          <div className="credits-entry">SVG water distortion shaders</div>
        </div>

        <div className="credits-section">
          <div className="credits-section-title">Game Features</div>
          <div className="credits-entry">16 species · 61 color variants · 21 upgrades</div>
          <div className="credits-entry">7 diseases · 10 random events · 9 customer types</div>
          <div className="credits-entry">Interactive haggling · Prestige system · Level progression</div>
          <div className="credits-entry">Multi-bay breeding · 6 tank slots · Seasonal events</div>
          <div className="credits-entry">Fish personalities · Day/night cycle · 140+ animations</div>
        </div>

        <div className="credits-section">
          <div className="credits-section-title">Special Thanks</div>
          <div className="credits-entry">To all the fish that gave their lives during playtesting</div>
        </div>

        <button className="btn btn-sm btn-primary credits-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
