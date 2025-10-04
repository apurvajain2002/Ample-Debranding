import { createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../../../config/config";
import axiosInstance from "../../../interceptors";
import {
  dateFormatter,
  dateFormatterForTimeZone,
} from "../../../utils/dateFormatter";

import ErrorToast from "../../../components/toasts/error-toast";


// Create user management
const createUserManagement = createAsyncThunk(
  "createUserManagement",
  async (
    { 
      id,
      firstName,
      lastName,
      primaryEmailId,
      mobileNumber1,
      whatsappNumber,
      roleId
    },
    { rejectWithValue }
  ) => {
    
    
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/user/save-user-role`, {
          id,
        firstName,
        lastName,
        primaryEmailId,
        mobileNumber1,
        whatsappNumber,
        roleId
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
// Create create-job
const getUserManagement = createAsyncThunk(
  "getUserManagement",
  async (
    {
      filterList,
      sortList,
      pagingNo,
      pageSize
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/user/get-filtered`, {
        filterList,
        sortList,
        pagingNo,
        pageSize
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


const getRoleUserManagement = createAsyncThunk(
  "getRoleUserManagement",
  async (
    payload,
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.get(
        `${baseUrl}/common/base/roles/get-all`
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

const deleteUserManagement = createAsyncThunk(
  "deleteUserManagement",
  async (
    payload,
    { rejectWithValue }
  ) => {

    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/user/trash`, { id: payload.id }
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



export {
  getUserManagement, getRoleUserManagement, deleteUserManagement, createUserManagement
};
