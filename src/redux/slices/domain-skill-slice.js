import { createSlice } from "@reduxjs/toolkit";
import {
  createDomainSkill,
  deleteDomainSkill,
  editDomainSkill,
  getAllDomainSkills,
  getDomainSkillInfo,
} from "../actions/domain-skill-actions/domain-skill-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  deleteDomainSkillId: "",

  isLoading: false,
  successMessage: null,
  failMessage: null,
};

const domainSkillSlice = createSlice({
  name: "domainSkillSlice",
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
    selectDeleteDomainSkillId: (state, action) => {
      state.deleteDomainSkillId = action.payload;
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
      // Get all domainSkills
      .addCase(getAllDomainSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllDomainSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllDomainSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete domainSkill
      .addCase(deleteDomainSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteDomainSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteDomainSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Create domainSkill
      .addCase(createDomainSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createDomainSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createDomainSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit domainSkill
      .addCase(editDomainSkill.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editDomainSkill.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editDomainSkill.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Get domainSkill
      .addCase(getDomainSkillInfo.pending, (state) => {})
      .addCase(getDomainSkillInfo.fulfilled, (state, action) => {})
      .addCase(getDomainSkillInfo.rejected, (state, action) => {
        state.failMessage = action.payload;
      });
  },
});

export const {
  selectDeleteDomainSkillId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
} = domainSkillSlice.actions;

const domainSkillSliceReducer = domainSkillSlice.reducer;
export default domainSkillSliceReducer;
