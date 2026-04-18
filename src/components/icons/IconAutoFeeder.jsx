import React from 'react';
export default function IconAutoFeeder({ size = 16, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <rect x="6" y="8" width="12" height="10" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5h4v3h-4z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 11.5v1.5l1 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
