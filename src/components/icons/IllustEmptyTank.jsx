import React from 'react';
export default function IllustEmptyTank({ size = 96, className = '', style }) {
  const w = size, h = size * 0.75;
  return (
    <svg width={w} height={h} viewBox="0 0 128 96" className={className} style={style} fill="none">
      {/* Tank outline */}
      <rect x="20" y="20" width="88" height="60" rx="8" fill="#e8f8ff" stroke="#8fe7ff" strokeWidth="2" />
      {/* Water */}
      <rect x="22" y="35" width="84" height="43" rx="6" fill="#c8f3ff" opacity="0.5" />
      {/* Sand */}
      <rect x="22" y="70" width="84" height="8" rx="4" fill="#ffd3b6" opacity="0.4" />
      {/* Single bubble */}
      <circle cx="64" cy="50" r="4" fill="none" stroke="#8fe7ff" strokeWidth="1.5" opacity="0.6">
        <animate attributeName="cy" values="55;35;55" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0.3;0.6" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="58" r="2.5" fill="none" stroke="#8fe7ff" strokeWidth="1" opacity="0.4">
        <animate attributeName="cy" values="60;42;60" dur="4s" repeatCount="indefinite" />
      </circle>
      {/* Question fish silhouette */}
      <g opacity="0.15" transform="translate(52, 42)">
        <ellipse cx="12" cy="8" rx="10" ry="6" fill="#5cbfcf" />
        <path d="M22 8l6-3v6l-6-3z" fill="#5cbfcf" />
      </g>
      {/* "?" */}
      <text x="64" y="52" textAnchor="middle" fontSize="14" fontWeight="700" fill="#8ba3b8" fontFamily="Quicksand, sans-serif">?</text>
    </svg>
  );
}
