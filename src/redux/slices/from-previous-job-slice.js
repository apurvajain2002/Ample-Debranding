
  import { createSlice } from "@reduxjs/toolkit";
import { addQuestionsFromPreviousJob } from "../actions/from-previous-position-actions/from-previous-position-actions";

const initialState = {
  fromJob: "",
  fromRound: "",
  fromQuestions: [],
  selectedQuestions: [],

  tableData: [],
  totalItems: 0,

  isLoading: false,
  successMessage: "",
  failMessage: "",
};

const fromPreviousPositionSlice = createSlice({
  name: "fromPreviousPositionSlice",
  initialState,
  reducers: {
    setFromJob(state, action) {
      state.fromJob = action.payload;
    },
    setFromRound(state, action) {
      state.fromRound = action.payload;
    },
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
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
      .addCase(addQuestionsFromPreviousJob.pending, (state, action) => {})
      .addCase(addQuestionsFromPreviousJob.fulfilled, (state, action) => {})
      .addCase(addQuestionsFromPreviousJob.rejected, (state, action) => {});
  },
});

export const {
  setFromJob,
  setFromRound,
  setTableData,
  setTotalItems,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
} = fromPreviousPositionSlice.actions;

const fromPreviousPositionSliceReducer = fromPreviousPositionSlice.reducer;
export default fromPreviousPositionSliceReducer;
