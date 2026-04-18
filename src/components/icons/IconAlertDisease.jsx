import React from 'react';
export default function IconAlertDisease({ size = 20, className = '', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} fill="none">
      <circle cx="12" cy="12" r="7" fill="#ffb7d5" opacity="0.2" stroke="#f07070" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.2" fill="#f07070" />
      <circle cx="15" cy="10" r="1.2" fill="#f07070" />
      <circle cx="12" cy="15" r="1.2" fill="#f07070" />
      <circle cx="8" cy="14" r="0.8" fill="#f07070" opacity="0.5" />
      <circle cx="16" cy="13" r="0.8" fill="#f07070" opacity="0.5" />
    </svg>
  );
}
