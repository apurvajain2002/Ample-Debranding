import { useEffect } from 'react';
import { featureDetection, getBrowserInfo, getDeviceInfo } from '../utils/browserCompatibility';

const GEO_IP_ENDPOINT = 'https://ipwho.is/?fields=ip,city,region,country,latitude,longitude,connection';

const useInterviewDiagnostics = () => {
  useEffect(() => {
    let cancelled = false;

    const logClientDiagnostics = async () => {
      const browserInfo = getBrowserInfo();
      const deviceInfo = getDeviceInfo();
      const featureSupport = featureDetection.getSupportedFeatures();
      let ipPayload = null;

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
      console.info('Browser info:', browserInfo);
      console.info('Device info:', deviceInfo);
      console.info('Feature support:', featureSupport);

      if (ipPayload) {
        const { ip, city, region, country, latitude, longitude, connection } = ipPayload;
        console.info('IP details:', {
          ip,
          city,
          region,
          country,
          latitude,
          longitude,
          isp: connection?.isp || connection?.asn || 'Unknown'
        });
      } else {
        console.warn('IP/location details not available.');
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
