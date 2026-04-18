import { r as reactExports, j as jsxRuntimeExports } from "./index-CC8U9sdC.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
function MoorishIdolSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "mi").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare", aura = AURA[rarity];
  const W = size * 0.9, H = size * 1.1;
  const C = { body: "#f0e040", body2: "#c0a020", white: "#f8f8f0", black: "#1a1a18", lt: "#fff060", sh: "#604000", fin: "#f0d830", outline: "#403008" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 70 85", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `mish-${uid}`, x: "-22%", y: "-15%", width: "144%", height: "140%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.30" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `mifg-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.body, floodOpacity: "0.3", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `mib-${uid}`, cx: "32%", cy: "30%", r: "68%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "30%", stopColor: C.body }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.body2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `misp-${uid}`, cx: "28%", cy: "22%", r: "40%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `mifin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.85" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.body2, stopOpacity: "0.4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `miclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "22", ry: "28" }) }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `mia-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "28", ry: "34", fill: aura.color, opacity: aura.opacity, filter: `url(#mia-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#mifg-${uid})`, className: "fish-tail", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M52,45 L64,38 L62,45 L64,52 Z", fill: `url(#mifin-${uid})`, stroke: C.outline, strokeWidth: "0.6", strokeOpacity: "0.3" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-dorsal", filter: `url(#mifg-${uid})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,18 Q32,2 36,0 Q34,8 38,14", fill: C.white, opacity: "0.8", stroke: C.outline, strokeWidth: "0.5", strokeOpacity: "0.3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M30,16 Q32,6 34,4", stroke: C.outline, strokeWidth: "0.3", fill: "none", opacity: "0.15" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M20,72 Q28,80 38,76 L36,66", fill: C.black, opacity: "0.7", className: "fish-anal-fin" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "52", rx: "7", ry: "3.5", fill: `url(#mifin-${uid})`, transform: "rotate(-25,24,52)", className: "fish-pectoral" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#mish-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "22", ry: "28", fill: `url(#mib-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#miclip-${uid})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "20", width: "50", height: "12", fill: C.black, opacity: "0.8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "32", width: "50", height: "8", fill: C.body, opacity: "0.6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "40", width: "50", height: "6", fill: C.white, opacity: "0.7" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "46", width: "50", height: "12", fill: C.black, opacity: "0.8" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "58", width: "50", height: "8", fill: C.body, opacity: "0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "66", width: "50", height: "8", fill: C.black, opacity: "0.6" }),
      [14, 20, 26, 32, 38, 44].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${x},20 Q${x + 2},45 ${x},70`, stroke: C.lt, strokeWidth: "0.4", fill: "none", opacity: "0.06" }, i))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "22", ry: "28", fill: `url(#misp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "22", ry: "28", fill: "none", stroke: C.outline, strokeWidth: "0.9", opacity: "0.3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,40 Q10,42 12,44", stroke: C.outline, strokeWidth: "1", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M14,38 Q12,40 14,42", stroke: C.sh, strokeWidth: "0.5", fill: "none", opacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "36", r: "4.5", fill: "rgba(0,0,0,0.06)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "35.5", r: "4", fill: C.body }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "35.5", r: "3", fill: "#fafafa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16", cy: "35.5", r: "2.2", fill: "#1a1a2a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "15", cy: "34.5", r: "1", fill: "white" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "16.8", cy: "36.2", r: "0.4", fill: "rgba(255,255,255,0.3)" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "32", cy: "45", rx: "26", ry: "32", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
  ] });
}
const MoorishIdolSprite_default = reactExports.memo(MoorishIdolSprite);
export {
  MoorishIdolSprite_default as default
};
