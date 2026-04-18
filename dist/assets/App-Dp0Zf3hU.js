const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/ClownfishSprite-Be5xIeQ7.js","assets/index-CuAPajpT.js","assets/BlueTangSprite-DKOt2oqC.js","assets/BettaSprite-CN98ICB0.js","assets/AngelFishSprite-34KYk87h.js","assets/GoldfishSprite-D2h-q7rJ.js","assets/MandarinDragonetSprite-ePZMOnO2.js","assets/NeonTetraSprite-MPKymvfT.js","assets/DiscusSprite-D-nmCQ1b.js","assets/LionfishSprite-CReCSRUM.js","assets/SeahorseSprite-C75doYBz.js","assets/PufferfishSprite-OWltuR6j.js","assets/JellyfishSprite-Dq18FRF_.js","assets/KoiSprite-HdPRLJkf.js","assets/MoorishIdolSprite-DymoLmDM.js","assets/TriggerSprite-BXdsUXgj.js","assets/ElectricEelSprite-BOSPRgav.js","assets/AxolotlSprite-W687WMHG.js","assets/YellowTangSprite-BlJhnvKD.js","assets/ArowanaSprite-Bw5VuTnD.js","assets/CherryShrimp-BOBd7Pzs.js","assets/OscarSprite-B7S4ibMw.js","assets/GuppySprite-DcEq5lBA.js","assets/CuttlefishSprite-CDMjkmAC.js","assets/CorydorasSprite-DICt-ps3.js","assets/HammerheadSprite-FnhAp_Yw.js","assets/NautilusSprite-BaNBej7b.js","assets/RecordsSection-BGV35fJ8.js","assets/gameStore-nJukt8N5.js","assets/OfficeSection-CRt1PuCw.js"])))=>i.map(i=>d[i]);
import { r as reactExports, j as jsxRuntimeExports, _ as __vitePreload, R as React } from "./index-CuAPajpT.js";
import { u as useGameStore, g as getBackground, a as getThemeById, b as getDecorById, S as SPRITE_SIZE, P as PERSONALITY_EMOJI, E as EGG_HATCH_ANIM_MS, R as REAL_SPECIES_MAP, G as GENES, e as expressGene, c as computePhenotype, d as getSpeciesFromPhenotype, f as RARITY, h as getCompat, i as getMarketMultiplier, D as DISEASES, j as getDiseaseStage, C as CURE_SUCCESS_RATE, L as LIFESPAN_BY_RARITY, k as getCarrierTraits, l as checkLegendaryCombo, m as getNextTankSize, n as getTankCompatSummary, T as TANK_UNLOCK, o as upgradeCost, p as getLevelTitle, q as getLevelFromXp, r as getCustomerInterval, s as predictOffspringPhenotypes, t as getMasterVolume, v as getMusicVolume, w as getSFXVolume, x as setMasterVolume, y as setMusicVolume, z as setSFXVolume, A as createFish, B as randomGenome, F as playDiscover, H as playBubble, I as playCoin, J as loadGame, K as startMusic, M as fishMatchesPoster, N as CAMPAIGN_LEVELS, O as getLevelById, Q as checkObjective, U as getObjectiveProgress, V as playVictory, W as getStarRating, X as EQUIPMENT_TYPES, Y as addLogDraft, Z as updateChallengeProgress, _ as MAGIC_FISH, $ as checkMagicFishMatch, a0 as playDiscoverScaled, a1 as ToastManager, a2 as playClick, a3 as isMusicPlaying, a4 as playTabSwitch, a5 as TANK_TYPES } from "./gameStore-nJukt8N5.js";
const API_URL = "https://api.anthropic.com/v1/messages";
const LS_KEY = "fishtycoon_api_key";
function getApiKey() {
  return localStorage.getItem(LS_KEY) || "";
}
function setApiKey(key) {
  if (key) localStorage.setItem(LS_KEY, key.trim());
  else localStorage.removeItem(LS_KEY);
}
const MIN_GAP_MS = 1200;
const MAX_DEPTH = 10;
const _queue = [];
const _pending = /* @__PURE__ */ new Set();
let _running = false;
let _lastEnd = 0;
function _enqueue(key, fn) {
  if (_pending.has(key)) return Promise.resolve(null);
  if (_queue.length >= MAX_DEPTH) return Promise.resolve(null);
  _pending.add(key);
  return new Promise((resolve, reject) => {
    _queue.push({ key, fn, resolve, reject });
    if (!_running) _drain();
  });
}
async function _drain() {
  _running = true;
  while (_queue.length > 0) {
    const gap = MIN_GAP_MS - (Date.now() - _lastEnd);
    if (gap > 0) await new Promise((r) => setTimeout(r, gap));
    const job = _queue.shift();
    _pending.delete(job.key);
    try {
      job.resolve(await job.fn());
    } catch (err) {
      job.reject(err);
    }
    _lastEnd = Date.now();
  }
  _running = false;
}
async function callClaude(prompt2) {
  var _a, _b, _c;
  const apiKey = getApiKey();
  if (!apiKey) return { error: AI_ERRORS.NO_KEY, text: null };
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1e3,
        messages: [{ role: "user", content: prompt2 }]
      })
    });
    if (res.status === 401 || res.status === 403) {
      return { error: AI_ERRORS.NO_API, text: null };
    }
    if (res.status === 429) {
      return { error: AI_ERRORS.RATE_LIMIT, text: null };
    }
    if (!res.ok) {
      return { error: AI_ERRORS.NETWORK, text: null };
    }
    const data = await res.json();
    const text = ((_c = (_b = (_a = data.content) == null ? void 0 : _a[0]) == null ? void 0 : _b.text) == null ? void 0 : _c.trim()) || null;
    return { error: null, text };
  } catch (err) {
    console.warn("[AI] Request failed:", err.message);
    return { error: AI_ERRORS.NETWORK, text: null };
  }
}
async function generateFishName(phenotype, rarity, geneticName) {
  const traits = [
    phenotype == null ? void 0 : phenotype.bodyShape,
    phenotype == null ? void 0 : phenotype.primaryColor,
    phenotype == null ? void 0 : phenotype.finType,
    phenotype == null ? void 0 : phenotype.pattern,
    (phenotype == null ? void 0 : phenotype.glow) && phenotype.glow !== "Normal" ? phenotype.glow : null,
    (phenotype == null ? void 0 : phenotype.mutation) && phenotype.mutation !== "None" ? phenotype.mutation : null,
    phenotype == null ? void 0 : phenotype.size
  ].filter(Boolean).join(", ");
  const rarityHint = rarity === "epic" ? "mythical and legendary-sounding" : rarity === "rare" ? "exotic and dramatic" : rarity === "uncommon" ? "evocative and interesting" : "simple and charming";
  const prompt2 = `You are naming a newly discovered tropical fish species for an aquarium game.

Genetic classification: ${geneticName}
Physical traits: ${traits}
Rarity tier: ${rarity} — make the name ${rarityHint}.

Rules:
- 2–4 words maximum
- Can be Latin-style, poetic common name, or mythological reference
- Must reflect the traits (color, shape, glow, mutation)
- Do NOT use the word "fish"
- Return ONLY the name, nothing else — no quotes, no explanation`;
  const result = await _enqueue(`name:${geneticName}`, async () => {
    const { text } = await callClaude(prompt2);
    if (text && text.length < 60 && !text.includes("\n")) return text;
    return null;
  });
  return result ?? null;
}
async function generateFishLore(phenotype, rarity, name) {
  const traits = [
    `Body: ${phenotype.bodyShape}`,
    `Color: ${phenotype.primaryColor}`,
    `Fins: ${phenotype.finType}`,
    `Pattern: ${phenotype.pattern}`,
    phenotype.glow !== "Normal" ? `Glow: ${phenotype.glow}` : null,
    phenotype.mutation !== "None" ? `Mutation: ${phenotype.mutation}` : null,
    `Size: ${phenotype.size}`,
    `Secondary color: ${phenotype.secondaryColor}`
  ].filter(Boolean).join("; ");
  const rarityNote = rarity === "epic" ? "This is an extremely rare species with near-mythical status." : rarity === "rare" ? "This is a rare species, prized by collectors." : rarity === "uncommon" ? "This species is somewhat uncommon in the wild." : "This is a relatively common species.";
  const prompt2 = `Write a short Fishdex entry for a fish species named "${name}".

Traits: ${traits}
${rarityNote}

Rules:
- Exactly 2–3 sentences
- Aquarium game style: evocative, scientific-ish, a little whimsical
- Mention habitat, behavior, or special biological quirks
- Reference specific traits (color, glow, shape) organically
- Return ONLY the lore text — no title, no labels, no quotes`;
  const result = await _enqueue(`lore:${name}`, () => callClaude(prompt2));
  if (!result) return { text: null, error: null };
  const { text, error } = result;
  if (error) return { text: null, error };
  return { text, error: null };
}
const MICRO_EVENT_TYPES = [
  { id: "pearl", emoji: "", label: "Pearl found!", coins: 8, xp: 2, weight: 4, duration: 4e3 },
  { id: "shell", emoji: "", label: "Shell discovered!", coins: 5, xp: 1, weight: 5, duration: 3500 },
  { id: "treasure", emoji: "", label: "Treasure!", coins: 25, xp: 5, weight: 1, duration: 3e3 },
  { id: "nuzzle", emoji: "", label: "Fish nuzzle!", coins: 0, xp: 3, weight: 3, duration: 5e3, needsTwoFish: true },
  { id: "trick", emoji: "", label: "Fish trick!", coins: 3, xp: 2, weight: 2, duration: 4e3, personality: "playful" },
  { id: "crab", emoji: "", label: "Hermit crab!", coins: 2, xp: 1, weight: 3, duration: 5e3 },
  { id: "starfish", emoji: "", label: "Starfish visit!", coins: 4, xp: 1, weight: 2, duration: 4500 }
];
function rollMicroEvent(fish, tankId, lastEventAt) {
  const now = Date.now();
  const minInterval = 8e3;
  if (now - (lastEventAt || 0) < minInterval) return null;
  const tankFish = fish.filter((f) => f.tankId === tankId && f.stage !== "egg");
  if (tankFish.length === 0) return null;
  if (Math.random() > 0.12) return null;
  const eligible = MICRO_EVENT_TYPES.filter((e) => {
    if (e.needsTwoFish && tankFish.length < 2) return false;
    if (e.personality && !tankFish.some((f) => f.personality === e.personality)) return false;
    return true;
  });
  if (eligible.length === 0) return null;
  const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * totalWeight;
  let picked = eligible[0];
  for (const e of eligible) {
    roll -= e.weight;
    if (roll <= 0) {
      picked = e;
      break;
    }
  }
  const sourceFish = tankFish[Math.floor(Math.random() * tankFish.length)];
  const x = Math.max(18, Math.min(82, (sourceFish.x || 50) + (Math.random() - 0.5) * 20));
  const y = Math.max(20, Math.min(78, (sourceFish.y || 50) + (Math.random() - 0.5) * 15));
  let secondFishId = null;
  if (picked.needsTwoFish) {
    const others = tankFish.filter((f) => f.id !== sourceFish.id);
    if (others.length > 0) secondFishId = others[Math.floor(Math.random() * others.length)].id;
  }
  return {
    id: crypto.randomUUID(),
    type: picked.id,
    emoji: picked.emoji,
    label: picked.label,
    coins: picked.coins,
    xp: picked.xp,
    x,
    y,
    fishId: sourceFish.id,
    secondFishId,
    duration: picked.duration,
    createdAt: now,
    tapped: false
  };
}
const ClownfishSprite = reactExports.lazy(() => __vitePreload(() => import("./ClownfishSprite-Be5xIeQ7.js"), true ? __vite__mapDeps([0,1]) : void 0));
const BlueTangSprite = reactExports.lazy(() => __vitePreload(() => import("./BlueTangSprite-DKOt2oqC.js"), true ? __vite__mapDeps([2,1]) : void 0));
const BettaSprite = reactExports.lazy(() => __vitePreload(() => import("./BettaSprite-CN98ICB0.js"), true ? __vite__mapDeps([3,1]) : void 0));
const AngelFishSprite = reactExports.lazy(() => __vitePreload(() => import("./AngelFishSprite-34KYk87h.js"), true ? __vite__mapDeps([4,1]) : void 0));
const GoldfishSprite = reactExports.lazy(() => __vitePreload(() => import("./GoldfishSprite-D2h-q7rJ.js"), true ? __vite__mapDeps([5,1]) : void 0));
const MandarinDragonetSprite = reactExports.lazy(() => __vitePreload(() => import("./MandarinDragonetSprite-ePZMOnO2.js"), true ? __vite__mapDeps([6,1]) : void 0));
const NeonTetraSprite = reactExports.lazy(() => __vitePreload(() => import("./NeonTetraSprite-MPKymvfT.js"), true ? __vite__mapDeps([7,1]) : void 0));
const DiscusSprite = reactExports.lazy(() => __vitePreload(() => import("./DiscusSprite-D-nmCQ1b.js"), true ? __vite__mapDeps([8,1]) : void 0));
const LionfishSprite = reactExports.lazy(() => __vitePreload(() => import("./LionfishSprite-CReCSRUM.js"), true ? __vite__mapDeps([9,1]) : void 0));
const SeahorseSprite = reactExports.lazy(() => __vitePreload(() => import("./SeahorseSprite-C75doYBz.js"), true ? __vite__mapDeps([10,1]) : void 0));
const PufferfishSprite = reactExports.lazy(() => __vitePreload(() => import("./PufferfishSprite-OWltuR6j.js"), true ? __vite__mapDeps([11,1]) : void 0));
const JellyfishSprite = reactExports.lazy(() => __vitePreload(() => import("./JellyfishSprite-Dq18FRF_.js"), true ? __vite__mapDeps([12,1]) : void 0));
const KoiSprite = reactExports.lazy(() => __vitePreload(() => import("./KoiSprite-HdPRLJkf.js"), true ? __vite__mapDeps([13,1]) : void 0));
const MoorishIdolSprite = reactExports.lazy(() => __vitePreload(() => import("./MoorishIdolSprite-DymoLmDM.js"), true ? __vite__mapDeps([14,1]) : void 0));
const TriggerSprite = reactExports.lazy(() => __vitePreload(() => import("./TriggerSprite-BXdsUXgj.js"), true ? __vite__mapDeps([15,1]) : void 0));
const ElectricEelSprite = reactExports.lazy(() => __vitePreload(() => import("./ElectricEelSprite-BOSPRgav.js"), true ? __vite__mapDeps([16,1]) : void 0));
const AxolotlSprite = reactExports.lazy(() => __vitePreload(() => import("./AxolotlSprite-W687WMHG.js"), true ? __vite__mapDeps([17,1]) : void 0));
const YellowTangSprite = reactExports.lazy(() => __vitePreload(() => import("./YellowTangSprite-BlJhnvKD.js"), true ? __vite__mapDeps([18,1]) : void 0));
const ArowanaSprite = reactExports.lazy(() => __vitePreload(() => import("./ArowanaSprite-Bw5VuTnD.js"), true ? __vite__mapDeps([19,1]) : void 0));
const CherryShrimpSprite = reactExports.lazy(() => __vitePreload(() => import("./CherryShrimp-BOBd7Pzs.js"), true ? __vite__mapDeps([20,1]) : void 0));
const OscarSprite = reactExports.lazy(() => __vitePreload(() => import("./OscarSprite-B7S4ibMw.js"), true ? __vite__mapDeps([21,1]) : void 0));
const GuppySprite = reactExports.lazy(() => __vitePreload(() => import("./GuppySprite-DcEq5lBA.js"), true ? __vite__mapDeps([22,1]) : void 0));
const CuttlefishSprite = reactExports.lazy(() => __vitePreload(() => import("./CuttlefishSprite-CDMjkmAC.js"), true ? __vite__mapDeps([23,1]) : void 0));
const CorydorasSprite = reactExports.lazy(() => __vitePreload(() => import("./CorydorasSprite-DICt-ps3.js"), true ? __vite__mapDeps([24,1]) : void 0));
const HammerheadSprite = reactExports.lazy(() => __vitePreload(() => import("./HammerheadSprite-FnhAp_Yw.js"), true ? __vite__mapDeps([25,1]) : void 0));
const NautilusSprite = reactExports.lazy(() => __vitePreload(() => import("./NautilusSprite-BaNBej7b.js"), true ? __vite__mapDeps([26,1]) : void 0));
const SPECIES_SPRITE_MAP = {
  clownfish: ClownfishSprite,
  bluetang: BlueTangSprite,
  betta: BettaSprite,
  angelfish: AngelFishSprite,
  goldfish: GoldfishSprite,
  mandarin_dragonet: MandarinDragonetSprite,
  neon_tetra: NeonTetraSprite,
  discus: DiscusSprite,
  lionfish: LionfishSprite,
  seahorse: SeahorseSprite,
  pufferfish: PufferfishSprite,
  jellyfish: JellyfishSprite,
  koi: KoiSprite,
  moorish_idol: MoorishIdolSprite,
  triggerfish: TriggerSprite,
  electric_eel: ElectricEelSprite,
  axolotl: AxolotlSprite,
  yellow_tang: YellowTangSprite,
  arowana: ArowanaSprite,
  cherry_shrimp: CherryShrimpSprite,
  oscar: OscarSprite,
  guppy: GuppySprite,
  cuttlefish: CuttlefishSprite,
  corydoras: CorydorasSprite,
  hammerhead: HammerheadSprite,
  nautilus: NautilusSprite
};
const BODY_COLORS = {
  Crimson: {
    body: "#d94040",
    body2: "#c02828",
    belly: "#f07070",
    fin: "#a81818",
    fin2: "#e05858",
    accent: "#ff9090",
    scale: "#b83030",
    light: "#ff9090",
    shadow: "#7a0f0f",
    lateral: "#ffb0b0"
  },
  Gold: {
    body: "#d4920a",
    body2: "#b87800",
    belly: "#f8d060",
    fin: "#a06000",
    fin2: "#e0a820",
    accent: "#ffe080",
    scale: "#c07800",
    light: "#ffe090",
    shadow: "#704000",
    lateral: "#fff0a0"
  },
  Violet: {
    body: "#8830c8",
    body2: "#6818a8",
    belly: "#c070f0",
    fin: "#501090",
    fin2: "#a040d8",
    accent: "#e0a0ff",
    scale: "#7020b0",
    light: "#e0a0ff",
    shadow: "#2a0060",
    lateral: "#f0c0ff"
  },
  Azure: {
    body: "#1870d0",
    body2: "#0c54b0",
    belly: "#60b0f8",
    fin: "#083890",
    fin2: "#2888e0",
    accent: "#90d0ff",
    scale: "#0e60b8",
    light: "#90d8ff",
    shadow: "#041a60",
    lateral: "#b0e8ff"
  },
  Emerald: {
    body: "#1a9848",
    body2: "#0e7832",
    belly: "#50d880",
    fin: "#086028",
    fin2: "#28b858",
    accent: "#80f0a8",
    scale: "#128038",
    light: "#80f0a8",
    shadow: "#033018",
    lateral: "#a0ffcc"
  },
  White: {
    body: "#b8c8d8",
    body2: "#98aabb",
    belly: "#e8f0f8",
    fin: "#7890a8",
    fin2: "#c8d8e8",
    accent: "#ffffff",
    scale: "#a0b8cc",
    light: "#ffffff",
    shadow: "#4a6070",
    lateral: "#ffffff"
  }
};
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.18, blur: 5 },
  rare: { color: "#c878ff", opacity: 0.3, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.42, blur: 11, pulse: true },
  legendary: { color: "#ff60ff", opacity: 0.55, blur: 14, pulse: true, rainbow: true }
};
function EggSprite({ uid, size, aura, isGlow, selected, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 60 64",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `eshadow-${uid}`, x: "-35%", y: "-25%", width: "170%", height: "180%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "feDropShadow",
            {
              dx: "0",
              dy: "5",
              stdDeviation: "3.5",
              floodColor: "#000",
              floodOpacity: "0.35"
            }
          ) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `eaura-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `eg-${uid}`, cx: "30%", cy: "25%", r: "68%", fx: "26%", fy: "20%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#fff8e8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "35%", stopColor: "#f8e8b8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "68%", stopColor: "#f0d898" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c8a050" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egdorsal-${uid}`, cx: "50%", cy: "0%", r: "72%", fx: "50%", fy: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#80500a", stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#80500a", stopOpacity: "0.08" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#80500a", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egbelly-${uid}`, cx: "50%", cy: "100%", r: "60%", fx: "50%", fy: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#fff8d0", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#fff8d0", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egspec-${uid}`, cx: "28%", cy: "22%", r: "38%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "30",
            cy: "34",
            rx: "20",
            ry: "24",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#eaura-${uid})`
          }
        ),
        isGlow && !aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "34", rx: "20", ry: "24", fill: "#ffffa0", opacity: "0.32" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#eshadow-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "34", rx: "13", ry: "17", fill: `url(#eg-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "34", rx: "13", ry: "17", fill: `url(#egdorsal-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "34", rx: "13", ry: "17", fill: `url(#egbelly-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "34", rx: "13", ry: "17", fill: `url(#egspec-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "30",
            cy: "34",
            rx: "13",
            ry: "17",
            fill: "none",
            stroke: "#c8a060",
            strokeWidth: "1.1",
            opacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "23",
            cy: "25",
            rx: "4.5",
            ry: "6.5",
            fill: "white",
            opacity: "0.52",
            transform: "rotate(-15,23,25)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "23", rx: "1.8", ry: "2.8", fill: "white", opacity: "0.38" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "53", rx: "10", ry: "2.2", fill: "#000", opacity: "0.12" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "30",
            cy: "34",
            rx: "18",
            ry: "22",
            fill: "none",
            stroke: "#b0944a",
            strokeWidth: "2",
            strokeDasharray: "5 3",
            opacity: "0.9",
            style: { animation: "shimmer-ring-march 0.9s linear infinite" }
          }
        )
      ]
    }
  );
}
function JuvenileSprite({ uid, C, size, aura, isGlow, isSpot, selected, flipped, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size * 0.75,
      viewBox: "0 0 70 52",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `jshadow-${uid}`, x: "-35%", y: "-35%", width: "170%", height: "200%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "feDropShadow",
            {
              dx: "0",
              dy: "4",
              stdDeviation: "3",
              floodColor: "#000",
              floodOpacity: "0.32"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `jfinglow-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.5", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.accent, floodOpacity: "0.40", result: "colour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "colour", in2: "blur", operator: "in", result: "glowColour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glowColour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `jaura-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jb-${uid}`, cx: "30%", cy: "24%", r: "72%", fx: "26%", fy: "20%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.belly }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "65%", stopColor: C.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.body2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jd-${uid}`, cx: "50%", cy: "0%", r: "80%", fx: "50%", fy: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.shadow, stopOpacity: "0.50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.shadow, stopOpacity: "0.10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.shadow, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jbelly-${uid}`, cx: "50%", cy: "100%", r: "60%", fx: "50%", fy: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light, stopOpacity: "0.50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.light, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jspec-${uid}`, cx: "28%", cy: "20%", r: "42%", fx: "24%", fy: "16%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "white", stopOpacity: "0.15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `jf-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.accent, stopOpacity: "0.88" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.fin2, stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.fin, stopOpacity: "0.28" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `jc-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "18", ry: "12" }) })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "36",
            cy: "28",
            rx: "28",
            ry: "20",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#jaura-${uid})`
          }
        ),
        isGlow && !aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "26", ry: "18", fill: "#ffffa0", opacity: "0.28" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M18,28 Q6,20 8,28 Q6,36 18,28",
            fill: `url(#jf-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.7",
            strokeOpacity: "0.65",
            filter: `url(#jfinglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M28,16 Q36,10 44,16",
            fill: `url(#jf-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.6",
            strokeOpacity: "0.55",
            filter: `url(#jfinglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#jshadow-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "18", ry: "12", fill: `url(#jb-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "18", ry: "12", fill: `url(#jd-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "18", ry: "12", fill: `url(#jbelly-${uid})` }),
        isSpot ? /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#jc-${uid})`, opacity: "0.38", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "34", cy: "26", r: "3.5", fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "42", cy: "30", r: "2.5", fill: C.fin })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#jc-${uid})`, opacity: "0.25", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "34", cy: "24", rx: "10", ry: "1.5", fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "31", rx: "9", ry: "1.2", fill: C.fin })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "28", rx: "18", ry: "12", fill: `url(#jspec-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "44", cy: "21", rx: "2.5", ry: "1.8", fill: "white", opacity: "0.60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "24", r: "4.2", fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50", cy: "24", r: "4.2", fill: "none", stroke: C.body2, strokeWidth: "0.6", opacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50.5", cy: "24.2", r: "2.4", fill: "#111" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "50.5", cy: "24.2", r: "2.4", fill: "none", stroke: C.accent, strokeWidth: "0.7", opacity: "0.7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "51.5", cy: "23", r: "0.9", fill: "white", opacity: "0.92" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "36", cy: "42", rx: "14", ry: "2.2", fill: "#000", opacity: "0.11" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "36",
            cy: "28",
            rx: "25",
            ry: "19",
            fill: "none",
            stroke: "#b0944a",
            strokeWidth: "2",
            strokeDasharray: "5 3",
            opacity: "0.9",
            style: { animation: "shimmer-ring-march 0.9s linear infinite" }
          }
        )
      ]
    }
  );
}
function FishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const { phenotype, species } = fish;
  const C = BODY_COLORS[phenotype.primaryColor] || BODY_COLORS.Crimson;
  const isGlow = phenotype.glow === "Luminous";
  const isGiant = phenotype.size === "Giant";
  const isSpot = phenotype.pattern === "Spotted";
  const rarity = (species == null ? void 0 : species.rarity) || "common";
  const aura = RARITY_AURA[rarity];
  const uid = (fish.id || "x").slice(0, 8);
  if (((_a = fish.species) == null ? void 0 : _a.visualType) === "species") {
    const SpeciesSprite = SPECIES_SPRITE_MAP[fish.species.key];
    if (SpeciesSprite) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: size, height: size * 0.65 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(SpeciesSprite, { fish, size, flipped, selected, onClick }) });
    }
  }
  if (fish.stage === "egg") return /* @__PURE__ */ jsxRuntimeExports.jsx(EggSprite, { uid, size, aura, isGlow, selected, onClick });
  if (fish.stage === "juvenile") return /* @__PURE__ */ jsxRuntimeExports.jsx(JuvenileSprite, { uid, size, C, aura, isGlow, isSpot, selected, flipped, onClick });
  const W = isGiant ? size * 1.35 : size;
  const _h = isGiant ? size * 0.85 : size * 0.65;
  const shape = phenotype.bodyShape;
  const isRound = shape === "Round" || shape === "Orb";
  const fin = phenotype.finType;
  const BODY_GEOM = {
    Orb: { cx: 44, cy: 30, rx: 22, ry: 22, path: null },
    // perfect circle
    Round: { cx: 45, cy: 30, rx: 28, ry: 20, path: null },
    // wide ellipse
    Delta: { cx: 46, cy: 30, rx: 24, ry: 16, path: "M70,30 C70,18 58,12 42,14 C28,16 18,22 18,30 C18,38 28,44 42,46 C58,48 70,42 70,30 Z" },
    Slender: { cx: 48, cy: 30, rx: 30, ry: 11, path: "M78,30 C78,22 65,16 48,16 C30,16 14,22 14,30 C14,38 30,44 48,44 C65,44 78,38 78,30 Z" },
    Eel: { cx: 50, cy: 30, rx: 38, ry: 8, path: "M88,30 C88,24 75,20 55,20 C35,20 15,24 10,30 C15,36 35,40 55,40 C75,40 88,36 88,30 Z" }
  };
  const geom = BODY_GEOM[shape] || BODY_GEOM.Round;
  const { cx, cy, rx, ry } = geom;
  const tailX = shape === "Eel" ? 12 : cx - rx;
  const bodyClipContent = geom.path ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geom.path }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx, ry });
  const bodyFillContent = geom.path ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geom.path, fill: `url(#body-${uid})` }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx, ry, fill: `url(#body-${uid})` });
  const bodyOverlay = (gradId) => geom.path ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geom.path, fill: `url(#${gradId})` }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx, ry, fill: `url(#${gradId})` });
  const FIN_STYLE = {
    Veil: { dorsalH: 26, tailSpread: 28, pectoralRx: 13, pectoralRy: 5, flowing: true },
    Flowing: { dorsalH: 22, tailSpread: 24, pectoralRx: 11, pectoralRy: 4.5, flowing: true },
    Broad: { dorsalH: 16, tailSpread: 18, pectoralRx: 10, pectoralRy: 5.5, flowing: false },
    Angular: { dorsalH: 18, tailSpread: 16, pectoralRx: 8, pectoralRy: 3, flowing: false },
    Nub: { dorsalH: 8, tailSpread: 10, pectoralRx: 5, pectoralRy: 2, flowing: false }
  };
  const finStyle = FIN_STYLE[fin] || FIN_STYLE.Broad;
  const pattern = phenotype.pattern;
  const isTiger = pattern === "Tiger";
  const isMarble = pattern === "Marble";
  const isLined = pattern === "Lined";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 100 60",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `fshadow-${uid}`, x: "-28%", y: "-35%", width: "156%", height: "200%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "feDropShadow",
            {
              dx: "0",
              dy: "6",
              stdDeviation: "4",
              floodColor: "#000",
              floodOpacity: "0.40"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `finglow-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.2", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.accent, floodOpacity: "0.48", result: "colour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "colour", in2: "blur", operator: "in", result: "glowColour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glowColour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          isGlow && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `fglow-${uid}`, x: "-35%", y: "-35%", width: "170%", height: "170%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "5", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `faura-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `body-${uid}`, cx: "28%", cy: "22%", r: "74%", fx: "24%", fy: "17%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "28%", stopColor: C.belly }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: C.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.body2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `dorsal-${uid}`, cx: "50%", cy: "0%", r: "88%", fx: "50%", fy: "0%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.shadow, stopOpacity: "0.58" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "48%", stopColor: C.shadow, stopOpacity: "0.14" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.shadow, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `belly-${uid}`, cx: "50%", cy: "100%", r: "68%", fx: "50%", fy: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light, stopOpacity: "0.58" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: C.light, stopOpacity: "0.18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.light, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `lateral-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lateral, stopOpacity: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.lateral, stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lateral, stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "70%", stopColor: C.lateral, stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lateral, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `spec-${uid}`, cx: "28%", cy: "20%", r: "44%", fx: "23%", fy: "15%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.78" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "white", stopOpacity: "0.18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `fin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.accent, stopOpacity: "0.88" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.fin2, stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.fin, stopOpacity: "0.30" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `bc-${uid}`, children: bodyClipContent })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx,
            cy,
            rx: rx + 16,
            ry: ry + 14,
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#faura-${uid})`
          }
        ),
        isGlow && !aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx,
            cy,
            rx: rx + 14,
            ry: ry + 12,
            fill: "#ffffa0",
            opacity: "0.22",
            filter: `url(#fglow-${uid})`
          }
        ),
        finStyle.flowing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#finglow-${uid})`, className: "fish-tail-flowing", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${tailX + 4},${cy - 2} C${tailX - 10},${cy - 10} ${tailX - finStyle.tailSpread},${cy - finStyle.tailSpread} ${tailX - finStyle.tailSpread * 0.6},${cy - 4} Z`,
              fill: `url(#fin-${uid})`,
              stroke: C.accent,
              strokeWidth: "0.9",
              strokeOpacity: "0.75"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${tailX + 4},${cy + 2} C${tailX - 10},${cy + 10} ${tailX - finStyle.tailSpread},${cy + finStyle.tailSpread} ${tailX - finStyle.tailSpread * 0.6},${cy + 4} Z`,
              fill: `url(#fin-${uid})`,
              stroke: C.accent,
              strokeWidth: "0.9",
              strokeOpacity: "0.75"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${tailX + 5},${cy} C${tailX - 6},${cy - 5} ${tailX - 15},${cy - 2} ${tailX - 10},${cy} C${tailX - 15},${cy + 2} ${tailX - 6},${cy + 5} ${tailX + 5},${cy}`,
              fill: C.light,
              opacity: "0.42"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M${tailX + 3},${cy - 3} L${tailX - finStyle.tailSpread * 0.8},${cy - finStyle.tailSpread} L${tailX - finStyle.tailSpread * 0.8},${cy} L${tailX - finStyle.tailSpread * 0.8},${cy + finStyle.tailSpread} L${tailX + 3},${cy + 3} Z`,
            fill: `url(#fin-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.8",
            strokeOpacity: "0.65",
            filter: `url(#finglow-${uid})`,
            className: "fish-tail"
          }
        ),
        finStyle.flowing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M${cx - rx * 0.5},${cy - ry} C${cx - rx * 0.1},${cy - ry - finStyle.dorsalH} ${cx + rx * 0.2},${cy - ry - finStyle.dorsalH * 0.8} ${cx + rx * 0.5},${cy - ry + 1}`,
            fill: `url(#fin-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.85",
            strokeOpacity: "0.68",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            filter: `url(#finglow-${uid})`,
            className: "fish-dorsal"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M${cx - rx * 0.4},${cy - ry} C${cx - rx * 0.1},${cy - ry - finStyle.dorsalH} ${cx + rx * 0.2},${cy - ry - finStyle.dorsalH * 0.75} ${cx + rx * 0.4},${cy - ry + 1}`,
            fill: `url(#fin-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.75",
            strokeOpacity: "0.62",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            filter: `url(#finglow-${uid})`,
            className: "fish-dorsal"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-anal-fin",
            d: `M${cx - rx * 0.1},${cy + ry} C${cx + rx * 0.1},${cy + ry + 11} ${cx + rx * 0.35},${cy + ry + 9} ${cx + rx * 0.4},${cy + ry}`,
            fill: `url(#fin-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.65",
            strokeOpacity: "0.52",
            filter: `url(#finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            className: "fish-pectoral",
            cx: cx + rx * 0.05,
            cy: cy + ry * 0.55,
            rx: finStyle.pectoralRx,
            ry: finStyle.pectoralRy,
            fill: `url(#fin-${uid})`,
            stroke: C.accent,
            strokeWidth: "0.65",
            strokeOpacity: "0.55",
            transform: `rotate(-25,${cx + rx * 0.05},${cy + ry * 0.55})`,
            filter: `url(#finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#fshadow-${uid})`, children: bodyFillContent }),
        bodyOverlay(`dorsal-${uid}`),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: `url(#bc-${uid})`, opacity: "0.13", children: Array.from({ length: 4 }).map(
          (_, row) => Array.from({ length: 7 }).map((_2, col) => {
            const sx = cx - rx + col * (rx * 2 / 6) + (row % 2 === 0 ? 0 : rx / 6);
            const sy = cy - ry + row * (ry * 2 / 3.5);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "ellipse",
              {
                cx: sx,
                cy: sy,
                rx: rx * 0.19,
                ry: ry * 0.23,
                fill: "none",
                stroke: C.scale,
                strokeWidth: "0.9"
              },
              `${row}-${col}`
            );
          })
        ) }),
        isSpot && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#bc-${uid})`, opacity: "0.36", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + 4, cy: cy - 5, r: rx * 0.22, fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx - 6, cy: cy + 4, r: rx * 0.18, fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + 12, cy: cy + 5, r: rx * 0.15, fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx - 2, cy: cy - 2, r: rx * 0.1, fill: C.fin, opacity: "0.6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx - 10, cy: cy - 6, r: rx * 0.12, fill: C.fin, opacity: "0.5" })
        ] }),
        isTiger && /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: `url(#bc-${uid})`, opacity: "0.35", children: [-0.4, -0.15, 0.1, 0.35].map((off, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: cx + rx * off,
            cy,
            rx: rx * 0.06,
            ry: ry * 0.85,
            fill: C.fin,
            transform: `rotate(${10 - i * 5},${cx + rx * off},${cy})`
          },
          i
        )) }),
        isMarble && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#bc-${uid})`, opacity: "0.28", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${cx - rx * 0.6},${cy - ry * 0.3} Q${cx - rx * 0.2},${cy + ry * 0.4} ${cx + rx * 0.3},${cy - ry * 0.2} T${cx + rx * 0.7},${cy + ry * 0.1}`,
              stroke: C.fin,
              strokeWidth: rx * 0.12,
              fill: "none",
              strokeLinecap: "round"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${cx - rx * 0.3},${cy + ry * 0.5} Q${cx},${cy - ry * 0.3} ${cx + rx * 0.5},${cy + ry * 0.3}`,
              stroke: C.fin,
              strokeWidth: rx * 0.08,
              fill: "none",
              strokeLinecap: "round",
              opacity: "0.6"
            }
          )
        ] }),
        isLined && /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#bc-${uid})`, opacity: "0.25", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy: cy - ry * 0.35, rx: rx * 0.75, ry: 2.2, fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: cx - 2, cy: cy + ry * 0.25, rx: rx * 0.65, ry: 1.8, fill: C.fin }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: cx + 2, cy: cy - ry * 0.05, rx: rx * 0.5, ry: 1.2, fill: C.fin, opacity: "0.7" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: cx - rx * 0.05,
            cy: cy - ry * 0.08,
            rx: rx * 0.8,
            ry: ry * 0.2,
            fill: `url(#lateral-${uid})`,
            opacity: "0.55"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: cx + rx * 0.1,
            cy: cy + ry * 0.4,
            rx: rx * 0.6,
            ry: ry * 0.44,
            fill: `url(#belly-${uid})`
          }
        ),
        bodyOverlay(`spec-${uid}`),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: cx + rx * 0.46,
            cy: cy - ry * 0.54,
            rx: rx * 0.1,
            ry: ry * 0.09,
            fill: "white",
            opacity: "0.72"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: cx - rx * 0.2,
            cy: cy - ry * 0.62,
            rx: rx * 0.05,
            ry: ry * 0.045,
            fill: "white",
            opacity: "0.42"
          }
        ),
        isGlow && (geom.path ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: geom.path, fill: "#ffffa0", opacity: "0.12", filter: `url(#fglow-${uid})` }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx, cy, rx, ry, fill: "#ffffa0", opacity: "0.12", filter: `url(#fglow-${uid})` })),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + rx * 0.72, cy: cy - ry * 0.18, r: isRound ? 5.8 : 4.8, fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: cx + rx * 0.72,
            cy: cy - ry * 0.18,
            r: isRound ? 5.8 : 4.8,
            fill: "none",
            stroke: C.body2,
            strokeWidth: "0.7",
            opacity: "0.45"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + rx * 0.72, cy: cy - ry * 0.15, r: isRound ? 3.3 : 2.6, fill: "#111" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: cx + rx * 0.72,
            cy: cy - ry * 0.15,
            r: isRound ? 3.3 : 2.6,
            fill: "none",
            stroke: C.accent,
            strokeWidth: "0.9",
            opacity: "0.78"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + rx * 0.78, cy: cy - ry * 0.3, r: 1.3, fill: "white", opacity: "0.95" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: cx + rx * 0.67, cy: cy - ry * 0.05, r: 0.6, fill: "white", opacity: "0.55" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M${cx + rx - 1},${cy + ry * 0.12} Q${cx + rx + 3},${cy + ry * 0.28} ${cx + rx},${cy + ry * 0.4}`,
            stroke: "#33222a",
            strokeWidth: "1.3",
            fill: "none",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx,
            cy: cy + ry + 14,
            rx: rx * 0.74,
            ry: 2.8,
            fill: "#000",
            opacity: "0.13"
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx,
            cy,
            rx: rx + 9,
            ry: ry + 8,
            fill: "none",
            stroke: "#b0944a",
            strokeWidth: "2.5",
            strokeDasharray: "6 3",
            opacity: "0.92",
            style: { animation: "shimmer-ring-march 0.9s linear infinite" }
          }
        )
      ]
    }
  );
}
const FishSprite$1 = reactExports.memo(
  FishSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.health) === ((_d = next.fish) == null ? void 0 : _d.health) && ((_e = prev.fish) == null ? void 0 : _e.stage) === ((_f = next.fish) == null ? void 0 : _f.stage) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && prev.selected === next.selected && prev.size === next.size && prev.flipped === next.flipped;
  }
);
const SWIM_SPEED = 7e-3;
const BOB_AMP = 0.025;
const BOB_FREQ = 0.018;
const TURN_CHANCE = 18e-4;
function getBehaviorProfile(fish) {
  var _a, _b;
  if (((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.visualType) === "species" && fish.species.key) {
    return ((_b = REAL_SPECIES_MAP[fish.species.key]) == null ? void 0 : _b.behaviorProfile) || null;
  }
  return null;
}
const DEPTH_LAYERS = [
  { scale: 0.62, opacity: 0.52, z: 7, blur: 0.7 },
  { scale: 1, opacity: 0.85, z: 10, blur: 0 },
  { scale: 1.22, opacity: 1, z: 13, blur: 0 }
];
function getDayPhase(gc) {
  const d = gc ? new Date(gc) : /* @__PURE__ */ new Date();
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 5 && h < 7) return { phase: "dawn", label: "DAWN" };
  if (h >= 7 && h < 17) return { phase: "day", label: "DAY" };
  if (h >= 17 && h < 20) return { phase: "dusk", label: "DUSK" };
  if (h >= 20 && h < 22) return { phase: "evening", label: "EVE" };
  return { phase: "night", label: "NIGHT" };
}
const DAY_PHASE_STYLES = {
  dawn: { overlay: "linear-gradient(180deg, rgba(255,140,50,0.25) 0%, rgba(255,100,30,0.08) 100%)", rayOpacity: 0.6, starCount: 0 },
  day: { overlay: "rgba(160,210,240,0.04)", rayOpacity: 0.95, starCount: 0 },
  dusk: { overlay: "linear-gradient(180deg, rgba(200,60,20,0.28) 0%, rgba(120,30,60,0.15) 100%)", rayOpacity: 0.35, starCount: 0 },
  evening: { overlay: "linear-gradient(180deg, rgba(30,15,60,0.35) 0%, rgba(10,10,40,0.20) 100%)", rayOpacity: 0.15, starCount: 5 },
  night: { overlay: "linear-gradient(180deg, rgba(5,5,30,0.45) 0%, rgba(0,0,15,0.30) 100%)", rayOpacity: 0.08, starCount: 12 }
};
const STARS = Array.from({ length: 12 }, (_, i) => ({
  x: (i * 73 + 17) % 90 + 3,
  y: (i * 41 + 11) % 22 + 2,
  r: i * 7 % 3 * 0.4 + 0.6,
  delay: i * 0.3 % 2
}));
const CORNER_BOLTS = [
  { corner: "tl", style: { top: 7, left: 7 } },
  { corner: "tr", style: { top: 7, right: 7 } },
  { corner: "bl", style: { bottom: 7, left: 7 } },
  { corner: "br", style: { bottom: 7, right: 7 } }
];
function TankView({ fish, selectedFishId, onSelectFish, waterQuality, tank, listedFishIds = [] }) {
  var _a, _b, _c, _d, _e;
  const fishMapRef = reactExports.useRef({});
  const fishIds = fish.map((f) => f.id).join(",");
  fishMapRef.current = reactExports.useMemo(
    () => Object.fromEntries(fish.map((f) => [f.id, f])),
    [fishIds]
    // eslint-disable-line react-hooks/exhaustive-deps
  );
  const posRef = reactExports.useRef({});
  const [, setFrame] = reactExports.useState(0);
  const initPos = (f) => {
    const bp = getBehaviorProfile(f);
    const [minY, maxY] = (bp == null ? void 0 : bp.preferredYRange) ?? [20, 75];
    return {
      x: f.x ?? 10 + Math.random() * 80,
      y: f.y ?? minY + Math.random() * (maxY - minY),
      vx: (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.1),
      vy: 0,
      flipped: Math.random() > 0.5,
      phase: Math.random() * Math.PI * 2,
      depthLayer: Math.floor(Math.random() * 3),
      tilt: 0,
      isIdle: false,
      idleTimer: Math.floor(Math.random() * 200)
    };
  };
  if (Object.keys(posRef.current).length === 0 && fish.length > 0) {
    for (const f of fish) posRef.current[f.id] = initPos(f);
  }
  reactExports.useEffect(() => {
    const pos = posRef.current;
    for (const f of fish) {
      if (!pos[f.id]) pos[f.id] = initPos(f);
    }
    const ids = new Set(fish.map((f) => f.id));
    for (const id of Object.keys(pos)) {
      if (!ids.has(id)) delete pos[id];
    }
  }, [fishIds]);
  const positions = posRef.current;
  const gameClock = useGameStore((s) => s.gameClock);
  const [dayPhase, setDayPhase] = reactExports.useState(() => getDayPhase(gameClock));
  const [hoveredFishId, setHoveredFishId] = reactExports.useState(null);
  const [ripples, setRipples] = reactExports.useState([]);
  const [feedSplash, setFeedSplash] = reactExports.useState(0);
  const [sparkles, setSparkles] = reactExports.useState([]);
  const [justClickedId, setJustClickedId] = reactExports.useState(null);
  const [clickBubbles, setClickBubbles] = reactExports.useState([]);
  const [swimBubbles, setSwimBubbles] = reactExports.useState([]);
  const [coinShowers, setCoinShowers] = reactExports.useState([]);
  const [speechBubbles, setSpeechBubbles] = reactExports.useState([]);
  const cursorRef = reactExports.useRef({ x: -100, y: -100 });
  const tankElRef = reactExports.useRef(null);
  const tickRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      const positions2 = posRef.current;
      const alive = fish.filter((f2) => f2.stage !== "egg");
      if (alive.length === 0) return;
      const f = alive[Math.floor(Math.random() * alive.length)];
      const pos = positions2[f.id];
      if (!pos || pos.isIdle) return;
      const bx = pos.flipped ? pos.x - 2 : pos.x + 2;
      const by = pos.y - 1;
      const bid = `sb-${Date.now()}-${Math.random()}`;
      setSwimBubbles((prev) => [...prev.slice(-12), {
        id: bid,
        x: bx,
        y: by,
        size: 2 + Math.random() * 3,
        drift: (Math.random() - 0.5) * 3
      }]);
      setTimeout(() => setSwimBubbles((prev) => prev.filter((b) => b.id !== bid)), 2e3);
    }, 300);
    return () => clearInterval(interval);
  }, [fish]);
  const [microEvents, setMicroEvents] = reactExports.useState([]);
  const lastMicroRef = reactExports.useRef(0);
  const claimMicroEvent = useGameStore((s) => s.claimMicroEvent);
  const weather = useGameStore((s) => s.weather);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
      const evt = rollMicroEvent(fish, tank == null ? void 0 : tank.id, lastMicroRef.current);
      if (evt) {
        lastMicroRef.current = Date.now();
        setMicroEvents((prev) => [...prev.slice(-3), evt]);
        setTimeout(() => {
          setMicroEvents((prev) => prev.filter((e) => e.id !== evt.id));
        }, evt.duration);
      }
    }, 5e3);
    return () => clearInterval(interval);
  }, [fish, tank == null ? void 0 : tank.id]);
  const handleMicroTap = (evt) => {
    claimMicroEvent(evt.id, evt.coins, evt.xp);
    setMicroEvents((prev) => prev.map(
      (e) => e.id === evt.id ? { ...e, tapped: true } : e
    ));
    setTimeout(() => {
      setMicroEvents((prev) => prev.filter((e) => e.id !== evt.id));
    }, 500);
  };
  reactExports.useEffect(() => {
    setDayPhase(getDayPhase(gameClock));
  }, [gameClock]);
  const handleTankMouseMove = (e) => {
    var _a2;
    const rect = (_a2 = tankElRef.current) == null ? void 0 : _a2.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width * 100;
    const py = (e.clientY - rect.top) / rect.height * 100;
    cursorRef.current = { x: px, y: py };
    const el = tankElRef.current;
    if (el) {
      el.style.setProperty("--parallax-x", `${(px - 50) * 0.03}px`);
      el.style.setProperty("--parallax-y", `${(py - 50) * 0.02}px`);
    }
  };
  const handleTankMouseLeave = () => {
    cursorRef.current = { x: -100, y: -100 };
    const el = tankElRef.current;
    if (el) {
      el.style.setProperty("--parallax-x", "0px");
      el.style.setProperty("--parallax-y", "0px");
    }
  };
  const handleTankClick = (e) => {
    var _a2;
    const rect = (_a2 = tankElRef.current) == null ? void 0 : _a2.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    const id = Date.now();
    setRipples((prev) => [...prev.slice(-4), { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 1200);
  };
  const prevFoodRef = reactExports.useRef(((_a = tank == null ? void 0 : tank.supplies) == null ? void 0 : _a.food) ?? 0);
  reactExports.useEffect(() => {
    var _a2;
    const food = ((_a2 = tank == null ? void 0 : tank.supplies) == null ? void 0 : _a2.food) ?? 0;
    if (food < prevFoodRef.current) {
      setFeedSplash(Date.now());
    }
    prevFoodRef.current = food;
  }, [(_b = tank == null ? void 0 : tank.supplies) == null ? void 0 : _b.food]);
  const [treatmentFlash, setTreatmentFlash] = reactExports.useState(0);
  const prevWqRef = reactExports.useRef(wq);
  reactExports.useEffect(() => {
    if (wq > prevWqRef.current + 5) {
      setTreatmentFlash(Date.now());
      setTimeout(() => setTreatmentFlash(0), 2500);
    }
    prevWqRef.current = wq;
  }, [wq]);
  const SALE_PHRASES = ["Thanks!", "Perfect!", "Love it!", "Beautiful!", "Amazing!", "So pretty!"];
  const prevFishIdsRef = reactExports.useRef(new Set(fish.map((f) => f.id)));
  reactExports.useEffect(() => {
    const currentIds = new Set(fish.map((f) => f.id));
    for (const id of prevFishIdsRef.current) {
      if (!currentIds.has(id) && positions[id]) {
        const pos = positions[id];
        const sparkleId = Date.now() + Math.random();
        setSparkles((prev) => [...prev.slice(-3), { id: sparkleId, x: pos.x, y: pos.y }]);
        setTimeout(() => setSparkles((prev) => prev.filter((s) => s.id !== sparkleId)), 1500);
        const showerId = sparkleId + 0.1;
        setCoinShowers((prev) => [...prev.slice(-2), { id: showerId, x: pos.x, y: pos.y }]);
        setTimeout(() => setCoinShowers((prev) => prev.filter((s) => s.id !== showerId)), 1500);
        const speechId = sparkleId + 0.2;
        const phrase = SALE_PHRASES[Math.floor(Math.random() * SALE_PHRASES.length)];
        setSpeechBubbles((prev) => [...prev.slice(-1), { id: speechId, x: pos.x, y: pos.y - 8, text: phrase }]);
        setTimeout(() => setSpeechBubbles((prev) => prev.filter((s) => s.id !== speechId)), 2e3);
      }
    }
    prevFishIdsRef.current = currentIds;
  }, [fishIds]);
  reactExports.useEffect(() => {
    let frameId;
    const animate = () => {
      tickRef.current++;
      const t = tickRef.current;
      const pos = posRef.current;
      for (const id of Object.keys(pos)) {
        const p = pos[id];
        let { x, y, vx, vy, phase, flipped, depthLayer, tilt, isIdle, idleTimer } = p;
        const fishObj = fishMapRef.current[id];
        const bp = fishObj ? getBehaviorProfile(fishObj) : null;
        const swimSpeed = bp ? SWIM_SPEED * bp.swimSpeed : SWIM_SPEED;
        const bobAmp = bp ? bp.bobAmplitude : BOB_AMP;
        const turnChance = bp ? bp.turnChance : TURN_CHANCE;
        const idleProb = bp ? bp.idleProbability : 0.12;
        const dartiness = bp ? bp.dartiness : 0;
        const [prefYMin, prefYMax] = (bp == null ? void 0 : bp.preferredYRange) ?? [8, 80];
        idleTimer = (idleTimer || 0) - 1;
        if (idleTimer <= 0) {
          isIdle = Math.random() < idleProb;
          idleTimer = 80 + Math.floor(Math.random() * 260);
          if (isIdle) {
            if (y > 75 && Math.random() < 0.4) {
              p.idleBehavior = "nibble";
            } else if (y < 25 && Math.random() < 0.3) {
              p.idleBehavior = "surface";
            } else if (Math.random() < 0.2) {
              p.idleBehavior = "explore";
            } else {
              p.idleBehavior = "rest";
            }
          }
        }
        if (!isIdle) {
          x += vx * swimSpeed * 60;
          y += Math.sin(phase + t * BOB_FREQ) * bobAmp;
          const targetTilt = Math.max(-11, Math.min(11, vx * 16));
          tilt = tilt + (targetTilt - tilt) * 0.05;
          if (bp == null ? void 0 : bp.preferredYRange) {
            const midY = (prefYMin + prefYMax) / 2;
            vy += (midY - y) * 8e-5;
            vy *= 0.97;
            y += vy;
          }
        } else {
          const idleBehavior = p.idleBehavior || "rest";
          if (idleBehavior === "nibble") {
            y += Math.sin(phase + t * BOB_FREQ * 0.5) * bobAmp * 0.2;
            tilt = tilt + (15 - tilt) * 0.03;
            if (y < 82) y += 0.03;
          } else if (idleBehavior === "surface") {
            y += Math.sin(phase + t * BOB_FREQ * 0.4) * bobAmp * 0.3;
            tilt = tilt + (-8 - tilt) * 0.02;
            if (y > 12) y -= 0.02;
          } else if (idleBehavior === "explore") {
            x += Math.sin(phase + t * 1e-3) * 0.015;
            y += Math.sin(phase + t * BOB_FREQ * 0.3) * bobAmp * 0.3;
            tilt = tilt * 0.96;
          } else {
            y += Math.sin(phase + t * BOB_FREQ * 0.35) * bobAmp * 0.45;
            tilt = tilt * 0.94;
          }
        }
        const personality = (fishObj == null ? void 0 : fishObj.personality) || "shy";
        const cursor = cursorRef.current;
        const cdx = x - cursor.x;
        const cdy = y - cursor.y;
        const cDist = Math.sqrt(cdx * cdx + cdy * cdy);
        if (personality === "curious" && cDist < 25 && cDist > 2) {
          const force = (25 - cDist) / 25 * 0.04;
          vx -= cdx / cDist * force;
          vy -= cdy / cDist * force * 0.5;
        } else if (cDist < 15 && cDist > 0.5) {
          const force = (15 - cDist) / 15 * (personality === "shy" ? 0.12 : 0.08);
          vx += cdx / cDist * force;
          vy += cdy / cDist * force * 0.5;
        }
        if (personality === "aggressive" && t % 30 === 0) {
          let closest = null, closestDist = 20;
          for (const otherId of Object.keys(pos)) {
            if (otherId === id) continue;
            const o = pos[otherId];
            const d = Math.sqrt((x - o.x) ** 2 + (y - o.y) ** 2);
            if (d < closestDist) {
              closest = o;
              closestDist = d;
            }
          }
          if (closest) {
            vx += (closest.x - x) * 3e-3;
            vy += (closest.y - y) * 2e-3;
          }
        }
        if (personality === "social" && t % 60 === 0) {
          let sumX = 0, sumY = 0, n = 0;
          for (const otherId of Object.keys(pos)) {
            if (otherId === id) continue;
            sumX += pos[otherId].x;
            sumY += pos[otherId].y;
            n++;
          }
          if (n > 0) {
            vx += (sumX / n - x) * 2e-3;
            vy += (sumY / n - y) * 1e-3;
          }
        }
        if (personality === "playful" && Math.random() < 3e-3) {
          vx *= 2.5;
        }
        if (personality === "lazy") {
          if (!isIdle && Math.random() < 0.01) {
            isIdle = true;
            idleTimer = 200;
          }
        }
        if (x > 90) {
          vx = -Math.abs(vx) * (0.9 + Math.random() * 0.2);
          flipped = true;
          x = 90;
        }
        if (x < 5) {
          vx = Math.abs(vx) * (0.9 + Math.random() * 0.2);
          flipped = false;
          x = 5;
        }
        if (y > prefYMax) {
          vy -= 0.01;
          y = Math.min(y, prefYMax + 2);
        }
        if (y < prefYMin) {
          vy += 0.01;
          y = Math.max(y, prefYMin - 2);
        }
        if (y > 82) {
          y = 82;
          vy = -Math.abs(vy);
        }
        if (y < 6) {
          y = 6;
          vy = Math.abs(vy);
        }
        if (Math.random() < turnChance) {
          const dart = dartiness > 0 && Math.random() < dartiness;
          const speed = dart ? 0.12 + Math.random() * 0.14 : 0.06 + Math.random() * 0.12;
          vx = (Math.random() - 0.5) * speed;
          vy = (Math.random() - 0.5) * 0.03;
          if (Math.abs(vx) < 0.02) vx = 0.05;
          flipped = vx < 0;
        }
        p.x = x;
        p.y = y;
        p.vx = vx;
        p.vy = vy;
        p.flipped = flipped;
        p.tilt = tilt;
        p.isIdle = isIdle;
        p.idleTimer = idleTimer;
      }
      setFrame((f) => f + 1);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);
  const wq = waterQuality;
  const waterBg = reactExports.useMemo(() => {
    var _a2;
    if (tank == null ? void 0 : tank.backgroundId) {
      const bg = getBackground(tank.backgroundId);
      if (bg) return bg.gradient;
    }
    const theme = getThemeById(((_a2 = tank == null ? void 0 : tank.themes) == null ? void 0 : _a2.active) || "tropical");
    const stops = theme.waterGradient;
    const wqFactor = wq / 100;
    const murkR = Math.round((1 - wqFactor) * 30);
    const murkG = Math.round((1 - wqFactor) * 10);
    const murkB = Math.round(-(1 - wqFactor) * 15);
    const blend = (hex, opacity) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const nr = Math.min(255, Math.max(0, r + murkR));
      const ng = Math.min(255, Math.max(0, g + murkG));
      const nb = Math.min(255, Math.max(0, b + murkB));
      return `rgba(${nr},${ng},${nb},${opacity})`;
    };
    const gradStops = stops.map((s) => `${blend(s.color, s.opacity)} ${s.offset}`).join(", ");
    return `linear-gradient(to bottom, ${gradStops})`;
  }, [wq, (_c = tank == null ? void 0 : tank.themes) == null ? void 0 : _c.active]);
  const ps = DAY_PHASE_STYLES[dayPhase.phase];
  function fishClasses(f, isSelected, depthLayer, pos) {
    var _a2, _b2, _c2;
    const cls = ["fish-container", `depth-layer-${depthLayer}`];
    if (isSelected) cls.push("selected");
    if (f.disease) cls.push("fish-diseased");
    if (pos.isIdle) {
      cls.push("fish-idle-active");
      if (pos.idleBehavior) cls.push(`fish-idle--${pos.idleBehavior}`);
    }
    if (f.hunger > 70) cls.push("fish-hungry");
    if ((f.health || 100) < 30) cls.push("fish-critical");
    if (f.stage === "egg") {
      cls.push("fish-egg");
      if (gameClock - (f.bornAt || 0) > EGG_HATCH_ANIM_MS) cls.push("egg-hatching");
    }
    if (((_a2 = f.species) == null ? void 0 : _a2.rarity) === "legendary") cls.push("fish-legendary");
    else if (((_b2 = f.species) == null ? void 0 : _b2.rarity) === "epic") cls.push("fish-epic");
    const mut = (_c2 = f.phenotype) == null ? void 0 : _c2.mutation;
    if (mut && mut !== "None") cls.push(`fish-mut--${mut.toLowerCase().replace(/[^a-z]/g, "")}`);
    if (f.genome) {
      let pure = 0, total = 0;
      for (const g of Object.keys(f.genome)) {
        total++;
        if (f.genome[g][0] === f.genome[g][1]) pure++;
      }
      if (pure === total && total > 0) cls.push("fish-purity--perfected");
      else if (pure >= 5) cls.push("fish-purity--pure");
    }
    return cls.join(" ");
  }
  const sortedFish = reactExports.useMemo(() => [...fish].sort((a, b) => {
    var _a2, _b2;
    const la = ((_a2 = posRef.current[a.id]) == null ? void 0 : _a2.depthLayer) ?? 1;
    const lb = ((_b2 = posRef.current[b.id]) == null ? void 0 : _b2.depthLayer) ?? 1;
    return la - lb;
  }), [fishIds]);
  const tankShape = (tank == null ? void 0 : tank.size) === "huge" ? "panoramic" : (tank == null ? void 0 : tank.size) === "mega" ? "cylinder" : (tank == null ? void 0 : tank.size) === "large" ? "wide" : "standard";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `tank-wrapper tank-shape--${tankShape}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "day-phase-badge", children: dayPhase.label }),
    (() => {
      var _a2;
      const alerts = [];
      const sickFish = fish.filter((f) => f.disease || f.health < 30);
      const hungryFish = fish.filter((f) => f.hunger > 80);
      const foodLow = (((_a2 = tank == null ? void 0 : tank.supplies) == null ? void 0 : _a2.food) ?? 10) < 3;
      const wqLow = (waterQuality ?? 100) < 40;
      if (sickFish.length > 0) alerts.push({ key: "sick", icon: "", label: `${sickFish.length} sick`, cls: "alert-pulse--red" });
      if (hungryFish.length > 0) alerts.push({ key: "hungry", icon: "", label: `${hungryFish.length} hungry`, cls: "alert-pulse--orange" });
      if (foodLow) alerts.push({ key: "food", icon: "", label: "Low food", cls: "alert-pulse--orange" });
      if (wqLow) alerts.push({ key: "wq", icon: "", label: "Bad water", cls: "alert-pulse--red" });
      if (alerts.length === 0) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-alert-strip", children: alerts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `tank-alert-badge ${a.cls}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: a.icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tank-alert-label", children: a.label })
      ] }, a.key)) });
    })(),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tank-glass-shell", children: [
      CORNER_BOLTS.map(({ corner, style }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `tank-bolt tank-bolt-${corner}`, style }, corner)),
      CORNER_BOLTS.map(({ corner, style }) => {
        const isRight = corner === "tr" || corner === "br";
        const isBottom = corner === "bl" || corner === "br";
        const cx = 6, cy = 6;
        const dx = isRight ? 4 : -4;
        const dy = isBottom ? 4 : -4;
        const sweep = isRight !== isBottom ? 1 : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: `tank-corner-glint tank-corner-glint-${corner}`,
            style: { ...style, position: "absolute", width: 16, height: 16, pointerEvents: "none" },
            viewBox: "0 0 16 16",
            overflow: "visible",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                d: `M${cx + dx},${cy} A6,6,45,0,${sweep},${cx},${cy + dy}`,
                stroke: "rgba(255,255,255,0.55)",
                strokeWidth: "1.4",
                fill: "none",
                strokeLinecap: "round"
              }
            )
          },
          `glint-${corner}`
        );
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-bevel-top" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-bevel-bottom" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-bevel-left" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-bevel-right" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-shimmer" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "tank",
        ref: tankElRef,
        style: { background: waterBg },
        onMouseMove: handleTankMouseMove,
        onMouseLeave: handleTankMouseLeave,
        onClick: handleTankClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "tank-distortion-defs", width: "0", height: "0", style: { position: "absolute" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "waterDistortion", x: "-5%", y: "-5%", width: "110%", height: "110%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "feTurbulence",
                {
                  type: "fractalNoise",
                  baseFrequency: "0.012 0.018",
                  numOctaves: "3",
                  seed: "42",
                  result: "noise",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "animate",
                    {
                      attributeName: "baseFrequency",
                      values: "0.012 0.018;0.015 0.022;0.012 0.018",
                      dur: "8s",
                      repeatCount: "indefinite"
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "feDisplacementMap",
                {
                  in: "SourceGraphic",
                  in2: "noise",
                  scale: "6",
                  xChannelSelector: "R",
                  yChannelSelector: "G"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "godRayGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(255,255,255,0.18)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "40%", stopColor: "rgba(255,255,255,0.06)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(255,255,255,0)" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tank-distortion-layer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-depth-far" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-depth-mid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-depth-vignette" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-depth-bottom" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-depth-column" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "light-rays", style: { opacity: ps.rayOpacity }, children: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `ray ray-${i}` }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-ripple" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-ripple surface-ripple-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-ripple surface-ripple-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "water-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 1600 30", preserveAspectRatio: "none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M0,15 C100,5 200,25 400,12 C600,0 700,28 900,15 C1100,2 1200,22 1400,10 C1500,5 1600,18 1600,15 L1600,0 L0,0 Z",
                  fill: "rgba(10,25,60,0.85)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: "M0,18 C150,8 250,26 450,14 C650,3 750,25 950,16 C1150,5 1250,24 1450,12 C1550,8 1600,20 1600,18 L1600,0 L0,0 Z",
                  fill: "rgba(10,25,60,0.4)"
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-reflections", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-streak glass-streak-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-streak glass-streak-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-streak glass-streak-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-streak glass-streak-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "water-depth-fog" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-sand-detail" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "caustic-floor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-highlight-top" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "water-surface", viewBox: "0 0 800 20", preserveAspectRatio: "none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "water-surface-wave wave-1", d: "M0,10 Q100,2 200,10 Q300,18 400,10 Q500,2 600,10 Q700,18 800,10 L800,0 L0,0 Z", fill: "rgba(100,180,255,0.08)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "water-surface-wave wave-2", d: "M0,12 Q100,5 200,12 Q300,19 400,12 Q500,5 600,12 Q700,19 800,12 L800,0 L0,0 Z", fill: "rgba(140,200,255,0.05)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { className: "water-surface-line", x1: "0", y1: "10", x2: "800", y2: "10", stroke: "rgba(180,220,255,0.15)", strokeWidth: "1.5" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "tank-plants", viewBox: "0 0 800 400", preserveAspectRatio: "none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "plantGrad1", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#2a8040", stopOpacity: "0.7" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#1a5028", stopOpacity: "0.9" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "plantGrad2", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3a9050", stopOpacity: "0.6" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#206030", stopOpacity: "0.8" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-1", d: "M60,400 Q55,340 65,300 Q58,260 62,220 Q68,190 60,160", fill: "none", stroke: "url(#plantGrad1)", strokeWidth: "5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-2", d: "M75,400 Q80,350 72,310 Q78,270 70,240", fill: "none", stroke: "url(#plantGrad2)", strokeWidth: "4", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-3", d: "M50,400 Q45,360 55,330 Q48,300 52,270", fill: "none", stroke: "url(#plantGrad1)", strokeWidth: "3.5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-4", d: "M720,400 Q725,345 715,300 Q722,265 718,230 Q710,200 720,170", fill: "none", stroke: "url(#plantGrad2)", strokeWidth: "5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-5", d: "M740,400 Q735,355 745,320 Q738,285 742,250", fill: "none", stroke: "url(#plantGrad1)", strokeWidth: "4", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-6", d: "M400,400 Q395,370 405,345 Q398,320 402,295", fill: "none", stroke: "rgba(180,80,100,0.5)", strokeWidth: "4.5", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { className: "seaweed sw-7", d: "M385,400 Q390,365 382,340", fill: "none", stroke: "rgba(200,100,120,0.4)", strokeWidth: "3", strokeLinecap: "round" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-frame" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dust-motes", children: Array.from({ length: 12 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dust-mote", style: {
              left: `${(i * 29 + 7) % 95}%`,
              top: `${(i * 43 + 15) % 80 + 10}%`,
              animationDelay: `${i * 1.7 % 10}s`,
              animationDuration: `${8 + i % 5 * 3}s`
            } }, i)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "surface-shimmer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "caustic-layer caustic-a" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "caustic-layer caustic-b" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "caustic-layer caustic-c" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "caustic-layer caustic-d" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "particles", children: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
              (i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `particle particle-${i}` }, i)
            ) }),
            ps.starCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "night-stars", viewBox: "0 0 100 30", preserveAspectRatio: "none", children: STARS.slice(0, ps.starCount).map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: s.x,
                cy: s.y,
                r: s.r,
                fill: "white",
                opacity: "0.65",
                className: "star-twinkle",
                style: { animationDelay: `${s.delay}s` }
              },
              i
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "tank-bg-svg", viewBox: "0 0 800 400", preserveAspectRatio: "xMidYMax slice", children: [
              dayPhase.phase === "night" || dayPhase.phase === "evening" ? /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "700", cy: "40", r: "22", fill: "rgba(255,245,200,0.18)" }) : dayPhase.phase === "day" ? /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "700", cy: "35", r: "28", fill: "rgba(255,240,150,0.12)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "700", cy: "40", rx: "30", ry: "18", fill: "rgba(255,160,60,0.14)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("g", { dangerouslySetInnerHTML: { __html: getThemeById(((_d = tank == null ? void 0 : tank.themes) == null ? void 0 : _d.active) || "tropical").bgSvgFn() } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "sandSubstrateGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#c8a862", stopOpacity: "0.00" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "18%", stopColor: "#b89050", stopOpacity: "0.18" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "42%", stopColor: "#a07838", stopOpacity: "0.32" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "68%", stopColor: "#886030", stopOpacity: "0.50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "85%", stopColor: "#6a4420", stopOpacity: "0.70" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3c2408", stopOpacity: "0.88" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "330", width: "800", height: "70", fill: "url(#sandSubstrateGrad)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "tank-fg-svg", viewBox: "0 0 800 400", preserveAspectRatio: "xMidYMax slice", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "432", rx: "490", ry: "62", fill: "#6a4820", opacity: "0.45" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "422", rx: "465", ry: "55", fill: "#7a5828" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "416", rx: "452", ry: "46", fill: "#8a6830" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "411", rx: "440", ry: "38", fill: "#9a7840" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "406", rx: "428", ry: "28", fill: "#aa8848" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "400", cy: "402", rx: "415", ry: "20", fill: "#be9a58" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "370", cy: "400", rx: "290", ry: "12", fill: "#d0ac68", opacity: "0.50" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "330", cy: "399", rx: "170", ry: "7", fill: "#deba76", opacity: "0.28" }),
              [55, 118, 182, 248, 315, 385, 455, 525, 595, 658, 718].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "ellipse",
                {
                  cx: x + i % 3 * 4,
                  cy: 406 + i % 4 * 2,
                  rx: 9 + i % 7,
                  ry: 3 + i % 3 * 0.7,
                  fill: ["#b09050", "#c09860", "#cfa060", "#9e7c38", "#a88040"][i % 5],
                  opacity: "0.70"
                },
                i
              )),
              Array.from({ length: 16 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: 48 + i * 47 + i % 3 * 6,
                  cy: 405 + i % 4 * 3,
                  r: 0.8 + i % 3 * 0.5,
                  fill: ["#ba9052", "#cca858", "#c29655"][i % 3],
                  opacity: "0.48"
                },
                i
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(80,320)", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "0", cy: "60", rx: "32", ry: "22", fill: "#c06840" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "0", cy: "55", rx: "28", ry: "18", fill: "#d07848" }),
                [[-12, 0], [0, -8], [12, 0], [0, 8], [-8, -4], [8, -4]].map(([dx, dy], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: `M${dx - 6},${55 + dy} Q${dx},${50 + dy} ${dx + 6},${55 + dy}`,
                    stroke: "#b05830",
                    strokeWidth: "1.5",
                    fill: "none",
                    opacity: "0.6"
                  },
                  i
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-40,70 C-45,40 -35,20 -38,0", stroke: "#e08040", strokeWidth: "7", fill: "none", strokeLinecap: "round" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-40,70 C-30,35 -20,18 -22,2", stroke: "#d07030", strokeWidth: "7", fill: "none", strokeLinecap: "round" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M-40,70 C-50,30 -55,12 -52,-5", stroke: "#e09050", strokeWidth: "6", fill: "none", strokeLinecap: "round" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-38", cy: "0", r: "5", fill: "#ff9060" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-22", cy: "2", r: "5", fill: "#ff8050" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "-52", cy: "-5", r: "4", fill: "#ffa070" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "62", r: "18", fill: "#e05050" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "58", r: "14", fill: "#f06060" }),
                [0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "circle",
                  {
                    cx: 40 + 12 * Math.cos(deg * Math.PI / 180),
                    cy: 58 + 12 * Math.sin(deg * Math.PI / 180),
                    r: "3",
                    fill: "#d04040",
                    opacity: "0.7"
                  },
                  i
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(390,350)", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "0", cy: "40", rx: "22", ry: "12", fill: "#c05080" }),
                [-25, -16, -8, 0, 8, 16, 25].map((dx, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "path",
                    {
                      d: `M${dx},42 C${dx + (i % 2 === 0 ? -5 : 5)},20 ${dx + (i % 2 === 0 ? 3 : -3)},5 ${dx},0`,
                      stroke: "#e060a0",
                      strokeWidth: "3.5",
                      fill: "none",
                      strokeLinecap: "round",
                      style: { transformOrigin: `${dx}px 42px` },
                      className: "anemone-tentacle"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: dx, cy: 0, r: "4", fill: "#ff80c0", opacity: "0.9" })
                ] }, i))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { transform: "translate(660,0)", children: [
                [0, 22, 44].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: `M${x + 10},400 C${x + 20},340 ${x},280 ${x + 25},210 C${x + 40},155 ${x + 15},120 ${x + 30},70`,
                    stroke: ["#2d8050", "#359060", "#28704a"][i],
                    strokeWidth: 8 - i * 2,
                    fill: "none",
                    strokeLinecap: "round",
                    className: "kelp-sway",
                    style: { animationDelay: `${i * 0.6}s` }
                  },
                  i
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M100,400 L100,280", stroke: "#c87840", strokeWidth: "5", strokeLinecap: "round" }),
                [280, 300, 320, 340, 360, 380].map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "path",
                  {
                    d: `M100,${y} Q${100 + 30 * (i % 2 === 0 ? 1 : -1)},${y - 15} ${100 + 55 * (i % 2 === 0 ? 1 : -1)},${y}`,
                    stroke: "#d08040",
                    strokeWidth: "2.5",
                    fill: "none",
                    opacity: "0.8"
                  },
                  i
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "250", cy: "400", rx: "28", ry: "16", fill: "#506070" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "255", cy: "396", rx: "24", ry: "12", fill: "#607080" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "248", cy: "393", rx: "11", ry: "4", fill: "#788898", opacity: "0.38" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "500", cy: "402", rx: "20", ry: "12", fill: "#485868" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "505", cy: "398", rx: "16", ry: "9", fill: "#586878" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "500", cy: "395", rx: "8", ry: "3.5", fill: "#6a7a8a", opacity: "0.38" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "82", cy: "310", r: "3", fill: "none", stroke: "rgba(255,255,255,0.4)", strokeWidth: "1", className: "deco-bubble deco-b1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "390", cy: "340", r: "2.5", fill: "none", stroke: "rgba(255,255,255,0.35)", strokeWidth: "1", className: "deco-bubble deco-b2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "672", cy: "370", r: "2", fill: "none", stroke: "rgba(255,255,255,0.3)", strokeWidth: "1", className: "deco-bubble deco-b3" }),
              (() => {
                var _a2;
                const activeTheme = getThemeById(((_a2 = tank == null ? void 0 : tank.themes) == null ? void 0 : _a2.active) || "tropical");
                const substrateDecor = activeTheme.substrateId ? getDecorById(activeTheme.substrateId) : null;
                if (!substrateDecor) return null;
                const tiles = [
                  { x: 140, y: 405, s: 2.8 },
                  { x: 400, y: 406, s: 3 },
                  { x: 660, y: 405, s: 2.8 }
                ];
                return /* @__PURE__ */ jsxRuntimeExports.jsx("g", { dangerouslySetInnerHTML: {
                  __html: tiles.map((t) => substrateDecor.svgFn(t.x, t.y, t.s)).join("")
                } }, "theme-substrate");
              })(),
              (((_e = tank == null ? void 0 : tank.decorations) == null ? void 0 : _e.placed) || []).map((item) => {
                const decor = getDecorById(item.type);
                if (!decor) return null;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "g",
                  {
                    dangerouslySetInnerHTML: { __html: decor.svgFn(item.x, item.y, item.scale) }
                  },
                  item.instanceId
                );
              })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "air-bubbler", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "bubbler-stone", viewBox: "0 0 40 25", width: "40", height: "25", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "20", cy: "18", rx: "18", ry: "7", fill: "#556070" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "20", cy: "16", rx: "15", ry: "5", fill: "#667080" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "18", cy: "14", rx: "6", ry: "2", fill: "#778898", opacity: "0.4" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bubbler-stream", children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bubbler-bubble bb-${i}` }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-snail", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 24 18", width: "24", height: "18", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "14", rx: "10", ry: "4", fill: "rgba(160,140,100,0.7)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "10", r: "6", fill: "rgba(140,120,80,0.8)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,10 Q16,7 14,5 Q12,7 14,10", fill: "rgba(120,100,60,0.5)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "8", r: "3.5", fill: "rgba(160,140,100,0.6)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "12", x2: "3", y2: "9", stroke: "rgba(140,120,80,0.6)", strokeWidth: "1", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "11", x2: "6", y2: "8", stroke: "rgba(140,120,80,0.6)", strokeWidth: "1", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "3", cy: "9", r: "1", fill: "rgba(60,60,60,0.5)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "8", r: "1", fill: "rgba(60,60,60,0.5)" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "tank-shells", viewBox: "0 0 800 400", preserveAspectRatio: "none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { opacity: "0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M120,392 Q125,385 130,392 Q125,395 120,392", fill: "#d8c8a0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M320,395 Q326,387 332,395 Q326,398 320,395", fill: "#c8b890", transform: "rotate(20,326,395)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M540,390 Q544,383 548,390 Q544,393 540,390", fill: "#dcd0a8", transform: "rotate(-15,544,390)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "180", cy: "396", rx: "4", ry: "3", fill: "#c0b088", transform: "rotate(30,180,396)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "440", cy: "394", rx: "5", ry: "3.5", fill: "#d0c098" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "620", cy: "393", rx: "3.5", ry: "2.5", fill: "#b8a880", transform: "rotate(-25,620,393)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("g", { transform: "translate(280,388) scale(0.5) rotate(15)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,-10 L2,-3 L10,-3 L4,2 L6,10 L0,5 L-6,10 L-4,2 L-10,-3 L-2,-3 Z", fill: "rgba(200,100,80,0.4)" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "tank-chest", viewBox: "0 0 36 30", width: "36", height: "30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "14", width: "30", height: "16", rx: "2", fill: "#8a5a2a" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "14", width: "30", height: "16", rx: "2", fill: "none", stroke: "#6a4020", strokeWidth: "1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "10", width: "26", height: "8", rx: "3", fill: "#9a6a3a" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "14", y: "12", width: "8", height: "6", rx: "1", fill: "#c8a040" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "15", r: "2", fill: "#ffd060" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "22", x2: "33", y2: "22", stroke: "#6a4020", strokeWidth: "1", opacity: "0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "10", width: "30", height: "1", fill: "rgba(255,255,255,0.1)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bubbles", children: [
              [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bubble bubble-lg bubble-lg-${i}` }, `lg-${i}`)),
              [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bubble bubble-md bubble-md-${i}` }, `md-${i}`)),
              [0, 1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bubble bubble-sm bubble-sm-${i}` }, `sm-${i}`)),
              [0, 1].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bubble bubble-cluster bubble-cl-${i}` }, `cl-${i}`))
            ] }),
            microEvents.map((evt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `micro-event ${evt.tapped ? "micro-event-fade" : ""}`,
                style: { left: `${evt.x}%`, top: `${evt.y}%`, transform: "translate(-50%, -50%)" },
                onClick: (e) => {
                  e.stopPropagation();
                  if (!evt.tapped) handleMicroTap(evt);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "micro-event-bubble", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "micro-event-emoji", children: evt.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: evt.label }),
                  evt.coins > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "micro-event-coins", children: [
                    "+",
                    evt.coins,
                    "🪙"
                  ] })
                ] })
              },
              evt.id
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "day-night-overlay", style: { background: ps.overlay } }),
            (dayPhase.phase === "night" || dayPhase.phase === "evening") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "moonlight-beam" }),
            treatmentFlash > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "treatment-effect", children: Array.from({ length: 20 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "treatment-bubble", style: {
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 0.8}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
              width: 3 + Math.random() * 5,
              height: 3 + Math.random() * 5
            } }, i)) }, treatmentFlash),
            (weather == null ? void 0 : weather.id) === "rainy" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "weather-rain", children: Array.from({ length: 30 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rain-drop", style: {
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.4 + Math.random() * 0.3}s`
            } }, i)) }),
            (weather == null ? void 0 : weather.id) === "stormy" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "weather-storm", children: [
              Array.from({ length: 50 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rain-drop rain-drop--heavy", style: {
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${0.3 + Math.random() * 0.2}s`
              } }, i)),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lightning-flash" })
            ] }),
            (weather == null ? void 0 : weather.id) === "heatwave" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "weather-heat" }),
            (weather == null ? void 0 : weather.id) === "aurora" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "weather-aurora", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora-band aurora-band-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora-band aurora-band-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aurora-band aurora-band-3" })
            ] }),
            (weather == null ? void 0 : weather.id) === "foggy" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "weather-fog" }),
            sortedFish.map((f) => {
              var _a2, _b2, _c2, _d2;
              const pos = positions[f.id] || { x: f.x ?? 50, y: f.y ?? 40, flipped: false, depthLayer: 1, tilt: 0, isIdle: false };
              const isSelected = f.id === selectedFishId;
              const layer = DEPTH_LAYERS[pos.depthLayer ?? 1];
              const baseSize = ((_a2 = f.phenotype) == null ? void 0 : _a2.size) === "Giant" ? SPRITE_SIZE.giant : f.stage === "egg" ? SPRITE_SIZE.egg : SPRITE_SIZE.normal;
              const spriteSize = Math.round(baseSize * layer.scale);
              const tiltAngle = pos.flipped ? -(pos.tilt || 0) : pos.tilt || 0;
              const animClass = pos.isIdle ? "fish-idle" : "fish-swimming";
              const depthLayer = pos.depthLayer ?? 1;
              let depthFilter = "";
              if (depthLayer === 0) depthFilter = "saturate(0.72) brightness(0.88) blur(1.2px) ";
              else if (layer.blur > 0) depthFilter = `blur(${layer.blur}px) `;
              const glowStr = isSelected ? "drop-shadow(0 0 8px rgba(240,192,64,0.6))" : "";
              const isHovered = f.id === hoveredFishId;
              const healthPct = Math.round(f.health ?? 100);
              const satiety = Math.max(0, 100 - Math.round(f.hunger ?? 0));
              const tooltipSide = pos.x > 65 ? "left" : "right";
              const tooltipVert = pos.y < 15 ? "fish-tooltip--low" : pos.y > 80 ? "fish-tooltip--high" : "";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: fishClasses(f, isSelected, depthLayer, pos) + (justClickedId === f.id ? " fish-just-clicked" : ""),
                  "data-rarity": ((_b2 = f.species) == null ? void 0 : _b2.rarity) || "common",
                  style: {
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    opacity: layer.opacity,
                    zIndex: isSelected ? 30 : isHovered ? 25 : layer.z,
                    filter: (depthFilter + glowStr).trim() || void 0,
                    transform: `translate(-50%, -50%) rotate(${tiltAngle}deg)`
                  },
                  onMouseEnter: () => setHoveredFishId(f.id),
                  onMouseLeave: () => setHoveredFishId(null),
                  onClick: () => {
                    onSelectFish(f.id === selectedFishId ? null : f.id);
                    setJustClickedId(f.id);
                    setTimeout(() => setJustClickedId(null), 350);
                    if (pos) {
                      const bubbles = Array.from({ length: 4 }, (_, i) => ({
                        id: `cb-${f.id}-${Date.now()}-${i}`,
                        x: pos.x + (Math.random() - 0.5) * 6,
                        y: pos.y + (Math.random() - 0.5) * 4,
                        size: 3 + Math.random() * 5,
                        dur: 0.5 + Math.random() * 0.5,
                        rise: -15 - Math.random() * 25
                      }));
                      setClickBubbles((prev) => [...prev.slice(-8), ...bubbles]);
                      setTimeout(() => setClickBubbles((prev) => prev.filter((b) => !bubbles.some((nb) => nb.id === b.id))), 1200);
                    }
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `fish-anim-inner ${animClass}`,
                        "data-species": ((_c2 = f.species) == null ? void 0 : _c2.key) || void 0,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(FishSprite$1, { fish: f, size: spriteSize, flipped: pos.flipped, selected: isSelected })
                      }
                    ),
                    f.stage !== "adult" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stage-badge", children: f.stage }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-status-icons", children: [
                      f.disease && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-status-icon fish-status-icon--sick", "aria-label": "Sick", children: "!" }),
                      !f.disease && f.hunger > 60 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-status-icon fish-status-icon--hungry", "aria-label": "Hungry", children: "H" }),
                      listedFishIds.includes(f.id) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-status-icon fish-status-icon--listed", "aria-label": "Listed", children: "$" }),
                      f.bondedWith && fish.some((o) => o.id === f.bondedWith) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-status-icon fish-status-icon--bonded", "aria-label": "Bonded", children: "♥" })
                    ] }),
                    isHovered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fish-tooltip fish-tooltip--${tooltipSide} ${tooltipVert}`, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-name", children: ((_d2 = f.species) == null ? void 0 : _d2.name) || "Unknown" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-tooltip-row", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "HP" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-fill", style: {
                          width: `${healthPct}%`,
                          background: healthPct > 60 ? "#5aaa70" : healthPct > 30 ? "#b0944a" : "#c44040",
                          color: healthPct < 30 ? "#c44040" : "transparent",
                          boxShadow: healthPct < 30 ? "0 0 6px currentColor" : "none",
                          animation: healthPct < 30 ? "bar-critical-pulse 1.1s ease-in-out infinite" : "none"
                        } }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fish-tooltip-val", children: [
                          healthPct,
                          "%"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-tooltip-row", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Feed" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-fill", style: {
                          width: `${satiety}%`,
                          background: satiety > 60 ? "#5db8e8" : satiety > 30 ? "#f5a742" : "#ff6055",
                          color: satiety < 20 ? "#ff6055" : "transparent",
                          boxShadow: satiety < 20 ? "0 0 6px currentColor" : "none",
                          animation: satiety < 20 ? "bar-critical-pulse 1.1s ease-in-out infinite" : "none"
                        } }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fish-tooltip-val", children: [
                          satiety,
                          "%"
                        ] })
                      ] }),
                      f.disease && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-tooltip-disease", children: f.disease }),
                      f.personality && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-tooltip-personality", style: { fontSize: "0.65rem", opacity: 0.6, marginTop: 2 }, children: [
                        PERSONALITY_EMOJI[f.personality] || "",
                        " ",
                        f.personality
                      ] })
                    ] })
                  ]
                },
                f.id
              );
            }),
            fish.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-tank", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your tank is empty." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Breed some fish to get started!" })
            ] }),
            wq < 40 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dirty-water", style: { opacity: (40 - wq) / 40 * 0.2 } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "god-rays-svg", viewBox: "0 0 800 400", preserveAspectRatio: "none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "180,0 120,400 240,400", fill: "url(#godRayGrad)", className: "god-ray-cone god-ray-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "350,0 300,400 400,400", fill: "url(#godRayGrad)", className: "god-ray-cone god-ray-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "520,0 470,400 570,400", fill: "url(#godRayGrad)", className: "god-ray-cone god-ray-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "650,0 610,400 700,400", fill: "url(#godRayGrad)", className: "god-ray-cone god-ray-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "plankton-layer", children: Array.from({ length: 20 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `plankton plankton-${i % 5}`,
              style: {
                left: `${(i * 37 + 13) % 95}%`,
                top: `${(i * 53 + 7) % 85 + 5}%`,
                animationDelay: `${i * 1.3 % 8}s`,
                animationDuration: `${12 + i % 7 * 3}s`
              }
            },
            i
          )) }),
          ripples.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "click-ripple", style: { left: `${r.x}%`, top: `${r.y}%` }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "click-ripple-ring click-ripple-ring-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "click-ripple-ring click-ripple-ring-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "click-ripple-ring click-ripple-ring-3" })
          ] }, r.id)),
          feedSplash > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "feed-splash-container", children: Array.from({ length: 8 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `feed-pellet-anim feed-pellet-${i}` }, i)) }, feedSplash),
          sparkles.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sale-sparkle", style: { left: `${s.x}%`, top: `${s.y}%` }, children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sparkle-particle sparkle-${i}` }, i)) }, s.id)),
          coinShowers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "coin-shower", style: { left: `${s.x}%`, top: `${s.y}%` }, children: Array.from({ length: 10 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "coin-shower-piece", style: {
            "--drift": `${(Math.random() - 0.5) * 50}px`,
            "--drop": `${30 + Math.random() * 50}px`,
            "--spin": `${Math.random() * 360}deg`,
            "--fall-dur": `${0.6 + Math.random() * 0.6}s`,
            animationDelay: `${i * 0.04}s`
          }, children: "🪙" }, i)) }, s.id)),
          speechBubbles.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sale-speech-bubble", style: { left: `${s.x}%`, top: `${s.y}%` }, children: s.text }, s.id)),
          clickBubbles.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-click-bubbles", style: { left: `${b.x}%`, top: `${b.y}%` }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fish-click-bubble", style: {
            "--bsize": `${b.size}px`,
            "--bdur": `${b.dur}s`,
            "--brise": `${b.rise}px`
          } }) }, b.id)),
          swimBubbles.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "swim-bubble", style: {
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            "--drift": `${b.drift}px`
          } }, b.id)),
          sortedFish.map((f) => {
            if (f.stage === "egg") return null;
            const pos = positions[f.id];
            if (!pos) return null;
            const sandY = 94;
            const dist = sandY - pos.y;
            const opacity = Math.max(0, Math.min(0.25, 0.3 - dist * 4e-3));
            const spread = 8 + dist * 0.15;
            if (opacity < 0.03) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-ground-shadow", style: {
              left: `${pos.x}%`,
              top: `${sandY}%`,
              width: spread,
              height: spread * 0.3,
              opacity
            } }, `shadow-${f.id}`);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-left" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-right" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-top" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-glass-bottom-fade" })
        ]
      }
    )
  ] });
}
const ALLELE_NAME_COLORS = {
  Orb: "#a0d8f0",
  Round: "#70b8e0",
  Delta: "#4898cc",
  Slender: "#2878b0",
  Eel: "#185888",
  Veil: "#f0c0f0",
  Flowing: "#d8a0d8",
  Broad: "#b880b8",
  Angular: "#986098",
  Nub: "#784880",
  Marble: "#f0d888",
  Spotted: "#e0c868",
  Tiger: "#d0b050",
  Lined: "#b09838",
  Plain: "#908040",
  Crimson: "#ff4444",
  Gold: "#ffcc33",
  Violet: "#9966ff",
  Azure: "#4488ff",
  Emerald: "#44cc66",
  White: "#d8e4f0",
  Orange: "#ff8833",
  Rose: "#ff6699",
  Teal: "#44bbaa",
  Indigo: "#5544cc",
  Silver: "#b0bcc8",
  Normal: "#606878",
  Luminous: "#88ddff",
  Radiant: "#ffaa44",
  Ultraviolet: "#cc44ff",
  Leviathan: "#ff3366",
  Giant: "#dd6644",
  Medium: "#88aa88",
  Tiny: "#66aacc",
  Dwarf: "#4488aa",
  None: "#505860",
  Albino: "#f0e8e0",
  Melanistic: "#303040",
  Xanthic: "#ffdd00",
  "Twin-tail": "#66ddcc",
  Starfish: "#ff88aa",
  Iridescent: "#88ffcc",
  Bioluminescent: "#44ffdd",
  Crystalline: "#c8e8ff",
  Void: "#220044",
  Phoenix: "#ff4400"
};
const GENE_ORDER = ["bodyShape", "finType", "pattern", "primaryColor", "secondaryColor", "glow", "size", "mutation"];
const GENE_SHORT = {
  bodyShape: "Body",
  finType: "Fin",
  pattern: "Pat",
  primaryColor: "Color",
  secondaryColor: "2nd",
  glow: "Glow",
  size: "Size",
  mutation: "Mut"
};
const GENE_EMOJI = {
  bodyShape: "",
  finType: "",
  pattern: "",
  primaryColor: "",
  secondaryColor: "",
  glow: "",
  size: "",
  mutation: ""
};
function isGenePure(genome, gene) {
  if (!(genome == null ? void 0 : genome[gene])) return false;
  const [a1, a2] = genome[gene];
  return a1 === a2;
}
function purityCount(genome) {
  let count = 0;
  let total = 0;
  for (const gene of GENE_ORDER) {
    if (!(genome == null ? void 0 : genome[gene])) continue;
    total++;
    if (isGenePure(genome, gene)) count++;
  }
  return { pure: count, total };
}
function purityTier(genome) {
  const { pure, total } = purityCount(genome);
  if (pure === total && total > 0) return { label: "Perfected", tier: 4, pure, total };
  if (pure >= 5) return { label: "Pure", tier: 3, pure, total };
  if (pure >= 3) return { label: "Refined", tier: 2, pure, total };
  return { label: "Mixed", tier: 1, pure, total };
}
function getHiddenAllele(genome, gene) {
  var _a, _b, _c;
  if (!(genome == null ? void 0 : genome[gene])) return null;
  const [a1, a2] = genome[gene];
  if (a1 === a2) return null;
  const geneData = GENES[gene];
  if (!geneData) return null;
  const d1 = ((_a = geneData.alleles[a1]) == null ? void 0 : _a.dominant) ?? 0;
  const d2 = ((_b = geneData.alleles[a2]) == null ? void 0 : _b.dominant) ?? 0;
  const hiddenKey = d1 >= d2 ? a2 : a1;
  return { key: hiddenKey, name: ((_c = geneData.alleles[hiddenKey]) == null ? void 0 : _c.name) || hiddenKey };
}
function findSharedCarriers(genomeA, genomeB) {
  var _a, _b;
  const shared = [];
  for (const gene of GENE_ORDER) {
    if (!(genomeA == null ? void 0 : genomeA[gene]) || !(genomeB == null ? void 0 : genomeB[gene])) continue;
    const hiddenA = getHiddenAllele(genomeA, gene);
    const hiddenB = getHiddenAllele(genomeB, gene);
    if (!hiddenA || !hiddenB) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    const recessivesA = /* @__PURE__ */ new Set([a1, a2]);
    const recessivesB = /* @__PURE__ */ new Set([b1, b2]);
    for (const allele of recessivesA) {
      if (!recessivesB.has(allele)) continue;
      const geneData = GENES[gene];
      const name = ((_a = geneData == null ? void 0 : geneData.alleles[allele]) == null ? void 0 : _a.name) || allele;
      const expressed = expressGene(gene, a1, a2);
      if (expressed === name) continue;
      shared.push({
        gene,
        geneName: ((_b = GENES[gene]) == null ? void 0 : _b.name) || gene,
        allele,
        alleleName: name,
        chance: 25
        // 25% chance of homozygous recessive
      });
    }
  }
  return shared;
}
function perGeneBreedingForecast(genomeA, genomeB) {
  var _a;
  const forecast = [];
  for (const gene of GENE_ORDER) {
    if (!(genomeA == null ? void 0 : genomeA[gene]) || !(genomeB == null ? void 0 : genomeB[gene])) continue;
    const [a1, a2] = genomeA[gene];
    const [b1, b2] = genomeB[gene];
    const combos = [
      [a1, b1],
      [a1, b2],
      [a2, b1],
      [a2, b2]
    ];
    const traitCounts = {};
    const purityCounts = {};
    for (const [x, y] of combos) {
      const trait = expressGene(gene, x, y);
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
      const pure = x === y;
      purityCounts[trait] = (purityCounts[trait] || 0) + (pure ? 1 : 0);
    }
    const outcomes = Object.entries(traitCounts).map(([name, count]) => ({
      name,
      percent: Math.round(count / 4 * 100),
      pureChance: Math.round(purityCounts[name] / 4 * 100),
      color: ALLELE_NAME_COLORS[name] || "#888"
    })).sort((a, b) => b.percent - a.percent);
    forecast.push({
      gene,
      geneName: ((_a = GENES[gene]) == null ? void 0 : _a.name) || gene,
      shortName: GENE_SHORT[gene] || gene,
      emoji: GENE_EMOJI[gene] || "",
      outcomes
    });
  }
  return forecast;
}
function breedingRarityForecast(genomeA, genomeB, samples = 200) {
  const rarityCounts = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 };
  let bestRarity = "common";
  const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary"];
  for (let i = 0; i < samples; i++) {
    const genome = {};
    for (const gene of GENE_ORDER) {
      if (!(genomeA == null ? void 0 : genomeA[gene]) || !(genomeB == null ? void 0 : genomeB[gene])) continue;
      const [a1, a2] = genomeA[gene];
      const [b1, b2] = genomeB[gene];
      const pick1 = Math.random() < 0.5 ? a1 : a2;
      const pick2 = Math.random() < 0.5 ? b1 : b2;
      genome[gene] = [pick1, pick2];
    }
    const ph = computePhenotype(genome);
    const sp = getSpeciesFromPhenotype(ph);
    rarityCounts[sp.rarity]++;
    if (rarityOrder.indexOf(sp.rarity) > rarityOrder.indexOf(bestRarity)) {
      bestRarity = sp.rarity;
    }
  }
  return {
    distribution: Object.entries(rarityCounts).filter(([, c]) => c > 0).map(([rarity, count]) => ({ rarity, percent: Math.round(count / samples * 100) })),
    bestCase: bestRarity
  };
}
function buildChromacode(genome) {
  var _a, _b, _c, _d;
  const bars = [];
  for (const gene of GENE_ORDER) {
    if (!(genome == null ? void 0 : genome[gene])) continue;
    const [a1, a2] = genome[gene];
    const geneData = GENES[gene];
    if (!geneData) continue;
    const d1 = ((_a = geneData.alleles[a1]) == null ? void 0 : _a.dominant) ?? 0;
    const d2 = ((_b = geneData.alleles[a2]) == null ? void 0 : _b.dominant) ?? 0;
    const name1 = ((_c = geneData.alleles[a1]) == null ? void 0 : _c.name) || a1;
    const name2 = ((_d = geneData.alleles[a2]) == null ? void 0 : _d.name) || a2;
    const pure = a1 === a2;
    const dominant = d1 >= d2 ? "left" : "right";
    bars.push({
      gene,
      geneName: geneData.name,
      shortName: GENE_SHORT[gene] || gene,
      allele1: { key: a1, name: name1, color: ALLELE_NAME_COLORS[name1] || "#888", dominant: d1 },
      allele2: { key: a2, name: name2, color: ALLELE_NAME_COLORS[name2] || "#888", dominant: d2 },
      pure,
      dominantSide: dominant,
      expressed: expressGene(gene, a1, a2)
    });
  }
  return bars;
}
const PURITY_STYLES = {
  1: { label: "Mixed", color: "#708090", glow: false },
  2: { label: "Refined", color: "#5a9aaa", glow: false },
  3: { label: "Pure", color: "#8a70a8", glow: true },
  4: { label: "Perfected", color: "#ffd700", glow: true }
};
function Chromacode({ genome, compact = false, showLabels = true }) {
  if (!genome) return null;
  const bars = buildChromacode(genome);
  const purity = purityTier(genome);
  const ps = PURITY_STYLES[purity.tier] || PURITY_STYLES[1];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `chromacode ${compact ? "chromacode--compact" : ""} ${purity.tier >= 3 ? "chromacode--glowing" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chromacode-purity", style: { color: ps.color }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chromacode-purity-label", children: ps.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chromacode-purity-count", children: [
        purity.pure,
        "/",
        purity.total
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chromacode-bars", children: bars.map((bar) => {
      const isDominantLeft = bar.dominantSide === "left";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `chromacode-gene ${bar.pure ? "chromacode-gene--pure" : ""}`,
          title: `${bar.geneName}: ${bar.expressed}${!bar.pure ? ` (carries ${isDominantLeft ? bar.allele2.name : bar.allele1.name})` : " (pure)"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `chromacode-bar ${isDominantLeft ? "chromacode-bar--dominant" : "chromacode-bar--recessive"}`,
                style: { background: bar.allele1.color }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `chromacode-bar ${!isDominantLeft ? "chromacode-bar--dominant" : "chromacode-bar--recessive"}`,
                style: { background: bar.allele2.color }
              }
            ),
            bar.pure && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chromacode-pure-dot", style: { background: bar.allele1.color } })
          ]
        },
        bar.gene
      );
    }) }),
    showLabels && !compact && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chromacode-labels", children: bars.map((bar) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chromacode-label", children: bar.shortName }, bar.gene)) })
  ] });
}
const I = ({ children, size = 14 }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "svg",
  {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: { flexShrink: 0, display: "inline-block", verticalAlign: "middle" },
    children
  }
);
const IconFeed = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4,12 L4,7 C4,4 8,2 8,2 C8,2 12,4 12,7 L12,12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "4", y1: "12", x2: "12", y2: "12" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "7", r: "1.5", fill: "currentColor", stroke: "none" })
] });
const IconMedicine = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "3", width: "6", height: "10", rx: "1" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "5", x2: "8", y2: "11" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "8", x2: "10.5", y2: "8" })
] });
const IconDiagnose = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "7", cy: "7", r: "4" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "10", y1: "10", x2: "14", y2: "14" })
] });
const IconVitamins = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "8", cy: "8", rx: "3", ry: "5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5", y1: "8", x2: "11", y2: "8" })
] });
const IconSell = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6.5,5.5 C6.5,5.5 7,4.5 8,4.5 C9.5,4.5 9.5,6 8,6.5 C6.5,7 6.5,8.5 8,8.5 C9,8.5 9.5,7.5 9.5,7.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "3.5", x2: "8", y2: "4.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "8.5", x2: "8", y2: "9.5" })
] });
const IconListed = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "2", width: "10", height: "12", rx: "1" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "5", x2: "10.5", y2: "5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "7.5", x2: "10.5", y2: "7.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "10", x2: "8.5", y2: "10" })
] });
const IconWater = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsx(I, { size, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8,2 C8,2 3,7 3,10 C3,13 5.5,14 8,14 C10.5,14 13,13 13,10 C13,7 8,2 8,2Z" }) });
const IconTemp = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "6", y: "2", width: "4", height: "9", rx: "2" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "12", r: "2.5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "6", x2: "8", y2: "10", strokeWidth: "2" })
] });
const IconFish = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2,8 C2,8 5,4 9,4 C12,4 14,6 14,8 C14,10 12,12 9,12 C5,12 2,8 2,8Z" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "7.5", r: "1", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M1,8 L3,6 L3,10Z", fill: "currentColor", stroke: "none" })
] });
const IconFood = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "8", cy: "8", r: "2", fill: "currentColor", stroke: "none" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "5", cy: "5", r: "1.5", fill: "currentColor", stroke: "none", opacity: "0.6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "6", r: "1.5", fill: "currentColor", stroke: "none", opacity: "0.6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "6", cy: "11", r: "1.5", fill: "currentColor", stroke: "none", opacity: "0.6" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "11", r: "1", fill: "currentColor", stroke: "none", opacity: "0.4" })
] });
const IconHeart = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsx(I, { size, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  "path",
  {
    d: "M8,13 L3,8.5 C1,6.5 1,4 3.5,3 C5,2.3 7,3 8,5 C9,3 11,2.3 12.5,3 C15,4 15,6.5 13,8.5Z",
    fill: "currentColor",
    stroke: "none"
  }
) });
const IconDNA = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5,2 C5,5 11,7 11,10 C11,13 5,14 5,14" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M11,2 C11,5 5,7 5,10 C5,13 11,14 11,14" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "5", x2: "10.5", y2: "5" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "8", x2: "10.5", y2: "8" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5.5", y1: "11", x2: "10.5", y2: "11" })
] });
const IconLoan = ({ size }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(I, { size, children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "5", width: "12", height: "8", rx: "1" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "4", y: "3", width: "8", height: "4", rx: "1" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "5", y1: "9.5", x2: "11", y2: "9.5" })
] });
function FishPanel({ fish, onFeed, onSell, onMedicine, isListed, medicineStock, foodStock = 0, tanks = [], onMoveFish, isFirstRun, onNavigate }) {
  var _a, _b, _c, _d, _e, _f;
  const prevFishId = reactExports.useRef(null);
  const [entering, setEntering] = reactExports.useState(false);
  const [showGenetics, setShowGenetics] = reactExports.useState(false);
  const [showMove, setShowMove] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if ((fish == null ? void 0 : fish.id) !== prevFishId.current) {
      setEntering(true);
      setShowGenetics(false);
      setShowMove(false);
      prevFishId.current = fish == null ? void 0 : fish.id;
      const t = setTimeout(() => setEntering(false), 400);
      return () => clearTimeout(t);
    }
  }, [fish == null ? void 0 : fish.id]);
  if (!fish) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-panel fish-panel--empty", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-panel-empty-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-panel-empty-icon", children: "No fish selected" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-empty-text", children: "Select a fish" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-empty-sub", children: "Click any fish in the tank" }),
      isFirstRun && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-panel-onboarding", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-onboarding-title", children: "How to play" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-onboarding-step", children: "Feed fish to keep them healthy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-onboarding-step", children: "Juveniles grow into adults over time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-onboarding-step", children: "Sell adults in the Shop to earn coins" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-panel-onboarding-step", children: "Use coins to upgrade your aquarium" }),
        onNavigate && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn btn-sm btn-primary",
            style: { marginTop: 10, width: "100%" },
            onClick: () => onNavigate("shop"),
            children: "Open Shop →"
          }
        )
      ] })
    ] }) });
  }
  if (!fish.species) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fish-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Fish data missing" }) });
  const rarity = RARITY[(_a = fish.species) == null ? void 0 : _a.rarity] || { label: "Unknown", color: "#888" };
  const fishCompat = getCompat(fish);
  const market = useGameStore((s) => s.market);
  const gameClock = useGameStore((s) => s.gameClock);
  const hasBredBefore = useGameStore((s) => {
    var _a2, _b2;
    return (((_b2 = (_a2 = s.player) == null ? void 0 : _a2.stats) == null ? void 0 : _b2.eggsCollected) || 0) > 0;
  });
  useGameStore((s) => {
    var _a2;
    return (((_a2 = s.player) == null ? void 0 : _a2.fishdex) || []).some((e) => {
      var _a3;
      return ((_a3 = e.phenotype) == null ? void 0 : _a3.mutation) && e.phenotype.mutation !== "None";
    });
  });
  const marketMult = getMarketMultiplier(fish, market);
  const basePrice = Math.round((((_b = fish.species) == null ? void 0 : _b.basePrice) || 100) * ((fish.health || 100) / 100));
  const salePrice = Math.round(basePrice * marketMult);
  const marketDelta = marketMult !== 1 ? Math.round((marketMult - 1) * 100) : 0;
  const ageMin = Math.floor((fish.age || 0) / 60);
  const ageLabel = ageMin < 60 ? `${ageMin} min` : `${Math.floor(ageMin / 60)}h ${ageMin % 60}m`;
  const healthDelta = Math.round((fish.health / 100 - 1) * 100);
  const showDelta = fish.health < 98;
  const needsMedicine = fish.health < 60 || !!fish.disease;
  const disease = fish.disease ? DISEASES[fish.disease] : null;
  const healthPct = Math.round(fish.health);
  const satietyPct = Math.max(0, 100 - Math.round(fish.hunger));
  const healthColor = disease ? "#ff4455" : healthPct > 70 ? "#5aaa70" : healthPct > 40 ? "#b0944a" : "#ff6055";
  const satietyColor = satietyPct > 70 ? "#5db8e8" : satietyPct > 40 ? "#f5a742" : "#ff6055";
  const hasGenetics = fish.genome && fish.phenotype && ((_c = fish.species) == null ? void 0 : _c.visualType) !== "species";
  const isLegendary = ((_d = fish.species) == null ? void 0 : _d.rarity) === "legendary";
  const isEpic = ((_e = fish.species) == null ? void 0 : _e.rarity) === "epic";
  const rarityShimmer = isLegendary ? "fp-hero--legendary" : isEpic ? "fp-hero--epic" : "";
  const isSick = needsMedicine && medicineStock > 0;
  const isHungry = fish.hunger >= 40;
  const isAdult = fish.stage === "adult";
  const bestAction = isSick ? "medicine" : isHungry ? "feed" : isAdult ? "sell" : null;
  const recommendation = disease ? `${disease.emoji} ${disease.name} — treat immediately` : isHungry ? "Hungry — feed now" : isAdult && !isListed ? "Ready to sell" : null;
  const statusLabel = disease ? `Sick` : fish.hunger >= 60 ? "Hungry" : isAdult ? "Ready" : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fish-panel ${entering ? "fish-panel--entering" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-rarity-strip", style: { background: rarity.color } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fp-hero ${rarityShimmer}`, style: { "--rarity-color": rarity.color, "--rarity-color-dim": rarity.color + "22" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-hero-glow", style: { background: rarity.color } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-sprite-stage", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FishSprite$1, { fish, size: 112 }),
        isLegendary && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-legendary-ring", style: { borderColor: rarity.color, boxShadow: `0 0 18px ${rarity.color}88` } }),
        isEpic && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-epic-ring", style: { borderColor: rarity.color } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-hero-info", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-rarity-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `fp-rarity-dot ${isLegendary ? "fp-rarity-dot--pulse" : ""}`, style: { background: rarity.color } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `fp-rarity-label ${isLegendary ? "fp-rarity-label--shimmer" : ""}`, style: { color: rarity.color }, children: rarity.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-stage-pill", children: fish.stage }),
          statusLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-status-label", children: statusLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "fp-name", children: [
          fish.nickname ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-nickname", children: fish.nickname }) : null,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: fish.nickname ? "fp-species-sub" : "", children: ((_f = fish.species) == null ? void 0 : _f.name) || "Unknown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "fp-rename-btn",
              onClick: () => {
                const name = prompt("Name this fish:", fish.nickname || "");
                if (name !== null) {
                  useGameStore.getState().renameFish(fish.id, name);
                }
              },
              children: "Rename"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-meta-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-meta-chip", children: ageLabel }),
          fishCompat && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `fp-meta-chip fp-compat-chip fp-compat--${fishCompat.water}`, children: fishCompat.water === "salt" ? "Saltwater" : "Freshwater" }),
          fishCompat && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `fp-meta-chip fp-compat-chip fp-compat--${fishCompat.temperament}`, children: fishCompat.temperament }),
          (fishCompat == null ? void 0 : fishCompat.schoolSize) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fp-meta-chip fp-compat-chip fp-compat--school", children: [
            "school ",
            fishCompat.schoolSize,
            "+"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-value-banner", style: { "--rarity-color": rarity.color }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-value-coin", children: "🪙" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-value-number", children: salePrice }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-value-label", children: "sale value" }),
      marketDelta !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `fp-value-delta ${marketDelta > 0 ? "fp-value-delta--up" : ""}`, children: [
        marketDelta > 0 ? "+" : "-",
        " ",
        marketDelta > 0 ? "+" : "",
        marketDelta,
        "% market"
      ] }),
      showDelta && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fp-value-delta", title: `Health penalty: ${healthDelta}%`, children: [
        healthDelta,
        "% ",
        disease ? "sick" : "health"
      ] })
    ] }),
    disease && (() => {
      var _a2;
      const stage = getDiseaseStage(fish.diseaseSince, gameClock);
      const isIncubating = stage === "incubating";
      const hasDiagnosis = fish.diagnosed || !isIncubating;
      const symptomText = ((_a2 = disease.symptoms) == null ? void 0 : _a2[stage]) || "";
      const cureName = disease.treatmentName;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `fp-disease fp-disease--${stage}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-disease-icon", children: hasDiagnosis ? disease.emoji : "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-disease-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-disease-name", children: hasDiagnosis ? `${disease.name} — ${stage}` : "Unknown Illness — Incubating" }),
          hasDiagnosis ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-disease-desc", children: disease.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-disease-symptom", children: [
              "Symptoms: ",
              symptomText || "none visible yet"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-disease-cure", children: [
              "Treatment: ",
              cureName
            ] }),
            stage === "severe" || stage === "critical" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-disease-warn", children: [
              "⚠ Cure success: ",
              Math.round((CURE_SUCCESS_RATE[stage] || 0.5) * 100),
              "%"
            ] }) : null
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-disease-desc", children: "Something seems wrong... Use a Diagnostic Kit to identify, or wait for symptoms." }),
          disease.spreadChancePerSec > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-disease-spread", children: "⚠ Contagious — isolate or treat quickly!" })
        ] })
      ] });
    })(),
    recommendation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-recommendation", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-rec-text", children: recommendation }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-section-header", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-section-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconHeart, { size: 12 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-section-title", children: "Health" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-section-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RichStatBar, { label: "Health", value: healthPct, color: healthColor, icon: "HP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RichStatBar, { label: "Satiety", value: satietyPct, color: satietyColor, icon: "" }),
        fish.stage === "adult" && (() => {
          var _a2;
          const ageSeconds = fish.age || 0;
          const maxAge = LIFESPAN_BY_RARITY[((_a2 = fish.species) == null ? void 0 : _a2.rarity) || "common"] || LIFESPAN_BY_RARITY.common;
          const agePct = Math.min(100, Math.round(ageSeconds / maxAge * 100));
          const ageHours = Math.floor(ageSeconds / 3600);
          const ageMins = Math.floor(ageSeconds % 3600 / 60);
          const ageLabel2 = ageHours > 0 ? `${ageHours}h ${ageMins}m` : `${ageMins}m`;
          const isElder = ageSeconds > maxAge;
          const ageColor = isElder ? "#c44040" : agePct > 75 ? "#c49040" : "#5aaa70";
          return /* @__PURE__ */ jsxRuntimeExports.jsx(RichStatBar, { label: isElder ? "Elder" : "Age", value: agePct, color: ageColor, icon: ageLabel2 });
        })()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ActionBtn,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconFeed, {}),
          label: `Feed (${foodStock})`,
          onClick: () => onFeed(fish.id),
          disabled: fish.hunger < 20,
          variant: "feed",
          highlight: bestAction === "feed",
          disabledTitle: "Fish is full"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ActionBtn,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconMedicine, {}),
          label: disease ? `${disease.treatmentName} (${medicineStock})` : `Treat (${medicineStock})`,
          onClick: () => onMedicine(fish.id),
          disabled: !needsMedicine || medicineStock <= 0,
          disabledTitle: medicineStock <= 0 ? "No medicine in stock" : "Fish is healthy — no treatment needed",
          variant: "medicine",
          pulse: needsMedicine && medicineStock > 0,
          highlight: bestAction === "medicine"
        }
      ),
      disease && !fish.diagnosed && getDiseaseStage(fish.diseaseSince, gameClock) === "incubating" && (() => {
        var _a2, _b2;
        const diagKits = fish.tankId ? ((_b2 = (_a2 = tanks.find((t) => t.id === fish.tankId)) == null ? void 0 : _a2.supplies) == null ? void 0 : _b2.diagnosticKit) || 0 : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionBtn,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconDiagnose, {}),
            label: `Diagnose (${diagKits})`,
            onClick: () => useGameStore.getState().diagnoseFish(fish.id),
            disabled: diagKits <= 0,
            disabledTitle: "No diagnostic kits — buy from Shop → Supplies",
            variant: "medicine"
          }
        );
      })(),
      !disease && !(fish.vitaminUntil && fish.vitaminUntil > (gameClock || Date.now())) && (() => {
        var _a2, _b2;
        const vitCount = fish.tankId ? ((_b2 = (_a2 = tanks.find((t) => t.id === fish.tankId)) == null ? void 0 : _a2.supplies) == null ? void 0 : _b2.vitamins) || 0 : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionBtn,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconVitamins, {}),
            label: `Vitamins (${vitCount})`,
            onClick: () => useGameStore.getState().giveVitamins(fish.id),
            disabled: vitCount <= 0 || fish.stage !== "adult",
            disabledTitle: vitCount <= 0 ? "No vitamins — buy from Shop → Supplies" : "Not available",
            variant: "feed"
          }
        );
      })(),
      isListed ? /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconListed, {}), label: "Listed", onClick: () => onSell(fish.id), variant: "listed" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        ActionBtn,
        {
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconSell, {}),
          label: `Sell · ${salePrice}`,
          onClick: () => onSell(fish.id),
          disabled: fish.stage !== "adult",
          variant: "sell",
          highlight: bestAction === "sell",
          disabledTitle: `Can't sell yet — fish is still a ${fish.stage}`
        }
      )
    ] }),
    hasGenetics && hasBredBefore && (() => {
      const carriers = getCarrierTraits(fish.genome);
      const legendary = checkLegendaryCombo(fish.phenotype);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-section fp-section--genetics", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "fp-section-header fp-section-header--toggle", onClick: () => setShowGenetics((v) => !v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-section-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(IconDNA, { size: 12 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-section-title", children: "Genetics" }),
          legendary && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fp-legendary-badge", children: [
            legendary.emoji,
            " ",
            legendary.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-toggle-arrow", children: showGenetics ? "▲" : "▼" })
        ] }),
        showGenetics && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-section-body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Chromacode, { genome: fish.genome, showLabels: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-dna-card", children: Object.entries(GENES).map(([geneKey, geneData]) => {
            if (!fish.genome[geneKey]) return null;
            const [a1, a2] = fish.genome[geneKey];
            const allele1 = geneData.alleles[a1];
            const allele2 = geneData.alleles[a2];
            if (!allele1 || !allele2) return null;
            const d1 = allele1.dominant ?? 0;
            const d2 = allele2.dominant ?? 0;
            const expressed = d1 >= d2 ? allele1.name : allele2.name;
            const isHetero = a1 !== a2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-dna-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-dna-gene", children: geneData.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-dna-expressed", children: expressed }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fp-dna-alleles", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `fp-dna-dot ${d1 >= d2 ? "fp-dna-dot--dominant" : "fp-dna-dot--recessive"}`,
                    title: `${allele1.name} (${a1})`,
                    children: a1
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `fp-dna-dot ${d2 > d1 ? "fp-dna-dot--dominant" : "fp-dna-dot--recessive"}`,
                    title: `${allele2.name} (${a2})`,
                    children: a2
                  }
                )
              ] }),
              isHetero && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-dna-hetero", children: "⚡" })
            ] }, geneKey);
          }) }),
          carriers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-carriers", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-carriers-label", children: "Hidden traits (recessive):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-carriers-tags", children: carriers.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-carrier-tag", title: `This fish carries ${c.carried} for ${c.gene}, but expresses ${c.expressed}`, children: c.carried }, i)) })
          ] }),
          legendary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-legendary-combo", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-legendary-combo-name", children: [
              legendary.emoji,
              " ",
              legendary.name
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-legendary-combo-desc", children: legendary.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-legendary-combo-bonus", children: [
              "+",
              legendary.priceBonus,
              "× sale value"
            ] })
          ] })
        ] })
      ] });
    })(),
    tanks.length > 1 && onMoveFish && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-move", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `fp-move-toggle${showMove ? " fp-move-toggle--open" : ""}`,
          onClick: () => setShowMove((v) => !v),
          children: [
            "↔ Move to tank ",
            showMove ? "▲" : "▼"
          ]
        }
      ),
      showMove && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-move-btns", children: tanks.filter((t) => t.id !== fish.tankId).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "fp-move-btn", onClick: () => {
        onMoveFish(fish.id, t.id);
        setShowMove(false);
      }, children: t.name }, t.id)) })
    ] })
  ] });
}
function RichStatBar({ label, value, color, icon }) {
  const [displayed, setDisplayed] = reactExports.useState(value);
  const prevValue = reactExports.useRef(value);
  reactExports.useEffect(() => {
    const initial = prevValue.current;
    prevValue.current = value;
    const diff = value - initial;
    if (diff === 0) return;
    let start = null;
    const dur = 550;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(initial + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [value]);
  const pct = Math.max(0, Math.min(100, displayed));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-stat-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-stat-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-stat-icon", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-stat-label", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fp-stat-pct", style: { color }, children: [
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fp-bar-track", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-bar-fill", style: { width: `${pct}%`, background: color, boxShadow: `0 0 10px ${color}55` } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fp-bar-shine" })
    ] })
  ] });
}
function ActionBtn({ icon, label, onClick, disabled, variant, pulse, highlight, disabledTitle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      className: `fp-action-btn fp-action-btn--${variant}${pulse ? " fp-action-btn--pulse" : ""}${highlight ? " fp-action-btn--highlight" : ""}`,
      onClick,
      disabled,
      title: disabled && disabledTitle ? disabledTitle : void 0,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-action-icon", children: icon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fp-action-label", children: label })
      ]
    }
  );
}
const FishPanel$1 = reactExports.memo(
  FishPanel,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.health) === ((_d = next.fish) == null ? void 0 : _d.health) && ((_e = prev.fish) == null ? void 0 : _e.hunger) === ((_f = next.fish) == null ? void 0 : _f.hunger) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && prev.isListed === next.isListed && prev.foodStock === next.foodStock && prev.medicineStock === next.medicineStock && prev.tanks === next.tanks && prev.isFirstRun === next.isFirstRun && prev.onNavigate === next.onNavigate;
  }
);
function Tip({ text, children, pos = "top" }) {
  const [show, setShow] = reactExports.useState(false);
  const [coords, setCoords] = reactExports.useState({ x: 0, y: 0 });
  const ref = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const handleEnter = reactExports.useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = pos === "bottom" ? rect.bottom + 6 : rect.top - 6;
    setCoords({ x, y });
    timerRef.current = setTimeout(() => setShow(true), 400);
  }, [pos]);
  const handleLeave = reactExports.useCallback(() => {
    clearTimeout(timerRef.current);
    setShow(false);
  }, []);
  if (!text) return children;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      ref,
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
      style: { display: "inline-flex", position: "relative" },
      children: [
        children,
        show && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `game-tip game-tip--${pos}`,
            style: {
              position: "fixed",
              left: coords.x,
              top: coords.y,
              transform: pos === "bottom" ? "translateX(-50%)" : "translateX(-50%) translateY(-100%)",
              zIndex: 1e4
            },
            children: text
          }
        )
      ]
    }
  );
}
function _getTankCompatIssues(fish) {
  if (fish.length < 2) return [];
  return getTankCompatSummary(fish).issues;
}
function IncomeRate() {
  const coins2 = useGameStore((s) => s.player.coins);
  const [rate, setRate] = reactExports.useState(0);
  const historyRef = reactExports.useRef([]);
  reactExports.useEffect(() => {
    const now = Date.now();
    historyRef.current.push({ time: now, coins: coins2 });
    const cutoff = now - 6e4;
    historyRef.current = historyRef.current.filter((h) => h.time > cutoff);
    const history = historyRef.current;
    if (history.length < 2) return;
    const oldest = history[0];
    const dt = (now - oldest.time) / 6e4;
    if (dt < 0.08) return;
    const earned = coins2 - oldest.coins;
    setRate(Math.max(0, Math.round(earned / dt)));
  }, [coins2]);
  if (rate <= 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Income per minute", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-income-rate", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-income-val", children: [
    rate,
    "/min"
  ] }) }) });
}
function NextGoalTeaser() {
  const coins2 = useGameStore((s) => s.player.coins);
  const tanks = useGameStore((s) => s.tanks);
  const upgrades = useGameStore((s) => s.shop.upgrades);
  const goals = [];
  const tankCount = (tanks == null ? void 0 : tanks.length) || 1;
  if (TANK_UNLOCK[tankCount]) {
    goals.push({
      label: TANK_UNLOCK[tankCount].label,
      cost: TANK_UNLOCK[tankCount].cost,
      icon: ""
    });
  }
  if (upgrades) {
    const upgradeNames = { slot: "Shop Slot", capacity: "Tank Size", reputation: "Advertising", breeding: "Breed Speed", lighting: "Lighting", vip: "VIP Access", hatchery: "Hatchery", tankSitter: "Tank Sitter" };
    for (const [id, upg] of Object.entries(upgrades)) {
      if (upg.level >= (upg.maxLevel || 5)) continue;
      const cost = upgradeCost(upg.cost, upg.level);
      goals.push({
        label: `${upgradeNames[id] || id} Lv${upg.level + 1}`,
        cost,
        icon: ""
      });
    }
  }
  if (goals.length === 0) return null;
  goals.sort((a, b) => a.cost - b.cost);
  const goal = goals.find((g) => g.cost > coins2) || goals[goals.length - 1];
  if (!goal || coins2 >= goal.cost) return null;
  const pct = Math.min(100, Math.round(coins2 / goal.cost * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-next-goal", title: `${goal.label}: ${coins2.toLocaleString()} / ${goal.cost.toLocaleString()} coins`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-goal-label", children: [
      goal.icon,
      " ",
      goal.label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-goal-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-goal-fill", style: { width: `${pct}%` } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-goal-cost", children: [
      coins2.toLocaleString(),
      "/",
      goal.cost.toLocaleString()
    ] })
  ] });
}
function CustomerCountdown() {
  const lastAt = useGameStore((s) => s.shop.lastCustomerAt);
  const listed = useGameStore((s) => {
    var _a;
    return ((_a = s.shop.listedFish) == null ? void 0 : _a.length) || 0;
  });
  const [secsLeft, setSecsLeft] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (listed <= 0) {
      setSecsLeft(null);
      return;
    }
    function update() {
      const state = useGameStore.getState();
      const interval = getCustomerInterval(state);
      const elapsed = (state.gameClock || Date.now()) - (state.shop.lastCustomerAt || (state.gameClock || Date.now()));
      const remaining = Math.max(0, Math.ceil((interval - elapsed) / 1e3));
      setSecsLeft(remaining);
    }
    update();
    const id = setInterval(update, 1e3);
    return () => clearInterval(id);
  }, [lastAt, listed]);
  if (secsLeft === null || listed <= 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-customer-timer", "aria-label": "Time until next customer arrives", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-customer-icon" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-customer-val", children: secsLeft > 0 ? `${secsLeft}s` : "arriving..." })
  ] });
}
function CoinDisplay({ value }) {
  const [displayed, setDisplayed] = reactExports.useState(value);
  const [flash, setFlash] = reactExports.useState(null);
  const prevRef = reactExports.useRef(value);
  const rafRef = reactExports.useRef(null);
  const lastDiffRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = value;
    const diff = value - prev;
    if (diff === 0) return;
    lastDiffRef.current = diff;
    setFlash(diff > 0 ? "up" : "down");
    const flashTimer = setTimeout(() => setFlash(null), 900);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const start = prev;
    const end = value;
    const duration = Math.min(700, Math.abs(diff) * 2 + 200);
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      clearTimeout(flashTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);
  const bumpClass = flash === "up" ? lastDiffRef.current >= 200 ? " hud2-coin-val--mega-bump" : " hud2-coin-val--bump" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `hud2-coin ${flash ? `hud2-coin--${flash}` : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-coin-icon", children: "🪙" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `hud2-coin-val${bumpClass}`, children: displayed.toLocaleString() })
  ] });
}
function StatPill({ icon, value, label, color, alert }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: label, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `hud2-pill ${alert ? "hud2-pill--alert" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-pill-icon", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-pill-val", style: color ? { color } : void 0, children: value })
  ] }) });
}
function RepBadge({ rep }) {
  const r = rep || 0;
  const tier = r < 100 ? "Local" : r < 300 ? "Known" : r < 600 ? "Popular" : "Famous";
  const col = r < 100 ? "#6a7a88" : r < 300 ? "#5a9aaa" : r < 600 ? "#8a70a8" : "#b0944a";
  const next = r < 100 ? 100 : r < 300 ? 300 : r < 600 ? 600 : 999;
  const pct = Math.min(100, Math.round(r / next * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-rep", title: `Reputation ${r} — ${tier}
Next tier at ${next}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-rep-tier", style: { color: col }, children: tier }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-rep-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-rep-fill", style: { width: `${pct}%`, background: col } }) })
  ] });
}
function HappinessBar({ value }) {
  const v = Math.max(0, Math.min(100, value ?? 100));
  const col = v > 70 ? "#5aaa70" : v > 40 ? "#b0944a" : "#c44040";
  const em = v > 70 ? "Good" : v > 40 ? "Fair" : "Low";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-happy", title: `Happiness: ${v}%`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-happy-icon", children: em }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-happy-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-happy-fill", style: { width: `${v}%`, background: col } }) })
  ] });
}
function UrgentOfferBanner() {
  const offer = useGameStore((s) => s.urgentOffer);
  const [timeLeft, setTimeLeft] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!(offer == null ? void 0 : offer.expiresAt)) return;
    const tick = () => {
      const ms = Math.max(0, offer.expiresAt - Date.now());
      if (ms <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }
      const m = Math.floor(ms / 6e4);
      const s = Math.floor(ms % 6e4 / 1e3);
      setTimeLeft(`${m}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [offer == null ? void 0 : offer.expiresAt]);
  if (!offer || !offer.expiresAt || Date.now() >= offer.expiresAt) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-urgent", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-urgent-name", children: offer.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-urgent-desc", children: offer.desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-urgent-timer", children: timeLeft })
  ] });
}
function LevelBar({ xp }) {
  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp || 0);
  const pct = nextLevelXp > 0 ? Math.min(100, currentXp / nextLevelXp * 100) : 100;
  const title = getLevelTitle(level);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-level", title: `${title}
${currentXp} / ${nextLevelXp} XP to next level`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-level-badge", children: [
      "Lv.",
      level
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-level-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-level-fill", style: { width: `${pct}%` } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-level-xp", children: [
      currentXp,
      "/",
      nextLevelXp
    ] })
  ] });
}
function HUD({
  player,
  shop,
  tanks,
  activeTank,
  fish,
  selectedFishTankId,
  onBuyFood,
  onTreatWater,
  onToggleAutoFeed,
  onUseHeater,
  soundOn,
  onToggleSound
}) {
  var _a, _b, _c, _d, _e, _f;
  const displayTank = selectedFishTankId && (tanks == null ? void 0 : tanks.find((t) => t.id === selectedFishTankId)) || activeTank || (tanks == null ? void 0 : tanks[0]) || {};
  const tank = displayTank;
  const wq = Math.round(tank.waterQuality ?? 100);
  const temp = tank.temperature ?? 74;
  const wqCol = wq > 70 ? "#5aaa70" : wq > 40 ? "#b0944a" : "#c44040";
  const tempCol = temp < 68 || temp > 82 ? "#c44040" : temp < 71 || temp > 79 ? "#b0944a" : "#5aaa70";
  const fishCnt = fish ? fish.filter((f) => f.tankId === tank.id).length : 0;
  const food = ((_a = tank.supplies) == null ? void 0 : _a.food) ?? 0;
  const tempBad = temp < 68 || temp > 82;
  const wqBad = wq < 60;
  const tankFish = fish ? fish.filter((f) => f.tankId === tank.id && f.stage !== "egg") : [];
  const compatIssues = _getTankCompatIssues(tankFish);
  const hasCompatIssues = compatIssues.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "hud2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(UrgentOfferBanner, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-row hud2-row--top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-title", children: "Fish Tycoon" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-divider hud2-divider--v" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CoinDisplay, { value: player.coins }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(IncomeRate, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LevelBar, { xp: player.xp }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CustomerCountdown, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-spacer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-bars", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HappinessBar, { value: tank.happiness }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RepBadge, { rep: shop == null ? void 0 : shop.reputation })
      ] }),
      onToggleSound && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-divider hud2-divider--v" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "hud2-btn hud2-btn--icon",
            onClick: onToggleSound,
            title: soundOn ? "Mute" : "Unmute",
            children: soundOn ? "Sound" : "Muted"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-row hud2-row--bottom", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-pills", children: [
        ((_b = player.activeLoan) == null ? void 0 : _b.active) && /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconLoan, { size: 11 }), value: "LOAN", label: "Active loan — repay before deadline!", color: "#ff6060", alert: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconWater, { size: 11 }), value: `${wq}%`, label: "Water quality", color: wqCol, alert: wqBad }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconTemp, { size: 11 }), value: `${Math.round(temp)}°`, label: "Temperature", color: tempCol, alert: tempBad }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconFish, { size: 11 }), value: `${fishCnt}/${tank.capacity ?? 12}`, label: `Fish capacity (${tank.size || "medium"})` }),
        (() => {
          const nextSize = getNextTankSize(tank);
          if (!nextSize) return null;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "hud2-tank-upgrade",
              onClick: () => useGameStore.getState().upgradeTankSize(tank.id),
              disabled: coins < nextSize.cost,
              title: `Upgrade to ${nextSize.label} (${nextSize.capacity} fish) — ${nextSize.cost} coins`,
              children: [
                nextSize.label,
                " (",
                nextSize.cost,
                ")"
              ]
            }
          );
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(IconFood, { size: 11 }), value: food < 1 ? "Empty" : `${food} feeds`, label: `Food supply (${food} remaining)`, alert: food < 3 }),
        hasCompatIssues && /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { icon: "!", value: "COMPAT", label: compatIssues.join(", "), color: "#c44040", alert: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-spacer" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud2-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `hud2-btn ${tank.autoFeed ? "hud2-btn--active" : ""}`,
            onClick: () => onToggleAutoFeed(tank.id),
            title: tank.autoFeed ? "Auto-feed ON" : "Auto-feed OFF",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-btn-label", children: tank.autoFeed ? "Auto ✓" : "Auto" })
          }
        ),
        tempBad && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "hud2-btn hud2-btn--warn",
            onClick: () => onUseHeater(tank.id),
            disabled: (((_c = tank.supplies) == null ? void 0 : _c.heater) || 0) <= 0,
            title: `Adjust temperature (${((_d = tank.supplies) == null ? void 0 : _d.heater) || 0} left)`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-btn-label", children: "Temp" })
          }
        ),
        wqBad && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "hud2-btn hud2-btn--warn",
            onClick: () => onTreatWater(tank.id),
            disabled: (((_e = tank.supplies) == null ? void 0 : _e.waterTreatment) || 0) <= 0,
            title: `Treat water (${((_f = tank.supplies) == null ? void 0 : _f.waterTreatment) || 0} left)`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-btn-label", children: "Treat" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "hud2-btn",
            onClick: onBuyFood,
            disabled: player.coins < 10,
            children: [
              "+ ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hud2-btn-label", children: "Food" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FeedAllButton, { tankId: tank == null ? void 0 : tank.id, food })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NextGoalTeaser, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveBoosts, {})
  ] });
}
const BOOST_INFO = {
  growSpeed: { emoji: "", label: "Growth +50%" },
  healthRegen: { emoji: "", label: "Regen ×3" },
  salePrice: { emoji: "", label: "Prices +25%" },
  passiveIncome: { emoji: "", label: "Income ×2" }
};
function ActiveBoosts() {
  const boosts = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.boosts) || {};
  });
  const gameClock = useGameStore((s) => s.gameClock || Date.now());
  const active = Object.entries(boosts).filter(([, exp]) => exp > gameClock);
  if (active.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hud2-boosts", children: active.map(([key, exp]) => {
    const info = BOOST_INFO[key] || { emoji: "", label: key };
    const mins = Math.max(0, Math.ceil((exp - gameClock) / 6e4));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-boost-pill", children: [
      info.emoji,
      " ",
      info.label,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-boost-time", children: [
        mins,
        "m"
      ] })
    ] }, key);
  }) });
}
function FeedAllButton({ tankId, food }) {
  const feedAll = useGameStore((s) => s.feedAllInTank);
  const hungryCount = useGameStore(
    (s) => s.fish.filter((f) => f.tankId === tankId && f.stage !== "egg" && f.hunger > 30).length
  );
  if (hungryCount === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      className: "hud2-btn hud2-btn--feed-all",
      onClick: () => feedAll(tankId),
      disabled: food <= 0,
      title: `Feed ${hungryCount} hungry fish (1 food each)`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hud2-btn-label", children: [
        "Feed All (",
        hungryCount,
        ")"
      ] })
    }
  );
}
function classifyMessage(entry) {
  if (entry.severity) return entry.severity;
  const msg = entry.message || "";
  if (/died|contracted|sick|overdue/i.test(msg) || msg.includes("died") || msg.includes("contracted")) return "critical";
  if (/^(Milestone|Achievement|Collected|Hatched|LEVEL UP)/i.test(msg)) return "success";
  if (/magic fish/i.test(msg)) return "warn";
  return "info";
}
function getHighlight(message = "") {
  if (/magic fish/i.test(message)) return "epic";
  if (message.includes("Legendary") || message.includes("legendary")) return "epic";
  if (/New species/i.test(message) && (message.includes("Epic") || message.includes("Rare"))) return "epic";
  if (/Challenge complete/i.test(message)) return "notable";
  if (/Collected.*egg|egg.*ready/i.test(message)) return "notable";
  if (/Hatched|hatching/i.test(message)) return "notable";
  if (/Milestone|Achievement/i.test(message)) return "notable";
  if (/market|rare item/i.test(message)) return "notable";
  if (/Upgraded|Unlocked/i.test(message)) return "notable";
  if (/New species|species:/i.test(message)) return "notable";
  const saleMatch = message.match(/bought.*?(\d+)/);
  if (saleMatch && parseInt(saleMatch[1], 10) >= 150) return "notable";
  return null;
}
const EMOJI_RE = new RegExp("^(\\p{Emoji_Presentation}\\p{Emoji_Modifier}?\\p{Emoji_Component}*(?:\\u200D\\p{Emoji_Presentation}\\p{Emoji_Modifier}?\\p{Emoji_Component}*)*)\\s*", "u");
function getLogIcon(message = "", severity = "info") {
  const match = message.match(EMOJI_RE);
  if (match) {
    return { icon: match[1], text: message.slice(match[0].length) };
  }
  const fallback = { critical: "!", warn: "·", success: "·", info: "·" };
  return { icon: fallback[severity] ?? "•", text: message };
}
function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function LogPanel({ log = [] }) {
  const [filter, setFilter] = reactExports.useState("all");
  const [collapsed, setCollapsed] = reactExports.useState(false);
  const entriesRef = reactExports.useRef(null);
  const classified = reactExports.useMemo(
    () => log.map((entry) => {
      const sev = classifyMessage(entry);
      const { icon, text } = getLogIcon(entry.message, sev);
      const hl = getHighlight(entry.message);
      return { ...entry, _sev: sev, _icon: icon, _text: text, _hl: hl };
    }),
    [log]
  );
  const criticalCount = classified.filter((e) => e._sev === "critical").length;
  const visible = filter === "all" ? classified : classified.filter((e) => e._sev === filter);
  reactExports.useEffect(() => {
    if (entriesRef.current) {
      entriesRef.current.scrollTop = entriesRef.current.scrollHeight;
    }
  }, [visible.length]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-panel-header", onClick: () => setCollapsed((c) => !c), style: { cursor: "pointer" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "log-panel-title", children: [
        "Activity Log",
        criticalCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-alert-badge", children: criticalCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-panel-controls", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `log-filter-btn ${filter === "all" ? "active" : ""}`,
            onClick: () => setFilter("all"),
            "aria-label": "Show all messages",
            children: "All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `log-filter-btn log-filter-btn--warn ${filter === "warn" ? "active" : ""}`,
            onClick: () => setFilter("warn"),
            "aria-label": "Show important events",
            children: "Events"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `log-filter-btn log-filter-btn--critical ${filter === "critical" ? "active" : ""}`,
            onClick: () => setFilter("critical"),
            "aria-label": "Show critical alerts only",
            children: "Alerts"
          }
        ),
        filter !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "log-entry-count", children: [
          visible.length,
          " of ",
          classified.length
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "log-collapse-btn", onClick: () => setCollapsed((c) => !c), children: collapsed ? "▼" : "▲" })
      ] })
    ] }),
    !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-entries", ref: entriesRef, children: [
      visible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-empty", children: [
        "No ",
        filter !== "all" ? filter + " " : "",
        "messages yet."
      ] }),
      visible.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `log-entry log-entry--${entry._sev}${entry._hl ? ` log-entry--${entry._hl}` : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-entry-icon", "aria-hidden": "true", children: entry._icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-entry-time", children: formatTime(entry.time) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-entry-msg", children: entry._text })
          ]
        },
        entry.time + "-" + i
      ))
    ] })
  ] });
}
function BreedingForecast({ fishA, fishB }) {
  var _a, _b, _c;
  if (!(fishA == null ? void 0 : fishA.genome) || !(fishB == null ? void 0 : fishB.genome)) return null;
  const forecast = reactExports.useMemo(
    () => perGeneBreedingForecast(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );
  const rarityForecast = reactExports.useMemo(
    () => breedingRarityForecast(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );
  const carriers = reactExports.useMemo(
    () => findSharedCarriers(fishA.genome, fishB.genome),
    [fishA.id, fishB.id]
  );
  const purityA = purityTier(fishA.genome);
  const purityB = purityTier(fishB.genome);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-forecast-title", children: "Gene Mixer" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-parents", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-parent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-parent-name", children: [
          ((_a = fishA.species) == null ? void 0 : _a.name) || "Parent A",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "breed-forecast-gen", children: [
            "Gen ",
            fishA.generation || 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chromacode, { genome: fishA.genome, compact: true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-forecast-x", children: "×" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-parent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-parent-name", children: [
          ((_b = fishB.species) == null ? void 0 : _b.name) || "Parent B",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "breed-forecast-gen", children: [
            "Gen ",
            fishB.generation || 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Chromacode, { genome: fishB.genome, compact: true })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-forecast-genes", children: forecast.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-gene", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfg-label", children: [
        g.emoji,
        " ",
        g.shortName
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfg-outcomes", children: g.outcomes.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfg-outcome", style: { flex: o.percent }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfg-bar", style: { background: o.color, width: "100%" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfg-info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bfg-name", children: o.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bfg-pct", children: [
            o.percent,
            "%"
          ] })
        ] })
      ] }, o.name)) })
    ] }, g.gene)) }),
    carriers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-forecast-carriers", children: carriers.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-carrier-hint", children: [
      "Both parents carry recessive ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: c.alleleName }),
      " (",
      c.geneName,
      ")!",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "breed-carrier-chance", children: [
        c.chance,
        "% chance of expression"
      ] })
    ] }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-forecast-rarity", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-title", children: "Rarity Estimate" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-bars", children: rarityForecast.distribution.map((r) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfr-bar-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bfr-label", style: { color: ((_a2 = RARITY[r.rarity]) == null ? void 0 : _a2.color) || "#888" }, children: r.rarity }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-track", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-fill", style: {
            width: `${r.percent}%`,
            background: ((_b2 = RARITY[r.rarity]) == null ? void 0 : _b2.color) || "#888"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bfr-pct", children: [
            r.percent,
            "%"
          ] })
        ] }, r.rarity);
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfr-best", children: [
        "Best case: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: (_c = RARITY[rarityForecast.bestCase]) == null ? void 0 : _c.color }, children: rarityForecast.bestCase.toUpperCase() })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-forecast-purity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "Offspring purity: ~",
      Math.round((purityA.pure + purityB.pure) / 2),
      "-",
      Math.max(purityA.pure, purityB.pure),
      "/",
      purityA.total,
      " genes pure"
    ] }) })
  ] });
}
function TraitTag({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trait-tag", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trait-tag-label", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "trait-tag-value", children: value })
  ] });
}
function BreedSlot({ fish, slot, isDonor, onRemove, onDrop }) {
  var _a, _b, _c, _d;
  const [dragOver, setDragOver] = reactExports.useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const fishId = e.dataTransfer.getData("fishId");
    if (fishId) onDrop(fishId, slot);
  };
  const slotLabel = isDonor ? "Genetic Donor" : `Parent ${slot}`;
  const emptyIcon = isDonor ? "D" : "+";
  const emptyHint = isDonor ? "Optional — influences offspring traits" : "Drag a fish here";
  if (!fish) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `breed-slot empty ${isDonor ? "breed-slot--donor" : ""} ${dragOver ? "drag-over" : ""}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-num", children: slotLabel }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-icon", children: emptyIcon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-hint", children: emptyHint })
        ]
      }
    );
  }
  const rarityColor = ((_b = RARITY[(_a = fish.species) == null ? void 0 : _a.rarity]) == null ? void 0 : _b.color) || "#888";
  const ph = fish.phenotype;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `breed-slot filled ${isDonor ? "breed-slot--donor" : ""} ${dragOver ? "drag-over" : ""}`,
      style: { "--rarity-color": rarityColor },
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-num", children: slotLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-name", children: ((_c = fish.species) == null ? void 0 : _c.name) || "Unknown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-slot-rarity", style: { color: rarityColor }, children: ((_d = fish.species) == null ? void 0 : _d.rarity) || "common" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-slot-traits", children: [
          ph.bodyShape && /* @__PURE__ */ jsxRuntimeExports.jsx(TraitTag, { label: "Body", value: ph.bodyShape }),
          ph.primaryColor && /* @__PURE__ */ jsxRuntimeExports.jsx(TraitTag, { label: "Color", value: ph.primaryColor }),
          ph.glow && ph.glow !== "Normal" && /* @__PURE__ */ jsxRuntimeExports.jsx(TraitTag, { label: "Glow", value: ph.glow }),
          ph.mutation && ph.mutation !== "None" && /* @__PURE__ */ jsxRuntimeExports.jsx(TraitTag, { label: "Mutation", value: ph.mutation })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-danger", onClick: onRemove, children: "Remove" })
      ]
    }
  );
}
function PredictionBar({ outcome }) {
  var _a, _b, _c, _d, _e;
  const rarityColor = ((_b = RARITY[(_a = outcome.species) == null ? void 0 : _a.rarity]) == null ? void 0 : _b.color) || "#888";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "predict-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "predict-name", style: { color: rarityColor }, children: ((_c = outcome.species) == null ? void 0 : _c.name) || "Unknown" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "predict-rarity", style: { color: rarityColor }, children: ((_d = outcome.species) == null ? void 0 : _d.rarity) || "common" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "predict-bar-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "predict-bar", style: { width: `${outcome.chance}%`, background: rarityColor } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "predict-chance", style: { color: rarityColor, fontWeight: 600 }, children: [
      outcome.chance,
      "%"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "predict-price", children: [
      "🪙",
      ((_e = outcome.species) == null ? void 0 : _e.basePrice) ?? "?"
    ] })
  ] });
}
function BreedFishRow({ fish, inSlot, onSelect, onDragStart }) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const rarityColor = ((_b = RARITY[(_a = fish.species) == null ? void 0 : _a.rarity]) == null ? void 0 : _b.color) || "#888";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `breed-fish-row ${inSlot ? "in-slot" : ""}`,
      draggable: !inSlot,
      onDragStart: (e) => {
        e.dataTransfer.setData("fishId", fish.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart == null ? void 0 : onDragStart(fish.id);
      },
      onClick: () => onSelect(fish.id),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-drag-handle", children: "⠿" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-dot", style: { background: rarityColor } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-name", children: ((_c = fish.species) == null ? void 0 : _c.name) || "Unknown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bfr-rarity", style: { color: rarityColor }, children: ((_d = fish.species) == null ? void 0 : _d.rarity) || "common" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bfr-traits", children: [
          (_e = fish.phenotype) == null ? void 0 : _e.bodyShape,
          " · ",
          (_f = fish.phenotype) == null ? void 0 : _f.primaryColor,
          ((_g = fish.phenotype) == null ? void 0 : _g.glow) && fish.phenotype.glow !== "Normal" ? ` · ${fish.phenotype.glow}` : "",
          ((_h = fish.phenotype) == null ? void 0 : _h.mutation) && fish.phenotype.mutation !== "None" ? ` · ${fish.phenotype.mutation}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `btn btn-sm${inSlot ? " btn-warn" : ""}`,
            onClick: (e) => {
              e.stopPropagation();
              onSelect(fish.id);
            },
            children: inSlot ? "✕ Remove" : "Select"
          }
        )
      ]
    }
  );
}
function BreedingLab({ fish, breedingTank, extraBays = [], maxBays = 1, onSelectForBreeding, onCollectEgg, onCancelBreeding, onNavigate }) {
  var _a, _b;
  const [activeBay, setActiveBay] = reactExports.useState(0);
  const allBays = [breedingTank, ...extraBays];
  const bay = allBays[activeBay] || breedingTank;
  const slots = (bay == null ? void 0 : bay.slots) || [null, null];
  const hasThirdSlot = slots.length >= 3;
  const fishA = (fish || []).find((f) => f.id === slots[0]);
  const fishB = (fish || []).find((f) => f.id === slots[1]);
  const fishC = hasThirdSlot ? (fish || []).find((f) => f.id === slots[2]) : null;
  const bothSelected = fishA && fishB;
  const canPredict = bothSelected && ((_a = fishA.species) == null ? void 0 : _a.visualType) !== "species" && ((_b = fishB.species) == null ? void 0 : _b.visualType) !== "species";
  const predictions = reactExports.useMemo(() => {
    if (!canPredict) return [];
    return predictOffspringPhenotypes(fishA.genome, fishB.genome);
  }, [fishA == null ? void 0 : fishA.id, fishB == null ? void 0 : fishB.id, canPredict]);
  const gameClock = useGameStore((s) => s.gameClock);
  let progress = 0;
  let timeRemainingLabel = null;
  if (bay.breedingStartedAt && !bay.eggReady) {
    const elapsed = (gameClock || Date.now()) - bay.breedingStartedAt;
    const duration = bay.breedingDurationMs || 3e5;
    progress = Math.min(100, elapsed / duration * 100);
    const msLeft = Math.max(0, duration - elapsed);
    const secsLeft = Math.ceil(msLeft / 1e3);
    timeRemainingLabel = secsLeft < 60 ? `${secsLeft}s left` : `~${Math.ceil(secsLeft / 60)}m left`;
  } else if (bay.eggReady) {
    progress = 100;
  }
  const availableFish = fish.filter((f) => f.stage === "adult");
  const handleSlotDrop = reactExports.useCallback((fishId, slot) => {
    const inSlot0 = bay.slots[0] === fishId;
    const inSlot1 = bay.slots[1] === fishId;
    const inSlot2 = bay.slots[2] === fishId;
    if (slot === 1 && inSlot0 || slot === 2 && inSlot1 || slot === 3 && inSlot2) return;
    onSelectForBreeding(fishId, activeBay);
  }, [bay.slots, onSelectForBreeding]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breeding-lab", children: [
    maxBays > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-bay-tabs", children: Array.from({ length: maxBays }, (_, i) => {
      const b = allBays[i];
      const hasEgg = b == null ? void 0 : b.eggReady;
      const busy = (b == null ? void 0 : b.breedingStartedAt) && !(b == null ? void 0 : b.eggReady);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: `breed-bay-tab ${activeBay === i ? "active" : ""} ${hasEgg ? "has-egg" : ""} ${busy ? "busy" : ""}`,
          onClick: () => setActiveBay(i),
          children: [
            "Bay ",
            i + 1,
            " ",
            hasEgg ? (b == null ? void 0 : b.clutchSize) > 1 ? `×${b.clutchSize}` : "×1" : busy ? "..." : ""
          ]
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `breed-parents${bay.breedingStartedAt && !bay.eggReady ? " breed-parents--breeding" : ""} ${hasThirdSlot ? "breed-parents--trio" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreedSlot, { fish: fishA, slot: 1, onRemove: () => onSelectForBreeding(fishA == null ? void 0 : fishA.id, activeBay), onDrop: handleSlotDrop }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-heart", children: "×" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(BreedSlot, { fish: fishB, slot: 2, onRemove: () => onSelectForBreeding(fishB == null ? void 0 : fishB.id, activeBay), onDrop: handleSlotDrop }),
        hasThirdSlot && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-heart breed-heart--donor", children: "+" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            BreedSlot,
            {
              fish: fishC,
              slot: 3,
              isDonor: true,
              onRemove: () => onSelectForBreeding(fishC == null ? void 0 : fishC.id, activeBay),
              onDrop: handleSlotDrop
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-status", children: bay.eggReady ? (() => {
        const clutch = bay.clutchSize || 1;
        const clutchLabel = clutch === 3 ? "Collect Triplets" : clutch === 2 ? "Collect Twins" : "Collect Egg";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-egg-display", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-egg-sprites", children: Array.from({ length: clutch }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "breed-egg-svg",
              width: "28",
              height: "34",
              viewBox: "0 0 28 34",
              style: { animationDelay: `${i * 0.2}s` },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `eggGrad${i}`, cx: "40%", cy: "35%", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(240,230,210,0.95)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "rgba(210,195,170,0.9)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(180,160,130,0.85)" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ellipse",
                  {
                    cx: "14",
                    cy: "18",
                    rx: "10",
                    ry: "13",
                    fill: `url(#eggGrad${i})`,
                    stroke: "rgba(160,140,110,0.4)",
                    strokeWidth: "1"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "14", rx: "4", ry: "5", fill: "rgba(255,255,255,0.15)" }),
                clutch > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ellipse",
                  {
                    cx: "14",
                    cy: "20",
                    rx: "6",
                    ry: "2",
                    fill: "none",
                    stroke: "rgba(140,120,90,0.2)",
                    strokeWidth: "0.5"
                  }
                )
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `btn btn-collect ${clutch > 1 ? "btn-collect--multi" : ""}`, onClick: () => onCollectEgg(activeBay), children: clutchLabel })
        ] });
      })() : bay.breedingStartedAt ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-progress-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-progress-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-progress-label", children: [
            "Breeding… ",
            bay.clutchSize > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "breed-clutch-badge", children: bay.clutchSize === 3 ? "×3 Triplets!" : "×2 Twins!" })
          ] }),
          timeRemainingLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-progress-time", children: timeRemainingLabel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-progress-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-progress-fill", style: { width: `${progress}%` } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-danger", style: { marginTop: "8px" }, onClick: () => onCancelBreeding(activeBay), children: "✕ Cancel Breeding" })
      ] }) : bothSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-ready", children: "Ready to breed" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-hint", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "breed-hint-icon" }),
        "Drag two fish into the parent slots above — or click ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Select" })
      ] }) }),
      bothSelected && !canPredict && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-predictions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-predictions-title", children: "Offspring Prediction" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "predict-more", style: { padding: "8px 0", color: "#5a9aaa" }, children: "Offspring genetics are unpredictable when one or both parents are a real species. Breed them to find out!" })
      ] }),
      bothSelected && predictions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-predictions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "breed-predictions-title", children: "Possible Offspring" }),
        predictions.slice(0, 6).map((o) => {
          var _a2;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(PredictionBar, { outcome: o }, ((_a2 = o.species) == null ? void 0 : _a2.name) || o.chance);
        }),
        predictions.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "predict-more", children: [
          "+",
          predictions.length - 6,
          " more possibilities"
        ] })
      ] }),
      canPredict && bothSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(BreedingForecast, { fishA, fishB })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-selector", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-selector-title", children: [
        "Available Adults (",
        availableFish.length,
        ")",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "breed-selector-hint", children: " — drag fish to a slot or click Select" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-fish-list", children: [
        availableFish.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          BreedFishRow,
          {
            fish: f,
            inSlot: bay.slots.includes(f.id),
            onSelect: (fid) => onSelectForBreeding(fid, activeBay)
          },
          f.id
        )),
        availableFish.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "breed-no-fish", children: [
          "No adult fish available. Wait for juveniles to grow!",
          onNavigate && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", style: { marginTop: "8px", display: "block" }, onClick: () => onNavigate("tank"), children: "View Tank" })
        ] })
      ] })
    ] })
  ] });
}
const SUPPLIERS = [
  {
    id: "basic",
    name: "Local Fish Market",
    desc: "Basic freshwater species at standard prices.",
    priceMult: 1,
    speciesPool: ["goldfish", "neon_tetra", "guppy", "betta", "corydoras", "pleco", "flame_tetra", "harlequin_rasbora", "cardinal_tetra", "dwarf_gourami"],
    unlockRep: 0
  },
  {
    id: "tropical",
    name: "Tropical Imports",
    desc: "Colorful tropical species. Slightly pricier.",
    priceMult: 1.15,
    speciesPool: ["clownfish", "angelfish", "discus", "cherry_shrimp", "mandarin_dragonet", "rainbow_fish", "clown_loach", "firemouth_cichlid", "dragon_goby", "spotted_boxfish"],
    unlockRep: 10
  },
  {
    id: "exotic",
    name: "Exotic Aquatics",
    desc: "Rare and unusual species at premium prices.",
    priceMult: 1.35,
    speciesPool: ["lionfish", "seahorse", "pufferfish", "axolotl", "moorish_idol", "royal_gramma", "banggai_cardinal", "leopard_wrasse", "garden_eel", "flame_angel"],
    unlockRep: 25
  },
  {
    id: "deep_sea",
    name: "Deep Sea Specimens",
    desc: "Mysterious deep-water creatures. Very expensive.",
    priceMult: 1.6,
    speciesPool: ["jellyfish", "nautilus", "cuttlefish", "electric_eel", "arowana", "peacock_mantis", "wolf_eel", "frogfish", "sea_apple", "powder_blue_tang"],
    unlockRep: 50
  },
  {
    id: "premier",
    name: "Premier Collections",
    desc: "The finest specimens money can buy.",
    priceMult: 1.8,
    speciesPool: ["koi", "bluetang", "triggerfish", "oscar", "hammerhead", "yellow_tang", "regal_tang", "sunburst_anthias", "emerald_crab", "blue_chromis"],
    unlockRep: 100
  }
];
function getUnlockedSuppliers(reputation) {
  return SUPPLIERS.filter((s) => reputation >= s.unlockRep);
}
function getActiveSupplier(state) {
  var _a;
  const id = ((_a = state.suppliers) == null ? void 0 : _a.activeSupplier) || "basic";
  return SUPPLIERS.find((s) => s.id === id) || SUPPLIERS[0];
}
const MERCHANTS = [
  { id: "pearl", name: "Pearl the Diver", emoji: "", greeting: `"Fresh from the deep! You won't find these at any pet store."`, specialty: "fish" },
  { id: "bones", name: "Old Bones McGill", emoji: "", greeting: `"Arr... I've got somethin' special today, if ye've got the coin."`, specialty: "eggs" },
  { id: "flora", name: "Dr. Flora Chen", emoji: "", greeting: `"I've been running some fascinating experiments. Care to see the results?"`, specialty: "booster" },
  { id: "kai", name: "Kai the Reef Runner", emoji: "", greeting: '"Bro! Check out what washed up on the reef this morning!"', specialty: "supplies" },
  { id: "madame", name: "Madame Coraline", emoji: "", greeting: '"The tides whisper of rare creatures today... shall we see?"', specialty: "eggs" },
  { id: "jin", name: "Captain Jin", emoji: "", greeting: '"Direct from the eastern trade routes. Premium stock only."', specialty: "fish" }
];
const MYSTERY_EGGS = [
  {
    id: "egg_common",
    emoji: "",
    label: "Common Clutch",
    type: "egg",
    tag: "Mystery Egg",
    tagColor: "rgba(126,200,160,0.15)",
    tagBorder: "rgba(126,200,160,0.4)",
    tagText: "#5aaa70",
    desc: "A clutch of 2 eggs. Mostly common species, but you might get lucky.",
    cost: 50,
    limit: 3,
    eggCount: 2,
    rarityWeights: { common: 70, uncommon: 25, rare: 5 }
  },
  {
    id: "egg_exotic",
    emoji: "",
    label: "Exotic Egg",
    type: "egg",
    tag: "Mystery Egg",
    tagColor: "rgba(106,176,222,0.15)",
    tagBorder: "rgba(106,176,222,0.4)",
    tagText: "#5a9aaa",
    desc: "A single egg from an exotic source. High chance of uncommon or rare.",
    cost: 150,
    limit: 2,
    eggCount: 1,
    rarityWeights: { common: 15, uncommon: 50, rare: 30, epic: 5 }
  },
  {
    id: "egg_legendary",
    emoji: "",
    label: "Primordial Egg",
    type: "egg",
    tag: "Legendary Gamble",
    tagColor: "rgba(255,126,179,0.15)",
    tagBorder: "rgba(255,126,179,0.4)",
    tagText: "#a06080",
    desc: "Recovered from the abyss. Could be anything — including something extraordinary.",
    cost: 500,
    limit: 1,
    minRep: 25,
    eggCount: 1,
    rarityWeights: { uncommon: 20, rare: 45, epic: 30, legendary: 5 }
  }
];
const EXOTIC_FISH = [
  {
    id: "fish_uncommon_1",
    emoji: "",
    label: "Uncommon Specimen",
    type: "fish",
    tag: "Exotic Fish",
    tagColor: "rgba(106,176,222,0.15)",
    tagBorder: "rgba(106,176,222,0.4)",
    tagText: "#5a9aaa",
    desc: "A healthy adult of uncommon lineage. Ready to sell or breed.",
    cost: 120,
    limit: 1,
    targetRarity: "uncommon"
  },
  {
    id: "fish_uncommon_2",
    emoji: "",
    label: "Unusual Catch",
    type: "fish",
    tag: "Exotic Fish",
    tagColor: "rgba(106,176,222,0.15)",
    tagBorder: "rgba(106,176,222,0.4)",
    tagText: "#5a9aaa",
    desc: "Caught by a traveling fisherman. Uncommon traits guaranteed.",
    cost: 130,
    limit: 1,
    targetRarity: "uncommon"
  },
  {
    id: "fish_rare_1",
    emoji: "",
    label: "Rare Import",
    type: "fish",
    tag: "Rare Fish",
    tagColor: "rgba(176,126,232,0.15)",
    tagBorder: "rgba(176,126,232,0.4)",
    tagText: "#8a70a8",
    desc: "Imported from overseas. Guaranteed rare species.",
    cost: 350,
    limit: 1,
    targetRarity: "rare"
  },
  {
    id: "fish_rare_2",
    emoji: "",
    label: "Deep-Sea Rarity",
    type: "fish",
    tag: "Rare Fish",
    tagColor: "rgba(176,126,232,0.15)",
    tagBorder: "rgba(176,126,232,0.4)",
    tagText: "#8a70a8",
    desc: "Pulled from the twilight zone. Stunning and rare.",
    cost: 400,
    limit: 1,
    targetRarity: "rare"
  },
  {
    id: "fish_epic",
    emoji: "",
    label: "Legendary Specimen",
    type: "fish",
    tag: "Epic Fish",
    tagColor: "rgba(240,192,64,0.15)",
    tagBorder: "rgba(240,192,64,0.4)",
    tagText: "#b0944a",
    desc: "One of a kind. Epic rarity — the merchant's prized catch.",
    cost: 1200,
    limit: 1,
    targetRarity: "epic",
    minRep: 50
  }
];
const SUPPLY_ITEMS = [
  {
    id: "bundle_medicine",
    emoji: "",
    label: "Medicine Bundle",
    type: "supplies",
    tag: "Supplies",
    tagColor: "rgba(100,180,220,0.2)",
    tagBorder: "rgba(100,180,220,0.4)",
    tagText: "#5a9aaa",
    desc: "Antibiotic ×3, Antiparasitic ×2, Digestive Remedy ×2.",
    cost: 120,
    limit: 2,
    supplies: { antibiotic: 3, antiparasitic: 2, digestiveRemedy: 2 }
  },
  {
    id: "bundle_food",
    emoji: "",
    label: "Premium Fish Food",
    type: "supplies",
    tag: "Supplies",
    tagColor: "rgba(100,180,220,0.2)",
    tagBorder: "rgba(100,180,220,0.4)",
    tagText: "#5a9aaa",
    desc: "+40 food supply for your active tank.",
    cost: 60,
    limit: 3,
    supplies: { food: 40 }
  },
  {
    id: "bundle_water",
    emoji: "",
    label: "Water Treatment Pack",
    type: "supplies",
    tag: "Supplies",
    tagColor: "rgba(100,180,220,0.2)",
    tagBorder: "rgba(100,180,220,0.4)",
    tagText: "#5a9aaa",
    desc: "Water Treatment ×5, Antibiotic ×2.",
    cost: 90,
    limit: 2,
    supplies: { waterTreatment: 5, antibiotic: 2 }
  },
  {
    id: "full_restore",
    emoji: "",
    label: "Full Restoration",
    type: "supplies",
    tag: "Premium",
    tagColor: "rgba(212,168,48,0.15)",
    tagBorder: "rgba(212,168,48,0.4)",
    tagText: "#d4a830",
    desc: "Instantly restores water quality to 100% + food ×10.",
    cost: 150,
    limit: 1,
    supplies: { food: 10 },
    restoreWater: true
  },
  {
    id: "heater_pack",
    emoji: "",
    label: "Heater Pack",
    type: "supplies",
    tag: "Supplies",
    tagColor: "rgba(100,180,220,0.2)",
    tagBorder: "rgba(100,180,220,0.4)",
    tagText: "#5a9aaa",
    desc: "Heater Cartridge ×4.",
    cost: 80,
    limit: 2,
    supplies: { heater: 4 }
  },
  {
    id: "breed_sprint",
    emoji: "",
    label: "Breeding Sprint",
    type: "supplies",
    tag: "Breeding",
    tagColor: "rgba(160,100,240,0.15)",
    tagBorder: "rgba(160,100,240,0.4)",
    tagText: "#b070f0",
    desc: "Breeding Boost ×3. Cuts breeding cycles to 10 seconds.",
    cost: 140,
    limit: 1,
    supplies: { breedingBoost: 3 }
  },
  {
    id: "bundle_antiparasitic",
    emoji: "",
    label: "Antiparasitic Bundle",
    type: "supplies",
    tag: "Supplies",
    tagColor: "rgba(100,180,220,0.2)",
    tagBorder: "rgba(100,180,220,0.4)",
    tagText: "#5a9aaa",
    desc: "Antiparasitic ×4, Digestive Remedy ×3.",
    cost: 130,
    limit: 2,
    supplies: { antiparasitic: 4, digestiveRemedy: 3 }
  }
];
const BOOSTER_ITEMS = [
  {
    id: "boost_grow",
    emoji: "",
    label: "Growth Formula",
    type: "booster",
    tag: "Boost",
    tagColor: "rgba(80,200,80,0.12)",
    tagBorder: "rgba(80,200,80,0.35)",
    tagText: "#60c860",
    desc: "All fish grow 50% faster for 10 minutes.",
    cost: 200,
    limit: 1,
    boost: "growSpeed",
    boostDurationMs: 6e5
  },
  {
    id: "boost_health",
    emoji: "",
    label: "Vitality Tonic",
    type: "booster",
    tag: "Boost",
    tagColor: "rgba(80,200,80,0.12)",
    tagBorder: "rgba(80,200,80,0.35)",
    tagText: "#60c860",
    desc: "Health regenerates 3× faster for 10 minutes.",
    cost: 175,
    limit: 1,
    boost: "healthRegen",
    boostDurationMs: 6e5
  },
  {
    id: "boost_price",
    emoji: "",
    label: "Market Frenzy",
    type: "booster",
    tag: "Boost",
    tagColor: "rgba(80,200,80,0.12)",
    tagBorder: "rgba(80,200,80,0.35)",
    tagText: "#60c860",
    desc: "Customers pay 25% more for 10 minutes.",
    cost: 250,
    limit: 1,
    boost: "salePrice",
    boostDurationMs: 6e5
  },
  {
    id: "boost_income",
    emoji: "",
    label: "High Tide",
    type: "booster",
    tag: "Boost",
    tagColor: "rgba(80,200,80,0.12)",
    tagBorder: "rgba(80,200,80,0.35)",
    tagText: "#60c860",
    desc: "Passive coin income doubles for 10 minutes.",
    cost: 180,
    limit: 1,
    boost: "passiveIncome",
    boostDurationMs: 6e5
  }
];
const ALL_ITEMS = [...MYSTERY_EGGS, ...EXOTIC_FISH, ...SUPPLY_ITEMS, ...BOOSTER_ITEMS];
function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
function getTodayUTCDay() {
  return Math.floor(Date.now() / 864e5);
}
function getDailyRotation(day, reputation) {
  const rng = seededRng(day * 2654435761);
  const merchant = MERCHANTS[Math.floor(rng() * MERCHANTS.length)];
  const pool = ALL_ITEMS.filter((i) => !i.minRep || reputation >= i.minRep);
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picked = [];
  const types = /* @__PURE__ */ new Set();
  const want = { egg: 1, fish: 1, booster: 1, supplies: 1 };
  for (const item of shuffled) {
    if (picked.length >= 6) break;
    if (!types.has(item.type) && (want[item.type] || 0) > 0) {
      picked.push(item);
      types.add(item.type);
    }
  }
  for (const item of shuffled) {
    if (picked.length >= 6) break;
    if (!picked.includes(item)) picked.push(item);
  }
  const dealIdx = Math.floor(rng() * picked.length);
  return { merchant, items: picked, dealIdx };
}
function msUntilNextDay() {
  const now = Date.now();
  return (Math.floor(now / 864e5) + 1) * 864e5 - now;
}
function formatCountdown(ms) {
  const h = Math.floor(ms / 36e5);
  const m = Math.floor(ms % 36e5 / 6e4);
  return `${h}h ${m}m`;
}
const BOOST_LABELS = {
  growSpeed: "Growth +50%",
  healthRegen: "Regen ×3",
  salePrice: "Prices +25%",
  passiveIncome: "Income ×2"
};
const RARITY_COLORS$2 = {
  common: "#5aaa70",
  uncommon: "#5a9aaa",
  rare: "#8a70a8",
  epic: "#b0944a",
  legendary: "#a06080"
};
function RarityOdds({ weights }) {
  const total = Object.values(weights).reduce((s, v) => s + v, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-odds", children: Object.entries(weights).map(([rarity, weight]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rmc-odds-chip", style: { color: RARITY_COLORS$2[rarity] || "#888" }, children: [
    rarity,
    " ",
    Math.round(weight / total * 100),
    "%"
  ] }, rarity)) });
}
function RareMarket({ game, activeTank, onBuyRareItem }) {
  var _a, _b, _c, _d;
  const today = getTodayUTCDay();
  const [countdown, setCountdown] = reactExports.useState(msUntilNextDay);
  reactExports.useEffect(() => {
    const t = setInterval(() => setCountdown(msUntilNextDay()), 3e4);
    return () => clearInterval(t);
  }, []);
  const reputation = ((_a = game == null ? void 0 : game.shop) == null ? void 0 : _a.reputation) || 0;
  const { merchant, items, dealIdx } = reactExports.useMemo(
    () => getDailyRotation(today, reputation),
    [today, reputation]
  );
  const coins2 = ((_b = game == null ? void 0 : game.player) == null ? void 0 : _b.coins) ?? 0;
  const purchased = (((_c = game == null ? void 0 : game.rareMarket) == null ? void 0 : _c.purchased) || []).filter((p) => p.day === today);
  const boosts = ((_d = game == null ? void 0 : game.player) == null ? void 0 : _d.boosts) || {};
  const gc = (game == null ? void 0 : game.gameClock) || Date.now();
  const activeBoosts = Object.entries(boosts).filter(([, expiresAt]) => expiresAt > gc);
  function boughtCount(itemId) {
    return purchased.filter((p) => p.itemId === itemId).length;
  }
  const lockedCount = ALL_ITEMS.filter((i) => i.minRep && reputation < i.minRep).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rare-market-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rare-market-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rm-merchant", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rm-merchant-emoji", children: merchant.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rare-market-title", children: merchant.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rm-merchant-greeting", children: merchant.greeting })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rm-header-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rare-market-coins", children: coins2.toLocaleString() }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rare-market-subtitle", children: [
          "Refreshes in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rare-market-countdown", children: formatCountdown(countdown) })
        ] })
      ] })
    ] }),
    activeBoosts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rare-market-boosts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "boosts-label", children: "Active:" }),
      activeBoosts.map(([key, expiresAt]) => {
        const minsLeft = Math.max(0, Math.ceil((expiresAt - gc) / 6e4));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "boost-badge", children: [
          BOOST_LABELS[key] || key,
          " ",
          minsLeft,
          "m"
        ] }, key);
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rare-market-grid", children: items.map((item, idx) => {
      const bought = boughtCount(item.id);
      const soldOut = bought >= item.limit;
      const isDeal = idx === dealIdx;
      const effectiveCost = isDeal ? Math.round(item.cost * 0.6) : item.cost;
      const canAfford = coins2 >= effectiveCost && !soldOut;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rare-market-card${soldOut ? " rare-market-card--maxed" : ""}${isDeal ? " rare-market-card--deal" : ""}`,
          children: [
            isDeal && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-deal-ribbon", children: "40% OFF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rmc-top-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-emoji", children: item.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "rmc-tag",
                  style: {
                    background: item.tagColor,
                    border: `1px solid ${item.tagBorder}`,
                    color: item.tagText
                  },
                  children: item.tag
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-label", children: item.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-desc", children: item.desc }),
            item.rarityWeights && /* @__PURE__ */ jsxRuntimeExports.jsx(RarityOdds, { weights: item.rarityWeights }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rmc-footer", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rmc-cost", children: [
                  isDeal && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rmc-cost-original", children: item.cost }),
                  effectiveCost.toLocaleString()
                ] }),
                soldOut ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rmc-maxed", children: "✓ Purchased" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rmc-limit", children: [
                  item.limit - bought,
                  " left today"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: `market-buy-btn${!canAfford ? " market-buy-btn--disabled" : ""}`,
                  disabled: !canAfford,
                  title: !soldOut && !canAfford ? `Need ${(effectiveCost - coins2).toLocaleString()} more` : void 0,
                  onClick: () => onBuyRareItem(
                    { ...item, cost: effectiveCost },
                    activeTank == null ? void 0 : activeTank.id
                  ),
                  children: soldOut ? "Sold Out" : "Buy"
                }
              )
            ] })
          ]
        },
        item.id
      );
    }) }),
    lockedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rm-locked-hint", children: [
      lockedCount,
      " premium item",
      lockedCount > 1 ? "s" : "",
      " locked — reach higher reputation to unlock"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rare-market-note", children: [
      merchant.name,
      " visits daily at UTC midnight · Mystery eggs hatch into your active tank · The Daily Deal changes every day"
    ] })
  ] });
}
const RC = { common: "#5aaa70", uncommon: "#5a9aaa", rare: "#8a70a8", epic: "#b0944a", legendary: "#a06080" };
function CustomerFigure({ emoji, name, fishName, coins: coins2, rarity }) {
  const rc = RC[rarity] || "#5aaa70";
  const hash = name ? name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) : 0;
  const hairColors = ["#3a2820", "#5a3830", "#2a2028", "#8a7040", "#c0a060", "#4a3020"];
  const shirtColors = ["#3a5a80", "#5a3a60", "#3a6050", "#6a4a30", "#4a4a5a", "#605040"];
  const skinTones = ["#f0c090", "#d4a878", "#c49068", "#e8b888", "#b88060", "#f0d0a8"];
  const hairColor = hairColors[hash % hairColors.length];
  const shirtColor = shirtColors[(hash * 3 + 1) % shirtColors.length];
  const skinColor = skinTones[(hash * 7 + 2) % skinTones.length];
  const hasHat = hash % 5 === 0;
  const hasGlasses = hash % 4 === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "customer-walk", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "customer-figure", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "32", height: "56", viewBox: "0 0 32 56", className: "customer-body-svg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "16", cy: "54", rx: "10", ry: "2", fill: "rgba(0,0,0,0.15)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "9", y: "38", width: "6", height: "14", rx: "2", fill: shirtColor, opacity: "0.7", className: "leg-l" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "17", y: "38", width: "6", height: "14", rx: "2", fill: shirtColor, opacity: "0.7", className: "leg-r" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7", y: "20", width: "18", height: "20", rx: "3", fill: shirtColor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7", y: "20", width: "18", height: "6", rx: "2", fill: shirtColor, opacity: "0.8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "22", width: "8", height: "5", rx: "2", fill: shirtColor, className: "arm-l" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "24", y: "22", width: "8", height: "5", rx: "2", fill: shirtColor, className: "arm-r" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "12", r: "9", fill: skinColor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "16", cy: "7", rx: "9", ry: "5", fill: hairColor }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "13", cy: "12", r: "1.2", fill: "#1a1a1a" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "19", cy: "12", r: "1.2", fill: "#1a1a1a" }),
      hasGlasses && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "13", cy: "12", r: "2.5", fill: "none", stroke: "#3a3a3a", strokeWidth: "0.8" }),
      hasGlasses && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "19", cy: "12", r: "2.5", fill: "none", stroke: "#3a3a3a", strokeWidth: "0.8" }),
      hasGlasses && /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "15.5", y1: "12", x2: "16.5", y2: "12", stroke: "#3a3a3a", strokeWidth: "0.6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,15 Q16,16.5 18,15", fill: "none", stroke: "#8a6050", strokeWidth: "0.8" }),
      hasHat && /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "16", height: "3", rx: "1", fill: hairColor }),
      hasHat && /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "5", y: "5", width: "22", height: "2", rx: "1", fill: hairColor })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "customer-speech", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "customer-name", children: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "customer-bought", children: [
        "Bought ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: rc }, children: fishName })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "customer-paid", children: [
        "+",
        coins2
      ] })
    ] })
  ] });
}
function StorefrontSVG({ activeCustomer }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-storefront", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "storefront-svg", viewBox: "0 0 600 90", preserveAspectRatio: "xMidYMid meet", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "0", y: "20", width: "600", height: "70", fill: "#1a2840", rx: "4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M0,20 L600,20 L600,50 L0,50 Z", fill: "#1e5090" }),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: i * 68, y: "20", width: "30", height: "30", fill: "#1a4070", opacity: "0.5" }, i)),
      Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          d: `M${i * 32},50 Q${i * 32 + 16},62 ${i * 32 + 32},50`,
          fill: "none",
          stroke: "#2a70c0",
          strokeWidth: "2"
        },
        i
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "180", y: "4", width: "240", height: "28", rx: "6", fill: "#0a0e14", stroke: "#d4a843", strokeWidth: "1.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: "300",
          y: "22",
          textAnchor: "middle",
          fill: "#d4a843",
          fontSize: "13",
          fontFamily: "Cinzel, serif",
          fontWeight: "600",
          children: "Aquarium Shop"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "30", y: "55", width: "80", height: "35", rx: "4", fill: "#141820", stroke: "#2a3540", strokeWidth: "1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "490", y: "55", width: "80", height: "35", rx: "4", fill: "#141820", stroke: "#2a3540", strokeWidth: "1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "250", y: "58", width: "100", height: "32", rx: "3", fill: "#0c1420", stroke: "#2a3540", strokeWidth: "1" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "345", cy: "74", r: "3", fill: "#d4a843" })
    ] }),
    activeCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CustomerFigure,
      {
        emoji: activeCustomer.customerEmoji,
        name: activeCustomer.customerName,
        fishName: activeCustomer.fishName,
        coins: activeCustomer.coins,
        rarity: activeCustomer.fishRarity
      }
    )
  ] });
}
function ReputationBar({ rep }) {
  const max = 999;
  const pct = rep / max * 100;
  const tier = rep < 100 ? "Local Shop" : rep < 300 ? "Known Store" : rep < 600 ? "Popular Aquarium" : "Famous Emporium";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rep-bar-wrap", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rep-bar-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rep-label", children: [
        "Reputation: ",
        tier
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rep-num", children: [
        rep,
        " / ",
        max
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rep-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rep-bar-fill", style: { width: `${pct}%` } }) })
  ] });
}
const UPGRADE_ICONS = {
  slot: "",
  reputation: "",
  capacity: "",
  breeding: "",
  lighting: "",
  vip: "",
  hatchery: "",
  tankSitter: "",
  purifier: "",
  autoMedic: "",
  mutagen: "",
  insurance: "",
  fame: "",
  tempControl: "",
  luckyCharm: "",
  bulkBuyer: "",
  whisperer: "",
  genetics: "",
  service: "",
  deepSea: "",
  breedBay: ""
};
function UpgradeCard({ id, upgrade, coins: coins2, onBuy }) {
  const maxLevel = upgrade.maxLevel || 3;
  const maxed = upgrade.level >= maxLevel;
  const icon = UPGRADE_ICONS[id] || "";
  const actualCost = upgradeCost(upgrade.cost, upgrade.level);
  const canAfford = coins2 >= actualCost;
  const nextCost = !maxed && upgrade.level + 1 < maxLevel ? upgradeCost(upgrade.cost, upgrade.level + 1) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `upgrade-card ${maxed ? "maxed" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upgrade-title", children: [
      icon,
      " ",
      upgrade.label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrade-desc", children: upgrade.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrade-level", children: Array.from({ length: maxLevel }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `upgrade-pip ${i < upgrade.level ? "filled" : ""}` }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upgrade-tier-label", children: [
      "Level ",
      upgrade.level,
      " / ",
      maxLevel
    ] }),
    maxed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrade-maxed", children: "MAXED" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn btn-sm",
          disabled: !canAfford,
          onClick: () => onBuy(id),
          title: canAfford ? "" : `Need ${actualCost - coins2} more coins`,
          children: [
            "🪙 ",
            actualCost
          ]
        }
      ),
      nextCost && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upgrade-next-cost", children: [
        "Next: 🪙",
        nextCost
      ] })
    ] })
  ] });
}
function SaleEvent({ event }) {
  const rc = RC[event.fishRarity] || "#888";
  const isRejected = event.type === "rejected";
  const getAgo = () => {
    const secs = Math.round((Date.now() - event.time) / 1e3);
    return secs < 60 ? `${secs}s ago` : `${Math.floor(secs / 60)}m ago`;
  };
  const [agoLabel, setAgoLabel] = reactExports.useState(getAgo);
  reactExports.useEffect(() => {
    const id = setInterval(() => setAgoLabel(getAgo()), 1e4);
    return () => clearInterval(id);
  }, [event.time]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `sale-event ${isRejected ? "sale-rejected" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sale-emoji", children: event.customerEmoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sale-info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sale-customer", children: event.customerName }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sale-fish", style: { color: isRejected ? "#888" : rc }, children: event.fishName })
    ] }),
    isRejected ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sale-rejected-label", children: [
      "Walked away (asked ",
      event.askPrice,
      ")"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sale-coins", children: [
      "+🪙",
      event.coins
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sale-ago", children: agoLabel })
  ] });
}
function SupplyCard({ name, emoji, stock, cost, amount, coins: coins2, desc, onBuy }) {
  const canAfford = coins2 >= cost;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supply-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "supply-emoji", children: emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "supply-name", children: name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "supply-desc", children: desc }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supply-stock", children: [
      "In stock: ",
      stock
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm", disabled: !canAfford, onClick: onBuy, children: [
      "Buy ",
      amount,
      " — ",
      cost
    ] })
  ] });
}
function PriceInput({ value, max, onCommit }) {
  const [draft, setDraft] = reactExports.useState(String(value));
  reactExports.useEffect(() => {
    setDraft(String(value));
  }, [value]);
  const commit = (raw) => {
    const v = parseInt(raw, 10);
    if (!isNaN(v) && v >= 1) onCommit(Math.min(v, max));
    else setDraft(String(value));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type: "number",
      className: "listing-price-input",
      value: draft,
      min: 1,
      max,
      onClick: (e) => e.stopPropagation(),
      onChange: (e) => {
        setDraft(e.target.value);
        const v = parseInt(e.target.value, 10);
        if (!isNaN(v) && v >= 1) onCommit(Math.min(v, max));
      },
      onBlur: (e) => commit(e.target.value)
    }
  );
}
const ALL_SHOP_TABS = ["sell", "fish", "upgrades", "supplies", "market", "history"];
const TAB_LABELS = {
  sell: "Listings",
  fish: "Buy Fish",
  upgrades: "Upgrades",
  supplies: "Supplies",
  market: "Market",
  history: "Sales Log"
};
function useDebounced(fn, delayMs) {
  const timerRef = reactExports.useRef(null);
  return reactExports.useCallback((...args) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fn(...args), delayMs);
  }, [fn]);
}
function Shop({ game, activeTank, onToggleSell, onSetPrice, onBuyUpgrade, onBuySupply, onBuyFish, onBuyRareItem, onNavigate }) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
  const debouncedSetPrice = useDebounced(onSetPrice, 80);
  const [shopTab, setShopTab] = reactExports.useState("sell");
  const [activeCustomer, setActiveCustomer] = reactExports.useState(null);
  const [selectedToList, setSelectedToList] = reactExports.useState(/* @__PURE__ */ new Set());
  const prevSalesLen = reactExports.useRef((game.shop.salesHistory || []).length);
  const customerTimer = reactExports.useRef(null);
  reactExports.useEffect(() => () => clearTimeout(customerTimer.current), []);
  reactExports.useEffect(() => {
    const history = game.shop.salesHistory || [];
    if (history.length > prevSalesLen.current) {
      const latest = history[history.length - 1];
      setActiveCustomer(latest);
      prevSalesLen.current = history.length;
      clearTimeout(customerTimer.current);
      customerTimer.current = setTimeout(() => setActiveCustomer(null), 5e3);
    } else {
      prevSalesLen.current = history.length;
    }
  }, [(_a = game.shop.salesHistory) == null ? void 0 : _a.length]);
  const { shop, fish, player, tanks } = game;
  const tank = activeTank || ((_b = game.tanks) == null ? void 0 : _b[0]);
  const listedFish = (shop.listedFish || []).map((id) => fish.find((f) => f.id === id)).filter(Boolean);
  const availableFish = (fish || []).filter((f) => f.stage === "adult" && !(shop.listedFish || []).includes(f.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StorefrontSVG, { activeCustomer }),
    ((_c = game.market) == null ? void 0 : _c.headline) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "market-ticker", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "market-ticker-headline", children: game.market.headline }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "market-ticker-tags", children: [
        Object.entries(game.market.modifiers || {}).map(([rarity, mult]) => {
          const pct = Math.round((mult - 1) * 100);
          const color = pct > 0 ? "#5aaa70" : pct < 0 ? "#c44040" : "#888";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "market-tag", style: { color }, children: [
            rarity,
            ": ",
            pct > 0 ? "+" : "",
            pct,
            "%"
          ] }, rarity);
        }),
        game.market.hotTrait && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "market-tag market-tag--hot", children: [
          game.market.hotTrait.label,
          " +",
          Math.round((game.market.hotTrait.bonus - 1) * 100),
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-header-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Your Aquarium Shop" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReputationBar, { rep: shop.reputation || 0 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-header-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shop-stat-val", children: [
            listedFish.length,
            "/",
            shop.slots
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shop-stat-label", children: "Slots Used" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shop-stat-val", children: player.totalCoinsEarned || 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shop-stat-label", children: "Total Earned" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shop-tabs", children: ALL_SHOP_TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `shop-tab-btn ${shopTab === t ? "active" : ""}`,
        onClick: () => setShopTab(t),
        children: TAB_LABELS[t]
      },
      t
    )) }),
    shopTab === "sell" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shop-sell", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listings-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title", children: [
          "Active Listings",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-subtitle", children: " — set your ask price per fish" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pricing-hint", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pricing-hint-icon" }),
          "Price too high? Customers walk away. Price fair? They buy. Hagglers may negotiate."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listings-grid", children: [
          listedFish.map((f) => {
            var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
            const lightingBonus = 1 + (((_b2 = (_a2 = shop.upgrades) == null ? void 0 : _a2.lighting) == null ? void 0 : _b2.level) || 0) * 0.1;
            const fishTank1 = tanks == null ? void 0 : tanks.find((t) => t.id === f.tankId);
            const tankBonus1 = (fishTank1 == null ? void 0 : fishTank1.type) === "display" ? 1.1 : 1;
            const happBonus1 = 1 + ((fishTank1 == null ? void 0 : fishTank1.happiness) ?? 100) / 100 * 0.2;
            const mkt = game.market || {};
            let marketMult = ((_d2 = mkt.modifiers) == null ? void 0 : _d2[((_c2 = f.species) == null ? void 0 : _c2.rarity) || "common"]) || 1;
            if (mkt.hotTrait && ((_e2 = f.phenotype) == null ? void 0 : _e2[mkt.hotTrait.gene]) === mkt.hotTrait.value) {
              marketMult *= mkt.hotTrait.bonus;
            }
            const autoPrice = Math.round((((_f2 = f.species) == null ? void 0 : _f2.basePrice) ?? 10) * (f.health / 100) * happBonus1 * tankBonus1 * lightingBonus * marketMult);
            const askPrice = ((_g2 = shop.fishPrices) == null ? void 0 : _g2[f.id]) ?? autoPrice;
            const rc = RC[(_h2 = f.species) == null ? void 0 : _h2.rarity] || "#888";
            const ratio = autoPrice > 0 ? askPrice / autoPrice : 1;
            const priceTag = ratio > 1.4 ? { label: "Very Pricey", cls: "price-tag-high" } : ratio > 1.15 ? { label: "Above Market", cls: "price-tag-above" } : ratio < 0.7 ? { label: "Bargain", cls: "price-tag-low" } : ratio < 0.9 ? { label: "Below Market", cls: "price-tag-below" } : { label: "Fair Price", cls: "price-tag-fair" };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-card", style: { "--rc": rc }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "listing-name", children: ((_i2 = f.species) == null ? void 0 : _i2.name) || "Unknown" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-rarity", style: { color: rc }, children: [
                ((_j2 = f.species) == null ? void 0 : _j2.rarity) || "common",
                marketMult > 1.1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "listing-hot-badge", children: [
                  " +",
                  Math.round((marketMult - 1) * 100),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-health", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "listing-health-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: `${f.health}%`, height: "100%", background: "#5dbe8a", borderRadius: 2 } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  Math.round(f.health),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-price-section", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "listing-price-label", children: "Ask Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-price-row", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "price-adj-btn",
                      onClick: () => debouncedSetPrice(f.id, Math.max(1, Math.round(askPrice - Math.max(1, Math.round(askPrice * 0.05))))),
                      "aria-label": "Lower price",
                      children: "−"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-price-input-wrap", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "price-coin", children: "🪙" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      PriceInput,
                      {
                        value: askPrice,
                        max: autoPrice * 10,
                        onCommit: (v) => onSetPrice(f.id, v)
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "price-adj-btn",
                      onClick: () => debouncedSetPrice(f.id, Math.round(askPrice + Math.max(1, Math.round(askPrice * 0.05)))),
                      "aria-label": "Raise price",
                      children: "+"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "listing-price-meta", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "listing-auto-price", children: [
                    "Market: 🪙",
                    autoPrice
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `price-tag ${priceTag.cls}`, children: priceTag.label })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "btn-reset-price",
                    onClick: () => onSetPrice(f.id, autoPrice),
                    "aria-label": "Reset price",
                    children: "Reset to market"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-warn", onClick: () => onToggleSell(f.id), children: "Delist" })
            ] }, f.id);
          }),
          Array.from({ length: Math.max(0, shop.slots - listedFish.length) }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "listing-card empty", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "listing-empty-label", children: "Empty Slot" }) }, i))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title mt", children: [
        "Fish Available to List (",
        availableFish.length,
        ")",
        availableFish.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bulk-list-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-sm",
              disabled: selectedToList.size === 0 || listedFish.length >= shop.slots,
              onClick: () => {
                const slotsLeft = shop.slots - listedFish.length;
                let listed = 0;
                for (const id of selectedToList) {
                  if (listed >= slotsLeft) break;
                  onToggleSell(id);
                  listed++;
                }
                setSelectedToList(/* @__PURE__ */ new Set());
              },
              title: selectedToList.size === 0 ? "Select fish below first" : `List ${Math.min(selectedToList.size, shop.slots - listedFish.length)} selected`,
              children: [
                "List Selected (",
                selectedToList.size,
                ")"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn btn-sm",
              onClick: () => {
                const commonUnlisted = availableFish.filter((f) => {
                  var _a2;
                  return ((_a2 = f.species) == null ? void 0 : _a2.rarity) === "common";
                });
                setSelectedToList(new Set(commonUnlisted.map((f) => f.id)));
              },
              "aria-label": "Select all common",
              children: "Select Commons"
            }
          ),
          selectedToList.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => setSelectedToList(/* @__PURE__ */ new Set()), children: "Clear" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-list", children: [
        availableFish.map((f) => {
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2;
          const lightingBonus = 1 + (((_b2 = (_a2 = shop.upgrades) == null ? void 0 : _a2.lighting) == null ? void 0 : _b2.level) || 0) * 0.1;
          const fishTank2 = tanks == null ? void 0 : tanks.find((t) => t.id === f.tankId);
          const tankBonus2 = (fishTank2 == null ? void 0 : fishTank2.type) === "display" ? 1.1 : 1;
          const happBonus2 = 1 + ((fishTank2 == null ? void 0 : fishTank2.happiness) ?? 100) / 100 * 0.2;
          const autoPrice = Math.round((((_c2 = f.species) == null ? void 0 : _c2.basePrice) ?? 10) * (f.health / 100) * happBonus2 * tankBonus2 * lightingBonus);
          const rc = RC[(_d2 = f.species) == null ? void 0 : _d2.rarity] || "#888";
          const isChecked = selectedToList.has(f.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `fish-list-item ${isChecked ? "fish-list-item--selected" : ""}`,
              onClick: (e) => {
                e.stopPropagation();
                setSelectedToList((prev) => {
                  const s = new Set(prev);
                  s.has(f.id) ? s.delete(f.id) : s.add(f.id);
                  return s;
                });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "fli-checkbox",
                    checked: isChecked,
                    onChange: () => {
                    },
                    onClick: (e) => e.stopPropagation()
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fli-dot", style: { background: rc } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fli-name", children: ((_e2 = f.species) == null ? void 0 : _e2.name) || "Unknown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "fli-rarity", style: { color: rc }, children: ((_f2 = f.species) == null ? void 0 : _f2.rarity) || "common" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fli-ph", children: [
                  (_g2 = f.phenotype) == null ? void 0 : _g2.bodyShape,
                  " · ",
                  (_h2 = f.phenotype) == null ? void 0 : _h2.primaryColor,
                  ((_i2 = f.phenotype) == null ? void 0 : _i2.glow) && f.phenotype.glow !== "Normal" ? ` · ${f.phenotype.glow}` : "",
                  ((_j2 = f.phenotype) == null ? void 0 : _j2.mutation) && f.phenotype.mutation !== "None" ? ` · ${f.phenotype.mutation}` : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "fli-price", children: [
                  "🪙",
                  autoPrice
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: (e) => {
                  e.stopPropagation();
                  onToggleSell(f.id);
                  setSelectedToList((prev) => {
                    const s = new Set(prev);
                    s.delete(f.id);
                    return s;
                  });
                }, children: "List" })
              ]
            },
            f.id
          );
        }),
        availableFish.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fish-list-empty", children: [
          "No adult fish available to list.",
          onNavigate && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", style: { marginTop: "8px", display: "block" }, onClick: () => onNavigate("tank"), children: "View Tank" })
        ] })
      ] })
    ] }),
    shopTab === "upgrades" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "upgrades-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "upgrade-hint", children: "Invest your coins to grow your shop and breed better fish faster. Core upgrades now go to level 7 — and four advanced tiers await high-rollers." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", style: { marginBottom: "0.5rem" }, children: "Core Upgrades" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrades-grid", children: ["slot", "reputation", "capacity", "breeding"].map((id) => {
        var _a2;
        const upg = (_a2 = shop.upgrades) == null ? void 0 : _a2[id];
        return upg ? /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeCard, { id, upgrade: upg, coins: player.coins, onBuy: onBuyUpgrade }, id) : null;
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", style: { margin: "1rem 0 0.5rem" }, children: "Advanced Upgrades" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrades-grid", children: ["lighting", "vip", "hatchery", "tankSitter"].map((id) => {
        var _a2;
        const upg = (_a2 = shop.upgrades) == null ? void 0 : _a2[id];
        return upg ? /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeCard, { id, upgrade: upg, coins: player.coins, onBuy: onBuyUpgrade }, id) : null;
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", style: { margin: "1rem 0 0.5rem" }, children: "Expert Upgrades" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "upgrades-grid", children: ["purifier", "autoMedic", "mutagen", "insurance", "fame", "tempControl", "luckyCharm", "bulkBuyer", "whisperer", "genetics", "service", "deepSea", "breedBay"].map((id) => {
        var _a2;
        const upg = (_a2 = shop.upgrades) == null ? void 0 : _a2[id];
        return upg ? /* @__PURE__ */ jsxRuntimeExports.jsx(UpgradeCard, { id, upgrade: upg, coins: player.coins, onBuy: onBuyUpgrade }, id) : null;
      }) })
    ] }),
    shopTab === "fish" && (() => {
      var _a2;
      const reputation = ((_a2 = game == null ? void 0 : game.shop) == null ? void 0 : _a2.reputation) || 0;
      const unlockedSuppliers = getUnlockedSuppliers(reputation);
      const activeSupplier = getActiveSupplier(game);
      const pool = new Set(activeSupplier.speciesPool);
      const switchSupplier = useGameStore.getState().switchSupplier;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplies-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplier-selector", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "supplier-title", children: "SUPPLIER" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplier-tabs", children: [
            unlockedSuppliers.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: `supplier-tab ${activeSupplier.id === s.id ? "supplier-tab--active" : ""}`,
                onClick: () => switchSupplier(s.id),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "supplier-tab-name", children: s.name }),
                  s.priceMult > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "supplier-tab-mult", children: [
                    "x",
                    s.priceMult
                  ] })
                ]
              },
              s.id
            )),
            SUPPLIERS.filter((s) => !unlockedSuppliers.includes(s)).slice(0, 1).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplier-tab supplier-tab--locked", children: [
              s.name,
              " — Rep ",
              s.unlockRep
            ] }, s.id))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "supplier-desc", children: activeSupplier.desc })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "upgrade-hint", children: "Purchase fish to stock your tanks. Prices vary by supplier." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplies-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Common Fish", emoji: "", stock: "∞", cost: Math.round(50 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "A random common fish", onBuy: () => onBuyFish(Math.round(50 * activeSupplier.priceMult), "common") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Uncommon Fish", emoji: "", stock: "∞", cost: Math.round(150 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "A random uncommon fish with better genetics", onBuy: () => onBuyFish(Math.round(150 * activeSupplier.priceMult), "uncommon") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Rare Fish", emoji: "", stock: "∞", cost: Math.round(400 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "A rare fish — unusual traits, higher sale price", onBuy: () => onBuyFish(Math.round(400 * activeSupplier.priceMult), "rare") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title mt", children: [
          "Species from ",
          activeSupplier.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "upgrade-hint", children: "Iconic fish with fixed markings. Only species stocked by your current supplier are shown." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplies-grid", children: [
          pool.has("clownfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Clownfish", emoji: "", stock: "∞", cost: Math.round(200 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Amphiprion ocellaris — vivid orange with 3 white bars.", onBuy: () => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, "clownfish") }),
          pool.has("bluetang") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Blue Tang", emoji: "", stock: "∞", cost: Math.round(350 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Paracanthurus hepatus — royal blue with bold black stripe.", onBuy: () => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, "bluetang") }),
          pool.has("betta") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Betta", emoji: "", stock: "∞", cost: Math.round(420 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Betta splendens — flowing crimson veil fins.", onBuy: () => onBuyFish(Math.round(420 * activeSupplier.priceMult), null, "betta") }),
          pool.has("angelfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Angelfish", emoji: "", stock: "∞", cost: Math.round(240 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Pterophyllum scalare — silver with 3 black bars.", onBuy: () => onBuyFish(Math.round(240 * activeSupplier.priceMult), null, "angelfish") }),
          pool.has("goldfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Goldfish", emoji: "", stock: "∞", cost: Math.round(120 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Carassius auratus — fancy twin veil tail, lazy bottom-dweller.", onBuy: () => onBuyFish(Math.round(120 * activeSupplier.priceMult), null, "goldfish") }),
          pool.has("mandarin_dragonet") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Mandarin Dragonet", emoji: "", stock: "∞", cost: Math.round(1500 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Synchiropus splendidus — psychedelic blue-orange maze.", onBuy: () => onBuyFish(Math.round(1500 * activeSupplier.priceMult), null, "mandarin_dragonet") }),
          pool.has("neon_tetra") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Neon Tetra", emoji: "", stock: "∞", cost: Math.round(60 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Paracheirodon innesi — electric blue neon stripe. Best in groups.", onBuy: () => onBuyFish(Math.round(60 * activeSupplier.priceMult), null, "neon_tetra") }),
          pool.has("discus") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Discus", emoji: "", stock: "∞", cost: Math.round(500 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Symphysodon discus — King of the Aquarium.", onBuy: () => onBuyFish(Math.round(500 * activeSupplier.priceMult), null, "discus") }),
          pool.has("lionfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Lionfish", emoji: "", stock: "∞", cost: Math.round(600 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Pterois volitans — dramatic venomous beauty.", onBuy: () => onBuyFish(Math.round(600 * activeSupplier.priceMult), null, "lionfish") }),
          pool.has("seahorse") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Seahorse", emoji: "", stock: "∞", cost: Math.round(1e3 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Hippocampus kuda — upright swimmer with curled tail.", onBuy: () => onBuyFish(Math.round(1e3 * activeSupplier.priceMult), null, "seahorse") }),
          pool.has("pufferfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Pufferfish", emoji: "", stock: "∞", cost: Math.round(200 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Tetraodon nigroviridis — round, spiky, full of personality.", onBuy: () => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, "pufferfish") }),
          pool.has("jellyfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Moon Jellyfish", emoji: "", stock: "∞", cost: Math.round(450 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Aurelia aurita — translucent pulsing bell.", onBuy: () => onBuyFish(Math.round(450 * activeSupplier.priceMult), null, "jellyfish") }),
          pool.has("koi") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Koi", emoji: "", stock: "∞", cost: Math.round(250 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Cyprinus rubrofuscus — elegant pond royalty.", onBuy: () => onBuyFish(Math.round(250 * activeSupplier.priceMult), null, "koi") }),
          pool.has("moorish_idol") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Moorish Idol", emoji: "", stock: "∞", cost: Math.round(550 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Zanclus cornutus — dramatic black-white-yellow stripes.", onBuy: () => onBuyFish(Math.round(550 * activeSupplier.priceMult), null, "moorish_idol") }),
          pool.has("triggerfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Triggerfish", emoji: "", stock: "∞", cost: Math.round(220 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Balistoides conspicillum — angular body, locking dorsal spine.", onBuy: () => onBuyFish(Math.round(220 * activeSupplier.priceMult), null, "triggerfish") }),
          pool.has("electric_eel") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Electric Eel", emoji: "", stock: "∞", cost: Math.round(1100 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Electrophorus electricus — generates 860V.", onBuy: () => onBuyFish(Math.round(1100 * activeSupplier.priceMult), null, "electric_eel") }),
          pool.has("axolotl") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Axolotl", emoji: "", stock: "∞", cost: Math.round(350 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Ambystoma mexicanum — the smiling salamander.", onBuy: () => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, "axolotl") }),
          pool.has("cherry_shrimp") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Cherry Shrimp", emoji: "", stock: "∞", cost: Math.round(40 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Neocaridina davidi — tiny red algae cleaner.", onBuy: () => onBuyFish(Math.round(40 * activeSupplier.priceMult), null, "cherry_shrimp") }),
          pool.has("corydoras") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Corydoras", emoji: "", stock: "∞", cost: Math.round(80 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Corydoras paleatus — armored bottom-feeder.", onBuy: () => onBuyFish(Math.round(80 * activeSupplier.priceMult), null, "corydoras") }),
          pool.has("guppy") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Guppy", emoji: "", stock: "∞", cost: Math.round(30 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Poecilia reticulata — colorful fan tail, breeds prolifically.", onBuy: () => onBuyFish(Math.round(30 * activeSupplier.priceMult), null, "guppy") }),
          pool.has("oscar") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Oscar", emoji: "", stock: "∞", cost: Math.round(300 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Astronotus ocellatus — intelligent, aggressive predator.", onBuy: () => onBuyFish(Math.round(300 * activeSupplier.priceMult), null, "oscar") }),
          pool.has("arowana") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Arowana", emoji: "", stock: "∞", cost: Math.round(2e3 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Osteoglossum bicirrhosum — the dragon fish of luck.", onBuy: () => onBuyFish(Math.round(2e3 * activeSupplier.priceMult), null, "arowana") }),
          pool.has("nautilus") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Nautilus", emoji: "", stock: "∞", cost: Math.round(800 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Nautilus pompilius — a living fossil.", onBuy: () => onBuyFish(Math.round(800 * activeSupplier.priceMult), null, "nautilus") }),
          pool.has("cuttlefish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Cuttlefish", emoji: "", stock: "∞", cost: Math.round(900 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Sepia officinalis — master of camouflage.", onBuy: () => onBuyFish(Math.round(900 * activeSupplier.priceMult), null, "cuttlefish") }),
          pool.has("hammerhead") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Hammerhead", emoji: "", stock: "∞", cost: Math.round(3e3 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Sphyrna lewini — apex predator with panoramic vision.", onBuy: () => onBuyFish(Math.round(3e3 * activeSupplier.priceMult), null, "hammerhead") }),
          pool.has("yellow_tang") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Yellow Tang", emoji: "", stock: "∞", cost: Math.round(280 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Zebrasoma flavescens — brilliant yellow reef cruiser.", onBuy: () => onBuyFish(Math.round(280 * activeSupplier.priceMult), null, "yellow_tang") }),
          pool.has("rainbow_fish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Rainbow Fish", emoji: "", stock: "∞", cost: Math.round(180 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Iridescent blue-to-orange scales.", onBuy: () => onBuyFish(Math.round(180 * activeSupplier.priceMult), null, "rainbow_fish") }),
          pool.has("pleco") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Plecostomus", emoji: "", stock: "∞", cost: Math.round(60 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Armored algae-eater, keeps glass clean.", onBuy: () => onBuyFish(Math.round(60 * activeSupplier.priceMult), null, "pleco") }),
          pool.has("clown_loach") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Clown Loach", emoji: "", stock: "∞", cost: Math.round(160 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Orange with black bands. Plays dead!", onBuy: () => onBuyFish(Math.round(160 * activeSupplier.priceMult), null, "clown_loach") }),
          pool.has("flame_tetra") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Flame Tetra", emoji: "", stock: "∞", cost: Math.round(40 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Tiny ember glowing red-orange.", onBuy: () => onBuyFish(Math.round(40 * activeSupplier.priceMult), null, "flame_tetra") }),
          pool.has("powder_blue_tang") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Powder Blue Tang", emoji: "", stock: "∞", cost: Math.round(450 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Electric blue with yellow dorsal.", onBuy: () => onBuyFish(Math.round(450 * activeSupplier.priceMult), null, "powder_blue_tang") }),
          pool.has("firemouth_cichlid") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Firemouth Cichlid", emoji: "", stock: "∞", cost: Math.round(140 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Flares bright red gill plates.", onBuy: () => onBuyFish(Math.round(140 * activeSupplier.priceMult), null, "firemouth_cichlid") }),
          pool.has("harlequin_rasbora") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Harlequin Rasbora", emoji: "", stock: "∞", cost: Math.round(35 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Copper body with black triangle.", onBuy: () => onBuyFish(Math.round(35 * activeSupplier.priceMult), null, "harlequin_rasbora") }),
          pool.has("royal_gramma") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Royal Gramma", emoji: "", stock: "∞", cost: Math.round(380 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Half purple, half gold beauty.", onBuy: () => onBuyFish(Math.round(380 * activeSupplier.priceMult), null, "royal_gramma") }),
          pool.has("cardinal_tetra") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Cardinal Tetra", emoji: "", stock: "∞", cost: Math.round(45 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Full-body red and blue stripes.", onBuy: () => onBuyFish(Math.round(45 * activeSupplier.priceMult), null, "cardinal_tetra") }),
          pool.has("dwarf_gourami") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Dwarf Gourami", emoji: "", stock: "∞", cost: Math.round(130 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Blue-red striped labyrinth fish.", onBuy: () => onBuyFish(Math.round(130 * activeSupplier.priceMult), null, "dwarf_gourami") }),
          pool.has("banggai_cardinal") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Banggai Cardinalfish", emoji: "", stock: "∞", cost: Math.round(350 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Silver with bold black bars.", onBuy: () => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, "banggai_cardinal") }),
          pool.has("leopard_wrasse") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Leopard Wrasse", emoji: "", stock: "∞", cost: Math.round(420 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Shifting leopard-like spots.", onBuy: () => onBuyFish(Math.round(420 * activeSupplier.priceMult), null, "leopard_wrasse") }),
          pool.has("garden_eel") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Garden Eel", emoji: "", stock: "∞", cost: Math.round(200 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Sways like underwater grass.", onBuy: () => onBuyFish(Math.round(200 * activeSupplier.priceMult), null, "garden_eel") }),
          pool.has("flame_angel") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Flame Angelfish", emoji: "", stock: "∞", cost: Math.round(500 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Brilliant red-orange, blue-tipped.", onBuy: () => onBuyFish(Math.round(500 * activeSupplier.priceMult), null, "flame_angel") }),
          pool.has("emerald_crab") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Emerald Crab", emoji: "", stock: "∞", cost: Math.round(55 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Tiny green algae destroyer.", onBuy: () => onBuyFish(Math.round(55 * activeSupplier.priceMult), null, "emerald_crab") }),
          pool.has("regal_tang") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Regal Tang", emoji: "", stock: "∞", cost: Math.round(400 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Bright blue, palette-yellow tail.", onBuy: () => onBuyFish(Math.round(400 * activeSupplier.priceMult), null, "regal_tang") }),
          pool.has("peacock_mantis") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Peacock Mantis Shrimp", emoji: "", stock: "∞", cost: Math.round(800 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Bullet-speed punches, 16 color channels.", onBuy: () => onBuyFish(Math.round(800 * activeSupplier.priceMult), null, "peacock_mantis") }),
          pool.has("blue_chromis") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Blue Chromis", emoji: "", stock: "∞", cost: Math.round(50 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Shimmering blue schooling fish.", onBuy: () => onBuyFish(Math.round(50 * activeSupplier.priceMult), null, "blue_chromis") }),
          pool.has("dragon_goby") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Dragon Goby", emoji: "", stock: "∞", cost: Math.round(170 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Prehistoric eel-shaped with tiny fangs.", onBuy: () => onBuyFish(Math.round(170 * activeSupplier.priceMult), null, "dragon_goby") }),
          pool.has("spotted_boxfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Spotted Boxfish", emoji: "", stock: "∞", cost: Math.round(220 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Boxy body covered in white dots.", onBuy: () => onBuyFish(Math.round(220 * activeSupplier.priceMult), null, "spotted_boxfish") }),
          pool.has("sea_apple") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Sea Apple", emoji: "", stock: "∞", cost: Math.round(350 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Vivid purple filter-feeding cucumber.", onBuy: () => onBuyFish(Math.round(350 * activeSupplier.priceMult), null, "sea_apple") }),
          pool.has("wolf_eel") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Wolf Eel", emoji: "", stock: "∞", cost: Math.round(900 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Fierce-looking fish that mates for life.", onBuy: () => onBuyFish(Math.round(900 * activeSupplier.priceMult), null, "wolf_eel") }),
          pool.has("sunburst_anthias") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Sunburst Anthias", emoji: "", stock: "∞", cost: Math.round(1200 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Blazing orange-pink, extremely rare.", onBuy: () => onBuyFish(Math.round(1200 * activeSupplier.priceMult), null, "sunburst_anthias") }),
          pool.has("frogfish") && /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Frogfish", emoji: "", stock: "∞", cost: Math.round(700 * activeSupplier.priceMult), amount: 1, coins: player.coins, desc: "Master of disguise with built-in lure.", onBuy: () => onBuyFish(Math.round(700 * activeSupplier.priceMult), null, "frogfish") })
        ] })
      ] });
    })(),
    shopTab === "supplies" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplies-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "upgrade-hint", children: "Buy supplies to keep your fish healthy and your water clean." }),
      !tank ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "fish-list-empty", children: "No tank selected." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "supplies-grid", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Fish Food", emoji: "", stock: ((_d = tank.supplies) == null ? void 0 : _d.food) ?? 0, cost: 10, amount: 10, coins: player.coins, desc: "Reduces hunger for all fish", onBuy: () => onBuySupply("food", 10, 10) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Water Treatment", emoji: "", stock: ((_e = tank.supplies) == null ? void 0 : _e.waterTreatment) ?? 0, cost: 25, amount: 3, coins: player.coins, desc: "Restore water quality by 35 pts (~5h of decay)", onBuy: () => onBuySupply("waterTreatment", 25, 3) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Antibiotic", emoji: "", stock: ((_f = tank.supplies) == null ? void 0 : _f.antibiotic) ?? 0, cost: 35, amount: 2, coins: player.coins, desc: "Cures Ich and Fin Rot (bacterial infections)", onBuy: () => onBuySupply("antibiotic", 35, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Antiparasitic", emoji: "", stock: ((_g = tank.supplies) == null ? void 0 : _g.antiparasitic) ?? 0, cost: 50, amount: 2, coins: player.coins, desc: "Cures Velvet (parasitic infection)", onBuy: () => onBuySupply("antiparasitic", 50, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Digestive Remedy", emoji: "", stock: ((_h = tank.supplies) == null ? void 0 : _h.digestiveRemedy) ?? 0, cost: 30, amount: 2, coins: player.coins, desc: "Cures Bloat (digestive illness)", onBuy: () => onBuySupply("digestiveRemedy", 30, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Breeding Boost", emoji: "", stock: ((_i = tank.supplies) == null ? void 0 : _i.breedingBoost) ?? 0, cost: 60, amount: 1, coins: player.coins, desc: "Next breeding takes only 10 seconds", onBuy: () => onBuySupply("breedingBoost", 60, 1) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Diagnostic Kit", emoji: "", stock: ((_j = tank.supplies) == null ? void 0 : _j.diagnosticKit) ?? 0, cost: 25, amount: 2, coins: player.coins, desc: "Instantly identify an unknown illness during incubation", onBuy: () => onBuySupply("diagnosticKit", 25, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Vitamins", emoji: "", stock: ((_k = tank.supplies) == null ? void 0 : _k.vitamins) ?? 0, cost: 40, amount: 2, coins: player.coins, desc: "10 minutes of disease immunity for one fish", onBuy: () => onBuySupply("vitamins", 40, 2) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SupplyCard, { name: "Heater Cartridge", emoji: "", stock: ((_l = tank.supplies) == null ? void 0 : _l.heater) ?? 0, cost: 30, amount: 2, coins: player.coins, desc: "Nudges temperature 4°F toward 74°F", onBuy: () => onBuySupply("heater", 30, 2) })
      ] })
    ] }),
    shopTab === "market" && /* @__PURE__ */ jsxRuntimeExports.jsx(RareMarket, { game, activeTank, onBuyRareItem }),
    shopTab === "history" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "history-panel", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "Recent Sales" }),
      (shop.salesHistory || []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "fish-list-empty", children: [
        "No sales yet.",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", style: { marginTop: "6px", display: "inline-block" }, onClick: () => setShopTab("sell"), children: "List some fish →" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sales-list", children: (shop.salesHistory || []).map((evt) => (
        // Bug 7: was key={i} — when salesHistory is trimmed to 20 entries
        // every existing key shifts by one, causing React to reuse wrong nodes.
        // Composite of time + fishName is stable and unique in practice.
        /* @__PURE__ */ jsxRuntimeExports.jsx(SaleEvent, { event: evt }, `${evt.time}-${evt.fishName}`)
      )) })
    ] })
  ] });
}
const Shop$1 = reactExports.memo(
  Shop,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
    return ((_a = prev.game) == null ? void 0 : _a.shop) === ((_b = next.game) == null ? void 0 : _b.shop) && ((_c = prev.game) == null ? void 0 : _c.fish) === ((_d = next.game) == null ? void 0 : _d.fish) && ((_e = prev.game) == null ? void 0 : _e.tanks) === ((_f = next.game) == null ? void 0 : _f.tanks) && ((_h = (_g = prev.game) == null ? void 0 : _g.player) == null ? void 0 : _h.coins) === ((_j = (_i = next.game) == null ? void 0 : _i.player) == null ? void 0 : _j.coins) && ((_l = (_k = prev.game) == null ? void 0 : _k.player) == null ? void 0 : _l.boosts) === ((_n = (_m = next.game) == null ? void 0 : _m.player) == null ? void 0 : _n.boosts) && ((_o = prev.game) == null ? void 0 : _o.rareMarket) === ((_p = next.game) == null ? void 0 : _p.rareMarket) && prev.activeTank === next.activeTank;
  }
);
function EventCard({ event }) {
  if (!event) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-discovery", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-discovery-glow" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-discovery-emoji", children: event.emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-discovery-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-discovery-headline", children: event.headline }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-discovery-detail", children: event.detail.split("**").map(
        (part, i) => i % 2 === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: part }, i) : part
      ) }),
      event.type === "found_item" && event.coinBonus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-discovery-reward", children: [
        "+",
        event.coinBonus,
        " coins added to your wallet"
      ] }),
      event.type === "visitor" && event.fish && event.fish.species && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-discovery-reward", children: [
        event.fish.species.name,
        " added to your tank"
      ] }),
      event.type === "mutation" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-discovery-reward", children: "Sale value increased ×1.5" })
    ] })
  ] });
}
function OfflineSummary({ summary, onDismiss }) {
  const [revealed, setRevealed] = reactExports.useState(false);
  if (!summary) return null;
  const {
    timeAway,
    eggsHatched,
    fishGrown,
    fishSold,
    coinsEarned,
    waterQualityLost,
    fishDied,
    offlineEvent,
    ambientMessage,
    hasEvents
  } = summary;
  const hasActivity = eggsHatched > 0 || fishGrown > 0 || fishSold > 0 || fishDied > 0;
  const handleReveal = () => {
    if (offlineEvent && !revealed) {
      setRevealed(true);
    } else {
      onDismiss();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-overlay", onClick: onDismiss, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-modal offline-modal-v2", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-away-badge", children: timeAway }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "offline-title-v2", children: "While you were away…" }),
      ambientMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-ambient", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ambientMessage.emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ambientMessage.text })
      ] })
    ] }),
    hasEvents && hasActivity && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-activity", children: [
      eggsHatched > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-text", children: eggsHatched === 1 ? "An egg hatched" : `${eggsHatched} eggs hatched` })
      ] }),
      fishGrown > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-text", children: fishGrown === 1 ? "1 juvenile grew into an adult" : `${fishGrown} juveniles grew into adults` })
      ] }),
      fishSold > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "offline-row-text", children: [
          "Sold ",
          fishSold,
          " fish — earned ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: coinsEarned })
        ] })
      ] }),
      fishDied > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-row offline-row-warn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-text", children: fishDied === 1 ? "1 fish didn't make it" : `${fishDied} fish didn't make it` })
      ] }),
      waterQualityLost > 15 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "offline-row offline-row-warn", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-row-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "offline-row-text", children: [
          "Water quality dropped ",
          waterQualityLost,
          "% — check your filters"
        ] })
      ] })
    ] }),
    offlineEvent && !revealed && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "offline-discover-btn", onClick: handleReveal, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: offlineEvent.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Something happened… tap to reveal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "offline-discover-chevron", children: "›" })
    ] }),
    offlineEvent && revealed && /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: offlineEvent }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "btn btn-collect offline-dismiss",
        onClick: offlineEvent && !revealed ? handleReveal : onDismiss,
        children: offlineEvent && !revealed ? "What happened?" : "Let's go!"
      }
    )
  ] }) });
}
let _customSpecies = [];
let _customDecorations = [];
let _customEvents = [];
function getCustomSpecies() {
  return _customSpecies;
}
function getCustomDecorations() {
  return _customDecorations;
}
function getCustomEvents() {
  return _customEvents;
}
function validateSpecies(spec) {
  const required = ["key", "name", "rarity", "basePrice"];
  for (const field of required) {
    if (!spec[field]) return `Missing required field: ${field}`;
  }
  if (!["common", "uncommon", "rare", "epic", "legendary"].includes(spec.rarity)) {
    return `Invalid rarity: ${spec.rarity}`;
  }
  if (typeof spec.basePrice !== "number" || spec.basePrice <= 0) {
    return `Invalid basePrice: ${spec.basePrice}`;
  }
  return null;
}
function loadMod(jsonString) {
  try {
    const mod = JSON.parse(jsonString);
    const results = { species: 0, decorations: 0, events: 0, errors: [] };
    if (mod.species && Array.isArray(mod.species)) {
      for (const spec of mod.species) {
        const err = validateSpecies(spec);
        if (err) {
          results.errors.push(`Species "${spec.name || spec.key}": ${err}`);
          continue;
        }
        const fullSpec = {
          key: spec.key,
          name: spec.name,
          scientificName: spec.scientificName || "",
          rarity: spec.rarity,
          basePrice: spec.basePrice,
          visualType: "procedural",
          // custom species use procedural rendering
          lore: spec.lore || "",
          habitat: spec.habitat || "",
          funFact: spec.funFact || "",
          colorVariants: spec.colorVariants || ["default"],
          conservationStatus: spec.conservationStatus || "",
          behaviorProfile: {
            swimSpeed: spec.swimSpeed || 0.5,
            turnChance: spec.turnChance || 0.03,
            bobAmplitude: spec.bobAmplitude || 0.01,
            preferredYRange: spec.preferredYRange || [30, 70],
            idleProbability: spec.idleProbability || 0.3
          },
          compatibility: {
            water: spec.water || "fresh",
            temp: spec.temp || "tropical",
            temperament: spec.temperament || "peaceful",
            schoolSize: spec.schoolSize || 0
          },
          isCustom: true
        };
        _customSpecies.push(fullSpec);
        results.species++;
      }
    }
    if (mod.decorations && Array.isArray(mod.decorations)) {
      for (const dec of mod.decorations) {
        if (!dec.id || !dec.name) {
          results.errors.push(`Decoration missing id or name`);
          continue;
        }
        _customDecorations.push({
          id: `custom_${dec.id}`,
          name: dec.name,
          emoji: "",
          cost: dec.cost || 50,
          rarity: dec.rarity || "common",
          desc: dec.desc || "A custom decoration.",
          isCustom: true
        });
        results.decorations++;
      }
    }
    if (mod.events && Array.isArray(mod.events)) {
      for (const evt of mod.events) {
        if (!evt.id || !evt.name || !evt.message) {
          results.errors.push(`Event missing id, name, or message`);
          continue;
        }
        _customEvents.push({
          id: `custom_${evt.id}`,
          name: evt.name,
          desc: evt.desc || "",
          message: evt.message,
          weight: evt.weight || 5,
          minRep: evt.minRep || 0,
          coinBonus: evt.coinBonus || 0,
          repBonus: evt.repBonus || 0,
          isCustom: true
        });
        results.events++;
      }
    }
    return results;
  } catch (err) {
    return { species: 0, decorations: 0, events: 0, errors: [`JSON parse error: ${err.message}`] };
  }
}
function clearMods() {
  _customSpecies = [];
  _customDecorations = [];
  _customEvents = [];
}
function getModTemplate() {
  return JSON.stringify({
    name: "My Custom Mod",
    author: "Your Name",
    version: "1.0",
    species: [
      {
        key: "rainbow_shrimp",
        name: "Rainbow Shrimp",
        scientificName: "Neocaridina prismatica",
        rarity: "rare",
        basePrice: 200,
        lore: "A shrimp with prismatic coloring that shifts in the light.",
        habitat: "Custom freshwater environments",
        funFact: "Changes color based on mood!",
        water: "fresh",
        temp: "tropical",
        temperament: "peaceful",
        schoolSize: 3,
        swimSpeed: 0.3
      }
    ],
    decorations: [
      {
        id: "crystal_cave",
        name: "Crystal Cave",
        cost: 100,
        rarity: "rare",
        desc: "A glowing crystal formation."
      }
    ],
    events: [
      {
        id: "meteor_shower",
        name: "Meteor Shower!",
        desc: "A spectacular display in the sky above your aquarium.",
        message: "Meteor shower! Visitors are amazed! +20 reputation.",
        coinBonus: 100,
        repBonus: 20
      }
    ]
  }, null, 2);
}
function ModPanel() {
  const [results, setResults] = reactExports.useState(null);
  const [counts, setCounts] = reactExports.useState({ species: 0, deco: 0, events: 0 });
  const fileRef = reactExports.useRef(null);
  const refreshCounts = () => {
    setCounts({
      species: getCustomSpecies().length,
      deco: getCustomDecorations().length,
      events: getCustomEvents().length
    });
  };
  const handleFile = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    try {
      const text = await file.text();
      const res = loadMod(text);
      setResults(res);
      refreshCounts();
    } catch (err) {
      setResults({ species: 0, decorations: 0, events: 0, errors: [err.message] });
    }
    e.target.value = "";
  };
  const handleClear = () => {
    clearMods();
    setResults(null);
    refreshCounts();
  };
  const handleTemplate = () => {
    const blob = new Blob([getModTemplate()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fish_tycoon_mod_template.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mod-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mod-title", children: "MODDING" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mod-desc", children: "Load custom species, decorations, and events from JSON files." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mod-stats", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Custom species: ",
        counts.species
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Custom decorations: ",
        counts.deco
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Custom events: ",
        counts.events
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mod-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".json", onChange: handleFile, style: { display: "none" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn mod-btn", onClick: () => {
        var _a;
        return (_a = fileRef.current) == null ? void 0 : _a.click();
      }, children: "Load Mod (.json)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn mod-btn", onClick: handleTemplate, children: "Download Template" }),
      counts.species + counts.deco + counts.events > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn mod-btn mod-btn--danger", onClick: handleClear, children: "Clear All Mods" })
    ] }),
    results && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mod-results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mod-result-line", children: [
        "Loaded: ",
        results.species,
        " species, ",
        results.decorations,
        " decorations, ",
        results.events,
        " events"
      ] }),
      results.errors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mod-errors", children: results.errors.map((e, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mod-error", children: e }, i)) })
    ] })
  ] });
}
function SettingsPanel({ onClose }) {
  const [master, setMaster] = reactExports.useState(getMasterVolume);
  const [music, setMusic] = reactExports.useState(getMusicVolume);
  const [sfx, setSfx] = reactExports.useState(getSFXVolume);
  const distortion = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.distortion) ?? true;
  });
  const particles = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.particles) ?? true;
  });
  const reducedMotion = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.reducedMotion) ?? false;
  });
  const colorblind = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.colorblind) ?? false;
  });
  const largeText = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.largeText) ?? false;
  });
  const highContrast = useGameStore((s) => {
    var _a;
    return ((_a = s.settings) == null ? void 0 : _a.highContrast) ?? false;
  });
  const updateSetting = (key, val) => {
    useGameStore.setState((state) => {
      if (!state.settings) state.settings = {};
      state.settings[key] = val;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-title", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "Audio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSlider, { label: "Master Volume", value: master, onChange: (v) => {
        setMaster(v);
        setMasterVolume(v);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSlider, { label: "Music", value: music, onChange: (v) => {
        setMusic(v);
        setMusicVolume(v);
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsSlider, { label: "Sound Effects", value: sfx, onChange: (v) => {
        setSfx(v);
        setSFXVolume(v);
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "Graphics" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "Water Distortion", value: distortion, onChange: (v) => updateSetting("distortion", v), hint: "SVG ripple effect (disable for performance)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "Particles & Plankton", value: particles, onChange: (v) => updateSetting("particles", v), hint: "Floating particles and plankton dots" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "Reduced Motion", value: reducedMotion, onChange: (v) => updateSetting("reducedMotion", v), hint: "Disable most animations" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "Difficulty" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsDifficulty, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "♿ Accessibility" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "Colorblind Mode", value: colorblind, onChange: (v) => updateSetting("colorblind", v), hint: "Use patterns + labels instead of color-only indicators" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "Large Text", value: largeText, onChange: (v) => updateSetting("largeText", v), hint: "Increase text size across the interface" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsToggle, { label: "High Contrast", value: highContrast, onChange: (v) => updateSetting("highContrast", v), hint: "Stronger borders and brighter text" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "⌨️ Keyboard Shortcuts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-keys", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "1" }),
        "–",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "3" }),
        " Switch tanks  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "F" }),
        " Feed selected fish  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "A" }),
        " Feed all  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "S" }),
        " Toggle sell  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "M" }),
        " Use medicine  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Space" }),
        " Pause  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "1-5" }),
        " Navigate  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Tab" }),
        " Next section  ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("kbd", { children: "Esc" }),
        " Close"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModPanel, {}) }),
    typeof window !== "undefined" && window.electronAPI && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => {
      var _a, _b;
      return (_b = (_a = document.documentElement).requestFullscreen) == null ? void 0 : _b.call(_a);
    }, children: "Toggle Fullscreen" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-section-title", children: "Save Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: "6px", flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => {
          const s = useGameStore.getState();
          const blob = new Blob([JSON.stringify(s)], { type: "application/json" });
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `fish-tycoon-save-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
          a.click();
        }, children: "Export Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "btn btn-sm", style: { cursor: "pointer" }, children: [
          "Import Save",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".json", style: { display: "none" }, onChange: (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
              try {
                useGameStore.getState().importSave(ev.target.result);
              } catch {
              }
            };
            reader.readAsText(file);
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-danger", onClick: () => {
          if (confirm("Reset all progress? This cannot be undone.")) useGameStore.getState().resetGame();
        }, children: "Reset Game" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-footer", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-primary", onClick: onClose, children: "Done" }) })
  ] }) });
}
function SettingsSlider({ label, value, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-label", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min: "0",
        max: "1",
        step: "0.05",
        value,
        onChange: (e) => onChange(parseFloat(e.target.value)),
        className: "settings-slider"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "settings-val", children: [
      Math.round(value * 100),
      "%"
    ] })
  ] });
}
function SettingsToggle({ label, value, onChange, hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-label", children: label }),
      hint && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-hint", children: hint })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `settings-toggle ${value ? "on" : "off"}`, onClick: () => onChange(!value), children: value ? "ON" : "OFF" })
  ] });
}
function SettingsDifficulty() {
  const difficulty = useGameStore((s) => s.difficulty || "normal");
  const isCampaign = useGameStore((s) => {
    var _a;
    return ((_a = s.campaign) == null ? void 0 : _a.mode) === "campaign";
  });
  const presets = [
    { id: "easy", label: "EASY", desc: "+50% coins, less disease, slower hunger" },
    { id: "normal", label: "NORMAL", desc: "Balanced experience" },
    { id: "hard", label: "HARD", desc: "-40% coins, more disease, faster decay" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-difficulty", children: [
    presets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `settings-diff-btn ${difficulty === p.id ? "settings-diff-btn--active" : ""}`,
        onClick: () => useGameStore.setState({ difficulty: p.id }),
        disabled: isCampaign,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-diff-label", children: p.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "settings-diff-desc", children: p.desc })
        ]
      },
      p.id
    )),
    isCampaign && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-diff-note", children: "Difficulty is locked during campaign levels." })
  ] });
}
const TUTORIAL_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Fish Tycoon 2!",
    text: "You run an aquarium. Buy fish, keep them healthy, breed new species, and sell to customers for profit. Let's start!",
    highlight: null,
    tab: null,
    waitFor: null
  },
  {
    id: "tap_fish",
    title: "Tap a Fish",
    text: "Tap any fish in your tank to open its inspector. You can see its health, genetics, and rarity — plus actions like Feed and Sell.",
    highlight: null,
    tab: "tank",
    action: "selectFish",
    waitFor: (state) => true
  },
  {
    id: "feed_and_sell",
    title: "Feed & Sell",
    text: "Hungry fish lose health! Press F to feed, or S to list for sale. Customers visit automatically and buy listed fish for coins.",
    highlight: null,
    tab: "tank",
    action: "feedFish",
    waitFor: (state) => {
      var _a, _b, _c, _d;
      return (((_b = (_a = state.player) == null ? void 0 : _a.stats) == null ? void 0 : _b.fishFed) || 0) >= 1 || (((_d = (_c = state.shop) == null ? void 0 : _c.listedFish) == null ? void 0 : _d.length) || 0) >= 1;
    }
  },
  {
    id: "market_hint",
    title: "Visit the Market",
    text: "The Market (key 2) has fish to buy, supplies to stock, and upgrades. Check the Wanted Board for bounty requests with bonus rewards!",
    highlight: "market",
    tab: null,
    waitFor: (state) => {
      var _a, _b;
      return (((_b = (_a = state.player) == null ? void 0 : _a.stats) == null ? void 0 : _b.fishBought) || 0) >= 2;
    }
  },
  {
    id: "breed_hint",
    title: "Try Breeding",
    text: "Go to the Breeding Lab (key 3). Place two adults in the parent slots — wait for eggs, then collect them! Offspring inherit traits from both parents.",
    highlight: "breed",
    tab: null,
    action: "breed",
    waitFor: (state) => {
      var _a;
      return ((_a = state.breedingTank) == null ? void 0 : _a.breedingStartedAt) !== null;
    }
  },
  {
    id: "speed_hint",
    title: "Speed Controls",
    text: "Press . to speed up time (2x or 3x) and , to slow down. Breeding, customers, and growth all run faster. Press Space to pause.",
    highlight: null,
    tab: null,
    waitFor: null
  },
  {
    id: "office_hint",
    title: "The Office",
    text: "The Office (key 5) has your staff, decoration shop, contracts, and autopsy records. Hire a Caretaker to auto-feed your fish!",
    highlight: "office",
    tab: null,
    waitFor: null
  },
  {
    id: "complete",
    title: "You're Ready!",
    text: "You know the basics! Breed diverse fish for rare species, check the Fishdex (key 4) for your collection, and explore the Records for achievements.",
    highlight: null,
    tab: null,
    action: null
  }
];
function Tutorial() {
  const tutorialStep = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.tutorialStep) ?? 0;
  });
  const tutorialDone = useGameStore((s) => {
    var _a;
    return (_a = s.player) == null ? void 0 : _a.tutorialDone;
  });
  useGameStore();
  const step = TUTORIAL_STEPS[tutorialStep];
  reactExports.useEffect(() => {
    if (!step || tutorialDone || !step.waitFor) return;
    const id = setInterval(() => {
      const s = useGameStore.getState();
      if (step.waitFor(s)) {
        useGameStore.setState((st) => {
          st.player.tutorialStep = tutorialStep + 1;
        });
      }
    }, 1e3);
    return () => clearInterval(id);
  }, [tutorialStep, tutorialDone, step]);
  if (tutorialDone || !step) return null;
  const isLast = tutorialStep >= TUTORIAL_STEPS.length - 1;
  const isFirst = tutorialStep === 0;
  const hasCondition = !!step.waitFor && !isFirst && !isLast;
  const advance = () => {
    if (isLast) {
      useGameStore.setState((st) => {
        st.player.tutorialDone = true;
      });
    } else {
      useGameStore.setState((st) => {
        st.player.tutorialStep = tutorialStep + 1;
      });
    }
  };
  const skip = () => {
    useGameStore.setState((st) => {
      st.player.tutorialDone = true;
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tutorial-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tutorial-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tutorial-progress", children: TUTORIAL_STEPS.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `tutorial-dot ${i < tutorialStep ? "done" : ""} ${i === tutorialStep ? "active" : ""}` }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tutorial-title", children: step.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tutorial-text", children: step.text }),
    step.highlight && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tutorial-hint", children: [
      "Click the ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: { shop: "Shop", tank: "Tank", breed: "Breed", challenges: "Goals" }[step.highlight] || step.highlight }),
      " tab",
      step.highlight === "feed" ? " or use the Feed button" : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tutorial-actions", children: [
      !isFirst && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => useGameStore.setState((st) => {
        st.player.tutorialStep = tutorialStep - 1;
      }), children: "← Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-primary", onClick: advance, children: isLast ? "Start Playing" : hasCondition ? "Skip →" : "Next →" }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm tutorial-skip", onClick: skip, children: "Skip Tutorial" })
    ] })
  ] }) });
}
const SHADOW_TYPES = [
  { rarity: "common", weight: 50, speed: 1, size: 1, points: 10 },
  { rarity: "common", weight: 30, speed: 1.2, size: 0.8, points: 10 },
  { rarity: "uncommon", weight: 12, speed: 1.5, size: 1, points: 25 },
  { rarity: "rare", weight: 5, speed: 2, size: 1.2, points: 50 },
  { rarity: "epic", weight: 2, speed: 2.8, size: 1.5, points: 100 },
  { rarity: "legendary", weight: 0.5, speed: 3.5, size: 0.6, points: 250 }
];
function pickShadow(luckBonus = 0) {
  const adjusted = SHADOW_TYPES.map((s) => ({
    ...s,
    weight: s.rarity === "common" ? s.weight * (1 - luckBonus * 0.3) : s.weight * (1 + luckBonus)
  }));
  const total = adjusted.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * total;
  for (const s of adjusted) {
    roll -= s.weight;
    if (roll <= 0) return s;
  }
  return adjusted[0];
}
function createCaughtFish(shadow, tankId) {
  return createFish({
    stage: "adult",
    tankId,
    genome: randomGenome(),
    targetRarity: shadow.rarity
  });
}
function canPlayCatch(state) {
  var _a;
  const last = (_a = state.player) == null ? void 0 : _a.lastCatchDate;
  if (!last) return true;
  return (/* @__PURE__ */ new Date()).toDateString() !== last;
}
const GAME_DURATION = 30;
const SHADOW_LIFETIME = 3500;
const SPAWN_INTERVAL = 900;
const RARITY_COLORS$1 = {
  common: "#5aaa70",
  uncommon: "#5a9aaa",
  rare: "#8a70a8",
  epic: "#b0944a",
  legendary: "#a06080"
};
function CatchOfDayPanel() {
  const player = useGameStore((s) => s.player);
  const tanks = useGameStore((s) => s.tanks);
  const [phase, setPhase] = reactExports.useState("intro");
  const [timeLeft, setTimeLeft] = reactExports.useState(GAME_DURATION);
  const [shadows, setShadows] = reactExports.useState([]);
  const [caught, setCaught] = reactExports.useState([]);
  const [score, setScore] = reactExports.useState(0);
  const [combo, setCombo] = reactExports.useState(0);
  const [lastCatchTime, setLastCatchTime] = reactExports.useState(0);
  const spawnRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const eligible = canPlayCatch({ player });
  const startGame = reactExports.useCallback(() => {
    setPhase("playing");
    setTimeLeft(GAME_DURATION);
    setShadows([]);
    setCaught([]);
    setScore(0);
    setCombo(0);
  }, []);
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setPhase("results");
          return 0;
        }
        return t - 1;
      });
    }, 1e3);
    return () => clearInterval(timerRef.current);
  }, [phase]);
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const luckBonus = (player.prestigeLevel || 0) * 0.1;
    const spawn = () => {
      const shadow = pickShadow(luckBonus);
      const id = Date.now() + Math.random();
      const fromLeft = Math.random() > 0.5;
      setShadows((prev) => [...prev.slice(-8), {
        id,
        rarity: shadow.rarity,
        speed: shadow.speed,
        size: shadow.size,
        points: shadow.points,
        y: 15 + Math.random() * 65,
        fromLeft,
        x: fromLeft ? -10 : 110,
        spawnedAt: Date.now()
      }]);
    };
    spawn();
    spawnRef.current = setInterval(spawn, SPAWN_INTERVAL);
    return () => clearInterval(spawnRef.current);
  }, [phase, player.prestigeLevel]);
  reactExports.useEffect(() => {
    if (phase !== "playing") return;
    const frame = setInterval(() => {
      setShadows(
        (prev) => prev.map((s) => ({
          ...s,
          x: s.x + (s.fromLeft ? 1 : -1) * s.speed * 0.8
        })).filter((s) => Date.now() - s.spawnedAt < SHADOW_LIFETIME && s.x > -15 && s.x < 115)
      );
    }, 50);
    return () => clearInterval(frame);
  }, [phase]);
  const handleCatch = (shadow) => {
    setShadows((prev) => prev.filter((s) => s.id !== shadow.id));
    const now = Date.now();
    const newCombo = now - lastCatchTime < 1500 ? combo + 1 : 1;
    setLastCatchTime(now);
    setCombo(newCombo);
    const comboMult = Math.min(3, 1 + (newCombo - 1) * 0.5);
    const points = Math.round(shadow.points * comboMult);
    setScore((s) => s + points);
    setCaught((prev) => [...prev, { ...shadow, comboMult }]);
    if (shadow.rarity === "rare" || shadow.rarity === "epic" || shadow.rarity === "legendary") {
      playDiscover();
    } else {
      playBubble();
    }
  };
  const handleClaimCatch = () => {
    var _a, _b;
    const tankId = ((_a = tanks[0]) == null ? void 0 : _a.id) || "tank_0";
    const capacity = ((_b = tanks[0]) == null ? void 0 : _b.capacity) || 12;
    const currentCount = useGameStore.getState().fish.filter((f) => f.tankId === tankId).length;
    const room = capacity - currentCount;
    const sorted = [...caught].sort((a, b) => b.points - a.points);
    const toKeep = sorted.slice(0, Math.min(3, room));
    useGameStore.setState((state) => {
      for (const shadow of toKeep) {
        const fish = createCaughtFish(shadow, tankId);
        state.fish.push(fish);
      }
      state.player.coins += Math.round(score * 0.1);
      state.player.xp = (state.player.xp || 0) + Math.min(50, Math.round(score * 0.2));
      state.player.lastCatchDate = (/* @__PURE__ */ new Date()).toDateString();
      state.player.stats.catchGamesPlayed = (state.player.stats.catchGamesPlayed || 0) + 1;
      state.player.stats.fishCaught = (state.player.stats.fishCaught || 0) + toKeep.length;
    });
    playCoin();
    setPhase("claimed");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-game", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-title", children: "Catch of the Day" }),
    phase === "intro" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-intro", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "A wild pond has been spotted nearby! Click the swimming shadows to catch fish." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "catch-rules", children: [
        GAME_DURATION,
        " seconds · Keep up to 3 best catches · Chain for combo"
      ] }),
      !eligible ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-cooldown", children: "You've already fished today. Come back tomorrow!" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary catch-start", onClick: startGame, children: "Cast your net" })
    ] }),
    phase === "playing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-hud", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "catch-timer", children: [
          timeLeft,
          "s"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "catch-score", children: [
          "Score: ",
          score
        ] }),
        combo > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "catch-combo", children: [
          "×",
          combo,
          " COMBO!"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "catch-count", children: [
          "Caught: ",
          caught.length
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-pond", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-surface" }),
        shadows.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `catch-shadow catch-shadow--${s.rarity}`,
            style: {
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `scaleX(${s.fromLeft ? 1 : -1}) scale(${s.size})`
            },
            onClick: () => handleCatch(s),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "50", height: "25", viewBox: "0 0 50 25", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "22", cy: "12", rx: "18", ry: "8", fill: "rgba(0,0,0,0.4)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M40,12 L48,6 L48,18 Z", fill: "rgba(0,0,0,0.3)" }),
                (s.rarity === "epic" || s.rarity === "legendary") && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "ellipse",
                  {
                    cx: "22",
                    cy: "12",
                    rx: "20",
                    ry: "10",
                    fill: "none",
                    stroke: RARITY_COLORS$1[s.rarity],
                    strokeWidth: "1.5",
                    opacity: "0.5"
                  }
                )
              ] }),
              s.rarity !== "common" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "catch-shadow-rarity", style: { color: RARITY_COLORS$1[s.rarity] }, children: s.rarity === "legendary" ? "★" : s.rarity === "epic" ? "◆" : s.rarity === "rare" ? "●" : "○" })
            ]
          },
          s.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-ripples" })
      ] })
    ] }),
    phase === "results" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-results", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-results-title", children: "Time's up!" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-results-score", children: [
        "Final Score: ",
        score
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-results-summary", children: [
        "Caught ",
        caught.length,
        " fish",
        caught.filter((c) => c.rarity === "rare").length > 0 && ` · ${caught.filter((c) => c.rarity === "rare").length} rare`,
        caught.filter((c) => c.rarity === "epic").length > 0 && ` · ${caught.filter((c) => c.rarity === "epic").length} epic!`,
        caught.filter((c) => c.rarity === "legendary").length > 0 && ` · ${caught.filter((c) => c.rarity === "legendary").length} LEGENDARY!!`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-results-rewards", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Keep up to 3 best fish" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "🪙 +",
          Math.round(score * 0.1),
          " bonus coins"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "+",
          Math.min(50, Math.round(score * 0.2)),
          " XP"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary", onClick: handleClaimCatch, children: "Claim your catch!" })
    ] }),
    phase === "claimed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "catch-claimed", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "catch-claimed-icon", children: "Done" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Great fishing! Your catches are in the tank." })
    ] })
  ] });
}
function EventPopup() {
  const activeEvent = useGameStore((s) => s.activeEvent);
  const [visible, setVisible] = reactExports.useState(false);
  const [event, setEvent] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (activeEvent && activeEvent.id !== (event == null ? void 0 : event.id)) {
      setEvent(activeEvent);
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 6e3);
      return () => clearTimeout(t);
    }
  }, [activeEvent == null ? void 0 : activeEvent.id]);
  if (!visible || !event) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "event-popup", onClick: () => setVisible(false), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "event-popup-emoji", children: event.emoji }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "event-popup-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "event-popup-title", children: event.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "event-popup-desc", children: event.desc })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "event-popup-dismiss", children: "✕" })
  ] });
}
function HagglePopup() {
  const haggle = useGameStore((s) => s.pendingHaggle);
  const resolveHaggle = useGameStore((s) => s.resolveHaggle);
  const [counterOffer, setCounterOffer] = reactExports.useState("");
  const [phase, setPhase] = reactExports.useState("offer");
  const [result, setResult] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (haggle) {
      setPhase("offer");
      setResult(null);
      setCounterOffer(String(Math.round((haggle.offer + haggle.askPrice) / 2)));
    }
  }, [haggle == null ? void 0 : haggle.id]);
  if (!haggle) return null;
  const handleAccept = () => {
    setResult({ accepted: true, price: haggle.offer });
    setPhase("result");
    setTimeout(() => resolveHaggle("accept"), 1500);
  };
  const handleDecline = () => {
    setResult({ accepted: false });
    setPhase("result");
    setTimeout(() => resolveHaggle("decline"), 1200);
  };
  const handleCounter = () => {
    if (phase === "offer") {
      setPhase("counter");
      return;
    }
    const price = parseInt(counterOffer) || 0;
    if (price <= 0) return;
    const accepted = price <= haggle.maxBudget;
    const halfway = Math.round((price + haggle.offer) / 2);
    const finalPrice = accepted ? price : halfway <= haggle.maxBudget ? halfway : 0;
    if (finalPrice > 0) {
      setResult({ accepted: true, price: finalPrice, countered: true });
      setPhase("result");
      setTimeout(() => resolveHaggle("counter", finalPrice), 1500);
    } else {
      setResult({ accepted: false, tooHigh: true });
      setPhase("result");
      setTimeout(() => resolveHaggle("decline"), 1500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "haggle-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-popup", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-customer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "haggle-emoji", children: haggle.customerEmoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "haggle-name", children: haggle.customerName })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-speech", children: [
      '"',
      haggle.greeting,
      '"'
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-fish-info", children: [
      "Wants to buy: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: haggle.fishName })
    ] }),
    phase === "offer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-offer", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "haggle-offer-label", children: "Their offer:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "haggle-offer-price", children: haggle.offer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "haggle-offer-vs", children: haggle.offer >= haggle.askPrice ? "Above asking!" : `You asked ${haggle.askPrice}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm haggle-accept", onClick: handleAccept, children: [
          "Accept ",
          haggle.offer
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm haggle-counter", onClick: handleCounter, children: "Counter-offer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm haggle-decline", onClick: handleDecline, children: "No deal" })
      ] })
    ] }),
    phase === "counter" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-counter-phase", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-counter-input", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your price:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "number",
            value: counterOffer,
            onChange: (e) => setCounterOffer(e.target.value),
            min: "1",
            className: "haggle-input",
            autoFocus: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "haggle-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm haggle-accept", onClick: handleCounter, children: "Send offer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm haggle-decline", onClick: handleDecline, children: "Walk away" })
      ] })
    ] }),
    phase === "result" && result && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `haggle-result ${result.accepted ? "success" : "failed"}`, children: result.accepted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "haggle-result-icon", children: "Deal" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "SOLD for ",
        result.price,
        "!"
      ] }),
      result.countered && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "haggle-result-sub", children: "They accepted your counter-offer." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "haggle-result-icon", children: "Left" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: result.tooHigh ? "Too expensive! Customer walked away." : "Customer left without buying." })
    ] }) })
  ] }) });
}
function TitleScreen({ onStart }) {
  const [hasSave, setHasSave] = reactExports.useState(false);
  const [fadeOut, setFadeOut] = reactExports.useState(false);
  const [bubbles] = reactExports.useState(
    () => Array.from({ length: 18 }, (_, i) => ({
      left: Math.random() * 100,
      size: 3 + Math.random() * 8,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.2
    }))
  );
  reactExports.useEffect(() => {
    try {
      const save = loadGame();
      setHasSave(!!save);
    } catch {
    }
  }, []);
  const handleStart = (mode) => {
    startMusic();
    setFadeOut(true);
    setTimeout(() => onStart(mode), 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `title-screen ${fadeOut ? "title-fade-out" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "title-bg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-rays", children: [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `title-ray title-ray-${i}` }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bubbles", children: bubbles.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-bubble", style: {
        left: `${b.left}%`,
        width: b.size,
        height: b.size,
        animationDelay: `${b.delay}s`,
        animationDuration: `${b.duration}s`,
        opacity: b.opacity
      } }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-caustics" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "title-logo-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "title-logo-glow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "title-logo", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "title-logo-text", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-word-fish", children: "Fish" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-word-tycoon", children: "Tycoon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-word-2", children: "2" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "title-tagline", children: "Breed. Trade. Manage." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "title-menu", children: [
      hasSave && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "title-btn title-btn-primary", onClick: () => handleStart("continue"), children: "Continue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "title-btn title-btn-primary", onClick: () => handleStart("campaign"), children: "Campaign" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "title-btn", onClick: () => handleStart("sandbox"), children: "Sandbox" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "title-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-version", children: "v0.10.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "title-credit", children: "Made with love" })
    ] })
  ] });
}
function Credits({ onClose }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credits-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-title", children: "Fish Tycoon 2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-version", children: "Version 0.1.0 — Early Access" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credits-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-section-title", children: "Game Design & Development" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Built with React, Zustand, Vite & Web Audio API" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credits-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-section-title", children: "Technology" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "16 hand-crafted SVG fish species" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Procedural genetics engine with Mendelian inheritance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Procedural ambient music synthesis" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "SVG water distortion shaders" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credits-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-section-title", children: "Game Features" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "16 species · 61 color variants · 21 upgrades" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "7 diseases · 10 random events · 9 customer types" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Interactive haggling · Prestige system · Level progression" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Multi-bay breeding · 6 tank slots · Seasonal events" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "Fish personalities · Day/night cycle · 140+ animations" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "credits-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-section-title", children: "Special Thanks" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "credits-entry", children: "To all the fish that gave their lives during playtesting" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-primary credits-close", onClick: onClose, children: "Close" })
  ] }) });
}
const TRAIT_RARITY = {
  // Body shapes
  Orb: "common",
  Round: "common",
  Delta: "uncommon",
  Slender: "uncommon",
  Eel: "rare",
  // Fin types
  Veil: "common",
  Flowing: "common",
  Broad: "uncommon",
  Angular: "uncommon",
  Nub: "rare",
  // Patterns
  Marble: "common",
  Spotted: "uncommon",
  Tiger: "uncommon",
  Lined: "uncommon",
  Plain: "common",
  // Primary colors
  Crimson: "uncommon",
  Gold: "uncommon",
  Violet: "rare",
  Azure: "common",
  Emerald: "common",
  White: "rare",
  // Secondary colors
  Orange: "common",
  Rose: "uncommon",
  Teal: "common",
  Indigo: "uncommon",
  Silver: "rare",
  // Glow
  Normal: "common",
  Luminous: "uncommon",
  Radiant: "rare",
  Ultraviolet: "epic",
  // Size
  Leviathan: "epic",
  Giant: "rare",
  Medium: "common",
  Tiny: "uncommon",
  Dwarf: "rare",
  // Mutations (Tier 1)
  None: "common",
  Albino: "rare",
  Melanistic: "rare",
  Xanthic: "rare",
  "Twin-tail": "rare",
  Starfish: "rare",
  // Mutations (Tier 2)
  Iridescent: "epic",
  Bioluminescent: "epic",
  // Mutations (Tier 3)
  Crystalline: "legendary",
  Void: "legendary",
  Phoenix: "legendary"
};
const RARITY_DRAMA = {
  common: { delay: 400, shake: 0, particles: 0, sound: "soft", glow: false },
  uncommon: { delay: 600, shake: 0, particles: 3, sound: "chime", glow: true },
  rare: { delay: 800, shake: 2, particles: 8, sound: "impact", glow: true },
  epic: { delay: 1200, shake: 5, particles: 15, sound: "epic", glow: true },
  legendary: { delay: 1500, shake: 8, particles: 25, sound: "legend", glow: true }
};
const SPECIES_RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary"];
function createRevealSequence(fish) {
  var _a, _b, _c;
  const ph = fish.phenotype || {};
  const rarity = ((_a = fish.species) == null ? void 0 : _a.rarity) || "common";
  const rarityIdx = SPECIES_RARITY_ORDER.indexOf(rarity);
  const traits = [];
  if (ph.bodyShape) traits.push({
    label: "Body Shape",
    value: ph.bodyShape,
    rarity: TRAIT_RARITY[ph.bodyShape] || "common"
  });
  if (ph.primaryColor) traits.push({
    label: "Color",
    value: ph.primaryColor,
    rarity: TRAIT_RARITY[ph.primaryColor] || "common"
  });
  if (ph.pattern && ph.pattern !== "Plain") traits.push({
    label: "Pattern",
    value: ph.pattern,
    rarity: TRAIT_RARITY[ph.pattern] || "common"
  });
  if (ph.finType) traits.push({
    label: "Fin Type",
    value: ph.finType,
    rarity: TRAIT_RARITY[ph.finType] || "common"
  });
  if (ph.size && ph.size !== "Medium") traits.push({
    label: "Size",
    value: ph.size,
    rarity: TRAIT_RARITY[ph.size] || "common"
  });
  if (ph.glow && ph.glow !== "Normal") traits.push({
    label: "Glow",
    value: ph.glow,
    rarity: TRAIT_RARITY[ph.glow] || "uncommon"
  });
  if (ph.mutation && ph.mutation !== "None") traits.push({
    label: "Mutation",
    value: ph.mutation,
    rarity: TRAIT_RARITY[ph.mutation] || "rare"
  });
  traits.sort((a, b) => SPECIES_RARITY_ORDER.indexOf(a.rarity) - SPECIES_RARITY_ORDER.indexOf(b.rarity));
  const steps = traits.map((t, i) => ({
    ...t,
    drama: RARITY_DRAMA[t.rarity] || RARITY_DRAMA.common,
    index: i
  }));
  const finalReveal = {
    label: "Rarity",
    value: `${"★".repeat(rarityIdx + 1)} ${rarity.toUpperCase()}`,
    rarity,
    drama: RARITY_DRAMA[rarity] || RARITY_DRAMA.common,
    isFinal: true
  };
  return {
    fish,
    steps,
    finalReveal,
    totalDuration: steps.reduce((sum, s) => sum + s.drama.delay, 0) + (finalReveal.drama.delay || 1e3) + 2e3,
    estimatedValue: ((_b = fish.species) == null ? void 0 : _b.basePrice) || 50,
    speciesName: ((_c = fish.species) == null ? void 0 : _c.name) || "Unknown Species",
    legendaryCombo: checkLegendaryCombo(fish.phenotype),
    personality: fish.personality,
    parentIds: fish.parentIds || [],
    generation: fish.generation || 1
  };
}
const RARITY_COLORS = {
  common: "#aabbcc",
  uncommon: "#66ccff",
  rare: "#8a70a8",
  epic: "#d4a843",
  legendary: "#ff66aa"
};
function HatchReveal({ fish, onComplete }) {
  var _a, _b, _c;
  const [phase, setPhase] = reactExports.useState("egg");
  const [revealedTraits, setRevealedTraits] = reactExports.useState([]);
  const [showFinal, setShowFinal] = reactExports.useState(false);
  const [seq] = reactExports.useState(() => createRevealSequence(fish));
  const timerRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const timers = [];
    let t = 0;
    timers.push(setTimeout(() => setPhase("crack"), t += 800));
    timers.push(setTimeout(() => setPhase("reveal"), t += 1200));
    timers.push(setTimeout(() => setPhase("traits"), t += 600));
    for (let i = 0; i < seq.steps.length; i++) {
      const step = seq.steps[i];
      timers.push(setTimeout(() => {
        setRevealedTraits((prev) => [...prev, step]);
      }, t += step.drama.delay));
    }
    timers.push(setTimeout(() => {
      setShowFinal(true);
      setPhase("final");
    }, t += 800));
    timers.push(setTimeout(() => {
      setPhase("done");
    }, t += 2500));
    timerRef.current = timers;
    return () => timers.forEach(clearTimeout);
  }, []);
  if (phase === "done") {
    onComplete == null ? void 0 : onComplete();
    return null;
  }
  const rarityColor = RARITY_COLORS[(_a = fish.species) == null ? void 0 : _a.rarity] || "#aabbcc";
  const isHighRarity = ["rare", "epic", "legendary"].includes((_b = fish.species) == null ? void 0 : _b.rarity);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-overlay", onClick: () => {
    if (phase === "final") {
      setPhase("done");
    }
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `hatch-container hatch-phase--${phase}`, children: [
    (phase === "egg" || phase === "crack") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `hatch-egg ${phase === "crack" ? "hatch-egg--cracking" : "hatch-egg--wobble"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hatch-egg-emoji", children: "Egg" }),
      phase === "crack" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-crack-light" })
    ] }),
    (phase === "reveal" || phase === "traits" || phase === "final") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `hatch-fish-spotlight ${isHighRarity ? "hatch-fish-spotlight--rare" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-fish-sprite", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FishSprite$1, { fish, size: 96 }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-species-name", style: { color: rarityColor }, children: seq.speciesName }),
      phase === "traits" || phase === "final" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-traits", children: revealedTraits.map((trait, i) => {
        const color = RARITY_COLORS[trait.rarity] || "#aabbcc";
        const isRare = ["rare", "epic", "legendary"].includes(trait.rarity);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `hatch-trait ${isRare ? "hatch-trait--rare" : ""}`,
            style: { "--trait-color": color, animationDelay: `${i * 0.05}s` },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hatch-trait-label", children: [
                trait.label,
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hatch-trait-value", style: { color }, children: trait.value })
            ]
          },
          i
        );
      }) }) : null,
      showFinal && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `hatch-final hatch-final--${((_c = fish.species) == null ? void 0 : _c.rarity) || "common"}`,
          style: { color: rarityColor },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-final-stars", children: seq.finalReveal.value }),
            seq.legendaryCombo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hatch-legendary-combo", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hatch-legendary-emoji", children: seq.legendaryCombo.emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hatch-legendary-name", children: seq.legendaryCombo.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hatch-legendary-desc", children: seq.legendaryCombo.desc })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hatch-final-value", children: [
              "Est. Value: 🪙 ",
              seq.legendaryCombo ? seq.estimatedValue * seq.legendaryCombo.priceBonus : seq.estimatedValue
            ] }),
            seq.generation > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hatch-final-gen", children: [
              "Generation ",
              seq.generation,
              " • ",
              PERSONALITY_EMOJI[seq.personality] || "",
              " ",
              seq.personality
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-tap-hint", children: "Tap to continue" })
          ]
        }
      )
    ] }),
    isHighRarity && phase === "final" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hatch-particles", children: Array.from({ length: 20 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "hatch-particle",
        style: {
          "--px": `${Math.random() * 100}%`,
          "--py": `${Math.random() * 100}%`,
          "--delay": `${Math.random() * 1.5}s`,
          "--color": rarityColor
        }
      },
      i
    )) })
  ] }) });
}
function WantedBoard() {
  const posters = useGameStore((s) => s.wantedPosters || []);
  const fish = useGameStore((s) => s.fish);
  const fulfillWanted = useGameStore((s) => s.fulfillWanted);
  const gameClock = useGameStore((s) => s.gameClock || Date.now());
  const activePosters = posters.filter((p) => !p.fulfilled && p.expiresAt > gameClock);
  if (activePosters.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-board", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "wanted-title section-title", children: "Wanted Board" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wanted-empty", children: "No active bounties. New ones appear as you level up!" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-board", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "wanted-title section-title", children: "Wanted Board" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wanted-posters", children: activePosters.map((poster) => {
      var _a;
      const matchingFish = fish.filter((f) => fishMatchesPoster(f, poster));
      const hoursLeft = Math.max(0, Math.ceil((poster.expiresAt - gameClock) / 36e5));
      const urgent = hoursLeft <= 1;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `wanted-poster ${urgent ? "wanted-poster--urgent" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-poster-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "wanted-poster-buyer", children: poster.buyer }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `wanted-poster-timer ${urgent ? "wanted-poster-timer--urgent" : ""}`, children: [
            "⏳ ",
            hoursLeft,
            "h left"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-poster-wants", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "wanted-poster-label", children: "WANTED:" }),
          Object.entries(poster.traits).map(([trait, value]) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "wanted-trait-tag", children: value }, trait))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-poster-reward", children: [
          "Reward: ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "wanted-reward-amount", children: [
            "🪙 ",
            poster.reward
          ] })
        ] }),
        matchingFish.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "wanted-poster-matches", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "wanted-match-label", children: [
            matchingFish.length,
            " match",
            matchingFish.length > 1 ? "es" : "",
            "!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn btn-primary btn-sm",
              onClick: () => fulfillWanted(poster.id, matchingFish[0].id),
              children: [
                "Deliver ",
                ((_a = matchingFish[0].species) == null ? void 0 : _a.name) || "Fish",
                " → 🪙",
                poster.reward
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "wanted-poster-hint", children: "Breed a fish with these traits to claim the bounty" })
      ] }, poster.id);
    }) })
  ] });
}
class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    var _a;
    console.error(`[TabError:${this.props.name || "unknown"}]`, error, (_a = info.componentStack) == null ? void 0 : _a.slice(0, 300));
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        padding: "2rem",
        textAlign: "center",
        color: "#a0b8d8",
        fontFamily: "Nunito, sans-serif"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "2rem", marginBottom: "0.5rem" }, children: "Error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { fontSize: "0.85rem", marginBottom: "1rem" }, children: "This tab encountered an error. Your save is safe." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => this.setState({ hasError: false, error: null }),
            style: {
              padding: "6px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(64,200,240,0.3)",
              background: "rgba(64,200,240,0.1)",
              color: "#40c8f0",
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 600
            },
            children: "Retry"
          }
        )
      ] });
    }
    return this.props.children;
  }
}
const RARITY_CONFIG = {
  common: { bg: "discovery-bg--common", stars: "★", color: "#6a7a88" },
  uncommon: { bg: "discovery-bg--uncommon", stars: "★★", color: "#5aaa70" },
  rare: { bg: "discovery-bg--rare", stars: "★★★", color: "#5a8aaa" },
  epic: { bg: "discovery-bg--epic", stars: "★★★★", color: "#8a70a8" },
  legendary: { bg: "discovery-bg--legendary", stars: "★★★★★", color: "#d4a843" }
};
function DiscoveryCeremony({ species, onDismiss }) {
  var _a;
  const [phase, setPhase] = reactExports.useState("enter");
  const timerRef = reactExports.useRef(null);
  const config = RARITY_CONFIG[species == null ? void 0 : species.rarity] || RARITY_CONFIG.common;
  reactExports.useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 400);
    const t2 = setTimeout(() => setPhase("exit"), 4e3);
    const t3 = setTimeout(() => onDismiss == null ? void 0 : onDismiss(), 4500);
    timerRef.current = [t1, t2, t3];
    return () => timerRef.current.forEach(clearTimeout);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `discovery-ceremony discovery-phase--${phase} ${config.bg}`,
      onClick: () => {
        setPhase("exit");
        setTimeout(() => onDismiss == null ? void 0 : onDismiss(), 500);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-spotlight" }),
        ["rare", "epic", "legendary"].includes(species == null ? void 0 : species.rarity) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-confetti", children: Array.from({ length: species.rarity === "legendary" ? 30 : 15 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "discovery-confetti-piece",
            style: {
              "--cx": `${10 + Math.random() * 80}%`,
              "--cd": `${0.5 + Math.random() * 1.5}s`,
              "--cr": `${Math.random() * 360}deg`,
              "--cc": ["#c44040", "#5a9aaa", "#d4a843", "#5aaa70", "#8a70a8", "#b07848"][i % 6]
            }
          },
          i
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "discovery-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-banner", children: "NEW SPECIES!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-fish-display", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            FishSprite$1,
            {
              fish: {
                id: "discovery-preview",
                stage: "adult",
                species: { name: species == null ? void 0 : species.name, rarity: species == null ? void 0 : species.rarity, key: species == null ? void 0 : species.key, visualType: species == null ? void 0 : species.visualType },
                phenotype: (species == null ? void 0 : species.phenotype) || { primaryColor: "Azure", bodyShape: "Round", finType: "Standard", pattern: "Solid", glow: "None", size: "Normal", mutation: "None" }
              },
              size: 100,
              flipped: false,
              selected: false
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-name", style: { color: config.color }, children: (species == null ? void 0 : species.name) || "Unknown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-stars", style: { color: config.color }, children: config.stars }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-rarity", children: (_a = species == null ? void 0 : species.rarity) == null ? void 0 : _a.toUpperCase() }),
          (species == null ? void 0 : species.basePrice) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "discovery-value", children: [
            "Base Value: ",
            species.basePrice
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "discovery-tap-hint", children: "tap to continue" })
      ]
    }
  );
}
function BriefingModal({ level, onStart, onBack }) {
  if (!level) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "briefing-overlay", onClick: onBack, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "briefing-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "briefing-header", children: level.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "briefing-desc", children: level.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "briefing-text", children: level.briefing.split("\n").map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: p }, i)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "briefing-objectives", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "briefing-obj-title", children: "OBJECTIVES" }),
      level.objectives.map((obj) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "briefing-obj-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "briefing-obj-dot", children: "○" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: obj.label })
      ] }, obj.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "briefing-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn briefing-btn briefing-btn--start", onClick: onStart, children: "Start Level" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn briefing-btn", onClick: onBack, children: "Back" })
    ] })
  ] }) });
}
function CampaignMap({ onStartLevel, onBack }) {
  const completedLevels = useGameStore((s) => {
    var _a;
    return ((_a = s.campaign) == null ? void 0 : _a.completedLevels) || {};
  });
  const [selectedLevel, setSelectedLevel] = reactExports.useState(null);
  const isUnlocked = (level) => {
    var _a, _b;
    if (level.unlocked) return true;
    return ((_a = completedLevels[level.id]) == null ? void 0 : _a.unlocked) || ((_b = completedLevels[level.id]) == null ? void 0 : _b.stars) > 0;
  };
  const getStars = (levelId) => {
    var _a;
    return ((_a = completedLevels[levelId]) == null ? void 0 : _a.stars) || 0;
  };
  const handleLevelClick = (level) => {
    if (!isUnlocked(level)) return;
    setSelectedLevel(level);
  };
  const handleStart = () => {
    if (selectedLevel) {
      onStartLevel(selectedLevel.id);
      setSelectedLevel(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-map", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "campaign-map-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn campaign-back-btn", onClick: onBack, children: "Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "campaign-title", children: "CAMPAIGN" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-subtitle", children: "Complete objectives to unlock new levels" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-path", children: CAMPAIGN_LEVELS.map((level, i) => {
      const unlocked = isUnlocked(level);
      const stars = getStars(level.id);
      const completed = stars > 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(React.Fragment, { children: [
        i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `campaign-connector ${completed || unlocked ? "campaign-connector--active" : ""}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: `campaign-node ${unlocked ? "campaign-node--unlocked" : "campaign-node--locked"} ${completed ? "campaign-node--completed" : ""}`,
            onClick: () => handleLevelClick(level),
            disabled: !unlocked,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-node-number", children: i + 1 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-node-stars", children: [1, 2, 3].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `campaign-star ${s <= stars ? "campaign-star--earned" : ""}`, children: "★" }, s)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-node-name", children: level.name }),
              !unlocked && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "campaign-node-lock", children: "LOCKED" })
            ]
          }
        )
      ] }, level.id);
    }) }),
    selectedLevel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      BriefingModal,
      {
        level: selectedLevel,
        onStart: handleStart,
        onBack: () => setSelectedLevel(null)
      }
    )
  ] });
}
function ObjectiveBar() {
  const campaign = useGameStore((s) => s.campaign);
  useGameStore((s) => {
    var _a;
    return (_a = s.player) == null ? void 0 : _a.stats;
  });
  useGameStore((s) => {
    var _a, _b;
    return (_b = (_a = s.player) == null ? void 0 : _a.fishdex) == null ? void 0 : _b.length;
  });
  useGameStore((s) => {
    var _a;
    return (_a = s.fish) == null ? void 0 : _a.length;
  });
  useGameStore((s) => {
    var _a;
    return (_a = s.player) == null ? void 0 : _a.level;
  });
  useGameStore((s) => {
    var _a;
    return (_a = s.player) == null ? void 0 : _a.totalCoinsEarned;
  });
  const [elapsed, setElapsed] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if ((campaign == null ? void 0 : campaign.mode) !== "campaign" || !campaign.levelStartedAt) return;
    const tick = () => setElapsed(Math.floor((Date.now() - campaign.levelStartedAt) / 1e3));
    tick();
    const id = setInterval(tick, 1e3);
    return () => clearInterval(id);
  }, [campaign == null ? void 0 : campaign.levelStartedAt, campaign == null ? void 0 : campaign.mode]);
  if ((campaign == null ? void 0 : campaign.mode) !== "campaign" || !campaign.activeLevelId) return null;
  const level = getLevelById(campaign.activeLevelId);
  if (!level) return null;
  const state = useGameStore.getState();
  const min = Math.floor(elapsed / 60);
  const sec = elapsed % 60;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "objective-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "obj-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "obj-level-name", children: level.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "obj-timer", children: [
        min,
        ":",
        sec.toString().padStart(2, "0")
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "obj-list", children: level.objectives.map((obj) => {
      const done = checkObjective(obj, state);
      const prog = getObjectiveProgress(obj, state);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `obj-row ${done ? "obj-row--done" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "obj-check", children: done ? "✓" : "○" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "obj-label", children: obj.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "obj-progress", children: [
          prog.current,
          "/",
          prog.target
        ] })
      ] }, obj.id);
    }) })
  ] });
}
function VictoryModal({ levelId, onContinue }) {
  var _a, _b;
  reactExports.useEffect(() => {
    playVictory();
  }, []);
  const level = getLevelById(levelId);
  const state = useGameStore.getState();
  const stars = level ? getStarRating(level, state) : 0;
  const complete = useGameStore((s) => s.completeCampaignLevel);
  const nextLevelId = (_b = (_a = level == null ? void 0 : level.rewards) == null ? void 0 : _a.unlocks) == null ? void 0 : _b[0];
  const nextLevel = nextLevelId ? getLevelById(nextLevelId) : null;
  const handleContinue = () => {
    complete();
    onContinue(nextLevelId);
  };
  if (!level) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "victory-overlay", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "victory-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "victory-banner", children: "LEVEL COMPLETE" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "victory-level-name", children: level.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "victory-stars", children: [1, 2, 3].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `victory-star ${s <= stars ? "victory-star--earned" : ""}`, children: "★" }, s)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "victory-actions", children: [
      nextLevel && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn victory-btn victory-btn--next", onClick: handleContinue, children: [
        "Next: ",
        nextLevel.name
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn victory-btn", onClick: () => {
        complete();
        onContinue(null);
      }, children: "Campaign Map" })
    ] })
  ] }) });
}
const AMENITIES = [
  {
    id: "giftShop",
    name: "Gift Shop",
    desc: "Sells merchandise themed to your rarest species. Income scales with rarity diversity.",
    unlockCost: 500,
    icon: "SHOP",
    incomeDesc: "Earns (3 + 2×level) × rarity tiers per minute"
  },
  {
    id: "cafe",
    name: "Café",
    desc: "Visitors grab drinks and snacks. Income scales with average tank happiness.",
    unlockCost: 750,
    icon: "CAFE",
    incomeDesc: "Earns (2 + 2×level) × (happiness/50) per minute"
  }
];
const UPGRADE_COSTS = [0, 400, 1e3, 2500, 6e3];
function AmenitiesPanel() {
  const coins2 = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.coins) || 0;
  });
  const giftShop = useGameStore((s) => s.giftShop);
  const cafe = useGameStore((s) => s.cafe);
  const unlockAmenity = useGameStore((s) => s.unlockAmenity);
  const upgradeAmenity = useGameStore((s) => s.upgradeAmenity);
  const getState = (id) => id === "giftShop" ? giftShop : cafe;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amenities-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amenities-title", children: "AMENITIES" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amenities-subtitle", children: "Build facilities that generate passive income" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amenities-grid", children: AMENITIES.map((a) => {
      const state = getState(a.id);
      const unlocked = state == null ? void 0 : state.unlocked;
      const level = (state == null ? void 0 : state.level) || 0;
      const totalEarned = (state == null ? void 0 : state.totalEarned) || 0;
      const nextCost = level < 4 ? UPGRADE_COSTS[level + 1] : null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `amenity-card ${unlocked ? "amenity-card--active" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amenity-card-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amenity-card-icon", children: a.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amenity-card-name", children: a.name }),
          unlocked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "amenity-card-level", children: [
            "LV.",
            level + 1
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amenity-card-desc", children: a.desc }),
        unlocked ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "amenity-card-stats", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "amenity-stat", children: [
              "Total earned: ",
              totalEarned.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "amenity-stat amenity-stat--income", children: a.incomeDesc })
          ] }),
          nextCost !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn amenity-upgrade-btn",
              onClick: () => upgradeAmenity(a.id),
              disabled: coins2 < nextCost,
              children: [
                "Upgrade (",
                nextCost,
                ")"
              ]
            }
          ),
          nextCost === null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "amenity-maxed", children: "MAX LEVEL" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn amenity-unlock-btn",
            onClick: () => unlockAmenity(a.id),
            disabled: coins2 < a.unlockCost,
            children: [
              "Build (",
              a.unlockCost,
              ")"
            ]
          }
        )
      ] }, a.id);
    }) })
  ] });
}
function NotificationCenter() {
  const notifications = useGameStore((s) => s.notifications || []);
  const dismissNotif = useGameStore((s) => s.dismissNotification);
  if (notifications.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "notif-center", children: notifications.slice(0, 5).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `notif-item notif-item--${n.type || "info"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "notif-item-msg", children: n.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "notif-dismiss", onClick: () => dismissNotif(n.id), children: "x" })
  ] }, n.id)) });
}
function EquipmentPanel({ tankId }) {
  const tank = useGameStore((s) => {
    var _a;
    return (_a = s.tanks) == null ? void 0 : _a.find((t) => t.id === tankId);
  });
  const coins2 = useGameStore((s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.coins) || 0;
  });
  const buyEquipment = useGameStore((s) => s.buyEquipment);
  const repairEquipment = useGameStore((s) => s.repairEquipment);
  if (!tank) return null;
  const equipment = tank.equipment || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "equipment-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "equip-title", children: [
      "EQUIPMENT — ",
      tank.name
    ] }),
    equipment.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "equip-installed", children: equipment.map((eq) => {
      const type = EQUIPMENT_TYPES[eq.typeId];
      if (!type) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `equip-item ${eq.broken ? "equip-item--broken" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "equip-item-name", children: type.label }),
        eq.broken ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn equip-repair-btn",
            onClick: () => repairEquipment(tankId, eq.id),
            disabled: coins2 < type.repairCost,
            children: [
              "Repair (",
              type.repairCost,
              ")"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "equip-item-status", children: "Active" })
      ] }, eq.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "equip-shop", children: Object.values(EQUIPMENT_TYPES).map((type) => {
      const owned = equipment.filter((e) => e.typeId === type.id).length;
      const maxed = owned >= type.maxPerTank;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn equip-buy-btn",
          onClick: () => buyEquipment(tankId, type.id),
          disabled: maxed || coins2 < type.cost,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "equip-buy-name", children: [
              type.label,
              " (",
              type.cost,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "equip-buy-desc", children: type.desc }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "equip-buy-count", children: [
              owned,
              "/",
              type.maxPerTank
            ] })
          ]
        },
        type.id
      );
    }) })
  ] });
}
const MENTOR_HINTS = [
  { id: "hint_welcome", trigger: (s) => {
    var _a, _b;
    return !((_a = s.player) == null ? void 0 : _a.tutorialDone) && (((_b = s.player) == null ? void 0 : _b.tutorialStep) || 0) === 0;
  }, message: "Hey there! I'm Marina, your aquarium advisor. I'll pop up with tips as you learn the ropes.", priority: 0 },
  { id: "hint_low_food", trigger: (s) => {
    var _a;
    return (_a = s.tanks) == null ? void 0 : _a.some((t) => {
      var _a2;
      return (((_a2 = t.supplies) == null ? void 0 : _a2.food) || 0) < 3;
    });
  }, message: "Running low on fish food! Head to Market → Supplies before your fish go hungry.", priority: 2 },
  { id: "hint_can_breed", trigger: (s) => {
    var _a, _b, _c;
    return ((_a = s.fish) == null ? void 0 : _a.filter((f) => f.stage === "adult").length) >= 2 && !(((_c = (_b = s.player) == null ? void 0 : _b.stats) == null ? void 0 : _c.breedingsStarted) || 0);
  }, message: "You have two adults — try pairing them in the Breeding Lab to discover new species!", priority: 1 },
  { id: "hint_can_upgrade", trigger: (s) => {
    var _a, _b;
    return ((_a = s.player) == null ? void 0 : _a.coins) >= 300 && ((_b = s.tanks) == null ? void 0 : _b.length) === 1;
  }, message: "You've saved up some coins! Consider unlocking a second tank or upgrading your current one.", priority: 1 },
  { id: "hint_hire_staff", trigger: (s) => {
    var _a;
    return ((_a = s.player) == null ? void 0 : _a.level) >= 2 && (!s.staff || s.staff.length === 0);
  }, message: "Tired of manual feeding? Hire a Caretaker in Office → Staff to automate the basics.", priority: 1 },
  { id: "hint_research", trigger: (s) => {
    var _a, _b;
    return ((_a = s.player) == null ? void 0 : _a.coins) >= 500 && !Object.values(((_b = s.player) == null ? void 0 : _b.research) || {}).some((v) => v > 0);
  }, message: "Check out the Research Lab in the Office! Permanent upgrades that make everything easier.", priority: 1 },
  { id: "hint_supplier", trigger: (s) => {
    var _a, _b, _c;
    return (((_a = s.shop) == null ? void 0 : _a.reputation) || 0) >= 10 && ((_c = (_b = s.suppliers) == null ? void 0 : _b.unlocked) == null ? void 0 : _c.length) <= 1;
  }, message: "Your reputation unlocked a new supplier! Check the Fish tab in Market for new species.", priority: 2 },
  { id: "hint_equipment", trigger: (s) => {
    var _a, _b;
    return ((_a = s.player) == null ? void 0 : _a.level) >= 3 && !((_b = s.tanks) == null ? void 0 : _b.some((t) => (t.equipment || []).length > 0));
  }, message: "Have you tried installing equipment? Filters and aerators in Market keep your tanks healthier.", priority: 1 },
  { id: "hint_gift_shop", trigger: (s) => {
    var _a, _b;
    return ((_a = s.player) == null ? void 0 : _a.coins) >= 500 && !((_b = s.giftShop) == null ? void 0 : _b.unlocked);
  }, message: "Build a Gift Shop from Market → Amenities for steady passive income!", priority: 1 }
];
function Mentor() {
  const [dismissed, setDismissed] = reactExports.useState({});
  const [activeHint, setActiveHint] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const check = () => {
      var _a;
      const state = useGameStore.getState();
      const mentorFlags = ((_a = state.player) == null ? void 0 : _a.mentorFlags) || {};
      for (const hint of MENTOR_HINTS) {
        if (mentorFlags[hint.id] || dismissed[hint.id]) continue;
        try {
          if (hint.trigger(state)) {
            setActiveHint(hint);
            return;
          }
        } catch {
        }
      }
      setActiveHint(null);
    };
    check();
    const id = setInterval(check, 5e3);
    return () => clearInterval(id);
  }, [dismissed]);
  const handleDismiss = () => {
    if (!activeHint) return;
    setDismissed((d) => ({ ...d, [activeHint.id]: true }));
    useGameStore.setState((state) => {
      if (!state.player.mentorFlags) state.player.mentorFlags = {};
      state.player.mentorFlags[activeHint.id] = true;
    });
    setActiveHint(null);
  };
  if (!activeHint) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mentor-bubble", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mentor-avatar", children: "M" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mentor-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mentor-name", children: "Marina" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mentor-msg", children: activeHint.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mentor-dismiss", onClick: handleDismiss, children: "Got it" })
  ] });
}
const Icons = {
  aquarium: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "2", y: "3", width: "14", height: "11", rx: "2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M5 10c1-2 3 0 4-2s2 1 4-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "16", x2: "16", y2: "16" })
  ] }),
  market: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M3 7V15h12V7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M1 7l8-5 8 5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "7", y: "11", width: "4", height: "4" })
  ] }),
  breeding: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 2c-2 3-5 4-5 7a5 5 0 0 0 10 0c0-3-3-4-5-7z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M7 11c0 1.1.9 2 2 2s2-.9 2-2" })
  ] }),
  records: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M4 2h8l3 3v11H4z" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "7", x2: "12", y2: "7" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "10", x2: "12", y2: "10" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "13", x2: "10", y2: "13" })
  ] }),
  office: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "2", width: "12", height: "14", rx: "1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "3", y1: "6", x2: "15", y2: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "7", y1: "2", x2: "7", y2: "6" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "9", x2: "12", y2: "9" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "12", x2: "10", y2: "12" })
  ] }),
  settings: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: "0 0 18 18", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9", cy: "9", r: "2.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.1 3.1l1.4 1.4M13.5 13.5l1.4 1.4M3.1 14.9l1.4-1.4M13.5 4.5l1.4-1.4" })
  ] })
};
const NAV_SECTIONS = [
  { id: "aquarium", label: "Aquarium", key: "1" },
  { id: "market", label: "Market", key: "2" },
  { id: "breeding", label: "Breeding", key: "3" },
  { id: "records", label: "Records", key: "4" },
  { id: "office", label: "Office", key: "5" }
];
function NavRail({ active, onNavigate, badges = {}, disabledSections = {} }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "nav-rail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-rail-brand", children: "FT2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-rail-items", children: NAV_SECTIONS.map(({ id, label, key }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: `nav-rail-btn${active === id ? " nav-rail-btn--active" : ""}${disabledSections[id] ? " nav-rail-btn--disabled" : ""}`,
        onClick: () => onNavigate(id),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-key", children: key }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-icon", children: Icons[id] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-label", children: label }),
          badges[id] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-badge", children: badges[id] })
        ]
      },
      id
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "nav-rail-footer", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "nav-rail-btn nav-rail-btn--settings",
          onClick: () => onNavigate("settings"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-icon", children: Icons.settings }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nav-rail-label", children: "Settings" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "nav-rail-version", children: "v0.10.0" })
    ] })
  ] });
}
const NAV_TO_TABS = {
  aquarium: ["tank"],
  market: ["shop"],
  breeding: ["breed"],
  records: ["fishdex", "achieve", "magic", "stats"],
  office: ["challenges", "decor", "autopsy"]
};
function GameStatusBar({ paused, onTogglePause, showLog, onToggleLog }) {
  var _a;
  const fish = useGameStore((s) => s.fish);
  const coins2 = useGameStore((s) => {
    var _a2;
    return ((_a2 = s.player) == null ? void 0 : _a2.coins) || 0;
  });
  const level = useGameStore((s) => {
    var _a2;
    return ((_a2 = s.player) == null ? void 0 : _a2.level) || 1;
  });
  const saveFlash = useGameStore((s) => s._saveFlash);
  const gameSpeed = useGameStore((s) => s.gameSpeed || 1);
  const setGameSpeed = useGameStore((s) => s.setGameSpeed);
  const gameClock = useGameStore((s) => s.gameClock || Date.now());
  const day = useGameStore((s) => {
    var _a2, _b;
    const created = ((_a2 = s.player) == null ? void 0 : _a2.createdAt) || ((_b = s.player) == null ? void 0 : _b.firstPlayedAt);
    const gc = s.gameClock || Date.now();
    if (!created) return 1;
    return Math.max(1, Math.floor((gc - created) / 864e5) + 1);
  });
  const gameDate = new Date(gameClock);
  const clock = gameDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const [showSaved, setShowSaved] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!saveFlash) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2e3);
    return () => clearTimeout(t);
  }, [saveFlash]);
  const seasonalEvent = useGameStore((s) => s.activeSeasonalEvent);
  const visitors = useGameStore((s) => s.visitors);
  const alive = (fish == null ? void 0 : fish.length) || 0;
  const sick = ((_a = fish == null ? void 0 : fish.filter((f) => f.disease)) == null ? void 0 : _a.length) || 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-status-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", children: [
      "DAY ",
      day
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-item", children: clock }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", children: [
      "LV.",
      level
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", children: [
      alive,
      " FISH",
      sick > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-sick", children: [
        " (",
        sick,
        " SICK)"
      ] }) : ""
    ] }),
    (visitors == null ? void 0 : visitors.current) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-item", title: `${visitors.perMin}/min — ${visitors.satisfaction}% satisfaction`, children: [
        visitors.current,
        " VISITORS"
      ] })
    ] }),
    seasonalEvent && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-item status-item--seasonal", title: seasonalEvent.desc, children: seasonalEvent.name })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-spacer" }),
    showSaved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-saved", children: "SAVED" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `speed-btn ${showLog ? "speed-btn--active" : ""}`,
        onClick: onToggleLog,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Toggle Log [L]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LOG" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "speed-controls", children: [1, 2, 3].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `speed-btn speed-btn--speed ${gameSpeed === s ? "speed-btn--active" : ""}`,
        onClick: () => setGameSpeed(s),
        "aria-label": `${s}x speed`,
        children: "▸".repeat(s)
      },
      s
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: `speed-btn ${paused ? "speed-btn--active" : ""}`,
        onClick: onTogglePause,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tip, { text: "Pause [Space]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: paused ? "II" : "▸" }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-separator" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-item status-item--coins", children: coins2.toLocaleString() })
  ] });
}
function useFishSelection() {
  const fish = useGameStore((s) => s.fish);
  const tanks = useGameStore((s) => s.tanks);
  const fishdex = useGameStore((s) => s.player.fishdex || []);
  const listedFish = useGameStore((s) => s.shop.listedFish);
  const [selectedFishId, setSelectedFishId] = reactExports.useState(null);
  const [activeTankId, setActiveTankId] = reactExports.useState(() => {
    var _a;
    return ((_a = tanks[0]) == null ? void 0 : _a.id) ?? "tank_0";
  });
  const [generatingLoreFor, setGeneratingLoreFor] = reactExports.useState(null);
  const [aiError, setAiError] = reactExports.useState(null);
  const [showWinModal, setShowWinModal] = reactExports.useState(false);
  reactExports.useEffect(() => {
    var _a;
    if (!tanks.find((t) => t.id === activeTankId)) {
      setActiveTankId(((_a = tanks[0]) == null ? void 0 : _a.id) ?? "tank_0");
    }
  }, [tanks, activeTankId]);
  const updateFishdexEntry = reactExports.useCallback((speciesName, updates) => {
    useGameStore.setState((state) => {
      state.player.fishdex = (state.player.fishdex || []).map(
        (e) => e.name === speciesName ? { ...e, ...updates } : e
      );
    });
  }, []);
  const speciesNameKey = reactExports.useMemo(
    () => [...new Set(fish.map((f) => {
      var _a;
      return (_a = f.species) == null ? void 0 : _a.name;
    }).filter(Boolean))].sort().join(","),
    [fish]
  );
  reactExports.useEffect(() => {
    const knownNames = new Set(fishdex.map((e) => e.name));
    const newEntries = [];
    for (const f of fish) {
      if (!f.species || knownNames.has(f.species.name)) continue;
      const realSpec = f.species.visualType === "species" && f.species.key ? REAL_SPECIES_MAP[f.species.key] : null;
      newEntries.push({
        name: f.species.name,
        rarity: f.species.rarity,
        basePrice: f.species.basePrice,
        phenotype: f.phenotype,
        firstDiscoveredAt: Date.now(),
        aiName: null,
        aiLore: null,
        colorVariant: f.colorVariant || null,
        ...realSpec && {
          visualType: "species",
          speciesKey: realSpec.key,
          scientificName: realSpec.scientificName,
          habitat: realSpec.habitat,
          funFact: realSpec.funFact,
          conservationStatus: realSpec.conservationStatus,
          lore: realSpec.lore
        }
      });
      knownNames.add(f.species.name);
    }
    if (newEntries.length === 0) return;
    useGameStore.setState((state) => {
      state.player.fishdex = [...state.player.fishdex || [], ...newEntries];
      for (const e of newEntries) {
        addLogDraft(state, `New species: ${e.name} (${e.rarity})`);
      }
      if (newEntries.length > 0) {
        state._pendingDiscovery = newEntries[0];
      }
      const afterChallenge = updateChallengeProgress(state, "discover");
      Object.assign(state, afterChallenge);
      const alreadyFound = new Set(state.player.magicFishFound || []);
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
        state.player.magicFishFound = [...state.player.magicFishFound || [], ...newMagic.map((m) => m.id)];
        state.player.coins += newMagic.reduce((s, m) => s + m.reward, 0);
        for (const mf of newMagic) {
          addLogDraft(state, `🔮 MAGIC FISH DISCOVERED: #${mf.number} ${mf.title}! +🪙${mf.reward} reward!`);
        }
        if (state.player.magicFishFound.length === 7) {
          setTimeout(() => setShowWinModal(true), 500);
        }
      }
    });
    for (const entry of newEntries) {
      playDiscoverScaled(entry.rarity);
      generateFishName(entry.phenotype, entry.rarity, entry.name).then((aiName) => {
        if (aiName) updateFishdexEntry(entry.name, { aiName });
      });
    }
  }, [speciesNameKey]);
  const handleGenerateLore = reactExports.useCallback(async (speciesName) => {
    const currentFishdex = useGameStore.getState().player.fishdex || [];
    const entry = currentFishdex.find((e) => e.name === speciesName);
    if (!entry || entry.aiLore) return;
    setGeneratingLoreFor(speciesName);
    setAiError(null);
    try {
      const nameForLore = entry.aiName || entry.name;
      const { text, error } = await generateFishLore(entry.phenotype, entry.rarity, nameForLore);
      if (error) setAiError(error);
      else if (text) updateFishdexEntry(speciesName, { aiLore: text });
    } finally {
      setGeneratingLoreFor(null);
    }
  }, [updateFishdexEntry]);
  const activeTank = reactExports.useMemo(
    () => tanks.find((t) => t.id === activeTankId) || tanks[0],
    [tanks, activeTankId]
  );
  const tankFish = reactExports.useMemo(
    () => fish.filter((f) => f.tankId === (activeTank == null ? void 0 : activeTank.id)),
    [fish, activeTank == null ? void 0 : activeTank.id]
  );
  const selectedFish = reactExports.useMemo(
    () => fish.find((f) => f.id === selectedFishId) || null,
    [fish, selectedFishId]
  );
  const isListed = reactExports.useMemo(
    () => selectedFish ? listedFish.includes(selectedFish.id) : false,
    [selectedFish, listedFish]
  );
  return {
    selectedFishId,
    setSelectedFishId,
    activeTankId,
    setActiveTankId,
    activeTank,
    tankFish,
    selectedFish,
    isListed,
    showWinModal,
    setShowWinModal,
    generatingLoreFor,
    aiError,
    setAiError,
    handleGenerateLore
  };
}
function useCoinDeltas() {
  const coins2 = useGameStore((s) => s.player.coins);
  const [deltas, setDeltas] = reactExports.useState([]);
  const counter = reactExports.useRef(0);
  const prevCoins = reactExports.useRef(coins2);
  reactExports.useEffect(() => {
    const diff = coins2 - prevCoins.current;
    prevCoins.current = coins2;
    if (diff === 0) return;
    const abs = Math.abs(diff);
    const tier = abs >= 500 ? "mega" : abs >= 100 ? "big" : abs >= 20 ? "mid" : "small";
    const id = ++counter.current;
    setDeltas((prev) => [...prev.slice(-6), { id, diff, tier }]);
    const t = setTimeout(() => setDeltas((prev) => prev.filter((d) => d.id !== id)), 1800);
    return () => clearTimeout(t);
  }, [coins2]);
  return deltas;
}
const RecordsSection = reactExports.lazy(() => __vitePreload(() => import("./RecordsSection-BGV35fJ8.js"), true ? __vite__mapDeps([27,1,28]) : void 0));
const OfficeSection = reactExports.lazy(() => __vitePreload(() => import("./OfficeSection-CRt1PuCw.js"), true ? __vite__mapDeps([29,1,28]) : void 0));
const MemoTankView = reactExports.memo(TankView);
const MemoFishPanel = FishPanel$1;
const MemoHUD = reactExports.memo(HUD);
const MemoLogPanel = reactExports.memo(LogPanel);
const MemoShop = Shop$1;
const MemoBreedingLab = reactExports.memo(BreedingLab);
function App() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const [showTitle, setShowTitle] = reactExports.useState(true);
  const [showCampaignMap, setShowCampaignMap] = reactExports.useState(false);
  const [victoryLevelId, setVictoryLevelId] = reactExports.useState(null);
  const [levelFlash, setLevelFlash] = reactExports.useState(false);
  const prevLevelRef = reactExports.useRef(null);
  const player = useGameStore((s) => s.player);
  const fish = useGameStore((s) => s.fish);
  const tanks = useGameStore((s) => s.tanks);
  const shop = useGameStore((s) => s.shop);
  const breedingTank = useGameStore((s) => s.breedingTank);
  const extraBays = useGameStore((s) => s.extraBays || []);
  const maxBays = useGameStore((s) => s.maxBays || 1);
  const log = useGameStore((s) => s.log);
  const dailyChallenges = useGameStore((s) => s.dailyChallenges);
  const campaign = useGameStore((s) => s.campaign);
  const settings = useGameStore((s) => s.settings);
  const showOffline = useGameStore((s) => s.showOffline);
  const offlineSummary = useGameStore((s) => s.offlineSummary);
  const soundOn = useGameStore((s) => s.soundOn);
  const market = useGameStore((s) => s.market);
  const dismissOffline = useGameStore((s) => s.dismissOffline);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const feedFish = useGameStore((s) => s.feedFish);
  const useMedicine = useGameStore((s) => s.useMedicine);
  const moveFishToTank = useGameStore((s) => s.moveFishToTank);
  const treatWater = useGameStore((s) => s.treatWater);
  const toggleAutoFeed = useGameStore((s) => s.toggleAutoFeed);
  const useHeater = useGameStore((s) => s.useHeater);
  const unlockTank = useGameStore((s) => s.unlockTank);
  const renameTank = useGameStore((s) => s.renameTank);
  const toggleSellFish = useGameStore((s) => s.toggleSellFish);
  const setFishPrice = useGameStore((s) => s.setFishPrice);
  const buySupply = useGameStore((s) => s.buySupply);
  const buyFish = useGameStore((s) => s.buyFish);
  const buyUpgrade = useGameStore((s) => s.buyUpgrade);
  const buyRareMarketItem = useGameStore((s) => s.buyRareMarketItem);
  useGameStore((s) => s.buyDecoration);
  useGameStore((s) => s.claimUnlockedDecoration);
  useGameStore((s) => s.placeDecoration);
  useGameStore((s) => s.removeDecoration);
  useGameStore((s) => s.buyTheme);
  useGameStore((s) => s.applyTheme);
  const selectForBreeding = useGameStore((s) => s.selectForBreeding);
  const cancelBreeding = useGameStore((s) => s.cancelBreeding);
  const collectEgg = useGameStore((s) => s.collectEgg);
  const resetGame = useGameStore((s) => s.resetGame);
  const handleExportSave = useGameStore((s) => s.handleExportSave);
  useGameStore((s) => s.handleImportSave);
  const {
    selectedFishId,
    setSelectedFishId,
    setActiveTankId,
    activeTank,
    tankFish,
    selectedFish,
    isListed,
    showWinModal,
    setShowWinModal,
    generatingLoreFor,
    aiError,
    handleGenerateLore
  } = useFishSelection();
  const coinDeltas = useCoinDeltas();
  const [activeSection, setActiveSection] = reactExports.useState("aquarium");
  const [showApiSetup, setShowApiSetup] = reactExports.useState(false);
  const [showResetConfirm, setShowResetConfirm] = reactExports.useState(false);
  const [showCredits, setShowCredits] = reactExports.useState(false);
  const [showSettings, setShowSettings] = reactExports.useState(false);
  const [showGameMenu, setShowGameMenu] = reactExports.useState(false);
  const [showLogTray, setShowLogTray] = reactExports.useState(false);
  const [photoMode, setPhotoMode] = reactExports.useState(false);
  const [hatchRevealFish, setHatchRevealFish] = reactExports.useState(null);
  const [celebration, setCelebration] = reactExports.useState(null);
  const [discoverySpecies, setDiscoverySpecies] = reactExports.useState(null);
  useGameStore((s) => s._saveFlash);
  const paused = useGameStore((s) => s.paused);
  const togglePause = useGameStore((s) => s.togglePause);
  useGameStore((s) => s.renameFish);
  useGameStore((s) => s.performPrestige);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
      const key = e.key.toLowerCase();
      if (e.key === "F5") {
        e.preventDefault();
        useGameStore.getState().quickSave();
        return;
      }
      switch (key) {
        case "1":
          handleNavChange("aquarium");
          break;
        case "2":
          handleNavChange("market");
          break;
        case "3":
          handleNavChange("breeding");
          break;
        case "4":
          handleNavChange("records");
          break;
        case "5":
          handleNavChange("office");
          break;
        case "f":
          if (selectedFish) feedFish(selectedFish.id);
          break;
        case "a":
          if (activeTank) useGameStore.getState().feedAllInTank(activeTank.id);
          break;
        case "s":
          if ((selectedFish == null ? void 0 : selectedFish.stage) === "adult") toggleSellFish(selectedFish.id);
          break;
        case "m":
          if (selectedFish == null ? void 0 : selectedFish.disease) useMedicine(selectedFish.id);
          break;
        case "l":
          setShowLogTray((v) => !v);
          break;
        case ",": {
          const gs = useGameStore.getState();
          gs.setGameSpeed(Math.max(1, (gs.gameSpeed || 1) - 1));
          break;
        }
        case ".": {
          const gs = useGameStore.getState();
          gs.setGameSpeed(Math.min(3, (gs.gameSpeed || 1) + 1));
          break;
        }
        case "p":
          setPhotoMode((v) => !v);
          break;
        case " ":
          e.preventDefault();
          togglePause();
          break;
        case "escape":
          if (showSettings || showResetConfirm || showApiSetup) {
            setShowSettings(false);
            setShowResetConfirm(false);
            setShowApiSetup(false);
          } else if (showGameMenu) {
            setShowGameMenu(false);
            playClick();
          } else {
            setShowGameMenu(true);
            playClick();
          }
          break;
        case "tab": {
          e.preventDefault();
          const sections = ["aquarium", "market", "breeding", "records", "office"];
          const idx2 = sections.indexOf(activeSection);
          handleNavChange(sections[(idx2 + 1) % sections.length]);
          break;
        }
      }
    };
    const suppress = (e) => e.preventDefault();
    window.addEventListener("keydown", handler);
    window.addEventListener("contextmenu", suppress);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("contextmenu", suppress);
    };
  }, [selectedFish, activeTank, activeSection, tanks, showSettings, showResetConfirm, showApiSetup, showGameMenu, showLogTray]);
  reactExports.useEffect(() => {
    if (player._levelUpPending && player._levelUpPending !== prevLevelRef.current) {
      prevLevelRef.current = player._levelUpPending;
      setLevelFlash(true);
      const t = setTimeout(() => setLevelFlash(false), 1500);
      return () => clearTimeout(t);
    }
  }, [player._levelUpPending]);
  reactExports.useEffect(() => {
    const unsub = useGameStore.subscribe(
      (s) => s._pendingHatchReveal,
      (fish2) => {
        if (fish2) {
          setHatchRevealFish(fish2);
          useGameStore.setState({ _pendingHatchReveal: null });
        }
      }
    );
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = useGameStore.subscribe(
      (s) => s._pendingVictory,
      (levelId) => {
        if (levelId) {
          setVictoryLevelId(levelId);
        }
      }
    );
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = useGameStore.subscribe(
      (s) => s._pendingCelebration,
      (data) => {
        if (data) {
          setCelebration(data);
          useGameStore.setState({ _pendingCelebration: null });
          setTimeout(() => setCelebration(null), 5e3);
        }
      }
    );
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const unsub = useGameStore.subscribe(
      (s) => s._pendingDiscovery,
      (species) => {
        if (species) {
          setDiscoverySpecies(species);
          useGameStore.setState({ _pendingDiscovery: null });
        }
      }
    );
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    const start = () => {
      if (!isMusicPlaying()) startMusic();
      document.removeEventListener("click", start);
    };
    document.addEventListener("click", start);
    return () => document.removeEventListener("click", start);
  }, []);
  const currentFishdexCount = (player.fishdex || []).length;
  const currentShopFishCount = fish.filter((f) => f.stage === "adult").length;
  const newFishdexCount = Math.max(0, currentFishdexCount - (player.seenFishdexCount || 0));
  const newShopFishCount = Math.max(0, currentShopFishCount - (player.seenShopFishCount || 0));
  const currentAchCount = (player.achievements || []).length;
  const newAchCount = Math.max(0, currentAchCount - (player.seenAchCount || 0));
  const playTabSwitch$1 = playTabSwitch;
  const handleTabChange = reactExports.useCallback((tab) => {
    playTabSwitch$1();
    for (const [section, tabs] of Object.entries(NAV_TO_TABS)) {
      if (tabs.includes(tab)) {
        setActiveSection(section);
        break;
      }
    }
    if (tab === "fishdex") {
      useGameStore.setState((state) => {
        state.player.seenFishdexCount = (state.player.fishdex || []).length;
      });
    }
    if (tab === "shop") {
      useGameStore.setState((state) => {
        var _a2;
        state.player.seenShopFishCount = ((_a2 = state.fish) == null ? void 0 : _a2.filter((f) => f.stage === "adult").length) || 0;
      });
    }
    if (tab === "achieve") {
      useGameStore.setState((state) => {
        state.player.seenAchCount = (state.player.achievements || []).length;
      });
    }
  }, []);
  const handleNavChange = reactExports.useCallback((section) => {
    var _a2;
    if (section === "settings") {
      setShowSettings(true);
      return;
    }
    setActiveSection(section);
    const defaultTab = ((_a2 = NAV_TO_TABS[section]) == null ? void 0 : _a2[0]) || "tank";
    handleTabChange(defaultTab);
  }, [handleTabChange]);
  (player.magicFishFound || []).length;
  (player.autopsies || []).length;
  const challengeDone = ((dailyChallenges == null ? void 0 : dailyChallenges.challenges) || []).filter((c) => c.completed).length;
  const tutorialStep = player.tutorialStep ?? 0;
  const tutorialDone = player.tutorialDone;
  !tutorialDone && ((_a = TUTORIAL_STEPS[tutorialStep]) == null ? void 0 : _a.highlight) || null;
  const challengeTotal = ((dailyChallenges == null ? void 0 : dailyChallenges.challenges) || []).length;
  const suppliers = useGameStore((s) => s.suppliers);
  const game = reactExports.useMemo(
    () => ({ player, fish, tanks, shop, breedingTank, log, dailyChallenges, offlineSummary, market, suppliers }),
    [player, fish, tanks, shop, breedingTank, log, dailyChallenges, offlineSummary, market, suppliers]
  );
  const [showSplash, setShowSplash] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(t);
  }, [showSplash]);
  if (showSplash) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-splash", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "loading-splash-inner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-splash-title", children: "FISH TYCOON 2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-splash-bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-splash-fill" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-splash-sub", children: "Loading" })
    ] }) });
  }
  if (showTitle) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(TitleScreen, { onStart: (mode) => {
      var _a2;
      if (mode === "campaign") {
        setShowTitle(false);
        setShowCampaignMap(true);
        return;
      }
      if (mode === "sandbox") {
        const prevCompleted = ((_a2 = useGameStore.getState().campaign) == null ? void 0 : _a2.completedLevels) || {};
        useGameStore.getState().resetGame();
        useGameStore.setState({ campaign: { mode: "sandbox", activeLevelId: null, completedLevels: prevCompleted, levelCompleted: false } });
        setShowTitle(false);
        return;
      }
      const cs = useGameStore.getState().campaign;
      if ((cs == null ? void 0 : cs.mode) === "campaign" && !cs.activeLevelId) {
        setShowTitle(false);
        setShowCampaignMap(true);
        return;
      }
      setShowTitle(false);
    } });
  }
  if (showCampaignMap) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CampaignMap,
      {
        onStartLevel: (levelId) => {
          useGameStore.getState().startCampaignLevel(levelId);
          setShowCampaignMap(false);
        },
        onBack: () => {
          setShowCampaignMap(false);
          setShowTitle(true);
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `app${photoMode ? " app--photo" : ""}${(settings == null ? void 0 : settings.largeText) ? " app--text-lg" : ""}${(settings == null ? void 0 : settings.highContrast) ? " app--high-contrast" : ""}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ToastManager, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "coin-delta-portal", children: coinDeltas.map(({ id, diff, tier }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: `coin-delta coin-delta--${diff > 0 ? "up" : "down"} coin-delta--arc coin-delta--${tier || "small"}`,
        style: { "--arc-dir": diff > 0 ? "1" : "-1" },
        children: [
          diff > 0 ? "🪙 +" : "",
          diff.toLocaleString()
        ]
      },
      id
    )) }),
    coinDeltas.some((d) => d.tier === "mega") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "coin-vignette" }, `vig-${(_b = coinDeltas[0]) == null ? void 0 : _b.id}`),
    showOffline && offlineSummary && /* @__PURE__ */ jsxRuntimeExports.jsx(OfflineSummary, { summary: offlineSummary, onDismiss: dismissOffline }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-shell", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        NavRail,
        {
          active: activeSection,
          onNavigate: handleNavChange,
          badges: {
            market: newShopFishCount > 0 ? "NEW" : null,
            records: newFishdexCount > 0 || newAchCount > 0 ? "!" : null,
            office: challengeDone > 0 && challengeDone === challengeTotal ? "✓" : null
          },
          disabledSections: (() => {
            if ((campaign == null ? void 0 : campaign.mode) !== "campaign" || !campaign.activeLevelId) return {};
            const lvl = CAMPAIGN_LEVELS.find((l) => l.id === campaign.activeLevelId);
            const c = (lvl == null ? void 0 : lvl.constraints) || {};
            return { breeding: c.breedingDisabled || false };
          })()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-main", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: `sim-viewport ${activeSection === "aquarium" ? "sim-viewport--aquarium" : ""}`, children: [
          activeSection === "aquarium" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aquarium-hud-overlay", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MemoHUD,
                {
                  player,
                  shop,
                  tanks,
                  activeTank,
                  selectedFishTankId: selectedFish == null ? void 0 : selectedFish.tankId,
                  fish,
                  onBuyFood: () => buySupply("food", 10, 10, activeTank == null ? void 0 : activeTank.id),
                  onTreatWater: treatWater,
                  onToggleAutoFeed: toggleAutoFeed,
                  onUseHeater: useHeater,
                  soundOn,
                  onToggleSound: toggleSound
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TankTabs,
                {
                  tanks,
                  activeTankId: activeTank == null ? void 0 : activeTank.id,
                  onSelectTank: setActiveTankId,
                  onUnlockTank: unlockTank,
                  canUnlock: TANK_UNLOCK[tanks.length],
                  playerCoins: player.coins,
                  fish,
                  onRename: renameTank,
                  prestigeLevel: player.prestigeLevel || 0
                }
              )
            ] }),
            activeTank && (((_c = activeTank.supplies) == null ? void 0 : _c.food) ?? 0) <= 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aquarium-alert-bar", children: [
              "Low food in ",
              activeTank.name,
              " — ",
              ((_d = activeTank.supplies) == null ? void 0 : _d.food) ?? 0,
              " left",
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "aquarium-alert-btn", onClick: () => buySupply("food", 10, 10, activeTank.id), children: "Buy food" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-aquarium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-col", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                MemoTankView,
                {
                  fish: tankFish,
                  selectedFishId,
                  onSelectFish: setSelectedFishId,
                  waterQuality: (activeTank == null ? void 0 : activeTank.waterQuality) ?? 100,
                  tank: activeTank,
                  listedFishIds: shop.listedFish || []
                }
              ) }),
              selectedFish && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-inspector sim-inspector--open", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "inspector-close-btn", onClick: () => setSelectedFishId(null), children: "✕" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MemoFishPanel,
                  {
                    fish: selectedFish,
                    onFeed: feedFish,
                    onSell: toggleSellFish,
                    onMedicine: useMedicine,
                    isListed,
                    isFirstRun: (player.fishdex || []).length === 0,
                    foodStock: ((_f = (_e = tanks.find((t) => t.id === (selectedFish == null ? void 0 : selectedFish.tankId)) ?? activeTank) == null ? void 0 : _e.supplies) == null ? void 0 : _f.food) ?? 0,
                    medicineStock: (() => {
                      var _a2, _b2, _c2;
                      const fishTank = tanks.find((t) => t.id === (selectedFish == null ? void 0 : selectedFish.tankId)) ?? activeTank;
                      return (selectedFish == null ? void 0 : selectedFish.disease) === "bloat" ? ((_a2 = fishTank == null ? void 0 : fishTank.supplies) == null ? void 0 : _a2.digestiveRemedy) ?? 0 : (selectedFish == null ? void 0 : selectedFish.disease) === "velvet" ? ((_b2 = fishTank == null ? void 0 : fishTank.supplies) == null ? void 0 : _b2.antiparasitic) ?? 0 : ((_c2 = fishTank == null ? void 0 : fishTank.supplies) == null ? void 0 : _c2.antibiotic) ?? 0;
                    })(),
                    tanks,
                    onMoveFish: moveFishToTank,
                    onNavigate: handleTabChange
                  }
                )
              ] })
            ] })
          ] }),
          activeSection !== "aquarium" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sim-status-bar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sim-status-coins", children: [
              ((_g = player.coins) == null ? void 0 : _g.toLocaleString()) || 0,
              " coins"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sim-status-sep" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sim-status-fish", children: [
              fish.length,
              " fish"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sim-status-sep" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sim-status-label", children: activeSection.charAt(0).toUpperCase() + activeSection.slice(1) })
          ] }),
          activeSection === "market" && /* @__PURE__ */ jsxRuntimeExports.jsx(TabErrorBoundary, { name: "market", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tab-content-scroll", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MemoShop,
              {
                game,
                activeTank,
                onToggleSell: toggleSellFish,
                onSetPrice: setFishPrice,
                onBuyUpgrade: buyUpgrade,
                onBuySupply: (k, c, a) => buySupply(k, c, a, activeTank == null ? void 0 : activeTank.id),
                onBuyFish: buyFish,
                onBuyRareItem: buyRareMarketItem,
                onNavigate: handleTabChange
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(WantedBoard, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CatchOfDayPanel, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AmenitiesPanel, {}),
            activeTank && /* @__PURE__ */ jsxRuntimeExports.jsx(EquipmentPanel, { tankId: activeTank.id })
          ] }) }),
          activeSection === "breeding" && /* @__PURE__ */ jsxRuntimeExports.jsx(TabErrorBoundary, { name: "breed", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab-content-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            MemoBreedingLab,
            {
              fish,
              breedingTank,
              extraBays,
              maxBays,
              onSelectForBreeding: selectForBreeding,
              onCollectEgg: collectEgg,
              onCancelBreeding: cancelBreeding,
              onNavigate: handleTabChange
            }
          ) }) }),
          activeSection === "records" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-section", children: "Loading..." }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            RecordsSection,
            {
              onNavigate: handleTabChange,
              generatingLoreFor,
              aiError,
              onGenerateLore: handleGenerateLore
            }
          ) }),
          activeSection === "office" && /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-section", children: "Loading..." }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(OfficeSection, {}) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `sim-log ${showLogTray ? "sim-log--open" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoLogPanel, { log }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(GameStatusBar, { paused, onTogglePause: togglePause, showLog: showLogTray, onToggleLog: () => setShowLogTray((v) => !v) })
      ] })
    ] }),
    levelFlash && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "level-up-flash" }),
    hatchRevealFish && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HatchReveal,
      {
        fish: hatchRevealFish,
        onComplete: () => setHatchRevealFish(null)
      }
    ),
    discoverySpecies && /* @__PURE__ */ jsxRuntimeExports.jsx(
      DiscoveryCeremony,
      {
        species: discoverySpecies,
        onDismiss: () => setDiscoverySpecies(null)
      }
    ),
    celebration && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-celebration", onClick: () => setCelebration(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "milestone-content", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-emoji", children: celebration.emoji }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-title", children: celebration.title }),
      celebration.desc && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-desc", children: celebration.desc }),
      celebration.reward && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-reward", children: celebration.reward }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "milestone-tap", children: "Tap to continue" })
    ] }) }),
    paused && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pause-overlay", onClick: togglePause, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pause-text", children: "PAUSED" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pause-hint", children: "Press Space or click to resume" })
    ] }),
    showGameMenu && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-menu-overlay", onClick: () => setShowGameMenu(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-menu", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-menu-title", children: "FISH TYCOON 2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "game-menu-version", children: "v0.10.0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-menu-buttons", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          playClick();
          setShowGameMenu(false);
        }, children: "Resume" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          playClick();
          setShowGameMenu(false);
          setShowSettings(true);
        }, children: "Settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          playClick();
          useGameStore.getState().quickSave();
        }, children: "Save Game" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          playClick();
          handleExportSave();
        }, children: "Export Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          playClick();
          setShowGameMenu(false);
          setShowCredits(true);
        }, children: "Credits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn", onClick: () => {
          var _a2;
          playClick();
          useGameStore.getState().quickSave();
          setShowGameMenu(false);
          const isCampaign = ((_a2 = useGameStore.getState().campaign) == null ? void 0 : _a2.mode) === "campaign";
          if (isCampaign) {
            useGameStore.getState().abandonCampaignLevel();
            setShowCampaignMap(true);
          } else {
            setShowTitle(true);
          }
        }, children: ((_h = useGameStore.getState().campaign) == null ? void 0 : _h.mode) === "campaign" ? "Quit Level" : "Quit to Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "game-menu-btn game-menu-btn--danger", onClick: () => {
          playClick();
          setShowGameMenu(false);
          setShowResetConfirm(true);
        }, children: "Reset" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "game-menu-hints", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "ESC — Menu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "SPACE — Pause" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "1-5 — Sections" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "F — Feed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "S — Sell" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "A — Feed All" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "M — Medicine" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "L — Log" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ", . — Speed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "F5 — Save" })
      ] })
    ] }) }),
    showSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPanel, { onClose: () => setShowSettings(false) }),
    showCredits && /* @__PURE__ */ jsxRuntimeExports.jsx(Credits, { onClose: () => setShowCredits(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Tutorial, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EventPopup, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HagglePopup, {}),
    showApiSetup && /* @__PURE__ */ jsxRuntimeExports.jsx(ApiKeyModal, { onClose: () => setShowApiSetup(false) }),
    showResetConfirm && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ResetConfirmModal,
      {
        onConfirm: () => {
          setShowResetConfirm(false);
          resetGame();
        },
        onCancel: () => setShowResetConfirm(false)
      }
    ),
    (player.magicFishFound || []).length === 7 && showWinModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MagicWinModal,
      {
        totalReward: MAGIC_FISH.reduce((s, m) => s + m.reward, 0),
        onDismiss: () => setShowWinModal(false),
        onNavigate: handleTabChange
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ObjectiveBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationCenter, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Mentor, {}),
    victoryLevelId && /* @__PURE__ */ jsxRuntimeExports.jsx(
      VictoryModal,
      {
        levelId: victoryLevelId,
        onContinue: (nextLevelId) => {
          setVictoryLevelId(null);
          if (nextLevelId) {
            useGameStore.getState().startCampaignLevel(nextLevelId);
          } else {
            setShowCampaignMap(true);
          }
        }
      }
    )
  ] });
}
function ApiKeyModal({ onClose }) {
  const [val, setVal] = reactExports.useState(getApiKey());
  const [saved, setSaved] = reactExports.useState(false);
  const handleSave = () => {
    setApiKey(val.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 900);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-overlay", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal", style: { maxWidth: 420 }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-title", style: { fontSize: "1.3rem" }, children: "AI Fish Naming" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: "0.88rem", margin: "8px 0 16px" }, children: "Paste your Anthropic API key to unlock AI-generated fish names and lore. Your key is stored only in this browser (localStorage) and never sent anywhere except Anthropic's API." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "password",
        placeholder: "sk-ant-...",
        value: val,
        onChange: (e) => setVal(e.target.value),
        style: { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--panel-border)", background: "var(--ocean-mid)", color: "var(--text-primary)", fontSize: "0.9rem", boxSizing: "border-box" },
        onKeyDown: (e) => e.key === "Enter" && handleSave(),
        autoFocus: true
      }
    ),
    val && !val.startsWith("sk-ant-") && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { color: "#f5a623", fontSize: "0.8rem", margin: "6px 0 0" }, children: [
      "Anthropic keys usually start with ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "sk-ant-" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }, children: [
      getApiKey() && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-danger", onClick: () => {
        setApiKey("");
        setVal("");
      }, children: "Clear Key" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: onClose, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-primary", onClick: handleSave, disabled: !val.trim(), children: saved ? "Saved" : "Save Key" })
    ] })
  ] }) });
}
function TankTabs({ tanks, activeTankId, onSelectTank, onUnlockTank, canUnlock, playerCoins, fish, onRename, prestigeLevel = 0 }) {
  const [unlocking, setUnlocking] = reactExports.useState(false);
  const [unlockType, setUnlockType] = reactExports.useState("display");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tank-tab-bar", children: [
    tanks.map((tank) => {
      const count = fish.filter((f) => f.tankId === tank.id).length;
      const pct = Math.round(count / tank.capacity * 100);
      const isActive = tank.id === activeTankId;
      TANK_TYPES[tank.type] || TANK_TYPES.display;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `tank-tab ${isActive ? "active" : ""}`, onClick: () => {
        onSelectTank(tank.id);
        setEditingId(null);
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-tab-arc", title: `${count}/${tank.capacity} fish`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "28", height: "28", viewBox: "0 0 28 28", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "14", r: "10", fill: "none", stroke: "rgba(255,255,255,0.10)", strokeWidth: "3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "14",
              cy: "14",
              r: "10",
              fill: "none",
              stroke: isActive ? "var(--gold)" : pct > 80 ? "var(--danger)" : pct > 50 ? "#b0944a" : "var(--success)",
              strokeWidth: "3",
              strokeDasharray: `${pct / 100 * 62.8} 62.8`,
              strokeDashoffset: "15.7",
              strokeLinecap: "round",
              style: { transition: "stroke-dasharray 0.5s ease" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: "14", y: "17.5", textAnchor: "middle", fontSize: "7", fill: "currentColor", opacity: "0.85", children: count })
        ] }) }),
        editingId === tank.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "tank-name-input",
            value: editName,
            autoFocus: true,
            onChange: (e) => setEditName(e.target.value),
            onBlur: () => {
              onRename(tank.id, editName || tank.name);
              setEditingId(null);
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                onRename(tank.id, editName || tank.name);
                setEditingId(null);
              }
              e.stopPropagation();
            },
            onClick: (e) => e.stopPropagation()
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tank-tab-name", onDoubleClick: (e) => {
          e.stopPropagation();
          setEditingId(tank.id);
          setEditName(tank.name);
        }, children: tank.name })
      ] }, tank.id);
    }),
    canUnlock && (() => {
      const needsPrestige = canUnlock.minPrestige && prestigeLevel < canUnlock.minPrestige;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tank-tab tank-tab-unlock", children: needsPrestige ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tank-unlock-locked", children: [
        "Requires Prestige ",
        canUnlock.minPrestige
      ] }) : !unlocking ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-unlock", onClick: () => setUnlocking(true), children: [
        "+ Unlock Tank (",
        canUnlock.cost,
        ")"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tank-unlock-picker", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "tank-type-select", value: unlockType, onChange: (e) => setUnlockType(e.target.value), children: Object.entries(TANK_TYPES).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: k, children: [
          v.emoji,
          " ",
          v.label,
          " — ",
          v.desc
        ] }, k)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn btn-sm btn-primary", disabled: playerCoins < canUnlock.cost, onClick: () => {
          onUnlockTank(unlockType);
          setUnlocking(false);
        }, children: [
          "Unlock for 🪙",
          canUnlock.cost
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => setUnlocking(false), children: "Cancel" })
      ] }) });
    })()
  ] });
}
function ResetConfirmModal({ onConfirm, onCancel }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-overlay", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal", style: { maxWidth: 360 }, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-title", style: { fontSize: "1.3rem" }, children: "Reset Game?" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-dim)", fontSize: "0.88rem", margin: "8px 0 20px" }, children: "All progress will be permanently lost. This cannot be undone." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, justifyContent: "flex-end" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: onCancel, children: "Cancel" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm btn-danger", onClick: onConfirm, children: "Yes, Reset Everything" })
    ] })
  ] }) });
}
function MagicWinModal({ totalReward, onDismiss, onNavigate }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-overlay", onClick: onDismiss, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-stars" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-title", children: "Legend of the Deep" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-subtitle", children: "You have discovered all 7 Magic Fish" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-fish-row" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "win-modal-lore", children: "Your aquarium has become the stuff of legend. Sailors speak of it in hushed tones. Scholars have written papers about what you have accomplished. The seven wonders of the deep — all in one place. All yours." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal-reward", children: [
      "Total reward collected: ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
        "🪙 ",
        totalReward.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal-unlocks", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-unlock-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Legend Throne" }),
        " decoration unlocked —",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => {
          onDismiss();
          onNavigate("decor");
        }, children: "Open Decor tab" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-unlock-item", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Legend Fish" }),
        " species unlocked in the Fishdex!"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-unlock-item", children: [
        "🏆 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "+🪙500" }),
        " achievement bonus awarded!"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "win-modal-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-sm", onClick: () => {
        onDismiss();
        onNavigate("magic");
      }, children: "View Magic Fish" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn btn-primary win-continue-btn", onClick: onDismiss, children: "Continue Playing" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "win-modal-hint", children: "The ocean has more secrets. Keep breeding." })
  ] }) });
}
const App$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
export {
  ALLELE_NAME_COLORS as A,
  FishSprite$1 as F,
  GENE_ORDER as G,
  TabErrorBoundary as T,
  App$1 as a,
  purityTier as p
};
