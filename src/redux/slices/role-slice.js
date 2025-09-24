import { createSlice } from "@reduxjs/toolkit";
import {
  createRole,
  deleteRole,
  editRole,
  getAllRoles,
  getRoleInfo,
} from "../actions/role-actions/role-actions";

const initialState = {
  tableData: [],
  totalItems: 0,
  searchValue: "",
  deleteRoleId: "",

  isLoading: false,
  successMessage: "",
  failMessage: "",
};

const roleSlice = createSlice({
  name: "roleSlice",
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
    selectDeleteRoleId: (state, action) => {
      state.deleteRoleId = action.payload;
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
      // Get all roles
      .addCase(getAllRoles.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action.payload.list;
        state.totalItems = action.payload.recordsTotal;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Create role
      .addCase(createRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Edit role
      .addCase(editRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(editRole.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // Get role
      .addCase(getRoleInfo.pending, (state) => {})
      .addCase(getRoleInfo.fulfilled, (state, action) => {})
      .addCase(getRoleInfo.rejected, (state, action) => {
        state.failMessage = action.payload;
      });
  },
});

export const {
  selectDeleteRoleId,
  setSearchValue,
  setTableData,
  setTotalItems,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
} = roleSlice.actions;

const roleSliceReducer = roleSlice.reducer;
export default roleSliceReducer;
