import { r as reactExports, j as jsxRuntimeExports } from "./index-CC8U9sdC.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
function NeonTetraSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "nt").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "common", aura = AURA[rarity];
  const W = size * 0.7, H = size * 0.45;
  const C = { b: "#708898", b2: "#405868", bl: "#90a8b8", lt: "#b0c8d8", sh: "#203040", neon: "#00c8ff", neon2: "#40e0ff", red: "#ff2020", red2: "#e01818", fin: "#80a0b0", belly: "#c0d0e0", outline: "#304858" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 52 30", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `ntsh-${uid}`, x: "-25%", y: "-25%", width: "150%", height: "170%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "1.5", floodColor: "#000", floodOpacity: "0.25" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `ntgl-${uid}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.5", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.neon, floodOpacity: "0.5", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ntb-${uid}`, cx: "32%", cy: "28%", r: "65%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "28%", stopColor: C.bl }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "58%", stopColor: C.b }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ntd-${uid}`, cx: "50%", cy: "0%", r: "78%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ntbl-${uid}`, cx: "50%", cy: "100%", r: "55%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.belly, stopOpacity: "0.45" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.belly, stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ntsp-${uid}`, cx: "28%", cy: "20%", r: "38%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ntneon-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.neon, stopOpacity: "0.1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "20%", stopColor: C.neon, stopOpacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: C.neon2, stopOpacity: "0.9" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "80%", stopColor: C.neon, stopOpacity: "0.6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.neon, stopOpacity: "0.1" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ntred-${uid}`, x1: "50%", y1: "0%", x2: "100%", y2: "100%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.red, stopOpacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.red2, stopOpacity: "0.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `ntclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8" }) }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `nta-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "20", ry: "12", fill: aura.color, opacity: aura.opacity, filter: `url(#nta-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { className: "fish-tail", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M38,15 L46,10 L44,15 L46,20 Z", fill: C.red, opacity: "0.5", stroke: C.outline, strokeWidth: "0.4", strokeOpacity: "0.3" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18,6 Q22,3 26,5", fill: C.fin, opacity: "0.4", className: "fish-dorsal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22,8 Q24,6 26,7", fill: C.fin, opacity: "0.25" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "18", cy: "18", rx: "4", ry: "2", fill: C.fin, opacity: "0.35", transform: "rotate(-15,18,18)", className: "fish-pectoral" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#ntsh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8", fill: `url(#ntb-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8", fill: `url(#ntd-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8", fill: `url(#ntbl-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#ntclip-${uid})`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#ntgl-${uid})`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "10", y: "12", width: "28", height: "3", rx: "1.5", fill: `url(#ntneon-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "12", y: "12.5", width: "24", height: "2", rx: "1", fill: C.neon2, opacity: "0.4" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "26", y: "15", width: "14", height: "6", fill: `url(#ntred-${uid})`, opacity: "0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "34", cy: "18", rx: "6", ry: "4", fill: C.red, opacity: "0.35" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8", fill: `url(#ntsp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "16", ry: "8", fill: "none", stroke: C.outline, strokeWidth: "0.6", opacity: "0.2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "14", r: "2.5", fill: "rgba(0,0,0,0.05)" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "13.5", r: "2.2", fill: "#fafafa" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "11", cy: "13.5", r: "1.6", fill: "#1a1a2a" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "10.3", cy: "12.8", r: "0.7", fill: "white" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "24", cy: "15", rx: "20", ry: "12", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "1.5", strokeDasharray: "3 2" })
  ] });
}
const NeonTetraSprite_default = reactExports.memo(NeonTetraSprite);
export {
  NeonTetraSprite_default as default
};
