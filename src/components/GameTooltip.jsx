// ============================================================
// GAME TOOLTIP — Custom tooltip replacing browser title=
// Usage: <Tip text="description">child</Tip>
// ============================================================
import React, { useState, useRef, useCallback } from 'react';

export default function Tip({ text, children, pos = 'top' }) {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const ref = useRef(null);
  const timerRef = useRef(null);

  const handleEnter = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = pos === 'bottom' ? rect.bottom + 6 : rect.top - 6;
    setCoords({ x, y });
    timerRef.current = setTimeout(() => setShow(true), 400);
  }, [pos]);

  const handleLeave = useCallback(() => {
    clearTimeout(timerRef.current);
    setShow(false);
  }, []);

  if (!text) return children;

  return (
    <span
      ref={ref}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ display: 'inline-flex', position: 'relative' }}
    >
      {children}
      {show && (
        <span
          className={`game-tip game-tip--${pos}`}
          style={{
            position: 'fixed',
            left: coords.x,
            top: coords.y,
            transform: pos === 'bottom' ? 'translateX(-50%)' : 'translateX(-50%) translateY(-100%)',
            zIndex: 10000,
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}
