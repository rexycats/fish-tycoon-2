// ============================================================
// FISH TYCOON 2 — GAMEPAD / CONTROLLER SUPPORT
// Maps gamepad buttons to game actions for Steam Deck
// ============================================================
import { useEffect, useRef } from 'react';

// Standard gamepad button mapping (Xbox layout)
const BUTTON_MAP = {
  0: 'a',       // A — confirm / select fish
  1: 'b',       // B — back / close
  2: 'x',       // X — feed
  3: 'y',       // Y — sell toggle
  4: 'lb',      // LB — previous tab
  5: 'rb',      // RB — next tab
  6: 'lt',      // LT — slow speed
  7: 'rt',      // RT — fast speed
  8: 'select',  // Select — toggle log
  9: 'start',   // Start — pause
  12: 'up',     // D-pad up
  13: 'down',   // D-pad down
  14: 'left',   // D-pad left
  15: 'right',  // D-pad right
};

export function useGamepad(onAction) {
  const prevButtons = useRef(new Set());

  useEffect(() => {
    let rafId;
    const poll = () => {
      const gamepads = navigator.getGamepads?.() || [];
      for (const gp of gamepads) {
        if (!gp) continue;
        const pressed = new Set();
        for (let i = 0; i < gp.buttons.length; i++) {
          if (gp.buttons[i].pressed) pressed.add(i);
        }
        // Fire on press (not held)
        for (const btn of pressed) {
          if (!prevButtons.current.has(btn)) {
            const action = BUTTON_MAP[btn];
            if (action) onAction(action);
          }
        }
        prevButtons.current = pressed;
        break; // first gamepad only
      }
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [onAction]);
}
