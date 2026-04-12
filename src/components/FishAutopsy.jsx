// ============================================================
// FISH TYCOON 2 — FISH AUTOPSY PANEL (Phase 10)
// Shows cause of death + genetic record for deceased fish
// ============================================================

import React, { useState } from 'react';
import { RARITY } from '../data/genetics.js';
import FishSprite from './FishSprite.jsx';

const CAUSE_COLORS = {
  'Starvation':        '#e08840',
  'Water Toxicity':    '#40a0e0',
  'Temperature Shock': '#e04040',
  'Ich':               '#ff4444',
  'Fin Rot':           '#a06020',
  'Bloat':             '#d4c020',
  'Velvet':            '#e06820',
  'Old Age / Unknown': '#607080',
};

const CAUSE_ICONS = {
  'Starvation':        '🍽️',
  'Water Toxicity':    '☠️',
  'Temperature Shock': '🌡️',
  'Ich':               '🔴',
  'Fin Rot':           '🟤',
  'Bloat':             '🟡',
  'Velvet':            '🟠',
  'Old Age / Unknown': '❓',
};

const CAUSE_TIPS = {
  'Starvation':        'Tip: Enable auto-feed or check food supplies regularly.',
  'Water Toxicity':    'Tip: Use Water Treatment when quality drops below 50%.',
  'Temperature Shock': 'Tip: Use heater cartridges to keep temperature near 74°F.',
  'Ich':               'Tip: Ich spreads fast — treat all fish in the tank immediately.',
  'Fin Rot':           'Tip: Fin Rot thrives in dirty water. Maintain water quality above 40%.',
  'Bloat':             'Tip: Bloat is caused by overfeeding. Let hunger drop before feeding.',
  'Velvet':            'Tip: Velvet is very aggressive. Quarantine infected fish if possible.',
  'Old Age / Unknown': 'Keep monitoring your fish for stressors.',
};

function AutopsyCard({ record }) {
  const [expanded, setExpanded] = useState(false);
  const rarity    = RARITY[record.rarity] || RARITY.common;
  const causeCol  = CAUSE_COLORS[record.cause] || '#607080';
  const causeIcon = CAUSE_ICONS[record.cause]  || '❓';
  const tip       = CAUSE_TIPS[record.cause]   || '';

  const timeAgo = (() => {
    const diff = Date.now() - record.diedAt;
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    return `${Math.floor(min / 60)}h ago`;
  })();

  // Reconstruct a fake fish object for the sprite.
  // id is required: FishSprite uses it to namespace all SVG gradient/filter IDs.
  // Without it every card shares uid='x', causing gradient collisions when >1 card is visible.
  const fakeFish = {
    id: record.id,
    phenotype: record.phenotype,
    genome: record.genome || {},
    species: { name: record.fishName, rarity: record.rarity },
    stage: 'adult',
    health: 0,
    hunger: 0,
  };

  return (
    <div className="autopsy-card" style={{ '--ac': causeCol }}>
      <div className="autopsy-card-header" onClick={() => setExpanded(e => !e)}>
        <div className="autopsy-sprite-wrap">
          <FishSprite fish={fakeFish} size={48} />
          <div className="autopsy-dead-overlay">✝</div>
        </div>
        <div className="autopsy-info">
          <div className="autopsy-name" style={{ color: rarity.color }}>{record.fishName}</div>
          <div className="autopsy-meta">
            <span className="autopsy-rarity">{rarity.label}</span>
            <span className="autopsy-age">Lived {record.ageMinutes} min</span>
            <span className="autopsy-time">{timeAgo}</span>
          </div>
        </div>
        <div className="autopsy-cause" style={{ color: causeCol }}>
          <span className="autopsy-cause-icon">{causeIcon}</span>
          <span className="autopsy-cause-label">{record.cause}</span>
        </div>
        <div className="autopsy-chevron">{expanded ? '▲' : '▼'}</div>
      </div>

      {expanded && (
        <div className="autopsy-card-body">
          <div className="autopsy-detail-row">
            <span className="autopsy-detail-label">Tank:</span>
            <span>{record.tankName}</span>
          </div>
          <div className="autopsy-detail-row">
            <span className="autopsy-detail-label">Water Quality:</span>
            <span style={{ color: record.waterQuality < 30 ? '#ff6040' : '#7ec8a0' }}>
              {record.waterQuality}%
            </span>
          </div>
          <div className="autopsy-detail-row">
            <span className="autopsy-detail-label">Hunger at death:</span>
            <span style={{ color: record.hunger > 80 ? '#ff6040' : '#aaa' }}>
              {record.hunger}%
            </span>
          </div>
          {record.detail && (
            <div className="autopsy-cause-detail">
              {causeIcon} {record.detail}
            </div>
          )}
          {tip && (
            <div className="autopsy-tip">💡 {tip}</div>
          )}
          <div className="autopsy-phenotype">
            <div className="autopsy-ph-label">Genetics:</div>
            <div className="autopsy-ph-tags">
              {Object.entries(record.phenotype || {}).map(([k, v]) => (
                <span key={k} className="autopsy-ph-tag">
                  <span className="autopsy-ph-key">{k}:</span> {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FishAutopsyPanel({ autopsies = [] }) {
  if (autopsies.length === 0) {
    return (
      <div className="autopsy-panel">
        <div className="autopsy-header">
          <h2 className="autopsy-title">🔬 Fish Autopsy</h2>
          <p className="autopsy-subtitle">Understand why your fish died. Improve. Prevent.</p>
        </div>
        <div className="autopsy-empty">
          <div className="autopsy-empty-icon">🐟</div>
          <p>No deaths recorded yet. Long may your fish live!</p>
        </div>
      </div>
    );
  }

  // Aggregate cause-of-death stats
  const causeCounts = {};
  for (const r of autopsies) {
    causeCounts[r.cause] = (causeCounts[r.cause] || 0) + 1;
  }
  const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="autopsy-panel">
      <div className="autopsy-header">
        <div className="autopsy-header-left">
          <h2 className="autopsy-title">🔬 Fish Autopsy</h2>
          <p className="autopsy-subtitle">Post-mortem records — understand and prevent future losses.</p>
        </div>
        <div className="autopsy-stats-wrap">
          <div className="autopsy-stat">
            <div className="autopsy-stat-num">{autopsies.length}</div>
            <div className="autopsy-stat-label">Deaths</div>
          </div>
          {topCause && (
            <div className="autopsy-stat">
              <div className="autopsy-stat-num" style={{ color: CAUSE_COLORS[topCause[0]] || '#aaa' }}>
                {CAUSE_ICONS[topCause[0]] || '❓'}
              </div>
              <div className="autopsy-stat-label">Top Cause</div>
              <div className="autopsy-stat-sub">{topCause[0]}</div>
            </div>
          )}
        </div>
      </div>

      {/* Cause breakdown */}
      <div className="autopsy-breakdown">
        {Object.entries(causeCounts).sort((a, b) => b[1] - a[1]).map(([cause, count]) => (
          <div key={cause} className="autopsy-breakdown-row">
            <span className="autopsy-bd-icon">{CAUSE_ICONS[cause] || '❓'}</span>
            <span className="autopsy-bd-label">{cause}</span>
            <div className="autopsy-bd-bar-wrap">
              <div
                className="autopsy-bd-bar"
                style={{
                  width: `${Math.round((count / autopsies.length) * 100)}%`,
                  background: CAUSE_COLORS[cause] || '#607080',
                }}
              />
            </div>
            <span className="autopsy-bd-count">{count}</span>
          </div>
        ))}
      </div>

      {/* Recent records */}
      <div className="autopsy-records">
        <div className="autopsy-records-title">Recent Deaths (last {autopsies.length})</div>
        {[...autopsies].reverse().map(record => (
          <AutopsyCard key={record.id} record={record} />
        ))}
      </div>
    </div>
  );
}
export default FishAutopsyPanel;
