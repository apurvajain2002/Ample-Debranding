import { createSlice } from "@reduxjs/toolkit";
import { getAllEntities } from "../actions/entity-actions/entity-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  isLoading: false,
  successMessage: "",
  failMessage: "",
  currentEntity : null
};

const entitySlice = createSlice({
  name: "entitySlice",
  initialState,
  reducers: {
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
    setCurrentEntity : (state, action) => {
      state.currentEntity = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all entities
      .addCase(getAllEntities.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllEntities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload?.organizationsList || [];
        // state.totalItems = action.payload?.recordsTotal || action.payload.organizationsList?.length;
      })
      .addCase(getAllEntities.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      });
  },
});

export const {
  setTableData,
  setTotalItems,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setIsLoading,
  setCurrentEntity
} = entitySlice.actions;

const entitySliceReducer = entitySlice.reducer;
export default entitySliceReducer;
