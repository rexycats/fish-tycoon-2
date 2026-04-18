import { R as React, j as jsxRuntimeExports } from "./index-CuAPajpT.js";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }
  render() {
    var _a, _b;
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#0a1828",
        color: "#d8e0f0",
        fontFamily: "Nunito, sans-serif",
        textAlign: "center",
        padding: "2rem"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: "4rem", marginBottom: "1rem" }, children: "Error" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { fontFamily: "Fredoka, sans-serif", fontSize: "1.5rem", marginBottom: "0.5rem" }, children: "Something went wrong!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { opacity: 0.6, maxWidth: 400, marginBottom: "1.5rem" }, children: "Don't worry — your save is safe. Try refreshing the page." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            style: {
              padding: "10px 24px",
              borderRadius: "8px",
              border: "1px solid rgba(64,200,240,0.4)",
              background: "rgba(64,200,240,0.15)",
              color: "#40c8f0",
              fontSize: "1rem",
              cursor: "pointer",
              fontFamily: "Fredoka, sans-serif",
              fontWeight: 600
            },
            children: "Refresh"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { style: { marginTop: "2rem", opacity: 0.5, fontSize: "0.75rem", maxWidth: 600 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { children: "Technical details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { style: { textAlign: "left", whiteSpace: "pre-wrap", color: "#ff8888", background: "#111", padding: "12px", borderRadius: "4px", maxHeight: "300px", overflow: "auto" }, children: ((_a = this.state.error) == null ? void 0 : _a.stack) || ((_b = this.state.error) == null ? void 0 : _b.toString()) })
        ] })
      ] });
    }
    return this.props.children;
  }
}
export {
  ErrorBoundary as default
};
