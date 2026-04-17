import React, { useState, useEffect, useCallback, useRef } from 'react';

/* ── Individual Toast ─────────────────────────────────────── */
function Toast({ id, message, type, emoji, onDismiss }) {
  const [phase, setPhase] = useState('enter'); // enter | visible | exit

  useEffect(() => {
    // After mount give a frame to trigger enter animation
    const t1 = setTimeout(() => setPhase('visible'), 20);
    // Begin exit after 3.2 s
    const t2 = setTimeout(() => setPhase('exit'), 3200);
    // Remove after exit animation
    const t3 = setTimeout(() => onDismiss(id), 3700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [id, onDismiss]);

  return (
    <div
      className={`toast toast--${type} toast--${phase}`}
      onClick={() => { setPhase('exit'); setTimeout(() => onDismiss(id), 450); }}
    >
      <span className="toast-emoji">{emoji}</span>
      <span className="toast-msg">{message}</span>
      <div className="toast-progress" />
    </div>
  );
}

/* ── Toast Manager ────────────────────────────────────────── */
let _addToast = null;

export function fireToast(message, type = 'info', emoji = '') {
  if (_addToast) _addToast({ message, type, emoji });
}

export default function ToastManager() {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const addToast = useCallback((toast) => {
    const id = ++counterRef.current;
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]); // max 5
  }, []);

  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <div className="toast-portal">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onDismiss={dismiss} />
      ))}
    </div>
  );
}
