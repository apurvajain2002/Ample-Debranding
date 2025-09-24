import React, { useState, useEffect } from 'react';
import { getBrowserInfo, getCompatibilityWarnings, featureDetection } from '../../utils/browserCompatibility';

const BrowserCompatibilityWarning = ({ showWarning = true, onDismiss }) => {
  const [warnings, setWarnings] = useState([]);
  const [browserInfo, setBrowserInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showWarning) {
      const compatibilityWarnings = getCompatibilityWarnings();
      const browser = getBrowserInfo();
      
      setWarnings(compatibilityWarnings);
      setBrowserInfo(browser);
      
      // Only show warning if there are actual compatibility issues
      setIsVisible(compatibilityWarnings.length > 0);
    }
  }, [showWarning]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  const getWarningIcon = (warning) => {
    if (warning.includes('WebRTC')) return '🎥';
    if (warning.includes('Fullscreen')) return '🖥️';
    if (warning.includes('Media devices')) return '🎤';
    return '⚠️';
  };

  const getFeatureStatus = () => {
    const features = featureDetection.getSupportedFeatures();
    return Object.entries(features);
  };

  return (
    <div className="browser-compatibility-warning" style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      maxWidth: '400px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontSize: '14px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h4 style={{ margin: '0', color: '#856404', fontSize: '16px' }}>
          🌐 Browser Compatibility Notice
        </h4>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#856404',
            padding: '0',
            lineHeight: '1'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <p style={{ margin: '0 0 8px 0', color: '#856404' }}>
          <strong>Browser:</strong> {browserInfo.name} {browserInfo.version}
        </p>
        
        {warnings.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#856404' }}>Limitations detected:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {warnings.map((warning, index) => (
                <li key={index} style={{ color: '#856404', marginBottom: '4px' }}>
                  {getWarningIcon(warning)} {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#856404' }}>Feature Support:</strong>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '4px', 
            marginTop: '8px',
            fontSize: '12px'
          }}>
            {getFeatureStatus().map(([feature, supported]) => (
              <div key={feature} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                color: supported ? '#28a745' : '#dc3545'
              }}>
                <span>{supported ? '✓' : '✗'}</span>
                <span style={{ textTransform: 'capitalize' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ 
          backgroundColor: '#e2e3e5', 
          padding: '8px', 
          borderRadius: '4px',
          fontSize: '12px',
          color: '#495057'
        }}>
          <strong>Note:</strong> The interview will continue with available features. 
          For the best experience, consider using Chrome, Firefox, Safari, or Edge.
        </div>
      </div>
      
      <button
        onClick={handleDismiss}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '14px',
          width: '100%'
        }}
      >
        Continue with Current Browser
      </button>
    </div>
  );
};

export default BrowserCompatibilityWarning;
