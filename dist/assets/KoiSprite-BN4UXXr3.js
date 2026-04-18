import { r as reactExports, j as jsxRuntimeExports } from "./index-Dj6wWOWJ.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
const PAL = {
  default: { b: "#f0e8d8", b2: "#c0a880", bl: "#f8f0e0", lt: "#fffaf0", sh: "#806040", patch1: "#e03020", patch2: "#c02818", patch3: "#ff4030", fin: "#f0d8c0", lat: "#f8e8d0", outline: "#907050" },
  kohaku: { b: "#fff0e0", b2: "#e0c8a0", bl: "#fff8f0", lt: "#ffffff", sh: "#a08060", patch1: "#ff2010", patch2: "#d01808", patch3: "#ff5040", fin: "#ffe8d0", lat: "#fff0e0", outline: "#a08860" },
  showa: { b: "#181818", b2: "#080808", bl: "#303030", lt: "#484848", sh: "#000000", patch1: "#e02010", patch2: "#ff4030", patch3: "#ffffff", fin: "#282828", lat: "#383838", outline: "#101010" }
};
function KoiSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "ki").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon", aura = AURA[rarity];
  const v = (fish == null ? void 0 : fish.colorVariant) || "default", C = PAL[v] || PAL.default, W = size * 1.15, H = size * 0.7;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 95 55", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `kish-${uid}`, x: "-20%", y: "-20%", width: "140%", height: "160%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `kifg-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.patch1, floodOpacity: "0.3", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `kib-${uid}`, cx: "30%", cy: "26%", r: "70%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.bl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "58%", stopColor: C.b }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `kid-${uid}`, cx: "50%", cy: "0%", r: "82%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `kibl-${uid}`, cx: "50%", cy: "100%", r: "58%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt, stopOpacity: "0.45" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lt, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `kisp-${uid}`, cx: "28%", cy: "20%", r: "40%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `kilat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lat, stopOpacity: "0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.lat, stopOpacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lat, stopOpacity: "0.3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "70%", stopColor: C.lat, stopOpacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lat, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `kifin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.85" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2, stopOpacity: "0.35" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `kiclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18" }) }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `kia-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "36", ry: "22", fill: aura.color, opacity: aura.opacity, filter: `url(#kia-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#kifg-${uid})`, className: "fish-tail-flowing", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M70,28 Q78,18 84,16 Q80,22 82,28 Q80,34 84,40 Q78,38 70,28 Z", fill: `url(#kifin-${uid})`, stroke: C.outline, strokeWidth: "0.6", strokeOpacity: "0.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M72,28 Q76,22 80,20 Q78,26 78,28 Q78,30 80,36 Q76,34 72,28", fill: C.lt, opacity: "0.12" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "72", y1: "28", x2: "80", y2: "20", stroke: C.outline, strokeWidth: "0.3", opacity: "0.15" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "72", y1: "28", x2: "80", y2: "36", stroke: C.outline, strokeWidth: "0.3", opacity: "0.15" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { className: "fish-dorsal", filter: `url(#kifg-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M34,10 Q42,4 52,8 L48,16", fill: `url(#kifin-${uid})`, stroke: C.outline, strokeWidth: "0.5", strokeOpacity: "0.3" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M34,46 Q42,52 52,48 L48,40", fill: `url(#kifin-${uid})`, className: "fish-anal-fin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "28", cy: "34", rx: "8", ry: "4", fill: `url(#kifin-${uid})`, transform: "rotate(-18,28,34)", className: "fish-pectoral", filter: `url(#kifg-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#kish-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: `url(#kib-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: `url(#kid-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: `url(#kibl-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: `url(#kilat-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#kiclip-${uid})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "24", rx: "12", ry: "10", fill: C.patch1, opacity: "0.55" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "52", cy: "30", rx: "10", ry: "8", fill: C.patch2, opacity: "0.45" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "34", rx: "8", ry: "6", fill: C.patch1, opacity: "0.35" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "30", r: "5", fill: C.patch3, opacity: "0.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "60", cy: "24", r: "6", fill: C.patch2, opacity: "0.25" }),
      [18, 26, 34, 42, 50, 58, 66].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${x},14 Q${x + 3},28 ${x},42`, stroke: C.lat, strokeWidth: "0.5", fill: "none", opacity: "0.08" }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: `url(#kisp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "30", ry: "18", fill: "none", stroke: C.outline, strokeWidth: "0.9", opacity: "0.25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,22 Q16,28 14,34", stroke: C.sh, strokeWidth: "0.9", fill: "none", opacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M10,26 Q8,28 10,30", stroke: C.sh, strokeWidth: "1", fill: "none", strokeLinecap: "round", opacity: "0.3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,24 Q8,20 6,22", stroke: C.outline, strokeWidth: "1.2", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,32 Q8,36 6,34", stroke: C.outline, strokeWidth: "1.2", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "26", r: "4", fill: "rgba(0,0,0,0.06)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "25.5", r: "3.5", fill: "#fafafa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "25.5", r: "2.5", fill: "#1a1a2a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15", cy: "24.5", r: "1.2", fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16.8", cy: "26.3", r: "0.5", fill: "rgba(255,255,255,0.3)" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "28", rx: "34", ry: "22", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
  ] });
}
const KoiSprite_default = reactExports.memo(KoiSprite);
export {
  KoiSprite_default as default
};
