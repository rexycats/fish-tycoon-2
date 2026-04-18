import { r as reactExports, j as jsxRuntimeExports } from "./index-CC8U9sdC.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
const PAL = {
  default: { b: "#c83030", b2: "#802018", bl: "#e04848", lt: "#f06060", sh: "#401008", stripe: "#2050a0", stripe2: "#3068c0", fin: "#a02828", belly: "#e08060", lat: "#d04040", outline: "#501010" },
  blue: { b: "#2050a0", b2: "#103070", bl: "#3868c0", lt: "#5080e0", sh: "#081838", stripe: "#60c8ff", stripe2: "#80d8ff", fin: "#1840a0", belly: "#6090c0", lat: "#4070c0", outline: "#0c2050" },
  green: { b: "#308040", b2: "#185028", bl: "#489858", lt: "#60b070", sh: "#082810", stripe: "#40c060", stripe2: "#60d880", fin: "#287038", belly: "#70a078", lat: "#409050", outline: "#103818" }
};
function DiscusSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "dc").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare", aura = AURA[rarity];
  const v = (fish == null ? void 0 : fish.colorVariant) || "default", C = PAL[v] || PAL.default, W = size, H = size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 72 72", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `dcsh-${uid}`, x: "-22%", y: "-18%", width: "144%", height: "156%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `dcfg-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.stripe, floodOpacity: "0.3", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `dcb-${uid}`, cx: "30%", cy: "26%", r: "70%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.bl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.b }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `dcd-${uid}`, cx: "50%", cy: "0%", r: "82%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.42" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `dcbl-${uid}`, cx: "50%", cy: "100%", r: "58%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.belly, stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.belly, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `dcsp-${uid}`, cx: "28%", cy: "20%", r: "42%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `dclat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lat, stopOpacity: "0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.lat, stopOpacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lat, stopOpacity: "0.35" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "70%", stopColor: C.lat, stopOpacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lat, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `dcfin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.85" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2, stopOpacity: "0.35" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `dcclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24" }) }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `dca-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", rx: "30", ry: "30", fill: aura.color, opacity: aura.opacity, filter: `url(#dca-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#dcfg-${uid})`, className: "fish-tail", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M54,36 L66,28 L64,36 L66,44 Z", fill: `url(#dcfin-${uid})`, stroke: C.outline, strokeWidth: "0.6", strokeOpacity: "0.3" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-dorsal", filter: `url(#dcfg-${uid})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22,14 Q32,4 48,10 L44,20", fill: `url(#dcfin-${uid})`, stroke: C.outline, strokeWidth: "0.5", strokeOpacity: "0.3" }),
      [26, 32, 38, 44].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 18 - i * 0.5, x2: x + 2, y2: 8 + i * 0.5, stroke: C.outline, strokeWidth: "0.3", opacity: "0.15" }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22,58 Q32,68 48,62 L44,52", fill: `url(#dcfin-${uid})`, className: "fish-anal-fin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "44", rx: "8", ry: "4", fill: `url(#dcfin-${uid})`, transform: "rotate(-20,24,44)", className: "fish-pectoral", filter: `url(#dcfg-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#dcsh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: `url(#dcb-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: `url(#dcd-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: `url(#dcbl-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: `url(#dclat-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#dcclip-${uid})`, children: [
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${10 + i * 2},${20 + i * 4} Q${32 + i},${34 + i * 1.5} ${54 - i * 2},${20 + i * 4}`, stroke: C.stripe, strokeWidth: 1.2 - i * 0.05, fill: "none", opacity: 0.35 - i * 0.02 }, i)),
      [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${18 + i * 8},14 Q${20 + i * 8},36 ${18 + i * 8},58`, stroke: C.stripe2, strokeWidth: "0.4", fill: "none", opacity: "0.08" }, `v${i}`))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: `url(#dcsp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "24", fill: "none", stroke: C.outline, strokeWidth: "0.9", opacity: "0.25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10,38 Q8,40 10,42", stroke: C.sh, strokeWidth: "1", fill: "none", strokeLinecap: "round", opacity: "0.35" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "32", r: "4.5", fill: "rgba(0,0,0,0.06)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "31.5", r: "4", fill: C.b, opacity: "0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "31.5", r: "3.2", fill: "#fafafa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "31.5", r: "2.5", fill: "#1a1a2a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12.8", cy: "30.3", r: "1.2", fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14.8", cy: "32.3", r: "0.5", fill: "rgba(255,255,255,0.3)" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "32", cy: "36", r: "28", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
  ] });
}
const DiscusSprite_default = reactExports.memo(DiscusSprite);
export {
  DiscusSprite_default as default
};
