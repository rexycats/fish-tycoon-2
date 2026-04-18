import { r as reactExports, j as jsxRuntimeExports } from "./index-CHk9lW5X.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 },
  legendary: { color: "#ff8040", opacity: 0.55, blur: 14 }
};
const VARIANTS = {
  // Default: classic orange-gold fancy goldfish
  default: {
    body: "#e8820a",
    body2: "#c86008",
    belly: "#f8c868",
    hi: "#ffd090",
    fin: "#c86808",
    fin2: "#e8a020",
    scale: "#fff8d0",
    eyeRing: null
  },
  // Rare kohaku: white body with red "cap" patch on head
  kohaku: {
    body: "#f5f0e8",
    body2: "#d8d0c0",
    belly: "#ffffff",
    hi: "#ffffff",
    fin: "#e8ddd0",
    fin2: "#f0ece8",
    scale: "#ffffff",
    eyeRing: null,
    capColor: "#d83018"
    // red cap on dorsal-head area
  },
  // Rare calico: orange body with black and white patches
  calico: {
    body: "#e89030",
    body2: "#c87010",
    belly: "#f8d080",
    hi: "#ffe0a0",
    fin: "#c05010",
    fin2: "#d87020",
    scale: "#fff0c0",
    eyeRing: null,
    patch1: "#1a1008",
    // black patch
    patch2: "#f8f4f0"
    // white patch
  },
  // Mutated/melanistic: deep charcoal black moor
  black: {
    body: "#2a2018",
    body2: "#18120c",
    belly: "#483830",
    hi: "#685040",
    fin: "#1a100a",
    fin2: "#382818",
    scale: "#605040",
    eyeRing: "#c8a070"
    // telescope-eye gold ring
  }
};
function GoldfishSprite({
  fish,
  size = 60,
  flipped = false,
  selected = false,
  onClick
}) {
  var _a, _b;
  const uid = ((fish == null ? void 0 : fish.id) || "gf").slice(0, 8);
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon";
  const aura = RARITY_AURA[rarity];
  const stage = (fish == null ? void 0 : fish.stage) || "adult";
  const variantKey = (fish == null ? void 0 : fish.colorVariant) || ((_b = fish == null ? void 0 : fish.species) == null ? void 0 : _b.colorVariant) || "default";
  const V = VARIANTS[variantKey] || VARIANTS.default;
  if (stage === "egg") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size * 0.55,
        height: size * 0.65,
        viewBox: "0 0 33 40",
        onClick,
        style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egg-gf-${uid}`, cx: "38%", cy: "32%", r: "58%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffd090" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#e8820a" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#a05008" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `egg-gf-sh-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodColor: "#000", floodOpacity: "0.32" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "16",
              cy: "24",
              rx: "10",
              ry: "14",
              fill: `url(#egg-gf-${uid})`,
              filter: `url(#egg-gf-sh-${uid})`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "11", cy: "17", rx: "3.5", ry: "4", fill: "#ffd090", opacity: "0.45" })
        ]
      }
    );
  }
  const isJuvenile = stage === "juvenile";
  const tailOpacity = isJuvenile ? 0.55 : 0.82;
  const bodyOpacity = isJuvenile ? 0.85 : 1;
  const finOpacity = isJuvenile ? 0.5 : 0.72;
  const ts = isJuvenile ? 0.6 : 1;
  const W = size;
  const _h = size * 0.8;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 100 80",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `gf-sh-${uid}`, x: "-30%", y: "-30%", width: "160%", height: "180%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "5", stdDeviation: "4", floodColor: "#1a0800", floodOpacity: "0.48" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `gf-aura-${uid}`, x: "-55%", y: "-45%", width: "210%", height: "195%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `gf-body-clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "55", cy: "42", rx: "28", ry: "24" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `gf-body-${uid}`, cx: "32%", cy: "26%", r: "72%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: V.hi }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "42%", stopColor: V.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: V.body2 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `gf-belly-${uid}`, cx: "50%", cy: "88%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: V.belly, stopOpacity: "0.75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: V.belly, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `gf-dshadow-${uid}`, cx: "50%", cy: "0%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: V.body2, stopOpacity: "0.48" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: V.body2, stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `gf-fin-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: V.fin2, stopOpacity: "0.90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: V.fin, stopOpacity: "0.55" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `gf-tail-${uid}`, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: V.fin2, stopOpacity: "0.82" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "70%", stopColor: V.fin, stopOpacity: "0.60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: V.fin, stopOpacity: "0.30" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `gf-spec-${uid}`, cx: "34%", cy: "26%", r: "28%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.72" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `gf-finglow-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "2.0", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: V.fin2, floodOpacity: "0.40", result: "colour" }),
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
            cx: "55",
            cy: "42",
            rx: "34",
            ry: "30",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#gf-aura-${uid})`
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "42",
            rx: "36",
            ry: "32",
            fill: "none",
            stroke: "#fff",
            strokeWidth: "2",
            opacity: "0.70"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `
          M 27 ${42 - 4}
          C ${27 - 18 * ts} ${42 - 22 * ts},
            ${27 - 28 * ts} ${42 - 28 * ts},
            ${27 - 30 * ts} ${42 - 18 * ts}
          C ${27 - 26 * ts} ${42 - 8 * ts},
            ${27 - 14 * ts} ${42 - 4 * ts},
            27 ${42 + 2}
          Z
        `,
            fill: `url(#gf-tail-${uid})`,
            opacity: tailOpacity,
            filter: `url(#gf-finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `
          M 27 ${42 + 4}
          C ${27 - 18 * ts} ${42 + 22 * ts},
            ${27 - 28 * ts} ${42 + 28 * ts},
            ${27 - 30 * ts} ${42 + 18 * ts}
          C ${27 - 26 * ts} ${42 + 8 * ts},
            ${27 - 14 * ts} ${42 + 4 * ts},
            27 ${42 - 2}
          Z
        `,
            fill: `url(#gf-tail-${uid})`,
            opacity: tailOpacity,
            filter: `url(#gf-finglow-${uid})`
          }
        ),
        [0.2, 0.42, 0.6, 0.78].map((t, i) => {
          const lx = 27 - 22 * ts * t;
          const topY = 42 - 4 + t * (-14 * ts);
          const botY = 42 + 4 + t * (14 * ts);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: "27",
              y1: "42",
              x2: lx,
              y2: i < 2 ? topY : botY,
              stroke: V.fin,
              strokeWidth: "0.6",
              opacity: "0.38"
            },
            i
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 40 62 C 34 72, 28 74, 26 68 C 28 64, 36 62, 40 62 Z`,
            fill: `url(#gf-fin-${uid})`,
            opacity: finOpacity * 0.8,
            filter: `url(#gf-finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "42",
            rx: "28",
            ry: "24",
            fill: `url(#gf-body-${uid})`,
            filter: `url(#gf-sh-${uid})`,
            opacity: bodyOpacity
          }
        ),
        V.capColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "76",
            cy: "36",
            rx: "10",
            ry: "9",
            fill: V.capColor,
            clipPath: `url(#gf-body-clip-${uid})`,
            opacity: "0.82"
          }
        ),
        V.patch1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "60",
              cy: "38",
              rx: "9",
              ry: "7",
              fill: V.patch1,
              clipPath: `url(#gf-body-clip-${uid})`,
              opacity: "0.60"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "46",
              cy: "50",
              rx: "7",
              ry: "6",
              fill: V.patch2,
              clipPath: `url(#gf-body-clip-${uid})`,
              opacity: "0.55"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "54",
            rx: "22",
            ry: "16",
            fill: `url(#gf-belly-${uid})`,
            clipPath: `url(#gf-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "58",
            cy: "22",
            rx: "22",
            ry: "16",
            fill: `url(#gf-dshadow-${uid})`,
            clipPath: `url(#gf-body-clip-${uid})`
          }
        ),
        [
          [52, 38],
          [62, 35],
          [72, 40],
          [58, 48],
          [68, 50],
          [48, 46],
          [76, 44]
        ].map(([sx, sy], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: sx,
            cy: sy,
            rx: "2.2",
            ry: "1.4",
            fill: V.scale,
            opacity: "0.28",
            clipPath: `url(#gf-body-clip-${uid})`
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "67",
            cy: "33",
            rx: "8",
            ry: "5",
            fill: `url(#gf-spec-${uid})`,
            clipPath: `url(#gf-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "71",
            cy: "31",
            rx: "2.5",
            ry: "1.5",
            fill: "#ffffff",
            opacity: "0.52",
            clipPath: `url(#gf-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `
          M 58 20
          C 58 10, 64 8,  70 10
          C 72 12, 72 16, 70 18
          C 67 20, 62 20, 58 20
          Z
        `,
            fill: `url(#gf-fin-${uid})`,
            opacity: finOpacity,
            filter: `url(#gf-finglow-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "58", y1: "20", x2: "63", y2: "10", stroke: V.fin, strokeWidth: "0.7", opacity: "0.40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "62", y1: "20", x2: "67", y2: "9", stroke: V.fin, strokeWidth: "0.7", opacity: "0.35" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "66", y1: "19", x2: "70", y2: "10", stroke: V.fin, strokeWidth: "0.7", opacity: "0.30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `M 72 44 C 76 50, 78 54, 74 56 C 70 56, 68 52, 70 46 Z`,
            fill: `url(#gf-fin-${uid})`,
            opacity: finOpacity * 0.7,
            filter: `url(#gf-finglow-${uid})`
          }
        ),
        V.eyeRing && /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "79", cy: "38", r: "5.5", fill: V.eyeRing, opacity: "0.55" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "79", cy: "38", r: "4.5", fill: "#f8ece0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "79", cy: "38", r: "3.2", fill: "#2a1000" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "80.5", cy: "36.5", r: "1.0", fill: "#ffffff", opacity: "0.85" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "77.5", cy: "39.5", r: "0.5", fill: "#ffffff", opacity: "0.42" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 83 41 Q 84 40.5 84 42",
            fill: "none",
            stroke: V.body2,
            strokeWidth: "0.9",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 74 36 Q 72 42, 74 48",
            fill: "none",
            stroke: V.body2,
            strokeWidth: "0.7",
            strokeOpacity: "0.40",
            strokeLinecap: "round"
          }
        ),
        isJuvenile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "50%",
            y: "74",
            textAnchor: "middle",
            fontSize: "5",
            fill: "#ffd090",
            opacity: "0.72",
            fontFamily: "sans-serif",
            children: "juvenile"
          }
        )
      ]
    }
  );
}
const GoldfishSprite_default = reactExports.memo(
  GoldfishSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f;
    return prev.size === next.size && prev.flipped === next.flipped && prev.selected === next.selected && ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.stage) === ((_d = next.fish) == null ? void 0 : _d.stage) && ((_e = prev.fish) == null ? void 0 : _e.colorVariant) === ((_f = next.fish) == null ? void 0 : _f.colorVariant);
  }
);
export {
  GoldfishSprite_default as default
};
