
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";



const fetchCandidateList = createAsyncThunk(
  'fetchCandidateList',
  async ({ selectedJobId, selectedRoundId,reportLink='' }, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/api/enablex/get-all-candidates`, {
        "jobId": selectedJobId,
        "interviewRound": selectedRoundId,
        reportLink,
      });
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const fetchTotalQuestions = createAsyncThunk(
  'fetchTotalQuestions',
  async ({ selectedJobId, selectedRoundId,responseType }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/interview-question/get-questions-based-on-question-type`, {
        jobId: selectedJobId,
        interviewRound: selectedRoundId,
        questionType: "skillBased",
        responseType
      });
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const fetchCandidateResponseList = createAsyncThunk(
  'fetchCandidateResponseList',
  async ({ selectedJobId, selectedRoundId, id,responseTypes="video"}, { rejectWithValue }) => {
    try {

      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/api/enablex/get-candidates-answers`, {
        userId: id,
        jobId: selectedJobId,
        interviewRound: selectedRoundId,
        questionTypes: 'skillBased',
        responseTypes
      });

      if (data.success) {

        return data;

      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const triggerScoreCalculation = createAsyncThunk(
  'triggerScoreCalculation',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/api/admin/score-calculation/trigger-based-on-search`, {
        jobId: payload?.jobId,
        interviewRound: payload?.interviewRound,
        questionType: payload?.questionType,
        candidateStatus: payload?.candidateStatus,
        placementAgency: payload?.placementAgency,
        recruiterName: payload?.recruiterName,
        vacancyLocation: payload?.vacancyLocation
      });
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const saveUserProfile = createAsyncThunk(
  'saveUserProfile', async (formData,{rejectWithValue}) => {
    try {
      console.log("form data",formData);
      
      const { data } = await axiosInstance.post(`${baseUrl}/common/user/save-user-profile`, 
        formData
      );
      if (data?.status || data?.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const fetchSelectedCandidateInfo = createAsyncThunk(
  'fetchSelectedCandidateInfo',
  async ({ id }, { rejectWithValue }) => {
    try {

      const formData = new FormData();
      formData.append('userId', id);
      const { data } = await axiosInstance.request({ method: 'post', url: `${baseUrl}/common/user/get-user-profile`, data: formData });
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

// const fetchSelectedCandidateRating = createAsyncThunk(
//   'fetchSelectedCandidateRating',
//   async ({ selectedCandidateId, selectedJobId, selectedRoundId }, { rejectWithValue }) => {
//     try {
//       const { data } = await axiosInstance.post(`${baseUrl}/job-posting/candidate-scores/get`, {
//         jobId: selectedJobId,
//         interviewRound: selectedRoundId,
//         userId: selectedCandidateId
//       });
//       if (data.status) {
//         return data;
//       } else {
//         return rejectWithValue(data.message);
//       }
//     } catch (error) {
//       ErrorToast(error.message)
//       return rejectWithValue(error.message);
//     }
//   }
// );

const fetchCandidateVideoScores = createAsyncThunk(
  'fetchCandidateVideoScores',
  async ({ selectedJobId, selectedRoundId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/api/candidate-video-score/get`, {
        jobId: selectedJobId,
        interviewRound: selectedRoundId,
      });
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);

const fetchReportMetaData = createAsyncThunk(
'fetchReportMetaData', async ({selectedJobId,selectedRoundId,selectedCandidateList,selectedInterviewersEmailList,reportType,sortBy},{rejectWithValue})=>{
  try {
    const { data } = await axiosInstance.post(`${baseUrl}/job-posting/interview-link/generate-report-link`, {
      "jobId": selectedJobId,
      "interviewRound": selectedRoundId,
      "interviewerList":selectedInterviewersEmailList,
      "candidateList":selectedCandidateList,
      "reportType":reportType,
      "sortBy":sortBy
    });
    if (data?.status || data?.success) {
      return data;
    } else {
      return rejectWithValue(data.message);
    }
  } catch (error) {
    ErrorToast(error.message)
    return rejectWithValue(error.message);
  }

}
);
export {
  fetchCandidateList,
  fetchTotalQuestions,
  // fetchSelectedCandidateRating,
  fetchCandidateResponseList,
  fetchSelectedCandidateInfo,
  fetchCandidateVideoScores,
  fetchReportMetaData,
  triggerScoreCalculation,
  saveUserProfile
};