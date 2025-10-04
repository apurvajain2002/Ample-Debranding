import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";
import { baseUrl } from "../../../config/config";

const getUserNotifications = createAsyncThunk(
  "getUserNotifications",
  async ({ userId, requestType }, { rejectWithValue }) => {
    try {
      const url = `${baseUrl}/job-posting/interview-link/get-invite-info?userId=${userId}&requestType=${requestType}`
      const { data } = await axiosInstance.post(url);
      if (data.status) {
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

const getUserInterviews = createAsyncThunk(
  "getUserInterviews",
  async ({userId}, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/candidate-interviews/get`,
        {
          "userId": userId
        }
      );
      if (data.status) {
        console.log(data);
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

export { getUserNotifications, getUserInterviews };
