// ============================================================
// GAME ICONS — Inline SVG icon set for all game actions
// Size: 14×14 default, inherits currentColor
// ============================================================
import React from 'react';

const I = ({ children, size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }}>
    {children}
  </svg>
);

// ── Actions ──────────────────────────────────────────────
export const IconFeed = ({ size }) => <I size={size}>
  <path d="M4,12 L4,7 C4,4 8,2 8,2 C8,2 12,4 12,7 L12,12" />
  <line x1="4" y1="12" x2="12" y2="12" />
  <circle cx="8" cy="7" r="1.5" fill="currentColor" stroke="none" />
</I>;

export const IconMedicine = ({ size }) => <I size={size}>
  <rect x="5" y="3" width="6" height="10" rx="1" />
  <line x1="8" y1="5" x2="8" y2="11" />
  <line x1="5.5" y1="8" x2="10.5" y2="8" />
</I>;

export const IconDiagnose = ({ size }) => <I size={size}>
  <circle cx="7" cy="7" r="4" />
  <line x1="10" y1="10" x2="14" y2="14" />
</I>;

export const IconVitamins = ({ size }) => <I size={size}>
  <ellipse cx="8" cy="8" rx="3" ry="5" />
  <line x1="5" y1="8" x2="11" y2="8" />
</I>;

export const IconSell = ({ size }) => <I size={size}>
  <circle cx="8" cy="8" r="6" />
  <path d="M6.5,5.5 C6.5,5.5 7,4.5 8,4.5 C9.5,4.5 9.5,6 8,6.5 C6.5,7 6.5,8.5 8,8.5 C9,8.5 9.5,7.5 9.5,7.5" />
  <line x1="8" y1="3.5" x2="8" y2="4.5" />
  <line x1="8" y1="8.5" x2="8" y2="9.5" />
</I>;

export const IconListed = ({ size }) => <I size={size}>
  <rect x="3" y="2" width="10" height="12" rx="1" />
  <line x1="5.5" y1="5" x2="10.5" y2="5" />
  <line x1="5.5" y1="7.5" x2="10.5" y2="7.5" />
  <line x1="5.5" y1="10" x2="8.5" y2="10" />
</I>;

export const IconMove = ({ size }) => <I size={size}>
  <path d="M4,8 L12,8" />
  <path d="M9,5 L12,8 L9,11" />
  <rect x="2" y="4" width="3" height="8" rx="0.5" />
</I>;

// ── HUD / Status ─────────────────────────────────────────
export const IconWater = ({ size }) => <I size={size}>
  <path d="M8,2 C8,2 3,7 3,10 C3,13 5.5,14 8,14 C10.5,14 13,13 13,10 C13,7 8,2 8,2Z" />
</I>;

export const IconTemp = ({ size }) => <I size={size}>
  <rect x="6" y="2" width="4" height="9" rx="2" />
  <circle cx="8" cy="12" r="2.5" />
  <line x1="8" y1="6" x2="8" y2="10" strokeWidth="2" />
</I>;

export const IconFish = ({ size }) => <I size={size}>
  <path d="M2,8 C2,8 5,4 9,4 C12,4 14,6 14,8 C14,10 12,12 9,12 C5,12 2,8 2,8Z" />
  <circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none" />
  <path d="M1,8 L3,6 L3,10Z" fill="currentColor" stroke="none" />
</I>;

export const IconFood = ({ size }) => <I size={size}>
  <circle cx="8" cy="8" r="2" fill="currentColor" stroke="none" />
  <circle cx="5" cy="5" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
  <circle cx="11" cy="6" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
  <circle cx="6" cy="11" r="1.5" fill="currentColor" stroke="none" opacity="0.6" />
  <circle cx="11" cy="11" r="1" fill="currentColor" stroke="none" opacity="0.4" />
</I>;

export const IconCoin = ({ size }) => <I size={size}>
  <circle cx="8" cy="8" r="6" />
  <circle cx="8" cy="8" r="4" />
</I>;

export const IconHeart = ({ size }) => <I size={size}>
  <path d="M8,13 L3,8.5 C1,6.5 1,4 3.5,3 C5,2.3 7,3 8,5 C9,3 11,2.3 12.5,3 C15,4 15,6.5 13,8.5Z"
    fill="currentColor" stroke="none" />
</I>;

export const IconDNA = ({ size }) => <I size={size}>
  <path d="M5,2 C5,5 11,7 11,10 C11,13 5,14 5,14" />
  <path d="M11,2 C11,5 5,7 5,10 C5,13 11,14 11,14" />
  <line x1="5.5" y1="5" x2="10.5" y2="5" />
  <line x1="5.5" y1="8" x2="10.5" y2="8" />
  <line x1="5.5" y1="11" x2="10.5" y2="11" />
</I>;

export const IconLoan = ({ size }) => <I size={size}>
  <rect x="2" y="5" width="12" height="8" rx="1" />
  <rect x="4" y="3" width="8" height="4" rx="1" />
  <line x1="5" y1="9.5" x2="11" y2="9.5" />
</I>;
