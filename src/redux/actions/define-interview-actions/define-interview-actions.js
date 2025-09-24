import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

export const saveRoundDetails = createAsyncThunk(
  "saveRoundDetails",
  async ({ jobId, roundName, roundData }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/define-interviews/save`,
        {
          jobId: jobId,
          interviewRound: roundName,
          interviewTeam: roundData.interviewTeam.length
            ? roundData.interviewTeam
            : [],
          domainSkills: roundData.domainSkills,
          softSkills: roundData.softSkills,
          defaultLanguage: roundData.defaultLanguage,
          interviewTranslationLanguages: roundData.translationLanguages,
          isRoundPublished:roundData?.isRoundPublished,
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

export const getRoundDetails = createAsyncThunk(
  "getInterviewDetails",
  async ({ jobId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/define-interviews/get-all`,
        {
          jobId: jobId,
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

export const getAllLanguages = createAsyncThunk(
  "getAllLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/language/get`,
        {}
      );

      if (data.status) {
        // Sort the languageList before returning
        const priorityLanguages = ["en-IN", "hi-IN"];
        const sortedLanguageList = data.languageList.sort((a, b) => {
          const aPriority = priorityLanguages.includes(a.code)
            ? priorityLanguages.indexOf(a.code)
            : Infinity;
          const bPriority = priorityLanguages.includes(b.code)
            ? priorityLanguages.indexOf(b.code)
            : Infinity;

          // Prioritize based on priorityLanguages
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }

          // Alphabetical order for the rest
          return a.name.localeCompare(b.name);
        });

        // Return the modified data object with sorted languageList
        return {
          ...data,
          languageList: sortedLanguageList,
        };
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// this api needs to be updated
// orgId is needed to get the jobs
// and probably userId too
export const getAllNotPublishedJobs = createAsyncThunk(
  "getAllNonPublishedJobs",
  async ({ userId = null }, { rejectWithValue }) => {
    console.log(userId);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-all-not-published-jobs`,
        {
          orgId: 1,
          userId: userId,
        }
      );

      if (data.success) {
        return data.list;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getAllNotPublishedLateralJobs = createAsyncThunk(
  "getAllNotPublishedLateralJobs",
  async ({ userId = null }, { rejectWithValue }) => {
    console.log(userId);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-all-not-published-lateral-jobs`,
        {
          orgId: 1,
          userId: userId,
        }
      );

      if (data.success) {
        return data.list;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const getAllNotPublishedCampusJobs = createAsyncThunk(
  "getAllNotPublishedCampusJobs",
  async ({ userId = null }, { rejectWithValue }) => {
    console.log(userId);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-all-not-published-campus-jobs`,
        {
          orgId: 1,
          userId: userId,
        }
      );

      if (data.success) {
        return data.list;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getJobsFromEntity = createAsyncThunk(
  "getJobsFromEntity",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/job-details/get-all-not-published-jobs`,
        { 
          orgId: 1,
          userId,
        }
      );

      if (data.success) {
        return data.list;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);
