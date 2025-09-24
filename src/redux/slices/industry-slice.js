import { createSlice } from "@reduxjs/toolkit";
import {
  createIndustry,
  deleteIndustry,
  editIndustry,
  getAllIndustries,
  getIndustryInfo,
} from "../actions/industry-actions/industry-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  deleteIndustryId: "",

  isLoading: false,
  successMessage: "",
  failMessage: "",
};

const industrySlice = createSlice({
  name: "industrySlice",
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
    selectDeleteIndustryId: (state, action) => {
      state.deleteIndustryId = action.payload;
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
      // Get all industrys
      .addCase(getAllIndustries.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllIndustries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllIndustries.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete industry
      .addCase(deleteIndustry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Create industry
      .addCase(createIndustry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit industry
      .addCase(editIndustry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editIndustry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editIndustry.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Get industry
      .addCase(getIndustryInfo.pending, (state) => {})
      .addCase(getIndustryInfo.fulfilled, (state, action) => {})
      .addCase(getIndustryInfo.rejected, (state, action) => {
        state.failMessage = action.payload;
      });
  },
});

export const {
  selectDeleteIndustryId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setIsLoading,
} = industrySlice.actions;

const industrySliceReducer = industrySlice.reducer;
export default industrySliceReducer;
