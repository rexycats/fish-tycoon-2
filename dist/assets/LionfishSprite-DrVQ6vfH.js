import { r as reactExports, j as jsxRuntimeExports } from "./index-CE3JIcOM.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 }
};
function LionfishSprite({ fish, size = 60, flipped = false, selected = false, onClick }) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "lf").slice(0, 8);
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare";
  const aura = RARITY_AURA[rarity];
  const variant = (fish == null ? void 0 : fish.colorVariant) || "default";
  const W = size;
  const _h = size * 0.85;
  const variantStyle = variant === "black" ? { filter: "saturate(0.5) brightness(0.6)" } : variant === "golden" ? { filter: "hue-rotate(30deg) saturate(1.3) brightness(1.1)" } : {};
  const spines = [];
  for (let i = 0; i < 7; i++) {
    const angle = -70 + i * 20;
    const rad = angle * Math.PI / 180;
    const len = 22 + i % 3 * 5;
    const sx = 42, sy = 35;
    const ex = sx + Math.cos(rad) * len;
    const ey = sy + Math.sin(rad) * len;
    spines.push({ sx, sy, ex, ey, i });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 90 76",
      onClick,
      style: { cursor: onClick ? "pointer" : "default", transform: flipped ? "scaleX(-1)" : "none", overflow: "visible", ...variantStyle },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `lfsh-${uid}`, x: "-25%", y: "-25%", width: "150%", height: "160%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "3", stdDeviation: "2.5", floodColor: "#000", floodOpacity: "0.3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `lfbody-${uid}`, cx: "30%", cy: "30%", r: "65%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f0d0c0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "40%", stopColor: "#cc4020" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#801008" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `lfspec-${uid}`, cx: "28%", cy: "22%", r: "35%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "white", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "white", stopOpacity: "0" })
          ] }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `lfaura-${uid}`, x: "-60%", y: "-60%", width: "220%", height: "220%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur, result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "blur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "38", rx: "35", ry: "30", fill: aura.color, opacity: aura.opacity, filter: `url(#lfaura-${uid})` }),
        spines.map(({ sx, sy, ex, ey, i }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: sx, y1: sy, x2: ex, y2: ey, stroke: "#cc3020", strokeWidth: "1.2", opacity: "0.7" }),
          i < 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M${sx},${sy} L${ex},${ey} L${sx + Math.cos((-70 + (i + 1) * 20) * Math.PI / 180) * (22 + (i + 1) % 3 * 5)},${sy + Math.sin((-70 + (i + 1) * 20) * Math.PI / 180) * (22 + (i + 1) % 3 * 5)} Z`,
              fill: "rgba(200,60,30,0.12)",
              stroke: "none"
            }
          )
        ] }, i)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M35,40 Q20,50 15,65 Q25,55 32,45", fill: "rgba(180,50,20,0.3)", stroke: "rgba(160,40,15,0.4)", strokeWidth: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M35,40 Q15,45 10,60 Q22,50 32,43", fill: "rgba(180,50,20,0.25)", stroke: "rgba(160,40,15,0.3)", strokeWidth: "0.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M35,40 Q25,55 22,70 Q30,58 34,46", fill: "rgba(180,50,20,0.2)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M68,36 L82,28 L80,36 L82,44 Z", fill: "rgba(180,50,20,0.5)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { filter: `url(#lfsh-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "36", rx: "26", ry: "16", fill: `url(#lfbody-${uid})` }),
          [22, 30, 38, 46, 54, 62].map((x, i) => {
            const h = Math.sqrt(Math.max(0, 676 - (x - 42) * (x - 42))) * 16 / 26;
            return /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: x, y1: 36 - h, x2: x, y2: 36 + h, stroke: "rgba(255,240,230,0.45)", strokeWidth: "2" }, i);
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "40", cy: "44", rx: "16", ry: "6", fill: "rgba(255,220,200,0.15)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "36", rx: "26", ry: "16", fill: `url(#lfspec-${uid})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "33", r: "4", fill: "#200800" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "33", r: "2.5", fill: "#401000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "24", cy: "33", r: "1.5", fill: "#ff6030", opacity: "0.4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "22.5", cy: "31.5", r: "1.3", fill: "white", opacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M18,28 Q15,20 20,15 Q22,22 24,28", fill: "rgba(200,60,20,0.4)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M22,27 Q20,18 25,12 Q26,20 26,27", fill: "rgba(200,60,20,0.35)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "42", cy: "70", rx: "20", ry: "2.5", fill: "#000", opacity: "0.08" }),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "42",
            cy: "36",
            rx: "38",
            ry: "28",
            fill: "none",
            stroke: "#f0c040",
            strokeWidth: "1.5",
            strokeDasharray: "4 3",
            opacity: "0.9",
            style: { animation: "shimmer-ring-march 0.9s linear infinite" }
          }
        )
      ]
    }
  );
}
const LionfishSprite_default = reactExports.memo(LionfishSprite);
export {
  LionfishSprite_default as default
};
