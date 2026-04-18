import React from 'react';
export default function IconAlertFood({ size = 20, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <path d="M6 16c0-3 2-5 6-5s6 2 6 5v1H6v-1z" fill="#ffd3b6" stroke="#e8a070" strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="12" y1="7" x2="12" y2="10" stroke="#f07070" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="5" r="1" fill="#f07070" />
    </svg>
  );
}
