import { useCallback } from 'react';
import { useGlobalContext } from '../context';
import { saveCandidateResponse as saveCandidateResponseBase, updateCandidateInterviewStatus as updateCandidateInterviewStatusBase } from '../screens/interview/api';
import { featureDetection, getBrowserInfo, getDeviceInfo } from '../utils/browserCompatibility';


const useApiWithDiagnostics = () => {
  const { setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport, ipDetails } = useGlobalContext();

  // Function to refresh diagnostics data
  const refreshDiagnostics = useCallback(async () => {
    try {
      // Update browser, device, and feature info
      const browserInfoData = getBrowserInfo();
      const deviceInfoData = getDeviceInfo();
      const featureSupportData = featureDetection.getSupportedFeatures();
      
      setBrowserInfo(browserInfoData);
      setDeviceInfo(deviceInfoData);
      setFeatureSupport(featureSupportData);

      // Fetch fresh IP details
      
    } catch (error) {
      console.error('Error refreshing diagnostics:', error);
    }
  }, [setIpDetails, setBrowserInfo, setDeviceInfo, setFeatureSupport]);

  // Wrapper for saveCandidateResponse that refreshes diagnostics first
  const saveCandidateResponse = useCallback(async (
    interviewId,
    question,
    userId,
    answer,
    audioBlob,
    scriptType = "skillBased",
    serviceId = null,
    conferenceNo = null,
    roomId = null,
    snapshotImage = null,
    tenantId = '0'
  ) => {
    // Refresh diagnostics before calling the API
    await refreshDiagnostics();
    
    // Get the latest ipDetails from context
    const currentIpDetails = ipDetails;
    
    // Call the original API function with fresh ipDetails
    return saveCandidateResponseBase(
      interviewId,
      question,
      userId,
      answer,
      audioBlob,
      scriptType,
      serviceId,
      conferenceNo,
      roomId,
      snapshotImage,
      tenantId,
      currentIpDetails
    );
  }, [refreshDiagnostics, ipDetails]);

  // Wrapper for updateCandidateInterviewStatus that refreshes diagnostics first
  const updateCandidateInterviewStatus = useCallback(async (
    jobId,
    userId,
    interviewRound,
    interviewStatus,
    language,
    tenantId
  ) => {
    // Refresh diagnostics before calling the API
    await refreshDiagnostics();
    
    // Get the latest ipDetails from context
    const currentIpDetails = ipDetails;
    
    // Call the original API function with fresh ipDetails
    return updateCandidateInterviewStatusBase(
      jobId,
      userId,
      interviewRound,
      interviewStatus,
      language,
      tenantId,
      currentIpDetails
    );
  }, [refreshDiagnostics, ipDetails]);

  return {
    saveCandidateResponse,
    updateCandidateInterviewStatus,
    refreshDiagnostics
  };
};

export default useApiWithDiagnostics;
