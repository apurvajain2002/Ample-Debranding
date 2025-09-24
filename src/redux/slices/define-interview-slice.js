import { createSlice } from "@reduxjs/toolkit";
import {
  getAllLanguages,
  getAllNotPublishedJobs,
  getRoundDetails,
  saveRoundDetails,
  getJobsFromEntity,
  getAllNotPublishedLateralJobs,
  getAllNotPublishedCampusJobs
} from "../actions/define-interview-actions/define-interview-actions";
import { roundsData } from "../../resources/constant-data/roundsData";
import { getJob } from "../actions/create-job-actions";

const initialState = {
  recruiterRound: {
    interviewTeam: [],
    domainSkills: [],
    softSkills: [],
    defaultLanguage: "",
    interviewTranslationLanguages: [],
  },

  l1Round: {
    interviewTeam: [],
    domainSkills: [],
    softSkills: [],
    defaultLanguage: "",
    otherLanguages: [],
  },

  allLanguages: [],
  allNotPublishedJobs: [],
  isLoading: false,
  allEntityJobs: [],
  currentJob: null,
  successMessage: "",
  failMessage: "",

  isNotPublishedJobsApiCalled: false,
};

const defineInterviewSlice = createSlice({
  name: "defineInterviewSlice",
  initialState,
  reducers: {
    setRecruiterRound(state, action) {
      state.recruiterRound = action.payload;
    },
    setL1Round(state, action) {
      state.l1Round = action.payload;
    },
    setAllLanguages(state, action) {
      state.allLanguages = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.failMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    setIsNotPublishedJobsApiCalled: (state, action) => {
      state.isNotPublishedJobsApiCalled = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveRoundDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(saveRoundDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(saveRoundDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      .addCase(getRoundDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getRoundDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.l1Round =
          action.payload?.interviewRounds[0]?.interviewRound ===
            roundsData.secondRound.name
            ? action.payload?.interviewRounds[0]
            : action.payload?.interviewRounds[1]?.interviewRound ===
              roundsData.secondRound.name
              ? action.payload?.interviewRounds[1]
              : {};
        state.recruiterRound =
          action.payload?.interviewRounds[0]?.interviewRound ===
            roundsData.firstRound.name
            ? action.payload?.interviewRounds[0]
            : action.payload?.interviewRounds[1]?.interviewRound ===
              roundsData.firstRound.name
              ? action.payload?.interviewRounds[1]
              : {};
      })
      .addCase(getRoundDetails.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllLanguages.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllLanguages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allLanguages = action.payload.languageList;
      })
      .addCase(getAllLanguages.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllNotPublishedJobs.pending, (state, action) => {
        state.isLoading = true;
        state.isNotPublishedJobsApiCalled = false;
      })
      .addCase(getAllNotPublishedJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allNotPublishedJobs = action.payload;
        state.isNotPublishedJobsApiCalled = true;
      })
      .addCase(getAllNotPublishedJobs.rejected, (state, action) => {
        state.isNotPublishedJobsApiCalled = false;
        state.isLoading = false;
      })

      .addCase(getAllNotPublishedLateralJobs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllNotPublishedLateralJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allNotPublishedJobs = action.payload;
      })
      .addCase(getAllNotPublishedLateralJobs.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllNotPublishedCampusJobs.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllNotPublishedCampusJobs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allNotPublishedJobs = action.payload;
      })
      .addCase(getAllNotPublishedCampusJobs.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getJobsFromEntity.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getJobsFromEntity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allEntityJobs = action.payload;
      })
      .addCase(getJobsFromEntity.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getJob.fulfilled, (state, action) => {
        state.currentJob = action.payload.data;
      })
      ;
  },
});

export const {
  setRecruiterRound,
  setL1Round,
  setAllLanguages,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setCurrentJob,
  setIsNotPublishedJobsApiCalled
} = defineInterviewSlice.actions;

const defineInterviewSliceReducer = defineInterviewSlice.reducer;
export default defineInterviewSliceReducer;
