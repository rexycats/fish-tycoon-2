import { r as reactExports, j as jsxRuntimeExports } from "./index-CuAPajpT.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
function YellowTangSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "yt").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon", aura = AURA[rarity];
  const W = size * 1.05, H = size * 0.9;
  const C = {
    body: "#ffd020",
    body2: "#c8a010",
    belly: "#ffe840",
    light: "#fff060",
    shadow: "#806000",
    fin: "#f0c818",
    fin2: "#d0a010",
    lateral: "#ffffa0",
    scale: "#e8c030",
    outline: "#907008",
    spine: "#ffffff",
    eyeRing: "#e0c020",
    mouth: "#b09010"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      viewBox: "0 0 84 72",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `ytsh-${uid}`, x: "-22%", y: "-18%", width: "144%", height: "156%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.28" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `ytfg-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.lateral, floodOpacity: "0.3", result: "c" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ytb-${uid}`, cx: "30%", cy: "26%", r: "70%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "22%", stopColor: C.belly }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.body2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ytd-${uid}`, cx: "50%", cy: "0%", r: "82%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.shadow, stopOpacity: "0.38" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "45%", stopColor: C.shadow, stopOpacity: "0.08" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.shadow, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ytbl-${uid}`, cx: "50%", cy: "100%", r: "58%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.light, stopOpacity: "0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.light, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ytlat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lateral, stopOpacity: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.lateral, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lateral, stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "75%", stopColor: C.lateral, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lateral, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ytsp-${uid}`, cx: "26%", cy: "18%", r: "42%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "white", stopOpacity: "0.12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ytfin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.88" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.fin2, stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.fin, stopOpacity: "0.3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `ytclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `yta-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "32", ry: "26", fill: aura.color, opacity: aura.opacity, filter: `url(#yta-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#ytfg-${uid})`, className: "fish-tail", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M62,36 L74,26 L72,36 L74,46 Z", fill: `url(#ytfin-${uid})`, stroke: C.fin2, strokeWidth: "0.6", strokeOpacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "64", y1: "36", x2: "72", y2: "28", stroke: C.fin2, strokeWidth: "0.4", opacity: "0.2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "64", y1: "36", x2: "72", y2: "44", stroke: C.fin2, strokeWidth: "0.4", opacity: "0.2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-dorsal", filter: `url(#ytfg-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M26,12 C32,2 44,0 58,6 L56,20", fill: `url(#ytfin-${uid})`, stroke: C.fin2, strokeWidth: "0.6", strokeOpacity: "0.4" }),
          [30, 36, 42, 48, 54].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 18 - i * 0.5, x2: x + 2, y2: 6 - i * 0.3, stroke: C.fin2, strokeWidth: "0.3", opacity: "0.18" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-anal-fin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M26,60 C32,70 44,72 58,66 L56,52", fill: `url(#ytfin-${uid})`, stroke: C.fin2, strokeWidth: "0.5", strokeOpacity: "0.3" }),
          [32, 40, 48, 54].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 54 + i * 0.5, x2: x + 2, y2: 66 + i * 0.3, stroke: C.fin2, strokeWidth: "0.3", opacity: "0.15" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "28", cy: "42", rx: "9", ry: "4.5", fill: `url(#ytfin-${uid})`, transform: "rotate(-22,28,42)", className: "fish-pectoral", filter: `url(#ytfg-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#ytsh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: `url(#ytb-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: `url(#ytd-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: `url(#ytbl-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: `url(#ytlat-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#ytclip-${uid})`, opacity: "0.1", children: [
          [18, 26, 34, 42, 50, 58].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${x},18 Q${x + 4},36 ${x},54`, stroke: C.scale, strokeWidth: "0.6", fill: "none" }, i)),
          [22, 28, 34, 40, 46].map((y, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "14", y1: y, x2: "62", y2: y, stroke: C.scale, strokeWidth: "0.4" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: `url(#ytsp-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "26", ry: "22", fill: "none", stroke: C.outline, strokeWidth: "0.9", opacity: "0.3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M60,34 L66,35 L60,36", fill: C.spine, opacity: "0.7" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "35", r: "2", fill: C.spine, opacity: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "35", r: "1", fill: C.spine, opacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "35", r: "3.5", fill: "none", stroke: C.spine, strokeWidth: "0.6", opacity: "0.25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M26,28 Q27,36 26,44", stroke: C.shadow, strokeWidth: "1", fill: "none", opacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,38 Q10,39 12,40", stroke: C.mouth, strokeWidth: "1", fill: "none", strokeLinecap: "round", opacity: "0.45" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,37 Q14,36 18,37", stroke: C.outline, strokeWidth: "0.5", fill: "none", opacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "34", r: "5", fill: "rgba(0,0,0,0.08)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "33.5", r: "4.5", fill: "#fafafa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "33.5", r: "3.5", fill: C.eyeRing }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "33.5", r: "2.5", fill: "#0a0a12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18.5", cy: "32", r: "1.3", fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "21", cy: "34.5", r: "0.5", fill: "rgba(255,255,255,0.3)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "34", r: "0.8", fill: C.shadow, opacity: "0.25" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "38", cy: "36", rx: "30", ry: "26", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
      ]
    }
  );
}
const YellowTangSprite_default = reactExports.memo(YellowTangSprite);
export {
  YellowTangSprite_default as default
};
