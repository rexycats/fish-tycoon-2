import { r as reactExports, j as jsxRuntimeExports } from "./index-CC8U9sdC.js";
const AURA = { common: null, uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 }, rare: { color: "#c878ff", opacity: 0.28, blur: 8 }, epic: { color: "#ffe040", opacity: 0.4, blur: 10 }, legendary: { color: "#ff60ff", opacity: 0.55, blur: 14 } };
function CuttlefishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "ct").slice(0, 8), rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare", aura = AURA[rarity];
  const W = size * 1.2, H = size * 0.75;
  const C = {
    mantle: "#b89878",
    mantle2: "#806040",
    mantleLight: "#d8c0a8",
    mantleWhite: "#e8d8c0",
    shadow: "#403020",
    fin: "#a08868",
    finEdge: "#c0a888",
    tentacle: "#a08868",
    tentTip: "#c0a888",
    sucker: "#907858",
    band1: "#907050",
    band2: "#a08060",
    band3: "#c0a080",
    band4: "#806040",
    band5: "#b09070",
    eye: "#2a4020",
    eyeRim: "#405030",
    sclera: "#d0d8c8"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: H,
      viewBox: "0 0 100 58",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `ctsh-${uid}`, x: "-20%", y: "-20%", width: "140%", height: "160%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "3", floodColor: "#000", floodOpacity: "0.30" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `ctfg-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "1.8", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: C.finEdge, floodOpacity: "0.3", result: "c" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "c", in2: "blur", operator: "in", result: "glow" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glow" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ctb-${uid}`, cx: "32%", cy: "28%", r: "68%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.mantleWhite }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.mantleLight }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "58%", stopColor: C.mantle }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.mantle2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ctd-${uid}`, cx: "50%", cy: "0%", r: "82%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.shadow, stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "45%", stopColor: C.shadow, stopOpacity: "0.1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.shadow, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ctbl-${uid}`, cx: "50%", cy: "100%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.mantleWhite, stopOpacity: "0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.mantleWhite, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `ctsp-${uid}`, cx: "28%", cy: "20%", r: "42%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "white", stopOpacity: "0.12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `ctlat-${uid}`, x1: "0%", y1: "50%", x2: "100%", y2: "50%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: C.band3, stopOpacity: "0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "25%", stopColor: C.band3, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: C.band3, stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "75%", stopColor: C.band3, stopOpacity: "0.2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: C.band3, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `ctclip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `cta-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "b" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "b" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "40", ry: "24", fill: aura.color, opacity: aura.opacity, filter: `url(#cta-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#ctfg-${uid})`, className: "fish-tail-flowing", children: [
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
            const bx = 18 - i * 1;
            const by = 24 + i * 1.2;
            const mx = 8 - i * 2 + i % 2 * 3;
            const my = 22 + i * 1.8;
            const tx = 2 - i * 1.5 + i % 3 * 2;
            const ty = 20 + i * 2.2;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "path",
                {
                  d: `M${bx},${by} Q${mx},${my} ${tx},${ty}`,
                  stroke: C.tentacle,
                  strokeWidth: 2.5 - i * 0.15,
                  fill: "none",
                  strokeLinecap: "round",
                  opacity: 0.55 - i * 0.03
                }
              ),
              i < 6 && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: (bx + mx) / 2, cy: (by + my) / 2, r: "0.8", fill: C.sucker, opacity: "0.3" })
            ] }, i);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16,28 Q4,24 -4,26 Q-2,28 0,27", stroke: C.tentTip, strokeWidth: "1.5", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16,32 Q4,36 -4,34 Q-2,32 0,33", stroke: C.tentTip, strokeWidth: "1.5", fill: "none", strokeLinecap: "round", opacity: "0.4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "-3", cy: "26", rx: "2", ry: "1.5", fill: C.tentTip, opacity: "0.3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "-3", cy: "34", rx: "2", ry: "1.5", fill: C.tentTip, opacity: "0.3" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M84,29 Q90,22 88,16 Q86,22 84,29 Q86,36 88,42 Q90,36 84,29", fill: C.mantle, opacity: "0.35" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { filter: `url(#ctsh-${uid})`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: `url(#ctb-${uid})` }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: `url(#ctd-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: `url(#ctbl-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: `url(#ctlat-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("g", { clipPath: `url(#ctclip-${uid})`, children: [28, 38, 48, 58, 68].map((x, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: x,
              cy: "29",
              rx: "5",
              ry: "13",
              fill: [C.band1, C.band2, C.band3, C.band4, C.band5][i],
              opacity: 0.18 + i % 3 * 0.04
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x - 2, cy: 24 + i, r: "1", fill: C.mantle2, opacity: "0.1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: x + 2, cy: 33 - i, r: "0.8", fill: C.mantle2, opacity: "0.08" })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-dorsal", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M22,14 Q28,10 36,13 Q44,10 52,13 Q60,10 68,13 Q76,10 82,14",
              stroke: C.finEdge,
              strokeWidth: "3",
              fill: "none",
              strokeLinecap: "round",
              opacity: "0.4"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M24,15 Q30,12 38,14 Q46,12 54,14 Q62,12 70,14 Q76,12 80,15",
              stroke: C.fin,
              strokeWidth: "1.5",
              fill: "none",
              opacity: "0.25"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { className: "fish-anal-fin", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M22,44 Q28,48 36,45 Q44,48 52,45 Q60,48 68,45 Q76,48 82,44",
              stroke: C.finEdge,
              strokeWidth: "3",
              fill: "none",
              strokeLinecap: "round",
              opacity: "0.4"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: "M24,43 Q30,46 38,44 Q46,46 54,44 Q62,46 70,44 Q76,46 80,43",
              stroke: C.fin,
              strokeWidth: "1.5",
              fill: "none",
              opacity: "0.25"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: `url(#ctsp-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "34", ry: "17", fill: "none", stroke: C.shadow, strokeWidth: "0.9", opacity: "0.25" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M30,29 Q50,25 78,29", stroke: C.mantleLight, strokeWidth: "0.6", fill: "none", opacity: "0.15" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "27", r: "5.5", fill: "rgba(0,0,0,0.08)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "26.5", r: "5", fill: C.sclera }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "26.5", r: "4", fill: C.eyeRim }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22", cy: "26.5", r: "3.2", fill: C.eye }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M19,26.5 L20.5,24.5 L22,26.5 L23.5,24.5 L25,26.5", stroke: "#0a0a0a", strokeWidth: "2", fill: "none", strokeLinecap: "round" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "21", cy: "25", r: "1", fill: "rgba(255,255,255,0.25)" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "50", cy: "29", rx: "38", ry: "22", fill: "none", stroke: "rgba(240,192,64,0.5)", strokeWidth: "2", strokeDasharray: "5 3" })
      ]
    }
  );
}
const CuttlefishSprite_default = reactExports.memo(CuttlefishSprite);
export {
  CuttlefishSprite_default as default
};
