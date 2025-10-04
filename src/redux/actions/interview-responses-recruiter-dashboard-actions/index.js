import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";
import { useDispatch } from "react-redux";
import SuccessToast from "../../../components/toasts/success-toast";


const fetchFilterRejectCandidates = createAsyncThunk(
  'fetchFilterRejectCandidates', async ({ selectedJobId, selectedRoundId, questionData }, { rejectWithValue }) => {
    try {
     
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/filter-candidate-status`,
        {
          jobId: selectedJobId,
          roundName: selectedRoundId,
          questionData:questionData
        }
      );

      if (data) {
        console.log("data fetched",data);
        return data;
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const fetchQuestionsByTypes = createAsyncThunk(
  'fetchQuestionsByTypes',
  async ({ selectedJobId, selectedRoundId, selectedQuestionTypes }, { rejectWithValue }) => {
    try {
      let questionType = "skillBased";
      let responseType = "";
      if (selectedQuestionTypes.includes("filtration")) {
        questionType = "filtration";
        responseType = "mcr";
      } else if (selectedQuestionTypes.includes("mcq") || selectedQuestionTypes.includes("audio") || selectedQuestionTypes.includes("video")) {
        responseType = selectedQuestionTypes.join(",");
      }


      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-question/get-questions-based-on-question-type`,
        {
          jobId: selectedJobId,
          interviewRound: selectedRoundId,
          questionType: questionType,
          responseType: responseType
        }
      );

      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const fetchAudioScores = createAsyncThunk(
  'fetchAudioScores', async ({ selectedJobId, selectedRoundId }, { rejectWithValue }) => {
    try {
     
      console.log("selectedRoundId",selectedRoundId);
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-audio-score/get`,
        {
          jobId: selectedJobId,
          interviewRound: selectedRoundId,  
        }
      );

      if (data) {
        console.log("audioScoresfetched",data);
        return data;
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const fetchVideoScores = createAsyncThunk(
  'fetchVideoScores', async ({ selectedJobId, selectedRoundId }, { rejectWithValue }) => {
    try {
     
      console.log("selectedRoundId",selectedRoundId);
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-video-score/get`,
        {
          jobId: selectedJobId,
          interviewRound: selectedRoundId,  
        }
      );

      if (data) {
        console.log("videoscoresfetched",data);
        return data;
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const fetchDomainScores = createAsyncThunk(
  'fetchDomainScores', async ({ selectedJobId, selectedRoundId }, { rejectWithValue }) => {
    try {
     
      console.log("selectedRoundId",selectedRoundId);
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-domain-score/get`,
        {
          jobId: selectedJobId,
          interviewRound: selectedRoundId,  
        }
      );

      if (data) {
        console.log("domainscores",data);
        return data;
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const updateCandidateStatus = createAsyncThunk(
  'updateCandidateStatus', async ({ selectedJobId, selectedRoundId, statusData, published }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-status/save`,
        {
          jobId: selectedJobId,
          roundName:selectedRoundId,
          candidateStatusValueList: statusData,
          isPublished:published  
        }
      );
      if (data) {
       return data;
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const moveToNextRound = createAsyncThunk(
  'moveToNextRound', async ({ selectedJobId,selectedRoundId, userIds }, { rejectWithValue }) => {
    try {
      console.log("function is called");
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/move-to-next-round`,
        {
          jobId: selectedJobId,
          interviewRound: selectedRoundId,
          userIds: userIds,  
        }
      );
      if (data) {
        if(data.status) {
          SuccessToast(data?.message??"Users successfully moved to the next round!");
          return data; // Return the data for Redux state
        } else {
          ErrorToast("Users are not moved to the next round!");
          return rejectWithValue(data.message);
        }
      } else {
        return rejectWithValue(data.message);
      }

    }
    catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);
export { fetchQuestionsByTypes,
  fetchFilterRejectCandidates,
  fetchAudioScores,fetchVideoScores,
  moveToNextRound,
  updateCandidateStatus
  ,fetchDomainScores };