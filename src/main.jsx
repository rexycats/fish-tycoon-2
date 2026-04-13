import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { bootSideEffects, teardownSideEffects } from './store/gameStore.js';
import './index.css';

// Boot game engine side effects (tick, auto-save, watchers) outside React
bootSideEffects();

// HMR cleanup
if (import.meta.hot) {
  import.meta.hot.dispose(() => teardownSideEffects());
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

// ── Crashproofing: Global error handlers ──────────────────
window.onerror = (msg, src, line, col, err) => {
  console.error('[Global]', msg, src, line, err);
  return false; // let default handler run too
};
window.onunhandledrejection = (e) => {
  console.error('[Unhandled Promise]', e.reason);
};
