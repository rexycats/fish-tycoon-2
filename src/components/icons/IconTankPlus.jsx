import React from 'react';
export default function IconTankPlus({ size = 16, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="3" y="6" width="18" height="14" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5" />
      <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
