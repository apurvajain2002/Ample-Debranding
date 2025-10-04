import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../interceptors/index";
import { baseUrl } from "../../config/config";
import ErrorToast from "../../../components/toasts/error-toast";

// Create domain-skill
const createDomainSkill = createAsyncThunk(
  "createDomainSkill",
  async ({ domainSkillName, domainSkillDescription }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/domain-skills/save`,
        {
          name: domainSkillName,
          description: domainSkillDescription,
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

// Delete domain-skill
const deleteDomainSkill = createAsyncThunk(
  "deleteDomainSkill",
  async ({ deleteDomainSkillId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/domain-skills/trash`,
        {
          id: deleteDomainSkillId,
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

// Edit domain-skill
const editDomainSkill = createAsyncThunk(
  "editDomainSkill",
  async (
    { domainSkillId, newDomainSkillName, newDomainSkillDescription },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/domain-skills/save`,
        {
          id: domainSkillId,
          name: newDomainSkillName,
          description: newDomainSkillDescription,
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

// Get all domain skills
const getAllDomainSkills = createAsyncThunk(
  "getAllDomainSkills",
  async (
    { currentPage, showRows, filterArray, customSortArray},
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/domain-skills/get-filtered`,
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

// Get domain skill info
const getDomainSkillInfo = createAsyncThunk(
  "getDomainSkillInfo",
  async ({ domainSkillId }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `${baseUrl}/common/base/domain-skills/get`,
        {
          id: domainSkillId,
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
  createDomainSkill,
  deleteDomainSkill,
  editDomainSkill,
  getAllDomainSkills,
  getDomainSkillInfo,
};
