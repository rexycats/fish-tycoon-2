import React from 'react';
import ReactDOM from 'react-dom/client';

// Version marker
console.log('%c[Fish Tycoon 2] Build v0.11.1 (2026-04-17)', 'color: #4a8f8f; font-weight: bold; font-size: 14px');

// Show loading state immediately so there's never a black screen
const root = document.getElementById('root');
root.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0e14;color:#4a8f8f;font-family:sans-serif;font-size:14px">Loading Fish Tycoon 2...</div>';

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
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0a0e14;color:#ff6666;font-family:sans-serif;text-align:center;padding:2rem">
      <h1 style="font-size:1.5rem;margin-bottom:1rem">Failed to Load</h1>
      <p style="color:#999;max-width:500px;margin-bottom:1rem">The game crashed during initialization. Try clearing your save data.</p>
      <button onclick="localStorage.clear();location.reload()" style="padding:8px 20px;background:rgba(64,200,240,0.15);border:1px solid rgba(64,200,240,0.4);color:#40c8f0;border-radius:6px;cursor:pointer;font-size:14px;margin-bottom:12px">
        Clear Save & Reload
      </button>
      <details style="color:#666;font-size:11px;max-width:600px">
        <summary>Error details</summary>
        <pre style="text-align:left;white-space:pre-wrap;color:#ff8888;background:#111;padding:12px;border-radius:4px;margin-top:8px;max-height:200px;overflow:auto">${err?.stack || err?.message || String(err)}</pre>
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
