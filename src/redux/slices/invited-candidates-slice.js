import { createSlice } from "@reduxjs/toolkit";
import {
  getAllInvitedCandidates,
  cancelInviteStatus,
  updateInterviewTime,
  sendReminder,
} from "../actions/invited-candidates";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  isLoading: false,
  successMessage: "",
  failMessage: "",
};

const invitedCandidatesSlice = createSlice({
  name: "invitedCandidatesSlice",
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
      // Get invited candidates
      .addCase(getAllInvitedCandidates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllInvitedCandidates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload.list;
        state.totalItems = action.payload.recordsFiltered;
      })
      .addCase(getAllInvitedCandidates.rejected, (state, action) => {
        state.isLoading = false;
        state.tableData = [];
        state.totalItems = 0;
      })

      // set cancel invite
      .addCase(cancelInviteStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelInviteStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(cancelInviteStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
      })

      // update interview time
      .addCase(updateInterviewTime.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInterviewTime.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
      })
      .addCase(updateInterviewTime.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
      })

      .addCase(sendReminder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message;
      })
      .addCase(sendReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload?.message;
      });
  },
});

export const {
  setSearchValue,
  setTableData,
  setTotalItems,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setIsLoading,
} = invitedCandidatesSlice.actions;

const invitedCandidatesSliceReducer = invitedCandidatesSlice.reducer;
export default invitedCandidatesSliceReducer;
