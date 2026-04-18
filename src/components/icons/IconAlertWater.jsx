import React from 'react';
export default function IconAlertWater({ size = 20, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M12 3c-3 4-6 7-6 10a6 6 0 0012 0c0-3-3-6-6-10z" fill="#8fe7ff" opacity="0.3" stroke="#5cbfcf" strokeWidth="1.5" />
      <line x1="12" y1="11" x2="12" y2="15" stroke="#f0b840" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.8" fill="#f0b840" />
    </svg>
  );
}
