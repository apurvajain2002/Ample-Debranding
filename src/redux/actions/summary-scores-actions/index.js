import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../config/config";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";
// import SuccessToast from "../../../components/toasts/success-toast";

// Create create-job
const getAllSummaryScoreRows = createAsyncThunk(
  "getAllSummaryScoreRows",
  async (
    { currentPage, showRows, newFilterArray, customSortArray },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/job-posting/api/candidate-status/get-job-round-users`,
        {
          filterList: newFilterArray || [],
          sortList: customSortArray || [],
          pagingNo: currentPage || 1,
          pageSize: showRows || 10,
        }
      );
      if (data.success) {
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

export { getAllSummaryScoreRows };
