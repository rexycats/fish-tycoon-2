// ============================================================
// NOTIFICATION CENTER — Pinned important events
// ============================================================
import React from 'react';
import { useGameStore } from '../store/gameStore.js';

export default function NotificationCenter() {
  const notifications = useGameStore(s => s.notifications || []);
  const dismissNotif = useGameStore(s => s.dismissNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="notif-center">
      {notifications.slice(0, 5).map(n => (
        <div key={n.id} className={`notif-item notif-item--${n.type || 'info'}`}>
          <div className="notif-item-msg">{n.message}</div>
          <button className="notif-dismiss" onClick={() => dismissNotif(n.id)}>x</button>
        </div>
      ))}
    </div>
  );
}
