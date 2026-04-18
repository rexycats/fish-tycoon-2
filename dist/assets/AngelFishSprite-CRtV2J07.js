import { r as reactExports, j as jsxRuntimeExports } from "./index-Rpas-Nvj.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 },
  legendary: { color: "#ff8040", opacity: 0.55, blur: 14 }
};
function AngelFishSprite({
  fish,
  size = 60,
  flipped = false,
  selected = false,
  onClick
}) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "af").slice(0, 8);
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon";
  const aura = RARITY_AURA[rarity];
  const stage = (fish == null ? void 0 : fish.stage) || "adult";
  const variantKey = (fish == null ? void 0 : fish.colorVariant) || "default";
  const variantStyle = (() => {
    switch (variantKey) {
      case "gold":
        return { filter: "sepia(0.6) saturate(1.8) brightness(1.1)" };
      case "marble":
        return { filter: "saturate(0.25) contrast(1.15)" };
      case "smoky":
        return { filter: "saturate(0.12) brightness(0.40)" };
      default:
        return {};
    }
  })();
  const W = size * 0.82;
  const _h = size * 1.2;
  if (stage === "egg") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size * 0.48,
        height: size * 0.58,
        viewBox: "0 0 28 34",
        onClick,
        style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egg-af-${uid}`, cx: "36%", cy: "30%", r: "60%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#e8f2f8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#b8ccd8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#7890a0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `egg-af-sh-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodColor: "#000", floodOpacity: "0.32" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "14",
              cy: "23",
              rx: "8",
              ry: "11",
              fill: `url(#egg-af-${uid})`,
              filter: `url(#egg-af-sh-${uid})`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "10", cy: "17", rx: "3", ry: "3.5", fill: "#d4c070", opacity: "0.30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "17", cy: "28", rx: "2", ry: "2.5", fill: "#506070", opacity: "0.20" })
        ]
      }
    );
  }
  const isJuvenile = stage === "juvenile";
  const barCount = isJuvenile ? 1 : 3;
  const filamentScale = isJuvenile ? 0.5 : 1;
  const bodyOpacity = isJuvenile ? 0.82 : 1;
  const finOpacity = isJuvenile ? 0.5 : 0.72;
  const fs = filamentScale;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 90 120",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible",
        ...variantStyle
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `af-sh-${uid}`, x: "-30%", y: "-25%", width: "160%", height: "160%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "4", floodColor: "#101820", floodOpacity: "0.50" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `af-aura-${uid}`, x: "-50%", y: "-40%", width: "200%", height: "180%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `af-body-clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "46", cy: "65", rx: "20", ry: "28" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-body-${uid}`, cx: "35%", cy: "28%", r: "68%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#eaf4f8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "38%", stopColor: "#c8dce8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#7090a8" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-gold-${uid}`, cx: "62%", cy: "25%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d4c070", stopOpacity: "0.38" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#c8b050", stopOpacity: "0.12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#d4c070", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-belly-${uid}`, cx: "50%", cy: "82%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d8eef8", stopOpacity: "0.30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c8dce8", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-dorsal-${uid}`, cx: "50%", cy: "0%", r: "60%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#203040", stopOpacity: "0.28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#203040", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-spec-${uid}`, cx: "34%", cy: "26%", r: "30%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.82" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#ffffff", stopOpacity: "0.18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `af-fin-${uid}`, x1: "0.5", y1: "5", x2: "0.5", y2: "6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#c0d8e8", stopOpacity: "0.80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#8090a0", stopOpacity: "0.20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `af-dfin-${uid}`, x1: "0.5", y1: "5", x2: "0.5", y2: "6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#a0b8c8", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c0d8e8", stopOpacity: "0.85" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `af-anlfin-${uid}`, x1: "0.5", y1: "6", x2: "0.5", y2: "5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#a0b8c8", stopOpacity: "0.55" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c0d8e8", stopOpacity: "0.85" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `af-tail-${uid}`, x1: "1", y1: "0.5", x2: "0", y2: "0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#b0c8d8", stopOpacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#6080a0", stopOpacity: "0.30" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `af-pec-${uid}`, cx: "70%", cy: "30%", r: "70%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d8ecf8", stopOpacity: "0.72" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#8090a8", stopOpacity: "0.15" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: `af-scale-${uid}`, x: "0", y: "5", width: "6", height: "7", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "3",
              cy: "3.5",
              rx: "2.5",
              ry: "3",
              fill: "none",
              stroke: "#7090a8",
              strokeWidth: "0.32",
              opacity: "0.18"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `af-finglow-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { in: "SourceAlpha", stdDeviation: "2.0", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: "#c0d8e8", floodOpacity: "0.50", result: "colour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feComposite", { in: "colour", in2: "blur", operator: "in", result: "glowColour" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "glowColour" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "30",
            ry: "40",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#af-aura-${uid})`
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "31",
            ry: "41",
            fill: "none",
            stroke: "#ffe040",
            strokeWidth: "2.2",
            opacity: "0.85"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `
        M 26 57
        C 18 51, 10 45, ${8 - 4 * fs} ${43 - 8 * fs}
        C ${10 - 2 * fs} ${41 - 6 * fs}, 16 47, 24 55
        Z
      `,
            fill: `url(#af-tail-${uid})`,
            opacity: finOpacity,
            filter: `url(#af-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `
        M 26 63
        C 18 69, 10 75, ${8 - 4 * fs} ${77 + 8 * fs}
        C ${10 - 2 * fs} ${79 + 6 * fs}, 16 73, 24 65
        Z
      `,
            fill: `url(#af-tail-${uid})`,
            opacity: finOpacity,
            filter: `url(#af-finglow-${uid})`
          }
        ),
        [
          [26, 57, 8 - 4 * fs, 43 - 8 * fs],
          [26, 60, 7 - 3 * fs, 60],
          [26, 63, 8 - 4 * fs, 77 + 8 * fs]
        ].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#506070",
            strokeWidth: "0.5",
            opacity: 0.28 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `
        M 35 32
        C 34 23, 38 15, 50 12
        C 58 10, 64 15, 65 23
        C 64 27, 62 32, 62 32
        Z
      `,
            fill: `url(#af-dfin-${uid})`,
            opacity: finOpacity,
            filter: `url(#af-finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `
        M 35 32
        C 32 25, 28 19, ${24 - 10 * fs} ${13 - 8 * fs}
      `,
            fill: "none",
            stroke: "#8090a0",
            strokeWidth: 1,
            strokeLinecap: "round",
            opacity: 0.6 * finOpacity
          }
        ),
        [
          [40, 32, 38, 17],
          [48, 32, 48, 12],
          [56, 32, 58, 16],
          [62, 32, 64, 23]
        ].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#6080a0",
            strokeWidth: "0.5",
            opacity: 0.25 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 35 32 C 34 23, 38 15, 50 12 C 58 10, 64 15, 65 23",
            fill: "none",
            stroke: "#141820",
            strokeWidth: "0.8",
            opacity: 0.45 * finOpacity
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `
        M 35 88
        C 34 97, 38 105, 50 108
        C 58 110, 64 105, 65 97
        C 64 93, 62 88, 62 88
        Z
      `,
            fill: `url(#af-anlfin-${uid})`,
            opacity: finOpacity,
            filter: `url(#af-finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `
        M 35 88
        C 32 95, 28 101, ${24 - 10 * fs} ${107 + 8 * fs}
      `,
            fill: "none",
            stroke: "#8090a0",
            strokeWidth: 1,
            strokeLinecap: "round",
            opacity: 0.6 * finOpacity
          }
        ),
        [
          [40, 88, 38, 103],
          [48, 88, 48, 108],
          [56, 88, 58, 104],
          [62, 88, 64, 97]
        ].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#6080a0",
            strokeWidth: "0.5",
            opacity: 0.25 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 35 88 C 34 97, 38 105, 50 108 C 58 110, 64 105, 65 97",
            fill: "none",
            stroke: "#141820",
            strokeWidth: "0.8",
            opacity: 0.45 * finOpacity
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `
        M 66 57
        C 70 61, 72 67, 70 73
        C 68 69, 66 63, 66 57
        Z
      `,
            fill: `url(#af-pec-${uid})`,
            opacity: finOpacity * 0.75
          }
        ),
        [[66, 57, 70, 71], [66, 57, 68, 73]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#6080a0",
            strokeWidth: "0.4",
            opacity: 0.2 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-body-${uid})`,
            opacity: bodyOpacity,
            filter: `url(#af-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#af-body-clip-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "59", y: "32", width: "7", height: "56", fill: "#141820", opacity: "0.88" }),
          barCount >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "42", y: "32", width: "9", height: "56", fill: "#141820", opacity: "0.82" }),
          barCount >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "25", y: "32", width: "6", height: "56", fill: "#141820", opacity: "0.72" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-gold-${uid})`,
            opacity: bodyOpacity,
            clipPath: `url(#af-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-belly-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-dorsal-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-scale-${uid})`,
            opacity: "0.50",
            clipPath: `url(#af-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "60",
            rx: "20",
            ry: "28",
            fill: `url(#af-spec-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "65", cy: "51", r: "5.0", fill: "#141820" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "65", cy: "51", r: "3.6", fill: "#202830" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "65", cy: "51", r: "2.4", fill: "#0a0e14" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "63.6", cy: "44.6", r: "1.1", fill: "#ffffff", opacity: "0.92" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "66.4", cy: "47.4", r: "0.5", fill: "#ffffff", opacity: "0.42" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "65",
            cy: "51",
            r: "5.0",
            fill: "none",
            stroke: "#c8b050",
            strokeWidth: "0.7",
            opacity: "0.45"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 72 55 Q 74.5 53.5, 73 52",
            fill: "none",
            stroke: "#141820",
            strokeWidth: "1.0",
            strokeLinecap: "round",
            opacity: "0.65"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 28 59 Q 46 55, 64 57",
            fill: "none",
            stroke: "#d0e8f0",
            strokeWidth: "0.45",
            opacity: "0.20"
          }
        ),
        isJuvenile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "46",
            y: "113",
            textAnchor: "middle",
            fontSize: "5",
            fill: "#8090a8",
            opacity: "0.75",
            fontFamily: "sans-serif",
            fontWeight: "bold",
            children: "juvenile"
          }
        )
      ]
    }
  );
}
const AngelFishSprite_default = reactExports.memo(
  AngelFishSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.stage) === ((_d = next.fish) == null ? void 0 : _d.stage) && ((_e = prev.fish) == null ? void 0 : _e.health) === ((_f = next.fish) == null ? void 0 : _f.health) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && ((_i = prev.fish) == null ? void 0 : _i.colorVariant) === ((_j = next.fish) == null ? void 0 : _j.colorVariant) && prev.selected === next.selected && prev.size === next.size && prev.flipped === next.flipped;
  }
);
export {
  AngelFishSprite_default as default
};
