// ============================================================
// NAV RAIL — Left-side navigation for sim-game layout
// ============================================================
import React from 'react';

// Minimal inline SVG icons (18x18 viewBox, stroke-based)
const Icons = {
  aquarium: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="14" height="11" rx="2" />
      <path d="M5 10c1-2 3 0 4-2s2 1 4-1" />
      <line x1="2" y1="16" x2="16" y2="16" />
    </svg>
  ),
  market: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V15h12V7" />
      <path d="M1 7l8-5 8 5" />
      <rect x="7" y="11" width="4" height="4" />
    </svg>
  ),
  breeding: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2c-2 3-5 4-5 7a5 5 0 0 0 10 0c0-3-3-4-5-7z" />
      <path d="M7 11c0 1.1.9 2 2 2s2-.9 2-2" />
    </svg>
  ),
  records: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2h8l3 3v11H4z" />
      <line x1="7" y1="7" x2="12" y2="7" />
      <line x1="7" y1="10" x2="12" y2="10" />
      <line x1="7" y1="13" x2="10" y2="13" />
    </svg>
  ),
  office: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="12" height="14" rx="1" />
      <line x1="3" y1="6" x2="15" y2="6" />
      <line x1="7" y1="2" x2="7" y2="6" />
      <line x1="6" y1="9" x2="12" y2="9" />
      <line x1="6" y1="12" x2="10" y2="12" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.1 3.1l1.4 1.4M13.5 13.5l1.4 1.4M3.1 14.9l1.4-1.4M13.5 4.5l1.4-1.4" />
    </svg>
  ),
};

const NAV_SECTIONS = [
  { id: 'aquarium',  label: 'Aquarium',  key: '1' },
  { id: 'market',    label: 'Market',    key: '2' },
  { id: 'breeding',  label: 'Breeding',  key: '3' },
  { id: 'records',   label: 'Records',   key: '4' },
  { id: 'office',    label: 'Office',    key: '5' },
];

export default function NavRail({ active, onNavigate, badges = {}, disabledSections = {} }) {
  return (
    <nav className="nav-rail">
      <div className="nav-rail-brand">FT2</div>
      <div className="nav-rail-items">
        {NAV_SECTIONS.map(({ id, label, key }) => (
          <button
            key={id}
            className={`nav-rail-btn${active === id ? ' nav-rail-btn--active' : ''}${disabledSections[id] ? ' nav-rail-btn--disabled' : ''}`}
            onClick={() => onNavigate(id)}
          >
            <span className="nav-rail-key">{key}</span>
            <span className="nav-rail-icon">{Icons[id]}</span>
            <span className="nav-rail-label">{label}</span>
            {badges[id] && (
              <span className="nav-rail-badge">{badges[id]}</span>
            )}
          </button>
        ))}
      </div>
      <div className="nav-rail-footer">
        <button
          className="nav-rail-btn nav-rail-btn--settings"
          onClick={() => onNavigate('settings')}
          
        >
          <span className="nav-rail-icon">{Icons.settings}</span>
          <span className="nav-rail-label">Settings</span>
        </button>
        <div className="nav-rail-version">v0.10.0</div>
      </div>
    </nav>
  );
}

// Re-export from pure data module for backwards compatibility
export { NAV_TO_TABS, navSectionForTab } from '../data/navigation.js';
