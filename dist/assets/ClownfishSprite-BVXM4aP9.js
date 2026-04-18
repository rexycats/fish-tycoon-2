import { r as reactExports, j as jsxRuntimeExports } from "./index-C8ZPheNj.js";
const RARITY_AURA = {
  common: null,
  uncommon: { color: "#78c8ff", opacity: 0.2, blur: 6 },
  rare: { color: "#c878ff", opacity: 0.28, blur: 8 },
  epic: { color: "#ffe040", opacity: 0.4, blur: 10 },
  legendary: { color: "#ff8040", opacity: 0.55, blur: 14 }
};
function ClownfishSprite({
  fish,
  size = 60,
  flipped = false,
  selected = false,
  onClick
}) {
  var _a;
  const uid = ((fish == null ? void 0 : fish.id) || "cf").slice(0, 8);
  const rarity = ((_a = fish == null ? void 0 : fish.species) == null ? void 0 : _a.rarity) || "uncommon";
  const aura = RARITY_AURA[rarity];
  const stage = (fish == null ? void 0 : fish.stage) || "adult";
  const variantKey = (fish == null ? void 0 : fish.colorVariant) || "default";
  const W = size;
  const _h = size * 0.68;
  const isJuvenile = stage === "juvenile";
  const barCount = isJuvenile ? 1 : 3;
  const variantStyle = (() => {
    switch (variantKey) {
      case "cinnabar":
        return { filter: "hue-rotate(-25deg) saturate(1.2) brightness(0.85)" };
      case "snowflake":
        return { filter: "hue-rotate(20deg) saturate(0.65) brightness(1.15)" };
      case "melanistic":
        return { filter: "saturate(0.10) brightness(0.45)" };
      default:
        return {};
    }
  })();
  if (stage === "egg") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: size * 0.6,
        height: size * 0.7,
        viewBox: "0 0 36 42",
        onClick,
        style: { cursor: onClick ? "pointer" : "default", overflow: "visible" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `egg-cf-${uid}`, cx: "38%", cy: "32%", r: "58%", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f5a030" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#e8621a" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#a03008" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `egg-sh-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "2", stdDeviation: "2", floodColor: "#000", floodOpacity: "0.35" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "18", cy: "22", rx: "11", ry: "14", fill: `url(#egg-cf-${uid})`, filter: `url(#egg-sh-${uid})` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "14", cy: "16", rx: "3.5", ry: "4", fill: "#f5b848", opacity: "0.45" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "21", cy: "28", rx: "2", ry: "2.5", fill: "#7a1e04", opacity: "0.25" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: W,
      height: _h,
      viewBox: "0 0 100 68",
      onClick,
      style: {
        cursor: onClick ? "pointer" : "default",
        transform: flipped ? "scaleX(-1)" : "none",
        overflow: "visible",
        ...variantStyle
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `cf-sh-${uid}`, x: "-25%", y: "-35%", width: "150%", height: "190%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feDropShadow", { dx: "0", dy: "5", stdDeviation: "4", floodColor: "#1a0800", floodOpacity: "0.45" }) }),
          aura && /* @__PURE__ */ jsxRuntimeExports.jsx("filter", { id: `cf-aura-${uid}`, x: "-40%", y: "-40%", width: "180%", height: "180%", children: /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: aura.blur }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("clipPath", { id: `cf-body-clip-${uid}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "46", cy: "34", rx: "30", ry: "20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `cf-body-${uid}`, cx: "35%", cy: "28%", r: "65%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f5a030" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "40%", stopColor: "#e8621a" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#8c2c04" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `cf-bar-${uid}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#fffaf0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "55%", stopColor: "#f5f0e8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c8d4dc" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `cf-belly-${uid}`, cx: "50%", cy: "78%", r: "55%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f8c060", stopOpacity: "0.30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#e8621a", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `cf-dorsal-${uid}`, cx: "50%", cy: "0%", r: "60%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#3a1400", stopOpacity: "0.28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#3a1400", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `cf-spec-${uid}`, cx: "32%", cy: "25%", r: "28%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.80" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#ffffff", stopOpacity: "0.20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#ffffff", stopOpacity: "0" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `cf-fin-${uid}`, x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#e8621a", stopOpacity: "0.90" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#a03008", stopOpacity: "0.40" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `cf-tail-${uid}`, x1: "1", y1: "0", x2: "0", y2: "0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#c84010", stopOpacity: "0.50" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#e86820", stopOpacity: "0.90" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("radialGradient", { id: `cf-pec-${uid}`, cx: "20%", cy: "30%", r: "70%", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#f09040", stopOpacity: "0.75" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#c04010", stopOpacity: "0.25" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pattern", { id: `cf-scale-${uid}`, x: "0", y: "0", width: "8", height: "6", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ellipse", { cx: "4", cy: "3", rx: "3.5", ry: "2.5", fill: "none", stroke: "#c04808", strokeWidth: "0.4", opacity: "0.18" }) })
        ] }),
        aura && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "33",
            ry: "23",
            fill: aura.color,
            opacity: aura.opacity,
            filter: `url(#cf-aura-${uid})`
          }
        ),
        selected && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "34",
            ry: "24",
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
            d: `M 18 34 C 6 22, 2 14, 10 12 C 16 10, 20 20, 18 34 Z`,
            fill: `url(#cf-tail-${uid})`,
            filter: `url(#cf-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-tail",
            d: `M 18 34 C 6 46, 2 54, 10 56 C 16 58, 20 48, 18 34 Z`,
            fill: `url(#cf-tail-${uid})`
          }
        ),
        [0.25, 0.5, 0.75].map((t, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 18,
            y1: 34,
            x2: 2 + t * 10,
            y2: 12 + t * 44,
            stroke: "#a03008",
            strokeWidth: "0.5",
            opacity: "0.30"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `M 38 14 C 36 4, 46 2, 52 10 C 54 14, 50 14, 48 14 Z`,
            fill: `url(#cf-fin-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            className: "fish-dorsal",
            d: `M 52 14 C 52 4, 62 0, 68 8 C 70 12, 66 14, 62 14 Z`,
            fill: `url(#cf-fin-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 48 14 C 49 10, 51 10, 52 14`,
            fill: "#a03008",
            opacity: "0.55"
          }
        ),
        [[38, 14, 36, 4], [44, 14, 42, 3], [52, 14, 50, 2], [58, 14, 56, 1], [64, 14, 64, 1]].map(([x1, y1, x2, y2], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1,
            y1,
            x2,
            y2,
            stroke: "#8c2c04",
            strokeWidth: "0.5",
            opacity: "0.28"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 42 54 C 38 62, 32 64, 30 60 C 28 56, 34 52, 42 54 Z`,
            fill: `url(#cf-fin-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            className: "fish-fin",
            cx: "58",
            cy: "40",
            rx: "10",
            ry: "6",
            fill: `url(#cf-pec-${uid})`,
            transform: "rotate(-20 58 40)"
          }
        ),
        [[-8, -2], [-4, -4], [0, -5], [4, -4], [8, -2]].map(([dx, dy], i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "line",
          {
            x1: 58,
            y1: 40,
            x2: 58 + dx * 0.9,
            y2: 40 + dy * 2.5 + 6,
            stroke: "#c04010",
            strokeWidth: "0.4",
            opacity: "0.25"
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "30",
            ry: "20",
            fill: `url(#cf-body-${uid})`,
            filter: `url(#cf-sh-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { clipPath: `url(#cf-body-clip-${uid})`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "63", y: "14", width: "9", height: "40", fill: "#1a0f08", opacity: "0.85" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "64", y: "14", width: "7", height: "40", fill: `url(#cf-bar-${uid})` }),
          barCount >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "42", y: "14", width: "9", height: "40", fill: "#1a0f08", opacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "43", y: "14", width: "7", height: "40", fill: `url(#cf-bar-${uid})` })
          ] }),
          barCount >= 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "21", y: "14", width: "8", height: "40", fill: "#1a0f08", opacity: "0.85" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "22", y: "14", width: "6", height: "40", fill: `url(#cf-bar-${uid})` })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "30",
            ry: "20",
            fill: `url(#cf-belly-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "30",
            ry: "20",
            fill: `url(#cf-dorsal-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "30",
            ry: "20",
            fill: `url(#cf-scale-${uid})`,
            opacity: "0.6",
            clipPath: `url(#cf-body-clip-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "ellipse",
          {
            cx: "46",
            cy: "34",
            rx: "30",
            ry: "20",
            fill: `url(#cf-spec-${uid})`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "71", cy: "31", r: "5.5", fill: "#1a0f08" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "71", cy: "31", r: "4.2", fill: "#2a1808" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "71", cy: "31", r: "3.5", fill: "#3a2010", opacity: "0.8" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "71", cy: "31", r: "2.5", fill: "#080402" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "69.5", cy: "29.5", r: "1.2", fill: "#ffffff", opacity: "0.90" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "72.5", cy: "32.5", r: "0.6", fill: "#ffffff", opacity: "0.50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "71",
            cy: "31",
            r: "5.5",
            fill: "none",
            stroke: "#f5a030",
            strokeWidth: "0.8",
            opacity: "0.35"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 78 36 Q 80 38, 78 39`,
            fill: "none",
            stroke: "#1a0f08",
            strokeWidth: "1.2",
            strokeLinecap: "round",
            opacity: "0.70"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: `M 22 33 Q 46 30, 70 32`,
            fill: "none",
            stroke: "#ffd090",
            strokeWidth: "0.6",
            opacity: "0.22"
          }
        ),
        isJuvenile && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: "46",
            y: "62",
            textAnchor: "middle",
            fontSize: "5",
            fill: "#f5a030",
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
const ClownfishSprite_default = reactExports.memo(
  ClownfishSprite,
  (prev, next) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    return ((_a = prev.fish) == null ? void 0 : _a.id) === ((_b = next.fish) == null ? void 0 : _b.id) && ((_c = prev.fish) == null ? void 0 : _c.stage) === ((_d = next.fish) == null ? void 0 : _d.stage) && ((_e = prev.fish) == null ? void 0 : _e.health) === ((_f = next.fish) == null ? void 0 : _f.health) && ((_g = prev.fish) == null ? void 0 : _g.disease) === ((_h = next.fish) == null ? void 0 : _h.disease) && ((_i = prev.fish) == null ? void 0 : _i.colorVariant) === ((_j = next.fish) == null ? void 0 : _j.colorVariant) && prev.selected === next.selected && prev.size === next.size && prev.flipped === next.flipped;
  }
);
export {
  ClownfishSprite_default as default
};
