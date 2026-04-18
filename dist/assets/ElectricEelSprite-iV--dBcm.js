import { r as reactExports, j as jsxRuntimeExports } from "./index-Rpas-Nvj.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
const PALETTES = {
  default: { b: "#384838", b2: "#1a281a", bl: "#486048", lt: "#587858", sh: "#0a180a", ac: "#e0c020", ac2: "#80ff40", fin: "#304830", lat: "#507050", outline: "#0a180a" },
  albino: { b: "#e8d8b8", b2: "#c0a888", bl: "#f0e8d0", lt: "#f8f0e0", sh: "#807050", ac: "#f0d040", ac2: "#a0ff60", fin: "#d0c0a0", lat: "#e0d0b0", outline: "#907860" },
  midnight: { b: "#181828", b2: "#080810", bl: "#282840", lt: "#384050", sh: "#040408", ac: "#40a0ff", ac2: "#60c0ff", fin: "#141820", lat: "#283040", outline: "#080810" }
};
function ElectricEelSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "ee").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "epic", aura = AURA[rarity];
  const v = (fish == null ? void 0 : fish.colorVariant) || "default";
  const C = PALETTES[v] || PALETTES.default;
  const W = size * 1.6, H = size * 0.45;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      viewBox: "0 0 140 35",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `eesh-${uid}`, x: "-12%", y: "-28%", width: "124%", height: "178%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `eegl-${uid}`, x: "-30%", y: "-60%", width: "160%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.ac2, floodOpacity: "0.35", result: "c" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `eeb-${uid}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.b }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "70%", stopColor: C.b2 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `eed-${uid}`, cx: "50%", cy: "0%", r: "85%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `eebl-${uid}`, cx: "50%", cy: "100%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt, stopOpacity: "0.4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lt, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `eesp-${uid}`, cx: "25%", cy: "18%", r: "40%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `eelat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lat, stopOpacity: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.lat, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lat, stopOpacity: "0.3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "75%", stopColor: C.lat, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lat, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `eefin-${uid}`, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.7" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.fin, stopOpacity: "0.3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `eeclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `eea-${uid}`, x: "-45%", y: "-60%", width: "190%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "68", cy: "18", rx: "58", ry: "14", fill: aura.color, opacity: aura.opacity, filter: `url(#eea-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M128,18 Q134,16 138,18 Q134,20 128,18", fill: C.b, opacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-anal-fin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20,28 Q40,33 60,32 Q80,33 100,32 Q120,30 130,26", fill: `url(#eefin-${uid})`, stroke: C.fin, strokeWidth: "0.5", strokeOpacity: "0.3" }),
          [30, 45, 60, 75, 90, 105, 120].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 28 + i * 0.3, x2: x, y2: 32 - i * 0.1, stroke: C.fin, strokeWidth: "0.3", opacity: "0.15" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "20", cy: "22", rx: "5", ry: "3", fill: `url(#eefin-${uid})`, transform: "rotate(-10,20,22)", className: "fish-pectoral" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#eesh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: `url(#eeb-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: `url(#eed-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: `url(#eebl-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: `url(#eelat-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "10", cy: "22", rx: "6", ry: "4", fill: C.ac, opacity: "0.35" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#eegl-${uid})`, clipPath: `url(#eeclip-${uid})`, children: [30, 45, 58, 72, 86, 100, 114].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x, cy: 14 + i % 2 * 2, r: "2", fill: C.ac2, opacity: 0.25 + Math.sin(i) * 0.1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x + 6, cy: 20 - i % 2 * 2, r: "1.5", fill: C.ac2, opacity: 0.18 + Math.cos(i) * 0.08 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x, cy: 14 + i % 2 * 2, r: "4", fill: C.ac2, opacity: "0.06" })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: `url(#eeclip-${uid})`, opacity: "0.1", children: [20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: "6", x2: x, y2: "30", stroke: C.lat, strokeWidth: "0.5" }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: `url(#eesp-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M130,18 C130,10 110,5 70,5 C35,5 10,10 6,18 C10,26 35,31 70,31 C110,31 130,26 130,18 Z", fill: "none", stroke: C.outline, strokeWidth: "0.8", opacity: "0.25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,18 Q40,16 70,17 Q100,16 126,18", stroke: C.lat, strokeWidth: "0.5", fill: "none", opacity: "0.15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16,14 Q17,18 16,22", stroke: C.sh, strokeWidth: "0.7", fill: "none", opacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6,17 Q4,18 6,19", stroke: C.sh, strokeWidth: "1", fill: "none", strokeLinecap: "round", opacity: "0.35" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "16", r: "3", fill: "rgba(0,0,0,0.08)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "15.5", r: "2.5", fill: "#fafafa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10", cy: "15.5", r: "1.8", fill: "#0a0a12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "9.2", cy: "14.8", r: "0.9", fill: "white" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "68", cy: "18", rx: "62", ry: "16", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
      ]
    }
  );
}
const ElectricEelSprite_default = reactExports.memo(ElectricEelSprite);
export {
  ElectricEelSprite_default as default
};
