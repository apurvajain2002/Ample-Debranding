/**
 * Browser Compatibility Utility
 * Provides cross-browser support for interview features
 */
// Browser detection with fallbacks
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  // Modern browser detection
  if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return { name: 'chrome', version: getVersion(userAgent, 'Chrome') };
  } else if (userAgent.includes('Firefox')) {
    return { name: 'firefox', version: getVersion(userAgent, 'Firefox') };
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return { name: 'safari', version: getVersion(userAgent, 'Version') };
  } else if (userAgent.includes('Edg')) {
    return { name: 'edge', version: getVersion(userAgent, 'Edg') };
  } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
    return { name: 'opera', version: getVersion(userAgent, 'Opera') };
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    return { name: 'ie', version: getVersion(userAgent, 'MSIE') || getVersion(userAgent, 'rv') };
  }
  
  return { name: 'unknown', version: 'unknown' };
};

const getVersion = (userAgent, browserName) => {
  const match = userAgent.match(new RegExp(`${browserName}/(\\d+)`));
  return match ? match[1] : 'unknown';
};

// Device detection
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isDesktop: !isMobile
  };
};

// Cross-browser fullscreen API
export const fullscreenAPI = {
  // Check if fullscreen is supported
  isSupported: () => {
    return !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled
    );
  },

  // Check if currently in fullscreen
  isFullscreen: () => {
    return !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );
  },

  // Request fullscreen with fallbacks
  request: async (element = document.documentElement) => {
    try {
      if (element.requestFullscreen) {
        return await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        return await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        return await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        return await element.msRequestFullscreen();
      }
      throw new Error('Fullscreen not supported');
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
      return false;
    }
  },

  // Exit fullscreen with fallbacks
  exit: async () => {
    try {
      if (document.exitFullscreen) {
        return await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        return await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        return await document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        return await document.msExitFullscreen();
      }
      throw new Error('Fullscreen exit not supported');
    } catch (error) {
      console.warn('Fullscreen exit failed:', error);
      return false;
    }
  },

  // Add fullscreen change event listener
  addChangeListener: (callback) => {
    const events = [
      'fullscreenchange',
      'webkitfullscreenchange',
      'mozfullscreenchange',
      'MSFullscreenChange'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, callback);
    });
    
    // Return cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, callback);
      });
    };
  }
};

// Cross-browser audio context
export const getAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) {
    throw new Error('AudioContext not supported in this browser');
  }
  return new AudioContext();
};

// Cross-browser media devices
export const mediaDevices = {
  // Get user media with fallbacks
  getUserMedia: async (constraints) => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return await navigator.mediaDevices.getUserMedia(constraints);
      } else if (navigator.getUserMedia) {
        return new Promise((resolve, reject) => {
          navigator.getUserMedia(constraints, resolve, reject);
        });
      } else if (navigator.webkitGetUserMedia) {
        return new Promise((resolve, reject) => {
          navigator.webkitGetUserMedia(constraints, resolve, reject);
        });
      } else if (navigator.mozGetUserMedia) {
        return new Promise((resolve, reject) => {
          navigator.mozGetUserMedia(constraints, resolve, reject);
        });
      } else if (navigator.msGetUserMedia) {
        return new Promise((resolve, reject) => {
          navigator.msGetUserMedia(constraints, resolve, reject);
        });
      }
      throw new Error('getUserMedia not supported');
    } catch (error) {
      console.error('getUserMedia failed:', error);
      throw error;
    }
  },

  // Check if media devices are supported
  isSupported: () => {
    return !!(
      navigator.mediaDevices?.getUserMedia ||
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );
  }
};

// Browser capability detection
export const browserCapabilities = {
  // Check if browser supports WebRTC
  supportsWebRTC: () => {
    return !!(
      window.RTCPeerConnection ||
      window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.msRTCPeerConnection
    );
  },

  // Check if browser supports WebGL
  supportsWebGL: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  },

  // Check if browser supports modern ES6+ features
  supportsES6: () => {
    try {
      // Use arrow function syntax check instead of Function constructor
      const testArrowFunction = () => {};
      return typeof testArrowFunction === 'function';
    } catch (e) {
      return false;
    }
  },

  // Check if browser supports modern CSS features
  supportsModernCSS: () => {
    return CSS.supports('display', 'grid') && CSS.supports('position', 'sticky');
  }
};

// Feature detection and fallbacks
export const featureDetection = {
  // Check if a specific feature is supported
  isSupported: (feature) => {
    switch (feature) {
      case 'fullscreen':
        return fullscreenAPI.isSupported();
      case 'webrtc':
        return browserCapabilities.supportsWebRTC();
      case 'webgl':
        return browserCapabilities.supportsWebGL();
      case 'es6':
        return browserCapabilities.supportsES6();
      case 'moderncss':
        return browserCapabilities.supportsModernCSS();
      case 'mediadevices':
        return mediaDevices.isSupported();
      default:
        return false;
    }
  },

  // Get list of supported features
  getSupportedFeatures: () => {
    return {
      fullscreen: fullscreenAPI.isSupported(),
      webrtc: browserCapabilities.supportsWebRTC(),
      webgl: browserCapabilities.supportsWebGL(),
      es6: browserCapabilities.supportsES6(),
      moderncss: browserCapabilities.supportsModernCSS(),
      mediadevices: mediaDevices.isSupported()
    };
  }
};

// Browser compatibility warnings
export const getCompatibilityWarnings = () => {
  const warnings = [];
  const features = featureDetection.getSupportedFeatures();
  
  if (!features.webrtc) {
    warnings.push('WebRTC is not supported. Video/audio features may not work.');
  }
  
  if (!features.fullscreen) {
    warnings.push('Fullscreen is not supported. Interview experience may be limited.');
  }
  
  if (!features.mediadevices) {
    warnings.push('Media devices are not supported. Camera/microphone may not work.');
  }
  
  return warnings;
};

// Graceful degradation helpers
export const gracefulDegradation = {
  // Try to use modern API, fallback to older ones
  tryModernFirst: async (modernFn, fallbackFn, ...args) => {
    try {
      return await modernFn(...args);
    } catch (error) {
      console.warn('Modern API failed, trying fallback:', error);
      try {
        return await fallbackFn(...args);
      } catch (fallbackError) {
        console.error('Both modern and fallback APIs failed:', fallbackError);
        throw fallbackError;
      }
    }
  },

  // Check if feature is available before using
  safeExecute: async (feature, fn, fallback = null) => {
    if (featureDetection.isSupported(feature)) {
      try {
        return await fn();
      } catch (error) {
        console.warn(`Feature ${feature} failed:`, error);
        return fallback;
      }
    } else {
      console.warn(`Feature ${feature} not supported, using fallback`);
      return fallback;
    }
  }
};

// Constants
const GEO_IP_ENDPOINT = 'https://ipwho.is/?fields=ip,city,region,country,latitude,longitude,connection';

const logClientDiagnostics = async (contextFunctions = {}) => {
  const { setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport } = contextFunctions;
  const browserInfoData = getBrowserInfo();
  const deviceInfoData = getDeviceInfo();
  const featureSupportData = featureDetection.getSupportedFeatures();
  let ipPayload = null;
  let cancelled = false;

  // Store in global context if functions are provided
  if (setBrowserInfo) setBrowserInfo(browserInfoData);
  if (setDeviceInfo) setDeviceInfo(deviceInfoData);
  if (setFeatureSupport) setFeatureSupport(featureSupportData);

  try {
    const response = await fetch(GEO_IP_ENDPOINT, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      if (!cancelled && payload?.success !== false) {
        ipPayload = payload;
      }
    }
  } catch (error) {
    if (!cancelled) {
      console.warn('Unable to fetch IP/location details:', error);
    }
  }

  if (cancelled) {
    return;
  }

  console.group('Interview client diagnostics');
  console.info('Browser info:', browserInfoData);
  console.info('Device info:', deviceInfoData);
  console.info('Feature support:', featureSupportData);
  console.info('ipPayload:------------>', ipPayload);

  if (ipPayload) {
    const { ip, city, region, country, latitude, longitude, connection } = ipPayload;
    const ipDetailsData = {
      browserName: browserInfoData.name,
      isAndroid: deviceInfoData.isAndroid,
      isDesktop: deviceInfoData.isDesktop,
      isIOS: deviceInfoData.isIOS,
      isMobile: deviceInfoData.isMobile,
      city,
      region,
      country,
      ip,
      isp: connection?.isp || connection?.asn || 'Unknown'
    };
    
    // Store IP details in global context if function is provided
    if (setIpDetails) setIpDetails(ipDetailsData);
    
    console.info('IP details:', ipDetailsData);
  } else {
    console.warn('IP/location details not available.');
    if (setIpDetails) setIpDetails(null);
  }

  console.groupEnd();
};

// Create the default export object
const browserCompatibility = {
  getBrowserInfo,
  getDeviceInfo,
  fullscreenAPI,
  getAudioContext,
  mediaDevices,
  browserCapabilities,
  featureDetection,
  getCompatibilityWarnings,
  gracefulDegradation,
  logClientDiagnostics
};

export { logClientDiagnostics };
export default browserCompatibility;
