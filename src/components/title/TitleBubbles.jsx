// ============================================================
// TITLE BUBBLES — Animated floating bubbles
// ============================================================
import React, { useMemo } from 'react';

export default function TitleBubbles() {
  const bubbles = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: 3 + Math.random() * 94,
      size: 6 + Math.random() * 28,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.25,
      wobble: -15 + Math.random() * 30,
    }))
  , []);

  return (
    <div className="title-bubbles-layer" aria-hidden="true">
      {bubbles.map(b => (
        <div
          key={b.id}
          className="title-float-bubble"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            opacity: b.opacity,
            '--wobble': `${b.wobble}px`,
          }}
        >
          <svg viewBox="0 0 40 40" width="100%" height="100%">
            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
            <ellipse cx="14" cy="14" rx="5" ry="3.5" fill="rgba(255,255,255,0.3)" transform="rotate(-30 14 14)" />
          </svg>
        </div>
      ))}
    </div>
  );
}
