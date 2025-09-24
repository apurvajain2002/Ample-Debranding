/**
 * Browser Polyfills Utility
 * Provides fallbacks for older browsers
 */

// Polyfill for Array.prototype.at() (not supported in older browsers)
if (!Array.prototype.at) {
  Array.prototype.at = function(n) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

// Polyfill for String.prototype.at() (not supported in older browsers)
if (!String.prototype.at) {
  String.prototype.at = function(n) {
    n = Math.trunc(n) || 0;
    if (n < 0) n += this.length;
    if (n < 0 || n >= this.length) return undefined;
    return this[n];
  };
}

// Polyfill for Object.entries() (not supported in IE)
if (!Object.entries) {
  Object.entries = function(obj) {
    const ownProps = Object.keys(obj);
    let i = ownProps.length;
    const resArray = new Array(i);
    while (i--) {
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    }
    return resArray;
  };
}

// Polyfill for Promise.allSettled() (not supported in older browsers)
if (!Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return Promise.all(
      promises.map(promise =>
        Promise.resolve(promise).then(
          value => ({ status: 'fulfilled', value }),
          reason => ({ status: 'rejected', reason })
        )
      )
    );
  };
}

// Polyfill for fetch() (not supported in older browsers)
if (!window.fetch) {
  window.fetch = function(url, options = {}) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open(options.method || 'GET', url);
      
      if (options.headers) {
        Object.keys(options.headers).forEach(key => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            ok: true,
            status: xhr.status,
            statusText: xhr.statusText,
            text: () => Promise.resolve(xhr.responseText),
            json: () => Promise.resolve(JSON.parse(xhr.responseText))
          });
        } else {
          reject({
            ok: false,
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      };
      
      xhr.onerror = function() {
        reject({
          ok: false,
          status: 0,
          statusText: 'Network Error'
        });
      };
      
      xhr.send(options.body);
    });
  };
}

// Polyfill for CSS.supports (not supported in older browsers)
if (!window.CSS || !window.CSS.supports) {
  window.CSS = window.CSS || {};
  window.CSS.supports = function(property, value) {
    if (arguments.length === 1) {
      return CSS.supports(property);
    }
    
    const style = document.createElement('style');
    const div = document.createElement('div');
    const id = 'css-supports-' + Math.random().toString(36).substr(2, 9);
    
    div.id = id;
    style.textContent = `#${id} { ${property}: ${value}; }`;
    
    document.head.appendChild(style);
    document.body.appendChild(div);
    
    const isSupported = window.getComputedStyle(div)[property] !== '';
    
    document.head.removeChild(style);
    document.body.removeChild(div);
    
    return isSupported;
  };
}

// Polyfill for navigator.mediaDevices (not supported in older browsers)
if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};
}

if (!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia = function(constraints) {
    const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }
    
    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

// Polyfill for navigator.mediaDevices.enumerateDevices (missing on older iOS and some browsers)
if (!navigator.mediaDevices.enumerateDevices) {
  navigator.mediaDevices.enumerateDevices = function() {
    // Best-effort: try to infer devices via getUserMedia and tracks
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        return navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then((stream) => {
            // Use legacy API if available
            if (typeof MediaStreamTrack !== 'undefined' && MediaStreamTrack.getSources) {
              return new Promise((resolve) => {
                MediaStreamTrack.getSources((sources) => {
                  const list = sources.map((s) => ({
                    deviceId: s.id || '',
                    groupId: '',
                    kind: s.kind === 'audio' ? 'audioinput' : 'videoinput',
                    label: s.label || '',
                    toJSON() { return this; },
                  }));
                  resolve(list);
                });
              }).finally(() => {
                try { stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
              });
            }

            // Fallback: derive from active tracks
            const devices = [];
            try {
              stream.getTracks().forEach((track) => {
                const settings = (track.getSettings && track.getSettings()) || {};
                devices.push({
                  deviceId: settings.deviceId || '',
                  groupId: settings.groupId || '',
                  kind: track.kind === 'audio' ? 'audioinput' : (track.kind === 'video' ? 'videoinput' : track.kind),
                  label: track.label || '',
                  toJSON() { return this; },
                });
              });
            } finally {
              try { stream.getTracks().forEach((t) => t.stop()); } catch (e) {}
            }
            return devices;
          })
          .catch(() => Promise.resolve([]));
      }
    } catch (e) {
      // Ignore and provide safe fallback
    }
    // As a last resort, return an empty list to keep callers from crashing
    return Promise.resolve([]);
  };
}

// Polyfill for Element.prototype.matches (not supported in older browsers)
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.matchesSelector ||
                              Element.prototype.mozMatchesSelector ||
                              Element.prototype.msMatchesSelector ||
                              Element.prototype.oMatchesSelector ||
                              Element.prototype.webkitMatchesSelector;
}

// Polyfill for Element.prototype.closest (not supported in older browsers)
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    let el = this;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// Polyfill for NodeList.prototype.forEach (not supported in older browsers)
if (!NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// Polyfill for HTMLCollection.prototype.forEach (not supported in older browsers)
if (!HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

// Polyfill for requestAnimationFrame (not supported in older browsers)
if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = (function() {
    return window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
             window.setTimeout(callback, 1000 / 60);
           };
  })();
}

if (!window.cancelAnimationFrame) {
  window.cancelAnimationFrame = (function() {
    return window.webkitCancelAnimationFrame ||
           window.mozCancelAnimationFrame ||
           window.oCancelAnimationFrame ||
           window.msCancelAnimationFrame ||
           function(id) {
             window.clearTimeout(id);
           };
  })();
}

// Polyfill for console methods (some older browsers might not have them)
if (!console.warn) {
  console.warn = console.log || function() {};
}

if (!console.error) {
  console.error = console.log || function() {};
}

if (!console.info) {
  console.info = console.log || function() {};
}

// Export polyfill status
export const polyfillStatus = {
  arrayAt: !!Array.prototype.at,
  stringAt: !!String.prototype.at,
  objectEntries: !!Object.entries,
  promiseAllSettled: !!Promise.allSettled,
  fetch: !!window.fetch,
  cssSupports: !!window.CSS?.supports,
  mediaDevices: !!navigator.mediaDevices?.getUserMedia,
  elementMatches: !!Element.prototype.matches,
  elementClosest: !!Element.prototype.closest,
  nodeListForEach: !!NodeList.prototype.forEach,
  requestAnimationFrame: !!window.requestAnimationFrame
};

export default {
  polyfillStatus
};
