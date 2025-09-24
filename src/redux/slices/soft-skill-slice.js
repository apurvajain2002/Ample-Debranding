import { createSlice } from "@reduxjs/toolkit";
import {
  createSoftSkill,
  deleteSoftSkill,
  editSoftSkill,
  getAllSoftSkills,
  getSoftSkillInfo,
} from "../actions/soft-skill-actions/soft-skill-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  deleteSoftSkillId: "",

  isLoading: false,
  successMessage: null,
  failMessage: null,
};

const softSkillSlice = createSlice({
  name: "softSkillSlice",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    selectDeleteSoftSkillId: (state, action) => {
      state.deleteSoftSkillId = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.getExcelSuccessMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.getExcelFailMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all softSkills
      .addCase(getAllSoftSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSoftSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllSoftSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete softSkill
      .addCase(deleteSoftSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSoftSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteSoftSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Create softSkill
      .addCase(createSoftSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSoftSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createSoftSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit softSkill
      .addCase(editSoftSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editSoftSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editSoftSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Get softSkill
      .addCase(getSoftSkillInfo.pending, (state) => {})
      .addCase(getSoftSkillInfo.fulfilled, (state, action) => {})
      .addCase(getSoftSkillInfo.rejected, (state, action) => {
        state.failMessage = action.payload;
      });
  },
});

export const {
  selectDeleteSoftSkillId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
} = softSkillSlice.actions;

const softSkillSliceReducer = softSkillSlice.reducer;
export default softSkillSliceReducer;
