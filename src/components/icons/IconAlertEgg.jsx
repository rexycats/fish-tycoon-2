import React from 'react';
export default function IconAlertEgg({ size = 20, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <ellipse cx="12" cy="13" rx="6" ry="8" fill="#ffe99a" opacity="0.3" stroke="#f0b840" strokeWidth="1.5" />
      <path d="M9 11l3-3 3 3" stroke="#f0b840" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13h4" stroke="#f0b840" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
