import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";

// Create link
const generateLink = createAsyncThunk(
  "generateLink",
  async (
    {
      jobId,
      interviewRound,
      isPublic,
      startValidityTime,
      endValidityTime,
      timeZone,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/generate`,
        {
          jobId: jobId,
          interviewRound: interviewRound,
          isPublic: isPublic,
          startValidityTime: startValidityTime,
          endValidityTime: endValidityTime,
          timeZone: timeZone,
        }
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      // ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Shorten URL
const generateShortenLink = createAsyncThunk(
  "generateShortenLink",
  async (shortenLinkState, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/submit-shorten-link`,
        shortenLinkState
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// fetch template
const fetchTemplate = createAsyncThunk(
  "fetchTemplate",
  async (data, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    formData.append("name", data);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/parsedTemplate`,
        formData
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchWATemplate = createAsyncThunk(
  "fetchWATemplate",
  async (data, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    formData.append("name", data);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/parsedTemplate`,
        formData
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get name of template
const fetchTemplateNames = createAsyncThunk(
  "fetchTemplateNames",
  async ({ type, hiringType, interviewRounds, inviteType }, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("hiringType", hiringType);
    formData.append("interviewRounds", interviewRounds);
    formData.append("inviteType", inviteType);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/getCandidatesTemplates`,
        formData
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const fetchWATemplateNames = createAsyncThunk(
  "fetchWATemplateNames",
  async ({ type, hiringType, interviewRounds, inviteType }, { rejectWithValue, dispatch }) => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("hiringType", hiringType);
    formData.append("interviewRounds", interviewRounds);
    formData.append("inviteType", inviteType);
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/getCandidatesTemplates`,
        formData
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const interviewLinkInviteDetails = createAsyncThunk(
  "interviewLinkInviteDetails",
  async (details, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(`${baseUrl}/job-posting/interview-link/invite-details`,
        { ...details });
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Send invite
const sendInvite = createAsyncThunk(
  "sendInvite",
  async (details, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/invite-candidate`,
        {
          jobId: details.jobId,
          interviewRoundName: details.roundName,
          inviteId: details.inviteId,
          emailTemplate: details.emailTemplate,
          whatsappTemplate: details.whatsappTemplate,
          candidateInfo: details.candidateInfo,
          interviewExpirationDate: details.interviewExpirationDate,
          mandateFullScreen: details.mandateFullScreen,
          sendLater: details.sendLater,
          mailSendingTime: details.mailSendingTime,
          timezone: details.timezone,
          receivers: details?.receivers?.filter((val) => val.firstName !== ""),
          redirectLink: details.redirectLink,
          templateName: details.templateName || '',
          round1StartDate: details.round1StartDate,
          round1StartTime: details.round1StartTime,
          round2StartDate: details.round2StartDate,
          round2StartTime: details.round2StartTime,
        }
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mapping Index
const mapIndex = createAsyncThunk(
  "mapIndex",
  async ({ formData }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/read/get-data`,
        formData,
        {
          headers: { "Content-type": "multipart/form-data" },
        }
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const revalidateBulkInvite = createAsyncThunk(
  "revalidateBulkInvite",
  async ({ allRows }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/validate/json-data`,
        allRows
      );
      if (data.status) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export {
  generateLink,
  sendInvite,
  mapIndex,
  fetchTemplate,
  fetchWATemplate,
  fetchTemplateNames,
  fetchWATemplateNames,
  generateShortenLink,
  revalidateBulkInvite,
  interviewLinkInviteDetails
};
