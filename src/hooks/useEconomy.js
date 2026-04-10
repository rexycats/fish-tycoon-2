import { useCallback, useRef } from 'react';
import {
  addLog, saveGame, createDefaultState, exportSave, importSave,
  createDefaultTank, TANK_UNLOCK, TANK_TYPES,
} from '../data/gameState.js';
import { updateChallengeProgress } from '../systems/gameTick.js';
import { breedGenomes, createFish } from '../data/genetics.js';
import { REAL_SPECIES_MAP } from '../data/realSpecies.js';
import { DECOR_CATALOG, TANK_THEMES } from '../data/decorations.js';
import { fireToast } from '../components/ToastManager.jsx';

// Static lookup — hoisted to module scope so it isn't re-created on every buyFish call
const SPECIES_PHENOTYPES = {
  angelfish:         { bodyShape: 'Delta',   finType: 'Flowing', pattern: 'Lined',  primaryColor: 'White',   secondaryColor: 'Silver', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  clownfish:         { bodyShape: 'Round',   finType: 'Broad',   pattern: 'Lined',  primaryColor: 'Crimson', secondaryColor: 'Orange', glow: 'Normal',   size: 'Tiny',   mutation: 'None' },
  bluetang:          { bodyShape: 'Delta',   finType: 'Angular', pattern: 'Plain',  primaryColor: 'Azure',   secondaryColor: 'Indigo', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  betta:             { bodyShape: 'Slender', finType: 'Veil',    pattern: 'Marble', primaryColor: 'Violet',  secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
  goldfish:          { bodyShape: 'Round',   finType: 'Veil',    pattern: 'Plain',  primaryColor: 'Gold',    secondaryColor: 'Orange', glow: 'Normal',   size: 'Medium', mutation: 'None' },
  mandarin_dragonet: { bodyShape: 'Slender', finType: 'Broad',   pattern: 'Marble', primaryColor: 'Azure',   secondaryColor: 'Teal',   glow: 'Luminous', size: 'Tiny',   mutation: 'None' },
};
import {
  playCoin, playBubble, playFeed, playBreed, playWarning,
} from '../services/soundService.js';

/**
 * useEconomy
 *
 * Owns every action callback that mutates game state in response to player
 * input: feeding, selling, buying, upgrading, breeding, decorating, saving.
 *
 * Receives:
 *   game           — read-only snapshot for deriving activeTank / guards
 *   setGame        — state updater from useGameEngine
 *   activeTankId   — currently viewed tank id (from useFishSelection)
 *   setSelectedFishId / setActiveTankId — reset helpers for resetGame + importSave
 */
export function useEconomy(game, setGame, activeTankId, setSelectedFishId, setActiveTankId) {
  // Stable ref so export always sees the latest game without being in dep arrays
  const gameRef = useRef(game);
  gameRef.current = game;

  // ── Feed ─────────────────────────────────────────────────────
  const feedFish = useCallback((fishId) => {
    setGame(prev => {
      const fish = prev.fish.find(f => f.id === fishId);
      if (!fish) return prev;
      const tank = prev.tanks.find(t => t.id === fish.tankId);
      if (!tank || tank.supplies.food <= 0) {
        playWarning();
        return addLog(prev, '⚠️ No food in that tank!');
      }
      playFeed();
      return {
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id
          ? { ...t, supplies: { ...t.supplies, food: t.supplies.food - 1 } }
          : t),
        fish: prev.fish.map(f => f.id === fishId
          ? { ...f, hunger: Math.max(0, f.hunger - 45), health: Math.min(100, f.health + 5) }
          : f),
      };
    });
  }, []);

  // ── Shop: list / unlist ──────────────────────────────────────
  const toggleSellFish = useCallback((fishId) => {
    setGame(prev => {
      const isListed = prev.shop.listedFish.includes(fishId);
      if (!isListed && prev.shop.listedFish.length >= prev.shop.slots) {
        playWarning();
        return addLog(prev, `⚠️ Shop full! Buy an upgrade to add more slots.`);
      }
      const listedFish  = isListed
        ? prev.shop.listedFish.filter(id => id !== fishId)
        : [...prev.shop.listedFish, fishId];
      // Remove custom price when unlisting
      const fishPrices = isListed
        ? Object.fromEntries(Object.entries(prev.shop.fishPrices || {}).filter(([k]) => k !== fishId))
        : (prev.shop.fishPrices || {});
      const fish = prev.fish.find(f => f.id === fishId);
      playCoin();
      return addLog(
        { ...prev, shop: { ...prev.shop, listedFish, fishPrices } },
        isListed
          ? `🏪 Removed ${fish?.species?.name || 'fish'}.`
          : `🏪 Listed ${fish?.species?.name || 'fish'} for sale!`,
      );
    });
  }, []);

  // ── Shop: custom price ───────────────────────────────────────
  const setFishPrice = useCallback((fishId, price) => {
    setGame(prev => ({
      ...prev,
      shop: { ...prev.shop, fishPrices: { ...(prev.shop.fishPrices || {}), [fishId]: price } },
    }));
  }, []);

  // ── Buy supplies ─────────────────────────────────────────────
  const buySupply = useCallback((supplyKey, cost, amount, tankId) => {
    setGame(prev => {
      // Bug 3: if tankId is missing (e.g. activeTank was undefined when the lambda
      // was captured) bail out with a warning rather than silently deducting coins
      // and adding the supply to no tank.
      const resolvedTankId = tankId ?? prev.tanks[0]?.id;
      if (!resolvedTankId) { playWarning(); return addLog(prev, '⚠️ No tank available!'); }
      if (prev.player.coins < cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins!`); }
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - cost },
        tanks: prev.tanks.map(t => t.id === resolvedTankId
          ? { ...t, supplies: { ...t.supplies, [supplyKey]: (t.supplies[supplyKey] || 0) + amount } }
          : t),
      }, `🛒 Bought ${amount}x ${supplyKey} for 🪙${cost} (${prev.tanks.find(t => t.id === resolvedTankId)?.name || ''}).`);
    });
  }, []);

  // ── Treat water ──────────────────────────────────────────────
  const treatWater = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTankId);
      if (!tank || tank.supplies.waterTreatment <= 0) {
        playWarning();
        return addLog(prev, '⚠️ No water treatment! Buy more.');
      }
      playBubble();
      return updateChallengeProgress({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          waterQuality: Math.min(100, t.waterQuality + 35),
          supplies: { ...t.supplies, waterTreatment: t.supplies.waterTreatment - 1 },
        } : t),
        player: {
          ...prev.player,
          stats: { ...(prev.player.stats || {}), waterTreated: (prev.player.stats?.waterTreated || 0) + 1 },
        },
      }, 'treat_water');
    });
  }, [activeTankId]);

  // ── Medicine ─────────────────────────────────────────────────
  const useMedicine = useCallback((fishId) => {
    const CURE_MAP = {
      ich:     'antibiotic',
      fin_rot: 'antibiotic',
      velvet:  'antiparasitic',
      bloat:   'digestiveRemedy',
    };
    const TREATMENT_NAMES = {
      antibiotic:      'Antibiotic',
      antiparasitic:   'Antiparasitic',
      digestiveRemedy: 'Digestive Remedy',
    };
    setGame(prev => {
      const fish    = prev.fish.find(f => f.id === fishId);
      if (!fish) return prev;
      const tank    = prev.tanks.find(t => t.id === fish.tankId);
      if (!tank) return prev;
      const disease    = fish.disease;
      const supplyKey  = disease ? (CURE_MAP[disease] ?? 'antibiotic') : 'antibiotic';
      const supplyName = TREATMENT_NAMES[supplyKey] ?? supplyKey;
      const stock      = tank.supplies[supplyKey] ?? 0;
      if (stock <= 0) {
        playWarning();
        return addLog(prev, `⚠️ No ${supplyName} in that tank!${disease ? ` (needed for ${disease.replace('_', ' ')})` : ''}`);
      }
      playCoin();
      const curedState = addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id
          ? { ...t, supplies: { ...t.supplies, [supplyKey]: stock - 1 } }
          : t),
        fish: prev.fish.map(f => f.id === fishId
          ? { ...f, health: 100, hunger: Math.max(0, f.hunger - 20), disease: null, diseaseSince: null }
          : f),
        player: {
          ...prev.player,
          stats: { ...(prev.player.stats || {}), medicineUsed: (prev.player.stats?.medicineUsed || 0) + 1 },
        },
      }, disease
        ? `💊 Used ${supplyName} — cured ${fish.species?.name || 'fish'} of ${disease.replace('_', ' ')}!`
        : `💊 Used ${supplyName} — ${fish.species?.name || 'fish'} fully healed!`,
      );
      return disease ? updateChallengeProgress(curedState, 'cure_fish') : curedState;
    });
  }, []);

  // ── Auto-feed toggle ─────────────────────────────────────────
  const toggleAutoFeed = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTankId);
      if (!tank) return prev;
      return addLog(
        { ...prev, tanks: prev.tanks.map(t => t.id === tank.id ? { ...t, autoFeed: !t.autoFeed } : t) },
        tank.autoFeed
          ? `🍤 Auto-feed disabled on ${tank.name}.`
          : `🍤 Auto-feed enabled on ${tank.name}.`,
      );
    });
  }, [activeTankId]);

  // ── Heater ───────────────────────────────────────────────────
  const useHeater = useCallback(() => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTankId);
      if (!tank || (tank.supplies.heater || 0) <= 0) {
        playWarning();
        return addLog(prev, '⚠️ No heater cartridges!');
      }
      const current  = tank.temperature ?? 74;
      const adjusted = current < 74 ? Math.min(74, current + 4) : Math.max(74, current - 4);
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          temperature: adjusted,
          supplies: { ...t.supplies, heater: t.supplies.heater - 1 },
        } : t),
      }, `🌡 Temperature adjusted to ${Math.round(adjusted)}°F.`);
    });
  }, [activeTankId]);

  // ── Buy fish ─────────────────────────────────────────────────
  const buyFish = useCallback((cost, targetRarity = null, speciesKey = null) => {
    setGame(prev => {
      if (prev.player.coins < cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins! Need 🪙${cost}.`); }
      const tankId = activeTankId || prev.tanks[0]?.id || 'tank_0';
      const tank   = prev.tanks.find(t => t.id === tankId);
      const count  = prev.fish.filter(f => f.tankId === tankId).length;
      if (count >= (tank?.capacity || 12)) { playWarning(); return addLog(prev, '⚠️ Tank is full! Can\'t add more fish.'); }

      let newFish;
      if (speciesKey && REAL_SPECIES_MAP[speciesKey]) {
        const spec = REAL_SPECIES_MAP[speciesKey];
        const canonicalPhenotype = SPECIES_PHENOTYPES[speciesKey] || { bodyShape: 'Round', finType: 'Broad', pattern: 'Plain', primaryColor: 'White', secondaryColor: 'Silver', glow: 'Normal', size: 'Medium', mutation: 'None' };
        let colorVariant = null;
        if (spec.colorVariants?.length > 1) {
          const variants = spec.colorVariants;
          const weights  = variants.map((v, i) =>
            i === 0 ? 3.0 :
            v === 'ghost' || v === 'black' ? 0.4 :
            v === 'kohaku' || v === 'red'  ? 0.7 : 1.0,
          );
          const total = weights.reduce((s, w) => s + w, 0);
          let r = Math.random() * total;
          for (let i = 0; i < variants.length; i++) { r -= weights[i]; if (r <= 0) { colorVariant = variants[i]; break; } }
          colorVariant = colorVariant || variants[0];
        }
        newFish = {
          ...createFish({ stage: 'adult', tankId }),
          phenotype:   canonicalPhenotype,
          colorVariant,
          species: {
            name:        spec.name,
            rarity:      spec.rarity,
            basePrice:   spec.basePrice,
            rarityScore: 12,
            visualType:  'species',
            key:         spec.key,
          },
        };
      } else {
        newFish = createFish({ stage: 'adult', tankId, targetRarity });
      }

      playCoin();
      return addLog({
        ...prev,
        fish:   [...prev.fish, newFish],
        player: { ...prev.player, coins: prev.player.coins - cost },
      }, `🐟 Bought a ${newFish.species?.name || 'fish'} for 🪙${cost}!`);
    });
  }, [activeTankId]);

  // ── Buy upgrade ──────────────────────────────────────────────
  const buyUpgrade = useCallback((upgradeId) => {
    setGame(prev => {
      const upgrades = prev.shop.upgrades || {};
      const upg      = upgrades[upgradeId];
      const maxLevel = upg?.maxLevel || 3;
      if (!upg || upg.level >= maxLevel) return prev;
      if (prev.player.coins < upg.cost) { playWarning(); return addLog(prev, `⚠️ Need 🪙${upg.cost} for ${upg.label}.`); }
      let next = {
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - upg.cost },
        shop:   { ...prev.shop, upgrades: { ...upgrades, [upgradeId]: { ...upg, level: upg.level + 1, cost: Math.round(upg.cost * 2.8) } } },
      };
      if (upgradeId === 'slot')     next = { ...next, shop: { ...next.shop, slots: next.shop.slots + 1 } };
      if (upgradeId === 'capacity') {
        // Bug fix: capture the tank name from prev (pre-mutation) state so the log
        // message always names the tank the player was viewing when they clicked Buy.
        const tid = activeTankId;
        const expandedTankName = prev.tanks.find(t => t.id === tid)?.name || 'active tank';
        next = { ...next, tanks: next.tanks.map(t => t.id === tid ? { ...t, capacity: t.capacity + 4 } : t) };
        next = addLog(next, `📐 Tank Expansion Lv${upg.level + 1}: ${expandedTankName} now holds +4 more fish!`);
      }
      if (upgradeId === 'breeding') next = { ...next, breedingTank: { ...next.breedingTank, breedingDurationMs: Math.max(30_000, Math.round(next.breedingTank.breedingDurationMs * 0.80)) } };
      if (upgradeId === 'hatchery' && upg.level === 0) {
        const bt = next.breedingTank;
        // Bug fix: guard against double-expansion if buyUpgrade fires twice before
        // React re-renders settle (e.g. rapid double-click or concurrent state updates).
        if (bt.slots.length < 3) {
          next = { ...next, breedingTank: { ...bt, slots: [...bt.slots, null], storedGenomeC: null } };
        }
      }
      const newLevel = upg.level + 1;
      const logMessages = {
        lighting:   `💡 Premium Lighting Lv${newLevel}: sale prices +${newLevel * 10}%!`,
        vip:        `💎 VIP Membership Lv${newLevel}: Wealthy Patrons will visit ${newLevel === 1 ? 'sooner' : newLevel === 2 ? 'more often' : 'much more often'}!`,
        hatchery:   `🥚 Hatchery Lv${newLevel}: eggs & juveniles grow ${newLevel * 15}% faster!`,
        tankSitter: `🐟 Tank Sitter Lv${newLevel}: offline cap extended to ${48 + newLevel * 24}h!`,
        capacity:   null, // logged above with tank name; suppress generic fallback
      };
      playCoin();
      const upgradeMsg = logMessages[upgradeId];
      return upgradeMsg !== null
        ? addLog(next, upgradeMsg || `⬆️ Upgraded: ${upg.label} to level ${newLevel}!`)
        : next;
    });
  }, [activeTankId]);

  // ── Rare Market ───────────────────────────────────────────────
  const buyRareMarketItem = useCallback((item, tankId) => {
    setGame(prev => {
      const tid = tankId || activeTankId || prev.tanks[0]?.id;
      if (prev.player.coins < item.cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins! Need 🪙${item.cost}.`); }
      const today      = Math.floor(Date.now() / 86_400_000);
      const purchased  = prev.rareMarket?.purchased || [];
      const boughtToday = purchased.filter(p => p.day === today && p.itemId === item.id).length;
      if (boughtToday >= item.limit) return prev;

      let next = {
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - item.cost },
        rareMarket: { lastRefreshDay: today, purchased: [...purchased, { day: today, itemId: item.id }] },
      };

      if (item.type === 'supplies') {
        const tank = next.tanks.find(t => t.id === tid);
        if (tank) {
          const newSupplies = { ...tank.supplies };
          for (const [k, v] of Object.entries(item.supplies || {})) newSupplies[k] = (newSupplies[k] || 0) + v;
          next = {
            ...next,
            tanks: next.tanks.map(t => t.id === tid ? {
              ...t, supplies: newSupplies, waterQuality: item.restoreWater ? 100 : t.waterQuality,
            } : t),
          };
        }
      }
      if (item.type === 'decor') {
        const tank = next.tanks.find(t => t.id === tid);
        if (tank) {
          const owned = { ...(tank.decorations?.owned || {}) };
          owned[item.decorId] = (owned[item.decorId] || 0) + 1;
          next = { ...next, tanks: next.tanks.map(t => t.id === tid ? { ...t, decorations: { ...t.decorations, owned } } : t) };
        }
      }
      if (item.type === 'booster') {
        const boosts = { ...(next.player.boosts || {}) };
        const expiresAt = Math.max(boosts[item.boost] || 0, Date.now()) + (item.boostDurationMs || 600_000);
        boosts[item.boost] = expiresAt;
        next = { ...next, player: { ...next.player, boosts } };
      }
      playCoin();
      return addLog(next, `🌟 Bought ${item.label} from the market for 🪙${item.cost}!`);
    });
  }, [activeTankId]);

  // ── Move fish ─────────────────────────────────────────────────
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
        `🔀 Moved ${fish.species?.name || 'fish'} to ${target.name}.`,
      );
    });
  }, []);

  // ── Unlock tank ───────────────────────────────────────────────
  const unlockTank = useCallback((type) => {
    setGame(prev => {
      const unlock = TANK_UNLOCK[prev.tanks.length];
      if (!unlock) return addLog(prev, '⚠️ Max tanks already unlocked.');
      if (prev.player.coins < unlock.cost) { playWarning(); return addLog(prev, `⚠️ Need 🪙${unlock.cost} to unlock a new tank.`); }
      const newTankId = `tank_${prev.tanks.length}`;
      const newTank   = createDefaultTank(newTankId, type);
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - unlock.cost },
        tanks:  [...prev.tanks, newTank],
      }, `🏗️ Unlocked: ${newTank.name}!`);
    });
  }, []);

  // ── Rename tank ───────────────────────────────────────────────
  const renameTank = useCallback((tankId, name) => {
    setGame(prev => ({
      ...prev,
      tanks: prev.tanks.map(t => t.id === tankId ? { ...t, name } : t),
    }));
  }, []);

  // ── Decorations ───────────────────────────────────────────────
  const buyDecoration = useCallback((decorId) => {
    const decor = DECOR_CATALOG.find(d => d.id === decorId);
    if (!decor) return;
    setGame(prev => {
      if (prev.player.coins < decor.cost) { playWarning(); return addLog(prev, `⚠️ Not enough coins! Need 🪙${decor.cost}.`); }
      const tank = prev.tanks.find(t => t.id === activeTankId) || prev.tanks[0];
      const currentOwned = tank.decorations?.owned || {};
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - decor.cost },
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          decorations: { ...t.decorations, owned: { ...currentOwned, [decorId]: (currentOwned[decorId] || 0) + 1 } },
        } : t),
      }, `🎨 Bought ${decor.label} for 🪙${decor.cost}!`);
    });
  }, [activeTankId]);

  const claimUnlockedDecoration = useCallback((decorId) => {
    const decor = DECOR_CATALOG.find(d => d.id === decorId);
    if (!decor) return;
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === activeTankId) || prev.tanks[0];
      const currentOwned = tank.decorations?.owned || {};
      if ((currentOwned[decorId] || 0) > 0) return prev;
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          decorations: { ...t.decorations, owned: { ...currentOwned, [decorId]: 1 } },
        } : t),
      }, `🎨 ${decor.label} added to your decoration inventory!`);
    });
  }, [activeTankId]);

  const placeDecoration = useCallback((tankId, decorType, x, y, scale) => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === tankId);
      if (!tank) return prev;
      const owned = tank.decorations?.owned || {};
      if (!owned[decorType] || owned[decorType] < 1) return prev;
      const instanceId = `${decorType}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      const newOwned   = { ...owned, [decorType]: owned[decorType] - 1 };
      if (newOwned[decorType] <= 0) delete newOwned[decorType];
      const newPlaced  = [...(tank.decorations?.placed || []), { instanceId, type: decorType, x, y, scale }];
      return {
        ...prev,
        tanks: prev.tanks.map(t => t.id === tankId ? {
          ...t, decorations: { ...t.decorations, owned: newOwned, placed: newPlaced },
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
      const owned     = tank.decorations?.owned || {};
      const newOwned  = { ...owned, [item.type]: (owned[item.type] || 0) + 1 };
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tankId ? {
          ...t, decorations: { ...t.decorations, owned: newOwned, placed: newPlaced },
        } : t),
      }, `🎨 Removed decoration (returned to inventory).`);
    });
  }, []);

  // ── Tank Themes ───────────────────────────────────────────────
  const buyTheme = useCallback((tankId, themeId) => {
    const theme = TANK_THEMES.find(t => t.id === themeId);
    if (!theme) return;
    setGame(prev => {
      if (prev.player.coins < theme.cost) {
        playWarning();
        return addLog(prev, `⚠️ Not enough coins! Need 🪙${theme.cost}.`);
      }
      const tank = prev.tanks.find(t => t.id === tankId) || prev.tanks[0];
      const currentOwned = tank.themes?.owned || ['tropical'];
      if (currentOwned.includes(themeId)) return prev; // already owned
      playCoin();
      return addLog({
        ...prev,
        player: { ...prev.player, coins: prev.player.coins - theme.cost },
        tanks: prev.tanks.map(t => t.id === tank.id ? {
          ...t,
          themes: {
            ...t.themes,
            owned: [...currentOwned, themeId],
            active: themeId, // auto-apply on purchase
          },
        } : t),
      }, `🎨 Bought and applied the ${theme.label} theme!`);
    });
  }, []);

  const applyTheme = useCallback((tankId, themeId) => {
    setGame(prev => {
      const tank = prev.tanks.find(t => t.id === tankId);
      if (!tank) return prev;
      const theme = TANK_THEMES.find(t => t.id === themeId);
      if (!theme) return prev;
      return addLog({
        ...prev,
        tanks: prev.tanks.map(t => t.id === tankId ? {
          ...t,
          themes: { ...t.themes, active: themeId },
        } : t),
      }, `🎨 Applied the ${theme.label} theme to ${tank.name}!`);
    });
  }, []);

  // ── Breeding ──────────────────────────────────────────────────
  const selectForBreeding = useCallback((fishId) => {
    setGame(prev => {
      const bt           = prev.breedingTank;
      const hasThirdSlot = bt.slots.length >= 3;

      // Toggle off if already in any slot
      if (bt.slots.includes(fishId)) {
        const newSlots = bt.slots.map(s => s === fishId ? null : s);
        const fishC    = hasThirdSlot ? prev.fish.find(f => f.id === newSlots[2]) : null;
        return { ...prev, breedingTank: { ...bt, slots: newSlots, storedGenomeC: fishC?.genome ?? null } };
      }

      // Slot 0 first
      if (!bt.slots[0]) {
        return { ...prev, breedingTank: { ...bt, slots: [fishId, bt.slots[1], ...(hasThirdSlot ? [bt.slots[2] ?? null] : [])] } };
      }

      // Slot 1 — triggers breeding start
      if (!bt.slots[1]) {
        const fishA    = prev.fish.find(f => f.id === bt.slots[0]);
        const fishB    = prev.fish.find(f => f.id === fishId);
        const eggTank  = fishA?.tankId || 'tank_0';
        const hasBoost = (prev.tanks.find(t => t.id === eggTank)?.supplies?.breedingBoost || 0) > 0;
        const duration = hasBoost ? 10_000 : bt.breedingDurationMs;
        const supplies = hasBoost
          ? prev.tanks.map(t => t.id === eggTank
              ? { ...t, supplies: { ...t.supplies, breedingBoost: t.supplies.breedingBoost - 1 } }
              : t)
          : prev.tanks;
        const fishC = hasThirdSlot ? prev.fish.find(f => f.id === bt.slots[2]) : null;
        playBreed();
        return addLog({
          ...prev,
          tanks: supplies,
          player: { ...prev.player, stats: { ...(prev.player.stats || {}), totalFishBred: (prev.player.stats?.totalFishBred || 0) + 1 } },
          breedingTank: {
            ...bt,
            slots:              [bt.slots[0], fishId, ...(hasThirdSlot ? [bt.slots[2] ?? null] : [])],
            breedingStartedAt:  Date.now(),
            eggReady:           false,
            breedingDurationMs: duration,
            storedGenomeA:      fishA?.genome ?? null,
            storedGenomeB:      fishB?.genome ?? null,
            storedGenomeC:      fishC?.genome ?? null,
            storedTankId:       eggTank,
          },
        }, hasBoost ? '💉 Breeding boost active — 10 seconds!' : '💕 Breeding started!');
      }

      // Slot 2 (Genetic Donor) — only if hatchery unlocked and breeding not yet started
      if (hasThirdSlot && !bt.breedingStartedAt) {
        const fishC = prev.fish.find(f => f.id === fishId);
        return addLog({
          ...prev,
          breedingTank: { ...bt, slots: [bt.slots[0], bt.slots[1], fishId], storedGenomeC: fishC?.genome ?? null },
        }, `🧬 ${fishC?.species?.name || 'Fish'} added as Genetic Donor — traits will influence offspring!`);
      }

      return prev;
    });
  }, []);

  const cancelBreeding = useCallback(() => {
    setGame(prev => {
      const bt = prev.breedingTank;
      if (!bt.breedingStartedAt || bt.eggReady) return prev;
      const baseDuration = Math.max(30_000, 300_000 * Math.pow(0.80, (prev.shop.upgrades?.breeding?.level || 0)));
      const hasThirdSlot = bt.slots.length >= 3;
      return addLog({
        ...prev,
        breedingTank: {
          ...bt,
          slots:              hasThirdSlot ? [null, null, null] : [null, null],
          breedingStartedAt:  null,
          eggReady:           false,
          breedingDurationMs: Math.round(baseDuration),
          storedGenomeA:      null,
          storedGenomeB:      null,
          storedGenomeC:      null,
          storedTankId:       null,
        },
      }, '❌ Breeding cancelled.');
    });
  }, []);

  const collectEgg = useCallback(() => {
    setGame(prev => {
      const bt = prev.breedingTank;
      if (!bt.eggReady) return prev;
      const [idA, idB] = bt.slots;
      const fishA      = prev.fish.find(f => f.id === idA);
      const fishB      = prev.fish.find(f => f.id === idB);
      const genomeA    = fishA?.genome ?? bt.storedGenomeA;
      const genomeB    = fishB?.genome ?? bt.storedGenomeB;
      if (!genomeA || !genomeB) { playWarning(); return addLog(prev, '⚠️ Cannot collect egg — parent genome data missing.'); }
      const eggTankId = fishA?.tankId ?? bt.storedTankId ?? 'tank_0';
      const eggTank   = prev.tanks.find(t => t.id === eggTankId);
      const tankCount = prev.fish.filter(f => f.tankId === eggTankId).length;
      if (tankCount >= (eggTank?.capacity || 12)) { playWarning(); return addLog(prev, '⚠️ That tank is full! Move fish first.'); }
      const donorGenome      = bt.storedGenomeC ?? null;
      const offspringGenome  = breedGenomes(genomeA, genomeB, donorGenome);
      const donorNote        = donorGenome ? ' 🧬 Genetic donor influence applied!' : '';
      const newFish          = createFish({ genome: offspringGenome, stage: 'egg', parentIds: [idA, idB], tankId: eggTankId });
      const baseDuration     = Math.max(30_000, 300_000 * Math.pow(0.80, (prev.shop.upgrades?.breeding?.level || 0)));
      const hasThirdSlot     = bt.slots.length >= 3;
      playBreed();
      const eggState = addLog({
        ...prev,
        fish: [...prev.fish, newFish],
        breedingTank: {
          ...bt,
          slots:              hasThirdSlot ? [null, null, null] : [null, null],
          eggReady:           false,
          breedingStartedAt:  null,
          breedingDurationMs: Math.round(baseDuration),
          storedGenomeC:      null,
        },
        player: {
          ...prev.player,
          stats: { ...(prev.player.stats || {}), eggsCollected: (prev.player.stats?.eggsCollected || 0) + 1 },
        },
      }, `🥚 Egg collected in ${eggTank?.name || 'Tank'}! It might become a ${newFish.species?.name || 'fish'}.${donorNote}`);
      return updateChallengeProgress(eggState, 'collect_egg');
    });
  }, []);

  // ── Save management ───────────────────────────────────────────
  const resetGame = useCallback(() => {
    const fresh = createDefaultState();
    setGame(fresh);
    saveGame(fresh);
    setSelectedFishId(null);
    setActiveTankId('tank_0');
  }, [setSelectedFishId, setActiveTankId]);

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
  }, [setSelectedFishId, setActiveTankId]);

  return {
    // Tank actions
    treatWater, toggleAutoFeed, useHeater, unlockTank, renameTank,
    // Fish actions
    feedFish, useMedicine, moveFishToTank,
    // Shop
    toggleSellFish, setFishPrice, buySupply, buyFish, buyUpgrade,
    buyRareMarketItem,
    // Decorations
    buyDecoration, claimUnlockedDecoration, placeDecoration, removeDecoration,
    // Themes
    buyTheme, applyTheme,
    // Breeding
    selectForBreeding, cancelBreeding, collectEgg,
    // Save
    resetGame, handleExportSave, handleImportSave,
  };
}
