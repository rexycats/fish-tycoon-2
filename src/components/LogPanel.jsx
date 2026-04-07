// ============================================================
// FISH TYCOON 2 — LOG PANEL with severity filtering
// ============================================================
import React, { useState, useMemo } from 'react';

const SEVERITY_ORDER = { critical: 0, warn: 1, success: 2, info: 3 };

function classifyMessage(entry) {
  if (entry.severity) return entry.severity;
  const msg = entry.message || '';
  if (msg.startsWith('🚨') || msg.startsWith('💀') || msg.includes('died') || msg.includes('contracted')) return 'critical';
  if (msg.startsWith('🏆') || msg.startsWith('🎯') || msg.startsWith('🥚') || msg.startsWith('🐣') || msg.startsWith('🐟 A ') || msg.startsWith('🌟')) return 'success';
  if (msg.startsWith('🔮')) return 'warn';
  return 'info';
}

// ── Highlight detection ──────────────────────────────────────
// Returns 'epic' | 'notable' | null
function getHighlight(message = '') {
  // Epic — rarest events, get the full glow treatment
  if (message.startsWith('🔮'))                       return 'epic';   // magic fish discovery
  if (message.includes('Legendary') || message.includes('legendary')) return 'epic';
  if (message.startsWith('📖') && (
    message.includes('Epic') || message.includes('Rare')
  ))                                                   return 'epic';

  // Notable — exciting but not jaw-dropping
  if (message.startsWith('🎯'))                       return 'notable'; // challenge complete
  if (message.startsWith('🥚'))                       return 'notable'; // egg ready
  if (message.startsWith('🐣'))                       return 'notable'; // hatch
  if (message.startsWith('🏆'))                       return 'notable'; // achievement
  if (message.startsWith('🌟'))                       return 'notable'; // market buy
  if (message.startsWith('⬆️'))                      return 'notable'; // upgrade
  if (message.startsWith('📖'))                       return 'notable'; // new species
  // Big sale — any sale ≥ 150 coins
  const saleMatch = message.match(/bought.*?🪙(\d+)/);
  if (saleMatch && parseInt(saleMatch[1], 10) >= 150) return 'notable';

  return null;
}

// Emoji segment regex — matches a single leading emoji cluster
const EMOJI_RE = /^(\p{Emoji_Presentation}\p{Emoji_Modifier}?\p{Emoji_Component}*(?:\u200D\p{Emoji_Presentation}\p{Emoji_Modifier}?\p{Emoji_Component}*)*)\s*/u;

/**
 * Extract the leading emoji from a message string.
 * Returns { icon, text } — text has the emoji stripped.
 * Falls back to a severity-based icon if no leading emoji.
 */
function getLogIcon(message = '', severity = 'info') {
  const match = message.match(EMOJI_RE);
  if (match) {
    return { icon: match[1], text: message.slice(match[0].length) };
  }
  // Fallback icons by severity (covers entries with no emoji)
  const fallback = { critical: '🦠', warn: '⚡', success: '✅', info: '•' };
  return { icon: fallback[severity] ?? '•', text: message };
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function LogPanel({ log = [] }) {
  const [filter, setFilter] = useState('all');
  const [collapsed, setCollapsed] = useState(false);

  const classified = useMemo(() =>
    log.map(entry => {
      const sev = classifyMessage(entry);
      const { icon, text } = getLogIcon(entry.message, sev);
      const hl = getHighlight(entry.message);
      return { ...entry, _sev: sev, _icon: icon, _text: text, _hl: hl };
    }),
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
              className={`log-entry log-entry--${entry._sev}${entry._hl ? ` log-entry--${entry._hl}` : ''}`}
            >
              <span className="log-entry-icon" aria-hidden="true">{entry._icon}</span>
              <span className="log-entry-time">{formatTime(entry.time)}</span>
              <span className="log-entry-msg">{entry._text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
