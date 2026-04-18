import React from 'react';
import ReactDOM from 'react-dom/client';

// Version marker
console.log('%c[Fish Tycoon 2] Build v0.12.0-final (2026-04-18-0023)', 'color: #4a8f8f; font-weight: bold; font-size: 14px');

// Show loading state immediately so there's never a black screen
const root = document.getElementById('root');
root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:linear-gradient(180deg,#c8f3ff,#eefcff);color:#4a8ab8;font-family:sans-serif;font-size:14px">Loading Fish Tycoon 2...</div>';

async function boot() {
  // Dynamic imports so any crash is caught
  const { default: App } = await import('./App.jsx');
  const { default: ErrorBoundary } = await import('./components/ErrorBoundary.jsx');
  const { bootSideEffects, teardownSideEffects } = await import('./store/gameStore.js');
  await import('./index.css');

  // Boot side effects with protection
  try {
    bootSideEffects();
  } catch (err) {
    console.error('[Boot] Side effects failed (non-fatal):', err);
  }

  // HMR cleanup
  if (import.meta.hot) {
    import.meta.hot.dispose(() => teardownSideEffects());
  }

  // Render
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}

boot().catch(err => {
  console.error('[Fatal]', err);
  root.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:linear-gradient(180deg,#c8f3ff,#eefcff);color:#f07070;font-family:sans-serif;text-align:center;padding:2rem">
      <h1 style="font-size:1.5rem;margin-bottom:1rem">Failed to Load</h1>
      <p style="color:#6f8aa3;max-width:500px;margin-bottom:1rem">The game crashed during initialization. Try clearing your save data.</p>
      <button onclick="localStorage.clear();location.reload()" style="padding:8px 20px;background:linear-gradient(180deg,#8fe7ff,#5cbfcf);border:2px solid rgba(143,231,255,0.6);color:#1a4050;border-radius:999px;cursor:pointer;font-size:14px;margin-bottom:12px">
        Clear Save & Reload
      </button>
      <details style="color:#8ba3b8;font-size:11px;max-width:600px">
        <summary>Error details</summary>
        <pre style="text-align:left;white-space:pre-wrap;color:#f07070;background:rgba(255,255,255,0.8);padding:12px;border-radius:4px;margin-top:8px;max-height:200px;overflow:auto">${err?.stack || err?.message || String(err)}</pre>
      </details>
    </div>
  `;
});

// Global error handlers
window.onerror = (msg, src, line, col, err) => {
  console.error('[Global]', msg, src, line, err);
  return false;
};
window.onunhandledrejection = (e) => {
  console.error('[Unhandled Promise]', e.reason);
};
