import { r as reactExports, j as jsxRuntimeExports } from "./index-CHk9lW5X.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 },
  legendary: { color: "#ff8040", opacity: 0.55, blur: 14 }
};
function BettaSprite({
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
      case "cobalt":
        return { filter: "hue-rotate(140deg) saturate(1.2)" };
      case "emerald":
        return { filter: "hue-rotate(100deg) saturate(1.3) brightness(0.95)" };
      case "albino":
        return { filter: "saturate(0.18) brightness(1.45)" };
      default:
        return {};
    }
  })();
  const W = size;
  const _h = size * 0.73;
  if (stage === "egg") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size * 0.5,
        height: size * 0.6,
        viewBox: "0 0 30 36",
        onClick,
        style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egg-betta-${uid}`, cx: "36%", cy: "30%", r: "60%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d44040" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#8c1a1a" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3a0808" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `egg-betta-sh-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodColor: "#000", floodOpacity: "0.40" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "15",
              cy: "19",
              rx: "9",
              ry: "12",
              fill: `url(#egg-betta-${uid})`,
              filter: `url(#egg-betta-sh-${uid})`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "11", cy: "13", rx: "3", ry: "3.5", fill: "#20c8b0", opacity: "0.28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "17", cy: "24", rx: "2", ry: "2.2", fill: "#200808", opacity: "0.25" })
        ]
      }
    );
  }
  const isJuvenile = stage === "juvenile";
  const finOpacity = isJuvenile ? 0.55 : 0.88;
  const bodyOpacity = isJuvenile ? 0.82 : 1;
  const iridOpacity = isJuvenile ? 0.15 : 0.32;
  const finScale = isJuvenile ? 0.65 : 1;
  const fs = finScale;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 110 80",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible",
        ...variantStyle
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `betta-sh-${uid}`, x: "-30%", y: "-40%", width: "160%", height: "200%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "4", stdDeviation: "4", floodColor: "#1a0408", floodOpacity: "0.55" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `betta-aura-${uid}`, x: "-50%", y: "-50%", width: "200%", height: "200%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `betta-body-clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "55", cy: "40", rx: "33", ry: "14" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-body-${uid}`, cx: "30%", cy: "28%", r: "65%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#d44040" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "45%", stopColor: "#8c1a1a" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3a0808" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-belly-${uid}`, cx: "50%", cy: "85%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#e06060", stopOpacity: "0.28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#8c1a1a", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-dorsal-${uid}`, cx: "50%", cy: "0%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#1a0408", stopOpacity: "0.35" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#1a0408", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-spec-${uid}`, cx: "28%", cy: "24%", r: "28%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.70" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#ffffff", stopOpacity: "0.15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-irid-${uid}`, cx: "38%", cy: "35%", r: "60%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#20c8b0", stopOpacity: "0.45" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#10a898", stopOpacity: "0.18" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#20c8b0", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `betta-fin-${uid}`, x1: "1", y1: "0", x2: "0", y2: "0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3a0808", stopOpacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#7a1010", stopOpacity: "0.75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c02828", stopOpacity: "0.60" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `betta-tail-top-${uid}`, x1: "1", y1: "1", x2: "0", y2: "0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3a0808", stopOpacity: "0.90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#8c1a1a", stopOpacity: "0.72" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c83030", stopOpacity: "0.50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `betta-tail-bot-${uid}`, x1: "1", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3a0808", stopOpacity: "0.90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "60%", stopColor: "#8c1a1a", stopOpacity: "0.72" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c83030", stopOpacity: "0.50" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `betta-pec-${uid}`, cx: "80%", cy: "30%", r: "70%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#c83030", stopOpacity: "0.65" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3a0808", stopOpacity: "0.20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: `betta-scale-${uid}`, x: "0", y: "0", width: "6", height: "5", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "ellipse",
            {
              cx: "3",
              cy: "2.5",
              rx: "2.6",
              ry: "1.9",
              fill: "none",
              stroke: "#5a0808",
              strokeWidth: "0.30",
              opacity: "0.20"
            }
          ) })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "42",
            ry: "32",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#betta-aura-${uid})`
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "44",
            ry: "33",
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
        M 22 38
        C ${22 - 10 * fs} ${38 - 14 * fs}, ${22 - 18 * fs} ${38 - 26 * fs}, ${22 - 20 * fs} ${38 - 36 * fs}
        C ${22 - 18 * fs} ${38 - 40 * fs}, ${22 - 14 * fs} ${38 - 38 * fs}, ${22 - 10 * fs} ${38 - 30 * fs}
        C ${22 - 4 * fs}  ${38 - 20 * fs}, 20 ${38 - 8 * fs},  22 38
        Z
      `,
            fill: `url(#betta-tail-top-${uid})`,
            opacity: finOpacity,
            filter: `url(#betta-sh-${uid})`
          }
        ),
        [0.15, 0.4, 0.65, 0.88].map((t, i) => {
          const tipX = 22 - (20 - t * 10) * fs;
          const tipY = 38 - (36 - t * 6) * fs;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: 22,
              y1: 38,
              x2: tipX,
              y2: tipY,
              stroke: "#5a0808",
              strokeWidth: "0.5",
              opacity: 0.28 * finOpacity
            },
            i
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `
        M 22 42
        C ${22 - 10 * fs} ${42 + 14 * fs}, ${22 - 18 * fs} ${42 + 26 * fs}, ${22 - 20 * fs} ${42 + 36 * fs}
        C ${22 - 18 * fs} ${42 + 40 * fs}, ${22 - 14 * fs} ${42 + 38 * fs}, ${22 - 10 * fs} ${42 + 30 * fs}
        C ${22 - 4 * fs}  ${42 + 20 * fs}, 20 ${42 + 8 * fs},  22 42
        Z
      `,
            fill: `url(#betta-tail-bot-${uid})`,
            opacity: finOpacity
          }
        ),
        [0.15, 0.4, 0.65, 0.88].map((t, i) => {
          const tipX = 22 - (20 - t * 10) * fs;
          const tipY = 42 + (36 - t * 6) * fs;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: 22,
              y1: 42,
              x2: tipX,
              y2: tipY,
              stroke: "#5a0808",
              strokeWidth: "0.5",
              opacity: 0.28 * finOpacity
            },
            i
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `
        M 22 38
        C ${18 - 8 * fs} 38, ${18 - 12 * fs} 40, ${22 - 12 * fs} 40
        C ${22 - 12 * fs} 40, ${18 - 8 * fs} 42, 22 42
        Z
      `,
            fill: "#7a1010",
            opacity: 0.55 * finOpacity
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `
        M 30 ${40 + 13}
        C 36 ${40 + 18 * fs}, 45 ${40 + 20 * fs}, 55 ${40 + 18 * fs}
        C 65 ${40 + 16 * fs}, 72 ${40 + 12 * fs}, 78 ${40 + 8}
        C 68 ${40 + 14}, 54 ${40 + 13}, 30 ${40 + 13}
        Z
      `,
            fill: `url(#betta-fin-${uid})`,
            opacity: finOpacity * 0.85
          }
        ),
        [[30, 53, 32, 53 + 14 * fs], [42, 53, 44, 53 + 17 * fs], [54, 53, 55, 53 + 15 * fs], [66, 53, 67, 53 + 10 * fs]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#5a0808",
            strokeWidth: "0.5",
            opacity: 0.25 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `
        M 38 ${40 - 14}
        C 40 ${40 - 14 - 16 * fs}, 50 ${40 - 14 - 20 * fs}, 60 ${40 - 14 - 16 * fs}
        C 68 ${40 - 14 - 12 * fs}, 74 ${40 - 14 - 5 * fs},  78 ${40 - 14 - 2}
        C 70 ${40 - 14},         54 ${40 - 14},          38 ${40 - 14}
        Z
      `,
            fill: `url(#betta-fin-${uid})`,
            opacity: finOpacity * 0.9
          }
        ),
        [[38, 26, 38, 26 - 15 * fs], [47, 26, 47, 26 - 18 * fs], [56, 26, 56, 26 - 17 * fs], [65, 26, 65, 26 - 12 * fs], [74, 26, 75, 26 - 4 * fs]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#5a0808",
            strokeWidth: "0.5",
            opacity: 0.25 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-fin",
            d: `
        M 78 42
        C 80 ${42 + 10 * fs}, 74 ${42 + 18 * fs}, 68 ${42 + 20 * fs}
        C 72 ${42 + 14 * fs}, 76 ${42 + 6 * fs},  78 42
        Z
      `,
            fill: `url(#betta-pec-${uid})`,
            opacity: finOpacity * 0.78
          }
        ),
        [[78, 42, 74, 42 + 17 * fs], [78, 42, 70, 42 + 16 * fs]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#5a0808",
            strokeWidth: "0.45",
            opacity: 0.22 * finOpacity
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-body-${uid})`,
            opacity: bodyOpacity,
            filter: `url(#betta-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-irid-${uid})`,
            opacity: iridOpacity,
            clipPath: `url(#betta-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "81",
            cy: "40",
            rx: "5",
            ry: "7",
            fill: "#20c8b0",
            opacity: 0.3 * bodyOpacity,
            clipPath: `url(#betta-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-belly-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-dorsal-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-scale-${uid})`,
            opacity: "0.55",
            clipPath: `url(#betta-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "55",
            cy: "40",
            rx: "33",
            ry: "14",
            fill: `url(#betta-spec-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "85", cy: "38", r: "4.5", fill: "#1a0408" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "85", cy: "38", r: "3.2", fill: "#2a0810" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "85", cy: "38", r: "2.0", fill: "#0a0208" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "83.8", cy: "36.8", r: "1.1", fill: "#ffffff", opacity: "0.90" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "86.2", cy: "39.4", r: "0.5", fill: "#ffffff", opacity: "0.42" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "85",
            cy: "38",
            r: "4.5",
            fill: "none",
            stroke: "#20c8b0",
            strokeWidth: "0.7",
            opacity: "0.60"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 88 41 Q 90.5 40, 89 39",
            fill: "none",
            stroke: "#1a0408",
            strokeWidth: "1.0",
            strokeLinecap: "round",
            opacity: "0.70"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M 24 40 Q 55 37, 82 39",
            fill: "none",
            stroke: "#c06060",
            strokeWidth: "0.45",
            opacity: "0.18"
          }
        ),
        isJuvenile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "55",
            y: "62",
            textAnchor: "middle",
            fontSize: "5",
            fill: "#c83030",
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
const BettaSprite_default = reactExports.memo(
  BettaSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.stage) === ((_d = next.fish) == null ? void 0 : _d.stage) && ((_e = prev.fish) == null ? void 0 : _e.health) === ((_f = next.fish) == null ? void 0 : _f.health) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && ((_i = prev.fish) == null ? void 0 : _i.colorVariant) === ((_j = next.fish) == null ? void 0 : _j.colorVariant) && prev.selected === next.selected && prev.size === next.size && prev.flipped === next.flipped;
  }
);
export {
  BettaSprite_default as default
};
