// ============================================================
// FISH TYCOON 2 — LOG PANEL with severity filtering
// ============================================================
import React, { useState, useMemo } from 'react';

const SEVERITY_ORDER = { critical: 0, warn: 1, info: 2 };

function classifyMessage(entry) {
  // Support explicit severity tag from gameTick.js
  if (entry.severity) return entry.severity;
  const msg = entry.message || '';
  if (msg.startsWith('🚨') || msg.startsWith('💀') || msg.includes('died') || msg.includes('contracted')) return 'critical';
  if (msg.startsWith('🏆') || msg.startsWith('🎯') || msg.startsWith('🥚') || msg.startsWith('🐣') || msg.startsWith('🐟 A ') || msg.startsWith('🔮') || msg.startsWith('🌟')) return 'warn';
  return 'info';
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LogPanel({ log = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warn'
  const [collapsed, setCollapsed] = useState(false);

  const classified = useMemo(() =>
    log.map(entry => ({ ...entry, _sev: classifyMessage(entry) })),
    [log]
  );

  const criticalCount = classified.filter(e => e._sev === 'critical').length;

  const visible = filter === 'all'
    ? classified
    : classified.filter(e => e._sev === filter);

  return (
    <div className="log-panel">
      <div className="log-panel-header" onClick={() => setCollapsed(c => !c)} style={{ cursor: 'pointer' }}>
        <span className="log-panel-title">
          📋 Activity Log
          {criticalCount > 0 && (
            <span className="log-alert-badge">{criticalCount} 🚨</span>
          )}
        </span>
        <div className="log-panel-controls" onClick={e => e.stopPropagation()}>
          <button
            className={`log-filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            title="Show all messages"
          >All</button>
          <button
            className={`log-filter-btn log-filter-btn--warn ${filter === 'warn' ? 'active' : ''}`}
            onClick={() => setFilter('warn')}
            title="Show important events"
          >Events</button>
          <button
            className={`log-filter-btn log-filter-btn--critical ${filter === 'critical' ? 'active' : ''}`}
            onClick={() => setFilter('critical')}
            title="Show critical alerts only"
          >🚨 Alerts</button>
          <button className="log-collapse-btn" onClick={() => setCollapsed(c => !c)}>
            {collapsed ? '▼' : '▲'}
          </button>
        </div>
      </div>
      {!collapsed && (
        <div className="log-entries">
          {visible.length === 0 && (
            <div className="log-empty">No {filter !== 'all' ? filter + ' ' : ''}messages yet.</div>
          )}
          {visible.map((entry, i) => (
            <div
              key={i}
              className={`log-entry log-entry--${entry._sev}`}
            >
              <span className="log-entry-time">{formatTime(entry.time)}</span>
              <span className="log-entry-msg">{entry.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
