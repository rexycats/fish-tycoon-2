import React, { useState, useCallback, useRef, memo } from 'react';
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

import { useGameStore } from './store/gameStore.js';
import { useFishSelection } from './hooks/useFishSelection.js';
import { useCoinDeltas }    from './hooks/useCoinDeltas.js';

// ============================================================
// Memoized tab content components — only re-render when their
// specific props change, not on every tick.
// ============================================================
const MemoTankView       = memo(TankView);
const MemoFishPanel      = memo(FishPanel);
const MemoHUD            = memo(HUD);
const MemoLogPanel       = memo(LogPanel);
const MemoShop           = memo(Shop);
const MemoBreedingLab    = memo(BreedingLab);
const MemoFishdex        = memo(Fishdex);
const MemoAchievements   = memo(Achievements);
const MemoMagicFishPanel = memo(MagicFishPanel);
const MemoDecorationPanel = memo(DecorationPanel);
const MemoFishAutopsy    = memo(FishAutopsyPanel);

export default function App() {
  // ── Store selectors — each subscribes to its own slice ─────
  const player          = useGameStore(s => s.player);
  const fish            = useGameStore(s => s.fish);
  const tanks           = useGameStore(s => s.tanks);
  const shop            = useGameStore(s => s.shop);
  const breedingTank    = useGameStore(s => s.breedingTank);
  const log             = useGameStore(s => s.log);
  const dailyChallenges = useGameStore(s => s.dailyChallenges);
  const showOffline     = useGameStore(s => s.showOffline);
  const offlineSummary  = useGameStore(s => s.offlineSummary);
  const soundOn         = useGameStore(s => s.soundOn);

  // ── Store actions (stable references — no useCallback needed) ──
  const dismissOffline  = useGameStore(s => s.dismissOffline);
  const toggleSound     = useGameStore(s => s.toggleSound);
  const feedFish        = useGameStore(s => s.feedFish);
  const useMedicine     = useGameStore(s => s.useMedicine);
  const moveFishToTank  = useGameStore(s => s.moveFishToTank);
  const treatWater      = useGameStore(s => s.treatWater);
  const toggleAutoFeed  = useGameStore(s => s.toggleAutoFeed);
  const useHeater       = useGameStore(s => s.useHeater);
  const unlockTank      = useGameStore(s => s.unlockTank);
  const renameTank      = useGameStore(s => s.renameTank);
  const toggleSellFish  = useGameStore(s => s.toggleSellFish);
  const setFishPrice    = useGameStore(s => s.setFishPrice);
  const buySupply       = useGameStore(s => s.buySupply);
  const buyFish         = useGameStore(s => s.buyFish);
  const buyUpgrade      = useGameStore(s => s.buyUpgrade);
  const buyRareMarketItem = useGameStore(s => s.buyRareMarketItem);
  const buyDecoration   = useGameStore(s => s.buyDecoration);
  const claimUnlockedDecoration = useGameStore(s => s.claimUnlockedDecoration);
  const placeDecoration = useGameStore(s => s.placeDecoration);
  const removeDecoration = useGameStore(s => s.removeDecoration);
  const buyTheme        = useGameStore(s => s.buyTheme);
  const applyTheme      = useGameStore(s => s.applyTheme);
  const selectForBreeding = useGameStore(s => s.selectForBreeding);
  const cancelBreeding  = useGameStore(s => s.cancelBreeding);
  const collectEgg      = useGameStore(s => s.collectEgg);
  const resetGame       = useGameStore(s => s.resetGame);
  const handleExportSave = useGameStore(s => s.handleExportSave);
  const handleImportSave = useGameStore(s => s.handleImportSave);

  // ── Fish/tank selection (local UI state) ───────────────────
  const {
    selectedFishId, setSelectedFishId,
    activeTankId,   setActiveTankId,
    activeTank,     tankFish,
    selectedFish,   isListed,
    showWinModal,   setShowWinModal,
    generatingLoreFor,
    aiError,        setAiError,
    handleGenerateLore,
  } = useFishSelection();

  // ── Floating coin deltas ───────────────────────────────────
  const coinDeltas = useCoinDeltas();

  // ── Tab + badge state ──────────────────────────────────────
  const [activeTab, setActiveTab]         = useState('tank');
  const [showApiSetup, setShowApiSetup]   = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentFishdexCount  = (player.fishdex || []).length;
  const currentShopFishCount = fish.filter(f => f.stage === 'adult').length;
  const newFishdexCount      = Math.max(0, currentFishdexCount  - (player.seenFishdexCount  || 0));
  const newShopFishCount     = Math.max(0, currentShopFishCount - (player.seenShopFishCount || 0));
  const currentAchCount      = (player.achievements || []).length;
  const newAchCount          = Math.max(0, currentAchCount - (player.seenAchCount || 0));

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'fishdex') {
      useGameStore.setState(state => {
        state.player.seenFishdexCount = (state.player.fishdex || []).length;
      });
    }
    if (tab === 'shop') {
      useGameStore.setState(state => {
        state.player.seenShopFishCount = state.fish?.filter(f => f.stage === 'adult').length || 0;
      });
    }
    if (tab === 'achieve') {
      useGameStore.setState(state => {
        state.player.seenAchCount = (state.player.achievements || []).length;
      });
    }
  }, []);

  const tabBarRef = useRef(null);

  const TAB_LIST = [
    ['tank',       '🐠', 'Tank'],
    ['shop',       '🏪', 'Shop'],
    ['breed',      '🧬', 'Breed'],
    ['challenges', '🎯', 'Goals'],
    ['fishdex',    '📖', 'Fishdex'],
    ['magic',      '🔮', 'Magic'],
    ['decor',      '🎨', 'Decor'],
    ['autopsy',    '🔬', 'Autopsy'],
    ['achieve',    '🏆', 'Awards'],
  ];
  const VISIBLE_TAB_COUNT = TAB_LIST.length;
  const pillIdx = TAB_LIST.findIndex(([t]) => t === activeTab);

  const magicCount     = (player.magicFishFound || []).length;
  const autopsyCount   = (player.autopsies || []).length;
  const challengeDone  = (dailyChallenges?.challenges || []).filter(c => c.completed).length;
  const challengeTotal = (dailyChallenges?.challenges || []).length;

  // ── Build a game-like object for components that still expect it ──
  // This is a transitional shim. Over time, each child component should
  // subscribe to the store directly and this object goes away.
  const game = { player, fish, tanks, shop, breedingTank, log, dailyChallenges, offlineSummary };

  return (
    <div className="app">
      <ToastManager />

      <div className="coin-delta-portal">
        {coinDeltas.map(({ id, diff }) => (
          <span
            key={id}
            className={`coin-delta coin-delta--${diff > 0 ? 'up' : 'down'} coin-delta--arc`}
            style={{ '--arc-dir': diff > 0 ? '1' : '-1' }}
          >
            {diff > 0 ? '+' : ''}{diff.toLocaleString()}
          </span>
        ))}
      </div>

      {showOffline && offlineSummary && (
        <OfflineSummary summary={offlineSummary} onDismiss={dismissOffline} />
      )}

      <MemoHUD
        player={player}
        shop={shop}
        tanks={tanks}
        activeTank={activeTank}
        selectedFishTankId={selectedFish?.tankId}
        fish={fish}
        onBuyFood={() => buySupply('food', 10, 10, activeTank?.id)}
        onTreatWater={treatWater}
        onToggleAutoFeed={toggleAutoFeed}
        onUseHeater={useHeater}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />

      <TankTabs
        tanks={tanks}
        activeTankId={activeTank?.id}
        onSelectTank={setActiveTankId}
        onUnlockTank={unlockTank}
        canUnlock={TANK_UNLOCK[tanks.length]}
        playerCoins={player.coins}
        fish={fish}
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

      <nav ref={tabBarRef} className="tab-bar" style={{ '--tab-count': VISIBLE_TAB_COUNT }}>
        <div className="tab-pill" style={{ '--pill-idx': pillIdx, '--pill-total': VISIBLE_TAB_COUNT }} />
        {TAB_LIST.map(([tab, icon, label]) => {
          let badge = null;
          if (tab === 'shop' && newShopFishCount > 0) badge = (
            <span className="tab-new-badge tab-new-badge--standalone">NEW</span>
          );
          if (tab === 'challenges') badge = (
            <span className={`tab-dot ${challengeDone === challengeTotal && challengeTotal > 0 ? 'tab-dot--gold' : ''}`}>
              {challengeDone}/{challengeTotal}
            </span>
          );
          if (tab === 'fishdex' && newFishdexCount > 0) badge = (
            <span className="tab-new-badge tab-new-badge--standalone">NEW</span>
          );
          if (tab === 'magic')   badge = <span className="tab-dot tab-dot--magic">{magicCount}/7</span>;
          if (tab === 'autopsy' && autopsyCount > 0) badge = <span className="tab-dot tab-dot--warn">{autopsyCount}</span>;
          if (tab === 'achieve' && newAchCount > 0)  badge = <span className="tab-dot tab-dot--gold">{newAchCount}</span>;
          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              <span className="tab-btn-icon">{icon}</span>
              <span className="tab-btn-label">{label}</span>
              {badge}
            </button>
          );
        })}
      </nav>

      <main className="main-layout">
        {activeTab === 'tank' && (
          <>
            {tanks.length > 1
              ? <AquariumOverview tanks={tanks} fish={fish} activeTankId={activeTank?.id} onSelectTank={setActiveTankId} />
              : <div className="aquarium-overview aquarium-overview--teaser">
                  <div className="aquarium-overview-title">🌊 Aquarium Overview</div>
                  <div className="overview-unlock-cta">
                    <span>🔓 Unlock a second tank to manage multiple habitats</span>
                    <button className="btn btn-sm" onClick={() => handleTabChange('shop')}>Tank Expansion →</button>
                  </div>
                </div>
            }
            <div className="tank-col">
              <MemoTankView
                fish={tankFish}
                selectedFishId={selectedFishId}
                onSelectFish={setSelectedFishId}
                waterQuality={activeTank?.waterQuality ?? 100}
                tank={activeTank}
                listedFishIds={shop.listedFish || []}
              />
            </div>
            <div className="side-col">
              <MemoFishPanel
                fish={selectedFish}
                onFeed={feedFish}
                onSell={toggleSellFish}
                onMedicine={useMedicine}
                isListed={isListed}
                isFirstRun={(player.fishdex || []).length === 0}
                foodStock={
                  (tanks.find(t => t.id === selectedFish?.tankId) ?? activeTank)?.supplies?.food ?? 0
                }
                medicineStock={(() => {
                  const fishTank = tanks.find(t => t.id === selectedFish?.tankId) ?? activeTank;
                  return selectedFish?.disease === 'bloat'  ? (fishTank?.supplies?.digestiveRemedy ?? 0)
                       : selectedFish?.disease === 'velvet' ? (fishTank?.supplies?.antiparasitic   ?? 0)
                       :                                      (fishTank?.supplies?.antibiotic       ?? 0);
                })()}
                tanks={tanks}
                onMoveFish={moveFishToTank}
                onNavigate={handleTabChange}
              />
              <MemoLogPanel log={log} />
            </div>
          </>
        )}
        {activeTab === 'challenges' && (
          <DailyChallengesPanel dailyChallenges={dailyChallenges} streak={player.challengeStreak || 0} />
        )}
        {activeTab === 'shop' && (
          <MemoShop
            game={game}
            activeTank={activeTank}
            onToggleSell={toggleSellFish}
            onSetPrice={setFishPrice}
            onBuyUpgrade={buyUpgrade}
            onBuySupply={(k, c, a) => buySupply(k, c, a, activeTank?.id)}
            onBuyFish={buyFish}
            onBuyRareItem={buyRareMarketItem}
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'breed' && (
          <MemoBreedingLab
            fish={fish}
            breedingTank={breedingTank}
            onSelectForBreeding={selectForBreeding}
            onCollectEgg={collectEgg}
            onCancelBreeding={cancelBreeding}
            onNavigate={handleTabChange}
          />
        )}
        {activeTab === 'fishdex' && (
          <MemoFishdex
            fishdex={player.fishdex || []}
            onGenerateLore={handleGenerateLore}
            generatingLoreFor={generatingLoreFor}
            aiError={aiError}
            legendFishUnlocked={!!player.legendFishUnlocked}
          />
        )}
        {activeTab === 'achieve' && (
          <MemoAchievements achievements={player.achievements || []} player={player} onNavigate={handleTabChange} />
        )}
        {activeTab === 'magic' && (
          <MemoMagicFishPanel magicFishFound={player.magicFishFound || []} />
        )}
        {activeTab === 'decor' && (
          <MemoDecorationPanel
            game={game}
            activeTank={activeTank}
            onBuyDecor={buyDecoration}
            onPlaceDecor={placeDecoration}
            onRemoveDecor={removeDecoration}
            unlockedDecorations={player.unlockedDecorations || []}
            onClaimUnlockedDecor={claimUnlockedDecoration}
            onBuyTheme={buyTheme}
            onApplyTheme={applyTheme}
          />
        )}
        {activeTab === 'autopsy' && (
          <MemoFishAutopsy autopsies={player.autopsies || []} />
        )}
      </main>

      {showApiSetup && <ApiKeyModal onClose={() => setShowApiSetup(false)} />}

      {showResetConfirm && (
        <ResetConfirmModal
          onConfirm={() => { setShowResetConfirm(false); resetGame(); }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}

      {(player.magicFishFound || []).length === 7 && showWinModal && (
        <MagicWinModal
          totalReward={MAGIC_FISH.reduce((s, m) => s + m.reward, 0)}
          onDismiss={() => setShowWinModal(false)}
          onNavigate={handleTabChange}
        />
      )}

      <footer className="app-footer">
        <button className="btn btn-sm btn-danger" onClick={() => setShowResetConfirm(true)}>🔄 Reset</button>
        <button className="btn btn-sm" onClick={handleExportSave} title="Download your save as a JSON file">💾 Export</button>
        <label className="btn btn-sm" title="Load a previously exported save file" style={{ cursor: 'pointer' }}>
          📂 Import
          <input type="file" accept=".json" style={{ display: 'none' }} onChange={e => handleImportSave(e.target.files[0])} />
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
function MagicWinModal({ totalReward, onDismiss, onNavigate }) {
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
          <div className="win-unlock-item">
            🎨 <strong>Legend Throne</strong> decoration unlocked —{' '}
            <button className="btn btn-sm" onClick={() => { onDismiss(); onNavigate('decor'); }}>
              Open Decor tab
            </button>
          </div>
          <div className="win-unlock-item">🐉 <strong>Legend Fish</strong> species unlocked in the Fishdex!</div>
          <div className="win-unlock-item">🏆 <strong>+🪙500</strong> achievement bonus awarded!</div>
        </div>
        <div className="win-modal-actions">
          <button className="btn btn-sm" onClick={() => { onDismiss(); onNavigate('magic'); }}>🔮 View Magic Fish</button>
          <button className="btn btn-primary win-continue-btn" onClick={onDismiss}>✨ Continue Playing</button>
        </div>
        <div className="win-modal-hint">The ocean has more secrets. Keep breeding.</div>
      </div>
    </div>
  );
}
