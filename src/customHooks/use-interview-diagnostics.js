import { useEffect } from 'react';
import { featureDetection, getBrowserInfo, getDeviceInfo } from '../utils/browserCompatibility';
import { useGlobalContext } from '../context';

const GEO_IP_ENDPOINT = 'https://ipwho.is/?fields=ip,city,region,country,latitude,longitude,connection';

const useInterviewDiagnostics = () => {
  const { setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport } = useGlobalContext();

  useEffect(() => {
    let cancelled = false;

    const logClientDiagnostics = async () => {
      const browserInfoData = getBrowserInfo();
      const deviceInfoData = getDeviceInfo();
      const featureSupportData = featureDetection.getSupportedFeatures();
      let ipPayload = null;

      // Store in global context
      setBrowserInfo(browserInfoData);
      setDeviceInfo(deviceInfoData);
      setFeatureSupport(featureSupportData);

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
        
        // Store IP details in global context
        setIpDetails(ipDetailsData);
        
        console.info('IP details:', ipDetailsData);
      } else {
        console.warn('IP/location details not available.');
        setIpDetails(null);
      }

      console.groupEnd();
    };

    logClientDiagnostics();

    return () => {
      cancelled = true;
    };
  }, []);
};

export default useInterviewDiagnostics;
