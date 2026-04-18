import React from 'react';
export default function IconFishBag({ size = 20, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M8 4h8l1 3H7l1-3z" fill="#8fe7ff" opacity="0.3" stroke="#5cbfcf" strokeWidth="1.5" strokeLinejoin="round" />
      <ellipse cx="12" cy="14" rx="6" ry="7" fill="#8fe7ff" opacity="0.2" stroke="#5cbfcf" strokeWidth="1.5" />
      <path d="M10 13c1-1 3-1 4 0" stroke="#5cbfcf" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="12" r="0.8" fill="#5cbfcf" />
      <path d="M14 11l1.5-.5 1.5.5-1.5.5z" fill="#5cbfcf" opacity="0.5" />
    </svg>
  );
}
