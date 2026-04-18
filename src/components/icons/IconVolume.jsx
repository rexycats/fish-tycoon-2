import React from 'react';
export default function IconVolume({ size = 16, className = '', style, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <path d="M11 5L6 9H2v6h4l5 4V5z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M15.5 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 5.5a9 9 0 010 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
