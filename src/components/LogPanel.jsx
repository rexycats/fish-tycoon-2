import React, { memo } from 'react';

function LogPanel({ log }) {
  return (
    <div className="panel log-panel">
      <h3>Activity Log</h3>
      <div className="log-entries">
        {log.map((entry, i) => (
          <div key={`${entry.time}-${i}`} className="log-entry">
            <span className="log-time">{formatTime(entry.time)}</span>
            <span className="log-msg">{entry.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Only re-render when the newest log entry changes
export default memo(LogPanel, (prev, next) =>
  prev.log?.[0]?.time === next.log?.[0]?.time &&
  prev.log?.length    === next.log?.length
);
