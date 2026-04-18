import { r as reactExports, j as jsxRuntimeExports } from "./index-Rpas-Nvj.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 },
  legendary: { color: "#ff8040", opacity: 0.55, blur: 14 }
};
function BlueTangSprite({
  fish,
  size = 60,
  flipped = false,
  selected = false,
  onClick
}) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "bt").slice(0, 8);
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "rare";
  const aura = RARITY_AURA[rarity];
  const stage = (fish == null ? void 0 : fish.stage) || "adult";
  const variantKey = (fish == null ? void 0 : fish.colorVariant) || "default";
  const variantStyle = (() => {
    switch (variantKey) {
      case "gold":
        return { filter: "hue-rotate(165deg) saturate(1.3) brightness(1.1)" };
      case "midnight":
        return { filter: "hue-rotate(-20deg) saturate(0.7) brightness(0.60)" };
      case "albino":
        return { filter: "saturate(0.15) brightness(1.40)" };
      default:
        return {};
    }
  })();
  const W = size;
  const _h = size * 0.72;
  if (stage === "egg") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size * 0.55,
        height: size * 0.65,
        viewBox: "0 0 32 38",
        onClick,
        style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egg-bt-${uid}`, cx: "38%", cy: "32%", r: "58%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#4a9fe8" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#1a6fce" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0a2a60" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `egg-bt-sh-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodColor: "#000", floodOpacity: "0.35" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "16", cy: "20", rx: "10", ry: "13", fill: `url(#egg-bt-${uid})`, filter: `url(#egg-bt-sh-${uid})` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "12", cy: "14", rx: "3", ry: "3.5", fill: "#6ab8f0", opacity: "0.40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "19", cy: "25", rx: "2", ry: "2.5", fill: "#061840", opacity: "0.25" })
        ]
      }
    );
  }
  const isJuvenile = stage === "juvenile";
  const stripeOpacity = isJuvenile ? 0.55 : 0.92;
  const bodyOpacity = isJuvenile ? 0.85 : 1;
  const finOpacity = isJuvenile ? 0.5 : 0.72;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 100 72",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible",
        ...variantStyle
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `bt-sh-${uid}`, x: "-25%", y: "-35%", width: "150%", height: "190%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "5", stdDeviation: "4", floodColor: "#061428", floodOpacity: "0.50" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `bt-aura-${uid}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `bt-body-clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "44", cy: "36", rx: "28", ry: "22" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `bt-body-${uid}`, cx: "32%", cy: "26%", r: "62%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#4a9fe8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "40%", stopColor: "#1a6fce" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0a2860" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `bt-belly-${uid}`, cx: "50%", cy: "80%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#60b0ff", stopOpacity: "0.22" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#1a6fce", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `bt-dorsal-${uid}`, cx: "50%", cy: "0%", r: "58%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#061428", stopOpacity: "0.32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#061428", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `bt-spec-${uid}`, cx: "30%", cy: "24%", r: "26%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#ffffff", stopOpacity: "0.18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `bt-tail-${uid}`, x1: "1", y1: "0", x2: "0", y2: "0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f5c820", stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#f0b010", stopOpacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#e09000", stopOpacity: "0.95" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `bt-fin-${uid}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#1a6fce", stopOpacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0a2860", stopOpacity: "0.35" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `bt-pec-${uid}`, cx: "25%", cy: "35%", r: "68%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#4a9fe8", stopOpacity: "0.70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#0a2860", stopOpacity: "0.20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: `bt-scale-${uid}`, x: "0", y: "0", width: "7", height: "6", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "3.5", cy: "3", rx: "3", ry: "2.2", fill: "none", stroke: "#0a3888", strokeWidth: "0.35", opacity: "0.18" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: `bt-finglow-${uid}`, x: "-80%", y: "-80%", width: "260%", height: "260%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { in: "SourceAlpha", stdDeviation: "2.0", result: "blur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("feFlood", { floodColor: "#4a9fe8", floodOpacity: "0.45", result: "colour" }),
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
            cx: "44",
            cy: "36",
            rx: "32",
            ry: "26",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#bt-aura-${uid})`
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "33",
            ry: "27",
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
            d: `M 17 36 C 5 22, 0 14, 8 11 C 13 8, 18 22, 17 36 Z`,
            fill: `url(#bt-tail-${uid})`,
            filter: `url(#bt-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `M 17 36 C 5 50, 0 58, 8 61 C 13 64, 18 50, 17 36 Z`,
            fill: `url(#bt-tail-${uid})`,
            opacity: finOpacity,
            filter: `url(#bt-finglow-${uid})`
          }
        ),
        [0.2, 0.5, 0.8].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 17,
            y1: 36,
            x2: 1 + t * 10,
            y2: 11 + t * 50,
            stroke: "#c89000",
            strokeWidth: "0.6",
            opacity: "0.35"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `M 30 14 C 28 4, 36 1, 44 3 C 52 1, 60 3, 65 8 C 68 11, 66 14, 62 14 Z`,
            fill: `url(#bt-fin-${uid})`,
            opacity: finOpacity,
            filter: `url(#bt-finglow-${uid})`
          }
        ),
        [[30, 14, 28, 3], [37, 14, 36, 1], [44, 14, 43, 1], [51, 14, 52, 1], [58, 14, 60, 2], [63, 14, 66, 7]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#0a2860",
            strokeWidth: "0.5",
            opacity: "0.30"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `M 30 58 C 28 68, 38 71, 48 69 C 56 67, 62 62, 65 58 Z`,
            fill: `url(#bt-fin-${uid})`,
            opacity: finOpacity,
            filter: `url(#bt-finglow-${uid})`
          }
        ),
        [[30, 58, 28, 68], [40, 58, 40, 70], [52, 58, 54, 68], [62, 58, 64, 61]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#0a2860",
            strokeWidth: "0.5",
            opacity: "0.28"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            className: "fish-fin",
            cx: "62",
            cy: "42",
            rx: "10",
            ry: "6",
            fill: `url(#bt-pec-${uid})`,
            opacity: finOpacity * 0.85,
            filter: `url(#bt-finglow-${uid})`,
            transform: "rotate(-15 62 42)"
          }
        ),
        [[-8, -2], [-3, -4], [2, -5], [6, -3], [9, -1]].map(([dx, dy], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 62,
            y1: 42,
            x2: 62 + dx * 0.9,
            y2: 42 + dy * 2.2 + 5,
            stroke: "#0a3888",
            strokeWidth: "0.4",
            opacity: "0.22"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "28",
            ry: "22",
            fill: `url(#bt-body-${uid})`,
            opacity: bodyOpacity,
            filter: `url(#bt-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#bt-body-clip-${uid})`, opacity: stripeOpacity, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d: `M 68 28 Q 55 32, 44 34 Q 30 36, 18 38 Q 16 40, 17 44
                   Q 30 42, 44 40 Q 55 38, 68 34 Z`,
              fill: "#0a0a12"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "70", cy: "31", rx: "5", ry: "4", fill: "#0a0a12" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "20",
            cy: "36",
            rx: "4",
            ry: "3",
            fill: "#f5c820",
            opacity: "0.80",
            clipPath: `url(#bt-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "28",
            ry: "22",
            fill: `url(#bt-belly-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "28",
            ry: "22",
            fill: `url(#bt-dorsal-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "28",
            ry: "22",
            fill: `url(#bt-scale-${uid})`,
            opacity: "0.55",
            clipPath: `url(#bt-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "44",
            cy: "36",
            rx: "28",
            ry: "22",
            fill: `url(#bt-spec-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "31", r: "5.5", fill: "#0a0a12" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "31", r: "4.0", fill: "#1a1828" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "70", cy: "31", r: "2.8", fill: "#080610" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "68.5", cy: "29.5", r: "1.2", fill: "#ffffff", opacity: "0.88" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "71.5", cy: "32.5", r: "0.6", fill: "#ffffff", opacity: "0.45" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "70",
            cy: "31",
            r: "5.5",
            fill: "none",
            stroke: "#f5c820",
            strokeWidth: "0.7",
            opacity: "0.50"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 74 37 Q 77 39, 74 40`,
            fill: "none",
            stroke: "#0a0a12",
            strokeWidth: "1.1",
            strokeLinecap: "round",
            opacity: "0.65"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 60 38 Q 63 36, 65 40`,
            fill: "none",
            stroke: "#f5c820",
            strokeWidth: "1.5",
            opacity: "0.55",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 20 35 Q 44 32, 68 34`,
            fill: "none",
            stroke: "#6ab8f0",
            strokeWidth: "0.5",
            opacity: "0.20"
          }
        ),
        isJuvenile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "44",
            y: "66",
            textAnchor: "middle",
            fontSize: "5",
            fill: "#4a9fe8",
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
const BlueTangSprite_default = reactExports.memo(
  BlueTangSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.stage) === ((_d = next.fish) == null ? void 0 : _d.stage) && ((_e = prev.fish) == null ? void 0 : _e.health) === ((_f = next.fish) == null ? void 0 : _f.health) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && ((_i = prev.fish) == null ? void 0 : _i.colorVariant) === ((_j = next.fish) == null ? void 0 : _j.colorVariant) && prev.selected === next.selected && prev.size === next.size && prev.flipped === next.flipped;
  }
);
export {
  BlueTangSprite_default as default
};
