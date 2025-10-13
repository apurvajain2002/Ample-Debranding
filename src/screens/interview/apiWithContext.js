import { useGlobalContext } from '../../context';
import { saveCandidateResponse as saveCandidateResponseBase, updateCandidateInterviewStatus as updateCandidateInterviewStatusBase } from './api';

// Wrapper functions that use GlobalContext
export const useApiWithContext = () => {
  const { ipDetails } = useGlobalContext();

  const saveCandidateResponse = async (
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
      ipDetails // Automatically pass ipDetails
    );
  };

  const updateCandidateInterviewStatus = async (
    jobId,
    userId,
    interviewRound,
    interviewStatus,
    language,
    tenantId
  ) => {
    return updateCandidateInterviewStatusBase(
      jobId,
      userId,
      interviewRound,
      interviewStatus,
      language,
      tenantId,
      ipDetails // Automatically pass ipDetails
    );
  };

  return {
    saveCandidateResponse,
    updateCandidateInterviewStatus
  };
};

// Export the base functions as well
export { saveCandidateResponse as saveCandidateResponseBase, updateCandidateInterviewStatus as updateCandidateInterviewStatusBase } from './api';
