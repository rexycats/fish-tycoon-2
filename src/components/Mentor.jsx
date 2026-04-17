// ============================================================
// MENTOR — Contextual aquarium guide character
// Pops up with first-time tips and helpful hints
// ============================================================
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore.js';

const MENTOR_HINTS = [
  { id: 'hint_welcome',      trigger: (s) => !s.player?.tutorialDone && (s.player?.tutorialStep || 0) === 0, message: "Hey there! I'm Marina, your aquarium advisor. I'll pop up with tips as you learn the ropes.", priority: 0 },
  { id: 'hint_low_food',     trigger: (s) => s.tanks?.some(t => (t.supplies?.food || 0) < 3), message: "Running low on fish food! Head to Market → Supplies before your fish go hungry.", priority: 2 },
  { id: 'hint_can_breed',    trigger: (s) => s.fish?.filter(f => f.stage === 'adult').length >= 2 && !(s.player?.stats?.breedingsStarted || 0), message: "You have two adults — try pairing them in the Breeding Lab to discover new species!", priority: 1 },
  { id: 'hint_can_upgrade',  trigger: (s) => s.player?.coins >= 300 && s.tanks?.length === 1, message: "You've saved up some coins! Consider unlocking a second tank or upgrading your current one.", priority: 1 },
  { id: 'hint_hire_staff',   trigger: (s) => s.player?.level >= 2 && (!s.staff || s.staff.length === 0), message: "Tired of manual feeding? Hire a Caretaker in Office → Staff to automate the basics.", priority: 1 },
  { id: 'hint_research',     trigger: (s) => s.player?.coins >= 500 && !Object.values(s.player?.research || {}).some(v => v > 0), message: "Check out the Research Lab in the Office! Permanent upgrades that make everything easier.", priority: 1 },
  { id: 'hint_supplier',     trigger: (s) => (s.shop?.reputation || 0) >= 10 && s.suppliers?.unlocked?.length <= 1, message: "Your reputation unlocked a new supplier! Check the Fish tab in Market for new species.", priority: 2 },
  { id: 'hint_equipment',    trigger: (s) => s.player?.level >= 3 && !s.tanks?.some(t => (t.equipment || []).length > 0), message: "Have you tried installing equipment? Filters and aerators in Market keep your tanks healthier.", priority: 1 },
  { id: 'hint_gift_shop',    trigger: (s) => s.player?.coins >= 500 && !s.giftShop?.unlocked, message: "Build a Gift Shop from Market → Amenities for steady passive income!", priority: 1 },
];

export default function Mentor() {
  const [dismissed, setDismissed] = useState({});
  const [activeHint, setActiveHint] = useState(null);

  // Check for hints periodically
  useEffect(() => {
    const check = () => {
      const state = useGameStore.getState();
      const mentorFlags = state.player?.mentorFlags || {};

      for (const hint of MENTOR_HINTS) {
        if (mentorFlags[hint.id] || dismissed[hint.id]) continue;
        try {
          if (hint.trigger(state)) {
            setActiveHint(hint);
            return;
          }
        } catch { /* ignore trigger errors */ }
      }
      setActiveHint(null);
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, [dismissed]);

  const handleDismiss = () => {
    if (!activeHint) return;
    setDismissed(d => ({ ...d, [activeHint.id]: true }));
    // Persist so it doesn't show again next session
    useGameStore.setState(state => {
      if (!state.player.mentorFlags) state.player.mentorFlags = {};
      state.player.mentorFlags[activeHint.id] = true;
    });
    setActiveHint(null);
  };

  if (!activeHint) return null;

  return (
    <div className="mentor-bubble">
      <div className="mentor-avatar">M</div>
      <div className="mentor-content">
        <div className="mentor-name">Marina</div>
        <div className="mentor-msg">{activeHint.message}</div>
      </div>
      <button className="mentor-dismiss" onClick={handleDismiss}>Got it</button>
    </div>
  );
}
