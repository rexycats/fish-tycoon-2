// ============================================================
// ASCENSION TREE — Skill tree UI for meta progression
// ============================================================
import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { ASCENSION_BRANCHES, hasUnlock, canBuyUnlock, getAscensionRequirements, canAscend, CORAL_SHOP } from '../data/ascension.js';

export default function AscensionTree() {
  const player = useGameStore(s => s.player);
  const buyAscensionUnlock = useGameStore(s => s.buyAscensionUnlock);
  const performAscensionAction = useGameStore(s => s.performAscensionAction);
  const buyCoral = useGameStore(s => s.buyCoralItem);
  const [tab, setTab] = useState('tree'); // tree | shop | info
  const state = useGameStore(s => s);

  const level = player?.ascensionLevel || 0;
  const ap = player?.ascensionPoints || 0;
  const apTotal = player?.ascensionPointsTotal || 0;
  const coral = player?.coralFragments || 0;
  const tree = player?.ascensionTree || {};
  const records = player?.dynastyRecords || {};

  const reqs = getAscensionRequirements(level);
  const canDo = canAscend(state);

  return (
    <div className="ascension-panel">
      {/* Header */}
      <div className="asc-header">
        <div className="asc-level">
          <span className="asc-level-icon"></span>
          <span className="asc-level-num">Ascension {level}</span>
        </div>
        <div className="asc-currencies">
          <span className="asc-ap" title="Ascension Points">{ap} AP</span>
          <span className="asc-coral" title="Coral Fragments">{coral}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="asc-tabs">
        {[['tree', 'Skill Tree'], ['shop', 'Coral Shop'], ['info', 'Legacy']].map(([id, label]) => (
          <button key={id} className={`asc-tab ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* Skill Tree */}
      {tab === 'tree' && (
        <div className="asc-tree">
          {Object.values(ASCENSION_BRANCHES).map(branch => (
            <div key={branch.id} className="asc-branch" style={{ '--branch-color': branch.color }}>
              <div className="asc-branch-header">
                <span className="asc-branch-icon">{branch.icon}</span>
                <div>
                  <div className="asc-branch-name">{branch.name}</div>
                  <div className="asc-branch-desc">{branch.desc}</div>
                </div>
              </div>
              <div className="asc-tiers">
                {branch.tiers.map((tier, i) => {
                  const owned = hasUnlock(state, branch.id, i);
                  const canBuy = canBuyUnlock(state, branch.id, i);
                  const locked = !owned && !canBuy;
                  const prevOwned = i === 0 || hasUnlock(state, branch.id, i - 1);
                  return (
                    <button key={tier.id}
                      className={`asc-node ${owned ? 'asc-node--owned' : canBuy ? 'asc-node--available' : 'asc-node--locked'}`}
                      disabled={!canBuy}
                      onClick={() => canBuy && buyAscensionUnlock(branch.id, i)}
                      title={tier.desc}
                    >
                      <span className="asc-node-icon">{tier.icon}</span>
                      <span className="asc-node-name">{tier.name}</span>
                      {owned && <span className="asc-node-check"></span>}
                      {!owned && <span className="asc-node-cost">{tier.cost} AP</span>}
                      {i < branch.tiers.length - 1 && (
                        <div className={`asc-connector ${prevOwned && owned ? 'asc-connector--lit' : ''}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Coral Shop */}
      {tab === 'shop' && (
        <div className="asc-shop">
          <div className="asc-shop-balance">{coral} Coral Fragments</div>
          <div className="asc-shop-grid">
            {CORAL_SHOP.map(item => {
              const canAfford = coral >= item.cost;
              return (
                <div key={item.id} className={`asc-shop-item ${canAfford ? '' : 'asc-shop-item--locked'}`}>
                  <span className="asc-shop-icon">{item.icon}</span>
                  <div className="asc-shop-info">
                    <div className="asc-shop-name">{item.name}</div>
                    <div className="asc-shop-desc">{item.desc}</div>
                  </div>
                  <button className="btn btn-sm" disabled={!canAfford}
                    onClick={() => buyCoral?.(item.id)}>
                    {item.cost}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legacy / Info */}
      {tab === 'info' && (
        <div className="asc-legacy">
          <div className="asc-section-title">Dynasty Records</div>
          <div className="asc-records">
            <div className="asc-record">
              <span className="asc-record-label">Longest Dynasty</span>
              <span className="asc-record-val">Gen {records.longestGeneration || 1}</span>
            </div>
            <div className="asc-record">
              <span className="asc-record-label">Highest Purity</span>
              <span className="asc-record-val">{records.highestPurity || 0}/8 genes</span>
            </div>
            <div className="asc-record">
              <span className="asc-record-label">Best Sale</span>
              <span className="asc-record-val">🪙{(records.mostValuableSale || 0).toLocaleString()}</span>
            </div>
            <div className="asc-record">
              <span className="asc-record-label">Total Ascensions</span>
              <span className="asc-record-val">{level}</span>
            </div>
            <div className="asc-record">
              <span className="asc-record-label">Total AP Earned</span>
              <span className="asc-record-val">{apTotal}</span>
            </div>
            <div className="asc-record">
              <span className="asc-record-label">Species Known</span>
              <span className="asc-record-val">{(player?.fishdex || []).length}</span>
            </div>
          </div>

          {/* Ascension Requirements */}
          <div className="asc-section-title">Next Ascension</div>
          <div className="asc-reqs">
            {Object.entries(reqs).map(([path, req]) => {
              const met = req.check(state);
              return (
                <div key={path} className={`asc-req ${met ? 'asc-req--met' : ''}`}>
                  <span className="asc-req-check">{met ? '' : ''}</span>
                  <span className="asc-req-label">{req.label}</span>
                  <span className="asc-req-path">{path}</span>
                </div>
              );
            })}
          </div>
          <div className="asc-req-note">Complete any one path to ascend</div>

          {canDo && (
            <button className="btn btn-primary asc-ascend-btn" onClick={() => performAscensionAction?.()}>
              Ascend to Level {level + 1} — Earn {level + 1} AP
            </button>
          )}
        </div>
      )}
    </div>
  );
}
