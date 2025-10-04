import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";

// get all candidates
const getAllInvitedCandidates = createAsyncThunk(
  "getAllInvitedCandidates",
  async (
    { currentPage, showRows, filterArray, customSortArray },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/details`,
        {
          filterList: filterArray || [],
          sortList: customSortArray || [],
          pagingNo: currentPage || 1,
          pageSize: showRows || 0,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// cancel invite
const cancelInviteStatus = createAsyncThunk(
  "cancelInviteStatus",
  async ({ ids = [], status }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/update-invite-cancel-status`,
        {
          ids: ids,
          status: status,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// update interview time
const updateInterviewTime = createAsyncThunk(
  "updateInterviewTime",
  async (
    { inviteId, startValidityTime, endValidityTime },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/update-invite-schedule`,
        {
          inviteId: Array.isArray(inviteId) ? inviteId : [inviteId],
          startValidityTime: startValidityTime,
          endValidityTime: endValidityTime,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// send reminder
const sendReminder = createAsyncThunk(
  "sendReminder",
  async ({ inviteId, inviteStatus = "" }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/interview-link/update-invite-status`,
        {
          inviteId: inviteId,
          inviteStatus: inviteStatus,
        }
      );
      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export {
  getAllInvitedCandidates,
  cancelInviteStatus,
  updateInterviewTime,
  sendReminder,
};
