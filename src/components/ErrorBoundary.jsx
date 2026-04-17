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
          minHeight: '100vh', background: '#0a1828', color: '#d8e0f0', fontFamily: 'Nunito, sans-serif',
          textAlign: 'center', padding: '2rem',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>Error</div>
          <h1 style={{ fontFamily: 'Fredoka, sans-serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Something went wrong!
          </h1>
          <p style={{ opacity: 0.6, maxWidth: 400, marginBottom: '1.5rem' }}>
            Don't worry — your save is safe. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 24px', borderRadius: '8px', border: '1px solid rgba(64,200,240,0.4)',
              background: 'rgba(64,200,240,0.15)', color: '#40c8f0', fontSize: '1rem',
              cursor: 'pointer', fontFamily: 'Fredoka, sans-serif', fontWeight: 600,
            }}
          >
            Refresh
          </button>
          <details style={{ marginTop: '2rem', opacity: 0.3, fontSize: '0.7rem', maxWidth: 500 }}>
            <summary>Technical details</summary>
            <pre style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
