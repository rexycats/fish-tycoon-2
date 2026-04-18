import { r as reactExports, j as jsxRuntimeExports } from "./index-CHk9lW5X.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
const PAL = {
  default: { b: "#d0b840", b2: "#908020", bl: "#e0c850", lt: "#f0e060", sh: "#605000", spots: "#706010", fin: "#c0a830", belly: "#f0e8c0", outline: "#605010" },
  spotted: { b: "#b0c040", b2: "#708020", bl: "#c0d050", lt: "#d0e060", sh: "#405000", spots: "#506010", fin: "#a0b030", belly: "#e0e8c0", outline: "#506010" },
  albino: { b: "#f0e8d0", b2: "#d0c0a0", bl: "#f8f0e0", lt: "#fffaf0", sh: "#908060", spots: "#c0b890", fin: "#e8d8c0", belly: "#fff8f0", outline: "#907850" },
  blue: { b: "#3878b0", b2: "#204878", bl: "#4888c0", lt: "#6098d0", sh: "#102040", spots: "#183060", fin: "#3070a0", belly: "#c0d0e0", outline: "#183858" }
};
function PufferfishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "pf").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon", aura = AURA[rarity];
  const v = (fish == null ? void 0 : fish.colorVariant) || "default", C = PAL[v] || PAL.default, W = size, H = size * 0.95;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 80 76", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `pfsh-${uid}`, x: "-22%", y: "-18%", width: "144%", height: "156%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `pffg-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "1.5", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.lt, floodOpacity: "0.25", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `pfb-${uid}`, cx: "32%", cy: "28%", r: "68%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.bl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.b }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `pfd-${uid}`, cx: "50%", cy: "0%", r: "80%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `pfbl-${uid}`, cx: "50%", cy: "100%", r: "58%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.belly, stopOpacity: "0.55" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.belly, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `pfsp-${uid}`, cx: "28%", cy: "20%", r: "42%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.55" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `pffin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2, stopOpacity: "0.3" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `pfclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26" }) }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `pfa-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "30", ry: "30", fill: aura.color, opacity: aura.opacity, filter: `url(#pfa-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#pffg-${uid})`, className: "fish-tail", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M60,38 L72,30 L70,38 L72,46 Z", fill: `url(#pffin-${uid})`, stroke: C.outline, strokeWidth: "0.6", strokeOpacity: "0.3" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,14 Q34,8 40,12", fill: `url(#pffin-${uid})`, className: "fish-dorsal", stroke: C.outline, strokeWidth: "0.4", strokeOpacity: "0.3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,62 Q34,68 40,64", fill: `url(#pffin-${uid})`, className: "fish-anal-fin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "26", cy: "46", rx: "7", ry: "3.5", fill: `url(#pffin-${uid})`, transform: "rotate(-20,26,46)", className: "fish-pectoral", filter: `url(#pffg-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#pfsh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26", fill: `url(#pfb-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26", fill: `url(#pfd-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26", fill: `url(#pfbl-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#pfclip-${uid})`, children: [
      [20, 28, 36, 44, 52].map((x, i) => [22, 30, 38, 46, 54].map((y, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x + j % 2 * 4, cy: y + i % 2 * 3, r: 1.5 + (i + j) % 3 * 0.3, fill: C.spots, opacity: 0.15 + (i + j) % 4 * 0.04 }, `${i}${j}`))),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "50", rx: "18", ry: "12", fill: C.belly, opacity: "0.25" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26", fill: `url(#pfsp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "24", ry: "26", fill: "none", stroke: C.outline, strokeWidth: "0.9", opacity: "0.25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,40 Q12,42 14,44", stroke: C.outline, strokeWidth: "1.2", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16,38 Q14,40 16,42", stroke: C.sh, strokeWidth: "0.5", fill: "none", opacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "32", r: "6", fill: "rgba(0,0,0,0.04)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "31.5", r: "5.5", fill: "#fafafa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "31.5", r: "4", fill: C.b }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "31.5", r: "3", fill: "#1a1a2a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22.5", cy: "30", r: "1.5", fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "25", cy: "32.5", r: "0.6", fill: "rgba(255,255,255,0.3)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "36", r: "0.8", fill: C.sh, opacity: "0.2" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "38", rx: "28", ry: "30", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
  ] });
}
const PufferfishSprite_default = reactExports.memo(PufferfishSprite);
export {
  PufferfishSprite_default as default
};
