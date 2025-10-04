import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

// Create industry
const createIndustry = createAsyncThunk(
  "createIndustry",
  async ({ industryName, industryDescription }, { rejectWithValue }) => {
    try {
      // Todo: API update
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/industry-type/save`,
        {
          name: industryName,
          description: industryDescription,
        }
      );

      if (data.success) {
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

// Delete industry
const deleteIndustry = createAsyncThunk(
  "deleteRole",
  async ({ deleteIndustryId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/industry-type/trash`,
        {
          id: deleteIndustryId,
        }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Edit industry
const editIndustry = createAsyncThunk(
  "editIndustry",
  async (
    { industryId, newIndustryName, newIndustryDescription },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/industry-type/save`,
        {
          id: industryId,
          name: newIndustryName,
          description: newIndustryDescription,
        }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get all industrys
const getAllIndustries = createAsyncThunk(
  "getAllIndustries",
  async (
    { currentPage, showRows, filterArray, customSortArray},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/industry-type/get-filtered`,
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
        return rejectWithValue(data.message);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

//   Get industry info
const getIndustryInfo = createAsyncThunk(
  "getIndustryInfo",
  async ({ industryId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/industry-type/get`,
        {
          id: industryId,
        }
      );

      if (data.success) {
        return data;
      } else {
        return rejectWithValue(data);
      }
    } catch (error) {
      ErrorToast(error.message)
      return rejectWithValue(error.response.data.message);
    }
  }
);

export {
  createIndustry,
  deleteIndustry,
  editIndustry,
  getAllIndustries,
  getIndustryInfo,
};
