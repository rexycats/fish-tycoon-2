import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ToastManager, { fireToast } from './components/ToastManager.jsx';
import { createDefaultState, saveGame, loadGame, addLog, checkAchievements, exportSave, importSave, ACHIEVEMENT_DEFS, createDefaultTank, TANK_UNLOCK, TANK_TYPES } from './data/gameState.js';
import { processTick, applyOfflineProgress, TICK_INTERVAL_MS } from './systems/gameTick.js';
import { breedGenomes, createFish, MAGIC_FISH, checkMagicFishMatch, getFoundMagicFish } from './data/genetics.js';
import { REAL_SPECIES_MAP } from './data/realSpecies.js';
import { DECOR_CATALOG } from './data/decorations.js';
import { generateFishName, generateFishLore, AI_ERRORS, getApiKey, setApiKey } from './services/aiService.js';
import { playCoin, playBubble, playFeed, playDiscover, playBreed, playSale, playWarning, setSoundEnabled } from './services/soundService.js';
import TankView from './components/TankView.jsx';
import FishPanel from './components/FishPanel.jsx';
import HUD from './components/HUD.jsx';
import LogPanel from './components/LogPanel.jsx';
import Fishdex from './components/Fishdex.jsx';
import BreedingLab from './components/BreedingLab.jsx';
import Shop from './components/Shop.jsx';
import OfflineSummary from './components/OfflineSummary.jsx';
import Achievements from './components/Achievements.jsx';
import MagicFishPanel from './components/MagicFish.jsx';
import DecorationPanel from './components/DecorationPanel.jsx';
import FishAutopsyPanel from './components/FishAutopsy.jsx';

export default function App() {
  // Load once at startup — useRef ensures loadGame() is never called on re-renders
  const _initSaveRef = useRef(undefined);
  if (_initSaveRef.current === undefined) _initSaveRef.current = loadGame();
  const _initSave = _initSaveRef.current;

  const [game, setGame] = useState(() => {
    if (_initSave) return applyOfflineProgress(_initSave);
    return createDefaultState();
  });

  const [selectedFishId, setSelectedFishId]   = useState(null);
  const [activeTab, setActiveTab]               = useState('tank');
  const [activeTankId, setActiveTankId]         = useState(
    _initSave?.tanks?.[0]?.id ?? 'tank_0'
  );
  const [showOffline, setShowOffline] = useState(
    _initSave ? Date.now() - (_initSave.lastTickAt || Date.now()) > 30_000 : false
  );
  const [soundOn, setSoundOn]           = useState(true);
  const [generatingLoreFor, setGeneratingLoreFor] = useState(null);
  const [aiError, setAiError]           = useState(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);

  // ── Floating coin deltas ─────────────────────────────────
  const [coinDeltas, setCoinDeltas] = useState([]);
  const coinDeltaCounter = useRef(0);
  const prevCoinsRef = useRef(game.player.coins);

  const gameRef = useRef(game);
  gameRef.current = game;



  // Track coin changes to spawn floating deltas
  useEffect(() => {
    const diff = game.player.coins - prevCoinsRef.current;
    prevCoinsRef.current = game.player.coins;
    if (diff === 0) return;
    const id = ++coinDeltaCounter.current;
    setCoinDeltas(prev => [...prev.slice(-6), { id, diff }]);
    const t = setTimeout(() => setCoinDeltas(prev => prev.filter(d => d.id !== id)), 1400);
    return () => clearTimeout(t);
  }, [game.player.coins]);
  const prevSalesLenRef   = useRef((game.shop.salesHistory || []).length);
  const prevAchCountRef   = useRef((game.player.achievements || []).length);

  // ── Event-driven achievement checks ─────────────────────────
  // Build a cheap scalar key from every value achievements actually test.
  // This effect only runs when at least one of those values changes —
  // never on ordinary ticks where nothing achievement-relevant happened.
  const achTriggerKey = [
    (game.player.fishdex || []).length,
    (game.player.fishdex || []).filter(e => e.rarity === 'rare').length,
    (game.player.fishdex || []).filter(e => e.rarity === 'epic').length,
    (game.shop.salesHistory || []).length,
    game.player.totalCoinsEarned || 0,
    game.tanks.length,
    (game.player.magicFishFound || []).length,
    game.player.stats?.eggsCollected || 0,
    game.player.stats?.medicineUsed  || 0,
    game.player.stats?.waterTreated  || 0,
    Math.max(0, ...game.tanks.map(t =>
      game.fish.filter(f => f.tankId === t.id).length >= t.capacity ? 1 : 0
    )),
    Math.max(0, ...game.tanks.map(t => Math.round(t.happiness || 0))),
    Math.max(0, ...Object.values(game.shop.upgrades || {}).map(u => u.level || 0)),
  ].join(',');

  useEffect(() => {
    setGame(prev => {
      const msgs = [];
      const next = checkAchievements(prev, msgs);
      return next === prev ? prev : next;
    });
  }, [achTriggerKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ensure activeTankId stays valid if tanks change
  useEffect(() => {
    if (!game.tanks.find(t => t.id === activeTankId)) {
      setActiveTankId(game.tanks[0]?.id ?? 'tank_0');
    }
  }, [game.tanks, activeTankId]);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => setGame(prev => processTick(prev)), TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Auto-save
  useEffect(() => {
    const interval = setInterval(() => saveGame(gameRef.current), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Save on tab close / hide — prevents losing up to 30s of progress
  useEffect(() => {
    const handleUnload = () => saveGame(gameRef.current);
    const handleVisibility = () => { if (document.visibilityState === 'hidden') saveGame(gameRef.current); };
    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Sound + Toast: sales
  useEffect(() => {
    const history = game.shop.salesHistory || [];
    const len = history.length;
    if (len > prevSalesLenRef.current) {
      playSale();
      const sale = history[len - 1];
      if (sale) fireToast(`Sold ${sale.fishName} for 🪙${sale.coins}!`, 'sale', '💰');
      prevSalesLenRef.current = len;
    }
  }, [game.shop.salesHistory?.length]);

  // Sound + Toast: achievements
  // prevAchNamesRef removed — achievement deduplication handled by prevAchCountRef
  useEffect(() => {
    const achs = game.player.achievements || [];
    const len = achs.length;
    if (len > prevAchCountRef.current) {
      playDiscover();
      const newOnes = achs.slice(prevAchCountRef.current);
      for (const ach of newOnes) {
        const def = ACHIEVEMENT_DEFS?.find?.(a => a.id === ach.id);
        fireToast(def ? `Achievement: ${def.label}` : 'Achievement unlocked!', 'achieve', '🏆');
      }
      prevAchCountRef.current = len;
    }
  }, [game.player.achievements?.length]);

  // Toast: disease alerts (fire at most once per fish per disease)
  const diseasedRef = useRef(new Set());
  useEffect(() => {
    for (const f of game.fish) {
      if (f.disease && !diseasedRef.current.has(f.id)) {
        diseasedRef.current.add(f.id);
        fireToast(`${f.species?.name || 'Fish'} is sick! 🦠`, 'alert', '🚨');
      } else if (!f.disease) {
        diseasedRef.current.delete(f.id);
      }
    }
  }, [game.fish]);

  // ── Fishdex + AI naming ──────────────────────────────────
  const updateFishdexEntry = useCallback((speciesName, updates) => {
    setGame(prev => ({
      ...prev,
      player: {
        ...prev.player,
        fishdex: (prev.player.fishdex || []).map(e => e.name === speciesName ? { ...e, ...updates } : e),
      },
    }));
  }, []);

  useEffect(() => {
    const knownNames = new Set((game.player.fishdex || []).map(e => e.name));
    const newEntries = [];
    for (const f of game.fish) {
      if (!f.species) continue;
      if (!knownNames.has(f.species.name)) {
        const realSpec = f.species.visualType === 'species' && f.species.key
          ? REAL_SPECIES_MAP[f.species.key]
          : null;
        newEntries.push({
          name: f.species.name, rarity: f.species.rarity,
          basePrice: f.species.basePrice, phenotype: f.phenotype,
          firstDiscoveredAt: Date.now(), aiName: null, aiLore: null,
          // Real species extras
          ...(realSpec && {
            visualType:         'species',
            speciesKey:         realSpec.key,
            scientificName:     realSpec.scientificName,
            habitat:            realSpec.habitat,
            funFact:            realSpec.funFact,
            conservationStatus: realSpec.conservationStatus,
            lore:               realSpec.lore,
          }),
        });
        knownNames.add(f.species.name);
      }
    }
    if (newEntries.length > 0) {
      setGame(prev => {
        let next = { ...prev, player: { ...prev.player, fishdex: [...(prev.player.fishdex || []), ...newEntries] } };
        for (const e of newEntries) next = addLog(next, `📖 New species: ${e.name}! (${e.rarity})`);

        // Check for newly discovered magic fish
        const alreadyFound = new Set(prev.player.magicFishFound || []);
        const newMagic = [];
        for (const entry of newEntries) {
          for (const mf of MAGIC_FISH) {
            if (!alreadyFound.has(mf.id) && checkMagicFishMatch(entry.phenotype, mf)) {
              alreadyFound.add(mf.id);
              newMagic.push(mf);
            }
          }
        }
        if (newMagic.length > 0) {
          const magicFishFound = [...(prev.player.magicFishFound || []), ...newMagic.map(m => m.id)];
          next = { ...next, player: { ...next.player, coins: next.player.coins + newMagic.reduce((s, m) => s + m.reward, 0), magicFishFound } };
          for (const mf of newMagic) {
            next = addLog(next, `🔮 MAGIC FISH DISCOVERED: #${mf.number} ${mf.title}! +🪙${mf.reward} reward!`);
          }
          // Show win modal if all 7 found
          if (magicFishFound.length === 7) {
            setTimeout(() => setShowWinModal(true), 500);
          }
        }
        return next;
      });
      for (const entry of newEntries) {
        playDiscover();
        generateFishName(entry.phenotype, entry.rarity, entry.name).then(aiName => {
          if (aiName) updateFishdexEntry(entry.name, { aiName });
        });
      }
    }
  }, [(game.fish || []).map(f => f.id).join(',')]);

  const handleGenerateLore = useCallback(async (speciesName) => {
    const entry = (gameRef.current.player.fishdex || []).find(e => e.name === speciesName);
    if (!entry || entry.aiLore) return;
    setGeneratingLoreFor(speciesName);
    setAiError(null);
    try {
      const nameForLore = entry.aiName || entry.name;
      const { text, error } = await generateFishLore(entry.phenotype, entry.rarity, nameForLore);
      if (error) setAiError(error);
      else if (text) updateFishdexEntry(speciesName, { aiLore: text });
    } finally { setGeneratingLoreFor(null); }
  }, [updateFishdexEntry]);

  const toggleSound = useCallback(() => {
    const next = !soundOn; setSoundOn(next); setSoundEnabled(next);
  }, [soundOn]);

  // ── Helpers ──────────────────────────────────────────────
  const activeTank = game.tanks.find(t => t.id === activeTankId) || game.tanks[0];
  const tankFish   = game.fish.filter(f => f.tankId === activeTank?.id);

  // ── ACTIONS — all tank-scoped ────────────────────────────
  const feedFish = useCallback((fishId) => {
    setGame(prev => {
      const fish = prev.fish.find(f => f.id === fishId);
      if (!fish) return prev;
      const tank = prev.tanks.find(t => t.id === fish.tankId);
      if (!tank || tank.supplies.food <= 0) { playWarning(); return addLog(prev, '⚠️ No food in that tank!'); }
      playFeed();
      return {
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id
          ? { ...t, supplies: { ...t.supplies, food: t.supplies.food - 1 } } : t),
        fish: prev.fish.map(f => f.id === fishId ? { ...f, hunger: Math.max(0, f.hunger - 45), health: Math.min(100, f.health + 5) } : f),
      };
    });
  }, []);

  const toggleSellFish = useCallback((fishId) => {
    setGame(prev => {
      const isListed = prev.shop.listedFish.includes(fishId);
      if (!isListed && prev.shop.listedFish.length >= prev.shop.slots) {
        playWarning();
        return addLog(prev, `⚠️ Shop full! Buy an upgrade to add more slots.`);
      }
      const listedFish = isListed
        ? prev.shop.listedFish.filter(id => id !== fishId)
        : [...prev.shop.listedFish, fishId];
      // Remove custom price when unlisting
      const fishPrices = isListed
        ? Object.fromEntries(Object.entries(prev.shop.fishPrices || {}).filter(([k]) => k !== fishId))
        : (prev.shop.fishPrices || {});
      const fish = prev.fish.find(f => f.id === fishId);
      playCoin();
      return addLog({ ...prev, shop: { ...prev.shop, listedFish, fishPrices } },
        isListed ? `🏪 Removed ${fish?.species?.name || 'fish'}.` : `🏪 Listed ${fish?.species?.name || 'fish'} for sale!`);
    });
  }, []);

  const setFishPrice = useCallback((fishId, price) => {
    setGame(prev => ({
      ...prev,
      shop: {
        ...prev.shop,
        fishPrices: { ...(prev.shop.fishPrices || {}), [fishId]: price },
      },
    }));
  }, []);

  const buySupply = useCallback((supplyKey, cost, amount, tankId) => {
    const tid = tankId || activeTank?.id;
    setGame(prev => {
      if (prev.player.coins < cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins!`); }
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - cost },
        tanks: prev.tanks.map(t => t.id === tid
          ? { ...t, supplies: { ...t.supplies, [supplyKey]: (t.supplies[supplyKey] || 0) + amount } } : t),
      }, `🛒 Bought ${amount}x ${supplyKey} for 🪙${cost} (${prev.tanks.find(t=>t.id===tid)?.name || ''}).`);
    });
  }, [activeTank]);

  const treatWater = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTank?.id);
      if (!tank || tank.supplies.waterTreatment <= 0) { playWarning(); return addLog(prev, '⚠️ No water treatment! Buy more.'); }
      playBubble();
      return {
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          waterQuality: Math.min(100, t.waterQuality + 35),
          supplies: { ...t.supplies, waterTreatment: t.supplies.waterTreatment - 1 },
        } : t),
        player: { ...prev.player, stats: { ...(prev.player.stats || {}), waterTreated: (prev.player.stats?.waterTreated || 0) + 1 } },
      };
    });
  }, [activeTank]);

  const useMedicine = useCallback((fishId) => {
    setGame(prev => {
      const fish = prev.fish.find(f => f.id === fishId);
      if (!fish) return prev;
      const tank = prev.tanks.find(t => t.id === fish.tankId);
      if (!tank || tank.supplies.medicine <= 0) { playWarning(); return addLog(prev, '⚠️ No medicine in that tank!'); }
      playCoin();
      const curedDisease = fish.disease;
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id
          ? { ...t, supplies: { ...t.supplies, medicine: t.supplies.medicine - 1 } } : t),
        fish: prev.fish.map(f => f.id === fishId ? { ...f, health: 100, hunger: Math.max(0, f.hunger - 20), disease: null, diseaseSince: null } : f),
        player: { ...prev.player, stats: { ...(prev.player.stats || {}), medicineUsed: (prev.player.stats?.medicineUsed || 0) + 1 } },
      }, curedDisease ? `💊 Cured ${fish.species?.name || 'fish'} of ${curedDisease}!` : `💊 Treated ${fish.species?.name || 'fish'} — fully healed!`);
    });
  }, []);

  const toggleAutoFeed = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTank?.id);
      if (!tank) return prev;
      return addLog(
        { ...prev, tanks: prev.tanks.map(t => t.id === tank.id ? { ...t, autoFeed: !t.autoFeed } : t) },
        tank.autoFeed ? `🍤 Auto-feed disabled on ${tank.name}.` : `🍤 Auto-feed enabled on ${tank.name}.`
      );
    });
  }, [activeTank]);

  const useHeater = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTank?.id);
      if (!tank || (tank.supplies.heater || 0) <= 0) { playWarning(); return addLog(prev, '⚠️ No heater cartridges!'); }
      const current  = tank.temperature ?? 74;
      const adjusted = current < 74 ? Math.min(74, current + 4) : Math.max(74, current - 4);
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t, temperature: adjusted,
          supplies: { ...t.supplies, heater: t.supplies.heater - 1 },
        } : t),
      }, `🌡 Temperature adjusted to ${Math.round(adjusted)}°F.`);
    });
  }, [activeTank]);

  const buyFish = useCallback((cost, targetRarity = null, speciesKey = null) => {
    setGame(prev => {
      if (prev.player.coins < cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins! Need 🪙${cost}.`); }
      const tankId = activeTank?.id || prev.tanks[0]?.id || 'tank_0';
      const tank   = prev.tanks.find(t => t.id === tankId);
      const count  = prev.fish.filter(f => f.tankId === tankId).length;
      if (count >= (tank?.capacity || 12)) { playWarning(); return addLog(prev, '⚠️ Tank is full! Can\'t add more fish.'); }

      let newFish;
      if (speciesKey && REAL_SPECIES_MAP[speciesKey]) {
        // Build a real species fish — bypasses procedural genetics.
        // Use a canonical phenotype so Fishdex lore, AI naming, and
        // magic fish checks all receive accurate trait data.
        const spec = REAL_SPECIES_MAP[speciesKey];
        const SPECIES_PHENOTYPES = {
          // Keys and values must match GENES allele names exactly.
          // bodyShape: Orb|Round|Delta|Slender|Eel
          // finType:   Veil|Flowing|Broad|Angular|Nub
          // pattern:   Marble|Spotted|Tiger|Lined|Plain
          // primaryColor: Crimson|Gold|Violet|Azure|Emerald|White
          // secondaryColor: Orange|Rose|Teal|Indigo|Silver
          // glow:      Normal|Luminous|Radiant|Ultraviolet
          // size:      Leviathan|Giant|Medium|Tiny|Dwarf
          // mutation:  None|Albino|Melanistic|Xanthic|Twin-tail|Starfish
          angelfish: { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'White',   secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
          clownfish:  { bodyShape: 'Round',  finType: 'Broad',   pattern: 'Lined',  primaryColor: 'Crimson', secondaryColor: 'Orange', glow: 'Normal',   size: 'Tiny',   mutation: 'None' },
          bluetang:   { bodyShape: 'Delta',  finType: 'Angular', pattern: 'Plain',  primaryColor: 'Azure',   secondaryColor: 'Indigo', glow: 'Normal',   size: 'Medium', mutation: 'None' },
          betta:      { bodyShape: 'Slender',finType: 'Veil',    pattern: 'Marble', primaryColor: 'Violet',  secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
        };
        const canonicalPhenotype = SPECIES_PHENOTYPES[speciesKey] || { bodyShape: 'Round', finType: 'Broad', pattern: 'Plain', primaryColor: 'White', secondaryColor: 'Silver', glow: 'Normal', size: 'Medium', mutation: 'None' };
        newFish = {
          ...createFish({ stage: 'adult', tankId }),
          phenotype: canonicalPhenotype,
          species: {
            name:       spec.name,
            rarity:     spec.rarity,
            basePrice:  spec.basePrice,
            rarityScore: 12,
            visualType: 'species',
            key:        spec.key,
          },
        };
      } else {
        newFish = createFish({ stage: 'adult', tankId, targetRarity });
      }

      playCoin();
      return addLog({
        ...prev,
        fish: [...prev.fish, newFish],
        player: { ...prev.player, coins: prev.player.coins - cost },
      }, `🐟 Bought a ${newFish.species?.name || 'fish'} for 🪙${cost}!`);
    });
  }, [activeTank]);

  const buyUpgrade = useCallback((upgradeId) => {
    setGame(prev => {
      const upgrades = prev.shop.upgrades || {};
      const upg = upgrades[upgradeId];
      if (!upg || upg.level >= 3) return prev;
      if (prev.player.coins < upg.cost) { playWarning(); return addLog(prev, `⚠️ Need 🪙${upg.cost} for ${upg.label}.`); }
      let next = {
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - upg.cost },
        shop: { ...prev.shop, upgrades: { ...upgrades, [upgradeId]: { ...upg, level: upg.level + 1, cost: Math.round(upg.cost * 1.8) } } },
      };
      if (upgradeId === 'slot')     next = { ...next, shop: { ...next.shop, slots: next.shop.slots + 1 } };
      if (upgradeId === 'capacity') {
        const tid = activeTank?.id;
        next = { ...next, tanks: next.tanks.map(t => t.id === tid ? { ...t, capacity: t.capacity + 4 } : t) };
      }
      if (upgradeId === 'breeding') next = { ...next, breedingTank: { ...next.breedingTank, breedingDurationMs: Math.round(next.breedingTank.breedingDurationMs * 0.75) } };
      playCoin();
      return addLog(next, `⬆️ Upgraded: ${upg.label}!`);
    });
  }, [activeTank]);

  // ── Move fish between tanks ──────────────────────────────
  const moveFishToTank = useCallback((fishId, targetTankId) => {
    setGame(prev => {
      const fish   = prev.fish.find(f => f.id === fishId);
      const target = prev.tanks.find(t => t.id === targetTankId);
      if (!fish || !target) return prev;
      const targetCount = prev.fish.filter(f => f.tankId === targetTankId).length;
      if (targetCount >= target.capacity) { playWarning(); return addLog(prev, `⚠️ ${target.name} is full!`); }
      playCoin();
      return addLog(
        { ...prev, fish: prev.fish.map(f => f.id === fishId ? { ...f, tankId: targetTankId } : f) },
        `🔀 Moved ${fish.species?.name || 'fish'} to ${target.name}.`
      );
    });
  }, []);

  // ── Unlock a new tank ────────────────────────────────────
  const unlockTank = useCallback((type) => {
    setGame(prev => {
      const unlock = TANK_UNLOCK[prev.tanks.length];
      if (!unlock) return addLog(prev, '⚠️ Max tanks already unlocked.');
      if (prev.player.coins < unlock.cost) { playWarning(); return addLog(prev, `⚠️ Need 🪙${unlock.cost} to unlock a new tank.`); }
      const newTankId   = `tank_${prev.tanks.length}`;
      const newTank     = createDefaultTank(newTankId, type);
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - unlock.cost },
        tanks: [...prev.tanks, newTank],
      }, `🏗️ Unlocked: ${newTank.name}!`);
    });
  }, []);

  // ── Rename a tank ────────────────────────────────────────
  const renameTank = useCallback((tankId, name) => {
    setGame(prev => ({
      ...prev,
      tanks: prev.tanks.map(t => t.id === tankId ? { ...t, name } : t),
    }));
  }, []);

  // ── Decorations ───────────────────────────────────────────
  const buyDecoration = useCallback((decorId) => {
    const decor = DECOR_CATALOG.find(d => d.id === decorId);
    if (!decor) return;
    setGame(prev => {
      if (prev.player.coins < decor.cost) {
        playWarning();
        return addLog(prev, `⚠️ Not enough coins! Need 🪙${decor.cost}.`);
      }
      const tank = prev.tanks.find(t => t.id === activeTank?.id) || prev.tanks[0];
      const currentOwned = tank.decorations?.owned || {};
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - decor.cost },
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          decorations: {
            ...t.decorations,
            owned: { ...currentOwned, [decorId]: (currentOwned[decorId] || 0) + 1 },
          },
        } : t),
      }, `🎨 Bought ${decor.label} for 🪙${decor.cost}!`);
    });
  }, [activeTank]);

  const placeDecoration = useCallback((tankId, decorType, x, y, scale) => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === tankId);
      if (!tank) return prev;
      const owned = tank.decorations?.owned || {};
      if (!owned[decorType] || owned[decorType] < 1) return prev;
      const instanceId = `${decorType}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
      const newOwned = { ...owned, [decorType]: owned[decorType] - 1 };
      if (newOwned[decorType] <= 0) delete newOwned[decorType];
      const newPlaced = [...(tank.decorations?.placed || []),
        { instanceId, type: decorType, x, y, scale }];
      return {
        ...prev,
        tanks: prev.tanks.map(t => t.id === tankId ? {
          ...t,
          decorations: { ...t.decorations, owned: newOwned, placed: newPlaced },
        } : t),
      };
    });
  }, []);

  const removeDecoration = useCallback((tankId, instanceId) => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === tankId);
      if (!tank) return prev;
      const item = (tank.decorations?.placed || []).find(p => p.instanceId === instanceId);
      if (!item) return prev;
      const newPlaced = (tank.decorations?.placed || []).filter(p => p.instanceId !== instanceId);
      const owned = tank.decorations?.owned || {};
      const newOwned = { ...owned, [item.type]: (owned[item.type] || 0) + 1 };
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tankId ? {
          ...t,
          decorations: { ...t.decorations, owned: newOwned, placed: newPlaced },
        } : t),
      }, `🎨 Removed decoration (returned to inventory).`);
    });
  }, []);

  // ── Breeding ─────────────────────────────────────────────
  const selectForBreeding = useCallback((fishId) => {
    setGame(prev => {
      const bt = prev.breedingTank;
      if (bt.slots[0] === fishId || bt.slots[1] === fishId) {
        return { ...prev, breedingTank: { ...bt, slots: bt.slots.map(s => s === fishId ? null : s) } };
      }
      if (!bt.slots[0] && bt.slots[1] !== fishId) return { ...prev, breedingTank: { ...bt, slots: [fishId, bt.slots[1]] } };
      if (bt.slots[0] === fishId) return prev;
      if (!bt.slots[1]) {
        // Find which tank fishA is in; prefer that tank for the egg, else default tank_0
        const fishA   = prev.fish.find(f => f.id === bt.slots[0]);
        const fishB   = prev.fish.find(f => f.id === fishId);
        const eggTank = fishA?.tankId || 'tank_0';
        const hasBoost = (prev.tanks.find(t => t.id === eggTank)?.supplies?.breedingBoost || 0) > 0;
        const duration  = hasBoost ? 10_000 : bt.breedingDurationMs;
        const supplies  = hasBoost
          ? prev.tanks.map(t => t.id === eggTank
              ? { ...t, supplies: { ...t.supplies, breedingBoost: t.supplies.breedingBoost - 1 } }
              : t)
          : prev.tanks;
        playBreed();
        return addLog({
          ...prev,
          tanks: supplies,
          player: { ...prev.player, stats: { ...(prev.player.stats || {}), totalFishBred: (prev.player.stats?.totalFishBred || 0) + 1 } },
          breedingTank: {
            ...bt,
            slots: [bt.slots[0], fishId],
            breedingStartedAt: Date.now(),
            eggReady: false,
            breedingDurationMs: duration,
            // Store genomes so egg can be collected even if parents are sold
            storedGenomeA: fishA?.genome ?? null,
            storedGenomeB: fishB?.genome ?? null,
            storedTankId: eggTank,
          },
        }, hasBoost ? '💉 Breeding boost active — 10 seconds!' : '💕 Breeding started!');
      }
      return prev;
    });
  }, []);

  const cancelBreeding = useCallback(() => {
    setGame(prev => {
      const bt = prev.breedingTank;
      if (!bt.breedingStartedAt || bt.eggReady) return prev;
      const baseDuration = 30_000 * Math.pow(0.75, (prev.shop.upgrades?.breeding?.level || 0));
      return addLog({
        ...prev,
        breedingTank: {
          ...bt,
          slots: [null, null],
          breedingStartedAt: null,
          eggReady: false,
          breedingDurationMs: Math.round(baseDuration),
          storedGenomeA: null,
          storedGenomeB: null,
          storedTankId: null,
        },
      }, '❌ Breeding cancelled.');
    });
  }, []);

  const collectEgg = useCallback(() => {
    setGame(prev => {
      const bt = prev.breedingTank;
      if (!bt.eggReady) return prev;
      const [idA, idB] = bt.slots;
      const fishA = prev.fish.find(f => f.id === idA);
      const fishB = prev.fish.find(f => f.id === idB);
      // Use stored genomes as fallback — parents may have been sold after breeding started
      const genomeA = fishA?.genome ?? bt.storedGenomeA;
      const genomeB = fishB?.genome ?? bt.storedGenomeB;
      if (!genomeA || !genomeB) {
        playWarning();
        return addLog(prev, '⚠️ Cannot collect egg — parent genome data missing.');
      }
      // Egg goes to fishA's tank, or first tank if parent was sold
      const eggTankId = fishA?.tankId ?? bt.storedTankId ?? 'tank_0';
      const eggTank   = prev.tanks.find(t => t.id === eggTankId);
      const tankCount = prev.fish.filter(f => f.tankId === eggTankId).length;
      if (tankCount >= (eggTank?.capacity || 12)) { playWarning(); return addLog(prev, '⚠️ That tank is full! Move fish first.'); }
      const offspringGenome = breedGenomes(genomeA, genomeB);
      const newFish = createFish({ genome: offspringGenome, stage: 'egg', parentIds: [idA, idB], tankId: eggTankId });
      const baseDuration = 30_000 * Math.pow(0.75, (prev.shop.upgrades?.breeding?.level || 0));
      playBreed();
      return addLog({
        ...prev,
        fish: [...prev.fish, newFish],
        breedingTank: { ...bt, slots: [null, null], eggReady: false, breedingStartedAt: null, breedingDurationMs: Math.round(baseDuration) },
        player: {
          ...prev.player,
          stats: { ...(prev.player.stats || {}), eggsCollected: (prev.player.stats?.eggsCollected || 0) + 1 },
        },
      }, `🥚 Egg collected in ${eggTank?.name || 'Tank'}! It might become a ${newFish.species?.name || 'fish'}.`);
    });
  }, []);

  const resetGame = useCallback(() => {
    if (confirm('Reset your game? All progress will be lost!')) {
      const fresh = createDefaultState();
      setGame(fresh);
      saveGame(fresh);
      setSelectedFishId(null);
      setActiveTankId('tank_0');
    }
  }, []);

  const handleExportSave = useCallback(() => {
    exportSave(gameRef.current);
  }, []);

  const handleImportSave = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    importSave(file)
      .then(loaded => {
        setGame(loaded);
        saveGame(loaded);
        setSelectedFishId(null);
        setActiveTankId(loaded.tanks?.[0]?.id ?? 'tank_0');
        fireToast('✅ Save imported successfully!', 'achieve', '📂');
      })
      .catch(err => fireToast(`❌ Import failed: ${err.message}`, 'alert', '⚠️'));
    e.target.value = '';
  }, []);

  const selectedFish = game.fish.find(f => f.id === selectedFishId) || null;
  const isListed     = selectedFish ? game.shop.listedFish.includes(selectedFish.id) : false;
  const newAchCount  = (game.player.achievements || []).length;
  const TAB_LIST = [
    ['tank',    '🐠', 'Tank'],
    ['shop',    '🏪', 'Shop'],
    ['breed',   '🧬', 'Breed'],
    ['fishdex', '📖', 'Fishdex'],
    ['magic',   '🔮', 'Magic'],
    ['decor',   '🎨', 'Decor'],
    ['autopsy', '🔬', 'Autopsy'],
    ['achieve', '🏆', 'Awards'],
  ];
  const activeTabIdx = TAB_LIST.findIndex(([t]) => t === activeTab);

  return (
    <div className="app">
      <ToastManager />

      {/* Floating coin delta animations */}
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
        fish={game.fish}
        onBuyFood={() => buySupply('food', 10, 10, activeTank?.id)}
        onTreatWater={treatWater}
        onToggleAutoFeed={toggleAutoFeed}
        onUseHeater={useHeater}
        soundOn={soundOn}
        onToggleSound={toggleSound}
      />

      {/* Tank selector tabs */}
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

      <nav className="tab-bar" style={{ '--tab-count': TAB_LIST.length }}>
        {/* Sliding pill indicator */}
        <div
          className="tab-pill"
          style={{ '--pill-idx': activeTabIdx, '--pill-total': TAB_LIST.length }}
        />
        {TAB_LIST.map(([tab, icon, label], i) => {
          const fishdexCount = (game.player.fishdex || []).length;
          const magicCount   = (game.player.magicFishFound || []).length;
          const autopsyCount = (game.player.autopsies || []).length;
          let badge = null;
          if (tab === 'fishdex' && fishdexCount > 0) badge = <span className="tab-dot">{fishdexCount}</span>;
          if (tab === 'magic')   badge = <span className="tab-dot tab-dot--magic">{magicCount}/7</span>;
          if (tab === 'autopsy' && autopsyCount > 0) badge = <span className="tab-dot tab-dot--warn">{autopsyCount}</span>;
          if (tab === 'achieve' && newAchCount > 0)  badge = <span className="tab-dot tab-dot--gold">{newAchCount}</span>;
          return (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
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
            <div className="tank-col">
              <TankView
                fish={tankFish}
                selectedFishId={selectedFishId}
                onSelectFish={setSelectedFishId}
                waterQuality={activeTank?.waterQuality ?? 100}
                tank={activeTank}
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
                medicineStock={activeTank?.supplies?.medicine ?? 0}
                tanks={game.tanks}
                onMoveFish={moveFishToTank}
              />
              <LogPanel log={game.log} />
            </div>
          </>
        )}
        {activeTab === 'shop' && (
          <Shop game={game} activeTank={activeTank} onToggleSell={toggleSellFish} onSetPrice={setFishPrice} onBuyUpgrade={buyUpgrade} onBuySupply={(k, c, a) => buySupply(k, c, a, activeTank?.id)} onBuyFish={buyFish} />
        )}
        {activeTab === 'breed' && (
          <BreedingLab fish={game.fish} breedingTank={game.breedingTank} onSelectForBreeding={selectForBreeding} onCollectEgg={collectEgg} onCancelBreeding={cancelBreeding} />
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
          />
        )}
        {activeTab === 'autopsy' && (
          <FishAutopsyPanel autopsies={game.player.autopsies || []} />
        )}
      </main>

      {showApiSetup && (
        <ApiKeyModal onClose={() => setShowApiSetup(false)} />
      )}

      {/* Magic Fish Win Modal */}
      {(game.player.magicFishFound || []).length === 7 && showWinModal && (
        <MagicWinModal
          totalReward={MAGIC_FISH.reduce((s, m) => s + m.reward, 0)}
          onDismiss={() => setShowWinModal(false)}
        />
      )}

      <footer className="app-footer">
        <button className="btn btn-sm btn-danger" onClick={resetGame}>🔄 Reset</button>
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

// ── API Key Setup Modal ──────────────────────────────────────
function ApiKeyModal({ onClose }) {
  const [val, setVal] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setApiKey(val.trim());
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div className="win-modal-overlay" onClick={onClose}>
      <div className="win-modal" style={{ maxWidth: 420 }} onClick={e => e.stopPropagation()}>
        <div className="win-modal-title" style={{ fontSize: '1.3rem' }}>🤖 AI Fish Naming</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '8px 0 16px' }}>
          Paste your Anthropic API key to unlock AI-generated fish names and lore.
          Your key is stored only in this browser (localStorage) and never sent anywhere except Anthropic's API.
        </p>
        <input
          type="password"
          placeholder="sk-ant-..."
          value={val}
          onChange={e => setVal(e.target.value)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: 'var(--surface)', color: 'var(--text)', fontSize: '0.9rem', boxSizing: 'border-box',
          }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
        />
        {val && !val.startsWith('sk-ant-') && (
          <p style={{ color: '#f5a623', fontSize: '0.8rem', margin: '6px 0 0' }}>
            ⚠️ Anthropic keys usually start with <code>sk-ant-</code>
          </p>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          {getApiKey() && (
            <button className="btn btn-sm btn-danger" onClick={() => { setApiKey(''); setVal(''); }}>
              Clear Key
            </button>
          )}
          <button className="btn btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={!val.trim()}>
            {saved ? '✅ Saved!' : 'Save Key'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Tank selector bar ────────────────────────────────────────
function TankTabs({ tanks, activeTankId, onSelectTank, onUnlockTank, canUnlock, playerCoins, fish, onRename }) {
  const [unlocking, setUnlocking] = useState(false);
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
          <div
            key={tank.id}
            className={`tank-tab ${isActive ? 'active' : ''}`}
            onClick={() => { onSelectTank(tank.id); setEditingId(null); }}
          >
            <span className="tank-tab-emoji">{typeInfo.emoji}</span>
            {/* Arc capacity donut */}
            <div className="tank-tab-arc" title={`${count}/${tank.capacity} fish`}>
              <svg width="28" height="28" viewBox="0 0 28 28">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="3"/>
                <circle cx="14" cy="14" r="10" fill="none"
                  stroke={isActive ? '#d4a830' : pct > 80 ? '#ff5566' : pct > 50 ? '#f5c542' : '#3ddba0'}
                  strokeWidth="3"
                  strokeDasharray={`${(pct/100) * 62.8} 62.8`}
                  strokeDashoffset="15.7"
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <text x="14" y="17.5" textAnchor="middle" fontSize="7" fill="currentColor" opacity="0.85">{count}</text>
              </svg>
            </div>
            {editingId === tank.id ? (
              <input
                className="tank-name-input"
                value={editName}
                autoFocus
                onChange={e => setEditName(e.target.value)}
                onBlur={() => { onRename(tank.id, editName || tank.name); setEditingId(null); }}
                onKeyDown={e => { if (e.key === 'Enter') { onRename(tank.id, editName || tank.name); setEditingId(null); } e.stopPropagation(); }}
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span
                className="tank-tab-name"
                onDoubleClick={e => { e.stopPropagation(); setEditingId(tank.id); setEditName(tank.name); }}
                title="Double-click to rename"
              >{tank.name}</span>
            )}
            <span className="tank-tab-emoji">{typeInfo.emoji}</span>
          </div>
        );
      })}

      {canUnlock && (
        <div className="tank-tab tank-tab-unlock">
          {!unlocking ? (
            <button className="btn btn-sm btn-unlock" onClick={() => setUnlocking(true)}>
              + Unlock Tank (🪙{canUnlock.cost})
            </button>
          ) : (
            <div className="tank-unlock-picker" onClick={e => e.stopPropagation()}>
              <select className="tank-type-select" value={unlockType} onChange={e => setUnlockType(e.target.value)}>
                {Object.entries(TANK_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label} — {v.desc}</option>
                ))}
              </select>
              <button
                className="btn btn-sm btn-primary"
                disabled={playerCoins < canUnlock.cost}
                onClick={() => { onUnlockTank(unlockType); setUnlocking(false); }}
              >
                Unlock for 🪙{canUnlock.cost}
              </button>
              <button className="btn btn-sm" onClick={() => setUnlocking(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Magic Fish Win Modal ─────────────────────────────────────
function MagicWinModal({ totalReward, onDismiss }) {
  return (
    <div className="win-modal-overlay" onClick={onDismiss}>
      <div className="win-modal" onClick={e => e.stopPropagation()}>
        <div className="win-modal-stars">
          {['✨','🌟','✨','⭐','🌟','✨','⭐'].map((s, i) => (
            <span key={i} className="win-star" style={{ animationDelay: `${i * 0.15}s` }}>{s}</span>
          ))}
        </div>
        <div className="win-modal-title">🔮 Legend of the Deep 🔮</div>
        <div className="win-modal-subtitle">You have discovered all 7 Magic Fish</div>
        <div className="win-modal-fish-row">
          {['🐡','🐠','🐟','🦈','🐙','🦑','🦐'].map((e, i) => (
            <span key={i} className="win-fish-icon" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
          ))}
        </div>
        <p className="win-modal-lore">
          Your aquarium has become the stuff of legend. Sailors speak of it in hushed tones.
          Scholars have written papers about what you have accomplished.
          The seven wonders of the deep — all in one place. All yours.
        </p>
        <div className="win-modal-reward">
          Total reward collected: <strong>🪙 {totalReward.toLocaleString()}</strong>
        </div>
        <div className="win-modal-actions">
          <button className="btn btn-primary win-continue-btn" onClick={onDismiss}>
            ✨ Continue Playing
          </button>
        </div>
        <div className="win-modal-hint">The ocean has more secrets. Keep breeding.</div>
      </div>
    </div>
  );
}
