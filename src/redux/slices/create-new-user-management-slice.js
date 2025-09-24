import { createSlice } from "@reduxjs/toolkit";

import { getUserManagement,createUserManagement,getRoleUserManagement,deleteUserManagement } from "../actions/create-user-management-action";

const initialState = {
  tableData: [],
  tableDataPublished: [],
  roleList:[],
  selectedRole: 0,
  totalItems: 0,
  totalItemsPublished: 0,
  searchValue: "",
  successMessage: null,
  failMessage: null,
  success: false,
  error: false,
  isLoading: false,
  isSaveOrUpdateSuccessful:false
 
};

const createNewUserSlice = createSlice({
  name: "createNewUserSlice",
  initialState,
  reducers: {
    setTableData: (state, action) => {
      state.tableData = action.payload;
    },
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
    },
    setTableDataPublished: (state, action) => {
      state.tableDataPublished = action.payload;
    },
    setTotalItemsPublished: (state, action) => {
      state.totalItemsPublished = action.payload;
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
    setIsSaveOrUpdateSuccessful: (state, action) => {
      state.isSaveOrUpdateSuccessful = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // create user
      .addCase(createUserManagement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUserManagement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSaveOrUpdateSuccessful = action?.payload?.success;
      })
      .addCase(createUserManagement.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // create user
      .addCase(getUserManagement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserManagement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tableData = action?.payload?.list;
        state.totalItems =
          action?.payload?.totalItems ??
          action?.payload?.totalElements ??
          action?.payload?.totalCount ??
          0;
        
      })
      .addCase(getUserManagement.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // get roll
      .addCase(getRoleUserManagement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRoleUserManagement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleList = action?.payload?.list
        
      })
      .addCase(getRoleUserManagement.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })

      // delete user
      .addCase(deleteUserManagement.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUserManagement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roleList = action?.payload?.list
        
      })
      .addCase(deleteUserManagement.rejected, (state, action) => {
        state.isLoading = false;
        state.failMessage = action.payload;
      })
  },
});

export const {
  setTableData,
  roleList,
  setTotalItems,
  setSearchValue,
  searchValue,
  setIsLoading,
  setSuccessMessage,
  setFailMessage,
  setMessagesEmpty,
  setTableDataPublished,
  setIsSaveOrUpdateSuccessful
} = createNewUserSlice.actions;

const createUserManagementSliceReducer = createNewUserSlice.reducer;
export default createUserManagementSliceReducer;
