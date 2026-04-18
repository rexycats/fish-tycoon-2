// ============================================================
// TITLE LOGO — Styled Fish Tycoon 2 text with decorative stars
// ============================================================
import React from 'react';

function DecoStar({ x, y, size = 16, color = '#ffb7d5' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x, top: y }}
      className="title-deco-star" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill={color} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  );
}

export default function TitleLogo() {
  return (
    <div className="title-logo-container">
      {/* Decorative stars */}
      <DecoStar x="-30px" y="-10px" size={22} color="#ffb7d5" />
      <DecoStar x="40px" y="-20px" size={16} color="#ffe99a" />
      <DecoStar x="-10px" y="15px" size={12} color="#ffb7d5" />
      <DecoStar x="calc(100% - 20px)" y="-15px" size={20} color="#ffb7d5" />
      <DecoStar x="calc(100% + 10px)" y="5px" size={14} color="#ffe99a" />
      <DecoStar x="calc(100% - 50px)" y="-25px" size={16} color="#ffe99a" />

      <h1 className="title-text">
        <span className="title-fish">Fish</span>
        <br />
        <span className="title-tycoon">Tycoon</span>
        <span className="title-two">2</span>
      </h1>

      <p className="title-subtitle">BREED, TRADE, MANAGE</p>
    </div>
  );
}
