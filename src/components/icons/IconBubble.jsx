import React from 'react';
export default function IconBubble({ size = 16, className = '', style, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <circle cx="12" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="10" cy="8" rx="2" ry="1.5" fill="currentColor" opacity="0.2" transform="rotate(-20 10 8)" />
    </svg>
  );
}
