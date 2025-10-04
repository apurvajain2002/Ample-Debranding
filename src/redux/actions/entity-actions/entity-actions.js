import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";

// Create create-job
const getAllEntities = createAsyncThunk(
  "getAllEntities",
  async ({ url }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/get-entities`, {
          url 
        // userId: userId,
        // userType: userType, //karan changed it brfore 10months
      }
      );

      if (data.success || data.status) {
        return data;
      } else {
        rejectWithValue(data?.message);
      }
    } catch (error) {
      ErrorToast(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export { getAllEntities };
