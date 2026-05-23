import { Component } from 'react';

/* ── ErrorBoundary ──────────────────────────────────────────────────
   Wraps dashboard sections so a crash in one role's pages doesn't
   take down the entire app. Uses a class component because React's
   error boundary API requires getDerivedStateFromError / componentDidCatch.
─────────────────────────────────────────────────────────────────── */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // TODO (backend): send to your error monitoring service (e.g. Sentry)
    console.error('[ErrorBoundary] Caught error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          gap: '16px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '400px', lineHeight: 1.6 }}>
            An unexpected error occurred on this page. Try refreshing or going back.
          </p>
          {this.state.error && (
            <pre style={{
              fontSize: '12px',
              color: '#9ca3af',
              background: '#f9fafb',
              padding: '12px 16px',
              borderRadius: '8px',
              maxWidth: '500px',
              overflowX: 'auto',
              textAlign: 'left',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                background: '#5B4A9E',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                background: 'transparent',
                color: '#5B4A9E',
                border: '1.5px solid #5B4A9E',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}