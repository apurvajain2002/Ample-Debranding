import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../config/config";
import axiosInstance from "../../../interceptors";
import {
  setFailMessage,
} from "../../slices/create-new-job-slice";
import ErrorToast from "../../../components/toasts/error-toast";

// Create create-job
const saveCandidate = createAsyncThunk(
  "saveCandidate",
  async (
    payload,
    { rejectWithValue, dispatch }
  ) => {

    try {
      const { data } = await axiosInstance.post(`${baseUrl}/common/user/save-user-profile`, payload);
      if (data.success) {
        return data;
      } else {
        dispatch(setFailMessage(data?.message));
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export {
  saveCandidate
};
