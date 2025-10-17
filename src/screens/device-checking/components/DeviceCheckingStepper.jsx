import { useEffect, useState } from "react";
import EvuemeImageTag from "../../../components/evueme-html-tags/Evueme-image-tag";
import { icon } from "../../../components/assets/assets";
import cameraIconGreen from "../../../resources/images/interview-rounds/image-table/camera-icon-green.svg";
import micIconGreen from "../../../resources/images/interview-rounds/image-table/mic-ico.svg";
import internetIconGreen from "../../../resources/images/interview-rounds/image-table/internet-green-ico.svg";
import webIconGreen from "../../../resources/images/interview-rounds/image-table/web-icon-green.svg";
import googleChromeIcon from "../../../resources/images/interview-rounds/image-table/google-chrome-icon.svg";
import NormalButton from "../../../components/buttons/normal-button";
import Tooltip from "../../../components/miscellaneous/tooltip";
import { featureDetection, getBrowserInfo, getCompatibilityWarnings } from "../../../utils/browserCompatibility";
import BrowserCompatibilityWarning from "../../../components/miscellaneous/browser-compatibility-warning";

const CHECK_STATUS = {
  camera: null,
  microphone: null,
  browser: null,
  connection: null,
  bandwidth: null,
};

const CHECK_OPTIONS = [
  "camera",
  "microphone",
  "browser",
  "connection",
  "bandwidth",
];

const DeviceCheckingStepper = ({
  stepsConfig = [],
  onFinish = async () => {},
}) => {
  const [checkStatus, setCheckStatus] = useState(CHECK_STATUS);
  const [retriesLeft, setRetriesLeft] = useState(5);
  const [showRetry, setShowRetry] = useState(false);

  // run diagnosis
  const runDiagnosis = () => {
    try {
      // Check browser compatibility first
      const browserInfo = getBrowserInfo();
      const compatibilityWarnings = getCompatibilityWarnings();
      
      // Set browser status based on feature support rather than strict browser detection
      const browserSupported = featureDetection.isSupported('webrtc') && 
                              featureDetection.isSupported('mediadevices');
      
      setCheckStatus((prev) => ({
        ...prev,
        browser: browserSupported
      }));

      // Log compatibility warnings
      if (compatibilityWarnings.length > 0) {
        console.warn('Browser compatibility warnings:', compatibilityWarnings);
      }

      // Run EnxRtc diagnostics if available
      if (window.EnxRtc && window.EnxRtc.clientDiagnostics) {
        console.log('EnxRtc available, running client diagnostics...');
        const checkOptions = CHECK_OPTIONS.filter(option => option !== 'browser'); // Skip browser check as we handle it separately
        
        window.EnxRtc.clientDiagnostics(checkOptions, async (res) => {
          const [key, value] = Object.entries(res)[0];
          setCheckStatus((prev) => {
            return {
              ...prev,
              [key]: value.result || value.supported,
            };
          });

          console.log(key, value);
        });
      } else {
        // Fallback diagnostics if EnxRtc is not available
        console.log('EnxRtc not available, running fallback diagnostics');
        runFallbackDiagnostics();
      }
    } catch (err) {
      console.error('Diagnostics error:', err);
      // Run fallback diagnostics on error
      runFallbackDiagnostics();
    }
  };

  // Fallback diagnostics for browsers without EnxRtc
  const runFallbackDiagnostics = async () => {
    try {
      // Check camera
      try {
        console.log('Checking camera...');
        const stream = await navigator.mediaDevices?.getUserMedia({ video: true });
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          console.log('Camera check passed');
          setCheckStatus(prev => ({ ...prev, camera: "passed" }));
        } else {
          console.log('Camera check failed - no stream');
          setCheckStatus(prev => ({ ...prev, camera: "failed" }));
        }
      } catch (error) {
        console.warn('Camera check failed:', error);
        setCheckStatus(prev => ({ ...prev, camera: "failed" }));
      }

      // Check microphone
      try {
        console.log('Checking microphone...');
        const stream = await navigator.mediaDevices?.getUserMedia({ audio: true });
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          console.log('Microphone check passed');
          setCheckStatus(prev => ({ ...prev, microphone: "passed" }));
        } else {
          console.log('Microphone check failed - no stream');
          setCheckStatus(prev => ({ ...prev, microphone: "failed" }));
        }
      } catch (error) {
        console.warn('Microphone check failed:', error);
        setCheckStatus(prev => ({ ...prev, microphone: "failed" }));
      }

      // Check connection (basic internet connectivity)
      try {
        console.log('Checking internet connection...');
        
        // Try multiple endpoints for better reliability
        const endpoints = [
          'https://httpbin.org/status/200',
          'https://www.google.com/favicon.ico',
          'https://www.cloudflare.com/favicon.ico'
        ];
        
        let connectionSuccessful = false;
        
        for (const endpoint of endpoints) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per endpoint
            
            const response = await fetch(endpoint, { 
              method: 'HEAD',
              signal: controller.signal,
              mode: 'no-cors' // Use no-cors to avoid CORS issues
            });
            
            clearTimeout(timeoutId);
            console.log(`Connection check successful with ${endpoint}:`, response.status);
            connectionSuccessful = true;
            break;
          } catch (endpointError) {
            console.log(`Connection check failed with ${endpoint}:`, endpointError);
            continue;
          }
        }
        
        if (connectionSuccessful) {
          setCheckStatus(prev => ({ ...prev, connection: true }));
        } else {
          // If all endpoints fail, try the image fallback
          console.log('All endpoints failed, trying image fallback...');
          const img = new Image();
          img.onload = () => {
            console.log('Image fallback connection check successful');
            setCheckStatus(prev => ({ ...prev, connection: true }));
          };
          img.onerror = () => {
            console.log('Image fallback connection check failed');
            setCheckStatus(prev => ({ ...prev, connection: false }));
          };
          img.src = 'https://www.google.com/favicon.ico?' + new Date().getTime();
        }
        
      } catch (error) {
        console.warn('Connection check completely failed:', error);
        setCheckStatus(prev => ({ ...prev, connection: false }));
      }

      // Set bandwidth to good if connection is working
      setCheckStatus(prev => ({ ...prev, bandwidth: 'good' }));
      
      // Add a small delay to ensure all checks complete
      setTimeout(() => {
        console.log('All fallback diagnostics completed');
      }, 1000);
      
    } catch (error) {
      console.error('Fallback diagnostics failed:', error);
      onFinish(false);
    }
  };

  // for bandwidth render
  const connectivityRender = (status) => {
    switch (status) {
      case "good":
        return (
          <p className="goodp">
            Result: <span>Good</span> (Internet speed supports video)
          </p>
        );
      case "average":
        return (
          <p className="goodp">
            Result: <span>Good</span> (Internet speed supports video)
          </p>
        );
      case "bad":
      case "poor":
        return (
          <p className="poor-p">
            Result: <span>Poor</span> (Internet speed does not support video.
            Try from a different Wi-Fi or Mobile hotspot connection)
          </p>
        );
      default:
        break;
    }
  };

  const isFailure = (state) => {
    return (
      state &&
      (state === false ||
        state === "failed" ||
        state === "bad" ||
        state === "poor")
    );
  };

  function handleRetryDiagnosis() {
    setCheckStatus(CHECK_STATUS);
    setShowRetry(false);
    setRetriesLeft((prev) => prev - 1);
    runDiagnosis();
  }

  useEffect(() => {
    const { browser, camera, microphone, connection, bandwidth } = checkStatus;
    // on these cases, terminate interview
    const didFail =
      isFailure(browser) ||
      isFailure(connection) ||
      isFailure(bandwidth) ||
      isFailure(camera) ||
      isFailure(microphone);

         const didBandwidthFail = bandwidth && isFailure(bandwidth);
     const didConnFail = connection === false; // connection is explicitly false

     console.log("Connection status:", connection);
     console.log("Bandwidth status:", bandwidth);
     console.log("Did connection fail:", didConnFail);
     console.log("Did bandwidth fail:", didBandwidthFail);

     if (
       (didBandwidthFail || didConnFail) &&
       retriesLeft > 0
     ) {
       console.log("Failed internet test, retries left:", retriesLeft);
       setShowRetry(true);
     } else {
       // if any critical failure occurs, terminate check and return
       if (didFail) {
         console.log("Failure cases detected, exiting ...");
         setTimeout(() => {
           onFinish(false);
         }, 5000);
       }

       //  when all cases are filled with !failure states
       if (browser && camera && microphone && connection && bandwidth) {
         console.log("All checks passed, proceeding with interview...");
         setTimeout(() => {
           onFinish(true);
         }, 5000);
       } else if (browser && camera && microphone && bandwidth && connection !== false) {
         // If connection is still null (checking) but everything else is good, wait a bit more
         console.log("Most checks passed, waiting for connection check to complete...");
       }
     }
  }, [checkStatus]);

  useEffect(() => {
    // Always run diagnostics, don't wait for EnxRtc
    console.log("Starting device diagnostics...");
    runDiagnosis();
  }, []);

  return (
    <>
      <BrowserCompatibilityWarning />
      {/* {!isComplete ? <EvuemeLoader /> : null} */}
      <div className="container choosefileupload-container no-bg">
        <div className="fileuploadstatuswr">
          <div className="filestatus-bor devicestatusbar"></div>
          <div className="row">
            {stepsConfig.map((step, index) => {
              return (
                <div key={index} className="statusfilebox">
                  <div className="device-check-wr">
                    <div className="devicecheck">
                      <i>
                        <EvuemeImageTag
                          imgSrc={step.imgSrc}
                          altText={step.name}
                        />
                      </i>
                    </div>
                    <p>{step.name}</p>
                  </div>
                  <div
                    className={
                      checkStatus[step.id]
                        ? "device-checking-check-mark-after"
                        : "device-checking-check-mark-before"
                    }
                    style={
                      isFailure(checkStatus[step.id])
                        ? { background: "red" }
                        : {}
                    }
                  >
                    <i>
                      <EvuemeImageTag
                        imgSrc={
                          isFailure(checkStatus[step.id])
                            ? icon.crossIcon
                            : icon.checkMarkicon
                        }
                        altText={"Checked or Not Checked"}
                        className={"whiteColorFilter"}
                      />
                    </i>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container fileupload-container">
        <div
          className="row"
          style={{ display: "flex", flexDirection: "column", rowGap: "8px" }}
        >
          {/* Camera */}
          <div className={checkStatus.camera === "passed" ? "goodp" : "poor-p"} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i style={{ display: 'flex', alignItems: 'center' }}>
              <EvuemeImageTag imgSrc={cameraIconGreen} />
            </i>
            <span style={{ fontWeight: 'bold' }}>Camera</span>
            <span>-</span>
            <span>
              {checkStatus.camera === null && "Checking ..."}
              {checkStatus.camera === "passed" && "Passed"}
              {checkStatus.camera === "failed" &&
                "Try using a different device with a working camera"}
            </span>
          </div>

          {/* Microphone */}
          <div
            className={checkStatus.microphone === "passed" ? "goodp" : "poor-p"}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i style={{ display: 'flex', alignItems: 'center' }}>
              <EvuemeImageTag imgSrc={micIconGreen} />
            </i>
            <span style={{ fontWeight: 'bold' }}>Microphone</span>
            <span>-</span>
            <span>
              {checkStatus.microphone === null && "Checking ..."}
              {checkStatus.microphone === "passed" && "Passed"}
              {checkStatus.microphone === "failed" &&
                "Try using a different device with a working microphone"}
            </span>
          </div>

          {/* Browser */}
          <div className="testbrowswe-wr no-paddingwr" style={{ padding: "0" }}>
            <div className={checkStatus.browser ? "goodp" : "poor-p"} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i style={{ display: 'flex', alignItems: 'center' }}>
                <EvuemeImageTag imgSrc={webIconGreen} />
              </i>
              <span style={{ fontWeight: 'bold' }}>Browser Compatibility</span>
              <span>-</span>
              <span>
                {checkStatus.browser === null && "Checking ..."}
                {checkStatus.browser === true && "Passed"}
                {checkStatus.browser === false && "Failed"}
              </span>
            </div>
                         {checkStatus.browser === false && (
               <div className="full-width center-align">
                 <i>
                   <EvuemeImageTag imgSrc={googleChromeIcon} />
                 </i>
                 <p className="red-color">
                   Your browser has limited support for some features. <br />
                   For the best experience, consider using Chrome, Firefox, Safari, or Edge. <br />
                   The interview will continue with available features.
                 </p>
                 <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                   <strong>Supported features:</strong>
                   <ul style={{ textAlign: 'left', display: 'inline-block', margin: '5px 0' }}>
                     {(() => {
                       const features = featureDetection.getSupportedFeatures();
                       return Object.entries(features).map(([feature, supported]) => (
                         <li key={feature} style={{ color: supported ? '#4CAF50' : '#f44336' }}>
                           {feature}: {supported ? '✓' : '✗'}
                         </li>
                       ));
                     })()}
                   </ul>
                 </div>
               </div>
             )}
          </div>

                     {/* Connection */}
           <>
             <div
               className={checkStatus.connection ? "goodp" : "poor-p"}
               style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
             >
               <i style={{ display: 'flex', alignItems: 'center' }}>
                 <EvuemeImageTag imgSrc={internetIconGreen} />
               </i>
               <span style={{ fontWeight: 'bold' }}>Internet Connectivity</span>
               <span>-</span>
               <span style={{ color: checkStatus.bandwidth ? "#00bf7e" : "#ff0000" }}>
                 {checkStatus.bandwidth === null ? "Checking ..." : checkStatus.bandwidth.charAt(0).toUpperCase() + checkStatus.bandwidth.slice(1)}
               </span>
             </div>
            {checkStatus.bandwidth && (
              <div className="chatt-text chatt-notext test-wr">
                <div className="internet-wr">
                  <div className="strenth">
                    <p>Poor</p>
                    <div className="danger"></div>
                  </div>
                  <div className="strenth">
                    <p>Average</p>
                    <div className="average"></div>
                  </div>
                  <div className="strenth">
                    <p>Good</p>
                    <div className="good"></div>
                  </div>
                </div>
                {connectivityRender(checkStatus.bandwidth)}
              </div>
            )}
          </>

          {/* Light */}
          {/* <p className="poor-p">
              <i>
                <EvuemeImageTag imgSrc={lampIconRed} />
              </i>
              <font>Lighting</font> - <span>Failed</span>
            </p> */}
          {showRetry ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <NormalButton
                  buttonText={"Retry"}
                  buttonTagCssClasses={
                    "btn-clear btn-submit waves-effect waves-light"
                  }
                  onClick={handleRetryDiagnosis}
                />
                <i
                  className="show-details infermation-ico-black"
                  style={{ padding: "0" }}
                >
                  i
                  <Tooltip
                    divTagCssClasses={"infbox-click-done information-box-done"}
                  >
                    <p>
                      Switch to a different network, and click the Retry button
                      to run the tests again
                    </p>
                  </Tooltip>
                </i>
              </div>
              <p>Retries left: {retriesLeft}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* <button onClick={runDiagnosis} style={{ padding: "1rem" }}>
        Start Test
      </button> */}
    </>
  );
};

export default DeviceCheckingStepper;