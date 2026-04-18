// ============================================================
// TITLE BUTTONS — Glossy pill buttons with inline SVG icons
// ============================================================
import React from 'react';

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="title-btn-icon">
      <circle cx="14" cy="14" r="12" fill="rgba(255,255,255,0.3)" />
      <path d="M11 9l8 5-8 5V9z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function CampaignIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="title-btn-icon">
      {/* Scroll */}
      <path d="M8,6 Q8,3 11,3 L22,3 Q22,6 19,6 L11,6 L11,26 Q11,29 8,29 L8,6Z"
        fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.7)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M11,6 L22,6 L22,23 Q22,26 19,26 L11,26"
        fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" strokeLinejoin="round" />
      {/* Map lines */}
      <line x1="14" y1="10" x2="19" y2="10" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="14" x2="20" y2="14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="18" x2="18" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Magnifier */}
      <circle cx="22" cy="22" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
      <line x1="25" y1="25" x2="28" y2="28" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SandboxIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className="title-btn-icon">
      {/* Rubber duck body */}
      <ellipse cx="15" cy="18" rx="9" ry="8" fill="rgba(255,230,150,0.7)" />
      {/* Duck head */}
      <circle cx="15" cy="10" r="6" fill="rgba(255,230,150,0.8)" />
      {/* Beak */}
      <ellipse cx="20" cy="11" rx="3.5" ry="2" fill="rgba(255,180,100,0.7)" />
      {/* Eye */}
      <circle cx="16.5" cy="9" r="1.2" fill="rgba(80,60,40,0.6)" />
      <circle cx="17" cy="8.5" r="0.5" fill="rgba(255,255,255,0.7)" />
      {/* Water ripples */}
      <path d="M5,22 Q10,20 15,22 Q20,24 25,22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      <path d="M7,25 Q12,23 17,25 Q22,27 27,25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  );
}

export default function TitleButtons({ hasSave, onStart }) {
  return (
    <div className="title-buttons">
      {hasSave && (
        <button className="title-menu-btn title-menu-btn--continue" onClick={() => onStart('continue')}>
          <PlayIcon />
          <span>Continue</span>
        </button>
      )}
      <button className="title-menu-btn title-menu-btn--campaign" onClick={() => onStart('campaign')}>
        <CampaignIcon />
        <span>Campaign</span>
      </button>
      <button className="title-menu-btn title-menu-btn--sandbox" onClick={() => onStart('sandbox')}>
        <SandboxIcon />
        <span>Sandbox</span>
      </button>
    </div>
  );
}
