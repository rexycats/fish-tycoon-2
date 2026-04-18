import { r as reactExports, j as jsxRuntimeExports } from "./index-CC8U9sdC.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
function JellyfishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "jf").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare", aura = AURA[rarity];
  const W = size * 0.85, H = size * 1.1;
  const C = { rim: "rgba(180,200,230,0.5)", glow: "rgba(140,180,220,0.15)", tent: "rgba(180,200,230,0.3)", oral: "rgba(200,180,220,0.4)" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: W, height: H, viewBox: "0 0 60 76", onClick, style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `jfgl-${uid}`, x: "-40%", y: "-30%", width: "180%", height: "170%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "4", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `jffg-${uid}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: "rgba(180,200,240,0.3)", result: "c" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jfb-${uid}`, cx: "50%", cy: "35%", r: "55%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(230,240,255,0.4)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "rgba(200,220,240,0.3)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(160,190,220,0.15)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jfsp-${uid}`, cx: "35%", cy: "25%", r: "40%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `jfgon-${uid}`, cx: "50%", cy: "50%", r: "50%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "rgba(240,200,255,0.6)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "rgba(220,180,240,0.2)" })
      ] }),
      aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `jfa-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
        ] })
      ] })
    ] }),
    aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "30", rx: "26", ry: "28", fill: aura.color, opacity: aura.opacity, filter: `url(#jfa-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#jffg-${uid})`, className: "fish-tail-flowing", children: [12, 18, 24, 30, 36, 42, 48].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: `M${x},${42 + i % 2 * 2} Q${x + (i % 2 === 0 ? -4 : 4)},${52 + i % 3 * 2} ${x + (i % 2 === 0 ? 2 : -2)},${62 + i % 2 * 4} Q${x + (i % 2 === 0 ? -3 : 3)},${68 + i % 3} ${x},${72 + i % 2 * 2}`,
        stroke: C.tent,
        strokeWidth: 1.5 - i * 0.08,
        fill: "none",
        strokeLinecap: "round",
        opacity: 0.4 - i * 0.02
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { className: "fish-anal-fin", children: [22, 30, 38].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        d: `M${x},40 Q${x + (i % 2 === 0 ? -6 : 6)},50 ${x + (i % 2 === 0 ? 3 : -3)},58 Q${x + (i % 2 === 0 ? -4 : 4)},64 ${x},68`,
        stroke: C.oral,
        strokeWidth: 2.5 - i * 0.3,
        fill: "none",
        strokeLinecap: "round",
        opacity: 0.45 - i * 0.05
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#jfgl-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "26", rx: "22", ry: "18", fill: `url(#jfb-${uid})` }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "26", rx: "22", ry: "18", fill: C.glow }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M8,36 Q12,40 16,36 Q20,40 24,36 Q28,40 32,36 Q36,40 40,36 Q44,40 48,36 Q52,40 52,36", stroke: C.rim, strokeWidth: "1.5", fill: "none", strokeLinecap: "round" }),
    [16, 22, 28, 34, 40].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: "14", x2: x, y2: "36", stroke: "rgba(200,220,240,0.1)", strokeWidth: "0.6" }, i)),
    [18, 26, 34, 42].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${x - 3},24 Q${x},20 ${x + 3},24 Q${x},28 ${x - 3},24`, fill: `url(#jfgon-${uid})`, opacity: "0.6" }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "26", rx: "22", ry: "18", fill: `url(#jfsp-${uid})` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "26", rx: "22", ry: "18", fill: "none", stroke: "rgba(200,220,240,0.2)", strokeWidth: "0.8" }),
    selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "30", cy: "30", rx: "26", ry: "28", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
  ] });
}
const JellyfishSprite_default = reactExports.memo(JellyfishSprite);
export {
  JellyfishSprite_default as default
};
