import { createSlice } from "@reduxjs/toolkit";
import { getAllSummaryScoreRows } from "../actions/summary-scores-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  successMessage: null,
  failMessage: null,
  success: false,
  error: false,
  isLoading: false,
};

const summaryScoresSclice = createSlice({
  name: "summaryScoresSclice",
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
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.failMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder

      //Get all job
      .addCase(getAllSummaryScoreRows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSummaryScoreRows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload?.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllSummaryScoreRows.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload.message;
      });
  },
});

export const {
  setTableData,
  setTotalItems,
  setSearchValue,
  searchValue,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
} = summaryScoresSclice.actions;

const summaryScoresScliceReducer = summaryScoresSclice.reducer;
export default summaryScoresScliceReducer;
