import { createSlice } from "@reduxjs/toolkit";
import { getUserNotifications, getUserInterviews } from "../actions/user-informations";

const initialState = {
  candidateGetInviteTableData: [],
  totalItems: 0,
  searchValue: "",
  interviewList: [],
  isLoading: false,
  successMessage: "",
  failMessage: "",
};

const userInformationSlice = createSlice({
  name: "userInformationSlice",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.candidateGetInviteTableData = action.payload;
      state.interviewList = action.payload;
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
    /* setSuccessMessage: (state, action) => {
      state.getExcelSuccessMessage = action.payload;
    },
    setFailMessage: (state, action) => {
      state.getExcelFailMessage = action.payload;
    },
    setMessagesEmpty: (state, action) => {
      state.successMessage = "";
      state.failMessage = "";
    }, */
  },
  extraReducers: (builder) => {
    builder
      // get candidate for notification
      .addCase(getUserNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.candidateGetInviteTableData = action.payload?.userDetails;
        state.totalItems = action.payload?.userDetails && Array.isArray(action.payload?.userDetails) ? action.payload?.userDetails?.length : 0
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })
      // get candidate for interview
      .addCase(getUserInterviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInterviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewList = action.payload.interviewDetails;
        state.totalItems = action.payload?.interviewDetails && Array.isArray(action.payload?.interviewDetails) ? action.payload?.interviewDetails?.length : 0
      })
      .addCase(getUserInterviews.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })
  },
});

export const {
  setTableData,
  setTotalItems,
  setSearchValue,
  setIsLoading,
} = userInformationSlice.actions;

const userInfoReducer = userInformationSlice.reducer;
export default userInfoReducer;