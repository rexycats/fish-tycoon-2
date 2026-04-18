import React from 'react';
export default function IllustNoFish({ size = 80, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className} style={style} fill="none">
      {/* Fishing rod */}
      <line x1="20" y1="10" x2="20" y2="50" stroke="#8ba3b8" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="10" x2="55" y2="10" stroke="#8ba3b8" strokeWidth="2" strokeLinecap="round" />
      {/* Line dangling */}
      <path d="M55 10 Q55 40, 50 55" stroke="#8ba3b8" strokeWidth="1" strokeDasharray="3 2" />
      {/* Hook */}
      <path d="M50 55 Q48 60, 50 62 Q53 60, 50 55" stroke="#f0b840" strokeWidth="1.5" fill="none" />
      {/* Water surface */}
      <path d="M10 45 Q25 42, 40 45 Q55 48, 70 45" stroke="#8fe7ff" strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Bubbles */}
      <circle cx="45" cy="52" r="2" fill="none" stroke="#8fe7ff" strokeWidth="1" opacity="0.4" />
      <circle cx="55" cy="58" r="1.5" fill="none" stroke="#8fe7ff" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}
