import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";

import {
  setCaptcha,
  setEntity,
  setFailMessage,
  setSuccessMessage,
} from "../../slices/sign-up-slice";
import ErrorToast from "../../../components/toasts/error-toast";

// Create create-job
const saveEntity = createAsyncThunk(
  "saveEntity",
  async (entity, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/save`,
        entity
      );

      if (data.success) {
        if (data?.organizationDTO?.id !== null) {
          localStorage.setItem("entityId", data?.organizationDTO?.id);
          localStorage.setItem(
            "organizationDTO",
            JSON.stringify(data?.organizationDTO)
          );
          dispatch(setEntity(data));
        }
        dispatch(setSuccessMessage(data?.message));
        return data;
      } else {
        dispatch(setFailMessage(data?.message));
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);
// Get Captch
const getCaptcha = createAsyncThunk(
  "getCaptcha",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.get(
        `${baseUrl}/common/base/newEntityRegistration/generateCaptcha`
      );

      if (data.success) {
        dispatch(setCaptcha(data));
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

// Get Entity
const getEntity = createAsyncThunk(
  "getEntity",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/newEntityRegistration/get`,
        {
          entityId: "1",
        }
      );

      if (data.success) {
        dispatch(setCaptcha(data));
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

const saveCandidate = createAsyncThunk(
  "saveCandidate",
  async (details, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/user/save`,
        details
      );

      if (data.success || data.list?.length > 0) {
        dispatch(setCaptcha(data));
        dispatch(setSuccessMessage(data.error));
        return data;
      } else {
        dispatch(setFailMessage(data.error));
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.message);
    }
  }
);
export { saveEntity, getCaptcha, saveCandidate, getEntity };
