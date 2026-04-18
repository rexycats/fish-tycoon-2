import React from 'react';
export default function IconCheck({ size = 16, className = '', style, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12l2.5 3L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
