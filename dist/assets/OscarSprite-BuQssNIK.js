import { r as reactExports, j as jsxRuntimeExports } from "./index-Dj6wWOWJ.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
const PALETTES = {
  default: { b: "#383838", b2: "#181818", bl: "#4a4a4a", lt: "#5a5a5a", sh: "#0a0a0a", ac: "#d87020", ac2: "#c06018", ac3: "#e08830", fin: "#303030", fin2: "#1a1a1a", lat: "#584020", outline: "#080808", eyeRing: "#c83020", mouth: "#282828" },
  albino: { b: "#f0e0c0", b2: "#d0b890", bl: "#f8edd0", lt: "#fff8e8", sh: "#907850", ac: "#e0a060", ac2: "#d09050", ac3: "#f0b070", fin: "#d8c8a8", fin2: "#c0b090", lat: "#e0c080", outline: "#a09070", eyeRing: "#e08060", mouth: "#b0a080" },
  red: { b: "#802020", b2: "#401010", bl: "#903030", lt: "#a04040", sh: "#200808", ac: "#ff4020", ac2: "#d03018", ac3: "#ff6040", fin: "#602020", fin2: "#401010", lat: "#c04030", outline: "#300808", eyeRing: "#ff3020", mouth: "#501818" }
};
function OscarSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "os").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon", aura = AURA[rarity];
  const v = (fish == null ? void 0 : fish.colorVariant) || "default";
  const C = PALETTES[v] || PALETTES.default;
  const W = size * 1.15, H = size * 0.9;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      viewBox: "0 0 92 72",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `ossh-${uid}`, x: "-22%", y: "-18%", width: "144%", height: "156%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.35" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `osfg-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.2", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.ac, floodOpacity: "0.35", result: "c" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `osb-${uid}`, cx: "30%", cy: "26%", r: "70%", fx: "26%", fy: "20%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "22%", stopColor: C.bl }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: C.b }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.b2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `osd-${uid}`, cx: "50%", cy: "0%", r: "82%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.sh, stopOpacity: "0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "45%", stopColor: C.sh, stopOpacity: "0.1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.sh, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `osbl-${uid}`, cx: "50%", cy: "100%", r: "58%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lt, stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lt, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `oslat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.lat, stopOpacity: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.lat, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.lat, stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "75%", stopColor: C.lat, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.lat, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ossp-${uid}`, cx: "26%", cy: "18%", r: "42%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "white", stopOpacity: "0.08" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `osfin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.fin, stopOpacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.fin2, stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.fin, stopOpacity: "0.3" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `osclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `osa-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "36", ry: "28", fill: aura.color, opacity: aura.opacity, filter: `url(#osa-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#osfg-${uid})`, className: "fish-tail", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M68,36 L82,24 L80,36 L82,48 Z", fill: `url(#osfin-${uid})`, stroke: C.fin, strokeWidth: "0.7", strokeOpacity: "0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "70", y1: "36", x2: "78", y2: "28", stroke: C.fin, strokeWidth: "0.4", opacity: "0.2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "70", y1: "36", x2: "80", y2: "36", stroke: C.fin, strokeWidth: "0.3", opacity: "0.15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "70", y1: "36", x2: "78", y2: "44", stroke: C.fin, strokeWidth: "0.4", opacity: "0.2" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-dorsal", filter: `url(#osfg-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,10 C34,2 46,0 62,6 L58,18", fill: `url(#osfin-${uid})`, stroke: C.fin, strokeWidth: "0.6", strokeOpacity: "0.4" }),
          [32, 38, 44, 50, 56].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 16 - i, x2: x + 2, y2: 5 - i * 0.5, stroke: C.fin, strokeWidth: "0.3", opacity: "0.2" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-anal-fin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,62 C34,70 46,72 62,66 L58,54", fill: `url(#osfin-${uid})`, stroke: C.fin, strokeWidth: "0.5", strokeOpacity: "0.3" }),
          [34, 42, 50, 56].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 56 + i, x2: x + 2, y2: 67 + i * 0.5, stroke: C.fin, strokeWidth: "0.3", opacity: "0.15" }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "28", cy: "46", rx: "10", ry: "5.5", fill: `url(#osfin-${uid})`, transform: "rotate(-22,28,46)", className: "fish-pectoral", filter: `url(#osfg-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#ossh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: `url(#osb-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: `url(#osd-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: `url(#osbl-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: `url(#oslat-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#osclip-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "54", cy: "32", rx: "14", ry: "10", fill: C.ac, opacity: "0.45" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "48", cy: "40", rx: "12", ry: "8", fill: C.ac2, opacity: "0.35" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "58", cy: "38", rx: "8", ry: "6.5", fill: C.ac3, opacity: "0.28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "30", rx: "6", ry: "5", fill: C.ac2, opacity: "0.22" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "62", cy: "34", rx: "5", ry: "4", fill: C.ac, opacity: "0.18" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "36", r: "5", fill: C.sh, opacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "36", r: "3.5", fill: C.ac, opacity: "0.6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "64", cy: "36", r: "1.5", fill: C.sh, opacity: "0.5" }),
          [25, 33, 41, 49, 57].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("g", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: `M${x},26 Q${x + 4},36 ${x},46`, stroke: C.bl, strokeWidth: "0.5", fill: "none", opacity: "0.12" }) }, i))
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: `url(#ossp-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "30", ry: "25", fill: "none", stroke: C.outline, strokeWidth: "1", opacity: "0.3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M26,24 Q28,36 26,48", stroke: C.sh, strokeWidth: "1.2", fill: "none", opacity: "0.25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M28,26 Q29,36 28,46", stroke: C.sh, strokeWidth: "0.6", fill: "none", opacity: "0.15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,40 Q10,42 12,44", stroke: C.mouth, strokeWidth: "1.5", fill: "none", strokeLinecap: "round", opacity: "0.45" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12,39 Q14,38 18,39", stroke: C.outline, strokeWidth: "0.6", fill: "none", opacity: "0.2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "32", r: "8", fill: "rgba(0,0,0,0.1)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "31.5", r: "7.5", fill: C.eyeRing }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "31.5", r: "6", fill: "#fafafa" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "31.5", r: "4.5", fill: "#0a0a12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "18", cy: "29.5", r: "2", fill: "white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "33", r: "0.8", fill: "rgba(255,255,255,0.3)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "20", cy: "31.5", r: "5.5", fill: "none", stroke: C.eyeRing, strokeWidth: "0.8", opacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "14", cy: "30", r: "1", fill: C.sh, opacity: "0.3" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "36", rx: "34", ry: "29", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
      ]
    }
  );
}
const OscarSprite_default = reactExports.memo(OscarSprite);
export {
  OscarSprite_default as default
};
