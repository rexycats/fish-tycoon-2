// ============================================================
// FISH TYCOON 2 — CREDITS SCREEN
// ============================================================
import React from 'react';

export default function CreditsScreen({ onClose }) {
  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div className="credits-modal" onClick={e => e.stopPropagation()}>
        <div className="credits-logo">🐠</div>
        <h1 className="credits-title">Fish Tycoon 2</h1>
        <div className="credits-version">v0.1.0 — Early Access</div>

        <div className="credits-section">
          <div className="credits-heading">Game Design & Development</div>
          <div className="credits-name">Built with React + Vite + Zustand</div>
        </div>

        <div className="credits-section">
          <div className="credits-heading">Audio</div>
          <div className="credits-name">Procedural synthesis via Web Audio API</div>
        </div>

        <div className="credits-section">
          <div className="credits-heading">Graphics</div>
          <div className="credits-name">Hand-crafted SVG sprites • 16 species</div>
          <div className="credits-name">149 CSS animations • Real-time water simulation</div>
        </div>

        <div className="credits-section">
          <div className="credits-heading">Tech Stack</div>
          <div className="credits-detail">React 18 • Zustand • Immer • Vite 5</div>
          <div className="credits-detail">Electron (Desktop) • Steamworks.js</div>
        </div>

        <div className="credits-section">
          <div className="credits-heading">Special Thanks</div>
          <div className="credits-name">All the fish that gave their lives during testing 🐟💀</div>
        </div>

        <div className="credits-footer">
          <button className="btn btn-sm btn-primary" onClick={onClose}>Back to Game</button>
        </div>
      </div>
    </div>
  );
}
