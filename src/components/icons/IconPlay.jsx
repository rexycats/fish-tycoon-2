import React from 'react';
export default function IconPlay({ size = 16, className = '', style, title }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none" xmlns="http://www.w3.org/2000/svg">
      {title && <title>{title}</title>}
      <path d="M7 4l14 8-14 8V4z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeLinejoin="round" />
    </svg>
  );
}
