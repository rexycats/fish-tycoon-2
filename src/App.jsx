import React, { useState, useCallback } from 'react';
import ToastManager from './components/ToastManager.jsx';
import { MAGIC_FISH } from './data/genetics.js';
import { TANK_UNLOCK, TANK_TYPES } from './data/gameState.js';
import { getApiKey, setApiKey } from './services/aiService.js';
import TankView       from './components/TankView.jsx';
import FishPanel      from './components/FishPanel.jsx';
import HUD            from './components/HUD.jsx';
import LogPanel       from './components/LogPanel.jsx';
import Fishdex        from './components/Fishdex.jsx';
import BreedingLab    from './components/BreedingLab.jsx';
import Shop           from './components/Shop.jsx';
import OfflineSummary from './components/OfflineSummary.jsx';
import Achievements   from './components/Achievements.jsx';
import MagicFishPanel from './components/MagicFish.jsx';
import DecorationPanel from './components/DecorationPanel.jsx';
import FishAutopsyPanel from './components/FishAutopsy.jsx';

import { useGameEngine }    from './hooks/useGameEngine.js';
import { useFishSelection } from './hooks/useFishSelection.js';
import { useEconomy }       from './hooks/useEconomy.js';

export default function App() {
  // ── Core game state + tick + save ───────────────────────────
  const {
    game, setGame,
    showOffline, setShowOffline,
    soundOn, toggleSound,
    coinDeltas,
  } = useGameEngine();

  // ── Fish / tank selection + Fishdex + AI lore ────────────────
  const {
    selectedFishId, setSelectedFishId,
    activeTankId,   setActiveTankId,
    activeTank,     tankFish,
    selectedFish,   isListed,
    showWinModal,   setShowWinModal,
    generatingLoreFor,
    aiError,        setAiError,
    handleGenerateLore,
  } = useFishSelection(game, setGame);

  // ── All player action callbacks ──────────────────────────────
  const {
    feedFish, useMedicine, moveFishToTank,
    treatWater, toggleAutoFeed, useHeater, unlockTank, renameTank,
    toggleSellFish, setFishPrice, buySupply, buyFish, buyUpgrade, buyRareMarketItem,
    buyDecoration, claimUnlockedDecoration, placeDecoration, removeDecoration,
    selectForBreeding, cancelBreeding, collectEgg,
    resetGame, handleExportSave, handleImportSave,
  } = useEconomy(game, setGame, activeTankId, setSelectedFishId, setActiveTankId);

  // ── Tab + "NEW" badge state ──────────────────────────────────
  const [activeTab, setActiveTab]         = useState('tank');
  const [showApiSetup, setShowApiSetup]   = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentFishdexCount  = (game.player.fishdex || []).length;
  const currentShopFishCount = (game.fish || []).filter(f => f.stage === 'adult').length;
  const newFishdexCount      = Math.max(0, currentFishdexCount  - (game.player.seenFishdexCount  || 0));
  const newShopFishCount     = Math.max(0, currentShopFishCount - (game.player.seenShopFishCount || 0));
  const currentAchCount      = (game.player.achievements || []).length;
  const newAchCount          = Math.max(0, currentAchCount - (game.player.seenAchCount || 0));

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'fishdex') {
      setGame(prev => ({
        ...prev,
        player: { ...prev.player, seenFishdexCount: (prev.player.fishdex || []).length },
      }));
    }
    if (tab === 'shop') {
      setGame(prev => ({
        ...prev,
        player: { ...prev.player, seenShopFishCount: (prev.fish || []).filter(f => f.stage === 'adult').length },
      }));
    }
    if (tab === 'achieve') {
      setGame(prev => ({
        ...prev,
        player: { ...prev.player, seenAchCount: (prev.player.achievements || []).length },
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps — setGame is stable

  const [showMoreDrawer, setShowMoreDrawer] = useState(false);

  const PRIMARY_TAB_LIST = [
    ['tank',       '🐠', 'Tank'],
    ['shop',       '🏪', 'Shop'],
    ['breed',      '🧬', 'Breed'],
    ['challenges', '🎯', 'Goals'],
  ];
  const SECONDARY_TAB_LIST = [
    ['fishdex',  '📖', 'Fishdex'],
    ['magic',    '🔮', 'Magic'],
    ['decor',    '🎨', 'Decor'],
    ['autopsy',  '🔬', 'Autopsy'],
    ['achieve',  '🏆', 'Awards'],
  ];
  // Keep TAB_LIST for content rendering (all 9 tabs)
  const TAB_LIST = [...PRIMARY_TAB_LIST, ...SECONDARY_TAB_LIST];
  const isSecondaryActive = SECONDARY_TAB_LIST.some(([t]) => t === activeTab);
  // Pill: positions 0–3 for primary tabs, position 4 for "More" (when secondary active)
  const pillIdx = isSecondaryActive ? 4 : PRIMARY_TAB_LIST.findIndex(([t]) => t === activeTab);
  const VISIBLE_TAB_COUNT = 5; // 4 primary + More

  // Badge counts — hoisted here so they are computed once per render,
  // not once per tab inside TAB_LIST.map.
  const fishdexCount   = (game.player.fishdex       || []).length;
  const magicCount     = (game.player.magicFishFound || []).length;
  const autopsyCount   = (game.player.autopsies      || []).length;
  const challengeDone  = (game.dailyChallenges?.challenges || []).filter(c => c.completed).length;
  const challengeTotal = (game.dailyChallenges?.challenges || []).length;

  return (
    <div className="app">
      <ToastManager />

      <div className="coin-delta-portal">
        {coinDeltas.map(({ id, diff }) => (
          <span key={id} className={`coin-delta coin-delta--${diff > 0 ? 'up' : 'down'}`}>
            {diff > 0 ? '+' : ''}{diff.toLocaleString()}
          </span>
        ))}
      </div>

      {showOffline && game.offlineSummary && (
        <OfflineSummary summary={game.offlineSummary} onDismiss={() => setShowOffline(false)} />
      )}

      <HUD
        player={game.player}
        shop={game.shop}
        tanks={game.tanks}
        activeTank={activeTank}
        selectedFishTankId={selectedFish?.tankId}
        fish={game.fish}
        onBuyFood={() => buySupply('food', 10, 10, activeTank?.id)}
        onTreatWater={treatWater}
        onToggleAutoFeed={toggleAutoFeed}
        onUseHeater={useHeater}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />

      <TankTabs
        tanks={game.tanks}
        activeTankId={activeTank?.id}
        onSelectTank={setActiveTankId}
        onUnlockTank={unlockTank}
        canUnlock={TANK_UNLOCK[game.tanks.length]}
        playerCoins={game.player.coins}
        fish={game.fish}
        onRename={renameTank}
      />

      {activeTank && (activeTank.supplies?.food ?? 0) <= 5 && (
        <div className="low-supply-banner">
          ⚠️ Low food supply in <strong>{activeTank.name}</strong> — only {activeTank.supplies?.food ?? 0} left!{' '}
          <button className="low-supply-banner__btn" onClick={() => buySupply('food', 10, 10, activeTank.id)}>
            Buy food (+10)
          </button>
        </div>
      )}

      <nav className="tab-bar" style={{ '--tab-count': VISIBLE_TAB_COUNT }}>
        <div className="tab-pill" style={{ '--pill-idx': pillIdx, '--pill-total': VISIBLE_TAB_COUNT }} />
        {PRIMARY_TAB_LIST.map(([tab, icon, label]) => {
          let badge = null;
          if (tab === 'shop' && newShopFishCount > 0) badge = (
            <span className="tab-new-badge tab-new-badge--standalone">NEW</span>
          );
          if (tab === 'challenges') badge = (
            <span className={`tab-dot ${challengeDone === challengeTotal && challengeTotal > 0 ? 'tab-dot--gold' : ''}`}>
              {challengeDone}/{challengeTotal}
            </span>
          );
          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { handleTabChange(tab); setShowMoreDrawer(false); }}
            >
              <span className="tab-btn-icon">{icon}</span>
              <span className="tab-btn-label">{label}</span>
              {badge}
            </button>
          );
        })}
        {/* ⋯ More — collapses 5 secondary tabs */}
        <div className="tab-btn--more-wrapper">
          <button
            className={`tab-btn tab-btn--more ${isSecondaryActive ? 'active' : ''} ${showMoreDrawer ? 'tab-btn--more-open' : ''}`}
            onClick={() => setShowMoreDrawer(v => !v)}
          >
            <span className="tab-btn-icon">{isSecondaryActive ? TAB_LIST.find(([t]) => t === activeTab)?.[1] : '⋯'}</span>
            <span className="tab-btn-label">{isSecondaryActive ? TAB_LIST.find(([t]) => t === activeTab)?.[2] : 'More'}</span>
            {(newFishdexCount > 0 || newAchCount > 0 || autopsyCount > 0) && !isSecondaryActive && (
              <span className="tab-dot tab-dot--warn">!</span>
            )}
          </button>

          {showMoreDrawer && (
            <>
              {/* full-screen backdrop to close on outside tap */}
              <div className="more-drawer-backdrop" onClick={() => setShowMoreDrawer(false)} />
              <div className="more-drawer">
                {SECONDARY_TAB_LIST.map(([tab, icon, label]) => {
                  let badge = null;
                  if (tab === 'fishdex') badge = (
                    <span className="tab-dot">
                      {fishdexCount}
                      {newFishdexCount > 0 && <span className="tab-new-badge">NEW</span>}
                    </span>
                  );
                  if (tab === 'magic')   badge = <span className="tab-dot tab-dot--magic">{magicCount}/7</span>;
                  if (tab === 'autopsy' && autopsyCount > 0) badge = <span className="tab-dot tab-dot--warn">{autopsyCount}</span>;
                  if (tab === 'achieve' && newAchCount > 0)  badge = <span className="tab-dot tab-dot--gold">{newAchCount}</span>;
                  return (
                    <button
                      key={tab}
                      className={`more-drawer-item ${activeTab === tab ? 'active' : ''}`}
                      onClick={() => { handleTabChange(tab); setShowMoreDrawer(false); }}
                    >
                      <span className="more-drawer-icon">{icon}</span>
                      <span className="more-drawer-label">{label}</span>
                      {badge}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </nav>

      <main className="main-layout">
        {activeTab === 'tank' && (
          <>
            {game.tanks.length > 1
              ? <AquariumOverview tanks={game.tanks} fish={game.fish} activeTankId={activeTank?.id} onSelectTank={setActiveTankId} />
              : <div className="aquarium-overview aquarium-overview--teaser">
                  <div className="aquarium-overview-title">🌊 Aquarium Overview</div>
                  <div className="overview-unlock-cta">
                    <span>🔓 Unlock a second tank to manage multiple habitats</span>
                    <button className="btn btn-sm" onClick={() => setActiveTab('shop')}>Tank Expansion →</button>
                  </div>
                </div>
            }
            <div className="tank-col">
              <TankView
                fish={tankFish}
                selectedFishId={selectedFishId}
                onSelectFish={setSelectedFishId}
                waterQuality={activeTank?.waterQuality ?? 100}
                tank={activeTank}
                listedFishIds={game.shop.listedFish || []}
              />
            </div>
            <div className="side-col">
              <FishPanel
                fish={selectedFish}
                onFeed={feedFish}
                onSell={toggleSellFish}
                onMedicine={useMedicine}
                isListed={isListed}
                coins={game.player.coins}
                isFirstRun={(game.player.fishdex || []).length === 0}
                foodStock={
                  // Use the fish's own tank — not activeTank — so counts are correct
                  // when a fish from a non-active tank is selected.
                  (game.tanks.find(t => t.id === selectedFish?.tankId) ?? activeTank)?.supplies?.food ?? 0
                }
                medicineStock={(() => {
                  const fishTank = game.tanks.find(t => t.id === selectedFish?.tankId) ?? activeTank;
                  return selectedFish?.disease === 'bloat'  ? (fishTank?.supplies?.digestiveRemedy ?? 0)
                       : selectedFish?.disease === 'velvet' ? (fishTank?.supplies?.antiparasitic   ?? 0)
                       :                                      (fishTank?.supplies?.antibiotic       ?? 0);
                })()}
                tanks={game.tanks}
                onMoveFish={moveFishToTank}
              />
              <LogPanel log={game.log} />
            </div>
          </>
        )}
        {activeTab === 'challenges' && (
          <DailyChallengesPanel dailyChallenges={game.dailyChallenges} streak={game.player.challengeStreak || 0} />
        )}
        {activeTab === 'shop' && (
          <Shop
            game={game}
            activeTank={activeTank}
            onToggleSell={toggleSellFish}
            onSetPrice={setFishPrice}
            onBuyUpgrade={buyUpgrade}
            onBuySupply={(k, c, a) => buySupply(k, c, a, activeTank?.id)}
            onBuyFish={buyFish}
            onBuyRareItem={buyRareMarketItem}
          />
        )}
        {activeTab === 'breed' && (
          <BreedingLab
            fish={game.fish}
            breedingTank={game.breedingTank}
            onSelectForBreeding={selectForBreeding}
            onCollectEgg={collectEgg}
            onCancelBreeding={cancelBreeding}
          />
        )}
        {activeTab === 'fishdex' && (
          <Fishdex
            fishdex={game.player.fishdex || []}
            onGenerateLore={handleGenerateLore}
            generatingLoreFor={generatingLoreFor}
            aiError={aiError}
            onClearAiError={() => setAiError(null)}
          />
        )}
        {activeTab === 'achieve' && (
          <Achievements achievements={game.player.achievements || []} player={game.player} />
        )}
        {activeTab === 'magic' && (
          <MagicFishPanel magicFishFound={game.player.magicFishFound || []} />
        )}
        {activeTab === 'decor' && (
          <DecorationPanel
            game={game}
            activeTank={activeTank}
            onBuyDecor={buyDecoration}
            onPlaceDecor={placeDecoration}
            onRemoveDecor={removeDecoration}
            unlockedDecorations={game.player.unlockedDecorations || []}
            onClaimUnlockedDecor={claimUnlockedDecoration}
          />
        )}
        {activeTab === 'autopsy' && (
          <FishAutopsyPanel autopsies={game.player.autopsies || []} />
        )}
      </main>

      {showApiSetup && <ApiKeyModal onClose={() => setShowApiSetup(false)} />}

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={() => { setShowResetConfirm(false); resetGame(); }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {(game.player.magicFishFound || []).length === 7 && showWinModal && (
        <MagicWinModal
          totalReward={MAGIC_FISH.reduce((s, m) => s + m.reward, 0)}
          onDismiss={() => setShowWinModal(false)}
        />
      )}

      <footer className="app-footer">
        <button className="btn btn-sm btn-danger" onClick={() => setShowResetConfirm(true)}>🔄 Reset</button>
        <button className="btn btn-sm" onClick={handleExportSave} title="Download your save as a JSON file">💾 Export</button>
        <label className="btn btn-sm" title="Load a previously exported save file" style={{ cursor: 'pointer' }}>
          📂 Import
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportSave} />
        </label>
        <span className="footer-tip">Auto-saves every 30s</span>
        <button className="btn btn-sm" onClick={() => setShowApiSetup(true)} title="Configure Anthropic API key for AI fish names">
          🤖 AI Key {getApiKey() ? '✅' : '⚠️'}
        </button>
      </footer>
    </div>
  );
}

// ── Aquarium Overview Panel ───────────────────────────────────
function AquariumOverview({ tanks, fish, activeTankId, onSelectTank }) {
  return (
    <div className="aquarium-overview">
      <div className="aquarium-overview-title">🌊 Aquarium Overview</div>
      <div className="aquarium-overview-grid">
        {tanks.map(tank => {
          const tankFish  = fish.filter(f => f.tankId === tank.id);
          const sick      = tankFish.filter(f => f.disease).length;
          const adults    = tankFish.filter(f => f.stage === 'adult').length;
          const eggs      = tankFish.filter(f => f.stage === 'egg').length;
          const juveniles = tankFish.filter(f => f.stage === 'juvenile').length;
          const wq        = Math.round(tank.waterQuality ?? 100);
          const hap       = Math.round(tank.happiness ?? 100);
          const wqColor   = wq  > 60 ? '#7ec8a0' : wq  > 30 ? '#f0c040' : '#ff7070';
          const hapColor  = hap > 60 ? '#7ec8a0' : hap > 30 ? '#f0c040' : '#ff7070';
          const isActive  = tank.id === activeTankId;
          return (
            <div
              key={tank.id}
              className={`overview-card ${isActive ? 'overview-card--active' : ''}`}
              onClick={() => onSelectTank(tank.id)}
            >
              <div className="overview-card-name">
                {tank.name}{sick > 0 && <span className="overview-alert"> 🚨{sick}</span>}
              </div>
              <div className="overview-card-counts">
                <span title="Adults">🐟{adults}</span>
                {juveniles > 0 && <span title="Juveniles">🐠{juveniles}</span>}
                {eggs > 0 && <span title="Eggs">🥚{eggs}</span>}
                <span className="overview-capacity">/{tank.capacity}</span>
              </div>
              <div className="overview-bars">
                <div className="overview-bar-row">
                  <span className="overview-bar-label">💧</span>
                  <div className="overview-bar-track"><div className="overview-bar-fill" style={{ width: `${wq}%`, background: wqColor }} /></div>
                  <span className="overview-bar-val">{wq}%</span>
                </div>
                <div className="overview-bar-row">
                  <span className="overview-bar-label">😊</span>
                  <div className="overview-bar-track"><div className="overview-bar-fill" style={{ width: `${hap}%`, background: hapColor }} /></div>
                  <span className="overview-bar-val">{hap}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Daily Challenges Panel ────────────────────────────────────
function DailyChallengesPanel({ dailyChallenges, streak = 0 }) {
  const challenges = dailyChallenges?.challenges || [];
  const msUntilReset = (() => {
    const now = Date.now();
    const ms  = (Math.floor(now / 86_400_000) + 1) * 86_400_000 - now;
    return `${Math.floor(ms / 3_600_000)}h ${Math.floor((ms % 3_600_000) / 60_000)}m`;
  })();
  return (
    <div className="challenges-panel">
      <div className="challenges-header">
        <div>
          <h2 className="challenges-title">🎯 Daily Challenges</h2>
          <p className="challenges-subtitle">
            Complete all 3 for bonus coins. Resets in {msUntilReset}.
            {streak > 0 && (
              <span className="challenges-mult">
                {' '}×{Math.min(2, 1 + streak * 0.1).toFixed(1)} streak bonus active
              </span>
            )}
          </p>
        </div>
        {streak > 0 && (
          <div className="challenges-streak" title={`${streak} day streak — keep it going!`}>
            <span className="challenges-streak-fire">🔥</span>
            <span className="challenges-streak-count">{streak}</span>
            <span className="challenges-streak-label">day{streak !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
      <div className="challenges-list">
        {challenges.map((c, i) => {
          const pct = Math.min(100, Math.round((c.progress / c.goal) * 100));
          return (
            <div key={i} className={`challenge-card ${c.completed ? 'challenge-card--done' : ''}`}>
              <div className="challenge-top">
                <span className="challenge-emoji">{c.emoji}</span>
                <div className="challenge-info">
                  <div className="challenge-desc">{c.desc}</div>
                  <div className="challenge-progress-text">{c.completed ? '✅ Complete!' : `${c.progress} / ${c.goal}`}</div>
                </div>
                <div className="challenge-reward">
                  +🪹{streak > 0 ? Math.round(c.reward * Math.min(2, 1 + streak * 0.1)) : c.reward}
                  {streak > 0 && <span className="challenge-reward-base"> (base 🪹{c.reward})</span>}
                </div>
              </div>
              <div className="challenge-bar-track">
                <div className="challenge-bar-fill" style={{ width: `${pct}%`, background: c.completed ? '#7ec8a0' : '#6ab0de' }} />
              </div>
            </div>
          );
        })}
        {challenges.length === 0 && (
          <div className="challenges-empty">No challenges loaded yet — they'll appear on next tick!</div>
        )}
      </div>
      {challenges.length > 0 && challenges.every(c => c.completed) && (
        <div className="challenges-complete-banner">🎉 All challenges complete! Come back tomorrow for new ones.</div>
      )}
    </div>
  );
}

// ── API Key Setup Modal ───────────────────────────────────────
function ApiKeyModal({ onClose }) {
  const [val, setVal]     = useState(getApiKey());
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setApiKey(val.trim()); setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 900); };
  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div className="win-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="win-modal-title" style={{ fontSize: '1.3rem' }}>🤖 AI Fish Naming</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '8px 0 16px' }}>
          Paste your Anthropic API key to unlock AI-generated fish names and lore.
          Your key is stored only in this browser (localStorage) and never sent anywhere except Anthropic's API.
        </p>
        <input
          type="password" placeholder="sk-ant-..." value={val} onChange={e => setVal(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--panel-border)', background: 'var(--ocean-mid)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }}
          onKeyDown={e => e.key === 'Enter' && handleSave()} autoFocus
        />
        {val && !val.startsWith('sk-ant-') && (
          <p style={{ color: '#f5a623', fontSize: '0.8rem', margin: '6px 0 0' }}>⚠️ Anthropic keys usually start with <code>sk-ant-</code></p>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          {getApiKey() && <button className="btn btn-sm btn-danger" onClick={() => { setApiKey(''); setVal(''); }}>Clear Key</button>}
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={!val.trim()}>{saved ? '✅ Saved!' : 'Save Key'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Tank selector bar ─────────────────────────────────────────
function TankTabs({ tanks, activeTankId, onSelectTank, onUnlockTank, canUnlock, playerCoins, fish, onRename }) {
  const [unlocking, setUnlocking]   = useState(false);
  const [unlockType, setUnlockType] = useState('display');
  const [editingId, setEditingId]   = useState(null);
  const [editName, setEditName]     = useState('');
  return (
    <div className="tank-tab-bar">
      {tanks.map(tank => {
        const count    = fish.filter(f => f.tankId === tank.id).length;
        const pct      = Math.round((count / tank.capacity) * 100);
        const isActive = tank.id === activeTankId;
        const typeInfo = TANK_TYPES[tank.type] || TANK_TYPES.display;
        return (
          <div key={tank.id} className={`tank-tab ${isActive ? 'active' : ''}`} onClick={() => { onSelectTank(tank.id); setEditingId(null); }}>
            <span className="tank-tab-emoji">{typeInfo.emoji}</span>
            <div className="tank-tab-arc" title={`${count}/${tank.capacity} fish`}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
                <circle cx="14" cy="14" r="10" fill="none"
                  stroke={isActive ? '#d4a830' : pct > 80 ? '#ff5566' : pct > 50 ? '#f5c542' : '#3ddba0'}
                  strokeWidth="3" strokeDasharray={`${(pct / 100) * 62.8} 62.8`} strokeDashoffset="15.7" strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <text x="14" y="17.5" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.85">{count}</text>
              </svg>
            </div>
            {editingId === tank.id ? (
              <input className="tank-name-input" value={editName} autoFocus
                onChange={e => setEditName(e.target.value)}
                onBlur={() => { onRename(tank.id, editName || tank.name); setEditingId(null); }}
                onKeyDown={e => { if (e.key === 'Enter') { onRename(tank.id, editName || tank.name); setEditingId(null); } e.stopPropagation(); }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="tank-tab-name" onDoubleClick={e => { e.stopPropagation(); setEditingId(tank.id); setEditName(tank.name); }} title="Double-click to rename">{tank.name}</span>
            )}
          </div>
        );
      })}
      {canUnlock && (
        <div className="tank-tab tank-tab-unlock">
          {!unlocking ? (
            <button className="btn btn-sm btn-unlock" onClick={() => setUnlocking(true)}>+ Unlock Tank (🪙{canUnlock.cost})</button>
          ) : (
            <div className="tank-unlock-picker" onClick={e => e.stopPropagation()}>
              <select className="tank-type-select" value={unlockType} onChange={e => setUnlockType(e.target.value)}>
                {Object.entries(TANK_TYPES).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label} — {v.desc}</option>)}
              </select>
              <button className="btn btn-sm btn-primary" disabled={playerCoins < canUnlock.cost} onClick={() => { onUnlockTank(unlockType); setUnlocking(false); }}>Unlock for 🪙{canUnlock.cost}</button>
              <button className="btn btn-sm" onClick={() => setUnlocking(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Reset Confirmation Modal ──────────────────────────────────
function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="win-modal-overlay" onClick={onCancel}>
      <div className="win-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
        <div className="win-modal-title" style={{ fontSize: '1.3rem' }}>🔄 Reset Game?</div>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.88rem', margin: '8px 0 20px' }}>
          All progress will be permanently lost. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button className="btn btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-sm btn-danger" onClick={onConfirm}>Yes, Reset Everything</button>
        </div>
      </div>
    </div>
  );
}

// ── Magic Fish Win Modal ──────────────────────────────────────
function MagicWinModal({ totalReward, onDismiss }) {
  return (
    <div className="win-modal-overlay" onClick={onDismiss}>
      <div className="win-modal" onClick={e => e.stopPropagation()}>
        <div className="win-modal-stars">
          {['✨','🌟','✨','⭐','🌟','✨','⭐'].map((s, i) => <span key={i} className="win-star" style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>)}
        </div>
        <div className="win-modal-title">🔮 Legend of the Deep 🔮</div>
        <div className="win-modal-subtitle">You have discovered all 7 Magic Fish</div>
        <div className="win-modal-fish-row">
          {['🐡','🐠','🐟','🦈','🐙','🦑','🦐'].map((e, i) => <span key={i} className="win-fish-icon" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>)}
        </div>
        <p className="win-modal-lore">
          Your aquarium has become the stuff of legend. Sailors speak of it in hushed tones.
          Scholars have written papers about what you have accomplished.
          The seven wonders of the deep — all in one place. All yours.
        </p>
        <div className="win-modal-reward">Total reward collected: <strong>🪙 {totalReward.toLocaleString()}</strong></div>
        <div className="win-modal-unlocks">
          <div className="win-unlock-item">🎨 <strong>Legend Throne</strong> decoration unlocked — check your Decor tab!</div>
          <div className="win-unlock-item">🐉 <strong>Legend Fish</strong> species unlocked in the Fishdex!</div>
          <div className="win-unlock-item">🏆 <strong>+🪙500</strong> achievement bonus awarded!</div>
        </div>
        <div className="win-modal-actions">
          <button className="btn btn-primary win-continue-btn" onClick={onDismiss}>✨ Continue Playing</button>
        </div>
        <div className="win-modal-hint">The ocean has more secrets. Keep breeding.</div>
      </div>
    </div>
  );
}
