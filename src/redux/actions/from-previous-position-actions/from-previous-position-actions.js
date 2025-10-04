import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

export const addQuestionsFromPreviousJob = createAsyncThunk(
  "addQuestionsFromPreviousJob",
  async ({ jobId, roundName, questionList }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/add-questions-from-previous-position`,
        {
          jobId: jobId,
          roundName: roundName,
          questionList: questionList,
        }
      );

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
