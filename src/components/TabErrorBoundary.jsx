import React from 'react';

export default class TabErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[TabError:${this.props.name || 'unknown'}]`, error, info.componentStack?.slice(0, 300));
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem', textAlign: 'center', color: '#a0b8d8',
          fontFamily: 'Nunito, sans-serif',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Error</div>
          <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
            This tab encountered an error. Your save is safe.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: '6px 16px', borderRadius: '8px', border: '1px solid rgba(64,200,240,0.3)',
              background: 'rgba(64,200,240,0.1)', color: '#40c8f0', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
