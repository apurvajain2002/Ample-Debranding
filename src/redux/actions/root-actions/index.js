import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";
import ErrorToast from "../../../components/toasts/error-toast";

const getBranding = createAsyncThunk(
  "getBranding",
  async ({hostname}, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.get(`${baseUrl}/common/base/newEntityRegistration/get-entity-logo-color?url=${hostname}`);
      if (data) {
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
  getBranding
};
