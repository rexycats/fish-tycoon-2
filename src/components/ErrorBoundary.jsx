// ============================================================
// FISH TYCOON 2 — ERROR BOUNDARY
// Catches React render errors and shows recovery UI
// ============================================================
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', background: 'linear-gradient(180deg, #c8f3ff, #eefcff)', color: '#35506b', fontFamily: 'Nunito, sans-serif',
          textAlign: 'center', padding: '2rem',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>Error</div>
          <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Something went wrong!
          </h1>
          <p style={{ opacity: 0.6, maxWidth: 400, marginBottom: '1.5rem' }}>
            Don't worry — your save is safe. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', borderRadius: '999px', border: '2px solid rgba(143,231,255,0.6)',
              background: 'linear-gradient(180deg, #8fe7ff, #5cbfcf)', color: '#1a4050', fontSize: '1rem',
              cursor: 'pointer', fontFamily: 'Quicksand, sans-serif', fontWeight: 700,
            }}
          >
            Refresh
          </button>
          <details style={{ marginTop: '2rem', opacity: 0.5, fontSize: '0.75rem', maxWidth: 600 }}>
            <summary>Technical details</summary>
            <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap', color: '#c04040', background: 'rgba(255,255,255,0.8)', padding: '12px', borderRadius: '12px', maxHeight: '300px', overflow: 'auto', border: '1px solid rgba(200,100,100,0.2)' }}>
              {this.state.error?.stack || this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
