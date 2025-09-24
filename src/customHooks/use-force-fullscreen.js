import { useRef, useEffect, useCallback, useState } from 'react';
import { fullscreenAPI, mediaDevices } from '../utils/browserCompatibility';

const useForceFullscreen = () => {
  const fullscreenActiveRef = useRef(false);
  const lastFullscreenAttempt = useRef(0);
  const containerRef = useRef();
  const fullscreenViolationCount = useRef(0);
  const interviewStartedRef = useRef(false);
  const streamRef = useRef(null);
  const permissionDialogTimeoutRef = useRef(null);
  const mediaWarmupDoneRef = useRef(false);
  const permissionDialogActiveRef = useRef(false);
  const iframeInteractionRef = useRef(false);
  const iframeCheckIntervalRef = useRef(null);
  
  const [dynamicErrorMessage, setDynamicErrorMessage] = useState({
    isError: false,
    currentErrorType: '',
    errorMessages: {
      fullScreenExit: 'Full screen exit detected. This violates interview rules. Return to full screen now, else the interview will be terminated',
      fullScreenExitTermination: 'Full screen exit detected. This violates interview rules. Return to full screen now, else the interview will be terminated',
      rightClickOrInspectElement: 'Right-click/Inspect is not allowed. This violates interview rules. Return to full screen now, else the interview will be terminated',
      tabSwitching: 'Tab switch detected. This violates interview rules. Return to full screen now, else the interview will be terminated',
      developerToolsAccess: 'Developer tools access detected. This violates interview rules. Return to full screen now, else the interview will be terminated',
      copyPasteActivity: 'Copy-paste activity detected. This violates interview rules. Cease immediately now, else the interview will be terminated',
      keyboardInactivityWhileMouseMoves: 'Suspicious input behavior detected. Maintain integrity or the interview will end',
      backgroundVoicesOrFaces: 'Multiple screen usage detected. This violates interview rules. Disconnect extra screens now, else the interview will be terminated',
      aiToolsOrExternalAssistance: 'External tool usage detected. This violates interview rules. Disable them immediately now, else the interview will be terminated',
      remoteControlSuspicion: 'Suspicious activity detected. This violates interview rules. Cease immediately now, else the interview will be terminated',
      multipleScreensDetected: 'Multiple screen usage detected. This violates interview rules. Disconnect extra screens now, else the interview will be terminated',
      cameraTurnedOff: 'Camera access lost. This violates interview rules. Turn your camera back on now, else the interview will be terminated',
    }
  });

  const triggerError = (errorType = 'fullScreenExit', isError = true) => {
    if (!interviewStartedRef.current) {
      return;
    }

    // Don't trigger tab switching error if permission dialog is active or iframe interaction
    if (errorType === 'tabSwitching' && (permissionDialogActiveRef.current || iframeInteractionRef.current)) {
      return;
    }

    if (errorType === 'fullScreenExit') {
      fullscreenViolationCount.current += 1;
      if (fullscreenViolationCount.current >= 3) {
        setDynamicErrorMessage((prev) => ({
          ...prev,
          isError: isError,
          currentErrorType: 'fullScreenExitTermination',
        }));
      } else {
        setDynamicErrorMessage((prev) => ({
          ...prev,
          isError: isError,
          currentErrorType: errorType,
        }));
      }
    } else {
      setDynamicErrorMessage((prev) => ({
        ...prev,
        isError: isError,
        currentErrorType: errorType,
      }));
    }
  };

  // Check if the active element is inside an iframe
  const checkIfIframeInteraction = () => {
    const activeElement = document.activeElement;
    return activeElement && (
      activeElement.tagName === 'IFRAME' || 
      activeElement.closest('iframe') ||
      activeElement.closest('[data-iframe-container]')
    );
  };

  // Monitor iframe interactions periodically
  const startIframeMonitoring = () => {
    if (iframeCheckIntervalRef.current) {
      clearInterval(iframeCheckIntervalRef.current);
    }
    
    iframeCheckIntervalRef.current = setInterval(() => {
      iframeInteractionRef.current = checkIfIframeInteraction();
    }, 100);
  };

  // Stop iframe monitoring
  const stopIframeMonitoring = () => {
    if (iframeCheckIntervalRef.current) {
      clearInterval(iframeCheckIntervalRef.current);
      iframeCheckIntervalRef.current = null;
    }
    iframeInteractionRef.current = false;
  };

  // Simple mobile detection
  const isMobile = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isPortrait = () => {
    if (window.matchMedia) {
      return window.matchMedia('(orientation: portrait)').matches;
    }
    if (typeof window !== 'undefined' && window.screen && window.screen.orientation && window.screen.orientation.type) {
      return String(window.screen.orientation.type).startsWith('portrait');
    }
    return window.innerHeight > window.innerWidth;
  };

  // Overlay functions (unchanged)
  const OVERLAY_ID = 'evueme-rotate-landscape-overlay';
  const ensureOverlay = () => {
    let el = document.getElementById(OVERLAY_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = OVERLAY_ID;
      el.style.position = 'fixed';
      el.style.inset = '0';
      el.style.background = 'rgba(0,0,0,0.85)';
      el.style.color = '#fff';
      el.style.display = 'none';
      el.style.zIndex = '2147483647';
      el.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif';
      el.style.textAlign = 'center';
      el.style.padding = '24px';
      el.style.userSelect = 'none';
      el.style.webkitUserSelect = 'none';
      el.style.touchAction = 'none';
      el.innerHTML = `
        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:520px;width:90%">
          <div style="font-size:22px;font-weight:700;margin-bottom:12px">Rotate your device</div>
          <div style="font-size:16px;opacity:0.9;margin-bottom:20px">For the best experience, please rotate your phone to landscape to continue your interview.</div>
          <div style="font-size:13px;opacity:0.7">If the screen doesn't rotate automatically, turn off orientation lock in your device settings.</div>
        </div>`;
      document.body.appendChild(el);
    }
    return el;
  };
  const showRotateOverlay = () => {
    const el = ensureOverlay();
    el.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };
  const hideRotateOverlay = () => {
    const el = document.getElementById(OVERLAY_ID);
    if (el) el.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Try locking to landscape when supported
  const tryLockLandscape = useCallback(async () => {
    try {
      if (
        isMobile() &&
        typeof window !== 'undefined' && window.screen && window.screen.orientation && typeof window.screen.orientation.lock === 'function'
      ) {
        const isCurrentlyFullscreen = fullscreenAPI.isFullscreen();
        if (!isCurrentlyFullscreen) {
          const entered = await fullscreenAPI.request(document.documentElement);
          if (!entered) return false;
        }

        if (!mediaWarmupDoneRef.current) {
          mediaWarmupDoneRef.current = true;
          try {
            const warmupStream = await mediaDevices.getUserMedia({ audio: true, video: true });
            try { warmupStream.getTracks().forEach((t) => t.stop()); } catch (e) {}
          } catch (e) {
            permissionDialogActiveRef.current = true;
            setTimeout(() => {
              permissionDialogActiveRef.current = false;
            }, 3000);
          }
        }

        await window.screen.orientation.lock('landscape');
        hideRotateOverlay();
        return true;
      }
    } catch (e) {
      if (isMobile() && isPortrait()) {
        showRotateOverlay();
      }
      return false;
    }
    if (isMobile()) {
      if (isPortrait()) showRotateOverlay(); else hideRotateOverlay();
    }
    return false;
  }, []);

  const enterFullscreen = useCallback(async () => {
    if (Date.now() - lastFullscreenAttempt.current < 500) return false;

    const element = document.documentElement;
    const isCurrentlyFullscreen = fullscreenAPI.isFullscreen();

    if (!isCurrentlyFullscreen) {
      lastFullscreenAttempt.current = Date.now();
      try {
        const success = await fullscreenAPI.request(element);
        if (success) {
          fullscreenActiveRef.current = true;
          await tryLockLandscape();
          return true;
        } else {
          fullscreenActiveRef.current = false;
          return false;
        }
      } catch (error) {
        console.warn('Failed to enter fullscreen (user might have denied):', error);
        fullscreenActiveRef.current = false;
        return false;
      }
    } else {
      fullscreenActiveRef.current = true;
      await tryLockLandscape();
      return true;
    }
  }, [tryLockLandscape]);

  // Function to check camera access
  const checkCameraAccess = useCallback(async () => {
    try {
      const stream = await mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      // Monitor stream for camera being turned off
      stream.getVideoTracks().forEach(track => {
        track.onended = () => {
          if (interviewStartedRef.current) {
            triggerError('cameraTurnedOff', true);
          }
        };
      });

      return true;
    } catch (error) {
      console.error('Camera access error:', error);
      if (interviewStartedRef.current) {
        triggerError('cameraTurnedOff', true);
      }
      return false;
    }
  }, []);

  // Effect to check camera access periodically
  useEffect(() => {
    if (interviewStartedRef.current) {
      const checkInterval = setInterval(async () => {
        const hasAccess = await checkCameraAccess();
        if (!hasAccess) {
          clearInterval(checkInterval);
        }
      }, 5000);

      return () => clearInterval(checkInterval);
    }
  }, [interviewStartedRef.current, checkCameraAccess]);

  // Effect to handle initial fullscreen request and event listeners
  useEffect(() => {
    // Start iframe monitoring
    startIframeMonitoring();
    
    // Request fullscreen on first user interaction
    const initiateFullscreenOnInteraction = async () => {
      const success = await enterFullscreen();
      if (success) {
        ['click', 'touchstart', 'keydown'].forEach(event => {
          document.removeEventListener(event, initiateFullscreenOnInteraction);
        });
      }
    };

    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, initiateFullscreenOnInteraction);
    });

    // Event listener for fullscreen change
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = fullscreenAPI.isFullscreen();

      if (!isCurrentlyFullscreen && fullscreenActiveRef.current) {
        triggerError('fullScreenExit', true);
        console.log('Exited fullscreen, attempting to re-enter...');
        enterFullscreen();
      } else if (isCurrentlyFullscreen) {
        fullscreenActiveRef.current = true;
        tryLockLandscape();
      } else {
        fullscreenActiveRef.current = false;
      }
    };

    // Use the compatibility utility for fullscreen change events
    const cleanupFullscreenListener = fullscreenAPI.addChangeListener(handleFullscreenChange);

    // Improved visibility change handler
    const handleVisibilityChange = () => {
      // Clear any existing timeout
      if (permissionDialogTimeoutRef.current) {
        clearTimeout(permissionDialogTimeoutRef.current);
        permissionDialogTimeoutRef.current = null;
      }
      
      if (document.hidden) {
        // Set a timeout to check if we're still hidden after a delay
        permissionDialogTimeoutRef.current = setTimeout(() => {
          // If we're still hidden after 2 seconds and it's not a permission dialog or iframe, trigger error
          if (document.hidden && interviewStartedRef.current && 
              !permissionDialogActiveRef.current && !iframeInteractionRef.current) {
            triggerError('tabSwitching', true);
          }
        }, 2000);
      } else {
        // Page became visible again - clear any pending timeout
        if (permissionDialogTimeoutRef.current) {
          clearTimeout(permissionDialogTimeoutRef.current);
          permissionDialogTimeoutRef.current = null;
        }
        
        // If not in fullscreen, try to re-enter
        if (!document.fullscreenElement) {
          triggerError('tabSwitching', true);
          console.log('Document visible, attempting to enter fullscreen...');
          enterFullscreen();
        }
      }
    };

    // Improved window blur handler
    const handleWindowBlur = () => {
      if (interviewStartedRef.current) {
        // Check if this might be a browser permission dialog or iframe interaction
        const isIframeInteraction = checkIfIframeInteraction();
        
        // If it's an iframe interaction, don't trigger error
        if (isIframeInteraction) {
          console.log('Iframe interaction detected, ignoring blur event');
          iframeInteractionRef.current = true;
          return;
        }
        
        // Set a timeout to check if we're still blurred after a delay
        if (permissionDialogTimeoutRef.current) {
          clearTimeout(permissionDialogTimeoutRef.current);
        }
        
        permissionDialogTimeoutRef.current = setTimeout(() => {
          // If we're still blurred after 2 seconds and it's not a permission dialog or iframe, trigger error
          if (!document.hasFocus() && interviewStartedRef.current && 
              !permissionDialogActiveRef.current && !iframeInteractionRef.current) {
            triggerError('tabSwitching', true);
          }
        }, 2000);
      }
    };

    // Event listener for window focus
    const handleWindowFocus = () => {
      // Clear any pending permission dialog timeout
      if (permissionDialogTimeoutRef.current) {
        clearTimeout(permissionDialogTimeoutRef.current);
        permissionDialogTimeoutRef.current = null;
      }
      
      // Reset iframe interaction state when focus returns
      iframeInteractionRef.current = false;
      
      if (!document.fullscreenElement) {
        console.log('Window focused, attempting to enter fullscreen...');
        enterFullscreen();
      }
    };

    // Detect permission dialog dismissal by checking if focus returns
    const handleFocusAfterPermissionRequest = () => {
      // When focus returns after a permission request, mark dialog as inactive
      permissionDialogActiveRef.current = false;
      document.removeEventListener('focus', handleFocusAfterPermissionRequest, true);
    };

    // Monitor for permission requests
    const originalGetUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // Mark permission dialog as active
      permissionDialogActiveRef.current = true;
      
      // Set up listener for when focus returns (dialog dismissed)
      document.addEventListener('focus', handleFocusAfterPermissionRequest, true);
      
      // Set timeout to automatically mark as inactive after 10 seconds
      setTimeout(() => {
        permissionDialogActiveRef.current = false;
        document.removeEventListener('focus', handleFocusAfterPermissionRequest, true);
      }, 10000);
      
      // Call the original function
      return originalGetUserMedia.apply(this, arguments);
    };

    // Prevent certain common actions that could exit fullscreen or open dev tools
    const preventRestrictedKeys = (event) => {
      // Block common dev tool shortcuts and F11
      if (
        event.key === "F12" ||
        event.key === "F11" ||
        (event.ctrlKey && event.shiftKey && event.key === "I") || // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && event.key === "J") || // Ctrl+Shift+J
        (event.ctrlKey && event.key === "U") || // Ctrl+U
        (event.metaKey && event.altKey && event.key === "I") || // Cmd+Opt+I (Mac)
        (event.metaKey && event.altKey && event.key === "J") || // Cmd+Opt+J (Mac)
        (event.metaKey && event.shiftKey && event.key === "C") || // Cmd+Shift+C (Mac)
        (event.ctrlKey && event.shiftKey && event.key === "C") // Ctrl+Shift+C
      ) {
        event.preventDefault();
        triggerError('developerToolsAccess', true);
      }

      // Detect tab switching shortcuts
      if (
        (event.altKey && event.key === "Tab") || // Alt+Tab
        (event.ctrlKey && event.key === "Tab") || // Ctrl+Tab
        (event.metaKey && event.key === "Tab") || // Cmd+Tab (Mac)
        (event.ctrlKey && event.key >= "1" && event.key <= "9") || // Ctrl+Number
        (event.metaKey && event.key >= "1" && event.key <= "9") // Cmd+Number (Mac)
      ) {
        event.preventDefault();
        triggerError('tabSwitching', true);
      }

      // Re-enter fullscreen if Escape key is pressed
      if (event.key === 'Escape' || event.code === 'Escape') {
        event.preventDefault();
        triggerError('fullScreenExit', true);

        const attemptReEntry = async () => {
          let attempts = 0;
          const maxAttempts = 5;

          const tryFullscreen = async () => {
            if (attempts >= maxAttempts) return;

            const success = await enterFullscreen();
            if (!success) {
              attempts++;
              setTimeout(tryFullscreen, 1000);
            }
          };

          await tryFullscreen();
        };

        attemptReEntry();
      }
    };

    // Prevent right-click context menu
    const preventContextMenu = (e) => {
      e.preventDefault();
      triggerError('rightClickOrInspectElement', true);
    };

    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('keydown', preventRestrictedKeys, { capture: true });
    document.addEventListener('contextmenu', preventContextMenu);

    // Re-attempt landscape lock on orientation changes or resizes
    const relockOnChange = () => {
      if (isMobile()) {
        tryLockLandscape();
        if (!(typeof window !== 'undefined' && window.screen && window.screen.orientation) || typeof window.screen.orientation.lock !== 'function') {
          if (isPortrait()) showRotateOverlay(); else hideRotateOverlay();
        }
      }
    };
    window.addEventListener('orientationchange', relockOnChange);
    window.addEventListener('resize', relockOnChange);

    // Cleanup function
    return () => {
      // Stop iframe monitoring
      stopIframeMonitoring();
      
      if (permissionDialogTimeoutRef.current) {
        clearTimeout(permissionDialogTimeoutRef.current);
        permissionDialogTimeoutRef.current = null;
      }
      
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('keydown', preventRestrictedKeys, true);
      document.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('orientationchange', relockOnChange);
      window.removeEventListener('resize', relockOnChange);
      
      if (typeof cleanupFullscreenListener === 'function') cleanupFullscreenListener();

      // Restore original getUserMedia
      navigator.mediaDevices.getUserMedia = originalGetUserMedia;

      // Important: if the component unmounts, exit fullscreen cleanly
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      // Remove overlay if exists
      const el = document.getElementById(OVERLAY_ID);
      if (el && el.parentNode) el.parentNode.removeChild(el);
      document.body.style.overflow = '';
    };
  }, []);

  // Effect to handle copy-paste blocking
  useEffect(() => {
    const node = containerRef.current;

    const blockEvent = (e) => {
      e.preventDefault();
      if (interviewStartedRef.current) {
        triggerError('copyPasteActivity', true);
      }
    };

    const handleClick = async (e) => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        await enterFullscreen();
      }
      if (isCurrentlyFullscreen) {
        triggerError('fullScreenExit', false);
        await enterFullscreen();
      }
    };

    const handleKeyDown = async (e) => {
      // Check for various tab switching combinations
      if (
        (e.altKey && e.key === 'Tab') || // Alt+Tab
        (e.altKey && e.shiftKey && e.key === 'Tab') || // Alt+Shift+Tab
        (e.ctrlKey && e.key === 'Tab') || // Ctrl+Tab
        (e.ctrlKey && e.shiftKey && e.key === 'Tab') || // Ctrl+Shift+Tab
        (e.metaKey && e.key === 'Tab') || // Cmd+Tab (for Mac)
        (e.metaKey && e.shiftKey && e.key === 'Tab') // Cmd+Shift+Tab (for Mac)
      ) {
        e.preventDefault();
        const isCurrentlyFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );

        if (!isCurrentlyFullscreen) {
          await enterFullscreen();
        }
        triggerError('tabSwitching', true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (interviewStartedRef.current) {
          triggerError('copyPasteActivity', true);
        }
      } else {
        // For any other key press, check and re-enter fullscreen if needed
        const isCurrentlyFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );

        if (!isCurrentlyFullscreen) {
          await enterFullscreen();
        }
      }
    };

    if (node) {
      // Add event listeners with capture phase to ensure they're caught
      node.addEventListener("copy", blockEvent, { capture: true });
      node.addEventListener("paste", blockEvent, { capture: true });
      node.addEventListener("cut", blockEvent, { capture: true });
      node.addEventListener("click", handleClick, { capture: true });
      node.addEventListener("keydown", handleKeyDown, { capture: true });
      // Add mousedown event for better click handling
      node.addEventListener("mousedown", handleClick, { capture: true });
      // Add touchstart for mobile devices
      node.addEventListener("touchstart", handleClick, { capture: true });
    }

    return () => {
      if (node) {
        node.removeEventListener("copy", blockEvent, { capture: true });
        node.removeEventListener("paste", blockEvent, { capture: true });
        node.removeEventListener("cut", blockEvent, { capture: true });
        node.removeEventListener("click", handleClick, { capture: true });
        node.removeEventListener("keydown", handleKeyDown, { capture: true });
        node.removeEventListener("mousedown", handleClick, { capture: true });
        node.removeEventListener("touchstart", handleClick, { capture: true });
      }
    };
  }, [interviewStartedRef.current]);

  // Effect to handle error message timeout
  useEffect(() => {
    if (dynamicErrorMessage.isError) {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      // If it's a fullscreen exit error and we're back in fullscreen, clear it immediately
      if (dynamicErrorMessage.currentErrorType === 'fullScreenExit' && isCurrentlyFullscreen) {
        triggerError('', false);
        return;
      }

      // For other errors, use the timer
      if (dynamicErrorMessage.currentErrorType !== 'fullScreenExit') {
        const timer = setTimeout(() => {
          // After clearing other errors, check if we're still not in fullscreen
          if (!isCurrentlyFullscreen) {
            triggerError('fullScreenExit', true);
          } else {
            triggerError('', false);
          }
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [dynamicErrorMessage.isError, dynamicErrorMessage.currentErrorType]);

  // Function to start monitoring for violations
  const startInterviewMonitoring = async () => {
    interviewStartedRef.current = true;
    const hasCameraAccess = await checkCameraAccess();
    if (!hasCameraAccess) {
      triggerError('cameraTurnedOff', true);
    }
  };

  return { dynamicErrorMessage, containerRef, startInterviewMonitoring };
};

export default useForceFullscreen;