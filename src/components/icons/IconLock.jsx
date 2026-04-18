import React from 'react';
export default function IconLock({ size = 16, className = '', style, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <rect x="5" y="11" width="14" height="10" rx="3" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
