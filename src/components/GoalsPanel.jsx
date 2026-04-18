// ============================================================
// FISH TYCOON 2 — GOALS PANEL
// Special Orders, Research, Loans, Daily Rewards, Weather
// ============================================================
import React, { useState, useMemo } from 'react';
import { useGameStore } from '../store/gameStore.js';
import { checkOrderFulfillment } from '../data/specialOrders.js';
import { RESEARCH_BRANCHES } from '../data/research.js';
import { LOAN_TIERS, getLoanStatus } from '../data/loans.js';
import { canClaimDaily, getStreak } from '../data/dailyRewards.js';
import { getTotalPossibleDiscoveries } from '../data/discoveries.js';
import { TANK_BACKGROUNDS } from '../data/tankBackgrounds.js';
import { getStreakMultiplier, getStreakLabel } from '../data/retention.js';
import { getMilestoneProgress, getTotalMilestones, getCompletedCount } from '../data/milestones.js';

export default function GoalsPanel() {
  const player = useGameStore(s => s.player);
  const fish   = useGameStore(s => s.fish);
  const orders = useGameStore(s => s.specialOrders) || [];
  const discoveries = useGameStore(s => s.discoveries) || [];
  const reviews = useGameStore(s => s.reviews) || [];
  const weather = useGameStore(s => s.weather);
  const fulfillOrder = useGameStore(s => s.fulfillOrder);
  const buyResearch = useGameStore(s => s.buyResearch);
  const takeLoan = useGameStore(s => s.takeLoan);
  const repayLoan = useGameStore(s => s.repayLoan);
  const claimDailyReward = useGameStore(s => s.claimDailyReward);
  const buyBackground = useGameStore(s => s.buyBackground);
  const claimMilestone = useGameStore(s => s.claimMilestone);

  const [subTab, setSubTab] = useState('campaign');

  const canClaim = canClaimDaily({ player });
  const streak = getStreak({ player });
  const loanStatus = getLoanStatus(player.activeLoan);

  return (
    <div className="goals-panel">
      {/* Weather banner */}
      {weather && (
        <div className="goals-weather">
          <span>{weather.label}</span>
          <span className="goals-weather-effect">
            {weather.happinessBonus > 0 ? `+${weather.happinessBonus} happiness` : weather.happinessBonus < 0 ? `${weather.happinessBonus} happiness` : ''}
            {weather.rare ? ' Rare weather!' : ''}
          </span>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="goals-tabs">
        {[
          ['campaign', 'Campaign'],
          ['orders', 'Orders'],
          ['research', 'Research'],
          ['bank', 'Bank'],
          ['journal', 'Journal'],
          ['backgrounds', 'Themes'],
        ].map(([id, label]) => (
          <button key={id} className={`goals-tab ${subTab === id ? 'active' : ''}`}
            onClick={() => setSubTab(id)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Streak status ──────────────────────────────── */}
      {streak > 0 && (
        <div className={`goals-streak ${streak >= 3 ? 'hot' : ''}`}>
          <span>{getStreakLabel(streak) || `Day ${streak}`}</span>
          {getStreakMultiplier(streak) > 1 && (
            <span className="goals-streak-mult">+{Math.round((getStreakMultiplier(streak)-1)*100)}% coins</span>
          )}
        </div>
      )}

      {/* ── Daily Reward ───────────────────────────────── */}
      {canClaim && (
        <div className="goals-daily">
          <span>Daily reward ready</span>
          <span className="goals-daily-streak">Day {streak + 1} streak</span>
          <button className="btn btn-sm btn-primary" onClick={claimDailyReward}>Claim!</button>
        </div>
      )}

      {/* ── Campaign Milestones ─────────────────────────── */}
      {subTab === 'campaign' && (() => {
        const state = useGameStore.getState();
        const chapters = getMilestoneProgress(state);
        const totalDone = getCompletedCount(state);
        const totalAll = getTotalMilestones();
        return (
          <div className="goals-section">
            <div className="goals-section-title">
              Campaign — {totalDone}/{totalAll} milestones
            </div>
            <div className="campaign-progress-bar">
              <div className="campaign-progress-fill" style={{ width: `${(totalDone / totalAll) * 100}%` }}/>
            </div>
            {Object.entries(chapters).map(([ch, info]) => (
              <div key={ch} className="campaign-chapter">
                <div className="campaign-chapter-header">
                  <span className="campaign-chapter-name">Ch.{ch}: {info.title}</span>
                  <span className="campaign-chapter-count">{info.done}/{info.total}</span>
                </div>
                <div className="campaign-milestones">
                  {info.milestones.map(m => (
                    <div key={m.id} className={`campaign-milestone ${m.isDone ? 'done' : ''} ${m.isReady ? 'ready' : ''}`}>
                      <span className="campaign-milestone-icon">{m.isDone ? '—' : ''}</span>
                      <div className="campaign-milestone-info">
                        <span className="campaign-milestone-title">{m.title}</span>
                        <span className="campaign-milestone-desc">{m.desc}</span>
                      </div>
                      {m.isDone ? (
                        <span className="campaign-milestone-claimed">Claimed</span>
                      ) : m.isReady ? (
                        <button className="btn btn-sm btn-primary campaign-claim" onClick={() => claimMilestone(m.id)}>
                          Claim <span className="coin-icon"/>{m.reward?.coins || 0}
                        </button>
                      ) : (
                        <span className="campaign-milestone-reward"><span className="coin-icon"/>{m.reward?.coins || 0}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {/* ── Special Orders ─────────────────────────────── */}
      {subTab === 'orders' && (
        <div className="goals-section">
          <div className="goals-section-title">Special Orders — refreshes daily</div>
          {orders.length === 0 && <div className="goals-empty">No orders available yet. Keep playing!</div>}
          {orders.map(order => {
            const matchingFish = fish.filter(f => f.stage === 'adult' && checkOrderFulfillment(f, order));
            return (
              <div key={order.id} className={`goals-order ${order.fulfilled ? 'fulfilled' : ''}`}>
                <div className="goals-order-header">
                  <span className="goals-order-emoji">{order.emoji}</span>
                  <div>
                    <div className="goals-order-desc">{order.desc}</div>
                    <div className="goals-order-customer">— {order.customer}</div>
                  </div>
                  <div className="goals-order-reward"><span className="coin-icon"/>{order.reward}</div>
                </div>
                {order.fulfilled ? (
                  <div className="goals-order-done">Fulfilled</div>
                ) : matchingFish.length > 0 ? (
                  <div className="goals-order-matches">
                    <span>{matchingFish.length} matching fish:</span>
                    {matchingFish.slice(0, 3).map(f => (
                      <button key={f.id} className="btn btn-sm goals-order-fill"
                        onClick={() => fulfillOrder(order.id, f.id)}>
                        Sell {f.nickname || f.species?.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="goals-order-none">No matching fish — breed or buy one!</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Research Tree ──────────────────────────────── */}
      {subTab === 'research' && (
        <div className="goals-section">
          <div className="goals-section-title">Research — permanent bonuses</div>
          {Object.entries(RESEARCH_BRANCHES).map(([branchId, branch]) => {
            const level = player.research?.[branchId] || 0;
            const next = level < branch.tiers.length ? branch.tiers[level] : null;
            return (
              <div key={branchId} className="goals-research-branch">
                <div className="goals-research-header">
                  <span style={{color: branch.color}}>{branch.emoji} {branch.label}</span>
                  <span className="goals-research-level">Tier {level}/{branch.tiers.length}</span>
                </div>
                <div className="goals-research-tiers">
                  {branch.tiers.map((tier, i) => (
                    <div key={i} className={`goals-research-tier ${i < level ? 'done' : i === level ? 'next' : 'locked'}`}>
                      <span className="goals-research-name">{i < level ? '·' : i === level ? '▸' : '—'} {tier.label}</span>
                      <span className="goals-research-desc">{tier.desc}</span>
                    </div>
                  ))}
                </div>
                {next && (
                  <button className="btn btn-sm" disabled={player.coins < next.cost}
                    onClick={() => buyResearch(branchId)}>
                    Research: <span className="coin-icon"/>{next.cost}
                  </button>
                )}
                {!next && <div className="goals-research-maxed">Fully researched</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Bank / Loans ──────────────────────────────── */}
      {subTab === 'bank' && (
        <div className="goals-section">
          <div className="goals-section-title">Bank of the Deep</div>
          {loanStatus ? (
            <div className="goals-loan-active">
              <div className="goals-loan-header">Active Loan</div>
              <div>Borrowed: <span className="coin-icon"/>{loanStatus.amount}</div>
              <div>Total owed: <span className="coin-icon"/>{loanStatus.totalOwed}</div>
              <div className={loanStatus.overdue ? 'goals-loan-overdue' : ''}>
                {loanStatus.overdue
                  ? 'OVERDUE — Bank will seize a fish!'
                  : `Time remaining: ${Math.floor(loanStatus.remaining / 60)}m ${Math.round(loanStatus.remaining % 60)}s`
                }
              </div>
              <button className="btn btn-sm btn-primary" disabled={player.coins < loanStatus.totalOwed}
                onClick={repayLoan}>
                Repay <span className="coin-icon"/>{loanStatus.totalOwed}
              </button>
            </div>
          ) : (
            <div className="goals-loan-options">
              <p style={{fontSize:'0.8rem',opacity:0.6,marginBottom:'0.8rem'}}>
                Need cash fast? Take a loan — but repay on time or the bank seizes your best fish!
              </p>
              {LOAN_TIERS.map(tier => (
                <div key={tier.id} className="goals-loan-tier">
                  <div>
                    <div className="goals-loan-name">{tier.label}</div>
                    <div className="goals-loan-desc">{tier.desc}</div>
                  </div>
                  <button className="btn btn-sm" onClick={() => takeLoan(tier.id)}>
                    Borrow <span className="coin-icon"/>{tier.amount}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Discovery Journal ─────────────────────────── */}
      {subTab === 'journal' && (
        <div className="goals-section">
          <div className="goals-section-title">Discovery Journal</div>
          <div className="goals-discovery-count">
            {discoveries.length} / {getTotalPossibleDiscoveries()} unique phenotypes discovered
          </div>
          <div className="goals-discovery-bar">
            <div className="goals-discovery-fill" style={{ width: `${(discoveries.length / getTotalPossibleDiscoveries()) * 100}%` }}/>
          </div>

          {reviews.length > 0 && (
            <>
              <div className="goals-section-title" style={{marginTop:'1rem'}}>Latest Reviews</div>
              {reviews.slice(0, 5).map((r, i) => (
                <div key={i} className="goals-review">
                  <span className="goals-review-stars">{'★'.repeat(r.stars)}</span>
                  <span className="goals-review-headline">"{r.headline}"</span>
                  <span className="goals-review-critic">{r.critic}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── Tank Backgrounds ──────────────────────────── */}
      {subTab === 'backgrounds' && (
        <div className="goals-section">
          <div className="goals-section-title">Tank Backgrounds</div>
          <div className="goals-bg-grid">
            {TANK_BACKGROUNDS.map(bg => {
              const owned = bg.cost === 0 || (player.unlockedBackgrounds || []).includes(bg.id);
              const locked = bg.minPrestige && (player.prestigeLevel || 0) < bg.minPrestige;
              const tanks = useGameStore.getState().tanks || [];
              return (
                <div key={bg.id} className={`goals-bg-card ${owned ? 'owned' : ''} ${locked ? 'locked' : ''}`}>
                  <div className="goals-bg-preview" style={{ background: bg.gradient }}/>
                  <div className="goals-bg-name">{bg.emoji} {bg.label}</div>
                  <div className="goals-bg-desc">{bg.desc}</div>
                  {locked ? (
                    <div className="goals-bg-locked">Prestige {bg.minPrestige}</div>
                  ) : owned ? (
                    <select className="goals-bg-apply" defaultValue=""
                      onChange={e => { if (e.target.value) { useGameStore.getState().setTankBackground(e.target.value, bg.id); e.target.value = ''; } }}>
                      <option value="">Apply to tank...</option>
                      {tanks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  ) : (
                    <button className="btn btn-sm" disabled={player.coins < bg.cost}
                      onClick={() => buyBackground(bg.id)}>
                      <span className="coin-icon"/>{bg.cost}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
