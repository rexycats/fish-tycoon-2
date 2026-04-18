import React, { useState, useCallback, useRef, useMemo, useEffect, memo, lazy, Suspense } from 'react';
import ToastManager from './components/ToastManager.jsx';
import { MAGIC_FISH } from './data/genetics.js';
import { TANK_UNLOCK, TANK_TYPES } from './data/gameState.js';
import { getApiKey, setApiKey } from './services/aiService.js';
import { canPrestige } from './data/prestige.js';
import { startMusic, isMusicPlaying, playTabSwitch as _playTabSwitch, playClick } from './services/soundService.js';
import TankView       from './components/TankView.jsx';
import FishPanel      from './components/FishPanel.jsx';
import HUD            from './components/HUD.jsx';
import LogPanel       from './components/LogPanel.jsx';
import BreedingLab    from './components/BreedingLab.jsx';
import Shop           from './components/Shop.jsx';
import OfflineSummary from './components/OfflineSummary.jsx';
import SettingsPanel  from './components/SettingsPanel.jsx';
import Tutorial       from './components/Tutorial.jsx';
import CatchOfDayPanel from './components/CatchOfDayPanel.jsx';
import { EventPopup, HagglePopup } from './components/EventPopup.jsx';
import TitleScreen    from './components/TitleScreen.jsx';
import Credits        from './components/Credits.jsx';
import HatchReveal    from './components/HatchReveal.jsx';
import WantedBoard    from './components/WantedBoard.jsx';
import TabErrorBoundary from './components/TabErrorBoundary.jsx';
import DiscoveryCeremony from './components/DiscoveryCeremony.jsx';
import CampaignMap from './components/CampaignMap.jsx';
import ObjectiveBar from './components/ObjectiveBar.jsx';
import VictoryModal from './components/VictoryModal.jsx';
import { CAMPAIGN_LEVELS } from './data/campaign.js';
import AmenitiesPanel from './components/AmenitiesPanel.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import EquipmentPanel from './components/EquipmentPanel.jsx';
import Mentor from './components/Mentor.jsx';
import { useGamepad } from './hooks/useGamepad.js';
import NavRail from './components/NavRail.jsx';
import { IconTankPlus } from './components/icons/index.js';
import { NAV_TO_TABS } from './data/navigation.js';
const RecordsSection = lazy(() => import('./components/RecordsSection.jsx'));
const OfficeSection = lazy(() => import('./components/OfficeSection.jsx'));
import GameStatusBar from './components/GameStatusBar.jsx';
import { TUTORIAL_STEPS } from './data/tutorial.js';

import { useGameStore } from './store/gameStore.js';
import { useFishSelection } from './hooks/useFishSelection.js';
import { useCoinDeltas }    from './hooks/useCoinDeltas.js';

// Navigation sections defined in NavRail.jsx

// ============================================================
// Memoized tab content components — only re-render when their
// specific props change, not on every tick.
// ============================================================
const MemoTankView       = memo(TankView);
const MemoFishPanel      = FishPanel; // already memo'd with custom comparator
const MemoHUD            = memo(HUD);
const MemoLogPanel       = memo(LogPanel);
const MemoShop           = Shop; // already memo'd with custom comparator
const MemoBreedingLab    = memo(BreedingLab);

export default function App() {
  const [showTitle, setShowTitle] = useState(true);
  const [showCampaignMap, setShowCampaignMap] = useState(false);
  const [victoryLevelId, setVictoryLevelId] = useState(null);
  const [levelFlash, setLevelFlash] = useState(false);
  const prevLevelRef = useRef(null);

  // ── Store selectors — each subscribes to its own slice ─────
  const player          = useGameStore(s => s.player);
  const fish            = useGameStore(s => s.fish);
  const tanks           = useGameStore(s => s.tanks);
  const shop            = useGameStore(s => s.shop);
  const breedingTank    = useGameStore(s => s.breedingTank);
  const extraBays       = useGameStore(s => s.extraBays || []);
  const maxBays         = useGameStore(s => s.maxBays || 1);
  const log             = useGameStore(s => s.log);
  const dailyChallenges = useGameStore(s => s.dailyChallenges);
  const campaign        = useGameStore(s => s.campaign);
  const settings        = useGameStore(s => s.settings);
  const showOffline     = useGameStore(s => s.showOffline);
  const offlineSummary  = useGameStore(s => s.offlineSummary);
  const soundOn         = useGameStore(s => s.soundOn);
  const market          = useGameStore(s => s.market);

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
    activeTankId, setActiveTankId,
    activeTank,   tankFish,
    selectedFish, isListed,
    showWinModal, setShowWinModal,
    generatingLoreFor,
    aiError,      setAiError,
    handleGenerateLore,
  } = useFishSelection();

  // ── Floating coin deltas ───────────────────────────────────
  const coinDeltas = useCoinDeltas();

  // ── Tab + badge state ──────────────────────────────────────
  const [activeSection, setActiveSection] = useState('aquarium');
  const [showApiSetup, setShowApiSetup]   = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings]   = useState(false);
  const [showGameMenu, setShowGameMenu]   = useState(false);
  const [showLogTray, setShowLogTray]     = useState(false);
  const [photoMode, setPhotoMode]         = useState(false);
  const [hatchRevealFish, setHatchRevealFish] = useState(null);
  const [celebration, setCelebration] = useState(null);
  const [discoverySpecies, setDiscoverySpecies] = useState(null);
  const saveFlash = useGameStore(s => s._saveFlash);
  const paused = useGameStore(s => s.paused);
  const togglePause = useGameStore(s => s.togglePause);
  const renameFish = useGameStore(s => s.renameFish);
  const performPrestige = useGameStore(s => s.performPrestige);
  

  // ── Keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
      const key = e.key.toLowerCase();

      // F5 = quicksave
      if (e.key === 'F5') { e.preventDefault(); useGameStore.getState().quickSave(); return; }

      switch (key) {
        // Section navigation
        case '1': handleNavChange('aquarium'); break;
        case '2': handleNavChange('market'); break;
        case '3': handleNavChange('breeding'); break;
        case '4': handleNavChange('records'); break;
        case '5': handleNavChange('office'); break;
        // Fish actions
        case 'f': if (selectedFish) feedFish(selectedFish.id); break;
        case 'a': if (activeTank) useGameStore.getState().feedAllInTank(activeTank.id); break;
        case 's': if (selectedFish?.stage === 'adult') toggleSellFish(selectedFish.id); break;
        case 'm': if (selectedFish?.disease) useMedicine(selectedFish.id); break;
        // Game controls
        case 'l': setShowLogTray(v => !v); break;
        case ',': { const gs = useGameStore.getState(); gs.setGameSpeed(Math.max(1, (gs.gameSpeed || 1) - 1)); break; }
        case '.': { const gs = useGameStore.getState(); gs.setGameSpeed(Math.min(3, (gs.gameSpeed || 1) + 1)); break; }
        case 'p': setPhotoMode(v => !v); break;
        case ' ': e.preventDefault(); togglePause(); break;
        case 'escape':
          if (showSettings || showResetConfirm || showApiSetup) {
            setShowSettings(false); setShowResetConfirm(false); setShowApiSetup(false);
          } else if (showGameMenu) {
            setShowGameMenu(false);
            playClick();
          } else {
            setShowGameMenu(true);
            playClick();
          }
          break;
        case 'tab': {
          e.preventDefault();
          const sections = ['aquarium', 'market', 'breeding', 'records', 'office'];
          const idx2 = sections.indexOf(activeSection);
          handleNavChange(sections[(idx2 + 1) % sections.length]);
          break;
        }
      }
    };
    const suppress = (e) => e.preventDefault();
    window.addEventListener('keydown', handler);
    window.addEventListener('contextmenu', suppress);
    return () => { window.removeEventListener('keydown', handler); window.removeEventListener('contextmenu', suppress); };
  }, [selectedFish, activeTank, activeSection, tanks, showSettings, showResetConfirm, showApiSetup, showGameMenu, showLogTray]);

  // ── Level-up flash ─────────────────────────────────────
  useEffect(() => {
    if (player._levelUpPending && player._levelUpPending !== prevLevelRef.current) {
      prevLevelRef.current = player._levelUpPending;
      setLevelFlash(true);
      const t = setTimeout(() => setLevelFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [player._levelUpPending]);

  // ── Hatch reveal (gacha-style) ─────────────────────────
  useEffect(() => {
    const unsub = useGameStore.subscribe(
      s => s._pendingHatchReveal,
      (fish) => {
        if (fish) {
          setHatchRevealFish(fish);
          useGameStore.setState({ _pendingHatchReveal: null });
        }
      }
    );
    return unsub;
  }, []);

  // ── Campaign victory ──────────────────────────────────
  useEffect(() => {
    const unsub = useGameStore.subscribe(
      s => s._pendingVictory,
      (levelId) => {
        if (levelId) {
          setVictoryLevelId(levelId);
        }
      }
    );
    return unsub;
  }, []);

  // ── Milestone celebration ──────────────────────────────
  useEffect(() => {
    const unsub = useGameStore.subscribe(
      s => s._pendingCelebration,
      (data) => {
        if (data) {
          setCelebration(data);
          useGameStore.setState({ _pendingCelebration: null });
          // Auto-dismiss after 5s
          setTimeout(() => setCelebration(null), 5000);
        }
      }
    );
    return unsub;
  }, []);

  // ── Discovery ceremony ──────────────────────────────────
  useEffect(() => {
    const unsub = useGameStore.subscribe(
      s => s._pendingDiscovery,
      (species) => {
        if (species) {
          setDiscoverySpecies(species);
          useGameStore.setState({ _pendingDiscovery: null });
        }
      }
    );
    return unsub;
  }, []);

  // ── Start music on first click ─────────────────────────
  useEffect(() => {
    const start = () => { if (!isMusicPlaying()) startMusic(); document.removeEventListener('click', start); };
    document.addEventListener('click', start);
    return () => document.removeEventListener('click', start);
  }, []);

  const currentFishdexCount  = (player.fishdex || []).length;
  const currentShopFishCount = fish.filter(f => f.stage === 'adult').length;
  const newFishdexCount      = Math.max(0, currentFishdexCount  - (player.seenFishdexCount  || 0));
  const newShopFishCount     = Math.max(0, currentShopFishCount - (player.seenShopFishCount || 0));
  const currentAchCount      = (player.achievements || []).length;
  const newAchCount          = Math.max(0, currentAchCount - (player.seenAchCount || 0));

  const playTabSwitch = _playTabSwitch;
  const handleTabChange = useCallback((tab) => {
    playTabSwitch();
    // Sync section to match the tab
    for (const [section, tabs] of Object.entries(NAV_TO_TABS)) {
      if (tabs.includes(tab)) { setActiveSection(section); break; }
    }
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

  const handleNavChange = useCallback((section) => {
    if (section === 'settings') {
      setShowSettings(true);
      return;
    }
    setActiveSection(section);
    const defaultTab = NAV_TO_TABS[section]?.[0] || 'tank';
    handleTabChange(defaultTab);
  }, [handleTabChange]);

  // (Old tab bar state removed — now using NavRail)

  const magicCount     = (player.magicFishFound || []).length;
  const autopsyCount   = (player.autopsies || []).length;
  const challengeDone  = (dailyChallenges?.challenges || []).filter(c => c.completed).length;
  const tutorialStep   = player.tutorialStep ?? 0;
  const tutorialDone   = player.tutorialDone;
  const tutorialHighlight = (!tutorialDone && TUTORIAL_STEPS[tutorialStep]?.highlight) || null;
  const challengeTotal = (dailyChallenges?.challenges || []).length;

  // ── Memoized game-like object for components that still expect it ──
  // Prevents new object ref unless actual slice refs change.
  const suppliers = useGameStore(s => s.suppliers);
  const game = useMemo(
    () => ({ player, fish, tanks, shop, breedingTank, log, dailyChallenges, offlineSummary, market, suppliers }),
    [player, fish, tanks, shop, breedingTank, log, dailyChallenges, offlineSummary, market, suppliers]
  );

  // ── Loading splash ─────────────────────────────────────────
  const [showSplash, setShowSplash] = useState(true);

  // ── Gamepad / controller support ──
  useGamepad(useCallback((action) => {
    const sects = ['aquarium', 'market', 'breeding', 'records', 'office'];
    switch (action) {
      case 'start': useGameStore.getState().togglePause(); break;
      case 'select': setShowLogTray(v => !v); break;
      case 'rb': setActiveSection(prev => sects[(sects.indexOf(prev) + 1) % sects.length]); break;
      case 'lb': setActiveSection(prev => sects[(sects.indexOf(prev) - 1 + sects.length) % sects.length]); break;
      case 'rt': useGameStore.getState().setGameSpeed(Math.min(3, (useGameStore.getState().gameSpeed || 1) + 1)); break;
      case 'lt': useGameStore.getState().setGameSpeed(Math.max(1, (useGameStore.getState().gameSpeed || 1) - 1)); break;
      case 'b': setShowGameMenu(v => !v); break;
    }
  }, []));
  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, [showSplash]);

  if (showSplash) {
    return (
      <div className="loading-splash">
        <div className="loading-splash-inner">
          <div className="loading-splash-title">FISH TYCOON 2</div>
          <div className="loading-splash-bar">
            <div className="loading-splash-fill" />
          </div>
          <div className="loading-splash-sub">Loading</div>
        </div>
      </div>
    );
  }

  // ── Title screen ──────────────────────────────────────────
  if (showTitle) {
    return <TitleScreen onStart={(mode) => {
      if (mode === 'campaign') {
        setShowTitle(false);
        setShowCampaignMap(true);
        return;
      }
      if (mode === 'sandbox') {
        const prevCompleted = useGameStore.getState().campaign?.completedLevels || {};
        useGameStore.getState().resetGame();
        useGameStore.setState({ campaign: { mode: 'sandbox', activeLevelId: null, completedLevels: prevCompleted, levelCompleted: false } });
        setShowTitle(false);
        return;
      }
      // 'continue' — just resume
      // If campaign mode but no active level, go to campaign map
      const cs = useGameStore.getState().campaign;
      if (cs?.mode === 'campaign' && !cs.activeLevelId) {
        setShowTitle(false);
        setShowCampaignMap(true);
        return;
      }
      setShowTitle(false);
    }} />;
  }

  // ── Campaign map ──────────────────────────────────────────
  if (showCampaignMap) {
    return <CampaignMap
      onStartLevel={(levelId) => {
        useGameStore.getState().startCampaignLevel(levelId);
        setShowCampaignMap(false);
      }}
      onBack={() => {
        setShowCampaignMap(false);
        setShowTitle(true);
      }}
    />;
  }

  return (
    <div className={`app${photoMode ? ' app--photo' : ''}${settings?.largeText ? ' app--text-lg' : ''}${settings?.highContrast ? ' app--high-contrast' : ''}`}>
      <ToastManager />

      <div className="coin-delta-portal">
        {coinDeltas.map(({ id, diff, tier }) => (
          <span
            key={id}
            className={`coin-delta coin-delta--${diff > 0 ? 'up' : 'down'} coin-delta--arc coin-delta--${tier || 'small'}`}
            style={{ '--arc-dir': diff > 0 ? '1' : '-1' }}
          >
            {diff > 0 ? '<span className="coin-icon"/> +' : ''}{diff.toLocaleString()}
          </span>
        ))}
      </div>
      {coinDeltas.some(d => d.tier === 'mega') && <div className="coin-vignette" key={`vig-${coinDeltas[0]?.id}`} />}

      {showOffline && offlineSummary && (
        <OfflineSummary summary={offlineSummary} onDismiss={dismissOffline} />
      )}

      <div className="sim-shell">
      <NavRail
        active={activeSection}
        onNavigate={handleNavChange}
        badges={{
          market: newShopFishCount > 0 ? 'NEW' : null,
          records: (newFishdexCount > 0 || newAchCount > 0) ? '!' : null,
          office: (challengeDone > 0 && challengeDone === challengeTotal) ? '✓' : null,
        }}
        disabledSections={(() => {
          if (campaign?.mode !== 'campaign' || !campaign.activeLevelId) return {};
          const lvl = CAMPAIGN_LEVELS.find(l => l.id === campaign.activeLevelId);
          const c = lvl?.constraints || {};
          return { breeding: c.breedingDisabled || false };
        })()}
      />

      <div className="sim-main">

      <main className={`sim-viewport ${activeSection === 'aquarium' ? 'sim-viewport--aquarium' : ''}`}>
        {/* ── Aquarium section ─────────────────────────── */}
        {activeSection === 'aquarium' && (
          <>
            {/* HUD overlays the tank */}
            <div className="aquarium-hud-overlay">
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
                prestigeLevel={player.prestigeLevel || 0}
              />
            </div>
            {activeTank && (activeTank.supplies?.food ?? 0) <= 5 && (
              <div className="aquarium-alert-bar">
                Low food in {activeTank.name} — {activeTank.supplies?.food ?? 0} left
                <button className="aquarium-alert-btn" onClick={() => buySupply('food', 10, 10, activeTank.id)}>
                  Buy food
                </button>
              </div>
            )}
            <div className="sim-aquarium">
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
              {selectedFish && (
              <div className="sim-inspector sim-inspector--open">
                <button className="inspector-close-btn" onClick={() => setSelectedFishId(null)}>✕</button>
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
              </div>
              )}
            </div>
          </>
        )}

        {/* ── Compact status bar for non-aquarium sections ── */}
        {activeSection !== 'aquarium' && (
          <div className="sim-status-bar">
            <span className="sim-status-coins">{player.coins?.toLocaleString() || 0} coins</span>
            <span className="sim-status-sep" />
            <span className="sim-status-fish">{fish.length} fish</span>
            <span className="sim-status-sep" />
            <span className="sim-status-label">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
          </div>
        )}

        {/* ── Market section ──────────────────────────── */}
        {activeSection === 'market' && (
          <TabErrorBoundary name="market"><div className="tab-content-scroll">
            <MemoShop
              game={game}
              activeTank={activeTank}
              onToggleSell={toggleSellFish}
              onSetPrice={setFishPrice}
              onBuyUpgrade={buyUpgrade}
              onBuySupply={(k, c, a) => buySupply(k, c, a, activeTank?.id)}
              onBuyFish={(cost, rarity, speciesKey) => buyFish(cost, rarity, speciesKey, activeTank?.id)}
              onBuyRareItem={buyRareMarketItem}
              onNavigate={handleTabChange}
            />
            <WantedBoard />
            <CatchOfDayPanel />
            <AmenitiesPanel />
            {activeTank && <EquipmentPanel tankId={activeTank.id} />}
          </div></TabErrorBoundary>
        )}

        {/* ── Breeding Lab section ────────────────────── */}
        {activeSection === 'breeding' && (
          <TabErrorBoundary name="breed"><div className="tab-content-scroll">
            <MemoBreedingLab
              fish={fish}
              breedingTank={breedingTank}
              extraBays={extraBays}
              maxBays={maxBays}
              onSelectForBreeding={selectForBreeding}
              onCollectEgg={collectEgg}
              onCancelBreeding={cancelBreeding}
              onNavigate={handleTabChange}
            />
          </div></TabErrorBoundary>
        )}

        {/* ── Records section ───────────────────────── */}
        {activeSection === 'records' && (
          <Suspense fallback={<div className="loading-section">Loading...</div>}>
            <RecordsSection
              onNavigate={handleTabChange}
              generatingLoreFor={generatingLoreFor}
              aiError={aiError}
              onGenerateLore={handleGenerateLore}
            />
          </Suspense>
        )}

        {/* ── Office section ────────────────────────── */}
        {activeSection === 'office' && (
          <Suspense fallback={<div className="loading-section">Loading...</div>}>
            <OfficeSection />
          </Suspense>
        )}
      </main>

      {/* ── Collapsible log tray ─────────────────────── */}
      <div className={`sim-log ${showLogTray ? 'sim-log--open' : ''}`}>
        <MemoLogPanel log={log} />
      </div>

      {/* ── Game status bar ───────────────────────────── */}
      <GameStatusBar paused={paused} onTogglePause={togglePause} showLog={showLogTray} onToggleLog={() => setShowLogTray(v => !v)} />

      </div>{/* /sim-main */}
      </div>{/* /sim-shell */}

      {/* Level-up flash */}
      {levelFlash && <div className="level-up-flash" />}

      {/* Hatch reveal overlay */}
      {hatchRevealFish && (
        <HatchReveal
          fish={hatchRevealFish}
          onComplete={() => setHatchRevealFish(null)}
        />
      )}

      {/* Discovery ceremony overlay */}
      {discoverySpecies && (
        <DiscoveryCeremony
          species={discoverySpecies}
          onDismiss={() => setDiscoverySpecies(null)}
        />
      )}

      {/* Milestone celebration overlay */}
      {celebration && (
        <div className="milestone-celebration" onClick={() => setCelebration(null)}>
          <div className="milestone-content">
            <div className="milestone-emoji">{celebration.emoji}</div>
            <div className="milestone-title">{celebration.title}</div>
            {celebration.desc && <div className="milestone-desc">{celebration.desc}</div>}
            {celebration.reward && <div className="milestone-reward">{celebration.reward}</div>}
            <div className="milestone-tap">Tap to continue</div>
          </div>
        </div>
      )}

      {/* Pause overlay */}
      {paused && (
        <div className="pause-overlay" onClick={togglePause}>
          <div className="pause-text">PAUSED</div>
          <div className="pause-hint">Press Space or click to resume</div>
        </div>
      )}

      {/* ── Game Menu (Escape) ─────────────────────── */}
      {showGameMenu && (
        <div className="game-menu-overlay" onClick={() => setShowGameMenu(false)}>
          <div className="game-menu" onClick={e => e.stopPropagation()}>
            <div className="game-menu-title">FISH TYCOON 2</div>
            <div className="game-menu-version">v0.10.0</div>
            <div className="game-menu-buttons">
              <button className="game-menu-btn" onClick={() => { playClick(); setShowGameMenu(false); }}>Resume</button>
              <button className="game-menu-btn" onClick={() => { playClick(); setShowGameMenu(false); setShowSettings(true); }}>Settings</button>
              <button className="game-menu-btn" onClick={() => { playClick(); useGameStore.getState().quickSave(); }}>Save Game</button>
              <button className="game-menu-btn" onClick={() => { playClick(); handleExportSave(); }}>Export Save</button>
              <button className="game-menu-btn" onClick={() => { playClick(); setShowGameMenu(false); setShowCredits(true); }}>Credits</button>
              <button className="game-menu-btn" onClick={() => {
                playClick();
                useGameStore.getState().quickSave();
                setShowGameMenu(false);
                const isCampaign = useGameStore.getState().campaign?.mode === 'campaign';
                if (isCampaign) {
                  useGameStore.getState().abandonCampaignLevel();
                  setShowCampaignMap(true);
                } else {
                  setShowTitle(true);
                }
              }}>{useGameStore.getState().campaign?.mode === 'campaign' ? 'Quit Level' : 'Quit to Title'}</button>
              <button className="game-menu-btn game-menu-btn--danger" onClick={() => { playClick(); setShowGameMenu(false); setShowResetConfirm(true); }}>Reset</button>
            </div>
            <div className="game-menu-hints">
              <span>ESC — Menu</span>
              <span>SPACE — Pause</span>
              <span>1-5 — Sections</span>
              <span>F — Feed</span>
              <span>S — Sell</span>
              <span>A — Feed All</span>
              <span>M — Medicine</span>
              <span>L — Log</span>
              <span>, . — Speed</span>
              <span>F5 — Save</span>
            </div>
          </div>
        </div>
      )}

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      {showCredits && <Credits onClose={() => setShowCredits(false)} />}
      <Tutorial />
      <EventPopup />
      <HagglePopup />
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

      {/* ── Campaign objective bar ────────────────────── */}
      <ObjectiveBar />

      {/* ── Notification center ───────────────────────── */}
      <NotificationCenter />

      {/* ── Mentor hints ──────────────────────────────── */}
      <Mentor />

      {/* ── Campaign victory modal ────────────────────── */}
      {victoryLevelId && (
        <VictoryModal
          levelId={victoryLevelId}
          onContinue={(nextLevelId) => {
            setVictoryLevelId(null);
            if (nextLevelId) {
              useGameStore.getState().startCampaignLevel(nextLevelId);
            } else {
              setShowCampaignMap(true);
            }
          }}
        />
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
        <div className="win-modal-title" style={{ fontSize: '1.3rem' }}>AI Fish Naming</div>
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
          <p style={{ color: '#f5a623', fontSize: '0.8rem', margin: '6px 0 0' }}>Anthropic keys usually start with <code>sk-ant-</code></p>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          {getApiKey() && <button className="btn btn-sm btn-danger" onClick={() => { setApiKey(''); setVal(''); }}>Clear Key</button>}
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={!val.trim()}>{saved ? 'Saved' : 'Save Key'}</button>
        </div>
      </div>
    </div>
  );
}

// ── Tank selector bar ─────────────────────────────────────────
function TankTabs({ tanks, activeTankId, onSelectTank, onUnlockTank, canUnlock, playerCoins, fish, onRename, prestigeLevel = 0 }) {
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
            
            <div className="tank-tab-arc" title={`${count}/${tank.capacity} fish`}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
                <circle cx="14" cy="14" r="10" fill="none"
                  stroke={isActive ? 'var(--gold)' : pct > 80 ? 'var(--danger)' : pct > 50 ? '#b0944a' : 'var(--success)'}
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
              <span className="tank-tab-name" onDoubleClick={e => { e.stopPropagation(); setEditingId(tank.id); setEditName(tank.name); }}>{tank.name}</span>
            )}
          </div>
        );
      })}
      {canUnlock && (() => {
        const needsPrestige = canUnlock.minPrestige && prestigeLevel < canUnlock.minPrestige;
        return (
        <div className="tank-tab tank-tab-unlock">
          {needsPrestige ? (
            <div className="tank-unlock-locked">Requires Prestige {canUnlock.minPrestige}</div>
          ) : !unlocking ? (
            <button className="btn btn-sm btn-unlock" onClick={() => setUnlocking(true)}>+ Unlock Tank ({canUnlock.cost})</button>
          ) : (
            <div className="tank-unlock-picker" onClick={e => e.stopPropagation()}>
              <select className="tank-type-select" value={unlockType} onChange={e => setUnlockType(e.target.value)}>
                {Object.entries(TANK_TYPES).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label} — {v.desc}</option>)}
              </select>
              <button className="btn btn-sm btn-primary" disabled={playerCoins < canUnlock.cost} onClick={() => { onUnlockTank(unlockType); setUnlocking(false); }}>Unlock for <span className="coin-icon"/>{canUnlock.cost}</button>
              <button className="btn btn-sm" onClick={() => setUnlocking(false)}>Cancel</button>
            </div>
          )}
        </div>
        );
      })()}
    </div>
  );
}

// ── Reset Confirmation Modal ──────────────────────────────────
function ResetConfirmModal({ onConfirm, onCancel }) {
  return (
    <div className="win-modal-overlay" onClick={onCancel}>
      <div className="win-modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
        <div className="win-modal-title" style={{ fontSize: '1.3rem' }}>Reset Game?</div>
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
          
        </div>
        <div className="win-modal-title">Legend of the Deep</div>
        <div className="win-modal-subtitle">You have discovered all 7 Magic Fish</div>
        <div className="win-modal-fish-row">
          
        </div>
        <p className="win-modal-lore">
          Your aquarium has become the stuff of legend. Sailors speak of it in hushed tones.
          Scholars have written papers about what you have accomplished.
          The seven wonders of the deep — all in one place. All yours.
        </p>
        <div className="win-modal-reward">Total reward collected: <strong><span className="coin-icon"/> {totalReward.toLocaleString()}</strong></div>
        <div className="win-modal-unlocks">
          <div className="win-unlock-item">
            <strong>Legend Throne</strong> decoration unlocked —{' '}
            <button className="btn btn-sm" onClick={() => { onDismiss(); onNavigate('decor'); }}>
              Open Decor tab
            </button>
          </div>
          <div className="win-unlock-item"><strong>Legend Fish</strong> species unlocked in the Fishdex!</div>
          <div className="win-unlock-item">🏆 <strong>+<span className="coin-icon"/>500</strong> achievement bonus awarded!</div>
        </div>
        <div className="win-modal-actions">
          <button className="btn btn-sm" onClick={() => { onDismiss(); onNavigate('magic'); }}>View Magic Fish</button>
          <button className="btn btn-primary win-continue-btn" onClick={onDismiss}>Continue Playing</button>
        </div>
        <div className="win-modal-hint">The ocean has more secrets. Keep breeding.</div>
      </div>
    </div>
  );
}
