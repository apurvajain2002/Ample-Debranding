import React, { Component } from 'react';
import { getBrowserInfo, getCompatibilityWarnings } from '../../utils/browserCompatibility';

class BrowserErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      browserInfo: {},
      compatibilityWarnings: []
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
      browserInfo: getBrowserInfo(),
      compatibilityWarnings: getCompatibilityWarnings()
    });

    // Log error for debugging
    console.error('Browser Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleContinue = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { error, browserInfo, compatibilityWarnings } = this.state;
      
      return (
        <div style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '50px auto',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
          
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>
            Something went wrong
          </h2>
          
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '20px', 
            borderRadius: '6px', 
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h4 style={{ color: '#495057', marginBottom: '15px' }}>
              Browser Information
            </h4>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>Browser:</strong> {browserInfo.name} {browserInfo.version}
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              <strong>User Agent:</strong> {navigator.userAgent}
            </p>
            
            {compatibilityWarnings.length > 0 && (
              <div style={{ marginTop: '15px' }}>
                <h5 style={{ color: '#6c757d', marginBottom: '10px' }}>
                  Compatibility Issues Detected:
                </h5>
                <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
                  {compatibilityWarnings.map((warning, index) => (
                    <li key={index} style={{ color: '#6c757d', marginBottom: '5px' }}>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '6px', 
            padding: '15px', 
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h5 style={{ color: '#856404', marginBottom: '10px' }}>
              What happened?
            </h5>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#856404' }}>
              An error occurred while running the interview. This might be due to:
            </p>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px', color: '#856404' }}>
              <li>Browser compatibility issues</li>
              <li>Outdated browser version</li>
              <li>JavaScript errors</li>
              <li>Network connectivity problems</li>
            </ul>
          </div>

          <div style={{ 
            backgroundColor: '#d1ecf1', 
            border: '1px solid #bee5eb', 
            borderRadius: '6px', 
            padding: '15px', 
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h5 style={{ color: '#0c5460', marginBottom: '10px' }}>
              Recommended solutions:
            </h5>
            <ul style={{ margin: '10px 0', paddingLeft: '20px', fontSize: '14px', color: '#0c5460' }}>
              <li>Use Chrome, Firefox, Safari, or Edge (latest versions)</li>
              <li>Clear browser cache and cookies</li>
              <li>Disable browser extensions temporarily</li>
              <li>Check your internet connection</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <button
              onClick={this.handleRetry}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Try Again
            </button>
            
            <button
              onClick={this.handleContinue}
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ⚠️ Continue Anyway
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#6c757d' }}>
                Error Details (Development)
              </summary>
              <pre style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '4px', 
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {error && error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default BrowserErrorBoundary;
