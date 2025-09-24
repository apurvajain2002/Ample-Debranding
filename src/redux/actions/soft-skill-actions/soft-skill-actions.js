import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

// Create soft-skill
const createSoftSkill = createAsyncThunk(
  "createSoftSkill",
  async ({ softSkillName, softSkillDescription }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/soft-skills/save`,
        {
          name: softSkillName,
          description: softSkillDescription,
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

// Delete soft-skill
const deleteSoftSkill = createAsyncThunk(
  "deleteSoftSkill",
  async ({ deleteSoftSkillId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/soft-skills/trash`,
        {
          id: deleteSoftSkillId,
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

// Edit soft-skill
const editSoftSkill = createAsyncThunk(
  "editSoftSkill",
  async (
    { softSkillId, newSoftSkillName, newSoftSkillDescription },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/soft-skills/save`,
        {
          id: softSkillId,
          name: newSoftSkillName,
          description: newSoftSkillDescription,
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

// Get all soft skills
const getAllSoftSkills = createAsyncThunk(
  "getAllSoftSkills",
  async (
    { currentPage, showRows, filterArray, customSortArray},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/soft-skills/get-filtered`,
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

// Get soft skill info
const getSoftSkillInfo = createAsyncThunk(
  "getSoftSkillInfo",
  async ({ softSkillId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/soft-skills/get`,
        {
          id: softSkillId,
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
  createSoftSkill,
  deleteSoftSkill,
  editSoftSkill,
  getAllSoftSkills,
  getSoftSkillInfo,
};
